<!--
source_url: https://musubinetwork.com/ (Custodian/Institution Track + 비교 페이지)
fetched_at: 2026-06-10
status: full (WebFetch — Musubi 수탁 트랙 검토)
priority: TIER1 (단 2차 출처 — Canton 위 application, testnet POC)
domain: canton-network / custody / settlement
-->

# Musubi Custodian Track — 검토 (Canton 위 실제 수탁 구현 사례)

> ⚠️ **출처 성격**: Musubi 는 Canton 위에 올라간 **application**(한·일 cross-border FX), 현재 **testnet POC**.
> 따라서 아래는 "Canton 프로토콜 사실" 이 아니라 **"한 실제 수탁 구현이 Canton 을 어떻게 쓰는가"** 다.
> Canton-레벨 fact(예: allowance 패턴 부재, named-role 서명)는 본 위키 canton-network entity 로,
> Musubi 고유 설계(4-leg FX DvP·FXOrder·1h JWT 등)는 사례로만 인용.

## (1) Startale·Nodeinfra 역할 — 미상 재확인

source: musubinetwork.com/introduction · llms.txt

- 공식 문구는 단 하나: **"Built on Canton, and operated by Startale and Nodeinfra."** 두 사업자가
  **무엇을**(Canton validator? synchronizer? 네트워크 운영?) 운영하는지 **명시 없음**. → Nodeinfra 를
  "Canton 관리형 validator 제공사" 로 단정 불가(Stage 64 정정 타당성 재확인).

## (2) Canton-레벨 fact (Musubi 가 corroborate — 본 위키 promote 대상)

source: custodian/security · custodian/settlement-and-safekeeping · custodian/authorization-workflow

- **allowance/approve 패턴 없음** — "Holding contract where you're the sole signatory", "Only you (sole
  signatory) — no allowance/approval pattern". 즉 Canton holding 은 **소유자가 sole signatory** 이고
  ERC-20 식 approve/allowance(제3자에 사용권 위임)가 없다 → infinite-approval 류 공격면 부재. (Canton fact)
- **named-role 서명 (interchangeable threshold 아님)** — "Your Party ID key is the co-signer key …
  analogous to a multisig key, but with **DAML choice-level granularity**". "unlike EVM multisig where
  signers are interchangeable, your Canton Party ID is a **named role** — the settlement protocol
  requires specifically *your* signature." (Canton fact: 서명자가 익명 n-of-m 이 아니라 지정 party)
- **순차 rolling approval (동시 집계 아님)** — "each party signs sequentially through **DAML choice
  exercise** rather than simultaneous on-chain signature aggregation". maker-checker/four-eyes 를
  **암호학적으로** 강제(절차가 아니라 contract 서명). (Canton fact: 다자 승인 = 순차 choice exercise)
- **키·백엔드·DB 완전 분리 자가보유** — custodian 이 signing key·backend·database 모두 보유, 타 참여자
  접근 불가, 통신은 settlement 프로토콜만. → external party 자가 custody 와 정합(canton-network entity).

## (3) Musubi 고유 설계 (사례로만 — promote 본문 아님)

- 4-leg atomic DvP(Network Operator + Sender Custodian + Market Maker + Receiver Custodian 4자 co-sign),
  **quoting 중 escrow/lock 없음**, partial settlement 없음(전부 roll back). FXOrder, intent_id/
  transaction_hash/settled_at 매칭. JWT(canton_party_id claim, role custodian, 1h).
- **delegated custody** 모델 — institution 이 custodian(예: **Zodia Custody, KODA** 거론)에 위임,
  **Musubi 는 자산 미보유**(CLS Bank 처럼 settlement 조율만). maker-checker(institution=quote 선택,
  custodian=자금 이동 authorize) 암호학적 강제.

## (4) Why Canton / Ethereum 비교 (우리 EVM-대비·프라이버시 framing 확인)

source: why-canton · ethereum-comparison

- 선택 이유: ① 컴플라이언스-as-precondition(`ExecuteSettlement` 이 attestation 전부 검증 후에야 DvP 발사,
  미충족 시 abort) ② 암호학적 dual-control(우회 불가) ③ **sub-transaction privacy 로 PII 온원장**
  (beneficiary VASP 는 IVMS 101 보고, market maker 는 신원 못 봄) ④ 단일 contract 에 KYC+settlement
  묶여 non-repudiation ⑤ permissioned.
- **finality 시간 수치 없음** — Musubi 도 명시 안 함("makes no claims about finality time"). C01 재확인.
- 거론된 실제 Canton 배포(2차 인용): Digital Asset×DTCC · Goldman Sachs · HSBC · Deutsche Börse · Progmat.
- EVM 대비 재확인: Ethereum 은 compliance 무관하게 Transfer 발사·PII 온체인 불가·permissionless;
  Canton 은 compliance precondition·PII 온원장(privacy)·permissioned.

## Source

Musubi Network docs — <https://musubinetwork.com/> (Custodian/Institution Track, why-canton, ethereum-comparison)

## (5) Musubi 나머지 페이지 sweep — 범위 밖 확정 (Stage 65 검증)

source: how-it-works · compliance/privacy · compliance/trust-model · glossary · tradfi-comparison (+ 미fetch: API Reference·Console·Deploy·Onboard·Market Maker track·FXOrder·compliance/reporting/licensing 등)

- 위 5개(Canton 개념을 다룰 법한 후보) 검증 결과 **전부 Musubi-FX 앱 고유, 새 Canton 레벨 fact 없음**:
  - how-it-works = Musubi FX 흐름만. privacy = 앱 가시성 정책(Canton view/divulgence 메커니즘 서술 없음). trust-model = 4자 서명·dual-control(앱; Canton validator/synchronizer 신뢰 미언급). glossary = DvP 외 Canton 네이티브 용어 없음. tradfi-comparison = CLS vs Musbi 상품 비교.
  - tradfi-comparison 의 "~4-second atomic DvP" 는 **Musbi 앱 결제 주장**(app-level) — Canton finality 수치로 promote 안 함(evidence isolation; C01 은 여전히 1차 출처 "usually 3-10s" 만).
- **결론**: Musubi 에서 Canton 위키로 promote 할 사실은 Stage 65 ((2)·(4))에서 전부 반영 완료. 나머지 ~30 페이지(앱 API/console/deploy/market-maker/FXOrder/compliance-reporting)는 Canton 프로토콜 사실이 아니라 **범위 밖**(canton.network 자동생성 ref 와 동일 처리). **Musubi sweep 종료.**

## (6) introduction 페이지의 모든 링크 — 전수 검토 (Stage 66)

source: musubinetwork.com/introduction 의 outbound 링크 4개 — compliance/compliant-payments · institution/overview · custodian/overview · market-maker/overview

- **새 Canton 프로토콜 사실 없음** — 4개 모두 Stage 65 promote 분(holding sole-signatory·no-allowance, sub-tx privacy, named-role) 재확인 또는 Musubi-FX 앱 고유. 아래는 사례 기록용(앱-레벨).
- **참여자 역할(institution/overview)**: Sender Institution(견적 선택)·Receiver Institution(수동 수신). "CLS-style PvP, ~15초, Herstatt risk 제거, nostro/vostro 불필요". custodian 이 stablecoin 직접 보유.
- **custodian 통합 3 seam(custodian/overview)**: ① **Canton Party ID 로 Musubi custodian 백엔드를 자기 인프라에 배포**(Canton participant) ② 견적 검토·co-sign 을 ops UI 에 연결 ③ **settlement event stream 구독 → tx hash 를 컴플라이언스 아카이브로 bridge**. KYC·제재·Travel Rule·STR·whitelisting 은 기존 그대로. Receiver custodian 은 입금이 **pending 아니라 atomic DvP 로 이미 settled** 도착. ("Canton Holding sole-signatory·no allowance" = pure Canton infra 재확인)
- **market-maker/overview**: MM 은 **재고를 자기 Canton Holding 에 보유**(거래소 예치 안 함), RFQ·익명 flow·USDCx↔JPYSC0. "atomic 4-leg DvP ~4초"(앱 결제 주장; Canton finality 로 promote 안 함 — C01 은 1차 3-10s 유지).
- **compliant-payments**: 5 design choice(custodian stack·on-chain enforcement·Travel Rule discharge·규제 dossier·stablecoin-only) + Japan/Korea/FATF — Musubi-FX 컴플라이언스 정책(앱).
- **결론**: introduction 링크 전수 검토 완료. Canton 위키 promote 분은 Stage 65 에서 종결됨을 재확인. 본 절은 Musubi 사례 기록.
