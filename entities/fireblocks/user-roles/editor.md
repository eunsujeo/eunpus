---
type: user-role
vendor: fireblocks
status: stable
tags: [user-role, editor]
source_count: 1
related:
  - api-user
  - designated-signer
  - policy
  - sandbox-workspace
  - transaction
  - user-management
  - vault-account
---
# Entity: Editor (Fireblocks user role)

## Summary

View-only 쿼리·wallet 추가·exchange 연결·새 vault address 생성·트랜잭션 cancel이 가능한 운영 보조 role. Policy가 designated signer를 지정한 트랜잭션 타입에 한해 initiate 가능하다. API 기반 워크플로우에 적합하며 internal exchange transfer를 제외한 모든 트랜잭션 타입을 지원한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.3).

## Permissions / Capabilities

- View-only 쿼리 수행 (p.3)
- Add wallets (단, Algorand 토큰 wallet 제외) (p.3)
- Connect exchange accounts (p.3)
- Create new vault addresses (p.3)
- Cancel transactions (p.3, p.6)
- **Designated signer**가 지정된 트랜잭션 타입에 한해 initiate `Y (NS)` (p.3, p.6)
- Edit transaction notes, Export transaction history (p.6)
- Create/manage automation rules (p.6)
- Create smart transfer tickets `Y (NS)`, Fund smart transfer tickets `Y (NS)` (p.6)
- Create vault accounts, Hide/unhide vault accounts (p.6–7)
- Add asset wallet `Y (TL)` (p.7)
- Add/whitelist destination `Y (Q)` (p.7)
- Add or approve EVM / non-EVM asset (p.7)

## Restrictions

- Approve transactions: N (p.6)
- **Sign transactions: N** (p.6)
- Provision MPC signing keys: N (p.5)
- User management 권한 없음 (p.5)
- Re-enroll devices: N (p.5)
- Freeze/unfreeze transactions: N (p.6)
- Rename vault accounts: N (p.7)
- Add P2P Network connection: N (p.7)
- Workspace management 권한 없음 (p.7–8)
- **TL** — Algorand/Ripple/Solana/Stellar 토큰 wallet 생성 불가 (p.5, p.7)
- 본문 설명상 wallet 추가에서 Algorand 토큰만 명시적 제외; TL 라벨은 4종 모두 포함 — 표현 차이 가능 (p.3 vs p.5)
- `Require the Fireblocks mobile app: N`, `Require passphrase: N` (p.5)

## Related Pages

- [[entities/fireblocks/designated-signer]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/vault-account]]
- [[entities/fireblocks/api-user]] — API 기반 워크플로우 적합
- [[entities/fireblocks/sandbox-workspace]] — Sandbox에서 사용 가능한 3 role 중 하나
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3, p.5–8

## Open Questions

- Q-2026-05-18-P02 — Editor가 NS 조건 없이 cancel만 할 수 있는 트랜잭션 vs. designated signer로 initiate 가능한 타입의 정확한 정의 위치
- Q-2026-05-18-O01 — 본문 "except for Algorand token wallets"와 표 TL "ALGO/XRP/SOL/XLM" 사이의 표현 차이 확인 필요
