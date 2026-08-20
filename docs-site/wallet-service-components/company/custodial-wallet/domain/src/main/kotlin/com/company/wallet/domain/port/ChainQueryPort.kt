package com.company.wallet.domain.port

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Transfer

/**
 * (선택) 임의·커스텀 조회 포트 — custody 가 안 주는 것 (가이드 13.3).
 *
 * Fireblocks 는 이 포트를 채우지 않는다 — 임의 외부 주소·deep history·as-of-block·집계가
 * 필요할 때만 자체 인덱서·Alchemy 를 따로 붙인다 (가이드 13.4 하이브리드).
 *
 * 이 포트도 "도메인 동사 우선" 이다 — generic [query] 하나로 두면 filter 안으로 체인별 개념
 * (로그 토픽·slot·ACS)이 새어 들어와 도메인 우선이 이 포트에서만 무너진다. 자주 쓰는 질의는
 * [transfersOf]·[balanceAt] 처럼 동사로 승격하고, [query] 는 탈출구로만 (가이드 13.3).
 */
interface ChainQueryPort {
    /** 임의(외부 포함) 주소의 이체 이력 — 도메인 동사. */
    suspend fun transfersOf(
        address: Address,
        range: BlockRange,
    ): List<Transfer>

    /** as-of-block 시점 잔액 — read-after-write 불일치 회피·대사 입력 (가이드 2.6 · 7). */
    suspend fun balanceAt(
        address: Address,
        asset: Asset,
        block: Long,
    ): Amount

    /** 탈출구 — 아직 동사가 되지 못한 커스텀·집계. 같은 질의가 반복되면 동사로 승격한다. */
    suspend fun query(filter: QueryFilter): List<ChainRecord>
}
