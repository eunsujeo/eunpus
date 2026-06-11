package com.company.wallet.engine.indexer

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.ChainRecord
import com.company.wallet.domain.model.QueryFilter
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.TxRef
import com.company.wallet.engine.multichain.ChainSource
import com.company.wallet.engine.multichain.SourceEvent
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigInteger

/** 가이드 3.2 불변식 — 이벤트 종류와 무관하게, 어떤 가공보다도 raw append 가 먼저다. */
class SelfIndexerTest {
    @Test
    fun `모든 이벤트는 가공 전에 raw append 가 먼저 호출된다`() =
        runBlocking {
            val chainId = ChainId("test-chain")
            val asset = Asset("TST", chainId)
            val txRef = TxRef("tx-1", chainId)
            val journal = mutableListOf<String>()
            val source =
                FakeChainSource(
                    chainId = chainId,
                    events =
                        listOf(
                            SourceEvent.TxSeen(
                                chainId = chainId,
                                raw = "r1",
                                txRef = txRef,
                                address = Address("addr-ours", asset),
                                asset = asset,
                                amount = Amount(BigInteger.TEN, 18),
                            ),
                            SourceEvent.ConfirmationProgressed(chainId = chainId, raw = "r2", txRef = txRef, depth = 2),
                            SourceEvent.Reorged(chainId = chainId, raw = "r3", txRef = txRef),
                        ),
                )
            val indexer =
                SelfIndexer(
                    sources = listOf(source),
                    projections = JournalingProjectionStore(journal),
                    raw = JournalingRawEventStore(journal),
                    policy = { _, depth -> depth >= 2 },
                )

            indexer.run() // 유한 flow — 소진되면 종료

            assertEquals(
                listOf(
                    "raw:r1",
                    "proj:pending:tx-1",
                    "raw:r2",
                    "proj:confirmed:tx-1",
                    "raw:r3",
                    "proj:rollback:tx-1",
                ),
                journal,
            )
        }
}

private class FakeChainSource(
    override val chainId: ChainId,
    private val events: List<SourceEvent>,
) : ChainSource {
    override fun events(): Flow<SourceEvent> = flowOf(*events.toTypedArray())
}

private class JournalingRawEventStore(
    private val journal: MutableList<String>,
) : RawEventStore {
    override suspend fun append(raw: String) {
        journal += "raw:$raw"
    }
}

private class JournalingProjectionStore(
    private val journal: MutableList<String>,
) : ProjectionStore {
    override suspend fun applyPending(event: SourceEvent.TxSeen) {
        journal += "proj:pending:${event.txRef.value}"
    }

    override suspend fun applyConfirmed(
        txRef: TxRef,
        depth: Int,
    ) {
        journal += "proj:confirmed:${txRef.value}"
    }

    override suspend fun rollback(txRef: TxRef) {
        journal += "proj:rollback:${txRef.value}"
    }

    override suspend fun balanceOf(
        address: Address,
        asset: Asset,
    ): Balance = Balance.zero(0)

    override suspend fun transfersOf(
        address: Address,
        range: BlockRange,
    ): List<Transfer> = emptyList()

    override suspend fun balanceAt(
        address: Address,
        asset: Asset,
        block: Long,
    ): Amount = Amount.zero(0)

    override suspend fun query(filter: QueryFilter): List<ChainRecord> = emptyList()
}
