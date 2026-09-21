---
type: entity
vendor: fireblocks
status: stable
tags: [workspace, governance, key-link]
stage_introduced: 1
last_updated_stage: 176
source_count: 17
related: [api, architecture, blockchains, custody-mapping, editor, mpc, owner, policy, transaction, user-management, workspace]
---
# Entity: Vault Account (Fireblocks)

## Summary

Fireblocks workspace에서 자산을 보유하는 단위. 본 자료에서 확인 가능한 운영 동사는 create / rename / hide / unhide / asset wallet 추가 / vault public key view 등이다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.6–8). 자세한 객체 구조(필드, 식별자, address와의 관계)는 본 자료에 없음.

## Key Concepts (vocabulary)

권한표 *Assets and addresses* 및 인접 항목 (p.6–8):

- **Create vault accounts** — Owner / Admin / NSA / Signer / Approver / Editor
- **Rename vault accounts** — 위와 같으나 Editor 제외
- **Hide or unhide vault accounts**
- **Add asset wallet to a vault account or whitelisted wallet** — NSA·Approver·Editor에 **TL** 라벨 (ALGO/XRP/SOL/XLM 토큰 wallet 불가)
- **Add/whitelist a new destination** (Network/exchange/fiat/internal/external wallets) — `Y (Q)`
- **Add a Fireblocks P2P Network connection** — `Y (Q)` (Owner/Admin/NSA만)
- **Add or approve a new EVM asset** / **non-EVM asset**
- **View or retrieve vault public keys via API** (p.8)

## Details

- Editor 본문에는 "Algorand 토큰 wallet 제외" 표현이 별도 등장 — 표 TL 라벨(4종 모두)과 표현 차이 가능 (p.3, p.5).
- "Create new vault addresses"가 Editor 책임 설명에 등장 — vault account 내부의 address 개념이 별도로 존재함을 시사 (p.3).
- 본 자료는 vault account의 정확한 구조·식별자·exchange/network connection과의 관계 모델을 명세하지 않는다.
- **(★ Stage 161)** Vault account·wallet·주소 생성은 키 생성(DKG)이 아니라 마스터 키로부터의 BIP44 deterministic derivation (`m/44/coinType/vaultAccountId/change/index`) — 새 엔트로피·key share·MPC 세션 없음, Co-Signer·모바일 미개입 (source: Fireblocks 담당자 확답 2026-08, see [[vendors/fireblocks/mpc]]).

## Related Pages

- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/user-roles/owner]]
- [[vendors/fireblocks/mpc]] — 키 생성(DKG) 시점 · vault 생성 = BIP44 derivation (★ Stage 161)
- [[entities/fireblocks/user-roles/editor]]
- [[vendors/fireblocks/architecture]]
- [[entities/wallet-bank/custody-mapping]] — daw-core 가 `ext_acnt_id`(vaultAccountId)로 참조 (cross-vendor)
- [[vendors/fireblocks/api]]
- [[vendors/fireblocks/blockchains]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3, p.5–8
- `2026-05-18__support-fireblocks-io__minimum-balance.md`, p.1 (Stage 7: chain별 reserve)
- `2026-05-18__support-fireblocks-io__minimum-transaction-amounts.md`, p.1 (Stage 7)
- `2026-05-18__support-fireblocks-io__supported-blockchain-networks.md`, p.1–22 (Stage 7: chain type 분류)

## Chain-별 자산 운영 (Stage 7 cross-ref)

Vault account에 attach되는 asset wallet은 chain별로 운영 제약을 가진다. 자세한 카탈로그·운영 메타는 [[vendors/fireblocks/blockchains]]:

- **Minimum balance** (Base Reserve): chain별 reserve 요구 (ALGO/KSM/NEAR/DOT/XRP/SOL/XLM/TON 등)
- **Minimum transaction amounts**: chain별 최소 송금량 (BTC/BCH/LTC/ALGO/ADA/DOGE/TON 등)
- **Account 활성화**: Stellar(1 XLM 필수), Polkadot(0.01 DOT 이상), Near(token contract pre-funding)
- **Trust line**: XRP의 trust line은 reserve 미만 시 on-chain 자동 삭제
- **Token wallet 제약**: TL 라벨로 ALGO/XRP/SOL/XLM 토큰 wallet 생성 제한 (Stage 1 권한표)
- **Chain type 분류**: EVM account-based / non-EVM account-based / UTXO / Cosmos SDK
- **Internal transactions**: EVM의 일부 chain에서 smart contract 내부 native transfer 알림 지원 ([[entities/fireblocks/transaction]])

## Stage 9 — Asset Wallet / Deposit Address 정식 매핑 (★)

`account-and-wallet-structure.md`, p.1-2:

### Asset Type → Address 패턴 (3 유형)

| Asset 패턴 | 예시 | Permanent Address | Deposit Address 개수 | 분기자 |
|---|---|---|---|---|
| **UTXO-based** | BTC, BCH, LTC, DOGE | 1 | **N** | address 그 자체 |
| **Account-based (no tag)** | ETH, EVM 전반 | - | **1** (단일 강제) | - |
| **Account-based (tag/memo)** | XRP, XLM | - | 1 (on-chain 동일) | **N tags/memos** |

→ **EVM 의 "1 vault account = 1 address" 제약 정식 명시**. End-client 별 unique address 필요 시 individual vault account 필요 → intermediate vault 패턴.

### Vault Account Structure 패턴 (Stage 9 spine)

`vault-structure-best-practices.md`:
- **Omnibus**: 중앙 vault + intermediate vault per client (account-based 의 경우)
- **Segregated**: per-client/team/operation vault account

### Smart Contract 운영 권장 패턴 (`vault-structure-best-practices.md`, p.4)

Smart contract 의 privileged op 별 vault account 분리:
- **Mint** / **Burn** / **Pause** / **Deploy** / **Upgrade** / 기타 privileged call
- Policy rule 로 vault access 제한

### Withdrawal Vault Round-Robin 권장

`account-and-wallet-structure.md`, p.6-7 — chain-specific bottleneck 회피:
- **EVM**: nonce 가 순차 — 단일 vault stuck 시 전체 queue 정체 → 여러 vault round-robin
- **Bitcoin**: unconfirmed input **25 subsequent tx chain limit** (Bitcoin Core default) → 여러 vault round-robin

### Vault account 의 chain-specific 처리 cap

`primary-transaction-statuses.md`, p.4:
- **Solana**: vault account 당 동시 **5 tx queue** (6번째 이상은 Submitted 2h 대기 후 terminated)
- **EVM-compatible (Ethereum + Polygon 등)**: 동일 vault 에서 **1-tx serial per blockchain-standard**

### Whitelisted Address ≠ Vault address

`whitelisting-new-addresses.md`, p.1:
- Whitelisted address = **Vault 외부** deposit address
- 3 type: Internal (workspace 잔액 표시 + billable) / External (표시 안 됨) / Contract/Program

## Sources (추가)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.1-7 (Stage 9: 3-pattern address mapping + withdrawal vault quirk)
- `2026-05-18__support-fireblocks-io__vault-structure-best-practices.md`, p.4-6 (Stage 9: Smart contract per-op vault)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.4 (Stage 9: Solana 5-tx cap + EVM serial)
- `2026-05-18__support-fireblocks-io__whitelisting-new-addresses.md`, p.1-2 (Stage 9: Whitelisted address 외부성)

## Open Questions

- Q-2026-05-18-O01 — TL이 ALGO/XRP/SOL/XLM에만 적용되는 이유, 본문 Editor 설명과의 표현 차이

## Stage 36 — Key Link Vault Binding

`set-up-your-fireblocks-vault-with-key-link.md`, p.1-4 (Stage 36 Mode C).

Key Link workspace 의 vault account 는 **algorithm-단위 key 결합 규칙**이 별도 적용:

### Key Assignment 규칙 (직접 인용 p.1)

> "In your Fireblocks Key Link workspace, each vault account can be **assigned one ECDSA and one EdDSA key**. Once a key is assigned to a vault account, **it cannot be used in other vault accounts**."

| 항목 | 명세 |
|---|---|
| **Vault account 당 키 수** | 최대 2 (ECDSA 1 + EdDSA 1) |
| **Key exclusivity** | 한 key 는 단 하나의 vault account 전용 — 다른 vault 재사용 불가 |
| **Asset wallet 활성화 조건** | 해당 asset 의 underlying protocol algorithm (ECDSA or EdDSA) 의 key 가 vault account 에 assign 되어 있어야 함 |
| **Missing key 시** | Console 의 "Create asset wallet" 화면에 missing key warning + 해당 asset 비활성화 |

→ Stage 9 의 MPC vault account (algorithm constraint 자체 없음) 와 명확히 다른 binding 모델.

### Assignment 방법 (`set-up-your-fireblocks-vault-with-key-link.md`, p.1-2)

| 방법 | 절차 |
|---|---|
| **Automatic** | Vault account 생성 시 `autoAssign=true` (API) 또는 Console UI — workspace 의 available key pool 에서 ECDSA 1 + EdDSA 1 자동 배정 |
| **Manual (Dashboard)** | `Settings > External Keys > Signing keys tab > Manage > Assign to vault` 또는 vault account 페이지의 `Assign key` |
| **Manual (API)** | `Get signing keys` 로 available key 확인 → `Modify signing keyId` endpoint 로 vault account 지정 |

→ Pool 에 available key 가 없으면 vault account 는 key 없이 생성 가능, 나중에 manual assign.

### Architectural 의미

- Stage 9 의 5-level hierarchy (Customer Domain → Workspace → Vault Account → Asset Wallet → Address) 의 **Vault Account level 에 algorithm-pair binding 추가**
- "1 vault = 1 ECDSA + 1 EdDSA" 제약 → vault 분리 전략이 **key 분리 전략과 동기화** (Stage 9 의 segregated / omnibus 패턴이 Key Link 에서도 동일하나 key pool size 가 추가 제약)
- Withdrawal vault round-robin (EVM nonce / BTC 25-chain 회피) 시 각 vault 마다 ECDSA key 별도 필요 → pool size planning 영향

## Sources (Stage 36 추가)
- `2026-05-22__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link-extracted.txt`, p.1-4 (Stage 36: ECDSA+EdDSA pair, key exclusivity, auto/manual assignment)

## Stage 36 — API Data Object Schema (vault-objects.md ingest)

`vault-objects.md` (Stage 36 Mode C, body via curl).

### ★ 신규 fact: 3 SigningAlgorithm enum

기존 wiki (Stage 8) 는 ECDSA + EdDSA 2 algorithm 만 명시. `SigningAlgorithm` enum 정식 3 종:

| Algorithm | Curve | 주 사용 chain |
|---|---|---|
| `MPC_ECDSA_SECP256K1` | secp256k1 | Bitcoin, EVM 전반 |
| `MPC_EDDSA_ED25519` | Ed25519 | Solana, Stellar, Algorand (일부), TON |
| **`MPC_ECDSA_SECP256R1`** ★ | secp256r1 (P-256) | NIST P-256 — enterprise / FIPS-compliant HSM chains |

→ Stage 36 의 Key Link vault 는 ECDSA + EdDSA 만 명시 (Vault PDF p.1). **SECP256R1 의 chain 매트릭스** 는 추가 ingest 필요 → Q-2026-05-22-A09.

### VaultAccount schema (p.VaultAccount)

```
VaultAccount {
  id: string                ← Stage 9 의 5-level hierarchy 의 vault account ID
  name: string
  hiddenOnUI: boolean       ← Console UI 표시 여부
  customerRefId: string?    ← AML provider 가 funds owner 식별용
  autoFuel: boolean         ← Gas Station 의 ETH auto-fund 대상 여부
  assets: VaultAsset[]
}
```

→ **`autoFuel`** = Stage 9 의 Gas Station vault pattern 의 per-vault toggle. `customerRefId` = AML chain 의 tx attribution.

### VaultAsset schema (p.VaultAsset) — balance 분해

```
VaultAsset {
  id: string
  total: string           ← Total wallet balance
  balance: string         ← DEPRECATED → use `total`
  available: string       ← blockchain balance - locked
  pending: string         ← pending tx 의 cumulative
  staked: string          ← staked funds (DOT only)
  frozen: string          ← AML policy frozen
  lockedAmount: string    ← outgoing tx, not yet published
  blockHeight: string
  blockHash: string
}
```

→ Stage 7 의 minimum balance / locked amount / pending 분류의 API contract. **`frozen`** = AML policy 의 freeze 상태 (workspace freeze 와 별개의 per-asset freeze).

### Address schema (p.VaultAccountAssetAddress)

```
VaultAccountAssetAddress {
  assetId: string
  address: string           ← BTC/LTC = Segwit Bech32, BCH = cash address
  legacyAddress: string     ← BTC/LTC/BCH legacy format
  description: string
  tag: string               ← chain별 분기:
                              - XRP destination tag
                              - EOS/HBAR/XDB memo
                              - XLM memo_text
                              - ALGO notes
                              - Fiat provider bank transfer description
  type: string              ← address type
  customerRefId: string?
  bip44AddressIndex: number ← BIP44 derivation
}
```

→ Stage 9 의 "Account-based (tag/memo)" 패턴 (XRP/XLM 의 tag-based N 분기) 의 chain별 필드명 정식 enumeration. **address vs legacyAddress** 의 BTC/LTC/BCH 양립.

### Gas Station Configuration (`gas-station-objects.md`)

```
GasStationConfiguration {
  gasThreshold: string    ← ETH 단위, below 시 auto-fund 발동
  gasCap: string          ← ETH 단위, auto-fund target balance
  maxGasPrice: string     ← Gwei 단위, auto-fund tx max gas price
}
```

→ Stage 9 의 vault-structure-best-practices.md "Gas Station vault" 의 API contract 명시. **Token transferred + base balance < gasThreshold** → auto-fund tx 발동 trigger.

## Stage 131 — Gasless Service (★ Gas Station 과 별개 제품)

> source: `2026-07-03__support-fireblocks-io__gasless-service-extract.md` (헬프센터 PDF 6건 Mode C 추출) · 인덱스 `2026-07-03__support-fireblocks-io__gasless-service-index.md` (15건 URL). Q-2026-07-03-G01 ANSWERED.

**정의**: 지원 토큰의 **fee 지불을 전용 vault / 제3자 워크스페이스 / Fireblocks 에 위임** — 종속 vault 들이 base asset(ETH) 없이 토큰 전송. 원문 명시: *"Gasless Service is separate from the Fireblocks Gas Station and supports different protocols."* (★ Gas Station = 자기 vault ETH **충전**, Gasless = 남이 **대납** — 두 축이 병존)

**Relay 3형태** (About p.1):

| relay | 누가 gas 를 내나 | ETH 보유 |
|---|---|---|
| Local gasless relay | 같은 워크스페이스의 전용 vault | relay vault 1곳엔 필요 (충전 집약) |
| External workspace relay | 외부 워크스페이스 | 우리 워크스페이스 불요 |
| **Fireblocks Relay** (프리미엄) | **Fireblocks 선지불 → 월말 통합 인보이스(실비+구독료)** | **불요 — "even if you do not hold any ETH"** |

**메커니즘 = ERC-3009 · ERC-2771 · EIP-7702** (ERC-4337 paymaster 아님):
- **Limited Gasless (구)**: Ethereum 의 USDC·DAI (EIP-3009) + tokenization mint/burn (EIP-2771)
- **Universal Gasless (신)**: **EIP-7702** (Pectra) — **첫 gasless tx 때 vault(EOA)가 smart contract wallet 로 자동 승격** → 전 이더리움 자산(ERC-20/721/1155) · Transfer / Contract Call / Mint / Burn
- Tron 은 별도 **GasFree** (2025.3), Solana Gasless 별도 문서

**Universal Gasless 지원 체인** (integrated-chains): Ethereum(1) · Optimism(10) · **Base(8453)** · Arbitrum(42161) · Polygon PoS(137) · BSC(56) + 각 testnet (Base Sepolia 포함)

**운영 caveat**:
- ★ *"Gasless Relay does not support auto-boosting for stuck transactions"* — 막힌 tx 는 **수동 RBF boost** 필요
- Fireblocks Relay 는 **프리미엄** — CSM 경유 활성화, testnet 30일 체험
- Console: Settings > General > Gasless transactions — relay 3택 + 기본값 3모드(On/Off by default/Off, per-tx 재정의) + Policies 연동
- API 표면: error **1455** (400, "Transaction, Gasless (meta-tx)") — "Missing Gasless configuration ... Configure Gasless (relayer/fee payer)" (`reference-api-error-codes.md`)
- "이더 없이"는 **토큰 전송 기준** — ETH 자체 출금은 보내는 자산이 ETH 라 별도. ★ **ETH 네이티브 전송은 gasless 대납 불가(공식 확정)** — "does not relay native ETH transfers — Gas Station remains the right choice for sweeping ETH itself" (source: `2026-07-03__developers-fireblocks-com__sweep-funds-omnibus.md`)
- **과금 후속 확답 (Stage 176, 2026-09-14 사용자 전달)**: 제시된 가격 범위는 월 구독료 티어이며 실제 가스비는 별도 상환한다. 티어 건수에는 최초 EIP-7702 업그레이드를 포함해 Fireblocks가 가스비를 지불한 모든 거래가 들어간다. (source: [담당자 답변](../../blockchain-manager/sources/fireblocks-support/2026-09-14__gasless-pricing-tier-confirmation.md))
- 잔여 미확정: 정확한 계약 금액·가스비 USD 환산 기준, MPC 서명 ↔ 7702 위임 내부 동작 → CSM/PoC ([[open-questions/fireblocks#Q-2026-07-03-G01]] 참조)

### 인접 개념 구분 — GSN · ERC-4337 Paymaster (일반 지식, Fireblocks fact 아님)

> [unverified — 사전학습 기반. Fireblocks Gasless 가 무엇이 **아닌지** 가르는 비교용. 두 개념의 최신 세부는 1차 자료 확인 필요]

| | **GSN (Gas Station Network)** | **ERC-4337 Paymaster** | Fireblocks Gasless (비교 기준·확정) |
|---|---|---|---|
| 무엇 | meta-transaction relay 네트워크 — relayer 가 사용자의 서명 메시지를 대신 온체인 제출하고 gas 부담 | account abstraction 의 gas 대납 컨트랙트 — UserOperation 의 gas 를 스폰서하거나 ERC-20(USDC 등)으로 수취 | 벤더 관리 relay 서비스 (ERC-3009 · 2771 · EIP-7702) |
| 전제 | **수신 컨트랙트가 ERC-2771**(trusted forwarder)을 지원해야 — 일반 ERC-20 전송엔 못 씀 | 지갑이 **smart account** + EntryPoint·bundler 인프라 | Fireblocks vault — EOA 를 7702 로 자동 승격 |
| 어떻게 | 사용자 서명 → relayer 제출 → 컨트랙트가 forwarder 를 신뢰해 원 발신자 인식 | UserOp → bundler → EntryPoint → paymaster 가 검증·지불 | 첫 gasless tx 때 vault 승격 → 지정 relay 가 gas 부담 |
| 왜 쓰나 | ETH 없는 사용자의 온보딩 UX | gasless UX · 토큰으로 수수료 · 신규 사용자 스폰서십 | 수탁 운영의 gas 조달·충전·모니터링 제거 |
| 체인 | EVM (컨트랙트 지원 시) | EntryPoint 배포된 EVM 전반 — Base 생태계 활발 | ETH·OP·Base·ARB·Polygon·BSC (확정, 위 표) |
| 현황 | 생태계가 4337 로 이동 — GSN 프로젝트 자체는 쇠퇴 계보 | AA 표준의 주류 | GA (Universal 은 프리미엄 relay 별도) |

관계 정리:
- Fireblocks 는 **GSN 네트워크를 쓰는 게 아니라 ERC-2771 표준을 자체 relay 로 구현** (Limited Gasless 의 tokenization 경로).
- **ERC-4337 paymaster 를 채택하지 않고 EIP-7702 로** account abstraction 효과를 얻는 노선 (Universal Gasless).
- Fireblocks **"Gas Station" 은 GSN 과 이름만 유사, 무관** — 전자는 자기 vault ETH 충전, 후자는 대납 relay 네트워크.

### Whitelisted / Internal / External Wallet (`internalexternal-wallet-objects.md`)

3 wallet container 형태 (Stage 9 의 whitelisted address 외부성 cross-ref):

| Type | 식별 | 잔액 표시 | Billable |
|---|---|---|---|
| `UnmanagedWallet` | `id`, `name`, `customerRefId`, `assets[WalletAsset]` | yes | (mixed) |
| `ExternalWallet` | same with `ExternalWalletAsset` | **no** | no |
| Internal (via `WalletAsset` + `INTERNAL_WALLET` destination type) | `WalletAsset` | yes | yes |

→ Stage 9 의 `Whitelisted Address ≠ Vault address` invariant 의 API contract. **`activationTime`** 필드 = workspace 의 cooling-off period 의 per-wallet 시점.

## Sources (Stage 36 reference 추가)
- `2026-05-22__developers-fireblocks-com__reference-vault-objects.md`, p.1-4 (3 SigningAlgorithm, VaultAccount/Asset/Address schema)
- `2026-05-22__developers-fireblocks-com__reference-gas-station-objects.md`, p.1 (Gas Station configuration API contract)
- `2026-05-22__developers-fireblocks-com__reference-internalexternal-wallet-objects.md`, p.1-2 (3 wallet container forms)

## Sources (Stage 131 추가)
- `2026-07-03__support-fireblocks-io__gasless-service-extract.md` (헬프센터 PDF 6건 — About·Universal Gasless·integrated chains·Configuring·Fireblocks Relay·fee contingencies)
- `2026-07-03__support-fireblocks-io__gasless-service-index.md` (Gasless 문서 15건 URL 인덱스)

## Stage 174 — Wallet Pool (vault 묶음 source) · Universal Gasless 담당자 확답 (★)

### Wallet Pool — 여러 vault account 를 하나의 논리 source 로

**정의**: `WALLET_POOL` 타입의 **protected tag**. 여러 vault account 를 묶어 그 묶음을 거래 source 로 쓰면, Fireblocks 가 거래마다 멤버 vault 하나를 골라 그 vault 로 보낸다. protected tag 라서 승인·거버넌스 통제를 그대로 받는다 (source: `2026-09-07__support-fireblocks-io__wallet-pools.md`, p.1).

**왜 있나**: EVM 에서 vault account 하나는 nonce 스트림 하나라, 막힌 거래 한 건이 그 vault 의 뒤 거래를 전부 막는다. pool 은 거래를 여러 vault 에 분산하고 막힌 vault 를 피해 라우팅한다. 부수 효과로 온체인 주소 회전(프라이버시), 자체 vault 회전 로직 불필요 (p.1).

**용도 3곳** (p.1–2):

| 용도 | 병목 | 설정 위치 |
|---|---|---|
| 출금 vault 묶음 | 소수 핫 vault 의 nonce 직렬 | 거래 source 를 pool 로 |
| **Gas Station tank** | 전 vault fueling 이 단일 tank 의 nonce 하나를 공유 | Settings > Gas station tank 에서 vault 또는 pool 선택 |
| **Gasless relayer source** | "a relayer vault account signs and pays gas … one vault account with one nonce stream" | Settings > Initiate gasless transactions > EVM 의 relayer source selector |

→ relayer 설명은 **우리 워크스페이스의 relayer vault** 기준. Fireblocks Relay(프리미엄, Stage 131) 에서 고객 측 relayer pool 이 필요한지는 문서에 없음 ([[open-questions/fireblocks#Q-2026-09-07-WP01]]).

**4 단계** (p.2–4):
1. tag 생성 — Console(Utilities > Tags) 또는 `POST /v1/tags {type: WALLET_POOL}`. Owner/Admin/Non-Signing Admin/Editor, **quorum 승인 불요**. 이름은 workspace 전체에서 유일(protected tag 와도 충돌 불가).
2. vault 부착 — `POST /v1/vault/accounts/attached_tags {vaultAccountIds, tagIdsToAttach}`. protected tag 라 응답은 `pendingOperations` + `approvalRequestId`, `GET /v1/tags/approval_requests/{id}` 로 추적. 승인 완료 후에만 트래픽 수신. Editor 는 제출만 가능, 승인은 Owner/Admin/Non-Signing Admin.
3. **Policy 가 pool 을 source 로 허용하는지 확인** — "the most common reason a first pool transaction fails". 거래는 멤버 vault 하나로 resolve 된 뒤 그 vault 기준으로 Policy 평가되므로, 개별 vault ID 룰이면 라우팅될 때마다 막힐 수 있다. 룰의 source 를 pool 로 쓴다 (상세 [[entities/fireblocks/policy]] §Stage 174).
4. 제출 — `POST /v1/transactions` 의 `source: {type: WALLET_POOL, id: <poolId>}`. 응답은 txId·status 만. 조회하면 `source.id` 가 실제 보낸 vault 로 재기록되고, pool 은 `source.tags` 와 `extraParameters.walletPoolId` 에 남는다 (상세 [[entities/fireblocks/transaction]] §Stage 174).

**선택 알고리즘** (p.5–6): ① 요청 자산을 보유하고 **단독으로** 금액을 감당하는 vault 만 후보(없으면 거절) → ② gas 자산 보유 vault 선호(요건 아님, fee 추정 불가 체인은 생략) → ③ **Account Traffic Control(ATC)** 건강 상태: 정상 > 혼잡 조짐 > stuck 보유 → ④ 최상 그룹에서 round-robin. 건강한 vault 가 없어도 거절하지 않고 최선 vault 로 보냄 → ⑤ ATC 불가 시 잔액 점수(locked tx 최소·available 최대, 결정적).

**승인 표** (p.6): 생성 No · vault 추가/제거 Yes · 이름 변경 Yes · 삭제 Yes(비어 있어야).

**제약** (p.7):
- 건강 기반 라우팅은 **EVM 만**. 비EVM 은 잔액 점수(결정적) → 단일 논리 source·단일 Policy 대상만 얻고 혼잡 회피·주소 회전은 없음. 향후 릴리스 예정.
- 한 vault 가 여러 pool 소속 가능, 건강 상태는 공유됨.
- vault 제거 시 round-robin 포인터 리셋. round-robin 은 엄격 순서 아님 — 고정 순서를 가정한 대사 로직 금지.
- **잔액 합산 없음** — 1 ETH × 10 vault pool 은 5 ETH 거래 불가. 멤버 잔액은 최대 단건 금액 기준으로.
- 조회 전용 pool 엔드포인트 없음 — `GET /v1/tags?type=WALLET_POOL` · `GET /v1/vault/accounts_paged?includeTagIds=<poolId>` (p.5).

### Universal Gasless — 담당자 확답으로 보강된 3 fact (2026-09-07)

source: `2026-09-07__fireblocks-csm__batch-sweep-universal-gasless-reply.txt`

- **7702 upgrade 는 비가역** — "Once you upgrade a vault to EIP7702 you cant reverse it". Stage 131 의 "첫 gasless tx 때 자동 승격" 에 붙는 단서. 4-source 기존 문서에는 없던 사실.
- **approve 는 정책에 금액 0 의 contract call 로 읽힘** — "an approve reads as a zero-value contract call so amount-based rules won't catch it". PoC(BC/설계/95) 에서 조회 기록에는 `operation=APPROVE`·amount 가 찍혔으나, 정책 평가는 금액을 보지 못한다는 뜻. Approve Amount Cap·`applyForApprove` 의 API 제출 적용 여부는 계속 미확인 ([[open-questions/fireblocks#Q-2026-09-07-P01]]).
- **relayer 병목 대책 = Wallet Pool** — "a single relayer vault is one nonce stream and will bottleneck. Use a Wallet Pool as the relayer source" (위 Wallet Pool 절).
- 재확인(기존 fact 와 일치): Transfer/Contract Call/Mint/Burn 대납 · 네이티브 ETH relay 불가 · Vault account upgrade rule + relay 워크스페이스의 Gasless-Orchestrator initiator Contract call rule(anyone 룰이 있어도 별도 필요, initiator ≠ signer).
- 벤더 권장 sweep 패턴 = vault 당 거래 1건 + API Co-Signer + Gas Station 또는 Universal Gasless(Stage 137 sweep-to-omnibus 와 동일). 배치 컨트랙트 reference architecture 는 **없음**. 설계 판단은 `blockchain-manager/docs/BC/설계/98-batch-sweep.md` 10절.

## Sources (Stage 174 추가)
- `2026-09-07__support-fireblocks-io__wallet-pools.md`, p.1–7 (Wallet Pool 정의·용도 3곳·4 단계·선택 알고리즘·승인 표·제약)
- `2026-09-07__fireblocks-csm__batch-sweep-universal-gasless-reply.txt` (담당자 회신 2026-09-07: 7702 비가역·approve 정책 노출·relayer Wallet Pool·권장 sweep 패턴)

## Sources (Stage 176 추가)
- [2026-09-14__gasless-pricing-tier-confirmation.md](../../blockchain-manager/sources/fireblocks-support/2026-09-14__gasless-pricing-tier-confirmation.md) (사용자 전달 담당자 답변: 월 구독료 티어·가스 실비 별도·최초 업그레이드 거래 건수 포함)
