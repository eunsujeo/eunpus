<!--
source_url: https://docs.digitalasset.com/ (multiple pages, v3.4 / integrate-devnet)
fetched_at: 2026-06-09
status: full (WebFetch — Canton/DAML 1차 기술 문서)
priority: TIER1
domain: canton-network / ledger-model
-->

# Canton / DAML 기술 모델 — Digital Asset Docs (Mode C 근거 캡처)

> Canton 의 **잔액·전송·수수료·finality·party 식별** 모델을 1차 출처(docs.digitalasset.com)에서
> 확보. 기존 canton/ 소스(마케팅 homepage·Musubi 활용사례·Fireblocks 복구 운영)가 못 채운
> 기술 공백을 메우기 위한 promote.

## (1) Token Standard — 전송 모델 (2-step / TransferInstruction)

source: https://docs.digitalasset.com/integrate/devnet/token-standard/index.html

- 전송은 **TransferInstruction** contract 로 표현 — 송신자가 전송을 개시하면 수신자에게
  "pending transfer" 로 보이는 contract 가 생성된다 (propose-and-accept flow).
- 수신자/송신자 선택지 3가지:
  - **Accept** — 수신자가 확정, 자금이 수신자 holdings 로 이동
  - **Reject** — 수신자가 거절, 자금이 송신자 통제로 반환
  - **Withdraw** — 수신자가 행동하기 전 송신자가 제안을 철회해 **locked 자금 회수**
- 상태: Pending(수락 대기) → Accepted / Rejected / Withdrawn
- **2-step 이 모든 토큰의 기본값** — "the default behavior for all tokens are a 2-step
  transfer, this matches how funds are usually transferred in TradFi".
- **Canton Coin** 은 **Transfer Pre-approval** 로 자동 수락 → "1-step transfer" 경험.
- **locked 자금**: 전송 생성 시 송신자 자금이 lock 된다. `sdk.token.utxos.list({partyId,
  includeLocked:true})` 로 locked **UTXO** 조회, `includeLocked:false` 면 가용분만.
  → **Canton 토큰 holdings 는 UTXO 로 표현된다** (계정 잔액형 아님).

## (2) Traffic — 수수료 모델

source: https://docs.digitalasset.com/integrate/devnet/traffic/index.html
       + https://docs.digitalasset.com/integrate/devnet/canton-coin-specific-considerations/index.html

- **traffic** = validator node 레벨에서 부과되는 네트워크 대역폭 비용, **byte 단위**.
  validator 가 synchronizer 와 통신(트랜잭션 broadcast·합의 메시지)할 때 차감.
- traffic 은 **Canton Coin(CC) 을 burn 해 선구매**한다.
  - Super Validator 가 on-chain 으로 CC↔USD 환율 게시
  - Super Validator 가 traffic 비용 USD↔Bytes 게시
  - → CC↔Bytes 환산이 동적으로 도출
- **무료 trickle**: 10분(mining round)마다 소량 free traffic. 소진 시 거래 불가지만 자동 회복.
  validator node 가 CC 잔액 있으면 자동 top-up.
- **holding fee**: Holding UTXO 당 연 약 **$1** — holding fee 가 가치를 넘으면 dust coin
  archiving 허용. (source: canton-coin-specific-considerations)

### (2-a) tx 당 traffic 비용 산정식 (Q-C02 확정)

source: https://docs.digitalasset.com/overview/3.4/explanations/canton/traffic-management.html
       + https://docs.sync.global/faq.html · https://docs.sync.global/deployment/traffic.html

- **총비용 = base_event_cost + Σ(envelope 별 비용)**. 모든 submission request 에 고정
  base_event_cost 부과.
- envelope 별:
  - storage cost = payload(byte) 크기
  - network/read cost = `writeCost × #recipients × costMultiplier / 10_000`
    (costMultiplier 는 보통 1/10000 order — 대역폭 비용을 낮춤)
  - group address 는 비용 계산 **전에** 실제 member 수로 resolve.
- confirmation request/response, topology request, time proof 모두 과금. time proof 는
  빈 메시지라 base 만.
- 절대 byte↔credit 환율/금액은 synchronizer config 에 따라 가변(고정 명시 없음). operating
  group 이 USD/MB 로 메터링, on-chain payment utility 로 징수.
- **실무 산정**: Splice 0.5.x+ 부터 `/v2/interactive-submission/prepare` Ledger API 가
  submission·confirmation traffic estimate 반환. participant 로그의 `EventCost` 로 실측.

## (3) Party Identity — 식별/파생

source: https://docs.digitalasset.com/build/3.4/explanations/parties-users.html

- **PartyId 형식 = `hint::fingerprint`**
  예: `Alice::1220f2fe29866fd6a0009ecc8a64ccdc09f1958bd0f801166baaee469d1251b2eb72`
  - **hint** (`::` 앞) — party allocation 시 지정한 prefix. 미지정 시 `party-${randomUUID}`.
    같은 hint 가 이미 있으면 allocation 실패. (네트워크 내 유일, 전역 유일 아님)
  - **fingerprint** (`::` 뒤) — 이 party 의 topology transaction 을 authorize 하는
    **public key 의 fingerprint** (pubkey 의 sha256, hash purpose '12' prefix).
- **namespace** — root certificate 로 정의. "fingerprint abc123 인 서명 공개키가 namespace
  abc123 의 topology tx 서명 권한 보유". 모든 party 는 namespace 에 속하며, namespace 는
  root signing key 의 pubkey 에서 도출.
- allocation 결과 party id = partyIdHint + 감독 엔티티(보통 Participant Node)의 namespace
  fingerprint.
- PartyId 는 **opaque identifier** — 앱이 파싱/조립하지 말 것. allocation 만이 생성 출처.

## (4) Synchronizer — finality / 확정

source: https://docs.digitalasset.com/subnet/3.4/overview/index.html

- **Synchronizer** = Sequencing + Mediating 두 기능.
  - **Sequencer** — participant node(validator) 간 ordered·confidential 통신.
    atomic multicast 로 메시지 전달, ordering layer 가 일관된 순서 + timestamp 부여.
  - **Mediator** — 관련 stakeholder participant node(validator)들의 transaction
    **confirmation 을 집계**해 **2-phase commit** 으로 승인/거절. atomicity + privacy 제공.
- 검증 책임은 해당 트랜잭션의 stakeholder participant node(validator)에 있고 synchronizer
  자체엔 없음.
- finality 시간(Q-C01): "약 3–10초" 는 **검색엔진 요약에만** 등장. 직접 fetch 한 1차 페이지
  3곳(subnet overview · integrate canton-network-overview · docs.sync.global FAQ) **모두 수치
  명시 없음** → 1차 미확정. 메커니즘(2-phase commit)만 확정.

## Source

Digital Asset platform docs — <https://docs.digitalasset.com/> (v3.4 / integrate-devnet)
