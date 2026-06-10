package com.company.wallet.shared.idempotency

/**
 * 실패의 종류 — 같은 멱등 키의 재시도를 허용할지 결정한다 (가이드 6.4 "실패도 기록").
 *
 * 타임아웃 같은 일시 오류는 재시도해야 정상이고, 검증 실패 같은 확정 실패는 재시도해도
 * 같은 결과이므로 같은 키의 재실행을 차단한다.
 */
enum class FailureKind {
    /** 일시 오류 (타임아웃·일시적 벤더 장애) — 같은 키의 정당한 재시도를 허용한다. */
    RETRYABLE,

    /** 확정 실패 (검증 실패·미지원 동작) — 재시도해도 같은 결과, 같은 키의 재실행을 차단한다. */
    PERMANENT,
}

/** 멱등 키별 처리 상태 — "진행 중 / 완료(결과) / 실패(종류)" (가이드 6.3). */
sealed interface IdempotencyRecord {
    /** 진행 중 — 같은 키의 동시 중복은 새로 실행하지 않는다 (single-flight). */
    data object InFlight : IdempotencyRecord

    /** 완료 — 같은 키가 다시 오면 저장된 결과를 그대로 반환한다. */
    data class Succeeded(
        val result: Any,
    ) : IdempotencyRecord

    /** 실패 — [kind] 에 따라 재시도 허용([FailureKind.RETRYABLE]) / 재실행 차단([FailureKind.PERMANENT]). */
    data class Failed(
        val kind: FailureKind,
        val reason: String,
    ) : IdempotencyRecord
}

/**
 * 멱등 저장소 — 게이트웨이가 "되돌릴 수 없는 작업이 정확히 한 번만 실행되게" 만드는 핵심 부품 (가이드 6.3).
 *
 * 요청 키별로 진행 중 / 완료(결과) / 실패(종류) 를 기록해 중복·동시 요청을 한 번으로 모은다.
 * 여기 기록된 멱등 키는 게이트웨이에서 끝나지 않고 어댑터의 dedup 키
 * (예: Fireblocks `externalTxId`)까지 끝까지 따라간다 (가이드 6.3).
 */
interface IdempotencyStore {
    /** 키의 현재 상태 조회 — 없으면 null (처음 보는 요청). */
    suspend fun get(key: String): IdempotencyRecord?

    /**
     * 진행 중 표시 (원자적 점유) — null 또는 [FailureKind.RETRYABLE] 실패 상태에서만 점유할 수 있다.
     * 이미 진행 중이거나 완료/확정 실패라면 [com.company.wallet.domain.error.DuplicateRequestException].
     */
    suspend fun markInFlight(key: String)

    /** 성공 결과 기록 — 이후 같은 키는 이 결과를 그대로 돌려받는다. */
    suspend fun recordSuccess(
        key: String,
        result: Any,
    )

    /** 실패 기록 — [kind] 로 재시도 가능(일시 오류) / 불가(영구 실패) 를 구분한다. */
    suspend fun recordFailure(
        key: String,
        kind: FailureKind,
        reason: String,
    )
}
