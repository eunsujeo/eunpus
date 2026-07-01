// apps/service-api — Service HTTP 진입점. custody 어댑터 wiring 은 여기서 한다 (가이드 17.6)
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
    implementation(project(":shared"))
    implementation(project(":backend:service"))
    implementation(project(":adapters:fireblocks"))
    implementation(project(":adapters:fake"))
    implementation(project(":adapters:chainquery-alchemy"))
    implementation(libs.spring.boot.starter.webflux)
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.reactor)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.junit.jupiter)
    testImplementation(libs.archunit.junit5)
}

tasks.test {
    useJUnitPlatform()
}
