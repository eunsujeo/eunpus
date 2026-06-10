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
include(
    ":domain",
    ":shared",
    ":backend",
    ":engine:multichain",
    ":engine:indexer",
    ":engine:tx-pipeline",
    ":engine:signing",
    ":chains:evm",
    ":chains:utxo",
    ":chains:solana",
    ":chains:canton",
    ":adapters:fireblocks",
    ":adapters:self-build",
    ":adapters:nodewallet",
    ":adapters:chainquery-alchemy",
    ":apps:api",
    ":apps:indexer-worker",
    ":apps:webhook-receiver",
)
