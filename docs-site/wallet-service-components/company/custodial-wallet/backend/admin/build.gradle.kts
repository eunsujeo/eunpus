// backend/admin — Admin 백엔드 (운영·거버넌스: 정책·승인·키 운영·동결·rebalance·sweep).
// Service 와 물리 분리된 권한·감사 경계. 벤더·체인 무관, 항상 우리 것. 모듈 의존은 domain 만 (가이드 17.2 · 17.3)
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(platform(libs.spring.boot.bom))
    implementation(project(":domain"))
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
