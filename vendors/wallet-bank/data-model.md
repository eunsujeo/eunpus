---
type: vendor-hub
vendor: wallet-bank
status: draft
tags: [architecture, transaction, policy, custody, audit]
stage_introduced: 155
last_updated_stage: 155
source_count: 7
related:
  - overview
  - ledger-netting
  - custody-mapping
  - travel-rule-flow
---
# wallet-bank — Data Model

> daw-core PostgreSQL 스키마 (~25 테이블). 도메인별 7 그룹. 컬럼 전체 정본은 원본 DB 문서를, 이 페이지는 구조·불변식·관계를 담는다 (source: wallet-bank/db/backend/*).

## Summary

접미사 규약: `_m`(마스터/기본) · `_l`(내역/로그) · `_h`(이력). 수량은 base unit 정수 `NUMERIC(78,0)`, 토큰 소수자릿수 `tkn_dcml` 를 행마다 스냅샷해 마스터 변경에 불변(자족적 Coin 원칙) (source: wallet-bank/db/backend/ledger.md; account-asset.md). ID 공간 분리: 고객 계정 `ACT-`, 시스템 계정 `SYS-` (source: wallet-bank/db/backend/account-asset.md; system-asset.md).

## Key Concepts (핵심 불변식)

- **자산-잔액 1:1 분리 (ADR-007)** — `daw_ast_m`(정체성·주소·상태) 와 `daw_ast_bal_m`(고객 잔액)/`daw_sys_ast_bal_m`(시스템 잔액)을 분리. 별도 PK 발급 없이 `ast_id` 를 그대로 PK=FK 로 써 1:1 강제 (source: wallet-bank/db/backend/account-asset.md; system-asset.md).
- **고객/시스템 자산 배타 (CHECK)** — `daw_ast_m` 은 `acnt_id` 와 `sys_acnt_id` 중 **정확히 하나만 NOT NULL** (source: wallet-bank/db/backend/account-asset.md).
- **grain 유일성** — `UNIQUE (acnt_id, blkc_ntwk_dvcd, tkn_id)`. EVM 계열은 동일 네트워크 내 토큰 무관 주소 공유(역정규화) (source: wallet-bank/db/backend/account-asset.md).
- **Hold = 고객 자산 전용** — `lock_qty`(담보·분쟁·압류)는 법적으로 고객 자산에만 발생. 시스템 잔액 테이블엔 `lock_qty` 없음 (source: wallet-bank/db/backend/account-asset.md; system-asset.md).
- **append-only 원장** — `daw_ldgr_entr_l`·`daw_dlta_entr_l` UPDATE/DELETE 없음. 정정=역분개(`rvrs_entr_id`)/역델타(`rvrs_dlta_id`) INSERT (source: wallet-bank/db/backend/ledger.md).
- **대사 근거** — 분개는 `qty_bef`/`qty_aft` 잔액 스냅샷 보유, `Σ entr_qty ≈ avbl_qty` (source: wallet-bank/db/backend/ledger.md).
- **온체인 실행 배타 경로** — `daw_onch_exec_l` 1건은 배치귀속(`_btch_l`) 또는 거래직접(`_tx_l`) 중 정확히 한쪽 (source: wallet-bank/db/backend/transaction.md).

## Details — 도메인별 테이블 인벤토리

### 1. 마스터 (source: wallet-bank/db/backend/master.md)
- `daw_blkc_ntwk_m` 블록체인네트워크 (멀티체인 기준 마스터, `cnfm_cnt` 확정컨펌수)
- `daw_dspl_ast_m` 표시자산 (고객 노출 통합 단위)
- `daw_tkn_m` 토큰 (체인별 실제 토큰, `dcml_cnt`·`cntr_addr`·`tkn_stnd_dvcd`)
- `daw_smrt_cntr_m` 스마트컨트랙트 [확장 P2]
- `daw_vasp_m` VASP (외부 출금 상대방, `trvl_rule_yn`)

### 2. 계좌/자산 (source: wallet-bank/db/backend/account-asset.md)
- `daw_acnt_m` 디지털자산계정 (고객 등록 단위, `ACT-`, `cstno` NOT NULL)
- `daw_ast_m` 디지털자산 (정체성·`dpst_addr`·상태·동결·AML·화이트리스트)
- `daw_ast_bal_m` 고객잔액 (DB SSOT, `avbl_qty`/`lock_qty`)
- `daw_cstd_map_m` 커스터디매핑 (ADR-006, `cstd_prvd_dvcd`·`ext_acnt_id`·`ext_ast_id`) → [[entities/wallet-bank/custody-mapping]]
- `daw_acnt_cls_l` 계좌해지내역 [확장 P2]

### 3. 원장 (source: wallet-bank/db/backend/ledger.md) → [[entities/wallet-bank/ledger-netting]]
- `daw_ldgr_entr_l` 원장분개 (append-only, 잔액 근거)
- `daw_ldgr_bal_l` 원장일별수량 스냅샷 [확장 P2]
- `daw_dlta_entr_l` 델타원장 (온체인 실제 이동, from→to, `nttg_btch_id` NULL=미네팅)
- `daw_nttg_btch_l` 네팅배치 (그룹 SUM(mv_qty), net_qty 만 온체인 1회 전송)
- `daw_dlta_btch_map_l` 델타-배치 매핑

### 4. 거래 (source: wallet-bank/db/backend/transaction.md) → [[entities/wallet-bank/travel-rule-flow]]
- `daw_tx_l` 거래 상태머신 (PENDING→CONFIRMED/FAILED/CANCELLED/CHECKING)
- `daw_tx_ext_dst_l` 거래외부목적지 (EXTERNAL_WITHDRAW류만, VASP FK)
- `daw_onch_exec_l` 온체인실행 공통
- `daw_onch_exec_btch_l` / `daw_onch_exec_tx_l` 실행 귀속 (배타)

### 5. 통제 (source: wallet-bank/db/backend/control.md)
- `daw_hold_l` 보류 (avbl→lock, 외부 법적·계약적 사유)
- `daw_rstr_l` 거래제한 (주체 단위 차단, 잔액 불변, ADR-003)
- `daw_aml_scrn_l` AML심사 [확장 P1 필수]
- `daw_ldgr_chng_h` 원장변경이력 (설정·정책 감사, 결재 `aprv_empno` 필수)
- `daw_susp_l` 별단원장 (ADR-004, 오류·실패 자금 임시보관)
- `daw_susp_rfnd_l` 별단환급처리

### 6. 시스템자산 (source: wallet-bank/db/backend/system-asset.md)
- `daw_sys_acnt_m` 시스템계정 (HOT_OPS/FEE_MGT/RESERVE, `SYS-`)
- `daw_sys_ast_bal_m` 시스템자산잔액 (Redis SSOT + DB 복구 기준점)

### 7. 인프라 (source: wallet-bank/db/backend/infra.md)
- `daw_evnt_l`(추정 명 — Outbox 이벤트, ADR-002, UUID v7, `evnt_stcd` P/D/F/S)
- `daw_onch_sync_l` 온체인동기화 (잔액 대사, diff 감지) [확장 P2]

> **감사 컬럼 공통** — 대부분 테이블에 `frst_reg_empno/brcd`·`last_chng_empno/brcd` 4종 감사 컬럼. 자동거래 직원번호 `999999` (source: wallet-bank/db/backend/*; control.md).

## Related Pages

- [[vendors/wallet-bank/overview]]
- [[entities/wallet-bank/ledger-netting]]
- [[entities/wallet-bank/custody-mapping]]
- [[entities/wallet-bank/travel-rule-flow]]

## Sources

- `wallet-bank/db/backend/master.md`
- `wallet-bank/db/backend/account-asset.md`
- `wallet-bank/db/backend/ledger.md`
- `wallet-bank/db/backend/transaction.md`
- `wallet-bank/db/backend/control.md`
- `wallet-bank/db/backend/system-asset.md`
- `wallet-bank/db/backend/infra.md`

## Open Questions

- `daw_evnt_l` (Outbox) 테이블의 물리명은 원본에 헤더 명시 없음 — 확인 필요. [[open-questions/wallet-bank]]
- `[확장 P1/P2]` 미구현 테이블 경계 — [[open-questions/wallet-bank]]
