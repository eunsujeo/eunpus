<!--
source_url: https://docs.nodeinfra.com/dev/spring/setup
path: /dev/spring/setup
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 스프링 부트에서 노드월렛 SDK 설정
-->

# 빠른 시작

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation시작하기빠른 시작

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

**1. 의존성 추가**
build.gradle.kts

```
dependencies {
    implementation("com.nodeinfra:nodewallet-spring-boot-starter:0.1.0")
}
```

**2. application.yml 설정**

```
nodewallet:
  base-url: http://localhost:8090
  operator-id: ${NW_OPERATOR_ID}
  mode: dev
  signing:
    pkcs11:
      library: /usr/lib/softhsm/libsofthsm2.so
      slot: 0
      key-label: nodewallet-signing-key
```

**3. HSM PIN 환경변수 설정**

```
export NW_HSM_PIN=1234
```

**4. 사용**

```
@Service
public class WalletService {

    private final NodewalletClient client;

    public WalletService(NodewalletClient client) {
        this.client = client;
    }

    public WalletResponse createWallet(String label) {
        return client.wallets().create(
            new CreateWalletRequest(label, Chain.SOLANA));
    }
}
```

`NodewalletClient`가 자동 생성되어 `@Autowired`로 주입됩니다.
모든 API 요청에 Ed25519 서명이 자동 첨부됩니다.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
