---
type: entity
vendor: canton
status: draft
tags: [architecture, transaction, integration, stablecoin, identity, recovery]
stage_introduced: 52
last_updated_stage: 53
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
- **Synchronizer / 합의** — **2-layer**: ordering layer(synchronizer) + validation layer(participant). Sequencer(순서화·timestamp·sender identity 제거) + Mediator(confirmation 집계·2-phase commit verdict). **native BFT orderer**(ISS+Narwhal 영향, `Mempool→Availability→Consensus→Output` 4-모듈, **<1/3 Byzantine fault 허용**). finality 시간 수치는 리뉴얼본에도 명시 없음(메커니즘만 확정). (source: docs-canton-network-renewed)
- **수수료 = traffic (구체 수치 ★ Stage 53)** — traffic 은 byte 단위 **선충전 대역폭 잔고**(거래마다 후불 아님). **Canton Coin 소비로 구매**, on-ledger `MemberTraffic` 갱신. 비용 = `메시지크기 × (1 + recipients × readVsWriteScalingFactor/10000)` — 예 1MB·10수신·factor4 = `1,000,000×(1+10×0.004)=1,040,000` byte. 파라미터(all networks): **무료 base 400,000 byte/20분 window**(선형 회복), **추가 traffic $60/MB**(CC 환산), **factor 4 bp(0.004)**, **최소 top-up 200,000 byte**. validator 앱 built-in auto top-up. (source: docs-canton-network-renewed)
- **Token Registrar** — native token(예: USDCx=Circle)은 registrar 가 별도 관리. Canton Coin(CC) recovery 와 token recovery 분리. (source: fireblocks-recover-canton-coin)

## Details
### Musubi Network (Canton 기반 활용 사례)
한·일 cross-border FX/결제 네트워크 — atomic DvP(4 settlement legs + signatory closure, Allocation contract 기반), ~15초 결제, JPYSC0·USDCx 스테이블코인, 현재 testnet POC. 참여자 = Institutions / Custodians(cryptographic dual-control authorize) / Market Makers + Operator(Startale+Nodeinfra) / Settlement mediator. (source: musubi-network-introduction) [[stablecoin]] 맥락과 연결.

### 수탁 지갑 관점
Canton 어댑터가 흡수해야 할 핵심 = **"제출=완료" 가 아니다** — 전송이 기본 2-step 이라 OFFER/TransferInstruction 제출 후 상대 수락 대기 상태가 존재하고, 송신자 자금이 locked UTXO 로 묶인다. account/nonce 모델이 아니라 DAML active contract 원장 + UTXO형 holdings + 권한 기반 전송이 구별점. Fireblocks 가 Canton 지원(transactionType, traceableId). [[api]] 참조.

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
- **Q-2026-06-09-C01**: Canton finality 정확 수치(Mediator 2-phase commit 확정 시점) — **open**. 리뉴얼본(docs.canton.network)에도 latency/finality 수치 명시 없음 확인. 메커니즘은 BFT orderer(ISS+Narwhal, <1/3 fault)·2-phase commit 으로 확정. 절대 수치만 미확정 (★ Stage 53)
- **Q-2026-06-09-C02**: tx 당 traffic 비용 산정식 — **ANSWERED (Stage 52, 구체화 Stage 53)**. 비용 = `메시지크기 × (1 + recipients × readVsWriteScalingFactor/10000)`. 파라미터: 무료 400,000 byte/20분, 추가 $60/MB, factor 4bp, 최소 top-up 200,000 byte. estimate = `/v2/interactive-submission/prepare`. (source: docs-canton-network-renewed synchronizer-traffic)
