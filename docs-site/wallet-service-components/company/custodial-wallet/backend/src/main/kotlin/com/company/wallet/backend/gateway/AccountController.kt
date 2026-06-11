package com.company.wallet.backend.gateway

import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * 계정·주소 HTTP 진입점 (가이드 6 · 9).
 *
 * 컨트롤러는 DTO 변환만 하고, 인증·멱등·라우팅은 전부 [WalletGatewayService] 에 위임한다.
 */
@RestController
@RequestMapping("/accounts")
class AccountController(
    private val gateway: WalletGatewayService,
) {
    /** 고객 계정(vault) 생성 — 멱등 키는 클라이언트가 주는 것을 권장 (가이드 6.4). */
    @PostMapping
    suspend fun createAccount(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @RequestHeader(name = "X-Idempotency-Key", required = false) idempotencyKey: String?,
        @RequestBody body: CreateAccountRequest,
    ): AccountResponse = gateway.createAccount(authorization, idempotencyKey, AccountRef(body.ref)).toResponse()

    /** 수신 주소 확보(조회) — 온보딩의 두 번째 호출 (가이드 9.1). */
    @PostMapping("/{id}/addresses")
    suspend fun addressOf(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @RequestHeader(name = "X-Idempotency-Key", required = false) idempotencyKey: String?,
        @PathVariable id: String,
        @RequestBody body: AddressRequest,
    ): AddressResponse =
        gateway
            .addressOf(
                credentials = authorization,
                idempotencyKey = idempotencyKey,
                accountId = id,
                asset = Asset(symbol = body.symbol, chainId = ChainId(body.chainId)),
            ).toResponse()

    /** 추가 입금 주소 발급 — capability, 미지원 체인(Canton 등)은 명시 거절 (가이드 13.3 · 9.3). */
    @PostMapping("/{id}/addresses/issue")
    suspend fun issueDepositAddress(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @RequestHeader(name = "X-Idempotency-Key", required = false) idempotencyKey: String?,
        @PathVariable id: String,
        @RequestBody body: AddressRequest,
    ): AddressResponse =
        gateway
            .issueDepositAddress(
                credentials = authorization,
                idempotencyKey = idempotencyKey,
                accountId = id,
                asset = Asset(symbol = body.symbol, chainId = ChainId(body.chainId)),
            ).toResponse()

    /** 잔액 조회 — custody(포트)가 주는 정규화 잔액. */
    @GetMapping("/{id}/balance")
    suspend fun getBalance(
        @RequestHeader(name = "Authorization", required = false) authorization: String?,
        @PathVariable id: String,
        @RequestParam symbol: String,
        @RequestParam chainId: String,
    ): BalanceResponse =
        gateway
            .getBalance(
                credentials = authorization,
                accountId = id,
                asset = Asset(symbol = symbol, chainId = ChainId(chainId)),
            ).toResponse()
}
