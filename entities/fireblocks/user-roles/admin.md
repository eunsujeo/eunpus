# Entity: Admin (Fireblocks user role)

## Summary

모든 Signer 권한을 가지면서 추가로 네트워크 확장·whitelist 승인·workspace settings 편집·사용자 추가·inbound 트랜잭션 manual complete가 가능한 역할. Admin Quorum의 멤버로 workspace·Policy 변경 승인에 참여한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.2).

## Permissions / Capabilities

- **모든 Signer 권한** 포함 (initiate / approve / sign) (p.2, p.6)
- Expand the network; approve new whitelisted addresses (p.2)
- Edit all workspace settings (p.2)
- Add new workspace users `Y (Q)` (p.2, p.5)
- Manually confirm and credit inbound transactions (p.2)
- Independent initiation and signing per Policy (p.2)
- Approving transactions initiated and signed by other users (p.2)
- Part of Admin Quorum for workspace & Policy changes (Policy 변경에는 Owner도 필요) (p.2, p.7)
- **Delete users `Y (AG)`** — Approval group이 위임된 경우 (`user-roles.md`, p.5; `delete-users.md`, p.1–2). 위임 절차: `Settings > Quorums > Approval groups > User management > Delete users` row에서 `Requires workspace owner approval` uncheck
- Edit other users' name/email (Q 흐름; "Admin-level users") (`edit-users.md`, p.1)
- **Re-enroll mobile devices** ("Admin-level users") — `Y (Q)` (`re-enroll-a-users-mobile-device.md`, p.1; `user-roles.md`, p.5)
- Owner 이전 시 신임 Owner의 사전 role 후보 (Admin 또는 Signer) (`transfer-workspace-owner.md`, p.1)
- **Recovery passphrase 생성 필수** (initial user setup) (`recovery-passphrase.md`, p.1)
- Recovery passphrase mobile app self-service reset 가능 (`reset-an-admin-or-signers-recovery-passphrase.md`, p.1)
- Risk assessment (audit logs) 검토 권한 (`recovery-passphrase.md`, p.3)
- Mobile app approval 표면: workspace settings changes (new connections, policy, Admin Quorum 등) (`fireblocks-mobile-app-signing-and-approving.md`, p.3)
- **Emergency Workspace Freeze 가능** (Admin-level 4 role 중 하나) (`freeze-workspace.md`, p.1; `user-roles.md`, p.8). Unfreeze는 불가 — Owner only
- Re-enroll devices `Y (Q)` / Request re-enroll `Y` (p.5)
- Freeze the workspace / Freeze-unfreeze transactions (p.6, p.8)
- Add/whitelist destinations `Y (Q)`, P2P Network connection `Y (Q)` (p.7)
- AML / Travel Rule connections·policies 추가·수정 (p.7–8)

## Restrictions

- **Provision MPC signing keys는 Owner 단독** — Admin은 ✗ (p.5)
- Modify API User/Key IP Allowlist — Owner/Security Admin만 (p.5)
- Reset 2FA — Owner/Security Admin만 (p.5)
- Approve re-enrolling devices — Owner와 Security Admin(Q)만 (p.6)

## Related Pages

- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/signer]] — Admin은 Signer 권한을 상속
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/approval-group]] — Delete users `Y (AG)`의 위임 근거
- [[entities/fireblocks/policy]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2, p.5–8
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (Add user 가능 actor 본문 명시)
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1 ("Admin-level users" 표현)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1–2 (Delete AG 위임 절차)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: device 재등록 actor)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1 (Stage 3: Owner 이전 사전 role)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1, p.3 (Stage 5)
- `2026-05-18__support-fireblocks-io__reset-an-admin-or-signers-recovery-passphrase.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.3 (Stage 5)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Freeze 권한)

## Open Questions

- Q-2026-05-18-G03 — Approval group과 Admin Quorum의 멤버십·우선순위
- Q-2026-05-18-L01 — "Admin-level users"의 정확한 role 집합
