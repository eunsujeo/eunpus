package com.company.wallet.backend.directory

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.Address
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

/**
 * 개발·테스트용 인메모리 계정 디렉터리 (가이드 9.3).
 *
 * 발급 결과는 벤더 교체 후에도 남아야 하는 우리 데이터이므로,
 * 운영에서는 반드시 영속 저장소(DB) 구현으로 교체한다 — 인터페이스는 [AccountDirectory] 그대로.
 */
class InMemoryAccountDirectory : AccountDirectory {
    private val accountsById = ConcurrentHashMap<String, Account>()
    private val addressesByAccountId = ConcurrentHashMap<String, CopyOnWriteArrayList<Address>>()

    override suspend fun save(account: Account) {
        accountsById[account.id] = account
    }

    override suspend fun saveAddress(
        account: Account,
        address: Address,
    ) {
        addressesByAccountId.computeIfAbsent(account.id) { CopyOnWriteArrayList() } += address
    }

    override suspend fun findById(id: String): Account? = accountsById[id]

    override suspend fun addressesOf(id: String): List<Address> = addressesByAccountId[id]?.toList() ?: emptyList()
}
