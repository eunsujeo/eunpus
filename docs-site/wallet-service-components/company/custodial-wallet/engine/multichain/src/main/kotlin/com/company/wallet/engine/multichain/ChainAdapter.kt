package com.company.wallet.engine.multichain

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.ChainSpecific
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus

/**
 * 체인별 어댑터 SPI — 위쪽 컴포넌트가 보는 유일한 것, 공통 동사 (가이드 2.2 · 2.4).
 *
 * 13장의 포트보다 한 겹 아래다 — `TransactionPort.submitTransaction` 한 번이 자체 구축에선
 * [buildTransaction] → 서명 → [broadcast] 로 펼쳐진다 (가이드 2.4).
 * 체인 분기는 구현 클래스 안에만 갇힌다.
 */
interface ChainAdapter {
    val chainId: ChainId

    /**
     * fee boost(같은 트랜잭션을 수수료만 올려 교체) 가능 여부 — EVM/UTXO true, Solana/Canton false.
     * StuckWatcher 는 이 값이 false 인 체인에 [resend] 를 자동 호출하지 않는다 (가이드 4.3 · 4.4).
     */
    val supportsFeeBump: Boolean

    /**
     * 수신 주소 — 멱등 조회. 포트(가이드 13.3)와 달리 asset 인자가 없다: 어댑터는 체인 고정이라
     * asset 의 일(체인 라우팅·xpub/coin type 선택)은 포트에서 끝났고, 한 체인 안에서 주소는
     * 계정만의 함수다 (ERC-20=ETH 주소 · SPL=owner · Canton 무관). 반환 [Address] 의 asset
     * 스탬프는 포트 구현(custody 어댑터)이 찍는다 (가이드 2.4 · 9.2).
     */
    suspend fun addressOf(account: Account): Address

    suspend fun getBalance(
        address: Address,
        asset: Asset,
    ): Amount

    /** 조립 — nonce/UTXO/2-step 차이를 흡수 (순번 점유 포함). */
    suspend fun buildTransaction(request: TransactionRequest): UnsignedTx

    /**
     * 점유 없는 추정 — [buildTransaction] 과 달리 nonce/UTXO 를 점유하지 않는다
     * (견적마다 순번이 소모되면 안 됨, 가이드 2.4 · 4.2).
     */
    suspend fun estimateFee(request: TransactionRequest): FeeEstimate

    /** 전파 — 서명본을 노드에 제출. Canton 만 OFFER 제출로 의미가 다르다 (가이드 2.4). */
    suspend fun broadcast(signedTx: SignedTx): TxRef

    /** 확정 판정 — 체인별 기준 (N 블록 · commitment · 2-step 상태). */
    suspend fun confirmations(txRef: TxRef): Confirmation

    /**
     * 막힌 tx 재전송. 수수료 교체는 payload 가 바뀌므로 재서명 후 재전파해야 한다 (가이드 4.4) —
     * 구현은 새 [UnsignedTx] 를 만들어 반환하고, 서명·전파는 TxPipeline 이 오케스트레이션한다.
     */
    suspend fun rebuildForResend(
        txRef: TxRef,
        feeBumpStep: Int,
    ): UnsignedTx
}

/** 서명 전 트랜잭션 — [signingPayload] 는 sighash (단순화 — UTXO 는 실제로는 입력별, 가이드 5.4). */
data class UnsignedTx(
    val id: String,
    val request: TransactionRequest,
    val chainId: ChainId,
    val signingPayload: ByteArray,
    val chainSpecific: ChainSpecific? = null,
)

data class SignedTx(
    val unsigned: UnsignedTx,
    val signature: ByteArray,
)

/** 확정 판정 결과 — depth 는 확정 깊이(블록 수), finalized 는 체인별 확정 기준 충족 여부. */
data class Confirmation(
    val depth: Int,
    val finalized: Boolean,
    val status: TxStatus,
)

/**
 * 선택 capability — 입금 주소의 곡선별 결정적 "계산" (가이드 15.2 · 2.4 범위 정리).
 *
 * 포트의 발급(issueDepositAddress)이 index 를 정해 호출한다 — index 소비·디렉터리 저장·
 * watch-list 등록은 포트 소관이고 여기는 계산만. EVM·UTXO(xpub 공개 파생) ·
 * Solana(HSM 내 hardened 파생)가 구현, Canton 부재(주소 추가 개념 없음 — memo-ref).
 */
interface DepositAddressDerivationCapability {
    suspend fun deriveAddress(
        account: Account,
        index: Int,
    ): Address
}

/**
 * 선택 capability — 입금 식별자 발급에 온장(on-ledger) 등록이 선행돼야 하는 체인 (가이드 9.2 · 15-2c).
 *
 * Canton 만: generate-topology → HSM hash 서명(키 반출 없음) → allocate → PartyId. 유료·비멱등.
 * 호출처는 포트의 issueDepositAddress 첫 Canton 호출 — PartyId 를 한 번 선발급하고(이후 memo 만 채번),
 * createAccount 가 아니다(그건 asset 무관 vault 라 어느 체인일지 모른다, 가이드 9.2).
 */
interface OnLedgerAccountRegistrationCapability {
    suspend fun registerAccount(
        account: Account,
        pubkey: ByteArray,
    ): Address
}
