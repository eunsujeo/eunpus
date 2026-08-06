---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [api, identity, data-objects, integration]
stage_introduced: 1
last_updated_stage: 159
source_count: 22
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

_REST endpoint surface: **Vault / Transactions / Webhooks v2 는 Stage 50 (아래) 에서 채움** (read/write 구분). Policies(TAP) / Network / Exchange 그룹 + JWT 헤더 세부 · rate limit 은 잔존 TODO._

## Details

_REST endpoint surface 는 Stage 50 섹션 참조 (Vault / Transactions / Webhooks v2). SDK 매핑은 추후._

### API user 표면 (본 자료로 확인된 부분)

- Add: `Developer Center > API users > Add API user`. CSR 업로드 + Role + Co-signer 선택. Owner + Admin Quorum 승인 (Console user와 동일 흐름) (`add-api-users.md`, p.2)
- Re-enroll: `Settings > Users > ⋮ > Re-enroll API user`. Owner 승인 → Co-signer 페어링 → Owner의 key share 승인. **Pairing token 1시간 유효** (`re-enrolling-api-users.md`, p.1)
- Rename: `Developer Center > API users > ⋮ > Rename`. Owner + Admin Quorum 승인. API key 불변 (`rename-and-delete-api-users.md`, p.1)
- Delete: 기본 Owner 단독, 즉시 (mobile approval 불요). AG 위임 시 Admin도 가능 (`rename-and-delete-api-users.md`, p.1–2)
- IP allowlist: Owner 단독, `/32` CIDR only (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)

자세한 lifecycle은 [[vendors/fireblocks/lifecycle-events]] §"API User lifecycle" 참고.

### 개발자 통합 인터페이스 — JSON-RPC / Web3 Provider (EVM)

Fireblocks는 자체 지갑을 EVM 개발 스택에 붙이기 위한 **개발자 통합 계층 2종**을 제공. 둘 다 서명·컨트랙트 배포·tx 전송용이며, **블록체인 노드 자체가 아니라 Fireblocks API를 백엔드로 하는 인터페이스**.

- **Fireblocks JSON-RPC** (`@fireblocks/fireblocks-json-rpc`) — 로컬 커맨드라인 JSON-RPC 서버. Fireblocks API로 EVM 상호작용을 JSON-RPC로 노출. Brownie·Foundry·web3.py 스택에 연결 (source: `reference-evm-local-json-rpc.md`)
- **Fireblocks Web3 Provider** (`@fireblocks/fireblocks-web3-provider`) — ethers.js·web3.js·viem·Truffle용 EIP-1193 provider (source: `reference-evm-web3-provider.md`)

**범위 한계 (★ Stage 151)**: 이들은 read RPC 엔드포인트 상품이 아님. read류(publicly available operations)는 Fireblocks default 노드로 라우팅되고, 대량 블록 순회/인덱싱 용도로 설계되지 않음. 블록 단위 전체 트랜잭션 수집은 별도 노드+인덱서 영역 → [[docs/architecture/blockchain-indexer-architecture-reference]]. 고객 노드로 tx 라우팅은 [[vendors/fireblocks/blockchains]] §"Node Router".

## Related Pages

- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/lifecycle-events]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/csr]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/ip-allowlist]]
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/transaction]] · [[entities/fireblocks/workspace]]
- [[entities/canton/canton-network]] — Canton 체인 모델 (2-step transfer·traffic 수수료·PartyId). transactionType·traceableId 의 원본 (Stage 52)

## Sources

- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1
- `2026-05-22__developers-fireblocks-com__reference-evm-local-json-rpc.md` (Stage 151: JSON-RPC 서버)
- `2026-05-22__developers-fireblocks-com__reference-evm-web3-provider.md` (Stage 151: Web3 Provider)

## Open Questions

- Q-2026-05-18-A02 — API user unpair 절차
- Q-2026-05-18-A03 — API key 만료·rotation
- Q-2026-05-18-A07 — API user audit log 조회 표면
- REST endpoint surface (Vault/Transactions/Webhooks): Stage 50 에서 해소. SDK·Policies(TAP)·Network endpoint 는 후속.

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

#### 라우팅 기본 프리셋 (★ Stage 162)

routing 은 **profile 층 / connection 층 2단**이고, connection 의 `DEFAULT` = "profile routing 을 따른다" (= Profile Routing).

| 대상 | 워크스페이스 기본값 |
|---|---|
| Network Profile Crypto | `CUSTOM` — 기본 `dstId = 0`, `dstType = VAULT` |
| Network Profile FIAT | `NONE` |
| Network Connection Crypto | `DEFAULT` |
| Network Connection FIAT | `DEFAULT` |

★ **`NONE` 으로 routing 된 asset type 의 incoming tx 는 실패한다.** `CUSTOM` 에서 대상 account 를 제거해도 다른 account 를 지정할 때까지 실패한다. FIAT 기본값이 `NONE` 이므로 법정화폐 수신 전 profile routing 설정이 선행돼야 한다.

지원 asset group 은 `/network_ids/routing_policy_asset_groups` 에서 조회.
(source: `2026-08-06__developers-fireblocks-com__create-a-new-network-connection.md`)

### Stage 36 신규 Q (★ Mode C 후 발견)

- **Q-2026-05-22-A09**: `MPC_ECDSA_SECP256R1` algorithm 의 chain 매트릭스 — 어느 chain 이 secp256r1 사용? Key Link 의 algorithm 매트릭스 와의 차이?
- **Q-2026-05-22-A10**: `NodeControls.MEV` routing 의 정확한 mechanism — Flashbots private mempool? builder integration? supported chain?
- **Q-2026-05-22-A11 — ANSWERED (Stage 78)**: Canton 2-step ↔ Fireblocks 매핑. developers.fireblocks.com/reference/transaction-objects 확인 — Fireblocks 는 generic status 로 collapse 하지 않고 **전용 `transactionType`**(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL)로 그대로 노출, `traceableId`·`CantonHashes`(offerUpdateId 로 OFFER↔후속 연결)로 lifecycle 추적. 일반 NetworkStatus(BROADCASTING/CONFIRMING/CONFIRMED/FAILED/DROPPED) 별도. Timeout=수락 안 되면 송신자 WITHDRAW(앱 정책). (source: sources/fireblocks/2026-06-10__canton-transaction-objects.md)
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

## Stage 50 — REST Endpoint Surface (지갑 매니저 관점, read/write)

> Stage 1·36 의 REST endpoint TODO 해소 — 수탁 "블록체인 매니저" 가 쓰는 그룹(Vault / Transactions / Webhooks v2)만.
> Source: developers.fireblocks.com 공식 API reference — `llms.txt` 인덱스 + `api-reference/*` pages (**2026-06-08 web fetch 확인**).
> ✅ = method+path 직접 확인 (.md fetch / 검색 스니펫). ○ = reference 페이지 존재 확인, 경로는 Fireblocks REST 표준 패턴 (적용 전 페이지 재확인 권장).
> base URL `https://api.fireblocks.io`. 모든 요청 JWT 서명(API Key + RSA) — [[entities/fireblocks/api-key]], `reference-signing-a-request-jwt-structure.md`.

### Vault (AccountPort — 계정·주소·잔액)

**WRITE (상태 변경)**

| method · path | 용도 |
|---|---|
| ✅ `POST /v1/vault/accounts` | 고객 계정(vault) 생성 |
| ○ `POST /v1/vault/accounts/{vaultAccountId}/{assetId}` | 자산 지갑 활성화/추가 (Create vault wallet) |
| ✅ `POST /v1/vault/accounts/{vaultAccountId}/{assetId}/addresses` | 입금 주소 발급 (UTXO·tag/memo) |
| ○ `POST /v1/vault/accounts/bulk` · `.../addresses_bulk` | 대량 생성 (온보딩 스케일) |

**READ (조회)**

| method · path | 용도 |
|---|---|
| ✅ `GET /v1/vault/accounts_paged` | 계정 목록 (paginated) |
| ○ `GET /v1/vault/accounts/{vaultAccountId}` | 계정 단건 |
| ○ `GET /v1/vault/accounts/{vaultAccountId}/{assetId}` | **자산 잔액** |
| ○ `GET /v1/vault/accounts/{vaultAccountId}/{assetId}/addresses_paginated` | 주소 목록 |
| ○ `GET /v1/vault/accounts/{vaultAccountId}/{assetId}/public_key_info` | 주소 파생용 공개키 |

→ [[entities/fireblocks/vault-account]]. 8 destination type · vault schema 는 Stage 36 object catalog.

### Transactions (TransactionPort — 제출·상태·가속)

**WRITE**

| method · path | 용도 |
|---|---|
| ✅ `POST /v1/transactions` | 트랜잭션 생성 = **서명+전파+nonce 묶음**. `externalTxId` 로 멱등 |
| ✅ `POST /v1/transactions/{txId}/drop` | stuck EVM tx 교체/드롭 (boost/RBF) |
| ○ `POST /v1/transactions/{txId}/cancel` | 취소 |
| ✅ `POST /v1/transactions/estimate_fee` | 수수료 추정 (POST지만 상태변경 X — `low/medium/high` 3 tier, fee-estimation-objects) |
| ○ `POST /v1/transactions/{txId}/set_confirmation_threshold` | 확정 임계 설정 (DCCP 보강) |

**READ**

| method · path | 용도 |
|---|---|
| ✅ `GET /v1/transactions/{txId}` | 상태 조회 (Stage 9 17-status / NetworkStatus) |
| ○ `GET /v1/transactions/external_tx_id/{externalTxId}` | 멱등 키로 조회 |
| ○ `GET /v1/transactions` | 이력·필터 (after / status / sourceId / destId) |

→ [[entities/fireblocks/transaction]]. tx schema·status·chain-specific 필드는 Stage 36 object catalog.

→ **Gasless(meta-tx) 전송 경로** 존재 — error `1455` "Missing Gasless configuration (relayer/fee payer)". 제품 상세(relay 3형태·ERC-3009/2771/EIP-7702·Universal Gasless)는 [[entities/fireblocks/vault-account]] §"Stage 131 — Gasless Service". (★ Stage 131)

### Webhooks v2 (수신 트랜잭션·확정 = event push, "② 감지" — TransactionPort.onChainEvent)

**WRITE (설정·운영)**

| method · path | 용도 |
|---|---|
| ✅ `POST /v1/webhooks` | webhook URL + 이벤트 등록 (idempotency key 지원) |
| ○ `PUT /v1/webhooks/{id}` · `DELETE /v1/webhooks/{id}` | 수정·삭제 |
| ○ `POST /v1/webhooks/{id}/notifications/resend` · `.../resend_failed` | 알림 재전송 |

**READ**

| method · path | 용도 |
|---|---|
| ○ `GET /v1/webhooks` · `GET /v1/webhooks/{id}` | webhook 조회 |
| ○ `GET /v1/webhooks/{id}/notifications` (· `/{notificationId}` · `/attempts`) | 전송 이력·재시도 |

- 수신 핵심 event type (**v2 점 표기**): `transaction.created` / `transaction.status.updated` (INCOMING · CONFIRMING · COMPLETED) / `transaction.approval_status.updated` — `reference-webhooks-structures-eventtypes.md`, [[vendors/fireblocks/lifecycle-events]]. 입금 감지·DCCP 확정이 여기로 push.
- 요청 검증(서명) + IP allowlist — `reference-webhooks-ip-allowlisting.md`.

**★ v1 → v2 (Q-2026-06-08-A15 ANSWERED, web fetch 2026-06-08)**: Webhooks **v1 은 2026-06-15 EOL** (그 후 미지원), 신규 이벤트는 v2 만 지원 → **신규 구축은 v2 전제**. v2 = 다중 webhook + 이벤트 구독 + 30일 재전송 + v1 의 10s ordering delay 제거. 이벤트명이 UPPER_SNAKE → 점 표기로 변경:

| v1 | v2 |
|---|---|
| `TRANSACTION_CREATED` | `transaction.created` |
| `TRANSACTION_STATUS_UPDATED` | `transaction.status.updated` |
| `TRANSACTIONS_APPROVAL_STATUS_UPDATED` | `transaction.approval_status.updated` |

(source: `reference-webhook-v2-migration-guide.md` — developers.fireblocks.com, 2026-06-08 web fetch)

### Webhook 전달 정책·보안 (★ Stage 159)

**전달·재시도**

- 벤더는 HTTP 200 응답을 전달 완료로 본다. 무응답·5xx 는 **지수 백오프 재시도: 10 → 30 → 120 → 300 → 900 → 1800 → 3600 → 7200 → 14400초, 총 10회 실패 시 failed 마킹 후 중단** (source: `reference-webhooks-gettingstarted-responsesretries.md`)
- 4xx 는 재시도하지 않는다 — 예외는 **429 · 408** 둘뿐 (같은 source)
- **순서 미보장 공식화** — 리소스 단위 순서 전송을 시도하나 보장하지 않는다. "endpoint 는 순서에 의존하지 말 것" (source: `reference-webhooks-best-practices.md` · `reference-webhook-v2-migration-guide.md`)
- **중복 수신 가능** — 이벤트 ID 추적 + `createdAt` 비교로 걸러야 함 (source: `reference-webhooks-best-practices.md`)
- **circuit breaker** — 오류율이 임계를 넘는 endpoint 는 **벤더가 자동 비활성화** (임계 수치 비공개). 권고 대응 = 비동기 큐 + 즉시 2xx (source: `reference-webhooks-best-practices.md`)
- 재전송: v2 는 원 이벤트로부터 **30일**, 단 **이벤트당 5분에 1회** 제한 (source: `reference-webhook-v2-migration-guide.md`). v1 계열 API 는 실패분 전체(`resend_failed`) · tx 단위(`resendTransactionWebhooksById`) 두 가지 (source: `reference-resend-webhook-notifications.md`). 서버 1시간+ 정지 시 최대 24시간 범위 재전송 언급 (source: `reference-webhooks-best-practices.md`)

**설정 제약** (source: `reference-webhooks-gettingstarted-configuringwebhooks.md`)

- 설정 주체는 **Admin 급 사용자만** (Owner · Admin · Non-Signing Admin). API 설정은 Admin 권한 API key 필요.
- URL: 공개 HTTPS · **443 포트** · 255자 이내 · **워크스페이스당 최대 10개**.
- `BALANCE_UPDATE` 이벤트는 2025-11부터 v2 셀프 구독 (벤더 수동 활성화 종료).

**보안 3중** (source: `reference-webhook-protection-guide.md`)

- **발신 IP allowlist** — 웹훅 발신 IP 는 환경당 1개: US `3.135.57.98` · EU `63.179.12.78` · EU2 `3.77.138.100` · Sandbox `18.117.207.128`. v1/v2 의 IP 가 다르다. 벤더 권고는 "IP 만 믿지 말고 서명 검증" (source: `reference-webhooks-ip-allowlisting.md`). ※ [[entities/fireblocks/ip-allowlist]] 는 반대 방향(우리→벤더 API 호출의 소스 IP 게이트) — 별개 개념.
- **서명 검증 (현행 JWKS)** — `Fireblocks-Webhook-Signature` 헤더에 detached JWS(**RS512**). JWS 헤더의 kid 로 JWKS endpoint(`keys.fireblocks.io/.well-known/jwks.json` 등 환경별)에서 공개키 자동 조회 — **키 로테이션 자동**. 구방식 `Fireblocks-Signature`(수동 키 관리)와 마이그레이션 기간 중 병행 전송 (source: `reference-validating-webhooks.md`)
- **잔액 검증** — 수신 tx 웹훅만으로 내부 로직(sweep 등)을 트리거하지 말고 **balance update 웹훅 수신 + block height 일치 확인 후** 실행 권고 (source: `reference-webhooks-best-practices.md`)

미확인: 재시도 스케줄 수치가 v1/v2 어느 서비스 기준인지 페이지에 명시 없음 (v2 는 "더 긴 창"으로만 서술 — `reference-webhook-v2-migration-guide.md`). circuit breaker 임계 수치 비공개. 알림 이력·재전송의 페이지네이션·rate limit 은 Q-2026-07-02-T02 pending.

### read/write 본질 (지갑 매니저 매핑)

- **WRITE = 상태 변경**: 계정·자산·주소 생성, 트랜잭션 생성·drop·cancel, webhook 설정. (`estimate_fee` 는 POST지만 사실상 read)
- **READ = 조회**: 계정·잔액·주소·tx 상태/이력, webhook 조회.
- **event(push) = webhook** — read API 가 아니라 Fireblocks 가 밀어줌.
- 포트 매핑: 내 지갑 수신·확정 webhook + tx 상태·잔액·이력 = **TransactionPort·AccountPort** 로 제공. **ChainQueryPort(임의 외부 주소·커스텀 조회)는 Fireblocks ✗** → 자체 인덱서/Alchemy 로 별도 추가. (docs-site 10.4)

### docs-site 연계

이 표면이 docs-site `wallet-service-components` 의 **11. Fireblocks 어댑터** 의 AccountPort / TransactionPort(수신 이벤트 webhook 포함) 실제 endpoint 근거다 (그 페이지 의사코드의 `fb.createTransaction` 등 → 위 `POST /v1/transactions`). ChainQueryPort 는 Fireblocks 미제공.

### Stage 50 신규 Q

- **Q-2026-06-08-A13**: Policies(TAP) · Network Connection · Exchange endpoint group — 매니저 범위 밖이나 governance plane 보강 시 필요.
- **Q-2026-06-08-A14**: `set_confirmation_threshold` (tx ID / tx hash 두 변종) 과 DCCP(default deposit confirmation) 의 관계 — 건별 override 인가?
- ~~**Q-2026-06-08-A15**~~ **ANSWERED (Stage 50)**: v1 은 2026-06-15 EOL, 신규 구축은 v2(`POST /v1/webhooks`) 전제. 이벤트명 점 표기 (위 Webhooks 섹션 매핑표 참조).

## Sources (Stage 50 추가)

- `https://developers.fireblocks.com/llms.txt` — 공식 문서 인덱스 (2026-06-08 web fetch)
- `developers.fireblocks.com/api-reference/vaults/*` · `/transactions/*` · `/webhooks-v2/*` — 개별 endpoint pages (제목·slug 확인)
- 경로 직접 확인(.md fetch): `POST /v1/transactions/{txId}/drop` · `POST /v1/transactions/estimate_fee` · `GET /v1/transactions/{txId}`
- 검색 스니펫 확인: `POST /v1/vault/accounts` · `POST /v1/vault/accounts/{vaultAccountId}/{assetId}/addresses` · `POST /v1/webhooks` · `GET /v1/vault/accounts_paged`

## Sources (Stage 159 추가)

- `2026-05-22__developers-fireblocks-com__reference-webhooks-gettingstarted-responsesretries.md` — 재시도 스케줄·4xx 예외
- `2026-05-22__developers-fireblocks-com__reference-webhooks-gettingstarted-configuringwebhooks.md` — 설정 제약 (Admin 전용·443·10개)
- `2026-05-22__developers-fireblocks-com__reference-webhooks-best-practices.md` — circuit breaker·순서·중복·잔액 검증 권고
- `2026-05-22__developers-fireblocks-com__reference-webhook-protection-guide.md` + `reference-webhooks-ip-allowlisting.md` — 보안 3중·발신 IP
- `2026-05-22__developers-fireblocks-com__reference-validating-webhooks.md` — JWKS 서명 검증 (RS512 detached JWS)
- `2026-05-22__developers-fireblocks-com__reference-resend-webhook-notifications.md` — 재전송 API 2종
