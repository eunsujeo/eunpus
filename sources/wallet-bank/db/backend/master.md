# 마스터

## daw_blkc_ntwk_m — 블록체인네트워크기본

멀티체인 지원의 기준 마스터. 토큰·주소·온체인 실행이 모두 이 네트워크를 참조한다.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| blkc_ntwk_dvcd | VARCHAR(2) | PK | 블록체인네트워크구분코드 |
| ntwk_cd | VARCHAR(20) |  | 네트워크코드 |
| chain_id | BIGINT |  | 체인ID |
| dspl_nm | VARCHAR(64) |  | 표시명 |
| ntv_smbl | VARCHAR(16) |  | 기축통화심볼 |
| cnfm_cnt | INT |  | 확정컨펌수 |
| ntwk_stcd | VARCHAR(1) |  | 네트워크상태코드 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 1:N → daw_tkn_m.
• 1:N → daw_ast_m.

## daw_dspl_ast_m — 표시자산기본

고객에게 보여줄 통합 자산 단위. 실제 토큰(체인별)은 daw_tkn_m이 관리.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| dgast_dvcd | VARCHAR(2) | PK | 디지털자산구분코드 |
| dgast_smbl | VARCHAR(16) |  | 디지털자산심볼 |
| dspl_nm | VARCHAR(64) |  | 표시명 |
| dgast_stcd | VARCHAR(1) |  | 디지털자산상태코드 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 1:N → daw_tkn_m.

## daw_tkn_m — 토큰기본

체인별 실제 토큰. 원장·거래·시스템자산이 tkn_id를 참조. Coin VO의 decimals 스냅샷 출처.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| tkn_id | VARCHAR(16) | PK | 토큰ID |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 |
| dgast_dvcd | VARCHAR(2) | FK | 디지털자산구분코드 |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 |
| tkn_nm | VARCHAR(64) |  | 토큰명 |
| cntr_addr | VARCHAR(128) |  | 컨트랙트주소 (스마트컨트랙트 주소 / 스테이블코인 분석안) |
| dcml_cnt | INT |  | 소수자릿수 (소수자릿수 — base unit 환산 기준 / 분석안) |
| tkn_stnd_dvcd | VARCHAR(2) |  | 토큰표준구분코드 (토큰표준(ERC20 등) / 분석안) |
| tkn_typ_dvcd | VARCHAR(2) |  | 토큰유형구분코드 |
| tkn_stcd | VARCHAR(1) |  | 토큰상태코드 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_blkc_ntwk_m.
• N:1 → daw_dspl_ast_m.
• 1:N → daw_ast_m.

## daw_smrt_cntr_m — 스마트컨트랙트기본

스마트컨트랙트 배포·버전 관리 마스터. [확장 P2]

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| smrt_cntr_id | VARCHAR(16) | PK | 스마트컨트랙트ID |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 |
| cntr_addr | VARCHAR(128) |  | 컨트랙트주소 |
| cntr_typ_dvcd | VARCHAR(2) |  | 컨트랙트유형구분코드 (01:토큰, 02:거버넌스, 03:동결관리) |
| cntr_ver | VARCHAR(16) |  | 컨트랙트버전 |
| tkn_id | VARCHAR(16) | FK | 토큰ID (토큰 컨트랙트일 때 연계) |
| deploy_tx_hash | VARCHAR(128) |  | 배포트랜잭션해시 |
| deploy_dttm | VARCHAR(16) |  | 배포일시 |
| admin_wllt_addr | VARCHAR(128) |  | 관리자지갑주소 |
| cntr_stcd | VARCHAR(1) |  | 컨트랙트상태코드 (0:활성, 1:일시중지, 2:폐기) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_tkn_m.


확장 예정 — 스키마만 선반영

## daw_vasp_m — VASP기본

외부 출금 상대방 VASP 마스터. 거래 연결은 daw_tx_ext_dst_l이 FK로 참조.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| vasp_id | VARCHAR(16) | PK | VASP ID |
| vasp_nm | VARCHAR(64) |  | VASP명 (거래소·지갑사업자명) |
| vasp_biz_no | VARCHAR(32) |  | VASP 사업자식별번호 (해외는 nullable) |
| natn_cd | VARCHAR(2) |  | 국가코드 (ISO 3166-1 alpha-2) |
| trvl_rule_yn | VARCHAR(1) |  | 트래블룰대상여부 (Y:대상, N:비대상) |
| vasp_stcd | VARCHAR(2) |  | VASP상태코드 (01:활성, 02:비활성) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 1:N → daw_tx_ext_dst_l.