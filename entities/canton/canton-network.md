---
type: entity
vendor: canton
status: draft
tags: [architecture, transaction, integration, stablecoin, identity, recovery]
stage_introduced: 52
last_updated_stage: 52
source_count: 4
related: [transaction, api]
---

# Canton Network

## Summary
Canton 은 DAML 스마트컨트랙트 기반 privacy-enabled 퍼블릭 블록체인(institutional finance·토큰화·cross-border 결제 대상)이다. 원장은 **party 가 보유한 Active Contract Set(ACS)** 이고, 토큰 holdings 는 **UTXO**(가용/locked)로 표현된다. party 는 **participant(validator node)** 에 host 되어 **Synchronizer(Sequencer+Mediator) 2-phase commit** 으로 확정된다. 전송은 기본 **2-step**(TransferInstruction: Accept/Reject/Withdraw)이며, Canton Coin 은 Transfer Pre-approval 로 1-step. (source: canton-network-homepage, musubi-network-introduction, fireblocks-recover-canton-coin, digitalasset-docs-canton-model)

## Key Concepts
- **원장 = ACS, holdings = UTXO** — party 자산/상태 = active contract 집합(ACS). 토큰 holdings 는 Holding UTXO 로 표현(`includeLocked` 로 locked/가용 구분). 복구 시 새 validator 에 party re-host + ACS import. (source: digitalasset-docs-canton-model, fireblocks-recover-canton-coin)
- **2-step 전송** — 기본값("matches TradFi"). 송신 시 TransferInstruction(pending) 생성 → 수신자 **Accept**(완료)/**Reject**(반환) 또는 송신자 **Withdraw**(locked 자금 회수). Canton Coin 은 **Transfer Pre-approval = 1-step**. Fireblocks transactionType(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL)와 정합. (source: digitalasset-docs-canton-model; 매핑 [[transaction]])
- **PartyId = hint::fingerprint** — fingerprint = 이 party 의 topology transaction 을 authorize 하는 공개키의 sha256. namespace 는 root signing key 에서 도출. opaque identifier 라 파싱 금지, allocation 으로만 생성. (source: digitalasset-docs-canton-model)
- **Synchronizer / finality** — Sequencer(순서화·atomic multicast·timestamp) + Mediator(stakeholder validator 의 confirmation 집계·2-phase commit 승인/거절). 검증 책임은 validator participant node 에. finality 수 초(정확 수치 확인 필요). (source: digitalasset-docs-canton-model)
- **수수료 = traffic** — traffic 은 byte 단위의 **미리 충전해 둔 대역폭 잔고**다. **Canton Coin 을 소각(burn)하면 그 대가로 traffic 잔고가 충전**되고(EVM gas 처럼 거래마다 즉석 후불이 아님), **거래를 보낼 때 소비되는 traffic 이 곧 수수료**다. 환산은 Super Validator 가 CC↔USD·USD↔Bytes 를 게시해 CC↔Bytes 가 동적 도출. 10분(mining round)마다 소량은 무료 충전(free trickle). 별도로 보유세 성격의 holding fee ~$1/년/Holding UTXO. (source: digitalasset-docs-canton-model)
- **tx 당 traffic 산정식** — `총비용 = base_event_cost + Σ(envelope 비용)`, envelope 비용 = storage(payload byte) + network(`writeCost × #recipients × costMultiplier/10000`). group address 는 계산 전 member 수로 resolve. confirmation·topology·time proof 모두 과금(time proof 는 base 만). 실무 산정은 `/v2/interactive-submission/prepare` Ledger API 가 traffic estimate 반환, participant 로그 `EventCost` 로 실측. (source: digitalasset-docs-canton-model)
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

## Open Questions
- **Q-2026-05-22-A11**: Canton transactionType(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL) ↔ Fireblocks transaction status 매핑 + timeout 처리 (open)
- **Q-2026-06-09-C01**: Canton finality 정확 수치(Mediator 2-phase commit 확정 시점) — **open**. "3-10초" 는 검색 요약에만, 1차 페이지 3곳(subnet·canton-network-overview·sync.global FAQ) 모두 수치 없음. 메커니즘만 확정
- **Q-2026-06-09-C02**: tx 당 traffic 비용 산정식 — **ANSWERED (Stage 52)**. base_event_cost + Σ(storage + network `writeCost×#recipients×costMultiplier/10000`). estimate = `/v2/interactive-submission/prepare`. (source: traffic-management, sync.global FAQ). 단 절대 byte↔금액 환율은 synchronizer config 가변
