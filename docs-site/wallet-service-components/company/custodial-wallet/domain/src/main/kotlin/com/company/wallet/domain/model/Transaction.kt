package com.company.wallet.domain.model

/**
 * 송신 트랜잭션 요청. "출금" 이라는 업무 의미는 비즈니스 레이어가 붙인다 —
 * 매니저가 다루는 것은 트랜잭션이다 (가이드 0.2 · 13.3).
 *
 * 승인은 이 요청이 만들어지기 전에 끝나 있어야 한다. 매니저는 승인된 지시만 받아 집행한다 (가이드 11).
 */
data class TransactionRequest(
    val idempotencyKey: String,
    val account: AccountRef,
    val to: Address,
    val asset: Asset,
    val amount: Amount,
    val chainSpecific: ChainSpecific? = null,
)

/** 제출된 트랜잭션 참조 — 체인 tx hash 또는 custody 의 트랜잭션 id 를 정규화한 것. */
data class TxRef(
    val value: String,
    val chainId: ChainId,
)

/**
 * 정규화된 트랜잭션 상태. 메커니즘은 어댑터가 숨겨도 lifecycle 은 표면화된다 (가이드 2.3).
 * EVM(이더리움·Base)만 태우므로 상태 집합은 전파→확정 단선형이다.
 */
sealed interface TxStatus {
    /** 전파됨 — 확정 대기 (BROADCAST). */
    data class Pending(val confirmations: Int) : TxStatus

    /** 확정 기준 충족 (CONFIRMED). */
    data class Confirmed(val confirmations: Int) : TxStatus

    /** 수수료 부족·혼잡으로 막힘 — 재전송(fee boost) 대상 (가이드 4.4). */
    data object Stuck : TxStatus

    data class Failed(val reason: String) : TxStatus

    data object Cancelled : TxStatus
}

/**
 * 체인 특화 파라미터 — sealed 라서 when 분기가 컴파일 시점에 망라된다 (가이드 17.1).
 * 새 체인의 특화 표현이 필요할 때만 추가한다. 현재는 EVM 뿐이다.
 */
sealed interface ChainSpecific {
    /** 계정 기반(EVM) — 순번(nonce). 보통 벤더(Fireblocks)가 채우므로 null 이 기본. */
    data class Evm(val nonce: Long? = null) : ChainSpecific
}
