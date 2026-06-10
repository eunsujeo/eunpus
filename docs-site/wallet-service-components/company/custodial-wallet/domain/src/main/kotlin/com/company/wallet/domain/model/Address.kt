package com.company.wallet.domain.model

/** 체인 주소. tag/memo 는 주소에 덧붙는 수신자 구분자 (가이드 9.3 — 공용 주소 체인에서 사용). */
data class Address(
    val value: String,
    val asset: Asset,
    val memoTag: String? = null,
)
