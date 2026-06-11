package com.company.wallet.adapters.alchemy

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.port.ChainQueryPort

/**
 * Alchemy 기반 임의·커스텀 조회 어댑터 — ChainQueryPort 만 채운다 (가이드 13.4).
 *
 * custody(Fireblocks·NodeWallet)는 내 vault/지갑 범위만 준다 — 임의 외부 주소·deep history·
 * as-of-block·집계가 필요할 때 이 포트만 따로 붙이는 하이브리드 구성이다.
 * Account/Transaction 포트는 채우지 않는다 — 키·서명과 무관한 읽기 전용 어댑터.
 */
class AlchemyChainQueryAdapter : ChainQueryPort {
    override suspend fun transfersOf(
        address: Address,
        range: BlockRange,
    ): List<Transfer> = TODO("Alchemy Transfers API — 임의 주소 이체 이력 → Transfer 정규화 (가이드 13.3)")

    override suspend fun balanceAt(
        address: Address,
        asset: Asset,
        block: Long,
    ): Amount = TODO("Alchemy as-of-block 잔액 조회 (가이드 2.6 · 13.3)")

    override suspend fun query(filter: QueryFilter): List<ChainRecord> =
        TODO("Alchemy API 호출 — 동사로 못 담는 커스텀·집계 조회 (가이드 13.4)")
}
