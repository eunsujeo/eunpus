package com.company.wallet.domain.port

import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter

/**
 * (선택) 임의·커스텀 조회 포트 — custody 가 안 주는 것 (가이드 13.3).
 *
 * Fireblocks 는 이 포트를 채우지 않는다 — 임의 외부 주소·deep history·as-of-block·집계가
 * 필요할 때만 자체 인덱서·Alchemy 를 따로 붙인다 (가이드 13.4 하이브리드).
 */
interface ChainQueryPort {
    suspend fun query(filter: QueryFilter): List<ChainRecord>
}
