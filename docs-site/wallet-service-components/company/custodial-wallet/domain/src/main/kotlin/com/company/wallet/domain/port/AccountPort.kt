package com.company.wallet.domain.port

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance

/**
 * 계정·주소 포트 — 키가 있는 곳 (가이드 13.3).
 *
 * 구현: Fireblocks(vault) · 자체 HD 지갑+HSM · NodeWallet. 시그니처가 이 한 곳에 있으므로
 * 어댑터가 어긋나면 컴파일에서 잡힌다 (가이드 17.3).
 */
interface AccountPort {
    /** 고객 계정(vault) 생성. */
    suspend fun createAccount(ref: AccountRef): Account

    /**
     * 이 계정의 수신 주소 — 멱등 "조회" (가이드 13.3). 발급(등록)된 주소만 반환하며
     * **절대 새 주소를 만들지 않는다** — 주소는 watch-list 등록까지 끝나야 존재한다 (가이드 9.1 불변식).
     * 첫 주소부터 발급은 [DepositAddressIssuanceCapability], 발급 동사가 없는 체인(Canton·NodeWallet)은
     * 계정 생성 때 태어난 주소(PartyId 등)를 반환한다.
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
 * UTXO(다음 index)·Fireblocks(generateNewAddress — 부를 때마다 새 주소) 가 구현한다.
 * Canton 은 주소 추가 개념이 없어 부재 — 입금 구분은 memo-ref. NodeWallet 은 지갑당 주소 1개라 부재.
 * [FeeBoostCapability]·[CancelCapability] 와 같은 패턴 — "미지원은 타입 부재".
 * 발급 = 주소 생성 + 계정 디렉터리 저장 + 인덱서 watch-list 등록(가이드 9.4)까지가 한 흐름.
 */
interface DepositAddressIssuanceCapability {
    suspend fun issueDepositAddress(
        account: Account,
        asset: Asset,
    ): Address
}
