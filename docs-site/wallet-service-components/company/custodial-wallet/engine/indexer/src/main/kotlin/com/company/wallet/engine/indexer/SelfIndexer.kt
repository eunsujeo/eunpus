package com.company.wallet.engine.indexer

import com.company.wallet.domain.model.ChainEvent
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TxRef
import com.company.wallet.engine.multichain.ChainSource
import com.company.wallet.engine.multichain.SourceEvent
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.util.concurrent.CopyOnWriteArrayList

/**
 * 인덱서 본체 — 수집은 체인별([ChainSource]), 가공·projection·제공은 체인 무관 (가이드 3.4).
 *
 * 수집 방식(블록 폴링·slot 구독·ACS 업데이트)과 reorg "감지" 는 소스가 흡수하고,
 * 여기엔 정규화된 [SourceEvent] 만 올라온다 — 그래서 체인이 늘어도 이 본체는 안 바뀐다.
 *
 * 불변식 (가이드 3.2 ②): **모든 수신 이벤트는 가공 전에 [RawEventStore.append] 먼저.**
 * append-only 원시 보존이 있어야 가공 로직 변경·reorg 후에도 projection 을 다시 만들 수 있다.
 */
class SelfIndexer(
    private val sources: List<ChainSource>,
    private val projections: ProjectionStore,
    private val raw: RawEventStore,
    private val policy: ConfirmationPolicy,
) {
    private val handlers = CopyOnWriteArrayList<ChainEventHandler>()

    /**
     * 감지(TxSeen) 시점 원본 기억 — 확정·무효화 이벤트엔 주소·금액이 없으므로
     * [ChainEvent] 를 완성하려면 감지 레코드를 다시 찾아야 한다. 스켈레톤은 in-memory 로 들고,
     * 실제 구현은 재기동 시 raw 로그 재적용/projection 조회로 복원한다 (가이드 3.2).
     */
    private val seenMutex = Mutex()
    private val seenByTxRef = mutableMapOf<TxRef, SourceEvent.TxSeen>()

    /**
     * 상시 수집 루프 — 아무도 안 불러도 계속 돈다 (가이드 3.4 "수집 루프는 상시 worker").
     * 소스별 [ChainSource.events] 를 병렬 수집하고, 이벤트마다 raw.append 를 항상 먼저 수행한 뒤
     * TxSeen → pending / ConfirmationProgressed → policy 판정 → confirmed / Reorged → rollback 으로 가공한다.
     */
    suspend fun run() {
        coroutineScope {
            sources.forEach { source ->
                launch {
                    source.events().collect { event ->
                        handle(event)
                    }
                }
            }
        }
    }

    /** 내 지갑 이벤트 push 구독 — TransactionPort.onChainEvent 의 뒷면 (가이드 3.4 · 13.3). */
    fun onChainEvent(handler: ChainEventHandler): Subscription {
        handlers.add(handler)
        return Subscription { handlers.remove(handler) }
    }

    private suspend fun handle(event: SourceEvent) {
        // ② 원시 보존 — 이벤트 종류와 무관하게, 어떤 가공보다도 먼저 (가이드 3.2 불변식)
        raw.append(event.raw)

        when (event) {
            is SourceEvent.TxSeen -> {
                seenMutex.withLock { seenByTxRef[event.txRef] = event }
                projections.applyPending(event)
                // 감지(PENDING) — 자금 사용 불가. 알림은 "확인 중" 까지만 (가이드 10)
                publish(
                    ChainEvent.IncomingDetected(
                        txRef = event.txRef,
                        address = event.address,
                        asset = event.asset,
                        amount = event.amount,
                        confirmations = 0,
                    ),
                )
            }

            is SourceEvent.ConfirmationProgressed -> {
                // 확정 기준은 인덱서가 정하지 않는다 — 정책에 판정만 위임 (가이드 3.4)
                if (!policy.isFinal(event.chainId, event.depth)) return
                projections.applyConfirmed(event.txRef, event.depth)
                seenOf(event.txRef)?.let { seen ->
                    publish(
                        ChainEvent.IncomingConfirmed(
                            txRef = seen.txRef,
                            address = seen.address,
                            asset = seen.asset,
                            amount = seen.amount,
                            confirmations = event.depth,
                        ),
                    )
                }
            }

            is SourceEvent.Reorged -> {
                // 감지는 체인별(소스), 처리는 공통 — projection 만 되감는다. raw 는 보존 (가이드 3.3)
                projections.rollback(event.txRef)
                seenOf(event.txRef)?.let { seen ->
                    publish(
                        ChainEvent.Orphaned(
                            txRef = seen.txRef,
                            address = seen.address,
                            asset = seen.asset,
                            amount = seen.amount,
                        ),
                    )
                }
            }
        }
    }

    private suspend fun seenOf(txRef: TxRef): SourceEvent.TxSeen? = seenMutex.withLock { seenByTxRef[txRef] }

    private suspend fun publish(event: ChainEvent) {
        for (handler in handlers) {
            // 한 핸들러의 실패가 다른 핸들러·수집 루프를 멈추지 않게 격리한다
            // (구독자별 전달 기록·재시도는 backend/alerts 소관, 가이드 8.3)
            runCatching { handler.onEvent(event) }
        }
    }
}
