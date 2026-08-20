package com.company.wallet.backend.service.alerts

import org.springframework.stereotype.Component
import java.util.concurrent.ConcurrentHashMap

/**
 * 전달 기록 저장소 — 기록은 반드시 (알림, 구독자) 쌍 단위다 (가이드 8.3).
 *
 * 알림 단위로 기록하면 "구독자 A 는 받았는데 B 는 실패" 를 표현할 수 없어,
 * 재시도 때 A 가 중복 수신하거나 B 가 누락된다.
 */
interface DeliveryStore {
    /** (noteId, subscriberId) 전달 완료 기록. */
    suspend fun markDelivered(
        noteId: String,
        subscriberId: String,
    )

    /** 이 구독자가 이 알림을 이미 받았는가 — 구독자별 dedup 의 근거. */
    suspend fun isDelivered(
        noteId: String,
        subscriberId: String,
    ): Boolean
}

/** 개발·테스트용 인메모리 구현 — 운영은 영속 저장소로 교체 (재기동·다중 인스턴스 생존). */
@Component
class InMemoryDeliveryStore : DeliveryStore {
    private val delivered = ConcurrentHashMap.newKeySet<String>()

    override suspend fun markDelivered(
        noteId: String,
        subscriberId: String,
    ) {
        delivered += key(noteId, subscriberId)
    }

    override suspend fun isDelivered(
        noteId: String,
        subscriberId: String,
    ): Boolean = key(noteId, subscriberId) in delivered

    private fun key(
        noteId: String,
        subscriberId: String,
    ): String = "$noteId::$subscriberId"
}
