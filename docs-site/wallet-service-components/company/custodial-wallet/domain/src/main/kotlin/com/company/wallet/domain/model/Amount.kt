package com.company.wallet.domain.model

import java.math.BigInteger

/** 금액 — 체인 최소 단위 정수(wei·satoshi·lamport 등). 부동소수점 금지. */
data class Amount(
    val minorUnits: BigInteger,
    val decimals: Int,
) {
    companion object {
        fun zero(decimals: Int): Amount = Amount(BigInteger.ZERO, decimals)
    }
}
