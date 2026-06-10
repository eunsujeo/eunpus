// adapters/nodewallet — NodeWallet 온프렘 custody 어댑터 (가이드 16, Solana 전용). 순수 Kotlin — SDK 의존은 비움
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":shared"))
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
