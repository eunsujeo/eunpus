package com.company.wallet.chains.utxo

import com.company.wallet.domain.model.ChainId
import com.company.wallet.engine.multichain.ChainSource
import com.company.wallet.engine.multichain.SourceEvent
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

/**
 * UTXO 수집 소스 — 블록 폴링(+mempool), EVM 과 동일한 reorg 모델 (가이드 3.4).
 */
class UtxoChainSource(
    private val node: UtxoNodeClient,
    override val chainId: ChainId = ChainId.BITCOIN,
) : ChainSource {
    override fun events(): Flow<SourceEvent> =
        flow {
            // 폴링 루프 개요 (가이드 3.4 UtxoSource):
            //   1. cursor 다음 블록 + mempool 을 읽는다
            //   2. 직전 블록 hash 불일치 → SourceEvent.Reorged
            //   3. 우리 주소가 출력(vout)에 있는 tx → SourceEvent.TxSeen
            //   4. 추적 중인 tx 의 깊이 진행 → SourceEvent.ConfirmationProgressed
            TODO("블록·mempool 폴링 — 노드 RPC I/O (가이드 3.4 UtxoSource)")
        }
}
