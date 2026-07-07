package com.company.wallet.adapters.fireblocks

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.ChainEvent
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.model.TxStatusFilter
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.CancelCapability
import com.company.wallet.domain.port.DepositAddressIssuanceCapability
import com.company.wallet.domain.port.FeeBoostCapability
import com.company.wallet.domain.port.TransactionPort
import com.company.wallet.shared.address.AddressRules
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Fireblocks custody 어댑터 — Account·Transaction 두 포트 + fee boost (가이드 14).
 *
 * 얇은 어댑터다 — 포트 메서드가 거의 그대로 Fireblocks 호출 하나씩으로 매핑된다 (가이드 14.2).
 * [submitTransaction] 은 `createTransaction` 한 번으로 끝난다 — 빌드·MPC 서명(+온프렘 API Co-signer)·전파·nonce 가
 * Fireblocks 안에 묶여 있어, 자체 구축처럼 "조립 → 서명 → 전파" 3단계를 밟지 않는다.
 * raw nonce 를 직접 돌리면 Fireblocks 내부 nonce 와 충돌하므로 만들지 않는다 (가이드 14.6).
 * 서명 직전 승인·거부 게이트(온프렘 Co-signer Callback Handler)는 벤더에 위임되지 않는 우리 몫이다 (가이드 5).
 *
 * 임의 외부 주소·커스텀 조회(ChainQueryPort)는 Fireblocks 가 주지 않는다 — 필요하면
 * 자체 인덱서·Alchemy 어댑터를 그 포트만 따로 붙인다 (가이드 13.4 하이브리드).
 */
class FireblocksAdapter(
    private val client: FireblocksClient,
) : AccountPort, TransactionPort, FeeBoostCapability, CancelCapability, DepositAddressIssuanceCapability {
    /** ref → vault id 매핑 캐시. TODO: 영속 매핑 저장소에서 로드 (재기동 생존). */
    private val vaultIdsByRef = ConcurrentHashMap<AccountRef, String>()
    private val handlers = CopyOnWriteArrayList<ChainEventHandler>()

    override suspend fun createAccount(ref: AccountRef): Account {
        val vault = client.createVaultAccount(name = ref.value)
        vaultIdsByRef[ref] = vault.id
        return Account(id = vault.id, ref = ref)
    }

    /** 조회 — vault 자산의 기존(기본) 입금 주소 (가이드 13.3 addressOf). 상태를 바꾸지 않는다. */
    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address {
        val existing = client.listDepositAddresses(vaultAccountId = account.id, assetId = assetIdOf(asset)).first()
        return Address(value = existing.address, asset = asset, memoTag = existing.tag)
    }

    /** 발급 capability — generateNewAddress 는 부를 때마다 새 주소를 만든다 (가이드 14.2 · 9.3). */
    override suspend fun issueDepositAddress(
        account: Account,
        asset: Asset,
    ): Address {
        val issued = client.generateNewAddress(vaultAccountId = account.id, assetId = assetIdOf(asset))
        return Address(value = issued.address, asset = asset, memoTag = issued.tag)
    }

    /** 잔액 — Fireblocks 의 available/pending/locked 구분 응답을 그대로 [Balance] 로 (가이드 13.3 · 14.2). */
    override suspend fun balanceOf(
        account: Account,
        asset: Asset,
    ): Balance {
        val vaultAsset = client.getVaultAccountAsset(vaultAccountId = account.id, assetId = assetIdOf(asset))
        return Balance(
            available = Amount(vaultAsset.availableMinorUnits, vaultAsset.decimals),
            pending = Amount(vaultAsset.pendingMinorUnits, vaultAsset.decimals),
            locked = Amount(vaultAsset.lockedMinorUnits, vaultAsset.decimals),
        )
    }

    /** 로컬 체인 규칙으로 검증 — 벤더 API 를 호출하지 않는다 (가이드 13.3 · 14). */
    override suspend fun validateAddress(
        asset: Asset,
        address: Address,
    ): Boolean = AddressRules.validate(asset, address)

    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate {
        val estimate = client.estimateFee(toCreateParams(request))
        return FeeEstimate(
            low = Amount(estimate.lowMinorUnits, estimate.decimals),
            medium = Amount(estimate.mediumMinorUnits, estimate.decimals),
            high = Amount(estimate.highMinorUnits, estimate.decimals),
        )
    }

    /**
     * 서명+전파 묶음 — `createTransaction` 한 번 (가이드 14.2).
     * 게이트웨이의 멱등 키를 `externalTxId` 로 넘겨 Fireblocks 측 중복 제출도 막는다 (가이드 6.3).
     */
    override suspend fun submitTransaction(request: TransactionRequest): TxRef {
        val tx = client.createTransaction(toCreateParams(request))
        return TxRef(id = tx.id)
    }

    override suspend fun statusOf(txRef: TxRef): TxStatus {
        val tx = client.getTransaction(txRef.id)
        return fireblocksStatusToTxStatus(
            status = tx.status,
            numOfConfirmations = tx.numOfConfirmations,
        )
    }

    /** 내 거래 이력 — GET /v1/transactions (after/before = Unix ms · status 서버측 필터, 가이드 14.2 · 13.3). */
    override suspend fun transactionsOf(
        account: Account,
        after: Long,
        before: Long,
        status: TxStatusFilter?,
    ): List<Transfer> = TODO("vault 기준 거래 목록 조회 — 임의 주소 이력은 ChainQueryPort 소관 (가이드 13.3)")

    /** 취소(CancelCapability) — drop(boost) 과 별도 엔드포인트 (가이드 14.7). */
    override suspend fun cancel(txRef: TxRef): TxRef {
        client.cancelTransaction(txRef.id)
        return txRef
    }

    /** 부스트(drop & replace) — EVM 트랜잭션만 (가이드 4.4). */
    override suspend fun boost(txRef: TxRef): TxRef {
        val replaced = client.boostTransaction(txRef.id)
        return TxRef(id = replaced.id)
    }

    /**
     * 내 지갑 수신·확정 push 구독 — Fireblocks 는 webhook 으로 준다 (가이드 14.5).
     * 어댑터는 폴링하지 않는다 — webhook 수신기가 [dispatch] 로 이벤트를 흘려 넣는다.
     */
    override fun onChainEvent(handler: ChainEventHandler): Subscription {
        handlers += handler
        return Subscription { handlers -= handler }
    }

    /** webhook 수신기 → 등록된 핸들러로 팬인. [FireblocksWebhookMapper] 가 만든 이벤트를 넣는다. */
    suspend fun dispatch(event: ChainEvent) {
        for (handler in handlers) {
            handler.onEvent(event)
        }
    }

    /**
     * 우리 계정 참조 → Fireblocks vault id — custody 특화 식별자는 어댑터 안에 캡슐화하고
     * 코어로 누출하지 않는다 (가이드 13.5).
     */
    private fun vaultOf(ref: AccountRef): String =
        checkNotNull(vaultIdsByRef[ref]) {
            "vault 매핑 없음: ${ref.value} — 영속 매핑 저장소 로드 필요 (가이드 13.5)"
        }

    /** 우리 자산 → Fireblocks assetId. TODO: 자산 사전 매핑 (예: ETH ↔ ETH_TEST5 환경별 id). */
    private fun assetIdOf(asset: Asset): String = asset.symbol

    private fun toCreateParams(request: TransactionRequest): FireblocksCreateTransactionParams =
        FireblocksCreateTransactionParams(
            assetId = assetIdOf(request.asset),
            sourceVaultId = vaultOf(request.from),
            destinationAddress = request.to.value,
            destinationTag = request.to.memoTag,
            amountMinorUnits = request.amount.minorUnits,
            externalTxId = request.externalTxId,
        )
}
