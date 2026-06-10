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
