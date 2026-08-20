package com.company.wallet.domain.port

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.ChainEventHandler
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.Subscription
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.Transfer
import com.company.wallet.domain.model.TxRef
import com.company.wallet.domain.model.TxStatus
import com.company.wallet.domain.model.TxStatusFilter

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
     * 서명+전파 묶음. EVM 에선 Fireblocks 의 `createTransaction` 한 번이 build+MPC 서명+전파+nonce 를
     * 모두 묶는다 — 이후 상태는 [statusOf] 로 조회한다 (가이드 13.3 · 14.2).
     */
    suspend fun submitTransaction(request: TransactionRequest): TxRef

    suspend fun statusOf(txRef: TxRef): TxStatus

    /**
     * 내 계정의 송수신 이력 — custody 가 준다 (가이드 13.3, 전 구현 가능 — capability 아님).
     * 임의 "외부" 주소의 이력은 [ChainQueryPort.transfersOf] 소관 — 동사의 자리는 데이터의 주인이 정한다.
     *
     * after/before 는 Unix ms — 벤더 목록 API 의 시간 필터 그대로 (워크스루 4장 커서와 같은 형식).
     * status 는 서버측 필터라 한 번에 한 상태만 걸린다 (워크스루 8장).
     */
    suspend fun transactionsOf(
        account: Account,
        after: Long,
        before: Long,
        status: TxStatusFilter? = null,
    ): List<Transfer>

    /** 내 지갑 수신·확정 push 구독 (custody 백엔드가 줌). */
    fun onChainEvent(handler: ChainEventHandler): Subscription
}

/**
 * 선택 capability — 수수료를 올려 막힌 트랜잭션을 재촉(boost).
 *
 * EVM 전용 (가이드 4.4). "미지원 체인은 부재" 를 타입으로 표현한다 — 호출 측은
 * `adapter is FeeBoostCapability` 로 분기하고, 미지원 어댑터에 대고 호출하는 코드는 컴파일되지 않는다.
 */
interface FeeBoostCapability {
    suspend fun boost(txRef: TxRef): TxRef
}

/**
 * 선택 capability — 대기·막힌 트랜잭션 중단 (가이드 13.3).
 *
 * EVM 은 같은 순번의 0원 self-send 를 더 높은 수수료로 보내 덮어쓴다(drop & replace).
 * [FeeBoostCapability] 와 같은 패턴 — "미지원은 부재" 를 타입으로 표현하고,
 * 호출 측은 `adapter is CancelCapability` 로 분기한다.
 */
interface CancelCapability {
    suspend fun cancel(txRef: TxRef): TxRef
}
