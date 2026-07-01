package com.company.wallet.backend.admin.sweep

import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset

/**
 * 자금 sweep·rebalance 운영 (가이드 17.2 admin — sweep·rebalance).
 *
 * 입금 주소에 쌓인 자금을 콜드/집금 vault 로 모으거나(sweep), vault 간 잔액을 재배치(rebalance)하는
 * 배경 운영 작업이다. 벤더를 바꾸거나 자체 구축으로 전환할 때 주소·잔액이 이전되지 않아 자금을
 * 새 매니저로 옮기는 별도 비용도 이 경로가 진다 (가이드 17.3 · 워크스루 8p).
 *
 * 스켈레톤 — 본문은 TODO. domain 만 의존한다. 실제 이체는 Service 의 출금 경로(포트)를 통하며,
 * Admin 은 어느 계정을 언제 얼마나 sweep 할지 정책만 결정한다.
 */
class SweepService {
    /** 한 계정의 입금 주소 잔액을 집금 대상 주소로 모은다 (가이드 17.2 sweep). */
    suspend fun sweep(
        account: AccountRef,
        asset: Asset,
        destination: Address,
    ): Unit = TODO("sweep 대상 산정 + 승인된 출금 지시 생성 (가이드 11 · 17.2)")

    /** vault 간 잔액 재배치 — 콜드/핫 비율 유지 등 (가이드 17.2 rebalance). */
    suspend fun rebalance(
        from: AccountRef,
        to: AccountRef,
        asset: Asset,
    ): Unit = TODO("rebalance 지시 생성 (가이드 17.2)")
}
