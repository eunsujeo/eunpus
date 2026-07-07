package com.company.wallet.backend.service.ledger

import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance
import java.math.BigInteger

/**
 * 개발·테스트용 인메모리 고객 원장 (워크스루 8장).
 *
 * 운영에서는 반드시 영속 저장소(DB) 구현으로 교체한다 — 인터페이스는 [CustomerLedger] 그대로.
 * "차감·증가가 한 트랜잭션" 같은 원자성은 여기서는 프로세스 내 잠금으로 흉내내고,
 * DB 구현에서는 DB 트랜잭션이 맡는다.
 */
class InMemoryCustomerLedger : CustomerLedger {
    private data class Key(val accountId: String, val symbol: String, val chainId: String)

    private class Cells(var decimals: Int) {
        var available: BigInteger = BigInteger.ZERO
        var pending: BigInteger = BigInteger.ZERO
        var locked: BigInteger = BigInteger.ZERO
    }

    private class DepositState(
        val key: Key,
        val asset: Asset,
        val amount: Amount,
        var confirmed: Boolean,
        var reverted: Boolean = false,
    )

    private val cellsByKey = HashMap<Key, Cells>()
    private val depositsByTxId = HashMap<String, DepositState>()
    private val appliedRequestIds = HashSet<String>()
    private val entries = mutableListOf<LedgerEntry>()
    private val lock = Any()

    override suspend fun balanceOf(
        accountId: String,
        asset: Asset,
    ): Balance =
        synchronized(lock) {
            val c = cellsByKey[keyOf(accountId, asset)] ?: Cells(decimals = 0)
            Balance(
                available = Amount(c.available, c.decimals),
                pending = Amount(c.pending, c.decimals),
                locked = Amount(c.locked, c.decimals),
            )
        }

    override suspend fun entriesOf(
        accountId: String,
        after: Long,
        before: Long,
    ): List<LedgerEntry> =
        synchronized(lock) {
            entries.filter { it.accountId == accountId && it.occurredAt in after..before }
        }

    override suspend fun applyDeposit(
        accountId: String,
        asset: Asset,
        amount: Amount,
        txId: String,
        confirmed: Boolean,
    ) = synchronized(lock) {
        val key = keyOf(accountId, asset)
        val existing = depositsByTxId[txId]
        when {
            existing == null -> {
                val c = cellsOf(key, amount.decimals)
                if (confirmed) c.available += amount.minorUnits else c.pending += amount.minorUnits
                depositsByTxId[txId] = DepositState(key, asset, amount, confirmed)
                record(accountId, asset, amount, if (confirmed) LedgerEntryKind.DEPOSIT_CONFIRMED else LedgerEntryKind.DEPOSIT_PENDING, txId)
            }
            // 대기 → 가용 전이 — 같은 txId 의 확정 알림 (그 외 재수신은 멱등 no-op)
            confirmed && !existing.confirmed && !existing.reverted -> {
                val c = cellsOf(key, amount.decimals)
                c.pending -= existing.amount.minorUnits
                c.available += existing.amount.minorUnits
                existing.confirmed = true
                record(accountId, asset, existing.amount, LedgerEntryKind.DEPOSIT_CONFIRMED, txId)
            }
            else -> Unit
        }
    }

    override suspend fun revertDeposit(txId: String) =
        synchronized(lock) {
            val d = depositsByTxId[txId]
            if (d == null || d.reverted) return
            val c = cellsOf(d.key, d.amount.decimals)
            if (d.confirmed) c.available -= d.amount.minorUnits else c.pending -= d.amount.minorUnits
            d.reverted = true
            record(d.key.accountId, d.asset, d.amount, LedgerEntryKind.DEPOSIT_REVERTED, txId)
        }

    override suspend fun lockForWithdrawal(
        accountId: String,
        asset: Asset,
        amount: Amount,
        requestId: String,
    ) = synchronized(lock) {
        if ("lock:$requestId" in appliedRequestIds) return
        val c = cellsOf(keyOf(accountId, asset), amount.decimals)
        if (c.available < amount.minorUnits) throw InsufficientAvailableException(accountId)
        c.available -= amount.minorUnits
        c.locked += amount.minorUnits
        appliedRequestIds += "lock:$requestId"
        record(accountId, asset, amount, LedgerEntryKind.WITHDRAWAL_LOCKED, requestId)
    }

    override suspend fun transfer(
        fromAccountId: String,
        toAccountId: String,
        asset: Asset,
        amount: Amount,
        requestId: String,
    ) = synchronized(lock) {
        if ("transfer:$requestId" in appliedRequestIds) return
        val from = cellsOf(keyOf(fromAccountId, asset), amount.decimals)
        if (from.available < amount.minorUnits) throw InsufficientAvailableException(fromAccountId)
        val to = cellsOf(keyOf(toAccountId, asset), amount.decimals)
        from.available -= amount.minorUnits
        to.available += amount.minorUnits
        appliedRequestIds += "transfer:$requestId"
        record(fromAccountId, asset, amount, LedgerEntryKind.TRANSFER_OUT, requestId)
        record(toAccountId, asset, amount, LedgerEntryKind.TRANSFER_IN, requestId)
    }

    private fun keyOf(
        accountId: String,
        asset: Asset,
    ) = Key(accountId, asset.symbol, asset.chainId.value)

    private fun cellsOf(
        key: Key,
        decimals: Int,
    ): Cells = cellsByKey.getOrPut(key) { Cells(decimals) }

    private fun record(
        accountId: String,
        asset: Asset,
        amount: Amount,
        kind: LedgerEntryKind,
        refId: String,
    ) {
        entries += LedgerEntry(accountId, asset, amount, kind, refId, System.currentTimeMillis())
    }
}
