<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/19156998685980-About-Policies
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__about-policies.pdf
status: full
priority: TIER1
domain: Governance
-->

# About Policies

*Updated 3 months ago*

## One-line summary

Policy 의 정식 정의 + **3 action** (allow / block / forward for approval) + **2 rule component** (Parameters + Actions) + **first-match principle** + **5 default Policy rule** (Transfer NFT / Transfer asset / Contract Call / Approve / **All-block last, 삭제 불가**) + **Policy 관리 = Owner + Admin-level + approval group approval**. → Q-P01 partial.

## Key Concepts

### Policy = Primary Security Control (★ 공식)

p.1 Important: "**Implementing the correct Policies is critical to protecting your assets.** Policies are your **primary security control** in your workspace."

→ Stage 8 OTA doc 의 "Policy = OTA 의 사실상 유일한 자동 방어선" 일반화. Policy 가 Fireblocks 보안 모델의 first-class spine.

### 3 Policy Engine Actions

p.1-2 (정식 enumeration):
1. **Allow** — 자동 통과 → signed + blockchain broadcast
2. **Block** — 자동 차단 → signed + broadcast 안 됨
3. **Forward for approval** — specific approver 또는 approval group 으로 전달

### Policy 적용 범위

p.2: "Your Policies govern transfers from your connected third-party main accounts to other destinations, including other exchange, fiat, or vault accounts, Fireblocks P2P Network connections, or whitelisted addresses. Policies **do not govern certain transactions within specific third-party accounts**."

→ Internal third-party (예: exchange 내부 이체) 은 Policy 적용 대상 외. Boundary 명시.

### Policy Rule 2 Component

p.3:
- **Parameters**: characteristic 매칭 (initiator, destination, asset 등)
- **Actions**: allow / block / approval

### First-Match Principle

p.3: "The Policy Engine applies rules using the **first-match principle** by scanning your Policy from top to bottom and applying the first rule that matches the transaction. Because of this, **rule order matters**; place more restrictive rules before less restrictive ones."

→ Rule ordering 자체가 governance 결정. Stage 9 의 `BLOCKED` substatus 가 violated rule number 노출 → resolve 방법 = 새 rule 을 더 앞에 배치.

### Policy 관리권

p.3: "Only your **workspace Owner or other Admin-level users** can manage Policies. They use the Fireblocks Console to create and make ongoing changes to your Policies. Your **assigned approval group** must approve any proposed Policy changes."

→ 관리권 = Owner + Admin-level (Admin + NS-Admin). 변경 자체는 **assigned approval group approve** (Stage 10 approval-groups 의 12 actions 중 "Changing Policies").

### Policy Types (= Transaction Categories)

p.2: Policy 는 transaction type 별로 구분. Configurable field 가 operation type 마다 다름:
- **Scope Fields** (initiator, source, destination 등)
- **Funds Fields** (asset, amount 등)
- **Action & Special Fields** (allow/block/approval, advanced)

(상세 표는 collapsible UI 로 본문에 펼쳐지지 않음 — `policy-rule-parameters.md` 별도 참조)

### Premium Features 분리

p.2: "**Raw Signing, Mint, and Burn are premium features** that require an additional purchase."

→ 일부 transaction type (특히 smart contract 운영 op) 은 별도 라이선스. Vault Structure Best Practices 의 Mint/Burn/Pause/Deploy/Upgrade segregated vault 권장과 정합.

### 5 Default Policy Rules (★ p.4)

신규 workspace 자동 적용 — **4개는 specific Policy type, 1개는 모든 Policy 공통**:

**Transfer Policy** (2 rules):
1. **Allow** NFT transfer → whitelisted address (vault 포함)
2. **Allow** 모든 USD amount 모든 asset → whitelisted address (vault 포함)

**Contract Call Policy**:
3. **Allow** contract call → 모든 wallet 에서 모든 blockchain 의 whitelisted smart contract

**Approve Policy**:
4. **Allow** Web3 Approve tx (contract call 이 자산 인출 권한 부여)

**All Policies (마지막 rule, 모든 Policy 공통, 삭제 불가)**:
5. **Block** any tx not explicitly allowed

→ **Default-deny architecture**. 5번째 rule 이 explicit allow 없으면 모든 tx block. 4번째까지의 default allow rule 은 **whitelist 가 있어야** 작동.

### Default Policy 의 동작

p.4:
- Default Policy 는 **grayed out**, 다른 Policy rule 이 **없을 때만 active**
- Custom Policy 생성 → default rule **즉시 삭제** (replacement)
- Custom Policy 전부 삭제 → default 복원

→ **Custom Policy 도입은 one-way replacement** (mixed mode 없음).

### Default Policy 의 전제

p.4 Important: "default Policy rules only apply to **whitelisted addresses**, default rules are only effective when **at least one address is whitelisted**."

→ Whitelist 미설정 = 모든 tx block (마지막 5번째 rule 에 걸림). Whitelist + Admin Quorum approval 이 Policy 의 baseline.

### User Group 통합

p.4: "User groups enable you to apply rules to **sets of multiple users**, simplifying your Policies and reducing the need to revise them as your team changes."

→ Approval group 의 base 인 user group 이 Policy rule 의 Parameters 에도 사용 가능. User group = governance 의 cross-cutting building block.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__about-policies.pdf` (5 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/policy]]
- [[vendors/fireblocks/policy-engine]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/admin]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
