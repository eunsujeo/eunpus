package com.company.wallet.apps.api

import com.company.wallet.adapters.alchemy.AlchemyChainQueryAdapter
import com.company.wallet.adapters.fireblocks.FireblocksAdapter
import com.company.wallet.adapters.fireblocks.RestFireblocksClient
import com.company.wallet.adapters.nodewallet.NodeWalletAdapter
import com.company.wallet.adapters.nodewallet.SdkNodeWalletClient
import com.company.wallet.adapters.selfbuild.Bip44HdWallet
import com.company.wallet.adapters.selfbuild.DepthConfirmationPolicy
import com.company.wallet.adapters.selfbuild.InMemoryProjectionStore
import com.company.wallet.adapters.selfbuild.InMemoryRawEventStore
import com.company.wallet.adapters.selfbuild.InMemorySignatureStore
import com.company.wallet.adapters.selfbuild.InMemorySubmissionStore
import com.company.wallet.adapters.selfbuild.IndexerQueryAdapter
import com.company.wallet.adapters.selfbuild.SelfBuildAdapter
import com.company.wallet.backend.directory.AccountDirectory
import com.company.wallet.backend.directory.InMemoryAccountDirectory
import com.company.wallet.chains.canton.CantonChainAdapter
import com.company.wallet.chains.canton.GrpcCantonParticipantClient
import com.company.wallet.chains.evm.EvmChainAdapter
import com.company.wallet.chains.evm.JsonRpcEvmNodeClient
import com.company.wallet.chains.evm.LocalNonceManager
import com.company.wallet.chains.solana.JsonRpcSolanaNodeClient
import com.company.wallet.chains.solana.SolanaChainAdapter
import com.company.wallet.chains.utxo.JsonRpcUtxoNodeClient
import com.company.wallet.chains.utxo.UtxoChainAdapter
import com.company.wallet.engine.indexer.SelfIndexer
import com.company.wallet.engine.multichain.ChainAdapterRegistry
import com.company.wallet.engine.signing.Signer
import com.company.wallet.engine.signing.SigningOrchestrator
import com.company.wallet.engine.txpipeline.TxPipeline
import com.company.wallet.shared.idempotency.IdempotencyStore
import com.company.wallet.shared.idempotency.InMemoryIdempotencyStore
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * custody 어댑터 wiring — 교체는 `custody.provider` 설정 한 줄 (가이드 17.6).
 *
 * 어댑터 빈 하나가 custody 두 포트(AccountPort·TransactionPort)를 함께 구현하고, ChainQueryPort 는 별개 슬롯(인덱서/Alchemy 어댑터)이므로,
 * backend(게이트웨이)는 포트 타입으로 그 빈을 주입받는다 — 어떤 벤더인지 모른 채 (가이드 13 · 17.3).
 */
@Configuration
class CustodyAdapterConfig {
    /** 게이트웨이 멱등 저장소 — 운영은 영속(DB/Redis) 구현으로 교체 (가이드 6.3). */
    @Bean
    fun idempotencyStore(): IdempotencyStore = InMemoryIdempotencyStore()

    /**
     * 계정 디렉터리 — 발급 결과(계정·주소 매핑)는 백엔드가 저장·소유한다 (가이드 9.3 · 17.2).
     * 벤더 교체 후에도 남는 우리 데이터이므로 운영은 영속(DB) 구현으로 교체.
     */
    @Bean
    fun accountDirectory(): AccountDirectory = InMemoryAccountDirectory()

    /** 옵션 1 — Fireblocks SaaS custody (가이드 14). 현재 기본. */
    @Bean
    @ConditionalOnProperty("custody.provider", havingValue = "fireblocks")
    fun fireblocksAdapter(): FireblocksAdapter = FireblocksAdapter(RestFireblocksClient())

    /**
     * 옵션 2 (직접 구축) — engine 부품 + 체인 어댑터 조립 (가이드 15 · 17.5).
     *
     * Fireblocks 가 묶어주던 서명·전파·nonce·수신감지를 여기서 부품으로 다시 펼친다 —
     * 단 그 분리는 어댑터 내부에서만 보이고 코어에는 노출되지 않는다 (가이드 15.1).
     */
    @Bean
    @ConditionalOnProperty("custody.provider", havingValue = "selfbuild")
    fun selfBuildAdapter(): SelfBuildAdapter {
        // TODO: 노드 endpoint 를 설정(application.yml)으로 외부화 — 노드 조달 옵션은 가이드 15.7
        val evmNode = JsonRpcEvmNodeClient(endpoint = "http://localhost:8545")
        val registry =
            ChainAdapterRegistry(
                listOf(
                    EvmChainAdapter(evmNode, LocalNonceManager(evmNode)),
                    UtxoChainAdapter(JsonRpcUtxoNodeClient(endpoint = "http://localhost:8332")),
                    SolanaChainAdapter(JsonRpcSolanaNodeClient(endpoint = "http://localhost:8899")),
                    CantonChainAdapter(GrpcCantonParticipantClient(endpoint = "localhost:5011")),
                ),
            )
        val signer =
            object : Signer {
                override suspend fun sign(payload: ByteArray): ByteArray = TODO("자체 HSM/MPC 서명 경계 (가이드 5)")
            }
        val signing = SigningOrchestrator(signer, InMemorySignatureStore())
        val pipeline = TxPipeline(registry, signing, InMemorySubmissionStore())
        val projections = InMemoryProjectionStore()
        val indexer =
            SelfIndexer(
                // TODO: 체인별 ChainSource wiring — 상시 수집은 apps/indexer-worker 가 가동 (가이드 15.6)
                emptyList(),
                projections,
                InMemoryRawEventStore(),
                DepthConfirmationPolicy(),
            )
        return SelfBuildAdapter(Bip44HdWallet(), pipeline, indexer, projections, registry)
    }

    /** 옵션 2 를 기성 제품으로 — NodeWallet 온프렘 custody, Solana 전용 (가이드 16). */
    @Bean
    @ConditionalOnProperty("custody.provider", havingValue = "nodewallet")
    fun nodeWalletAdapter(): NodeWalletAdapter = NodeWalletAdapter(SdkNodeWalletClient())

    /** (선택) custody 가 안 주는 임의·커스텀 조회 — ChainQueryPort 만 따로 (가이드 13.4). */
    @Bean
    @ConditionalOnProperty("chainquery.provider", havingValue = "alchemy")
    fun alchemyChainQueryAdapter(): AlchemyChainQueryAdapter = AlchemyChainQueryAdapter()

    /**
     * (선택) 자체 인덱서로 ChainQuery — custody 와 별개 슬롯, 하이브리드와 같은 클래스 한 벌 (가이드 15.2 · 13.4).
     * 이 빈을 켜는 순간 인덱서 상시 job 운영은 우리 몫이다 (가이드 15.6).
     */
    @Bean
    @ConditionalOnProperty("chainquery.provider", havingValue = "indexer")
    fun indexerQueryAdapter(): IndexerQueryAdapter = IndexerQueryAdapter(InMemoryProjectionStore())
}
