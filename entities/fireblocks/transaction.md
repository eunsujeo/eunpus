---
type: entity
vendor: fireblocks
status: stable
tags: [transaction, key-link]
stage_introduced: 5
last_updated_stage: 152
source_count: 10
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
- [[docs/architecture/nonce-management-reference]] — EVM 트랜잭션 nonce 운영 (failOnLowFee 의 stuck-cascade 맥락) (Stage 46)
- [[entities/canton/canton-network]] — Canton 2-step transfer 모델 (transactionType OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL 의 원본 체인) (Stage 52)

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

### Boost (RBF) 메커니즘 — createTransaction 재사용 (Stage 152, CSM 확답)

- **호출** — boost 는 원 요청과 **같은 파라미터로 `createTransaction` + `replaceTxByHash`**(같은 nonce·fee 만 인상 = RBF). `externalTxId` 는 **원본과 같은 값 사용 가능**(CSM: "you can use the same ID"). low-fee 로 mempool 에 걸린 tx 에만 해당.
- **결과 tx type** — 공식 문서는 "새 tx 는 TRANSFER 가 된다"지만, 실측상 **CONTRACT_CALL 만 TRANSFER 로 바뀌고** MINT 등 다른 type 은 그대로 유지(CSM 확답: "only for CONTRACT_CALL").
- **원본 ↔ boost/drop 연결** — boost·drop 모두 **`replacedTxHash` 필드에 이전 tx id** 가 담긴다. 단 이 필드는 **콜백 payload 엔 없고** "Get Transaction by Fireblocks ID" 응답으로만 조회된다 — 승인 단계 연결 제약은 [[entities/fireblocks/callback-handler]].

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

## Stage 36 — Key Link Signing Flow

`fireblocks-key-link-overview.md`, p.2-3 + `getting-started-with-fireblocks-key-link.md`, p.7 (Stage 36 Mode C).

Stage 9 의 14-step transaction flow 의 **signing 단계 (step 10)** 가 Key Link workspace 에서 다음 변형으로 동작:

### Key Link Signing Pipeline (★ MPC 와 직교)

```
Stage 9 step 10 (Co-Signer Engine → Co-Signers) 대체:

10'. Co-Signer Engine → Fireblocks Agent (customer 측, polling)
     ↓ (HTTPS)
10'a. Agent → Customer Server
     ↓ (vendor-specific, often HTTPS or local protocol)
10'b. Customer Server → HSM (ECDSA or EdDSA sign)
     ↓
10'c. HSM signature → Customer Server → Agent → Fireblocks SaaS
11.   Auth Engine 이 validation key 로 signature 검증
12-14. Stage 9 와 동일 (Secure Vault → Node → Blockchain)
```

### Policy 와의 연동 (`getting-started-with-fireblocks-key-link.md`, p.7)

> "For each Policy rule, you must ensure the **designated signer is set to the API user you created for the Fireblocks Agent**."

→ Stage 9 의 designated-signer pattern (NS 라벨 의 NSA / Editor) 가 Key Link 에서는 **Agent-paired Signer-role API user 로 강제**. Policy rule 마다 명시 필요.

### MPC plane 과의 동작 차이 요약

| 단계 | MPC (Stage 9) | Key Link (Stage 36) |
|---|---|---|
| 5. Balance / AML / Travel Rule | 동일 | 동일 |
| 6-7. Policy Engine TAPs | 동일 (designated signer = mobile or API co-signer) | 동일 (designated signer = Agent-paired API user) |
| 8. Secure Vault 가 tx assemble | 동일 | 동일 |
| **10. Signing** | **3-endpoint MPC ceremony** (Mobile/SGX + 2 Azure SGX) | **외부 HSM 단독 서명** (Agent → Customer Server → HSM) |
| 11. Signature 검증 | Aggregator 가 partial signatures 결합 → full signature | Auth Engine 이 customer HSM signature 를 validation key 로 검증 |
| 12-14. Vault → Node → Blockchain | 동일 | 동일 |

→ Stage 9 의 **transaction state machine (17 status, 2h timeout, Outgoing/Incoming flow) 는 Key Link 에서도 동일 적용** — 키 plane 만 분기, transaction lifecycle 은 share 됨.

### Algorithm 제약 (`set-up-your-fireblocks-vault-with-key-link.md`, p.2-3)

Key Link asset wallet 생성 가능 여부 = **vault account 에 해당 algorithm 의 signing key 가 assigned 되어 있는가**. Missing 시 Console "Create asset wallet" 화면에 warning.

→ Stage 9 의 chain-specific tx 제약 (Solana 5-tx queue, EVM serial, BTC 25-chain) 은 Key Link 에서도 그대로 적용 (chain 자체 제약이라 signing plane 무관).

## Sources (Stage 36 추가)
- `2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt`, p.2-3 (Stage 36: Agent → Customer Server → HSM signing pipeline)
- `2026-05-22__support-fireblocks-io__getting-started-with-fireblocks-key-link-extracted.txt`, p.7 (Stage 36: Policy designated signer requirement)
- `2026-05-22__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link-extracted.txt`, p.2-3 (Stage 36: Algorithm-asset matching)

## Stage 36 — API Data Object Schema (transaction-objects.md ingest)

`transaction-objects.md` (Stage 36 Mode C, body via curl).

### 8 Destination Types (정식 enumeration, p.DestinationTransferPeerPath)

Stage 9 의 transaction lifecycle 의 destination 분류가 API schema level 까지 정형화:

| Type | 정체 |
|---|---|
| `VAULT_ACCOUNT` | 같은 workspace 의 다른 vault account |
| `EXCHANGE_ACCOUNT` | exchange 연동 계좌 (Binance / Coinbase 등) |
| `INTERNAL_WALLET` | workspace 잔액 표시 + billable whitelisted |
| `EXTERNAL_WALLET` | workspace 외부, 잔액 표시 안 함 whitelisted |
| `UNMANAGED_WALLET` | Fireblocks 가 직접 관리하지 않는 wallet container |
| `ONE_TIME_ADDRESS` | OTA (Stage 9 의 whitelist 우회 path) |
| `NETWORK_CONNECTION` | Fireblocks P2P Network counterparty |
| `FIAT_ACCOUNT` | fiat provider 계좌 |

### NetworkStatus enum (blockchain layer, p.NetworkStatus)

`DROPPED` (mempool 누락) / `BROADCASTING` / `CONFIRMING` / `FAILED` / `CONFIRMED`

→ Stage 9 의 17 primary status 와 다른 plane — **blockchain network 자체의 tx 상태**. DROPPED 는 Fireblocks 의 Failed 상태 의 한 원인 (mempool dropping → tx replay 또는 boost 필요).

### reorg 시 상태 전이 (Stage 150 — Fireblocks Support 확답)

CONFIRMING 트랜잭션은 reorg 가 나도 **BROADCASTING 으로 회귀하지 않는다**. reorg 로 거래가 블록에서 드랍되면 Fireblocks 는 **실패·취소·만료로 표시**하고 하위 상태로 **`DROPPED_BY_BLOCKCHAIN`** 을 붙인다 — 즉시 반영(유예 없음). 즉 무효화 판정 = **status FAILED(또는 CANCELLED·만료) + subStatus `DROPPED_BY_BLOCKCHAIN`**. 공식 substatus 문서상 `DROPPED_BY_BLOCKCHAIN` = "mined but dropped" 라 reorg 드랍을 커버한다.

얕은 reorg 로 잠깐 빠졌다 재편입되는 케이스나 confirmation 수 감소(예: 1→0)는 확답 밖 — 상태 실시간 반영 원칙상 CONFIRMING 유지·confirmation 재계산으로 해석(미확정). "ORPHANED" 같은 별도 신호는 없다 (Q-2026-07-03-T04 ANSWERED).

(source: `2026-07-03__fireblocks-support-slack__reorg-status-semantics.md` = raw `sources/fireblocks/csm.txt` — Fireblocks CSM Richard Smith · 백엔드 팀 확인)

### Chain-Specific Blockchain Info (p.BlockchainInfo)

Stage 7 의 chain-specific quirk 가 API contract level 까지 침투:

| Chain | 특이 필드 | 의미 |
|---|---|---|
| **HBAR** | `hbarTxHash` | Hedera tx hash |
| **EVM** | `evmTransferType`: `NATIVE` / `TOKEN` / `INTERNAL` | Stage 7 의 internal tx 정의 cross-ref. TOKEN = log 기반, INTERNAL = trace 기반 |
| **TON** | `messageComment` (raw payload), `tonTransferType`: `NATIVE` / `JETTON`, `hashes.{externalIncoming, tonTransfer, jettonTransfer}` | TON 의 arbitrary message body 노출 — non-standard format custom parsing 필요 |
| **CANTON** (★ NEW) | `transactionType`: `OFFER` / `ACCEPT` / `REJECT` / `WITHDRAW` / `PRE_APPROVAL`, `traceableId`, `hashes.*UpdateId` | ★ **2-step transfer protocol** — sender OFFER → recipient ACCEPT/REJECT/WITHDRAW. PRE_APPROVAL = 1-step (Kraken 등 외부 source) |
| **DOT** | `substrateExtrinsicId` | Polkadot extrinsic ID |
| **SUI** | `gasUsed` breakdown: `storageCost` / `storageRebate` / `computationCost` / `nonRefundableStorageFee` | Sui 의 storage rebate 모델 |

→ ★ **Canton 의 2-step transfer protocol** 은 Stage 9 의 outgoing tx flow 와 **다른 lifecycle** — Q-2026-05-22-A11.

★ **A11 ANSWERED (Stage 78)** — developers.fireblocks.com/reference/transaction-objects 확인: Fireblocks 는 Canton 2-step 을 generic status 로 collapse 하지 않고 **전용 `transactionType`** 으로 노출(`OFFER`=전송 개시·2-step 1단계 / `ACCEPT`=수신자 수락·완료 / `REJECT`=수신자 거절 / `WITHDRAW`=송신자 취소 / `PRE_APPROVAL`=사전승인 1-step 즉시완료). `traceableId`=원 OFFER UpdateId, **`CantonHashes`**(`offer/accept/reject/withdraw/preApprovalUpdateId`) — "for ACCEPT/REJECT/WITHDRAW, `offerUpdateId` links back to the original OFFER … full lifecycle tracking". 일반 NetworkStatus(BROADCASTING/CONFIRMING/CONFIRMED/FAILED/DROPPED)는 별도. timeout = 수락 안 되면 송신자 `WITHDRAW`(앱 정책). (source: developers.fireblocks.com transaction-objects)

### Node Routing — NODE_ROUTER vs MEV (★ Stage 36 신규 plane)

`NodeControls.type` enum:
- `NODE_ROUTER` — customer-provided node 로 라우팅 (Stage 7 Node Router)
- **`MEV`** — MEV protection routing (Q-2026-05-22-A10 — Flashbots private mempool 추정 미확정)

→ Stage 7 의 Node Router 외에 별개 routing plane. EVM-only로 추정.

### Raw Signing Typed Messages (`raw-signing-objects.md` 4 types)

`UnsignedRawMessage.type` enum:
- `EIP191` — ETH personal_sign
- `EIP712` — ETH typed structured data
- `TIP191` — TRX personal_sign
- `BTC_MESSAGE` — Bitcoin personal message

→ Stage 5 의 mobile app signing scope (Typed/raw messages) 의 protocol-level enumeration.

### Raw Signing Cold Wallet PreHash (★ Cold Wallet workspace 한정)

`PreHash.hashAlgorithm` 5 종: `SHA256` / `KECCAK256` / `BLAKE2` / `SHA3` / `DOUBLE_SHA256`.

→ Regular workspace 는 PreHash 불요 — Cold Wallet workspace 만 prehash 제공 필수. Stage 14 의 Cold Wallet cluster catalog 와 paired API contract.

### Fee Model — EIP-1559 + Solana Rent (`fee-estimation-objects.md`)

| Asset | Fields |
|---|---|
| **UTXO** | `feePerByte` |
| **EVM** | `gasPrice` / `gasLimit` + EIP-1559: `baseFee` + `priorityFee` |
| **Solana** | `baseFee` + `priorityFee` + **`rent`** (account creation/storage) |
| **Other** | `networkFee` |

`EstimatedTransactionFeeResponse`: `low` / `medium` / `high` 3 tier — Stage 9 의 fee level 선택 cross-cut.

### Transaction Authorization (Stage 10 governance API contract)

`transaction-authorization-objects.md` p.AuthorizationInfo:

```
AuthorizationInfo {
  allowOperatorAsAuthorizer: bool  ← initiator self-approval 허용?
  logic: "AND" | "OR"              ← multiple groups 간 logic
  groups: [{ th: number, users: { userId: ApprovalStatus } }]
}

ApprovalStatus: "PENDING_AUTHORIZATION" | "APPROVED" | "REJECTED" | "NA"
```

→ Stage 10 의 user-group N-of-M policy 의 API shape. **logic="OR"** 가 Stage 10 의 1/N OR threshold (Stage 8 across-group) cross-ref.

### Transaction Screening Verdicts (`transaction-screening-objects.md`)

`TravelRuleScreeningResult.verdict`: `ACCEPT` / `REJECT` / `ALERT` / `WAIT` / `FREEZE` / `CANCEL`

→ Stage 9 의 Pending Screening (AML/Travel Rule) 의 verdict enum. **WAIT** / **FREEZE** = manual escalation lane.

## Sources (Stage 36 reference 추가)
- `2026-05-22__developers-fireblocks-com__reference-transaction-objects.md`, p.1-7 (8 destination types, NetworkStatus, BlockchainInfo, NodeControls)
- `2026-05-22__developers-fireblocks-com__reference-transaction-authorization-objects.md`, p.1-2 (Authorization data model)
- `2026-05-22__developers-fireblocks-com__reference-raw-signing-objects.md`, p.1-2 (Typed messages + Cold Wallet PreHash)
- `2026-05-22__developers-fireblocks-com__reference-transaction-screening-objects.md`, p.1-2 (Travel Rule verdicts)
- `2026-05-22__developers-fireblocks-com__reference-fee-estimation-objects.md`, p.1-2 (EIP-1559 + Solana rent)
- `2026-07-03__fireblocks-support-slack__reorg-status-semantics.md` (= raw `sources/fireblocks/csm.txt`) — reorg 시 CONFIRMING↛BROADCASTING · 드랍 = FAILED + `DROPPED_BY_BLOCKCHAIN` (Stage 150, Fireblocks Support 백엔드 팀 확답)
- `sources/fireblocks/csm2_boost.txt` — boost(RBF) = createTransaction + replaceTxByHash · type 변경은 CONTRACT_CALL 만 · externalTxId 재사용 가능 · replacedTxHash(Get Transaction by ID)로 원본 연결 (Stage 152, Fireblocks CSM · Kakao PoC)

## Stage 36 — Create Transaction API Contract (`create-transactions.md`)

`create-transactions.md` (Stage 36 Mode C, body via curl).

### 7 Operation Types (정식 enumeration)

`operation` body parameter:

| Operation | 용도 | 지원 chain |
|---|---|---|
| **TRANSFER** (default) | 자금 이동 | All — UTXO 는 multi-input/output, 그 외는 single source/destination |
| **CONTRACT_CALL** | EVM smart contract method call | EVM 전반 |
| **PROGRAM_CALL** | Solana program call | Solana |
| **TYPED_MESSAGE** | Off-chain typed message signing | EVM (EIP-191 personal / EIP-712 typed), TRX (TIP-191), BTC |
| **RAW** | Off-chain raw message signing | Any — custom protocol / non-supported chain |
| **MINT** | Token supply 증가 | Stellar, Ripple, EVM |
| **BURN** | Token supply 감소 | Stellar, Ripple, EVM |

→ Stage 9 의 transaction state machine 의 input axis. 모든 operation 이 같은 17-status state machine 통과.

### Critical Pattern: externalTxId Idempotency (★)

> "A *critical* practice to avoid processing multiple identical POST transaction requests more than once is to use the `externalTxId` parameter."

- Max 255 chars
- 같은 `externalTxId` 의 추가 request 는 **Fireblocks 측에서 reject**
- → Stage 9 의 retry / network failure 시나리오의 **duplicate-spend 방어선**. Idempotency key 의 표준 패턴.

### Optional Parameters (운영 영향 큰 4개)

| Parameter | Default | 효과 |
|---|---|---|
| `externalTxId` | none | ★ idempotency key (max 255 chars) |
| `treatAsGrossAmount` | `false` | `true` 시 network fee 가 requested amount 에서 차감됨. 전체 잔액 송금 시 자동 적용 |
| `feeLevel` | `MEDIUM` | `LOW` / `MEDIUM` / `HIGH` — ETH / Solana / UTXO 만 지원 |
| `failOnLowFee` | `false` | `true` + MEDIUM fee 가 acceptable 보다 높을 때 → tx fail (stuck 방지) |

→ `failOnLowFee` = Stage 7 의 EVM nonce 충돌 / BTC 25-chain quirk 의 mitigation 패턴. **Pre-emptive fail > stuck transaction**.

### Source / Destination Combination Matrix

API 가 모든 source/destination 조합 지원:
- vault account / OTA / internal wallet / external wallet / contract wallet / Network connection / exchange / fiat
- UTXO assets: **multi-destination 가능** (한 tx 에 N destinations)
- Account-based: single source + single destination

### extraParameters Object (전용 use case)

- **Raw signing**: `messages` array (UnsignedRawMessage objects) + `algorithm` optional
- **Contract calls**: `contractCallData` (hex-encoded function call data)
- **UTXO selection**: `inputsToSpend` / `inputsToExclude` (Stage 9 의 InputsSelection 의 API surface)

→ Stage 9 의 Raw Signing Special Path 의 input format 명확화. `contractCallData` 가 EVM ABI encoding 의 raw bytes.

### Contract Call Pattern (EVM)

```
operation: CONTRACT_CALL
assetId: "ETH" (gas asset)
destination: { type: ONE_TIME_ADDRESS, oneTimeAddress: { address: <contract> } }
amount: "0" (또는 payable amount)
extraParameters: { contractCallData: <hex ABI-encoded> }
```

→ Stage 9 의 dApp Protection (Pending Security Screening) 의 contract simulation 이 본 payload 의 contractCallData 를 parse → vault asset 영향 + final value + fee 표시.

## Sources (Stage 36 create-transactions 추가)
- `2026-05-22__developers-fireblocks-com__reference-create-transactions.md`, p.1-20 (7 operations, idempotency, optional params, source/dest matrix)

## Stage 40 — DCCP 와 confirmation lifecycle (★)

`default-deposit-control-and-confirmation-policy.md` + `build-a-custom-deposit-control-and-confirmation-policy.md` + `blockchain-confirmation-limitations.md` 통합. **DCCP = transaction lifecycle 의 truth-determination layer** — chain tx 가 언제 deposit 으로 "completed" 되는지 결정. Stage 9 의 17-status state machine 에서 `CONFIRMING` → `COMPLETED` 전이를 trigger 하는 정책.

### Default DCCP — per-chain rule

`default-...md`, p.1:

- **Ethereum Classic = 372 confirmations** (51% attack risk 명시)
- **Finality-property 체인** = chain 별 rigid value (rigid, customer override 불가)
- **그 외 모든 체인 = 1 confirmation** (vault↔vault 포함)
- **Contract call op = 3 confirmations (recommended minimum)**

### Custom DCCP — 6 parameters, first-match

`build-a-custom-...md`, p.1-3:

- Parameters: Source / Destination / Amount / Asset / Blockchain network / # of Confirmations
- Source / Destination: vault account / group / general (all exchanges, all P2P Network connections)
- Amount: USD equivalent / asset quantity / `Any`
- # Conf 의 `Minimum` 값 = chain 별 minimum 으로 동적 매핑
- ★ Custom DCCP 활성화 = **Fireblocks Support 제출 → review/approval/implementation** (customer self-service 불가)

### Chain Min/Max — hard limit

`blockchain-confirmation-limitations.md`, p.1-4:

- **EVM minimum = 1** (rigid, 0 불가)
- Max conf 등급별: 1 / 2 / 3 / 20 / 30 / 100 / 300 / 1200
- Ethereum max = 100, ETC max = 1200, Polygon max = 300

### Finality-property 체인 — rigid

`blockchain-confirmation-limitations.md`, p.4-6:

- 1 conf: ALGO / ATOM / INJ / CELESTIA / CRONOS / HBAR / MORPH / RIPPLE / STABILITY / STELLAR / TON
- 2 conf: EOS / HUMANITY / KAVA / KUSAMA / LINEA / TERRA / TEZOS
- 3 conf: WorldMobile
- **POLKADOT** + **SOL**: dual-level (Confirmed 1 / Finalized 2) — Fireblocks 는 **`Confirmed`** 사용

### SOL 의 `Confirmed` 선택 (★ 직접 인용)

`blockchain-confirmation-limitations.md`, p.6:

> "we only mark confirmed blocks as completed. Confirmed blocks are backed by votes from the majority of validators and have a very low probability of being reverted. **Based on our analysis, a reversion has never happened before.**"

→ Fireblocks 의 deposit completion 은 chain-level finality 외에 **자체 empirical risk monitoring** 을 포함. **Q-2026-05-18-B03 부분 ANSWERED**.

### Stage 9 state machine 과의 연결

- Stage 9 의 `CONFIRMING` status = DCCP `# of Confirmations` 충족 대기 단계
- Confirmation 수 충족 → `COMPLETED` 로 전이
- DCCP 의 first-match rule 결과에 따라 동일 tx 도 `CONFIRMING` 시간이 가변 (예: vault↔vault BTC 0 conf 즉시 completed, 외부 BTC 3 conf 대기)

### 운영 함의 (KR 은행 관점)

1. **Vault-to-vault 0 conf** = "trusted internal source" 가정 — KR 감사 관점에서 1 conf 이상 강제 검토
2. **SOL `Confirmed`** = Fireblocks 의 empirical 정책 — regulatory pressure 시 `Finalized` 의무 변경 가능성
3. **Custom DCCP self-service 불가** = Fireblocks Support review-approval 경유 → 정책 변경 lead-time / audit trail 별도 확인 필요

자세한 chain 별 권장값 + max table 전체는 [[vendors/fireblocks/blockchains]] §"Deposit Control and Confirmation Policy (DCCP)" 참고.

## Sources (Stage 40 DCCP 추가)
- `2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy.md`, p.1
- `2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy.md`, p.1-3
- `2026-05-19__support-fireblocks-io__blockchain-confirmation-limitations.md`, p.1-6
