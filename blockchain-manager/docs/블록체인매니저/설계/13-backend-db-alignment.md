---
title: 13. 백엔드 DB 정합 — daw-core 스키마 점검
status: To Do
---

12장이 벤더·백엔드와 합의할 상태 계약을 모았다면, 이 장은 그 계약을 백엔드 DB(daw-core) 스키마가 실제로 받아낼 수 있는지 대조한다.
설계 문서가 백엔드에 요구하는 상태·잔액·멱등을 daw-core 테이블과 맞춰 보고, 어긋나는 곳과 아직 자리가 없는 곳을 적는다.

각 주제 하단에 그 주제가 가리키는 daw-core 테이블을 붙였다. 수량은 base unit 정수(`NUMERIC(78,0)`)이고 토큰 소수자릿수(`tkn_dcml`)를 행마다 스냅샷한다. **모든 테이블에 감사 컬럼 4종이 공통**이라 아래 표에서는 생략한다 — `frst_reg_empno`·`frst_reg_brcd`(최초 등록 직원·부점, 한 번만 기록), `last_chng_empno`·`last_chng_brcd`(최종 변경 직원·부점, 변경 시 갱신). 자동 거래의 직원번호는 `999999`.

## 상태코드 — 두 어휘를 잇는 매핑이 없다

[4장 공통 상태 다섯(TxStatus) 기준](04-detect-confirm.md#공통-상태-다섯-txstatus-기준)과 daw-core 거래 상태(`daw_tx_l.tx_stcd`)가 서로 다른 말을 쓴다. 둘을 잇는 전이표가 어느 문서에도 없어, 여기서 대응을 그려 본다 — 대부분 접히지만 REJECTED 에서 빈다.

| 매니저 TxStatus (4장) | 뜻 | daw-core `tx_stcd` | 대응 |
|---|---|---|---|
| SUBMITTED | 제출 | PENDING | 맞물림 |
| CONFIRMING | 확정 대기 | PENDING | 맞물림 (같은 PENDING 으로 접힘) |
| COMPLETED | 확정 | CONFIRMED | 맞물림 |
| FAILED | 실패 — 영구 | FAILED | 맞물림 |
| REJECTED | 거부 — 일시적(동결 해제 대기) | — | 짝 없음 |
| — | 트래블룰 검증 대기 | CHECKING | 코어 고유 — 매니저 이벤트에 없음 |
| — | 취소 | CANCELLED | 코어 고유 |

SUBMITTED·CONFIRMING 은 tx 레벨에선 모두 PENDING 으로 접힌다 — 컨펌 누적 상세는 `daw_onch_exec_l.cnfm_cnt` 가 따로 들고 있다.

정할 것 둘.

1. **REJECTED 의 짝** — 동결로 잠시 막혔다 재개될 거래를 daw-core 의 어느 상태로 둘지. 지금은 짝이 없다.
2. **CHECKING** — 트래블룰 검증 대기는 코어만 갖는 상태다. 순서 강제가 코어 몫이라 정상이다.

매니저 이벤트 다섯을 daw-core 상태로 옮기는 전이표를 12장 상태 계약과 함께 확정한다.

**관련 테이블 — `daw_tx_l` (거래)**

거래 상태머신. 온·오프램프·이체 유형을 관리한다. 잔액 근거는 원장분개, 온체인 대기는 델타원장에 있다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| tx_id | VARCHAR(32) | 거래ID (PK) |
| guid | VARCHAR(36) | 거래GUID (타 서비스 공통) |
| extn_ref | VARCHAR(64) | 외부연동참조 — 직접 거래를 매니저 externalTxId 와 잇는 키 |
| srvc_id | VARCHAR(11) | 요청 서비스·채널 ID (출처 추적) |
| ast_id | VARCHAR(16) | 자산ID (FK) |
| tkn_id | VARCHAR(16) | 토큰ID (FK) |
| tx_typ_dvcd | VARCHAR(2) | 거래유형구분코드 |
| tx_amt | NUMERIC(36,18) | 거래금액 |
| tx_stcd | VARCHAR(2) | 거래상태코드 |
| krw_stcd | VARCHAR(2) | 원화구간상태코드 (계정계 호출 결과) |
| cntp_typ_dvcd | VARCHAR(2) | 상대유형구분코드 |
| cntp_nm | VARCHAR(64) | 상대명·예금주명 (라벨) |
| cntp_blkc_ntwk_dvcd | VARCHAR(2) | 상대 네트워크구분코드 (온체인 상대일 때) |
| cntp_tx_ref | VARCHAR(128) | 상대 거래참조 (상대 tx 해시·관리번호) |
| orig_tx_id · orig_tx_dt | VARCHAR(32) · VARCHAR(8) | 원거래ID·일자 (정정·반환의 원거래) |
| fx_xrt · fx_xrt_dt · fx_xrt_seq | NUMERIC(18,8) · VARCHAR(8) · INT | 적용환율·고시일자·고시회차 |
| krw_amt | NUMERIC(18,2) | 원화환산액 |
| blkc_ntwk_dvcd · tkn_smbl | VARCHAR(2) · VARCHAR(16) | 네트워크·토큰심볼 (tkn_id 역정규화, 대사·조회) |
| occr_dttm · cnfm_dttm | VARCHAR(16) | 발생일시·확정일시 |

- **tx_stcd** — PENDING(접수) → CONFIRMED(확정) · FAILED(실패) · CANCELLED(취소) · CHECKING(트래블룰 검증 대기). 매핑은 위 매핑 표 참조.
- **cntp_typ_dvcd** — 01 내부지갑 · 02 외부지갑 · 03 은행계좌 · 04 거래소 · 05 시스템지갑.
- 온체인 실행은 이 테이블에서 바로 나가지 않고 네팅배치 → 온체인실행 경로를 탄다.

## 가스 — 문서마다 가스 대는 방식을 다르게 잡았다

온체인 거래에는 가스(수수료로 쓰는 ETH)가 든다. 이걸 대는 방식이 두 가지인데, 우리 문서들이 서로 다른 쪽을 전제하고 있다.

- **충전** — 가스 계정에 ETH 를 미리 넣어 두고 잔액이 떨어지면 다시 채운다. 우리 쪽에 ETH 를 늘 들고 있어야 한다.
- **대납** — relay 가 대신 내주고 우리는 나중에 월 청구서로 정산한다. 우리 쪽 ETH 보유는 0.

문서별 전제는 이렇게 갈린다.

- 설계 요구(가스비 관리)는 **충전**을 전제한다. 다만 이 항목은 "식별" 단계라 확정 설계가 아니라 식별된 요구 수준이다. 원문은 아래 상자와 같다.
- daw-core 에 가스 전용 계정 역할이 있다 — `daw_sys_acnt_m.sys_acnt_role_dvcd` 의 **FEE_MGT(가스비)**. 가스 계정을 따로 두는 건 보통 가스를 보유·충전하는 모델을 함의한다(원문에 "충전" 이라 쓰여 있진 않다).
- 반면 가스 대납 5장은 **대납 단일(Universal Gasless)** 로 결정했다 — 가스 계정도, ETH 보유도 없앤다.

설계.txt 가스비 관리 항목 원문:

```
가스비 관리 (식별)
출금용 가스 잔액 모니터링과 충전 운영을 정의한다.
· 가스비의 수수료 정책 반영 여부 결정
· 가스 계정 잔액 임계 알림
```

설계 요구(식별 단계)와 FEE_MGT 계정은 충전 쪽인데 가스 대납 문서는 대납으로 갔다. 대납이 최종이면 `FEE_MGT` 계정과 "임계 알림" 요구는 충전 방식의 잔재가 된다.

정할 것과 물어볼 것.

1. **어느 방식이 기준인지 정한다** — 충전이냐 대납 단일이냐. 대납이 최종이면 충전 전제의 요구·계정을 정리한다.
2. **FEE_MGT 계정의 역할을 코어 팀에 확인한다** — 이 계정이 지금 무엇을 담는 계정인지(가스용 ETH 를 들고 채우는 충전 계정인지, 아니면 다른 용도인지), 대납 단일 아래에서 재정의할지·유지할지·뺄지.

관련: 가스 대납 [5장 결정](../가스대납/05-decision.md) · [9장 EIP-7702](../가스대납/09-eip7702.md)

**관련 테이블 — `daw_sys_acnt_m` (시스템계정)**

회사 운영 계좌. 고객 계좌 체계와 독립이고, 자산 테이블이 `sys_acnt_id` FK 로 참조해 DB 레벨 참조 무결성을 보장한다. 아래 "옴니버스·출금풀 계정 역할이 없다" 도 이 테이블을 가리킨다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| sys_acnt_id | VARCHAR(16) | 시스템계정ID (PK, 접두사 SYS-) |
| sys_acnt_role_dvcd | VARCHAR(2) | 시스템계정 역할구분코드 |
| sys_acnt_nm | VARCHAR(64) | 시스템계정명 |
| sys_acnt_stcd | VARCHAR(1) | 시스템계정상태코드 |
| open_dttm · cls_dttm | VARCHAR(16) | 개설·폐쇄일시 |

- **sys_acnt_role_dvcd** — HOT_OPS(운영) · FEE_MGT(가스비) · RESERVE(준비금). FEE_MGT 는 대납 결정과 충돌하고, 옴니버스·출금풀 역할이 없다.
- 고객 계정 접두사 ACT- 와 공간 분리(SYS-).

## 델타원장 — 같은 개념, 다른 형태

10장의 `delta_ledger` 와 daw-core `daw_dlta_entr_l` 이 같은 것을 다르게 그린다.

- 10장: 상태 컬럼을 **PENDING → processing → settled** 로 바꿔 간다.
- daw-core: 델타는 **불변(append-only)** 이고, 네팅 귀속은 `nttg_btch_id` 가 NULL 이냐 아니냐로만 표현한다. 상태를 갱신하지 않는다.

세 상태의 뜻과 daw-core 표현은 이렇게 맞춰진다.

| 10장 상태 | 뜻 | daw-core 표현 |
|---|---|---|
| **PENDING** | 1단계에서 DB 에 즉시 반영된 델타. 아직 네팅·온체인 전송 전 — 미정산 후보 | 델타 `nttg_btch_id` = NULL |
| **processing** | 배치가 이 델타를 묶어 온체인에 제출하고 확정을 기다리는 상태. 배치 키로 마킹해 이중 제출을 막는다 | 델타에 `nttg_btch_id` 채워짐 + 배치 `nttg_stcd` = 제출·processing |
| **settled** | 온체인 확정으로 정산 완료. 실패하면 PENDING 으로 되돌린다 | 배치 `nttg_stcd` = 정산완료 + `settl_tmst` 기록 |

processing → settled 전이는 온체인 확정으로 일어난다. 이때 매니저 완료 이벤트(4장 `ChainEvent`)가 실어 주는 건 **벤더 tx id(`txId`)·우리 요청 키(`externalTxId`)·온체인 거래해시(`txHash`)** 다 — daw-core 는 txId 를 `bcm_tx_id`, txHash 를 `bcm_tx_hash`·`tx_hash` 에 담고 externalTxId 로 배치를 찾는다. 배치·온체인 매칭과 증빙이 이 값들로 된다.

어긋난 설계가 아니라 표현이 다른 것이다 — processing 에 해당하는 상태가 델타가 아니라 배치(`nttg_stcd`)로 올라가 있다. 델타는 불변으로 두고, 제출·정산 진행 상태는 배치가 갖는 구조다. 10장 문서를 "델타는 불변, 처리 상태는 배치가 보유"로 맞춰 적으면 된다.

**관련 테이블 — `daw_dlta_entr_l` (델타원장)**

온체인 자산↔자산 실제 이동분. 불변(append-only)이고, 옴니버스 내부 장부 이동은 행을 만들지 않는다. 방향은 from→to 쌍으로 표현하고 수량은 항상 양수다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| dlta_id | VARCHAR(32) | 델타ID (PK) |
| guid | VARCHAR(36) | 거래GUID |
| tx_id | VARCHAR(32) | 거래ID (FK) |
| tx_typ_dvcd | VARCHAR(2) | 거래유형구분코드 (거래헤더 역정규화 — 유형별 집계) |
| blkc_ntwk_dvcd · tkn_id · tkn_smbl · tkn_dcml | — | 네트워크·토큰 (네팅 상계 단위) |
| from_ast_id | VARCHAR(16) | 출금측 자산ID (NULL=외부주소) |
| from_wllt_typ | VARCHAR(2) | 출금측 지갑유형 |
| from_addr | VARCHAR(128) | 출금측 온체인주소 |
| to_ast_id | VARCHAR(16) | 입금측 자산ID (NULL=외부주소) |
| to_wllt_typ | VARCHAR(2) | 입금측 지갑유형 |
| to_addr | VARCHAR(128) | 입금측 온체인주소 |
| mv_qty | NUMERIC(78,0) | 이동수량 (항상 양수 절대값, 방향은 from→to 로 파생) |
| nttg_btch_id | VARCHAR(32) | 네팅배치ID (NULL=미네팅 후보, 귀속 시 write-once) |
| rvrs_dlta_id | VARCHAR(32) | 역델타 대상ID (실패 보상 시 부호 반대 역행 삽입) |

- **from_wllt_typ · to_wllt_typ** — 회사 · 고객옴니버스 · 외부.
- 상태 컬럼이 없다 — 미네팅·네팅 구분은 `nttg_btch_id` 의 NULL 여부로만 한다. 처리 진행 상태는 배치가 가진다.
- 취소는 UPDATE 가 아니라 역행 삽입(`rvrs_dlta_id`).

**관련 테이블 — `daw_nttg_btch_l` (네팅배치)**

미네팅 델타를 그룹키로 SUM 해 순액만 온체인 한 번 보내는 정산 배치. 배치 한 행이 온체인 한 건이다. 아래 "네팅 배치의 externalTxId 자리" 도 이 테이블을 가리킨다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| nttg_btch_id | VARCHAR(32) | 네팅배치ID (PK) |
| tkn_id · blkc_ntwk_dvcd · tkn_smbl · tkn_dcml | — | 토큰·네트워크 (역정규화) |
| from_ast_id · from_addr | VARCHAR | 출금측 그룹키·온체인 송신주소 (NULL=외부) |
| to_ast_id · to_addr | VARCHAR | 입금측 그룹키·온체인 수신주소 (NULL=외부) |
| perd_strt_tmst · perd_end_tmst | TIMESTAMP | 집계 시작·종료 시각 |
| net_qty | NUMERIC(78,0) | 순수량 — 그룹 SUM(mv_qty), 온체인 전송량 |
| dlta_cnt | INT | 묶인 델타 건수 (배치·델타 정합 검증) |
| nttg_stcd | VARCHAR(2) | 네팅상태코드 (제출·정산 진행 상태 — 델타 대신 배치가 보유) |
| bcm_tx_hash | VARCHAR(128) | 정산 온체인 거래해시 |
| settl_tmst | TIMESTAMP | 확정시각 |

## 백엔드 DB 에서 채워야 할 자리

설계가 백엔드에 요구하지만 daw-core 에 담을 곳이 아직 없는 것들. 위쪽이 더 급하다.

### 실시간 잔액에 '대기' 수량이 없다

5장·8장은 업무 잔액을 가용·대기·잠김 셋으로 본다. 입금이 확정 대기(CONFIRMING)일 때 금액은 **대기**이고, 확정되면 가용으로 넘어간다.

- `daw_ast_bal_m` 는 `avbl_qty`(가용) · `lock_qty`(잠금)뿐 — 대기를 담을 컬럼이 없다. (일별 스냅샷 `daw_ldgr_bal_l` 엔 `pend_qty` 가 있다.)
- **문제가 되는 건 대기를 보여주거나 대사할 때다.** 고객 서비스가 "입금 진행 중" 을 보여주거나 일별 스냅샷의 `pend_qty`·총량(가용+대기+잠금)을 맞추려면 고객별 대기 값이 있어야 하는데, 실시간 테이블에 소스가 없으면 못 만든다. (매니저 `balanceOf` 도 pending 을 주지만 그건 vault 단위 벤더 잔액이라 대사 재료지 고객별 표시값이 아니다 — 8장.)
- **다만 대기를 꼭 저장할 필요는 없다.** 확정 전 입금을 잔액에 얹지 않고, 아직 확정 안 된 입금 기록을 실시간 집계해 대기를 파생하면 컬럼이 없어도 된다. 다만 미확정 입금을 daw-core 가 어디에 남기는지 — 거래 테이블의 미확정 상태인지, 원장의 미전기 분개인지 — 는 원본에 분명치 않다. (참고로 `daw_tx_l` 상태엔 CONFIRMING 이 없다 — 매니저 CONFIRMING 은 위 표대로 PENDING 으로 접힌다.)

→ 대기를 (a) `daw_ast_bal_m` 에 `pend_qty` 로 저장할지, (b) 미확정 입금 기록에서 파생할지 정한다. 파생이면 컬럼은 필요 없지만, 미확정 입금이 어디에 남는지부터 정해야 한다. 관련: [5장 입금](05-deposit.md) · [8장 잔액](08-balance-history.md)

**관련 테이블 — `daw_ast_bal_m` (고객 자산 잔액, DB 기준)**

고객 잔액의 기준. 자산 정체성과 1:1 로, 별도 ID 없이 `ast_id` 를 그대로 PK 이자 FK 로 쓴다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| ast_id | VARCHAR(16) | 자산ID (PK=FK, 1:1) |
| avbl_qty | NUMERIC(78,0) | 가용수량 — 즉시 출금 가능 |
| lock_qty | NUMERIC(78,0) | 잠금수량 — 담보·분쟁·압류 등 외부 사유(Hold 대상) |
| avg_acq_xrt | NUMERIC(18,8) | 평균취득환율 |
| last_tx_seqno | BIGINT | 최종거래일련번호 |

- **대기(pending) 수량 컬럼이 없다** — 이 절의 핵심.

**관련 테이블 — `daw_ldgr_bal_l` (원장 일별수량, 마감 스냅샷)**

마감 기준 일별 수량 스냅샷. 실시간 잔액과 달리 대기·총수량 컬럼을 갖는다. [확장 예정 — 스키마만 선반영]

| 컬럼 | 타입 | 설명 |
|---|---|---|
| clcl_dt | VARCHAR(8) | 산출일자 YYYYMMDD (PK, 마감 기준일) |
| ldgr_acnt_id | VARCHAR(16) | 원장계좌ID (PK) |
| ast_id · tkn_id · blkc_ntwk_dvcd · tkn_smbl · tkn_dcml | — | 자산·토큰·네트워크 (역정규화) |
| avbl_qty | NUMERIC(78,0) | 가용수량 (마감) |
| pend_qty | NUMERIC(78,0) | 대기수량 (마감) |
| lock_qty | NUMERIC(78,0) | 잠금수량 (마감) |
| tot_qty | NUMERIC(78,0) | 총수량 (가용+대기+잠금) |
| krw_evl_amt | NUMERIC(18,2) | 원화평가금액 (보고용) |

- `pend_qty`(대기)가 여기엔 있는데 실시간 `daw_ast_bal_m` 엔 없다 — 대기 개념 자체는 모델에 있으나 실시간 잔액에서 빠진 상태.

### 인바운드 이벤트 멱등 기록이 없다

4장은 전달 보장이 at-least-once 라 같은 이벤트가 드물게 중복되고, **이벤트 ID(tx id 또는 externalTxId) 유일 제약**으로 이중 반영을 막는다. 오프셋은 원장 반영이 성공한 뒤에만 커밋한다.

- daw-core `daw_evnt_l`(Outbox)는 **발행 전용**(P/D/F/S 상태). 매니저 큐에서 받은 이벤트를 **소비한 쪽의 처리 완료·멱등 키**를 담는 자리가 안 보인다.

→ 소비한 이벤트 ID 를 유일 제약으로 기록할 자리(소비 기록 테이블, 또는 원장분개에 이벤트 ID 유일 제약)를 둔다. 없으면 이중 입금 반영을 막는 근거가 스키마에 없다. 관련: [4장 감지·확정](04-detect-confirm.md)

**관련 테이블 — `daw_evnt_l` (발행 아웃박스)**

실패 상태 변경과 이벤트 발행을 한 트랜잭션으로 묶는 아웃박스. 상태 변경과 이벤트 기록이 같은 `@Transactional` 안에서 일어난다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| evnt_id | VARCHAR(36) | 이벤트ID (PK, 시간순 UUID v7) |
| evnt_dt | VARCHAR(8) | 이벤트일자 (조회·파티셔닝 기준) |
| guid | VARCHAR(36) | 거래GUID (원거래 연결) |
| orgn_id | VARCHAR(36) | 원본이벤트ID (재발행·파생 추적) |
| trace_id | VARCHAR(64) | 분산추적 트레이스ID (W3C traceparent 등) |
| agg_typ_dvcd | VARCHAR(2) | 집합체유형구분코드 |
| agg_id | VARCHAR(32) | 집합체ID (tx_id 또는 dlta_id) |
| evt_typ_dvcd | VARCHAR(4) | 이벤트유형구분코드 |
| grp_id | VARCHAR(64) | 처리그룹ID (네팅 배치 등 일괄 처리 단위) |
| payload | JSONB | 이벤트 페이로드 |
| evnt_stcd | VARCHAR(1) | 이벤트상태코드 |
| rtry_cnt · max_rtry_cnt | INT | 재시도 횟수·최대 |
| pub_dttm · last_rtry_dttm | VARCHAR(16) | 발행일시·최종 재시도일시 |
| err_msg · err_dtl | VARCHAR | 오류 요약·상세 |

- **evnt_stcd** — P(PENDING) · D(DISPATCHED) · F(FAILED) · S(SUCCESS).
- **agg_typ_dvcd** — TX(거래) · DL(델타). **evt_typ_dvcd** — TXFL(TxFailed) · TXCK(TxChecking) · TXCF(TxConfirmed).
- **발행(outbound) 전용**이다 — 매니저 큐에서 받은 이벤트의 소비 멱등을 담는 자리는 아니다. 이 절의 핵심.

### 동결이 여부(플래그)로만 있다

8장 잔액에서 잠김은 lockedAmount 와 frozen(AML 동결)을 합친 **금액**이다. 4장 subStatus 에 자동 동결·수동 동결·AML 거부가 있다.

- daw-core 는 `daw_ast_m.frzn_yn`·`frzn_dttm` 로 **동결 여부(플래그)** 만 갖는다. `daw_ast_bal_m.lock_qty` 는 담보·분쟁·압류(Hold)로 한정된다.

→ 일부 금액만 동결되는 경우를 담을 자리가 애매하다. frozen 을 금액으로 표현할지(lock_qty 에 합치거나 별도 컬럼) 정한다. 관련: [5장 입금](05-deposit.md)

**관련 테이블 — `daw_ast_m` (디지털자산 — 정체성·주소·상태)**

고객·시스템 자산의 정체성 단위. 입금 주소와 상태만 갖고 잔액은 잔액 테이블이 1:1 로 소유한다. EVM 계열은 같은 네트워크 안에서 토큰과 무관하게 주소를 공유한다(역정규화).

| 컬럼 | 타입 | 설명 |
|---|---|---|
| ast_id | VARCHAR(16) | 자산ID (PK) |
| acnt_id | VARCHAR(16) | 고객계좌ID (고객 자산일 때 NOT NULL, FK) |
| sys_acnt_id | VARCHAR(16) | 시스템계좌ID (시스템 자산일 때 NOT NULL, FK) |
| blkc_ntwk_dvcd · tkn_id | VARCHAR(2) · VARCHAR(16) | 네트워크·토큰ID (FK) |
| tkn_smbl · tkn_dcml | VARCHAR(16) · INT | 토큰심볼·소수자릿수 (시점 스냅샷) |
| dpst_addr | VARCHAR(128) | 입금주소 (EVM 은 네트워크 내 토큰 무관 동일 주소) |
| addr_stcd | VARCHAR(2) | 주소상태코드 |
| addr_iss_dttm | VARCHAR(16) | 주소발급일시 |
| ast_stcd | VARCHAR(2) | 자산상태코드 |
| frzn_yn · frzn_dttm | VARCHAR(1) · VARCHAR(16) | 동결여부·동결일시 |
| aml_scrn_stcd | VARCHAR(2) | AML 스크리닝상태코드 |
| whtl_yn | VARCHAR(1) | 화이트리스트여부 |
| ownr_ref | VARCHAR(32) | 소유주체참조 |
| open_dttm · last_tx_dt | VARCHAR(16) · VARCHAR(8) | 개설일시·최종거래일자 |
| cls_appc_dttm · cls_dttm | VARCHAR(16) | 해지신청·해지일시 |

- **제약** — `acnt_id` 와 `sys_acnt_id` 중 정확히 하나만 NOT NULL. `UNIQUE (acnt_id, blkc_ntwk_dvcd, tkn_id)` 로 계좌·네트워크·토큰 조합의 유일성 보장.
- **addr_stcd** — ACTIVE · RETIRED(벤더 교체 등으로 폐기) · BLOCKED.
- **ast_stcd** — PENDING · ACTIVE · FROZEN · CLOSED.
- **frzn_yn** — Y·N. 여부 플래그라 부분 금액 동결을 담지 못한다 — 이 절의 핵심.

### 가스 월정산을 대사할 자리가 없다

대납 결정으로 회계가 relay 월 청구서(가스 실비 + 구독료) 대 온체인 실측 가스 합계의 대사로 바뀐다(가스 대납 5장, 7장).

- daw-core 는 건별 `daw_onch_exec_l.gas_fee` 는 있으나 **월 청구서 대사·수수료 수익 대 가스 원가**를 담을 테이블이 없다. `daw_onch_sync_l` 은 잔액 대사지 가스 청구 대사가 아니다.

→ 대납을 쓰면 가스 청구 대사 스키마가 필요하다. 관련: [7장 수수료 견적](07-estimate-fee.md) · 가스 대납 [5장](../가스대납/05-decision.md)

**관련 테이블 — `daw_onch_exec_l` (온체인실행)**

온체인 실행 공통 정보. 출처(네팅배치 경유·거래 직접)는 하위 두 테이블이 배타적으로 소유한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| exec_id | VARCHAR(32) | 실행ID (PK) |
| bcm_tx_id | VARCHAR(64) | BCM 거래ID |
| tx_hash | VARCHAR(128) | 온체인 거래해시 |
| blkc_ntwk_dvcd | VARCHAR(2) | 네트워크구분코드 (FK) |
| from_addr · to_addr | VARCHAR(128) | 송신·수신 블록체인주소 |
| gas_fee | NUMERIC(36,18) | 가스비 (건별) |
| blk_no | BIGINT | 확정 블록번호 |
| cnfm_cnt | INT | 컨펌수 |
| exec_stcd | VARCHAR(2) | 실행상태코드 |
| cnfm_dttm | VARCHAR(16) | 확정일시 |

- `gas_fee` 는 건별로만 있다 — relay 월 청구서 대사·수수료 수익 대 가스 원가를 담을 테이블은 따로 없다. 이 절의 핵심.
- 하위: `daw_onch_exec_btch_l`(배치 경유) · `daw_onch_exec_tx_l`(거래 직접) — exec_id 한 건은 정확히 한쪽에만 속한다.

**관련 테이블 — `daw_onch_sync_l` (온체인동기화)**

온체인 잔액 대사. 오프체인(DB 원장)과 온체인 조회의 차이를 감지·보정 기록한다. [확장 예정 — 스키마만 선반영]

| 컬럼 | 타입 | 설명 |
|---|---|---|
| sync_id | VARCHAR(32) | 동기화ID (PK) |
| sync_dt | VARCHAR(8) | 동기화일자 |
| ldgr_acnt_id | VARCHAR(16) | 원장계좌ID (고객 지갑 대사 시) |
| ast_id | VARCHAR(16) | 자산ID (고객·시스템 공통) |
| blkc_ntwk_dvcd · tkn_id · tkn_smbl | — | 네트워크·토큰 |
| offch_bal | NUMERIC(36,18) | 오프체인 잔액 (DB 원장 기준) |
| onch_bal | NUMERIC(36,18) | 온체인 잔액 (블록체인 조회) |
| diff_amt | NUMERIC(36,18) | 잔액 차이금액 (오프체인 − 온체인) |
| sync_rslt_dvcd | VARCHAR(2) | 동기화결과구분코드 |
| blk_no | BIGINT | 조회 기준 블록번호 |
| adj_tx_id | VARCHAR(32) | 보정 거래ID (불일치 보정 시) |
| sync_rsn | VARCHAR(256) | 대사 사유·보정 내용 |

- **sync_rslt_dvcd** — 00 일치 · 01 불일치 · 02 보정완료. 이건 잔액 대사지 가스 청구 대사가 아니다.

### 옴니버스·출금풀 계정 역할이 없다

5장의 지갑 셋은 고객별 중간 vault · 옴니버스 vault · 출금 풀(여러 개, 라운드로빈)이다.

- daw-core `sys_acnt_role_dvcd` 는 HOT_OPS · FEE_MGT · RESERVE 뿐 — **옴니버스·출금풀 역할이 없다.** 출금 풀을 여러 vault 로 두고 논스를 병렬로 돌리는 걸 계정으로 어떻게 구분하는지도 표현이 없다.

→ 시스템 계정 역할코드를 넓히거나, 옴니버스·출금풀을 계정으로 잡는 규칙을 정한다. 테이블은 위 "가스" 절의 `daw_sys_acnt_m` 참조. 관련: [5장 입금](05-deposit.md)

### 네팅 배치의 요청 키(externalTxId) — 대체로 자리 있음

코어는 제출할 때 요청 키(externalTxId)를 BCM 에 전달한다 — 출금은 `TransactionRequest.externalTxId`(6장), 네팅은 "배치 키 = externalTxId"(10장). 매니저는 이 키를 완료 이벤트에 그대로 실어 되돌려준다(12장). 즉 배치↔완료 매칭에 쓸 키는 이미 양방향으로 오간다.

- 네팅 배치 키로 `nttg_btch_id` 를 그대로 externalTxId 로 쓰면, 배치 PK 가 곧 그 키라 별도 컬럼이 필요 없다 — 완료 이벤트가 nttg_btch_id 를 되돌려주니 배치에 바로 매칭된다.
- 다른 값을 배치 키로 쓴다면(예: 자산별 접미사 붙인 키) 그 키를 배치에 남길 컬럼이 있는지만 확인하면 된다.

→ `nttg_btch_id` 를 externalTxId 로 쓰는지 확인한다. 그렇다면 자리 문제는 아니다. 테이블은 위 "델타원장" 절의 `daw_nttg_btch_l` 참조. 관련: [6장 출금](06-withdrawal.md) · [10장 온·오프램프·스왑](10-ramp-swap.md) · [12장 정합 목록](12-csm-poc.md)

## 먼저 정할 것

1. **가스 모델** — 충전이냐 대납이냐. 설계 요구·FEE_MGT 계정과 대납 결정이 충돌한다. 여기부터 정해야 FEE_MGT·가스 대사 스키마가 따라온다.
2. **상태코드 매핑** — 매니저 TxStatus 다섯을 daw-core 상태로 옮기는 전이표. REJECTED 의 짝을 정한다. 12장 상태 계약과 함께 확정한다.
3. **대기 잔액** — 대기를 `daw_ast_bal_m` 컬럼으로 저장할지 진행 중 입금에서 파생할지 정한다. 보여주거나 대사할 계획이면 소스가 있어야 한다.
