---
type: entity
vendor: canton
status: draft
tags: [architecture, transaction, integration, stablecoin, identity, recovery]
stage_introduced: 52
last_updated_stage: 56
source_count: 5
related: [transaction, api]
---

# Canton Network

## Summary
Canton 은 DAML 스마트컨트랙트 기반 privacy-enabled 퍼블릭 블록체인(institutional finance·토큰화·cross-border 결제 대상)이다. 원장은 **party 가 보유한 Active Contract Set(ACS)** 이고, 토큰 holdings 는 **UTXO**(가용/locked)로 표현된다. party 는 **participant(validator node)** 에 host 되어 **Synchronizer(Sequencer+Mediator) 2-phase commit** 으로 확정된다. 전송은 기본 **2-step**(TransferInstruction: Accept/Reject/Withdraw)이며, Canton Coin 은 Transfer Pre-approval 로 1-step. (source: canton-network-homepage, musubi-network-introduction, fireblocks-recover-canton-coin, digitalasset-docs-canton-model, docs-canton-network-renewed)

## Key Concepts
- **원장 = ACS, holdings = UTXO** — party 자산/상태 = active contract 집합(ACS). 토큰 holdings 는 `Holding` interface 구현 active contract = **Canton 의 UTXO 등가물**(`includeLocked` 로 locked/가용 구분). active Holding 은 storage+compute 비용 발생 → **지갑당 ~10 UTXO 유지 권장**. 복구 시 새 validator 에 party re-host + ACS import. (source: digitalasset-docs-canton-model, docs-canton-network-renewed, fireblocks-recover-canton-coin)
- **2-step 전송 / CIP-0056** — token standard 명세 = **CIP-0056**. 송신 시 `TransferInstruction`(factory 생성) → 수신자 **Accept**(완료)/**Reject**(반환) 또는 송신자 **Withdraw**(locked 자금 회수). FOP(Free of Payment) 전송 가능. 신규 인터페이스 `TransferFactory`/`AllocationFactory`/`BatchMergeUtility`/`MergeDelegation`. Canton Coin 은 **Transfer Pre-approval = 1-step**. Fireblocks transactionType(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL)와 정합. (★ Stage 53: v3.4 는 "2-step = 모든 토큰 기본값" 단정, 리뉴얼본은 구현 옵션 톤 — 함께 볼 것) (source: digitalasset-docs-canton-model, docs-canton-network-renewed; 매핑 [[transaction]])
- **PartyId = hint::fingerprint** — fingerprint = 이 party 의 topology transaction 을 authorize 하는 공개키의 sha256. namespace 는 root signing key 에서 도출. opaque identifier 라 파싱 금지, allocation 으로만 생성. (source: digitalasset-docs-canton-model)
- **external party = 외부 서명 신원** (★ Stage 53) — external party = "submission key holder, no SPN, 자체 namespace, 자체 signing key 통제". external signing 2-step: **Preparing Participant Node**(Ledger API command→Daml tx) + **Executing Participant Node**(party 서명 부착). party 가 "transaction tree 의 hash" 명시 서명, **private key 는 party 만 통제 → participant 는 party 승인 없이 원장 행동 불가**. MPC/HSM 수탁 모델과 정합. (source: docs-canton-network-renewed)
- **Synchronizer / 합의** — **2-layer**: ordering layer(synchronizer) + validation layer(participant). Sequencer(순서화·timestamp·sender identity 제거) + Mediator(confirmation 집계·2-phase commit verdict). Global Synchronizer = **2/3 majority BFT consensus** (native BFT orderer: ISS+Narwhal 영향, `Mempool→Availability→Consensus→Output` 4-모듈, <1/3 fault 허용 = 2/3 honest majority 동치). **Super Validator** = Global Synchronizer infra·sequencing·CC tx 검증·거버넌스. **Validator** = party host·tx 검증·연결. 거버넌스 = GSF + Linux Foundation. **finality "usually 3-10s"** (★ Stage 54 C01 ANSWERED). (source: docs-canton-network-renewed)
- **Canton Coin = burn-mint equilibrium** (★ Stage 54) — 수수료(USD 표시·CC 지불)는 **소각=유통에서 제거**(중앙으로 안 감), validator/super validator 는 infra·앱·사용량·liveness 로 **mint 보상**. 공급-소각 균형으로 환율 안정. → "CC 소각=traffic=수수료" 모델 확정. (source: docs-canton-network-renewed)
- **프라이버시 메커니즘 = sub-transaction views** (★ Stage 55) — 트랜잭션은 **view 들로 분해**되어 각 party 는 자기 view 만 본다. Synchronizer 는 내용을 복호화하지 않고 암호화 메시지만 순환시킨다("coordination vs storage 분리"). party = "on-ledger identity, analogous to addresses/EOA". **Synchronizer 토폴로지**는 single/multiple/global 구성 모두 지원(본 위키는 global synchronizer 중심). (source: docs-canton-network-renewed architecture)
- **암호키 모델** (★ Stage 56) — **namespace root key**(namespace = root key 의 hash, topology tx authorize) · **node signing key**(sequencer 인증·ACS commitment 서명) · **encryption key**(asymmetric + session symmetric) · **external party 서명키**(party 가 직접 tx authorize, **권장 저장 = offline**). 키 저장 옵션 = DB / in-memory / offline / KMS(envelope·full). 수탁 키관리(MPC/HSM·offline)와 직결. (알고리즘명은 이 페이지에 없음; EdDSA 는 [[fireblocks-recover-canton-coin]] 근거) (source: docs-canton-network-renewed cryptographic-keys)
- **stakeholder / choice** (★ Stage 56) — **stakeholder = signatories + observers**(contract 를 볼 수 있는 모든 party). contract(template instance)는 immutable — created/archived 만. **choice = Consuming**(행사 시 contract archive) **/ Non-consuming**(유지). (source: docs-canton-network-renewed core-concepts)
- **수수료 = traffic (구체 수치 ★ Stage 53)** — traffic 은 byte 단위 **선충전 대역폭 잔고**(거래마다 후불 아님). **Canton Coin 소비로 구매**, on-ledger `MemberTraffic` 갱신. 비용 = `메시지크기 × (1 + recipients × readVsWriteScalingFactor/10000)` — 예 1MB·10수신·factor4 = `1,000,000×(1+10×0.004)=1,040,000` byte. 파라미터(all networks): **무료 base 400,000 byte/20분 window**(선형 회복), **추가 traffic $60/MB**(CC 환산), **factor 4 bp(0.004)**, **최소 top-up 200,000 byte**. validator 앱 built-in auto top-up. (source: docs-canton-network-renewed)
- **Token Registrar** — native token(예: USDCx=Circle)은 registrar 가 별도 관리. Canton Coin(CC) recovery 와 token recovery 분리. (source: fireblocks-recover-canton-coin)

## Details
### Musubi Network (Canton 기반 활용 사례)
한·일 cross-border FX/결제 네트워크 — atomic DvP(4 settlement legs + signatory closure, Allocation contract 기반), ~15초 결제, JPYSC0·USDCx 스테이블코인, 현재 testnet POC. 참여자 = Institutions / Custodians(cryptographic dual-control authorize) / Market Makers + Operator(Startale+Nodeinfra) / Settlement mediator. (source: musubi-network-introduction) [[stablecoin]] 맥락과 연결.

### 수탁 지갑 관점
Canton 어댑터가 흡수해야 할 핵심 = **"제출=완료" 가 아니다** — 전송이 기본 2-step 이라 OFFER/TransferInstruction 제출 후 상대 수락 대기 상태가 존재하고, 송신자 자금이 locked UTXO 로 묶인다. account/nonce 모델이 아니라 DAML active contract 원장 + UTXO형 holdings + 권한 기반 전송이 구별점. Fireblocks 가 Canton 지원(transactionType, traceableId). [[api]] 참조.

### 수탁 통합 핵심 — wallet/guidance (★ Stage 54)
docs.canton.network/integrations/wallet/guidance 1차 출처. 수탁 설계에 직결되는 구체 요건:
- **입금 식별 = memo tag (별도 입금주소 아님)** — Canton 은 deposit 마다 입금주소를 따로 두지 않고 transfer metadata 의 memo 로 추적: `"meta":{"values":{"splice.lfdecentralizedtrust.org/reason":"memo-ref"}}`. XRP/XLM destination-tag 류. 거래소 입금도 이 방식. **EVM 식 "사용자별 입금주소" 가정이 깨지는 지점**.
- **party = account 당 1개, ephemeral 금지** — "one Party per account/wallet" 권장. **deposit 마다 party 생성 금지**(allocation 비용). `sdk.party.external.create(publicKey,{partyHint})`, 형식 `name::fingerprint` max 185 chars. backup 위해 여러 validator 에 **multi-host**.
- **API**: tx = `/v2/interactive-submission/{prepare,execute}`, ACS/UTXO = `/v2/state/active-contracts`(`sdk.ledger.acsReader.read()`), offset = `/v2/state/ledger-end`(prepare 전 호출, contract id pin). transfer = prepare→`signTransactionHash(hash,privateKey)`→execute.
- **입금 관찰** = ledger event 의 **"TransferIn"** 감시(pending/completed). pre-approval = `sdk.amulet.featuredApp.grant()` 로 auto-accept, 아니면 수동 `TransferInstruction_Accept`/`_Reject`. locked UTXO 는 "owned by sender, **locked by DSO**".
- **UTXO 관리** = self-transfer split, change 최소화, `sdk.token.transfer.create({inputUtxos:[...]})`. (지갑당 ~10 UTXO 권장과 연결)
- **운영** = **LocalNet→DevNet→TestNet→MainNet 4 환경**(★ Stage 56; DevNet secret API 취득·1시간 유효, TestNet/MainNet 은 sponsor 수동 제공). validator SLA: 99%+ 가용성, 보안 패치 1주·마이너 2주 내, DB·identity 정기 백업. 로컬은 ledger-end offset, **파트너 대사는 synchronizer `recordTime`**. registry endpoint: `/registry/metadata/v1/{info,instruments}`, `/registry/transfer-instruction/v1/transfer-factory`. 복구·repair 는 **Canton Console**(운영자 CLI, Ledger API 와 별개)에서 실행.

## Related Pages
- [[transaction]] (Fireblocks) — Canton transactionType·2-step lifecycle 매핑
- [[api]] (Fireblocks) — Canton 관련 REST·open question

## Sources
- canton-network-homepage (2026-05-29) — <https://www.canton.network/>
- musubi-network-introduction (2026-05-29) — <https://musubinetwork.com/introduction>
- fireblocks-recover-canton-coin (2026-05-19) — Fireblocks Help Center 추출본
- digitalasset-docs-canton-model (2026-06-09) — <https://docs.digitalasset.com/> v3.4
- docs-canton-network-renewed (2026-06-10) — <https://docs.canton.network/> (digitalasset.com 후속 리뉴얼본)

## Open Questions
- **Q-2026-05-22-A11**: Canton transactionType(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL) ↔ Fireblocks transaction status 매핑 + timeout 처리 (open)
- **Q-2026-06-09-C01**: Canton finality 정확 수치 — **ANSWERED (Stage 54)**. docs.canton.network/integrations/wallet/guidance 에 문자 그대로 **"Finality usually takes 3-10s."** (verbatim 재확인, 요약 주입 아님). 그간 "검색 요약 only" 격리했으나 1차 출처 확보로 해제. 메커니즘 = 2/3 BFT + Mediator 2-phase commit. 단 "usually" 라 환경별 편차 가능.
- **Q-2026-06-09-C02**: tx 당 traffic 비용 산정식 — **ANSWERED (Stage 52, 구체화 Stage 53)**. 비용 = `메시지크기 × (1 + recipients × readVsWriteScalingFactor/10000)`. 파라미터: 무료 400,000 byte/20분, 추가 $60/MB, factor 4bp, 최소 top-up 200,000 byte. estimate = `/v2/interactive-submission/prepare`. (source: docs-canton-network-renewed synchronizer-traffic)
