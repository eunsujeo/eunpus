package com.company.wallet.engine.signing

import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.engine.multichain.UnsignedTx
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigInteger

/** 가이드 5.4 멱등 가드 — 기존 서명이 있으면 재서명하지 않고 재사용한다 (유효 서명 2개 → 이중 전파 방지). */
class SigningOrchestratorTest {
    @Test
    fun `같은 unsignedTx 를 두 번 서명하면 서명자는 한 번만 호출되고 같은 서명을 재사용한다`() =
        runBlocking {
            val signer = CountingSigner()
            val orchestrator = SigningOrchestrator(signer, InMemorySignatureStore())
            val chainId = ChainId("test-chain")
            val asset = Asset("TST", chainId)
            val unsignedTx =
                UnsignedTx(
                    id = "unsigned-1",
                    request =
                        TransactionRequest(
                            idempotencyKey = "idem-1",
                            account = AccountRef("acct-1"),
                            to = Address("addr-recipient", asset),
                            asset = asset,
                            amount = Amount(BigInteger.TEN, 18),
                        ),
                    chainId = chainId,
                    signingPayload = byteArrayOf(1, 2, 3),
                )

            val first = orchestrator.sign(unsignedTx)
            val second = orchestrator.sign(unsignedTx)

            assertEquals(1, signer.signCalls)
            assertArrayEquals(first.signature, second.signature)
        }
}

private class CountingSigner : Signer {
    var signCalls = 0

    override suspend fun sign(payload: ByteArray): ByteArray {
        signCalls += 1
        return byteArrayOf(7, 7, signCalls.toByte())
    }
}

private class InMemorySignatureStore : SignatureStore {
    private val signatures = mutableMapOf<String, ByteArray>()
    private val attempts = mutableSetOf<String>()

    override suspend fun findSignature(unsignedTxId: String): ByteArray? = signatures[unsignedTxId]

    override suspend fun hasAttempt(unsignedTxId: String): Boolean = unsignedTxId in attempts

    override suspend fun markAttempt(unsignedTxId: String) {
        attempts += unsignedTxId
    }

    override suspend fun saveSignature(
        unsignedTxId: String,
        signature: ByteArray,
    ) {
        signatures[unsignedTxId] = signature
    }
}
