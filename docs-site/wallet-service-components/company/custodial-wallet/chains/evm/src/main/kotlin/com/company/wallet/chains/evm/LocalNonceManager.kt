package com.company.wallet.chains.evm

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * 계정별 nonce 직렬화 — 로컬 카운터 + lock (가이드 4.2).
 *
 * 매 요청마다 체인에 순번을 물어보면 동시성 구간에서 같은 값이 나와 충돌한다. 그래서
 * 체인에서 한 번 시작 값(pending 기준)을 읽어온 뒤, 이후로는 로컬에서 1씩 올려
 * 동시 요청이 같은 순번을 집지 않게 직렬화한다.
 *
 * 단 로컬 카운터는 어긋날(drift) 수 있다 — 프로세스 재기동, 외부 경로 제출(콘솔에서 직접
 * 보낸 트랜잭션 등). 그래서 주기적으로 [resync] 로 체인의 pending nonce 와 재동기화하고,
 * 비어 있는 순번(gap)을 감지하는 장치를 함께 둔다.
 */
class LocalNonceManager(
    private val node: EvmNodeClient,
) {
    private val mutex = Mutex()
    private val counters = mutableMapOf<String, Long>()

    /**
     * 다음 순번 점유 — lock 으로 직렬화. 최초 1회만 체인(pending 기준)에서 시작값을 읽고,
     * 이후는 로컬에서 증가시킨다 (가이드 4.2).
     */
    suspend fun reserve(from: String): Long =
        mutex.withLock {
            val next = counters[from] ?: node.pendingNonce(from)
            counters[from] = next + 1
            next
        }

    /**
     * drift 재동기화 — 체인의 pending nonce 로 로컬 카운터를 맞춘다 (가이드 4.2).
     *
     * gap 감지: 로컬 카운터가 체인 pending 보다 앞서 있으면, 점유만 되고 체인에 도달하지
     * 못한 순번(미전파·드롭 tx)이 있을 수 있다 — 그 뒤 순번이 전부 막히는 stuck cascade 의
     * 씨앗이므로 모니터링·알림 대상이다 (가이드 4.1).
     *
     * @return 재동기화된 시작 nonce (체인 pending 기준)
     */
    suspend fun resync(from: String): Long =
        mutex.withLock {
            val chainPending = node.pendingNonce(from)
            val local = counters[from]
            if (local != null && local > chainPending) {
                // gap 의심 — 로컬이 점유한 [chainPending, local) 구간이 체인에 없다.
                // 실제 구현은 여기서 gap 알림을 발행한다 (스켈레톤은 카운터만 정정).
            }
            counters[from] = chainPending
            chainPending
        }
}
