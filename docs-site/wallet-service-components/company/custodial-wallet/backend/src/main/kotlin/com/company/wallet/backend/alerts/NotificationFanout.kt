package com.company.wallet.backend.alerts

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.CopyOnWriteArrayList

/**
 * 알림 팬아웃 — 매니저 안의 상태 변화를 외부로 신뢰성 있게 흘려보내는 출구 (가이드 8).
 *
 * 전달 보장은 at-least-once 다 — 재시도를 넣는 한 중복은 불가피하므로,
 * (1) 보내는 쪽은 (note.id × subscriberId) 로 구독자별 dedup 하고
 * (2) 받는 쪽도 [Notification.id] 로 멱등하게 처리한다 (가이드 8.3).
 *
 * 실패는 구독자별로 격리한다 — 한 구독자의 webhook 이 죽어도 뒤 구독자 전달은 계속된다.
 * 실패한 구독자는 전달 기록이 남지 않으므로 다음 fanout(재시도)에서 그 구독자만 다시 받는다.
 */
@Service
class NotificationFanout(
    private val store: DeliveryStore,
) {
    private val log = LoggerFactory.getLogger(NotificationFanout::class.java)
    private val registrations = CopyOnWriteArrayList<Registration>()

    private data class Registration(
        val id: String,
        val subscriber: Subscriber,
    )

    /** 구독 등록 — subscriberId 는 전달 기록의 키 절반이므로 안정적이어야 한다. */
    fun subscribe(
        subscriberId: String,
        subscriber: Subscriber,
    ) {
        registrations += Registration(subscriberId, subscriber)
    }

    /** 한 알림을 모든 구독자에게 — 구독자별 dedup · 구독자별 실패 격리 (가이드 8.3). */
    suspend fun fanout(note: Notification) {
        for ((subscriberId, subscriber) in registrations) {
            // 구독자별 dedup — 이미 받은 구독자만 건너뛴다 (at-least-once 의 중복 흡수)
            if (store.isDelivered(note.id, subscriberId)) {
                continue
            }
            try {
                subscriber.deliver(note)
                // 전달 기록은 구독자별 — 알림 단위가 아니다 (가이드 8.3)
                store.markDelivered(note.id, subscriberId)
            } catch (e: Exception) {
                // 실패 격리 — 이 구독자만 미전달로 남기고(다음 fanout 에서 재시도) 뒤 구독자를 막지 않는다
                log.warn("알림 전달 실패 — 격리 후 계속: note={} subscriber={}", note.id, subscriberId, e)
                // TODO: 실패 기록(markFailed)·backoff 재시도 스케줄 — 영속 저장소 경계
            }
        }
    }
}
