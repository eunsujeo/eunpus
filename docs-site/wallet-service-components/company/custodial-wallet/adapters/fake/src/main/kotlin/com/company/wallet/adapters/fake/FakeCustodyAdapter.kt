package com.company.wallet.adapters.fake

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.BlockRange
import com.company.wallet.domain.model.ChainEvent
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.CancelCapability
import com.company.wallet.domain.port.DepositAddressIssuanceCapability
import com.company.wallet.domain.port.FeeBoostCapability
import com.company.wallet.domain.port.TransactionPort
import java.math.BigInteger
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.atomic.AtomicLong

/**
 * 벤더 없는 가짜 custody 어댑터 — 라이브 [com.company.wallet.adapters.fireblocks.FireblocksAdapter] 와
 * 똑같은 포트(Account·Transaction + 세 capability)를 인메모리로 채운다 (가이드 17.2 · 17.3).
 *
 * 목적은 둘이다 — (1) 계약 테스트: 같은 포트 테스트를 fake 와 fireblocks 가 함께 통과하면 포트
 * 의미가 구현과 무관함이 증명된다. (2) 벤더 자격증명 없이 두 백엔드(Service·Admin)를 굴려 본다.
 *
 * 결정성만 있으면 되므로 서명·전파·확정은 흉내만 낸다 — 여기엔 실제 키도, 네트워크도 없다.
 * 자체 구축의 HD/인덱서/HSM 내부는 담지 않는다(그건 훗날 engine/*·chains/* 자리, 가이드 17.5).
 */
class FakeCustodyAdapter :
    AccountPort,
    TransactionPort,
    FeeBoostCapability,
    CancelCapability,
    DepositAddressIssuanceCapability {
    private val accountsByRef = ConcurrentHashMap<AccountRef, Account>()

    /** account.id -> (asset.symbol -> issued addresses). 발급 순서대로 쌓인다. */
    private val addresses = ConcurrentHashMap<String, MutableList<Address>>()
    private val balances = ConcurrentHashMap<String, Balance>()
    private val statuses = ConcurrentHashMap<String, TxStatus>()
    private val handlers = CopyOnWriteArrayList<ChainEventHandler>()
    private val seq = AtomicLong(0)

    override suspend fun createAccount(ref: AccountRef): Account =
        accountsByRef.getOrPut(ref) { Account(id = "fake-vault-${seq.incrementAndGet()}", ref = ref) }

    /** 조회 — 발급된 주소만 반환한다. 없으면 발급 전이므로 예외 (가이드 9.1 불변식). 새 주소를 만들지 않는다. */
    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address =
        addresses[account.id]?.lastOrNull { it.asset == asset }
            ?: error("no issued address for ${account.id}/${asset.symbol} — issueDepositAddress first (가이드 9.1)")

    /** 발급 — 부를 때마다 새 결정적 주소를 만든다(fireblocks generateNewAddress 와 동형). */
    override suspend fun issueDepositAddress(
        account: Account,
        asset: Asset,
    ): Address {
        val list = addresses.getOrPut(account.id) { CopyOnWriteArrayList() }
        val next = Address(value = "0xfake${account.id}-${asset.symbol}-${list.size}", asset = asset)
        list += next
        return next
    }

    override suspend fun getBalance(
        account: Account,
        asset: Asset,
    ): Balance =
        balances[balanceKey(account, asset)]
            ?: Balance(Amount.zero(asset.decimalsHint()), Amount.zero(asset.decimalsHint()), Amount.zero(asset.decimalsHint()))

    /** 검증은 벤더가 아니라 로컬 규칙이 하는 자리다 — 가짜는 형식만 최소 확인 (가이드 13.3). */
    override suspend fun validateAddress(
        asset: Asset,
        address: Address,
    ): Boolean = address.value.isNotBlank()

    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate {
        val d = request.asset.decimalsHint()
        return FeeEstimate(
            low = Amount(BigInteger.valueOf(1), d),
            medium = Amount(BigInteger.valueOf(2), d),
            high = Amount(BigInteger.valueOf(3), d),
        )
    }

    override suspend fun submitTransaction(request: TransactionRequest): TxRef {
        val txRef = TxRef(value = "fake-tx-${seq.incrementAndGet()}", chainId = request.asset.chainId)
        statuses[txRef.value] = TxStatus.Pending(confirmations = 0)
        return txRef
    }

    override suspend fun getStatus(txRef: TxRef): TxStatus =
        statuses[txRef.value] ?: TxStatus.Failed(reason = "unknown tx: ${txRef.value}")

    override suspend fun transactionsOf(
        account: Account,
        range: BlockRange,
    ): List<Transfer> = emptyList()

    override suspend fun boost(txRef: TxRef): TxRef {
        statuses[txRef.value] = TxStatus.Pending(confirmations = 0)
        return txRef
    }

    override suspend fun cancel(txRef: TxRef): TxRef {
        statuses[txRef.value] = TxStatus.Cancelled
        return txRef
    }

    override fun onChainEvent(handler: ChainEventHandler): Subscription {
        handlers += handler
        return Subscription { handlers -= handler }
    }

    /** 테스트가 이벤트를 흘려 넣어 백엔드 팬아웃 경로를 확인할 때 쓴다 (fireblocks 의 webhook dispatch 대응). */
    suspend fun emit(event: ChainEvent) {
        for (handler in handlers) {
            handler.onEvent(event)
        }
    }

    private fun balanceKey(
        account: Account,
        asset: Asset,
    ): String = "${account.id}:${asset.symbol}"

    /** 가짜는 자산 소수 자릿수를 모른다 — EVM 기본값만 둔다. */
    private fun Asset.decimalsHint(): Int = 18
}
