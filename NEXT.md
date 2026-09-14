# Next Work Session — 현재 상태와 이어갈 작업

> 다음 세션 (다른 PC 포함) 이 본 문서만 보고 작업을 이어갈 수 있도록 self-contained 로 유지.
> 갱신: 2026-08-20. 이전 버전 (2026-05-22, Fireblocks Key Link docs-site 신규 작성 handoff) 의 본작업은 **완료 확인됨** — `docs-site/fireblocks-key-link-bank-design/` 7 페이지 + index.html 카드 + consistency check 4/4 PASS.

## 1. 현재 워크스트림 상태 (2026-08-20)

| 워크스트림 | 상태 |
|---|---|
| wiki (Layer 1–2) | Stage 174 까지 log.md 기록 (2026-09-07). 신규 entity 0 streak 47 stage 연속 |
| docs-site | 15 폴더. Key Link 포함 완료. 배지/날짜 전환은 사용자 지시 시에만 |
| blockchain-manager/docs (칸반 모듈) | `디지털 자산` 카테고리 전부 Done (Canton·Fireblocks·가스대납·시작하기·트래블룰). `In Progress` 문서 없음. `To Do` 표기 문서 (13·14·16·99 등) 도 본문은 작성돼 있음 — 칸반 status 전환은 사용자가 드래그로 |
| 상세 설계 3주제 (2026-07-23 예정분) | **작성 완료** — 입금 폭주·유실 복구 = `BC/설계/99-detection-detail.md` · DB 관리(보존·파티셔닝·아카이브) = `BC/설계/03-bcm-db.md` + `블록체인매니저/설계/15-raw-tx-archive.md` |
| fbhook (별도 저장소 ~/Workspace/fbhook) | 웹훅 v2 수신 PoC **전 시나리오 완료**. 관찰 → waas-wiki 정정도 반영 완료 (99·03·QnA·93~98, 커밋 c49d70d·6c9b8ee 등). 결과보고 = `BC/설계/97-webhook-poc-result.md`·`95-approve-pull-poc-result.md` |

## 2. 이어갈 작업 후보 (우선순위 순)

### 2.1 blockchain-manager 설계 문서의 미확정 항목 닫기

문서 자체는 작성 완료 — 남은 것은 각 문서의 "미확정" 절 항목들:

- `15-raw-tx-archive.md` — 보존 연한 (규제 요구 확인) · 일 활성률 실측 · 체인 원문 2단계 (자체 RPC 여부)
- `03-bcm-db.md` §미확정 절 항목
- `블록체인매니저/설계` 13 (DB 스키마 점검)·14 (API 레퍼런스)·16 (인터페이스) — 본문 작성돼 있으나 칸반 To Do. 확정·리뷰가 남았는지는 사용자 판단

### 2.1a 배치 sweep — 담당자 회신 후속 (Stage 174, 2026-09-07)

- **후속 문의 4건 발송** — 문안(EN+KO 초안)은 `BC/Fireblocks QnA/01-qna.md` "배치 sweep 설계 — 담당자 회신" 절. ① Wallet Pool 조언의 relay 모드 전제 ② Amount Cap·applyForApprove 의 API 적용 ③ 7702 위임 코드 운영자 인출 yes/no ④ WRITE rate limit·relay 처리량
- **회차당 대상 vault 수 추정** — `BC/설계/06-sweep.md` 정책(비율 임계·가스비 한도) × 예상 고객 수·입금 빈도. 건별(벤더 권장) vs 배치(채택안) 을 가르는 수치. 98 10절 "결정 입력"
- **OpenAPI 스펙 재수집** — `WALLET_POOL` source type·`POST /v1/tags`·`attached_tags` 가 2026-05 스펙에 없음 (`vendors/fireblocks/api.md` §Stage 174)
- Open Q: Q-2026-09-07-WP01 · WP02 · P01 · G02

### 2.1b svc 세션 후속: AdminReadService 에 Webhook health 조건 추가 (2026-08-21 리뷰)

`BC/설계/08-bcm-admin.md` 준비 카드 기준으로, Webhook 연결 완료 판단에 **Webhook 프로세스 health 응답**을 별도 조건으로 추가하기로 확정
(DB 집계 HEALTHY 만으로는 중지된 프로세스를 걸러내지 못함). 문서는 반영 완료 — svc 의
`bcm-admin/.../AdminReadService.kt` `preparationChecks` (`ready = webhook?.state == "HEALTHY"`) 구현 변경이 남았고, 이는 svc 세션 몫.

### 2.1c Dfns Baseline·DAW 구축 설계 (2026-09-14)

- 사용자 전제: 고객 소유 노드의 운영 위탁 + 사내 데이터센터의 Dfns 전체 플랫폼 Baseline + DAWBC + DAW-CORE. AWS 배치로 변경하지 않음.
- 문서 구조: `blockchain-manager/docs/WaaS 도입·구축/Dfns/` 5개(제공 자료 3개·인프라/구성도·담당자 질문), 같은 카테고리의 `DAW 구축 설계/` 4개(통합 구성/계획·핵심 계약·노드 연결·법정화폐 대납). 기존 13개를 9개로 통합. 이후 상세 내용은 이 문서들에 보강.
- 인프라: `Dfns/03-baseline-datacenter-design.md`. Kubernetes·외부 Vault 5노드·PG/Kafka/Redis·MPC 5-party / 3-of-5, 핵심 노드 36개 자원 예약안. 전체 DAW 플랫폼/체인 노드 총량이 아님.
- 지원 확인: `Dfns/04-vendor-questions.md` Q01~Q07. 비AWS 번들·CPU·외부 Vault/DB·Keyshares·지정 RPC·사내 API·대납·다중 자산. 아직 미발송·미답변.
- 설계 진입점: `DAW 구축 설계/00-integration-plan.md`. 운영 책임·결정·S0~S6 단계. 1차 검증은 사용자 선택 EVM 체인 1개 + ERC-20 자산 1개. 구체 네트워크·토큰은 후속 확정.
- 핵심 계약: `DAW 구축 설계/01-core-contracts.md`. Base·Solana 포함 체인별 자산·계정·주소·의도/시도·멱등·공개 API·Dfns 대응·이벤트·확정·영속 제약. 기존 OpenAPI의 금액·eventId/amount·DCCP FINALIZED·벤더 txId 의미 보존.
- 노드: `DAW 구축 설계/02-node-rpc-spec.md`. 고객이 명세를 제안, Dfns·업체가 호환성과 제공 조건 확인. EVM·Base·Solana와 외부 대납 전파 경로 포함.
- 대납: `DAW 구축 설계/03-fiat-gas-sponsorship.md`. 사용자 네이티브 잔액 없는 법정화폐 정산형 대납. 지불자 선택은 답변 대기. 외부업체 조달·지불 + 회사 법정화폐 정산을 제안 시나리오로 작성했으며 사용자 확정으로 취급하지 않음. Dfns 내장 기능만으로 법정화폐 청구·외부 대납 호환성이 확인된 것은 아님.
- 다음: S3 물리 DB·이벤트 스키마·상태 전이 상세화와 지원 릴리스/대납 계약 검증. 기존 공개 API·구현 저장소·인프라는 변경하지 않음.

### 2.2 wiki: 컨퍼런스 세션 자료 promote 대기 (Stage 164–165 후속)

세션 발표 자료 (슬라이드/영상) 확보 시:
- Q-2026-08-20-STBL07 (람다256 PoC 월렛·키 관리) · STBL08 (x402 vs Policy Engine) — `open-questions/stablecoin.md`
- Q-2026-08-20-01 (MPC-CMP PQC 전환) — `open-questions/fireblocks.md`
- 원본: `sources/stablecoin/` · `sources/pqc/` (meta.yml 의 promote_condition 참조)

### 2.3 백로그: 입금 식별자 재정의의 가이드·스켈레톤 동기화 (Stage 81 후속, 2026-06-12 이월)

issueDepositAddress = (주소+memo) 식별자 발급, 전 분면 구현으로 승격. 워크스루는 반영 완료 (2026-06-12), 잔여:
- 가이드 13.3 (capability 해제·의미 재정의) · 9.2/9.3 · 14장 (FB Canton 행) · 15.3 (15-2d) · 2.4 주석 · confluence 04
- 스켈레톤 (company/custodial-wallet) `DepositAddressIssuanceCapability` 재검토 — ★ 스켈레톤 저장소 쓰기 권한·소유는 착수 전 사용자 확인

## 3. 상시 룰 (새 세션 참조용 inline)

- **리뷰완료 배지 + 업데이트 날짜 = 사용자 통제** — docs-site/index.html 카드의 배지·날짜는 사용자 명시 지시 시에만 변경
- **No auto-deploy** — Cloudflare Pages 배포는 사용자 명시 지시 시에만. wrangler 는 한글 commit message 거절 → `--commit-message="<ASCII-only>"`
- **커밋은 배치** — 마일스톤·요청 시에만. 로컬 미리보기는 `./dev.sh` (blockchain-manager) 로 push 없이 반영
- **blockchain-manager-svc (구현 저장소) 파일 쓰기 금지** — waas-wiki 세션은 정합 확인·보고만
- **Evidence isolation** — Fireblocks 공식 근거 vs LLM 일반 지식 혼합 금지. "wiki 에 없음" 은 4-source 전수 검색 후만
- **PDF 직접 Read 금지** — 외부 도구 chunked extract 만

## 4. 완료 기록 (요약 — 상세는 log.md)

- Fireblocks Key Link docs-site 7 페이지 (구 NEXT.md 본작업) — 완료, consistency 4/4 PASS
- wallet-service-components 리뷰 백로그 1–4항 — 완료 (2026-06-11, commits 16fbde5·b5315a2 등). 5항만 §2.3 으로 이월
- 온보딩 → 디지털 자산 카테고리 개편 + 가스 대납 문서 정비 — 완료 (2026-08-19, commits c65f587·b773ead·191a6d3)
- 컨퍼런스 세션 배경 4건 수집·ingest (Stage 164–165) — 완료 (2026-08-20, commit e0df82d)
