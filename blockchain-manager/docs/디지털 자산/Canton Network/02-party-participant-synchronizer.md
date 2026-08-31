---
title: Canton — Party와 노드
status: Done
date: 2026-08-19
view: grid
group: 개념과 구조
---

# Party와 노드의 책임

Canton에서 Party는 권리와 의무를 갖는 원장 신원이고, Participant는 Party의 Contract를 저장·검증하는 노드다. Synchronizer는 서로 다른 Participant 사이에서 메시지 순서와 판정 결과를 조정한다.

- **원장 신원:** Party
- **Contract 저장·검증:** Participant
- **메시지 순서·판정 조정:** Synchronizer

Party는 업무 신원이고, Participant는 여러 Party를 호스팅할 수 있으며, 하나의 Party도 필요에 따라 여러 Participant에서 호스팅할 수 있다.

## Party·Participant·Synchronizer의 관계

```mermaid
flowchart LR
    PARTY_A[기관 A Party]
    PA[기관 A Participant]
    SYNC[Synchronizer]
    PB[기관 B Participant]
    PARTY_B[기관 B Party]

    PA -->|Party 호스팅| PARTY_A
    PA <-->|암호화 메시지 송수신| SYNC
    SYNC <-->|암호화 메시지 송수신| PB
    PB -->|Party 호스팅| PARTY_B
    CONTRACT[Daml Contract] -.권리·의무.-> PARTY_A
    CONTRACT -.권리·의무.-> PARTY_B

    classDef identity fill:#fff3cd,stroke:#d6a800,color:#181a20
    classDef node fill:#e8f0fe,stroke:#4a90e2,color:#181a20
    classDef network fill:#e8f7f5,stroke:#2dbdb6,color:#181a20
    class PARTY_A,PARTY_B identity
    class PA,PB node
    class SYNC network
```

| 구성요소 | 역할 | 하지 않는 일 |
|---|---|---|
| Party | Contract의 권리·의무·가시성을 갖는 원장 신원 | 고객 로그인이나 지갑 주소 그 자체가 아님 |
| Participant | Party를 호스팅하고 관련 Contract를 저장·실행·검증 | 고객 KYC나 내부 원장을 대신 관리하지 않음 |
| Synchronizer | 암호화된 메시지의 순서와 확인 결과를 조정 | 모든 업무 데이터와 자산을 보관하지 않음 |
| Daml Contract | 데이터와 허용된 행동을 함께 표현 | 필드를 제자리에서 수정하지 않음 |

## Party는 고객 계정이 아니다

기관 A라는 Party가 있다고 해서 내부 고객 계정 하나와 반드시 대응하는 것은 아니다. 상품에 따라 고객별 Party를 둘 수도 있고, 여러 고객이 하나의 omnibus Party를 함께 사용할 수도 있다.

Party ID는 사람이 구분하기 위한 hint와 암호학적 namespace를 포함한다. 주소처럼 입금마다 새로 만드는 식별자가 아니라 네트워크에서 권한을 행사하는 비교적 안정적인 신원으로 다룬다.

## Participant의 책임

Participant는 자신이 호스팅하는 Party를 대신해 원장과 상호작용한다.

- Daml 명령을 해석하고 Contract 생성·Choice 실행을 처리한다.
- 호스팅 Party에게 공개된 활성 Contract를 저장한다.
- 제출 권한, 입력 Contract의 활성 여부, 원장 효과를 검증한다.
- Synchronizer와 연결해 Party별로 허용된 암호화 거래 데이터를 주고받는다.
- Ledger API로 명령, Contract 조회, Update Stream을 제공한다.

Participant가 가진 것은 전체 네트워크 사본이 아니다. 자신이 호스팅하는 Party와 관련된 private contract state다. 같은 API를 호출해도 어떤 Party 권한으로 조회하느냐에 따라 결과가 달라진다.

Participant는 고객 가용 잔액, 출금 한도, KYC 상태와 같은 원장 외부 업무 정보를 관리하지 않는다.

## Validator와 Participant의 범위

운영 문서에서는 `Validator`와 `Participant`가 함께 등장한다. Validator는 Canton Network 참여에 필요한 Participant와 주변 API·앱 서비스를 묶은 배포·운영 구성에 가깝고, Participant는 원장을 실행하고 Party를 호스팅하는 핵심 노드다.

## Synchronizer 내부 구성

Synchronizer는 Participant가 보낸 업무 명령을 대신 실행하지 않는다. 크게 Sequencer와 Mediator가 메시지 순서와 최종 판정을 조정한다.

```mermaid
sequenceDiagram
    participant P1 as 제출 Participant
    participant S as Sequencer
    participant P2 as 관련 Participant
    participant M as Mediator

    P1->>S: 수신자별 암호화 거래 데이터 제출
    S->>P1: 순서가 부여된 거래 데이터 전달
    S->>P2: 권한 있는 거래 데이터 전달
    P1->>S: Confirmation Response
    P2->>S: Confirmation Response
    S->>M: 확인 결과 전달
    M->>S: Commit 또는 Reject Verdict
    S->>P1: 최종 결과
    S->>P2: 최종 결과
```

Sequencer는 인증된 메시지에 순서와 시각을 부여해 지정된 수신자에게 전달한다. 메시지 내용은 프로토콜 계층에서 암호화된다. Mediator는 필요한 Participant의 확인을 모아 기한 안에 Commit 또는 Reject 판정을 만든다.

Synchronizer를 신뢰할 필요가 전혀 없다는 뜻은 아니다. 순서 일관성, 가용성, 검열 저항, 올바른 판정 전달에는 운영·거버넌스 신뢰가 남는다. 다만 거래 원문을 모두 공개해야만 이 역할을 수행하는 구조는 아니다.

## Party 호스팅 권한

Participant의 호스팅 권한은 한 덩어리가 아니다.

| 권한 | 의미 |
|---|---|
| Observing | 관련 상태를 기록하고 조회를 제공 |
| Confirming | 유효한 트랜잭션에 확인 응답 |
| Submitting | Party를 대신해 명령 제출 |

## Local Party와 External Party

Party의 서명 권한을 누가 보유하는지도 나눠서 본다.

```mermaid
flowchart TB
    subgraph LOCAL[Local Party]
      APP1[애플리케이션] --> PN1[Submitting Participant]
      PN1 -->|노드가 제출 권한 행사| PARTY1[Party]
    end

    subgraph EXTERNAL[External Party]
      APP2[애플리케이션] --> PN2[Participant]
      PN2 --> PREP[트랜잭션 준비]
      PREP --> KEY[외부 Party Key 서명]
      KEY --> PN2
      PN2 --> PARTY2[Party]
    end
```

- Local Party는 Participant가 Party를 대신해 명령을 제출한다. 자동화는 단순하지만 호스팅 노드를 강하게 신뢰한다.
- External Party는 독립된 키로 제출 권한을 통제한다. Participant가 트랜잭션을 준비해도 외부 키 소유자의 서명이 필요하다.
