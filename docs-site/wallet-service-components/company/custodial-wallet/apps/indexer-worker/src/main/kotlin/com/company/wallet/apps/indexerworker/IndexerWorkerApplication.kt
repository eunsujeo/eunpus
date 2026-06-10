package com.company.wallet.apps.indexerworker

import com.company.wallet.adapters.selfbuild.DepthConfirmationPolicy
import com.company.wallet.adapters.selfbuild.InMemoryProjectionStore
import com.company.wallet.adapters.selfbuild.InMemoryRawEventStore
import com.company.wallet.engine.indexer.ProjectionStore
import com.company.wallet.engine.indexer.SelfIndexer
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.scheduling.annotation.EnableScheduling

/**
 * 인덱서 worker — 요청 경로와 분리된 상시 수집 job (가이드 15.6).
 *
 * nonce·서명·전파는 요청이 올 때 동작하지만, 인덱서 수집·가공은 체인이 흐르는 한 계속 돌아야 한다 —
 * 끊기면 입금·확정을 놓친다. 그래서 API 와 별도 실행 모듈이다 (가이드 17.2).
 * 정합성 주기 sweep(가이드 7.5 ②)도 같은 배경 성격이라 이 worker 가 함께 돌린다 —
 * backend.reconciliation 의 @Scheduled sweep 이 그것이다.
 */
@SpringBootApplication(
    scanBasePackages = [
        "com.company.wallet.apps.indexerworker",
        "com.company.wallet.backend.reconciliation",
        "com.company.wallet.backend.alerts",
    ],
)
@EnableScheduling
class IndexerWorkerApplication {
    @Bean
    fun projectionStore(): ProjectionStore = InMemoryProjectionStore()

    @Bean
    fun selfIndexer(projectionStore: ProjectionStore): SelfIndexer =
        SelfIndexer(
            // TODO: 체인별 ChainSource wiring — chains/* 의 소스(폴링·구독)를 꽂는다 (가이드 3.2)
            emptyList(),
            projectionStore,
            InMemoryRawEventStore(),
            DepthConfirmationPolicy(),
        )
}

fun main(args: Array<String>) {
    runApplication<IndexerWorkerApplication>(*args)
}
