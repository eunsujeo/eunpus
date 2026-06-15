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
     * 계정(vault) 생성 — HD account index 할당, 순수 로컬 장부 연산 (가이드 15.3). **체인 무관**:
     * 어떤 체인을 쓸지 아직 모르므로 온체인 호출이 없다 — 이더리움 주소도 Canton PartyId 도 여기서 안 만든다.
     * createAccount(ref) 에 asset 이 없는 것이 그 증거다. 체인 위 신원은 asset 을 처음 아는
     * issueDepositAddress 에서 태어난다 — Canton PartyId 는 거기서 선발급한다 (가이드 9.2 · 15-2c).
     */
    override suspend fun createAccount(ref: AccountRef): Account = hd.allocateAccount(ref)

    /** 조회 — 발급(등록)된 주소만 반환, 절대 새 주소를 만들지 않는다 (가이드 9.1 불변식 · 15.2). */
    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address = hd.issuedAddressOf(account, asset)

    /**
     * 발급 capability — 첫 식별자부터 이 동사 (가이드 9.3 · 9.4). 체인에 따라 "새로워지는 것"이 다르다:
     * EVM·UTXO·Solana 는 다음 index 파생으로 **주소**가, Canton 은 고정 PartyId 위에 **memo** 가 새로워진다.
     * Canton 의 PartyId 자체는 이 계정의 첫 Canton 발급 때 여기서 **선발급**한다(온장 등록·1회·유료) —
     * createAccount 가 아니다(asset 을 처음 아는 자리, 가이드 9.2 · 15-2c).
     * 어느 경로든 디렉터리 저장 + 인덱서 등록(watch-list / Canton 은 memo 귀속표)까지가 발급이다 — 등록 실패 = 발급 실패.
     */
    override suspend fun issueDepositAddress(
        account: Account,
        asset: Asset,
    ): Address = TODO(
        "체인 분기 — Canton(OnLedgerAccountRegistrationCapability): PartyId 없으면 선발급(registerAccount, 선기록·재시도는 조회 먼저) + 새 memo 채번; " +
            "그 외: hd.deriveNextAddress. 공통 후처리: 계정 디렉터리 저장 + watch-list/memo 귀속표 등록 (가이드 9.4)",
    )

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
