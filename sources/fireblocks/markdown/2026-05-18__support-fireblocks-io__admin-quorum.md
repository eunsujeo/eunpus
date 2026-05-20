<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360017665119-Admin-Quorum
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__admin-quorum.pdf
status: full
priority: TIER1
domain: Governance
-->

# Admin Quorum

*Updated 5 months ago*

## One-line summary

Admin Quorum 의 정식 정의 문서. **자동 멤버십** (Owner/Admin/NSA), **Active 조건** (mobile device 페어링 완료), **threshold 정책** (All / Number), **default = "All Admins"** (워크스페이스 생성 시), **threshold 변경 절차** (Owner mandatory + current quorum approve), **API Admin 자동 approve = quorum −1 효과 경고**, **Cold Wallet workspace 특수 규칙**. → **Q-G01, Q-G04 ANSWERED**, Q-G02 보강.

## Key Concepts

### 멤버십 (★ Q-G04 ANSWERED)

p.1: "**Any user assigned an Owner, Admin, or Non-Signing Admin role is part of the Admin Quorum.**"

→ 멤버십은 **자동 (role-based)**, 별도 지정 불필요. Owner + Admin + NS-Admin 의 3 admin role 이 자동 멤버.

### Active 조건

p.1: "**Only Admin users who have completed onboarding and who show as Active** under Status in your Fireblocks Console user list (Settings > Users) **count toward the quorum**. Admins show as Active after they pair their mobile device to their workspace account."

→ Quorum count = **(active Admins only)**. Mobile device 미페어링 = 카운트 제외. Add user 의 7-day expiry 와 정합 — pending 사용자는 quorum 영향 없음.

### Activities Requiring Admin Quorum (정식 enumeration, p.1)

1. **Whitelisting addresses**
2. **New Fireblocks P2P Network connections**
3. **New connected accounts**
4. **Adding new workspace users**
5. **Changes to Policies**
6. **Configuring approval groups**
7. **Enabling one-time addresses**
8. **Other workspace settings and configuration changes**

→ Stage 8 의 8-item Owner 책임과 부분 중첩. Whitelist + P2P + connected accounts 가 새로 등장.

### Threshold 정책 (★ Q-G01 ANSWERED)

p.2-4:

**2 가지 모드:**
- **All** (dynamic): 모든 active Admin 의 approval 요구. Admin 추가/제거 시 자동 적응
- **Number** (fixed): 지정 숫자 Admin 의 approval. **활성 Admin 수가 threshold 미만이면 Support 경유 필수**

**Default**: 워크스페이스 첫 생성 시 = "**All Admins**" (이때 Owner 단독 active)

### Threshold 변경 절차 (★)

p.2-4 (정확한 절차):
1. **Settings > Quorums tab > Admin Quorum > Show admin quorum**
2. **Change Threshold**
3. 새 threshold 입력 (All 또는 specific number)
4. **"Owner approval is mandatory"** 명시
5. **Change Quorum Threshold 확인**
6. **Current Admin Quorum 에 approval notification 전송**
7. 현 threshold 는 **새 threshold 가 approved 될 때까지 unchanged**
8. **Outstanding requests** 는 제출 시점 threshold 그대로 적용 (변경 영향 X)
9. **Admin Quorum + Owner 양쪽** 가 approval 해야 변경 완료

→ Threshold 변경은 메타-거버넌스 액션: 현 threshold 충족 + Owner mandatory.

### Owner Approval Mandatory (Q-G02 보강)

p.3-4: Threshold 변경 시 **"Owner approval is mandatory"** 명시. Stage 2 의 Q-G02 답 ("Owner mandatory + count toward threshold") 과 정합 — 모든 Q+O 액션에 일반화.

### Example (p.2)

워크스페이스 = 6 Admin, threshold = 3:
1. user 가 whitelist 요청
2. 6 Admin 모두 mobile app 알림 수신
3. 3명이 approve 하면 통과
4. **Any 1 Admin 이 threshold 도달 전 deny → 즉시 reject** (unanimous-veto 의 Quorum 버전)

### API Admin 자동 approve 경고 (★ 새로운 spine)

p.4:
- API Admin / API Non-Signing Admin 은 **Admin Quorum threshold 변경 요청에 자동 approve**
- "their approval is automatic for Admin Quorum change requests"

**위험 예시** (p.4):
| 워크스페이스 구성 | 권장 threshold |
|---|---|
| 1 human Admin + 1 API Admin | **2 이상** — threshold 1 이면 API Admin 이 모든 요청 자동 승인하므로 human 검토 없이 통과 |
| 2 human Admin | 1 또는 2 모두 정상 동작 |

> "Effectively, **having API Admins in your workspace reduces your quorum by one Admin** when it comes to updating your Admin Quorum."

→ API Admin 1명 = **quorum −1 효과** (threshold 변경 액션 한정). 운영 spine 의 새로운 리스크 패턴.

### Cold Wallet Workspace 특수 규칙 (★)

p.4-5:
- **Owner + Admin approval 필요한 모든 변경** (add users, provisioning signing devices) → **Fireblocks Support 경유 필수**
- Admin 삭제 + 그 사람의 pending request → **outstanding cancel + new submit** (새 요청은 deleted user 미포함)
- **Other workspace configuration changes** (Owner+Admin 필요 아닌 것) = **Non-Signing Admin 도 approve 가능**
- **Owner-only direct** (추가 approval 없이 Console 에서): **user delete** + **reset 2FA**

→ Cold Wallet 은 Hot 보다 enforcement 강화 — Support gate 빈도 증가.

### Approval Groups 와의 관계

p.1: "The Admin Quorum applies to all workspace policy changes by default. For greater flexibility, **use Approval Groups to define specific sets of users** for approving or denying different workspace changes."

→ Admin Quorum 은 default scope. Approval Groups = specific scope 위임 (Stage 6 의 두 위임 메뉴 — User management / Security & compliance — 와 정합).

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__admin-quorum.pdf` (6 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/admin]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[entities/fireblocks/api-user]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/security]]
