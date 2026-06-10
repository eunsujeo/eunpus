package com.company.wallet.chains.canton

/**
 * Canton participant 노드 경계 (가이드 2.2) — 블록·nonce·reorg 개념이 없는
 * DAML active contract 원장(ACS) 위의 ledger API (gRPC).
 */
interface CantonParticipantClient {
    /**
     * transfer OFFER 제출 → traceableId 반환. "제출=완료" 가 아니다 — 상대 수락(ACCEPT)
     * 대기 상태에 머물 수 있고, 그동안 송신 자금은 locked UTXO 로 묶인다 (가이드 2.2).
     */
    suspend fun submitOffer(payload: ByteArray): String

    /** OFFER lifecycle 상태 조회 — OFFER → ACCEPT/REJECT/WITHDRAW (가이드 2.4 status2step). */
    suspend fun offerStatus(traceableId: String): CantonOfferStatus

    /** 송신자 WITHDRAW — locked 자금 회수. timeout 처리는 앱 정책 (가이드 2.2). */
    suspend fun withdrawOffer(traceableId: String)
}

/** 2-step 전송 lifecycle 상태 (가이드 2.2 — Canton Coin pre-approval 경로는 1-step). */
enum class CantonOfferStatus { OFFERED, ACCEPTED, REJECTED, WITHDRAWN }

/** gRPC 구현 스텁 — 외부 I/O 경계. */
class GrpcCantonParticipantClient(
    private val endpoint: String,
) : CantonParticipantClient {
    override suspend fun submitOffer(payload: ByteArray): String =
        TODO("ledger API command submission — TransferInstruction OFFER ($endpoint)")

    override suspend fun offerStatus(traceableId: String): CantonOfferStatus =
        TODO("ACS/update 스트림에서 traceableId 추적 ($endpoint)")

    override suspend fun withdrawOffer(traceableId: String): Unit =
        TODO("TransferInstruction WITHDRAW exercise ($endpoint)")
}
