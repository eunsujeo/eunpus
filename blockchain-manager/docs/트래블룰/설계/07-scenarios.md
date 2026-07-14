---
title: 7. 시나리오 — 국내·해외·직접 흐름
status: To Do
---

## 전체 시나리오 지도

도달 가능한 상대 × 방향을 한눈에. 입금 시나리오(7.3·7.4·7.7·7.9·7.11·A.2)는 모두 확정 후 **7.5 도착 후 판별**로 합류한다.

| 상대 유형 | 출금 | 입금 | 채널 |
|---|---|---|---|
| 국내 VerifyVASP (업비트 등) | 7.1 | 7.3 | VerifyVASP 직접 연동(자체 Enclave) |
| 국내 CODE (빗썸·코인원·코빗) | A.1 — 우리 코드는 7.1 과 동일 | A.2 — 7.3 과 동일 | 기본 VerifyVASP 상호연동 경유 · 대안 CODE 직접(CODE-Cipher, 7.10/7.11) |
| 해외 (TRUST·Sygna 등 Notabene 브릿지) | 7.2 | 7.4 | Notabene · Fireblocks 경유 |
| 해외 (같은 상대 · 대안) | 7.6 | 7.7 | Notabene 직접(Fireblocks 미경유) |
| 개인지갑(자기수탁) | 7.8 | 7.9 | Address Registry — 정보 교환 상대 없음 |
| 국내 VerifyVASP (게이트웨이 경유 · 검증) | 9장 | 9장 | Notabene 게이트웨이 — 라이브 여부 미확정 |
| ~~GTR 단독(Binance 글로벌)~~ | — | — | 제외 — Notabene 미브릿지. 열려면 Sumsub 등 제공자 추가(6장) |

국내 VerifyVASP 를 자체 Enclave 없이 **Notabene 게이트웨이로 우회**하는 후보(7.1/7.3 직접 연동의 대체)는 **9장**에서 다룬다 — 단 Notabene 의 VerifyVASP 라이브 지원 여부가 불확실(벤더 확인 대상)이라, 확인 전까지 직접 연동을 기준으로 둔다.

## 그리는 규칙 — 우리 측과 중앙을 나눈다

경로마다 어디까지가 우리 인프라이고 어디부터가 중앙(벤더·중계)인지가 다르므로, 아래 시나리오는 참여자를 두 진영으로 갈라 그린다.

- **VerifyVASP** — **우리 Enclave**(자체 인프라 · PII·암호화 키 보관 · 공개 HTTPS 수신)와 **VerifyVASP 중앙 서버**(중계만 · E2EE 라 PII 접근 불가)를 별도 참여자로 나눈다. 평문은 우리 Enclave 안에서만 열리고, 중앙은 암호화 메시지를 나르기만 한다.
- **Notabene·Fireblocks(경유)** — Enclave 급 자체 저장소가 없다. **우리 측**(Service 백엔드·트래블룰 게이트)과 **중앙 = 벤더**(Fireblocks·Notabene SaaS)로 표기한다. 트래블룰 데이터는 암호화되어 Notabene 에 보관되고 **Fireblocks 는 복호화 키를 갖지 않는다**(0장).
- **Notabene 직접(Fireblocks 미경유)** — 7.6·7.7 대안. Fireblocks 는 커스터디·서명만 남고, 트래블룰 게이트가 **Notabene SaaS 를 직접 호출**한다. Enclave 는 없이 **우리 측**(게이트)과 **중앙**(Notabene)으로 나뉘며, 벤더주도(7.2·7.4)가 아니라 VerifyVASP(7.1·7.3)처럼 **우리 게이트 주도**가 된다.

## 7.1 출금 → 국내 (VerifyVASP) — 사전 허가 왕복, 비동기 중단·재개

상대 VASP 의 승인이 나야 제출한다. 접수는 즉시(UUID), 결과는 우리 수신 사슬로 돌아오는 **비동기 중단·재개**가 이 흐름의 본체다. 우리 Enclave 가 암호화·키 보관을 맡고, 중앙 서버는 중계만 한다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) 우리 측
    participant BE as Service 백엔드<br/>출금 유스케이스 · 상태 흐름
    participant GT as 트래블룰 게이트<br/>별도 서비스 · 8장
    participant EN as 우리 Enclave<br/>자체 인프라 · PII·키 보관
    end
    participant HUB as VerifyVASP 중앙 서버<br/>중계만 · PII 접근 불가
    participant RV as 상대 VASP · 국내
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인 — "트래블룰 확인 중" 상태로
    GT->>EN: 상대 확인 · 주소 소유 확인 (List VASP · User Account Verification)
    EN->>HUB: 암호화 조회 중계
    HUB->>RV: 회원망 조회
    RV-->>HUB: 소유·실명 확인
    HUB-->>EN: 결과 중계
    EN-->>GT: health · 소유·실명 확인 결과
    opt health = DOWN — 상대 Enclave 정지
        Note over GT: 제출 전에 미리 안다 — 대기 · 시간 규칙(4장) 만료 시 반려
    end
    GT->>EN: 암호화 PII 사전 승인 요청 · User Verification
    EN->>HUB: 암호화 PII 중계 — 평문은 우리 Enclave 안에서만 열림
    EN-->>GT: UUID 즉시 반환 — 비동기 접수 · 여기서 흐름이 멈춘다 (PENDING)
    HUB->>RV: 암호화 PII 전달 · 승인 요청
    RV-->>HUB: 승인 · 거절 — 사람 심사일 수 있다
    HUB->>EN: Callback — 결과 도착
    EN-->>GT: 수신 컴포넌트 경유 · UUID 로 대조
    alt 승인 — 흐름 재개
        GT-->>BE: APPROVED
        BE->>BM: submitTransaction — 이후 기존 출금 파이프라인
        BE->>GT: tx hash → Report Transaction Result (Enclave 가 UUID 에 매핑)
    else 거절 · PENDING 만료(4장)
        GT-->>BE: 반려 — 잠긴 금액 가용 복귀 · 고객 안내 (온체인엔 아무것도 없음)
    end
```

- 멈춤과 재개의 열쇠가 **UUID** 다 — 접수 때 저장하고, Callback 이 오면 그걸로 어느 출금인지 찾는다. 출금 쪽에서도 수신 사슬(Callback) 없이는 완결이 안 된다.
- 상대 확인(List VASP)은 health 사전 점검을 겸한다 — 상대가 죽어 있으면 헛요청 없이 대기로 간다.
- **우리 Enclave vs 중앙** — 암호화·키·PII 는 우리 Enclave 안에 있고, 중앙 서버는 암호화 메시지를 상대에게 나르는 중계만 한다. 그래서 중앙은 경로에 있어도 PII 를 못 본다.
- **상대가 CODE 회원(빗썸 등)이면** — List VASP 가 `protocol:CODE · vaspStatus:INTEROPERATED` 로 반환하고 VerifyVASP↔CODE 상호연동이 프로토콜 차이를 흡수한다. **우리 흐름은 위와 동일**(CODE 코드 0줄). 단 원화 임계·TXID 역추적이 경유 경로에서 되는지 확인(6장) — 안 되면 CODE 직접(7.10). 상세 시퀀스는 부록 A(11장).

## 7.2 출금 → 해외 (Notabene · Fireblocks) — 벤더가 스크리닝, 우리는 동봉

로컬 판별로 대상 여부를 가른 뒤, 대상이면 암호화 정보를 거래에 실어 벤더에 넘긴다. 왕복·대기가 없어 "트래블룰 확인 중"을 즉시 통과한다. 여기엔 우리 Enclave 가 없다 — 스크리닝은 **벤더(Fireblocks·Notabene) 안**에서 끝나고, Fireblocks 는 복호화 키를 갖지 않는다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) 우리 측
    participant BE as Service 백엔드<br/>출금 유스케이스
    participant GT as 트래블룰 게이트<br/>별도 서비스 · 8장
    end
    box rgb(238,242,255) 중앙 — 벤더
    participant FB as Fireblocks API
    participant NB as Notabene<br/>암호화 보관 · FB 는 키 없음
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인 — "트래블룰 확인 중" (동기라 즉시 판정)
    GT->>FB: validate — 임계값·수취 주소 유형 판별
    FB-->>GT: type: BELOW_THRESHOLD / NON_CUSTODIAL / TRAVELRULE
    alt TRAVELRULE — 정보 교환 대상
        GT->>GT: 수취인 정보 수집 — 수취 VASP DID · 이름 · 계좌
        GT->>FB: validate/full — isValid 확인
        GT->>GT: PII SDK 로 암호화 → travelRuleMessage
        GT-->>BE: APPROVED + travelRuleMessage
        BE->>BM: submitTransaction — travelRuleMessage 동봉 (매니저는 운반만)
        BM->>FB: createTransaction — travelRuleMessage 실림
        FB->>NB: 거래 상세 전송 — Asset · Amount · 주소 · hash
        NB-->>FB: 트래블룰 상태 판정
        Note over FB: Post-Screening Policy(4장) — Accept 후에야 서명·전파
    else BELOW_THRESHOLD · NON_CUSTODIAL(개인지갑)
        Note over GT: 개인지갑 = Address Registry 등록·소유 인증 조회 (정보 교환 상대 없음)
        GT-->>BE: 임계 미만·등록 지갑 = APPROVED · 미등록 개인지갑 = REJECTED
        BE->>BM: submitTransaction — 동봉 없음 (미등록이면 반려 · 등록·인증부터)
    end
```

- 스크리닝은 **서명 앞에 놓인 벤더 게이트**다 — `createTransaction` 으로 넘어간 거래를 Fireblocks 가 Notabene 로 보내 판정받고, Accept 로 떨어져야 서명이 진행된다.
- `travelRuleMessage` 동봉은 **우리 게이트의 책임**이다 — 안 실리면 Notabene 가 판정할 대상이 없어 게이트가 그대로 열린다. Outbound delay 기본 0초.
- **우리 측 vs 중앙(벤더)** — 대상 판별·수취인 수집·암호화까지는 우리 게이트, 실제 스크리닝·판정은 벤더 안. VerifyVASP 와 달리 자체 Enclave 로 나눌 것이 없고, 국내와 다른 세 칸은 **확인 방식**(동기)·**동봉물**(travelRuleMessage)·**사후 보고 없음**(벤더가 이미 안다)이다.

## 7.3 입금 ← 국내 (VerifyVASP) — 자금보다 정보가 먼저 온다

요청-응답형이다 — 자금이 오기 전에 우리 수신 사슬이 먼저 응답하고, 그 기록(대기함)이 도착 후 판별(7.5)의 대조 재료가 된다. 인바운드 사슬은 **중앙 서버 → 우리 Enclave → 수신 컴포넌트 → 트래블룰 서비스 → 월렛 백엔드(귀속 확인·대기함 적재)** 다(8장).

```mermaid
sequenceDiagram
    autonumber
    participant SV as 송신 VASP · 국내
    participant HUB as VerifyVASP 중앙 서버<br/>중계만
    box rgb(224,242,254) 우리 측
    participant EN as 우리 Enclave<br/>자체 인프라 · 공개 HTTPS 수신
    participant RX as 트래블룰 수신 컴포넌트<br/>별도 배포 · 얇게
    participant TR as 트래블룰 서비스<br/>망 연동 · 8장
    participant BE as 월렛(Service) 백엔드<br/>매칭·귀속 · 가용 전이
    participant WQ as 대기함<br/>사전 검증 기록 저장소
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events
    end

    SV->>HUB: 전송 전 사전 검증 요청
    HUB->>EN: 암호화 메시지 중계 (인바운드)
    EN->>RX: VASP API 호출 · Verify User · Verify User Account (복호화는 Enclave 안)
    RX->>TR: 위임 — 검증·변환만
    TR->>BE: 주소 귀속·실명 확인 조회 · 검증 기록 전달
    BE->>WQ: 사전 검증 기록 적재 (source·수취인·금액)
    BE-->>TR: 확인 결과
    TR-->>RX: 응답
    RX-->>EN: 승인 응답
    EN-->>HUB: 승인 회신 (암호화)
    HUB-->>SV: 승인 회신
    SV->>SV: 온체인 전송 실행
    BM-->>BE: 입금 후보 — 확정 임계 도달
    Note over BE,WQ: 확정 임계 도달 ≠ 가용 — 대기함 기록과 대조돼야 잔고 반영
    alt tx hash 보고 수신
        SV->>HUB: tx hash 보고 · Report Transaction Result
        HUB->>EN: Callback — tx hash 중계
        EN->>RX: tx hash 전달
        RX->>TR: 위임 — tx hash
        TR->>BE: tx hash 전달
        BE->>WQ: txhash ↔ 사전 검증 기록 매핑
        BE->>WQ: 폴링 입금 후보로 대조 조회 (7.5)
        WQ-->>BE: 대조 일치 → APPROVED → 가용
    else 보고 미수신 — 시간 초과
        BE->>TR: Check Transaction Status 요청 — 송신측 검증 유무 능동 조회
        TR->>EN: 조회 (Enclave 경유 아웃바운드)
        EN->>HUB: 중계
        TR-->>BE: 조회 결과
        BE->>WQ: 조회 결과로 대조
        Note over BE,WQ: 대조되면 가용 · 안 풀리면 입금대기(잔고 차단) → 소명·반환 (7.5 마지막 분기 · 8장 판별 5)
    end
```

- 승인이 나야 상대가 온체인 전송을 실행한다 — 수신 사슬(**우리 Enclave → 수신 컴포넌트 → 트래블룰 서비스 → 월렛 백엔드**)이 응답을 못 하면 국내 입금 자체가 막히므로, 이 사슬의 가용성이 곧 입금 가용성이다.
- **수신 컴포넌트는 별도 배포**다 — 트래블룰 서비스의 인바운드 접점. 얇게: 검증·변환만 하고 트래블룰 서비스로 위임하며, 매칭·귀속 판단과 대기함은 월렛 백엔드다(8장).
- **우리 Enclave vs 중앙** — 공개 HTTPS 를 받는 것은 우리 Enclave(벤더 요건)이고 복호화도 여기서 한다. 중앙 서버는 송신측과 우리 Enclave 사이를 중계만 한다.
- **CODE 회원(빗썸 등) 발 입금**도 상호연동으로 VerifyVASP 인바운드로 도착한다 — 위 흐름 동일. 미확인 입금의 TXID 역추적이 경유 경로에서 되는지는 6장 상호연동 실효 확인 대상(안 되면 CODE 직접 7.11). 상세 시퀀스는 부록 A(11장).

## 7.4 입금 ← 해외 (Notabene · Fireblocks) — 벤더주도, 우리는 폴링만

입금 쪽 트래블룰에는 우리 코드가 없다 — Fireblocks 와 Notabene 가 감지·스크리닝·판정·조치를 벤더 안에서 끝내고, 우리는 폴링으로 결과 상태만 받는다. 동결 건은 REJECTED 계열로 나타나 기존 입금 파이프라인이 그대로 흡수한다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(238,242,255) 중앙 — 벤더
    participant FB as Fireblocks
    participant NB as Notabene<br/>암호화 보관 · FB 는 키 없음
    end
    box rgb(224,242,254) 우리 측
    participant PW as 폴링 워커
    participant BE as Service 백엔드<br/>가용 전이 게이트
    end

    FB->>FB: 입금 감지 → 첫 blockchain confirmation 대기
    FB->>FB: Transaction Screening Policy 통과 판정
    Note over FB: 원 거래에 트래블룰 메시지 없으면<br/>Fireblocks 가 빈 메시지 생성해 스크리닝 가능하게
    FB->>NB: 거래 상세 전송
    NB-->>FB: 상태 판정 — Inbound delay 기본 30초 대기
    FB->>FB: Post-Screening Policy — Accept=통과 · Reject·Freeze=자금 동결
    PW->>FB: 폴링 — 결과 상태 수신
    alt Accept
        PW->>BE: 입금 후보 — 도착 후 판별(7.5)로 넘김
    else Reject · Freeze
        Note over PW,BE: REJECTED 계열 → 기존 동결 처리(블록체인매니저 입금 흐름 연계) · 7.5 합류점엔 오지 않음
    end
```

- **벤더주도** — 감지·스크리닝·판정·조치가 벤더 안에서 끝나고, 우리 폴링 워커는 결과 상태만 받는다. VerifyVASP 입금(7.3)처럼 우리 수신 사슬이 먼저 응답하는 왕복이 없다.
- **동결 = REJECTED 계열** — 잔액 미반영·락업, 해제는 Admin unfreeze 운영으로만. 감지·동결·Admin unfreeze 는 이미 블록체인매니저 설계의 입금 흐름이 갖춘 경로이므로 새 코드가 없다.
- **시간 규칙** — Inbound delay(기본 30초) 안에 판정이 안 나면 기본 설정은 통과(자금 방출). 이 기본값·방출 규칙은 4장.

## 7.5 입금 — 도착 후 판별, 합류점 하나

국내(7.3)와 해외(7.4)의 입금이 도착한 뒤 여기서 만난다. 확정 임계에 도달한 후보를 판별해 가용 전이 여부를 가른다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events
    end
    box rgb(224,242,254) 우리 측
    participant BE as 월렛(Service) 백엔드<br/>매칭·귀속 · 가용 전이
    participant GT as 트래블룰 서비스<br/>망 조회
    end

    Note over BM: 벤더(Notabene) 동결 건은 REJECTED 계열로 와서 여기 안 온다 — 기존 동결 처리(7.4·블록체인매니저 입금 흐름 연계)
    BM-->>BE: 입금 후보 — 확정 임계 도달
    BE->>BE: 입금 판별 — source · 대조 재료 (8장 우선순위)
    alt VerifyVASP 사전 요청 대기함과 대조 일치 — 국내
        BE->>BE: APPROVED
    else source 가 Address Registry 등록 주소 — 개인지갑
        BE->>GT: 등록·소유 인증 조회
        GT-->>BE: 확인 → APPROVED
    else 벤더 스크리닝 통과로 도착 — 해외
        BE->>BE: APPROVED — 단 "국내인데 미보고" 가능성의 취급은 정책 결정(4장)
    else 어느 것도 아님
        BE->>GT: Check Transaction Status 요청 — 송신측 검증 유무 능동 조회
        GT-->>BE: 대조되면 APPROVED · 그래도 안 풀리면 PENDING — 가용 보류
    end
    BE->>BE: APPROVED → 가용 전이 · PENDING → 보류 + 소명·사후 등록·반환 정책
```

- 가용 전이 조건은 하나다 — **확정 임계 도달 AND 판별 APPROVED**(8장). 기본값은 보류로, 명시적으로 확인된 것만 가용에 보낸다.
- 판별 우선순위·정책 결정 지점(벤더 통과를 어디까지 믿나)의 정본은 8장 입금 합류점.
- 미등록 개인지갑 입금의 사후 처리(등록 유도·소명·반환)는 자체 정책 설계 대상이다 — 개인지갑 입금 흐름은 7.9.
- **설정 제공자로 도달 못 하는 상대**(예: Notabene 미브릿지 GTR 단독 — Sumsub 등 추가로 닫힘, 6장) 발 입금은 대조 채널이 없어 "어느 것도 아님" 분기에서 PENDING 으로 떨어진다 — 개념 5장의 미연동 사업자 발 입금대기(잔고 차단)와 같은 자리다. 출금은 앞단에서 차단되지만(6장 게이트) 입금은 자금이 이미 도착해 막을 수 없으므로 여기서 보류된다.

## 대안 — Fireblocks 미경유, Notabene 직접

Fireblocks 는 커스터디·서명으로만 남기고 트래블룰 게이트가 Notabene SaaS 를 직접 호출하는 경우다. 게이트가 **벤더 안(제출 뒤 스크리닝)에서 우리 게이트 앞단(제출 전 판정)으로 이동**하는 것이 핵심 차이다 — 모양은 벤더주도(7.2·7.4)가 아니라 VerifyVASP 게이트주도(7.1·7.3)에 가깝고, 다만 Enclave 가 없어 상대와의 교환·보관을 Notabene SaaS 가 맡는다. (Notabene 직접 API 의 정확한 명세·호출명은 확인 필요 — 아래는 능력 단위로만 그린다.)

## 7.6 출금 → 해외 (Notabene 직접) — 제출 전 우리 게이트가 판정

7.2 는 `createTransaction` 으로 넘긴 뒤 벤더가 스크리닝했지만, 여기선 **제출 전에** 우리 게이트가 Notabene 를 직접 호출해 판정받고, 통과해야 매니저로 제출한다. "사전 대조 후 전파"다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) 우리 측
    participant BE as Service 백엔드<br/>출금 유스케이스 · 상태 흐름
    participant GT as 트래블룰 게이트<br/>Notabene SDK 직접 호출
    end
    box rgb(238,242,255) 중앙 — 벤더
    participant NB as Notabene SaaS<br/>수취 VASP 식별 · 라우팅·보관
    end
    participant RV as 수취 VASP
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction · Fireblocks 커스터디
    end

    BE->>GT: 트래블룰 확인 — "트래블룰 확인 중"
    GT->>NB: 사전 판정 직접 호출 — 임계·수취 주소 유형 · 수취 VASP 식별
    NB-->>GT: 대상 여부 + 수취 VASP(DID) · 유효성
    alt 트래블룰 대상
        GT->>GT: 수취인 정보 수집 · PII 암호화
        GT->>NB: 트래블룰 메시지 전송 — 수취 VASP 로 라우팅
        NB->>RV: 암호화 PII 전달
        alt 자동 승인 — 동기
            RV-->>NB: Accept
            NB-->>GT: APPROVED
        else 상대 심사 — 비동기
            NB-->>GT: PENDING — 접수 · 여기서 흐름이 멈춘다
            RV-->>NB: 승인 · 거절 (사람 심사)
            NB->>GT: 웹훅 — 결과 도착 (우리 수신 엔드포인트 · 참조키로 대조)
        end
    else 임계 미만 · 개인지갑(NON_CUSTODIAL)
        Note over GT: 정보 교환 불필요 — 개인지갑은 화이트리스트·소유 인증
        GT-->>GT: APPROVED (미등록 개인지갑은 REJECTED)
    end
    alt APPROVED
        GT-->>BE: APPROVED — 서명·전파 허용
        BE->>BM: submitTransaction — 매니저는 커스터디·서명만 (travelRuleMessage 동봉 없음)
    else REJECTED · PENDING 만료(4장)
        GT-->>BE: 반려 — 잠긴 금액 가용 복귀 · 고객 안내 (온체인엔 아무것도 없음)
    end
```

- **게이트가 서명 앞단으로 이동** — 7.2 의 `validate`·`createTransaction` 동봉·Post-Screening 경로가 사라지고, 우리 게이트가 Notabene 직접 판정 → APPROVED 여야 매니저 제출. Fireblocks 는 커스터디·서명만 한다.
- **스크리닝 우회 방지 책임이 온전히 우리 것** — 벤더가 빈 메시지를 만들어 주지 않으므로, 대상 판별·메시지 전송 누락이 곧 트래블룰 누락이 된다.
- **상대 심사면 비동기** — 7.1 VerifyVASP 처럼 수신 웹훅과 PENDING 중단·재개가 필요하다. 벤더주도(7.2) 대비 늘어나는 운영 부담이 여기 있다.

## 7.7 입금 ← 해외 (Notabene 직접) — 확정은 매니저, 대조는 월렛 백엔드

7.4 는 벤더가 감지·동결까지 했지만, 여기선 **벤더가 동결해 주지 않는다**. 온체인 확정은 블록체인 매니저가, 통지 수신·망 조회는 트래블룰 서비스가, 대조·입금대기(잔고 차단)는 월렛 백엔드가 맡는다.

```mermaid
sequenceDiagram
    autonumber
    participant SV as 송신 VASP
    box rgb(238,242,255) 중앙 — 벤더
    participant NB as Notabene SaaS
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events · Fireblocks 커스터디
    end
    box rgb(224,242,254) 우리 측
    participant GT as 트래블룰 서비스<br/>수신 웹훅 · 망 조회
    participant BE as 월렛(Service) 백엔드<br/>매칭·귀속 · 가용 전이
    participant WQ as 대기함<br/>사전 통지 기록 저장소
    end

    opt 사전 통지 (자금보다 먼저)
        SV->>NB: 트래블룰 메시지 전송
        NB->>GT: 웹훅 — 인입 (우리 수신 엔드포인트)
        GT->>BE: 통지 전달 — 주소 귀속·실명 확인
        BE->>WQ: 대기함 적재
    end
    SV->>SV: 온체인 전송 실행
    BM->>BM: 온체인 감지 → 확정 임계 도달
    BM-->>BE: 입금 후보 (확정 이벤트)
    BE->>WQ: 대조 조회 — source · 대조 재료
    alt 대기함 대조 일치
        WQ-->>BE: 일치 → APPROVED → 가용 전이
    else 대조 재료 없음
        WQ-->>BE: 없음
        BE->>GT: 송신측 트래블룰 상태 조회 요청
        GT->>NB: 직접 조회
        GT-->>BE: 대조되면 APPROVED · 아니면 PENDING
    end
    BE->>BE: APPROVED → 가용 · PENDING → 입금대기(잔고 차단) + 소명·반환 정책
```

- **동결 주체가 바뀐다** — 7.4 는 Notabene·Fireblocks 가 동결해 REJECTED 계열로 넘겨줬지만, 여기선 벤더 동결이 없으므로 **입금대기(잔고 차단)가 우리 자체 상태**다. 개념 5장(입금 실무)의 입금대기·강제 반환 경로를 우리가 직접 운영한다.
- **수신 웹훅이 필요** — 7.3 VerifyVASP 의 수신 컴포넌트와 같은 역할이되 Enclave 는 없다(Notabene SaaS 보관). 사전 통지가 자금보다 먼저 오면 대기함이 도착 후 대조 재료가 된다.
- **합류점(7.5)과의 관계** — 7.5 의 "벤더 스크리닝 통과로 도착" 분기가 여기선 "Notabene 직접 조회로 대조" 분기로 바뀐다. 나머지 판별·가용 전이 규칙은 8장 그대로.

## 7.8 출금 → 개인지갑(자기수탁) — 등록·소유 인증만

여기부터는 다시 **확정 흐름**이다(위 대안 절과 무관). 상대가 VASP 가 아니라 이용자 본인의 자기수탁 지갑이다. 주고받을 상대가 없으니 IVMS101 교환 대신 **화이트리스트(Address Registry) 등록·소유 인증**으로 가른다. 로컬 확인이라 "트래블룰 확인 중"을 즉시 통과한다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) 우리 측
    participant BE as Service 백엔드<br/>출금 유스케이스
    participant GT as 트래블룰 게이트<br/>별도 서비스 · 8장
    participant AR as Address Registry<br/>주소 등록부 · 네이티브
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인 — 수취가 개인지갑 (validate = NON_CUSTODIAL)
    GT->>AR: 등록·소유 인증 조회 (정보 교환 상대 없음)
    alt 등록·소유 인증됨
        AR-->>GT: 확인
        GT-->>BE: APPROVED — 관할 규정에 따른 기록만
        BE->>BM: submitTransaction — 동봉 없음
    else 미등록·미인증
        AR-->>GT: 없음
        GT-->>BE: REJECTED — 등록·소유 인증부터 (반려)
    end
```

- **정보 교환이 없다** — 수취인이 VASP 가 아니라 IVMS101 을 주고받을 상대가 없다. 관할권 규정에 따라 기록만 남긴다.
- **VerifyVASP 는 개인지갑 미지원**(6장)이라, 개인지갑 상대는 망과 무관하게 이 Address Registry 통제로만 처리한다.
- 7.2·7.6 의 `NON_CUSTODIAL` 분기가 이 흐름을 가리킨다 — 여기서 단독으로 펼친다.

## 7.9 입금 ← 개인지갑(자기수탁) — source 가 등록 주소인가

입금도 대칭이다. 도착한 자금의 source 주소가 이용자가 사전 등록·소유 인증한 본인 지갑이면 곧바로 가용, 아니면 입금대기로 묶는다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events
    end
    box rgb(224,242,254) 우리 측
    participant BE as Service 백엔드<br/>가용 전이 게이트
    participant AR as Address Registry
    end

    BM-->>BE: 입금 후보 — 확정 임계 도달
    BE->>AR: source 주소가 등록·소유 인증된 본인 지갑인가
    alt 등록 주소
        AR-->>BE: 확인 → APPROVED → 가용 전이
    else 미등록 개인지갑
        AR-->>BE: 없음 → 입금대기(잔고 차단)
        Note over BE: 등록 유도·소명·반환 정책
    end
```

- 7.5 합류점의 "source 가 Address Registry 등록 주소 → 개인지갑 APPROVED" 분기를 단독으로 펼친 것이다.
- 미등록 개인지갑 발은 입금대기 → 등록 유도·소명·반환(자체 정책, 개념 5장). 이 사후 처리 설계는 6장이 "별도 통제 필요"라고 짚은 자리다.

## 7.10 출금 → 국내 CODE (직접 연동) — 동기 사전 승인

국내 CODE 회원(빗썸·코인원·코빗) 상대다. 기본 도달은 VerifyVASP↔CODE 상호연동 경유(6장)지만, 상호연동 실효가 부족하면 CODE 직접 어댑터를 붙인다 — 이 절이 그 직접 흐름이다. 사전 승인이 **동기**라 VerifyVASP(7.1)의 비동기 왕복이 없다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) 우리 측
    participant BE as Service 백엔드<br/>출금 유스케이스
    participant GT as 트래블룰 게이트<br/>CODE 어댑터 · 8장
    participant CC as CODE-Cipher<br/>설치형 암호화 모듈 (PII 저장소 아님)
    end
    participant CV as CodeVASP 중앙<br/>중계
    participant RV as 상대 VASP · 국내<br/>bithumb·coinone·korbit
    box rgb(220,252,231) 블록체인 매니저
    participant BM as submitTransaction
    end

    BE->>GT: 트래블룰 확인
    GT->>CV: 상대 조회 — List (allianceName · pubkeys · health)
    GT->>GT: transferId(UUID v4) 생성 · 원화 임계 판정(tradePrice·KRW·isExceedingThreshold)
    GT->>CC: 수취인 PII 암호화
    GT->>CV: Asset Transfer Authorization — 동기
    CV->>RV: 사전 승인 요청 (중계)
    RV-->>CV: 승인 · 거절 (즉시)
    CV-->>GT: 결과 — 동기 즉시 응답 (UUID 대기·Callback 없음)
    alt 승인
        GT-->>BE: APPROVED
        BE->>BM: submitTransaction — 온체인 전파
    else 거절
        GT-->>BE: 반려 — 잠긴 금액 가용 복귀
    end
```

- **동기 사전 승인** — Asset Transfer Authorization 이 즉시 응답. VerifyVASP 의 UUID·Callback·중단재개(7.1)가 없어 "트래블룰 확인 중"을 바로 통과하고, 어댑터가 더 단순하다(8장).
- **Enclave 대신 CODE-Cipher** — 설치형 암호화 모듈이되 키·PII 저장소는 아니다. VerifyVASP Enclave 보다 운영 부담이 가볍다.
- **원화 임계 직접 지원**(tradePrice·KRW·isExceedingThreshold) · **transferId 는 우리가 생성**(UUID v4).
- 기본 경로는 상호연동 경유라, 이 직접 흐름은 6장 "상호연동 실효 부족 시" 대안이다.

## 7.11 입금 ← 국내 CODE (직접 연동) — 미확인은 TXID 역추적

입금도 동기 요청-응답이다. 자금 전 사전 승인을 받아 대기함에 쌓고, 도착 후 7.5 합류점에서 대조한다. 대조 재료가 없으면 TXID 로 역추적한다.

```mermaid
sequenceDiagram
    autonumber
    participant SV as 송신 VASP · 국내<br/>bithumb·coinone·korbit
    participant CV as CodeVASP 중앙<br/>중계
    box rgb(224,242,254) 우리 측
    participant CC as CODE-Cipher<br/>수신·복호화
    participant TR as 트래블룰 서비스<br/>망 연동 · 8장
    participant BE as 월렛(Service) 백엔드<br/>매칭·귀속 · 가용 전이
    participant WQ as 대기함<br/>사전 승인 기록 저장소
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 폴링 → deposit-events
    end

    SV->>CV: Asset Transfer Authorization (사전)
    CV->>CC: 중계 — 암호화 메시지 인입
    CC->>TR: 복호화 인계
    TR->>BE: 주소 귀속·실명 확인 조회 · 기록 전달
    BE->>WQ: 사전 승인 기록 적재
    BE-->>TR: 확인 결과
    TR-->>CC: 승인 응답
    CC-->>CV: 회신
    CV-->>SV: 승인 (동기)
    SV->>SV: 온체인 전송
    BM-->>BE: 입금 후보 — 확정 임계 도달
    BE->>WQ: 폴링 입금 후보로 대조 조회 (7.5)
    alt 대기함 대조 일치
        WQ-->>BE: 일치 → APPROVED → 가용
    else 미확인 (대조 재료 없음)
        BE->>TR: TXID 역추적 요청
        TR->>CV: Search VASP by TXID (비동기)
        CV-->>TR: 송신 VASP 식별
        TR->>CV: Asset Transfer Data Request — 사후 정보 교환
        Note over TR,BE: anonymous tx 절차(공식) — 대조되면 가용, 아니면 보류
    end
```

- **요청-응답(동기)** — 사전 승인을 받고 대기함 적재, 도착 후 7.5 합류점에서 대조. VerifyVASP 입금(7.3)과 같은 자리로 합류한다.
- **미확인 입금 역추적** — 대조 재료가 없으면 Search VASP by TXID(비동기) → Asset Transfer Data Request 로 사후 정보 교환. 공식화된 anonymous tx 절차이며, VerifyVASP 의 Check Transaction Status(7.3)에 대응한다.
- **포트-어댑터(8장) 관점** — CODE 는 동기라 어댑터 1개 추가로 끝난다(유스케이스·매니저 포트 0줄). "다 해야 하는" 최악(VerifyVASP+CODE+Notabene)에도 어댑터만 는다.
