package com.company.wallet.chains.utxo

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
 * UTXO 어댑터 — coin 선택 · feerate · RBF/CPFP (가이드 2.4).
 *
 * EVM 의 "순번 점유" 에 해당하는 직렬화가 여기서는 **coin 선택 + 선택 UTXO lock** 이다 —
 * 동시 제출이 같은 UTXO 를 집으면 이중지불 충돌이 나므로, 선택과 동시에 잠근다 (가이드 4.3).
 */
class UtxoChainAdapter(
    private val node: UtxoNodeClient,
    override val chainId: ChainId = ChainId.BITCOIN,
) : ChainAdapter {
    /** RBF(수수료 교체) 또는 CPFP(자식 tx 견인)가 가능하다 — StuckWatcher 자동 재전송 대상 (가이드 4.4). */
    override val supportsFeeBump: Boolean = true

    private val stateMutex = Mutex()

    /** 선택된 UTXO lock 집합 (outpoint) — 동시 제출 이중지불 방지 (가이드 4.3). */
    private val lockedOutpoints = mutableSetOf<String>()

    /** unsignedTx.id → 선택 입력·feeRate — RBF 재조립이 같은 입력을 재사용한다. */
    private val selectionByUnsignedId = mutableMapOf<String, CoinSelection>()

    /** txRef.value → 전파한 원본 — 재전송 시 지급 의도·입력 복원 (가이드 4.4). */
    private val broadcastIndex = mutableMapOf<String, UnsignedTx>()

    override suspend fun deriveAddress(
        account: Account,
        asset: Asset,
    ): Address = TODO("BIP-32/44 + 스크립트 유형(P2WPKH 등) 파생 — 키 트리는 HD 지갑·외부 서명자 소관 (가이드 2.2)")

    override suspend fun getBalance(
        address: Address,
        asset: Asset,
    ): Amount = TODO("UTXO 집합 합산 — 인덱서 projection 또는 노드 scantxoutset (가이드 2.2)")

    /**
     * 조립 — coin 선택 + 선택 UTXO lock (가이드 4.3). 큰 코인부터 목표액을 채우는 greedy 선택
     * (실전은 잔돈 최소화·dust 회피 등 정책 추가). 잠긴 UTXO 는 후보에서 제외한다.
     */
    override suspend fun buildTransaction(request: TransactionRequest): UnsignedTx {
        val feeRate =
            (request.chainSpecific as? ChainSpecific.Utxo)?.feeRatePerVByte
                ?: node.feeRatePerVByte()
        val selection = selectAndLockCoins(request.account.value, request.amount.minorUnits, feeRate)
        return assemble(request, selection)
    }

    /** 점유 없는 추정 — UTXO 를 lock 하지 않는 가상 coin 선택으로만 크기를 잰다 (가이드 4.2). */
    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate =
        TODO("UTXO lock 없는 가상 선택으로 vByte 추정 × feeRate(low/medium/high) — estimatesmartfee 백분위 (가이드 2.2)")

    /** 전파 — EVM 과 동일, 서명본을 노드에 그대로 제출 (가이드 2.4). */
    override suspend fun broadcast(signedTx: SignedTx): TxRef {
        val txId = node.sendRawTransaction(encodeRawTransaction(signedTx))
        stateMutex.withLock { broadcastIndex[txId] = signedTx.unsigned }
        return TxRef(txId, chainId)
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
     * RBF 재조립 — 같은 입력(UTXO) 유지 + feeRate 인상 (가이드 4.4).
     *
     * 같은 UTXO 를 쓰는 교체 tx 라서 정확히 하나만 확정된다. 수수료 인상분만큼 잔돈 출력이
     * 줄어들 뿐 지급 의도(to·amount)는 보존한다. 원본이 RBF 불가 신호(opt-out)로 나갔다면
     * 대안은 CPFP — 잔돈 출력을 입력으로 한 고수수료 자식 tx 로 견인한다 (스켈레톤은 RBF 경로만).
     * payload 가 바뀌므로 재서명·재전파는 TxPipeline 이 한다.
     */
    override suspend fun rebuildForResend(
        txRef: TxRef,
        feeBumpStep: Int,
    ): UnsignedTx {
        val (original, selection) =
            stateMutex.withLock {
                val unsigned =
                    checkNotNull(broadcastIndex[txRef.value]) {
                        "no broadcast record for txRef: ${txRef.value}"
                    }
                val sel =
                    checkNotNull(selectionByUnsignedId[unsigned.id]) {
                        "no coin selection record for unsignedTx: ${unsigned.id}"
                    }
                unsigned to sel
            }
        // 같은 입력 + 인상된 feeRate — 단계당 최소 인상률 이상 (RBF rule: 기존보다 높은 절대 수수료)
        val bumpedRate = bumpedFeeRate(selection.feeRatePerVByte, feeBumpStep)
        return assemble(original.request, selection.copy(feeRatePerVByte = bumpedRate))
    }

    private suspend fun selectAndLockCoins(
        account: String,
        target: BigInteger,
        feeRate: Long,
    ): CoinSelection =
        stateMutex.withLock {
            val candidates =
                node.listUnspent(account)
                    .filterNot { it.outpoint in lockedOutpoints }
                    .sortedByDescending { it.value }
            val selected = mutableListOf<Utxo>()
            var total = BigInteger.ZERO
            for (utxo in candidates) {
                selected += utxo
                total += utxo.value
                // 단순화 — 실전은 target + 추정 수수료(입출력 vByte × feeRate) 까지 채운다
                if (total >= target) break
            }
            check(total >= target) {
                "insufficient unlocked UTXO: have=$total need=$target account=$account"
            }
            // 선택 UTXO lock — 동시 제출이 같은 코인을 집지 못하게 (가이드 4.3)
            lockedOutpoints += selected.map { it.outpoint }
            CoinSelection(inputs = selected, feeRatePerVByte = feeRate)
        }

    private suspend fun assemble(
        request: TransactionRequest,
        selection: CoinSelection,
    ): UnsignedTx {
        val unsigned =
            UnsignedTx(
                id = "utxo:${request.idempotencyKey}:${selection.feeRatePerVByte}",
                request = request,
                chainId = chainId,
                signingPayload = encodeSigningPayload(request, selection),
                chainSpecific = ChainSpecific.Utxo(selection.feeRatePerVByte),
            )
        stateMutex.withLock { selectionByUnsignedId[unsigned.id] = selection }
        return unsigned
    }

    private fun encodeSigningPayload(
        request: TransactionRequest,
        selection: CoinSelection,
    ): ByteArray = TODO("입력별 sighash(SIGHASH_ALL 등) 직렬화 — 단순화: 실제로는 입력마다 서명 반복 (가이드 5.4)")

    private fun encodeRawTransaction(signedTx: SignedTx): ByteArray = TODO("DER 서명 부착 + raw transaction 직렬화 (가이드 5.4)")

    /** 단계당 최소 인상률 이상 복리 인상 — RBF 는 기존보다 높은 수수료여야 교체된다. */
    private fun bumpedFeeRate(
        feeRate: Long,
        step: Int,
    ): Long {
        var value = feeRate
        repeat(step.coerceAtLeast(1)) {
            value = value * (100L + MIN_BUMP_PERCENT) / 100L
        }
        return maxOf(value, feeRate + step) // 정수 절삭으로 인상이 0 이 되지 않게
    }

    private companion object {
        const val MIN_BUMP_PERCENT = 10L

        /** N 블록 확정 기준 — BTC 통상 3~6, 운영 정책에 따라 조정 (가이드 3.3). */
        const val FINAL_DEPTH = 6
    }
}

/** coin 선택 결과 — RBF 재조립이 같은 입력을 재사용하기 위한 기록. */
private data class CoinSelection(
    val inputs: List<Utxo>,
    val feeRatePerVByte: Long,
)
