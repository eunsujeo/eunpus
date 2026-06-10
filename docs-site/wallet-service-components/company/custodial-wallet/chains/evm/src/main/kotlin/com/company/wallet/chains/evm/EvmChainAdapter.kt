package com.company.wallet.chains.evm

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.ChainSpecific
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
import java.math.BigInteger

/**
 * EVM 어댑터 — 계정 nonce 직렬화 · EIP-1559 · RBF (가이드 2.4).
 *
 * 조립([buildTransaction])이 [LocalNonceManager.reserve] 로 순번을 점유하고,
 * 재전송([rebuildForResend])은 같은 nonce 에 두 수수료 필드를 모두 인상한다 (가이드 4.2).
 */
class EvmChainAdapter(
    private val node: EvmNodeClient,
    private val nonceManager: LocalNonceManager,
    override val chainId: ChainId = ChainId.ETHEREUM,
) : ChainAdapter {
    /** EVM 은 같은 nonce 의 수수료 교체(RBF)가 가능하다 — StuckWatcher 자동 재전송 대상 (가이드 4.4). */
    override val supportsFeeBump: Boolean = true

    private val inFlightMutex = Mutex()

    /** unsignedTx.id → 조립 시 적용한 수수료 — 재전송 bump 의 기준값. */
    private val feesByUnsignedId = mutableMapOf<String, EvmFeeData>()

    /** txRef.value → 전파한 원본 — 재전송 시 같은 nonce·같은 지급 의도를 복원한다 (가이드 4.4). */
    private val broadcastIndex = mutableMapOf<String, UnsignedTx>()

    override suspend fun deriveAddress(
        account: Account,
        asset: Asset,
    ): Address = TODO("BIP-32/44 경로 + coin type 파생 — 키 트리는 HD 지갑·외부 서명자 소관 (가이드 2.2 · 9)")

    override suspend fun getBalance(
        address: Address,
        asset: Asset,
    ): Amount = TODO("노드 RPC — eth_getBalance(native) / ERC-20 balanceOf (가이드 2.4)")

    /**
     * 조립 — ① [LocalNonceManager.reserve] 로 계정별 순번 점유(직렬화는 어댑터 소관, 가이드 4.3)
     * ② EIP-1559 두 필드(maxFeePerGas · maxPriorityFeePerGas) 책정.
     * 호출자가 [ChainSpecific.Evm.nonce] 를 명시했으면 점유 없이 그대로 쓴다 (재조립·수동 개입 경로).
     */
    override suspend fun buildTransaction(request: TransactionRequest): UnsignedTx {
        val nonce =
            (request.chainSpecific as? ChainSpecific.Evm)?.nonce
                ?: nonceManager.reserve(request.account.value)
        val fee = node.feeData()
        return assemble(request, nonce, fee)
    }

    /** 점유 없는 추정 — nonce 를 예약하지 않는다 (견적마다 순번이 소모되면 안 됨, 가이드 4.2). */
    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate =
        TODO("eth_feeHistory 백분위 기반 low/medium/high 산출 — gasLimit × (base + priority), nonce 예약 없음 (가이드 2.4)")

    /** 전파 — 서명본을 노드에 그대로 제출 (가이드 2.4). 반환된 hash 로 원본을 색인해 재전송에 대비한다. */
    override suspend fun broadcast(signedTx: SignedTx): TxRef {
        val txHash = node.sendRawTransaction(encodeRawTransaction(signedTx))
        inFlightMutex.withLock { broadcastIndex[txHash] = signedTx.unsigned }
        return TxRef(txHash, chainId)
    }

    /** 확정 판정 — N 블록 깊이 (가이드 2.4). */
    override suspend fun confirmations(txRef: TxRef): Confirmation {
        val minedAt =
            node.blockNumberOf(txRef.value)
                ?: return Confirmation(depth = 0, finalized = false, status = TxStatus.Pending(0))
        val depth = (node.latestBlockNumber() - minedAt + 1).toInt()
        val finalized = depth >= FINAL_DEPTH
        return Confirmation(
            depth = depth,
            finalized = finalized,
            status = if (finalized) TxStatus.Confirmed(depth) else TxStatus.Pending(depth),
        )
    }

    /**
     * RBF 재조립 — **같은 nonce** (순번을 건너뛰면 안 된다, 가이드 4.2) + 수수료 인상.
     *
     * EIP-1559 두 필드를 **모두**, 노드가 요구하는 최소 인상률(통상 10%) 이상 올려야
     * 교체가 받아들여진다 (가이드 4.2 Figure 4-2 — 미만이면 replacement underpriced 거절).
     * 수수료 변경 = payload 변경이므로 기존 서명은 무효 — 재서명·재전파는 TxPipeline 이 한다 (가이드 4.4).
     * 지급 의도(to·amount)는 보존하고 수수료·신원만 바꾼다.
     */
    override suspend fun rebuildForResend(
        txRef: TxRef,
        feeBumpStep: Int,
    ): UnsignedTx {
        val (original, baseFee) =
            inFlightMutex.withLock {
                val unsigned =
                    checkNotNull(broadcastIndex[txRef.value]) {
                        "no broadcast record for txRef: ${txRef.value}"
                    }
                val fee =
                    checkNotNull(feesByUnsignedId[unsigned.id]) {
                        "no fee record for unsignedTx: ${unsigned.id}"
                    }
                unsigned to fee
            }
        val nonce =
            checkNotNull((original.chainSpecific as? ChainSpecific.Evm)?.nonce) {
                "evm unsignedTx without nonce: ${original.id}"
            }
        val bumpedFee =
            EvmFeeData(
                maxFeePerGas = bumped(baseFee.maxFeePerGas, feeBumpStep),
                maxPriorityFeePerGas = bumped(baseFee.maxPriorityFeePerGas, feeBumpStep),
            )
        return assemble(original.request, nonce, bumpedFee)
    }

    private suspend fun assemble(
        request: TransactionRequest,
        nonce: Long,
        fee: EvmFeeData,
    ): UnsignedTx {
        val unsigned =
            UnsignedTx(
                // 같은 (계정, nonce, 수수료) = 같은 트랜잭션 — 수수료가 바뀌면 새 신원 (가이드 4.4)
                id = "evm:${request.account.value}:$nonce:${fee.maxFeePerGas}",
                request = request,
                chainId = chainId,
                signingPayload = encodeSigningPayload(request, nonce, fee),
                chainSpecific = ChainSpecific.Evm(nonce),
            )
        inFlightMutex.withLock { feesByUnsignedId[unsigned.id] = fee }
        return unsigned
    }

    private fun encodeSigningPayload(
        request: TransactionRequest,
        nonce: Long,
        fee: EvmFeeData,
    ): ByteArray = TODO("EIP-1559 직렬화 → keccak256 sighash — secp256k1 · RSV (가이드 5.4)")

    private fun encodeRawTransaction(signedTx: SignedTx): ByteArray =
        TODO("RSV 서명 부착 + RLP 인코딩 → raw transaction (가이드 5.4)")

    /** 단계당 최소 인상률 이상 복리 인상 — step 만큼 (110/100)^step. */
    private fun bumped(
        fee: BigInteger,
        step: Int,
    ): BigInteger {
        var value = fee
        repeat(step.coerceAtLeast(1)) {
            value = value * BigInteger.valueOf(100L + MIN_BUMP_PERCENT) / BigInteger.valueOf(100L)
        }
        return value
    }

    private companion object {
        /** 노드 replacement 최소 인상률 — geth 기본 10% (가이드 4.2 Figure 4-2 "통상 10%"). */
        const val MIN_BUMP_PERCENT = 10L

        /** N 블록 확정 기준 — 운영 정책·자산 가치에 따라 조정 (가이드 3.3). */
        const val FINAL_DEPTH = 12
    }
}
