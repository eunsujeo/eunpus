<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/10883496786204-Default-Deposit-Control-and-Confirmation-Policy
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy.pdf
status: full
priority: TIER1
domain: Blockchain-Assets / Deposit-Lifecycle
-->

# Default Deposit Control and Confirmation Policy

*Updated 2 months ago* (as of 2026-05-19 capture)

## One-line summary

Workspace 는 기본적으로 **default DCCP** 적용. **ETC = 372 confirmations** (51% attack risk), **finality 체인 = 별도 처리** (Blockchain confirmation limitations 참조), **그 외 모든 체인 = 1 confirmation** (vault↔vault 포함). **Contract call op = 최소 3 confirmations** 권장.

## Key Concepts

### 1. Default DCCP applies automatically (p.1)

> "Your workspace automatically uses the default Deposit Control and Confirmation Policy."

→ Workspace 생성 시 자동 적용. Override 는 [[2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy]] 참조.

### 2. Per-chain confirmation defaults (p.1)

| 체인 group | Default confirmations | 비고 |
|---|---|---|
| **Ethereum Classic** | **372** | 51% attack risk 명시 — "we recommend a high amount of confirmations" |
| **Finality-property 체인** | (별도) | `Blockchain confirmation limitations` 참조 |
| **All other blockchains** | **1** | vault↔vault transfer 포함 |
| **Contract call operations** | **3 (recommended minimum)** | tx type 별 별도 권장 |

### 3. ETC 의 372 confirmations 의 의미

ETC blockchain network 가 51% 공격에 노출된 history (실제 attack 발생: 2019 Jan, 2020 Jul/Aug) — Fireblocks 는 historical risk 를 명시적으로 default 에 반영. Confirmation 의 default 가 단순 latency 가 아닌 **risk-adjusted** 임을 보여주는 사례.

## For full content
`sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy.pdf` (2 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/blockchains]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/vault-account]]
- [[2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy]] — override 메커니즘
- [[2026-05-19__support-fireblocks-io__blockchain-confirmation-limitations]] — finality 체인 + min/max 제약
- [[2026-05-18__support-fireblocks-io__about-the-deposit-control-and-confirmation-policy]] — 기본 개요

## Open Questions
- Q-2026-05-29-DC01 — Contract call 의 3-confirmation "recommended" 가 default 인지 권장값인지 (default 라면 chain 별 default 와 어떻게 결합되는가)
