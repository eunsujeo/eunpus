---
type: user-role
vendor: fireblocks
status: stable
tags: [user-role, security-admin, security]
stage_introduced: 6
last_updated_stage: 6
source_count: 5
related:
  - 2fa
  - admin-quorum
  - ip-allowlist
  - owner
  - security
  - security-auditor
  - user-management
---
# Entity: Security Admin (Fireblocks user role)

## Summary

IT/보안 인력을 위한 플랫폼 보안·운영 관리 role. user/2FA/IP allowlist/FSPM을 관리하지만 **MPC 키를 보유하지 않으며 트랜잭션을 initiate하거나 sign할 수 없다.** Console 로그인 시 자동으로 **Security Center** 페이지로 랜딩한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.4).

## Permissions / Capabilities

- Managing Console and API user lifecycles (create, delete, edit) (`user-roles.md`, p.4)
- Add Console or API users `Y (Q)` — 권한표 명시. 단 Add users 본문에는 SecAdmin이 actor로 등장하지 않음 (`user-roles.md`, p.5 vs `add-users.md`, p.1) — Q-2026-05-18-L02
- Delete users (Y) — Owner와 함께 default로 가능한 두 role 중 하나 (`user-roles.md`, p.5; `delete-users.md`는 SecAdmin 미명시)
- Edit user details, Add/manage user groups (`user-roles.md`, p.5; `edit-users.md` p.1 "Admin-level users"에 해당하는 것으로 추정)
- **Resetting 2FA** — Owner와 함께 (p.4, p.5)
- **Modify API User/Key IP Allowlist** — Owner와 함께 (p.5)
- Configure IP allowlists for Console and API users (p.4)
- Managing **FSPM** and findings (p.4)
- Participating in **Admin Quorum** for workspace and policy changes (p.4, p.7)
- Change Admin Quorum / Approve workspace policies, Policy changes `Y (Q+O)` (p.7)
- Re-enroll devices `Y (Q)` / Approve re-enrolling devices `Y (Q)` / Request re-enroll `Y` (p.5–6)
- View all workspace users / View all workspace settings incl. audit logs (p.6, p.7)
- **Freeze the workspace** (`user-roles.md`, p.8; `freeze-workspace.md`, p.1 — Admin-level 4 role 중 하나로 명시. Unfreeze는 Owner only)
- Require the Fireblocks mobile app `Y`, Require passphrase `Y` (p.5)

## Restrictions

- **MPC 키 미보유; Initiate / Approve / Sign transactions 모두 N** (p.4, p.6)
- Provision MPC signing keys: N (p.5)
- Transactions 관련 모든 권한 N (cancel·freeze·notes·export·automation·smart transfer 등) (p.6)
- Vault account / asset wallet 관련 모든 권한 N (p.6–7)
- Add/whitelist destination, P2P Network connection: N (p.7)
- Add or approve EVM/non-EVM asset: N (p.7)
- Add or modify AML, Travel Rule connections·policies: N (p.7–8)
- View or retrieve vault public keys via API: N (p.8)

## Related Pages

- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/ip-allowlist]]
- [[vendors/fireblocks/security]] §"FSPM" — FSPM 은 별도 entity 미생성, security hub 가 owning page (entity-min discipline)
- [[entities/fireblocks/2fa]]
- [[entities/fireblocks/user-roles/security-auditor]]
- [[entities/fireblocks/user-roles/owner]] — Reset 2FA·IP Allowlist를 공유
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.4, p.5–8
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (본문 actor 누락 vs 권한표 ✓ 불일치)
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1 ("Admin-level users" 표현 — 정확한 포함 여부 모호)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (Delete 본문은 Owner만 명시)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Admin-level 4 role)

## Open Questions

- Q-2026-05-18-G04 — Security Admin이 Admin Quorum에 자동 가입되는지, 별도 지정인지
- Q-2026-05-18-L01 — "Admin-level users"에 Security Admin이 포함되는지
- Q-2026-05-18-L02 — Add users 본문에 SecAdmin이 빠진 것이 의도된 narrow 표기인지 본문 누락인지
