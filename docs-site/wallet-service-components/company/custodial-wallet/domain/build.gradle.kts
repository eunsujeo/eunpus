// domain — 순수 Kotlin (가이드 17.6: Spring 의존 금지). 모두가 이 모듈을 의존하고, 이 모듈은 누구도 의존하지 않는다.
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
