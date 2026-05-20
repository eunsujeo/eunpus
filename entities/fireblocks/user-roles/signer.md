# Entity: Signer (Fireblocks user role)

## Summary

트랜잭션을 initiate / approve / sign 모두 수행할 수 있는 핵심 서명자 role. Console과 mobile 또는 **API Co-signer와 Callback Handler를 통해 programmatic하게** 동작 가능하다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.3).

## Permissions / Capabilities

- Initiate transactions (Y) (p.6)
- Approve transactions (Y) (p.6)
- **Sign transactions** (Y) — Owner/Admin/Signer만 (p.6)
- Cancel transactions, Edit transaction notes, Export transaction history (p.6)
- Create/manage automation rules, Create/Fund smart transfer tickets (p.6)
- Request to add whitelisted addresses and other new connections (p.3)
- Create vault accounts, Rename, Hide/unhide vault accounts (p.6–7)
- Add asset wallet (TL 제약 없음) (p.7)
- Add/whitelist destination `Y (Q)` (p.7)
- Add or approve EVM / non-EVM asset (p.7)
- View or retrieve vault public keys via API (p.8)
- Console+mobile 또는 **API Co-signer + Callback Handler**로 동작 가능 (p.3)
- **Owner 이전 시 신임 Owner의 사전 role 후보** (Admin 또는 Signer) (`transfer-workspace-owner.md`, p.1)
- **Recovery passphrase 생성 필수** (initial user setup) (`recovery-passphrase.md`, p.1)
- Recovery passphrase mobile app self-service reset (`reset-an-admin-or-signers-recovery-passphrase.md`, p.1)
- Mobile app에서 transaction 서명 모든 종류 가능 (Transfers, Contract calls, Mint/Burn, Staking, Typed/raw messages) (`fireblocks-mobile-app-signing-and-approving.md`, p.2–3)

## Restrictions

- Provision MPC signing keys: N — Owner 단독 (p.5)
- User management 권한 없음 (Add/Delete/Edit users, groups, IP Allowlist 등 모두 N) (p.5)
- Freeze/unfreeze transactions: N (개별 거래 freeze는 O/A/NSA만) (p.6)
- Re-enroll devices: N, Request re-enroll: N (p.5)
- Add P2P Network connection: N (p.7)
- Workspace management 권한 없음 (View settings, Admin Quorum 참여, AML/Travel Rule 등 모두 N) (p.7–8)

## Related Pages

- [[entities/fireblocks/mpc-key-share]] — Signer는 키 share 보유
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/user-roles/admin]] — Admin은 Signer 권한을 상속
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3, p.5–8
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1 (Stage 3: Owner 이전 사전 role)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__reset-an-admin-or-signers-recovery-passphrase.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.2–3 (Stage 5)

## Open Questions

- Q-2026-05-18-C01 — Signer가 API Co-signer + Callback Handler로 동작할 때의 payload/인증/응답 형식
