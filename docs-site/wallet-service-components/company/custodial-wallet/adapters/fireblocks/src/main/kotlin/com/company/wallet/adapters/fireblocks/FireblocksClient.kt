package com.company.wallet.adapters.fireblocks

import java.math.BigInteger

/** Fireblocks vault 계정 (POST /v1/vault/accounts 응답 발췌). */
data class FireblocksVaultAccount(
    val id: String,
    val name: String,
)

/** vault 의 자산별 입금 주소 (POST /v1/vault/accounts/{id}/{asset}/addresses 응답 발췌). */
data class FireblocksAddress(
    val address: String,
    val tag: String? = null,
)

/**
 * vault 의 자산 잔액 (GET /v1/vault/accounts/{id}/{asset} 응답 발췌) — 금액은 최소 단위 정수.
 * Fireblocks 응답은 available/pending/lockedAmount/total 을 구분해 준다 — 13.3 Balance 로 매핑.
 */
data class FireblocksVaultAsset(
    val availableMinorUnits: BigInteger,
    val pendingMinorUnits: BigInteger,
    val lockedMinorUnits: BigInteger,
    val totalMinorUnits: BigInteger,
    val decimals: Int,
)

/**
 * createTransaction / estimateFee 공용 파라미터 (가이드 14.2).
 *
 * [externalTxId] 가 핵심 — 게이트웨이의 멱등 키를 Fireblocks 측 트랜잭션 dedup 으로 잇는다 (가이드 6.3 · 13.7).
 * destination 은 벤더 표면의 유형 그대로 — TransferPeerPathType: ONE_TIME_ADDRESS(주소) · VAULT_ACCOUNT(id) · EXTERNAL_WALLET(등록 id).
 */
data class FireblocksCreateTransactionParams(
    val assetId: String,
    val sourceVaultId: String,
    /** TransferPeerPathType 값. */
    val destinationType: String,
    /** VAULT_ACCOUNT · EXTERNAL_WALLET 일 때 — 벤더 측 id. */
    val destinationId: String? = null,
    /** ONE_TIME_ADDRESS 일 때. */
    val destinationAddress: String? = null,
    val destinationTag: String? = null,
    val amountMinorUnits: BigInteger,
    val externalTxId: String,
    val note: String? = null,
)

/** 수수료 추정 응답 — low / medium / high (POST /v1/transactions/estimate_fee). */
data class FireblocksFeeEstimate(
    val lowMinorUnits: BigInteger,
    val mediumMinorUnits: BigInteger,
    val highMinorUnits: BigInteger,
    val decimals: Int,
)

/** Fireblocks 트랜잭션 (GET /v1/transactions/{txId} 응답 발췌). */
data class FireblocksTransaction(
    val id: String,
    /** SUBMITTED / QUEUED / BROADCASTING / CONFIRMING / COMPLETED / CANCELLED / FAILED … */
    val status: String,
    val txHash: String? = null,
    val numOfConfirmations: Int = 0,
)

/**
 * Fireblocks REST API 경계 (가이드 14.7) — 실제 SDK/HTTP 호출은 이 인터페이스 뒤에 격리한다.
 *
 * base URL `https://api.fireblocks.io`, 모든 요청은 JWT(API Key + RSA) 서명.
 * 메서드 ↔ 엔드포인트 매핑은 가이드 14.7 표와 1:1 이다.
 */
interface FireblocksClient {
    /** POST /v1/vault/accounts — vault 계정 생성. */
    suspend fun createVaultAccount(name: String): FireblocksVaultAccount

    /** vault 자산의 기존 입금 주소 목록 조회 — addressOf 의 뒷면 (조회 엔드포인트는 적용 전 확인). */
    suspend fun listDepositAddresses(
        vaultAccountId: String,
        assetId: String,
    ): List<FireblocksAddress>

    /** POST /v1/vault/accounts/{vaultAccountId}/{assetId}/addresses — 새 입금 주소 "발급" (부를 때마다 새 주소). */
    suspend fun generateNewAddress(
        vaultAccountId: String,
        assetId: String,
    ): FireblocksAddress

    /** GET /v1/vault/accounts/{vaultAccountId}/{assetId} — 자산 잔액. */
    suspend fun getVaultAccountAsset(
        vaultAccountId: String,
        assetId: String,
    ): FireblocksVaultAsset

    /**
     * POST /v1/transactions — build + MPC 서명 + 전파 + nonce 가 이 한 번에 묶인다 (가이드 14.2).
     * [FireblocksCreateTransactionParams.externalTxId] 로 Fireblocks 측 중복 제출도 막는다.
     */
    suspend fun createTransaction(params: FireblocksCreateTransactionParams): FireblocksTransaction

    /** POST /v1/transactions/estimate_fee — POST 지만 상태를 바꾸지 않는다 (전송 전 모의 추정). */
    suspend fun estimateFee(params: FireblocksCreateTransactionParams): FireblocksFeeEstimate

    /** GET /v1/transactions/{txId} — 상태 조회. */
    suspend fun getTransaction(txId: String): FireblocksTransaction

    /**
     * POST /v1/transactions/{txId}/cancel — 취소.
     * ★ drop(boost) 과 별도 엔드포인트다 (가이드 14.7) — 의미도 다르다: cancel 은 중단, drop 은 교체.
     */
    suspend fun cancelTransaction(txId: String): Boolean

    /**
     * POST /v1/transactions/{txId}/drop — 부스트 (drop & replace).
     * EVM 트랜잭션만 (가이드 4.4).
     */
    suspend fun boostTransaction(txId: String): FireblocksTransaction
}

/**
 * REST 호출 스텁 — 외부 I/O 경계 (가이드 14.7).
 * Fireblocks Java SDK 또는 직접 HTTP(JWT 서명) 구현으로 채운다.
 */
class RestFireblocksClient : FireblocksClient {
    override suspend fun createVaultAccount(name: String): FireblocksVaultAccount =
        TODO("Fireblocks REST POST /v1/vault/accounts (가이드 14.7)")

    override suspend fun listDepositAddresses(
        vaultAccountId: String,
        assetId: String,
    ): List<FireblocksAddress> = TODO("Fireblocks REST 주소 목록 조회 — 엔드포인트는 적용 전 확인 (가이드 14.7)")

    override suspend fun generateNewAddress(
        vaultAccountId: String,
        assetId: String,
    ): FireblocksAddress = TODO("Fireblocks REST POST /v1/vault/accounts/{id}/{asset}/addresses (가이드 14.7)")

    override suspend fun getVaultAccountAsset(
        vaultAccountId: String,
        assetId: String,
    ): FireblocksVaultAsset = TODO("Fireblocks REST GET /v1/vault/accounts/{id}/{asset} (가이드 14.7)")

    override suspend fun createTransaction(params: FireblocksCreateTransactionParams): FireblocksTransaction =
        TODO("Fireblocks REST POST /v1/transactions — externalTxId 멱등 (가이드 14.7)")

    override suspend fun estimateFee(params: FireblocksCreateTransactionParams): FireblocksFeeEstimate =
        TODO("Fireblocks REST POST /v1/transactions/estimate_fee (가이드 14.7)")

    override suspend fun getTransaction(txId: String): FireblocksTransaction =
        TODO("Fireblocks REST GET /v1/transactions/{txId} (가이드 14.7)")

    override suspend fun cancelTransaction(txId: String): Boolean =
        TODO("Fireblocks REST POST /v1/transactions/{txId}/cancel (가이드 14.7)")

    override suspend fun boostTransaction(txId: String): FireblocksTransaction =
        TODO("Fireblocks REST POST /v1/transactions/{txId}/drop (가이드 14.7)")
}
