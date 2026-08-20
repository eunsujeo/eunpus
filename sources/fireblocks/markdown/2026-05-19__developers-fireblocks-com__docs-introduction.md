<!--
url: https://developers.fireblocks.com/docs/introduction
source_type: webpage
fetched_at: 2026-05-19
status: lightweight-index (Stage 13, v3.1)
priority: TIER2
domain: developer / platform overview
-->

# Fireblocks Developer Docs — Introduction

**LIGHTWEIGHT INDEX (Stage 13, v3.1)** — webpage body 미저장, in-body card 링크만 sitemap 으로 수집.

## Source
- **URL**: https://developers.fireblocks.com/docs/introduction
- **Source type**: webpage
- **Tier**: 2

## Cross-cut Signal
- 5 priority domain 중 **Identity-Authentication + Workspace-Management** 부분 cross-cut (API key mgmt / SDK / vault account)
- Stage 8 의 architecture (Auth Engine / API Gateway / Co-Signer Engine) 의 외부 developer-facing 시각
- 별도 product line: SDK / CLI / MCP / Hardhat plugin

## Related Hub Candidates (existing wiki)
- [[vendors/fireblocks/api]] — API surface hub (Stage 1 stub)
- [[vendors/fireblocks/architecture]] §"Shell Services (API gateway)"
- [[entities/fireblocks/api-user]] / [[entities/fireblocks/api-key]] / [[entities/fireblocks/csr]]

## Promote Condition
Fireblocks architecture / API overview hub 를 만들 때, 또는 사용자 명시 promote.

## In-body Card Link Catalog (8개 sections)

### Getting Started
- Getting Started → `/docs/quickstart`
- API Reference → `/reference/api-overview`
- What Is Fireblocks? → `/docs/what-is-fireblocks`
- SDKs & Dev Tools → `/reference/typescript-sdk`

### Use Cases
- Wallet as a Service → `/docs/wallet-as-a-service`
- Treasury Management → `/docs/treasury-management`
- Tokenization → `/docs/tokenization`
- Self-Custody Infrastructure → `/docs/self-custody-infrastructure`

### Key Capabilities
- Vault Accounts → `/docs/overview`
- Transactions → `/reference/create-transactions`
- Webhooks → `/reference/webhooks-overview`
- Smart Contracts → `/docs/interact-with-smart-contracts`
- Staking → `/docs/stake-assets`
- Compliance → `/docs/define-aml-policies`

### Start Building Steps
- Fireblocks Documentation MCP → `/docs/quickstart`
- Manage API Keys → `/docs/manage-api-keys`
- TypeScript SDK → `/reference/typescript-sdk`
- Fireblocks CLI → `/docs/fireblocks-cli`

## Notes
- **Sidebar nav 는 JS-rendered** — WebFetch tool 로 잡히지 않음. Sidebar 전체 수집은 별도 browser automation 또는 `https://developers.fireblocks.com/llms.txt` (LLM-friendly documentation index) 활용 필요.
- 전체 sitemap 은 [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap]] 참조.
