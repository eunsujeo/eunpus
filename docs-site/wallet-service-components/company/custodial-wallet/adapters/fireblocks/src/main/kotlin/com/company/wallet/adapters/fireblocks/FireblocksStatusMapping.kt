package com.company.wallet.adapters.fireblocks

import com.company.wallet.domain.model.TxStatus

/**
 * Fireblocks 상태 문자열 → 정규화 [TxStatus] (가이드 2.3 — 메커니즘은 숨겨도 lifecycle 은 표면화).
 *
 * EVM(이더리움·Base)만 태우므로 전파→확정 단선형이다.
 */
internal fun fireblocksStatusToTxStatus(
    status: String,
    numOfConfirmations: Int,
): TxStatus =
    when (status) {
        "SUBMITTED", "QUEUED", "PENDING_SIGNATURE", "PENDING_AUTHORIZATION", "BROADCASTING", "CONFIRMING" ->
            TxStatus.Pending(confirmations = numOfConfirmations)
        "COMPLETED" -> TxStatus.Confirmed(confirmations = numOfConfirmations)
        "CANCELLED" -> TxStatus.Cancelled
        "FAILED", "REJECTED", "BLOCKED" -> TxStatus.Failed(reason = "fireblocks status: $status")
        // 알 수 없는 상태 — 보수적으로 미확정 취급 (확정으로 올리지 않는다)
        else -> TxStatus.Pending(confirmations = numOfConfirmations)
    }
