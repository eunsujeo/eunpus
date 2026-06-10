package com.company.wallet.apps.api

import com.tngtech.archunit.junit.AnalyzeClasses
import com.tngtech.archunit.junit.ArchTest
import com.tngtech.archunit.lang.ArchRule
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses

/**
 * 의존 방향 강제 — "의존성은 항상 안쪽(domain)으로만" 을 CI 에서 검사한다 (가이드 17.3 · 17.6).
 *
 * Gradle 모듈 그래프가 1차 방어선이고, 이 테스트가 패키지 수준의 2차 방어선이다 —
 * 깨면 빌드가 실패한다 (CLAUDE.md §4).
 */
@AnalyzeClasses(packages = ["com.company.wallet"])
class ArchitectureTest {
    /** ① domain 은 안쪽 핵 — 표준 라이브러리·coroutines 외 어떤 모듈도 의존하지 않는다 (가이드 17.3). */
    @ArchTest
    val domainDependsOnNothingOutside: ArchRule =
        classes()
            .that()
            .resideInAPackage("com.company.wallet.domain..")
            .should()
            .onlyDependOnClassesThat()
            .resideInAnyPackage(
                "com.company.wallet.domain..",
                "kotlin..",
                "kotlinx..",
                "java..",
                "org.jetbrains.annotations..",
            )

    /** ② backend 는 벤더·체인 무관 — 포트(domain)만 보고, 어댑터·엔진·체인을 모른다 (가이드 13.7 · 17.3). */
    @ArchTest
    val backendDoesNotDependOnAdaptersEngineChains: ArchRule =
        noClasses()
            .that()
            .resideInAPackage("com.company.wallet.backend..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(
                "com.company.wallet.adapters..",
                "com.company.wallet.engine..",
                "com.company.wallet.chains..",
            )

    /** ③ chains 는 프로토콜 구현 — SPI(engine/multichain)와 domain 쪽으로만 의존한다 (CLAUDE.md §5 SPI 역전). */
    @ArchTest
    val chainsDoNotDependOnOuterLayers: ArchRule =
        noClasses()
            .that()
            .resideInAPackage("com.company.wallet.chains..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(
                "com.company.wallet.adapters..",
                "com.company.wallet.backend..",
                "com.company.wallet.apps..",
            )

    /** ④ adapters 는 교체 축 — backend·apps 를 모른다 (어댑터 교체가 위층을 못 흔들게, 가이드 17.3). */
    @ArchTest
    val adaptersDoNotDependOnBackendOrApps: ArchRule =
        noClasses()
            .that()
            .resideInAPackage("com.company.wallet.adapters..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(
                "com.company.wallet.backend..",
                "com.company.wallet.apps..",
            )
}
