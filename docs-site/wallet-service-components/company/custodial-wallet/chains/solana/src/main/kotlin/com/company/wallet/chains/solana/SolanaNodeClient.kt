package com.company.wallet.chains.solana

/**
 * Solana 노드 RPC 경계 (가이드 2.6).
 */
interface SolanaNodeClient {
    /** 최신 blockhash — 트랜잭션 유효기간의 닻. 만료되면 재조립해야 한다 (가이드 4.3). */
    suspend fun latestBlockhash(): String

    /** 서명본 제출 (sendTransaction) → tx signature. */
    suspend fun sendTransaction(rawTx: ByteArray): String

    /** tx 의 commitment 단계 — 미관측이면 null (가이드 3.4 SolanaSource). */
    suspend fun commitmentOf(signature: String): SolanaCommitment?
}

/** Solana 확정 단계 — processed → confirmed → finalized (가이드 2.2). */
enum class SolanaCommitment { PROCESSED, CONFIRMED, FINALIZED }

/** RPC 구현 스텁 — 외부 I/O 경계. */
class JsonRpcSolanaNodeClient(
    private val endpoint: String,
) : SolanaNodeClient {
    override suspend fun latestBlockhash(): String = TODO("getLatestBlockhash — $endpoint")

    override suspend fun sendTransaction(rawTx: ByteArray): String = TODO("sendTransaction — $endpoint")

    override suspend fun commitmentOf(signature: String): SolanaCommitment? = TODO("getSignatureStatuses — $endpoint")
}
