package com.company.wallet.adapters.selfbuild

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.ChainQueryPort
import com.company.wallet.domain.port.FeeBoostCapability
import com.company.wallet.domain.port.TransactionPort
import com.company.wallet.engine.indexer.ProjectionStore
import com.company.wallet.engine.indexer.SelfIndexer
import com.company.wallet.engine.multichain.ChainAdapterRegistry
import com.company.wallet.engine.txpipeline.TxPipeline
import com.company.wallet.shared.address.AddressRules

/**
 * 자체 구축 custody 어댑터 — 세 포트 전부 + fee boost (가이드 15).
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
) : AccountPort, TransactionPort, ChainQueryPort, FeeBoostCapability {
    /** HD account index 할당 — vault SaaS 호출이 없는 로컬 연산 (가이드 15.3). */
    override suspend fun createAccount(ref: AccountRef): Account = hd.allocateAccount(ref)

    /** xpub 파생 — 우리가 직접 (가이드 15.2). */
    override suspend fun deriveAddress(
        account: Account,
        asset: Asset,
    ): Address = hd.addressOf(account, asset)

    /** 계정 → 주소 해석 후 인덱서 projection 조회 (가이드 15.2 getBalance). */
    override suspend fun getBalance(
        account: Account,
        asset: Asset,
    ): Amount = projections.balanceOf(hd.addressOf(account, asset), asset)

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

    override suspend fun cancel(txRef: TxRef): TxRef = TODO("같은 순번 0원 self-send 를 더 높은 수수료로 — 재서명·재전파 경로 (가이드 13.3)")

    /** webhook 이 없으니 자체 인덱서 구독으로 (가이드 15.5). */
    override fun onChainEvent(handler: ChainEventHandler): Subscription = indexer.onChainEvent(handler)

    /** fee boost — 같은 트랜잭션을 수수료만 올려 재전송. 재서명은 파이프라인이 오케스트레이션 (가이드 4.4). */
    override suspend fun boost(txRef: TxRef): TxRef = pipeline.resend(txRef)

    /** 임의·커스텀 조회 — 인덱서 projection 경유 (가이드 15.2 query, 13.4). */
    override suspend fun query(filter: QueryFilter): List<ChainRecord> = projections.query(filter)
}
