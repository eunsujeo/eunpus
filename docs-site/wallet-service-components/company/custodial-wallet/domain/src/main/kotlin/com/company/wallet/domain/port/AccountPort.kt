package com.company.wallet.domain.port

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance

/**
 * 계정·주소 포트 — 키가 있는 곳 (가이드 13.3).
 *
 * 라이브 구현은 Fireblocks(vault) 하나다. 테스트용 가짜(adapters/fake)가 같은 포트를 채워
 * 벤더 없이 계약을 검증한다 (가이드 17.3). 시그니처가 이 한 곳에 있으므로 어댑터가 어긋나면 컴파일에서 잡힌다.
 */
interface AccountPort {
    /** 고객 계정(vault) 생성. */
    suspend fun createAccount(ref: AccountRef): Account

    /**
     * 이 계정의 수신 주소 — 멱등 "조회" (가이드 13.3). 발급(등록)된 주소만 반환하며
     * **절대 새 주소를 만들지 않는다** — 주소는 watch-list 등록까지 끝나야 존재한다 (가이드 9.1 불변식).
     * 첫 식별자부터 발급은 [DepositAddressIssuanceCapability] 다.
     */
    suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address

    /**
     * 잔액 — 단일 숫자가 아니라 [Balance](available·pending·locked) 로 (가이드 13.3).
     * 자금 사용 가능 판정은 available 만 본다.
     */
    suspend fun getBalance(
        account: Account,
        asset: Asset,
    ): Balance

    /** 출금 대상 주소의 형식·체크섬 검증. */
    suspend fun validateAddress(
        asset: Asset,
        address: Address,
    ): Boolean
}

/**
 * 선택 capability — 입금 주소 "발급", 첫 주소부터 이 동사다 (가이드 13.3 · 9.1 · 9.3). 상태를 바꾼다.
 *
 * Fireblocks(generateNewAddress — 부를 때마다 새 주소) 가 구현한다.
 * [FeeBoostCapability]·[CancelCapability] 와 같은 패턴 — "미지원은 타입 부재".
 * 발급 = 식별자 생성 + 계정 디렉터리 저장 + 벤더 측 watch-list 등록(가이드 9.4)까지가 한 흐름.
 */
interface DepositAddressIssuanceCapability {
    suspend fun issueDepositAddress(
        account: Account,
        asset: Asset,
    ): Address
}
