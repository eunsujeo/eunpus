package com.company.wallet.engine.indexer

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.TxRef
import com.company.wallet.engine.multichain.SourceEvent

/**
 * 조회용 projection 저장소 (가이드 3.2 ③④) — 잔액·입금 목록·이력.
 *
 * 같은 이벤트를 두 번 처리해도 결과가 같도록 (tx 해시 + logIndex) 멱등 키로 쓰고,
 * 각 레코드에 as-of-block 을 남긴다. reorg 시 [rollback] 으로 되감을 수 있어야 한다 —
 * 원본은 [RawEventStore] 에 있으므로 projection 은 언제든 재구성 가능하다 (가이드 3.3).
 *
 * 읽기 메서드들은 13장 포트의 뒷면이다 — [balanceOf] = AccountPort.getBalance,
 * [transfersOf]·[balanceAt]·[query] = ChainQueryPort (가이드 3.4).
 */
interface ProjectionStore {
    /** 입금 감지(PENDING) 반영 — 자금 사용 불가 상태 (가이드 10.2). */
    suspend fun applyPending(event: SourceEvent.TxSeen)

    /** 확정 기준 충족(CONFIRMED) 반영 — 자금 사용 가능 (가이드 10.2). */
    suspend fun applyConfirmed(
        txRef: TxRef,
        depth: Int,
    )

    /** reorg 무효화 — pending 롤백. 영구 삭제 금지: 무효화된 tx 가 새 블록에 다시 들어올 수 있다 (가이드 3.3). */
    suspend fun rollback(txRef: TxRef)

    /** 잔액 — confirmed=available, 미확정=pending 으로 구분해 [Balance] 로 (가이드 13.3 · 10.2). */
    suspend fun balanceOf(
        address: Address,
        asset: Asset,
    ): Balance

    /** 임의 주소의 이체 이력 — ChainQueryPort.transfersOf 의 뒷면. */
    suspend fun transfersOf(
        address: Address,
        range: BlockRange,
    ): List<Transfer>

    /** as-of-block 시점 잔액 — ChainQueryPort.balanceAt 의 뒷면 (가이드 2.6). */
    suspend fun balanceAt(
        address: Address,
        asset: Asset,
        block: Long,
    ): Amount

    suspend fun query(filter: QueryFilter): List<ChainRecord>
}
