// adapters/self-build — 자체 구축 custody 어댑터 (가이드 15). engine 부품을 조립해 세 포트 전부 채운다
plugins {
    alias(libs.plugins.kotlin.jvm)
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":shared"))
    implementation(project(":engine:multichain"))
    implementation(project(":engine:indexer"))
    implementation(project(":engine:tx-pipeline"))
    implementation(project(":engine:signing"))
    implementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.junit.jupiter)
}

tasks.test {
    useJUnitPlatform()
}
