// engine/indexer — 수집(체인별 ChainSource) 뒤의 체인 무관 가공·projection·제공 (가이드 3)
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
