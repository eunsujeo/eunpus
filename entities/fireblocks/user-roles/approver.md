# Entity: Approver (Fireblocks user role)

## Summary

트랜잭션을 initiate하고 approve할 수 있지만 **sign은 불가**한 역할. Policy의 second authorizer로 정의 가능하며, 트랜잭션 승인 워크플로우와 일반 계정 관리에 적합 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.3).

## Permissions / Capabilities

- Initiate transactions (Y) (p.6)
- Approve transactions (Y) (p.6)
- Request to add whitelisted addresses and other new connections (p.3)
- **Second authorizer**로 Policy에 정의 가능 (p.3)
- Cancel transactions, Edit transaction notes, Export transaction history (p.6)
- Create vault accounts, Rename vault accounts, Hide/unhide vault accounts (p.6–7)
- Add asset wallet `Y (TL)` (p.7)
- Add/whitelist destination `Y (Q)` (p.7)

## Restrictions

- **Sign transactions: N** (p.6)
- Provision MPC signing keys: N (p.5)
- User management 권한 없음 (p.5)
- Re-enroll devices / Request re-enroll: N (p.5)
- Create/manage automation rules: N (p.6)
- Create/Fund smart transfer tickets: N (p.6)
- Add P2P Network connection: N (p.7)
- Add or approve EVM / non-EVM asset: N (p.7)
- Workspace management 권한 없음 (p.7–8)
- Add asset wallet에 TL 제약 — Algorand/Ripple/Solana/Stellar 토큰 wallet 불가 (p.5, p.7)
- `Require a Fireblocks mobile app passphrase: N` (p.5)

## Related Pages

- [[entities/fireblocks/policy]] — second authorizer 메커니즘
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/user-roles/signer]] — initiate/approve는 가능하지만 sign이 다름
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3, p.5–8

## Open Questions

- Q-2026-05-18-P01 — second authorizer 룰 표현 문법
