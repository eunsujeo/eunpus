package com.company.wallet.chains.canton

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.CantonTransactionType
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.ChainSpecific
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.engine.multichain.ChainAdapter
import com.company.wallet.engine.multichain.OnLedgerAccountRegistrationCapability
import com.company.wallet.engine.multichain.Confirmation
import com.company.wallet.engine.multichain.SignedTx
import com.company.wallet.engine.multichain.UnsignedTx
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.util.concurrent.atomic.AtomicLong

/**
 * Canton 어댑터 — 2-step OFFER/ACCEPT · PartyId · traffic (가이드 2.2 · 2.4).
 *
 * 흡수해야 할 가장 큰 차이: **"제출=완료" 가 아니다.** 출금이 OFFER 제출로 시작해
 * "상대 수락 대기" 에 머물 수 있고, 그동안 송신 자금은 locked UTXO 로 묶인다.
 * 메커니즘은 숨겨도 lifecycle 은 표면화된다 (가이드 2.3) — [confirmations] 가
 * [TxStatus.AwaitingCounterparty] 를 그대로 노출하는 이유다.
 *
 * 블록·nonce·reorg 가 없다 — 순서는 Synchronizer 의 Sequencer 가 부여하고 (가이드 4.3),
 * 확정은 Synchronizer 2-phase commit 이다 (가이드 2.2).
 */
class CantonChainAdapter(
    private val participant: CantonParticipantClient,
    override val chainId: ChainId = ChainId.CANTON,
) : ChainAdapter, OnLedgerAccountRegistrationCapability {
    /**
     * fee boost 없음 — stuck 의 원인이 수수료가 아니라 상대 수락 대기다 (가이드 4.4).
     * StuckWatcher 는 이 false 를 보고 자동 재전송을 건너뛴다 — OFFER 자동 재제출 금지 (가이드 4.3).
     */
    override val supportsFeeBump: Boolean = false

    private val stateMutex = Mutex()

    /** txRef(traceableId) → 전파한 원본 — withdrawAndReoffer 재조립용. */
    private val broadcastIndex = mutableMapOf<String, UnsignedTx>()

    /** 재조립 신원 구분용 시퀀스 — Canton 엔 nonce·blockhash 같은 자연 신원 축이 없다. */
    private val buildSeq = AtomicLong()

    /**
     * 파생·발급 없음 — "조회만" (가이드 2.4 · 9.2). PartyId(hint::fingerprint)는 이 계정의
     * 첫 Canton 입금 식별자 발급(issueDepositAddress) 때 party allocation 으로 선발급돼 있다
     * (topology 서명 필요·비멱등·유료 온장 등록, 가이드 15.9).
     * ★ 여기서 allocation 을 호출하지 말 것 — 읽기 동사 뒤에 온장 쓰기를 숨기게 된다.
     * asset 무관(자산별 주소 없음) — 입금 구분은 주소가 아니라 memo-ref.
     */
    override suspend fun addressOf(account: Account): Address = TODO("계정 디렉터리에서 account 의 PartyId 조회·반환 (allocation 아님)")

    override suspend fun getBalance(
        address: Address,
        asset: Asset,
    ): Amount = TODO("ACS 의 token holdings 합산 — 가용/locked UTXO 구분 (가이드 2.2)")

    /** 조립 — transferInstruction OFFER (가이드 2.4). nonce·UTXO 선택에 해당하는 직렬화가 없다. */
    override suspend fun buildTransaction(request: TransactionRequest): UnsignedTx =
        UnsignedTx(
            id = "canton:${request.idempotencyKey}:offer:${buildSeq.incrementAndGet()}",
            request = request,
            chainId = chainId,
            signingPayload = encodeOffer(request),
            chainSpecific = ChainSpecific.Canton(transactionType = CantonTransactionType.OFFER),
        )

    /** 점유 없는 추정 — OFFER 를 제출하지 않고 traffic 소비량만 잰다 (가이드 4.2). */
    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate =
        TODO("traffic 소비량 추정 — Canton Coin 소각으로 충전한 traffic(byte) 잔고 차감 (가이드 2.2)")

    /**
     * 전파 = OFFER 제출 (가이드 2.4) — 다른 체인과 달리 "서명본을 노드에 제출" 이 아니라
     * 2-step 전송의 시작이다. 반환되는 traceableId 가 이후 추적 키가 되어 [TxRef] 에 담긴다
     * (tx hash 가 아니다 — lifecycle 추적은 traceableId 로).
     */
    override suspend fun broadcast(signedTx: SignedTx): TxRef {
        val traceableId = participant.submitOffer(encodeSubmission(signedTx))
        stateMutex.withLock { broadcastIndex[traceableId] = signedTx.unsigned }
        return TxRef(traceableId, chainId)
    }

    /**
     * 확정 판정 — N 블록이 아니라 2-step 상태다 (가이드 2.4 status2step).
     * OFFER 제출 후 상대 수락 대기는 [TxStatus.AwaitingCounterparty] 로 표면화한다.
     */
    override suspend fun confirmations(txRef: TxRef): Confirmation =
        when (participant.offerStatus(txRef.value)) {
            // 수락 대기 — 자금은 locked, 완료가 아니다 (가이드 2.2)
            CantonOfferStatus.OFFERED ->
                Confirmation(depth = 0, finalized = false, status = TxStatus.AwaitingCounterparty(txRef.value))
            // ACCEPT = Synchronizer 2-phase commit 완료 — depth 1 은 정규화 표현 (블록 수 아님)
            CantonOfferStatus.ACCEPTED ->
                Confirmation(depth = 1, finalized = true, status = TxStatus.Confirmed(1))
            CantonOfferStatus.REJECTED ->
                Confirmation(depth = 0, finalized = false, status = TxStatus.Failed("counterparty rejected offer"))
            CantonOfferStatus.WITHDRAWN ->
                Confirmation(depth = 0, finalized = false, status = TxStatus.Cancelled)
        }

    /**
     * withdrawAndReoffer — 기존 OFFER 를 WITHDRAW 로 회수(locked 자금 해제)한 뒤 새 OFFER 로 재조립한다.
     * nonce-replace 가 아니다 (가이드 2.4).
     *
     * ★ 자동 호출 금지 — 상대 수락 대기 중 OFFER 취소·재제출 위험 (가이드 4.3).
     * Canton 의 "막힘" 은 수수료 문제가 아니라 상대 수락 대기이므로, 재제출은 운영자·앱 정책
     * (timeout = 송신자 WITHDRAW)의 명시적 결정으로만 한다. StuckWatcher 는 supportsFeeBump=false
     * 를 보고 이 어댑터를 건너뛴다. [feeBumpStep] 은 의미가 없어 무시된다.
     */
    override suspend fun rebuildForResend(
        txRef: TxRef,
        feeBumpStep: Int,
    ): UnsignedTx {
        val original =
            stateMutex.withLock {
                checkNotNull(broadcastIndex[txRef.value]) { "no broadcast record for txRef: ${txRef.value}" }
            }
        // 명시 취소가 선행돼야 "정확히 하나만 확정" 이 성립한다 (가이드 4.4 "Canton=withdraw 로 명시 취소")
        participant.withdrawOffer(txRef.value)
        return buildTransaction(original.request)
    }

    private fun encodeOffer(request: TransactionRequest): ByteArray =
        TODO("DAML TransferInstruction OFFER 직렬화 — topology/transfer 서명 대상 (가이드 5.4)")

    private fun encodeSubmission(signedTx: SignedTx): ByteArray = TODO("서명 부착 command submission 직렬화 (가이드 5.4)")

    /**
     * Canton 만의 온장 등록 — 가이드 15-2c: generate-topology → HSM hash 서명 → allocate → PartyId.
     * 호출처는 포트의 issueDepositAddress 첫 Canton 호출 — PartyId 를 선발급한다(가이드 9.2). 이후
     * 발급은 이 PartyId 를 재사용하며 memo 만 늘리고, addressOf 는 선발급된 PartyId 의 조회만 한다.
     */
    override suspend fun registerAccount(
        account: Account,
        pubkey: ByteArray,
    ): Address = TODO("generate-topology(공개키·hint) → multi-hash HSM 서명 → allocate (가이드 15.9 · 15-2c)")
}
