package com.company.wallet.adapters.nodewallet

import java.math.BigInteger

/** NodeWallet 지갑 (Solana 단일 체인 — 주소도 하나, 가이드 16.3). */
data class NodeWalletWallet(
    val walletId: String,
    val address: String,
)

/** 전송 제출 파라미터 — [idempotencyKey] 로 코어의 멱등 키를 제품까지 잇는다 (가이드 16.2). */
data class NodeWalletTransferParams(
    val walletId: String,
    val toAddress: String,
    val amountLamports: BigInteger,
    val idempotencyKey: String,
)

/** NodeWallet 전송 기록 발췌. */
data class NodeWalletTransfer(
    val txRef: String,
    /** PENDING / CONFIRMED / FINALIZED / FAILED / CANCELLED / EXPIRED … (제품 상태 예). */
    val status: String,
    val confirmations: Int = 0,
)

/** NodeWallet 자체 원장·입금 검증이 push 하는 수신 이벤트 발췌 (가이드 16.2). */
data class NodeWalletLedgerEvent(
    val txRef: String,
    val direction: String,
    val status: String,
    val address: String,
    val symbol: String,
    val amountLamports: BigInteger,
    val confirmations: Int = 0,
)

fun interface NodeWalletLedgerEventListener {
    suspend fun onEvent(event: NodeWalletLedgerEvent)
}

/**
 * NodeWallet Java/Spring SDK 경계 (가이드 16) — 실제 SDK 호출은 이 인터페이스 뒤에 격리한다.
 *
 * 제출 한 번에 제품 내부에서 개시(코디네이터) → 승인(정책 엔진 co-sign) → 실행(SGX 서명)의
 * 3-키 다중서명이 일어난다 (가이드 16.4). 키는 고객 온프렘 HSM 보유.
 */
interface NodeWalletClient {
    /** 지갑 생성 — 키는 온프렘 HSM 안에서 생성 (고객 보유). Solana 전용. */
    suspend fun createWallet(ref: String): NodeWalletWallet

    /** 지갑 주소 조회 — Solana 단일 주소. */
    suspend fun address(walletId: String): String

    suspend fun balance(
        walletId: String,
        symbol: String,
    ): BigInteger

    /** Solana 수수료 추정 (제품 산정). */
    suspend fun estimateFee(params: NodeWalletTransferParams): BigInteger

    /** 전송 제출 — 내부 3-키 다중서명 + 전파 (가이드 16.4). */
    suspend fun submitTransfer(params: NodeWalletTransferParams): NodeWalletTransfer

    suspend fun getTransfer(txRef: String): NodeWalletTransfer

    /** 취소 — 제품 정책 (Solana blockhash 만료 모델, 가이드 16.2). */
    suspend fun cancelTransfer(txRef: String): NodeWalletTransfer

    /** 수신·확정 이벤트 구독 — NodeWallet 자체 원장·입금 검증이 push (가이드 16.2). */
    fun onLedgerEvent(listener: NodeWalletLedgerEventListener): AutoCloseable
}

/** SDK 호출 스텁 — 외부 I/O 경계. NodeWallet Java/Spring SDK 로 채운다 (벤더 gated 문서 기준). */
class SdkNodeWalletClient : NodeWalletClient {
    override suspend fun createWallet(ref: String): NodeWalletWallet = TODO("NodeWallet SDK createWallet (가이드 16.2)")

    override suspend fun address(walletId: String): String = TODO("NodeWallet SDK address (가이드 16.2)")

    override suspend fun balance(
        walletId: String,
        symbol: String,
    ): BigInteger = TODO("NodeWallet SDK balance (가이드 16.2)")

    override suspend fun estimateFee(params: NodeWalletTransferParams): BigInteger =
        TODO("NodeWallet SDK estimateFee (가이드 16.2)")

    override suspend fun submitTransfer(params: NodeWalletTransferParams): NodeWalletTransfer =
        TODO("NodeWallet SDK submitTransfer — 내부 3-키 다중서명 (가이드 16.4)")

    override suspend fun getTransfer(txRef: String): NodeWalletTransfer = TODO("NodeWallet SDK tx 조회 (가이드 16.2)")

    override suspend fun cancelTransfer(txRef: String): NodeWalletTransfer =
        TODO("NodeWallet SDK cancelTransfer (가이드 16.2)")

    override fun onLedgerEvent(listener: NodeWalletLedgerEventListener): AutoCloseable =
        TODO("NodeWallet SDK onLedgerEvent 구독 (가이드 16.2)")
}
