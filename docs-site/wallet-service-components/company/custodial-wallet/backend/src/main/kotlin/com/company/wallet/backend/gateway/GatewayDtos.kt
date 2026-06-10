package com.company.wallet.backend.gateway

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import java.math.BigInteger

/**
 * 게이트웨이 HTTP DTO — 외부 채널과의 계약 (가이드 6).
 *
 * 금액은 체인 최소 단위 정수 문자열로 받는다 — JSON number 의 부동소수점 손실을 피하기 위해 (가이드 0 "돈은 정수").
 */
data class CreateAccountRequest(
    val ref: String,
)

data class AccountResponse(
    val id: String,
    val ref: String,
)

data class DeriveAddressRequest(
    val symbol: String,
    val chainId: String,
)

data class AddressResponse(
    val address: String,
    val memoTag: String?,
)

data class BalanceResponse(
    val minorUnits: String,
    val decimals: Int,
)

data class SubmitTransactionRequest(
    val accountRef: String,
    val toAddress: String,
    val memoTag: String? = null,
    val symbol: String,
    val chainId: String,
    val amountMinorUnits: String,
    val decimals: Int,
)

data class TxRefResponse(
    val txRef: String,
    val chainId: String,
)

data class TxStatusResponse(
    val state: String,
    val confirmations: Int? = null,
    val detail: String? = null,
)

internal fun Account.toResponse(): AccountResponse = AccountResponse(id = id, ref = ref.value)

internal fun Address.toResponse(): AddressResponse = AddressResponse(address = value, memoTag = memoTag)

internal fun Amount.toResponse(): BalanceResponse =
    BalanceResponse(
        minorUnits = minorUnits.toString(),
        decimals = decimals,
    )

internal fun TxRef.toResponse(): TxRefResponse = TxRefResponse(txRef = value, chainId = chainId.value)

/** [TransactionRequest] 조립 — 멱등 키는 헤더에서 받은 것을 그대로 싣는다 (가이드 6.3). */
internal fun SubmitTransactionRequest.toDomain(idempotencyKey: String): TransactionRequest {
    val asset = Asset(symbol = symbol, chainId = ChainId(chainId))
    return TransactionRequest(
        idempotencyKey = idempotencyKey,
        account = AccountRef(accountRef),
        to = Address(value = toAddress, asset = asset, memoTag = memoTag),
        asset = asset,
        amount = Amount(minorUnits = BigInteger(amountMinorUnits), decimals = decimals),
    )
}

/** 정규화된 [TxStatus] 를 외부 표현으로 — sealed 라 when 이 컴파일 시점에 망라된다 (가이드 17.1). */
internal fun TxStatus.toResponse(): TxStatusResponse =
    when (this) {
        is TxStatus.Pending -> TxStatusResponse(state = "PENDING", confirmations = confirmations)
        is TxStatus.Confirmed -> TxStatusResponse(state = "CONFIRMED", confirmations = confirmations)
        TxStatus.Stuck -> TxStatusResponse(state = "STUCK")
        is TxStatus.AwaitingCounterparty -> TxStatusResponse(state = "AWAITING_COUNTERPARTY", detail = traceableId)
        is TxStatus.Failed -> TxStatusResponse(state = "FAILED", detail = reason)
        TxStatus.Cancelled -> TxStatusResponse(state = "CANCELLED")
    }
