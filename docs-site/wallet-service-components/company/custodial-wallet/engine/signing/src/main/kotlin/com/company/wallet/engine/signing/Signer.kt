package com.company.wallet.engine.signing

/**
 * 외부 서명자 경계 — 키는 절대 이 프로세스에 없다 (MPC·HSM·co-signer, 가이드 5).
 *
 * 매니저는 서명 대상 payload(sighash)를 넘기고 서명만 돌려받는다. 키 생성·보관은
 * 전적으로 이 인터페이스 뒤의 일이며, 구현이 자체 HSM/MPC 클러스터든 Fireblocks 서명 API 든
 * "매니저 코드가 개인키를 만지지 않는다" 는 원칙은 동일하다 (가이드 5.6).
 */
interface Signer {
    /** 외부 서명자 경계 — 키는 절대 이 프로세스에 없다 (MPC·HSM·co-signer, 가이드 5). */
    suspend fun sign(payload: ByteArray): ByteArray
}
