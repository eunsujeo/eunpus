<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/set-up-your-fireblocks-vault-with-key-link
url_status: inferred (slug 기반 추정)
downloaded_at: 2026-05-19
status: lightweight-index (Stage 18, v3.2.2)
priority: TIER1
domain: customer-held-key / vault-config / workspace
cluster: key-link
-->

# Fireblocks Key Link — Vault Setup

**LIGHTWEIGHT INDEX (Stage 18, v3.2.2)** — PDF 본문 미로드.

## Why TIER 1
**Vault Account ↔ Key Link 결합 패턴** 명세 문서. Stage 9 의 5-level vault hierarchy (account → asset → wallet → ...) 안에서 Key Link 가 어느 layer 에 들어가는지가 핵심 cross-cut.

## Cross-cut Signal (★ catalog-level)

### Vault Account 변형 (★ future promote signal)
- Stage 9 `account-and-wallet-structure.md` 의 default vault 구조 (MPC-backed) 와 Key Link vault 의 구조적 차이
- Asset address 3 패턴 (Internal / External / Contract) 이 Key Link vault 에서 어떻게 표현되는지
- Withdrawal round-robin 패턴이 Key Link vault 에서 작동하는가

### Workspace 구분 (★ future promote signal)
- Stage 9 W01 ANSWERED 의 hot/cold workspace ⊥ mainnet/testnet 직교 모델 — Key Link 는 **새로운 직교 축**인가, 아니면 hot workspace 의 변형인가
- Cold Wallet + Key Link 결합 가능성 (둘 다 Fireblocks-keyless 측면 공유)

### KeyId ↔ Vault asset 매핑 (★ future promote signal)
- Stage 15 API 의 `modify-the-signing-keyid` + `set-agent-user-id` — keyId 가 specific vault asset 과 어떻게 연결되는지
- 한 keyId 가 여러 asset 에 재사용 가능한가, 또는 1:1 매핑인가

### Policy Engine 적용 (★ future promote signal)
- Vault Account 단위로 Policy 가 평가됨 — Key Link vault 의 transaction 도 동일 Policy plane 통과하는가
- Stage 10 의 3 action (Allow / Approved by / Block) 이 Key Link transaction 에 적용 가능한가
- DCCP (Stage 10 S02 ANSWERED) 가 Key Link asset 에 적용되는가

## Hypotheses (★ Unverified — body 미확인)

- **H1**: Key Link vault 는 별도 Vault Account 단위로만 생성 (기존 MPC vault 와 asset-level 혼재 불가)
- **H2**: Key Link vault 의 transaction 도 Policy Engine 통과 — 단 signing step 만 customer 측 외부 위임
- **H3**: Vault setup 자체는 Admin Quorum 승인 필요 (vault 생성 = 신규 자산 영역 = Stage 10 의 governance action 패턴)

## Related (catalog-level cross-link)

### Curated Wiki (보강 후보)
- [[entities/fireblocks/vault-account]] §"Key Link vault 변형" (보강 후보)
- [[entities/fireblocks/workspace]] §"Workspace + Key Link 결합" (보강 후보)
- [[entities/fireblocks/policy]] §"Key Link policy 적용 범위" (보강 후보)
- [[entities/fireblocks/transaction]] §"Key Link transaction lifecycle" (보강 후보)
- [[vendors/fireblocks/architecture]] §"Vault Account + Key Link plane"

### Cluster
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__key-link-cluster-catalog]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__fireblocks-key-link-overview]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__getting-started-with-fireblocks-key-link]]

## Promote Condition
Vault Account ↔ Key Link 결합 구조 명세 필요시. Policy Engine 적용 범위 명세 필요시.

## Notes
- 본 lightweight index 는 catalog 용도. 본문 fact 미확인.
- Vault 의 정확한 구조 / KeyId 매핑 / Policy 적용은 body ingest 후만 fact 화.
