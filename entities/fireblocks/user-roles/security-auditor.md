# Entity: Security Auditor (Fireblocks user role)

## Summary

감사자·보안 인력에게 Console의 read-only 접근을 제공하는 role. Viewer보다 넓은 view 범위로 **Settings, Policies, Fireblocks Security Posture Management (FSPM)** 까지 열람 가능하지만 어떤 action도 수행할 수 없다. 할당은 `Settings > Users`에서 다른 role과 동일하게 수행 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.4).

## Permissions / Capabilities

- Read-only access to Console including **Settings, Policies, FSPM** (p.4)
- Reviewing all workspace settings for compliance audits (p.4)
- Monitoring policy configurations (p.4)
- Auditing workspace activity with full visibility (p.4)
- View all workspace users (p.6)
- View all workspace settings including audit logs (p.7)

## Restrictions

- 어떤 action도 수행 불가 (p.4)
- User management 권한 전무 (p.5)
- Export transaction history: N (p.6) — Viewer와 달리 N
- 트랜잭션·자산·workspace 관리 권한 전무 (p.6–8)
- `Require the Fireblocks mobile app: N` (p.5)

## Related Pages

- [[vendors/fireblocks/security]] §"FSPM" — FSPM 은 별도 entity 미생성, security hub 가 owning page (entity-min discipline)
- [[vendors/fireblocks/security]] §"Stage 8 — Audit Log 정식 명세" — Audit Log 는 별도 entity 미생성, security hub 가 owning page
- [[entities/fireblocks/user-roles/security-admin]] — Security Admin은 같은 영역을 관리(쓰기) 가능
- [[entities/fireblocks/user-roles/viewer]] — 더 좁은 view-only
- [[vendors/fireblocks/user-management]]

## Stage 10 — FSPM Access 정식 명세 (★ Q-S13 부분 ANSWERED)

`fspm.md` (Stage 10 ingest, `fireblocks-security-posture-management-fspm.md`):

### FSPM Access Plane

p.1: "**Permissions**: Requires one of the following roles: Owner, Admin, Non-Signing Admin, **or Security Auditor**."

→ **Security Auditor 가 FSPM access role 에 포함 확인**. Stage 8 `audit-log.md` 의 "Owner/Admin/NSA only" Audit Log plane 과 **별개의 plane** 으로 분리:

| Plane | Access |
|---|---|
| **Audit Log** (post-incident forensic) | Owner / Admin / NS-Admin (Stage 8) |
| **FSPM** (pre-incident posture monitoring) | Owner / Admin / NS-Admin / **Security Auditor** (Stage 10) |

→ Security Auditor 는 **FSPM 만** 가능, Audit Log 는 명시되지 않음. 두 평면이 명확히 분리됨.

### FSPM 의 가치 정합

FSPM 의 monitoring scope (6 영역) 중 Security Auditor 의 read-only 책임과 정합:
- Over-permissive and stale policies
- Unused users and access gaps
- Weak approval group thresholds
- Risky unused workspace settings
- Risky token allowances
- Outdated security software

→ Security Auditor 는 FSPM finding 검토 + Accept risk 또는 권고 가능 (단 자체 remediate 는 다른 role 필요 — read-only).

## Sources (Stage 10 추가)
- `2026-05-18__support-fireblocks-io__fireblocks-security-posture-management-fspm.md`, p.1 (Stage 10: Security Auditor 가 FSPM access role 에 포함)

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.4, p.5–8
