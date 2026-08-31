---
title: Fireblocks — API Co-signer와 Callback Handler
status: Done
date: 2026-08-18
view: grid
group: 플랫폼 기능
---

# 자동 서명 경로

API Co-signer는 모바일 사용자의 개입 없이 transaction 서명과 일부 workspace 승인을 자동화하는 고객 호스팅 컴포넌트다. Policy가 Co-signer와 짝지은 API user를 designated signer로 선택하면 서명 요청이 Co-signer로 전달된다.

## 구조

```mermaid
sequenceDiagram
    participant B as API Client
    participant F as Fireblocks API·Policy
    participant G as Co-signer Gateway
    participant C as 고객 환경 API Co-signer
    participant H as 설정된 Callback Handler
    participant N as Blockchain

    B->>F: transaction 생성
    F->>F: Policy가 API user를 signer로 지정
    F->>G: 서명 요청 대기열
    C->>G: 요청 long-poll·가져오기
    C->>H: transaction 검증 요청
    H->>H: 요청 검증
    H-->>C: APPROVE 또는 REJECT
    alt 승인
      C->>G: MPC 서명 share
      G->>F: 서명 완료
      F->>N: broadcast
    else 거절·timeout
      C->>G: 거절
      F-->>B: 취소·실패 상태
    end
```

[Fireblocks 공식 Co-signer 구조](https://developers.fireblocks.com/docs/cosigner-architecture-overview)는 Callback Handler가 설정되지 않은 API user의 요청을 Co-signer가 자동 승인·서명한다고 설명한다.

## Callback Handler의 역할

Callback Handler가 설정되면 API Co-signer는 서명 전에 Handler의 `APPROVE` 또는 `REJECT` 결정을 받는다. 설정되지 않은 API user의 요청은 Co-signer가 자동 승인·서명할 수 있다.

## 인증 채널

[Callback Handler 설정 문서](https://developers.fireblocks.com/docs/create-api-co-signer-callback-handler)는 공개키 기반 signed JWT 방식과 certificate pinning 기반 채널을 설명한다.

| 방식 | 검증 |
|---|---|
| Public key | Co-signer 요청 JWT와 Handler 응답 JWT의 서명 검증 |
| Certificate pinning | TLS 협상에서 등록 certificate 확인 |

Callback 응답에는 시간 제한이 있다. 공식 AML Callback Handler 예시는 30초 안에 응답하지 못하면 transaction이 서명되지 않고 취소된다고 안내한다.
