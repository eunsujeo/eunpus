package com.company.wallet.chains.utxo

import java.math.BigInteger

/**
 * UTXO 노드 RPC 경계 (가이드 2.6) — bitcoind 류 풀노드 또는 관리형 노드.
 */
interface UtxoNodeClient {
    /** 계정(출금 지갑) 소유의 미사용 출력 목록. */
    suspend fun listUnspent(account: String): List<Utxo>

    /** 현재 권장 fee rate (sat/vByte). */
    suspend fun feeRatePerVByte(): Long

    /** 서명본을 노드에 그대로 제출 (sendrawtransaction) → txid. */
    suspend fun sendRawTransaction(rawTx: ByteArray): String

    suspend fun latestBlockNumber(): Long

    /** tx 가 포함된 블록 번호 — 미채굴(mempool)이면 null. */
    suspend fun blockNumberOf(txId: String): Long?
}

/** 미사용 트랜잭션 출력 — coin 선택의 단위 (가이드 2.2). */
data class Utxo(
    val txId: String,
    val vout: Int,
    val value: BigInteger,
) {
    /** lock 집합의 키 — outpoint. */
    val outpoint: String get() = "$txId:$vout"
}

/** RPC 구현 스텁 — 외부 I/O 경계. */
class JsonRpcUtxoNodeClient(
    private val endpoint: String,
) : UtxoNodeClient {
    override suspend fun listUnspent(account: String): List<Utxo> = TODO("listunspent — $endpoint")

    override suspend fun feeRatePerVByte(): Long = TODO("estimatesmartfee — $endpoint")

    override suspend fun sendRawTransaction(rawTx: ByteArray): String = TODO("sendrawtransaction — $endpoint")

    override suspend fun latestBlockNumber(): Long = TODO("getblockcount — $endpoint")

    override suspend fun blockNumberOf(txId: String): Long? = TODO("getrawtransaction(verbose) — $endpoint")
}
