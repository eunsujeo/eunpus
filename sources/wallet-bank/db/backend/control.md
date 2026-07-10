# 통제

금액 단위 보류. avbl→lock 이동. 외부 법적·계약적 사유에만 사용.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| hold_id | VARCHAR(32) | PK | 보류ID |
| ast_id | VARCHAR(16) | FK | 자산ID (daw_ast_m FK) |
| hold_amt | NUMERIC(36,18) |  | 보류금액 (보류 금액 / 달러박스 SEIZ_SETP_AMT 일반화) |
| hold_rsn_dvcd | VARCHAR(2) |  | 보류사유구분코드 (보류사유(담보/분쟁/압류) / 달러박스+선불) |
| ref_id | VARCHAR(32) |  | 연관참조ID |
| hold_stcd | VARCHAR(2) |  | 보류상태코드 |
| rls_dttm | VARCHAR(16) |  | 해제일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_ast_bal_m.


RELEASED: lock→avbl 원복 / CAPTURED: lock 실차감.

<a id="daw_rstr_l"></a>
## daw_rstr_l — 거래제한내역

주체 단위 거래 차단. 잔액 불변. 사고·수사·휴면·KYC·압류 사유.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| rstr_id | VARCHAR(32) | PK | 거래제한ID |
| tgt_typ_dvcd | VARCHAR(2) |  | 대상유형구분코드 |
| tgt_id | VARCHAR(16) |  | 대상ID |
| rstr_typ_dvcd | VARCHAR(2) |  | 제한유형구분코드 |
| rstr_scp_dvcd | VARCHAR(2) |  | 제한범위구분코드 |
| rstr_rsn | VARCHAR(256) |  | 제한사유 |
| rstr_stcd | VARCHAR(2) |  | 제한상태코드 |
| lft_dttm | VARCHAR(16) |  | 해제일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 거래 검증 게이트 (잔액 불변).


ADR-003 — 압류 메타(ext_ord_no/typ, rstr_amt, lft_rsn/actc) 구조화.

<a id="daw_aml_scrn_l"></a>
## daw_aml_scrn_l — AML심사내역

AML 심사·트래블룰 이력. [확장 P1 필수]

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| scrn_id | VARCHAR(32) | PK | 심사ID |
| guid | VARCHAR(36) |  | 거래GUID (타서비스공통) |
| tgt_typ_dvcd | VARCHAR(2) |  | 대상유형구분코드 (01:자산, 02:거래, 03:고객) |
| ast_id | VARCHAR(16) | FK | 자산ID (대상이 자산일 때) |
| tx_id | VARCHAR(32) | FK | 거래ID (대상이 거래일 때) |
| scrn_typ_dvcd | VARCHAR(2) |  | 심사유형구분코드 (01:사전, 02:사후모니터링, 03:STR보고) |
| scrn_rslt_dvcd | VARCHAR(2) |  | 심사결과구분코드 (00:정상, 01:주의, 02:의심, 03:차단) |
| risk_score | NUMERIC(5,2) |  | 위험점수 (위험점수 / 분석안) |
| trvl_rule_yn | VARCHAR(1) |  | 트래블룰대상여부 (트래블룰 대상 / 분석안) |
| sndr_vasp | VARCHAR(32) |  | 송신VASP코드 |
| rcvr_vasp | VARCHAR(32) |  | 수신VASP코드 |
| scrn_src_dvcd | VARCHAR(2) |  | 스크리닝제공사구분코드 (예: Chainalysis) |
| scrn_rsn | VARCHAR(500) |  | 심사사유/결과상세 |
| rpt_yn | VARCHAR(1) |  | 보고여부 |
| rpt_dttm | VARCHAR(16) |  | 보고일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_ast_m.
• N:1 → daw_tx_l.


확장 예정(P1) — 트래블룰 연계.

<a id="daw_ldgr_chng_h"></a>
## daw_ldgr_chng_h — 원장변경이력 (설정·정책 변경 감사)

설정·정책 변경 감사 이력. append-only. 사망·상속·명의이전 등 후선업무 반영 시 이 테이블에 1건 남는다. 모든 변경은 결재(aprv_empno) 필수.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| chng_id | VARCHAR(32) | PK | 변경이력ID |
| guid | VARCHAR(36) |  | 거래GUID (타서비스공통, nullable) |
| tgt_typ_dvcd | VARCHAR(2) |  | 대상유형구분코드 (01:계좌, 02:자산, 03:잔액, 04:정책) |
| tgt_id | VARCHAR(16) | FK | 대상ID (acnt_id / ast_id 등) |
| chng_rscd | VARCHAR(4) |  | 변경사유코드 (FRZN:동결, WHTL:화이트리스트, LIMT:한도, CLSS:상태, OWNR:소유권변경(사망·상속·명의이전), ETC:기타) |
| bef_ctnt | VARCHAR(500) |  | 변경전내용 (JSON/text 스냅샷) |
| aft_ctnt | VARCHAR(500) |  | 변경후내용 (JSON/text 스냅샷) |
| chng_chnl_dvcd | VARCHAR(3) |  | 변경채널구분코드 (MOB:모바일, WEB:웹, ADM:관리자, BAT:배치) |
| chng_dttm | VARCHAR(16) |  | 변경일시 |
| chng_empno | VARCHAR(6) |  | 변경직원번호 (자동거래 시 999999) |
| chng_brcd | VARCHAR(4) |  | 변경부점코드 |
| aprv_empno | VARCHAR(6) |  | 책임자승인직원번호 (모든 설정·정책 변경은 결재 필수) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• N:1 → daw_acnt_m (tgt_id가 acnt_id를 가리킬 때).
• N:1 → daw_ast_m (tgt_id가 ast_id를 가리킬 때).


후선업무(사망/상속/명의이전)는 daw-core 밖(고객센터)에서 접수·심사하고, 최종 반영만 이 테이블에 감사 기록으로 남는다. tgt_id는 컬럼 하나로 계좌/자산을 모두 가리키므로 DB FK 제약은 없다(참조 무결성은 애플리케이션이 보장).

<a id="daw_susp_l"></a>
## daw_susp_l — 별단원장

별단 보관. 원소유 자산(orig_ast_id)이 환급 기본 목적지. 상태: HELD→REFUND_PENDING→REFUNDED/DISCARDED.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| susp_id | VARCHAR(32) | PK | 별단ID |
| guid | VARCHAR(36) |  | 거래GUID |
| orig_tx_id | VARCHAR(32) | FK | 원거래ID (daw_tx_l) |
| orig_ast_id | VARCHAR(16) | FK | 원소유자산ID (환급 기본 목적지) |
| tkn_id | VARCHAR(16) | FK | 토큰ID |
| blkc_ntwk_dvcd | VARCHAR(2) |  | 블록체인네트워크구분코드 (역정규화) |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (역정규화) |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷, susp_amt base unit 해석 기준) |
| susp_amt | NUMERIC(78,0) |  | 별단보관금액 (base unit 정수) |
| susp_rscd | VARCHAR(4) |  | 별단사유코드 (WDFL:출금실패, ADDR:주소오인식, EXCH:거래소누락, ETC:기타) |
| susp_stcd | VARCHAR(2) |  | 별단상태코드 (10:보관중, 20:환급대기, 30:환급완료, 90:폐기) |
| auto_rfnd_yn | VARCHAR(1) |  | 자동환급대상여부 (Y:자동배치 처리, N:수기) |
| susp_dttm | VARCHAR(16) |  | 별단보관일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_tx_l.
• N:1 → daw_ast_m.
• 1:N → daw_susp_rfnd_l.


ADR-004 — 오류·실패 자금 임시 보관 + 환급 워크플로우.

<a id="daw_susp_rfnd_l"></a>
## daw_susp_rfnd_l — 별단환급처리내역

별단 환급 처리 이력. 자동(A)/수기(M)/외부타행(B) 방식. 처리 결과·오류·미처리 사유 보유.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| rfnd_id | VARCHAR(32) | PK | 환급ID |
| susp_id | VARCHAR(32) | FK | 별단ID (daw_susp_l FK) |
| guid | VARCHAR(36) |  | 거래GUID |
| rfnd_seqno | INT |  | 환급시도순번 (재시도 추적) |
| rfnd_mthd_dvcd | VARCHAR(1) |  | 환급방법구분코드 (A:자동, M:수기, B:외부타행) |
| rfnd_stcd | VARCHAR(2) |  | 환급상태코드 (10:처리중, 20:완료, 30:실패) |
| rfnd_amt | NUMERIC(78,0) |  | 환급금액 (base unit 정수) |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷) |
| rfnd_ast_id | VARCHAR(16) | FK | 환급자산ID (내부 환급 시) |
| rfnd_addr | VARCHAR(128) |  | 환급주소 (외부 환급 시) |
| procs_dttm | VARCHAR(16) |  | 처리일시 |
| procs_empno | VARCHAR(6) |  | 처리직원번호 (자동:999999) |
| procs_brcd | VARCHAR(4) |  | 처리부점코드 |
| err_cd | VARCHAR(6) |  | 오류코드 (실패 시) |
| err_msg | VARCHAR(2000) |  | 오류상세 |
| untn_rsn | VARCHAR(200) |  | 미처리사유 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_susp_l.


UNIQUE (susp_id, rfnd_seqno).