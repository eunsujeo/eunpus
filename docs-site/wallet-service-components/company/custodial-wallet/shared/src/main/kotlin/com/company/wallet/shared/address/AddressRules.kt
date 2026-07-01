package com.company.wallet.shared.address

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId

/**
 * 로컬 주소 검증 규칙 — 체인별 형식·체크섬은 공개된 결정적 규칙이라 벤더가 필요 없다 (가이드 13.3 · 14).
 *
 * custody 어댑터(Fireblocks) 및 테스트용 fake 의 `validateAddress` 가 여기로 위임한다 —
 * 주소 검증이 벤더 API 에 묶이면 어댑터 교체 때 검증 동작까지 흔들리기 때문이다.
 * 태우는 체인은 EVM(이더리움·Base)뿐이라 둘 다 같은 EVM 주소 형식을 쓴다.
 * 스켈레톤 수준 — 형식·길이 검사까지만 하고, 체크섬 검증은 TODO 로 남긴다.
 */
object AddressRules {
    /**
     * 로컬 형식·체크섬 검증 — 벤더 API 를 호출하지 않는다 (가이드 13.3).
     *
     * 미등록 체인은 보수적으로 false — "형식을 모르는 주소" 를 통과시키면 출금 대상 검증이
     * 뚫리는 쪽으로 실패하므로, 규칙이 등록될 때까지 거절이 안전하다. EVM 체인을 더 붙여도
     * 주소 형식은 같으므로 when 에 chainId 만 추가하면 된다.
     */
    fun validate(
        asset: Asset,
        address: Address,
    ): Boolean =
        when (asset.chainId) {
            ChainId.ETHEREUM, ChainId.BASE -> isEvmAddress(address.value)
            else -> false
        }

    /** `0x` + 40 hex. TODO: EIP-55 대소문자 체크섬 검증 (mixed-case 주소만 해당). */
    private fun isEvmAddress(value: String): Boolean = EVM_ADDRESS.matches(value)

    private val EVM_ADDRESS = Regex("^0x[0-9a-fA-F]{40}$")
}
