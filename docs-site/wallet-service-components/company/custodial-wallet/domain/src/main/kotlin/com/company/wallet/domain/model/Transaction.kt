package com.company.wallet.domain.model

/**
 * 송신 트랜잭션 요청. "출금" 이라는 업무 의미는 비즈니스 레이어가 붙인다 —
 * 매니저가 다루는 것은 트랜잭션이다 (가이드 0.2 · 13.3).
 *
 * 승인은 이 요청이 만들어지기 전에 끝나 있어야 한다. 매니저는 승인된 지시만 받아 집행한다 (가이드 11).
 */
data class TransactionRequest(
    /** 벤더에 남기는 우리 쪽 거래 식별자 — 벤더 측 중복 제출 차단 + 우리 키로 벤더 거래 조회 (가이드 6.3). */
    val externalTxId: String,
    /** 보내는 vault 계정(우리 것) — 고객 vault 뿐 아니라 옴니버스·풀 같은 운영 vault 도 이 자리다. */
    val fromAccount: AccountRef,
    /** 목적지 — 유형 셋 ([Destination]). 벤더 createTransaction 의 destination 유형을 도메인 언어로 접었다. */
    val to: Destination,
    val asset: Asset,
    val amount: Amount,
    /** 벤더 거래 기록에 남는 메모 (Fireblocks note). */
    val note: String? = null,
    /**
     * 트래블룰 게이트가 만든 암호화 메시지 — 해외(Notabene) 경로일 때만.
     * 포트는 운반만 하고 내용을 모른다 (externalTxId 와 같은 무늬 — 산출물의 자리).
     */
    val travelRuleMessage: String? = null,
    val chainSpecific: ChainSpecific? = null,
)

/**
 * 목적지 — 벤더 표면(createTransaction 의 destination, TransferPeerPathType)은 one-time 주소·vault·
 * 화이트리스트 지갑·거래소·network connection 등을 받지만, 포트는 수탁 이체(TRANSFER)에 쓰는 셋만 태운다.
 * CONTRACT_CALL·MINT/BURN 같은 다른 operation 은 이 포트의 범위 밖이다.
 */
sealed interface Destination {
    /** 바깥 세상의 온체인 주소 — TransferPeerPathType.ONE_TIME_ADDRESS. */
    data class ExternalAddress(val address: Address) : Destination

    /** 우리 워크스페이스의 다른 vault 계정 — sweep·운영 이동. TransferPeerPathType.VAULT_ACCOUNT. */
    data class OurAccount(val account: AccountRef) : Destination

    /** 벤더 등록부에 사전 등록(whitelist)된 지갑 — 등록 id 로 지정. TransferPeerPathType.EXTERNAL_WALLET. */
    data class WhitelistedWallet(val walletId: String) : Destination
}

/** 제출된 트랜잭션 참조 — custody 의 트랜잭션 id 를 정규화한 것. 체인은 요청의 asset 이 이미 안다. */
data class TxRef(
    val id: String,
)

/**
 * 정규화된 트랜잭션 상태. 메커니즘은 어댑터가 숨겨도 lifecycle 은 표면화된다 (가이드 2.3).
 * EVM(이더리움·Base)만 태우므로 상태 집합은 전파→확정 단선형이다.
 */
sealed interface TxStatus {
    /** 전파됨 — 확정 대기 (BROADCAST). */
    data class Pending(val confirmations: Int) : TxStatus

    /** 확정 기준 충족 (CONFIRMED). */
    data class Confirmed(val confirmations: Int) : TxStatus

    /** 수수료 부족·혼잡으로 막힘 — 재전송(fee boost) 대상 (가이드 4.4). */
    data object Stuck : TxStatus

    data class Failed(val reason: String) : TxStatus

    data object Cancelled : TxStatus
}

/**
 * 체인 특화 파라미터 — sealed 라서 when 분기가 컴파일 시점에 망라된다 (가이드 17.1).
 * 새 체인의 특화 표현이 필요할 때만 추가한다. 현재는 EVM 뿐이다.
 */
sealed interface ChainSpecific {
    /** 계정 기반(EVM) — 순번(nonce). 보통 벤더(Fireblocks)가 채우므로 null 이 기본. */
    data class Evm(val nonce: Long? = null) : ChainSpecific
}
