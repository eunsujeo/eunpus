package com.company.wallet.apps.adminapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Admin API 실행 모듈 — 운영·거버넌스 HTTP 진입점 (가이드 17.2).
 *
 * Admin 백엔드(정책·승인·키 운영·동결·rebalance·sweep)를 스캔한다.
 * 고객 런타임인 Service([com.company.wallet.apps.serviceapi])와 물리 분리된 별도 서버·별도 권한·감사 경계다.
 * (정합성 sweep·알림은 Service 쪽 reconciliation·alerts 소관 — 가이드 17.2 로 그쪽 apps 가 스케줄링한다.)
 */
@SpringBootApplication(
    scanBasePackages = [
        "com.company.wallet.apps.adminapi",
        "com.company.wallet.backend.admin",
    ],
)
class AdminApiApplication

fun main(args: Array<String>) {
    runApplication<AdminApiApplication>(*args)
}
