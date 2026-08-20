<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/about-tokenization-on-fireblocks
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__about-tokenization-on-fireblocks.pdf
status: placeholder (Stage 11 — lazy-load mode, deep ingest deferred)
priority: TIER1 (within Tokenization product line, but **outside 5 priority domain**)
domain: tokenization (product line, not in 5 priority domains)
-->

# About tokenization on Fireblocks

*Updated: see source* — **PLACEHOLDER (Stage 11 — Tokenization product line catalog)**

## One-line summary

Fireblocks Tokenization product line 의 **meta-overview** 문서. 별도 product line (Embedded Wallets / Key Link / Off Exchange / Cold Wallet 처럼). Stage 11 lazy-load 정책에 따라 **본문 미로드, catalog/placeholder 만 유지**. Deep ingest 는 후속 stage 또는 사용자 명시 요청 시 promote.

## Domain Classification

- **Product line**: Tokenization
- **5 priority domain 적합도**: ✗ (별도 product line)
- **Cross-cut governance**: Smart contract role assignment 영역에서 Stage 9 Vault Structure BP (Mint/Burn/Pause/Deploy/Upgrade per-op vault) + Stage 10 Policy entity 와 연결 가능

## Tokenization Product Line Catalog (Stage 11)

33 PDF 가 Source Lake 에 raw 보관:

### Tokenization Overview & Page
- `about-tokenization-on-fireblocks.pdf` ← 본 파일 (TIER 1 placeholder)
- `the-tokenization-page.pdf`

### Chain-specific Tokenization
- `tokenization-on-evm-compatible-blockchains.pdf`
- `tokenization-on-stellar.pdf`
- `tokenization-on-ripple.pdf`
- `solana-tokenization.pdf`

### Token Management
- `issuing-tokens.pdf`
- `minting-and-burning-tokens.pdf`
- `setting-token-prices.pdf`
- `token-management-user-experience.pdf`

### Smart Contracts (인프라)
- `smart-contract-library.pdf`
- `fireblocks-upgradeable-smart-contracts.pdf`
- `managing-smart-contracts-for-tokenization.pdf`
- `managing-vesting-smart-contracts.pdf`
- `linking-existing-tokens-and-smart-contracts.pdf`
- **`roles-in-fireblocks-smart-contracts.pdf`** ← TIER 2 placeholder (governance cross-cut)
- **`best-practices-when-assigning-token-contract-roles.pdf`** ← TIER 2 placeholder (role assignment governance)

### ABI
- `what-is-a-smart-contract-abi.pdf`
- `adding-private-abis.pdf`

### Contract Operations (Upgradeable + Specific contracts)
- `operating-the-upgradeable-erc-20f-contract.pdf`
- `operating-the-upgradeable-erc-721f-contract.pdf`
- `operating-the-upgradeable-erc-1155f-contract.pdf`
- `operating-the-full-feature-token-contract.pdf`
- `operating-the-cmta-token-contract.pdf`
- `operating-the-allowlist-contract.pdf`
- `operating-the-denylist-contract.pdf`
- `operating-the-token-locker-contract.pdf`
- `operating-the-token-sale-contract.pdf`
- `operating-the-recurring-vesting-and-payment-contract.pdf`

### Gasless Tokenization Sub-product
- `gasless-tokenization-infrastructure.pdf`
- `deploying-gasless-contracts.pdf`
- `interacting-with-gasless-contracts.pdf`

### Use Case Best Practices
- `blockchain-bond-tokenization-best-practices.pdf`

## For full content
`sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__about-tokenization-on-fireblocks.pdf`. **본문 미로드 (Stage 11 lazy-load policy)**.

## Related Pages (potential cite targets, deferred)
- [[entities/fireblocks/policy]] §"Premium features Mint/Burn/Burn" (Stage 10)
- [[entities/fireblocks/vault-account]] §"Smart Contract per-op vault" (Stage 9)
- [[vendors/fireblocks/risks]] §"Risk-G04 Policy block-all default 의존" (Stage 10)

## Status

- **PDF rename**: ✓ (Stage 11)
- **meta.yml**: ✓ (Stage 11)
- **Markdown body**: placeholder only (Stage 11)
- **Entity citations**: deferred until user requests Tokenization deep ingest
- **Promote condition**: Tokenization 이 사용자의 active operational domain 으로 격상되거나, governance/security spine 에 결정적 영향을 줄 새 facts 가 필요할 때
