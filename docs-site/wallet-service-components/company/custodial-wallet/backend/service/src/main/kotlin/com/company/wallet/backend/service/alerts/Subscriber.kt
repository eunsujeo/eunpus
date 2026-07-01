package com.company.wallet.backend.service.alerts

/**
 * 알림 구독자 — 비즈니스 레이어·클라이언트로의 출구 (가이드 8.2).
 *
 * 실제 전달(webhook POST·스트림 publish)은 구현이 진다. 전달 실패는 예외로 던지면
 * [NotificationFanout] 이 구독자별로 격리한다 — 한 구독자의 실패가 다른 구독자를 막지 않는다.
 */
fun interface Subscriber {
    suspend fun deliver(note: Notification)
}
