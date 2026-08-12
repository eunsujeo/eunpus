# Fireblocks 담당자 대화 — Network Link v2 외부 LP 유동성 연동

- 대화일: 원문 미기재
- 기록 수령일: 2026-08-12
- 자료 성격: Fireblocks 담당자와의 기술 질의응답
- 적용 범위: 외부 KRWK 발행업체 사례, 우리 블록체인 지갑 설계와 무관
- 검증 상태: 담당자 답변은 벤더 설명으로 기록하고, 공개 명세에서 확인되는 API 표면과 구분함

## 기록상 주의

원문 후반부는 `we`와 `fireblock support` 표기가 문맥상 서로 뒤바뀐 것으로 보이는 구간이 있다.

- `One additional question came up`으로 시작하는 온체인 출금 시점 질문은 질문자 측 발언으로 보인다.
- `Network Link v2 enables different use cases...`로 시작하는 제품 설명은 Fireblocks 측 답변으로 보인다.

이 문서는 문맥상 역할을 단정해 원문을 재작성하지 않는다. 아래 정리에서는 해당 내용을 각각 `질문`과 `제품 설명`으로만 구분한다.

## 1. 질의 목적

외부 Market Maker 또는 Liquidity Provider와 직접 계약해 `USDC ↔ KRWK` 유동성을 조달하는 경우, Fireblocks Network Link v2를 다음 거래 인터페이스로 사용할 수 있는지 확인했다.

1. Fireblocks API로 LP에 오프체인 RFQ 요청
2. LP의 견적 응답 수신
3. 특정 견적 선택·수락
4. 수락 후 오프체인 원장에서 온체인 지갑으로 정산

검토 흐름은 `RFQ → Quote response → Accept → On-chain settlement`다. 이번 질의는 기술 검증 목적이며, 현재 직접 MM을 운영하거나 특정 LP를 온보딩하기로 결정한 상태는 아니라고 밝혔다.

## 2. Fireblocks 측 답변

### 조건부 지원

Fireblocks 측은 이 흐름이 가능하다고 설명하면서 다음 두 조건을 제시했다.

- 상대 Liquidity Provider가 **Network Link v2에 연동돼 있어야 한다.**
- 해당 제공자가 **USDC ↔ KRWK 거래쌍을 지원해야 한다.**

따라서 Network Link v2는 임의의 외부 MM과 바로 연결하는 범용 RFQ 프로토콜이 아니다. 실제 사용 가능 여부는 선정한 LP의 Fireblocks 연동 상태와 제공 capability에 달려 있다.

### 제공자 유형별 기능

제품 설명에서는 Network Link v2가 제공자 유형별로 다음 용도를 지원한다고 밝혔다.

| 제공자 유형 | 설명된 기능 |
|---|---|
| Exchange·Liquidity Provider | Fireblocks 고객에게 잔액 조회, 입금, 출금 등 서비스 제공 |
| Exchange·Liquidity Provider 중 거래 기능 채택사 | 거래 개시 endpoint 제공. 모든 거래소가 이 기능을 채택한 것은 아님 |
| PSP | 온·오프램프, 브릿징, 스왑 등에 필요한 견적과 환율 제공 |
| Custodian | Fireblocks 고객이 Custodian 핫월렛으로 자산을 입출금하도록 지원 |

### Swap API

Network Link v2 외에도 통합된 제공자가 거래자에게 견적·환율을 반환하고 스왑과 정산 절차를 시작할 수 있는 **Swap API**가 있다고 설명했다. Network Link v2의 provider-side liquidity capability와 Fireblocks 고객이 호출하는 Swap API의 역할과 호출 주체는 별도로 확인해야 한다.

### 고객 자금의 LP 입출금

Fireblocks 고객이 Exchange·LP에 자산을 입출금할 때는 `createTransaction`을 사용하고, source와 destination에 고객 지갑과 Exchange·LP를 지정한다고 설명했다.

이 답변에 따르면 Provider Connectivity 명세의 `createBlockchainWithdrawal`을 발행업체 측 정산 호출로 곧바로 전제하면 안 된다. `createBlockchainWithdrawal`은 제공자가 구현하는 Network Link v2 인터페이스의 public-blockchain 출금 capability이고, Fireblocks 고객 측 자금 이동 API와 호출 방향이 다를 수 있다.

## 3. LP 선정 상태

발행업체 측은 외부 MM을 이용하는 방향을 검토 중이며 특정 LP는 아직 선정하지 않았다고 답했다. KRWK 유동성을 제공할 LP를 선정한 뒤 KRWK–USDC/USDT RFQ 스왑이 가능한 플랫폼을 검토할 계획이라고 설명했다.

Fireblocks 측은 참고사항으로 KRWK를 특정 외부 제공자 후보에 상장하면 모든 Fireblocks 고객에게 기본 지원될 수 있다고 제안했다. 회사명은 기록하지 않는다. 이는 담당자 제안으로만 기록하며 다음은 확인되지 않았다.

- 두 업체의 정확한 법인·제품 명칭
- 현재 Network Link v2 연동 상태
- KRWK 상장 조건과 계약 구조
- USDC·USDT 거래쌍, 체인, 최소·최대 수량, 가격·정산 SLA
- `out of the box` 지원의 정확한 범위

## 4. 답변되지 않은 질문

온체인 자산 이동이 발생하는 경우 출금 시점이 결정적인지 질문했다. 구체적으로 Fireblocks가 블록체인 제출 전에 FDS·AML 등 내부 심사를 수행해 다음 결과가 생길 수 있는지 확인하고자 했다.

- 추가 지연
- 거래 실패 또는 거절
- 블록체인 거래 생성·전파 시간 외의 비결정적 대기

제공된 대화에는 이 질문에 대한 직접 답변이 없다. 따라서 다음을 미확정으로 둔다.

- 견적 실행 성공이 온체인 제출을 보장하는지
- 견적 실행과 정산 출금이 한 요청인지 별도 단계인지
- Fireblocks 정책·AML·FDS·트래블룰 검사 적용 지점
- LP 내부 심사와 승인 큐 적용 여부
- 출금 상태 전이, 최대 처리시간, timeout·거절 사유, 재시도·멱등성

## 5. 공개 명세와 대조

Fireblocks Provider Connectivity API v2 공개 명세에서 확인되는 내용은 다음과 같다.

- `/capabilities` 응답으로 `liquidity`, `transfersBlockchain`, `ramps` 등 제공자가 구현한 선택 capability를 동적으로 확인한다.
- `POST /accounts/{accountId}/liquidity/quotes`로 견적을 생성한다.
- `GET /accounts/{accountId}/liquidity/quotes/{id}`로 견적 상태·만료시각 등을 조회한다.
- `POST /accounts/{accountId}/liquidity/quotes/{id}/execute`로 유효한 견적의 자산 변환을 실행한다.
- `POST /accounts/{accountId}/transfers/withdrawals/blockchain`으로 provider account의 public-blockchain 출금을 생성하는 API가 존재한다.
- 생성·변경 요청은 `idempotencyKey`를 사용하며, 제공자는 재시도를 최소 72시간 인식해야 한다.

이 API가 명세에 존재한다는 사실은 특정 LP가 그 기능과 KRWK 거래쌍을 실제 지원한다는 뜻이 아니다.

## 6. 다음 확인 질문

1. 후보 LP별 `/capabilities` 결과와 KRWK·USDC·USDT 자산·거래쌍 지원 범위는 무엇인가.
2. 발행업체 측 호출은 Fireblocks Swap API인가, `createTransaction`인가, 두 API를 순서대로 호출하는가.
3. `execute quote` 이후 정산은 LP 내부 장부 반영과 온체인 출금으로 나뉘는가.
4. 온체인 출금 전 Fireblocks 정책·AML·FDS·트래블룰과 LP 내부 심사는 어떤 순서로 적용되는가.
5. 각 단계의 SLA, timeout, 거절·실패 코드, 멱등키와 재시도 기준은 무엇인가.
6. 견적 만료 전 `execute`에 성공했지만 정산이 실패하거나 지연될 때 가격과 자금 책임은 누가 지는가.
7. 제안된 외부 제공자 후보의 정확한 서비스 범위, 온보딩 조건, 지원 체인·거래쌍·정산 방식은 무엇인가.
