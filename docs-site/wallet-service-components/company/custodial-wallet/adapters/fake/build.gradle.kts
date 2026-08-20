// adapters/fake — 벤더 없는 테스트용 가짜 custody 어댑터. 인메모리 구현으로 포트 계약을
// 검증한다(계약 테스트·백엔드 검증). 라이브 어댑터(fireblocks)와 같은 포트를 채운다 (가이드 17.2 · 17.3). 순수 Kotlin
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
