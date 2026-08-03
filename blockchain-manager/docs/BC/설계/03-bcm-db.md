---
title: 블록체인 매니저 — DB
status: To Do
---

블록체인 매니저 DB(`bcm_`)의 테이블 전체 — 계정·주소 매핑, 거래 운영 상태, 수신 인박스, sweep 대상, 주기 작업, boost 이력, finalize 원본, 발행 아웃박스.
회계 진실(고객 원장·귀속·잔액·출금 지시 상태)은 여기 없다 — 그것은 DAW-CORE DB(`daw_`)다.

## 명명 규약

코어 DB(`daw_`) 규약을 그대로 따른다 — BC·컴플라이언스·코어가 한 규약을 쓴다.

- **접두** `bcm_` · **접미** `_m`(마스터) · `_l`(내역/로그) · `_trgt`(작업 대상)
- **컬럼 축약** `_stcd`(상태코드) · `_dvcd`(구분코드) · `_yn`(VARCHAR(1) Y/N) · `_cnt`(횟수) · `_dttm`(일시) · `_dt`(일자) · `_id` · payload(JSONB)
- **일시는 VARCHAR(16)** — 코어와 동일(TIMESTAMP 안 씀) · **일자는 VARCHAR(8)** (YYYYMMDD)
- **id 길이** — 벤더가 주는 값(벤더 tx·vault·알림 id)은 잘리지 않게 VARCHAR(64) 유지. 코어 자체 id 는 16~36
- **자산 심볼** — 코어 규약대로 `tkn_smbl`(토큰심볼)
- **감사 4컬럼** — 모든 테이블에 `frst_reg_empno`(6)·`frst_reg_brcd`(4)·`last_chng_empno`(6)·`last_chng_brcd`(4). 자동 처리 행은 시스템 센티넬(예: `empno='SYSTEM'`), Admin 수동 개입(수동 boost·동결 해제 등)은 실제 직원/부점. 행 발생·변경 "시각"은 별도 도메인 `_dttm` 이 담당한다(코어와 동일 분리)

## 테이블 한눈에

| 테이블 | 무엇을 저장하나 | 쓰는 곳 |
|---|---|---|
| `bcm_acnt_m` | 계정 매핑 — ref ↔ vault | 계정 생성 · 모든 오퍼레이션의 계정 해석 |
| `bcm_addr_m` | 주소 매핑 — (계정, 자산) ↔ 입금 주소 | 주소 발급·조회 · 입금 감지의 주소→계정 대응 |
| `bcm_whk_l` | 수신 웹훅 알림 원본 — 인박스 | 수신부 적재 → 판단 워커 집기 · finalize 원본의 출처 |
| `bcm_tx_l` | 거래 운영 상태 — 감지·발행 추적 | 판단 워커 → 발행 예약 · 막힘 점검 · 제출 중복 차단 |
| `bcm_outbox_l` | 발행 대기 이벤트 — 상태 변경과 원자 기록 | 워커가 같은 트랜잭션에 적재 → relay 가 발송 |
| `bcm_swp_trgt` | sweep 대상 마킹 | 입금 확정 시 마킹 → 주기 배치가 제출 |
| `bcm_boost_l` | boost 이력 | 자동 boost — Admin 이 본다 |
| `bcm_job_m` | 주기 작업 상태 — heartbeat · 대사 커서 | tx 대사 대조 범위 · 밖에서 읽는 heartbeat |
| `bcm_raw_tx_l` | finalize 트랜잭션 원본 | 일 배치 보관 — 장기 보존 |

## ERD

```erd
entity: bcm_addr_m @1,1 :: 주소 매핑 — (계정, 자산)당 입금 주소 하나 | acnt_id PK,FK :: 계정 | tkn_smbl PK :: 토큰 심볼 | dpst_addr :: 발급된 입금 주소
entity: bcm_whk_l @2,1 :: 수신 웹훅 알림 원본 — 인박스 (처리 후 N일 정리) | noti_id PK :: 웹훅 알림 id (벤더 UUID) — 중복 수신 방어 | vndr_tx_id :: 벤더 tx id — 이 알림이 가리키는 거래 | prcs_yn :: 판단 처리 여부
entity: bcm_outbox_l @3,1 :: 발행 대기 이벤트 (Outbox) — 상태 변경과 원자 기록 | evnt_id PK :: 이벤트 id (UUID v7) · 컨슈머 dedup 키 | evt_typ_dvcd :: 이벤트유형 TXCK/TXCF/TXFL | evnt_stcd :: 발행상태 P/D/F/S
entity: bcm_acnt_m @1,2 :: 계정 매핑 — ref ↔ vault | acnt_id PK :: 매니저가 발급하는 계정 매핑 id | ref UK :: 백엔드 참조 키 (ACT-·SYS-) — 멱등 근거 | vndr_vlt_id :: 벤더 vault id (백엔드 비노출)
entity: bcm_tx_l @2,2 :: 거래 운영 상태 — 감지·발행 추적 | vndr_tx_id PK :: 벤더 tx id | ext_tx_id UK :: 출금 요청 키 — 재제출 중복 차단, 입금은 NULL | acnt_id FK :: 귀속 계정 — 이벤트 파티션 키 | last_pub_stcd :: 마지막으로 발행한 TxStatus
entity: bcm_boost_l @3,2 :: boost 이력 — Admin 조회용 | orig_tx_id PK :: 원 벤더 tx | try_seq PK :: 시도 순번 | new_tx_id :: 대체 벤더 tx
entity: bcm_swp_trgt @1,3 :: sweep 대상 마킹 — 작업 큐 | acnt_id PK,FK :: 고객 계정 | tkn_smbl PK :: 토큰 심볼 | swp_tx_id :: 제출한 sweep tx (NULL=미제출)
entity: bcm_raw_tx_l @2,3 :: finalize 원본 — 일 배치 장기 보관 | base_dt PK :: 적재 기준일 = 파티션 키 | vndr_tx_id PK :: 벤더 tx id | payload_hash :: 원문 SHA-256 — 무결성
entity: bcm_job_m @3,3 :: 주기 작업 상태 — heartbeat · 대사 커서 | job_nm PK :: 작업명 | last_scs_dttm :: 마지막 성공 — tx 대사 대조 범위 이어붙임
rel: bcm_acnt_m | bcm_addr_m | 계정당 주소 | one-many
rel: bcm_acnt_m | bcm_tx_l | 계정 귀속 | one-many
rel: bcm_acnt_m | bcm_swp_trgt | sweep 대상 | one-many
rel: bcm_whk_l | bcm_tx_l | 워커가 옮김 | one-many | dashed
rel: bcm_tx_l | bcm_outbox_l | 같은 트랜잭션 발행 예약 | one-many
rel: bcm_tx_l | bcm_boost_l | boost 시도 | one-many
rel: bcm_tx_l | bcm_raw_tx_l | 확정 원본 | one-many | dashed
```

실선 = FK 로 이어지는 관계, 점선 = 값으로 잇는 논리 관계(payload 이동·원본 보관 — DB 제약으로 묶지 않는다, 수명이 다르다). 배지 PK·UK·FK. `bcm_job_m` 은 다른 테이블과 관계가 없는 독립 작업 상태 테이블이다.

## 시나리오로 보는 테이블 흐름

한 건이 어느 테이블을 언제 건드리는지 — 단계를 넘겨 보라. 초록 행 = 그 단계에 새로 들어온 행, 노랑 칸 = 바뀐 값, 취소선 = 삭제. 상단 테두리가 켜진 것이 그 단계에 건드려지는 것이고, **청록 = DB 테이블 · 노랑 = 메시지 큐**다.

### 입금

```anim
db
table: bcm_whk_l | noti_id | vndr_tx_id | prcs_yn
table: bcm_tx_l | vndr_tx_id | last_pub_stcd | cnfm_cnt
table: bcm_outbox_l | evnt_id | evt_typ_dvcd | evnt_stcd
queue: deposit-events | 이벤트 | txId
table: bcm_swp_trgt | acnt_id | tkn_smbl | swp_tx_id
step: 웹훅 도착 (CONFIRMING) | 수신부가 알림 원본만 적재하고 200 을 돌려준다 — 판단은 아직
ins: bcm_whk_l | n-8f3a | tx-91c | N
step: 워커 — 한 트랜잭션 | 판단 워커가 알림을 집어 tx 행 생성 + outbox 에 감지 이벤트 적재(P) + 알림 처리 완료 — 한 커밋
ins: bcm_tx_l | tx-91c | CONFIRMING | 1
ins: bcm_outbox_l | ev-01 | TXCK | P
upd: bcm_whk_l | 1 | prcs_yn=Y
step: relay 발행 — 감지 | relay 가 미발송(P)을 큐로 보내고 S 표시 — 컨슈머는 evnt_id 로 중복을 접는다
ins: deposit-events | 입금 감지 | tx-91c
upd: bcm_outbox_l | 1 | evnt_stcd=S
step: 컨펌 누적 | 다음 알림마다 tx 행의 컨펌 수만 오른다 — 전이가 아니라 outbox 적재 없음 (기록만)
ins: bcm_whk_l | n-b2e | tx-91c | Y
upd: bcm_tx_l | 1 | cnfm_cnt=8
step: COMPLETED — 한 트랜잭션 | 임계 도달 — tx 행을 확정으로 갱신하고 outbox 에 확정 이벤트 적재(P)
ins: bcm_whk_l | n-c7d | tx-91c | Y
upd: bcm_tx_l | 1 | last_pub_stcd=COMPLETED | cnfm_cnt=12
ins: bcm_outbox_l | ev-02 | TXCF | P
step: relay 발행 — 확정 | 확정 이벤트가 큐로 나간다
ins: deposit-events | 입금 확정 | tx-91c
upd: bcm_outbox_l | 2 | evnt_stcd=S
step: sweep 대상 마킹 | 확정을 잡으면 그 (계정, 자산)을 sweep 대상으로 마킹한다 — swp_tx_id 는 비어 있음(미제출)
ins: bcm_swp_trgt | ACT-000123 | USDC | 
step: 주기 배치 — 제출 | 배치가 미제출 대상의 잔액을 조회해 sweep 을 제출하고 진행 중 표시를 남긴다
upd: bcm_swp_trgt | 1 | swp_tx_id=tx-s01
step: sweep 확정 · 대상 정리 | 다음 배치가 vault 가 비었음을 확인하면 대상 행을 지운다 (탈락이면 잔액이 남아 재sweep)
del: bcm_swp_trgt | 1
```

위 입금 그림은 outbox·relay 단계까지 그대로 그렸다. 아래 출금·boost·대사 그림은 발행을 효과만 축약한다 — 실제로는 같은 outbox 경로(워커 한 트랜잭션 → relay 발행)를 지난다(크래시 세이프 상세는 [감지 상세](99-detection-detail.md)). 또 `bcm_whk_l` 은 처리 후 N일 뒤 정리되고 확정 원본은 `bcm_raw_tx_l` 로 옮겨지지만, 입금 그림은 감지~sweep 경로만 보여주려고 그 단계는 생략했다.

### 출금

이벤트에는 벤더 tx id(`txId`)가 늘 실리고, 출금은 여기에 `externalTxId`(백엔드 요청 키)가 더해져 상태 전이 내내 그대로 따라간다 — DAW-CORE 가 자기 출금 지시와 대응한다. (입금은 외부 요청 키가 없어 `txId` 만.)

```anim
db
table: bcm_tx_l | vndr_tx_id | ext_tx_id | last_pub_stcd
queue: withdrawal-events | 이벤트 | txId | externalTxId
step: 제출 접수 | DAW-CORE 가 externalTxId 로 제출 — 매니저가 기록을 등록하고 SUBMITTED 를 발행한다
ins: bcm_tx_l | tx-w1 | wd-42 | SUBMITTED
ins: withdrawal-events | SUBMITTED | tx-w1 | wd-42
step: 전파 — CONFIRMING | 체인에 올라 컨펌이 쌓인다
upd: bcm_tx_l | 1 | last_pub_stcd=CONFIRMING
ins: withdrawal-events | CONFIRMING | tx-w1 | wd-42
step: 확정 — COMPLETED | 임계 도달 — 확정을 발행한다. externalTxId 로 백엔드가 출금 건을 닫는다
upd: bcm_tx_l | 1 | last_pub_stcd=COMPLETED
ins: withdrawal-events | COMPLETED | tx-w1 | wd-42
```

### 막힘 → 자동 boost

막힌 출금(미채굴)은 fee 를 올린 대체 거래로 재전송한다(RBF). 대체 행이 `orig_tx_id` 로 원 tx 를 가리켜, 백엔드에는 원 tx 로 접어 발행한다.

```anim
db
table: bcm_tx_l | vndr_tx_id | orig_tx_id | last_pub_stcd
table: bcm_boost_l | orig_tx_id | try_seq | new_tx_id
queue: withdrawal-events | 이벤트 | txId | externalTxId
step: 출금 SUBMITTED | 출금 tx 가 전파됐지만 아직 미채굴(mempool)이다 — 수수료가 낮으면 여기서 막힌다
ins: bcm_tx_l | tx-w1 |  | SUBMITTED
step: 막힘 감지 | 막힘 점검이 오래 미채굴(SUBMITTED)인 tx-w1 을 골라낸다 — boost 트리거
step: boost 제출 | fee 올린 대체 거래 tx-w2 를 제출(RBF · 미채굴이라 대체 가능) — 새 행이 원 tx 를 가리키고 이력을 남긴다
ins: bcm_tx_l | tx-w2 | tx-w1 | SUBMITTED
ins: bcm_boost_l | tx-w1 | 1 | tx-w2
step: 확정 — 원 tx 로 접어 발행 | 대체 거래가 채굴·확정 — 백엔드에는 원 tx(tx-w1) 기준으로 발행한다 (백엔드는 boost 를 모른다)
upd: bcm_tx_l | 2 | last_pub_stcd=COMPLETED
ins: withdrawal-events | 확정 | tx-w1 | wd-42
```

### 웹훅 유실 → tx 대사 복구

확정 웹훅을 놓쳐 tx 가 CONFIRMING 에 멈춰도, 10분 주기 tx 대사가 벤더 목록의 **종결된 건**과 대조해 복구한다(진행 중은 웹훅 몫). `bcm_job_m` 이 대조 범위(마지막 성공 시각)를 이어붙인다.

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

모든 테이블은 코어 규약의 감사 4컬럼(`frst_reg_empno`·`frst_reg_brcd`·`last_chng_empno`·`last_chng_brcd`)을 끝에 둔다 — 아래 스키마에서는 반복을 줄여 **감사 4컬럼**으로 줄여 적고, 자동 처리 행은 시스템 센티넬로 채운다.

### bcm_acnt_m — 계정 매핑

ref 당 vault 하나. `ref` UNIQUE 가 계정 생성 멱등의 최종 방어다 — 경합해도 이긴 값을 반환한다.

```sql
CREATE TABLE bcm_acnt_m (
  acnt_id       VARCHAR(64)  PRIMARY KEY,     -- 매니저가 발급하는 계정 매핑 id — 백엔드가 이후 모든 호출에 쓴다
  ref           VARCHAR(64)  NOT NULL UNIQUE, -- 백엔드 참조 키 (ACT-·SYS-) — 멱등의 물리 근거 · 접두는 표기 관례
  vndr_vlt_id   VARCHAR(64)  NOT NULL,        -- 벤더 vault id — 백엔드에 노출하지 않는다
  reg_dttm      VARCHAR(16)  NOT NULL,        -- 생성 일시
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL
);
```

`ref` 접두(`ACT-`·`SYS-`)는 DAW-CORE 계정 ID 의 표기 관례다 — 매니저는 불투명 유일 문자열로만 다루고, 접두를 파싱해 분기하지 않는다.

### bcm_addr_m — 주소 매핑

(계정, 자산)당 주소 하나 — UNIQUE 가 주소 발급 멱등의 물리 근거다.

```sql
CREATE TABLE bcm_addr_m (
  acnt_id     VARCHAR(64)  NOT NULL,       -- 계정
  tkn_smbl    VARCHAR(16)  NOT NULL,       -- 토큰 심볼
  dpst_addr   VARCHAR(128) NOT NULL,       -- 발급된 입금 주소
  reg_dttm    VARCHAR(16)  NOT NULL,       -- 발급 일시
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL,
  PRIMARY KEY (acnt_id, tkn_smbl)
);
CREATE INDEX idx_bcm_addr_lookup ON bcm_addr_m (dpst_addr, tkn_smbl);
```

| 컬럼 | 뜻 |
|---|---|
| `PRIMARY KEY (acnt_id, tkn_smbl)` | 자산당 주소 하나 — 같은 자산의 주소를 더 두려면 계정을 더 만든다 |
| `idx_bcm_addr_lookup` | 역방향 조회 — 입금 감지가 "이 주소가 어느 계정인가"를 여기서 푼다 |

### bcm_whk_l — 수신 알림 원본

수신부가 웹훅 알림을 받은 그대로 적재하는 **수신 인박스(transactional inbox)** — 수신은 서명 검증·이 적재·200 응답까지만 하고(요청당 3단계), 판단은 워커가 분리해서 미처리분을 집어 간다([흐름](02-bcm-flow.md) 감지). finalize 원본 일 배치가 여기서 payload 를 뽑는다.

큐가 아니라 테이블로 두는 근거 — ① `noti_id` PK 로 중복 알림을 물리적으로 걸러낸다 ② 원문 payload 를 보관해 재처리·`bcm_raw_tx_l` 원본의 출처가 된다 ③ 미처리 적체를 조회로 들여다본다 ④ `SELECT … FOR UPDATE SKIP LOCKED` 로 tx 단위 락 분배가 된다. 발행 쪽에는 이미 큐(3토픽)가 있다.

```sql
CREATE TABLE bcm_whk_l (
  noti_id       VARCHAR(64)   PRIMARY KEY,   -- 웹훅 알림 id — 벤더가 알림마다 붙이는 v2 UUID. unique 가 중복 수신 방어
  evnt_typ      VARCHAR(64)   NOT NULL,      -- 벤더 eventType (transaction.status.updated 등) — 벤더 값 그대로
  vndr_tx_id    VARCHAR(64)   NULL,          -- 벤더 tx id — 이 알림이 가리키는 거래
  payload       JSONB         NOT NULL,      -- 알림 원본 그대로 — 판단·원본 보관의 입력
  rcv_dttm      VARCHAR(16)   NOT NULL,      -- 수신 일시
  prcs_yn       VARCHAR(1)    NOT NULL,      -- 판단 처리 여부 (Y/N)
  prcs_dttm     VARCHAR(16)   NULL,          -- 처리 일시
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL
);
CREATE INDEX idx_bcm_whk_pick ON bcm_whk_l (prcs_yn, rcv_dttm);  -- 판단 워커의 집기 — 미처리 오래된 순
```

| 컬럼 | 뜻 |
|---|---|
| `noti_id` | insert 충돌 = 같은 알림의 중복 전달 — 무시하고 200 을 돌려준다. 중복 방어가 물리 제약으로 끝난다 |
| `payload` | 검증·파싱 전의 원본 — 판단 버그가 있어도 원본으로 재처리할 수 있고, finalize 원본 보관이 그 tx 의 마지막 COMPLETED 알림의 이 값을 옮겨 간다. **주의**: JSONB 는 저장 시 정규화(키 재정렬·공백)되므로 보관되는 건 **의미 수준 원본**이다 — 바이트 수준(서명 재검증·원문 해시)이 필요한 용도는 수신 시점에 처리해야 한다 (2026-08 PoC 실측) |
| 보존 | 처리 후 N일(운영 설정값) 뒤 정리 — 장기 보존은 `bcm_raw_tx_l` 몫 |

### bcm_tx_l — 거래 운영 상태

판단 워커가 알림에서 만들어 추적하는 행 — 상태 변화를 가려 이벤트를 발행하고, 막힘 점검이 오래 미확정인 건(미채굴 SUBMITTED · 확정 지연 CONFIRMING)을 여기서 골라낸다.

```sql
CREATE TABLE bcm_tx_l (
  vndr_tx_id      VARCHAR(64)  PRIMARY KEY,   -- 벤더 tx id
  orig_tx_id      VARCHAR(64)  NULL,          -- boost 대체 건이면 원 tx — 백엔드에는 원 tx 로 접어 흘린다
  ext_tx_id       VARCHAR(128) NULL UNIQUE,   -- 제출 건의 백엔드 요청 키 — 재제출 중복 차단, 입금 감지 건은 NULL
  acnt_id         VARCHAR(64)  NOT NULL,      -- 귀속 계정 — 이벤트 파티션 키
  tkn_smbl        VARCHAR(16)  NOT NULL,      -- 토큰 심볼
  last_pub_stcd   VARCHAR(16)  NOT NULL,      -- 마지막으로 발행한 TxStatus — 이 값과 다를 때만 새 이벤트를 낸다
  cnfm_cnt        INT          NOT NULL,      -- 마지막으로 본 confirmation 수 — 큰 값으로만 갱신(감소 금지)
                                              -- 늦게 온 알림은 낮은 값을 담고 있어, 그대로 쓰면 기록이 역행한다
  stall_alrt_dttm VARCHAR(16)  NULL,          -- 막힘 경보 올린 일시 — 있으면 다음 주기 건너뜀 · 해소 전이 시 NULL
  frst_dtct_dttm  VARCHAR(16)  NOT NULL,      -- 처음 감지한 일시
  last_chng_dttm  VARCHAR(16)  NOT NULL,      -- 마지막 갱신 일시 — 막힘 점검의 기준
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL
);
```

| 컬럼 | 뜻 |
|---|---|
| `orig_tx_id` | boost 로 벤더 거래가 대체되면(새 txId) 새 행이 원 tx 를 가리킨다 — 이벤트는 원 tx 기준으로 나가 백엔드는 대체를 모른다 |
| `ext_tx_id` | UNIQUE 가 재제출 중복 차단의 물리 근거. 완료 이벤트에 그대로 실어 되돌려준다. boost 대체 행은 이 값을 갖지 않는다(원 행만) |
| `last_pub_stcd` | 새 알림의 상태와 이 값을 [허용 전이 표](02-bcm-flow.md)에 대조해 발행 여부를 가린다. 발행은 `bcm_outbox_l` 에 같은 트랜잭션으로 적재한다 |
| `cnfm_cnt`·`last_chng_dttm` | **줄지 않는다** — 큰 값(늦은 시각)으로만 갱신한다. 막힘 점검의 입력이다 |

### bcm_outbox_l — 발행 아웃박스

워커가 상태를 바꾸는 **같은 트랜잭션**에 발행할 이벤트를 여기 적재한다(상태 갱신 + 발행 예약 = 한 커밋). 별도 relay 가 미발송(`P`) 행을 오래된 순으로 집어 큐로 보내고 `S` 로 표시한다. 컨슈머는 `evnt_id` 로 중복을 접는다(코어 ADR-002 Outbox 와 같은 패턴).

```sql
CREATE TABLE bcm_outbox_l (
  evnt_id         VARCHAR(36)   PRIMARY KEY,  -- 이벤트ID (time-ordered UUID v7) · 컨슈머 dedup 키
  evnt_dt         VARCHAR(8)    NOT NULL,     -- 이벤트일자 — 조회·파티셔닝
  vndr_tx_id      VARCHAR(64)   NOT NULL,     -- 집합체ID(코어 agg_id 대응) — 벤더 tx id
  agg_typ_dvcd    VARCHAR(2)    NOT NULL,     -- 집합체유형 TX:거래 / DL:델타
  evt_typ_dvcd    VARCHAR(4)    NOT NULL,     -- 이벤트유형 — 코어 정합(TXCK/TXCF/TXFL)
  topic           VARCHAR(32)   NOT NULL,     -- 발행 큐: deposit / withdrawal / internal-events
  payload         JSONB         NOT NULL,     -- 이벤트 본문
  evnt_stcd       VARCHAR(1)    NOT NULL,     -- 발행상태 P:PENDING / D:DISPATCHED / F:FAILED / S:SUCCESS
  rtry_cnt        INT           NOT NULL,     -- 재시도횟수
  max_rtry_cnt    INT           NOT NULL,     -- 최대재시도횟수
  orgn_id         VARCHAR(36)   NULL,         -- 원본이벤트ID — 재발행·파생 추적
  trace_id        VARCHAR(64)   NULL,         -- 분산추적 — BC→코어 상관관계
  pub_dttm        VARCHAR(16)   NULL,         -- 최초 DISPATCHED 시각
  last_rtry_dttm  VARCHAR(16)   NULL,         -- 최종재시도일시
  err_msg         VARCHAR(1000) NULL,         -- 오류메시지 (마지막 실패 요약)
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL
);
CREATE INDEX idx_bcm_outbox_send ON bcm_outbox_l (evnt_stcd, evnt_id);  -- 미발행(P) 오래된 순 = 시간정렬 UUID v7
```

| 컬럼 | 뜻 |
|---|---|
| `evnt_id` | time-ordered UUID v7 — PK 이자 컨슈머 dedup 키. relay 가 같은 행을 두 번 보내도 컨슈머가 이 값으로 접는다. 시간정렬이라 별도 생성시각 없이 발송 순서로 쓴다 |
| `evt_typ_dvcd` | 코어 이벤트 어휘와 통일 — TXCK(Checking)·TXCF(Confirmed)·TXFL(Failed). BC→코어 계약이 한 어휘로 흐른다 |
| `evnt_stcd` | 워커 적재 시 `P`, relay 발송 성공 시 `S`, 실패 누적 시 `F`. relay 는 `P` 를 `evnt_id` 순으로 집는다 |

### bcm_swp_trgt — sweep 대상

입금 확정 관찰이 마킹하고, 주기 배치가 모아서 제출한다. PK 가 (계정, 자산)이라 입금이 여러 번 와도 행 하나 — 전액 sweep 이라 중복 마킹이 자연히 합쳐진다.

```sql
CREATE TABLE bcm_swp_trgt (
  acnt_id       VARCHAR(64)  NOT NULL,       -- 고객 계정
  tkn_smbl      VARCHAR(16)  NOT NULL,       -- 토큰 심볼
  reg_dttm      VARCHAR(16)  NOT NULL,       -- 처음 마킹된 일시
  swp_tx_id     VARCHAR(64)  NULL,           -- 제출한 sweep 벤더 tx — NULL=미제출(배치 대상) · 값 있으면 진행 중(재제출 안 함)
  try_cnt       INT          NOT NULL,       -- 제출 시도 횟수 — 반복 실패 경보 기준
  last_try_dttm VARCHAR(16)  NULL,           -- 마지막 시도 일시
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL,
  PRIMARY KEY (acnt_id, tkn_smbl)
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
  boost_dttm     VARCHAR(16) NOT NULL,      -- 실행 일시
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL,
  PRIMARY KEY (orig_tx_id, try_seq)
);
```

### bcm_job_m — 주기 작업 상태

주기 작업(막힘 점검 · sweep 배치 · tx 대사 · 수수료 관측)별 한 행. 밖의 모니터링이 읽기 전용 계정으로 읽는 heartbeat 와, tx 대사의 대조 범위 이어붙임에 쓴다.

```sql
CREATE TABLE bcm_job_m (
  job_nm         VARCHAR(64)  PRIMARY KEY,   -- 작업명
  last_run_dttm  VARCHAR(16)  NOT NULL,      -- 마지막 실행 일시 — heartbeat
  last_scs_dttm  VARCHAR(16)  NULL,          -- 마지막 성공 일시 — tx 대사는 이 값부터 대조 범위를 이어붙인다
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL
);
```

### bcm_raw_tx_l — finalize 트랜잭션 원본

finalize 된 tx 의 벤더 원문을 일 배치로 장기 보관한다. 원본은 `bcm_whk_l` 에서 그 tx 의 마지막 COMPLETED 알림 payload 를 옮긴다 — 벤더 재조회 없음.

```sql
CREATE TABLE bcm_raw_tx_l (
  base_dt        VARCHAR(8)   NOT NULL,   -- 적재 기준일 = 파티션 키 (YYYYMMDD)
  vndr_tx_id     VARCHAR(64)  NOT NULL,   -- 벤더 tx id
  ext_tx_id      VARCHAR(128) NULL,       -- 출금 건 식별자 — 입금은 NULL
  tx_hash        VARCHAR(128) NULL,       -- 온체인 거래 해시
  addr           VARCHAR(128) NOT NULL,   -- 지갑(주소) 기준 조회 키 — 입금은 수취 주소, 출금은 출발 주소
  tkn_smbl       VARCHAR(16)  NOT NULL,   -- 토큰 심볼
  final_stcd     VARCHAR(16)  NOT NULL,   -- 도달한 최종 상태
  payload        TEXT         NOT NULL,   -- 벤더 응답 원문 — 받은 바이트 그대로, 가공 금지
  payload_hash   CHAR(64)     NOT NULL,   -- 원문 바이트의 SHA-256 — 무결성 증명. 반드시 수신 시점의 와이어 바이트로 계산
                                          -- (JSONB 에서 꺼낸 값은 키 재정렬·공백 정규화로 원문 바이트가 아니다 — PoC 실측)
  rcv_dttm       VARCHAR(16)  NOT NULL,   -- 원문을 받은 일시
  -- 감사 4컬럼
  frst_reg_empno  VARCHAR(6)  NOT NULL,
  frst_reg_brcd   VARCHAR(4)  NOT NULL,
  last_chng_empno VARCHAR(6)  NOT NULL,
  last_chng_brcd  VARCHAR(4)  NOT NULL,
  PRIMARY KEY (base_dt, vndr_tx_id)
) PARTITION BY RANGE (base_dt);           -- 월 단위 파티션
CREATE INDEX idx_bcm_raw_tx_hash ON bcm_raw_tx_l (tx_hash);        -- 분쟁·역추적 — 이 온체인 tx 의 원본
CREATE INDEX idx_bcm_raw_tx_addr ON bcm_raw_tx_l (addr, base_dt);  -- 지갑(주소) 기준 기간 조회 — 선두가 주소라 균등 분산
```

`payload` 는 바이트 그대로 보존해야 해 JSONB 가 아니라 TEXT 다(무결성 해시가 원문 바이트 기준). 보존 연한·파티션 주기·자체 RPC 로 체인 원문까지 보관할지는 미확정이다(아래 미확정 절).

## 미확정

- **약어 검수** — `bcm`·`vndr`·`vlt`·`noti`·`swp` 등 축약어는 DAW-CORE DB 약어집과 대조 후 확정.
- **감사 컬럼 센티넬** — 자동 처리 행의 `empno`·`brcd` 시스템 센티넬 값(예: `'SYSTEM'`·본점코드)을 코어 운영 규약과 맞춰 확정.
- **`bcm_tx_l`·`bcm_whk_l`·`bcm_outbox_l` 보존** — 종결·처리 완료·발송 완료 건을 언제까지 두고 언제 정리할지 — `bcm_raw_tx_l` 원본 보관과 역할을 나눈 뒤 확정.
- **subStatus·networkStatus 보관 여부** — 매니저가 번역에 쓰는 벤더 내부 값을 `bcm_tx_l` 행에도 남길지 (이벤트에는 싣지 않는다).
