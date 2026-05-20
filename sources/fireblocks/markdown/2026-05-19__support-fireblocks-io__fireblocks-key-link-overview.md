<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/fireblocks-key-link-overview
url_status: inferred (slug 기반 추정)
downloaded_at: 2026-05-19
status: lightweight-index (Stage 18, v3.2.2)
priority: TIER1
domain: customer-held-key / signing-plane / mpc-boundary
cluster: key-link
-->

# Fireblocks Key Link — Overview

**LIGHTWEIGHT INDEX (Stage 18, v3.2.2)** — PDF 본문 미로드. Key Link cluster entry hub.

## Why TIER 1
Key Link 은 Fireblocks 의 **MPC plane 밖**에서 동작하는 **customer-held key plane** 으로 추정되는 별도 product line. Stage 8 의 MPC 3-share spine (2 cloud + 1 mobile) 과 **직교하는 신뢰 모델** 가능성 — Fireblocks 가 키를 보유하지 않는 외부 custody 통합 표면. 그렇다면 MPC 와의 **boundary** + signing flow 의 차이 + governance 영역의 어떤 부분이 적용 가능 / 불가능한지가 핵심 cross-cut.

## Cross-cut Signal (★ catalog-level, body 미로드)

### Signing Key Plane (★ future promote signal)
Stage 15 llms.txt 의 `/api-reference/key-link-beta/` 9 endpoints 중 4 개가 signing key plane:
- `add-a-new-signing-key`
- `get-list-of-signing-keys`
- `get-a-signing-key-by-keyid`
- `modify-the-signing-keyid`

→ **Customer 가 보유한 signing key 를 Fireblocks 에 등록·관리**하는 API surface. MPC share 분포 (Stage 8 의 2 cloud + 1 mobile) 와 **직교**하는 별도 plane 가능성.

### Validation Key Plane (★ future promote signal)
4 endpoints:
- `add-a-new-validation-key`
- `get-a-validation-key-by-keyid`
- `get-list-of-registered-validation-keys`
- `disables-a-validation-key`

→ **Signing 결과 검증용 public key** 등록·관리. Asymmetric key pair 패턴 시사 — signing key 는 customer-held private, validation key 는 Fireblocks 가 verify 용으로 보유.

### Customer-Held Key Architecture (★ future promote signal)
- `set-agent-user-id` — keyId 와 Fireblocks user 매핑
- Fireblocks 가 키에 직접 접근하지 못하는 경우 어떻게 transaction 의 sign 이 trigger 되는지 (callback? polling? external co-signer?) — Stage 8 의 `cosigner` plane 과의 cross-cut 가능성

### MPC Plane 과의 Boundary (★ future promote signal)
- Stage 8 의 MPC-CMP 3-endpoint signing 모델 (Q-M01/M02 ANSWERED) 과 **별개 trust model** 로 추정
- Vault Account 안에서 어떤 자산은 MPC, 어떤 자산은 Key Link 로 격리되는지
- Policy / Approval Group / Admin Quorum 의 어느 영역이 Key Link asset 에 적용 가능한지
- Workspace freeze / DR / Disaster Recovery (xprv+fprv) 가 Key Link asset 에 어떻게 작동하는지

## Hypotheses (★ Unverified — body 미확인)

> 본 hypothesis 들은 filename + API endpoint name + 일반 industry pattern 기반의 catalog-level 추론. 본문 ingest 전까지 fact 로 취급 금지.

- **H1**: Key Link = customer-held (cold storage / HSM / external custodian) signing key 를 Fireblocks Console·Policy·Transaction workflow 에 linking 하는 feature. Fireblocks 는 MPC share 보유 안 함.
- **H2**: Validation key 는 customer 가 sign 한 transaction 의 signature 검증 + Fireblocks 측 audit 용도.
- **H3**: Vault Account 안에 Key Link asset 과 MPC asset 이 공존 가능 (asset-level 격리).
- **H4**: Beta 상태 — production-grade governance plane 일부 미지원 가능성 (예: approval-group 미지원, Cold Wallet 의 Risk-G07 패턴과 유사).

## Related (catalog-level cross-link)

### Curated Wiki (보강 후보, 아직 수정 안 함)
- [[entities/fireblocks/mpc-key-share]] §"Key Link non-MPC plane" (보강 후보)
- [[entities/fireblocks/workspace]] §"Key Link vault 변형" (보강 후보)
- [[entities/fireblocks/vault-account]] §"Asset-level key plane 분리" (보강 후보)
- [[entities/fireblocks/transaction]] §"Key Link signing flow" (보강 후보)
- [[vendors/fireblocks/architecture]] §"Customer-held key plane" (보강 후보)
- [[vendors/fireblocks/api]] §"Key Link beta API" (보강 후보)
- [[vendors/fireblocks/mpc]] §"MPC plane vs Key Link plane boundary" (보강 후보)
- [[vendors/fireblocks/risks]] §"Key Link beta state risk" (보강 후보)

### Cluster
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__key-link-cluster-catalog]] — 3 PDF cluster catalog
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__getting-started-with-fireblocks-key-link]] — onboarding workflow
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link]] — vault config

### Stage 15 API catalog
- [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__llms-txt-sitemap]] §"key-link-beta" — 9 endpoints

## Promote Condition

다음 시점에 body ingest (Mode C) 권장:
- Key Link 의 신뢰 모델 / MPC plane 과의 boundary 명세 필요
- 사용자가 Customer-held key 통합 검토 시작
- Policy / Approval Group / Vault Account 에 Key Link variant 명세 필요시
- 사용자 명시 promote

## New Q Candidates (★ promote 시 정식 등록 후보)

본문 ingest 전까지 등록 보류. 등록 시 ID 예약:
- **Q-2026-05-19-M06**: Key Link 의 signing flow — MPC 와 어떻게 다른가? (customer 가 sign 후 Fireblocks 가 validate 하는 외부 co-signer 패턴?)
- **Q-2026-05-19-W03**: Vault Account 안에 Key Link asset 과 MPC asset 이 공존 가능한가? Asset-level 격리 모델?
- **Q-2026-05-19-G07**: Key Link asset 에 어떤 governance plane (Policy / Approval Group / Admin Quorum) 적용 가능한가?
- **Q-2026-05-19-S16**: Key Link beta 상태의 production-readiness 리스크 + 어떤 governance feature 가 미지원인가?
- **Q-2026-05-19-AU06**: Key Link signing key 의 authentication / authorization (어떤 customer-side credential 이 keyId 와 매핑되는가)?
- **Q-2026-05-19-A08**: Key Link 의 chain support — MPC 와 동일 자산군? 별도 매트릭스?

## Notes
- 본 lightweight index 는 catalog 용도. **본문 fact 미확인** — 모든 plane 명세는 body ingest 후만 정식 fact 화.
- Stage 15 llms.txt 의 9 API endpoint name 은 retrievable fact (catalog 수준 확정).
- Beta prefix (`/api-reference/key-link-beta/`) 는 fact (Stage 15 sitemap 확정).
