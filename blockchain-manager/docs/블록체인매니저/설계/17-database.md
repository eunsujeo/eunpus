---
title: 17. 블록체인 매니저 DB — 테이블 초안
status: To Do
---

매니저 DB 가 보관하는 것 — 계정·주소 매핑, 폴링 커서, 거래 운영 상태, finalize 원본 — 의 테이블 초안이다.
회계 진실(고객 원장·귀속·출금 지시 상태)은 여기 없다 — 그것은 DAW-CORE DB 다([0장](00-cast.md) "DB 를 둘로 나눈 이유").

## 명명 규약

- **접두** — `bcm_` (서비스 식별)
- **접미** — `_m`(마스터/기본) · `_l`(내역/로그)
- **컬럼 축약** — `_dvcd`(구분코드) · `_stcd`(상태코드) · `_yn`(boolean) · `_cnt`(횟수) · `_dttm`(일시) · `_dt`(일자)
- **감사 컬럼** — 직원번호·부점코드 같은 계정계 감사 컬럼은 두지 않는다 — 이 DB 를 만지는 주체는 서비스뿐이다. 행 생성·변경 시각은 테이블마다 업무 의미가 있는 일시 컬럼이 담당한다.

## 테이블 한눈에

| 테이블 | 무엇을 저장하나 | 쓰는 곳 |
|---|---|---|
| `bcm_acnt_m` | 계정 매핑 — ref ↔ vault | createAccount · 모든 오퍼레이션의 계정 해석 |
| `bcm_addr_m` | 주소 매핑 — (계정, 자산) ↔ 입금 주소 | createDepositAddress · depositAddressOf · 입금 감지의 주소→계정 대응 |
| `bcm_poll_crsr_m` | 폴링 커서 | 내부 폴링([4장](04-detect-confirm.md)) |
| `bcm_tx_l` | 거래 운영 상태 — 감지·발행 추적 | 상태 변화 감지 → 이벤트 publish · 막힘 점검 · 제출 중복 차단 |
| `bcm_boost_l` | boost 이력 | 자동 boost([6장](06-withdrawal.md)) — Admin 이 본다 |
| `bcm_raw_tx_l` | finalize 트랜잭션 원본 | 일 배치 보관([15장](15-raw-tx-archive.md) — 테이블 정의도 그 장에) |

## bcm_acnt_m — 계정 매핑

ref 당 vault 하나. `ref` UNIQUE 가 createAccount 멱등의 최종 방어다([1장](01-create-account.md) — 경합해도 이긴 값을 반환).

```sql
CREATE TABLE bcm_acnt_m (
  acnt_id       VARCHAR(64)  PRIMARY KEY,    -- 매니저가 발급하는 계정 매핑 id — 백엔드가 이후 모든 호출에 쓴다
  ref           VARCHAR(64)  NOT NULL UNIQUE,-- 백엔드의 참조 키 (ACT-·SYS-) — 멱등의 물리 근거
  vndr_vlt_id   VARCHAR(64)  NOT NULL,       -- 벤더 vault id — 백엔드에 노출하지 않는다
  reg_dttm      TIMESTAMP    NOT NULL        -- 생성 일시
);
```

## bcm_addr_m — 주소 매핑

(계정, 자산)당 주소 하나 — UNIQUE 가 createDepositAddress 멱등의 물리 근거다([2장](02-issue-deposit-address.md)).

```sql
CREATE TABLE bcm_addr_m (
  acnt_id     VARCHAR(64)  NOT NULL,       -- 계정
  ast_cd      VARCHAR(32)  NOT NULL,       -- 자산 심볼
  dpst_addr   VARCHAR(128) NOT NULL,       -- 발급된 입금 주소
  reg_dttm    TIMESTAMP    NOT NULL,       -- 발급 일시
  PRIMARY KEY (acnt_id, ast_cd)
);
CREATE INDEX idx_bcm_addr_lookup ON bcm_addr_m (dpst_addr, ast_cd);
```

| 컬럼 | 뜻 |
|---|---|
| `PRIMARY KEY (acnt_id, ast_cd)` | 자산당 주소 하나 — 같은 자산의 주소를 더 두려면 계정을 더 만든다(2장) |
| `idx_bcm_addr_lookup` | 역방향 조회 — 입금 감지가 "이 주소가 어느 계정인가"를 여기서 푼다(4장) |

## bcm_poll_crsr_m — 폴링 커서

커서 하나로 입·출금·내부 이체를 다 나른다([4장](04-detect-confirm.md)) — 그래서 지금 이 테이블의 행도 하나다(이름 키는 식별용).

```sql
CREATE TABLE bcm_poll_crsr_m (
  crsr_nm         VARCHAR(64) PRIMARY KEY,   -- 커서 이름 (예: tx-lastUpdated)
  crsr_val        BIGINT      NOT NULL,      -- 마지막 처리 lastUpdated — Unix ms · 벤더 원어 그대로
  last_chng_dttm  TIMESTAMP   NOT NULL       -- 마지막 갱신 일시
);
```

| 컬럼 | 뜻 |
|---|---|
| `crsr_val` | 마지막으로 처리를 끝낸 lastUpdated. 다음 폴은 이 값에서 **겹침 폭만큼 되돌려** 시작한다(겹침 폭은 설정값 — 컬럼 아님) |
| 갱신 규칙 | **처리 묶음이 성공할 때마다 저장한다**(오름차순 처리를 묶음으로 나눠 — 4장). 실패한 묶음부터는 저장하지 않는다 — 다음 폴이 그 구간만 다시 받고, 중복은 멱등이 흡수한다. 입금 폭주 때 재수신 폭이 마지막 묶음 이후로 한정된다 |
| `last_chng_dttm` | 폴링 생존의 관측점 — 이 값이 멈추면 폴링이 멈춘 것이다 |

## bcm_tx_l — 거래 운영 상태

폴링이 본 트랜잭션의 추적 행 — 상태 변화를 가려 이벤트를 발행하고, 막힘 점검이 오래 CONFIRMING 인 건을 여기서 골라낸다.

```sql
CREATE TABLE bcm_tx_l (
  vndr_tx_id     VARCHAR(64)  PRIMARY KEY,   -- 벤더 tx id
  orig_tx_id     VARCHAR(64)  NULL,          -- boost 대체 건이면 원 tx — 백엔드에는 원 tx 로 접어 흘린다(6장)
  ext_tx_id      VARCHAR(128) NULL UNIQUE,   -- 제출 건의 백엔드 요청 키 — 재제출 중복 차단, 입금 감지 건은 NULL
  acnt_id        VARCHAR(64)  NOT NULL,      -- 귀속 계정 — 이벤트 파티션 키
  ast_cd         VARCHAR(32)  NOT NULL,
  last_pub_stcd  VARCHAR(16)  NOT NULL,      -- 마지막으로 발행한 TxStatus — 이 값과 다를 때만 새 이벤트를 낸다
  cnfm_cnt       INT          NOT NULL,      -- 마지막으로 본 confirmation 수
  frst_dtct_dttm TIMESTAMP    NOT NULL,      -- 처음 감지한 일시
  last_chng_dttm TIMESTAMP    NOT NULL       -- 마지막 갱신 일시 — 막힘 점검의 기준
);
```

| 컬럼 | 뜻 |
|---|---|
| `orig_tx_id` | boost 로 벤더 거래가 대체되면(새 txId) 새 행이 원 tx 를 가리킨다 — 이벤트는 원 tx 기준으로 나가 백엔드는 대체를 모른다 |
| `ext_tx_id` | UNIQUE 가 재제출 중복 차단의 물리 근거. 완료 이벤트에 그대로 실어 되돌려준다(14장). **boost 대체 행은 이 값을 갖지 않는다**(원 행만 — 대체 행은 `orig_tx_id` 로 원 행을 가리킬 뿐) |
| `last_pub_stcd` | 발행 중복을 줄이는 장치 — 큐는 at-least-once 라 최종 중복 제거는 소비 쪽 멱등이 맡는다(4장). **publish 성공 후에만 기록한다** — 기록이 먼저면 그 사이 장애 때 이벤트가 영구 유실된다 |

## bcm_boost_l — boost 이력

자동 boost 의 시도 기록 — Admin 조회용([6장](06-withdrawal.md) "boost 이력은 매니저 DB 에 남고 Admin 이 본다").

```sql
CREATE TABLE bcm_boost_l (
  orig_tx_id     VARCHAR(64) NOT NULL,      -- 원 벤더 tx
  try_seq        INT         NOT NULL,      -- 시도 순번
  new_tx_id      VARCHAR(64) NOT NULL,      -- 대체 벤더 tx
  boost_dttm     TIMESTAMP   NOT NULL,      -- 실행 일시
  PRIMARY KEY (orig_tx_id, try_seq)
);
```

## 미확정

- **약어 검수** — `bcm`·`vndr`·`vlt`·`crsr`·`dtct`·`pub` 등 새 축약어는 DAW-CORE DB 약어집과 대조 후 확정.
- **일시 타입** — 컴플라이언스 DB 와 같은 결정 항목([컴플라이언스 2장](../../컴플라이언스/설계/02-database.md) 미확정).
- **`bcm_tx_l` 의 보존** — 종결 건을 언제까지 두고 언제 정리할지 — 15장 원본 보관과 역할을 나눈 뒤 확정.
- **subStatus·networkStatus 보관 여부** — 이벤트에 실어 보내는 값을 행에도 남길지.

## 약어집 (부록)

| 축약 | 원어 | | 축약 | 원어 |
|---|---|---|---|---|
| `bcm` | blockchain manager | | `vndr` | vendor |
| `acnt` | account | | `vlt` | vault |
| `addr` | address | | `crsr` | cursor |
| `ast` | asset | | `dtct` | detect |
| `dpst` | deposit | | `pub` | publish |
| `cnfm` | confirm | | `orig` | original |
| `ext_tx` | external transaction | | `reg` | register |
