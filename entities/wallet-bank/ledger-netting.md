---
type: entity
vendor: wallet-bank
status: draft
tags: [transaction, architecture, audit]
stage_introduced: 155
last_updated_stage: 155
source_count: 2
related:
  - data-model
  - overview
---
# Ledger & Netting (daw-core)

> 이중 원장 구조: 회계용 **원장분개**(`daw_ldgr_entr_l`) 와 온체인 이동용 **델타원장**(`daw_dlta_entr_l`) + **네팅배치**(`daw_nttg_btch_l`). 둘 다 append-only (source: wallet-bank/db/backend/ledger.md).

## Summary

원장분개는 잔액 변동 회계 근거(불변, `Σ entr_qty ≈ avbl_qty`), 델타원장은 온체인 자산↔자산 실제 이동분을 기록한다. 옴니버스 내부 장부이동은 델타 행을 만들지 않고, 실제 온체인 이동만 델타로 남긴다. 네팅배치가 미네팅 델타를 (network, token, from, to) 그룹키로 SUM 해 순액만 온체인 1회 전송(가스비 절감) (source: wallet-bank/db/backend/ledger.md).

## Key Concepts

- **방향 표현** — 부호 코드 대신 `from_ast_id`→`to_ast_id` 쌍으로 방향 표현, `mv_qty` 는 항상 양수 절대값 (source: wallet-bank/db/backend/ledger.md).
- **미네팅 상태 표현** — `nttg_btch_id IS NULL` = 미네팅 후보. 배치 귀속 시 write-once. 상태 UPDATE 없이 NULL 여부로 미네팅/네팅 구분 → append-only 유지 (source: wallet-bank/db/backend/ledger.md).
- **취소 = 역행 INSERT** — 실패 보상 시 `rvrs_dlta_id` 로 부호 반대 역델타 INSERT (원장분개 `rvrs_entr_id` 와 동일 패턴) (source: wallet-bank/db/backend/ledger.md).
- **배치-델타 정합** — `daw_nttg_btch_l.dlta_cnt` 로 배치가 소비한 델타 행 수 검증. 미네팅 조회는 `daw_dlta_entr_l LEFT JOIN daw_dlta_btch_map_l WHERE dlta_id IS NULL` (source: wallet-bank/db/backend/ledger.md).
- **온체인 해시 귀속** — 배치 확정 시 `bcm_tx_hash` 기록, 온체인 실행은 `daw_onch_exec_btch_l` 로 귀속 (source: wallet-bank/db/backend/ledger.md; transaction.md).

## Details

### 원장분개 (daw_ldgr_entr_l)
- 거래마다 분개 생성, `qty_bef`/`qty_aft` 잔액 스냅샷(대사 근거), `entr_qty` base unit 정수.
- `rvrs_yn`/`rvrs_entr_id` 로 역분개(불변원장 정정) (source: wallet-bank/db/backend/ledger.md).

### 델타원장 → 네팅배치 → 온체인실행 경로
```
daw_dlta_entr_l (nttg_btch_id NULL)
   └─ SUM by (network, token, from, to)
      → daw_nttg_btch_l (net_qty, 1행=온체인 1건)
         → daw_onch_exec_btch_l → daw_onch_exec_l (tx_hash, cnfm_cnt)
```
거래 직접 실행(네팅 미경유)은 `daw_tx_l → daw_onch_exec_tx_l → daw_onch_exec_l` 경로 (source: wallet-bank/db/backend/transaction.md).

### 일별 스냅샷
`daw_ldgr_bal_l` 는 마감 기준 일별 수량 스냅샷 (avbl/pend/lock/tot) [확장 P2] (source: wallet-bank/db/backend/ledger.md).

## Related Pages

- [[vendors/wallet-bank/data-model]]
- [[vendors/wallet-bank/overview]]
- [[entities/wallet-bank/travel-rule-flow]]

## Sources

- `wallet-bank/db/backend/ledger.md`
- `wallet-bank/db/backend/transaction.md`

## Open Questions

- 네팅 주기·트리거 조건은 원본 미명시 → [[open-questions/wallet-bank]]
