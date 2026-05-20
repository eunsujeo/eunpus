<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/getting-started-with-fireblocks-key-link
url_status: inferred (slug 기반 추정)
downloaded_at: 2026-05-19
status: lightweight-index (Stage 18, v3.2.2)
priority: TIER1
domain: customer-held-key / onboarding
cluster: key-link
-->

# Fireblocks Key Link — Getting Started

**LIGHTWEIGHT INDEX (Stage 18, v3.2.2)** — PDF 본문 미로드.

## Why TIER 1
Key Link **onboarding workflow** 문서. 다음을 포함할 가능성이 큼 (filename 기반 추론):
- Prerequisites (어떤 customer-side 인프라 필요한가 — HSM? Cold storage? External custodian?)
- Step-by-step 도입 절차 (workspace 설정 → signing key 등록 → validation key 등록 → Vault Account 연결)
- 어떤 role / Admin Quorum 승인이 도입 단계마다 필요한지

## Cross-cut Signal (★ catalog-level)

### Customer-Side Prerequisites (★ future promote signal)
- Onboarding 문서 → customer 가 제공해야 하는 인프라·credential·키 형식 명세 가능성
- → MPC plane 의 onboarding (mobile device + biometric / passphrase) 과 매우 다른 prerequisite stack 가능성

### Governance Flow at Setup (★ future promote signal)
- 어떤 Admin Quorum 승인이 Key Link 도입 시점에 필요한지
- Stage 10 의 12 assignable actions 중 Key Link 관련 action 이 존재하는가
- Owner mandatory action 인가 (5 Owner-mandatory default 패턴과 일치 가능성)

### MPC ↔ Key Link 전환 / 공존 (★ future promote signal)
- 기존 Vault Account 의 asset 을 Key Link 로 migrate 가능한가, 또는 신규 vault 만 가능한가
- 한 workspace 에서 MPC + Key Link 동시 운영 패턴

## Hypotheses (★ Unverified — body 미확인)

- **H1**: Onboarding 은 Fireblocks Support 경유 필수 (Cold Wallet, Hosted MPC 의 Support-mediated pattern 과 유사 가능성)
- **H2**: Beta 상태이므로 onboarding 은 limited rollout / waitlist 가능성
- **H3**: HSM (Hardware Security Module) 통합이 primary use case — enterprise custody 요구 충족

## Related (catalog-level cross-link)

### Curated Wiki (보강 후보)
- [[entities/fireblocks/workspace]] §"Key Link onboarding 절차" (보강 후보)
- [[entities/fireblocks/admin-quorum]] §"Key Link setup approval" (보강 후보)
- [[vendors/fireblocks/user-management]] §"Customer-held key onboarding" (보강 후보)

### Cluster
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__key-link-cluster-catalog]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__fireblocks-key-link-overview]] — entry hub
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link]]

## Promote Condition
Key Link 도입 절차 / governance flow 필요시. Customer-side prerequisites 명세 필요시.

## Notes
- 본 lightweight index 는 catalog 용도. 본문 fact 미확인.
- Setup workflow 의 정확한 step / approver / prerequisite 은 body ingest 후만 fact 화.
