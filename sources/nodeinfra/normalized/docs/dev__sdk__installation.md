<!--
source_url: https://docs.nodeinfra.com/dev/sdk/installation
path: /dev/sdk/installation
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: Java SDK 의존성 추가 및 환경 설정
-->

# 설치

## Gradle (Kotlin DSL)

build.gradle.kts

```
dependencies {
    implementation("com.nodeinfra:nodewallet-sdk:0.1.0")
}
```

## Maven

pom.xml

```
<dependency>
    <groupId>com.nodeinfra</groupId>
    <artifactId>nodewallet-sdk</artifactId>
    <version>0.1.0</version>
</dependency>
```

## JVM 플래그

SDK는 PKCS#11 네이티브 브릿지를 사용합니다. 다음 JVM 플래그가 필요합니다:

```
--add-modules jdk.crypto.cryptoki
--add-exports jdk.crypto.cryptoki/sun.security.pkcs11.wrapper=ALL-UNNAMED
```

### Gradle 설정

build.gradle.kts

```
tasks.withType<JavaCompile> {
    options.compilerArgs.addAll(listOf(
        "--add-modules", "jdk.crypto.cryptoki",
        "--add-exports", "jdk.crypto.cryptoki/sun.security.pkcs11.wrapper=ALL-UNNAMED"
    ))
}
```

### 실행

```
java --add-modules jdk.crypto.cryptoki \
     --add-exports jdk.crypto.cryptoki/sun.security.pkcs11.wrapper=ALL-UNNAMED \
     -jar myapp.jar
```

## 클라이언트 생성

테넌트 클라이언트는 `tenantId(...)`로, 운영자 클라이언트는 `adminId(...)`로 생성합니다.
둘 중 하나만 호출해야 하며, 두 ID는 호환되지 않습니다.

```
NodewalletClient client = NodewalletClient.builder()
    .baseUrl("http://localhost:8090")
    .tenantId(UUID.fromString("feb25b82-d7d5-d222-d88d-fa80b2de7c1c"))
    .signer(Pkcs11Ed25519Signer.open(new Pkcs11Config(
        "SoftHSM2", "/usr/lib/softhsm/libsofthsm2.so",
        0, null, pin, "nodewallet-signing-key")))
    .build();
```

테넌트 클라이언트로 빌드하면 SDK가 동일한 PKCS#11 키를 재사용해 **3-키 다중서명**의 개시 키 레그를 자동 생성합니다.
출금·이체·스윕 요청에 `initiator_cbor_signature` / `gas_initiator_cbor_signature`를 직접 채우지 않아도, SDK가 정규화된 토큰 문자열과 집중·가스대납 지갑 주소를 바인딩한 CBOR을 빌드해 서명을 첨부합니다.
Spring Boot를 사용하는 경우 [스프링 연동](/dev/spring/setup)을 참고하세요.
`NodewalletClient`가 자동 생성되어 `@Autowired`로 주입됩니다.

## 요구사항

| 항목 | 최소 버전 |
| --- | --- |
| Java | 25 (LTS) |
| SoftHSM2 (개발) | 2.6.1 (Botan 백엔드, EdDSA 활성화) |
| Thales Luna (운영) | 펌웨어 7.8+, Client 10.5+ |
| Utimaco (운영) | 펌웨어 5.0+, EdDSA 라이선스 |
