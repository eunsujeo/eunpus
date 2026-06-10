package com.company.wallet.apps.indexerworker

import com.company.wallet.engine.indexer.SelfIndexer
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.springframework.beans.factory.DisposableBean
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component

/**
 * 앱 기동 시 [SelfIndexer.run] 을 코루틴으로 시작한다 — 상시 가동 (가이드 15.6).
 *
 * SupervisorJob: 수집 코루틴 한쪽의 실패가 scope 전체를 죽이지 않게.
 * 종료 시 scope 를 취소해 수집을 정리한다.
 */
@Component
class SelfIndexerLauncher(
    private val indexer: SelfIndexer,
) : ApplicationRunner,
    DisposableBean {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default + CoroutineName("self-indexer"))

    override fun run(args: ApplicationArguments) {
        scope.launch {
            indexer.run()
        }
    }

    override fun destroy() {
        scope.cancel()
    }
}
