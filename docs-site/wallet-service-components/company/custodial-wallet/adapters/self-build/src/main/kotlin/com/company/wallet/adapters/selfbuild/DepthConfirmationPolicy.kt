package com.company.wallet.adapters.selfbuild

import com.company.wallet.domain.model.ChainId
import com.company.wallet.engine.indexer.ConfirmationPolicy

/**
 * 깊이 기반 확정 정책 — "몇 블록 깊이면 확정인가" 는 체인별 운영 결정이다 (가이드 3 · 10.2).
 *
 * Fireblocks 의 DCCP(입금 확정 정책)에 해당하는 것을 자체 구축에서는 우리가 정한다.
 * 기본값은 통상 관례이며 운영 정책으로 조정한다 (재무 리스크와 입금 반영 속도의 트레이드오프).
 */
class DepthConfirmationPolicy(
    private val requiredDepths: Map<ChainId, Int> = DEFAULT_DEPTHS,
    private val defaultDepth: Int = 12,
) : ConfirmationPolicy {
    override fun isFinal(
        chainId: ChainId,
        depth: Int,
    ): Boolean = depth >= (requiredDepths[chainId] ?: defaultDepth)

    companion object {
        val DEFAULT_DEPTHS: Map<ChainId, Int> =
            mapOf(
                ChainId.ETHEREUM to 12,
                ChainId.BITCOIN to 6,
                ChainId.SOLANA to 32,
                ChainId.CANTON to 1,
            )
    }
}
