package com.company.wallet.backend.service.ledger

import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.Balance

/**
 * 고객 원장 — 고객별 잔액(가용·대기·잠김)과 내역의 진실은 벤더가 아니라 여기(백엔드 DB)에 있다
 * (설계 워크스루 8장). 입금 자산은 sweep 으로 옴니버스에 모이므로 고객별 온체인 잔액이 애초에 없다.
 *
 * [com.company.wallet.backend.service.directory.AccountDirectory]처럼 우리가 소유하는 데이터의
 * 경계다 — domain 포트(벤더 경계)가 아니라 backend.service 안의 인터페이스이고,
 * 운영에서는 영속 저장소(DB) 구현으로 교체한다.
 *
 * 모든 쓰기는 참조 키(txId·requestId)로 중복 반영을 막는다 — 같은 요청 재시도는 한 번만 반영된다.
 * 회계(분개) 원장은 여전히 범위 밖이다 — 여기는 고객 잔액·내역의 운영 원장이다.
 */
interface CustomerLedger {
    /** 고객 화면 잔액 — 출금 가능 판정은 available 만 본다 (워크스루 8장). */
    suspend fun balanceOf(
        accountId: String,
        asset: Asset,
    ): Balance

    /** 고객 화면 거래내역 — after/before 는 Unix ms (워크스루 8장). */
    suspend fun entriesOf(
        accountId: String,
        after: Long,
        before: Long,
    ): List<LedgerEntry>

    /** 입금 반영 — 폴링이 부른다. txId 멱등 upsert: 미확정이면 대기, 확정이면 가용 (워크스루 4·5장). */
    suspend fun applyDeposit(
        accountId: String,
        asset: Asset,
        amount: Amount,
        txId: String,
        confirmed: Boolean,
    )

    /** 깊은 reorg 무효화 — 반영해 둔 잔액만 되돌리고 입금 기록은 남긴다 (워크스루 5장). */
    suspend fun revertDeposit(txId: String)

    /** 출금 접수 — 가용→잠김 (워크스루 6·8장). 가용 부족이면 [InsufficientAvailableException]. */
    suspend fun lockForWithdrawal(
        accountId: String,
        asset: Asset,
        amount: Amount,
        requestId: String,
    )

    /** 고객→고객 이체 — 온체인에 나가지 않는다. 차감·증가가 한 트랜잭션 (워크스루 6장). */
    suspend fun transfer(
        fromAccountId: String,
        toAccountId: String,
        asset: Asset,
        amount: Amount,
        requestId: String,
    )
}

/** 원장 이벤트 한 줄 — 고객 화면 거래내역의 원천 (워크스루 8장). */
data class LedgerEntry(
    val accountId: String,
    val asset: Asset,
    val amount: Amount,
    val kind: LedgerEntryKind,
    /** 참조 키 — 입금은 벤더 txId, 출금·이체는 요청 id. 중복 반영 방지의 축. */
    val refId: String,
    /** Unix ms — [CustomerLedger.entriesOf] 의 after/before 와 같은 형식. */
    val occurredAt: Long,
)

enum class LedgerEntryKind {
    DEPOSIT_PENDING,
    DEPOSIT_CONFIRMED,
    DEPOSIT_REVERTED,
    WITHDRAWAL_LOCKED,
    TRANSFER_OUT,
    TRANSFER_IN,
}

/** 가용 부족 — 판정은 available 만으로 한다 (워크스루 8장, 대기·잠김 합산 금지). */
class InsufficientAvailableException(accountId: String) :
    IllegalStateException("insufficient available balance: $accountId")
