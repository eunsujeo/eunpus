# Next Work Session — 현재 상태와 이어갈 작업

> 다음 세션 (다른 PC 포함) 이 본 문서만 보고 작업을 이어갈 수 있도록 self-contained 로 유지.
> 갱신: 2026-08-20. 이전 버전 (2026-05-22, Fireblocks Key Link docs-site 신규 작성 handoff) 의 본작업은 **완료 확인됨** — `docs-site/fireblocks-key-link-bank-design/` 7 페이지 + index.html 카드 + consistency check 4/4 PASS.

## 1. 현재 워크스트림 상태 (2026-08-20)

| 워크스트림 | 상태 |
|---|---|
| wiki (Layer 1–2) | Stage 224 까지 log.md 기록 (2026-09-21). 신규 entity 0 streak 97 stage 연속 (Stage 127 기준) |
| wiki lint | `python3 scripts/wiki_lint.py` 로 주기 실행 (Stage 222 신설). 최신 결과 = [lint-report.md](lint-report.md). 미해결 부채는 아래 2.4 |
| docs-site | 15 폴더. Key Link 포함 완료. 배지/날짜 전환은 사용자 지시 시에만 |
| blockchain-manager/docs (칸반 모듈) | `디지털 자산` 카테고리 전부 Done (Canton·Fireblocks·가스대납·시작하기·트래블룰). `In Progress` 문서 없음. `To Do` 표기 문서 (13·14·16·99 등) 도 본문은 작성돼 있음 — 칸반 status 전환은 사용자가 드래그로 |
| 상세 설계 3주제 (2026-07-23 예정분) | **작성 완료** — 입금 폭주·유실 복구 = `BC/설계/99-detection-detail.md` · DB 관리(보존·파티셔닝·아카이브) = `BC/설계/03-bcm-db.md` + `블록체인매니저/설계/15-raw-tx-archive.md` |
| fbhook (별도 저장소 ~/Workspace/fbhook) | 웹훅 v2 수신 PoC **전 시나리오 완료**. 관찰 → waas-wiki 정정도 반영 완료 (99·03·QnA·93~98, 커밋 c49d70d·6c9b8ee 등). 결과보고 = `BC/설계/97-webhook-poc-result.md`·`95-approve-pull-poc-result.md` |

### HTML 선택 내보내기 (2026-09-14)

- 목차 번호 중복 수정: md.js가 제목의 절 번호를 목차 번호 칸에 한 번만 표시하고 번호 없는 제목에만 자동 번호를 사용. 앱/HTML 검증 완료. **배포 반영됨** (배포 기준은 아래 2.1b-2). `_workspace/toc-numbering/` 참고.

- `HTML ↓`에서 중카테고리를 체크해 내보낼 수 있다. `WaaS 도입·구축`의 Fireblocks·Dfns만 고르면 DAW 구축 설계 4문서는 제외된다. (중카테고리 `Fireblocks PaaS`는 2026-09-16 `Fireblocks`로 개명)
- 문서 주제 묶음: Dfns는 배포 방식·운영 환경 / 서명 보안·검증 / 사내 구축·도입 검토, DAW는 개요 아래 계정·노드 연동 / 가스 대납·정산. frontmatter `group`으로 지정하며 HTML 카드와 이전·다음이 같은 묶음 순서를 사용한다.
- 브라우저와 CLI `--only`는 명시한 범위만 포함하며 연결된 다른 분류를 자동 추가하지 않는다. 제외된 문서·분류 링크는 텍스트로 남는다.
- 단위 검사: `node --test blockchain-manager/app/scripts/export.test.mjs`. 실제 UI·다운로드·독립 HTML·모바일 검증 기록은 `_workspace/export-selection/`.

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

### 2.1b-2 칸반 앱 배포 기준 (2026-09-21)

**마지막 배포 = `1fb3b720`** (Source 커밋 `781c0e7`, Production/main 확인). 직전 이력: `c49640fd` (Source `e2bdd3f`, Stage 218–224 문서 변경 일괄 반영) → 그 전이 `c5f9871b` (Source `3603674`, Stage 217).

**본 문서 곳곳의 "운영 배포 대기" 표기는 모두 그 시점 기준이며 현재는 반영 완료**다. 배포 여부는 이 절만 보면 된다 — 개별 항목의 표기를 믿지 말 것.

배포 절차: `app/` 에서 `npm run build:docs` → `wrangler pages deploy public --project-name=blockchain-manager --branch=main`. `public/_generated/` 가 gitignore 대상이라 빌드 선행이 필수고, `--branch=main` 을 빼면 Preview 로만 올라가 production 에 반영되지 않는다.

### 2.1c Dfns Baseline·DAW 구축 설계 (2026-09-15)

- Baseline 계층별 구성도: 공통 업무 연결·내부 서비스·Vault·사내 배치 구역·사내/AWS 서비스·운영 그림을 역할별 계층으로 통일. 계층과 Dfns 배포 단계·물리 구역을 구분. AWS 자동 잠금 해제·MSK 등록·백업은 운영 그림으로 분리. 앱·선택 HTML에서 Baseline 8개·Dfns 전체 14개 렌더링 확인. 화면은 `_workspace/dfns-consolidation/export-all-layers-0.png`~`7.png`.
- 중복 정리: Dfns 6→4문서, 전체 179문서. 프로필 비교는 개요 한곳, Baseline 공통 연결·Vault는 한곳에 두고 환경별 자원·인증·복구 절차 보존. 기존 대표 파일 경로를 유지해 해당 카드의 상태 매핑 보존. 신규 배포·인프라 실행 없음.

- AWS Baseline 추가안: `Dfns/03-baseline-datacenter-design.md`의 AWS 구성안. EKS·Aurora·MSK·ElastiCache와 Vault 유지, KMS auto-unseal·SCRAM 자격증명·3 AZ·MPC·백업·복구·인수 조건 정리. 16 EC2 / 88 vCPU / 352 GiB는 worker 예약 제안이며 관리형 서비스 등 제외. AWS-Native와 설치 장소를 구분하도록 개요·백엔드 비교·사내 설계·질의 연결. 기존 사내 설계 채택 전제 유지, AWS 리소스 생성 없음.

- 대납 실측 추가: 같은 주소로 0.01 Sepolia ETH를 Fee Sponsor 지정 후 추가 1회 전송, Confirmed 확인. 출금 지갑은 원금만 차감(잔액 0.079975950179954 ETH), 대납 지갑은 수수료 0.000083048666008826 ETH 차감(잔액 1.999916951333991174 ETH). 대납 수수료 목록의 requestId·fee와 잔액 감소 일치. API 비교에 요청·대사·일반 전송 대비·EIP-7702 응답 관찰을 반영. ERC-20·타 체인·웹훅·법정화폐 정산·Baseline 지원은 미검증. 원본은 Git 제외 `_workspace/dfns-api/sponsored-transfer-before.json`과 `sponsored-transfer-latest.json`.

- 상태·웹훅 비교: API 비교 문서에 Fireblocks 상태/subStatus와 Dfns Transfer 6개 상태, Included 입금 이벤트, V2 eventType/data.status와 Dfns kind/중첩 status, 알림 전달 상태·재전송 ID 구분 추가. Pending/Rejected/Failed 및 abort·대체 취소 의미 차이, API 인증 서명과 거래 서명·전파 구분 보강. 공식 명세 검토만 수행했으며 웹훅·취소 실호출 없음. 앱/HTML·180문서 빌드 검증 완료. 이번 커밋에 포함하며 운영 배포 대기.
- 전송 시험 추가: 사용자 지정 주소로 0.01 Sepolia ETH 1회 전송, Transfer `Broadcasted → Confirmed`와 입출금 이력 확인. 수수료 0.000024049820046 ETH, 잔액 0.089975950179954 ETH 대사 일치. API 비교 문서에 요청/응답 발췌·Fireblocks 대응·진행 중 거래 조회 차이 추가. ERC-20·웹훅은 미검증이며 대납은 위 추가 시험에서 확인. 근거는 Git 제외 `_workspace/dfns-api/`의 전송 결과·이력·잔액 JSON.
- API 비교: `WaaS 도입·구축/API 비교/00-fireblocks-dfns-api.md` 신설. Dfns 제공 환경에서 서비스 계정 조회·요청 서명·Sepolia 지갑 생성/재조회·0.1 ETH 잔액 확인 완료. Fireblocks는 공식 Vault API 명세 비교이며 실호출하지 않음. 단위·식별 모델·미제공 available/pending/locked/frozen/블록 정보 차이, verified 확인 필요와 후속 시험 정리. 웹훅은 보류, 가스 대납은 위 추가 시험 반영. 앱/단독 HTML·180문서 빌드 검증 완료. 이번 커밋에 포함하며 운영 배포 대기.
- 사용자 전제 (2026-09-22 **확정**): **Dfns 전체 플랫폼을 고객 AWS 계정에 배치한다. Dfns 는 사내 데이터센터에 두지 않는다.** 노드는 고객 소유이며 운영은 업체에 위탁한다.
  ★ **확정 범위는 Dfns 배치까지다.** DAWBC·DAW-CORE 를 어디에 둘지는 **정해지지 않았다** — 사내에 남을 수도 AWS 로 갈 수도 있다. 문서에서 단정하지 않는다. 이전 표기("사내 데이터센터 … AWS 배치로 변경하지 않음")는 폐기.
  **아직 안 정해진 것** — Baseline 프로필(고객 운영 Vault) vs Enterprise AWS-Native(Vault 없이 Secrets Manager·KMS·IAM). **시크릿 백엔드는 day 0 고정이고 마이그레이션이 없어** 배포 전에 정해야 한다. 가르는 입력은 ① 계약 릴리스가 1.935 이상인가(AWS-Native 최소) ② Vault 를 운영할 인력이 있는가 ③ AWS-Native 의 실제 도입 사례·지원 성숙도.
  반영 완료 — `Dfns/03-baseline-datacenter-design.md` 는 AWS 설계로 정리하고 사내안 308행은 `Dfns/05-datacenter-design-archived.md`(status 아카이브 · ref 참고)로 분리. `Dfns/04-vendor-questions.md` 의 Q01~Q03 을 AWS 전제로 재작성(Q01 프로필 권장·릴리스, Q02 전환 불가 범위, Q03 Keyshares·Vault 배치). **미발송.**

### 2.1d Fireblocks Private Cloud 검토 (2026-09-16)

- 문서: `WaaS 도입·구축/Fireblocks/01-private-cloud-aws-design.md`. 담당자 서면 답변 3회를 배치 기반·구성·책임 분담·런타임 연결·키 위치·노드 운영·go-live로 재구성. 중카테고리는 `Fireblocks PaaS` → `Fireblocks`.
- 확정: AWS 전용(Azure 2028 계획, 베어메탈·on-prem 없음). 모든 컴포넌트가 우리 AWS 테넌트. 키 자료는 MPC·HSM 모두 테넌트 내이며 Fireblocks 보유 셰어 없음. 상시 연결 의존성은 소프트웨어 업데이트 pull(outbound HTTPS·API 키) 하나.
- **Fireblocks 회신 대기** — 시세 데이터·자산 메타데이터 의존성의 정확한 답, shared responsibility matrix, 아키텍처·데이터 플로우 도면, 운영·업데이트 모델, BNYM 규제 자료(NDA). 수령하면 문서의 「출시 전 확인」 체크리스트로 대조.
- **우리 측 숙제** — 요구 사항 노트(체인 목록 포함) 발송, 규제기관 협의 후 Fireblocks 호스팅 노드 수용 여부 회신, MPC 대 HSM 선택 의견.
- 미확인: Private Cloud와 배치 옵션 문서의 Korean Local Instance 관계, Secure Tier 실행 기반·Key Share 배치, AWS 계정 수·자원 수량, 리드타임·예산.

### 2.4 wiki lint — 전 항목 해소 (Stage 222–224)

`python3 scripts/wiki_lint.py` 기준 8 항목 전부 0. 새 stage 마다 실행해 유지한다.

| 항목 | Stage 221 | 현재 |
|---|---|---|
| 6-section 누락 | 14 | 0 |
| Sources 부재 + 본문 주장 | 1 | 0 |
| 단방향 wikilink | 178 | 0 |
| frontmatter (source_count·related·stage) | 37 | 0 |
| Stage orphan | 1 | 0 |

처리 방식: 기계적 drift 는 `--fix` 로 교정 (Stage 223) · user-role 9 장의 절 구성은 페이지를 고치지 않고 schema 변형으로 인정 (Stage 224, CLAUDE.md 5절) · 오탐 5종은 lint 파서 수정.

잔여 (근거 없어 미기입): `stage_introduced` 가 6 장에 없음 (api-key · csr · sso · approver · editor · viewer). git 이력이 squash 돼 있고 본문에 Stage 언급이 없어 유도 불가 — 해당 페이지를 다음에 실제로 손볼 때 채우면 된다.

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
