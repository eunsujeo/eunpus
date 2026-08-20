package com.company.wallet.domain.model

/**
 * 내 지갑에 대한 체인 이벤트 — "입금" 은 수신 트랜잭션의 해석이다 (가이드 0.2 · 10).
 * 상태 이름은 입금 상태 전이(가이드 10.2)의 PENDING / CONFIRMED / ORPHANED 와 일치한다.
 */
sealed interface ChainEvent {
    val txRef: TxRef
    val address: Address
    val asset: Asset
    val amount: Amount

    /** 감지 (PENDING) — 자금 사용 불가. 알림은 "확인 중" 까지만 (가이드 10). */
    data class IncomingDetected(
        override val txRef: TxRef,
        override val address: Address,
        override val asset: Asset,
        override val amount: Amount,
        val confirmations: Int,
    ) : ChainEvent

    /** 확정 (CONFIRMED) — 확정 기준 충족, 자금 사용 가능. */
    data class IncomingConfirmed(
        override val txRef: TxRef,
        override val address: Address,
        override val asset: Asset,
        override val amount: Amount,
        val confirmations: Int,
    ) : ChainEvent

    /** 무효화 (ORPHANED) — reorg 로 사라짐, pending 롤백 + 정정 통지 (가이드 3 · 10). */
    data class Orphaned(
        override val txRef: TxRef,
        override val address: Address,
        override val asset: Asset,
        override val amount: Amount,
    ) : ChainEvent

    /** 송신 트랜잭션 상태 변경 push (BROADCAST → CONFIRMED 등, 가이드 11). */
    data class OutgoingStatusChanged(
        override val txRef: TxRef,
        override val address: Address,
        override val asset: Asset,
        override val amount: Amount,
        val status: TxStatus,
    ) : ChainEvent
}

fun interface ChainEventHandler {
    suspend fun onEvent(event: ChainEvent)
}

/** onChainEvent 구독 핸들 (가이드 13.3). */
fun interface Subscription {
    fun unsubscribe()
}
