package com.company.wallet.adapters.fireblocks

import com.company.wallet.domain.model.TxStatus

/** Fireblocks 종결 상태 — 이 이후로는 상태가 바뀌지 않는다. */
private val TERMINAL_STATUSES = setOf("COMPLETED", "CANCELLED", "FAILED", "REJECTED", "BLOCKED")

/**
 * Fireblocks 상태 문자열 → 정규화 [TxStatus] (가이드 2.3 — 메커니즘은 숨겨도 lifecycle 은 표면화).
 *
 * Canton 2-step 은 Fireblocks 가 전용 `transactionType` 필드로 노출한다 (가이드 14.8) —
 * OFFER 가 아직 종결 전이면 "상대 수락 대기"([TxStatus.AwaitingCounterparty])로 매핑한다.
 */
internal fun fireblocksStatusToTxStatus(
    status: String,
    numOfConfirmations: Int,
    cantonTransactionType: String? = null,
    traceableId: String? = null,
): TxStatus {
    // Canton OFFER 제출 후 미종결 — 상대 ACCEPT 대기 (가이드 14.8: transactionType=OFFER 를 "수락 대기" 로)
    if (cantonTransactionType == "OFFER" && status !in TERMINAL_STATUSES) {
        return TxStatus.AwaitingCounterparty(traceableId = traceableId ?: "")
    }
    return when (status) {
        "SUBMITTED", "QUEUED", "PENDING_SIGNATURE", "PENDING_AUTHORIZATION", "BROADCASTING", "CONFIRMING" ->
            TxStatus.Pending(confirmations = numOfConfirmations)
        "COMPLETED" -> TxStatus.Confirmed(confirmations = numOfConfirmations)
        "CANCELLED" -> TxStatus.Cancelled
        "FAILED", "REJECTED", "BLOCKED" -> TxStatus.Failed(reason = "fireblocks status: $status")
        // 알 수 없는 상태 — 보수적으로 미확정 취급 (확정으로 올리지 않는다)
        else -> TxStatus.Pending(confirmations = numOfConfirmations)
    }
}
