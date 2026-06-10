package com.company.wallet.domain.model

/**
 * 체인 식별자.
 *
 * enum 이 아닌 value class 인 이유 — 새 체인 추가가 domain 변경을 요구하면 안 된다
 * (가이드 17.3 "체인 추가 = chains/<new> 하나 — engine·backend·domain 은 안 바뀐다").
 */
@JvmInline
value class ChainId(val value: String) {
    companion object {
        val ETHEREUM = ChainId("ethereum")
        val BITCOIN = ChainId("bitcoin")
        val SOLANA = ChainId("solana")
        val CANTON = ChainId("canton")
    }
}
