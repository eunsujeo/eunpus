<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/5253421857564-Vault-Structure-Best-Practices
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__vault-structure-best-practices.pdf
status: full
priority: TIER2
domain: Workspace-Management
-->

# Vault Structure Best Practices

*Updated 2 months ago*

## One-line summary

Vault 구조 2 패턴 (**Segregated / Sweep-to-omnibus**) + use case 별 권장 매핑 + **default 모든 user 가 모든 vault 가시성** (제한 path 2가지) + multi-workspace 필요 시점 6 trigger + **>$10M tokenization 은 3-workspace 분리 (Administrative / Operational / Custodial)** + Smart contract = segregated 권장 (Mint/Burn/Pause/Deploy/Upgrade 별 vault) + Cold Wallet 별도 workspace.

## Key Concepts

### Vault 의 구성 단위
p.1:
- **Vault** = "safe room"
- **Vault account** = "drawer", 각자 다른 lock/key
- **Asset wallet** = 자산 type 당 1개 per vault account, 고유 deposit address + key

### 2 구조 패턴

#### Segregated
- 자산을 vault account 단위로 격리
- Treasury / team / operation / client 별 분리
- **Treasury vault account** 권장 — 가장 restrictive Policy

#### Sweep-to-omnibus (p.3 diagram)
```
User Deposits (ETH/ERC-20/Omni)
       ↓
Intermediate Vault (per user, EVM/Omni)
       ↓ Sweeping
Deposit Omnibus Vault Account ←──Manual Rebalancing──→ Withdrawal Pool Vault Account
       ↑ Gas Station 자동
       ↓
External Wallet per user (User Withdrawals: 자동 sign up to threshold, manual 위)
```

→ 단일 workspace 가 **두 구조 모두 동시 보유 가능**.

### Multi-address Asset 처리

| Asset 유형 | 처리 |
|---|---|
| **UTXO + multi-address (BTC 등)** | 1 Omnibus vault + 클라이언트별 unique deposit address (permanent wallet address 에서 derived) |
| **Memo/tag/notes 지원 chain (XRP 등)** | 동일 패턴 적용 |
| **Account-based (EVM/Ethereum)** | vault account 당 **단일 address 만** → 클라이언트별 individual vault account 필요, periodic sweep |

### Use case 매핑 (p.3-4 표)

| Use Case | Sub-category | 권장 구조 |
|---|---|---|
| Treasury Mgmt | Self Custody | Segregated |
| Treasury Mgmt | Liquidity Mgmt | Segregated |
| Treasury Mgmt | Trading & Yield | Both |
| Building Retail Service (WaaS) | Financial B2C | Sweep-to-Omnibus |
| Building Retail Service (WaaS) | Financial B2B | Both |
| Building Retail Service (WaaS) | Non-financial | Sweep-to-Omnibus |
| Token Lifecycle | Financial assets | Segregated |
| Token Lifecycle | Non-financial | Segregated |
| Clearing & Settlement | - | N/A |
| Payments | Merchant settlement | Segregated |
| Payments | Cross-border | Segregated |
| Payments | Payouts | Segregated |
| Payments | Payins | Both |

### Web3 / DeFi 권장 패턴

p.4: dApp 별 분리 또는 distinct user/team 시 **Segregated**. 그 외 **Sweep-to-omnibus**.

### Smart Contract 운영

p.4: 각 smart contract privileged op 별 vault account 분리 권장:
- **Mint**, **Burn**, **Pause**, **Deploy**, **Upgrade**, 기타 privileged contract call

Policy rule 로 해당 vault 접근 인원 제한.

### High-Value Tokenization (>$10M) — 3 Workspace 분리

p.5:
1. **Administrative workspace**: smart contract deploy/upgrade, role allocation
2. **Operational workspace**: minting / burning
3. **Custodial workspace**: 자체 또는 고객 custody

→ lower-value 시 Administrative+Operational 합쳐서 2 workspace 도 가능.

### Multi-Workspace 필요 6 trigger (p.5-6)

1. 독립 client set / policy / 양쪽 — sub-company 분리
2. End client/investor 에 workspace access 제공
3. Employee viewing privilege 차등
4. **다른 configuration**:
   - AML default (fail-on-unknown vs pass-on-unknown)
   - DeFi approval cap
   - Raw Signing 허용 여부
5. 별도 **geographical location**
6. Cold Wallet 분리 (offline regulation 충족)

### Default Vault Visibility (★ 보안 spine)

p.6: "**By default, all users in the workspace have visibility to all of the Vault accounts in the workspace.**"

제한 방법 2가지:
1. **New workspace 분리** (Customer Success Manager 통해)
2. **API user 통한 custom UI** — 자체 visibility logic 구현

→ Workspace-level user mgmt 의 중요한 default. 권한 분리는 workspace 단위로만 enforce. 본질적 한계.

### Cold Wallet Workspace

p.5: Offline 보관 필요 시 **Fireblocks Cold Wallet workspace 별도 구매** → hot workspace 와 rebalancing.

→ Cold Wallet 은 별개 워크스페이스 product.

### Automation: API Co-Signer + Gas Station

p.5:
- **수백·수천 customer 운영 시 API Co-Signer** 권장 (organization logic + fee 자동화)
- **Gas Station feature**: pre-defined vault account 으로 incoming tx 자동 감지 → base asset 자동 입금 (sweeping fee 충당)

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__vault-structure-best-practices.pdf` (7 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/vault-account]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/api-co-signer]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/architecture]]
