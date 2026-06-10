package com.company.wallet.adapters.selfbuild

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset

/**
 * HD 지갑 경계 — account index 할당 + xpub 파생 (가이드 15.2).
 *
 * 파생에는 xpub(확장 공개키)을 쓰므로 개인키는 HSM 밖으로 나오지 않는다 —
 * 키는 HSM 안, 여기서는 공개키/주소만 다룬다 (가이드 15.3).
 * Fireblocks 의 vault 생성·주소 파생을 우리가 직접 지는 자리다.
 */
interface HdWallet {
    /** 고객 계정 발급 — HD account index 할당 (내부 장부). 온체인 트랜잭션이 아니다 (전파·수수료 없음). */
    suspend fun allocateAccount(ref: AccountRef): Account

    /** 자산별 주소 파생 — BIP-32/44, xpub 기반 (체인별 정규화 포함). */
    suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address
}

/** xpub 파생 스텁 — 키 인프라(HSM·시드) 경계. */
class Bip44HdWallet : HdWallet {
    override suspend fun allocateAccount(ref: AccountRef): Account = TODO("HD account index 할당 — 영속 디렉터리 경계 (가이드 15.2)")

    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address = TODO("BIP-32/44 xpub 파생 — 키는 HSM 밖으로 나오지 않는다 (가이드 15.3)")
}
