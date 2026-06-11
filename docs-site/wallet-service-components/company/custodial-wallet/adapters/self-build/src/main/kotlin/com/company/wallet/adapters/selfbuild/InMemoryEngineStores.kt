package com.company.wallet.adapters.selfbuild

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.TxRef
import com.company.wallet.engine.indexer.ProjectionStore
import com.company.wallet.engine.indexer.RawEventStore
import com.company.wallet.engine.multichain.SourceEvent
import com.company.wallet.engine.signing.SignatureStore
import com.company.wallet.engine.txpipeline.Submission
import com.company.wallet.engine.txpipeline.SubmissionStatus
import com.company.wallet.engine.txpipeline.SubmissionStore
import java.math.BigInteger
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

// engine 부품들의 개발·테스트용 인메모리 저장소 모음.
// 운영에서는 전부 영속 저장소(DB) 구현으로 교체한다 — 특히 서명·제출 기록은
// 재기동 후에도 살아 있어야 이중 서명·이중 제출을 막는다 (가이드 4 · 5).

/**
 * 제출 기록 (가이드 4.3) — 멱등 dedup 과 stuck 감시의 근거.
 *
 * 추적 단위는 on-chain hash 가 아니라 논리 단위(멱등 키)다 — 재전송(boost)으로 tx 신원이
 * 바뀌어도 같은 멱등 키 한 건으로 upsert 된다 (가이드 4.4).
 */
class InMemorySubmissionStore : SubmissionStore {
    private val byIdempotencyKey = ConcurrentHashMap<String, Submission>()

    override suspend fun findByIdempotencyKey(key: String): Submission? = byIdempotencyKey[key]

    override suspend fun findByTxRef(txRef: TxRef): Submission? =
        byIdempotencyKey.values.firstOrNull { it.txRef == txRef }

    /** 멱등 키 기준 upsert — 재전송이면 같은 건의 txRef·feeStep 이 갱신된다. */
    override suspend fun record(submission: Submission) {
        byIdempotencyKey[submission.idempotencyKey] = submission
    }

    /**
     * STUCK 으로 기록된 제출만 — "전파 후 N 분 경과·미확정" 같은 시간 기반 판정은
     * 영속 구현에서 (가이드 4.3).
     */
    override suspend fun stuckCandidates(): List<Submission> =
        byIdempotencyKey.values.filter { it.status == SubmissionStatus.STUCK }
}

/**
 * 서명 기록 (가이드 5) — "서명했는지 모르는" 상태를 만들지 않기 위한 멱등 가드의 근거.
 * 같은 unsignedTx 에 대한 재시도는 저장된 서명을 재사용하게 한다.
 */
class InMemorySignatureStore : SignatureStore {
    private val signatures = ConcurrentHashMap<String, ByteArray>()
    private val attempts = ConcurrentHashMap.newKeySet<String>()

    override suspend fun findSignature(unsignedTxId: String): ByteArray? = signatures[unsignedTxId]

    override suspend fun hasAttempt(unsignedTxId: String): Boolean = unsignedTxId in attempts

    override suspend fun markAttempt(unsignedTxId: String) {
        attempts += unsignedTxId
    }

    override suspend fun saveSignature(
        unsignedTxId: String,
        signature: ByteArray,
    ) {
        signatures[unsignedTxId] = signature
    }
}

/** 원시 이벤트 보존 — 모든 수신 이벤트는 가공 전에 append-only 로 먼저 (가이드 3.2 ②). */
class InMemoryRawEventStore : RawEventStore {
    private val events = CopyOnWriteArrayList<String>()

    override suspend fun append(raw: String) {
        events += raw
    }
}

/**
 * projection 저장소 (가이드 3) — 수집 이벤트를 잔액·조회용 뷰로 가공한 결과.
 *
 * pending(감지) → confirmed(확정) → (reorg 시) rollback 의 입금 상태 전이를 들고 있는다 (가이드 10.2).
 */
class InMemoryProjectionStore : ProjectionStore {
    private data class Row(
        val txRef: TxRef,
        val address: Address,
        val asset: Asset,
        val amount: Amount,
        val confirmed: Boolean,
        val depth: Int,
    )

    private val rows = ConcurrentHashMap<TxRef, Row>()

    override suspend fun applyPending(event: SourceEvent.TxSeen) {
        rows[event.txRef] =
            Row(
                txRef = event.txRef,
                address = event.address,
                asset = event.asset,
                amount = event.amount,
                confirmed = false,
                depth = 0,
            )
    }

    override suspend fun applyConfirmed(
        txRef: TxRef,
        depth: Int,
    ) {
        rows.computeIfPresent(txRef) { _, row -> row.copy(confirmed = true, depth = depth) }
    }

    /** reorg 롤백 — projection 만 되돌린다. 원시 로그는 [InMemoryRawEventStore] 에 남는다 (가이드 3). */
    override suspend fun rollback(txRef: TxRef) {
        rows.remove(txRef)
    }

    /** confirmed=available · 미확정=pending 으로 구분해 [Balance] 로 (가이드 13.3 · 10.2). */
    override suspend fun balanceOf(
        address: Address,
        asset: Asset,
    ): Balance {
        val matching =
            rows.values.filter {
                it.address.value == address.value && it.asset == asset
            }
        val decimals = matching.firstOrNull()?.amount?.decimals ?: 0
        val (confirmed, pending) = matching.partition { it.confirmed }
        fun sum(list: List<Row>) = list.fold(BigInteger.ZERO) { acc, row -> acc + row.amount.minorUnits }
        return Balance(
            available = Amount(minorUnits = sum(confirmed), decimals = decimals),
            pending = Amount(minorUnits = sum(pending), decimals = decimals),
            // 스켈레톤 단순화 — 2-step locked(송신 OFFER 묶임) 추적은 영속 구현에서 (가이드 11.1)
            locked = Amount.zero(decimals),
        )
    }

    /** 임의 주소 이체 이력 — 도메인 동사의 뒷면 (가이드 13.3). */
    override suspend fun transfersOf(
        address: Address,
        range: BlockRange,
    ): List<Transfer> =
        rows.values
            .filter { it.address.value == address.value }
            // 스켈레톤 단순화 — 블록 높이 미추적이라 range 미적용·blockNumber=0 (영속 구현에서)
            .map { row ->
                Transfer(
                    txRef = row.txRef,
                    asset = row.asset,
                    amount = row.amount,
                    from = null,
                    to = row.address,
                    blockNumber = 0L,
                )
            }

    override suspend fun balanceAt(
        address: Address,
        asset: Asset,
        block: Long,
    ): Amount = TODO("as-of-block 잔액 — 블록 높이 추적이 필요해 영속 구현에서 (가이드 2.6)")

    override suspend fun query(filter: QueryFilter): List<ChainRecord> {
        val addressFilter = filter.address
        val assetFilter = filter.asset
        return rows.values
            .filter { row ->
                row.txRef.chainId == filter.chainId &&
                    (addressFilter == null || row.address.value == addressFilter.value) &&
                    (assetFilter == null || row.asset == assetFilter)
                // fromBlock/toBlock: 스켈레톤은 블록 높이를 추적하지 않아 미적용 — 영속 구현에서 (가이드 2.6)
            }.map { row ->
                ChainRecord(
                    txRef = row.txRef,
                    // 스켈레톤 단순화 — 블록 높이 미추적
                    blockNumber = 0L,
                    payload =
                        mapOf(
                            "address" to row.address.value,
                            "asset" to row.asset.symbol,
                            "amountMinorUnits" to row.amount.minorUnits.toString(),
                            "confirmed" to row.confirmed.toString(),
                            "depth" to row.depth.toString(),
                        ),
                )
            }
    }
}
