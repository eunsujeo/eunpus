package com.company.wallet.chains.evm

import java.math.BigInteger

/**
 * EVM 노드 RPC 경계 (가이드 2.6) — 엔드포인트 풀·failover·sticky 라우팅은 이 인터페이스
 * 구현(노드 접근 계층)이 흡수하고, 어댑터는 단일 노드처럼 호출한다.
 */
interface EvmNodeClient {
    /** 체인의 pending 기준 nonce — 로컬 카운터의 시작값·재동기화 기준 (가이드 4.2). */
    suspend fun pendingNonce(address: String): Long

    /** 현재 EIP-1559 수수료 — 두 필드 (가이드 4.2 Figure 4-2). */
    suspend fun feeData(): EvmFeeData

    /** 서명본을 노드에 그대로 제출 (eth_sendRawTransaction) → tx hash. */
    suspend fun sendRawTransaction(rawTx: ByteArray): String

    suspend fun latestBlockNumber(): Long

    /** tx 가 포함된 블록 번호 — 미채굴(pending)이면 null. */
    suspend fun blockNumberOf(txHash: String): Long?
}

/** EIP-1559 두 수수료 필드 — 교체 시 둘 다 인상해야 한다 (가이드 4.2 Figure 4-2). */
data class EvmFeeData(
    val maxFeePerGas: BigInteger,
    val maxPriorityFeePerGas: BigInteger,
)

/** JSON-RPC 구현 스텁 — 외부 I/O 경계. */
class JsonRpcEvmNodeClient(
    private val endpoint: String,
) : EvmNodeClient {
    override suspend fun pendingNonce(address: String): Long =
        TODO("eth_getTransactionCount(address, \"pending\") — $endpoint")

    override suspend fun feeData(): EvmFeeData = TODO("eth_feeHistory / eth_maxPriorityFeePerGas — $endpoint")

    override suspend fun sendRawTransaction(rawTx: ByteArray): String = TODO("eth_sendRawTransaction — $endpoint")

    override suspend fun latestBlockNumber(): Long = TODO("eth_blockNumber — $endpoint")

    override suspend fun blockNumberOf(txHash: String): Long? = TODO("eth_getTransactionReceipt — $endpoint")
}
