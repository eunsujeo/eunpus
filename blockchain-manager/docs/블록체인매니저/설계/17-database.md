---
title: 17. 블록체인 매니저 DB — 테이블 초안
status: To Do
---

매니저 DB 가 보관하는 것 — 계정·주소 매핑, 거래 운영 상태, finalize 원본 — 의 테이블 초안이다.
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
| `bcm_tx_l` | 거래 운영 상태 — 감지·발행 추적 | 웹훅 알림 판단 → 이벤트 publish([4장](04-detect-confirm.md)) · 막힘 점검 · 제출 중복 차단 |
| `bcm_whk_l` | 수신 알림 원본 — 웹훅 버퍼 | 수신부 적재 → 판단 워커 집기([4장](04-detect-confirm.md) 폭주 설계) · finalize 원본의 출처([15장](15-raw-tx-archive.md)) |
| `bcm_swp_trgt` | sweep 대상 마킹 | 입금 확정 시 마킹 → 주기 배치가 제출([5장](05-deposit.md)) |
| `bcm_job_m` | 주기 작업 상태 — heartbeat · 대사 커서 | tx 대사의 대조 범위 이어붙임([4장](04-detect-confirm.md)) · 밖에서 읽는 heartbeat([11장](11-monitoring.md)) |
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

## bcm_tx_l — 거래 운영 상태

웹훅 알림으로 본 트랜잭션의 추적 행 — 상태 변화를 가려 이벤트를 발행하고, 막힘 점검이 오래 CONFIRMING 인 건을 여기서 골라낸다.

```sql
CREATE TABLE bcm_tx_l (
  vndr_tx_id     VARCHAR(64)  PRIMARY KEY,   -- 벤더 tx id
  orig_tx_id     VARCHAR(64)  NULL,          -- boost 대체 건이면 원 tx — 백엔드에는 원 tx 로 접어 흘린다(6장)
  ext_tx_id      VARCHAR(128) NULL UNIQUE,   -- 제출 건의 백엔드 요청 키 — 재제출 중복 차단, 입금 감지 건은 NULL
  acnt_id        VARCHAR(64)  NOT NULL,      -- 귀속 계정 — 이벤트 파티션 키
  ast_cd         VARCHAR(32)  NOT NULL,
  last_pub_stcd  VARCHAR(16)  NOT NULL,      -- 마지막으로 발행한 TxStatus — 이 값과 다를 때만 새 이벤트를 낸다
  cnfm_cnt       INT          NOT NULL,      -- 마지막으로 본 confirmation 수
  stall_alrt_dttm TIMESTAMP   NULL,          -- 막힘 경보를 올린 일시 — 있으면 다음 주기 건너뜀(중복 경보 방지) · 해소 전이 시 NULL
  frst_dtct_dttm TIMESTAMP    NOT NULL,      -- 처음 감지한 일시
  last_chng_dttm TIMESTAMP    NOT NULL       -- 마지막 갱신 일시 — 막힘 점검의 기준
);
```

| 컬럼 | 뜻 |
|---|---|
| `orig_tx_id` | boost 로 벤더 거래가 대체되면(새 txId) 새 행이 원 tx 를 가리킨다 — 이벤트는 원 tx 기준으로 나가 백엔드는 대체를 모른다 |
| `ext_tx_id` | UNIQUE 가 재제출 중복 차단의 물리 근거. 완료 이벤트에 그대로 실어 되돌려준다(14장). **boost 대체 행은 이 값을 갖지 않는다**(원 행만 — 대체 행은 `orig_tx_id` 로 원 행을 가리킬 뿐) |
| `last_pub_stcd` | 발행 중복을 줄이는 장치 — 큐는 at-least-once 라 최종 중복 제거는 소비 쪽 멱등이 맡는다(4장). **publish 성공 후에만 기록한다** — 기록이 먼저면 그 사이 장애 때 이벤트가 영구 유실된다 |

## bcm_whk_l — 수신 알림 원본

수신부가 웹훅 알림을 받은 그대로 적재하는 버퍼([4장](04-detect-confirm.md) 폭주 설계 — 요청당 3단계의 둘째 단계). 판단 워커가 미처리분을 집어 가고, finalize 원본 일 배치(15장)가 여기서 payload 를 뽑는다.

```sql
CREATE TABLE bcm_whk_l (
  noti_id       VARCHAR(64)   PRIMARY KEY,   -- 웹훅 알림 id — 벤더가 알림마다 붙이는 v2 UUID. unique 가 중복 수신 방어의 물리 근거
  evnt_tp       VARCHAR(64)   NOT NULL,      -- eventType (transaction.status.updated 등)
  vndr_tx_id    VARCHAR(64)   NULL,          -- 벤더 tx id — 이 알림이 가리키는 거래
  payload       JSON          NOT NULL,      -- 알림 원본 그대로 — 판단·원본 보관의 입력
  rcv_dttm      TIMESTAMP     NOT NULL,      -- 수신 일시
  prcs_yn       CHAR(1)       NOT NULL,      -- 판단 처리 여부
  prcs_dttm     TIMESTAMP     NULL           -- 처리 일시
);
CREATE INDEX idx_bcm_whk_pick ON bcm_whk_l (prcs_yn, rcv_dttm);  -- 판단 워커의 집기 — 미처리 오래된 순
```

| 컬럼 | 뜻 |
|---|---|
| `noti_id` | insert 충돌 = 같은 알림의 중복 전달 — 무시하고 200 을 돌려준다(4장). 중복 방어가 물리 제약으로 끝난다 |
| `payload` | 검증·파싱 전의 원본 — 판단에 버그가 있어도 원본으로 재처리할 수 있고, finalize 원본 보관(15장)이 그 tx 의 마지막 COMPLETED 알림의 이 값을 옮겨 간다 |
| 보존 | 처리 후 N일(운영 설정값) 뒤 정리 — 장기 보존은 15장 `bcm_raw_tx_l` 몫 |

## bcm_swp_trgt — sweep 대상

입금 확정 관찰이 마킹하고, 주기 배치가 모아서 제출한다([5장](05-deposit.md)). PK 가 (계정, 자산)이라 입금이 여러 번 와도 행 하나 — 전액 sweep 이라 중복 마킹이 자연히 합쳐진다.

```sql
CREATE TABLE bcm_swp_trgt (
  acnt_id       VARCHAR(64)  NOT NULL,       -- 고객 계정
  ast_cd        VARCHAR(32)  NOT NULL,
  reg_dttm      TIMESTAMP    NOT NULL,       -- 처음 마킹된 일시
  swp_tx_id     VARCHAR(64)  NULL,           -- 제출한 sweep 벤더 tx — NULL=미제출(배치 대상) · 값 있으면 진행 중(재제출 안 함)
  try_cnt       INT          NOT NULL,       -- 제출 시도 횟수 — 반복 실패 경보 기준
  last_try_dttm TIMESTAMP    NULL,           -- 마지막 시도 일시
  PRIMARY KEY (acnt_id, ast_cd)
);
```

| 컬럼 | 뜻 |
|---|---|
| 삭제 기준 | sweep tx 제출 성공이 아니라 **배치가 vault 잔액이 최소 미만임을 확인**했을 때 삭제한다 — vault 잔액이 진실이고 이 테이블은 그 vault 를 가리키는 작업 큐다. 탈락한 sweep·진행 중 도착한 새 입금이 모두 다음 배치에서 자연히 재sweep 된다 |
| 행의 생멸 | 확정 관찰 → insert(이미 있으면 무시) · 배치가 `swp_tx_id` NULL 대상의 잔액 조회 → 최소 이상이면 제출(`swp_tx_id` 기록) · 최소 미만이면 삭제 · sweep tx 종결(확정·탈락) 관찰 → `swp_tx_id` NULL 로(다음 배치가 잔액 재확인) |
| `swp_tx_id` | 진행 중 재제출 방지 + sweep 결과 추적 링크. sweep tx 는 매니저 자기 실행분이라 큐에 안 실리고 이 링크로 결과를 되받는다 |
| `try_cnt` | 반복 실패가 임계(운영 설정값)를 넘으면 경보 — externalTxId 멱등이라 재제출은 안전하다 |

## bcm_job_m — 주기 작업 상태

주기 작업(막힘 점검 · sweep 배치 · tx 대사 · 수수료 관측)별 한 행. 용도 둘 — 밖에서 읽는 heartbeat([11장](11-monitoring.md) — 읽기 전용 계정), tx 대사의 대조 범위 이어붙임([4장](04-detect-confirm.md)).

```sql
CREATE TABLE bcm_job_m (
  job_nm         VARCHAR(64)  PRIMARY KEY,   -- 작업명
  last_run_dttm  TIMESTAMP    NOT NULL,      -- 마지막 실행 일시 — heartbeat
  last_scs_dttm  TIMESTAMP    NULL           -- 마지막 성공 일시 — tx 대사는 이 값부터 대조 범위를 이어붙인다
);
```

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

- **약어 검수** — `bcm`·`vndr`·`vlt`·`dtct`·`pub` 등 새 축약어는 DAW-CORE DB 약어집과 대조 후 확정.
- **일시 타입** — 컴플라이언스 DB 와 같은 결정 항목([컴플라이언스 2장](../../컴플라이언스/설계/02-database.md) 미확정).
- **`bcm_tx_l` 의 보존** — 종결 건을 언제까지 두고 언제 정리할지 — 15장 원본 보관과 역할을 나눈 뒤 확정.
- **subStatus·networkStatus 보관 여부** — 매니저가 번역에 쓰는 벤더 내부 값을 `bcm_tx_l` 행에도 남길지 (이벤트에는 싣지 않는다).

## 약어집 (부록)

| 축약 | 원어 | | 축약 | 원어 |
|---|---|---|---|---|
| `bcm` | blockchain manager | | `vndr` | vendor |
| `acnt` | account | | `vlt` | vault |
| `addr` | address | | `dtct` | detect |
| `ast` | asset | | `pub` | publish |
| `dpst` | deposit | | `orig` | original |
| `cnfm` | confirm | | `reg` | register |
| `noti` | notification | | `evnt` | event |
| `rcv` | receive | | `swp` | sweep |
| `prcs` | process | | `scs` | success |
| `trgt` | target | | `alrt` | alert |
| `ext_tx` | external transaction | | `whk` | webhook |
