// apps/indexer-worker — 상시 수집 worker + 정합성 주기 sweep (가이드 3 · 7 · 15.6). HTTP 진입점 없음
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
    implementation(project(":backend"))
    implementation(project(":engine:multichain"))
    implementation(project(":engine:indexer"))
    implementation(project(":adapters:self-build"))
    implementation(libs.spring.boot.starter)
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
