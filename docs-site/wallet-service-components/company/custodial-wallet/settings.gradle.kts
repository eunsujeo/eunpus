pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
    }
}

rootProject.name = "custodial-wallet"

// 가이드 17.2 — 각 디렉터리 = 서브프로젝트. Gradle 은 와일드카드 include 를 지원하지 않으므로 전부 나열한다.
// 매니저는 Fireblocks(유일한 라이브), 태우는 체인은 EVM(이더리움·Base). engine/chains 는
// 자체 구축 전환 때 채우는 자리라 지금은 없다 (가이드 17.5). 포트 계약은 adapters/fake 로 벤더 없이 검증한다.
include(
    ":domain",
    ":shared",
    ":backend:service",
    ":backend:admin",
    ":adapters:fireblocks",
    ":adapters:fake",
    ":adapters:chainquery-alchemy",
    ":apps:service-api",
    ":apps:admin-api",
    ":apps:webhook-receiver",
)
