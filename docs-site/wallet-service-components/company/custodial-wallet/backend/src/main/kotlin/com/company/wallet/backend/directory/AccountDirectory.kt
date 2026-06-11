package com.company.wallet.backend.directory

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.Address

/**
 * 계정 디렉터리 — 발급 결과(계정·주소 매핑)는 백엔드가 저장·소유한다 (가이드 9.3 · 17.2).
 *
 * 벤더 교체 후에도 남는 우리 데이터다 — 계정 해석 시 벤더에 다시 묻지 않는다 (가이드 9.3).
 * 게이트웨이는 createAccount/addressOf·issueDepositAddress 성공 시 여기 기록하고, 이후 모든 계정 해석은
 * [findById] 로 끝낸다. custody 어댑터가 무엇이든 디렉터리 내용은 흔들리지 않는다.
 */
interface AccountDirectory {
    suspend fun save(account: Account)

    suspend fun saveAddress(
        account: Account,
        address: Address,
    )

    suspend fun findById(id: String): Account?

    suspend fun addressesOf(id: String): List<Address>
}

/** 디렉터리에 없는 계정 — HTTP 404 성격 (가이드 9.3, 벤더 재조회로 보충하지 않는다). */
class AccountNotFoundException(id: String) :
    NoSuchElementException("account not found in directory: $id")
