<!--
source_url: https://docs.canton.network/ (renewed site, successor to docs.digitalasset.com)
fetched_at: 2026-06-10
status: full (WebFetch — Canton/DAML 1차 기술 문서 리뉴얼본)
priority: TIER1
domain: canton-network / ledger-model / ordering / traffic / external-party / recovery
-->

# Canton Network Docs (리뉴얼) — docs.canton.network (Mode C 근거 캡처)

> `docs.canton.network` 는 `docs.digitalasset.com` 의 **후속 사이트**다(llms.txt 확인). 6 top-level
> 섹션(Overview / App Development / Global Synchronizer / Integrations / SDKs and Tools / API
> Reference). 본 캡처는 기존 v3.4 ingest 가 abstract 하게만 잡았던 **ordering(BFT)·traffic 구체
> 수치·external party 서명 모델·disaster recovery** 를 1차 출처로 정밀화한다. 버전 수치는 페이지에
> 표기 없음.

## (1) Ordering & Consensus — BFT orderer (Q-C01 메커니즘 보강)

source: https://docs.canton.network/overview/reference/ordering-consensus.md

- **2-layer 합의**: ordering layer(synchronizer)가 암호화 메시지의 글로벌 순서를 정하고, smart
  contract layer(participant)가 트랜잭션 정합성을 검증.
- **Sequencer**: authenticated·timestamped multicast + total ordering. payload 접근 없이 암호화
  메시지 라우팅, 단조 증가 timestamp 부여, 전달 전 sender identity 제거.
- **Mediator**: participant 의 confirmation(approve/reject) 집계 → verdict(commit/reject) 발행,
  sequencer 가 재배포. 2-phase commit.
- **2-phase 흐름**: ① Sequencer 가 암호화된 transaction view 를 관련 participant 에 배포 →
  ② participant 가 검증 후 confirmation 을 sequencer 통해 mediator 로 → ③ Mediator 가 응답 집계해
  verdict(commit/reject) → ④ Sequencer 가 verdict 를 관련 party 에 배포.
- **native BFT ordering service**: ISS(parallel leader-based replication) + Narwhal(데이터 전파와
  ordering 분리)에서 영향. **4-모듈 파이프라인 `Mempool → Availability → Consensus → Output`**.
  **simultaneous Byzantine fault 가 1/3 미만이면 동작**(tolerates fewer than one-third).
- **finality 시간 수치(Q-C01)**: 리뉴얼본에도 **latency/finality/throughput 구체 수치 명시 없음**.
  → 메커니즘(BFT 2-phase commit)만 확정, 절대 수치는 여전히 1차 미확정.

## (2) Token Standard — CIP-0056 (전송/holding 정밀화)

source: https://docs.canton.network/appdev/deep-dives/token-standard.md
       + https://docs.canton.network/overview/reference/cip-0056.md

- 전송 = `TransferInstruction` interface. ① factory 가 transfer instruction 생성 → ② 수신자가
  Accept / Reject, 또는 송신자가 Withdraw. "allows implementation of Direct Peer-to-Peer / Free
  of Payment (FOP) Transfers".
- 3 선택지: **Accept**(완료) / **Reject**(거절) / **Withdraw**(송신자가 pending 회수). (참고:
  Allocation 계열의 Reject/Withdraw 는 empty choice context 로 호출.)
- **Holding = `Holding` interface 구현 active contract = Canton 의 UTXO 등가물**. "Active `Holding`
  contracts incur both storage and compute cost" → **지갑당 약 10 UTXO 유지 권장**.
- **CIP-0056** = token standard API 의 기반 명세.
- **신규 인터페이스**: `TransferFactory`, `AllocationFactory`, `BatchMergeUtility`,
  `MergeDelegation`.
- 단, 리뉴얼 페이지는 "2-step 이 모든 토큰의 기본값" 을 **명시적으로 단정하지는 않음**(구현 옵션으로
  서술). 기존 v3.4 캡처의 "default for all tokens" 진술과 함께 보되, 신규 페이지 기준으론 "옵션" 톤.

## (3) Traffic — 수수료 구체 수치 (Q-C02 재확정)

source: https://docs.canton.network/global-synchronizer/deployment/synchronizer-traffic.md

- **메시지 traffic cost = `Message size × (1 + recipients × readVsWriteScalingFactor/10000)`**.
  - 예: factor 4, 1 MB, 10 recipients → `1,000,000 × (1 + 10 × 0.004) = 1,040,000` byte 가 송신
    participant traffic 잔고에서 차감.
- **현재 파라미터(all networks)**:
  - **무료 base rate**: **400,000 byte / 20분 window**, 비활동 시 선형 회복.
  - **추가 traffic 가격**: **$60 USD / MB** (현재 환율로 Canton Coin 청구).
  - **read-vs-write scaling factor**: **4 basis points (0.004)**.
  - **최소 top-up**: **200,000 byte**.
  - free tier 는 무제출 `burstWindow`(1,200,000 microseconds) 1회 경과 후 완전 회복.
- **충전**: Canton Coin 소비로 구매, on-ledger `MemberTraffic` contract 갱신. validator 앱에
  **built-in top-up automation**(target throughput·최소 구매 간격 설정 기반 자동 구매).
- ⚠️ 기존 published "10분 mining round 무료 trickle" → 리뉴얼 1차 문서는 **"400,000 byte / 20분
  window"**. published 정정 대상.

## (4) External Party — 외부 서명 신원 (수탁 핵심)

source: https://docs.canton.network/overview/reference/external-party.md

- **external party** = "submission key holder, with no SPN, and with its own unique namespace,
  controlled by its own signing key". local party 는 topology 관리를 host node 에 위임하는 것과 대비.
- 차이 표:
  - Submission Nodes: external = 없음 / local = 최소 1.
  - Namespace: external = 자체 통제 / local = SPN 과 공유.
  - Confirmation Nodes: external = 최소 1 / local = 임의 수.
- **external signing 2-step**: ① **Preparing Participant Node** 가 Ledger API command 를 Daml
  transaction 으로 변환 → ② **Executing Participant Node** 가 party 서명을 붙여 전달. party 는
  "a hash of the transaction tree that accurately represents all ledger effects" 를 명시 서명.
- **키 통제**: "associated private signing keys are only controlled and usable by the party. The
  party is responsible for managing and maintaining their private keys." participant node 는 "cannot
  act on the ledger without the party's explicit approval" → participant 의 규제 부담 제거.
- 수탁 매핑: MPC/HSM 가 party 키를 보유하고 participant 가 키 없이 준비/실행만 하는 구조와 정합.
  (Fireblocks Canton 복구 절차의 Raw Signing / EdDSA 와 일치 — fireblocks-recover-canton-coin)

## (5) Validator Disaster Recovery — 1차 출처

source: https://docs.canton.network/global-synchronizer/production-operations/validator-disaster-recovery.md

- **3 복구 경로**: ① 단일 노드 장애 = DB 백업 복원 / ② 광범위 장애 = identities backup 으로
  재온보딩해 잔액 복구 / ③ synchronizer 장애 = roll-forward logical synchronizer upgrade(`perform_manual_lsu()`).
- **전제**(최소 하나): 최근 DB 백업(<30일) OR 현재 identities backup OR external KMS 가 validator
  키 보유. "A recovery of assets is only possible if at least one of the following holds".
- **identities 재온보딩**: 원래 namespace key 를 통제하는 새 validator 배포 → Canton Coin 잔액 +
  CNS entry 복구. **party id hint 보존 필수**(새 onboarding secret = 오설정 신호), participant id
  는 완전히 새 것. "preserves all party IDs and all contracts shared with the DSO party".
- **external party 복구는 기본 미포함** — "Parties relying on external signing require separate
  procedures": 완전히 새 validator(clean identity+DB) 배포 → topology tx 생성·external 서명으로
  party host → **CC Scan endpoint 에서 ACS import** → 표준 API 로 onboarding.
- **ACS commitment mismatch 트러블슈팅**: 모든 party 가 같은 participant 에 있는지 확인 →
  남은 party 는 topology proposal 로 마이그레이션 → synchronizer disconnect → ACS snapshot import →
  reconnect.

## Source

Canton Network 공식 docs (리뉴얼) — <https://docs.canton.network/> · 진입 <https://docs.canton.network/llms.txt>
(docs.digitalasset.com 후속)

---

# 추가 확인 (2026-06-10, 4 페이지 + wallet guidance) — Stage 54

> 사용자 지정 4 페이지(what-is-canton · choose-your-path · global-synchronizer/understand/overview ·
> integrations/overview) 대조 + integrations/overview 가 안내한 **integrations/wallet/guidance** 추가
> fetch. 핵심: **finality 수치 1차 출처 확보(C01 ANSWERED)** + 수탁 통합 구체 요건.

## (6) Global Synchronizer — 2/3 BFT · Super Validator · 거버넌스

source: https://docs.canton.network/global-synchronizer/understand/overview.md
       + https://docs.canton.network/overview/understand/what-is-canton.md

- Global Synchronizer = "a decentrally operated service, using a **2/3 majority Byzantine Fault
  Tolerant (BFT) consensus protocol**" — sovereign blockchain 간 atomic 트랜잭션, 프라이버시 보존.
  (우리 기존 "<1/3 fault 허용" 과 동치 — BFT 정의상 2/3 honest majority = f<n/3.)
- **Super Validator**: Global Synchronizer infra 운영, **트랜잭션 sequencing**, Canton Coin tx 검증,
  거버넌스 참여. **Validator**: tx 검증·활동 기록, 사용자/앱 연결, 업그레이드 조정.
- **거버넌스**: Global Synchronizer Foundation(GSF) + **Linux Foundation** 파트너십, SV 운영 투명성.
- **node 역할(what-is-canton)**: Synchronizer = "coordinate consensus without storing state",
  participant node(validator) = "receive and store only the data relevant to their hosted parties".
  "Horizontal scalability: Add nodes to scale, without global state replication". finality/throughput
  수치는 이 두 페이지엔 없음(아래 wallet guidance 에서 확보).

## (7) Canton Coin — burn-mint equilibrium (tokenomics)

source: https://docs.canton.network/global-synchronizer/understand/overview.md

- **Burn**: 수수료(USD 표시·Canton Coin 으로 지불)는 **유통에서 제거(burn)** — 중앙 주체로 가지 않음.
- **Mint 보상**: validator·super validator 가 infra 운영·앱 서비스·사용량·liveness 인센티브로 CC 획득.
- **동적 균형**: 공급과 소각이 시간에 따라 균형 → 환율을 network intrinsic value 근처로 안정.
- → 우리 page3 "Canton Coin 소각 = traffic 충전 = 수수료" 모델 정면 확정(소각 = circulation 제거).

## (8) Developer paths — EVM 개발자 경로 존재

source: https://docs.canton.network/appdev/get-started/choose-your-path.md

- 4 학습 경로 중 하나가 **"Ethereum/Solidity 개발자 → Canton 의 privacy/authorization 모델 매핑"**.
  → 우리 docs-site 의 EVM-대비 서술 방식이 공식 권장 접근과 일치.

## (9) Integrations overview — 수탁 안내 포인터

source: https://docs.canton.network/integrations/overview.md

- wallets·exchanges·token standard 대상. 명시 표준 = **CIP-0056**(GSF cips repo).
- "Balances are private — wallets show holdings only to entitled parties, not the public."
- 수탁 구체 요건은 **/integrations/wallet/guidance** 로 안내 → (10).

## (10) Wallet Integration Guidance — 수탁 핵심 (대량)

source: https://docs.canton.network/integrations/wallet/guidance.md

- **finality (C01 ANSWERED)**: 페이지에 문자 그대로 **"Finality usually takes 3-10s."** 존재.
  (verbatim 재확인 — WebFetch 요약 주입 아님. 그간 "검색 요약 only" 격리 해제.) 멱등: "you are
  guaranteed some response, and you can keep retrying; signed transactions are idempotent."
- **API (concrete)**:
  - tx: `/v2/interactive-submission/prepare` + `/v2/interactive-submission/execute`.
  - ACS/UTXO 조회: `/v2/state/active-contracts` (Wallet SDK `sdk.ledger.acsReader.read()`).
  - offset: `/v2/state/ledger-end` — prepare 전 호출, contract id 를 prepare 동안 pin.
- **Party (수탁)**:
  - `sdk.party.external.create(publicKey, {partyHint})`. 형식 `name::fingerprint`, **max 185 chars**
    `[a-zA-Z0-9:-_]`.
  - **"For custodians, it's suggested aiming for one Party per account/wallet"**.
  - **"Avoid ephemeral party creation"** — allocation 비용 있음, **deposit 마다 party 만들지 말고**
    account 당 stable party.
  - backup/redundancy 위해 **여러 validator 에 party multi-host**(confirmed participant endpoint).
  - topology tx: `PartyToParticipant`, `ParticipantToParty`, `KeyToParty`.
- **Token standard**: CIP-0056 필수. CC(preinstalled) + USDCx(Digital Asset Registry). transfer =
  prepare(`sdk.ledger.prepare()`) → sign(`signTransactionHash(hash, privateKey)`) → execute.
- **입금 관찰**: ledger event 의 **"TransferIn"** 감시(pending vs completed). pre-approval 켜져 있으면
  auto-accept, 아니면 수동 accept/reject.
- **2-step**: pre-approval 없으면 송신자가 **locked UTXO 생성("owned by sender, locked by DSO")**,
  수신자가 `TransferInstruction_Accept` 로 수락 / `TransferInstruction_Reject` 로 반환. pre-approval:
  단일 tx 즉시 완료, `sdk.amulet.featuredApp.grant()` 로 auto-accept.
- **UTXO 관리**: self-transfer 로 split, change UTXO 최소화. `sdk.token.transfer.create({inputUtxos:[...]})`.
- **입금 식별 = memo tag(주소 아님)**: deposit 은 별도 입금주소가 아니라 transfer metadata 의 memo 로
  추적 — `"meta":{"values":{"splice.lfdecentralizedtrust.org/reason":"memo-ref"}}`. "allows deposits
  to be sent to exchanges" without separate deposit addresses. (XRP/XLM destination-tag 류 모델.)
- **Scan/registry endpoint**: `/registry/metadata/v1/info`(admin party id) ·
  `/registry/metadata/v1/instruments`(instrument id) ·
  `/registry/transfer-instruction/v1/transfer-factory`(factory + choice context).
- **운영**: DevNet/TestNet/MainNet **3 환경** 운영(업그레이드 테스트). 로컬은 `/v2/state/ledger-end`,
  파트너 대사는 synchronizer `recordTime`. prepare 응답을 서명 전 독립적으로 hash 재계산해 검증.
  멱등 retry 는 submission ID dedup.
