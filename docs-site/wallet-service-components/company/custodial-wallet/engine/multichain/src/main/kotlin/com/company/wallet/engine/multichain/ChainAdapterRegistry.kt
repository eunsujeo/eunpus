package com.company.wallet.engine.multichain

import com.company.wallet.domain.error.UnsupportedChainException
import com.company.wallet.domain.model.ChainId

/**
 * chainId → 구현 디스패치 (가이드 2.4 의 pickAdapter).
 * 새 체인 = chains/<new> 모듈 하나 + 앱 wiring 의 어댑터 한 개.
 */
class ChainAdapterRegistry(adapters: List<ChainAdapter>) {
    private val byChain: Map<ChainId, ChainAdapter> = adapters.associateBy { it.chainId }

    fun pickAdapter(chainId: ChainId): ChainAdapter = byChain[chainId] ?: throw UnsupportedChainException(chainId)
}
