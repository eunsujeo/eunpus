---
type: entity
vendor: fireblocks
status: stable
tags: [governance, policy]
stage_introduced: 1
last_updated_stage: 10
source_count: 14
related:
  - admin
  - approval-group
  - non-signing-admin
  - owner
  - policy
  - security-admin
  - user-management
---
# Entity: Admin Quorum (Fireblocks)

## Summary

Workspace·Policy 변경의 다수결 승인 그룹. 권한표의 `Q` (Quorum required) 및 `Q+O` (Quorum + Owner) 라벨이 이 메커니즘을 표기한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.4–5).

## Key Concepts

- **Q** — Admin Quorum 승인 필요
- **Q+O** — Admin Quorum **및** Owner 둘 다 필요
- **멤버 자격(권한표 기준)**: Owner, Admin, Non-Signing Admin, Security Admin이 "Participate in the Admin Quorum"에 ✓ (p.7)

## Details

- 신규 사용자 추가, 디바이스 re-enroll 등은 `Q`로 표기되어 Admin Quorum 승인이 필요하다 (`user-roles.md`, p.5).
- **Admin Quorum 변경 / Policy 변경**은 `Q+O`로 Quorum과 Owner 모두 승인해야 한다 (`user-roles.md`, p.7).
- 권한표 *Participate in the Admin Quorum* 행은 Owner, Admin, Non-Signing Admin, Security Admin에 ✓를 표기한다 (`user-roles.md`, p.7).
- 멤버 자격이 자동인지 별도 지정인지는 본 자료에 명시 없음 → Open Questions.
- Approval group은 일부 작업을 Owner 없이도 가능하게 위임할 수 있는 별개 메커니즘으로, 권한표에서 `AG` 라벨로 등장한다 (Delete users 행의 Admin `Y (AG)`, `user-roles.md`, p.5).

### Owner counting rule (Add users 본문 확정)

Q 또는 Q+O 흐름에서 **Owner의 승인은 mandatory이며 threshold count에 포함될 수 있다** (`add-users.md`, p.1). 예: threshold가 3 of 5일 때:

- 2 Admins + Owner = 충족 (Owner가 카운트에 포함)
- 3 Admins = 미충족; Owner의 추가 승인 전까지 거부

이 룰은 사용자 추가 흐름에서 명시되었으며, 다른 Q+O 액션(Policy 변경, Admin Quorum 변경 등)에도 동일하게 적용되는지는 본 자료에 명시 없음 → 확인 필요.

### Add user 흐름의 7-day expiry

Add user 승인은 mobile로 Owner와 Admin Quorum에 전송되며, **threshold가 7일 안에 충족되지 않으면 request expire**되어 사용자는 추가되지 않는다 (`add-users.md`, p.1). 다른 Q 흐름의 expiry는 본 자료에 일반화되어 있지 않음.

### Edit user 흐름의 customize 가능성

Edit user는 Owner + Admin Quorum 승인을 거치되 **Approval groups로 흐름을 customize 가능**하다 (`edit-users.md`, p.1). customize 범위(membership / threshold / Owner 요구 토글 등)는 본 자료에 명시 없음 → [[open-questions/fireblocks]] Q-2026-05-18-L06.

### API user lifecycle 적용 (Stage 4)

API user의 Add·Rename·Re-enroll에도 Owner + Admin Quorum 승인 흐름이 적용된다 (`add-api-users.md`, p.2 "same approval flow used for Console users"; `rename-and-delete-api-users.md`, p.1). 7-day expiry / Owner counting rule이 동일하게 적용되는지는 본 자료에 명시적 재확인 없음 — "same approval flow" 표현에 의해 동일 가정.

API user **Delete**는 default Owner-only, 즉시, mobile approval 없음 — Console user Delete와 동일 패턴 (`rename-and-delete-api-users.md`, p.1).

### Mobile device 재등록 (Stage 3)

권한표 *Re-enroll devices*: Owner / Admin / NSA / Security Admin = `Y (Q)` (`user-roles.md`, p.5). Console user mobile device 재등록 흐름은 Owner approval만 요구되는 것으로 본문에 명시 (`re-enroll-a-users-mobile-device.md`, p.1) — Quorum 참여 여부는 권한표가 `Q` 라벨로 표시하나 본문은 "Owner approves"만 언급. 둘 사이 명시적 cross-validation은 본 자료에 없음 (가능성: 표는 Q 흐름의 일반 라벨, 실제로는 Owner 단독 승인 가능).

`re-enroll-a-users-mobile-device.md`, p.1: signing role 사용자의 재등록은 **Owner의 MPC key share 재승인 2-day window** + 사용자의 MPC re-registration 2-day window. Admin Quorum 직접 참여는 명시 없음.

## Related Pages

- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/admin]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[entities/fireblocks/user-roles/security-admin]]
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/policy]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.4–5, p.7
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (Owner counting rule, 7-day expiry)
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1 (Approval groups customize)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (Admin Quorum threshold 충족 검증 권고)
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.2 ("same approval flow used for Console users")
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1 (API user Rename approval)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: device 재등록 Owner approval)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.3 (Stage 5: mobile app 승인 표면)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.2 (Stage 6: Security & compliance 위임)

### Mobile App 승인 표면 (Stage 5)

`fireblocks-mobile-app-signing-and-approving.md`, p.3 — Admin Quorum의 실제 승인 액션은 mobile app에서 수행. 다음이 mobile app workspace settings 승인 항목:

- **Adding new users**
- **Updating the admin quorum** (= Quorum 자체 변경, Q+O)
- **Transaction Policy changes** (Q+O)
- "Approve" transactions amount cap
- Enabling one-time address transactions

Owner의 MPC keys for new signing users도 mobile app 승인 (`fireblocks-mobile-app-signing-and-approving.md`, p.3).

### Security & Compliance 영역 위임 (Stage 6, Q-G03 부분 답)

`allowlisting-ip-addresses-for-console-access.md`, p.2 인용:

> "Allowlisting is by default assigned to the Admin Quorum to facilitate approvals. However, you can also configure your workspace to assign allowlisting to a specific approval group under your settings by selecting **Quorums > Security & compliance**."

→ Admin Quorum의 기본 승인 영역 중 **security & compliance 카테고리**를 specific approval group으로 위임 가능. 이는 [[entities/fireblocks/approval-group]]의 `Quorums > Approval groups` (User management 평면) **위임 메뉴와 별도**인 두 번째 위임 평면.

운영 의미: Console IP allowlist 같은 security 결정을 daily admin과 분리된 보안 전담 그룹으로 좁힐 수 있음.

## Stage 8 — Admin Quorum vs Policies 기능 분리 명시 (`best-practices-for-choosing-user-roles.md`, p.1-2)

공식 인용:
> "the **Admin Quorum** is responsible for **approving workspace configuration changes and defining the whitelisted space** to which funds can stream outside of your vault, **Policies** are rule engines that **governs outgoing asset transactions**."

| 메커니즘 | 책임 | 참가 가능 role |
|---|---|---|
| **Admin Quorum** | workspace configuration 변경 승인 + whitelist scope 정의 | Owner + Admin (+ NS-Admin per [[entities/fireblocks/user-roles/non-signing-admin]]) |
| **Policies** | outgoing tx rule engine (allow/block/추가 승인) | Viewers 제외 모든 role |

> "Only Admins and the Owner can participate in both the Admin Quorum and the Policies."

→ Owner+Admin 만 **두 메커니즘 모두**에 참여.

## Stage 8 — Admin Quorum Threshold Changed 이벤트 (Q-G01 신호)

`audit-log.md` Admin Quorum 섹션:
- **Threshold changed** 이벤트가 Audit Log 에 기록됨 → threshold 가 변경 가능한 것은 확인. 변경 절차·승인 요건은 본 자료에 명시 없음.

## Stage 8 — Vacation / Availability 고려 권장

`best-practices-for-choosing-user-roles.md`, p.2:
> "Consider **vacations and leaves of absence** when defining the Admin Quorum threshold and the number of approvals required in the Policy."

→ Quorum threshold 설계는 부재자 risk 를 명시적으로 고려할 것 권장.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__best-practices-for-choosing-user-roles.md`, p.1-2 (Stage 8: Quorum vs Policies 기능 분리, 부재자 고려)
- `2026-05-18__support-fireblocks-io__audit-log.md` (Stage 8: Threshold changed 이벤트)
- `2026-05-18__support-fireblocks-io__whitelisting-new-addresses.md`, p.1 (Stage 9: Address whitelist = Admin Quorum approval 필수)
- `2026-05-18__support-fireblocks-io__one-time-address-ota-feature.md`, p.1 (Stage 9: OTA = Admin Quorum 우회 path, feature activation 만 Owner OR Approval group)

## Stage 9 — Whitelist / OTA Governance Scope (★)

| Path | Admin Quorum 의 역할 |
|---|---|
| **Whitelisted address** (`whitelisting-new-addresses.md`) | **Per-address approval 필수** — 신규 whitelist 마다 quorum cycle |
| **One-Time Address (OTA)** (`one-time-address-ota-feature.md`) | **Per-address quorum 없음** — feature activation 만 **Owner 또는 Authorized Approval group** 승인 |

→ Whitelist 와 OTA 는 Admin Quorum 의 두 governance scope.

## Stage 10 — Admin Quorum 정식 명세 (★ Q-G01, Q-G04 ANSWERED)

`admin-quorum.md` (Stage 10 ingest):

### 멤버십 = 자동 (★ Q-G04 ANSWERED)

> "Any user assigned an **Owner, Admin, or Non-Signing Admin** role is part of the Admin Quorum."

→ 3 admin role 이 **자동 멤버** (role-based). 별도 지정 절차 없음.
→ Security Admin 은 Stage 1 권한표에서 ✓ 였으나 Stage 10 문서에는 명시 누락 — 본문/표 일관성 검증 필요.

### Active 조건

> "Only Admin users who have completed onboarding and who show as **Active**... count toward the quorum. Admins show as Active after they pair their mobile device to their workspace account."

→ Quorum count = **(Onboarded + mobile paired) Admins only**.

### Threshold 정책 (★ Q-G01 ANSWERED)

**2 모드**:
- **All** (dynamic): active Admin 전원 approve 요구
- **Number** (fixed): 지정 숫자. **활성 Admin < threshold → Support 경유 필수**

**Default**: 워크스페이스 첫 생성 시 = **"All Admins"** (Owner 단독 active 상태에서 시작)

### Threshold 변경 절차

Settings > Quorums > Admin Quorum > Show admin quorum > Change Threshold → "Owner approval is mandatory" → Current Quorum 에 알림 → **Quorum + Owner 양쪽 approve 필요**.

- 새 threshold approve 될 때까지 현 threshold 유지
- Outstanding requests = 제출 시점 threshold 그대로

### API Admin 자동 approve (★ 새 SPOF 패턴)

> "If you have active API Admin users... **their approval is automatic** for Admin Quorum change requests."

→ **API Admin 1명 = quorum −1 효과** (threshold 변경 액션 한정)

| 구성 | 권장 threshold |
|---|---|
| 1 human + 1 API Admin | **≥ 2** (threshold 1 = API auto-approve 만으로 통과) |
| 2 human Admin | 1 또는 2 모두 OK |

### Cold Wallet Workspace 특수 규칙

| 액션 | Cold Wallet 처리 |
|---|---|
| Owner + Admin approval 액션 (add users, provisioning signing devices) | **Fireblocks Support 경유 필수** |
| Admin 삭제 시 pending request | **outstanding cancel + new submit** |
| Other workspace config | **NS-Admin approve 가능** |
| **Owner-only Console direct** | user delete, reset 2FA |

### Admin Quorum-Required Activities (정식 enumeration, p.1)

1. Whitelisting addresses
2. New Fireblocks P2P Network connections — ★ **양쪽 Admin Quorum 승인 필요** (Stage 162): "Both your Admin Quorum as well as your counterparty's Admin Quorum must approve new Network connections." 내 workspace 승인만으로는 연결이 성립하지 않는다. (source: `2026-08-06__developers-fireblocks-com__connect-to-the-fireblocks-network.md`)
3. New connected accounts
4. Adding new workspace users
5. Changes to Policies
6. Configuring approval groups
7. Enabling one-time addresses
8. Other workspace settings + configuration changes

## Sources (Stage 10 추가)
- `2026-05-18__support-fireblocks-io__admin-quorum.md`, p.1-5 (Stage 10: 멤버십 자동, threshold 정책, API Admin 위험, Cold Wallet 특수)
- `2026-05-18__support-fireblocks-io__approval-groups.md`, p.1 (Stage 10: Admin Quorum = default approval group)

## Open Questions

- ~~Q-2026-05-18-G01~~ — **ANSWERED (Stage 10)**: All/Number 두 모드, default "All Admins", threshold 변경 = Quorum + Owner approve
- ~~Q-2026-05-18-G04~~ — **ANSWERED (Stage 10)**: Owner/Admin/NSA 자동 멤버 (role-based). Security Admin 멤버십은 Stage 1 권한표 vs Stage 10 본문 불일치 → 후속 추적

## Open Questions

- Q-2026-05-18-G01 — **신호 추가** (Stage 8): Audit Log 에 "Threshold changed" 이벤트 존재 → 변경 가능 확인. 절차·승인 요건은 여전히 미명세
- ~~Q-2026-05-18-G02~~ — **ANSWERED** (Stage 2): Owner는 mandatory + countable (`add-users.md`, p.1). 자세한 절은 위 "Owner counting rule"
- Q-2026-05-18-G04 — 멤버 자격이 자동인지 별도 지정인지
- Q-2026-05-18-L06 — Approval groups customize 가능 항목 범위
