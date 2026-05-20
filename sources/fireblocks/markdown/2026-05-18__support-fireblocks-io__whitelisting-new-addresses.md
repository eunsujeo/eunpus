<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360017819439-Whitelisting-new-addresses
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__whitelisting-new-addresses.pdf
status: full
priority: TIER2
domain: Governance / Security-Access
-->

# Whitelisting new addresses

*Updated 8 months ago*

## One-line summary

Whitelisted address = Vault 외부 deposit address. **3 wallet type** (Internal / External / Contract or Program) + **Admin Quorum approval 필수** + **immutable** (edit 불가, delete+resubmit) + **wallet 당 asset type 당 1 address**. Internal = workspace 잔액 표시 + **billable count 포함**, External = 표시 안 됨.

## Key Concepts

### 3 Wallet Type

p.1-2:

| Type | 정의 | Balance in workspace? | Billable count? | 용도 |
|---|---|---|---|---|
| **Internal** | customer-controlled, Vault 외부 | **YES** | **YES** | 자체 외부 wallet |
| **External** | client/counterparty 관리 | **NO** | (명시 안 됨) | 외부 send 대상 |
| **Contract / Program** | EVM smart contract / Solana Program ID | - | - | DApp interaction |

→ Internal 은 billable count 영향 (cost spine).

### Solana 특수 처리

p.3:
- **Contract/Program wallet** → Solana Program ID **(base58)** 입력
- **Solana user wallet / token account** → Internal 또는 External 로 등록 (Contract 아님)

### Admin Quorum Approval (★ Stage 8 spine 확장)

p.1:
> "**New whitelisted addresses must be approved by the Admin Quorum** before funds can be transferred to that address."

- Admin Quorum 멤버 한 명이라도 reject → 추후 resubmit 가능 (영구 reject 아님)
- Admin Quorum vs Policies 의 governance scope 정확히 일치 — whitelist 정의 = Admin Quorum 책임 (Stage 8 `best-practices-for-choosing-user-roles.md` 와 정합)

### Immutability

p.2:
> "**Once a whitelisted address is created, it cannot be edited.** To edit a whitelisted address, delete it, resubmit the correct address, and approve it."

→ Whitelisted address 의 **불변성** = governance integrity 의 핵심. 변경은 항상 새 approval 사이클 통과.

### Wallet 단위 제약

p.1:
- Wallet 당 **asset type 당 1 address 만**
- Counterparty 가 같은 asset 의 multiple address 보유 시 → wallet 을 여러 개 생성
- **Wallet name 도 immutable** (생성 후 변경 불가)

### Tag/Memo 처리

p.3:
- destination tag/memo/note/Bank Transfer description 필요 시 입력
- "**The recipient doesn't require a destination tag**" 옵션 (XRP 등에서 명시적 None 선언)
- **Ripple (XRP) destination tag**: 최대 9 numerical digits — 초과 시 실패 (chain-specific quirk)

### Fiat Provider 명시

p.3: Cross River, BLINC 등 fiat provider 선택 후 account 상세 입력

### P2P Network 우회 옵션

p.2: "You can avoid manually entering whitelist addresses by **connecting directly with counterparties on the Fireblocks P2P Network**."

→ 수동 입력 + Admin Quorum cycle 우회 가능. P2P Network 가 별도 trust plane.

### Delete 시 audit 보존

p.3:
- Wallet/address 삭제 후에도 transaction history 에는 **삭제 시점의 wallet name + address** 보존

### API 관리

p.4: Internal/External/Contract 각각 별도 endpoint + TypeScript/Python/Java SDK 제공.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__whitelisting-new-addresses.pdf` (5 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/vault-account]]
- [[vendors/fireblocks/security]]
