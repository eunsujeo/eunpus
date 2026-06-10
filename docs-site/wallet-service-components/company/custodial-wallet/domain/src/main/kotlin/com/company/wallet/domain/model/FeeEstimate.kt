package com.company.wallet.domain.model

/** 제출 전 수수료 추정 — low/medium/high (가이드 13.3 estimateFee). */
data class FeeEstimate(
    val low: Amount,
    val medium: Amount,
    val high: Amount,
)
