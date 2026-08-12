# Fireblocks 담당자 후속 대화 — Private LP 제한과 KRWK 발행업체 Aggregator

- 대화일: 원문 미기재
- 기록 수령일: 2026-08-12
- 자료 성격: Fireblocks 담당자와의 Network Link v2 후속 기술 질의응답
- 적용 범위: 외부 KRWK 발행업체 사례, 우리 블록체인 지갑 설계와 무관
- 검증 상태: 담당자가 제안한 구성과 확인된 접근통제를 기록하며, 마지막 미답변 질문은 확정사항으로 사용하지 않음

## 1. 추가 질의 목적

`USDC ↔ KRWK` 거래를 KRWK 발행업체와 계약한 특정 private LP들로만 제한하면서 RFQ 기반 스왑을 제공할 수 있는 Fireblocks 구성이 있는지 다시 질의했다.

요구한 업무 흐름은 다음과 같다.

1. 기관 고객이 FX를 요청한다.
2. KRWK 발행업체가 계약한 LP들에 RFQ를 전송한다.
3. LP들이 발행업체에 견적을 응답한다.
4. 발행업체가 견적을 취합한다.
5. 발행업체가 기관 고객에게 견적 목록을 제시한다.
6. 기관 고객이 견적을 선택해 FX를 실행한다.
7. 발행업체가 온체인 정산한다.

특정 LP와 testnet에서 PoC하는 단계가 먼저 고려되고 있으며, 아직 LP는 확정되지 않았다고 설명했다.

## 2. Fireblocks가 확인하려 한 설계 요소

Fireblocks 측은 구조를 제안하기 전에 다음을 확인했다.

- 발행업체가 여러 LP의 견적을 모으는 aggregator인지, 특정 LP로 요청을 전달하는 pass-through인지
- 대상 사용자가 리테일 고객, 기관 고객, 내부 사용자인지
- LP 계약 관계와 온보딩 책임을 발행업체와 Fireblocks 중 누가 지는지
- 발행업체가 Network Link에 직접 연동하는지, LP들이 각각 연동하는지
- LP들이 Fireblocks 고객인지 외부 생태계 사업자인지

발행업체 측 답변은 다음과 같다.

- 적합한 솔루션이 없으면 발행업체가 aggregator를 직접 구현하거나 pass-through 방식도 고려할 수 있다.
- 초기 대상은 기관 고객이다.
- private LP이므로 발행업체가 관계와 온보딩을 주도하는 방향을 고려한다.
- Network Link를 사용한다면 LP가 Provider, 발행업체가 Liquidity Taker가 되는 구조로 이해하고 있었다.
- 현재 고려하는 LP 대부분은 Fireblocks 생태계 밖에 있으며, 연결 방식에 따라 Fireblocks 생태계 편입 또는 대안을 검토해야 한다.
- 목적은 LP PoC 전에 Fireblocks를 이용해 거래 기술 장벽을 낮출 수 있는지 검토하는 것이다.

## 3. Fireblocks가 제안한 KRWK 발행업체 Aggregator 구조

Fireblocks 측은 private LP를 각각 Network Link Provider로 붙이는 대신, **KRWK 발행업체가 LP 견적을 집계하는 Aggregator Service를 운영하고 이 서비스를 Network Link에 Provider로 연동**하는 구성을 제안했다.

### 온보딩

1. KRWK 발행업체가 특정 LP들의 견적과 환율을 집계한다.
2. 발행업체 Aggregator Service가 Fireblocks Network Link에 연동한다.
3. Liquidity Taker인 기관 고객은 발행업체에 KYB를 받는다.
4. 기관 고객이 발행업체에 `USD ↔ KRWK` 견적을 요청한다는 예시를 제시했다.
5. 기관 고객이 Fireblocks Console 또는 API를 통해 발행업체에 Swap Order를 요청한다.

담당자 예시에는 `USD ↔ KRWK`로 기재돼 있다. 원래 질의한 `USDC ↔ KRWK`와 같은 의미인지 확인되지 않았으므로 자산 표기를 임의로 바꾸지 않는다.

### 견적·주문 경로

```text
Liquidity Taker
  ↕
Fireblocks API / Console
  ↕
Fireblocks Provider Network
  ↕
Network Link API
  ↕
KRWK 발행업체 Aggregator Service
  ↕
계약된 Private LP들
```

이 구조에서 Fireblocks는 기관 고객과 발행업체 Aggregator를 연결하는 채널을 제공한다. private LP 대상 RFQ fan-out, 견적 집계·선정, LP 계약·온보딩은 발행업체 Aggregator 안에 남는다.

## 4. 승인된 기관 고객으로 접근 제한

Fireblocks 측은 Liquidity Taker가 **KRWK 발행업체의 기관 고객이면서 Fireblocks 고객**이어야 한다고 설명했다.

- Fireblocks는 지갑 보안 인프라·결제 기능 제공을 위해 기관 고객을 온보딩하고 KYB한다.
- 발행업체는 KRWK 시장 접근을 위해 같은 기관 고객을 별도로 온보딩하고 KYB한다.
- 발행업체가 승인한 기관 고객에게 API key를 발급한다.
- 기관 고객은 자기 Fireblocks workspace에 이 API key를 입력한다.
- 발행업체가 발급한 API key가 없으면 임의의 기관 고객은 발행업체 Aggregator Service에 직접 연결할 수 없다.

따라서 담당자 답변에서 명확히 확인된 제한은 **Liquidity Taker 접근 제한**이다. 발행업체가 승인하고 API key를 발급한 기관 고객만 서비스를 사용할 수 있다.

## 5. 구조 해석

두 연동 모델을 구분해야 한다.

| 모델 | Network Link Provider | Private LP의 Fireblocks 연동 | 발행업체 역할 |
|---|---|---|---|
| LP 직접 연동 | 각 LP | 각 LP가 직접 필요 | Liquidity Taker |
| 발행업체 Aggregator | 발행업체 Aggregator Service | Aggregator 뒤에 있으면 각 LP의 직접 연동은 제안 흐름에 나타나지 않음 | Provider·LP 집계자 |

두 번째 모델은 private LP를 발행업체가 통제하는 aggregator 뒤에 둘 수 있는 후보 구조다. 다만 `LP가 Fireblocks 생태계 밖에 있어도 아무 추가 요건 없이 연결 가능하다`는 문장으로 명시 확인된 것은 아니다. LP↔발행업체 구간의 기술·보안·정산 계약은 발행업체가 별도로 구현·운영해야 하는 것으로 해석되며 최종 확인이 필요하다.

기관 고객의 Fireblocks workspace에 `발행업체 workspace`가 붙는다고 표현하기보다, **기관 고객의 기존 Fireblocks workspace가 발행업체 발급 API key를 저장해 발행업체 Provider 서비스에 접근한다**고 설명하는 것이 담당자 답변에 가깝다.

## 6. 후속 대화에서도 답변되지 않은 항목

발행업체 측은 다음 이해가 맞는지 최종 확인을 요청했지만 제공된 대화에는 후속 답변이 없다.

- 기관 고객이 Fireblocks와 발행업체 양쪽의 승인을 받으면 자기 Fireblocks workspace에서 발행업체 서비스를 이용할 수 있는가.
- 발행업체 Aggregator Service가 Provider Connectivity API를 구현하는 접근이 맞는가.
- 발행업체 Aggregator 뒤의 private LP 공급을 해당 발행업체 전용으로 제한할 수 있는가.
- 발행업체가 LP aggregator를 직접 구축하지 않고도 사용할 수 있는 Fireblocks 대체 솔루션이 있는가.
- 기관 고객 온보딩·연동에 참고할 공식 문서는 무엇인가.

앞선 대화에서 남은 다음 질문도 여전히 답변되지 않았다.

- 견적 실행과 온체인 정산의 정확한 API 순서
- 온체인 전송 전 Fireblocks·LP의 FDS·AML·트래블룰 심사와 최대 지연
- 정산 실패·timeout·재시도·가격 책임

## 7. 다음 확인 질문

1. 발행업체 Aggregator가 Network Link Provider로 등록하는 구성이 공식 지원 모델인지 최종 확인한다.
2. 기관 고객의 API key 등록·회전·폐기·권한 범위와 workspace 설정 절차를 확인한다.
3. Fireblocks KYB와 발행업체 KYB의 순서, 상태 동기화, 어느 한쪽 해지 시 접근 차단 절차를 확인한다.
4. `USD ↔ KRWK` 예시가 `USDC ↔ KRWK`를 의미하는지, USDC·USDT를 어떤 asset ID와 체인으로 노출하는지 확인한다.
5. 발행업체 Aggregator가 여러 private LP에 RFQ를 전파하고 결과를 집계하는 부분은 발행업체 자체 구현인지 Fireblocks가 제공하는지 확인한다.
6. 발행업체 뒤의 private LP가 Fireblocks 고객이 아니어도 되는지와 LP별 KYB·정산·감사 요건을 확인한다.
7. Fireblocks Console/API에서 견적 목록·선택·Swap Order가 어떻게 노출되는지 공식 고객용 API 문서를 요청한다.
8. 견적 실행 이후 오프체인 원장 반영과 온체인 정산의 상태·SLA·실패 보상 규칙을 확인한다.
