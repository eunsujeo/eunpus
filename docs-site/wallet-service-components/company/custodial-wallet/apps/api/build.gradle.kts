// apps/api — HTTP 진입점. 어떤 custody 어댑터를 쓸지 여기서 wiring 한다 (가이드 17.6)
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(platform(libs.spring.boot.bom))
    implementation(project(":domain"))
    implementation(project(":shared"))
    implementation(project(":backend"))
    implementation(project(":engine:multichain"))
    implementation(project(":engine:indexer"))
    implementation(project(":engine:tx-pipeline"))
    implementation(project(":engine:signing"))
    implementation(project(":chains:evm"))
    implementation(project(":chains:utxo"))
    implementation(project(":chains:solana"))
    implementation(project(":chains:canton"))
    implementation(project(":adapters:fireblocks"))
    implementation(project(":adapters:self-build"))
    implementation(project(":adapters:nodewallet"))
    implementation(project(":adapters:chainquery-alchemy"))
    implementation(libs.spring.boot.starter.webflux)
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.reactor)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.junit.jupiter)
    testImplementation(libs.archunit.junit5)
}

tasks.test {
    useJUnitPlatform()
}
