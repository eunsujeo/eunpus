<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360013034359-About-the-Deposit-Control-and-Confirmation-Policy
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__about-the-deposit-control-and-confirmation-policy.pdf
status: full
priority: TIER1-light
domain: Governance / Security-Access
-->

# About the Deposit Control and Confirmation Policy

*Updated 2 years ago*

## One-line summary

**DCCP** = blockchain confirmation 횟수 정책 — incoming/outgoing tx 가 clear 되어 wallet 잔액에 credit 되기까지의 confirmation 요구치. clear 전 = **inflow/outflow state 에 locked**. UTXO 경우 clear 후 **outputs 즉시 spendable**. → Q-S02 부분 응답.

## Key Concepts

### 정의
p.1: DCCP 는 incoming + outgoing tx 모두에 대해 **blockchain network confirmation 횟수** 지정. Confirmation 충족 = "clear" 상태로 funds 가 wallet 에 credit.

### State 모델
- **Clear 전**: 금액이 **inflow state** (incoming) 또는 **outflow state** (outgoing) 에 lock — 사용 불가
- **Clear 후**: wallet 의 **currently available balance** 에 반영
- **UTXO 특수**: clear 후 outputs **즉시 spendable** (account-based 와 동일하게 즉시 사용 가능)

### Stage 9 와 정합
`primary-transaction-statuses.md` 의 Confirming → Completed transition 의 정확한 trigger 가 DCCP 의 confirmation 수치. **Completed 상태의 multiple webhook** (zero-confirmation Deposit Policy 의 경우) 가 DCCP 의 effect.

### 관련 문서 (이 문서 자체는 짧음, 별도 자료 참조)
- `default-deposit-control-and-confirmation-policy.md` (TIER 3) — Fireblocks default 값
- `build-a-custom-deposit-control-and-confirmation-policy.md` (TIER 3)
- `override-the-dccp-for-specific-transactions.md` (TIER 2 → 별도 ingest)
- `blockchain-confirmation-limitations.md` (TIER 3)

→ DCCP **default 값** 과 **min/max 범위** 는 별도 문서 (TIER 3 PDF) 에 있으나 본 stage 에서는 미수집.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__about-the-deposit-control-and-confirmation-policy.pdf` (2 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/vault-account]]
- [[vendors/fireblocks/policy-engine]]
