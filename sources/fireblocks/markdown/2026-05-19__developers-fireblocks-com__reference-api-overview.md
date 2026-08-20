<!--
url: https://developers.fireblocks.com/reference/api-overview
source_type: webpage
fetched_at: 2026-05-19
status: lightweight-index (Stage 13, v3.1)
priority: TIER2
domain: developer / API
-->

# Fireblocks Developer Docs — API Overview

**LIGHTWEIGHT INDEX (Stage 13, v3.1)** — webpage body 미저장.

## Source
- **URL**: https://developers.fireblocks.com/reference/api-overview
- **Source type**: webpage
- **Tier**: 2

## Cross-cut Signal
- 5 priority domain 중 **Identity-Authentication + Governance** cross-cut (API auth + tx API + policy API)
- Stage 4 의 API user / CSR / API key entity 와 직접 연결
- Stage 9 의 `transaction-lifecycle.md` 의 14-step (Dev API Gateway → JWT 검증 → Transaction Manager) external-facing 시각
- Stage 10 의 Policy approval flow API 측면

## Related Hub Candidates
- [[vendors/fireblocks/api]] — API surface hub (Stage 1 stub)
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/api-key]]
- [[entities/fireblocks/csr]]
- [[entities/fireblocks/transaction]]
- [[vendors/fireblocks/authentication]]

## Promote Condition
API authentication / transaction API / policy API hub 와 연결할 때, 또는 사용자 명시 promote.

## In-body Link Catalog (9개)

### REST API
- REST API Guide → `/reference/rest-api-guide-1`
- Postman Guide → `/reference/explore-postman-collection`

### Language SDKs
- TypeScript SDK → `/reference/typescript-sdk`
- Python SDK → `/reference/new-python-sdk`
- Java SDK → `/reference/java-sdk`

### Web3 / Smart Contract
- EVM Web3 Provider → `/reference/evm-web3-provider`
- Hardhat Plugin Guide → `/reference/hardhat-plugin`
- Local JSON RPC Guide → `/reference/evm-local-json-rpc`

### Webhooks
- Configure Webhooks → `/reference/configure-webhook-urls`

## Notes
- Sidebar nav 는 JS-rendered, WebFetch 미지원.
- 전체 sitemap 은 [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap]] 참조.
