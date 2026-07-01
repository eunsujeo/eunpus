package com.company.wallet.domain.error

/**
 * 어댑터가 지원하지 않는 선택 capability 를 호출했을 때 (가이드 13.3 capability).
 *
 * 예: 지갑당 주소가 하나인 어댑터에 [com.company.wallet.domain.port.DepositAddressIssuanceCapability]
 * 를 요구하는 경우. 호출 측이 `adapter is XxxCapability` 로 먼저 분기하는 것이 정석이고,
 * 이 예외는 그 분기를 건너뛴 경로의 명시적 거절이다.
 */
class UnsupportedCapabilityException(capability: String) :
    UnsupportedOperationException("capability not supported by this adapter: $capability")

/** 같은 멱등 키로 처리 중 충돌 — 멱등 저장소가 동시 중복 실행을 차단할 때 (가이드 6.3). */
class DuplicateRequestException(idempotencyKey: String) :
    IllegalStateException("request already in progress for idempotency key: $idempotencyKey")
