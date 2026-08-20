---
type: user-role
vendor: fireblocks
status: stable
tags: [user-role, owner, governance]
stage_introduced: 1
last_updated_stage: 8
source_count: 13
related:
  - admin
  - admin-quorum
  - lifecycle-events
  - mobile-device
  - mpc-key-share
  - policy
  - recovery-passphrase
  - risks
  - signer
  - user-management
  - workspace
  - workspace-keys-backup
---
# Entity: Owner (Fireblocks user role)

## Summary

Workspace당 정확히 1명 존재하는 최상위 거버넌스 역할. MPC 서명 디바이스·신규 사용자·Policy 변경을 승인하며, Vault의 셋업을 책임진다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1). **Fireblocks Support로만 임명**되며, role 변경·디바이스 마이그레이션·workspace unfreeze 시 Support와 영상 통화로 신원을 확인해야 한다 (p.2).

## Permissions / Capabilities

- **Provision MPC signing keys** — Owner 단독 권한 (`user-roles.md`, p.5)
- Approving new signing devices and MPC key shares (`user-roles.md`, p.2)
- Approving new workspace users (Admin Quorum과 함께; 권한표 `Y (Q)`) — 7-day expiry; Owner approval은 mandatory + threshold count 포함 (`user-roles.md`, p.2, p.5; `add-users.md`, p.1)
- **새 user가 signing role이면 그 user의 MPC device key share derivation을 별도 승인** (`add-users.md`, p.1)
- Approving new external connections (`user-roles.md`, p.2)
- Creating API keys (`user-roles.md`, p.2)
- **Deleting workspace users** — default 단독 권한, **즉시 + mobile approval 불요** (`user-roles.md`, p.5; `delete-users.md`, p.1)
- Enabling advanced workspace features (`user-roles.md`, p.2)
- Creating, editing, and approving workspace policies (`user-roles.md`, p.2)
- Approving Policy changes (Admin Quorum과 함께; `Y (Q+O)`) (`user-roles.md`, p.2, p.7)
- Edit other users' name/email (Q 흐름, Approval groups customizable) (`edit-users.md`, p.1)
- Resetting Two-Factor Authentication (2FA) — Owner와 Security Admin만 (`user-roles.md`, p.2, p.5)
- Modify API User/Key IP Allowlist — Owner와 Security Admin만 (`user-roles.md`, p.5)
- Re-enroll devices `Y (Q)` / Approve re-enrolling devices `Y` (`user-roles.md`, p.5–6)
- Initiate / Approve / Sign transactions 모두 `Y` (`user-roles.md`, p.6)
- Freeze the workspace / Freeze-unfreeze transactions / Emergency 작업 (`user-roles.md`, p.6, p.8)
- Add or modify AML connections and policies, Travel Rule connections and policies (`user-roles.md`, p.7–8)

## Restrictions

- Workspace당 **1명만** 존재 (`user-roles.md`, p.1)
- Role 임명/이전, mobile device 마이그레이션, workspace unfreeze 시 Fireblocks Support의 영상 통화 신원 확인 필요 (`user-roles.md`, p.2)
- **Owner는 자신의 name·email을 변경할 수 없음** (`edit-users.md`, p.1)
- **Owner 본인의 2FA reset**: Console 불가 → Fireblocks Support (`reset-a-users-2fa.md`, p.1)
- **Owner 본인의 mobile device 재등록**: Console 불가 → Fireblocks Support. 다른 workspace의 Owner라도 동일 (`re-enroll-a-users-mobile-device.md`, p.1)

## Workspace Freeze / Unfreeze (Stage 6 확정)

`freeze-workspace.md`, p.1:

- **Freeze**: Owner도 freeze 가능 (4 Admin-level role 중 하나) — 본인이 freeze 시 본인 role도 Viewer로 변경
- **Unfreeze**: **Owner만** 가능, **Fireblocks Support 경유 필수**
- Owner identity 절차 패턴 (Support 영상 통화 신원 확인)과 정합

Freeze 시점에 incoming transfer는 계속 수신 (Q-O05). 자세한 흐름은 [[vendors/fireblocks/lifecycle-events]] §"Emergency Workspace Freeze".

## Owner & Mobile App (Stage 5)

`about-the-fireblocks-mobile-app.md`, p.1–2 — Owner의 mobile app 관련 특수 사항:

- **Owner는 mobile app uninstall 시 단순 re-download/re-enroll로 회복 불가** — 별도 Key Share Recovery 절차 필요 (다른 사용자는 re-download + re-enroll로 회복)
- 본인 mobile device 재등록은 Console 불가 → Fireblocks Support (Stage 3 cross-ref, `re-enroll-a-users-mobile-device.md`, p.1)
- Self-service device migration이 활성화되어 있다면 사용 가능하나 일반 device migration 흐름에 의해 동작 (`device-migration.md`, p.1)

### Owner's Recovery Passphrase Reset (Stage 5)

`reset-the-owners-recovery-passphrase.md`, p.1–2 — Admin/Signer의 기본 reset 절차에 추가:

1. Mobile app self-service reset (Admin/Signer와 동일 흐름)
2. **기존 recovery package 파기 권장** (org-managed 또는 third-party DRS)
3. **새 recovery package 요청** to Fireblocks Support (offline backup 또는 third-party DRS recreate)

## Owner Identity 절차 (Stage 3)

Owner는 Fireblocks의 거버넌스 신뢰 루트로, **본인 관련 모든 절차는 Fireblocks Support 영상 통화 신원 확인을 요구**한다. 패턴은 일관되며 Console에서는 처리 불가:

| 절차 | 출처 |
|---|---|
| Owner role 임명 | `user-roles.md`, p.2 |
| Owner 본인 2FA reset | `reset-a-users-2fa.md`, p.1 |
| Owner 본인 mobile device 재등록 | `re-enroll-a-users-mobile-device.md`, p.1 |
| Owner role 이전 (현·신 양쪽) | `transfer-workspace-owner.md`, p.1 |
| Workspace unfreeze | `user-roles.md`, p.2 |
| Owner 본인 name/email 변경 | (불가) `edit-users.md`, p.1 |

### Owner 이전 (Transfer)

`transfer-workspace-owner.md`, p.1 — Console 불가, Support 경유 필수.

**사전 조건**:
- 신임 Owner가 [[entities/fireblocks/user-roles/admin]] 또는 [[entities/fireblocks/user-roles/signer]] role 보유
- 신임 Owner가 fully onboarded — MPC key shares 사전 생성
- 활성 Policies가 신임 Owner의 서명을 허용

**Workspace Keys Backup 분기점** (이전 전 강제 결정):
- [[entities/fireblocks/workspace-keys-backup]] 유지 또는 파기
- 파기 시 신임 Owner가 본인 [[entities/fireblocks/recovery-passphrase]]로 새 backup 생성

**검증**: 양쪽 Owner 모두 영상 통화 신원 확인 + 이전 승인. 신임 Owner는 본인 recovery passphrase verify.

**SLA**: 3–5 business days.

### Owner 부재 시 (Board Resolution Path)

현 Owner가 이전에 참여할 수 없을 때 (`transfer-workspace-owner.md`, p.1–2):

1. 회사 이사회의 stakeholder **quorum**이 Fireblocks Support에 연락
2. 공식 **board resolution**으로 신임 Owner 임명
3. Support 승인 후 동일 verification 진행

"Owner 부재"의 정의·검증 기준은 명시 없음 (Q-2026-05-18-O02). board resolution 형식 요건도 명시 없음 (Q-2026-05-18-O03).

### Owner의 DR 자산 보유 책임

- [[entities/fireblocks/recovery-passphrase]] — Owner의 비밀, Workspace Keys Backup 암호화 키, 이전 verify 자산
- [[entities/fireblocks/workspace-keys-backup]] — Owner가 생성·관리, 이전 시 유지/파기 결정 강제

## Related Pages

- [[entities/fireblocks/workspace]] — Owner가 정확히 1명 존재하는 단위
- [[entities/fireblocks/admin-quorum]] — Policy·workspace 변경의 동반 승인자
- [[entities/fireblocks/mpc-key-share]] — Owner가 provisioning을 단독 승인
- [[entities/fireblocks/policy]] — Owner가 작성·수정·승인
- [[entities/fireblocks/recovery-passphrase]] — Owner identity verify 자산
- [[entities/fireblocks/workspace-keys-backup]] — Owner 관리 DR 자산
- [[entities/fireblocks/mobile-device]] — Owner 본인 device는 Support 경유
- [[entities/fireblocks/user-roles/admin]] · [[entities/fireblocks/user-roles/signer]] — Owner 이전 시 신임 Owner의 사전 role
- [[vendors/fireblocks/user-management]] — 9 role 비교
- [[vendors/fireblocks/lifecycle-events]] — Owner Transfer 절차
- [[vendors/fireblocks/risks]] — Owner SPOF 분석

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1–2, p.5–8
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (Owner counting rule, 7-day expiry, MPC derivation 별도 승인)
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1 (Owner 본인 name/email 변경 불가)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (Owner-default 즉시 삭제 권한)
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1 (Stage 3: Owner의 2FA reset, 본인은 Support)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: Owner의 device 본인 절차)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1–2 (Stage 3: Owner 이전 + board resolution)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2 (Stage 5: Owner uninstall → Key Share Recovery)
- `2026-05-18__support-fireblocks-io__reset-the-owners-recovery-passphrase.md`, p.1–2 (Stage 5: Owner-specific reset)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1 (Stage 5: Owner setup 시 passphrase 필수)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.1 (Stage 5: Owner가 self-service migration 활성화)
- `2026-05-18__support-fireblocks-io__batch-approvals-and-signing.md`, p.1 (Stage 5: Owner-only Labs enablement)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Unfreeze Owner-only + Support)

## Stage 8 — Owner Best Practices 공식 명시 (`best-practices-for-choosing-user-roles.md`)

### Owner = MPC-level root (Q-M04 부분 응답)

`mpc-cmp.md`, p.6-7 (Stage 8 ingest):
> "For every user added with signing permissions (Admins and Signers), a new and unique set of three key shares is **derived from the Owner's set of key shares**."
> "**Admins and Signers have their own unique key share set. No two signing devices share the same key share set.**"

→ Owner 는 단순 governance root 가 아니라 **MPC key share derivation 의 cryptographic root** 이기도 함. 모든 Admin/Signer 의 3-share set 이 Owner set 에서 파생됨.

### Owner's 9 Recommended Responsibilities (공식 enumeration)

`best-practices-for-choosing-user-roles.md`, p.2 (인용):
1. Approving new signing devices and MPC key shares
2. Approving new workspace users
3. Approving new external connections
4. Creating API keys
5. Deleting workspace users
6. Enabling advanced workspace features
7. Creating, editing, and approving workspace policies
8. Resetting 2FA
9. Emergency operations: **freezing workspace, creating backup kit, recovery**

### Owner-touching = Support Video Call (4 액션 명시)

`best-practices-for-choosing-user-roles.md`, p.2 (직접 인용):
> "To **change the Owner** of a workspace, or when the Owner wants to **change their role**, **migrate to a new mobile device**, or **unfreeze the workspace**, the Owner must first verify their identity with Fireblocks Support by **scheduling a short video call**."

→ Stage 1-6 의 Support video call 패턴이 4-action 으로 공식 enumerate 됨. 본 entity 의 "Owner Identity 절차" 표와 일치.

### Single-Signer Warning (공식)

`best-practices-for-choosing-user-roles.md`, p.2:
> "If you are the only user in a workspace who can sign transactions, we recommend creating additional Admin or Signer users as a precautionary measure. This helps to prevent the **loss of access to your digital assets and financial operations** when the primary signer cannot access the workspace."

→ Single-Owner workspace 는 Fireblocks 가 공식적으로 SPOF 로 인정.

### Disclaimer

`best-practices-for-choosing-user-roles.md`, p.4:
> "Choosing user roles is **exclusively the Owner/company's decision and responsibility**." — Fireblocks 책임 없음.

## Stage 8 — Owner-Level Yubikey 강제 전파 (`fireblocks-yubikey-authentication.md`, p.1)

> "If you use or change to YubiKey authentication for the workspace **Owner**, all users added to the workspace afterward will be **required to use YubiKey authentication as well**."

→ Owner 의 mobile auth 선택이 **워크스페이스 전체 후속 사용자에게 강제 전파**되는 governance 패턴. Owner = workspace-wide 정책 origin.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__best-practices-for-choosing-user-roles.md`, p.1-4 (Stage 8: Owner 9 책임 + Support video call 4 액션 + Single-signer warning + disclaimer)
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.6-7 (Stage 8: Owner = MPC derivation root)
- `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.3 (Stage 8: 초기 워크스페이스 = Owner 단일 approver+signer)
- `2026-05-18__support-fireblocks-io__fireblocks-yubikey-authentication.md`, p.1 (Stage 8: Owner Yubikey 선택의 전파)

## Open Questions

- ~~Q-2026-05-18-G02~~ — **ANSWERED**: Owner는 mandatory + threshold count 포함 가능 (`add-users.md`, p.1)
- Q-2026-05-18-G04 — Admin Quorum 멤버 자격에 Owner가 자동 포함되는지
- Q-2026-05-18-L03 — Add와 Delete의 mobile approval 비대칭 이유
- Q-2026-05-18-O02 — Owner 부재의 정의·검증 기준
- Q-2026-05-18-O03 — Board resolution 형식 요건
- Q-2026-05-18-W02 — Recovery passphrase 분실 시 경로
