package com.company.wallet.backend.service.orchestration

import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.TransactionPort
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

/** 출금 집행 상태 — 전이는 [canTransitionTo] 가 강제한다 (가이드 11). */
enum class WithdrawalState {
    /** 승인 완료된 지시를 접수함 — 아직 체인에 제출 전. */
    RECEIVED,

    /** 포트에 제출 완료 — 확정 대기. */
    SUBMITTED,

    /** 체인 확정 기준 충족 — 종결. */
    CONFIRMED,

    /** 실패 — 종결 (제출 실패 또는 체인 실패). */
    FAILED,

    ;

    /** 허용 전이: RECEIVED → SUBMITTED → CONFIRMED, 어디서든 → FAILED (종결 상태에서는 불가). */
    fun canTransitionTo(next: WithdrawalState): Boolean =
        when (this) {
            RECEIVED -> next == SUBMITTED || next == FAILED
            SUBMITTED -> next == CONFIRMED || next == FAILED
            CONFIRMED, FAILED -> false
        }
}

/** 한 건의 출금 집행 기록 — instructionId 가 요청 ID(correlationId) 축이 된다 (가이드 7.2). */
data class Withdrawal(
    val instructionId: String,
    val request: TransactionRequest,
    val state: WithdrawalState,
    val txRef: TxRef? = null,
    val failureReason: String? = null,
)

/**
 * 출금 오케스트레이터 — 승인 완료된 지시만 받아 집행한다 (가이드 11).
 *
 * ★ 출금 승인(정책·한도·AML)은 이 컴포넌트 범위 밖이다 — 비즈니스 레이어가 승인을 끝낸
 * 지시([TransactionRequest])만 입력으로 들어온다는 전제. 여기서는 상태머신
 * (RECEIVED → SUBMITTED → CONFIRMED / FAILED)으로 집행 과정만 추적한다.
 *
 * 같은 instructionId 의 중복 집행은 기존 기록을 그대로 돌려줘 막는다 — 게이트웨이 멱등(가이드 6)과
 * 별개로 오케스트레이션 층에서도 한 번 더 잠그는 것.
 */
@Service
class WithdrawalOrchestrator(
    private val transactions: TransactionPort,
) {
    private val withdrawals = ConcurrentHashMap<String, Withdrawal>()

    /** 승인 완료된 지시 집행 — 접수(RECEIVED) 후 제출(SUBMITTED)까지. */
    suspend fun execute(
        instructionId: String,
        request: TransactionRequest,
    ): Withdrawal {
        val received = Withdrawal(instructionId = instructionId, request = request, state = WithdrawalState.RECEIVED)
        val existing = withdrawals.putIfAbsent(instructionId, received)
        if (existing != null) {
            return existing // 같은 지시의 중복 집행 — 기존 기록 반환 (멱등)
        }
        return try {
            val txRef = transactions.submitTransaction(request)
            transition(instructionId, WithdrawalState.SUBMITTED) { it.copy(txRef = txRef) }
        } catch (e: Exception) {
            transition(instructionId, WithdrawalState.FAILED) {
                it.copy(failureReason = e.message ?: e.javaClass.simpleName)
            }
            throw e
        }
    }

    /**
     * 체인 상태 변화 반영 — 인덱서/webhook 의 [TxStatus] push 를 상태머신 전이로 옮긴다 (가이드 11).
     * 종결 상태가 아닌 변화(Pending 등)는 전이 없이 무시한다.
     */
    fun onStatusChanged(
        instructionId: String,
        status: TxStatus,
    ): Withdrawal? =
        when (status) {
            is TxStatus.Confirmed -> transition(instructionId, WithdrawalState.CONFIRMED) { it }
            is TxStatus.Failed ->
                transition(
                    instructionId,
                    WithdrawalState.FAILED,
                ) { it.copy(failureReason = status.reason) }
            TxStatus.Cancelled ->
                transition(
                    instructionId,
                    WithdrawalState.FAILED,
                ) { it.copy(failureReason = "cancelled") }
            else -> withdrawals[instructionId] // Pending/Stuck — 종결 전이는 아니다
        }

    fun findByInstructionId(instructionId: String): Withdrawal? = withdrawals[instructionId]

    /** 전이 가드 — 허용되지 않은 전이는 예외로 막는다 (이중 종결·역행 방지). */
    private fun transition(
        instructionId: String,
        next: WithdrawalState,
        mutate: (Withdrawal) -> Withdrawal,
    ): Withdrawal =
        withdrawals.compute(instructionId) { _, current ->
            checkNotNull(current) { "알 수 없는 출금 지시: $instructionId" }
            check(current.state.canTransitionTo(next)) {
                "허용되지 않은 상태 전이: ${current.state} → $next (instructionId=$instructionId)"
            }
            mutate(current).copy(state = next)
        }!!
}
