// engine/multichain — 체인 SPI (ChainAdapter · ChainSource) + chainId 디스패치 (가이드 2)
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    api(project(":domain"))
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
