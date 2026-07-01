package com.company.wallet.apps.webhookreceiver

import com.company.wallet.adapters.fireblocks.FireblocksWebhookMapper
import com.company.wallet.adapters.fireblocks.FireblocksWebhookPayload
import com.company.wallet.backend.service.alerts.Notification
import com.company.wallet.backend.service.alerts.NotificationFanout
import com.company.wallet.domain.model.ChainEvent
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

/**
 * Fireblocks webhook 진입점 (가이드 14.4).
 *
 * webhook 은 비즈니스 레이어 전달용이다 — Fireblocks 가 webhook 을 주더라도, 그것을
 * 비즈 레이어·클라이언트로 팬아웃하는 것은 우리 몫으로 남는다 (가이드 13.7 · 14.6).
 * 입금 상태 push 순서는 뒤바뀔 수 있다 — 받는 쪽은 도착 순서가 아니라 알림에 실린
 * 절대 기준으로 판단한다 (가이드 8.3).
 */
@RestController
@RequestMapping("/webhooks")
class FireblocksWebhookController(
    private val fanout: NotificationFanout,
) {
    private val mapper = FireblocksWebhookMapper()

    /** webhook 수신 — 멱등 수신: dedup 은 팬아웃의 구독자별 전달 기록이 흡수한다 (가이드 8.3). */
    @PostMapping("/fireblocks")
    @ResponseStatus(HttpStatus.OK)
    suspend fun receive(
        @RequestBody payload: FireblocksWebhookPayload,
    ) {
        // TODO: webhook 서명 검증 + 타임스탬프 재생(replay) 방지 — 실패 시 거절 (가이드 8.4)
        val event = mapper.map(payload) ?: return // 관심 없는 이벤트 — 200 으로 ack (재전송 방지)
        fanout.fanout(event.toNotification())
    }

    /**
     * [ChainEvent] → 알림 변환 — id 는 (체인, tx, 상태) 로 만든 안정적 dedup 키.
     * Fireblocks 가 같은 webhook 을 재전송해도 같은 id 가 되어 구독자별 dedup 에 걸린다 (가이드 8.3).
     */
    private fun ChainEvent.toNotification(): Notification {
        val type =
            when (this) {
                is ChainEvent.IncomingDetected -> "deposit.detected"
                is ChainEvent.IncomingConfirmed -> "deposit.confirmed"
                is ChainEvent.Orphaned -> "deposit.orphaned"
                is ChainEvent.OutgoingStatusChanged -> "withdrawal.status-changed"
            }
        return Notification(
            id = "${txRef.chainId.value}:${txRef.value}:$type",
            type = type,
            payload =
                mapOf(
                    "txRef" to txRef.value,
                    "chainId" to txRef.chainId.value,
                    "address" to address.value,
                    "asset" to asset.symbol,
                    "amountMinorUnits" to amount.minorUnits.toString(),
                ),
        )
    }
}
