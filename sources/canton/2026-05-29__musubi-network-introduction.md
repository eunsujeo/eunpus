<!--
source_url: https://musubinetwork.com/introduction
fetched_at: 2026-05-29
status: full (WebFetch summary)
priority: TIER1
domain: cross-border-settlement / institutional-stablecoin
-->

# Musubi Network — Introduction (Mode B lightweight-index)

## (1) What is Musubi Network

"Cross-border settlement network on Canton that replaces correspondent banking with atomic Delivery-vs-Payment (DvP) settlement." Stablecoin-to-stablecoin transactions between institutions where "both legs of an FX swap settle in a single transaction — in seconds, not days — with zero counterparty risk."

## (2) Purpose / Use Cases

- 1-3 business day settlement delays 제거
- Herstatt risk 제거 (atomic settlement)
- correspondent bank intermediaries 다수 제거
- transparent / competitive FX pricing (RFQ model)
- unified audit trail (vs SWIFT 메시지 분산)

Primary corridor: **Japan ↔ Korea** FX swap / cross-border payment.

## (3) Participants (3 core types)

- **Institutions** — payment 시작자 + market maker pricing 선택
- **Custodians** — institutional client 자산 이동 authorize (cryptographic dual control)
- **Market Makers** — anonymized RFQ 수신 + 가격 경쟁

추가:
- Operator — Startale + Nodeinfra
- Settlement mediator — Canton level

## (4) Technical Architecture

각 참여자가 **isolated infrastructure** (backend / database / settlement node) — no shared systems / no shared data. Cross-party coordination 은 settlement network 통해서만.

Settlement = **4 atomic legs** + signatory closure (operator / sender custodian / market maker / receiver custodian) derived from per-leg `Allocation` contracts.

Metrics:
- ~15 seconds end-to-end settlement
- 4 settlement legs per transaction
- zero counterparty risk

## (5) Technology Stack

- **Canton** — explicit foundation
- **DAML** — implicit (Canton 의 smart contract)

## (6) Supported Assets / Stablecoins

- **JPYSC0** (Japanese yen stablecoin)
- **USDCx** (USD Coin · Canton-native)

## (7) Compliance & Regulatory Positioning

- Japanese: FSA / JAFIC / PPC
- Korean: FSC / KoFIU / PIPC
- Every FXOrder field maps to compliance obligation
- Built-in: KYC references / jurisdiction codes / timestamps / settlement proof hashing
- Privacy-by-design — market makers never see sender / receiver identity

## (8) Current Status

Deployed on Canton Network **testnet** for POC validation with institutional participants (Japan + Korea).
