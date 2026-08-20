package com.company.wallet.domain.model

/**
 * 체인 식별자.
 *
 * enum 이 아닌 value class 인 이유 — 새 체인 추가가 domain 변경을 요구하면 안 된다
 * (가이드 17.3 "EVM 체인 추가 = 어댑터의 체인·자산 등록만 — backend·domain 은 0줄").
 *
 * 현재 태우는 체인은 EVM 뿐이다 (이더리움·Base). 둘 다 같은 EVM 이라
 * 어댑터(Fireblocks)가 등록만 늘리면 된다 (가이드 17.3 · 2 "EVM 차이 흡수").
 */
@JvmInline
value class ChainId(val value: String) {
    companion object {
        val ETHEREUM = ChainId("ethereum")
        val BASE = ChainId("base")
    }
}
