<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4409104568338-One-Time-Address-OTA-feature
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__one-time-address-ota-feature.pdf
status: full
priority: TIER2
domain: Governance / Security-Access
-->

# One-Time Address (OTA) feature

*Updated 11 days ago*

## One-line summary

OTA = **whitelist Admin Quorum approval 우회** path. Non-whitelisted address 로 송금 허용. 단 **feature 자체 활성화는 Owner OR Authorized Approval group 승인** 필요. 보안 risk 명시 + Policy 권장 (사용자/그룹/vault 제한 + threshold 위 추가 approval).

## Key Concepts

### 정체 / governance 우회 path
p.1:
- 일반 흐름: address whitelist → Admin Quorum approval → 송금 가능
- OTA 흐름: **per-address Admin Quorum approval 불요**, 일회성 destination 으로 직접 송금

### Two-Layer Approval

p.1:
| Layer | 승인자 |
|---|---|
| **Feature 활성화 (workspace-wide)** | **Owner 또는 Authorized Approval group** |
| Per-address (OTA) | (없음 — feature 활성화 + Policy rule 충족이면 즉시 가능) |

→ 활성화 자체는 **두 approval menu** (Stage 8 의 spine) 중 하나로 위임 가능. 일단 activated 면 individual OTA 마다는 quorum cycle 없음.

### Activation Path
p.1: `Settings > General > One-time address transactions > Allow`

### 권장 Policy 패턴 (★ 보안 spine)

p.1 (직접 인용):
- "Restricting one-time address transfers only to **certain preselected users, user groups, and vaults**"
- "Requiring **approval for one-time address transfers above a certain threshold**"

→ OTA 가 Admin Quorum 우회이므로 **Policy 가 OTA 의 유일한 자동화된 방어선**. Policy 미설정 시 보안 평면 극도로 약화.

### Audit Log 이벤트 (cross-ref to Stage 8)

`audit-log.md` One-Time Address 섹션:
- **Approved / Canceled / Rejected / Submitted request / Turned off / Turned on**

→ OTA feature 활성화/비활성화 + per-tx OTA approval lifecycle 모두 audit log 추적.

## Operational Implication

- **Admin Quorum 의 whitelist scope 의 보완 path** — OTA 가 빠른 destination 운영을 가능케 하지만 governance integrity 의 trade-off
- 활성화는 worksapce-wide 결정 → 비활성화 default 권장
- 활성화한다면 Policy threshold 가 사실상 유일한 자동 방어선

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__one-time-address-ota-feature.pdf` (2 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/user-roles/owner]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/security]]
