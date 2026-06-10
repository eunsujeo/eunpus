package com.company.wallet.apps.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

/**
 * API 실행 모듈 — HTTP 진입점 (가이드 17.2).
 *
 * backend(게이트웨이·오케스트레이션·정합성·알림)를 스캔하고, custody 어댑터는
 * [CustodyAdapterConfig] 가 `custody.provider` 설정 한 줄로 선택한다 (가이드 17.6).
 */
@SpringBootApplication(
    scanBasePackages = [
        "com.company.wallet.apps.api",
        "com.company.wallet.backend",
    ],
)
@EnableScheduling
class ApiApplication

fun main(args: Array<String>) {
    runApplication<ApiApplication>(*args)
}
