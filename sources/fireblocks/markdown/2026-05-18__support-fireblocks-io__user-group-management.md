<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/19159885747996-User-group-management
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__user-group-management.pdf
status: full
priority: TIER2
domain: Governance
-->

# User group management

*Updated 5 months ago*

## One-line summary

**User group** = workspace role 또는 internal role 기반 **사용자 묶음**, governance 의 cross-cutting building block. **사용처 2가지** (Policy rule 의 initiator/approver/signer + Approval group prerequisite). **관리권 Owner + Admin 만**. **모든 변경 = Admin Quorum + Owner approve**. **Policy rule impact 자동 표시**. → 신규 entity 만들지 않고 `approval-group` + `policy` entity 에 cross-cite 로 흡수.

## Key Concepts

### 정체

p.1:
- workspace role 기반 또는 internal company role 기반 user 묶음
- "Using groups simplifies creating rules and approval flows"
- 거버넌스 spine 의 **3 계층** 중 base layer:
  ```
  Admin Quorum  (workspace-default approval)
    └── Approval group  (action-level 위임, 12 actions)
          └── User group  (멤버 집합, base building block) ← 본 entity
  ```

### 2 사용처

p.1:
1. **Policy rules**: initiator / approver / signer 로 group 지정 (Stage 10 `how-policies-work.md` 의 "Approved by sub-quorum" + "Initiator group")
2. **Approval groups prerequisite**: workspace config 변경 위임 (Stage 10 `approval-groups.md` 의 12 actions)

### 관리권 + 거버넌스

p.1-3:
- **Create / Edit / Delete / Duplicate 모두 Owner + Admin 만** 시작 가능
- 변경 자체는 **Admin Quorum + Owner** 양쪽 approve 필요
- 변경 default approver = Admin Quorum (그 자체로 메타-거버넌스 ladder)

### Lifecycle

p.3-9:
- **Create**: Settings > Users > **Manage groups** > **+ Create Group** → 이름 + 멤버 → submit → Admin Quorum + Owner approve
- **Pending Approval banner** (yellow, top-right) 표시
- **Changes panel** (far right): 새 그룹 = 멤버 list / 변경 = added + removed
- **Policy rules impacted indicator**: 그룹 변경이 영향 주는 Policy rule 수 표시
- **Approve flow**: 모바일 알림 → View → scroll → Approve / Deny
- **Deny**: 어느 Admin 이든 tap Deny → 즉시 reject
- **Delete**: 휴지통 아이콘 → Confirm → Admin Quorum + Owner approve
- **Duplicate**: 기존 그룹 복제 (name + "(copy)") + 추후 멤버 수정 가능
- **Edit**: 멤버 / name 변경 (active 이름 중복 불가) → Save → Admin Quorum + Owner approve
- **Changes pending banner** (yellow): pending 변경 중 추가 변경 불가

### Policy Rule Impact 자동 검사

p.6-7:
- 그룹마다 **(X) Policy rules impacted** indicator
- 클릭 → Impacted Policy rules tab (Edit Mode) → 영향받는 rule list
- "See rule in Policy Editor" 버튼으로 rule 상세

→ User group 변경의 cascade 사전 시각화. Stage 2 의 "user 삭제 → Policy block" 패턴 일반화.

### Caution

p.3 Important: "Creating, editing, or deleting groups can directly impact your Policy's functionality. Consider how changes will affect your Policy before submitting."

p.7 Delete dialog: "Deleting a group can affect the **Transaction Authorization Policy (TAP)** and may result in transaction errors."

→ Stage 9 `architecture.md` 의 "Policy Engine TAPs" = "Transaction Authorization Policy" 약자임 확인.

### Duplicate Note

p.8 Note: "We recommend that **separate groups have mostly different users**. When using duplicates, add enough other users to the new group so that both groups are distinct."

→ 두 그룹의 멤버 overlap 이 크면 governance 분리 가치 없음.

### Example (p.2)

회사 구성: Owner 1, Admin 2, NS-Admin 2, Editor 2

가능한 그룹 예시:
- **Admins** group (3 멤버 = Owner + 2 Admin)
- **Non-Signing Admins** group (2 멤버)
- **Editors** group (2 멤버)
- **Signers** group (2 멤버, 별도 Signer role 가정)

## Implication on Curated Wiki

**신규 entity 만들지 않음** (Stage 6-10 5 연속 0 entity 유지 원칙). 흡수 위치:
- [[entities/fireblocks/approval-group]] §"User group prerequisite" — Approval group 의 base building block
- [[entities/fireblocks/policy]] §"User group in rules" — Policy rule 의 initiator/approver/signer 매개체

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__user-group-management.pdf` (10 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/admin]]
