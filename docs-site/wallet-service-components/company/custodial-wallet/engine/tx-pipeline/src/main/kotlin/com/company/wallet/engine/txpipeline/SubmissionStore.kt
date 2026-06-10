package com.company.wallet.engine.txpipeline

import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef

/**
 * 제출 기록 저장소 — 멱등·재전송·stuck 추적의 근거 (가이드 4.3).
 *
 * 추적 단위는 on-chain hash 가 아니라 논리 단위(멱등 키)다 — 재전송(boost)으로 tx 신원이
 * 바뀌어도 old txRef → new txRef 가 한 출금으로 매핑되어야 한다 (가이드 4.4).
 */
interface SubmissionStore {
    /** 멱등 조회 — 같은 키로 이미 제출된 기록이 있으면 재제출하지 않는다. */
    suspend fun findByIdempotencyKey(key: String): Submission?

    suspend fun findByTxRef(txRef: TxRef): Submission?

    /** 제출·재전송·상태 전이 기록 (멱등 키 기준 upsert). */
    suspend fun record(submission: Submission)

    /** 임계 시간 초과 등으로 막혔다고 판정된 제출 목록 — StuckWatcher sweep 대상 (가이드 4.2). */
    suspend fun stuckCandidates(): List<Submission>
}

/**
 * 제출 1건의 추적 레코드. [feeStep] 은 단계적 수수료 인상 횟수 — 상한([StuckWatcher.maxFeeStep])을
 * 두고 올리다가 초과하면 사람에게 알린다 (가이드 4.2 "수수료는 상한을 두고 단계적으로").
 */
data class Submission(
    val idempotencyKey: String,
    val request: TransactionRequest,
    val txRef: TxRef,
    val feeStep: Int,
    val status: SubmissionStatus,
)

/** 제출 상태 — 송신 트랜잭션 lifecycle (가이드 4.2 Figure 4-2). */
enum class SubmissionStatus { SUBMITTED, CONFIRMED, STUCK, CANCELLED, FAILED }
