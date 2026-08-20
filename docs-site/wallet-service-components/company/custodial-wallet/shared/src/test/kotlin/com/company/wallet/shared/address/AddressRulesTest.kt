package com.company.wallet.shared.address

import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

/** 가이드 13.3 — 주소 검증은 로컬 체인 규칙, 벤더 API 불요. */
class AddressRulesTest {
    private val eth = Asset(symbol = "ETH", chainId = ChainId.ETHEREUM)

    private fun address(value: String): Address = Address(value = value, asset = eth)

    @Test
    fun `ethereum — 0x + 40 hex 는 통과한다`() {
        assertTrue(AddressRules.validate(eth, address("0x52908400098527886E0F7030069857D2E4169EE7")))
    }

    @Test
    fun `ethereum — prefix 누락·길이 불일치·hex 아님은 거절한다`() {
        assertFalse(AddressRules.validate(eth, address("52908400098527886E0F7030069857D2E4169EE7")))
        assertFalse(AddressRules.validate(eth, address("0x529084000985278")))
        assertFalse(AddressRules.validate(eth, address("0xZZ908400098527886E0F7030069857D2E4169EE7")))
    }

    @Test
    fun `미등록 체인은 보수적으로 거절한다`() {
        val unknown = Asset(symbol = "XYZ", chainId = ChainId("unknown-chain"))
        assertFalse(AddressRules.validate(unknown, Address(value = "anything", asset = unknown)))
    }
}
