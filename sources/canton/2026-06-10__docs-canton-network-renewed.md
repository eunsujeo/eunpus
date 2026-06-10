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

## (11) Architecture (overview/learn/architecture) — 검증 + 소량 신규 — Stage 55

source: https://docs.canton.network/overview/learn/architecture.md

- 대부분 기존 promote 와 중복(participant=validator·Sequencer/Mediator·party·Daml·local 원장·
  coordination vs storage 분리 모두 재확인). 신규 2건만:
- **프라이버시 작동 방식 = sub-transaction "views"**: "Transaction is decomposed into **views**, each
  party sees only their view". Synchronizer 는 내용을 복호화하지 않고 암호화 메시지만 순환 — 우리가
  담았던 "당사자만 본다" 결론의 *메커니즘*. party = "Canton's on-ledger identities, analogous to
  addresses or externally owned accounts".
- **Synchronizer 토폴로지 옵션**: single synchronizer / multiple synchronizers / global synchronizer
  구성 모두 지원(우리는 global synchronizer 만 다뤘음).
- finality/throughput 수치: 이 페이지에도 없음(일관).

## (12) 6 페이지 추가 검증 (core-concepts·how-transactions-work·cryptographic-keys·console·gs-intro·validator-roles) — Stage 56

source: docs.canton.network/overview/understand/core-concepts · overview/learn/how-transactions-work
       · overview/learn/cryptographic-keys · global-synchronizer/canton-console/console-overview
       · global-synchronizer/understand/introduction · global-synchronizer/understand/validator-roles

- 대부분 기존 promote 와 중복(party·validator·synchronizer·Sequencer/Mediator·ACS·SV/Validator 분담·
  views+2PC·CC 수수료 재확인). finality 수치 6페이지 모두 없음(일관). 모순 없음. 신규만:
- **A. 암호키 모델** (cryptographic-keys):
  - **namespace root key** = public signing key, namespace = root key 의 hash. private 으로 topology
    tx 권한.
  - **node signing key** — sequencer client/server 인증, tx 프로토콜 메시지 인증, ACS commitment 서명.
    저장 = DB / offline / KMS.
  - **encryption key** — participant 의 asymmetric encryption key. 큰 데이터는 symmetric, session
    key 는 asymmetric(session encryption key 로 비용 절감).
  - **external party signing key** — submitting party 가 직접 tx authorize. **권장 저장 = "offline"**.
  - 저장 옵션 전반: plaintext(DB/file) / in-memory / offline / KMS(envelope) / full KMS.
  - (이 페이지엔 Ed25519/ECDSA 등 알고리즘명 없음 — EdDSA 는 fireblocks-recover-canton-coin 근거로만.)
- **B. 원장 모델 보강** (core-concepts):
  - **stakeholder = signatories + observers** — contract 를 볼 수 있는 모든 party.
  - **choice = Consuming(행사 시 contract archive) / Non-consuming(유지)**.
  - contract(template instance)는 immutable — created 또는 archived 만.
- **C. 운영 구체치** (gs-introduction · validator-roles):
  - 환경 **4단계: LocalNet(개발) → DevNet → TestNet → MainNet**. DevNet secret 은 API 로 취득,
    **1시간** 유효. TestNet/MainNet 은 sponsor 가 수동 제공.
  - validator SLA: **99%+ 가용성**, 보안 패치 **1주 내**, 마이너 업데이트 **2주 내**, DB·identity 정기
    백업, party 키 보관·rotation.
  - GSF = "non-profit foundation that governs the Global Synchronizer".
- **D. Canton Console** (console-overview): participant/sequencer/mediator 프로세스에 직접 붙는
  **운영자 CLI**(debugging·disaster recovery·repair). `enable-preview/testing/repair-commands` 플래그.
  런타임 Ledger API 와 별개 — 5장 복구 절차가 도는 도구.

## (13) 운영 batch (key-management·kms-operations·party-management·multi-sig·node-backup-restore·exchanges/guidance) — Stage 58

source: global-synchronizer/production-operations/{key-management,kms-operations,party-management,multi-sig,node-backup-restore} · integrations/exchanges/guidance

- **키 계층 (key-management)**: 4종(signing·encryption·**namespace**·session). **root-intermediate 계층** — root namespace key 는 primary identity, **offline/air-gap 또는 KMS 격리 가능**(`init.identity.type=manual`, `scripts/offline-root-key`); intermediate key 는 노드에서 topology authorize, root 없이 rotation. **delegation restriction** 으로 intermediate key 가 서명 가능한 topology mapping 종류 제한(blast-radius↓). signing key usage = Namespace/SequencerAuthentication/Protocol(생성 시 고정·immutable). rotation = 신규 활성→구 비활성, namespace 제외, backup 과 interleave. session key: enc 10s·sign(KMS) 5min.
- **KMS (kms-operations)**: 프로바이더 **AWS KMS · GCP KMS · Driver(커스텀 KMS/HSM)**. AWS/GCP 는 Enterprise Edition. 2 모드: **envelope**(Canton 이 키 생성, KMS 가 at-rest wrapper 로만 보호, DB 에 암호화 저장) vs **full KMS**(`crypto.provider=kms`, 키 생성·저장 전부 KMS, **Canton 이 raw private key 를 못 봄**). rotation rotate_wrapper_key()/rotate_kms_node_key().
- **party-management**: allocate(`parties.allocate()`/`enable()`). **PartyToParticipant permission = Submission/Confirmation/Observation**. replication 2종: simple(미거래 party, 양측 PartyToParticipant 상호 authorize) vs **offline**(거래 이력 있으면 ACS export→disconnect→import→reconnect = 복구 흐름). decentralized party = PartyToKey + DecentralizedNamespaceDefinition. cmd: export/import_party_acs, clear_party_onboarding_flag.
- **multi-sig (수탁 quorum)**: 3 층 — ① decentralized namespace(N keys, threshold T≤N) ② multi-hosted party confirmation threshold(>1) ③ **external multi-sig: PartyToParticipant 에 Protocol Signing Keys 목록 + threshold(예 3 of 5), submitting node 가 서명 모아 threshold 충족 시 제출**. → Fireblocks TAP/quorum 류 n-of-m 승인과 매핑.
- **node-backup-restore**: DB(Postgres/Oracle, 키 포함) 백업. **순서: mediator/participant 를 synchronizer 보다 먼저**(아니면 ForkHappened 재연결 불가), app state 는 participant 보다 먼저. 복구 후 caveat: command dedup 불완전(synchronizer timestamp > stop+tolerance 까지 재제출 위험), app state reset, local config(연결·user·party replication) 수동 재적용. **synchronous replication 강력 권장**(offsite, failover 무손실).
- **exchanges/guidance**: batch1 exchange-integration 과 대부분 중복 확정(<100 UTXO·memo·treasuryParty·TransferFactory_Transfer·trecTgt·/v2/updates/flats). 신규: integration DB 가 latest update-id/recordTime/offset/synchronizerId·pending/완료 withdrawal·reserved UTXO·customer-holding 매핑·registry URL 보관. 1-step 파싱 = `meta.splice.lfdecentralizedtrust.org/tx-kind:"transfer"`.

## (14) 개념 batch (ledger-model·privacy-model·trust-model·two-layer-consensus·topology·transaction-lifecycle) — Stage 59

source: overview/learn/{ledger-model,privacy-model,trust-model,two-layer-consensus} · overview/reference/{topology,transaction-lifecycle}

- **ledger-model**: Canton = **eUTXO**(extended UTXO). contract: tx 로 created·immutable·고유 contract ID·archive 까지 존속. action = **Create/Exercise/Fetch**. **stakeholder 3역할 정정**: **signatory**(생성 authorize·항상 가시) / **observer**(가시·choice 행사 불가) / **controller**(자신이 통제하는 choice 행사·그 결과 가시). consuming/non-consuming choice. contract key 는 3.5 개발 중. ledger time = synchronizer 부여·monotonic.
- **privacy-model**: views 확정. 3자 체인 예: Alice→Bob→Charlie 에서 Alice 는 Charlie·Bob→Charlie 결제 못 봄, Charlie 는 Alice 못 봄. ⚠️ **divulgence**: tx 에서 contract 를 fetch 하면 그 tx 당사자에게 observer 아니어도 자동 노출 — 의도치 않은 정보 누출 주의. synchronizer 는 암호화 메시지·confirmation 결과만.
- **trust-model (자가호스팅 판단 직결)**: **selective trust**("누구를 무엇 때문에 믿는가"). 5 도메인 — ① validator(데이터 보관·가용성; **external party 면 서명은 안 믿음**; 자가호스팅 시 이 신뢰 제거) ② counterparty(원장 무결성은 안 믿어도 됨 — 내 validator 정직하면 상대가 invalid tx 확정 불가) ③ synchronizer(내용 못 읽음·위조 못함·invalid 승인 못함; **delay 는 가능**, 가용성은 신뢰 필요; BFT 2/3 honest) ④ app provider ⑤ governance. **자가호스팅 = validator 신뢰 제거, synchronizer 신뢰는 BFT/multi-sync 로 완화**.
- **two-layer-consensus**: Stage 55 와 동일 확정. sequencer BFT "up to 1/3 Byzantine". mediator 가 ordering-layer 워크플로 안에서 동작.
- **topology**: key-value map(tx 1개가 key 1개 변경), 결정적 state machine replication. 매핑(정정·확장): **PartyToParticipant**(perm Observation/Confirmation/Submission) · **OwnerToKeyMapping**(노드 키) · **PartyToKey**(decentralized party 직접 서명) · **NamespaceDelegation**(restriction: CanSignAllMappings/CanSignAllButNamespaceDelegations/CanSignSpecificMappings) · VettedPackages · SynchronizerTrustCertificate · Sequencer/MediatorSynchronizerState. serial 번호(+1, replay 방지), effective time t+ε(topology change delay). (기존 "ParticipantToParty/KeyToParty" 는 부정확 → 위로 정정)
- **transaction-lifecycle**: **5-phase**(Preparation→Submission→Sequencing/Distribution→Validation/Confirmation→Aggregation/Commit). root hash·informee message. **decisionTimeout**(mediator 결정 deadline, 미충족 시 reject). "어떤 노드도 전체 tx 를 평문으로 못 봄".

## (15) 개념/토큰 batch (reassignment·pruning·canton-name-service·rewards-minting·validator-liveness·tokenomics-of-gs) — Stage 60

source: overview/reference/{reassignment-protocol,pruning,canton-name-service,tokenomics-of-gs} · global-synchronizer/splice-fundamentals/{rewards-minting,validator-liveness}

- **reassignment-protocol**: contract 를 synchronizer 간 이동(unassign→assign, 양쪽 연결·동일 stakeholder host). **단일 synchronizer 수탁 지갑엔 비적용**(scope-out) — multi-synchronizer 조정 문제.
- **pruning (심화)**: participant 는 과거 tx 데이터 prune(active contract 는 절대 prune 안 함), command-dedup 은 window(`ledger-api.max-deduplication-duration`) 밖만. sequencer/mediator 는 메시지·verdict prune, **BFT orderer 기본 30일 retention**. prune 안 되는 것: active contract·in-flight reassignment·private key·DAR/package. **PQS(Participant Query Store)** = distilled 장기 보관소(노드 pruning 과 별개). **ACS commitment** = counter-participant 와 active contract 의 암호서명 요약을 주기 교환(2-level homomorphic hash, fork 탐지·non-repudiation) — 모든 counter-participant 의 matching commitment 받아야 그 시점 prune. → wallet 자체 영속화 필요 재확인.
- **canton-name-service (CNS)**: 사람이 읽는 이름 → party id(DNS/ENS 류). `<name>.unverified.cns`("unverified"=신원검증 안 함), DSO governed Daml contract. 등록 = POST `/v0/entry/create` → AnsEntryContext+SubscriptionRequest → wallet 수락 → CC 결제 → AnsEntry. fee·lifetime = AnsRulesConfig, **결제 CC 는 DSO 로 가 소각**, 만료·갱신. wallet 은 Scan API 로 이름 표시·이름으로 송금.
- **tokenomics-of-gs (구체 수치)**: burn-mint 확정. **라운드 10분 기본 → 연 ~52,560 라운드**. 라운드마다 **dev fund 5%** 선차감 후 validatorRewardPercentage/appRewardPercentage/SV(나머지·weight 비례) 배분, unclaimed 는 cascade(validator activity→liveness faucet). 수수료 USD 표시·CC 소각 결제, **CC-USD rate = 라운드별 SV 게시율의 median**. **per-validator liveness faucet cap 기본 $2.85 USD/라운드**. traffic readVsWriteScalingFactor(bp) 예시 1MB·10수신·4bp=1,040,000 byte 재확인.
- **rewards-minting**: minting delegation(보상 coupon 수집 자동화) — 5 coupon(Validator/Unclaimed/DevFund/AppReward/ValidatorLiveness). validator-liveness: 라운드마다 ValidatorLivenessActivityRecord, 온보딩 후 traffic 구매용 초기 자금.

## (16) deep-dive/overview batch (glossary·use-cases·command-deduplication·explicit-contract-disclosure·multi-hosting·external-signing-onboarding) — Stage 61

source: overview/understand/{glossary,use-cases} · appdev/deep-dives/{command-deduplication,explicit-contract-disclosure,multi-hosting,external-signing-onboarding}

- **glossary**: **Amulet = Canton Coin 의 (구)명칭** — API/SDK 에 `amulet` 로 남음(예 `sdk.amulet.featuredApp.grant`). DSO = Decentralized Synchronizer Operator(SV 집합). Splice = synchronizer 운영 오픈소스(Hyperledger Labs). use-cases = DvP·토큰증권·cross-border·신디케이트론·공급망금융(수탁 신규 없음, skip).
- **external-signing-onboarding (★ MPC/HSM party 생성 실제 절차)**: ① 오프라인 keygen(ed25519, prod 는 HSM), pubkey DER→base64 → ② `/v2/parties/external/generate-topology`(synchronizerId·party hint·pubkey·optional confirming participant UIDs) → PartyToParticipant topology tx + **multi-hash commitment** 반환 → ③ **custody 키로 multi-hash 서명** → ④ `/v2/parties/external/allocate`(topology tx + 서명: format·bytes·fingerprint·algo). multi-host = `otherConfirmingParticipantUids`, 각 participant Ledger API 에 동일 onboarding tx 업로드. **키는 HSM/MPC 밖으로 안 나감**.
- **command-deduplication (정정)**: dedup 기준은 **command ID**(=change ID = commandId + act_as + userId, **재시도 시 동일 유지**), submission ID 는 **매 시도 fresh**(완료 이벤트 상관용). dedup period = duration/offset, `max-deduplication-duration`. 멱등 레시피: command ID 결정적·영속, dedup duration 을 처리시간 bound B 로 명시, submission ID 는 UUID. (기존 "submission ID dedup" 표기 정정)
- **explicit-contract-disclosure (수탁/토큰)**: 못 보는 contract 를 command 에 첨부해 사용 — `disclosed_contracts`(template_id·contract_id·**created_event_blob**, off-ledger 공유). **transfer factory/registry contract** 를 이렇게 disclose 해 acquirer 가 stakeholder 아니어도 exercise. hash 기반 contract-id 라 위변조 시 다른 id → 탐지. (wallet/guidance 의 "prepare with disclosed contracts" 의 정체)
- **multi-hosting ≠ multi-sig (정정/구분)**: multi-hosting = party 를 여러 validator 에 분산(topology). threshold 1=즉시 failover, **>1=악성 validator 방어**(독립 검증). backup-restore 와 달리 **즉시 failover**·지역분산. PartyToParticipant mapping 자체는 모든 host validator 가 서명(governance). ↔ multi-sig(§batch2 ③)는 tx 서명 키 threshold. 둘은 다른 층.
