---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [api, identity, data-objects]
stage_introduced: 1
last_updated_stage: 36
source_count: 14
related:
  - api-co-signer
  - api-key
  - api-user
  - architecture
  - authentication
  - callback-handler
  - csr
  - ip-allowlist
  - lifecycle-events
  - transaction
  - workspace
---
# Fireblocks — API

> REST API / SDK / Webhook 표면.

## Summary

_TODO: REST endpoint·SDK·Webhook 표면 명세는 추후 자료. 현재 자료로 채울 수 있는 것은 API user authentication 표면·credential·네트워크 게이트._

본 자료에서 확인된 핵심 (sources: `add-api-users.md`, `re-enrolling-api-users.md`, `rename-and-delete-api-users.md`, `allowlist-ip-addresses-for-api-user-requests.md`):

- API user는 자동화·서드파티 통합 진입점 — view / initiate / **automatically approve** / **automatically sign** / 통합 (`add-api-users.md`, p.1)
- 인증: CSR/X.509 (RSA 4096) → API key (`add-api-users.md`, p.1–2)
- 네트워크 게이트: IP allowlist (`/32` CIDR, Owner-only) (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- 서명 능력: API user와 Co-signer 페어링 + Owner의 key share 승인 (`add-api-users.md`, p.2; `re-enrolling-api-users.md`, p.1)
- 권한 매트릭스: Console user와 동일 9 role (`add-api-users.md`, p.2)

## Key Concepts

- [[entities/fireblocks/csr]] — RSA 4096, mainnet은 user당 고유
- [[entities/fireblocks/api-key]] — API user별 1개, Delete 시 즉시 invalid
- [[entities/fireblocks/ip-allowlist]] — `/32` CIDR only, Owner 단독
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]] — 자동 서명 표면
- [[vendors/fireblocks/authentication]] — 인증 통합 페이지

_TODO: REST endpoint group(Vault, Transactions, Policies, Network, Webhooks), JWT signing 헤더, idempotency, rate limit, webhook event types — 추후 자료_

## Details

_TODO: endpoint·SDK·webhook은 추후 자료._

### API user 표면 (본 자료로 확인된 부분)

- Add: `Developer Center > API users > Add API user`. CSR 업로드 + Role + Co-signer 선택. Owner + Admin Quorum 승인 (Console user와 동일 흐름) (`add-api-users.md`, p.2)
- Re-enroll: `Settings > Users > ⋮ > Re-enroll API user`. Owner 승인 → Co-signer 페어링 → Owner의 key share 승인. **Pairing token 1시간 유효** (`re-enrolling-api-users.md`, p.1)
- Rename: `Developer Center > API users > ⋮ > Rename`. Owner + Admin Quorum 승인. API key 불변 (`rename-and-delete-api-users.md`, p.1)
- Delete: 기본 Owner 단독, 즉시 (mobile approval 불요). AG 위임 시 Admin도 가능 (`rename-and-delete-api-users.md`, p.1–2)
- IP allowlist: Owner 단독, `/32` CIDR only (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)

자세한 lifecycle은 [[vendors/fireblocks/lifecycle-events]] §"API User lifecycle" 참고.

## Related Pages

- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/lifecycle-events]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/csr]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/ip-allowlist]]
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/transaction]] · [[entities/fireblocks/workspace]]

## Sources

- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1

## Open Questions

- Q-2026-05-18-A02 — API user unpair 절차
- Q-2026-05-18-A03 — API key 만료·rotation
- Q-2026-05-18-A07 — API user audit log 조회 표면
- (전체 REST/SDK/Webhook 명세는 후속 자료 필요)

## Stage 36 — Data Object Catalog (`developers.fireblocks.com/reference/`)

`reference-data-objects.md` (hub) + 16 specific *-objects pages (Stage 36 Mode C ingest, body via curl). data-objects 자체는 catalog hub (단 3 줄) — 실제 schema 는 16 specific pages 에 분산.

### Object Catalog 인벤토리

| Object 그룹 | Cross-link entity |
|---|---|
| `vault-objects` (8 schemas) | [[entities/fireblocks/vault-account]] |
| `transaction-objects` (15+ schemas) | [[entities/fireblocks/transaction]] |
| `transaction-authorization-objects` (3 schemas) | [[entities/fireblocks/policy]], [[vendors/fireblocks/tap]] |
| `transaction-screening-objects` (3 schemas) | [[vendors/fireblocks/compliance]] |
| `raw-signing-objects` (4 schemas) | [[entities/fireblocks/transaction]] §"Raw Signing Special Path" |
| `gas-station-objects` (2 schemas) | [[entities/fireblocks/vault-account]] §"Gas Station vault" |
| `fee-estimation-objects` (5 schemas) | [[entities/fireblocks/transaction]] |
| `network-objects` (8 schemas) | [[vendors/fireblocks/architecture]] §"Customer Egress / Network Connection" |
| `internalexternal-wallet-objects` (4 schemas) | [[entities/fireblocks/vault-account]] §"Whitelisted Address" |
| `exchange-objects` / `fiat-account-objects` / `web3-connection-objects` | [[vendors/fireblocks/architecture]] |
| `nft-objects` / `contract-objects` | (tokenization plane — TIER 3 cross-ref) |
| `payments-objects` (★ 신규 plane) | (★ Cross-Border Settlement — 본 wiki 미정형) |
| `general-objects` (meta) | (catalog meta) |

### ★ 신규 fact: 3 Signing Algorithms (vault-objects.md p.SigningAlgorithm)

기존 wiki (Stage 8) 는 **ECDSA + EdDSA 2 algorithm** 만 명시. 본 ingest 에서 `SigningAlgorithm` enum 정식 3 종 확인:

| Algorithm | Curve | 주 사용처 |
|---|---|---|
| `MPC_ECDSA_SECP256K1` | secp256k1 | Bitcoin, EVM 전반 (Ethereum / Polygon / BSC / …) |
| `MPC_EDDSA_ED25519` | Ed25519 | Solana, Stellar, Algorand, Cardano (일부), TON |
| **`MPC_ECDSA_SECP256R1`** ★ | secp256r1 (P-256) | NIST P-256 — 일부 enterprise chain / HSM 호환 (FIPS-compliant signing) |

→ Stage 36 의 Key Link 도 ECDSA + EdDSA 만 명시 (Vault PDF p.1). SECP256R1 의 chain 매트릭스 는 추가 ingest 필요 → **Q-2026-05-22-A09**.

### 8 Destination Types (transaction-objects.md p.DestinationTransferPeerPath)

Stage 9 의 vault account ↔ 외부 평면 cross-cut 의 정식 enumeration:

| Type | 정체 | Stage 9 cross-link |
|---|---|---|
| `VAULT_ACCOUNT` | 같은 workspace 의 다른 vault account | [[entities/fireblocks/vault-account]] |
| `EXCHANGE_ACCOUNT` | exchange (Binance / Coinbase 등) 연동 계좌 | (TIER 3) |
| `INTERNAL_WALLET` | workspace 잔액 표시 + billable whitelisted | [[entities/fireblocks/vault-account]] §"Whitelisted Address" |
| `EXTERNAL_WALLET` | workspace 외부 잔액 표시 안 함 whitelisted | 같은 |
| `UNMANAGED_WALLET` | Fireblocks 가 직접 관리하지 않는 wallet | (별도 plane) |
| `ONE_TIME_ADDRESS` | OTA — whitelist 우회 path | Stage 9 OTA |
| `NETWORK_CONNECTION` | Fireblocks P2P Network counterparty | Stage 8 P2P Network |
| `FIAT_ACCOUNT` | fiat provider 계좌 | (별도 plane) |

### NetworkStatus enum (Stage 9 17-status 의 blockchain layer)

`transaction-objects.md` p.NetworkStatus: `DROPPED` / `BROADCASTING` / `CONFIRMING` / `FAILED` / `CONFIRMED`.

→ Stage 9 의 17 primary status 와 다른 plane — **blockchain network 자체의 tx 상태**. Fireblocks 의 Broadcasting / Confirming / Completed 와 매핑되지만 dropped (mempool 누락) 처리는 별도 신호.

### Chain-Specific Blockchain Info (transaction-objects.md p.BlockchainInfo)

| Chain | 특이 필드 | 의미 |
|---|---|---|
| **HBAR** | `hbarTxHash` | Hedera tx hash |
| **EVM** | `evmTransferType` enum: `NATIVE` / `TOKEN` / `INTERNAL` | Stage 7 의 internal tx 정의 cross-ref — TOKEN = log 기반, INTERNAL = trace 기반 |
| **TON** | `messageComment` (raw payload), `tonTransferType`: `NATIVE` / `JETTON`, `hashes.{externalIncoming, tonTransfer, jettonTransfer}` | ★ TON 의 arbitrary message body — non-standard format custom parsing 필요 |
| **CANTON** (★ NEW) | `transactionType` enum: `OFFER` / `ACCEPT` / `REJECT` / `WITHDRAW` / `PRE_APPROVAL`, `traceableId`, `hashes.{offerUpdateId, acceptUpdateId, rejectUpdateId, withdrawUpdateId, preApprovalUpdateId}` | ★ **2-step transfer protocol**: sender OFFER → recipient ACCEPT/REJECT/WITHDRAW. PRE_APPROVAL = 1-step (Kraken 등 외부 source). Stage 9 의 일반 tx state machine 과 다른 lifecycle |
| **DOT** | `substrateExtrinsicId` | Polkadot extrinsic ID |
| **SUI** | `gasUsed` breakdown: `storageCost` / `storageRebate` / `computationCost` / `nonRefundableStorageFee` | Sui 의 storage rebate 모델 |

→ Stage 7 의 chain-specific quirks 가 API schema level 까지 침투. 특히 **Canton 의 2-step transfer protocol** 은 Stage 9 의 outgoing tx flow 와 다른 lifecycle.

### ★ 신규 plane: MEV Protection Routing (transaction-objects.md p.NodeControls)

`NodeControls.type` enum 2 종:
- `NODE_ROUTER` — customer-provided node 로 라우팅 (Stage 7 Node Router)
- **`MEV`** ★ — MEV protection routing (예: Flashbots private mempool)

→ Stage 7 의 Node Router 외에 **MEV-aware routing 별도 plane 존재**. 자세한 명세는 본 schema 만으로 부족 → **Q-2026-05-22-A10**.

### Transaction Approval Data Model (transaction-authorization-objects.md)

Stage 10 의 governance 3-level 의 API schema 형태:

```
AuthorizationInfo {
  allowOperatorAsAuthorizer: bool   ← initiator 가 approver 가능 여부 (Stage 10 의 "Approve transactions" 권한)
  logic: "AND" | "OR"               ← multiple authorization groups 간 logic
  groups: AuthorizationGroup[]
}

AuthorizationGroup {
  th: number                        ← Required approvers in this group (N-of-M)
  users: { userId: ApprovalStatus } ← Per-user approval status
}

ApprovalStatus.approval: "PENDING_AUTHORIZATION" | "APPROVED" | "REJECTED" | "NA"
```

→ Stage 10 의 user-group-based Policy approval + Q-G07 ANSWERED (Stage 36 Key Link) 의 governance plane 정합. Approval logic 의 **AND vs OR** + threshold (N-of-M) 가 API contract 명시.

### Travel Rule Screening (transaction-screening-objects.md)

`TravelRuleScreeningResult.verdict` enum 6 종: `ACCEPT` / `REJECT` / `ALERT` / `WAIT` / `FREEZE` / `CANCEL`.

→ Stage 9 의 AML/Travel Rule Pre-screening 의 정식 verdict enum. **WAIT** / **FREEZE** 는 별도 escalation lane — automatic vs manual handoff 의 신호.

### Raw Signing — Typed Messages + Cold Wallet PreHash (raw-signing-objects.md)

`UnsignedRawMessage.type` enum (typed message 4 형식):
- `EIP191` — ETH personal_sign
- `EIP712` — ETH typed structured data
- `TIP191` — TRX personal_sign
- `BTC_MESSAGE` — Bitcoin personal message

`PreHash` object (★ Cold Wallet workspace 한정):
- `hashAlgorithm`: `SHA256` / `KECCAK256` / `BLAKE2` / `SHA3` / `DOUBLE_SHA256`
- Regular Fireblocks workspace 는 PreHash 불요 — **Cold Wallet 만 prehash 제공 필요** (Stage 14 Cold Wallet cluster catalog cross-ref)

### Fee Estimation Model (fee-estimation-objects.md)

| Asset 유형 | 필드 |
|---|---|
| **UTXO** | `feePerByte` |
| **Ethereum / EVM** | `gasPrice` / `gasLimit` / **EIP-1559**: `baseFee` + `priorityFee` |
| **Solana** | `baseFee` + `priorityFee` + **`rent`** (account creation/storage) |
| **Other** | `networkFee` (generic) |

`EstimatedTransactionFeeResponse`: `low` / `medium` / `high` 3 tier.

### Gas Station Configuration (gas-station-objects.md)

`GasStationConfiguration`:
- `gasThreshold` (ETH 단위) — 잔액 이 미만이면 auto-fund 발동
- `gasCap` (ETH 단위) — auto-fund 의 target balance
- `maxGasPrice` (Gwei) — auto-fund tx 의 max gas price

→ Stage 9 의 vault-structure-best-practices.md 의 "Gas Station vault" pattern 의 API contract 명시. [[entities/fireblocks/vault-account]] §"Withdrawal Vault Round-Robin" 의 token 자동 충전 메커니즘.

### ★ 신규 plane: Cross-Border Settlement (payments-objects.md)

`XBSettlementConfig*` series — **corridor-based settlement steps**:
- `corridorId` — cross-border corridor ID
- `steps: XBSettlementConfigStepsRecord` — recorded settlement steps
- `tenantId` — workspace ID
- `configId` — settlement config ID

→ 본 wiki 의 5 priority domain 외 plane (Payments). 현재 entity 미정형 → 사용자가 promote 결정 시 별도 entity 또는 architecture hub section 후보.

### Network Connection Routing (network-objects.md)

`NetworkConnectionRoutingPolicy.crypto` 3 scheme:
- `CUSTOM` (`CustomCryptoRoutingDest`) — `dstType`: `VAULT` / `EXCHANGE`, `dstId`
- `DEFAULT` — Fireblocks default routing
- `NONE` — routing 비활성

`CustomFiatRoutingDest`: `dstType: FIAT_ACCOUNT`, `dstId`

→ Stage 7 의 Node Router (chain-level routing) 와 별개 — **Fireblocks P2P Network 의 counterparty 단위 routing**.

### Stage 36 신규 Q (★ Mode C 후 발견)

- **Q-2026-05-22-A09**: `MPC_ECDSA_SECP256R1` algorithm 의 chain 매트릭스 — 어느 chain 이 secp256r1 사용? Key Link 의 algorithm 매트릭스 와의 차이?
- **Q-2026-05-22-A10**: `NodeControls.MEV` routing 의 정확한 mechanism — Flashbots private mempool? builder integration? supported chain?
- **Q-2026-05-22-A11**: Canton 2-step transfer protocol 의 Stage 9 transaction state machine 매핑 — `OFFER` / `ACCEPT` / `REJECT` / `WITHDRAW` / `PRE_APPROVAL` 각각이 어느 Fireblocks status 에 대응? Timeout 처리?
- **Q-2026-05-22-A12**: Cross-Border Settlement (Payments) plane 의 entity 정의 — corridor, steps 의 의미, 본 wiki 의 transaction lifecycle 과의 관계

## Sources (Stage 36 추가)

본 17 *-objects pages 는 모두 disk 저장 (`sources/fireblocks/markdown/2026-05-22__developers-fireblocks-com__reference-<slug>.md`). Cluster catalog: [[sources/fireblocks/markdown/_catalog_2026-05-22__developers-reference-batch]] (Mode A+B 하이브리드 — 162/166 fetched).

핵심 ingest source (Stage 36 Mode C):
- `2026-05-22__developers-fireblocks-com__reference-vault-objects.md` (138 lines, 8 schemas)
- `2026-05-22__developers-fireblocks-com__reference-transaction-objects.md` (221 lines, 15+ schemas)
- `2026-05-22__developers-fireblocks-com__reference-transaction-authorization-objects.md` (30 lines, 3 schemas)
- `2026-05-22__developers-fireblocks-com__reference-raw-signing-objects.md` (46 lines, 4 schemas)
- `2026-05-22__developers-fireblocks-com__reference-transaction-screening-objects.md` (56 lines, 3 schemas)
- `2026-05-22__developers-fireblocks-com__reference-network-objects.md` (78 lines, 8 schemas)
- `2026-05-22__developers-fireblocks-com__reference-fee-estimation-objects.md` (63 lines, 5 schemas)
- `2026-05-22__developers-fireblocks-com__reference-gas-station-objects.md` (22 lines, 2 schemas)
- `2026-05-22__developers-fireblocks-com__reference-internalexternal-wallet-objects.md` (51 lines, 4 schemas)
- `2026-05-22__developers-fireblocks-com__reference-payments-objects.md` (245 lines, 신규 plane)
