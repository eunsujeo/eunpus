package com.company.wallet.apps.webhookreceiver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Fireblocks webhook 수신 모듈 (가이드 14.4).
 *
 * Fireblocks 가 vault 범위의 수집을 대신 돌려 push 하는 webhook 의 착지점 —
 * 수신 → 정규화([com.company.wallet.adapters.fireblocks.FireblocksWebhookMapper]) →
 * 팬아웃(backend.service.alerts)으로 비즈니스 레이어에 전달한다.
 */
@SpringBootApplication(
    scanBasePackages = [
        "com.company.wallet.apps.webhookreceiver",
        "com.company.wallet.backend.service.alerts",
    ],
)
class WebhookReceiverApplication

fun main(args: Array<String>) {
    runApplication<WebhookReceiverApplication>(*args)
}
