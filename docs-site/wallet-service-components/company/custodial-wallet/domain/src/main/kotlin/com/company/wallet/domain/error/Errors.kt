package com.company.wallet.domain.error

import com.company.wallet.domain.model.ChainId

/** 등록되지 않은 체인 — 새 체인 = chains/<new> 모듈 하나 + 레지스트리 한 줄 (가이드 2.4). */
class UnsupportedChainException(chainId: ChainId) :
    IllegalArgumentException("unsupported chain: ${chainId.value}")

/** 해당 체인이 지원하지 않는 동작 (가이드 4.4 capability — 예: Canton 에 fee boost). */
class UnsupportedForChainException(operation: String, chainId: ChainId) :
    UnsupportedOperationException("$operation is not supported on chain: ${chainId.value}")

/** 같은 멱등 키로 처리 중 충돌 — 멱등 저장소가 동시 중복 실행을 차단할 때 (가이드 6.3). */
class DuplicateRequestException(idempotencyKey: String) :
    IllegalStateException("request already in progress for idempotency key: $idempotencyKey")
