package com.company.wallet.engine.indexer

import com.company.wallet.domain.model.ChainId

/**
 * 확정 판정 정책 — "이 깊이면 확정인가" (가이드 3.3).
 *
 * 확정 기준 자체(N 블록·commitment·2-step)는 체인별이라 멀티체인 어댑터/소스가 제공하고,
 * 인덱서는 이 정책에 판정만 위임한다. N 블록 확정 기준은 얕은 reorg 를 흡수하기 위한 것 —
 * 확정 깊이를 넘는 깊은 reorg 만 "확정 후 무효화" 예외 경로로 남는다.
 */
fun interface ConfirmationPolicy {
    fun isFinal(
        chainId: ChainId,
        depth: Int,
    ): Boolean
}
