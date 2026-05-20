# Entity: Non-Signing Admin (NSA, Fireblocks user role)

## Summary

트랜잭션 승인과 관리 작업을 수행하지만 **MPC key share를 보유하지 않는** 관리자 role. Policy에서 second authorizer로 정의될 수 있으며, Policy가 designated signer를 지정한 트랜잭션 타입에 한해 initiate가 가능하다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.2–3).

## Permissions / Capabilities

- Approve transactions (Y) (p.2, p.6)
- Approve new whitelisted addresses, exchange accounts, Fireblocks P2P Network connections (p.2)
- **Add new workspace users `Y (Q)`** — Add users 본문도 NSA를 actor로 명시 (`user-roles.md`, p.2, p.5; `add-users.md`, p.1). 7-day expiry, Owner mandatory + countable
- Edit other users' name/email (Q 흐름; "Admin-level users" 범주) (`edit-users.md`, p.1; `user-roles.md`, p.5)
- **Second authorizer**로 Policy에 정의 가능 (p.2)
- **Designated signer**가 있으면 트랜잭션 initiate 가능 `Y (NS)` (p.2, p.6)
- Part of Admin Quorum for workspace changes (p.3, p.7)
- Mainnet Co-signer 또는 testnet **Fireblocks Communal API Co-signer**에서 workspace 설정 승인용 API user로 사용 (p.3)
- Edit user details, Add/manage user groups (p.5)
- Re-enroll devices `Y (Q)` / Request re-enroll `Y` (p.5)
- View all workspace users / View all workspace settings incl. audit logs (p.6, p.7)
- Cancel transactions, Freeze/unfreeze transactions, Edit transaction notes, Export history (p.6)
- Create automation rules, Create smart transfer tickets, Fund smart transfer tickets `Y (NS)` (p.6)
- Create vault accounts, Rename, Hide/unhide, Add asset wallet `Y (TL)` (p.6–7)
- Add/whitelist destination `Y (Q)`, P2P Network connection `Y (Q)` (p.7)
- Add or approve EVM / non-EVM asset (p.7)
- Change Admin Quorum / Approve Policy changes `Y (Q+O)` (p.7)
- Add or modify AML, Travel Rule connections·policies (p.7–8)
- Freeze the workspace (p.8)
- View or retrieve vault public keys via API (p.8)

## Restrictions

- **MPC key share 미보유** — `Sign transactions: N`, `Provision MPC signing keys: N` (p.2, p.5–6)
- `Require a Fireblocks mobile app passphrase: N` (Console·mobile 모두 사용 가능하지만 passphrase 미요구) (p.5)
- Initiate transactions에서 NS 조건이 충족되어야 함; internal exchange transfer 제외 모든 타입 가능 (p.5)
- Add asset wallet 시 TL — Algorand/Ripple/Solana/Stellar 토큰 wallet 불가 (p.5, p.7)
- Modify API User/Key IP Allowlist, Reset 2FA, Approve re-enrolling devices 불가 (`user-roles.md`, p.5–6)
- **Delete users: N** — 권한표상 NSA는 user 삭제 권한이 없음 (`user-roles.md`, p.5). Delete users 본문은 NSA를 언급하지 않음 (`delete-users.md`, p.1)
- **Recovery passphrase 불필요** (Stage 5) — `recovery-passphrase.md` p.1는 "Owner, Admins, and Signers must create a recovery passphrase"만 명시. NSA는 MPC 키 미보유이므로 cloud backup 대상이 아닌 것으로 추정 (본 자료 직접 명시는 없음)
- **Emergency Workspace Freeze 가능** (Admin-level 4 role 중 하나) (`freeze-workspace.md`, p.1; `user-roles.md`, p.8)

## Related Pages

- [[entities/fireblocks/designated-signer]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/sandbox-workspace]] — Sandbox에서는 NSA의 권한이 다름
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2–3, p.5–8
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1 (Stage 5: NSA 미명시)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Freeze 권한)

## Open Questions

- Q-2026-05-18-P01 — second authorizer의 룰 표현 문법
- Q-2026-05-18-P02 — "internal exchange transfer 제외" 표현의 정확한 트랜잭션 타입 정의 위치
- Q-2026-05-18-C02 — Fireblocks Communal API Co-signer가 testnet 한정 공유 인프라인지
