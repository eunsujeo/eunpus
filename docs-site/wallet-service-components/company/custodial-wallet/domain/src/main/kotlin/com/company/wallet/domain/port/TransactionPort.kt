package com.company.wallet.domain.port

import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus

/**
 * 트랜잭션 포트 — 쓰기 + 상태 + 내 지갑 이벤트 (가이드 13.3).
 *
 * 포트엔 "입금하다/출금하다" 가 없다 — 출금은 [submitTransaction], 입금은 [onChainEvent] 의
 * 수신 이벤트이고, 업무 의미는 비즈니스 레이어가 붙인다.
 */
interface TransactionPort {
    /** 제출 전 수수료 추정 (low/medium/high). */
    suspend fun estimateFee(request: TransactionRequest): FeeEstimate

    /**
     * 서명+전파 묶음. Canton 같은 2-step 체인에선 "전송 완료" 가 아니라 OFFER 제출이다 —
     * 이후 상태는 [getStatus] 의 [TxStatus.AwaitingCounterparty] 로 표면화된다 (가이드 13.3).
     */
    suspend fun submitTransaction(request: TransactionRequest): TxRef

    suspend fun getStatus(txRef: TxRef): TxStatus

    /** 내 지갑 수신·확정 push 구독 (custody 백엔드가 줌). */
    fun onChainEvent(handler: ChainEventHandler): Subscription
}

/**
 * 선택 capability — 수수료를 올려 막힌 트랜잭션을 재촉(boost).
 *
 * EVM/UTXO 전용 (가이드 4.4): Solana 는 어댑터 내부 auto-retry, Canton 은 해당 없음.
 * "미지원 체인은 부재" 를 타입으로 표현한다 — 호출 측은 `adapter is FeeBoostCapability` 로
 * 분기하고, 미지원 어댑터에 대고 호출하는 코드는 컴파일되지 않는다.
 */
interface FeeBoostCapability {
    suspend fun boost(txRef: TxRef): TxRef
}

/**
 * 선택 capability — 대기·막힌 트랜잭션 중단 (가이드 13.3).
 *
 * EVM 은 같은 순번의 0원 self-send 를 더 높은 수수료로 보내 덮어쓰고, Canton 은 OFFER withdraw.
 * Solana 는 이미 전파된 트랜잭션의 취소를 보장할 수 없다(blockhash 만료 대기) — 부재 가능.
 * [FeeBoostCapability] 와 같은 패턴 — "미지원은 부재" 를 타입으로 표현하고,
 * 호출 측은 `adapter is CancelCapability` 로 분기한다.
 */
interface CancelCapability {
    suspend fun cancel(txRef: TxRef): TxRef
}
