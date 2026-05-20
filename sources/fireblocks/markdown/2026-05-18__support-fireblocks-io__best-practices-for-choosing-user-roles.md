<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/5254222799900-Best-practices-for-choosing-user-roles
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__best-practices-for-choosing-user-roles.pdf
status: full
priority: TIER1
domain: Governance / Identity-Authentication
-->

# Best practices for choosing user roles

*Updated 8 months ago*

## One-line summary

Owner 의 9가지 권장 책임 + "Owner-touching = Support video call" 의 명시적 4-action 목록 + Admin Quorum vs Policies 기능 분리. **이 문서는 7-role pyramid (Owner/Admin/NS-Admin/Signer/Approver/Editor/Viewer) 만 다룸 — Security Admin / Security Auditor 는 별도 카테고리**.

## Key Concepts

### 7-Role Pyramid (compliance role 제외)

p.1:
- MPC key share 보유, sign 가능: **Owner, Admin, Signer**
- MPC share 없음, sign 불가: **Non-Signing Admin, Approver, Editor, Viewer**
- Tx initiate 가능 (designated signer 필요): **NS Admin, Editor, Approver**
- Tx approve 가능: **NS Admin, Approver**

→ Security Admin / Security Auditor 는 **이 문서 scope 밖** (별도 compliance/audit category 로 분리되어 있음을 시사).

### Admin Quorum vs Policies (기능 분리)

p.1-2:
| 메커니즘 | 역할 | 참가 가능 role |
|---|---|---|
| **Admin Quorum** | workspace **configuration** 변경 승인 + whitelist 범위 정의 | Owner + Admin 만 |
| **Policies** | **outgoing transaction** 룰 엔진 (allow/block/추가 승인) | Viewers 제외 모든 role |

- Owner + Admin 만 **두 메커니즘 모두**에 참가
- 일부 워크스페이스 액션은 **Owner 의 Quorum approval** 강제, 다른 액션은 Admin 만으로 충분

### Owner = Root User, 1명 per Workspace (명시)

p.2: "**Every workspace requires only one Owner to set up the Fireblocks Vault.**"
- Owner role 은 Fireblocks Support 가 **자동 할당** (security 목적)

### Owner's 9 Recommended Responsibilities

p.2 (직접 인용):
1. Approving new signing devices and MPC key shares
2. Approving new workspace users
3. Approving new external connections
4. Creating API keys
5. Deleting workspace users
6. Enabling advanced workspace features
7. Creating, editing, and approving workspace policies
8. Resetting 2FA
9. **Emergency ops**: freezing workspace, creating backup kit, recovery

### Owner-touching = Support Video Call (4가지 액션 명시)

p.2: "To **change the Owner** of a workspace, or when the Owner wants to **change their role**, **migrate to a new mobile device**, or **unfreeze the workspace**, the Owner must first verify their identity with Fireblocks Support by **scheduling a short video call**."

→ Owner SPOF 축의 4가지 Support-gated 액션 공식 명시 (기존 spine 확인).

### Single-Signer Warning

p.2: "If you are the only user in a workspace who can sign transactions, we recommend creating additional Admin or Signer users as a precautionary measure. This helps to prevent the **loss of access to your digital assets and financial operations** when the primary signer cannot access the workspace."

→ Single-Owner 워크스페이스 = SPOF 라는 Fireblocks 의 공식 경고.

### Role Selection Decision Tree

p.3 flowchart, 정리:
- Admin quorum 참가 O + sign 가능 → **Admin**
- Admin quorum 참가 O + sign 불가 → **Non-Signing Admin**
- Admin quorum 참가 X + sign 가능 → **Signer**
- Admin quorum 참가 X + sign 불가 + initiate (own sign) → (실제 N/A — designated signer 필요)
- Admin quorum 참가 X + initiate only (designated signer 통해) → **Editor**
- Admin quorum 참가 X + approve only → **Approver**
- Admin quorum 참가 X + 그 외 → **Viewer**

### Footnotes (p.3 하단)

- "*All users besides VIEWERS can create vault accounts and asset wallets; Add external connections (exchange accounts, network connection, etc.) and whitelist addresses pending admins' quorum approval.*"
- "**NON-SIGNING ADMINS and EDITORS** requires the assignment of a **designated signer** on your workspace transaction authorization policy to be able to initiate transactions."

### Operational Caveat

p.2: "Consider vacations and leaves of absence when defining the Admin Quorum threshold and the number of approvals required in the Policy. Transactions that require the approval of all users in a group may be delayed until users return from vacation or leave."

→ Quorum / Approval Group threshold 설계 시 availability 고려 권장.

### Disclaimer

p.4: "Choosing user roles is **exclusively the Owner/company's decision and responsibility**." Fireblocks 책임 없음.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__best-practices-for-choosing-user-roles.pdf` (5 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/user-management]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/designated-signer]]
