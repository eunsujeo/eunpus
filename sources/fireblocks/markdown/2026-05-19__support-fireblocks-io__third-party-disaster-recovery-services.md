<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/third-party-disaster-recovery-services
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__third-party-disaster-recovery-services.pdf
status: lightweight-index (Stage 12 v3 policy)
priority: TIER1
domain: Mobile-Recovery / Workspace-Management / Security-Access
-->

# Third-Party Disaster Recovery Services

**LIGHTWEIGHT INDEX (Stage 12, v3 policy)** — PDF 본문 미로드.

## Why TIER 1
**Q-S09 응답 후보 1순위** — Stage 8 의 "DR Service xprv+fprv 재구성 운영 절차 미명세" + "SPOC 경고" 의 정식 후속 자료.

## Expected Cross-Cut Signals (verify on promote)
- Q-S09 (DR Service 운영 절차) — air-gapped requirement 의 구체 정의, third-party 제공자 비교, rotation 정책
- Stage 8 의 `fireblocks-cloud-architecture.md` 의 Disaster Recovery Services component
- Stage 5 의 `workspace-keys-backup.md` entity 의 "third-party DRS" 선택지
- 관련 sub-DRS:
  - **CoinCover** (TIER 3 raw)
  - **Station70** (TIER 3 raw)
  - `Mobile Key Share Backup and Recovery with a Third-Party DRS` (TIER 2 deferred)

## Promote Condition
**Q-S09 응답이 운영 우선순위로 격상되면 즉시 promote**. 그 전까지 deferred.

## Status
- PDF rename: ✓
- meta.yml: ✓
- Body: lightweight index only

## Related
- [[entities/fireblocks/workspace-keys-backup]]
- [[vendors/fireblocks/risks]] §"Risk-S09 DR Service 자체가 SPOC"
- [[vendors/fireblocks/architecture]] §"Disaster Recovery Services"
