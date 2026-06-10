package com.company.wallet.chains.evm

import com.company.wallet.domain.model.ChainId
import com.company.wallet.engine.multichain.ChainSource
import com.company.wallet.engine.multichain.SourceEvent
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

/**
 * EVM 수집 소스 — 블록 폴링, parentHash 불일치로 reorg 판정 (가이드 3.4).
 *
 * 수집·디코딩·reorg "감지" 까지가 체인별이고, 그 결과는 정규화된 [SourceEvent] 로만
 * 인덱서에 올라간다 — 처리(롤백·재적용)는 인덱서 공통 (가이드 3.4).
 */
class EvmChainSource(
    private val node: EvmNodeClient,
    override val chainId: ChainId = ChainId.ETHEREUM,
) : ChainSource {
    override fun events(): Flow<SourceEvent> =
        flow {
            // 폴링 루프 개요 (가이드 3.2 ① pull — push 스트림과 하이브리드로 보강 가능):
            //   1. cursor 다음 블록을 노드에서 읽는다
            //   2. parentHash 가 직전 블록 hash 와 불일치 → SourceEvent.Reorged 발행
            //   3. 우리 주소 관련 transfer(native·ERC-20 Transfer 로그) 디코딩 → SourceEvent.TxSeen
            //   4. 추적 중인 tx 의 깊이 진행 → SourceEvent.ConfirmationProgressed
            TODO("블록 폴링·로그 디코딩 — 노드 RPC I/O (가이드 3.4 EvmSource)")
        }
}
