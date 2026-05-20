<!--
status: cluster-catalog (Stage 18, v3.2.2)
priority: TIER1 (catalog index)
domain: customer-held-key (★ 새 plane — 신규 entity 미생성 정책 유지)
cluster: key-link
-->

# Cluster: Key Link (3 PDF + 9 API endpoints)

**CLUSTER CATALOG (Stage 18, v3.2.2)** — PDF 본문 미로드. 3 TIER 1 lightweight index + Stage 15 의 9 API endpoint 의 catalog 통합.

## Why TIER 1 Cluster

**새 plane 후보 — entity-min discipline 검증 우선 영역**:
Key Link 가 Fireblocks 의 기존 plane (MPC 3-share / Cold Wallet / Sandbox) 외 **별도 customer-held key plane** 인지가 promote 의 핵심. 새 plane 으로 확인되면 다음 entity / hub 가 영향:
- [[entities/fireblocks/mpc-key-share]] — Key Link 가 MPC 와 직교한다면 entity scope 변경 필요 (또는 `mpc-key-share` → `key-share` 로 generalize 검토)
- [[entities/fireblocks/vault-account]] — asset-level 또는 vault-level 격리 모델
- [[vendors/fireblocks/architecture]] — Customer-held key plane 추가
- [[vendors/fireblocks/mpc]] — MPC plane vs Key Link plane boundary

**현 단계 정책**: 신규 entity 생성 보류. 본문 ingest 후에도 hub section 으로 흡수 가능한지 우선 검토 (Stage 6–17 = 12 연속 0 유지).

## Catalog (3 PDF — 모두 TIER 1)

| File | Tier | Owning lightweight index |
|---|---|---|
| `fireblocks-key-link-overview.pdf` | **1** | [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__fireblocks-key-link-overview]] |
| `getting-started-with-fireblocks-key-link.pdf` | **1** | [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__getting-started-with-fireblocks-key-link]] |
| `set-up-your-fireblocks-vault-with-key-link.pdf` | **1** | [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link]] |

## Cross-Cut Mapping

### MPC plane boundary (★ 최우선 promote signal)

| File | 보강 대상 |
|---|---|
| Overview | [[entities/fireblocks/mpc-key-share]] §"MPC plane vs Key Link plane boundary" / [[vendors/fireblocks/mpc]] §"Customer-held key plane 직교" |

### Signing Key Plane (customer-held)

| Source | Catalog scope |
|---|---|
| Overview PDF (filename) | "signing key" 라는 표현 — customer-side signing key registration |
| Stage 15 API endpoint 4 종 | `add-a-new-signing-key`, `get-list-of-signing-keys`, `get-a-signing-key-by-keyid`, `modify-the-signing-keyid` |

→ 보강 대상: [[entities/fireblocks/transaction]] §"Customer-held signing flow", [[vendors/fireblocks/cosigner]] §"Key Link vs API Co-signer 비교"

### Validation Key Plane (Fireblocks-held verification)

| Source | Catalog scope |
|---|---|
| Stage 15 API endpoint 4 종 | `add-a-new-validation-key`, `get-a-validation-key-by-keyid`, `get-list-of-registered-validation-keys`, `disables-a-validation-key` |

→ 보강 대상: [[vendors/fireblocks/security]] §"Customer signature validation plane"

### Customer-Held Key Architecture

| Source | Catalog scope |
|---|---|
| Stage 15 API endpoint 1 종 | `set-agent-user-id` (keyId ↔ Fireblocks user 매핑) |
| Vault Setup PDF | Vault Account 단위 결합 패턴 |
| Getting Started PDF | Onboarding workflow / prerequisites |

→ 보강 대상: [[entities/fireblocks/vault-account]] §"Key Link vault 변형", [[entities/fireblocks/workspace]] §"Workspace + Key Link 결합", [[vendors/fireblocks/architecture]] §"Customer-held key plane"

### Governance plane 적용 가능 영역 (★ Beta state 리스크)

| Source | Catalog scope |
|---|---|
| API prefix `/key-link-beta/` | Beta 상태 — production governance feature 일부 미지원 가능성 |

→ 보강 대상: [[vendors/fireblocks/risks]] §"Key Link beta state risk" — Cold Wallet 의 Risk-G07 (approval-group 미지원) 패턴과 유사한 governance gap 가능성

## Hypothesis Summary (★ Unverified — body 미로드)

> 모든 hypothesis 는 catalog cross-cut signal 수준. 본문 ingest 전까지 fact 화 금지.

| H | Hypothesis | 검증 source |
|---|---|---|
| **H1** | Key Link = customer-held signing key (HSM / cold storage / external custodian) 의 Fireblocks 통합 plane. MPC share 보유 안 함. | Overview PDF + Stage 15 API |
| **H2** | Asymmetric key pair: customer-private signing key + Fireblocks-side validation key | Stage 15 API 의 signing/validation key 분리 |
| **H3** | Vault Account-level 격리 (한 vault 안에 MPC + Key Link asset 혼재 불가, 별도 vault 필요) | Vault Setup PDF |
| **H4** | Beta state — production governance plane 일부 미지원 (approval-group, Cold-Hot rebalancing 등 어느 영역인지 본문에서 확정 필요) | API prefix `key-link-beta` |
| **H5** | Signing flow 는 외부 co-signer 패턴 — Fireblocks 가 transaction 을 customer-side endpoint 에 전달, customer 가 sign 후 결과 + signature 반환 | Stage 15 API + 일반 industry pattern |

## New Q Candidates (★ promote 시 정식 등록)

| Q-ID 예약 | 질문 | 우선순위 |
|---|---|---|
| **Q-2026-05-19-M06** | Key Link 의 signing flow — MPC 와 어떻게 다른가? | ★ |
| **Q-2026-05-19-W03** | Vault Account 안에 Key Link asset 과 MPC asset 이 공존 가능한가? | ★ |
| **Q-2026-05-19-G07** | Key Link asset 에 어떤 governance plane (Policy/Approval Group/Admin Quorum) 적용 가능한가? | ★ |
| **Q-2026-05-19-S16** | Key Link beta 상태의 production-readiness 리스크 + 미지원 governance feature 는? | ★ |
| Q-2026-05-19-AU06 | Key Link signing key 의 authentication (어떤 customer-side credential 이 keyId 와 매핑되는가)? | medium |
| Q-2026-05-19-A08 | Key Link 의 chain support — MPC 와 동일 자산군? 별도 매트릭스? | medium |

본 단계 (Mode B) 에서는 **Open Q 정식 등록 보류** — promote (Mode C) 시점에 일괄 등록. 현재는 cluster catalog 의 cross-cut signal 로만 보존.

## Promote 우선순위

1. **`fireblocks-key-link-overview`** — Key Link plane 의 entry point + MPC boundary 정의
2. **`set-up-your-fireblocks-vault-with-key-link`** — Vault Account 결합 구조 (entity boundary 결정)
3. **`getting-started-with-fireblocks-key-link`** — Onboarding workflow

## Stage 15 API catalog ref

[[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__llms-txt-sitemap]] §"key-link-beta (9 endpoints)" — 본 cluster 와 paired retrieval target.

## Notes

- 본 catalog 는 lightweight — **본문 fact 추측 금지** 정책 유지
- 신규 entity 생성 보류 — 본문 ingest 후에도 hub section 흡수 우선 검토
- Beta 상태 (`/key-link-beta/` API prefix) 는 catalog-level 확정 fact
- 9 API endpoint name 은 catalog-level 확정 fact (Stage 15 sitemap)
- 그 외 모든 plane 명세 / signing flow / chain support / trust model 은 **hypothesis 수준 유지**
