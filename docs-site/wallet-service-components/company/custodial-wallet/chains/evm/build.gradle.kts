// chains/evm — EVM 어댑터: 계정 nonce 직렬화 · EIP-1559 · RBF (가이드 2.4 · 4.2)
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
