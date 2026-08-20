package com.company.wallet.backend.service.reconciliation

import com.company.wallet.backend.service.alerts.Notification
import com.company.wallet.backend.service.alerts.NotificationFanout
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

/**
 * 온체인 정합성 대조 (가이드 7).
 *
 * 이 컴포넌트는 체인 측 진실만 책임진다 — 대조(reconcile)만 하고, 회계 기표·잔액 대사는 안 한다.
 * 오프체인 지급 기록(은행·PG 결과)은 대조를 위한 입력으로 받기만 하며, 차이가 났을 때의
 * 회계적 판단·기표는 회계/원장 평면 몫이다 (가이드 7.2 · 7.3).
 *
 * 같은 [reconcile] 을 세 시점이 부른다 (가이드 7.5) —
 * ① 인덱서 confirm 이벤트(건별) ② 주기 [sweep](완전성 안전망) ③ 온디맨드(회계 마감·예외 조사).
 * 쓰기(출금 집행) 경로 밖에서 사후·배경으로 돈다 — 출금을 막지 않는다.
 */
@Service
class ReconciliationService(
    private val fanout: NotificationFanout,
) {
    /**
     * 한 correlationId 의 기록 대조 — MATCHED / MISMATCH / NEEDS_REVIEW (가이드 7.4).
     *
     * 같은 결과를 두 번 처리해도 상태가 두 번 바뀌지 않는다 (멱등 — 순수 분류 + dedup 되는 알림).
     */
    suspend fun reconcile(record: ReconRecord): ReconResult {
        // 온체인 미반영(아직 안 옴)이면 정규화·대조 자체가 불가 — 먼저 분기 (가이드 7.4).
        // 지연·미반영은 주기 sweep 이 다시 잡는다 (가이드 7.5 ②).
        val onchain = record.onchain ?: return ReconResult.NEEDS_REVIEW

        // 승인된 지시 기록이 없으면 비교 기준이 없다 — 운영 기록 누락 유형의 확인 필요
        val expected = record.expected ?: return ReconResult.NEEDS_REVIEW

        // 아직 확정 전 — 확정 깊이가 모자란 사실은 단정하지 않는다 (as-of-block 인식, 가이드 7.6)
        if (!onchain.confirmed) {
            return ReconResult.NEEDS_REVIEW
        }

        // 대조 — 지시와 온체인 결과가 한 사실로 모이나 (값은 이미 정규형이라는 전제, 가이드 7.4)
        val amountMatch = expected.amount == onchain.amount
        val addressMatch = expected.to.value == onchain.to.value && expected.to.memoTag == onchain.to.memoTag

        if (!amountMatch || !addressMatch) {
            // 불일치는 자동 진행하지 않고 멈춰서 사람에게 (가이드 7.4 — 예외 목록 + 알림)
            fanout.fanout(record.toMismatchNotification(amountMatch, addressMatch))
            return ReconResult.MISMATCH
        }

        // TODO: 검증된 체인 사실(correlationId·금액·확정 수준·tx 해시)을 회계 평면에 제공 —
        //  기표·대사는 그 평면이 한다 (가이드 7.3, 범위 밖 포트)
        return ReconResult.MATCHED
    }

    /**
     * 주기 sweep — 완전성 안전망 (가이드 7.5 ②).
     *
     * 이벤트 기반은 "일어난 것" 만 본다. "와야 하는데 안 온 것"(stuck·미반영·지급 지연)은
     * 이벤트가 없어서 sweep 으로만 드러난다.
     */
    @Scheduled(fixedDelayString = "\${reconciliation.sweep-delay-ms:60000}")
    fun sweep() {
        // TODO: 열린·최근 correlationId 를 영속 저장소에서 훑어 reconcile() 호출 — 저장소 경계 스텁
    }

    private fun ReconRecord.toMismatchNotification(
        amountMatch: Boolean,
        addressMatch: Boolean,
    ): Notification =
        Notification(
            // correlationId 기반 안정 ID — 같은 불일치의 중복 알림은 구독자별 dedup 으로 걸러진다 (가이드 8.3)
            id = "recon-mismatch:$correlationId",
            type = "reconciliation.mismatch",
            correlationId = correlationId,
            payload =
                mapOf(
                    "amountMatch" to amountMatch.toString(),
                    "addressMatch" to addressMatch.toString(),
                    "txRef" to (onchain?.txRef?.id ?: ""),
                ),
        )
}
