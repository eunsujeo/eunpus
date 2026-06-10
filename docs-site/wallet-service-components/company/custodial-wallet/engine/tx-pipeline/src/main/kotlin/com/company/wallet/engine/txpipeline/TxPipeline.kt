package com.company.wallet.engine.txpipeline

import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.engine.multichain.ChainAdapterRegistry
import com.company.wallet.engine.signing.SigningOrchestrator

/**
 * 공통 쓰기 오케스트레이터 — 체인 무관 (가이드 4.3).
 *
 * 순서 불변식 (가이드 4.2 Figure 4-1): 멱등 확인 → 조립(순번 점유) → 서명 → 전파 → 기록.
 * 각 단계는 직전 단계의 확정을 전제로만 진행한다 — 승인 전 전파, 서명 전 장부 차감은 모두 사고다.
 *
 * 순번/직렬화 "메커니즘"(nonce·coin lock·blockhash·없음)은 체인별이라 어댑터의
 * buildTransaction 안에 산다 — 그래서 이 파이프라인엔 NonceManager 가 없다 (가이드 4.3).
 * 여기 있는 것은 체인 무관 "정책" — 멱등·순서·재전송이다.
 */
class TxPipeline(
    private val adapters: ChainAdapterRegistry,
    private val signing: SigningOrchestrator,
    private val store: SubmissionStore,
) {
    /**
     * 승인된 출금 지시 제출. 멱등: 같은 키 재제출이면 빌드·서명·전파 없이 기존 txRef 반환 (가이드 4.3).
     */
    suspend fun submit(request: TransactionRequest): TxRef {
        // ① 멱등 — 같은 요청 재제출 방지 (멱등 키는 게이트웨이에서 내려온다, 가이드 4.3)
        store.findByIdempotencyKey(request.idempotencyKey)?.let { seen ->
            return seen.txRef
        }

        val adapter = adapters.pickAdapter(request.asset.chainId)
        // ② 조립 — 체인별 직렬화(순번 점유·coin 선택·blockhash·OFFER)를 어댑터가 흡수
        val unsignedTx = adapter.buildTransaction(request)
        // ③ 서명 — 외부 서명자 경계 (가이드 5)
        val signedTx = signing.sign(unsignedTx)
        // ④ 전파 — 체인별 (Canton 만 OFFER 제출로 의미가 다르다, 가이드 2.4)
        val txRef = adapter.broadcast(signedTx)
        // ⑤ 기록 — 이후 확정 추적·재전송·대사의 근거
        store.record(
            Submission(
                idempotencyKey = request.idempotencyKey,
                request = request,
                txRef = txRef,
                feeStep = 0,
                status = SubmissionStatus.SUBMITTED,
            ),
        )
        return txRef
    }

    /**
     * 막힌 tx 재전송 — rebuildForResend → 재서명 → 재전파 (가이드 4.4 표 "재서명·재전파").
     *
     * 수수료 교체는 서명 payload 가 바뀌므로 기존 서명이 무효가 된다 — 반드시 재서명한다.
     * tx 신원(txRef)도 매번 바뀌므로 새 [TxRef] 를 반환하고, 같은 멱등 키 아래
     * old → new 를 한 출금으로 기록한다 (가이드 4.4 "추적은 논리 단위로").
     */
    suspend fun resend(txRef: TxRef): TxRef {
        val submission =
            checkNotNull(store.findByTxRef(txRef)) {
                "no submission recorded for txRef: ${txRef.value}"
            }
        val adapter = adapters.pickAdapter(txRef.chainId)
        val nextFeeStep = submission.feeStep + 1

        // 재조립 — 같은 순번 + 수수료 인상(EVM/UTXO) 또는 체인별 재조립. payload 변경 = 서명 무효
        val rebuilt = adapter.rebuildForResend(txRef, nextFeeStep)
        // 재서명 — payload 가 바뀌었으므로 새 서명 라운드 (가이드 4.4 · 5.3)
        val signedTx = signing.sign(rebuilt)
        // 재전파 — 새 tx 신원이 생긴다
        val bumpedRef = adapter.broadcast(signedTx)

        store.record(
            submission.copy(
                txRef = bumpedRef,
                feeStep = nextFeeStep,
                status = SubmissionStatus.SUBMITTED,
            ),
        )
        return bumpedRef
    }
}
