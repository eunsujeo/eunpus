package com.company.wallet.domain.model

/** 자산 — 심볼 + 소속 체인. 같은 심볼이라도 체인이 다르면 다른 자산이다. */
data class Asset(
    val symbol: String,
    val chainId: ChainId,
)
