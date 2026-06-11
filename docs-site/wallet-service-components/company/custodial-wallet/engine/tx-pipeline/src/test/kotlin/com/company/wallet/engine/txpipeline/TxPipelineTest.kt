package com.company.wallet.engine.txpipeline

import com.company.wallet.domain.model.Account
import com.company.wallet.domain.model.AccountRef
import com.company.wallet.domain.model.Address
import com.company.wallet.domain.model.Amount
import com.company.wallet.domain.model.Asset
import com.company.wallet.domain.model.ChainId
import com.company.wallet.domain.model.FeeEstimate
import com.company.wallet.domain.model.TransactionRequest
import com.company.wallet.domain.model.TxRef
import com.company.wallet.engine.multichain.ChainAdapter
import com.company.wallet.engine.multichain.ChainAdapterRegistry
import com.company.wallet.engine.multichain.Confirmation
import com.company.wallet.engine.multichain.SignedTx
import com.company.wallet.engine.multichain.UnsignedTx
import com.company.wallet.engine.signing.SignatureStore
import com.company.wallet.engine.signing.Signer
import com.company.wallet.engine.signing.SigningOrchestrator
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigInteger

/** 가이드 4.3 멱등 불변식 — 같은 멱등 키 재제출은 조립·서명·전파 없이 기존 txRef 를 돌려준다. */
class TxPipelineTest {
    @Test
    fun `같은 멱등 키로 두 번 제출하면 같은 txRef 를 반환하고 전파는 한 번만 일어난다`() =
        runBlocking {
            val chainId = ChainId("test-chain")
            val adapter = FakeChainAdapter(chainId)
            val pipeline =
                TxPipeline(
                    adapters = ChainAdapterRegistry(listOf(adapter)),
                    signing = SigningOrchestrator(FakeSigner(), InMemorySignatureStore()),
                    store = InMemorySubmissionStore(),
                )
            val asset = Asset("TST", chainId)
            val request =
                TransactionRequest(
                    idempotencyKey = "idem-1",
                    account = AccountRef("acct-1"),
                    to = Address("addr-recipient", asset),
                    asset = asset,
                    amount = Amount(BigInteger.TEN, 18),
                )

            val first = pipeline.submit(request)
            val second = pipeline.submit(request)

            assertEquals(first, second)
            assertEquals(1, adapter.broadcastCount)
        }
}

private class FakeChainAdapter(
    override val chainId: ChainId,
) : ChainAdapter {
    override val supportsFeeBump: Boolean = true
    var broadcastCount = 0

    override suspend fun buildTransaction(request: TransactionRequest): UnsignedTx =
        UnsignedTx(
            id = "unsigned-${request.idempotencyKey}",
            request = request,
            chainId = chainId,
            signingPayload = byteArrayOf(1, 2, 3),
        )

    override suspend fun broadcast(signedTx: SignedTx): TxRef {
        broadcastCount += 1
        return TxRef("tx-$broadcastCount", chainId)
    }

    override suspend fun addressOf(
        account: Account,
        asset: Asset,
    ): Address = error("not used")

    override suspend fun getBalance(
        address: Address,
        asset: Asset,
    ): Amount = error("not used")

    override suspend fun estimateFee(request: TransactionRequest): FeeEstimate = error("not used")

    override suspend fun confirmations(txRef: TxRef): Confirmation = error("not used")

    override suspend fun rebuildForResend(
        txRef: TxRef,
        feeBumpStep: Int,
    ): UnsignedTx = error("not used")
}

private class FakeSigner : Signer {
    override suspend fun sign(payload: ByteArray): ByteArray = byteArrayOf(9, 9, 9)
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

private class InMemorySubmissionStore : SubmissionStore {
    private val byKey = mutableMapOf<String, Submission>()

    override suspend fun findByIdempotencyKey(key: String): Submission? = byKey[key]

    override suspend fun findByTxRef(txRef: TxRef): Submission? = byKey.values.find { it.txRef == txRef }

    override suspend fun record(submission: Submission) {
        byKey[submission.idempotencyKey] = submission
    }

    override suspend fun stuckCandidates(): List<Submission> = emptyList()
}
