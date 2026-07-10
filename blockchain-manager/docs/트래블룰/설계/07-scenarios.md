---
title: 7. 시나리오 — 출금 둘 · 입금 둘
status: To Do
---

국내·해외·개인지갑 × 출금·입금의 여섯 갈래를 8장 공통 단계 위에서 넷으로 접는다.
나누는 기준은 하나다 — **채널 밖 행위자와의 왕복이 흐름의 본체면 따로 그리고, 로컬 확인이면 접는다**. 국내(VerifyVASP)는 출금·입금 모두 상대 VASP 와의 왕복·비동기가 본체라 따로, 해외·개인지갑은 로컬 동기 확인이라 접는다.

## 7.1 출금 → 국내 (VerifyVASP) — 사전 허가 왕복, 비동기 중단·재개

상대 VASP 의 승인이 나야 제출한다. 접수는 즉시(UUID), 결과는 우리 수신 API 로 돌아오는 **비동기 중단·재개**가 이 흐름의 본체다.

```mermaid
sequenceDiagram
    autonumber
    participant BE as Service 백엔드<br/>출금 유스케이스 · 상태 기계
    participant GT as 트래블룰 게이트<br/>백엔드 모듈 · 8장
    participant VV as VerifyVASP<br/>우리 Enclave → 중앙
    participant RV as 상대 VASP · 국내
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인 — "트래블룰 확인 중" 상태로
    GT->>VV: 상대 확인 — List VASP (vaspId · health · vaspStatus)
    opt health = DOWN — 상대 Enclave 정지
        Note over GT: 제출 전에 미리 안다 — 대기 · 시간 규칙(4장) 만료 시 반려
    end
    GT->>VV: 주소 소유 확인 · User Account Verification (동기)
    VV->>RV: 회원망 조회
    RV-->>VV: 소유·실명 확인
    VV-->>GT: 확인 결과
    GT->>VV: 암호화 PII 사전 승인 요청 · User Verification
    VV-->>GT: UUID 즉시 반환 — 비동기 접수 · 여기서 흐름이 멈춘다 (PENDING)
    VV->>RV: 암호화 PII 전달 · 승인 요청
    RV-->>VV: 승인 · 거절 — 사람 심사일 수 있다
    VV->>GT: Callback — 결과 도착 (수신 컴포넌트 경유 · UUID 로 대조)
    alt 승인 — 흐름 재개
        GT-->>BE: APPROVED
        BE->>BM: submitTransaction — 이후 기존 출금 파이프라인
        BE->>GT: tx hash → Report Transaction Result (Enclave 가 UUID 에 매핑)
    else 거절 · PENDING 만료(4장)
        GT-->>BE: 반려 — 잠긴 금액 가용 복귀 · 고객 안내 (온체인엔 아무것도 없음)
    end
```

- 멈춤과 재개의 열쇠가 **UUID** 다 — 접수 때 저장하고, Callback 이 오면 그걸로 어느 출금인지 찾는다. 출금 쪽에서도 수신 API(Callback) 없이는 완결이 안 된다.
- 상대 확인(List VASP)은 health 사전 점검을 겸한다 — 상대가 죽어 있으면 헛요청 없이 대기로 간다.

## 7.2 출금 — 동기 채널 (해외 Notabene · 개인지갑)

로컬 확인으로 끝나 왕복·대기가 없다 — "트래블룰 확인 중" 상태를 즉시 통과한다.

```mermaid
sequenceDiagram
    autonumber
    participant BE as Service 백엔드<br/>출금 유스케이스
    participant GT as 트래블룰 게이트<br/>모듈 · 8장
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인 — "트래블룰 확인 중" (동기라 즉시 판정)
    alt 해외 — Notabene
        GT->>GT: validate → (임계 이상) validate/full — 전용 API user 로 FB 직접
        Note over GT: BELOW_THRESHOLD 면 NOT_REQUIRED — 정보 교환 없이 진행
        GT-->>BE: APPROVED + travelRuleMessage
    else 개인지갑
        GT->>GT: Address Registry 등록·소유 인증 조회 — 정보 교환 상대 없음
        GT-->>BE: 등록 = APPROVED (관할 규정에 따른 기록만) · 미등록 = REJECTED
    end
    alt APPROVED · NOT_REQUIRED
        BE->>BM: submitTransaction — 해외는 travelRuleMessage 동봉 (매니저는 운반만)
    else REJECTED
        BE->>BE: 반려 — 잠긴 금액 가용 복귀 · 고객 안내 (미등록 개인지갑은 등록·인증부터)
    end
```

채널이 갈라 놓는 것은 세 칸뿐이다 — **확인 방식**(비동기/동기), **동봉물**(해외만), **사후 보고**(국내만). 상태 전이·제출·반려 처리는 7.1 과 동일하다.

## 7.3 입금 ← 국내 (VerifyVASP) — 자금보다 정보가 먼저 온다

요청-응답형이다 — 자금이 오기 전에 우리 수신 API 가 먼저 응답하고, 그 기록(대기함)이 도착 후 판별(7.4)의 대조 재료가 된다.

```mermaid
sequenceDiagram
    autonumber
    participant SV as 송신 VASP · 국내
    participant VV as VerifyVASP 중앙 → 우리 Enclave
    participant RX as 트래블룰 수신 컴포넌트<br/>별도 배포 · 얇게
    participant BE as Service 백엔드<br/>내부 API · 대기함
    box rgb(220,252,231) Fireblocks
    participant FB as Fireblocks
    end

    SV->>VV: 전송 전 사전 검증 요청
    VV->>RX: VASP API 호출 · Verify User · Verify User Account
    RX->>BE: 내부 API — 고객 실명·계정 확인 · 대기함 적재
    BE-->>RX: 확인 결과
    RX-->>VV: 승인 응답
    VV-->>SV: 승인 회신
    SV->>SV: 온체인 전송 실행
    FB-->>BE: 폴링 감지 · 입금 후보
    alt tx hash 보고 수신
        SV->>VV: tx hash 보고 · Report Transaction Result
        VV->>RX: Callback — tx hash 전달
        RX->>BE: 내부 API — 대기함 기록에 붙임
        BE->>BE: 도착 후 판별(7.4)에서 대조 일치 → 가용
    else 보고 미수신 — 시간 초과
        BE->>VV: Check Transaction Status — 송신측 검증 유무 능동 조회 (Enclave 경유 아웃바운드)
        Note over BE: 조회로 대조되면 가용 · 그래도 안 풀리면 보류 (7.4 판별 5)
    end
```

- 승인이 나야 상대가 온체인 전송을 실행한다 — 수신 사슬(Enclave → 수신 컴포넌트 → 백엔드 내부 API)이 응답을 못 하면 국내 입금 자체가 막히므로, 이 사슬의 가용성이 곧 입금 가용성이다.
- **수신 컴포넌트는 별도 배포**다 — 기관 간 콜백 트래픽을 고객용 Service 백엔드와 분리(장애 격리·배포 주기). 단 얇게: 검증·변환만 하고 판단·적재는 백엔드 내부 API 로 위임한다(8장).

## 7.4 입금 — 도착 후 판별, 합류점 하나

```mermaid
sequenceDiagram
    autonumber
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events
    end
    participant BE as Service 백엔드<br/>입금 컨슈머 · 가용 전이 게이트
    participant GT as 게이트 판별<br/>8장 우선순위

    Note over BM: 벤더(Notabene) 동결 건은 REJECTED 계열로 와서 여기 안 온다 — 기존 동결 처리(5장 연계)
    BM-->>BE: 입금 후보 — 확정 임계 도달
    BE->>GT: 입금 판별 — source · 대조 재료
    alt VerifyVASP 사전 요청 대기함과 대조 일치 — 국내
        GT-->>BE: APPROVED
    else source 가 Address Registry 등록 주소 — 개인지갑
        GT-->>BE: APPROVED
    else 벤더 스크리닝 통과로 도착 — 해외
        GT-->>BE: APPROVED — 단 "국내인데 미보고" 가능성의 취급은 정책 결정(4장)
    else 어느 것도 아님
        GT->>GT: Check Transaction Status — 송신측 검증 유무 능동 조회
        GT-->>BE: 대조되면 APPROVED · 그래도 안 풀리면 PENDING — 가용 보류
    end
    BE->>BE: APPROVED → 가용 전이 · PENDING → 보류 + 소명·사후 등록·반환 정책
```

- 가용 전이 조건은 하나다 — **확정 임계 도달 AND 판별 APPROVED**(8장). 기본값은 보류로, 명시적으로 확인된 것만 가용에 보낸다.
- 판별 우선순위·정책 결정 지점(벤더 통과를 어디까지 믿나)의 정본은 8장 입금 합류점.
- 미등록 개인지갑 입금의 사후 처리(등록 유도·소명·반환)는 자체 정책 설계 대상이다.
