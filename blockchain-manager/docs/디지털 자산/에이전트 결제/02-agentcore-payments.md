---
title: AWS AgentCore payments — 관리형 에이전트 결제
status: Done
date: 2026-08-20
view: grid
---

# 지갑 credential 을 에이전트에게 주지 않는 구조

Amazon Bedrock AgentCore payments 는 에이전트의 x402·MPP 결제를 대행하는 관리형 서비스다 (2026-05 프리뷰 — US East·US West·Frankfurt·Sydney). 핵심 설계는 지갑 credential 을 에이전트 코드가 아니라 서비스 계층에 격리하는 것이다 — 에이전트는 결제를 "요청" 할 수 있을 뿐, 키를 만질 수 없다.

## 자원 모델

| 자원 | 무엇 | 경계 |
|---|---|---|
| **PaymentManager** | 계정 단위 최상위 자원 | 인증 방식(`AWS_IAM`·`CUSTOM_JWT`)과 IAM role 을 정한다. 앱·환경·팀 단위로 분리 |
| **PaymentConnector** | 외부 지갑 인프라 통합 | 타입 2종 — `CoinbaseCDP` · `StripePrivy`. Manager 하나에 여러 커넥터 가능 |
| **PaymentCredentialProvider** | 벤더 credential 저장 | 커넥터와 1:1. API key·wallet secret 을 AgentCore Identity 를 통해 AWS Secrets Manager 에 저장, runtime 에는 토큰만 발급 |
| **PaymentSession** | 상호작용 하나의 지출 컨텍스트 | 만료 시간 + 선택적 한도 (`maxSpendAmount`·`currency`). 서명 실패 시 차감 자동 롤백 |
| **PaymentInstrument** | embedded crypto wallet | 체인별 별도 instrument (주소를 체인 간 공유 불가). 유일 타입 = `EMBEDDED_CRYPTO_WALLET` |

## 역할과 업체 — 채워진 자리와 열린 자리

x402 프로토콜 문서가 전부 역할(client·server·facilitator·sponsor)로 쓰여 있는 것과 달리, AgentCore 는 그 역할 일부에 실제 업체를 채워 넣은 상품이다.

| 등장 요소 | 업체 / 역할 | 누구 |
|---|---|---|
| AgentCore payments | **업체** | AWS — 관리형 서비스 자체 |
| 지갑 인프라 (PaymentConnector) | **업체 (택 1)** | 커넥터 타입 이름이 곧 회사다 — `CoinbaseCDP` (Coinbase Developer Platform) 또는 `StripePrivy` (Stripe 의 Privy 지갑 인프라) 중 선택해 연결 |
| 유료 자원 발견 | **업체 서비스** | Coinbase 가 운영하는 x402 Bazaar (MCP 서버) |
| Merchant | 역할 | API·콘텐츠를 파는 누구든 |
| Facilitator | 역할 | 검증·정산 대행 — 어느 업체가 맡는지는 공개 문서에 없다 (merchant 자체 또는 제3자) |
| End user · Agent developer | 역할 | 사용자: 충전·권한 부여/회수 · 개발자: Manager·Connector 구성 |

지불 측 관리형 구성은 AWS 와 **선택한** 지갑 인프라 업체(Coinbase CDP 또는 Stripe/Privy) 가 맡고, 받는 쪽(merchant 의 402 처리·facilitator 정산 대행)은 역할로 비어 있다 — 이 대비는 팀의 해석이다.

## 자금과 권한 — 노출 상한은 충전액

instrument 는 생성 직후 잔액 0 USDC 이고, **사용자가 명시적으로 권한을 부여하기 전에는 에이전트가 거래할 수 없다.** 충전과 권한 부여·회수는 Coinbase WalletHub / Privy wallet hub 프론트엔드에서 한다 — crypto 이체 또는 카드·Apple Pay·Google Pay·ACH.

## 결제 흐름

```mermaid
sequenceDiagram
    autonumber
    box rgb(220,252,231) 에이전트 쪽
        participant A as 에이전트
    end
    box rgb(254,249,195) AWS — AgentCore
        participant P as AgentCore payments
        participant I as AgentCore Identity<br/>Secrets Manager
    end
    box rgb(224,231,255) 지갑 인프라 업체
        participant W as Coinbase CDP ·<br/>Stripe Privy
    end
    box rgb(219,234,254) 수취·정산 쪽 — 역할
        participant M as Merchant
        participant F as Facilitator<br/>(선택 역할 · 업체 미상)
    end
    box rgb(244,245,247) 온체인
        participant N as 블록체인
    end

    A->>M: 유료 tool·endpoint 호출
    M-->>A: 402 Payment Required + 결제 payload<br/>금액·수취인·자산·네트워크
    A->>P: ProcessPayment (세션 id·instrument id·payload)
    P->>P: 세션 지출 한도 체크 — 초과·만료면 거절
    P->>I: 지갑 credential 토큰 취득
    P->>W: 결제 증명 구성·서명
    W-->>P: 서명된 payload
    P-->>A: 서명된 payload 반환
    A->>M: 원 요청 재시도 + X-PAYMENT 헤더<br/>(AWS 문서 표기 — v2 는 PAYMENT-SIGNATURE)
    alt 직접 정산 — AWS 문서의 흐름
        M->>N: 결제 증명 검증 후 온체인 정산
        N-->>M: tx 결과
    else facilitator 에 위임하는 구성 (x402 — 01장)
        M->>F: /verify · /settle
        F->>N: 온체인 정산 제출
        N-->>F: tx 결과
        F-->>M: 결과
    end
    M-->>A: 200 + 콘텐츠
    P->>P: 세션 지출 장부 커밋<br/>실패 시 한도 예약 해제 + FAILED
```

MPP 를 쓰면 챌린지가 `WWW-Authenticate: Payment` 헤더로 오고 재시도가 `Authorization` 헤더로 가는 것만 다르다.

## 통제 모델의 경계

문서에 정의된 통제:

- **IAM 역할 분리** — AWS 는 Administrator·관리(instrument·세션 생성)·실행(ProcessPayment)·서비스 4-role 모델을 제공하고, **세션 생성 권한과 ProcessPayment 를 같은 역할에 두지 말라고 명시한다** — 같은 역할이면 공격자가 상향된 한도의 새 세션을 만들어 기존 한도를 우회할 수 있어서다. 관리 role 에는 ProcessPayment 명시적 Deny
- 세션당 지출 한도 (`maxSpendAmount`·`currency`) 와 만료 시간
- 사용자의 에이전트 권한 부여·회수
- credential 의 Secrets Manager 격리 — 에이전트 코드의 credential 직접 접근을 차단한다
- Observability (로그·대시보드·지출 메트릭)

Payments 의 PaymentSession 기본 통제는 금액·통화·만료 중심이고, merchant·asset 별 결제 정책식은 이번에 수집한 AWS AgentCore 공개 문서에서는 확인하지 못했다 (AgentCore 의 다른 구성요소가 별도 통제를 가질 수 있다 — Payments 밖은 이 문서의 범위가 아니다). 우리 시스템 기준으로 보면, Fireblocks Transaction Policy 의 First-Match rule·quorum 승인과는 다른 접근이다 — **표현력을 쌓는 대신 노출 자체(충전액·세션 한도)를 줄이는 모델**이다. 이 대비는 팀의 해석이고, 두 제품의 공식 문서가 서로를 비교한 것은 아니다.

비용 관점에서도 같은 경계가 나온다 (팀 관점): 자동 호출 빈도가 높아질 수 있어 건당 소액도 누적이 빠르고, "살 가치가 있는가" 판단을 에이전트가 하므로 오판이 자동으로 반복될 수 있다. 실질 방어선은 충전액과 세션 한도다 — 단, 세션 한도는 세션 생성(관리) 권한과 실행 권한이 분리된 경우에만 방어선으로 기능한다 (위 IAM 분리). AWS 가 밝힌 사실은 마이크로페이먼트를 첫 단계로 택했다는 것까지고, 그 범위 설정이 이 위험을 줄이는 효과가 있다는 것은 팀 해석이다. 고액 커머스 확장(AWS 로드맵)에는 더 촘촘한 정책 표현력이 필요해 보인다. **facilitator/sponsor 의 수수료·정산 모델은 이번에 수집한 공개 문서에서는 확인하지 못했다** — 대납된 가스·대행 수수료가 누구에게 어떻게 청구되는지가 총비용을 가른다 ([가스 대납 문서](../가스대납/00-overview.md)의 "대납은 수수료를 없애지 않는다"와 같은 질문이다).

## 유료 자원 발견

- **AgentCore Gateway** — 유료 MCP 서버·API 연결. Coinbase **x402 Bazaar** 통합으로 기존 유료 MCP tool 을 발견
- **AgentCore Browser** — x402 를 지원하는 페이월 웹사이트에 접근

출처: [AWS AgentCore payments 동작 방식](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-how-it-works.html) · [핵심 개념](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-concepts.html) · [IAM 역할 분리](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-iam-roles.html) · [AWS 공식 발표 블로그](https://aws.amazon.com/blogs/machine-learning/agents-that-transact-introducing-amazon-bedrock-agentcore-payments-built-with-coinbase-and-stripe/). 지역·파트너 사실은 발표 블로그, 자원 모델·흐름은 동작 방식·핵심 개념 문서, 권한 통제는 IAM 역할 문서 기준.
