---
type: entity
vendor: wallet-bank
status: draft
tags: [custody, integration, architecture]
stage_introduced: 155
last_updated_stage: 155
source_count: 1
related:
  - data-model
  - overview
---
# Custody Mapping (daw-core)

> 커스터디 추상화 계층 `daw_cstd_map_m`. 코어가 특정 커스터디 솔루션에 의존하지 않도록 외부 참조를 별도 매핑 테이블로 격리한다 (ADR-006) (source: wallet-bank/db/backend/account-asset.md).

## Summary

`daw_ast_m`(내부 자산 정체성)과 외부 커스터디 시스템 참조를 `daw_cstd_map_m` 이 N:1 로 매핑한다. `cstd_prvd_dvcd` 로 제공사(01:FIREBLOCKS, 02:SELF …)를 구분하고, `ext_acnt_id`(예: Fireblocks vaultAccountId)·`ext_ast_id`(예: `KRWK_ETH`)로 외부 시스템을 참조한다. 커스터디 교체 가능하도록 격리 (source: wallet-bank/db/backend/account-asset.md).

## Key Concepts

- **격리 목적 (ADR-006)** — Wallet+WalletAddress+WalletBalance 통합 시 주소를 Asset 에 역정규화하되, 외부 커스터디 참조는 매핑 테이블로 분리해 교체 가능 (source: wallet-bank/db/backend/account-asset.md).
- **유일성** — `UNIQUE (ast_id, cstd_prvd_dvcd)` — 한 자산은 제공사별 매핑 1개 (source: wallet-bank/db/backend/account-asset.md).
- **Fireblocks 대응** — `ext_acnt_id` = Fireblocks `vaultAccountId`, `ext_ast_id` = Fireblocks 자산 ID(`KRWK_ETH` 형식) (source: wallet-bank/db/backend/account-asset.md). → [[entities/fireblocks/vault-account]]

## Details

코어는 내부 `ast_id`/`dpst_addr` 만 알고, 온체인 서명·키 관리는 외부 커스터디(Fireblocks 등)에 위임한다. BCM 이 실제 솔루션 연동을 수행하며 코어는 솔루션을 모르는 상태로 추상화된다 (source: wallet-bank/설계/설계.txt; db/backend/account-asset.md).

## Related Pages

- [[vendors/wallet-bank/data-model]]
- [[vendors/wallet-bank/overview]]
- [[entities/fireblocks/vault-account]] — `ext_acnt_id` 로 참조되는 Fireblocks 볼트 계정
- [[vendors/fireblocks/overview]]

## Sources

- `wallet-bank/db/backend/account-asset.md`
- `wallet-bank/설계/설계.txt`

## Open Questions

- 02:SELF(자체 커스터디) 외 제공사 코드 체계는 원본 미완결 → [[open-questions/wallet-bank]]
