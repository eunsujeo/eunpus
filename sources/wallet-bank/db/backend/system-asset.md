# 시스템자산

회사 운영 계좌(HOT/FEE/RESERVE). 고객 계좌 체계와 독립. daw_ast_m.sys_acnt_id FK로 연결 — DB 레벨 참조 무결성 보장.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| sys_acnt_id | VARCHAR(16) | PK | 시스템계정ID |
| sys_acnt_role_dvcd | VARCHAR(2) |  | 시스템계정역할구분코드 (HOT_OPS:운영/FEE_MGT:가스비/RESERVE:준비금) |
| sys_acnt_nm | VARCHAR(64) |  | 시스템계정명 |
| sys_acnt_stcd | VARCHAR(1) |  | 시스템계정상태코드 |
| open_dttm | VARCHAR(16) |  | 개설일시 |
| cls_dttm | VARCHAR(16) |  | 폐쇄일시 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 1:N → daw_ast_m (sys_acnt_id FK).


cstno 오염 없음. DB FK로 참조 무결성 보장. 수십 개 행 — partial index.

<a id="daw_sys_ast_bal_m"></a>
## daw_sys_ast_bal_m — 시스템자산잔액기본

시스템 자산 잔액 (Redis SSOT + DB 복구 기준점). grain=(ast_id). avbl_qty는 Redis 장애 시 복구 기준점 — 직접 비즈니스 로직 사용 금지. lock_qty 없음 — 시스템 자산은 Hold 대상이 아니다.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| ast_id | VARCHAR(16) | PK,FK | 자산ID (daw_ast_m PK=FK, 1:1, sys_acnt_id NOT NULL인 시스템 자산만) (ADR-007 — 별도 ID 발급 없이 ast_id를 그대로 PK로 사용해 1:1 강제) |
| avbl_qty | NUMERIC(78,0) |  | 가용수량 (base unit 정수, Redis 장애 시 복구 기준점) |
| last_sync_tmst | TIMESTAMP |  | 마지막 Redis 동기화 시각 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• 1:1 → daw_ast_m.


Redis 장애 시: avbl_qty로 Redis 재초기화. 동기화 주기는 구현 시 결정.