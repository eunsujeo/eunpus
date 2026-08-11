<!--
source_url: https://fireblocks.github.io/fireblocks-network-link/v2/docs.html
downloaded_at: 2026-08-11
status: Mode C — 스펙 원문 보존 + 구조 색인. 본문 전체는 LLM context 미로드
priority: TIER1
domain: Governance / Provider Connectivity
raw: sources/fireblocks/openapi/2026-08-11__fireblocks-network-link-v2__openapi.json (261 KB)
-->

# Fireblocks Provider Connectivity API v2 (Network Link) — 구조 색인

`Fireblocks Provider Connectivity API v2` · 스펙 버전 `0.5.1` · OpenAPI 3.0.0 · **37 path · 241 schema**.

Redoc 페이지에 스펙이 통째로 박혀 있어 JSON 으로 추출해 `sources/fireblocks/openapi/` 에 보존했다. 260 KB 라 본문은 context 에 올리지 않고, 아래는 bash/python 으로 뽑은 구조와 개념 절 발췌다.

## 방향이 반대다

우리가 지금까지 본 Fireblocks API 는 **우리가 벤더를 호출**하는 것이었다. 이 스펙은 반대다 — **Fireblocks 가 제3자 제공자(거래소·커스터디언 등)의 서버를 호출**한다. 제공자가 이 규격대로 서버를 구현하면 Fireblocks 플랫폼에 연결된다.

서버 URL 이 `http://0.0.0.0:8000` 으로 적혀 있는 것도 그래서다 — 구현자가 띄울 서버를 가리킨다.

## 엔드포인트 (태그별)

| 태그 | 엔드포인트 |
|---|---|
| capabilities | `GET /capabilities` · `/capabilities/assets` · `/capabilities/assets/{id}` · `/capabilities/liquidity/quotes` · 계정별 `…/capabilities/transfers/{withdrawals,deposits}` · `…/capabilities/ramps` |
| accounts | `GET /accounts` · `GET /accounts/{accountId}` |
| balances | `GET /accounts/{accountId}/balances` |
| rates | `GET /accounts/{accountId}/rate` |
| liquidity | `POST·GET /liquidity/quotes` · `GET /liquidity/quotes/{id}` · `POST /liquidity/quotes/{id}/execute` |
| transfers | 출금·입금 목록·상세 조회 |
| transfersBlockchain | `POST /transfers/withdrawals/blockchain` · 입금 주소 `POST·GET·DELETE /transfers/deposits/addresses` |
| transfersFiat | `POST /transfers/withdrawals/fiat` + 입금 주소 |
| transfersPeerAccounts | `POST /transfers/withdrawals/peeraccount` |
| transfersInternal | `POST /transfers/withdrawals/subaccount` |
| collateral | 링크·주소·입출금·정산 16개 |
| ramps | `GET·POST /ramps` · `GET /ramps/{id}` |

## 개념 절에서 확인한 것

**기능 탐색이 동적이다.** `GET /capabilities` 가 구현한 API 버전과 지원 컴포넌트 배열을 돌려주고, Fireblocks 가 그걸 보고 무엇을 호출할지 정한다. 컴포넌트마다 `"*"`(전체) 또는 특정 sub-account ID 목록으로 답할 수 있다.

**멱등성을 서버가 보장해야 한다.** 생성·변경 요청에 `idempotencyKey` 가 붙고, 같은 키로 다른 내용이 오면 400 을 내야 한다. 재전송해도 한 번만 실행되는 것이 규격 요구사항이다.

**인증은 자체 헤더 5종이다.** `X-FBAPI-KEY` · `X-FBAPI-TIMESTAMP` · `X-FBAPI-NONCE` · `X-FBAPI-SIGNATURE`, 그리고 Off-Exchange 요청에만 붙는 `X-FB-PLATFORM-SIGNATURE`. 서명 메시지는 타임스탬프·논스·HTTP 메서드·… 순서로 이어 붙여 만들고, 키와 알고리즘은 온보딩 때 정한다.

**페이지네이션은 커서식이다.** `limit` · `startingAfter` · `endingBefore`.

**자산 식별** — 법정통화는 ISO-4217, 블록체인 네이티브는 스펙에 열거, 그 밖의 토큰은 `GET /capabilities/assets` 에 등록하고 거기서 받은 고유 ID 로 가리킨다.

**Off-Exchange(담보)는 양방향이다.** 거래소가 트레이더 자산을 자기 원장에 두지 않고, Fireblocks 가 담보를 잠가 두는 구조다. Fireblocks → 제공자 방향이 이 스펙이고, 제공자 → Fireblocks 방향은 Fireblocks API 쪽에 따로 있다. 담보 관련 엔드포인트가 16개로 가장 크다.

**IP 화이트리스트** — Fireblocks 가 제공자 서버를 호출하는 출발 IP 가 지역별 고정 목록으로 스펙에 박혀 있다(싱가포르·유럽 등).

## 우리와의 관계 — 아직 정하지 않음

이 스펙은 **제공자가 되는 쪽**의 규격이다. 우리가 지금 하는 일(우리가 Fireblocks 를 호출해 지갑을 운영)과는 방향이 다르다. 쓸모가 있으려면 둘 중 하나여야 한다.

- 우리가 Fireblocks Provider Network 에 **서비스로 등재**하려는 경우
- 이 규격을 구현한 제3자(거래소 등)를 **우리가 연결해 쓰려는** 경우 — 그때는 우리가 이 API 를 구현하는 게 아니라 상대가 구현한다

어느 쪽인지에 따라 읽을 절이 완전히 달라진다. 정해지면 해당 부분만 Mode C 로 더 파면 된다.

## 함께 읽을 것

- [Listing your service on the Provider Network](https://support.fireblocks.io/hc/en-us/articles/22144765384348-Listing-your-service-on-the-Provider-Network)
- [Network Link Integration Guide for Provider Connectivity](https://developers.fireblocks.com/docs/network-link-integration-guide-for-provider-connectivity)
