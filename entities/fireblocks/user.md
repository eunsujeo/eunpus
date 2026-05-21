---
type: entity
vendor: fireblocks
status: stable
tags: [misc]
stage_introduced: 3
last_updated_stage: 5
source_count: 14
related:
  - admin-quorum
  - api-user
  - approval-group
  - console-user
  - designated-signer
  - lifecycle-events
  - mpc-key-share
  - owner
  - policy
  - user-management
  - workspace
---
# Entity: User (Fireblocks)

## Summary

Fireblocks workspace에 등록된 주체. 정확히 하나의 [[entities/fireblocks/user-roles/owner]] 외 1–N명이 존재 가능하며, 각 user는 정확히 하나의 user role을 보유한다. lifecycle 상태는 `pending` (Owner+Quorum 승인 또는 setup 대기) → `active` → `deleted`로 진행된다 (sources: `add-users.md` p.1–2; `delete-users.md` p.1).

> 본 entity는 user의 lifecycle·식별·관계를 다룬다. role별 권한 카드는 [[entities/fireblocks/user-roles/owner]] 등 9개 role entity, lifecycle 절차는 [[vendors/fireblocks/lifecycle-events]] 참고.

## Key Concepts

- **User type** — Console user / API user (`user-roles.md`, p.1)
- **Role** — workspace당 1 user당 1 role. 직접 변경 불가 (`edit-users.md`, p.1)
- **Identity 속성** — first name, last name, email (`edit-users.md`, p.1)
- **Email uniqueness** — workspace 내에서 unique (`edit-users.md`, p.1)
- **Lifecycle status**
  - **pending** — Owner+Quorum 승인 또는 initial user setup 미완료
    - "Pending Owner MPC Key Approval" 상태가 `Settings > Users` Status 열에 표시 (`user-roles.md`, p.1)
  - **active** — 승인 + setup 완료 후 (`add-users.md`, p.2)
  - **deleted** — 삭제 후. user ID는 list에 남으며 access는 즉시 박탈 (`delete-users.md`, p.1)
- **Cross-workspace** — 한 자연인이 여러 workspace에 linked 될 수 있으나, name/email 변경은 현재 workspace에만 적용 (`edit-users.md`, p.1)

## Details

### 생성

1. Owner / Admin / NSA (본문 기준; 권한표는 +SecAdmin)가 Settings > Users에서 추가 (`add-users.md`, p.1; `user-roles.md`, p.5)
2. Owner + Admin Quorum이 mobile로 승인 (7일 expiry, Owner mandatory + countable) (`add-users.md`, p.1)
3. signing-capable role이면 Owner가 **MPC device key share derivation**도 별도 승인 (`add-users.md`, p.1)
4. 사용자가 initial user setup 완료 → status `active` (`add-users.md`, p.2)

### 수정

- 가능 필드: first name, last name, email (`edit-users.md`, p.1)
- **Role은 별도 절차** (delete+re-add 또는 Fireblocks Support) (`edit-users.md`, p.1–2)
- **Owner는 자신의 name/email 변경 불가** (`edit-users.md`, p.1)
- setup process **진행 중에는 변경 불가** (`edit-users.md`, p.1)
- Owner + Admin Quorum 승인. Approval groups로 흐름 customize 가능 (`edit-users.md`, p.1)
- 변경 알림 + 확인 메일 2회 (`edit-users.md`, p.1)

### 삭제

- 기본: Owner 단독, **즉시, mobile approval 불요** (`delete-users.md`, p.1)
- AG 위임 시 Admin도 가능 — `Settings > Quorums > Approval groups` (`delete-users.md`, p.1–2)
- 부수 효과 (`delete-users.md`, p.1):
  - workspace access 즉시 박탈
  - 다른 workspace 무영향
  - Fireblocks가 cloud-based key shares 삭제
  - activity는 transaction history / audit logs 보존
  - user ID 잔존 (status `deleted`)
- Policy rule이 그 user를 참조하면 rule이 block 상태로 전이 (`delete-users.md`, p.1)

### Mobile device lifecycle (Stage 3)

Console user는 mobile device를 통해 MPC key share·2FA·mobile app 인증을 수행한다 ([[entities/fireblocks/mobile-device]]). Device 재등록 lifecycle event는 별도 절차:

- Trigger: biometric 변경 / app 제거 / 새 device 설치 / 6-digit PIN 분실 (`re-enroll-a-users-mobile-device.md`, p.1)
- Actor: "Admin-level users" (다른 user의 device); Owner 본인은 Support 경유
- Signing role 사용자: Owner의 MPC re-approval + 사용자의 MPC re-registration 각 2-day window

### 2FA reset (Stage 3)

`reset-a-users-2fa.md`, p.1:

- 다른 user의 2FA reset: workspace Owner가 Console에서 수행
- Owner 본인 2FA reset: Console 불가 → Fireblocks Support
- email/password 변경 없음

### Recovery passphrase 요구 (Stage 5)

Setup 시 **Owner / Admin / Signer**는 recovery passphrase를 생성해야 한다 (`recovery-passphrase.md`, p.1). 이는 cloud backup 암호화 키이며 user identity의 일부:
- ≥10자, 대문자/숫자/특수문자 각 1+
- Mobile app에서 self-service reset 가능
- Verify Passphrase 주기 검증 (월 1회)

NSA / Approver / Editor / Viewer / Security Auditor / Security Admin은 본 자료에서 recovery passphrase 요구 명시 없음 — MPC 키 미보유이므로 불필요로 추정.

### Linked users / linked workspaces (Stage 5)

한 사용자(자연인)는 mobile device에 multiple workspace / user-role 페어로 등록 가능 (`linked-users-fireblocks-mobile-app.md`, p.1; `recovery-passphrase.md`, p.2). 각 페어는 device 측 independent storage (다른 passphrase 가능, verify 결과 user별 다름).

### Owner identity 자산 (Stage 3, Owner only)

특정 user가 Owner role을 보유하면 추가 자산을 갖는다:

- [[entities/fireblocks/recovery-passphrase]] — 본인의 비밀
- [[entities/fireblocks/workspace-keys-backup]] — 본인이 만든 백업
- Owner 이전 시 verify 대상 (`transfer-workspace-owner.md`, p.1)

### API user lifecycle (Stage 4)

본 entity는 Console user와 API user의 **통합 User 개념**을 다룬다. API user의 인증·자격증명·자동화 표면은 Console user와 다르며 별도 lifecycle 절차를 가진다 — 자세한 내용은 [[vendors/fireblocks/lifecycle-events]] §"API User lifecycle" 참조.

핵심 차이:
- 인증: CSR/X.509 + API key (vs email/password/SSO + 2FA)
- 네트워크 게이트: IP allowlist `/32 CIDR` (Console user에는 해당 없음)
- 자동화 표면: Co-signer 페어링 + Callback Handler (`add-api-users.md` p.1; `re-enrolling-api-users.md` p.1)
- Delete 부수 효과: API key 즉시 invalid, in-flight tx 실패, Co-signer 페어링 잔존 (`rename-and-delete-api-users.md`, p.2)
- AG 위임은 Console user Delete와 **동일 설정 평면** 사용 (`rename-and-delete-api-users.md`, p.2)

## Relations

```
User
  ├── has 1 ──► Role  (변경: delete+re-add 또는 Support)
  ├── governed by ──► Admin Quorum + Owner
  │                    └── customize ──► Approval Group
  ├── (signing) holds ──► MPC Key Share
  │                        └── delete ──► cloud-based key share 삭제
  ├── may be referenced by ──► Policy (designated signer / second authorizer)
  │                              └── on delete ──► rule blocked
  ├── activity logged in ──► Transaction History, Audit Logs (deletion 후에도 잔존)
  └── linked to ──► other Workspace(s) (별도 인증·메타데이터)
```

## Related Pages

- [[vendors/fireblocks/lifecycle-events]] — 생성·수정·삭제 절차
- [[vendors/fireblocks/user-management]] — 9 role 매트릭스
- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/console-user]] · [[entities/fireblocks/api-user]]
- [[entities/fireblocks/admin-quorum]] · [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/mpc-key-share]]
- [[entities/fireblocks/policy]] · [[entities/fireblocks/designated-signer]]
- 9 role entities — [[entities/fireblocks/user-roles/owner]] 외

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.5
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2 (Stage 4)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2 (Stage 4)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2 (Stage 4)
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1 (Stage 4)
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1 (Stage 3)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1 (Stage 3)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1–2 (Stage 5: passphrase 요구·linked user 격리)
- `2026-05-18__support-fireblocks-io__linked-users-fireblocks-mobile-app.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.1–2 (Stage 5)

## Open Questions

- Q-2026-05-18-L01 — "Admin-level users" 정의
- Q-2026-05-18-L04 — setup 진행 중 Edit 차단의 이유
- Q-2026-05-18-L05 — deleted user의 user ID 잔존과 email unique 룰의 재추가 충돌 가능성
- Q-2026-05-18-L06 — Approval groups customize 가능 항목 범위
