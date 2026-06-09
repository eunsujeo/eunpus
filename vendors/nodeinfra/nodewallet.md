---
type: vendor-hub
vendor: nodeinfra
status: draft
tags: [custody, security, hsm, mpc, compliance, architecture, signing, stablecoin]
stage_introduced: 51
last_updated_stage: 51
source_count: 8
related:
  - fireblocks
---
# NodeWallet (NodeInfra) — 온프레미스 스테이블코인 수탁 인프라

> 한국 금융기관용 **설치형(on-prem) 스테이블코인 핫월렛 수탁 인프라**. Fireblocks 같은 SaaS MPC·VASP 위탁의 **대안 축** — 키를 고객이 직접 보유하고 망분리 IDC 에서 운영. 본 wiki 의 "자체 custody(옵션 2)" 레퍼런스.

> ⚠️ 본 페이지의 사실은 **NodeInfra gated 문서(`docs.nodeinfra.com`, Mintlify project `nodewallet`)의 자체 주장** — 벤더 진술 tier (독립 검증 아님). 비교표는 NodeInfra 가 공개 문서 기준 2026-04-16 조사한 것. 일부(다이어그램·이미지) 미수집. (Stage 35 ingest, Stage 51 promote)

## Summary

NodeWallet 은 은행·카드사·PG/결제사·증권사·공공기관을 위한 **온프레미스 스테이블코인 핫월렛 인프라**다 (`ROOT.md`, p.27). **Solana 전용**, **망분리(air-gap) 데이터센터**에 설치·운영하며, 국내 금융·가상자산 규제 준수를 표방한다 (`README.md`; `ROOT.md`, p.7). 핵심 차별점은 **벤더 의존성 제거** — 키 소유권·정책 실행을 모두 고객 인프라에 둔다 (`security__index.md`).

SaaS MPC(Cloud MPC 계열)·VASP 하이브리드와의 구조적 차이 (NodeInfra 비교표, `ROOT.md` p.40–44):

| 항목 | VASP 하이브리드 | Cloud MPC 계열 | **NodeWallet** |
|---|---|---|---|
| 제품 종류 | VASP + SaaS | SaaS | **설치형 SW** |
| 망분리 대응 | X | X | **O** |
| 배포 모드 | 클라우드 | 클라우드 | **망분리 IDC** |
| 보안 모듈 | MPC | MPC | **HSM + SGX** |
| 키 소유권 | 벤더 샤드 보관 | 벤더 샤드 보관 | **고객 직접 보유** |
| 정책 실행 위치 | 벤더 클라우드 | 벤더 클라우드 | **고객 인프라** |

→ 본 wiki 의 [[docs/architecture]] custody 논의에서 **옵션 1 = Fireblocks(SaaS MPC·벤더 위탁), 옵션 2 = NodeWallet 류(온프렘·자체 보유)** 의 후자 archetype.

## Key Concepts

- **온프렘·망분리 전용** — 망분리 IDC·벤더 無의존·데이터 국외 미이전이 필수인 고객 타깃 (`security.md`, p.39)
- **HSM(FIPS 140-3) + Intel SGX TEE** 로 키 보호, **3-키 다중서명**이 단일 서비스 탈취 차단 (`ROOT.md`, p.32)
- **3-키 = 개시 키 / 승인 키 / 실행 키** — 분리된 HSM 파티션. 승인 키는 정책 엔진의 co-sign, **실제 Solana 서명은 SGX 엔클레이브의 실행 키** (`compliance__architecture.md`, p.54·70)
- **4개의 직교 격리 축** — 단일 방어선 비의존, 한 축 탈취돼도 나머지가 거래 차단 (`security__index.md`, p.43)
- **컴플라이언스 = 정책 엔진(승인자)** — AML·KYC·트래블룰·제재명단을 콘솔에서 실시간 조정, 배포 대기 없이 (`compliance.md`; `ROOT.md`, p.31)
- **Java SDK + Spring Boot starter** 로 백엔드 구현 (`com.nodeinfra:nodewallet-spring-boot-starter`) (`dev__spring__setup.md`)

## Details

### 컴포넌트 아키텍처 (`compliance__architecture.md`)

- **코디네이터** — 평가 컨텍스트 사전계산(잔액·일일누적), 승인자 호출 오케스트레이션. 잔액 일관성은 원장 트랜잭션 경계에 둠 (p.20·24)
- **승인자(정책 엔진)** — 규칙 평가 + HSM `승인 키` co-sign + Held 큐 관리. ledger 직접 조회 안 함(코디네이터가 `EvaluationContext` 전달). 망분리 내부 별도 프로세스(포트 8091), SPOF 제거 (p.19; `compliance.md` p.16)
- **HSM / SGX 엔클레이브** — `승인 키` co-sign(HSM 파티션) + `실행 키`가 SGX 엔클레이브에서 실제 Solana 서명 (p.54·70)
- **원장(ledgerdb)** — 잔액 진실원천·증거 영구 기록. 잔액 부족 검출은 원장 책임 (p.69)
- **콘솔** — 정책 관리 UI

→ 정책 결정 흐름: **콘솔(정책 관리) → 코디네이터(컨텍스트 계산) → 승인자(평가·승인키 co-sign) → SGX(실행키 서명) → 원장(기록)**.

### Trust Boundaries (`security__architecture__trust-boundaries.md`)

- **클라이언트 → 격리 구역** — TLS 1.3 + API 키 서명(Ed25519, 60초 timestamp) + mTLS
- **격리 구역 → TEE** — CBOR IPC(stdin/stdout) + **DCAP 원격 증명** — MRENCLAVE 일치 엔클레이브 이미지만 서명 수행. 격리 구역이 뚫려도 증명 없는 세션 거부 (p.36)

### 컴플라이언스 정책 룰 (`compliance__rules__*`)

approval-tier(SINGLE_APPROVE / QUORUM_2_OF_3, 3-키 의식과 독립된 추가 게이트), per-tx-amount-limit(보수적 fee 모델), daily-withdrawal-limit, velocity-limit/window, time-window, address-list/cooldown, global-halt 등. 규제(AML·KYC·트래블룰·EFTA·VACPA) 매핑.

### 제약

- **Solana 전용** (`Chain.SOLANA`, `dev__quickstart.md`) — 멀티체인 미지원. EVM/BTC 커버 불가.
- **입금 차단 불가** — 입금은 이미 체인에 실행된 사건. `flow_type=deposit` 규칙은 입금 후 스윕에만 적용 (`compliance__architecture.md`, p.71)
- 인증: ISMS (예정) — VASP/SOC 2 와 다른 트랙 (`ROOT.md` 비교표)

## Related Pages

- [[vendors/fireblocks/api]] — 비교 축(SaaS MPC·벤더 위탁 custody = 옵션 1)
- [[vendors/fireblocks/mpc]] — Fireblocks MPC vs NodeWallet HSM+SGX
- [[docs/architecture]] — custody 옵션 비교(옵션 1 Fireblocks / 옵션 2 자체 custody) 의 옵션 2 archetype
- (docs-site `wallet-service-components` 10.5 "제도에 따라 custody 통째 교체" 의 옵션 2 기성품 예시)

## Sources

- `sources/nodeinfra/README.md` (Stage 35 ingest 요약 — Korean on-prem Solana stablecoin custody)
- `sources/nodeinfra/normalized/docs/ROOT.md` (제품 정의 + 3-way 비교표)
- `sources/nodeinfra/normalized/docs/security__index.md` (4-축 격리·벤더 무의존)
- `sources/nodeinfra/normalized/docs/security__architecture__trust-boundaries.md` (DMZ·격리구역·TEE 경계)
- `sources/nodeinfra/normalized/docs/compliance__architecture.md` (코디네이터·승인자·HSM·SGX·원장 + 3-키)
- `sources/nodeinfra/normalized/docs/compliance__rules__*.md` (정책 룰 다수)
- `sources/nodeinfra/normalized/docs/dev__spring__setup.md` · `dev__quickstart.md` (Java/Spring SDK, Chain.SOLANA)
- 비교표 출처: NodeInfra 자체 조사(공개 문서 기준 2026-04-16)

## Open Questions

- Q-2026-06-09-N01 — 4-축 격리의 정확한 4개 축 명칭/정의 (현재 축1=서비스 격리, 축4=시간·증거 격리만 확인; 축2·3 미상)
- Q-2026-06-09-N02 — 멀티체인 로드맵 (Solana 외 EVM/BTC 지원 계획?)
- Q-2026-06-09-N03 — ISMS "예정" 의 실제 인증 상태·시점
- Q-2026-06-09-N04 — 다이어그램/이미지 미수집 (mintcdn.com/nodewallet/) — 아키텍처 도식 추가 ingest 필요
