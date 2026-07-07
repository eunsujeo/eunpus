---
type: vendor-hub
vendor: fireblocks
status: draft
tags: [compliance, aml]
stage_introduced: 1
last_updated_stage: 143
source_count: 7
related:
  - overview
  - policy
  - policy-engine
  - risks
  - security
  - security-admin
  - security-auditor
---
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

### Travel Rule (★ Stage 143 — support PDF 3종 deep ingest + developers 3건 Mode B)

**성격**: premium **opt-in 기능 — 추가 구매 필요, CSM 문의** (source: setting-up-travel-rule-integration.md, p.1).

**제공자 연동 — 두 갈래**:
- **Notabene 통합** (기본 파트너십): Console `Settings > Compliance > Travel rule > Connect provider` 에 Notabene API key·Secret·**VASP DID** 등록 (source: setting-up-travel-rule-integration.md, p.1–2). Fireblocks 는 Travel Rule 전용 거래 데이터를 영구 저장하지 않음 — 암호화되어 Notabene 보관 (source: webpages/developers/docs/define-travel-rule-policies.meta.yml)
- **TRLink (Travel Rule Support)**: 제공자 중립 통합 레이어 — 명시 파트너 Sumsub·GTR. 법적 실체(legal entity) 단위 설정, `/v1/screening/trlink/*` (source: webpages/developers/reference/travel-rule-link-integration.meta.yml). Notabene 통합과의 관계(병행/세대교체)는 미확인 → Q-2026-07-07-C01

**다중 법인 구조**: Gateway VASP(부모)–subsidiary. **vault account 는 단일 VASP 에만 연결** (VASP 는 복수 vault 가능). 입금 검사는 수신 vault 의 VASP 기준, 미지정 시 Gateway 기본 (source: setting-up-travel-rule-integration.md, p.2).

**정책 2단 구조** — 활성화 시 default 자동 적용, custom 은 CSV 업로드(또는 Early access Policy Editor), 둘 다 **first-match** (source: setting-up-travel-rule-integration.md, p.3):

1. **Transaction Screening Policy** — 무엇을 스크리닝할지. default 는 전량 스크리닝, 예외: 미지원 경로·미지원 자산·초기 Travel Rule 정보 없음·AML 미활성. 규칙 파라미터 = Source/Destination(vault·exchange·network connection·one-time address…)·Amount/AmountUSD·Asset(Notabene 지원 자산만)·Action(**Screen / Bypass / Freeze**) (source: travel-rule-transaction-screening-policy.md, p.1–3)
2. **Post-Screening Policy** — Notabene 결과별 조치를 사전 결정. 상태: Completed / Pending / Saved(BELOW_THRESHOLD·NON_CUSTODIAL·동일 VASP 내부) / Rejected / Failed / **Blocking Time Expired** / Canceled. 조치 6종 (source: travel-rule-post-screening-policy.md, p.2–4):
   - **Accept** — 입금: 즉시 사용 가능 · 출금: **이제 서명 가능** (→ 스크리닝은 서명 전 게이트)
   - **Reject** — 입금: **자금 동결, Admin unfreeze 필요** · 출금: 전송 차단 (Admin 은 우회 가능)
   - **Alert** — 승인 + Audit Log·승인자 모바일 알림
   - **Freeze** — 입금 전용 동결
   - **Wait** — Pending 전용, 최대 4시간 후 스크리닝 취소
   - **Cancel** — 출금 Blocking Time Expired 전용

**출금 API 흐름** (Notabene 경로): `POST /v1/screening/travel-rule/validate` (임계값·주소 유형 — type: BELOW_THRESHOLD/NON_CUSTODIAL/TRAVELRULE) → 정보 수집 → `validate/full` → isValid 후 `POST /v1/transactions` 에 travelRuleMessage(PII SDK 암호화) 동봉. 검사 제외 경로: Gas Station→Vault, Vault→Network Connection, Vault→Exchange, Vault→Vault (source: webpages/developers/reference/validate-travel-rule.meta.yml).

**미확인**: TAP 과의 직접 상호작용 명세, 관할권별 임계값 적용(한국 기준), Blocking Time 기본값 → Q-2026-07-07-C02.

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
- `2026-05-19__support-fireblocks-io__travel-rule-post-screening-policy.md`, p.1–5 (Stage 143: 결과별 조치 6종)
- `2026-05-19__support-fireblocks-io__travel-rule-transaction-screening-policy.md`, p.1–4 (Stage 143: 스크리닝 대상 규칙)
- `2026-05-19__support-fireblocks-io__setting-up-travel-rule-integration.md`, p.1–3 (Stage 143: Notabene 연동·VASP 구조)
- `sources/fireblocks/webpages/developers/` — define-travel-rule-policies · validate-travel-rule · travel-rule-link-integration meta (Stage 143, Mode B)

## Open Questions

- Q-2026-05-18-S03 — AML Transaction Screening Policy 정확한 동작 (★ Stage 143 partial — Travel Rule 쪽 정책 구조는 확정, AML 쪽 룰 표현은 `aml-*` PDF 미추출)
- Q-2026-07-07-C01 — Notabene 통합 vs TRLink 의 관계 (병행? 세대교체?)
- Q-2026-07-07-C02 — TAP 상호작용 명세 · 관할권별 임계값(한국) · Blocking Time 기본값
- Q-2026-05-18-S07 — FSPM entity-grade 명세
- Q-2026-05-18-A07 — 부분 답; audit log API endpoint·retention·외부 forwarding 잔존
- (SOC 2 / ISO 27001 / 보험 / 라이선스는 외부 자료 필요)
