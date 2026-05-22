<!--
status: cluster-catalog (Stage 36, v3.2.2)
priority: TIER1 cluster (Mode A+B mass-fetch)
domain: API reference (developers.fireblocks.com/reference/)
cluster: developers-reference-batch
fetched_count: 162 / 166 (sequential curl, body LLM read 없음)
fetch_date: 2026-05-22
-->

# Cluster Catalog: developers.fireblocks.com/reference/*.md — 166 pages

**MODE A+B 하이브리드 (Stage 36)** — body markdown 본문은 disk 저장됨 (`sources/fireblocks/markdown/2026-05-22__developers-fireblocks-com__reference-<slug>.md`), 단 **LLM context 에 read 안 함**. 본문 fact 가 필요한 page 는 사용자 명시 promote 후 Mode C 로 chunk read.

## Provenance

- **Source URL pattern**: `https://developers.fireblocks.com/reference/<slug>.md`
- **Catalog source**: `sources/fireblocks/webpages/developers/llms-urls.txt` (Stage 15 sitemap, 716 URLs 중 166 가 reference 영역)
- **Fetch method**: sequential `curl -fsSL -A "Mozilla/5.0"`, parallel xargs 실패 후 while loop 재시도
- **OK / FAIL**: 162 OK + 1 FAIL (`validatefulltravelrul…` — 원본 catalog 의 truncated URL, fetch 불가) + 3 already-fetched (Stage 18 시점 = `api-overview`, `cosigner-callbackhandler-secure-communication-authentication`, `typescript-sdk`)

## 5 Priority Domain Triage (slug 기반 분류, body 미read)

| Domain | 개수 | Promote 후보 우선순위 |
|---|---|---|
| Identity / Auth | 13 | medium — `authenticate`, `signing-a-request-jwt-structure`, `user-object` |
| Workspace / Vault | 10 | ★ high — `create-vault-account`, `vault-objects`, `vault-webhooks`, `gas-station-objects` |
| Crypto / Signing / Co-signer | 25 | ★★ very high — `api-cosigner-*` 17개 (installation / maintenance / versions), raw-signing, typed message signing |
| Transaction / Tx Lifecycle | 14 | ★ high — `create-transactions`, `transaction-objects`, `approve-transactions`, `transaction-sources-destinations` |
| Webhook / Notification | 29 | medium-high — webhook 표준 + 도메인별 event type structure |
| AML / Compliance / Travel Rule | 4 | medium — `bring-your-own-screening-check-developer-guide`, `validate-travel-rule` |
| Tokenization / NFT | 8 | low-medium |
| SDK / Dev tools | 10 | low (각 SDK 별 error codes) |
| Misc / Reference | 52 | mixed — `data-objects` (사용자 trigger), `api-endpoints-overview`, `staking-overview`, `executing-payouts` 등 |

→ **Workspace + Crypto + Transaction = 핵심 49 pages** (체감 promote 가치 90%+). 나머지 117 pages 는 boilerplate / SDK error codes / webhook event structure 가 대부분.

## Identity / Auth (13)

- add-your-tokens
- authenticate
- configure-transaction-authorization-policy
- cosigner-callbackhandler-secure-communication-authentication ✓ (이미 fetched, Stage 18)
- hedera-token-service-sdk
- issue-new-erc-20f-tokens
- issue-new-erc721ferc1155f-tokens
- operational-guide-for-erc20f-token
- setting-up-roles-in-erc20f-tokens
- signing-a-request-jwt-structure
- transaction-authorization-objects
- user-object
- webhooks-structures-eventtypes-tokenization

## Workspace / Vault (10)

- address-registry
- create-vault-account
- create-vault-wallet
- fund-the-gas-station
- gas-station-objects
- monitor-the-gas-station
- vault-objects
- vault-webhooks

## Crypto / Signing / Co-signer (25)

### API Cosigner installation (8 cloud variants)
- install-api-cosigner-add-new-cosigner-p2
- install-api-cosigner-alibaba
- install-api-cosigner-aws
- install-api-cosigner-azure
- install-api-cosigner-azure-marketplace
- install-api-cosigner-gcp
- install-api-cosigner-ibm
- install-api-cosigner-onprem

### API Cosigner ops (9)
- api-cosigner-installation-flow
- api-cosigner-maintenance
- api-cosigner-maintenance-aws-nitro
- api-cosigner-maintenance-gcp-confspace
- api-cosigner-maintenance-sgx
- api-cosigner-management
- api-cosigner-operate
- api-cosigner-troubleshooting
- api-cosigner-versions / -aws / -gcp / -sgx (4 variants)

### Signing
- raw-signing-objects
- sign-typed-messages-for-ethereum-and-evm-networks
- signing-typed-messages-in-bitcoin
- signing-typed-messages-in-tron
- use-communal-cosigner

## Transaction / Tx Lifecycle (14)

- approve-transactions
- create-transactions
- estimate-transaction-fee
- fee-estimation-objects
- monitoring-transaction-status
- resend-webhook-notifications
- select-utxos-for-a-transaction
- transaction-objects
- transaction-screening-objects
- transaction-sources-destinations
- transaction-webhooks
- validate-eth-raw-transactions
- webhooks-resend-troubleshooting
- webhooks-structures-eventtypes-transaction

## Webhook / Notification (29)

### Webhook overview / setup (8)
- consume-webhooks
- configure-webhook-urls
- validating-webhooks
- webhook-object
- webhook-protection-guide
- webhook-v2-migration-guide
- webhooks-best-practices
- webhooks-overview

### Domain-specific webhook event types (10)
- automation-webhooks
- exchange-fiat-account-webhooks
- internal-external-contract-wallet-webhooks
- network-connection-webhooks
- nft-webhooks
- off-exchange-webhooks
- order-events
- smart-transfer-webhooks
- audit-log-events
- webhooks-ip-allowlisting

### Webhook structures (event type 도메인별, 8)
- webhooks-structures-eventtypes-cefi
- webhooks-structures-eventtypes-embeddedwallet
- webhooks-structures-eventtypes-networkconnection
- webhooks-structures-eventtypes-offexchange
- webhooks-structures-eventtypes-smarttransfer
- webhooks-structures-eventtypes-wallet
- webhooks-structures-eventtypes-whitelist
- webhooks-structures-notificationstructure
- webhooks-structures-webhookobjectstructure

### Webhook getting-started (3)
- webhooks-gettingstarted-configuringwebhooks
- webhooks-gettingstarted-responsesretries

## AML / Compliance / Travel Rule (4)

- bring-your-own-screening-check-developer-guide
- how-to-use-fireblocks-typescript-sdk-with-travel-rule-messages
- travel-rule-link-integration
- validate-travel-rule

## Off-Exchange / Network (1)

- network-objects

## Tokenization / NFT (8)

- contract-objects
- deploy-an-nft-collection
- mint-an-nft
- nft-objects
- retrieve-nfts
- transfer-nfts
- upload-contract-template

## SDK / Dev tools (10)

- android-sdk-errors
- ios-sdk-errors
- java-sdk
- javascript-sdk-errors
- js-sdk-legacy
- new-python-sdk
- python-sdk
- sdk-migration-guide
- sdk-multichain-deployment
- typescript-sdk ✓ (이미 fetched, Stage 18)

## Misc / Reference (52)

### Core API patterns (10)
- api-endpoints-overview
- api-error-codes
- api-idempotency
- api-overview ✓ (이미 fetched, Stage 18)
- common-errors
- ew-api-errors
- handling-api-errors
- rate-limiting
- rest-api-guide-1
- statuses

### Data object reference (12)
- data-objects (★ 사용자 trigger, Stage 36)
- exchange-objects
- fiat-account-objects
- general-objects
- internalexternal-wallet-objects
- listassets
- payments-objects
- response-object
- supported-assets-object
- sub-statuses
- web3-connection-objects
- structure / structure-the-api-call / structuring-the-api-call

### Code examples / dev guides (8)
- basic-code-example
- code-examples-1
- code-examples-2
- background-retail-demo-application
- retail-demo
- evm-local-json-rpc
- evm-web3-provider
- explore-postman-collection
- hardhat-plugin
- interact-with-solana-programs
- solana-web3-adapter

### Workflow / staking / payouts (8)
- approve-configuration-changes
- balance-validation
- caching-signatures
- consolidate-utxos
- create-omnibus-structure
- create-stake
- create-workflow-configuration
- create-workflow-execution
- launch-workflow-execution
- executing-payouts
- staking-overview
- sweep-to-omnibus-1
- withdraw-staked-assets

### Plugin / setup / verify (5)
- plugin-based-callback-handler
- setup
- verify-requests
- validatefulltravelrul… (★ FAIL — 원본 catalog truncated URL)

## Cross-cut Signal (★ catalog-level, body 미read)

### Stage 8 MPC architecture spine 확장 후보
- `api-cosigner-*` 17 pages → [[entities/fireblocks/cosigner]] §"API Co-signer installation matrix" — 7 cloud + 1 on-prem provider 확장 가능
- `raw-signing-objects`, `sign-typed-messages-*` → [[vendors/fireblocks/cosigner]] 의 signing methodology

### Stage 9 transaction state machine 확장 후보
- `create-transactions`, `transaction-objects`, `transaction-sources-destinations` → [[entities/fireblocks/transaction]] 의 API contract 명세

### Stage 10 governance 확장 후보
- `configure-transaction-authorization-policy`, `transaction-authorization-objects`, `approve-transactions` → [[entities/fireblocks/policy]], [[vendors/fireblocks/tap]]

### Webhook integration (★ 신규 plane 가능)
- 29 webhook pages → 사용자 webhook 통합 단계 promote 시 [[vendors/fireblocks/architecture]] 의 새 section "Webhook plane" 후보

### data-objects (★ Stage 36 사용자 trigger)
- `data-objects` 본문 promote 시 → 어느 entity 가 data object 라벨을 받는지 mapping 후 Mode C ingest 결정

## Promote 우선순위 (저자 추정, body 미read)

| 우선순위 | Promote 대상 | 이유 |
|---|---|---|
| ★★★ | `data-objects` | 사용자 trigger 의 원래 motivation |
| ★★ | `create-transactions`, `transaction-objects` | Stage 9 의 API contract 보강 |
| ★★ | `api-cosigner-installation-flow`, `api-cosigner-maintenance` | Stage 8 의 cosigner architecture 보강 |
| ★ | `vault-objects`, `create-vault-account` | Stage 9 vault hierarchy 보강 |
| ★ | `webhooks-overview`, `webhook-object` | webhook plane 도입 시 |
| medium | `configure-transaction-authorization-policy`, `transaction-authorization-objects` | TAP 의 API contract |
| medium | `data-objects` 후 발견되는 entity-specific reference (e.g., `vault-objects` cross-link) | depth-first follow-up |
| low | SDK error codes (`*-sdk-errors`) | 별도 entity 만들 가치 낮음, [[vendors/fireblocks/api]] 의 cross-link 만 |
| low | Webhook structures (`webhooks-structures-*`) | event type 표준 — 통합 단계 진입 시만 |

## Notes

- 본 catalog 는 lightweight — **본문 fact 추측 금지** 정책 유지 (v3.2.2)
- 신규 entity 생성 보류 — 본문 ingest 시 흡수 우선 검토 (29-stage 0 streak)
- 162 fetched body 는 `sources/fireblocks/markdown/2026-05-22__developers-fireblocks-com__reference-<slug>.md` 에 disk-only
- 1 FAIL (`validatefulltravelrul…`) 은 원본 catalog 의 truncated URL — fetch 자체 불가능 (Q: catalog 정정 필요 → 추후 sitemap re-fetch)
- 본 cluster catalog 는 Mode A+B 하이브리드 — disk 본문 보존 + LLM context-only 차단

## Related

- [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__llms-txt-sitemap]] — Stage 15 의 716 URL inventory
- [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap]] — Stage 13 의 in-body card 29 URLs
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__key-link-cluster-catalog]] — Stage 18 의 Key Link cluster catalog (Stage 36 에서 Mode C promote 완료)
