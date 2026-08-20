plugins {
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.spring) apply false
    alias(libs.plugins.spring.boot) apply false
    alias(libs.plugins.ktlint) apply false
}

allprojects {
    group = "com.company.wallet"
    version = "0.1.0-SNAPSHOT"
}

subprojects {
    // lint/format — ktlint (.editorconfig 의 ktlint_official 스타일을 따른다)
    apply(plugin = "org.jlleitschuh.gradle.ktlint")
}
