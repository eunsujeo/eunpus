package com.company.wallet.chains.solana

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.engine.multichain.ChainAdapter
import com.company.wallet.engine.multichain.Confirmation
import com.company.wallet.engine.multichain.SignedTx
import com.company.wallet.engine.multichain.UnsignedTx
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * Solana 어댑터 — nonce 없음, recentBlockhash 로 자연 직렬화 (가이드 2.4 · 4.3).
 *
 * stuck 해소가 fee boost 가 아니다 (가이드 4.4): 만료 전 재전송, 만료 시 새 blockhash 로
 * 재조립·재제출하는 **어댑터 내부 auto-retry** 성격이다. 그래서 [supportsFeeBump] = false —
 * StuckWatcher 의 자동 boost 대상에서 빠진다.
 */
class SolanaChainAdapter(
    private val node: SolanaNodeClient,
    override val chainId: ChainId = ChainId.SOLANA,
) : ChainAdapter {
    /** operator boost 없음 — Solana 의 재제출은 어댑터 내부 auto-retry (가이드 4.4 Figure 4-3). */
    override val supportsFeeBump: Boolean = false

    private val stateMutex = Mutex()

    /** txRef.value → 전파한 원본 — blockhash 만료 시 같은 지급 의도로 재조립하기 위한 기록. */
    private val broadcastIndex = mutableMapOf<String, UnsignedTx>()

    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address = TODO("ed25519 키 기반 주소(+SPL ATA) 파생 — 키 트리는 외부 서명자 소관 (가이드 2.2)")

    override suspend fun getBalance(
        address: Address,
        asset: Asset,
    ): Amount = TODO("getBalance / SPL token account 조회 (가이드 2.4)")

    /** 조립 — 순번 점유가 없다. recentBlockhash 가 유효기간의 닻이 된다 (가이드 4.3). */
    override suspend fun buildTransaction(request: TransactionRequest): UnsignedTx {
        val recentBlockhash = node.latestBlockhash()
        return UnsignedTx(
            // blockhash 가 신원에 들어간다 — 재조립하면 새 blockhash = 새 payload = 새 서명 (가이드 4.4)
            id = "solana:${request.idempotencyKey}:$recentBlockhash",
            request = request,
            chainId = chainId,
            signingPayload = encodeMessage(request, recentBlockhash),
            chainSpecific = null,
        )
    }

    /** 점유 없는 추정 — Solana 는 애초에 점유할 순번이 없다 (blockhash 는 조립 시에만, 가이드 4.3). */
    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate =
        TODO("base fee + priority fee(compute unit price) 추정 (가이드 2.2)")

    /** 전파 — 서명본 제출. 반환된 signature 로 원본을 색인해 재조립에 대비한다. */
    override suspend fun broadcast(signedTx: SignedTx): TxRef {
        val signature = node.sendTransaction(encodeRawTransaction(signedTx))
        stateMutex.withLock { broadcastIndex[signature] = signedTx.unsigned }
        return TxRef(signature, chainId)
    }

    /** 확정 판정 — commitment 단계 (processed → confirmed → finalized, 가이드 2.4). */
    override suspend fun confirmations(txRef: TxRef): Confirmation =
        when (node.commitmentOf(txRef.value)) {
            null -> Confirmation(depth = 0, finalized = false, status = TxStatus.Pending(0))
            // depth 는 commitment 단계의 정규화 표현 — 블록 수가 아니다
            SolanaCommitment.PROCESSED -> Confirmation(depth = 0, finalized = false, status = TxStatus.Pending(0))
            SolanaCommitment.CONFIRMED -> Confirmation(depth = 1, finalized = false, status = TxStatus.Pending(1))
            SolanaCommitment.FINALIZED -> Confirmation(depth = 2, finalized = true, status = TxStatus.Confirmed(2))
        }

    /**
     * blockhash 만료 시 재조립 — 같은 지급 의도(to·amount)로 새 blockhash 를 받아 다시 만든다.
     *
     * 이건 fee bump 가 아니라 어댑터 내부 auto-retry 성격이다 (가이드 4.4) — [feeBumpStep] 은
     * 무시된다 (수수료를 올려 교체할 메커니즘이 없다). 옛 tx 는 blockhash 만료로 자연 무효화되므로
     * "정확히 하나만 확정" 이 성립한다 (가이드 4.4 "Solana=옛 것 만료").
     */
    override suspend fun rebuildForResend(
        txRef: TxRef,
        feeBumpStep: Int,
    ): UnsignedTx {
        val original =
            stateMutex.withLock {
                checkNotNull(broadcastIndex[txRef.value]) { "no broadcast record for txRef: ${txRef.value}" }
            }
        return buildTransaction(original.request)
    }

    private fun encodeMessage(
        request: TransactionRequest,
        recentBlockhash: String,
    ): ByteArray = TODO("message 직렬화 — ed25519 서명 대상 (가이드 5.4 — sighash 개념이 다름)")

    private fun encodeRawTransaction(signedTx: SignedTx): ByteArray = TODO("서명 부착 wire format 직렬화 (가이드 5.4)")
}
