# 거래

거래 상태머신. 온/오프램프·이체 유형 관리. 잔액 근거는 ldgr_entr_l, 온체인 대기는 dlta_entr_l.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| tx_id | VARCHAR(32) | PK | 거래ID |
| guid | VARCHAR(36) |  | 거래GUID(타서비스공통) |
| extn_ref | VARCHAR(64) |  | 외부연동참조 |
| srvc_id | VARCHAR(11) |  | 요청서비스ID (요청이 발생한 서비스/채널 식별) (요청 발생 서비스/채널(출처 추적) / 선불 TX_SRVC_ID) |
| ast_id | VARCHAR(16) | FK | 자산ID |
| tkn_id | VARCHAR(16) | FK | 토큰ID |
| tx_typ_dvcd | VARCHAR(2) |  | 거래유형구분코드 |
| tx_amt | NUMERIC(36,18) |  | 거래금액 (거래금액 / 양쪽 TX_AMT) |
| tx_stcd | VARCHAR(2) |  | 거래상태코드 |
| krw_stcd | VARCHAR(2) |  | 원화구간상태코드 (원화구간 상태(계정계 호출 결과) / daw-core) |
| cntp_typ_dvcd | VARCHAR(2) |  | 상대유형구분코드 (01:내부지갑 02:외부지갑 03:은행계좌 04:거래소 05:시스템지갑) |
| cntp_nm | VARCHAR(64) |  | 상대명/예금주명 (라벨) |
| cntp_blkc_ntwk_dvcd | VARCHAR(2) |  | 상대네트워크구분코드 (온체인 상대일 때) |
| cntp_tx_ref | VARCHAR(128) |  | 상대거래참조 (상대 tx해시/관리번호) |
| orig_tx_id | VARCHAR(32) |  | 원거래ID |
| orig_tx_dt | VARCHAR(8) |  | 원거래일자 |
| fx_xrt | NUMERIC(18,8) |  | 적용환율 (적용환율 / 달러박스 FX_MNEX) |
| fx_xrt_dt | VARCHAR(8) |  | 환율고시일자 |
| fx_xrt_seq | INT |  | 환율고시회차 |
| krw_amt | NUMERIC(18,2) |  | 원화환산액 (원화환산액 / 달러박스 WCUC_AMT) |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 (tkn_id 역정규화, 대사·조회 최적화) |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (tkn_id 역정규화, 대사·조회 최적화) |
| occr_dttm | VARCHAR(16) |  | 발생일시 |
| cnfm_dttm | VARCHAR(16) |  | 확정일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_ast_m.
• 1:N → daw_ldgr_entr_l.
• 1:N → daw_dlta_entr_l.


PENDING→CONFIRMED/FAILED/CANCELLED/CHECKING. 온체인 실행은 nttg_btch_l → onch_exec_l 경로.

<a id="daw_tx_ext_dst_l"></a>
## daw_tx_ext_dst_l — 거래외부목적지내역

거래의 외부 목적지(온체인 주소·VASP) 기록. EXTERNAL_WITHDRAW류 거래에만 행 존재.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| tx_id | VARCHAR(32) | PK,FK | 거래ID (daw_tx_l PK=FK, 1:1) |
| dst_addr | VARCHAR(128) |  | 목적지 온체인주소 |
| vasp_id | VARCHAR(16) | FK | VASP ID (daw_vasp_m FK, 미등록 개인지갑 등은 NULL 허용) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• 1:1 → daw_tx_l.
• N:1 → daw_vasp_m.

<a id="daw_onch_exec_l"></a>
## daw_onch_exec_l — 온체인실행내역

온체인 실행 공통 정보. 출처(네팅배치/거래직접)는 하위테이블이 소유.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| exec_id | VARCHAR(32) | PK | 실행ID |
| bcm_tx_id | VARCHAR(64) |  | BCM거래ID |
| tx_hash | VARCHAR(128) |  | 온체인거래해시 (온체인 TX 해시 / 분석안) |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 |
| from_addr | VARCHAR(128) |  | 송신블록체인주소 |
| to_addr | VARCHAR(128) |  | 수신블록체인주소 |
| gas_fee | NUMERIC(36,18) |  | 가스비 (가스비 / 분석안) |
| blk_no | BIGINT |  | 확정블록번호 |
| cnfm_cnt | INT |  | 컨펌수 |
| exec_stcd | VARCHAR(2) |  | 실행상태코드 |
| cnfm_dttm | VARCHAR(16) |  | 확정일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 1:1 → daw_onch_exec_btch_l (네팅 경유).
• 1:1 → daw_onch_exec_tx_l (거래 직접).


두 하위테이블은 배타적 — exec_id 1건은 정확히 한쪽에만 속한다.

<a id="daw_onch_exec_btch_l"></a>
## daw_onch_exec_btch_l — 온체인실행배치귀속내역

네팅 배치 경유 실행 귀속. daw_onch_exec_tx_l과 배타적.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| exec_id | VARCHAR(32) | PK,FK | 실행ID (daw_onch_exec_l PK=FK, 1:1) |
| nttg_btch_id | VARCHAR(32) | FK | 네팅배치ID (daw_nttg_btch_l FK) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• 1:1 → daw_onch_exec_l.
• N:1 → daw_nttg_btch_l.


경로 A: daw_tx_l → daw_dlta_entr_l → daw_nttg_btch_l → 이 테이블.

<a id="daw_onch_exec_tx_l"></a>
## daw_onch_exec_tx_l — 온체인실행거래귀속내역

네팅 없이 즉시실행된 거래의 귀속. daw_onch_exec_btch_l과 배타적.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| exec_id | VARCHAR(32) | PK,FK | 실행ID (daw_onch_exec_l PK=FK, 1:1) |
| tx_id | VARCHAR(32) | FK | 거래ID (daw_tx_l FK — 네팅 없이 직접 실행된 거래) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• 1:1 → daw_onch_exec_l.
• N:1 → daw_tx_l.


경로 B: daw_tx_l → 이 테이블 (daw_dlta_entr_l·daw_nttg_btch_l 미경유).