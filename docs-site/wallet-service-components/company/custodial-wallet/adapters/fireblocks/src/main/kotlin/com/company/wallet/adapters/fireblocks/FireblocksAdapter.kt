package com.company.wallet.adapters.fireblocks

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import com.company.wallet.domain.model.ChainEvent
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.ChainSpecific
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.port.AccountPort
import com.company.wallet.domain.port.CancelCapability
import com.company.wallet.domain.port.FeeBoostCapability
import com.company.wallet.domain.port.TransactionPort
import com.company.wallet.shared.address.AddressRules
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Fireblocks custody 어댑터 — Account·Transaction 두 포트 + fee boost (가이드 14).
 *
 * 얇은 어댑터다 — 포트 메서드가 거의 그대로 Fireblocks 호출 하나씩으로 매핑된다 (가이드 14.2).
 * [submitTransaction] 은 `createTransaction` 한 번으로 끝난다 — 빌드·MPC 서명·전파·nonce 가
 * Fireblocks 안에 묶여 있어, 자체 구축처럼 "조립 → 서명 → 전파" 3단계를 밟지 않는다.
 * raw nonce 를 직접 돌리면 Fireblocks 내부 nonce 와 충돌하므로 만들지 않는다 (가이드 14.6).
 *
 * 임의 외부 주소·커스텀 조회(ChainQueryPort)는 Fireblocks 가 주지 않는다 — 필요하면
 * 자체 인덱서·Alchemy 어댑터를 그 포트만 따로 붙인다 (가이드 13.4 하이브리드).
 */
class FireblocksAdapter(
    private val client: FireblocksClient,
) : AccountPort, TransactionPort, FeeBoostCapability, CancelCapability {
    /** ref → vault id 매핑 캐시. TODO: 영속 매핑 저장소에서 로드 (재기동 생존). */
    private val vaultIdsByRef = ConcurrentHashMap<AccountRef, String>()
    private val handlers = CopyOnWriteArrayList<ChainEventHandler>()

    override suspend fun createAccount(ref: AccountRef): Account {
        val vault = client.createVaultAccount(name = ref.value)
        vaultIdsByRef[ref] = vault.id
        return Account(id = vault.id, ref = ref)
    }

    override suspend fun deriveAddress(
        account: Account,
        asset: Asset,
    ): Address {
        val derived = client.generateNewAddress(vaultAccountId = account.id, assetId = assetIdOf(asset))
        return Address(value = derived.address, asset = asset, memoTag = derived.tag)
    }

    /** 잔액 — Fireblocks 의 available/pending/locked 구분 응답을 그대로 [Balance] 로 (가이드 13.3 · 14.2). */
    override suspend fun getBalance(
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
     * Canton 에선 이 호출이 OFFER 제출이다 — 이후 상태는 [getStatus] 의 AwaitingCounterparty (가이드 14.8).
     */
    override suspend fun submitTransaction(request: TransactionRequest): TxRef {
        val tx = client.createTransaction(toCreateParams(request))
        return TxRef(value = tx.id, chainId = request.asset.chainId)
    }

    override suspend fun getStatus(txRef: TxRef): TxStatus {
        val tx = client.getTransaction(txRef.value)
        return fireblocksStatusToTxStatus(
            status = tx.status,
            numOfConfirmations = tx.numOfConfirmations,
            cantonTransactionType = tx.cantonTransactionType,
            traceableId = tx.traceableId,
        )
    }

    /** 취소(CancelCapability) — drop(boost) 과 별도 엔드포인트 (가이드 14.7). */
    override suspend fun cancel(txRef: TxRef): TxRef {
        client.cancelTransaction(txRef.value)
        return txRef
    }

    /** 부스트(RBF/drop & replace) — EVM/UTXO 만, Solana/Canton 은 Fireblocks 가 거절 (가이드 4.4). */
    override suspend fun boost(txRef: TxRef): TxRef {
        val replaced = client.boostTransaction(txRef.value)
        return TxRef(value = replaced.id, chainId = txRef.chainId)
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

    private fun toCreateParams(request: TransactionRequest): FireblocksCreateTransactionParams {
        val canton = request.chainSpecific as? ChainSpecific.Canton
        return FireblocksCreateTransactionParams(
            assetId = assetIdOf(request.asset),
            sourceVaultId = vaultOf(request.account),
            destinationAddress = request.to.value,
            destinationTag = request.to.memoTag,
            amountMinorUnits = request.amount.minorUnits,
            externalTxId = request.idempotencyKey,
            cantonTransactionType = canton?.transactionType?.name,
        )
    }
}
