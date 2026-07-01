package com.company.wallet.apps.serviceapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

/**
 * Service API 실행 모듈 — 고객 런타임 HTTP 진입점 (가이드 17.2).
 *
 * Service 백엔드(gateway·directory·orchestration)를 스캔하고, custody 어댑터는
 * [CustodyAdapterConfig] 가 `custody.provider` 설정 한 줄로 선택한다 (가이드 17.6).
 * Admin(정책·운영·sweep)은 물리 분리된 별도 실행 모듈이다 (apps/admin-api).
 */
@SpringBootApplication(
    scanBasePackages = [
        "com.company.wallet.apps.serviceapi",
        "com.company.wallet.backend.service",
    ],
)
@EnableScheduling
class ServiceApiApplication

fun main(args: Array<String>) {
    runApplication<ServiceApiApplication>(*args)
}
