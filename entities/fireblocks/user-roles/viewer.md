# Entity: Viewer (Fireblocks user role)

## Summary

Workspace activity 전반에 대한 **view-only** 권한만 가지는 role. Settings 접근, 신규 트랜잭션 제출, connection 승인 제출 모두 불가. Console과 API를 통한 감사 용도에 적합 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.3–4).

## Permissions / Capabilities

- View workspace activity (p.3–4)
- Export transaction history (Viewer는 Yes) (p.6)

## Restrictions

- Settings 접근 불가 (p.3)
- 신규 트랜잭션 제출 불가 (p.3)
- Connection 승인 제출 불가 (p.3)
- User management 권한 전무 (p.5)
- Initiate / Approve / Sign / Cancel transactions 모두 N (p.6)
- Vault account 생성·rename·hide·asset wallet 추가 모두 N (p.6–7)
- Workspace management 권한 전무 (p.7–8)
- `Require the Fireblocks mobile app: N`, `Require passphrase: N` (p.5)

## Related Pages

- [[entities/fireblocks/user-roles/security-auditor]] — Viewer보다 더 넓은 read-only 범위 (Settings·Policies·FSPM 포함)
- [[entities/fireblocks/sandbox-workspace]] — Sandbox에서 사용 가능한 3 role 중 하나
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3–4, p.5–8
