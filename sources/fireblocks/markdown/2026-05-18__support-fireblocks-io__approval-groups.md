<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/11500062124188-Approval-groups
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__approval-groups.pdf
status: full
priority: TIER1
domain: Governance
-->

# Approval groups

*Updated 6 months ago*

## One-line summary

Approval group 의 정식 정의. **User group ⊂ Approval group** (user group 먼저 생성 필요). **Cold Wallet workspace 미지원**. **12 assignable actions 정식 enumeration** + **4 UI category** (Security & compliance / User management / Fireblocks Network / External accounts). **5 Owner-mandatory default actions** 명시. **Permission filtering**: action 권한 없는 user 는 threshold 카운트 제외. → **Q-G03 ANSWERED**, Q-L06 ANSWERED.

## Key Concepts

### Approval Group 의 구성 단위 (★ 새 governance 평면)

p.1: "Approval groups consist of users from a designated **user group**. Before you can assign an approval group, you must first **create the user group**."

→ **2-level governance 구조**:
```
User group (멤버 집합, [[entities/fireblocks/user-group]] 새 entity 가능성)
  └── Approval group (action 위임 단위, threshold + Owner-required 옵션)
        └── Action (12 종)
```

### Admin Quorum vs Approval Group

p.1: "Approval groups operate similarly to the Admin Quorum (which is the **default approval group for all actions**), but provide a more flexible alternative by allowing you to assign different user groups to approve different types of workspace actions."

→ Admin Quorum = **default approval group for all actions**. Approval group 은 action 별 specific 위임 옵션.

### Cold Wallet Workspace 미지원 (★)

p.1 Important: "approval groups are **not supported in Cold Wallet workspaces**."

→ Cold Wallet 은 Admin Quorum 만 사용. Stage 10 의 Admin Quorum doc 의 "Cold Wallet workspace 특수 규칙" 과 정합 — Cold Wallet 은 거버넌스 모델이 더 단순+엄격.

### 12 Assignable Actions (★ 정식 enumeration, p.2)

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

### 4 UI Categories (★ Q-G03 ANSWERED, Stage 6 의 "두 위임 메뉴" 정정)

p.2 UI diagram:
- **Security & compliance** (Whitelist / OTA / Change TAP / IP allowlist 등)
- **User management** (workspace users / user groups / re-enroll devices)
- **Fireblocks Network** (P2P connections / deposit routing)
- **External accounts** (exchange / fiat)

→ Stage 6 에서 발견한 "Quorums > Approval groups (User management)" + "Quorums > Security & compliance" 외에 **Fireblocks Network + External accounts 의 2 카테고리 추가** 확인. 총 **4 카테고리**.

### Owner-Mandatory Default Actions (★ Stage 8 Owner 책임 보강)

p.3: "By default, all actions are assigned to your Admin Quorum and must be approved according to its settings. For some actions, **the Owner's approval is mandatory**:"

1. **Allowing one-time addresses**
2. **Changing Policies**
3. **Managing workspace users**
4. **Re-enrolling devices**
5. **Managing user groups**

→ 12 actions 중 **5개는 Owner approval mandatory** (Q+O 라벨). 나머지 7개는 Admin Quorum 단독 가능 (이론상 Owner-less). **Owner approval requirement 는 configure 시 toggle 가능** (p.3 step 3).

### Ready 상태 (Approval group 참가 조건)

p.2: "Only users who have completed the onboarding process and are listed as **Ready** in your Fireblocks Console user list can participate in an approval group. Users show as Ready after they pair their mobile device to their workspace account."

→ Admin Quorum 의 "Active" 와 약간 다른 용어 — Approval group 은 "Ready", Admin Quorum 은 "Active". 동일 조건 (mobile device 페어링 완료) 으로 보이지만 표현 차이 있음.

### Viewer + Editor 자동 제외

p.2: "Since a paired mobile device is required, **Viewers and Editors cannot participate** in approval groups."

→ Mobile device 미사용 role 은 approval group 참가 불가 (role-based filter).

### Permission Filtering (★ 핵심 추가 규칙)

p.1: "**Only users with sufficient user role permissions count toward the threshold**. Users without permission for a specific action do not count toward the threshold, **even if they are part of the user group assigned to the action**."

p.2 Note: "**Only Owners, Admins, and Non-Signing Admins can approve Policy changes.** If other user roles, such as Signers, are included in a user group assigned to the Policy approval group, **they do not count toward the approval threshold**."

→ **2-layer filter**:
1. User group 멤버 = candidate
2. Action 별 role permission filter = actual quorum count

→ Policy approval 의 사실상 quorum count = (user group ∩ {Owner, Admin, NS-Admin}) 만.

### Threshold 운영 함의

p.1:
- "Any user in the approval group has the authority to **deny a request before the required threshold is met**" — unanimous-veto 패턴
- 그룹 활성 user 수가 threshold 미만 → **재구성 필수**, 그 전까지 approval request 미배달 (잠금 위험)

### Configuration 절차

p.3-4:
1. **Settings > Quorums > Assign approval groups**
2. Action 선택 (category 단위로 grouping)
3. **Owner approval required 여부 선택** (toggle, mandatory action 은 강제)
4. **Admin Quorum 또는 specific user group 선택**
5. Specific group 시 threshold 입력 (permission-eligible user 만 카운트)
6. **Save**
7. 변경 자체는 **Admin Quorum + Owner approval 필요**

### API User Fully-Controlled 위험

p.2 Important: "If you set an approval group to be **fully controlled by API users**, you assume the risk of securing your API key(s). If compromised, malicious actors will be able to authorize changes to your workspace **without human oversight**. It is recommended to have a trusted person manually review low-volume, security-sensitive configurations."

→ Admin Quorum 의 "API Admin = quorum −1" 패턴의 일반화. Approval group 도 API user 전체 구성 가능하나 권장 안 됨.

### Configuration 변경의 메타 거버넌스

p.4: Approval group 설정 변경 = **Admin Quorum + Owner** 양쪽 approve 필요.

→ Approval group 자체가 governance asset 이므로 변경은 최상위 governance (Admin Quorum + Owner) 통과 필수.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__approval-groups.pdf` (5 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/admin]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[entities/fireblocks/api-user]]
- [[vendors/fireblocks/security]]
