// shared — 모듈 공통 유틸 (멱등 저장소 등). 순수 Kotlin (Spring 의존 금지, 가이드 17.2)
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
