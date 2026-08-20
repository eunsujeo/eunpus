package com.company.wallet.apps.serviceapi

import com.company.wallet.adapters.alchemy.AlchemyChainQueryAdapter
import com.company.wallet.adapters.fake.FakeCustodyAdapter
import com.company.wallet.adapters.fireblocks.FireblocksAdapter
import com.company.wallet.adapters.fireblocks.RestFireblocksClient
import com.company.wallet.backend.service.directory.AccountDirectory
import com.company.wallet.backend.service.directory.InMemoryAccountDirectory
import com.company.wallet.shared.idempotency.IdempotencyStore
import com.company.wallet.shared.idempotency.InMemoryIdempotencyStore
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * custody 어댑터 wiring — 매니저는 Fireblocks(유일한 라이브)다 (가이드 14 · 17.3).
 *
 * 어댑터 빈 하나가 custody 두 포트(AccountPort·TransactionPort)를 함께 구현하고, ChainQueryPort 는
 * 별개 슬롯(선택 · Alchemy)이므로 backend(게이트웨이)는 포트 타입으로 그 빈을 주입받는다 —
 * 어떤 벤더인지 모른 채 (가이드 13 · 17.3). 벤더를 바꾸거나 자체 구축으로 전환하면 새 어댑터
 * 모듈을 더하고 이 wiring 한 줄만 바꾼다 (가이드 17.5).
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

    /** Fireblocks SaaS custody (가이드 14) — 유일한 라이브 어댑터, 기본값(설정 없으면 이걸로). */
    @Bean
    @ConditionalOnProperty("custody.provider", havingValue = "fireblocks", matchIfMissing = true)
    fun fireblocksAdapter(): FireblocksAdapter = FireblocksAdapter(RestFireblocksClient())

    /**
     * 테스트 프로파일용 가짜 어댑터 — 벤더 자격증명 없이 백엔드를 굴려 본다 (가이드 17.2).
     * `custody.provider=fake` 일 때만 뜬다. 라이브 Fireblocks 와 같은 포트를 채운다.
     */
    @Bean
    @ConditionalOnProperty("custody.provider", havingValue = "fake")
    fun fakeAdapter(): FakeCustodyAdapter = FakeCustodyAdapter()

    /** (선택) custody 가 안 주는 임의·커스텀 조회 — ChainQueryPort 만 따로 (가이드 13.4). */
    @Bean
    @ConditionalOnProperty("chainquery.provider", havingValue = "alchemy")
    fun alchemyChainQueryAdapter(): AlchemyChainQueryAdapter = AlchemyChainQueryAdapter()
}
