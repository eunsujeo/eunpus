// chains/utxo — UTXO 어댑터: coin 선택 · feerate · RBF/CPFP (가이드 2.4 · 4.3)
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
