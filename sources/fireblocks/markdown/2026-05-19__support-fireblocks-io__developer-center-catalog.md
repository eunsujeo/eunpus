<!--
status: catalog-index (Stage 12, v3 policy)
priority: TIER3 (catalog only)
domain: Developer / API (5 priority domain 부분 cross-cut)
-->

# Cluster 4 — Developer / API Catalog

**CATALOG INDEX (Stage 12, v3 policy)** — 9개 raw PDF list. 본문 미로드, rename 안 함.

## Why Catalog Only

Developer / API cluster 는 **5 priority domain 부분만 cross-cut** (Identity-Auth 일부 / Governance 일부 / Architecture 일부). 사용자 명시 결정: **catalog/index 중심 유지**, Raw Signing + Typed Message Signing 만 future promote 후보.

## Catalog (9 files, raw PDF preserved)

| File | Tier | Promote candidate? |
|---|---|---|
| `Raw Signing` | TIER 1 (renamed Stage 12) | ✓ Future promote (premium feature, dApp Protection cross-cut) |
| `Typed Message Signing` | TIER 2 future | ✓ Future promote (Stage 10 Q-P01 보강) |
| `The Fireblocks API` | TIER 3 | meta hub, defer |
| `Developer Center` | TIER 3 | UI nav, defer |
| `Rate limits` | TIER 3 | API spine, defer |
| `Fireblocks Smart Contract (DeFi) API` | TIER 3 | DeFi/Tokenization product line |
| `Solana program call API` | TIER 3 | chain-specific |
| `The Co-signer management tab` | TIER 3 | cosigner ops detail |

## Promote Condition

- **Raw Signing**: Premium feature licensing 또는 DeFi/smart contract 운영이 operational priority 일 때 (이미 Stage 12 lightweight index 처리됨)
- **Typed Message Signing**: 동일 조건. Stage 10 Q-P01 (Policy parameter) 와 Stage 9 dApp Protection 의 typed message enrichment 와 cross-cut
- 나머지: 사용자 active operational domain 으로 격상 시
