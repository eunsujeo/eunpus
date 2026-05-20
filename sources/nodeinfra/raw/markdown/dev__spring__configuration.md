<!--
source_url: https://docs.nodeinfra.com/dev/spring/configuration
path: /dev/spring/configuration
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 프로파일 관리, 환경변수, 타임아웃, 커스텀 빈
-->

# 상세 설정

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation시작하기상세 설정

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​프로파일별 설정

### ​개발 환경 (application-dev.yml)

```
nodewallet:
  base-url: http://localhost:8090
  operator-id: feb25b82-d7d5-d222-d88d-fa80b2de7c1c
  mode: dev
  signing:
    pkcs11:
      library: /usr/local/lib/softhsm/libsofthsm2.so
      slot: 0
      key-label: nodewallet-signing-key
  connect-timeout: 5s
  request-timeout: 30s
```

### ​운영 환경 (application-prod.yml)

```
nodewallet:
  base-url: https://nodewallet.internal
  operator-id: ${NW_OPERATOR_ID}
  mode: production
  signing:
    pkcs11:
      library: /usr/safenet/lunaclient/lib/libCryptoki2_64.so
      token-label: nodewallet-prod
      key-label: nodewallet-signing-key
  connect-timeout: 3s
  request-timeout: 15s
```

## ​환경변수 관리

모든 민감한 값은 환경변수로 주입합니다:

```
export NW_OPERATOR_ID=실제-운영자-UUID
export NW_HSM_PIN=HSM-핀-값
export SPRING_PROFILES_ACTIVE=prod
```

`NW_HSM_PIN`은 절대 `application.yml`에 포함하면 안 됩니다.
`NodewalletProperties`에는 의도적으로 PIN 필드가 없습니다.

## ​타임아웃 설정

| 설정 | 기본값 | 권장값 (운영) | 설명 |
| --- | --- | --- | --- |
| connect-timeout | 5s | 3s | TCP 연결 타임아웃 |
| request-timeout | 30s | 15s | HTTP 응답 타임아웃 |

## ​커스텀 Ed25519Signer 빈

`@ConditionalOnMissingBean`으로 자동 설정되므로, 커스텀 빈을 정의하면 대체됩니다:

```
@Configuration
public class CustomSignerConfig {

    @Bean
    public Ed25519Signer customSigner() {
        return new MyCustomSigner();
    }
}
```

## ​Actuator 보안

```
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    env:
      show-values: NEVER
```

## ​커스텀 ObjectMapper

SDK는 기본 `ObjectMapper`를 내부적으로 생성합니다 (`SNAKE_CASE`, `FAIL_ON_UNKNOWN_PROPERTIES=false`).

```
NodewalletClient client = NodewalletClient.builder()
    .baseUrl("https://nodewallet.internal")
    .tenantId(tenantId)
    .signer(signer)
    .objectMapper(customMapper)
    .build();
```

커스텀 `ObjectMapper`를 사용할 경우, `SNAKE_CASE` 네이밍과
`JavaTimeModule` 등록을 잊지 마세요. 그렇지 않으면 역직렬화가 실패합니다.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
