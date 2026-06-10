package com.company.wallet.engine.signing

import com.company.wallet.engine.multichain.SignedTx
import com.company.wallet.engine.multichain.UnsignedTx

/**
 * 서명 오케스트레이터 — 준비 → 서명 → 기록의 체인 무관 오케스트레이션 (가이드 5.4).
 *
 * "무엇을 서명할지"(직렬화·sighash·알고리즘·인코딩)는 체인별이라 멀티체인 어댑터(가이드 2)가
 * [UnsignedTx.signingPayload] 로 만들어 오고, 여기는 그 payload 를 외부 [Signer] 에 넘기는
 * 경계만 쥔다 — 키는 [Signer] 뒤를 떠나지 않는다.
 *
 * 멱등 가드 (가이드 5.4) — 이 가드가 막는 것은 키 유출이 아니라 **이중 전파**다.
 * 유효 서명이 2개 생기면 같은 출금이 두 번 나갈 수 있으므로:
 * 1. 기존 서명이 있으면 재서명하지 않고 재사용
 * 2. 시도 기록만 있으면(dangling) 서명자 쪽 유효 서명을 먼저 회수
 * 3. [SignatureStore.markAttempt] 를 **먼저** 기록한 뒤에만 서명자 호출
 *
 * 단 서명 "재시도" 자체는 비멱등이다 (가이드 5.3) — 회수에 실패해 다시 서명할 때는
 * 같은 라운드 재개가 아니라 새 서명 라운드(새 난수)여야 한다. [Signer.sign] 재호출은
 * 항상 새 라운드이므로 이 오케스트레이터가 그 규칙을 자연히 지킨다.
 */
class SigningOrchestrator(
    private val signer: Signer,
    private val store: SignatureStore,
) {
    /**
     * 가드 순서: 기존 서명 있으면 재사용 → dangling attempt 있으면 회수([recoverDangling]) →
     * [SignatureStore.markAttempt] 먼저 기록 → [Signer.sign] → [SignatureStore.saveSignature].
     */
    suspend fun sign(unsignedTx: UnsignedTx): SignedTx {
        // 1) 중복 서명 가드 — 기존 서명이 있으면 재서명하지 않고 재사용 (유효 서명 2개 → 이중 전파 방지)
        store.findSignature(unsignedTx.id)?.let { existing ->
            return SignedTx(unsignedTx, existing)
        }

        // 2) 시도 기록만 있음 = 직전 시도가 결과를 못 받고 끊김 → 서명자 쪽 유효 서명을 먼저 회수
        if (store.hasAttempt(unsignedTx.id)) {
            val recovered = recoverDangling(unsignedTx.id)
            if (recovered != null) {
                store.saveSignature(unsignedTx.id, recovered)
                return SignedTx(unsignedTx, recovered)
            }
            // 회수된 서명 없음 → 새 서명 라운드(새 난수)로 진행 (가이드 5.3 — 같은 라운드 재개 금지)
        }

        // 3) 시도를 먼저 기록 — 여기서 중단돼도 다음 호출이 위 dangling 분기로 잡는다
        store.markAttempt(unsignedTx.id)

        // 4) 실제 서명 — 외부 서명자 (키는 그 뒤). 검증(기대 pubkey·sighash 일치)은 체인별 규칙이라
        //    어댑터 verify 영역 — 스켈레톤에서는 생략 (가이드 5.4 ④)
        val signature = signer.sign(unsignedTx.signingPayload)

        store.saveSignature(unsignedTx.id, signature)
        return SignedTx(unsignedTx, signature)
    }

    /**
     * dangling attempt 회수 — 서명자 측에 이미 완료된 유효 서명이 있는지 조회한다 (가이드 5.4 ②).
     * 외부 서명자(MPC/HSM) 조회 I/O 경계 — 회수할 서명이 없으면 null.
     */
    private suspend fun recoverDangling(unsignedTxId: String): ByteArray? =
        TODO("외부 서명자 측 완료 서명 조회 — dangling attempt($unsignedTxId) 의 유효 서명 회수 (가이드 5.4)")
}
