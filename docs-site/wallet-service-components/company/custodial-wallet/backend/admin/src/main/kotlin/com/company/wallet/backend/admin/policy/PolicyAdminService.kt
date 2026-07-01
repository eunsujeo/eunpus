package com.company.wallet.backend.admin.policy

import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset

/**
 * 정책·승인·동결 운영 (가이드 17.2 admin — 정책·승인·키 운영·동결).
 *
 * Admin 백엔드는 Service(고객 런타임)와 물리 분리된 권한·감사 경계다. 여기서 다루는 것은
 * 출금 정책(목적지 화이트리스트·한도)·승인 워크플로우·계정 동결 같은 거버넌스 조작이며,
 * 실제 정책 집행 지점(서명 직전 게이트)은 온프렘 Co-signer 다 (가이드 5). 이 서비스는 그 정책의
 * 원장·승인 상태를 관리한다.
 *
 * 스켈레톤 — 본문은 TODO. domain 만 의존한다(어댑터를 모른다, 가이드 17.3).
 */
class PolicyAdminService {
    /** 출금 목적지 화이트리스트에 주소를 추가한다 — 승인 워크플로우를 거친다 (가이드 5.5 · 11). */
    suspend fun allowlistDestination(
        account: AccountRef,
        asset: Asset,
        destination: String,
    ): Unit = TODO("정책 원장에 화이트리스트 추가 + 승인 상태 기록 (가이드 5.5)")

    /** 계정·자산별 출금 한도 설정 (가이드 11). */
    suspend fun setWithdrawalLimit(
        account: AccountRef,
        asset: Asset,
        perTransaction: Amount,
        perDay: Amount,
    ): Unit = TODO("정책 원장에 한도 설정 (가이드 11)")

    /**
     * 계정 동결 — 진행 중·신규 출금을 막는다 (가이드 17.2 admin 동결).
     * 동결은 거버넌스 조작이라 감사 로그와 함께 기록된다.
     */
    suspend fun freezeAccount(
        account: AccountRef,
        reason: String,
    ): Unit = TODO("계정 동결 플래그 + 감사 로그 (가이드 17.2)")

    /** 동결 해제 — 별도 승인 필요 (가이드 17.2). */
    suspend fun unfreezeAccount(account: AccountRef): Unit = TODO("동결 해제 + 감사 로그")
}
