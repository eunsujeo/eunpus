# 계좌/자산

## daw_acnt_m — 디지털자산계정기본 (고객 등록 단위)

고객 등록 단위. cstno NOT NULL 불변식. 잔액은 daw_ast_bal_m이 관리(ADR-007).

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| acnt_id | VARCHAR(16) | PK | 계정ID (접두사 ACT-) |
| cstno | VARCHAR(16) |  | 고객번호 (고객번호 / 달러박스+선불 공통) |
| intg_cstno | VARCHAR(16) |  | 통합고객번호 |
| gds_cd | VARCHAR(8) |  | 상품코드 |
| gds_dtl_cd | VARCHAR(8) |  | 상품세부코드 |
| acnt_cd | VARCHAR(8) |  | 계정코드 |
| dgast_dvcd | VARCHAR(2) | FK | 디지털자산구분코드 (디지털자산 유형 / daw-core) |
| lacn | VARCHAR(16) |  | 연결계좌번호 (연결 원화계좌 — 계정계 입출금 대상 / 달러박스 ITLK_ACNO) |
| acnt_stcd | VARCHAR(1) |  | 계좌상태코드 |
| open_dttm | VARCHAR(16) |  | 개설일시 |
| open_empno | VARCHAR(6) |  | 개설직원번호 |
| cls_appc_dttm | VARCHAR(16) |  | 해지신청일시 |
| cls_dttm | VARCHAR(16) |  | 해지일시 |
| cls_empno | VARCHAR(6) |  | 해지직원번호 |
| cls_rscd | VARCHAR(2) |  | 해지사유코드 |
| last_tx_dt | VARCHAR(8) |  | 최종거래일자 |
| last_tx_seqno | BIGINT |  | 최종거래일련번호 |
| bal_prf_iss_dt | VARCHAR(8) |  | 잔액증명발급일자 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


1:N → daw_ast_m (acnt_id FK)
1:N → daw_acnt_cls_l


고객 전용. ID 접두사 "ACT-" — daw_sys_acnt_m.sys_acnt_id("SYS-")와 공간 분리.

## daw_ast_m — 디지털자산기본 (정체성만 — 주소·상태)

고객/시스템 디지털자산 정체성 단위. 입금주소(dpst_addr)와 상태만 보유 — 잔액은 daw_ast_bal_m/daw_sys_ast_bal_m이 ast_id 1:1로 소유. EVM 계열은 동일 네트워크 내 토큰 무관 주소 공유(역정규화).

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| ast_id | VARCHAR(16) | PK | 자산ID |
| acnt_id | VARCHAR(16) | FK | 고객계좌ID (고객 자산일 때 NOT NULL — daw_acnt_m FK) |
| sys_acnt_id | VARCHAR(16) | FK | 시스템계좌ID (시스템 자산일 때 NOT NULL — daw_sys_acnt_m FK). CHECK: 둘 중 정확히 하나만 NOT NULL |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 |
| tkn_id | VARCHAR(16) | FK | 토큰ID |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (역정규화) |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷, _qty base unit 해석 기준) |
| dpst_addr | VARCHAR(128) |  | 입금주소 (EVM: 동일 네트워크 내 토큰 무관 동일 주소 가능 — 역정규화) (ADR-006 — Wallet+WalletAddress+WalletBalance 통합, 주소를 Asset에 역정규화) |
| addr_stcd | VARCHAR(2) |  | 주소상태코드 (ACTIVE/RETIRED/BLOCKED) |
| addr_iss_dttm | VARCHAR(16) |  | 주소발급일시 |
| ast_stcd | VARCHAR(2) |  | 자산상태코드 (PENDING/ACTIVE/FROZEN/CLOSED) |
| frzn_yn | VARCHAR(1) |  | 동결여부 |
| frzn_dttm | VARCHAR(16) |  | 동결일시 |
| aml_scrn_stcd | VARCHAR(2) |  | AML스크리닝상태코드 |
| whtl_yn | VARCHAR(1) |  | 화이트리스트여부 |
| ownr_ref | VARCHAR(32) |  | 소유주체참조 |
| open_dttm | VARCHAR(16) |  | 개설일시 |
| last_tx_dt | VARCHAR(8) |  | 최종거래일자 |
| cls_appc_dttm | VARCHAR(16) |  | 해지신청일시 |
| cls_dttm | VARCHAR(16) |  | 해지일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


N:1 → daw_acnt_m (acnt_id FK)
N:1 → daw_sys_acnt_m (sys_acnt_id FK)
1:1 → daw_ast_bal_m
1:N → daw_ldgr_entr_l
1:N → daw_dlta_entr_l
1:N → daw_hold_l
1:N → daw_tx_l
1:N → daw_cstd_map_m


CHECK: (acnt_id NOT NULL AND sys_acnt_id IS NULL) OR (acnt_id IS NULL AND sys_acnt_id NOT NULL). UNIQUE (acnt_id, blkc_ntwk_dvcd, tkn_id) — grain 유일성.

## daw_ast_bal_m — 디지털자산잔액기본 (고객 잔액)

고객 자산 잔액 (DB SSOT). lock_qty는 Hold(담보·분쟁·압류)로 묶인 금액 — 법적으로 고객 자산에만 발생하는 개념이라 시스템 잔액엔 없음.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| ast_id | VARCHAR(16) | PK,FK | 자산ID (daw_ast_m PK=FK, 1:1) (ADR-007 — 별도 ID 발급 없이 ast_id를 그대로 PK로 사용해 1:1 강제) |
| avbl_qty | NUMERIC(78,0) |  | 가용수량 (base unit 정수, 즉시 출금 가능) |
| lock_qty | NUMERIC(78,0) |  | 잠금수량 (base unit 정수, 담보·분쟁·압류 등 외부 사유 — Hold 대상) (Hold는 고객 자산에만 발생하는 법적 개념 — daw_sys_ast_bal_m엔 없음) |
| avg_acq_xrt | NUMERIC(18,8) |  | 평균취득환율 |
| last_tx_seqno | BIGINT |  | 최종거래일련번호 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


1:1 → daw_ast_m


ADR-007 — 자산-잔액 1:1 분리. 별도 PK 발급 없이 ast_id를 그대로 사용.

## daw_cstd_map_m — 커스터디매핑기본

커스터디 추상화 계층. ext_acnt_id(예: vaultAccountId)·ext_ast_id(예: "KRWK_ETH")로 외부 시스템 참조.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| cstd_map_id | VARCHAR(16) | PK | 커스터디매핑ID |
| ast_id | VARCHAR(16) | FK | 자산ID (daw_ast_m FK) |
| cstd_prvd_dvcd | VARCHAR(2) |  | 커스터디제공사구분코드 (01:FIREBLOCKS, 02:SELF, ...) |
| ext_acnt_id | VARCHAR(64) |  | 외부계좌ID (예: Fireblocks vaultAccountId) |
| ext_ast_id | VARCHAR(64) |  | 외부자산ID (예: Fireblocks KRWK_ETH) |
| map_stcd | VARCHAR(2) |  | 매핑상태코드 (01:활성, 02:비활성) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


N:1 → daw_ast_m
UNIQUE (ast_id, cstd_prvd_dvcd)


ADR-006 — 커스터디 교체 가능하도록 별도 매핑 테이블로 격리.

## daw_acnt_cls_l — 계좌해지내역

계좌 해지·잔액소각 처리 이력. [확장 P2]

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| cls_id | VARCHAR(32) | PK | 해지ID |
| acnt_id | VARCHAR(16) | FK | 계좌ID |
| guid | VARCHAR(36) |  | 거래GUID (타서비스공통) |
| cls_rscd | VARCHAR(2) |  | 해지사유코드 |
| cls_stcd | VARCHAR(2) |  | 해지상태코드 (10:신청, 20:잔액소각, 30:완료) |
| cls_burn_amt | NUMERIC(36,18) |  | 해지소각금액 (잔여 토큰 소각량) |
| mnbn_id | VARCHAR(20) | FK | 연계 민팅소각거래ID (daw_mint_burn_l, 소각) |
| ast_deact_yn | VARCHAR(1) |  | 자산비활성화여부 |
| appc_dttm | VARCHAR(16) |  | 해지신청일시 |
| cls_dttm | VARCHAR(16) |  | 해지완료일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


N:1 → daw_acnt_m
N:1 → daw_mint_burn_l


확장 예정 — 스키마만 선반영