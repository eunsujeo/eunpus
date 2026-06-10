// adapters/chainquery-alchemy — ChainQueryPort 만 채우는 보조 어댑터 (가이드 13.4). 순수 Kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(project(":domain"))
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
