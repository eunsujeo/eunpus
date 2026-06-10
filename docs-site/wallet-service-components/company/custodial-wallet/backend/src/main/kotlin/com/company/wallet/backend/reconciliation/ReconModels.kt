package com.company.wallet.backend.reconciliation

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.TxRef

/**
 * 대조 결과 3-분류 (가이드 7.4).
 *
 * MISMATCH 는 자동 진행하지 않고 사람에게 — 검증된 사실(MATCHED)만 회계 평면으로 흘린다.
 */
enum class ReconResult {
    /** 요청·지시·온체인·운영 기록이 한 사실로 일치 — 검증된 사실로 회계 평면에 제공. */
    MATCHED,

    /** 불일치 — 멈추고 알림 (사람 개입, 예외 목록). */
    MISMATCH,

    /** 확인 필요 — 지연·미반영·기록 누락. 주기 sweep 이 다시 잡는다 (가이드 7.5 ②). */
    NEEDS_REVIEW,
}

/**
 * 승인된 오프체인 지급 지시의 대조용 발췌 — 매니저는 이것을 "대조 입력" 으로 받기만 한다.
 * 차이가 났을 때의 회계적 판단·기표는 회계 평면 몫이다 (가이드 7.2).
 *
 * 금액·주소는 어댑터/인덱서가 이미 비교 가능한 정규형으로 만든 값이라는 전제다 —
 * 체인별 정규화 규칙은 어댑터 책임, 대조 로직은 공통 (가이드 7.4).
 */
data class ExpectedLeg(
    val to: Address,
    val amount: Amount,
)

/** 인덱서가 만든 온체인 실행 결과 (가이드 3) — null 이면 아직 체인에 반영되지 않은 것. */
data class OnchainFact(
    val txRef: TxRef,
    val to: Address,
    val amount: Amount,
    /** 체인별 확정 기준 충족 여부 (as-of-block 인식 — 가이드 7.6). */
    val confirmed: Boolean,
)

/** 한 correlationId(요청 ID)에 묶인 대조 입력 묶음 (가이드 7.2 — 요청 ID 단일 축). */
data class ReconRecord(
    val correlationId: String,
    /** 승인된 오프체인 지시 — 대조용 입력 (없으면 지시 기록 누락). */
    val expected: ExpectedLeg?,
    /** 온체인 실행 결과 — 없으면 미반영(지연). */
    val onchain: OnchainFact?,
)
