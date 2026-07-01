package com.company.wallet.backend.service.alerts

/**
 * 외부로 push 되는 알림 한 건 (가이드 8).
 *
 * [id] 는 안정적인 dedup 키다 — at-least-once 전달에서 중복은 불가피하므로, 보내는 쪽은
 * 이 ID 로 구독자별 dedup 하고 받는 쪽도 이 ID 로 멱등하게 처리한다 (가이드 8.3).
 * 같은 사실(같은 tx 의 같은 상태)은 언제 다시 만들어져도 같은 ID 가 되도록 만든다.
 */
data class Notification(
    val id: String,
    /** 이벤트 유형 — 예: deposit.detected · deposit.confirmed · reconciliation.mismatch. */
    val type: String,
    /** 요청 ID — 종단 추적 축 (가이드 7.2). 입금처럼 요청이 없는 이벤트는 null. */
    val correlationId: String? = null,
    val payload: Map<String, String> = emptyMap(),
)
