---
type: vendor-hub
vendor: fireblocks
status: draft
tags: [compliance, aml]
stage_introduced: 1
last_updated_stage: 157
source_count: 27
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

### 컴플라이언스 검사 순서 (★ Stage 144)

거래 한 건이 지나는 검사 순서가 문서로 확정됨:

1. **OFAC 백엔드 차단** — Fireblocks(미국 법인)가 SDN 리스트 제재 주소로의 outbound 를 **사용자 Policy 규칙보다 먼저** 백엔드 리스트와 대조·차단. Console: `Blocked by Policy`, API: `BLOCKED`/`BLOCKED_BY_POLICY`. incoming 은 수신 자체를 못 막음 — freeze/isolate 로 대응 (source: global-policy-ofac-sanctions-compliance.md, p.1–2)
2. **AML 스크리닝** — Travel Rule 스크리닝보다 먼저 수행. 상대방이 이미 high-risk 플래그면 Travel Rule 데이터 교환은 보통 진행되지 않음 (source: compliance-integrations.md, p.1–2)
3. **Travel Rule 스크리닝** — AML 이후

### Address Registry (★ Stage 157 — 상세 promote)

무료 네이티브 기능 (상대방 식별만, 위험 평가 없음). 연결 가능 제공자 목록: **Chainalysis · Notabene · Sumsub · Elliptic** (source: compliance-integrations.md, p.1, p.3).

상세 (source: reference-address-registry.md, p.1–4):

- **정체 = counterparty discovery**: 주소를 조회해 그 주소를 통제하는 **법인(legal entity) 신원**을 받는 기능. > "designed solely to facilitate counterparty discovery and verification"
- **★ 개인지갑(unhosted) whitelist 등록부가 아님** — 커버리지는 **Fireblocks network 내부 주소만**, 비고객·opt-out 주소는 404 (code 2142) `not_found`. > "A not_found result does not indicate that the address is unhosted, illicit, or non-compliant"
- **현재 Early Access** (Settings > Labs 또는 CSM). default enabled, 전 고객 무료
- **Lookup**: `GET /v1/address_registry/legal_entities/{address}` → `verified`(LEI 검증 여부)·`entityName`·`jurisdiction`·`lei`·`travelRuleProviders`·`email`
- **자기 법인 등록**: `POST /v1/legal_entities` — **GLEIF 등록 LEI** 필수. 상태 머신 `Pending → Approved / Denied / Revoked`. workspace 당 복수 legal entity 가능, **vault account 당 최대 1개 매핑**
- **travelRuleProviders 선언 enum**: `CODE · GTR · MY_OWN · NOTABENE · SYGNA · SUMSUB · TRISA · TRUST · TWENTY_ONE_ANALYTICS · VERIFY_VASP` — 자기 법인이 쓰는 TR 제공자의 **선언 필드**이지 Fireblocks 통합 목록이 아님 (§Travel Rule 의 "VerifyVASP 부재" 결론 유지)
- **Opt-out**: workspace 전체 (`DELETE /v1/address_registry/tenant`) 또는 vault 단위 (`POST /v1/address_registry/vaults`). opt-out 시 조회·의존 compliance workflow 모두 비활성
- **Compliance workflows** (counterparty group 정의 + screening policy 연동, first-match·catch-all 필수·timeout accept/reject 설정): **"coming soon"** — Early Access 중 추가 예정
- **제한**: EU·Swiss 환경 미지원 (인프라 격리, `not_found` 반환), Developer Sandbox 미지원. bulk 추출 방지 통제 (rate limit·daily cap·경보)

### AML Transaction Screening (★ Stage 144 — Q-S03 ANSWERED)

**성격**: premium opt-in (추가 구매·CSM). 제공자는 **Chainalysis · Elliptic** — workspace 당 **동시 1개만**, 교체는 Support (source: aml-transaction-screening-and-monitoring.md, p.1–2).

**공유 데이터**: Asset · Amount · Origin/Beneficiary 주소 · blockchain hash. **입금은 첫 confirmation 후에** 스크리닝. 다중 목적지 출금은 목적지별 검사 후 **최고 위험 기준으로 전체 승인/거절** (source: 같은 문서, p.3–4).

**Screening Policy** (무엇을 검사): default 는 **내부 거래 포함 전량** — Travel Rule 판과 달리 규칙 불일치 시 "스크리닝 없이 자동 수락". Action = Pass / Screen / Freeze (source: aml-transaction-screening-policy.md, p.2–4).
- 미지원 라우트: Vault→Vault, Vault→Exchange, Gas Station→Vault — 사전 검사는 안 되지만 **전송 후 제공자에 등록되어 사용 쿼터를 소모** → 해당 라우트는 PASS 규칙 권장. NFT 미지원 (source: aml-transaction-screening-and-monitoring.md, p.6)

**Post-Screening Policy** (결과별 조치): 조치는 **Accept / Reject / Alert 3종** (Travel Rule 판의 Freeze·Wait·Cancel 없음). Reject — 입금 = 동결·Admin unfreeze, 출금 = 차단·Admin 우회 가능. 규칙 파라미터 (source: aml-post-screening-policy.md, p.3–9):
- Chainalysis: Risk Score(Low/Medium/High/Severe — Medium·Severe 는 V2 전용) · Category(ID 1–47 + 999: sanctioned entity 3 · ransomware 12 · mixing 13 · scam 18 · terrorist financing 23 등) · Exposure(Direct/Indirect, V2)
- Elliptic: Risk Score 0.0–10.0 (선택 점수 이상에 적용)
- **Unknown/N-A 점수 거래는 alert 도 reject 도 불가**

**Advanced settings 기본값** (제공자 무관, source: aml-advanced-configuration-settings.md, p.2–5):
| 항목 | 기본값 |
|---|---|
| Skip on failure (장애 시 우회) | **On** — 장애·기한 내 무응답이면 통과 (Off 면 실패·입금 동결) |
| Admin unfreeze 허용 | On |
| Admin 의 정책 우회 출금 | On |
| P2P Network 우회 | Off (= P2P 도 검사) |
| Inbound delay | **30초** (Chainalysis V2 는 10분) · 최대 7일 |
| Outbound delay | **0초** (즉시 응답 사용) · 최대 90분 (연장은 JWT lifetime 변경, Support) |

Pending 은 최대 6시간 폴링. **정책 반영 절차에 Fireblocks Support 개입** — CSV 업로드 후 Support 가 검토·활성화 (source: changing-your-aml-policy.md, p.1). 제공자 해제·정책 삭제도 Support 경유.

### Travel Rule (★ Stage 143 — support PDF 3종 deep ingest + developers 3건 Mode B · Stage 144 보강)

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

**Stage 144 보강**:
- **입금 흐름**: 첫 blockchain confirmation 후 Screening Policy 통과 → Notabene 전송. 원 거래에 Travel Rule 메시지가 없으면 **Fireblocks 가 빈 메시지를 생성해 스크리닝 가능하게 함** (source: about-travel-rule-transaction-screening.md, p.3)
- **delay 기본값** (제공자 무관): Inbound **30초**(최대 7일) · Outbound **0초**(최대 90분 — JWT lifetime, Support). 장애 우회 On·Admin unfreeze On·Admin 우회 On·P2P 우회 Off — AML 판과 동일 구조 (source: travel-rule-advanced-configuration-settings.md, p.2–4)
- Pending 최대 4시간 후 스크리닝 취소 (source: about-travel-rule-transaction-screening.md, p.5)
- 지원 자산: Notabene 은 대체로 CoinGecko 등재 자산 전반 (같은 문서, p.4)
- 데이터 보관: 암호화되어 Notabene 저장, **Fireblocks 는 복호화 키를 보유하지 않음** (source: about-the-travel-rule.md, p.1)
- 거래소 트래블룰(별개 흐름): Binance·Bitstamp·Bitfinex 등이 입출금 PII 를 요구 — Console/API 의 PII 설문으로 제공하거나 생략(차단 위험 감수) (source: travel-rule-compliance-for-exchange-transactions.md, p.1–4)

**미확인**: TAP 과의 직접 상호작용 명세(19개 문서 전체에 TAP 용어 부재 — OFAC 대조가 "사용자 Policy 규칙보다 먼저"라는 순서만 확정), 관할권별 임계값 수치(문서는 "관할권이 결정"만) → Q-2026-07-07-C02 partial.

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
- docs/architecture/travel-rule-kr-reference.md — 트래블룰 규제 도메인 reference (한국 특금법·솔루션 지형·거래소 실무, Stage 148)
- [[entities/wallet-bank/travel-rule-flow]] — daw-core 측 VASP 이체 5종·순서 강제 (cross-vendor)

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.4, p.7–8 (Stage 1: AML/Travel Rule 권한표, FSPM)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1–2 (Stage 6: AML Screening Policy, Security audit log)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.3 (Stage 6: IP allowlist events in audit log)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.3 (Stage 5: key share risk audit logs)
- `2026-05-19__support-fireblocks-io__travel-rule-post-screening-policy.md`, p.1–5 (Stage 143: 결과별 조치 6종)
- `2026-05-19__support-fireblocks-io__travel-rule-transaction-screening-policy.md`, p.1–4 (Stage 143: 스크리닝 대상 규칙)
- `2026-05-19__support-fireblocks-io__setting-up-travel-rule-integration.md`, p.1–3 (Stage 143: Notabene 연동·VASP 구조)
- `sources/fireblocks/webpages/developers/` — define-travel-rule-policies · validate-travel-rule · travel-rule-link-integration meta (Stage 143, Mode B)
- `2026-05-19__support-fireblocks-io__aml-*.md` 9종 (Stage 144: 제공자·정책·기본값)
- `2026-05-19__support-fireblocks-io__about-the-travel-rule.md` · `about-travel-rule-transaction-screening.md` · `travel-rule-advanced-configuration-settings.md` · `travel-rule-policy-templates.md` · `changing/deleting-your-travel-rule-policy.md` · `disconnecting-your-travel-rule-provider.md` · `travel-rule-compliance-for-exchange-transactions.md` (Stage 144)
- `2026-05-19__support-fireblocks-io__compliance-integrations.md` p.1–3 · `global-policy-ofac-sanctions-compliance.md` p.1–2 (Stage 144: 검사 순서·OFAC·제공자 목록)
- `2026-05-22__developers-fireblocks-com__reference-address-registry.md`, p.1–4 (Stage 157: Address Registry 상세 — LEI 조회·등록·opt-out·workflows coming soon)

## Open Questions

- Q-2026-05-18-S03 — AML Transaction Screening Policy 정확한 동작 (★ Stage 144 ANSWERED — 본 페이지 AML 절)
- Q-2026-07-07-C01 — Notabene 통합 vs TRLink 의 관계 (★ Stage 144 partial — compliance-integrations 의 연결 가능 목록에 Notabene·Sumsub 병렬 등재 → 병행 시사, 명시 없음)
- Q-2026-07-07-C02 — TAP 상호작용 명세 · 관할권별 임계값(한국) (★ Stage 144 partial — delay 기본값 30초/0초 확정, TAP 용어는 문서군에 부재, 임계값은 "관할권이 결정"만)
- Q-2026-07-08-C03 — VerifyVASP(국내 망) 도달 경로 (★ Stage 146 진전 — 구조·국내 맥락 확정, sources/travel-rule/webpages/ Mode B 5건 (Stage 148 클러스터 이동). 잔여: 경로 A′(TRLink Sumsub·GTR 경유 상호운용) 실효·Enclave 요건·가격 — CSM·Sumsub 대상. docs-site/travel-rule 9장)
- Q-2026-05-18-S07 — FSPM entity-grade 명세
- Q-2026-05-18-A07 — 부분 답; audit log API endpoint·retention·외부 forwarding 잔존
- Q-CMP-12 — 개인지갑 등록의 Fireblocks 반영 수단 (Stage 157, [[open-questions/compliance]] — Address Registry 는 개인지갑을 받지 않음이 확정되면서 발생)
- (SOC 2 / ISO 27001 / 보험 / 라이선스는 외부 자료 필요)
