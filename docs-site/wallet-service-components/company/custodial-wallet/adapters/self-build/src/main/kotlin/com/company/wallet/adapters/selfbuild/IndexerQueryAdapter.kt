package com.company.wallet.adapters.selfbuild

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.port.ChainQueryPort
import com.company.wallet.engine.indexer.ProjectionStore

/**
 * ChainQueryPort 는 custody 가 아니라 "인덱서 어댑터" 가 채운다 (가이드 13.4 · 15.2).
 *
 * custody 가 Fireblocks 여도 이 어댑터만 붙이면 ChainQuery 가 생긴다(하이브리드) —
 * [com.company.wallet.adapters.alchemy.AlchemyChainQueryAdapter] 로 교체할 수도 있다.
 * 그래서 custody 선택과 무관하게 한 벌만 존재한다. 단 이 어댑터를 붙이는 순간
 * 인덱서 상시 job 운영은 우리 몫이 된다 (가이드 15.6).
 */
class IndexerQueryAdapter(
    private val projections: ProjectionStore,
) : ChainQueryPort {
    /** 임의 "외부" 주소의 이체 이력 — 내 계정 이력은 TransactionPort.transactionsOf (가이드 13.3). */
    override suspend fun transfersOf(
        address: Address,
        range: BlockRange,
    ): List<Transfer> = projections.transfersOf(address, range)

    /** as-of-block 시점 잔액 (가이드 2.6 · 13.3). */
    override suspend fun balanceAt(
        address: Address,
        asset: Asset,
        block: Long,
    ): Amount = projections.balanceAt(address, asset, block)

    /** 탈출구 — 동사로 못 담는 커스텀·집계. 같은 질의가 반복되면 동사로 승격한다 (가이드 13.3). */
    override suspend fun query(filter: QueryFilter): List<ChainRecord> = projections.query(filter)
}
