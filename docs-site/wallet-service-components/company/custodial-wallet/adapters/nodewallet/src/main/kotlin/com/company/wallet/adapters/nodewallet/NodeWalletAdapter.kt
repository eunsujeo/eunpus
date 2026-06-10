package com.company.wallet.adapters.nodewallet

import com.company.wallet.domain.error.UnsupportedForChainException
import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainEvent
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.TransactionPort
import com.company.wallet.shared.address.AddressRules

/** Solana lamport 소수점 자릿수. */
private const val LAMPORT_DECIMALS = 9

/**
 * NodeWallet custody 어댑터 — Account·Transaction 두 포트 (가이드 16).
 *
 * Fireblocks 와 같은 custody 자리(옵션 2 를 기성 제품으로), 다른 custody 모델 —
 * 온프렘 HSM+SGX, 키는 고객 보유. 코어는 같은 포트만 보므로 어댑터만 교체된다 (가이드 16.1).
 *
 * ★ [com.company.wallet.domain.port.FeeBoostCapability] 를 구현하지 않는다 — Solana 전용 제품이라
 * fee boost(같은 tx 수수료 교체) 개념이 없다. stuck 은 제품/어댑터의 auto-retry(blockhash 만료 재제출)가
 * 흡수한다 (가이드 16.2 · 4.4). "미지원은 부재" 를 타입으로 — boost 를 호출하는 코드는 컴파일되지 않는다.
 *
 * Solana 외 체인(이더리움·Canton)은 이 어댑터로 못 만든다 — [UnsupportedForChainException].
 * 그 체인은 Fireblocks/자체 구축 어댑터를 병행 배치한다 (가이드 16.7).
 */
class NodeWalletAdapter(
    private val client: NodeWalletClient,
) : AccountPort, TransactionPort {
    override suspend fun createAccount(ref: AccountRef): Account {
        val wallet = client.createWallet(ref.value)
        return Account(id = wallet.walletId, ref = ref)
    }

    override suspend fun deriveAddress(
        account: Account,
        asset: Asset,
    ): Address {
        requireSolana(asset.chainId, "deriveAddress")
        return Address(value = client.address(account.id), asset = asset)
    }

    override suspend fun getBalance(
        account: Account,
        asset: Asset,
    ): Amount {
        requireSolana(asset.chainId, "getBalance")
        return Amount(minorUnits = client.balance(account.id, asset.symbol), decimals = LAMPORT_DECIMALS)
    }

    /** 로컬 체인 규칙으로 검증 — 벤더 API 를 호출하지 않는다 (가이드 13.3 · 16.2). */
    override suspend fun validateAddress(
        asset: Asset,
        address: Address,
    ): Boolean {
        requireSolana(asset.chainId, "validateAddress")
        return AddressRules.validate(asset, address)
    }

    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate {
        requireSolana(request.asset.chainId, "estimateFee")
        val fee = Amount(minorUnits = client.estimateFee(toTransferParams(request)), decimals = LAMPORT_DECIMALS)
        // Solana 는 EVM 식 fee market 이 아니다 — 제품 산정 단일값을 3단계로 그대로 (가이드 16.2)
        return FeeEstimate(low = fee, medium = fee, high = fee)
    }

    /** 제출 한 번 — 제품 내부 3-키 다중서명(개시 → 승인 → SGX 실행) 후 전파 (가이드 16.4). */
    override suspend fun submitTransaction(request: TransactionRequest): TxRef {
        requireSolana(request.asset.chainId, "submitTransaction")
        val transfer = client.submitTransfer(toTransferParams(request))
        return TxRef(value = transfer.txRef, chainId = ChainId.SOLANA)
    }

    override suspend fun getStatus(txRef: TxRef): TxStatus {
        requireSolana(txRef.chainId, "getStatus")
        return toTxStatus(client.getTransfer(txRef.value))
    }

    override suspend fun cancel(txRef: TxRef): TxRef {
        requireSolana(txRef.chainId, "cancel")
        client.cancelTransfer(txRef.value)
        return txRef
    }

    /** 수신·확정 이벤트 — NodeWallet 자체 원장·입금 검증의 push 를 정규화해 흘린다 (가이드 16.2). */
    override fun onChainEvent(handler: ChainEventHandler): Subscription {
        val registration =
            client.onLedgerEvent { event ->
                handler.onEvent(toChainEvent(event))
            }
        return Subscription { registration.close() }
    }

    /** Solana 전용 가드 — 다른 체인 요청은 타입 에러가 아니라 명시적 거절로 (가이드 16.6). */
    private fun requireSolana(
        chainId: ChainId,
        operation: String,
    ) {
        if (chainId != ChainId.SOLANA) {
            throw UnsupportedForChainException(operation, chainId)
        }
    }

    private fun toTransferParams(request: TransactionRequest): NodeWalletTransferParams =
        NodeWalletTransferParams(
            // 스켈레톤 단순화 — ref 를 walletId 로 사용. TODO: ref → walletId 영속 매핑 (가이드 13.5)
            walletId = request.account.value,
            toAddress = request.to.value,
            amountLamports = request.amount.minorUnits,
            idempotencyKey = request.idempotencyKey,
        )

    private fun toTxStatus(transfer: NodeWalletTransfer): TxStatus =
        when (transfer.status) {
            "PENDING", "PROCESSING" -> TxStatus.Pending(confirmations = transfer.confirmations)
            "CONFIRMED", "FINALIZED" -> TxStatus.Confirmed(confirmations = transfer.confirmations)
            "CANCELLED" -> TxStatus.Cancelled
            // blockhash 만료 — 제품/어댑터 auto-retry 대상, fee boost 가 아니다 (가이드 4.4)
            "EXPIRED" -> TxStatus.Failed(reason = "blockhash expired — auto-retry 대상")
            "FAILED" -> TxStatus.Failed(reason = "nodewallet status: ${transfer.status}")
            else -> TxStatus.Pending(confirmations = transfer.confirmations)
        }

    private fun toChainEvent(event: NodeWalletLedgerEvent): ChainEvent {
        val asset = Asset(symbol = event.symbol, chainId = ChainId.SOLANA)
        val txRef = TxRef(value = event.txRef, chainId = ChainId.SOLANA)
        val address = Address(value = event.address, asset = asset)
        val amount = Amount(minorUnits = event.amountLamports, decimals = LAMPORT_DECIMALS)
        return when {
            event.direction == "INCOMING" && event.status in setOf("CONFIRMED", "FINALIZED") ->
                ChainEvent.IncomingConfirmed(
                    txRef = txRef,
                    address = address,
                    asset = asset,
                    amount = amount,
                    confirmations = event.confirmations,
                )
            event.direction == "INCOMING" ->
                ChainEvent.IncomingDetected(
                    txRef = txRef,
                    address = address,
                    asset = asset,
                    amount = amount,
                    confirmations = event.confirmations,
                )
            else ->
                ChainEvent.OutgoingStatusChanged(
                    txRef = txRef,
                    address = address,
                    asset = asset,
                    amount = amount,
                    status = toTxStatus(NodeWalletTransfer(event.txRef, event.status, event.confirmations)),
                )
        }
    }
}
