package com.company.wallet.shared.address

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId

/**
 * 로컬 주소 검증 규칙 — 체인별 형식·체크섬은 공개된 결정적 규칙이라 벤더가 필요 없다 (가이드 13.3 · 14).
 *
 * 모든 custody 어댑터(Fireblocks/자체/NodeWallet)의 `validateAddress` 가 여기로 위임한다 —
 * 주소 검증이 벤더 API 에 묶이면 어댑터 교체 때 검증 동작까지 흔들리기 때문이다.
 * 스켈레톤 수준 — 형식·길이 검사까지만 하고, 체크섬·디코딩 검증은 TODO 로 남긴다.
 */
object AddressRules {
    /**
     * 로컬 형식·체크섬 검증 — 벤더 API 를 호출하지 않는다 (가이드 13.3).
     *
     * 미등록 체인은 보수적으로 false — "형식을 모르는 주소" 를 통과시키면 출금 대상 검증이
     * 뚫리는 쪽으로 실패하므로, 규칙이 등록될 때까지 거절이 안전하다. 새 체인을 붙일 때
     * 이 when 에 규칙 한 줄을 같이 추가한다.
     */
    fun validate(
        asset: Asset,
        address: Address,
    ): Boolean =
        when (asset.chainId) {
            ChainId.ETHEREUM -> isEvmAddress(address.value)
            ChainId.BITCOIN -> isBitcoinAddress(address.value)
            ChainId.SOLANA -> isSolanaAddress(address.value)
            ChainId.CANTON -> isCantonPartyId(address.value)
            else -> false
        }

    /** `0x` + 40 hex. TODO: EIP-55 대소문자 체크섬 검증 (mixed-case 주소만 해당). */
    private fun isEvmAddress(value: String): Boolean = EVM_ADDRESS.matches(value)

    /**
     * base58(P2PKH `1` / P2SH `3`) 또는 bech32(`bc1`) prefix·길이·문자집합 수준.
     * TODO: base58check 체크섬 · bech32 checksum/witness version 검증.
     */
    private fun isBitcoinAddress(value: String): Boolean =
        when {
            value.startsWith("bc1") -> value.length in 14..74 && BECH32_BODY.matches(value.substring(3))
            value.startsWith("1") || value.startsWith("3") -> value.length in 26..35 && BASE58.matches(value)
            else -> false
        }

    /** base58 문자집합 + 32바이트 공개키의 인코딩 길이 수준. TODO: base58 디코딩해 정확히 32바이트 확인. */
    private fun isSolanaAddress(value: String): Boolean = value.length in 32..44 && BASE58.matches(value)

    /** PartyId 형식(`hint::fingerprint`) 수준. TODO: fingerprint(서명 공개키 sha256) 형식 검증 (가이드 2.2). */
    private fun isCantonPartyId(value: String): Boolean {
        val parts = value.split("::")
        return parts.size == 2 && parts[0].isNotBlank() && parts[1].isNotBlank()
    }

    private val EVM_ADDRESS = Regex("^0x[0-9a-fA-F]{40}$")

    /** base58 — 0(zero) · O · I · l 제외. */
    private val BASE58 = Regex("^[1-9A-HJ-NP-Za-km-z]+$")

    /** bech32 데이터부 — 소문자·숫자 (1, b, i, o 제외). */
    private val BECH32_BODY = Regex("^[02-9ac-hj-np-z]+$")
}
