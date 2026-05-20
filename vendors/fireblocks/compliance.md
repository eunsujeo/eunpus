# Fireblocks — Compliance

> 컴플라이언스·인증·규제 대응 측면.

## Summary

_TODO: SOC 2, ISO 27001, KYT/외부 파트너 통합 등은 추후 자료. 본 자료군(Stage 1–6)에서 확인 가능한 항목만 정리._

본 자료군에서 확인된 compliance·audit·regulatory 표면:

- **AML Transaction Screening Policy** (Stage 6 `security-checklist.md`, p.1) — Policy 종류로 명시
- **Add or modify AML connections and policies** — 권한표 O/A/NSA가 ✓ (Stage 1 `user-roles.md`, p.7)
- **Add or modify Travel Rule connections and policies** — 권한표 O/A/NSA가 ✓ (Stage 1 `user-roles.md`, p.8)
- **Security audit log** — workspace events 기록·export. IP allowlist events도 포함 (Stage 6 `security-checklist.md`, p.2; `allowlisting-ip-addresses-for-console-access.md`, p.3)
- **Risk assessment via audit logs** — Owner/Admin이 key share risk 모니터링 (Stage 5 `recovery-passphrase.md`, p.3)
- **Fireblocks Security Posture Management (FSPM)** — 권한표 Security Auditor/Security Admin 영역 (Stage 1), Stage 6 자료에서 다시 reference. 정확한 명세는 본 자료에 없음 → Q-S07

## Key Concepts

- **AML Transaction Screening Policy** — Stage 6에서 명시된 Policy 종류 (`security-checklist.md`, p.1)
- **Travel Rule connections and policies** — workspace 단위 추가·수정 (`user-roles.md`, p.8)
- **Security audit log** — log / track / audit / **export** (Stage 6 `security-checklist.md`, p.2)
- **FSPM (Fireblocks Security Posture Management)** — Security Center 화면 + findings 관리 (Stage 1 `user-roles.md`, p.4)
- _TODO_: SOC 2 / ISO 27001 / 보험 / 라이선스 — 외부 자료 필요

## Details

### Audit Log 흐름 (Stage 6 통합)

**기능**: log / track / audit / **export** workspace events (`security-checklist.md`, p.2).

**기록되는 이벤트 (확인된 것)**:
- IP allowlist 추가·수정·활성화·비활성화 (`allowlisting-ip-addresses-for-console-access.md`, p.3)
- Recovery passphrase verification 알림·결과 (`recovery-passphrase.md`, p.3)
- (다른 이벤트는 본 자료군에 명시 없음)

**접근 권한** (`user-roles.md`, p.7):
- *View all workspace settings including audit logs*: Owner / Admin / NSA / Security Auditor / Security Admin

→ Audit log는 별도 entity로 만들지 않고 (사용자 방침), security-auditor / security-admin entity + 본 페이지에서 통합 다룸.

### AML / Travel Rule (Stage 1 + Stage 6 누적)

`user-roles.md`, p.7–8 권한표:
- *Add or modify AML connections and policies*: O / A / NSA ✓
- *Add or modify Travel Rule connections and policies*: O / A / NSA ✓

Stage 6 `security-checklist.md` p.1에서 **AML Transaction Screening Policy**가 Transaction security 카테고리의 명시적 항목 — 즉 일반 Policy rule과 별개의 Policy 종류로 운영됨. 정확한 동작·룰 표현은 본 자료에 없음 → Q-S03.

### FSPM (cross-ref)

Security Auditor / Security Admin 책임 영역의 일부. Stage 6 자료에서 Related Articles로 다시 등장하지만 직접 정의는 없음. Q-S07로 추적.

_TODO: SOC 2 / ISO 27001 / 보험 / 라이선스 — 추후 자료_

## Related Pages

- [[vendors/fireblocks/overview]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/security]] — Security checklist hub (Stage 6)
- [[vendors/fireblocks/policy-engine]] — Policy rule 평면
- [[entities/fireblocks/policy]] — Policy 종류
- [[entities/fireblocks/user-roles/security-auditor]] · [[entities/fireblocks/user-roles/security-admin]] — Audit log 접근권

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.4, p.7–8 (Stage 1: AML/Travel Rule 권한표, FSPM)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1–2 (Stage 6: AML Screening Policy, Security audit log)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.3 (Stage 6: IP allowlist events in audit log)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.3 (Stage 5: key share risk audit logs)

## Open Questions

- Q-2026-05-18-S03 — AML Transaction Screening Policy 정확한 동작
- Q-2026-05-18-S07 — FSPM entity-grade 명세
- Q-2026-05-18-A07 — 부분 답; audit log API endpoint·retention·외부 forwarding 잔존
- (SOC 2 / ISO 27001 / 보험 / 라이선스는 외부 자료 필요)
