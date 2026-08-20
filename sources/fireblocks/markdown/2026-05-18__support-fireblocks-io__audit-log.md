<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360015646820-Audit-Log
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__audit-log.pdf
status: full
priority: TIER1
domain: Security-Access / Governance / Compliance
-->

# Audit Log

*Updated 6 months ago*

## One-line summary

Workspace 의 영구 보존 (no-expire) 이벤트 audit 로그 — Owner/Admin/NS-Admin 만 access. Settings > Audit log 에서 view/filter/sort/export. **SIEM 통합용 Fireblocks API endpoint 제공**. 20+ category, 수백 종류 event type 정식 enumeration (User mgmt / Mobile device / Admin Quorum / Policies / IP allowlist / Workspace Key Backup / MPC key set / Tx / Wallets / Web3 / P2P Network 등).

## Key Concepts

### Access Control

p.1: "**Requires Admin-level permissions** — Only Owners, Admins, and Non-Signing Admins can access the Audit Log."

→ Security Auditor / Security Admin 은 이 문서에서 **언급되지 않음** (compliance plane 의 audit-log 분리 가능성). Q-S05 부분 응답: 본 audit log 의 접근권한은 3 admin role 한정.

### Persistence Model

p.1: "**Events that are recorded in your Audit Log do not expire.** You can view the full history of events in your workspace from when it was first created."

→ 영구 보존 — Compliance / forensic 측면에서 중요한 spine.

### Access Path

p.1: **Settings (⚙) → Audit log**

### Indexing / SIEM Integration

p.2: "Learn more about Fireblocks API endpoints that you can use to directly integrate with your **security information and event management (SIEM) system**."

→ 외부 SIEM (Splunk, Datadog 등) 통합 path 존재.

### Export Authentication

p.2: "**Downloading reports requires authentication** — You must sign in to the workspace to download the report you requested."

### Audit Log Categories — Comprehensive Enumeration

p.2-11:

**1. Administration**
- Sign-in Events: Successful sign-in, Access denied

**2. User Management**
- New user (Submitted/Approved/Canceled/Rejected)
- Edit user (Submitted/Approved/Implemented/Canceled/Rejected)
- User deleted / deactivated / role changed

**3. Mobile Device Management**
- Device recovery completed
- Device reset (Approved/Completed/Recovered/Rejected/Submitted)
- Re-enroll mobile device (6 states)
- User: Mobile device recovered / reset

**4. Linked User Migration**: Initiated by user / User paired successfully / Activated / Deactivated

**5. Whitelisted IP**: List updated

**6. Admin Quorum**
- Approved / Canceled / Rejected / Submitted
- **Threshold changed** ← Q-G01 관련 정보 신호 (변경 자체는 이벤트로 추적)

**7. One-Time Address**: Approved/Canceled/Rejected/Submitted, Turned off / on

**8. Notifications**: Email / Slack / Webhooks (Created/Enabled/Disabled/Edited/Deleted)

**9. Assets**: Asset listed, Asset set price

**10. Automation**: Automation rule (Created/Edited/Enabled/Disabled/Deleted)

**11. Compliance**
- Transaction AML (Registration completed/started, Screening completed/failed/in background/started)
- Transaction Screening (Completed/Started/Update completed)
- Transaction Travel Rule Screening (Completed/...)

**12. Developers**
- Webhooks: Updated URL list updated
- Webhook endpoint: Added/Deleted/Activated/Deactivated/Updated/**Suspended/Suspension warning sent** ← 자동 suspension 메커니즘 시사

**13. Third-party accounts**: Exchange account / Fiat account (Linked/Unlinked + Approval lifecycle)

**14. Keys**
- Validation key: Submitted/Approved/Rejected/Activated/Deactivated
- **MPC key set**: Created / Enabled / Activated ← MPC key 생애주기 추적 이벤트
- (Assigned to vault account / Deleted)

**15. Policies**
- Policy states: Rejected/Signed/Deleted/Published/Discarded draft/Reverted draft/Put into effect/Draft marked ready/Requested publishing/Edited draft (10+ states)
- IP address allowlist activation/deactivation/allowlist (Submitted/Approved by quorum/Approved by user/Rejected/Canceled/Failed)
- Changes submitted/approved by quorum/approved by user/canceled/rejected/failed
- Deletion lifecycle (6 states)

**16. Fireblocks P2P Network**
- Network connection (Added/Created/Removed/**Removed by counterparty**)
- Network connection invitation / request (lifecycle)
- Network connection routing change
- Network profile name change / routing change

**17. Transactions**
- Incoming / Internal / Outgoing / External Transaction (Completed/Submitted/...)
- Transaction (General): Alerted by AML / AML failed / **AML screening blocking period timed out** / AML result rescreened / Cancelled / Completed / Confirmation threshold overridden / Declined by second tier / Funds unfrozen / Transaction note changed / Rejected / Rejected by AML / Signed / Submitted
- Transaction Screening (Incoming) / Transaction AML (Incoming) / Transaction Travel Rule (Incoming)

**18. Wallets**
- Vault Account: Account added / Bulk accounts added / Archived/unarchived / Renamed / Auto Fueling enabled/disabled / UI Visibility hidden/visible / Deposit address description changed / Wallet added / Bulk wallets added / Wallet archived/unarchived
- **Backup and Recovery**:
  - **Mobile Key Backed Up**
  - **Workspace Key Backup**: Request Submitted → Initiated by workspace owner → Pending approval → Approved by admin / Approved by admin quorum → Rejected by one of the admins / Cancelled / Internal error during generation → Marked as incomplete / Marked as completed → **Backup sent** ← 9-stage 백업 lifecycle 공식 명시
- Gas Station: Low funds / Vault changed / Sweep transaction initiated / Funds deposited
- External Wallet / Internal Wallet: Added/Removed
- **Cold Wallet Device: "Less than 10% remaining signatures"** ← Cold Wallet 의 MPC signature pre-computed 잔량 모니터링 이벤트

**19. Web3**
- Allowance amount modified
- Contract: Added / Removed
- Fireblocks Extension: Connected / Updated / Disconnected ← browser extension 카테고리 확인

**20. Whitelisted addresses**
- Address: Whitelisted / Removed
- Address Whitelisting: Request Submitted / Approved by Admin / Rejected / Canceled

### Audit Event Structure

p.2: "Each row of the Audit Log is an independent event that includes the creation time, subject, event description, and the user or entity that triggered the event."

→ 모든 이벤트는 `(timestamp, subject, description, actor)` 4-tuple 형식.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__audit-log.pdf` (12 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/compliance]]
- [[vendors/fireblocks/security]]
- [[vendors/fireblocks/user-management]]
- [[entities/fireblocks/user-roles/security-auditor]]
- [[entities/fireblocks/user-roles/security-admin]]
- [[entities/fireblocks/user-roles/admin]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/workspace-keys-backup]]
- [[entities/fireblocks/mpc-key-share]]
