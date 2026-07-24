---
title: 블록체인 매니저 — DB
status: To Do
---

블록체인 매니저 DB(`bcm_`)의 테이블 전체 — 계정·주소 매핑, 거래 운영 상태, 수신 버퍼, sweep 대상, 주기 작업, boost 이력, finalize 원본.
회계 진실(고객 원장·귀속·잔액·출금 지시 상태)은 여기 없다 — 그것은 DAW-CORE DB(`daw_`)다.

## 명명 규약

- **접두** `bcm_` · **접미** `_m`(마스터) · `_l`(내역/로그) · `_trgt`(작업 대상)
- **컬럼 축약** `_stcd`(상태코드) · `_yn`(boolean) · `_cnt`(횟수) · `_dttm`(일시) · `_dt`(일자) · `_id`
- **감사 컬럼 없음** — 이 DB 를 만지는 주체는 매니저뿐이다. 행 생성·변경 시각은 테이블마다 업무 의미가 있는 일시 컬럼이 담당한다.

## 테이블 한눈에

| 테이블 | 무엇을 저장하나 | 쓰는 곳 |
|---|---|---|
| `bcm_acnt_m` | 계정 매핑 — ref ↔ vault | 계정 생성 · 모든 오퍼레이션의 계정 해석 |
| `bcm_addr_m` | 주소 매핑 — (계정, 자산) ↔ 입금 주소 | 주소 발급·조회 · 입금 감지의 주소→계정 대응 |
| `bcm_noti_l` | 수신 웹훅 알림 원본 — 버퍼 | 수신부 적재 → 판단 워커 집기 · finalize 원본의 출처 |
| `bcm_tx_l` | 거래 운영 상태 — 감지·발행 추적 | 판단 워커 → 이벤트 publish · 막힘 점검 · 제출 중복 차단 |
| `bcm_swp_trgt` | sweep 대상 마킹 | 입금 확정 시 마킹 → 주기 배치가 제출 |
| `bcm_boost_l` | boost 이력 | 자동 boost — Admin 이 본다 |
| `bcm_job_m` | 주기 작업 상태 — heartbeat · 대사 커서 | tx 대사 대조 범위 · 밖에서 읽는 heartbeat |
| `bcm_raw_tx_l` | finalize 트랜잭션 원본 | 일 배치 보관 — 장기 보존 |

## ERD

```erd
entity: bcm_addr_m @1,1 :: 주소 매핑 — (계정, 자산)당 입금 주소 하나 | acnt_id PK,FK :: 계정 | ast_cd PK :: 자산 심볼 | dpst_addr :: 발급된 입금 주소
entity: bcm_noti_l @2,1 :: 수신 웹훅 알림 원본 — 버퍼 (처리 후 N일 정리) | noti_id PK :: 웹훅 알림 id (벤더 UUID) — 중복 수신 방어 | rsrc_id :: 대상 tx id | prcs_yn :: 판단 처리 여부
entity: bcm_acnt_m @1,2 :: 계정 매핑 — ref ↔ vault | acnt_id PK :: 매니저가 발급하는 계정 매핑 id | ref UK :: 백엔드 참조 키 (ACT-·SYS-) — 멱등 근거 | vndr_vlt_id :: 벤더 vault id (백엔드 비노출)
entity: bcm_tx_l @2,2 :: 거래 운영 상태 — 감지·발행 추적 | vndr_tx_id PK :: 벤더 tx id | ext_tx_id UK :: 출금 요청 키 — 재제출 중복 차단, 입금은 NULL | acnt_id FK :: 귀속 계정 — 이벤트 파티션 키 | last_pub_stcd :: 마지막으로 발행한 TxStatus
entity: bcm_boost_l @3,2 :: boost 이력 — Admin 조회용 | orig_tx_id PK :: 원 벤더 tx | try_seq PK :: 시도 순번 | new_tx_id :: 대체 벤더 tx
entity: bcm_swp_trgt @1,3 :: sweep 대상 마킹 — 작업 큐 | acnt_id PK,FK :: 고객 계정 | ast_cd PK :: 자산 | swp_tx_id :: 제출한 sweep tx (NULL=미제출)
entity: bcm_raw_tx_l @2,3 :: finalize 원본 — 일 배치 장기 보관 | base_dt PK :: 적재 기준일 = 파티션 키 | vendor_tx_id PK :: 벤더 tx id | payload_hash :: 원문 SHA-256 — 무결성
entity: bcm_job_m @3,3 :: 주기 작업 상태 — heartbeat · 대사 커서 | job_nm PK :: 작업명 | last_scs_dttm :: 마지막 성공 — tx 대사 대조 범위 이어붙임
rel: bcm_acnt_m | bcm_addr_m | 계정당 주소 | one-many
rel: bcm_acnt_m | bcm_tx_l | 계정 귀속 | one-many
rel: bcm_acnt_m | bcm_swp_trgt | sweep 대상 | one-many
rel: bcm_noti_l | bcm_tx_l | 워커가 옮김 | one-many | dashed
rel: bcm_tx_l | bcm_boost_l | boost 시도 | one-many
rel: bcm_tx_l | bcm_raw_tx_l | 확정 원본 | one-many | dashed
```

실선 = FK 로 이어지는 관계, 점선 = 값으로 잇는 논리 관계(payload 이동·원본 보관 — DB 제약으로 묶지 않는다, 수명이 다르다). 배지 PK·UK·FK. `bcm_job_m` 은 다른 테이블과 관계가 없는 독립 작업 상태 테이블이다.

## 시나리오로 보는 테이블 흐름

한 건이 어느 테이블을 언제 건드리는지 — 단계를 넘겨 보라. 초록 행 = 그 단계에 새로 들어온 행, 노랑 칸 = 바뀐 값, 취소선 = 삭제. 상단 테두리가 켜진 것이 그 단계에 건드려지는 것이고, **청록 = DB 테이블 · 노랑 = 메시지 큐**다.

### 입금

```anim
db
table: bcm_noti_l | noti_id | rsrc_id | prcs_yn
table: bcm_tx_l | vndr_tx_id | last_pub_stcd | cnfm_cnt
queue: deposit-events | 이벤트 | txId
table: bcm_swp_trgt | acnt_id | ast_cd | swp_tx_id
step: 웹훅 도착 (CONFIRMING) | 수신부가 알림 원본만 적재하고 200 을 돌려준다 — 판단은 아직
ins: bcm_noti_l | n-8f3a | tx-91c | N
step: 워커 집기 · 감지 발행 | 판단 워커가 알림을 집어 tx 행을 만들고, deposit-events 에 감지를 발행한다 · 알림은 처리 완료
ins: bcm_tx_l | tx-91c | CONFIRMING | 1
ins: deposit-events | 입금 감지 | tx-91c
upd: bcm_noti_l | 1 | prcs_yn=Y
step: 컨펌 누적 | 다음 알림마다 tx 행의 컨펌 수만 오른다 — 임계 전이라 발행 없음 (중간 전이는 기록만)
ins: bcm_noti_l | n-b2e | tx-91c | Y
upd: bcm_tx_l | 1 | cnfm_cnt=8
step: COMPLETED · 확정 발행 | 임계 도달 — tx 행을 확정으로 갱신하고 deposit-events 에 확정을 발행한다
ins: bcm_noti_l | n-c7d | tx-91c | Y
upd: bcm_tx_l | 1 | last_pub_stcd=COMPLETED | cnfm_cnt=12
ins: deposit-events | 입금 확정 | tx-91c
step: sweep 대상 마킹 | 확정을 잡으면 그 (계정, 자산)을 sweep 대상으로 마킹한다 — swp_tx_id 는 비어 있음(미제출)
ins: bcm_swp_trgt | ACT-000123 | USDC | 
step: 주기 배치 — 제출 | 배치가 미제출 대상의 잔액을 조회해 sweep 을 제출하고 진행 중 표시를 남긴다
upd: bcm_swp_trgt | 1 | swp_tx_id=tx-s01
step: sweep 확정 · 대상 정리 | 다음 배치가 vault 가 비었음을 확인하면 대상 행을 지운다 (탈락이면 잔액이 남아 재sweep)
del: bcm_swp_trgt | 1
```

`bcm_noti_l` 은 처리 후 N일 뒤 정리되고 확정 원본은 `bcm_raw_tx_l` 로 옮겨지지만, 이 그림은 감지~sweep 경로만 보여주려고 그 두 단계는 생략했다.

### 출금

`ext_tx_id`(백엔드 요청 키)가 상태 전이 내내 그대로 실려, DAW-CORE 가 자기 출금 지시와 대응한다.

```anim
db
table: bcm_tx_l | vndr_tx_id | ext_tx_id | last_pub_stcd
queue: withdrawal-events | 이벤트 | externalTxId
step: 제출 접수 | DAW-CORE 가 externalTxId 로 제출 — 매니저가 기록을 등록하고 SUBMITTED 를 발행한다
ins: bcm_tx_l | tx-w1 | wd-42 | SUBMITTED
ins: withdrawal-events | SUBMITTED | wd-42
step: 전파 — CONFIRMING | 체인에 올라 컨펌이 쌓인다
upd: bcm_tx_l | 1 | last_pub_stcd=CONFIRMING
ins: withdrawal-events | CONFIRMING | wd-42
step: 확정 — COMPLETED | 임계 도달 — 확정을 발행한다. externalTxId 로 백엔드가 출금 건을 닫는다
upd: bcm_tx_l | 1 | last_pub_stcd=COMPLETED
ins: withdrawal-events | COMPLETED | wd-42
```

### 막힘 → 자동 boost

막힌 출금은 fee 를 올린 대체 거래로 재전송한다. 대체 행이 `orig_tx_id` 로 원 tx 를 가리켜, 백엔드에는 원 tx 로 접어 발행한다.

```anim
db
table: bcm_tx_l | vndr_tx_id | orig_tx_id | last_pub_stcd
table: bcm_boost_l | orig_tx_id | try_seq | new_tx_id
queue: withdrawal-events | 이벤트 | externalTxId
step: 출금 CONFIRMING | 출금 tx 가 전파돼 컨펌 대기 중이다
ins: bcm_tx_l | tx-w1 |  | CONFIRMING
step: 막힘 감지 | 막힘 점검이 오래 CONFIRMING 인 tx-w1 을 골라낸다 — boost 트리거
step: boost 제출 | fee 올린 대체 거래 tx-w2 를 제출 — 새 행이 원 tx 를 가리키고 이력을 남긴다
ins: bcm_tx_l | tx-w2 | tx-w1 | CONFIRMING
ins: bcm_boost_l | tx-w1 | 1 | tx-w2
step: 확정 — 원 tx 로 접어 발행 | 대체 거래가 확정 — 백엔드에는 원 tx(tx-w1) 기준으로 발행한다 (백엔드는 boost 를 모른다)
upd: bcm_tx_l | 2 | last_pub_stcd=COMPLETED
ins: withdrawal-events | 확정 | wd-42
```

### 웹훅 유실 → tx 대사 복구

확정 웹훅을 놓쳐 tx 가 CONFIRMING 에 멈춰도, 10분 주기 tx 대사가 벤더 목록과 대조해 복구한다. `bcm_job_m` 이 대조 범위(마지막 성공 시각)를 이어붙인다.

```anim
db
table: bcm_tx_l | vndr_tx_id | last_pub_stcd
table: bcm_job_m | job_nm | last_scs_dttm
queue: deposit-events | 이벤트 | txId
step: 확정 웹훅 유실 | 확정 알림이 오지 않아 tx 가 CONFIRMING 에 멈춰 있다
ins: bcm_tx_l | tx-91c | CONFIRMING
ins: bcm_job_m | tx-recon | 11:50
step: tx 대사 실행 | 대사가 last_scs_dttm 이후 생성분을 벤더 목록으로 대조 — tx 가 실제 COMPLETED 임을 발견
step: 복구 — 확정 발행 | 놓친 확정을 deposit-events 에 발행하고 tx 행을 갱신한다
upd: bcm_tx_l | 1 | last_pub_stcd=COMPLETED
ins: deposit-events | 입금 확정 | tx-91c
step: 커서 전진 | 대사가 last_scs_dttm 을 이번 시각으로 전진 — 다음 대사는 여기서 이어붙인다
upd: bcm_job_m | 1 | last_scs_dttm=12:00
```

## 테이블 상세

### bcm_acnt_m — 계정 매핑

ref 당 vault 하나. `ref` UNIQUE 가 계정 생성 멱등의 최종 방어다 — 경합해도 이긴 값을 반환한다.

```sql
CREATE TABLE bcm_acnt_m (
  acnt_id       VARCHAR(64)  PRIMARY KEY,     -- 매니저가 발급하는 계정 매핑 id — 백엔드가 이후 모든 호출에 쓴다
  ref           VARCHAR(64)  NOT NULL UNIQUE, -- 백엔드 참조 키 (ACT-·SYS-) — 멱등의 물리 근거 · 접두는 표기 관례
  vndr_vlt_id   VARCHAR(64)  NOT NULL,        -- 벤더 vault id — 백엔드에 노출하지 않는다
  reg_dttm      TIMESTAMP    NOT NULL         -- 생성 일시
);
```

`ref` 접두(`ACT-`·`SYS-`)는 DAW-CORE 계정 ID 의 표기 관례다 — 매니저는 불투명 유일 문자열로만 다루고, 접두를 파싱해 분기하지 않는다.

### bcm_addr_m — 주소 매핑

(계정, 자산)당 주소 하나 — UNIQUE 가 주소 발급 멱등의 물리 근거다.

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
| `PRIMARY KEY (acnt_id, ast_cd)` | 자산당 주소 하나 — 같은 자산의 주소를 더 두려면 계정을 더 만든다 |
| `idx_bcm_addr_lookup` | 역방향 조회 — 입금 감지가 "이 주소가 어느 계정인가"를 여기서 푼다 |

### bcm_noti_l — 수신 알림 원본

수신부가 웹훅 알림을 받은 그대로 적재하는 버퍼 — 수신은 서명 검증·이 적재·200 응답까지만 하고(요청당 3步), 판단은 워커가 분리해서 미처리분을 집어 간다([흐름](02-bcm-flow.md) 감지). finalize 원본 일 배치가 여기서 payload 를 뽑는다.

```sql
CREATE TABLE bcm_noti_l (
  noti_id       VARCHAR(64)   PRIMARY KEY,   -- 웹훅 알림 id — 벤더가 알림마다 붙이는 v2 UUID. unique 가 중복 수신 방어
  evnt_tp       VARCHAR(64)   NOT NULL,      -- eventType (transaction.status.updated 등)
  rsrc_id       VARCHAR(64)   NULL,          -- resourceId — 대상 tx id
  payload       JSON          NOT NULL,      -- 알림 원본 그대로 — 판단·원본 보관의 입력
  rcv_dttm      TIMESTAMP     NOT NULL,      -- 수신 일시
  prcs_yn       CHAR(1)       NOT NULL,      -- 판단 처리 여부
  prcs_dttm     TIMESTAMP     NULL           -- 처리 일시
);
CREATE INDEX idx_bcm_noti_pick ON bcm_noti_l (prcs_yn, rcv_dttm);  -- 판단 워커의 집기 — 미처리 오래된 순
```

| 컬럼 | 뜻 |
|---|---|
| `noti_id` | insert 충돌 = 같은 알림의 중복 전달 — 무시하고 200 을 돌려준다. 중복 방어가 물리 제약으로 끝난다 |
| `payload` | 검증·파싱 전의 원본 — 판단 버그가 있어도 원본으로 재처리할 수 있고, finalize 원본 보관이 그 tx 의 마지막 COMPLETED 알림의 이 값을 옮겨 간다 |
| 보존 | 처리 후 N일(운영 설정값) 뒤 정리 — 장기 보존은 `bcm_raw_tx_l` 몫 |

### bcm_tx_l — 거래 운영 상태

판단 워커가 알림에서 만들어 추적하는 행 — 상태 변화를 가려 이벤트를 발행하고, 막힘 점검이 오래 CONFIRMING 인 건을 여기서 골라낸다.

```sql
CREATE TABLE bcm_tx_l (
  vndr_tx_id      VARCHAR(64)  PRIMARY KEY,   -- 벤더 tx id
  orig_tx_id      VARCHAR(64)  NULL,          -- boost 대체 건이면 원 tx — 백엔드에는 원 tx 로 접어 흘린다
  ext_tx_id       VARCHAR(128) NULL UNIQUE,   -- 제출 건의 백엔드 요청 키 — 재제출 중복 차단, 입금 감지 건은 NULL
  acnt_id         VARCHAR(64)  NOT NULL,      -- 귀속 계정 — 이벤트 파티션 키
  ast_cd          VARCHAR(32)  NOT NULL,
  last_pub_stcd   VARCHAR(16)  NOT NULL,      -- 마지막으로 발행한 TxStatus — 이 값과 다를 때만 새 이벤트를 낸다
  cnfm_cnt        INT          NOT NULL,      -- 마지막으로 본 confirmation 수
  stall_alrt_dttm TIMESTAMP    NULL,          -- 막힘 경보 올린 일시 — 있으면 다음 주기 건너뜀 · 해소 전이 시 NULL
  frst_dtct_dttm  TIMESTAMP    NOT NULL,      -- 처음 감지한 일시
  last_chng_dttm  TIMESTAMP    NOT NULL       -- 마지막 갱신 일시 — 막힘 점검의 기준
);
```

| 컬럼 | 뜻 |
|---|---|
| `orig_tx_id` | boost 로 벤더 거래가 대체되면(새 txId) 새 행이 원 tx 를 가리킨다 — 이벤트는 원 tx 기준으로 나가 백엔드는 대체를 모른다 |
| `ext_tx_id` | UNIQUE 가 재제출 중복 차단의 물리 근거. 완료 이벤트에 그대로 실어 되돌려준다. boost 대체 행은 이 값을 갖지 않는다(원 행만) |
| `last_pub_stcd` | 큐는 at-least-once 라 최종 중복 제거는 소비 쪽 멱등이 맡는다. publish 성공 후에만 기록한다 — 기록이 먼저면 장애 때 이벤트가 영구 유실된다 |

### bcm_swp_trgt — sweep 대상

입금 확정 관찰이 마킹하고, 주기 배치가 모아서 제출한다. PK 가 (계정, 자산)이라 입금이 여러 번 와도 행 하나 — 전액 sweep 이라 중복 마킹이 자연히 합쳐진다.

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
| 행 생성·삭제 | 확정 관찰 → insert(있으면 무시) · 배치가 `swp_tx_id` NULL 대상의 잔액 조회 → 최소 이상이면 제출(`swp_tx_id` 기록) · 최소 미만이면 삭제 · sweep tx 종결(확정·탈락) 관찰 → `swp_tx_id` NULL 로(다음 배치가 잔액 재확인) |
| `swp_tx_id` | 진행 중 재제출 방지 + sweep 결과 추적 링크 |
| `try_cnt` | 반복 실패가 임계(운영 설정값)를 넘으면 경보 — externalTxId 멱등이라 재제출은 안전하다 |

### bcm_boost_l — boost 이력

자동 boost 의 시도 기록 — Admin 조회용.

```sql
CREATE TABLE bcm_boost_l (
  orig_tx_id     VARCHAR(64) NOT NULL,      -- 원 벤더 tx
  try_seq        INT         NOT NULL,      -- 시도 순번
  new_tx_id      VARCHAR(64) NOT NULL,      -- 대체 벤더 tx
  boost_dttm     TIMESTAMP   NOT NULL,      -- 실행 일시
  PRIMARY KEY (orig_tx_id, try_seq)
);
```

### bcm_job_m — 주기 작업 상태

주기 작업(막힘 점검 · sweep 배치 · tx 대사 · 수수료 관측)별 한 행. 밖의 모니터링이 읽기 전용 계정으로 읽는 heartbeat 와, tx 대사의 대조 범위 이어붙임에 쓴다.

```sql
CREATE TABLE bcm_job_m (
  job_nm         VARCHAR(64)  PRIMARY KEY,   -- 작업명
  last_run_dttm  TIMESTAMP    NOT NULL,      -- 마지막 실행 일시 — heartbeat
  last_scs_dttm  TIMESTAMP    NULL           -- 마지막 성공 일시 — tx 대사는 이 값부터 대조 범위를 이어붙인다
);
```

### bcm_raw_tx_l — finalize 트랜잭션 원본

finalize 된 tx 의 벤더 원문을 일 배치로 장기 보관한다. 원본은 `bcm_noti_l` 에서 그 tx 의 마지막 COMPLETED 알림 payload 를 옮긴다 — 벤더 재조회 없음.

```sql
CREATE TABLE bcm_raw_tx_l (
  base_dt        DATE         NOT NULL,   -- 적재 기준일 = 파티션 키
  vendor_tx_id   VARCHAR(64)  NOT NULL,   -- 벤더 트랜잭션 id
  ext_tx_id      VARCHAR(128) NULL,       -- 출금 건 식별자 — 입금은 NULL
  tx_hash        VARCHAR(128) NULL,       -- 온체인 거래 해시
  addr           VARCHAR(128) NOT NULL,   -- 지갑(주소) 기준 조회 키 — 입금은 수취 주소, 출금은 출발 주소
  ast_cd         VARCHAR(32)  NOT NULL,   -- 자산 심볼
  final_stcd     VARCHAR(16)  NOT NULL,   -- 도달한 최종 상태
  payload        TEXT         NOT NULL,   -- 벤더 응답 원문 — 받은 바이트 그대로, 가공 금지
  payload_hash   CHAR(64)     NOT NULL,   -- 원문 바이트의 SHA-256 — 무결성 증명
  rcv_dttm       TIMESTAMP    NOT NULL,   -- 원문을 받은 일시
  PRIMARY KEY (base_dt, vendor_tx_id)
) PARTITION BY RANGE (base_dt);           -- 월 단위 파티션
```

보존 연한·파티션 주기·자체 RPC 로 체인 원문까지 보관할지는 미확정이다(아래 미확정 절).

## 미확정

- **약어 검수** — `bcm`·`vndr`·`vlt`·`noti`·`swp` 등 축약어는 DAW-CORE DB 약어집과 대조 후 확정.
- **일시 타입** — 컴플라이언스 DB 와 같은 결정 항목.
- **`bcm_tx_l`·`bcm_noti_l` 보존** — 종결·처리 완료 건을 언제까지 두고 언제 정리할지 — `bcm_raw_tx_l` 원본 보관과 역할을 나눈 뒤 확정.
- **subStatus·networkStatus 보관 여부** — 매니저가 번역에 쓰는 벤더 내부 값을 `bcm_tx_l` 행에도 남길지 (이벤트에는 싣지 않는다).
