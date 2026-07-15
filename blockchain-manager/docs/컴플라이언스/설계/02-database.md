---
title: 2. 컴플라이언스 DB — 테이블 초안
status: To Do
---

[0장](00-scope.md)이 확정한 컴플라이언스 DB 세 자원 — 목록 스냅샷·check 상태·대기함 — 과 개인지갑 등록의 테이블 초안이다.
필드 타입·의미는 [API 문서](../API/api.md)의 타입 정의와 짝이다. **PII 는 어느 테이블에도 없다** — 원문은 Enclave(국내)·벤더(해외)가 보관한다.

## 테이블 한눈에

| 테이블 | 자원 | 쓰는 곳 |
|---|---|---|
| `counterparties` | 목록 스냅샷 | List Counterparties · 목록 동기화 배치 |
| `withdrawal_checks` | check 상태 | Create/Get Withdrawal Check · Report · settled 발행 · PENDING 만료 스캔 |
| `pre_verifications` | 대기함 | 인바운드 수신 적재 · TX_REPORT 갱신 · Create Deposit Check 대조 |
| `registered_wallets` | 개인지갑 등록 | Register/Deregister Wallet · 개인지갑 verdict |

## counterparties — 목록 스냅샷

```sql
CREATE TABLE counterparties (
  counterparty_id   VARCHAR(64) PRIMARY KEY,   -- 우리 발급 안정 ID (cpty_upbit)
  name              VARCHAR(255) NOT NULL,      -- 표시명
  solution          VARCHAR(16)  NOT NULL,      -- VERIFYVASP | CODE_INTEROP | NOTABENE (내부 전용 — API 비노출)
  solution_vasp_id  VARCHAR(255) NOT NULL,      -- 솔루션 쪽 식별자 (vaspId · DID)
  reachable         BOOLEAN      NOT NULL,      -- 마지막 동기화 기준 도달 가능
  synced_at         TIMESTAMP    NOT NULL,      -- 마지막 동기화 시각
  created_at        TIMESTAMP    NOT NULL,
  UNIQUE (solution, solution_vasp_id)
);
```

| 필드 | 뜻 |
|---|---|
| `counterparty_id` | 우리가 발급하는 안정 ID — 동기화로 솔루션 쪽 값이 바뀌어도 유지 |
| `solution` · `solution_vasp_id` | 어느 솔루션의 어떤 항목에서 왔나 — 어댑터 라우팅용. **API 응답에는 싣지 않는다**(솔루션 원어 비노출) |
| `reachable` | 동기화 시점 기준 — 최종 확인은 Create Withdrawal Check 에서 |

## withdrawal_checks — check 상태

```sql
CREATE TABLE withdrawal_checks (
  check_id             VARCHAR(64)  PRIMARY KEY,        -- chk_...  서비스 발급
  external_tx_id       VARCHAR(128) NOT NULL UNIQUE,    -- 멱등 키 — 월렛·매니저와 같은 키
  account_id           VARCHAR(64)  NOT NULL,           -- 큐 파티션 키·감사 축
  request_hash         VARCHAR(64)  NOT NULL,           -- 최초 요청 본문 해시 — 멱등 409 대조
  verdict              VARCHAR(16)  NOT NULL,           -- TrVerdict: NOT_REQUIRED | APPROVED | PENDING | REJECTED
  travel_rule_message  TEXT         NULL,               -- Notabene 경로만 값
  evidence_kind        VARCHAR(32)  NULL,               -- 통과 증적 종류 (enum 미확정 — API 문서)
  evidence_ref         VARCHAR(255) NULL,               -- 증적 참조 (예: 사전 승인 UUID)
  settled_at           TIMESTAMP    NULL,               -- 최종 결과 시각 — PENDING 이면 NULL
  pending_expires_at   TIMESTAMP    NULL,               -- PENDING 만료 스캔 기준 (시간 규칙: 트래블룰 4장)
  reported_tx_hash     VARCHAR(128) NULL,               -- Report Withdrawal Result 수신 값
  created_at           TIMESTAMP    NOT NULL,
  modified_at          TIMESTAMP    NOT NULL
);
```

| 필드 | 뜻 |
|---|---|
| `external_tx_id` | UNIQUE 가 멱등의 물리 근거 — 같은 키 재요청은 이 행을 돌려준다 |
| `request_hash` | 같은 키에 다른 본문이면 409 — 이 값과 대조 |
| `pending_expires_at` | PENDING 만료 스캔이 이 컬럼으로 기한 지난 건을 찾는다 |
| `settled_at` | settled = 이 컬럼이 채워지고 verdict 가 더는 안 바뀐다 |

솔루션 원어 근거(벤더 응답 코드 등)를 감사 기록으로 얼마나 둘지는 미정(0장 열린 결정) — 확정되면 append-only 별도 테이블로 붙인다.

## pre_verifications — 대기함

```sql
CREATE TABLE pre_verifications (
  verification_ref     VARCHAR(128) PRIMARY KEY,        -- 솔루션 쪽 검증 참조 (UUID)
  beneficiary_address  VARCHAR(128) NOT NULL,           -- 우리 쪽 수취 주소
  asset                VARCHAR(32)  NOT NULL,
  amount               VARCHAR(78)  NOT NULL,           -- decimal 문자열
  source_address       VARCHAR(128) NULL,               -- 사전 검증 시점엔 없을 수 있다
  tx_hash              VARCHAR(128) NULL,               -- TX_REPORT 수신 시 갱신
  matched_at           TIMESTAMP    NULL,               -- Create Deposit Check 대조 성공 시각
  received_at          TIMESTAMP    NOT NULL,
  modified_at          TIMESTAMP    NOT NULL
);
CREATE INDEX idx_pre_verifications_match ON pre_verifications (tx_hash);
CREATE INDEX idx_pre_verifications_addr  ON pre_verifications (beneficiary_address, asset);
```

| 필드 | 뜻 |
|---|---|
| `verification_ref` | 수신·TX_REPORT 갱신·능동 조회(Check Transaction Status)를 잇는 열쇠 |
| `tx_hash` | 채워지면 정확 매칭, 비어 있으면 주소·자산·금액 매칭 — 대조 규칙 상세는 미확정(API 문서) |
| `matched_at` | 대조 완료 표시 — 이중 매칭 방지 |
| 보존 기간 | **값 미정** — 트래블룰 4장 국내 시간 규칙과 함께. 확정되면 만료 배치가 이 테이블을 정리한다 |

PII(이름 등 신원 정보) 컬럼이 없는 것이 규칙이다 — 대조 키만 갖는다.

## registered_wallets — 개인지갑 등록

```sql
CREATE TABLE registered_wallets (
  wallet_id        VARCHAR(64)  PRIMARY KEY,    -- rw-...  서비스 발급
  account_id       VARCHAR(64)  NOT NULL,
  address          VARCHAR(128) NOT NULL,
  asset            VARCHAR(32)  NOT NULL,
  registered_at    TIMESTAMP    NOT NULL,
  deregistered_at  TIMESTAMP    NULL,           -- 해제 시각 — NULL 이면 유효
  UNIQUE (account_id, address, asset)
);
```

| 필드 | 뜻 |
|---|---|
| `UNIQUE (account_id, address, asset)` | Register Wallet 멱등의 물리 근거 |
| `deregistered_at` | 행 삭제 대신 시각 기록 — 등록 이력이 감사 대상이라 남긴다. 유효 판정은 `IS NULL` |
| 소유 증명 원문 | 저장하지 않는다 — 벤더(Address Registry) 반영이 목적이고, 증명 형식·반영 수단은 미확정(API 문서) |

## 미확정

- **감사 기록(솔루션 원어 근거)의 범위** — 0장 열린 결정 1. 확정되면 append-only 테이블 추가.
- **대기함 보존 기간·대조 규칙** — 트래블룰 4장·API 문서 미확정 절과 같은 항목.
- **evidence_kind enum** — 솔루션별 증적 종류 확정 후.
