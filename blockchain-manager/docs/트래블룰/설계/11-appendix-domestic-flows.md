---
title: 부록 A — 국내 망 흐름 (VerifyVASP × CODE)
status: To Do
---

우리가 **VerifyVASP 를 연동**했을 때(6장 경로 B), 국내 상대가 VerifyVASP 회원이냐 CODE 회원(빗썸·코인원·코빗)이냐에 따라 흐름을 한자리에 모은다.
두 망은 2022-04-25 상호연동 완료라, CODE 회원에게도 **우리 VerifyVASP 하나로 도달**한다 — 우리 코드 관점에선 상대가 어느 망이든 동일하고, 차이는 VerifyVASP 중앙 서버 **너머**의 상호연동이 흡수한다.

## 조합 매트릭스

| 우리 | 상대 | 출금 | 입금 |
|---|---|---|---|
| VerifyVASP | VerifyVASP 회원 | 7.1 (직접) | 7.3 (직접) |
| VerifyVASP | CODE 회원(빗썸) | **A.1** (상호연동 경유) | **A.2** (상호연동 경유) |
| (대안) CODE 직접 | CODE 회원 | 7.10 | 7.11 |

- **우리 코드는 네 경우 다 VerifyVASP 흐름(7.1/7.3)과 같다.** CODE 상대는 List VASP 가 `protocol:CODE · vaspStatus:INTEROPERATED` 로 반환하고, 상호연동이 프로토콜 차이를 삼킨다.
- CODE 직접(7.10/7.11)은 **상호연동 실효가 부족할 때만** 붙이는 대안이다(아래 "확인할 것").

## A.1 출금 → 빗썸(CODE), 우리는 VerifyVASP — 상호연동 경유

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) 우리 측 · CODE 코드 0줄
    participant BE as Service 백엔드
    participant GT as 트래블룰 게이트
    participant EN as 우리 Enclave
    end
    participant HUB as VerifyVASP 중앙
    participant CV as CodeVASP 중앙<br/>(상호연동 너머)
    participant RV as 빗썸 · CODE 회원
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인
    GT->>EN: 상대 확인 · List VASP
    EN->>HUB: 조회
    HUB-->>EN: 빗썸 = protocol:CODE · vaspStatus:INTEROPERATED · health
    Note over GT: 상호연동으로 도달 가능 — CODE 특화 처리 없음
    GT->>EN: 주소 소유 확인 · User Account Verification
    EN->>HUB: 암호화 조회
    HUB->>CV: 상호연동 브릿지
    CV->>RV: 소유·실명 조회
    RV-->>CV: 소유·실명 확인
    CV-->>HUB: 회신
    HUB-->>EN: 결과
    EN-->>GT: 소유·실명 확인 결과
    GT->>EN: PII 사전 승인 · User Verification (비동기 UUID)
    EN->>HUB: 암호화 메시지
    HUB->>CV: VerifyVASP↔CODE 상호연동 브릿지
    CV->>RV: 사전 승인 요청
    RV-->>CV: 승인 · 거절
    CV-->>HUB: 회신 (상호연동)
    HUB->>EN: Callback — 결과 (UUID 대조)
    EN-->>GT: APPROVED / REJECTED
    alt 승인
        GT-->>BE: APPROVED
        BE->>BM: submitTransaction
    else 거절
        GT-->>BE: 반려 — 잠긴 금액 가용 복귀
    end
```

우리 쪽은 7.1(VerifyVASP 출금)과 동일하다 — `List VASP` → `User Account Verification`(주소 소유 확인) → `User Verification`(PII 사전 승인, 비동기 UUID) → Callback. 소유 확인·사전 승인 **둘 다 상호연동 브릿지(`HUB → CV`)를 왕복**하고, 빗썸이 CODE 라는 사실은 그 뒤에 있어 우리 코드엔 안 보인다. 단 소유 확인(User Account Verification)이 상호연동 경유로 동작하는지도 실효 확인 대상이다(아래).

## A.2 입금 ← 빗썸(CODE), 우리는 VerifyVASP — 상호연동 경유

```mermaid
sequenceDiagram
    autonumber
    participant SV as 빗썸 · CODE 회원
    participant CV as CodeVASP 중앙
    participant HUB as VerifyVASP 중앙<br/>(상호연동 너머)
    box rgb(224,242,254) 우리 측
    participant EN as 우리 Enclave
    participant RX as 수신 컴포넌트
    participant BE as Service 백엔드<br/>내부 API
    participant WQ as 대기함<br/>사전 검증 기록 저장소
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events
    end

    SV->>CV: Asset Transfer Authorization (CODE · 동기)
    CV->>HUB: VerifyVASP↔CODE 상호연동 브릿지
    HUB->>EN: 사전 검증 요청 (인바운드)
    EN->>RX: Verify User · Verify User Account
    RX->>BE: 내부 API — 실명·계정 확인
    BE->>WQ: 사전 검증 기록 적재
    BE-->>RX: 확인
    RX-->>EN: 승인
    EN-->>HUB: 회신
    HUB-->>CV: 상호연동
    CV-->>SV: 승인
    SV->>SV: 온체인 전송
    BM-->>BE: 입금 후보 — 확정 임계 도달
    BE->>WQ: 폴링 입금 후보로 대조 조회 (7.5)
    WQ-->>BE: 대조 일치 → 가용
```

우리 수신 사슬(Enclave → 수신 컴포넌트 → 내부 API)은 7.3(VerifyVASP 입금)과 동일하다. 빗썸이 CODE 의 동기 절차(Asset Transfer Authorization)를 쓰더라도, 상호연동이 우리에겐 VerifyVASP 인바운드로 변환해 전달한다.

## 상호연동에서 확인할 것

"우리 코드 = 7.1/7.3"이 성립하려면 상호연동이 **CODE 전용 기능까지** 실어 날라야 한다(6장 미확정).

- **원화 임계** — 빗썸(CODE)의 `tradePrice·tradeCurrency(KRW)·isExceedingThreshold` 가 상호연동 경유로 우리에게 오는가, 아니면 우리가 `AmountUSD` 로만 판정해야 하는가.
- **미확인 입금 역추적** — 빗썸발 anonymous 입금 시 CODE 의 `Search VASP by TXID → Asset Transfer Data Request` 가 경유로 동작하는가, 아니면 VerifyVASP 의 `Check Transaction Status`(7.3/8장 판별 5)로 대체되는가.

둘 중 하나라도 경유로 안 되면 → **CODE 직접 어댑터(7.10/7.11)** 추가가 6장의 예비책이다.

## 관련 장

- 같은 망(VerifyVASP ↔ VerifyVASP): **7.1 / 7.3**.
- CODE 직접 연동(상호연동 실효 부족 시): **7.10 / 7.11**.
- 두 망 차이 표·상호연동 배경·CODE 직접 판단: **6장**.
- 입금 합류점·판별 우선순위: **7.5 · 8장**.
