---
title: 6. 노드인프라 요청 — 적격기관 체크리스트
status: To Do
---

노드인프라/무스비에 요청·확인할 항목의 라이브 체크리스트. 각 항목 옆에 받은 답을 채워가며 쓴다.

국내은행은 적격기관(송신 Institution + Custodian)으로 1차 PoC에 참여한다. **AWS Sandbox**에 국내은행 스택(participant + **노드월렛** + Musubi backend + Postgres)을 띄우고 **DevNet/TestNet**에 연결한다. 노드월렛 SW·배포물·네트워크는 노드인프라/무스비가 준비.

## A. 네트워크/환경
- [ ] **DevNet vs TestNet** — 이번 PoC는 어느 쪽으로?
- [ ] **IP 허용** — 국내은행 AWS Sandbox egress IP allowlist 필요 여부.
- [ ] **배포 지원 범위** — AWS Sandbox 스택을 국내은행이 직접 띄우나, 노드인프라가 배포 지원/대행하나.
- [ ] **노드월렛 SW** — 배포물·라이선스·AWS Sandbox 구동 요구사양. (기능 상세는 4장)
  - [ ] **Canton 지원(핵심)** — 노드월렛이 Canton을 지원하는지(공개 문서는 Solana뿐).
- [ ] **수수료 처리** — 4-leg 정산 트래픽(Canton Coin)을 누가 부담하나(테스트넷은 테스트 CC), 무스비 프로토콜 수수료 유무.

## B. 프로비저닝(자격증명) — 무스비 발급
- [ ] **Canton Party ID** — 국내은행 정산 네트워크 신원.
- [ ] **JWT signing credentials** — API 인증용.
- [ ] **정산 네트워크 endpoint + TLS(mTLS) 인증서** — 무스비 발급, 연결용.
- [ ] **국내은행에 부여되는 role** — `institution` + `custodian`(권한이 role로 갈리니 두 역할 겸하는지 확인). 수신측은 누구 role로.

## C. 소프트웨어/패키지
AWS Sandbox에 띄울 국내은행 스택 구성요소(노드월렛 SW는 A절).
- [ ] **배포물** — Musubi Backend·Canton Participant 도커 이미지/레지스트리/버전·요구사양·설정(env/config).
- [ ] **DAML 배포** — `FXOrder` 등 정산 패키지(DAR)가 우리 participant에 **어떻게 배포되나**: 누가 업로드·일치시키나(우리 vs 노드인프라/무스비), 버전·업그레이드 절차.
- [ ] **DAML 검증용 공유** — 적격기관 DAML 검증(→ 3장 4절)용 `FXOrder` 소스(최소 DAR)+패키지 ID·raw Ledger 접근 가능 여부.
- [ ] **Console 접근** — Console 계정.

## D. 자산/인스트루먼트
- [ ] **KRWK 인스트루먼트** — 라이브는 JPYSC인데, PoC용 **KRWK는 누가/어떻게 발행**하나. 테스트 발행자/레지스트리.
- [ ] **상대 통화** — JPYSC로 시연.

## E. 인프라/배포 (AWS Sandbox)
- [ ] **권장 배포 구성(footprint)** — participant + 노드월렛 + Musubi backend + Postgres의 인스턴스 사양·OS·리소스.
- [ ] **배포 자료** — AWS용 배포 가이드/Terraform/Compose 등 제공 여부.
- [ ] **아웃바운드 연결 요구** — 어떤 호스트/포트로 나가야 하나(Synchronizer·무스비 endpoint).

## F. 운영/검증
- [ ] **연결 테스트 절차** — `/health`, `/whoami`, 테스트 order 생성 등.
- [ ] **모니터링** — `GET /api/v1/dashboard/stats`(상태별 order·정산량) 등 대시보드.
- [ ] **검증 지원** — 실패 주입(롤백 확인)·프라이버시 조회 등 3장 항목 검증에 필요한 접근/도구.

## 우선순위 (먼저 받아야 진행되는 것)
1. **A(환경·온보딩·노드월렛) + B(프로비저닝)** — AWS Sandbox에서 스택을 띄워 연결하는 데 필수.
2. **C(소프트웨어·패키지) + E(배포 자료)** — 실제 기동.
3. **D(KRWK·통화)** — 정산·검증 시나리오 실행.
4. **F(검증·운영)** — 마무리·합격 판정.
