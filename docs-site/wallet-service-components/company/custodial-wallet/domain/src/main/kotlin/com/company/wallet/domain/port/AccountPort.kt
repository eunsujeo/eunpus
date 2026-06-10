package com.company.wallet.domain.port

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset

/**
 * 계정·주소 포트 — 키가 있는 곳 (가이드 13.3).
 *
 * 구현: Fireblocks(vault) · 자체 HD 지갑+HSM · NodeWallet. 시그니처가 이 한 곳에 있으므로
 * 어댑터가 어긋나면 컴파일에서 잡힌다 (가이드 17.3).
 */
interface AccountPort {
    /** 고객 계정(vault) 생성. */
    suspend fun createAccount(ref: AccountRef): Account

    /** 자산별 입금 주소 파생. */
    suspend fun deriveAddress(
        account: Account,
        asset: Asset,
    ): Address

    suspend fun getBalance(
        account: Account,
        asset: Asset,
    ): Amount

    /** 출금 대상 주소의 형식·체크섬 검증. */
    suspend fun validateAddress(
        asset: Asset,
        address: Address,
    ): Boolean
}
