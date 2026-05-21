---
type: entity
vendor: fireblocks
status: stable
tags: [transaction]
stage_introduced: 5
last_updated_stage: 9
source_count: 5
related: [approver, designated-signer, policy, signer, tap, vault-account]
---
# Entity: Transaction (Fireblocks)

## Summary

Fireblocks workspace의 자산 이동·서명 객체. 본 자료에서는 트랜잭션의 lifecycle보다는 **role 권한표가 노출하는 동사 vocabulary**가 확인된다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.6).

## Key Concepts (verb vocabulary)

권한표 *Transactions* 섹션에서 등장하는 동사:

- **Initiate transactions** — NSA·Editor는 `Y (NS)` (designated signer 필요) (p.6)
- **Approve transactions** (p.6)
- **Sign transactions** — Owner / Admin / Signer만 (p.6)
- **Cancel transactions** (p.6)
- **Freeze / unfreeze transactions** — Owner / Admin / NSA만 (p.6)
- **Edit transaction notes** (p.6)
- **Export transaction history** (p.6)
- **Create and manage automation rules** (p.6)
- **Create smart transfer tickets**, **Fund smart transfer tickets** — 일부 role에 NS 조건 (p.6)
- **Manually confirm and credit inbound transactions** — Admin (p.2)

## Details

- NSA·Editor의 NS 라벨은 "internal exchange transfer를 제외한 모든 트랜잭션" 한정 (p.5).
- Add or approve EVM / non-EVM asset이 자산 측 트랜잭션의 분기 표현으로 등장 (p.7).
- Sandbox에서는 모든 트랜잭션이 auto-approve된다 (p.8).
- 트랜잭션 상태 머신·source/destination 타입 분류 등은 본 자료에서 다루지 않음.

## Mobile App Approval Scope (Stage 5)

`fireblocks-mobile-app-signing-and-approving.md`, p.2–3 — Mobile app에서 직접 다루는 transaction 종류 (서명 가능 vocabulary 확장):

- **Transaction signing**: Transfers, Contract calls, Minting and burning, Staking, Typed and raw messages
- **Connection approvals**: New exchange accounts, fiat accounts, P2P Network connections / routing changes, whitelisted addresses
- **Workspace settings**: Enabling one-time address transactions, "Approve" transactions amount cap, Transaction Policy changes, adding new users, updating admin quorum
- **Owner-specific**: MPC keys for new signing users

**Multi-user flow**: deny 시 모든 관련 user에게서 notification 제거.

**Destination expansion** (`fireblocks-mobile-app-signing-and-approving.md`, p.6): 서명 review 화면에서 **exchange / whitelisted / one-time address**만 full address 확장 표시. source 및 다른 destination 타입은 미확장.

## Chain-별 Transaction 제약 (Stage 7 cross-ref)

자세한 카탈로그는 [[vendors/fireblocks/blockchains]]. 주요 chain-별 transaction 제약:

### Minimum amount

`minimum-transaction-amounts.md`, p.1 — 미만 시 fail + `Amount Too Small` status:
- BTC / BCH / LTC: 0.00000582 / ALGO: 1e-6 / ADA: 1 / DOGE: 0.01 / TON: 1e-6
- 그 외는 token decimal limit 기반 (API로 조회)

### Internal transactions (EVM only)

`blockchains-that-support-internal-transactions.md`, p.1 — Internal tx = smart contract 실행 중 발생하는 native asset transfer. 별도 tx hash 없고 실행 흐름의 일부.

- Fireblocks가 모든 EVM의 **직접 native transfer**는 알림
- **Internal tx까지** 알리는 chain은 subset (~35 mainnet + ~24 testnet, Ethereum/Optimism/Arbitrum/Avalanche/Base/Celo 등)
- 본 자료군에서 감지 메커니즘(trace API / archive node) 미명세 → Q-2026-05-18-B03

### Chain-별 시간 제약

[[vendors/fireblocks/blockchains]] §"Chain-specific quirks":
- Algorand: ~50min signing window
- Tezos: ~30min + mempool 1 tx/account
- Polkadot: tx valid 2 hours

Owner/Admin Quorum approval 흐름과 시간 경합 가능.

## Related Pages

- [[entities/fireblocks/policy]]
- [[entities/fireblocks/designated-signer]]
- [[entities/fireblocks/vault-account]]
- [[entities/fireblocks/user-roles/signer]]
- [[entities/fireblocks/user-roles/approver]]
- [[vendors/fireblocks/tap]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2, p.5–7, p.8
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.2–3, p.6 (Stage 5: approval scope vocabulary)
- `2026-05-18__support-fireblocks-io__batch-approvals-and-signing.md`, p.1–6 (Stage 5: batch processing)
- `2026-05-18__support-fireblocks-io__minimum-transaction-amounts.md`, p.1 (Stage 7: chain-별 min amount)
- `2026-05-18__support-fireblocks-io__blockchains-that-support-internal-transactions.md`, p.1 (Stage 7: internal tx 정의)

## Stage 9 — Transaction State Machine 정식 명세 (★)

`transaction-lifecycle.md` + `primary-transaction-statuses.md` (Stage 9 ingest):

### 17 Primary Status — Color-Coded

| Color | Stage | Status (API code) |
|---|---|---|
| **Yellow** (Fireblocks 처리 중) | 입력/검증 | `SUBMITTED` / `PENDING_AML_SCREENING` / `PENDING_ENRICHMENT` / `PENDING_AUTHORIZATION` / `QUEUED` |
| **Yellow** | 서명 | `PENDING_SIGNATURE` / `SIGNED` (Solana-only) / `CANCELLING` |
| **Blue** (외부 처리) | 3rd party | `PENDING_3RD_PARTY_MANUAL_APPROVAL` / `PENDING_3RD_PARTY` |
| **Blue** | blockchain | `BROADCASTING` / `CONFIRMING` |
| **Green** | 종결 (성공) | `COMPLETED` |
| **Red** | 종결 (실패) | `CANCELLED` / `BLOCKED` / `REJECTED` / `FAILED` |

### Outgoing Transaction Flow

```
Submitted → Pending Screening (AML/Travel Rule, optional) → Pending Security Screening (dApp Protection)
  → Pending Authorization (2h timeout → fail)
  → Queued → Pending Signature (2h timeout → fail)
  → [Co-signer rejection] → CANCELLED
  → Pending 3rd Party (Manual Approval / 확인 대기)
  → Broadcasting (~1min) → Confirming → COMPLETED
  → 어느 단계든 → FAILED
```

### Incoming Transaction Flow

```
Start:
  AML/KYC enabled → Pending AML Screening
  Network connections / exchanges / gas station → Broadcasting
  AML/KYC disabled → Confirming (즉시 monitor)

  → [Reject by AML/KYC] → REJECTED
  → Pending 3rd Party (Manual Approval / 확인)
  → Confirming → COMPLETED
  → [User-initiated freeze via API] → REJECTED
  → 어느 단계든 → FAILED
```

### 시간 제약 (★)

| 제약 | 적용 상태 | 동작 |
|---|---|---|
| **2 hours** | Pending Authorization | timeout → fail |
| **2 hours** | Pending Signature | timeout → fail |
| **30 seconds** | Cancelling (typical) | 길어지면 Status page 확인 |
| **1 minute** | Broadcasting (typical) | 길어지면 Status page 확인 |
| **2 hours** | Solana 6번째 이상 tx Submitted | 만료 → terminated |

### Chain-Specific 처리 모델 (Q-P02 부분 응답)

`primary-transaction-statuses.md`, p.4:
- **EVM-compatible**: 동일 vault account 의 EVM tx 들은 **blockchain-standard 단위 직렬화** (Ethereum + Polygon → 순차, BTC + Solana → 병렬)
- **Solana**: vault account 당 동시 **5 tx queue** (6번째 이상은 Submitted max 2h 대기)
- **EVM withdrawal**: nonce 충돌 위험 → **multiple withdrawal vault 권장 round-robin** (`account-and-wallet-structure.md`)
- **Bitcoin withdrawal**: unconfirmed input **25-tx chain limit** (Bitcoin Core default) → **multiple withdrawal vault**

### Transaction Operations by Status

`transaction-lifecycle.md`, p.2:
- **Cancel** (Broadcasting 이전만)
- **Retry**
- **Boost / drop EVM tx** (EVM gas parameter)
- **Boost UTXO tx**
- **Rescreen / bypass AML policy results**
- **Dismiss** transaction card
- **Replace-By-Fee (RBF)** for EVM during Broadcasting

### dApp Protection (Pending Security Screening)

`primary-transaction-statuses.md`, p.3: enrichment 3 type:
1. **Typed messages on any EVM blockchain** — parse + signer 에 표시
2. **Contract calls on Ethereum** — contract simulation 후 vault asset 영향 + final value + fee 표시
3. **Any dApp-initiated tx** — dApp + destination anomaly scan, sanctioned 시 notification (advisory only — signer 가 무시 가능)

### Signed Status (Solana Sign-Only)
- Signed payload **client 에 반환** (Fireblocks 가 broadcast 안 함)
- **NOT BROADCAST BY FIREBLOCKS** 태그 자동
- on-chain 감지 시 Completed/Failed transition
- Timeout 미달성 시 자동 invalidate

### Approvers Unanimous-Veto Rule

`transaction-lifecycle.md`, p.6: "If **at least one person chooses to reject** a transaction, the transaction is rejected."
- Approvers 가 N명이어도 reject 1표 = tx 즉시 rejected

### Webhook Multiple-Notification 패턴

`primary-transaction-statuses.md`, p.6: zero-confirmation Deposit Policy 의 경우 Completed status 에 대해 multiple webhook 수신 가능 (blockchain appearance + 첫 confirmation + 추가).

### Raw Signing Special Path

- **일반**: Pending Signature → (broadcast 없음) → Completed
- **Cached signature** (동일 raw data 재서명): Submitted → Completed (전체 ceremony 우회)

### Outgoing vs Incoming Asset Lock 차이 (★)

`primary-transaction-statuses.md`, p.8:
- **Outgoing rejected** → 자산 즉시 사용 가능 (re-tx 가능)
- **Incoming rejected** → "자산이 **Admin 가 unfreeze 할 때까지 사용 불가**"

→ Rejected incoming 의 cleanup 은 Admin 권한 별도 trigger 필요.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__transaction-lifecycle.md`, p.1-7 (Stage 9: outgoing/incoming flowchart, 14-step schematic, zero-trust)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.1-10 (Stage 9: 17 status enumeration, 시간 제약, chain-specific quirk)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.6-7 (Stage 9: EVM nonce / Bitcoin 25-chain withdrawal quirk)
- `2026-05-18__support-fireblocks-io__whitelisting-new-addresses.md`, p.1-5 (Stage 9: whitelist Admin Quorum approval gating)
- `2026-05-18__support-fireblocks-io__one-time-address-ota-feature.md`, p.1-2 (Stage 9: OTA whitelist 우회 path)

## Open Questions

- ~~Q-2026-05-18-P02~~ — **부분 ANSWERED (Stage 9)**: EVM blockchain-standard 직렬화 + Solana 5-tx queue + BTC 25-tx chain limit 의 chain-specific tx 처리 모델 정식 명세
- Q-2026-05-18-P03 — Smart transfer ticket, Automation rule의 정의
