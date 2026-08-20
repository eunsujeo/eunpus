# Fireblocks 담당자 대화 — Payments Ramp·Trading API

- 대화일: 원문 미기재
- 기록 수령일: 2026-08-12
- 자료 성격: 외부 KRWK 발행업체와 Fireblocks 담당자의 기술 질의응답
- 적용 범위: 우리 블록체인 지갑 설계와 무관한 외부 발행업체 사례
- 익명화: KRWK 발행업체와 제3자 제공자 회사명·담당자명은 기록하지 않음

## 1. 질의 배경

KRWK 발행업체는 이전 Fireblocks Network for Payments 설명 이후 Ramp·FX·별도 결제 네트워크의 API 경계를 확인했다. 발행업체 측은 기존 스테이블코인 mint API의 sandbox 연동 테스트를 마친 상태라고 설명했다.

사업은 초기 검토 단계이며, 선택된 파트너에게 FX 기능을 제공하되 FX 유형과 범위에 따라 다른 rail을 사용할 가능성을 검토하고 있었다.

## 2. 질의와 답변

### On/Off-ramp API

질문은 기존 `createTransaction` API에서 source 또는 destination을 `EXCHANGE`로 설정하면 Fireblocks Network for Payments의 On/Off-ramp를 연동할 수 있는지였다.

Fireblocks 측은 On/Off-ramp에 다음 **Trading API**를 사용한다고 답했다.

- 거래 제공자 목록 조회
- 거래 주문 생성

따라서 대화에서 확인된 고객 측 Ramp 진입점은 Trading API다. `createTransaction + EXCHANGE`가 Ramp 주문 API라는 답은 받지 못했다.

### PSP 견적과 사전 연결

질문은 다음 세 가지였다.

- FX·Swap이 Network Link v2를 통해 이뤄지는가.
- 통합 PSP가 별도 설정 없이 자동으로 USDC 교환 견적을 반환하는가.
- PSP 범위에 일반 Ramp Provider뿐 아니라 Market Maker도 포함되는가.

Fireblocks 측은 다음과 같이 답했다.

- 통합 Ramp Provider의 견적은 **Trading API**로 반환된다.
- Account-based Ramp Provider를 사용하려면 해당 제공자 계정과 적절한 API key가 필요하다.
- 이 계정을 Fireblocks Console의 **Connected Accounts**에서 연결해야 한다.

Market Maker가 PSP 범위에 포함되는지는 직접 답변하지 않았다. 제공자가 Fireblocks에 통합돼 있다는 사실만으로 모든 고객에게 견적이 자동 반환된다는 답도 아니다. 고객 계정 연결과 제공자별 기능 확인이 필요하다.

### Console Swap

Fireblocks 측은 Swap 기능을 Console과 Trading API 양쪽에서 사용할 수 있다고 설명했다. 다만 Console이 API의 모든 기능과 정확히 1:1인지는 별도로 설명하지 않았다.

### 별도 결제 네트워크·Gateway 계열

별도 결제 네트워크와 Gateway·Stable FX 계열의 연동 인터페이스를 질문했다. Fireblocks 측은 결제 네트워크 관련 정보를 이메일로 보내겠다고 답했지만, 제공된 대화에는 후속 내용이 없다. Gateway·Stable FX 계열에 대한 직접 답변도 없다.

### 발표 자료

이전 세션 발표 자료 공유를 요청했지만 제공된 대화에는 자료 전달 여부가 없다.

## 3. Fireblocks가 제안한 발행업체 Provider 모델

Fireblocks 측은 KRWK 발행업체가 Network Link v2의 Ramp Provider로 연동할 가능성을 제시했다. 이 모델에서는 발행업체가 KRW Ramp 서비스를 Fireblocks 고객에게 제공하고, 한국으로 들어오거나 나가는 cross-border payment를 지원하는 Provider 역할을 맡는다.

이는 **KRWK 발행업체 측 사업 모델**이다. 우리 블록체인 지갑 서비스가 Ramp Provider가 되거나 같은 기능을 구현한다는 의미가 아니다.

## 4. 대화에서 확인된 경계

| 관점 | 인터페이스 | 전제 |
|---|---|---|
| Fireblocks 고객이 Ramp·Swap 사용 | Trading API·Console | Account-based Provider이면 제공자 계정·API key·Connected Account 필요 |
| KRWK 발행업체가 Ramp 서비스 제공 | Network Link v2 Provider Connectivity | Provider 온보딩·Ramp capability 구현 필요 |
| 단순 자산 이동 | `createTransaction` 가능성 | Ramp 주문 진입점으로는 이번 답변에서 확인되지 않음 |
| 별도 결제 네트워크·Gateway | 미확정 | 후속 이메일·답변 없음 |

## 5. 미확정 질문

1. Ramp 주문과 실제 입출금 과정에서 `createTransaction`이 내부적으로 어느 단계에 사용되는가.
2. Trading API의 quote·rate·order 중 각 Ramp Provider가 지원하는 기능은 무엇인가.
3. Market Maker가 Trading Provider 또는 PSP로 등록되는 조건은 무엇인가.
4. Console Swap과 Trading API의 기능·상태·권한이 정확히 1:1인가.
5. 별도 결제 네트워크·Gateway·Stable FX 계열의 고객 API와 Provider API는 무엇인가.
6. KRWK 발행업체가 Network Link v2 Ramp Provider가 될 때 필요한 온보딩·규제·정산·SLA 요건은 무엇인가.
7. 이전 세션 발표 자료와 결제 네트워크 후속 이메일은 전달됐는가.
