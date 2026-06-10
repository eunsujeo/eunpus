package com.company.wallet.engine.indexer

/**
 * 원시 로그 저장소 (가이드 3.2 ②) — 받은 그대로의 원본을 가공 **전에** 쌓는다.
 *
 * 절대 덮어쓰거나 지우지 않는다. 이게 있어야 가공 로직이 바뀌거나 reorg 가 나도
 * projection 을 다시 만들 수 있다 — projection 은 재구성 가능한 캐시로 취급한다 (가이드 3.6).
 */
interface RawEventStore {
    /** append-only — 원본 그대로, 수정·삭제 없음 (가이드 3.2). */
    suspend fun append(raw: String)
}
