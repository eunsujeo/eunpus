package com.company.wallet.domain.model

/**
 * 잔액 — 단일 숫자가 아니다 (가이드 13.3).
 *
 * available(사용 가능) · pending(미확정 입금) · locked(2-step OFFER 등으로 묶임) 을 구분한다.
 * 수탁의 "사용 가능 판정" 은 [available] 만 본다 — 감지(PENDING) 자금을 쓰게 하면
 * reorg 때 없는 돈을 쓰는 사고가 된다 (가이드 10.2), Canton 송신 대기 자금은 locked (가이드 11.1).
 */
data class Balance(
    val available: Amount,
    val pending: Amount,
    val locked: Amount,
) {
    init {
        require(available.decimals == pending.decimals && pending.decimals == locked.decimals) {
            "Balance 구성 요소의 decimals 불일치"
        }
    }

    /** 표시용 총액 — 사용 가능 판정에는 쓰지 말 것 ([available] 만). */
    val total: Amount
        get() =
            Amount(
                minorUnits = available.minorUnits + pending.minorUnits + locked.minorUnits,
                decimals = available.decimals,
            )

    companion object {
        fun zero(decimals: Int): Balance = availableOnly(Amount.zero(decimals))

        /** 구분 정보가 없는 단일 잔액의 보수적 표현 — 전부 available 로. */
        fun availableOnly(amount: Amount): Balance =
            Balance(
                available = amount,
                pending = Amount.zero(amount.decimals),
                locked = Amount.zero(amount.decimals),
            )
    }
}
