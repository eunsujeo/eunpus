package com.company.wallet.engine.signing

/**
 * 서명 시도·결과 저장소 (가이드 5.4).
 *
 * [markAttempt] 를 실제 서명 호출 **전에** 남기는 것이 핵심 — 서명자 호출 후 결과를 받지 못하고
 * 프로세스가 끊겨도, 다음 시도가 "시도 기록만 있고 서명은 없음"(dangling) 을 알아채고
 * 회수 절차를 먼저 밟게 한다. 유효 서명이 2개 생기면 같은 출금이 이중 전파될 수 있다.
 */
interface SignatureStore {
    /** unsignedTx id 로 저장된 유효 서명 조회 — 있으면 재서명하지 않고 재사용한다. */
    suspend fun findSignature(unsignedTxId: String): ByteArray?

    /** 서명 시도 기록 존재 여부 — true 인데 서명이 없으면 dangling attempt 다. */
    suspend fun hasAttempt(unsignedTxId: String): Boolean

    /** 서명 시도를 먼저 기록 — 이 직후 어디서 중단돼도 다음 시도가 가드 분기로 잡는다. */
    suspend fun markAttempt(unsignedTxId: String)

    /** 검증을 통과한 서명 결과 영속화. */
    suspend fun saveSignature(
        unsignedTxId: String,
        signature: ByteArray,
    )
}
