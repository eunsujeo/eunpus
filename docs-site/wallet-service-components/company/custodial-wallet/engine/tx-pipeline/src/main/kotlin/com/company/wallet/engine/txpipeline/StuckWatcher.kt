package com.company.wallet.engine.txpipeline

import com.company.wallet.engine.multichain.ChainAdapterRegistry

/**
 * 상시 stuck 감시 — 정책(오래된 것부터 · 상한 · 알림)은 공통, 판정·bump 는 어댑터 (가이드 4.3).
 *
 * boost(수수료 올려 재촉)는 EVM/UTXO 전용 capability 다 (가이드 4.4 Figure 4-3):
 * Solana 는 어댑터 내부 auto-retry, Canton 은 fee 문제가 아니라 상대 수락 대기라
 * 자동 재전송 대상이 아니다. 그래서 fee-boostable 체인에만 [TxPipeline.resend] 를 부른다.
 */
class StuckWatcher(
    private val pipeline: TxPipeline,
    private val adapters: ChainAdapterRegistry,
    private val store: SubmissionStore,
    private val maxFeeStep: Int = 3,
) {
    /**
     * 주기 sweep 1회. 막힌 후보를 오래된 것부터 돌며:
     * - ★ `adapter.supportsFeeBump == false` 면 skip — Canton OFFER 자동 재제출 금지 (가이드 4.3).
     *   Solana auto-retry 도 어댑터 내부 소관이라 여기서 건드리지 않는다.
     * - feeStep < [maxFeeStep] 이면 단계적 수수료 인상 재전송.
     * - 상한 도달이면 STUCK 으로 표시해 사람에게 에스컬레이션 (알림 발송은 backend/alerts, 가이드 8).
     */
    suspend fun tick() {
        for (candidate in store.stuckCandidates()) {
            val adapter = adapters.pickAdapter(candidate.txRef.chainId)
            if (!adapter.supportsFeeBump) {
                // boost 불가 체인은 skip — Canton OFFER 자동 재제출 금지 (가이드 4.3 · 4.4)
                continue
            }
            // 한 건의 실패가 sweep 전체를 멈추지 않게 격리한다
            runCatching {
                if (candidate.feeStep < maxFeeStep) {
                    pipeline.resend(candidate.txRef)
                } else {
                    // 상한 도달 → 자동 인상 중단, 사람에게 (가이드 4.2 "그래도 안 되면 알림")
                    store.record(candidate.copy(status = SubmissionStatus.STUCK))
                }
            }
        }
    }
}
