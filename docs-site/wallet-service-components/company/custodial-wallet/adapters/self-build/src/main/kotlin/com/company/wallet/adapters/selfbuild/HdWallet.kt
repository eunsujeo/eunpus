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

    /**
     * 발급(등록)된 주소의 조회 — 발급 장부에서 읽기만 한다, 절대 새 주소를 만들지 않는다 (가이드 9.1 불변식).
     * 재계산(bip32)은 검증·복구용으로만 — 등록 안 된 주소가 나가면 인덱서가 입금을 놓친다 (가이드 9.4).
     */
    suspend fun issuedAddressOf(
        account: Account,
        asset: Asset,
    ): Address

    /** 발급용 — 다음 address index 를 소비해 곡선별로 계산 (가이드 15.3 ④). 디렉터리·watch-list 등록은 호출자(포트) 소관. */
    suspend fun deriveNextAddress(
        account: Account,
        asset: Asset,
    ): Address
}

/** xpub 파생 스텁 — 키 인프라(HSM·시드) 경계. */
class Bip44HdWallet : HdWallet {
    override suspend fun allocateAccount(ref: AccountRef): Account = TODO("HD account index 할당 — 영속 디렉터리 경계 (가이드 15.2)")

    override suspend fun issuedAddressOf(
        account: Account,
        asset: Asset,
    ): Address = TODO("발급 장부(디렉터리) 조회 — 가이드 15.2 addressOf")

    override suspend fun deriveNextAddress(
        account: Account,
        asset: Asset,
    ): Address = TODO("다음 index 소비 + 곡선별 계산 — 2.4 DepositAddressDerivationCapability 경유 (가이드 15.3)")
}
