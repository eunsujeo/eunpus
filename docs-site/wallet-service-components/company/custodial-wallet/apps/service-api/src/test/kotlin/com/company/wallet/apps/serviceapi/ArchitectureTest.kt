package com.company.wallet.apps.serviceapi

import com.tngtech.archunit.junit.AnalyzeClasses
import com.tngtech.archunit.junit.ArchTest
import com.tngtech.archunit.lang.ArchRule
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses

/**
 * 의존 방향 강제 — "의존성은 항상 안쪽(domain)으로만" 을 CI 에서 검사한다 (가이드 17.3 · 17.6).
 *
 * Gradle 모듈 그래프가 1차 방어선이고, 이 테스트가 패키지 수준의 2차 방어선이다 —
 * 깨면 빌드가 실패한다 (CLAUDE.md §4). 매니저는 Fireblocks 하나, engine/chains 는 없다.
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

    /** ② 두 backend(service·admin)는 벤더 무관 — 포트(domain)만 보고, 어댑터를 모른다 (가이드 13.7 · 17.3). */
    @ArchTest
    val backendDoesNotDependOnAdapters: ArchRule =
        noClasses()
            .that()
            .resideInAPackage("com.company.wallet.backend..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(
                "com.company.wallet.adapters..",
                "com.company.wallet.apps..",
            )

    /** ③ Service·Admin 은 물리 분리 — 서로를 컴파일 의존하지 않는다, 양방향 (가이드 17.2 두 백엔드). */
    @ArchTest
    val serviceDoesNotDependOnAdmin: ArchRule =
        noClasses()
            .that()
            .resideInAPackage("com.company.wallet.backend.service..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("com.company.wallet.backend.admin..")

    @ArchTest
    val adminDoesNotDependOnService: ArchRule =
        noClasses()
            .that()
            .resideInAPackage("com.company.wallet.backend.admin..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("com.company.wallet.backend.service..")

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

    /** ⑤ Fireblocks SDK 타입은 adapters/fireblocks 밖으로 새면 안 된다 — 교체가 깨진다 (가이드 17.3 Figure 17-1). */
    @ArchTest
    val fireblocksSdkStaysInsideItsAdapter: ArchRule =
        noClasses()
            .that()
            .resideOutsideOfPackage("com.company.wallet.adapters.fireblocks..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("com.fireblocks..")
}
