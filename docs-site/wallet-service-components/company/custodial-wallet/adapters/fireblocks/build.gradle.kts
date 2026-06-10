// adapters/fireblocks — Fireblocks custody 어댑터 (가이드 14). 순수 Kotlin — SDK 의존은 의도적으로 비움
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
