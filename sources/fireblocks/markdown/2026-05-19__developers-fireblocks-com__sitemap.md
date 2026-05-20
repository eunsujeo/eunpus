<!--
fetched_at: 2026-05-19
source_type: webpage-catalog
status: sitemap-partial (Stage 13, v3.1) — SUPERSEDED by llms-txt-sitemap (Stage 15)
note: "Sidebar nav JS-rendered, not captured by WebFetch. Only in-body card links collected from 3 seed pages. See [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__llms-txt-sitemap]] for full 716-URL inventory."
-->

# Fireblocks Developer Docs — Sitemap (Partial)

**URL catalog / sitemap** — 3 seed page 의 in-body / card 링크에서 추출. Sidebar nav 는 JS-rendered 이므로 WebFetch 로 미수집. 전체 sitemap 수집은 별도 도구 필요 (browser automation 또는 `https://developers.fireblocks.com/llms.txt` 활용).

## Crawl Source

| Seed URL | tier | markdown |
|---|---|---|
| /docs/introduction | 2 | [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__docs-introduction]] |
| /reference/api-overview | 2 | [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-api-overview]] |
| /reference/typescript-sdk | 3 | [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-typescript-sdk]] |

## Collected URLs (29 unique)

### Special: LLM-Friendly Documentation Index
- `https://developers.fireblocks.com/llms.txt` ★ — Fireblocks 가 제공하는 LLM 친화적 documentation index. Sidebar 전체 sitemap 의 대체 entry point. **Future promote 우선 후보**.

### /docs/ paths (15)

| Path | Section (from seed) | Tier | Domain category | Promote Condition |
|---|---|---|---|---|
| `/docs/introduction` | seed | 2 | developer / platform | hub 구축 시점 |
| `/docs/quickstart` | Getting Started + Start Building | 2 | developer / onboarding | API onboarding hub 구축 시 |
| `/docs/what-is-fireblocks` | Getting Started | 2 | platform overview | architecture hub 강화 시 |
| `/docs/overview` (Vault Accounts) | Key Capabilities | 2 | workspace mgmt (★ priority domain) | vault-account entity 강화 시 |
| `/docs/manage-api-keys` | Start Building | 2 | identity-auth (★ priority domain) | api-key entity 보강 시 |
| `/docs/define-aml-policies` | Key Capabilities | 2 | compliance / governance (★ priority domain) | AML/Compliance cluster 강화 시 |
| `/docs/interact-with-smart-contracts` | Key Capabilities | 3 | smart contract (별도 product) | tokenization promote 시 |
| `/docs/stake-assets` | Key Capabilities | 3 | staking (별도 product) | staking domain active 시 |
| `/docs/wallet-as-a-service` | Use Cases | 3 | use case | WaaS 비교 분석 시 |
| `/docs/treasury-management` | Use Cases | 3 | use case | Treasury domain active 시 |
| `/docs/tokenization` | Use Cases | 3 | tokenization (별도 product) | tokenization promote 시 |
| `/docs/self-custody-infrastructure` | Use Cases | 3 | use case | self-custody active 시 |
| `/docs/fireblocks-cli` | Start Building | 3 | developer tool | CLI 활용 시 |
| `/docs/ethereum-development` | TS SDK page | 3 | chain-specific | EVM DeFi active 시 |
| `/docs/workspace-environments` | TS SDK page | 2 | workspace mgmt (★ priority domain) | Stage 9 W01 보강 (Mainnet/Testnet) |

### /reference/ paths (13)

| Path | Section (from seed) | Tier | Domain category | Promote Condition |
|---|---|---|---|---|
| `/reference/api-overview` | seed | 2 | developer / API | API hub 구축 시 |
| `/reference/typescript-sdk` | seed | 3 | developer / SDK | SDK active 시 |
| `/reference/new-python-sdk` | Language SDKs | 3 | developer / SDK | SDK active 시 |
| `/reference/java-sdk` | Language SDKs | 3 | developer / SDK | SDK active 시 |
| `/reference/rest-api-guide-1` | REST API | 2 | developer / API | API hub 구축 시 |
| `/reference/explore-postman-collection` | REST API | 3 | developer / tooling | API exploration 시 |
| `/reference/create-vault-account` | Start Building | 2 | workspace mgmt (★ priority domain) | vault-account entity 보강 시 |
| `/reference/create-transactions` | Key Capabilities | 2 | transaction (governance ★) | transaction entity API 측 보강 시 |
| `/reference/webhooks-overview` | Key Capabilities + Start Building | 2 | webhooks / security-access | Stage 8 의 webhook source IP 정합 |
| `/reference/configure-webhook-urls` | Webhooks | 2 | webhooks | webhook plane 보강 시 |
| `/reference/evm-web3-provider` | Web3 | 3 | DeFi / EVM (별도) | DeFi active 시 |
| `/reference/hardhat-plugin` | Web3 | 3 | DeFi / EVM (별도) | DeFi active 시 |
| `/reference/evm-local-json-rpc` | Web3 | 3 | DeFi / EVM (별도) | DeFi active 시 |

## 5 Priority Domain Cross-cut Mapping

| Path | Domain | 보강 대상 |
|---|---|---|
| /docs/manage-api-keys | **Identity-Authentication** | [[entities/fireblocks/api-key]] / [[entities/fireblocks/csr]] |
| /docs/overview | **Workspace Management** | [[entities/fireblocks/vault-account]] |
| /docs/workspace-environments | **Workspace Management** | [[entities/fireblocks/workspace]] (Stage 9 Q-W01 보강) |
| /reference/create-vault-account | **Workspace Management** | [[entities/fireblocks/vault-account]] |
| /reference/create-transactions | **Governance** | [[entities/fireblocks/transaction]] |
| /reference/webhooks-overview | **Security-Access** | webhook plane (Stage 8) |
| /reference/configure-webhook-urls | **Security-Access** | webhook plane |
| /docs/define-aml-policies | **Governance** | [[entities/fireblocks/policy]] / Stage 12 AML cluster |

## Promote 우선순위 (사용자 결정 후 진행)

**Top candidates**:
1. **`https://developers.fireblocks.com/llms.txt`** — LLM-friendly 전체 sitemap entry, 모든 후속 ingest 의 시작점 후보
2. `/docs/manage-api-keys` — Stage 4 의 api-key entity Q 보강 가능
3. `/docs/workspace-environments` — Stage 9 의 Q-W01 (Mainnet/Testnet) 본문 보강
4. `/reference/api-overview` 본문 — API surface entity 강화
5. `/reference/webhooks-overview` + `/reference/configure-webhook-urls` — Stage 8 의 webhook IP allowlist plane 보강

## Sidebar 미수집 한계

- WebFetch 의 모델이 client-rendered (JS) sidebar 를 보지 못함
- 전체 sitemap 수집 방안:
  - `https://developers.fireblocks.com/llms.txt` 직접 fetch (LLM-friendly 형식, 추정)
  - browser automation (Playwright / Puppeteer) 사용
  - 또는 사이트 sitemap.xml 검색
- 본 stage 에서는 in-body card 링크만 수집 → 29 URLs 의 sitemap 부분만 제공
