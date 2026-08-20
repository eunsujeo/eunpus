// apps/admin-api — Admin HTTP 진입점 (정책·승인·키 운영·동결·rebalance·sweep). Service 와 물리 분리된 실행 모듈 (가이드 17.2)
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(platform(libs.spring.boot.bom))
    implementation(project(":domain"))
    implementation(project(":backend:admin"))
    // 훗날 Admin 이 벤더에 직접 질의(잔액·상태 대조)하려면 여기에 :adapters:fireblocks 를 더하고 DI 로 주입한다. 지금 스텁은 domain 만.
    implementation(libs.spring.boot.starter.webflux)
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.reactor)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
