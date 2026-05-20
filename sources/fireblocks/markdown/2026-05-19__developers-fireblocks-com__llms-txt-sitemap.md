<!--
fetched_at: 2026-05-19
source_type: webpage-catalog (llms.txt derived)
status: sitemap-full (Stage 15, v3.2.1+)
priority: TIER2 (catalog index)
domain: developer / sitemap meta
note: "llms.txt body NEVER loaded into LLM context. URL inventory only via curl + grep pipeline."
-->

# Fireblocks Developer Docs — Full Sitemap (llms.txt-derived)

**SITEMAP (Stage 15)** — `https://developers.fireblocks.com/llms.txt` 다운로드 후 bash pipeline 으로 URL 만 추출. **본문 미로드** (file too large for LLM context: 141 KB / 709 lines).

## Source files (local, on-disk only — NOT loaded to context)

| File | bytes | lines | purpose |
|---|---|---|---|
| `sources/fireblocks/webpages/developers/llms.txt` | 141,106 | 709 | raw (do not Read) |
| `sources/fireblocks/webpages/developers/llms-urls.txt` | — | 716 | extracted URLs (sort -u) |
| `sources/fireblocks/webpages/developers/llms-docs-reference-urls.txt` | — | 714 | filtered: `/docs/` + `/reference/` + `/api-reference/` |

**Processing rule (operating-principles.md v3.2.2 후보)**: llms.txt body is NEVER fed to LLM. Use `wc`, `head`, `grep`, `sort`, `split` to extract URL inventory only.

## URL Inventory (totals)

| Path prefix | count |
|---|---:|
| `/api-reference/` | 419 |
| `/reference/` | 166 |
| `/docs/` | 129 (121 unique slugs) |
| `/openapi/` | 1 |
| **Total** | **716 unique URLs** |

## /api-reference/ group histogram (top tags = OpenAPI tag groups)

| Group | endpoints | Cross-cut |
|---|---:|---|
| `compliance` | 36 | **Stage 14 AML/Compliance cluster ★** |
| `vaults` | 35 | **Workspace-Management ★ (vault-account API)** |
| `trlink` | 28 | **Stage 14 Travel Rule (TRLink integration)** |
| `tokenization` | 24 | tokenization (Stage 11 cluster) |
| `embedded-wallets` | 23 | embedded wallets (별도 product line) |
| `smart-transfer` | 19 | smart transfer |
| `staking` | 16 | staking |
| `webhooks-v2` | 15 | **Security-Access ★ (Stage 8 webhook plane)** |
| `network-connections` | 15 | network |
| `transactions` | 13 | **Governance ★ (tx lifecycle)** |
| `nfts` | 10 | NFT |
| `cosigners-beta` | 10 | **Identity-Auth ★ (Stage 8 co-signer)** |
| `travel-rule` | 9 | **Stage 14 Travel Rule** |
| `key-link-beta` | 9 | key management |
| `internal-wallets` | 9 | wallet |
| `onchain-data` | 8 | onchain |
| `external-wallets` | 8 | wallet |
| `exchange-accounts` | 8 | exchange |
| `contract-templates` | 8 | smart contract |
| `blockchains-&-assets` | 8 | asset |
| `tags` | 7 | metadata |
| `earn-beta` | 7 | staking |
| `contracts` | 7 | smart contract |
| `connected-accounts-beta` | 7 | account |
| `trading-beta` | 6 | trading |
| `payments--flows` | 6 | payment |
| `contract-interactions` | 6 | smart contract |
| `user-groups-beta` | 5 | **Identity-Auth ★** |
| `policy-editor-beta` | 5 | **Governance ★ (Stage 10 policy)** |
| `off-exchanges` | 5 | exchange |
| `deployed-contracts` | 5 | smart contract |
| `web3-connections` | 4 | DeFi |
| `policy-editor-v2-beta` | 4 | **Governance ★ (policy v2)** |
| `gas-stations` | 4 | gas |
| `fiat-accounts` | 4 | fiat |
| `payments--payout` | 3 | payment |
| `workspace` | 2 | **Workspace-Management ★** |
| `webhooks` | 2 | **Security-Access ★** |
| `utxo-management-beta` | 2 | UTXO |
| `ota-beta` | 2 | OTA |
| `keys-beta` | 2 | key |
| `console-user` | 2 | **Identity-Auth ★** |
| `compliance-screening-configuration` | 2 | **Stage 14 AML ★** |
| `api-user` | 2 | **Identity-Auth ★** |
| `workspace-status-beta` | 1 | workspace |
| `whitelist-ip-addresses` | 1 | **Security-Access ★** |
| `users` | 1 | **Identity-Auth ★** |
| `reset-device` | 1 | **Security-Access ★** |
| `openapi.json` | 1 | meta |
| `audit-logs` | 1 | **Security-Access ★** |
| `admin-quorum` | 1 | **Stage 10 Admin Quorum spine ★** |

**Total tag groups**: 51 (includes 13 beta).

## 5 Priority Domain Cross-cut (curated promote candidates)

### Governance ★ (/docs/ — 7 candidates)
- `/docs/define-approval-quorums` — **Stage 10 spine 보강**
- `/docs/define-confirmation-policy`
- `/docs/define-aml-policies` — Stage 14 AML cluster
- `/docs/define-travel-rule-policies` — Stage 14 Travel Rule
- `/docs/set-transaction-authorization-policy` — TAP (Stage 10)
- `/docs/integrating-third-party-aml-providers`
- + `/api-reference/admin-quorum` (1), `/api-reference/policy-editor-beta` (5), `/api-reference/policy-editor-v2-beta` (4), `/api-reference/travel-rule` (9), `/api-reference/trlink` (28)

### Identity-Authentication ★ (/docs/ — 11 candidates)
- `/docs/manage-api-keys` — **Stage 4 api-key entity 보강 ★**
- `/docs/generate-a-csr-for-an-api-user` — **csr entity 보강 ★**
- `/docs/whitelist-ips-for-api-keys` — Security-Access cross-cut
- `/docs/cli-authentication`
- `/docs/cosigner-architecture-overview` — **Stage 8 co-signer plane 보강 ★**
- `/docs/multiple-cosigners-high-availability`
- `/docs/use-cosigners-for-signing-automation`
- `/docs/associating-end-clients-with-transactions`
- + `/api-reference/api-user` (2), `/api-reference/console-user` (2), `/api-reference/users` (1), `/api-reference/user-groups-beta` (5), `/api-reference/cosigners-beta` (10)

### Workspace-Management ★ (/docs/ — 1 explicit + many implicit)
- `/docs/workspace-environments` — **Stage 9 Q-W01 본문 보강 ★**
- `/docs/overview` (Vault Accounts hub) — vault-account entity
- + `/api-reference/workspace` (2), `/api-reference/workspace-status-beta` (1), `/api-reference/vaults` (35)

### Mobile-Recovery ★ (/docs/ — 4 candidates)
- `/docs/backup-and-recovery-overview` — Stage 12 cluster 보강
- `/docs/embedded-wallet-backup-and-recovery` — Embedded Wallet variant
- `/docs/embedded-wallet-disaster-recovery`
- `/docs/embedded-wallet-mpc-key-generation` — **MPC 모델 명확화**

### Security-Access ★ (/docs/ — 5 candidates)
- `/docs/raw-signing` — Stage 12 raw signing 보강
- `/docs/whitelist-addresses` — whitelist plane
- `/docs/whitelist-ips-for-api-keys`
- `/docs/co-signer-security-checklist-defense-monitoring` — **Stage 8 cross-cut ★**
- + `/api-reference/whitelist-ip-addresses` (1), `/api-reference/webhooks-v2` (15), `/api-reference/audit-logs` (1), `/api-reference/reset-device` (1)

## Top Promote Candidates (사용자 결정 후 진행)

**TIER 1 후보 (5)**:
1. **`/docs/define-approval-quorums`** — Stage 10 Admin Quorum spine 직접 보강
2. **`/docs/manage-api-keys`** — Stage 4 api-key entity Q 응답
3. **`/docs/cosigner-architecture-overview`** — Stage 8 cosigner plane 본문 보강
4. **`/docs/workspace-environments`** — Stage 9 Q-W01 (Mainnet/Testnet) 응답
5. **`/docs/co-signer-security-checklist-defense-monitoring`** — Stage 8 의 webhook + cosigner security cross-cut

**TIER 2 placeholder 후보 (5)**:
6. `/docs/embedded-wallet-mpc-key-generation` — MPC 모델 (Cold Wallet 의 mobile key share 와 비교)
7. `/docs/set-transaction-authorization-policy` — TAP 정의
8. `/docs/define-travel-rule-policies` — Stage 14 Travel Rule
9. `/docs/raw-signing` — Stage 12 raw-signing 보강
10. `/docs/integrating-third-party-aml-providers` — Stage 14 AML providers

## Notes
- 본 sitemap 의 작성 시점에 본문 fetch 미수행. URL 만 catalog.
- llms.txt 자체는 lightweight markdown index 형식이나 141 KB 크기로 WebFetch 32 MB 한계와 별개로 LLM context 보호 측면에서 **본문 미로드 정책 유지**.
- 본 catalog 의 promote 진행 시에도 page-level chunk WebFetch 후 markdown 만 저장 (lightweight index pattern).
- 기존 sitemap `[[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap]]` (29 URLs) 은 in-body card 만 — 본 sitemap (716 URLs) 으로 sup­erseded.
