# 인프라

이벤트 드리븐 보상의 신뢰성 보장. 실패 상태변경과 이벤트 발행을 원자적으로.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| evnt_id | VARCHAR(36) | PK | 이벤트ID (time-ordered UUID v7) |
| evnt_dt | VARCHAR(8) |  | 이벤트일자 (일자별 조회·파티셔닝 기준) |
| guid | VARCHAR(36) |  | 거래GUID (타서비스공통, 원거래 연결 추적) |
| orgn_id | VARCHAR(36) |  | 원본이벤트ID (재발행·파생 이벤트 추적 — 최초 발행 evnt_id 참조) |
| trace_id | VARCHAR(64) |  | 분산추적트레이스ID (W3C traceparent 등) (분산추적 / daw-core) |
| agg_typ_dvcd | VARCHAR(2) |  | 집합체유형구분코드 (TX:거래 / DL:델타) |
| agg_id | VARCHAR(32) |  | 집합체ID (tx_id 또는 dlta_id) |
| evt_typ_dvcd | VARCHAR(4) |  | 이벤트유형구분코드 (TXFL:TxFailed / TXCK:TxChecking / TXCF:TxConfirmed) |
| grp_id | VARCHAR(64) |  | 처리그룹ID (네팅 배치 ID 등 일괄 처리 단위) |
| payload | JSONB |  | 이벤트페이로드 (JSONB) |
| evnt_stcd | VARCHAR(1) |  | 이벤트상태코드 (P:PENDING / D:DISPATCHED / F:FAILED / S:SUCCEESS) (발행상태 P/D/F(Outbox) / daw-core) |
| rtry_cnt | INT |  | 재시도횟수 |
| max_rtry_cnt | INT |  | 최대재시도횟수 |
| pub_dttm | VARCHAR(16) |  | 발행일시 (최초 DISPATCHED 시각) |
| last_rtry_dttm | VARCHAR(16) |  | 최종재시도일시 |
| err_msg | VARCHAR(1000) |  | 오류메시지 (마지막 실패 요약) |
| err_dtl | VARCHAR(2000) |  | 오류상세 (스택트레이스 등) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• ADR-002 — Outbox Pattern.


상태변경+이벤트기록 = 같은 @Transactional.

<a id="daw_onch_sync_l"></a>
## daw_onch_sync_l — 온체인동기화내역

온체인 잔액 대사. 불일치(diff) 감지·보정 기록. [확장 P2]

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| sync_id | VARCHAR(32) | PK | 동기화ID |
| sync_dt | VARCHAR(8) |  | 동기화일자 |
| ldgr_acnt_id | VARCHAR(16) | FK | 원장계좌ID (고객 지갑 대사 시) |
| ast_id | VARCHAR(16) | FK | 자산ID (고객/시스템 구분 없이 daw_ast_m 참조) |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 |
| tkn_id | VARCHAR(16) | FK | 토큰ID |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (역정규화) |
| offch_bal | NUMERIC(36,18) |  | 오프체인잔액 (DB 원장 기준) |
| onch_bal | NUMERIC(36,18) |  | 온체인잔액 (블록체인 조회) |
| diff_amt | NUMERIC(36,18) |  | 잔액차이금액 (오프체인 - 온체인) (오프:양방향_화살표:온체인 차이금액(대사) / 분석안) |
| sync_rslt_dvcd | VARCHAR(2) |  | 동기화결과구분코드 (00:일치, 01:불일치, 02:보정완료) |
| blk_no | BIGINT |  | 조회기준블록번호 |
| adj_tx_id | VARCHAR(32) |  | 보정거래ID (불일치 보정 시) |
| sync_rsn | VARCHAR(256) |  | 대사사유/보정내용 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 대사 검증 — daw_ast_m (고객/시스템 공통).


확장 예정 — 스키마만 선반영