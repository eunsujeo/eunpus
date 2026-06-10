package com.company.wallet.shared.idempotency

import com.company.wallet.domain.error.DuplicateRequestException
import java.util.concurrent.ConcurrentHashMap

/**
 * 개발·테스트용 인메모리 멱등 저장소 (가이드 6.3).
 *
 * 운영에서는 인스턴스 간 공유·재기동 생존이 필요하므로 영속 저장소(DB/Redis) 구현으로 교체한다 —
 * 인터페이스는 [IdempotencyStore] 그대로.
 */
class InMemoryIdempotencyStore : IdempotencyStore {
    private val records = ConcurrentHashMap<String, IdempotencyRecord>()

    override suspend fun get(key: String): IdempotencyRecord? = records[key]

    override suspend fun markInFlight(key: String) {
        var claimed = false
        records.compute(key) { _, prior ->
            when {
                // 처음 보는 키 — 점유
                prior == null -> {
                    claimed = true
                    IdempotencyRecord.InFlight
                }
                // 일시 오류 실패 — 정당한 재시도, 다시 점유
                prior is IdempotencyRecord.Failed && prior.kind == FailureKind.RETRYABLE -> {
                    claimed = true
                    IdempotencyRecord.InFlight
                }
                // 진행 중·완료·확정 실패 — 점유 불가 (동시 중복 차단)
                else -> prior
            }
        }
        if (!claimed) {
            throw DuplicateRequestException(key)
        }
    }

    override suspend fun recordSuccess(
        key: String,
        result: Any,
    ) {
        records[key] = IdempotencyRecord.Succeeded(result)
    }

    override suspend fun recordFailure(
        key: String,
        kind: FailureKind,
        reason: String,
    ) {
        records[key] = IdempotencyRecord.Failed(kind, reason)
    }
}
