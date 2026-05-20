<!--
source_url: https://docs.nodeinfra.com/dev/quickstart
path: /dev/quickstart
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 5분 안에 노드월렛 API와 연동하기
-->

# 빠른 시작

## 1단계: Gradle 의존성 추가

build.gradle.kts

```
dependencies {
    implementation("com.nodeinfra:nodewallet-sdk:0.1.0")
}
```

## 2단계: SoftHSM2 설정 (개발 환경)

```
# SoftHSM2 토큰 초기화 및 개발용 키 생성
./sdk/scripts/setup-softhsm.sh
export NW_HSM_PIN=1234
```

## 3단계: 클라이언트 생성

```
NodewalletClient client = NodewalletClient.builder()
    .baseUrl("http://localhost:8090")
    .tenantId(UUID.fromString("feb25b82-d7d5-d222-d88d-fa80b2de7c1c"))
    .signer(Pkcs11Ed25519Signer.open(new Pkcs11Config(
        "SoftHSM2", "/usr/lib/softhsm/libsofthsm2.so",
        0, null, "1234".toCharArray(), "nodewallet-signing-key")))
    .build();
```

## 4단계: 첫 API 호출

```
WalletResponse wallet = client.wallets().create(
    new CreateWalletRequest("test-wallet", Chain.SOLANA));

System.out.println("지갑 ID: " + wallet.walletId());
System.out.println("입금 주소: " + wallet.depositAddress());
```

모든 API 요청에 Ed25519 서명이 자동으로 첨부됩니다.
Spring Boot를 사용하는 경우 [스프링 연동](/dev/spring/setup)을 참고하세요.
`NodewalletClient`가 자동 생성되어 `@Autowired`로 주입됩니다.
