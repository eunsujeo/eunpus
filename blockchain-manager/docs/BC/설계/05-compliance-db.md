---
title: 컴플라이언스 게이트 — DB
status: To Do
---

컴플라이언스 게이트 DB(`cmpl_`)의 테이블 셋 — VASP 레지스트리, 출금 확인 상태, 입금 사전 검증 기록.
정체·거래 허용(고객 화면 노출)은 여기가 아니라 DAW-CORE VASP 마스터(`daw_vasp_m`)에 있다 — 게이트는 솔루션 라우팅과 사전 검증 기록만 쥔다. 흐름은 [게이트 흐름](04-compliance-flow.md).

## 명명 규약

- **접두** `cmpl_` · **접미** `_m`(마스터) · `_l`(내역/로그)
- **컬럼 축약** `_dvcd`(구분코드 — 종류 enum) · `_stcd`(상태코드 — 바뀌는 상태) · `_yn`(boolean) · `_dttm`(일시) · `_id`
- **감사 컬럼 없음** — 이 DB 를 만지는 주체는 게이트뿐이다. 행 생성·변경 시각은 업무 의미가 있는 일시 컬럼(`occr_dttm`·`sync_dttm`·`rcv_dttm`)이 담당한다.
- **PII 없음** — 어느 테이블에도 이름 등 신원 정보를 두지 않는다. 원문은 Enclave(국내)·벤더(해외)가 보관하고, 여기엔 대조 키만 둔다.

## 테이블 한눈에

| 테이블 | 무엇을 저장하나 | 쓰는 곳 |
|---|---|---|
| `cmpl_vasp_m` | VASP 레지스트리 — 솔루션 목록 + `cmpl_vasp_id`(게이트 발급 안정 id) + 코어 `vasp_id` 매핑 + 활성화 | 목록 동기화 · Admin 활성화 · 출금 확인 라우팅 |
| `cmpl_wdrl_chk_l` | 출금 트래블룰 확인 상태 | Create/Get Withdrawal Check · Report · settled 발행 · PENDING 만료 스캔 |
| `cmpl_pre_vrfc_l` | 입금 사전 검증 기록 — 대조 키만 | 사전 검증 수신 적재 · tx hash 갱신 · 입금 도착 대조 |

## ERD

```erd
entity: cmpl_vasp_m @1,1 :: VASP 레지스트리 — 솔루션 목록 + 코어 vasp_id 매핑·활성화 | cmpl_vasp_id PK :: 게이트 발급 안정 id — Admin 이 이 값으로 지목 | soln_dvcd :: 솔루션 구분 (VERIFYVASP·CODE_INTEROP·NOTABENE) | vasp_id :: 매핑된 코어 VASP id — 미매핑이면 NULL | actv_yn :: 활성화(라우팅 켜짐) 여부
entity: cmpl_wdrl_chk_l @2,1 :: 출금 트래블룰 확인 상태 | chk_id PK :: 확인 건 id | ext_tx_id UK :: 출금 멱등 키 — DAW-CORE·매니저와 같은 값 | vasp_id :: 수취 VASP (코어 id) — 라우팅 입력 | vrdt_stcd :: 확인 결과 (TrVerdict)
entity: cmpl_pre_vrfc_l @1,2 :: 입금 사전 검증 기록 — 대조 키만 (PII 없음) | vrfc_ref PK :: 솔루션 발급 검증 참조 | bnfc_addr :: 우리 쪽 수취 주소 | tx_hash :: 전송 후 상대가 보고 | mtch_dttm :: 도착 입금과 대조 성공 일시
rel: cmpl_vasp_m | cmpl_wdrl_chk_l | vasp_id 로 라우팅 | one-many | dashed
```

점선 = 값으로 잇는 논리 관계 — 출금 확인이 `vasp_id` 로 레지스트리를 조회해 솔루션을 고른다(FK 아님). `cmpl_pre_vrfc_l` 은 입금 대조 전용 독립 테이블이라 다른 둘과 관계가 없다. 배지 PK·UK.

## 시나리오로 보는 테이블 흐름

한 건이 어느 테이블을 언제 건드리는지 — 단계를 넘겨 보라. 초록 행 = 그 단계에 새로 들어온 행, 노랑 칸 = 바뀐 값. **청록 = DB 테이블 · 노랑 = 메시지 큐 · 보라 = 밖에서 들어오거나 당겨오는 것.**

### 출금 확인

접수는 항상 `PENDING`, 최종 결과는 `compliance` 큐의 `withdrawal-check.settled` 이벤트로만 나간다. 제출 tx hash 보고는 사전 검증과 실 거래를 잇는 비차단 후처리다.

```anim
db
table: cmpl_wdrl_chk_l | chk_id | ext_tx_id | vrdt_stcd | rpt_tx_hash
queue: compliance | 이벤트 | externalTxId
step: ① 접수 (PENDING) | DAW-CORE 가 externalTxId 로 확인을 요청 — 행이 생기고 PENDING 으로 접수 응답
ins: cmpl_wdrl_chk_l | chk-01 | wd-42 | PENDING | 
step: ② 솔루션 왕복 | 어댑터가 솔루션과 왕복 — 동기·비동기 차이를 흡수한다
step: ③ 결과 확정 (settled) | 통과 → APPROVED 로 확정하고 settled 이벤트를 발행한다
upd: cmpl_wdrl_chk_l | 1 | vrdt_stcd=APPROVED
ins: compliance | withdrawal-check.settled | wd-42
step: ④ 제출 tx hash 보고 | DAW-CORE 가 제출 후 tx hash 를 보고 — 요구하는 솔루션에만 전달(비차단)
upd: cmpl_wdrl_chk_l | 1 | rpt_tx_hash=0x4e1d
```

기한이 지나도록 결과가 없는 `PENDING` 은 만료 배치가 찾아 `REJECTED`(만료)로 확정하고 같은 이벤트를 발행한다 — 만료 verdict 를 만드는 유일한 경로다.

### VASP 온보딩 — 동기화와 활성화

한 행의 두 출처를 나눈다 — **동기화**는 솔루션 목록 컬럼만, **활성화**는 매핑 컬럼(`vasp_id`·`actv_yn`)만 건드린다. 목록에서 빠져도 삭제하지 않고 도달 가능 표시만 내려, 매핑·활성화를 잃지 않는다.

```anim
db
source: 솔루션 목록 | 동기화
table: cmpl_vasp_m | cmpl_vasp_id | vasp_id | actv_yn | rchbl_yn
step: ① 동기화 — 목록 적재 | 솔루션 목록을 UPSERT — 신규 항목에 cmpl_vasp_id 발급, 아직 비활성
ins: 솔루션 목록 | VASP 항목
ins: cmpl_vasp_m | cv-01 |  | false | true
step: ② Admin 활성화 — 코어가 매핑 | Admin 이 온보딩하면 코어가 vasp_id 를 만들어 게이트에 매핑하고 활성화한다
upd: cmpl_vasp_m | 1 | vasp_id=vasp-7 | actv_yn=true
step: ③ 출금 확인 라우팅 | 출금 확인의 vaspId 로 이 행을 찾아 솔루션을 정한다
step: ④ 목록에서 사라짐 | 다음 동기화에 빠지면 삭제하지 않고 도달 가능만 내린다 — 매핑·활성화는 그대로
upd: cmpl_vasp_m | 1 | rchbl_yn=false
```

### 입금 사전 검증 — 자금보다 정보가 먼저

입금은 방향이 반대다 — 상대 거래소가 자금을 보내기 전에 사전 검증(예고)을 먼저 보내온다. 게이트는 대조 키만 추려 두었다가, 자금이 도착하면 그 기록과 맞춘다.

```anim
db
hook: 상대 VASP 사전검증 | 도착
table: cmpl_pre_vrfc_l | vrfc_ref | tx_hash | mtch_dttm
queue: deposit-events | 이벤트 | txId
step: ① 사전 검증 적재 | 자금 전에 온 예고를 대조 키만 추려 적재한다 (PII 없음)
ins: 상대 VASP 사전검증 | 입금 예고
ins: cmpl_pre_vrfc_l | vrfc-01 |  | 
step: ② tx hash 보고 | 상대가 온체인 전송 후 거래 해시를 알려오면 같은 행에 채운다
upd: cmpl_pre_vrfc_l | 1 | tx_hash=0x9a2c
step: ③ 자금 도착 | 매니저가 입금을 감지·확정해 deposit-events 를 발행한다
ins: deposit-events | 입금 확정 | tx-91c
step: ④ 대조 | DAW-CORE 확인 요청 → 사전 검증 기록과 대조해 "예고된 입금"으로 답하고 매칭 표시(이중 매칭 방지)
upd: cmpl_pre_vrfc_l | 1 | mtch_dttm=12:00
```

## 테이블 상세

### cmpl_vasp_m — VASP 레지스트리

게이트가 아는 VASP 한 항목이 한 행이다. 동기화가 솔루션 목록을 채우고(신규엔 `cmpl_vasp_id` 발급), 활성화가 코어 `vasp_id` 를 매핑하고 `actv_yn` 을 켠다.

```sql
CREATE TABLE cmpl_vasp_m (
  cmpl_vasp_id   VARCHAR(64)  PRIMARY KEY,   -- 게이트 발급 안정 id — Admin 조회·매핑 대상. 동기화 재적재에도 안 바뀐다
  soln_dvcd      VARCHAR(16)  NOT NULL,      -- 솔루션 구분: VERIFYVASP | CODE_INTEROP | NOTABENE
  soln_vasp_id   VARCHAR(255) NOT NULL,      -- 솔루션 쪽 식별자 (vaspId · DID)
  vasp_nm        VARCHAR(255) NOT NULL,      -- 솔루션이 알려준 표시명
  vasp_id        VARCHAR(64)  NULL,          -- 매핑된 코어 VASP id (daw_vasp_m) — 활성화 때 채운다. 미매핑이면 NULL
  actv_yn        BOOLEAN      NOT NULL,      -- 활성화 여부 — 해제해도 매핑(vasp_id)은 남긴다
  rchbl_yn       BOOLEAN      NOT NULL,      -- 이 항목으로 확인을 보낼 수 있는가 (마지막 동기화 기준)
  sync_dttm      TIMESTAMP    NOT NULL,      -- 마지막 동기화 일시
  reg_dttm       TIMESTAMP    NOT NULL,      -- 최초 등재 일시
  last_chng_dttm TIMESTAMP    NOT NULL,      -- 매핑·활성화 마지막 변경 일시
  UNIQUE (soln_dvcd, soln_vasp_id)
);
CREATE INDEX idx_cmpl_vasp_by_core ON cmpl_vasp_m (vasp_id);
```

| 컬럼 | 뜻 |
|---|---|
| `cmpl_vasp_id` | 게이트가 발급하는 안정 id — Admin 이 목록에서 이 값으로 VASP 를 지목해 활성화한다 |
| 동기화 UPSERT | `(soln_dvcd, soln_vasp_id)` 로 대조해 UPSERT — 신규면 `cmpl_vasp_id` 발급(`actv_yn`=false), 기존이면 목록 컬럼만 갱신하고 `vasp_id`·`actv_yn` 은 보존. **목록에서 사라진 항목은 지우지 않고 `rchbl_yn`=false** |
| `vasp_id` 매핑 | 활성화 API(코어 → 게이트)가 코어의 `vasp_id` 를 채운다. 출금 확인의 `vaspId` 를 이 값(인덱스 `idx_cmpl_vasp_by_core`)으로 조회해 솔루션·라우팅을 정한다 |
| 다중 솔루션 | 같은 실물 VASP 가 여러 솔루션에 있으면 항목(행)이 여럿이라 `vasp_id` 가 여러 행에 붙는다 — 라우팅 규칙으로 하나를 고른다(미확정) |

### cmpl_wdrl_chk_l — 출금 확인 상태

출금 한 건의 트래블룰 확인 한 건이 한 행이다. 요청 접수 → 솔루션 왕복 → 결과 확정 → 제출 tx hash 보고가 이 행에 쌓인다.

```sql
CREATE TABLE cmpl_wdrl_chk_l (
  chk_id          VARCHAR(64)  PRIMARY KEY,      -- 확인 건 식별자 — 게이트 발급
  occr_dttm       TIMESTAMP    NOT NULL,         -- 발생 일시 — 요청이 접수돼 행이 생긴 시각
  ext_tx_id       VARCHAR(128) NOT NULL UNIQUE,  -- 멱등 키 — DAW-CORE·매니저와 같은 값. UNIQUE 가 멱등의 물리 근거
  acnt_id         VARCHAR(64)  NOT NULL,         -- 고객 계정 id
  vasp_id         VARCHAR(64)  NOT NULL,         -- 수취 VASP — DAW-CORE 가 지목한 코어 VASP 마스터 id
  soln_dvcd       VARCHAR(16)  NOT NULL,         -- 라우팅으로 확정된 솔루션 — 사후 감사·재현용
  rqst_hash       VARCHAR(64)  NOT NULL,         -- 최초 요청 본문 해시 — 같은 키에 다른 내용의 재요청 거절
  vrdt_stcd       VARCHAR(16)  NOT NULL,         -- TrVerdict: NOT_REQUIRED | APPROVED | PENDING | REJECTED
  trvl_rule_msg   TEXT         NULL,             -- 제출에 실어 보낼 암호화 메시지 — 만드는 솔루션(Notabene)만 값
  evdc_dvcd       VARCHAR(32)  NULL,             -- 통과 증적 종류 (enum 미확정)
  evdc_ref        VARCHAR(255) NULL,             -- 증적 참조 (예: 사전 승인 UUID)
  stld_dttm       TIMESTAMP    NULL,             -- 최종 결과 일시 — 채워지면 더는 안 바뀐다. PENDING 이면 NULL
  pend_expr_dttm  TIMESTAMP    NULL,             -- PENDING 만료 스캔 기준
  rpt_tx_hash     VARCHAR(128) NULL              -- DAW-CORE 가 제출 후 보고해 온 거래 해시
);
```

| 컬럼 | 뜻 |
|---|---|
| `ext_tx_id` | 이 확인이 어느 출금 건인가 — DAW-CORE 출금 건 식별자이자 매니저 제출 키와 같은 값. UNIQUE 가 멱등의 물리 근거 — 같은 키 재요청은 이 행을 돌려준다 |
| `vasp_id` | 수취 거래소 — DAW-CORE 가 지목한 코어 마스터 id. 이 값으로 `cmpl_vasp_m` 에서 솔루션 항목을 찾아 라우팅한다 |
| `soln_dvcd` | 실제로 어느 솔루션으로 보냈는지 — 사후 감사·재현용 |
| `rqst_hash` | 같은 키에 다른 내용의 재요청이 오면 이 값과 대조해 거절한다 |
| `vrdt_stcd` | 확인의 현재 결과 — NOT_REQUIRED(대상 아님) · APPROVED(통과) · PENDING(대기) · REJECTED(거절·만료) |
| `trvl_rule_msg` | 통과 시 출금 제출에 실어 보낼 암호화 메시지 — Notabene 경로만 값이 있다 |
| `evdc_dvcd` · `evdc_ref` | 통과를 증명하는 기록의 종류와 참조 값. 종류 목록은 미확정 |
| `stld_dttm` | 최종 결과가 난 일시 — 채워지면 결과가 더는 바뀌지 않는다 |
| `pend_expr_dttm` | 결과 대기의 기한 — 만료 배치가 이 값으로 기한 지난 건을 찾아 거절 확정한다 |
| `rpt_tx_hash` | DAW-CORE 가 온체인 제출 후 보고해 온 거래 해시 — 솔루션에 tx hash 를 알려줄 때 쓴다 |

### cmpl_pre_vrfc_l — 입금 사전 검증 기록

상대 거래소가 자금을 보내기 전에 먼저 보내오는 사전 검증(입금 예고)을 대조용으로 쌓아 두는 기록이다. 이 시점엔 자금이 아직 없고 정보만 먼저 도착한 상태다.

```sql
CREATE TABLE cmpl_pre_vrfc_l (
  vrfc_ref     VARCHAR(128) PRIMARY KEY,    -- 솔루션이 발급한 검증 참조 UUID
  bnfc_addr    VARCHAR(128) NOT NULL,       -- 우리 쪽 수취 주소
  ast_cd       VARCHAR(32)  NOT NULL,       -- 자산 심볼
  amt          VARCHAR(78)  NOT NULL,       -- 예고된 금액 — 단위·표현은 대조 규칙과 함께 확정 (미확정)
  src_addr     VARCHAR(128) NULL,           -- 보내는 쪽 주소 — 사전 검증 시점엔 비어 있을 수 있다
  tx_hash      VARCHAR(128) NULL,           -- 상대가 전송 후 보고해 오면 채운다
  mtch_dttm    TIMESTAMP    NULL,           -- 도착한 입금과 대조 성공한 일시
  rcv_dttm     TIMESTAMP    NOT NULL        -- 사전 검증 수신 일시 — 보존 기간 만료 기준
);
CREATE INDEX idx_cmpl_pre_vrfc_hash ON cmpl_pre_vrfc_l (tx_hash);
CREATE INDEX idx_cmpl_pre_vrfc_addr ON cmpl_pre_vrfc_l (bnfc_addr, ast_cd);
```

| 컬럼 | 뜻 |
|---|---|
| `vrfc_ref` | 솔루션이 발급한 검증 참조 — 최초 수신·사후 tx hash 갱신·솔루션 조회가 모두 이 값으로 같은 건임을 잇는다 |
| `bnfc_addr` | 예고된 입금의 우리 쪽 수취 주소 — 도착한 입금과 맞춰 보는 기본 키 중 하나 |
| `amt` | 예고된 금액 — 단위·표현은 대조 규칙과 함께 확정(미확정) |
| `src_addr` | 보내는 쪽 주소 — 사전 검증 시점엔 상대도 확정 못 할 수 있어 비어 있을 수 있다 |
| `tx_hash` | 상대가 전송 후 알려온 거래 해시로 채워진다 — 있으면 정확 매칭, 없으면 주소·자산·금액 매칭 |
| `mtch_dttm` | 도착한 입금과 대조 성공한 일시 — 채워진 행은 다른 입금과 다시 매칭하지 않는다(이중 매칭 방지) |
| `rcv_dttm` | 사전 검증이 수신된 일시 — 보존 기간 만료의 기준(기간 값 미정) |

PII(이름 등 신원 정보) 컬럼이 없는 것이 규칙이다 — 대조 키만 갖는다.

## 미확정

- **금액 표현** — base unit 정수로 둘지 표시 단위 decimal 로 둘지 — 사전 검증 메시지 금액 단위·대조 규칙과 함께 확정.
- **증적(`evdc_dvcd`) enum** — 솔루션별 증적 종류 확정 후.
- **다중 솔루션 라우팅 규칙** — 한 `vasp_id` 가 여러 솔루션 항목에 걸릴 때(국내·해외 동시) 어느 솔루션을 고를지.
- **사전 검증 기록 보존 기간** — 값 미정(국내 시간 규칙과 함께).
- **감사 기록(솔루션 원어 근거) 범위** — 열린 결정. 확정되면 append-only `_l` 테이블로 붙인다.
- **일시 타입** — DAW-CORE DB 는 일시를 `VARCHAR(16)`(`YYYYMMDDHHMMSS`)로 둔다. 이 DB 도 그에 맞출지 `TIMESTAMP` 로 갈지 결정.

## 약어집

축약 규칙은 영어 단어의 모음 탈락. 이 문서가 쓰는 축약 전부다.

| 축약 | 원어 | | 축약 | 원어 |
|---|---|---|---|---|
| `cmpl` | compliance | | `vrdt` | verdict |
| `vasp` | virtual asset service provider | | `evdc` | evidence |
| `wdrl` | withdrawal | | `vrfc` | verification |
| `chk` | check | | `bnfc` | beneficiary |
| `soln` | solution | | `mtch` | match |
| `rchbl` | reachable | | `stld` | settled |
| `actv` | active (활성화) | | `occr` | occur |
| `acnt` | account | | `rqst` | request |
| `pend_expr` | pending expire | | `rpt` | report |
| `ast` | asset | | `src` | source |
| `amt` | amount | | `nm` | name |
