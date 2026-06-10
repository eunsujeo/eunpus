package com.company.wallet.engine.multichain

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.TxRef
import kotlinx.coroutines.flow.Flow

/**
 * 인덱서 수집 소스 SPI — 체인별 수집 메커니즘(폴링·구독)을 감추고
 * 정규화된 [SourceEvent] 스트림만 노출한다 (가이드 3.2 · 3.4).
 */
interface ChainSource {
    val chainId: ChainId

    fun events(): Flow<SourceEvent>
}

/**
 * 수집 이벤트. [raw] 는 가공 전 원본 — 인덱서는 어떤 종류든 가공 전에
 * append-only 로 먼저 보존한다 (가이드 3.2 ②).
 */
sealed interface SourceEvent {
    val chainId: ChainId
    val raw: String

    /** 우리 주소로의 transfer 감지 (PENDING). */
    data class TxSeen(
        override val chainId: ChainId,
        override val raw: String,
        val txRef: TxRef,
        val address: Address,
        val asset: Asset,
        val amount: Amount,
    ) : SourceEvent

    /** 후속 블록으로 확정 깊이 진행. */
    data class ConfirmationProgressed(
        override val chainId: ChainId,
        override val raw: String,
        val txRef: TxRef,
        val depth: Int,
    ) : SourceEvent

    /** reorg 로 블록에서 빠짐 — projection 롤백 대상 (가이드 3 · 10.2). */
    data class Reorged(
        override val chainId: ChainId,
        override val raw: String,
        val txRef: TxRef,
    ) : SourceEvent
}
