package com.company.wallet.backend.service.gateway

import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.TxRef
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * 트랜잭션 HTTP 진입점 (가이드 6 · 11).
 *
 * "출금" 이라는 업무 의미는 비즈니스 레이어가 붙인다 — 여기서 다루는 것은 트랜잭션이다 (가이드 0.2).
 * 제출은 되돌릴 수 없으므로 멱등 키 헤더(`X-Idempotency-Key`)가 필수다.
 */
@RestController
@RequestMapping("/transactions")
class TransactionController(
    private val gateway: WalletGatewayService,
) {
    /** 승인 완료된 송신 지시 제출 — 멱등 키 필수 (가이드 6.1 이중 출금 방지). */
    @PostMapping
    suspend fun submitTransaction(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @RequestHeader(name = "X-Idempotency-Key") idempotencyKey: String,
        @RequestBody body: SubmitTransactionRequest,
    ): TxRefResponse = gateway.submitTransaction(authorization, body.toDomain(idempotencyKey)).toResponse()

    /** 트랜잭션 상태 조회 — 정규화된 lifecycle (가이드 2.3). */
    @GetMapping("/{txRef}")
    suspend fun getStatus(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @PathVariable txRef: String,
        @RequestParam chainId: String,
    ): TxStatusResponse = gateway.getStatus(authorization, TxRef(txRef, ChainId(chainId))).toResponse()

    /** 대기·막힌 트랜잭션 중단 (가이드 13.3 cancel). */
    @PostMapping("/{txRef}/cancel")
    suspend fun cancel(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @RequestHeader(name = "X-Idempotency-Key", required = false) idempotencyKey: String?,
        @PathVariable txRef: String,
        @RequestParam chainId: String,
    ): TxRefResponse = gateway.cancel(authorization, idempotencyKey, TxRef(txRef, ChainId(chainId))).toResponse()
}
