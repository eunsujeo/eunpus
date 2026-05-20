<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/6986895761948-Account-and-wallet-structure
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__account-and-wallet-structure.pdf
status: full
priority: TIER2
domain: Workspace-Management
-->

# Account and wallet structure

*Updated 4 months ago*

## One-line summary

5-level 계층 (**Customer Domain > Workspace > Vault Account > Asset Wallet > Deposit Address**) + **3 asset 패턴 별 address 매핑** (UTXO 1+N / account-based 1 / tag-memo 1+N) + **Mainnet/Testnet workspace 분리 및 node 분리** + **Hot/Cold workspace 분리** + **Round-robin withdrawal vault** 권장 (EVM nonce / Bitcoin 25-chain limit 회피) + Gas Station 동작 조건 (`balance < gasThreshold && new token transferred`).

## Key Concepts

### 5-Level 계층 (p.1)

```
Customer Domain  (logical group, top)
  └── Workspace  (Hot 또는 Cold, Mainnet 또는 Testnet)
        └── Vault Account
              └── Asset Wallet  (1 per asset type per vault account)
                    └── Deposit Address  (1 또는 N, asset 패턴에 따라)
```

### Workspace Type 매트릭스

| 축1 | 축2 |
|---|---|
| **Hot workspace** | hot wallet 보유, online 운영 |
| **Cold workspace** | cold wallet 보유, offline storage (별도 product) |
| **Mainnet workspace** | staging + production, Mainnet node 만 연결 |
| **Testnet workspace** | sandbox + development, Testnet node 만 연결 |

→ Mainnet/Testnet 은 **node 분리** (cross-network 없음).

### Asset Type → Address 매핑 (★ p.2)

| Asset 패턴 | 예시 | Permanent Address | Deposit Address 개수 | Tag/Memo |
|---|---|---|---|---|
| **UTXO-based** | BTC | 1 | **N** | - |
| **Account-based (no tag)** | ETH, EVM | - | **1** (단일) | - |
| **Account-based (tag/memo)** | XRP, XLM | - | 1 (on-chain 동일) | **N tags/memos** (구분자) |

→ EVM 의 "1 vault account = 1 address" 제약이 정식 명시 (이전 Stage 의 `vault-account.md` 와 정합).

### 2 Vault Structure Type (단일 workspace 공존 가능)

#### Omnibus
- 중앙 vault + end client vault 들
- Funds 가 individual → swept to central
- UTXO/tag-memo: Omnibus 안에서 클라이언트별 unique deposit address
- Account-based (no tag): **intermediate vault** 필요 (per client)

| Aspect | Omnibus 장점 | Omnibus 단점 |
|---|---|---|
| Tx fees | Internal tx no fee, off-chain ledger | reconciliation 필요 (private vs blockchain) |
| 관리 | 단순화 + privacy + Core Banking 연계 | Account-based 의 intermediate vault 복잡 |
| Smart contract | - | Smart contract 가 reconciliation 방해 가능 |

#### Segregated
- Per-client vault account
- Settlement 이 on-chain atomic
- 추적/감사 단순
- counterparty risk 감소

| Aspect | Segregated 장점 | Segregated 단점 |
|---|---|---|
| Truth source | Blockchain = single source of truth | Internal settlement 이 대다수면 on-chain fee 부담 |
| Tracking | 단순, audit 용이 | public chain TPS limit ↔ enterprise volume 한계 |
| Privacy | - | customer privacy 우려 → 추가 mitigation 필요 |

### Address Creation Flow

**Omnibus (UTXO/tag-memo)**:
1. End user (Alice) → BTC/XRP address 요청
2. Customer app → API GW → Omnibus vault 안에 new deposit address (또는 tag/memo) 생성
3. Customer private ledger 에 Alice 매핑
4. Alice 가 deposit address 수신

**Omnibus (account-based, no tag)**:
1. Alice → ETH address 요청
2. Customer app → **new intermediate vault account** 생성 → asset wallet + deposit address
3. Mapping 후 Alice 통보

**Segregated**:
1. Alice → asset 요청
2. Vault account 신규 생성 또는 reuse → asset wallet + deposit address
3. Alice 통보
- UTXO/account-based 차이 없음

### Deposit Flow (공통)
1. Alice 가 deposit address 로 송금
2. Fireblocks 에 incoming transfer appear → on-chain 확인 후 balance update
3. **Webhook event** 발사 → customer webhook listener
4. Listener 가 internal ledger update
5. Front-end 가 balance/history 갱신

### Withdrawal Flow — Round-Robin 권장 (★)

p.6-7 (chain-specific 제약):

| Chain | 단일 withdrawal vault 의 위험 | 권장 |
|---|---|---|
| **EVM-based** | nonce 가 순차 — 한 tx 가 stuck 되면 **전체 queue 정체** | **Multiple withdrawal vault, round-robin** |
| **Bitcoin** | unconfirmed input 이 **25 subsequent tx** 까지만 chain 가능 (Bitcoin Core default) | **Multiple withdrawal vault, round-robin** |

→ Withdrawal 부담을 여러 vault 에 분산하여 chain-specific bottleneck 회피.

### Fireblocks Gas Station Logic (p.8)

```python
if ETH balance < gasThreshold and new_token_transferred:
    Transfer ETH up to gasCap
else:
    Don't transfer any ETH
```

→ Gas Station = **base asset (ETH)** 잔액이 threshold 미만 + 새 token 입금 trigger 시 자동 충당. account-based asset 의 sweeping 운영 필수 component.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__account-and-wallet-structure.pdf` (9 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/vault-account]]
- [[entities/fireblocks/sandbox-workspace]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/architecture]]
