<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/the-co-signer-management-tab
url_status: inferred (slug 기반 추정)
downloaded_at: 2026-05-19
status: lightweight-index (Stage 19, v3.2.2)
priority: TIER1
domain: cosigner-deployment / management-plane / console-ui
cluster: aws-nitro-cosigner
-->

# The Co-signer Management Tab

**LIGHTWEIGHT INDEX (Stage 19, v3.2.2)** — PDF 본문 미로드.

## Why TIER 1
Console 의 Co-signer **management UI 명세** 로 추정. Stage 15 catalog 의 `/api-reference/cosigners-beta/` 10 endpoint 가 management API 라면, 본 문서는 그 **UI 표면** + 운영자가 보는 view + action surface.

## Cross-cut Signal (★ catalog-level)

### Co-signer Management Plane (★ future promote signal)
- 다중 Co-signer 운영 환경의 inventory 관리 (list / add / pair / unpair / rename)
- 각 Co-signer 의 health / version / TEE 환경 / pairing status / API key 매핑
- Stage 8 의 페어링 잔존성 (API user 삭제 후 Co-signer pairing 잔존, Q-A02) 의 UI 처리 — unpair action 의 정확한 위치

### cosigners-beta API ↔ UI mapping (★ future promote signal)
Stage 15 의 10 endpoint 와 UI action 의 매핑:
| API endpoint | 추정 UI action |
|---|---|
| `add-cosigner` | UI 의 신규 Co-signer 등록 |
| `get-all-cosigners` / `get-cosigner` | inventory list / detail view |
| `rename-cosigner` | rename action |
| `get-all-api-keys` / `get-api-key` | API key matrix |
| `pair-api-key` | pairing action |
| `unpair-api-key` | unpairing action (★ Q-A02 후속) |
| `update-api-key-callback-handler` | Callback Handler 변경 |
| `get-request-status` | async request 상태 추적 |

### Approval Plane 통합 (★ future promote signal)
- Co-signer add / rename / unpair / Callback Handler 변경 시 어떤 governance 흐름 적용
  - Stage 10 의 Admin Quorum / Approval Group / Owner-mandatory 패턴 중 어떤 것
  - Stage 10 의 12 assignable actions 중 Co-signer 관련 action 존재 여부

## Hypotheses (★ Unverified — body 미확인)

- **H1**: Management tab 은 Settings 영역의 하위 — Console 의 `Settings > ... > Co-signers` 같은 경로
- **H2**: Co-signer 의 add / unpair / Callback Handler 변경은 Owner + Admin Quorum 승인 (Stage 8 페어링 패턴 일반화)
- **H3**: cosigners-beta API 의 `get-request-status` 가 async approval flow 의 status 추적 — Stage 10 의 governance request lifecycle 과 통합

## Related (catalog-level cross-link)

### Cluster
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cluster-catalog]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cloudformation-solution-for-fireblocks-co-signer]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__api-co-signer-overview-and-usage]]

### Curated Wiki (보강 후보)
- [[entities/fireblocks/api-co-signer]] §"Management UI + cosigners-beta API surface" (보강 후보)
- [[entities/fireblocks/admin-quorum]] §"Co-signer governance actions" (보강 후보)
- [[entities/fireblocks/approval-group]] §"Co-signer 관련 12 actions 매핑" (보강 후보)

### Stage 15 catalog (paired retrieval)
- `/api-reference/cosigners-beta/` 10 endpoints
- `/reference/api-cosigner-management`
- `/reference/api-cosigner-operate`

## Promote Condition
Co-signer 다중 운영 / management UI / governance approval 매핑 / cosigners-beta API spec 명세 필요시. Q-A02 (API user unpair 절차) 응답 시점.

## Notes
- 본 lightweight index 는 catalog 용도. 본문 fact 미확인.
