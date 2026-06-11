package com.company.wallet.adapters.selfbuild

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.CancelCapability
import com.company.wallet.domain.port.DepositAddressIssuanceCapability
import com.company.wallet.domain.port.FeeBoostCapability
import com.company.wallet.domain.port.TransactionPort
import com.company.wallet.engine.indexer.ProjectionStore
import com.company.wallet.engine.indexer.SelfIndexer
import com.company.wallet.engine.multichain.ChainAdapterRegistry
import com.company.wallet.engine.txpipeline.TxPipeline
import com.company.wallet.shared.address.AddressRules

/**
 * 자체 구축 custody 어댑터 — custody 두 포트(Account·Transaction) + capabilities (가이드 15).
 * ChainQueryPort 는 여기 없다 — custody 와 별개 슬롯로, [IndexerQueryAdapter] 가 채운다 (가이드 15.2 · 13.4).
 *
 * 코어가 보는 시그니처는 Fireblocks 어댑터와 글자 그대로 같다 — 달라진 것은 구현 안뿐이다.
 * Fireblocks 가 `createTransaction` 한 번에 묶어주던 것이 여기서는 engine 부품으로 펼쳐진다:
 * 조립(순번 점유)·서명·전파는 [TxPipeline], 수신 감지·확정은 [SelfIndexer](상시 worker),
 * 잔액·임의 조회는 [ProjectionStore] (가이드 15.1 · 15.2).
 *
 * 인덱서만 성격이 다르다 — 요청 경로가 아니라 체인이 흐르는 한 계속 도는 상시 job 이고,
 * 그 가동은 apps/indexer-worker 가 진다 (가이드 15.6).
 */
class SelfBuildAdapter(
    private val hd: HdWallet,
    private val pipeline: TxPipeline,
    private val indexer: SelfIndexer,
    private val projections: ProjectionStore,
    private val adapters: ChainAdapterRegistry,
) : AccountPort, TransactionPort, FeeBoostCapability, CancelCapability, DepositAddressIssuanceCapability {
    /**
     * HD account index 할당 — 로컬 연산 (가이드 15.3). 단 Canton 자산 온보딩이면
     * 온장 등록(party allocation)까지가 계정 생성이다 — 주소(PartyId)가 계정과 함께 태어나는 체인 (가이드 15-2c).
     */
    override suspend fun createAccount(ref: AccountRef): Account {
        val account = hd.allocateAccount(ref)
        // TODO: 온보딩 요청의 체인에 대해 adapters.pickAdapter(chain) 이
        //   OnLedgerAccountRegistrationCapability 면 registerAccount(account, pubkey) 호출 (가이드 15.2)
        //   — AccountRef 에 온보딩 체인 정보가 실리면 활성화 (가이드 9.1 의 asset)
        return account
    }

    /** 조회 — 발급(등록)된 주소만 반환, 절대 새 주소를 만들지 않는다 (가이드 9.1 불변식 · 15.2). */
    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address = hd.issuedAddressOf(account, asset)

    /** 발급 capability — 다음 index 파생 + 디렉터리·인덱서 watch-list 등록까지가 발급 (가이드 9.3 · 9.4). */
    override suspend fun issueDepositAddress(
        account: Account,
        asset: Asset,
    ): Address = TODO("첫 주소부터 이 동사 — hd.deriveNextAddress + 계정 디렉터리 저장 + watch-list 등록(등록 실패 = 발급 실패, 가이드 9.4) — Canton 은 미지원(memo-ref)")

    /**
     * 계정 → 주소 해석 후 인덱서 projection 조회 (가이드 15.2 getBalance) —
     * projection 이 confirmed/pending 을 구분해 [Balance] 로 준다 (가이드 13.3).
     */
    override suspend fun getBalance(
        account: Account,
        asset: Asset,
    ): Balance = projections.balanceOf(addressOf(account, asset), asset)

    /** 체인별 주소 형식·체크섬 검증 — 벤더 API 없는 로컬 연산 (가이드 13.3 · 15.2). */
    override suspend fun validateAddress(
        asset: Asset,
        address: Address,
    ): Boolean = AddressRules.validate(asset, address)

    /**
     * 점유 없는 추정 — 체인 어댑터의 추정 전용 경로에 위임한다.
     * [com.company.wallet.engine.multichain.ChainAdapter.estimateFee] 는 buildTransaction 과 달리
     * nonce/UTXO 를 점유하지 않으므로 견적마다 순번이 소모되지 않는다 (가이드 4.2 · 13.3).
     */
    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate =
        adapters.pickAdapter(request.asset.chainId).estimateFee(request)

    /**
     * 쓰기 파이프라인 위임 — 멱등 확인 → 조립(순번 점유) → 서명 → 전파 → 기록 순서는
     * [TxPipeline] 이 보장한다 (가이드 4 · 11).
     */
    override suspend fun submitTransaction(request: TransactionRequest): TxRef = pipeline.submit(request)

    /** 확정 판정은 체인별 어댑터에 위임 — N 블록·commitment·2-step 차이를 어댑터가 흡수 (가이드 2.4). */
    override suspend fun getStatus(txRef: TxRef): TxStatus =
        adapters.pickAdapter(txRef.chainId).confirmations(txRef).status

    /** 내 거래 이력 — 수신은 인덱서 projection, 송신은 intent 저장소가 합쳐 진실원천 (가이드 15.2 · 4.3). */
    override suspend fun transactionsOf(
        account: Account,
        range: BlockRange,
    ): List<Transfer> = TODO("hd 발급 장부의 주소들에 대한 projection 이력 + intent 저장소(송신) 병합 (가이드 15.2)")

    /** 취소(CancelCapability) — EVM 은 0원 self-send 덮어쓰기, Canton 은 OFFER withdraw (가이드 13.3). */
    override suspend fun cancel(txRef: TxRef): TxRef = TODO("같은 순번 0원 self-send 를 더 높은 수수료로 — 재서명·재전파 경로 (가이드 13.3)")

    /** webhook 이 없으니 자체 인덱서 구독으로 (가이드 15.5). */
    override fun onChainEvent(handler: ChainEventHandler): Subscription = indexer.onChainEvent(handler)

    /** fee boost — 같은 트랜잭션을 수수료만 올려 재전송. 재서명은 파이프라인이 오케스트레이션 (가이드 4.4). */
    override suspend fun boost(txRef: TxRef): TxRef = pipeline.resend(txRef)

}
