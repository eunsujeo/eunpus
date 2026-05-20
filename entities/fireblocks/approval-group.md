# Entity: Approval Group (Fireblocks)

## Summary

Workspace의 일부 작업에 대해 **Owner를 요구하지 않는 위임 그룹**. `Settings > Quorums > Approval groups` 화면에서 작업 단위(row) 별로 구성하며, Add user / Edit user / Delete user 같은 거버넌스 흐름의 customize 평면으로 사용된다 (sources: `user-roles.md` p.5; `edit-users.md` p.1; `delete-users.md` p.1–2).

## Key Concepts

- 권한표 라벨 `AG` — "Only when part of an approval group that does not require the Owner" (`user-roles.md`, p.5)
- 설정 경로: **`Settings > Quorums > Approval groups`** (`delete-users.md`, p.1)
- 각 작업 row에 두 가지 토글이 있음 (`delete-users.md`, p.1–2):
  - **Approval permission**: `admin quorum or approval group` 등
  - **Requires workspace owner approval** (체크박스)
- Edit user 승인 흐름도 Approval groups로 customize 가능 (`edit-users.md`, p.1) — 구체 customize 범위는 본 자료에 없음

## Details

### Delete users 위임 설정 (구체 사례)

기본은 Owner-only 삭제이지만, Admin이 Approval group consent로 삭제 가능하도록 다음과 같이 설정한다 (`delete-users.md`, p.1–2):

1. `Settings > Quorums > Approval groups`
2. `User management` 섹션 expand
3. `Delete users` row의 `Edit`
4. **Approval permission**을 `admin quorum or approval group`로 설정
5. **`Requires workspace owner approval` uncheck**
6. `Save`

설정 후 권한표상 `Admin: Delete users — Y (AG)`가 실제로 동작한다 (`user-roles.md`, p.5).

### Edit users 흐름의 customize

> "You can use Approval groups to customize this approval flow." (`edit-users.md`, p.1)

Edit user의 기본 흐름은 Owner + Admin Quorum 승인이지만 Approval group으로 흐름을 변경할 수 있다. 어떤 항목을 변경 가능한지(membership / threshold / Owner 요구 토글 등)는 본 자료에 명시 없음 → Open Question.

### 두 위임 메뉴 (Stage 6 확정)

본 entity는 **두 별개 위임 메뉴**를 가진다 (Q-G03 부분 답):

| 메뉴 | 영역 | 출처 |
|---|---|---|
| `Settings > Quorums > Approval groups` (또는 *User management*) | User Add/Edit/Delete + API user Delete (동일 설정 행 재사용) | Stage 2 `delete-users.md`, p.1–2; Stage 4 `rename-and-delete-api-users.md`, p.2 |
| `Settings > Quorums > Security & compliance` | Console IP allowlist 등 security 영역 | Stage 6 `allowlisting-ip-addresses-for-console-access.md`, p.2 |

두 메뉴는 별개 영역의 Admin Quorum 기본 권한을 specific approval group으로 위임하는 평면이며, 어느 메뉴에 어떤 작업이 들어가는지는 본 자료에 부분적으로만 명시.

### API user Delete 위임도 동일 설정 사용 (Stage 4)

> "configure the same **Delete users** permission used for Console users" (`rename-and-delete-api-users.md`, p.2)

즉 `Settings > Quorums > Approval groups > User management > Delete users` row의 설정 하나가 Console user와 API user 양쪽의 Delete 위임에 동시 적용된다. 별도 row가 존재하는지는 본 자료에 명시 없음 — 같은 row 재사용으로 읽힘.

### Admin Quorum과의 관계

본 자료 범위에서 확인 가능한 사실:

- Delete users row의 *Approval permission* 옵션에 **`admin quorum or approval group`** 가 나열됨 (`delete-users.md`, p.1) — 둘이 선택지로 병렬
- Approval group은 Admin Quorum과 별개로 멤버를 가질 수 있는 것으로 보이나, 정확한 멤버십 관계(중첩? 별도?)는 본 자료에 명시 없음 → Q-2026-05-18-G03

## Related Pages

- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/user-roles/owner]] — Approval permission에서 Owner 요구를 제거하는 메커니즘
- [[entities/fireblocks/user-roles/admin]] — Delete users `Y (AG)`의 활성화 대상
- [[vendors/fireblocks/lifecycle-events]] — Add/Edit/Delete의 거버넌스 customize 위치
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.5
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1 (Approval groups customize 가능성)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1–2 (Delete users 위임 구체 절차)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.2 (API user에 동일 설정 적용)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.2 (Stage 6: Security & compliance 위임 메뉴)

## Stage 10 — Approval Group 정식 명세 (★ Q-G03, Q-L06 ANSWERED)

`approval-groups.md` + `user-group-management.md` (Stage 10 ingest):

### 2-Level Governance 구조

```
Admin Quorum  (workspace-default approval group for all actions)
  └── Approval group  (action-level 위임)
        └── User group  (멤버 집합, base building block — Stage 10 user-group-mgmt 별도)
              └── Action (12 종)
```

### 12 Assignable Actions (★ 정식 enumeration, Q-L06 응답)

`approval-groups.md`, p.2:
1. **Whitelisting addresses** (internal wallets / external wallets / smart contracts)
2. **Allowlisting IP for Console access**
3. **Allowing one-time addresses** in workspace
4. **Changing Policies**
5. **Managing workspace users** (Console + API)
6. **Re-enrolling devices**
7. **Managing user groups**
8. **Adding Fireblocks P2P Network connections**
9. **Setting deposit routing for Fireblocks P2P Network profiles**
10. **Connecting exchange accounts**
11. **Connecting fiat accounts**
12. **Managing Automation rules**

### 4 UI Categories (★ Stage 6 의 "두 위임 메뉴" 정정)

`approval-groups.md`, p.2 (Settings > Quorums > Assign approval groups):
- **Security & compliance**
- **User management**
- **Fireblocks Network**
- **External accounts**

→ Stage 6 에 발견한 두 메뉴 + 추가 두 카테고리 = 총 4 카테고리.

### Cold Wallet Workspace 미지원

`approval-groups.md`, p.1:
> "approval groups are **not supported in Cold Wallet workspaces**."

→ Cold Wallet 은 Admin Quorum 단독 (Stage 10 admin-quorum doc 의 Cold Wallet 특수 규칙과 정합).

### Owner Mandatory Default Actions (★ Q-L06 응답)

`approval-groups.md`, p.3 (default mode 에서 Owner approval mandatory 5 actions):
1. Allowing one-time addresses
2. Changing Policies
3. Managing workspace users
4. Re-enrolling devices
5. Managing user groups

→ 12 actions 중 5개 = Owner mandatory (Q+O 라벨), 나머지 7개 = Admin Quorum 단독 가능. **Owner mandatory toggle 은 configure 시 변경 가능**.

### Permission Filter (★ 추가 spine)

`approval-groups.md`, p.1-2:
> "Only users with sufficient user role permissions count toward the threshold. Users without permission for a specific action **do not count toward the threshold**, even if they are part of the user group assigned to the action."

> "Only **Owners, Admins, and Non-Signing Admins** can approve Policy changes. If other user roles (e.g., Signers) are in the assigned group, they do not count."

→ **2-layer filter**:
1. User group 멤버 = candidate
2. Action 별 role permission filter = actual quorum count

### Ready Status

`approval-groups.md`, p.2:
- "Only users who have completed the onboarding process and are listed as **Ready**... can participate"
- "Users show as Ready after they pair their mobile device"
- **Viewer + Editor** 는 mobile device 미사용 → approval group 참가 불가

→ Admin Quorum 의 "Active" 와 동일 조건이나 표현 차이 (Active vs Ready).

### Configuration 절차

`approval-groups.md`, p.3-4:
1. Settings > Quorums > Assign approval groups
2. Action 선택 (4 카테고리 grouping)
3. Owner approval required 여부 toggle
4. **Admin Quorum 또는 specific user group** 선택
5. Specific group 시 threshold 입력 (permission-eligible 만 카운트)
6. Save
7. **변경 자체 = Admin Quorum + Owner approve 필요** (메타-거버넌스)

### API Fully-Controlled 위험

`approval-groups.md`, p.2:
> "If you set an approval group to be **fully controlled by API users**, you assume the risk... malicious actors will be able to authorize changes **without human oversight**."

→ Stage 10 Admin Quorum 의 "API Admin = quorum −1" 패턴 일반화.

### User Group Prerequisite (★ 신규 building block)

`user-group-management.md` (Stage 10):
- Approval group ⊃ User group — **user group 먼저 생성** 필요
- User group = workspace role 또는 internal role 기반 사용자 묶음
- 관리권: Owner + Admin only
- 변경 (create/edit/delete/duplicate) 모두 **Admin Quorum + Owner approve**
- **(X) Policy rules impacted** indicator 자동 표시 → cascade risk 사전 시각화
- "Deleting a group can affect the **TAP (Transaction Authorization Policy)** and may result in transaction errors"
- 경로: Settings > Users > Manage groups

→ **User group 은 별도 entity 만들지 않고 본 entity 의 prerequisite 으로 흡수** (Stage 6-10 5 연속 0 entity 유지).

## Sources (Stage 10 추가)
- `2026-05-18__support-fireblocks-io__approval-groups.md`, p.1-4 (Stage 10: 12 actions, 4 categories, Owner mandatory 5 actions, permission filter, API fully-controlled risk)
- `2026-05-18__support-fireblocks-io__user-group-management.md`, p.1-9 (Stage 10: User group prerequisite, Policy impact indicator)
- `2026-05-18__support-fireblocks-io__how-policies-work.md`, p.4 (Stage 10: User group sub-quorum 가능 — "any two members of Management to approve")

## Open Questions

- ~~Q-2026-05-18-G03~~ — **ANSWERED (Stage 10)**: 4 카테고리 (Security & compliance / User management / Fireblocks Network / External accounts), 12 actions 정식 명시. Admin Quorum 은 default approval group, specific approval group 위임 가능. Permission filter 로 role 자동 제외.
- ~~Q-2026-05-18-L06~~ — **ANSWERED (Stage 10)**: 12 assignable actions 정식 enumeration, 5 Owner-mandatory action 명시. Configure 시 Owner mandatory toggle 가능.
