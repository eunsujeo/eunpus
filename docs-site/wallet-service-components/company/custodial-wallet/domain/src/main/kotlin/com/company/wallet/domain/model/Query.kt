package com.company.wallet.domain.model

/**
 * 임의·커스텀 조회 필터 (가이드 13.3 ChainQueryPort) — custody 가 안 주는 것:
 * 임의 외부 주소 · deep history · as-of-block · 집계.
 */
data class QueryFilter(
    val chainId: ChainId,
    val address: Address? = null,
    val asset: Asset? = null,
    val fromBlock: Long? = null,
    /** as-of-block 기준 조회 (가이드 2.6 read-after-write 불일치 회피). */
    val toBlock: Long? = null,
)

/** 정규화된 조회 결과 레코드. */
data class ChainRecord(
    val txRef: TxRef,
    val blockNumber: Long,
    val payload: Map<String, String> = emptyMap(),
)

/** 블록 범위 — ChainQueryPort.transfersOf 의 조회 구간. null 경계 = 열린 구간. */
data class BlockRange(
    val fromBlock: Long? = null,
    val toBlock: Long? = null,
)

/** 임의(외부 포함) 주소의 이체 한 건 — ChainQueryPort 도메인 동사의 반환 단위 (가이드 13.3). */
data class Transfer(
    val txRef: TxRef,
    val asset: Asset,
    val amount: Amount,
    val from: Address?,
    val to: Address,
    val blockNumber: Long,
)
