// engine/tx-pipeline — 쓰기 파이프라인: 멱등 → 조립(순번 점유) → 서명 → 전파 → 기록 (가이드 4)
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":engine:multichain")) // chains/* 와 engine/* 공통 — SPI
    implementation(project(":engine:signing")) // TxPipeline 이 SigningOrchestrator(가이드 5)를 직접 호출
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
