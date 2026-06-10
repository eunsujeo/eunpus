package com.company.wallet.adapters.fireblocks

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainEvent
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.TxRef
import java.math.BigInteger

/**
 * Webhook v2 이벤트 payload 발췌 (가이드 14.7 — v1 은 2026-06-15 EOL, 신규 구축은 v2).
 *
 * v2 는 이벤트 이름이 점 표기다 — `transaction.created` · `transaction.status.updated`.
 */
data class FireblocksWebhookPayload(
    val eventType: String,
    val txId: String,
    val assetId: String,
    val chainId: String,
    /** INCOMING(내 vault 로 수신) / OUTGOING(내 vault 발신). */
    val direction: String,
    val status: String,
    val address: String,
    val addressTag: String? = null,
    val amountMinorUnits: BigInteger,
    val decimals: Int,
    val numOfConfirmations: Int = 0,
    val cantonTransactionType: String? = null,
    val traceableId: String? = null,
)

/**
 * Fireblocks webhook → 정규화 [ChainEvent] 매핑 (가이드 14.4 · 14.5).
 *
 * Fireblocks 가 vault 범위의 수집 job 을 대신 돌려 webhook 으로 push 하므로 우리는 수신만 한다 —
 * 이 이벤트를 "입금" 으로 해석하는 것은 비즈니스 레이어 몫이다 (가이드 0.2).
 */
class FireblocksWebhookMapper {
    /**
     * raw JSON → payload — 외부 I/O 경계 (JSON 파서 + webhook 서명 검증).
     * TODO: 서명 검증 실패 시 거절 — 위변조·재생 방지 (가이드 8.4).
     */
    fun parse(rawJson: String): FireblocksWebhookPayload = TODO("Webhook v2 JSON 파싱 + 서명 검증 (가이드 14.7)")

    /** 관심 이벤트(transaction.created / transaction.status.updated)만 [ChainEvent] 로 — 그 외 null. */
    fun map(payload: FireblocksWebhookPayload): ChainEvent? {
        if (payload.eventType !in HANDLED_EVENT_TYPES) {
            return null
        }
        val asset = Asset(symbol = payload.assetId, chainId = ChainId(payload.chainId))
        val txRef = TxRef(value = payload.txId, chainId = asset.chainId)
        val address = Address(value = payload.address, asset = asset, memoTag = payload.addressTag)
        val amount = Amount(minorUnits = payload.amountMinorUnits, decimals = payload.decimals)
        return when (payload.direction) {
            "INCOMING" -> mapIncoming(payload, txRef, address, asset, amount)
            "OUTGOING" ->
                ChainEvent.OutgoingStatusChanged(
                    txRef = txRef,
                    address = address,
                    asset = asset,
                    amount = amount,
                    status =
                        fireblocksStatusToTxStatus(
                            status = payload.status,
                            numOfConfirmations = payload.numOfConfirmations,
                            cantonTransactionType = payload.cantonTransactionType,
                            traceableId = payload.traceableId,
                        ),
                )
            else -> null
        }
    }

    /** 수신 방향 — 입금 상태 전이(PENDING / CONFIRMED / ORPHANED, 가이드 10.2)로 매핑. */
    private fun mapIncoming(
        payload: FireblocksWebhookPayload,
        txRef: TxRef,
        address: Address,
        asset: Asset,
        amount: Amount,
    ): ChainEvent =
        when (payload.status) {
            // 확정 — DCCP(입금 확정 정책) 기준 충족 (가이드 14.5)
            "COMPLETED" ->
                ChainEvent.IncomingConfirmed(
                    txRef = txRef,
                    address = address,
                    asset = asset,
                    amount = amount,
                    confirmations = payload.numOfConfirmations,
                )
            // 사라진 수신 — pending 롤백 + 정정 통지 대상 (가이드 10.2 ORPHANED)
            "CANCELLED", "FAILED", "REJECTED", "BLOCKED" ->
                ChainEvent.Orphaned(txRef = txRef, address = address, asset = asset, amount = amount)
            // 감지·확인 중 — 자금 사용 불가, 알림은 "확인 중" 까지만 (가이드 10)
            else ->
                ChainEvent.IncomingDetected(
                    txRef = txRef,
                    address = address,
                    asset = asset,
                    amount = amount,
                    confirmations = payload.numOfConfirmations,
                )
        }

    companion object {
        private val HANDLED_EVENT_TYPES = setOf("transaction.created", "transaction.status.updated")
    }
}
