<!--
status: cluster-catalog (Stage 14, v3.1/3.2.1)
priority: TIER1 (catalog index)
domain: Governance + Security-Access (5 priority domain 직격)
-->

# Cluster: AML / Compliance / Travel Rule (29 PDFs)

**CLUSTER CATALOG (Stage 14, v3.1/3.2.1)** — PDF 본문 미로드. 29 PDF 의 catalog + 5-priority-domain cross-cut mapping.

## Why TIER 1 Cluster
**Governance + Security-Access 직격** — Stage 6 의 Q-S03 (AML Transaction Screening Policy 동작), Stage 9 의 `transaction-lifecycle.md` 14-step schematic 의 AML/Travel Rule Screening Service + AML provider 명시 (Chainalysis/Elliptic/Notabene), Stage 10 의 Policy entity / DCCP, Stage 8 의 audit log compliance category.

## Catalog (29 files)

### TIER 1 후보 (Meta hubs — 별도 lightweight index 작성)

| File | Tier | Cross-cut |
|---|---|---|
| `compliance-integrations.pdf` | **1** | Compliance plane meta hub. 모든 AML/Travel Rule provider 통합 entry |
| `aml-transaction-screening-and-monitoring.pdf` | **1** | AML plane meta. Stage 6 Q-S03 본문 응답 후보 |
| `about-the-travel-rule.pdf` | **1** | Travel Rule meta. FATF/regulatory spine |
| `global-policy-ofac-sanctions-compliance.pdf` | **1** | OFAC 강제 sanctions compliance global policy |

### TIER 2 후보 (placeholder markdown, 검색성 + cross-cut signal)

**AML Policy**:
- `aml-transaction-screening-policy.pdf` — Stage 9 `PENDING_AML_SCREENING` 상태 + Stage 10 Policy 와 연결
- `aml-post-screening-policy.pdf` — post-screening lifecycle
- `aml-advanced-configuration-settings.pdf`

**Travel Rule Policy**:
- `travel-rule-transaction-screening-policy.pdf`
- `travel-rule-post-screening-policy.pdf`
- `travel-rule-advanced-configuration-settings.pdf`
- `setting-up-travel-rule-integration.pdf`
- `about-travel-rule-transaction-screening.pdf`

**Screening Ops / Bridge**:
- `transaction-screening-operations.pdf`
- `customer-reference-id.pdf` — Travel Rule 의 originator/beneficiary 매핑
- `autofreeze-assets-from-incoming-transactions.pdf` — Stage 9 의 incoming Rejected 의 Admin unfreeze 패턴과 cross-cut
- `bring-your-own-screening-check-integration-guide.pdf` — custom screening 통합

**Providers** (Stage 9 14-step 의 AML/Travel Rule Provider plane 확장):
- `set-up-a-chainalysis-integration.pdf` — Stage 9 명시 provider
- `set-up-an-elliptic-integration.pdf` — Stage 9 명시 provider
- `interacting-with-the-trust-platform.pdf` — TRUST Travel Rule platform

**Reference**:
- `address-registry.pdf` — Travel Rule address mapping

### TIER 3 (raw + meta only)

- `aml-policy-templates.pdf` — template reference
- `travel-rule-policy-templates.pdf` — template reference
- `changing-your-aml-policy.pdf` — UI op
- `deleting-your-aml-policy.pdf` — UI op
- `disconnecting-your-aml-provider.pdf` — UI op
- `changing-your-travel-rule-policy.pdf` — UI op
- `deleting-your-travel-rule-policy.pdf` — UI op
- `disconnecting-your-travel-rule-provider.pdf` — UI op
- `travel-rule-compliance-for-exchange-transactions.pdf` — exchange-specific compliance

## Cross-Cut Mapping (5 Priority Domain spine 강화 관점)

### Governance spine

| File | 보강 대상 entity/hub |
|---|---|
| AML Transaction Screening Policy | [[entities/fireblocks/policy]] §"AML configuration" |
| AML Post-Screening Policy | [[entities/fireblocks/policy]] |
| Travel Rule Transaction/Post Screening Policy | [[entities/fireblocks/policy]] |
| Customer Reference ID | [[entities/fireblocks/transaction]] §"Travel Rule fields" |
| Compliance Integrations | [[vendors/fireblocks/compliance]] §"Provider plane" |

### Security-Access spine

| File | 보강 대상 |
|---|---|
| Global Policy: OFAC sanctions | [[vendors/fireblocks/compliance]] §"OFAC enforcement" |
| Autofreeze assets from incoming tx | [[vendors/fireblocks/risks]] / Stage 9 incoming Rejected pattern |
| Transaction screening operations | [[vendors/fireblocks/security]] §"Audit + Posture plane" cross-cut |
| Address Registry | [[entities/fireblocks/policy]] / Stage 9 whitelist cross-cut |

### Architecture spine (Stage 9 14-step schematic 보강)

| File | 보강 대상 |
|---|---|
| Chainalysis integration | [[vendors/fireblocks/architecture]] §"AML Providers (Chainalysis)" |
| Elliptic integration | [[vendors/fireblocks/architecture]] §"AML Providers (Elliptic)" |
| TRUST platform | [[vendors/fireblocks/architecture]] §"Travel Rule provider (TRUST = Notabene 후보?)" |
| Bring Your Own Screening Check | [[vendors/fireblocks/architecture]] §"Custom Screening" extension point |

## Open Questions 응답 후보 (promote 시)

- **Q-S03** (AML Transaction Screening Policy 정확한 동작) — `aml-transaction-screening-policy.md` + `aml-transaction-screening-and-monitoring.md` body promote 시 응답 가능
- **새 Q candidate**: Travel Rule 의 originator/beneficiary 데이터 필드, OFAC sanctions list 의 update cadence, AML/Travel Rule 의 workspace-level vs Policy-level 설정 우선순위

## Promote 우선순위 (사용자 결정 후 진행)

1. **`compliance-integrations`** — Compliance plane meta hub (모든 provider 통합 entry)
2. **`aml-transaction-screening-and-monitoring`** — Q-S03 응답 우선
3. **`global-policy-ofac-sanctions-compliance`** — Fireblocks 의 global compliance enforcement 명세
4. **`about-the-travel-rule`** — Travel Rule plane 시작
5. `customer-reference-id` — Travel Rule 의 가장 운영 영향 큰 필드

## Notes

- 본 catalog 는 lightweight index — 본문 fact 추측 금지
- 각 TIER 1 file 은 별도 lightweight markdown 으로 cross-cut signal 정리
- TIER 2 는 placeholder markdown (선택적 일부만)
- TIER 3 은 meta.yml only
