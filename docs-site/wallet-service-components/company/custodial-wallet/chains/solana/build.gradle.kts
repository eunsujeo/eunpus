// chains/solana — Solana 어댑터: recentBlockhash · commitment · auto-retry, boost 없음 (가이드 2.4 · 4.4)
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":engine:multichain")) // chains/* 와 engine/* 공통 — SPI
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
