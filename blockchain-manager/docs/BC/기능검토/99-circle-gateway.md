---
title: Circle Gateway (참고) — Fireblocks 뒤에 있는 것
status: To Do
ref: 참고
---

[USDC Gateway](02-usdc-gateway.md)는 Fireblocks 가 **Circle Gateway** 를 감싼 것이다. 이 문서는 Circle 쪽 문서만 정리한다. 직접 붙이는 경우([브릿지 — 선택지](../../블록체인매니저/브릿지/02-options.md))를 견적할 때의 재료이기도 하다.

출처는 Circle 개발자 문서 — [개요](https://developers.circle.com/gateway) · [기술 가이드](https://developers.circle.com/gateway/references/technical-guide) · [수수료](https://developers.circle.com/gateway/references/fees) · [지원 체인](https://developers.circle.com/gateway/references/supported-blockchains).

## 구성 요소 셋

| | 무엇 |
|---|---|
| **Gateway Wallet 컨트랙트** | 소스 체인마다 배포. 예치를 받는다. 비수탁 — 사용자 서명 없이는 Circle 이 옮기거나 소각할 수 없다 |
| **Gateway Minter 컨트랙트** | 목적지 체인마다 배포. Gateway 시스템이 서명한 attestation 을 받아 USDC 를 mint 한다. Wallet 컨트랙트가 없는 체인에도 배포될 수 있다 |
| **Gateway 시스템** | Circle 이 운영하는 오프체인 시스템. API 를 제공하고 온체인 이벤트를 관찰하며, 목적지의 mint 가 소스의 burn 과 1:1 로 대응하도록 맞춘다 |

잔액의 중심은 온체인이 아니라 **Gateway 시스템의 오프체인 원장**이다. `(체인, 토큰, 주소)` 조합마다 추적되고 온체인 상태와 최종적으로 일치한다.

## 순서 — mint 가 먼저, burn 이 나중

| 입력 | 시스템의 반응 |
|---|---|
| `Deposit` 이벤트 | 잔액 증가 |
| 전송 요청 — attestation 발급 | 잔액 감소 |
| `AttestationUsed` 이벤트 | **소스 체인에 burn intent 제출** |
| attestation 이 미사용으로 만료 | 잔액 복구 |
| `WithdrawInitiated` 이벤트 | 잔액 감소 |

목적지에서 mint 가 일어난 뒤에 소스 체인 burn 이 들어간다. 예치는 그때까지 Wallet 컨트랙트에 남아 있다.

**모든 온체인 이벤트는 파이널라이즈된 뒤에만 관찰한다.** attestation 은 **10분** 뒤 만료되고, 쓰이지 않으면 잔액이 되돌아온다.

전송 명세(`TransferSpec`)의 `keccak256` 해시가 mint 거래와 burn 거래 양쪽에서 이벤트로 나온다. 이것이 크로스체인 식별자이자 재사용 방지 값이고, mint 와 burn 의 1:1 대사를 가능하게 한다.

## 왜 7일 인출이 있나

Circle API 가 장기간 불가할 때를 위한 **무신뢰 인출** 경로다. `initiateWithdrawal` 을 호출하고 **7일** 뒤 `withdraw` 로 완료한다.

Circle 은 이 지연이 **attestation 을 즉시 발급할 수 있게 하는 근거**라고 밝힌다 — 대응하는 burn 거래를 제출할 시간이 보장되기 때문이다.

## 예치 — 일반 전송으로 보내면 잃는다

Wallet 컨트랙트는 예치 메서드 넷을 노출한다.

| 메서드 | 무엇 |
|---|---|
| `deposit` | **미리 allowance 를 준 뒤** 컨트랙트에 예치 |
| `depositFor` | 같은 동작. 잔액을 다른 예치자 앞으로 적립 |
| `depositWithPermit` | EIP-2612 permit 서명으로 예치. 서명자 앞으로 적립 |
| `depositWithAuthorization` | ERC-3009 authorization 서명으로 예치. 서명자 앞으로 적립 |

**표준 ERC-20 transfer 로 Wallet 컨트랙트 주소에 USDC 를 보내면 그 USDC 는 소실된다.** Circle 이 경고로 명시한다. Gateway 잔액을 얻으려면 반드시 위 메서드를 호출해야 한다.

여기서 [기능](02-usdc-gateway.md)의 자동 승인 거래가 설명된다 — Fireblocks 가 체인마다 첫 입금에서 `APPROVE` 를 먼저 내는 것은 `deposit` 이 allowance 를 요구하기 때문이다. Circle 은 가능하면 서명 기반(`depositWithPermit`·`depositWithAuthorization`)을 쓰라고 권하고, `approve` + `deposit` 을 쓰면 **두 개의 별개 거래로 취급해 상태를 따로 보이라**고 한다. Fireblocks 가 승인 거래를 거래 목록에 별도 항목으로 띄우는 것이 이 형태다.

예치는 파이널라이즈·처리된 뒤에야 전송에 쓸 수 있다. **대기 중 예치는 잔액과 별도로 봐야 한다** — `/v1/deposits` 가 `pending` 예치를, `/v1/balances` 가 쓸 수 있는 잔액을 준다.

## 전송과 인출

**즉시 전송** — burn intent 를 만들어 잔액 소유 주소(또는 위임 주소)로 서명하고 `/v1/transfer` 에 낸다. attestation 과 서명을 받아 목적지 체인의 minter 컨트랙트를 호출해 mint 한다. Forwarding Service 에 맡기면 이 mint 호출을 Circle 이 대신 낸다.

`destinationCaller` 를 지정하면 그 주소만 attestation 을 쓸 수 있다 — mint 를 다른 온체인 동작과 묶을 때 선점을 막는 용도다.

**같은 체인 인출도 전송 흐름을 탄다.** 목적지 체인을 소스와 같게 두면 된다. Wallet 컨트랙트에서 USDC 를 빼는 모든 경로에 사용자 서명이 끼도록 하기 위해, 단순 출금이 아니라 mint + burn 으로 처리한다. 수수료는 burn 가스만 붙는다.

## 위임

예치 잔액에 대해 다른 주소가 전송을 서명하게 할 수 있다. `addDelegate` / `removeDelegate` 를 **체인마다** 호출한다. 위임은 **그 잔액 전체에 대한 allowance** 와 같다.

위임을 해제해도 **해제 전에 만든 서명은 온체인 실행에 여전히 유효하다.** 만료될 때까지 살아 있다.

위임 주소는 EOA 또는 ERC-1271 로 서명하는 컨트랙트다.

## 수수료

**전송 수수료** — 크로스체인 전송에 **0.005%**(0.5 bp). burn 시점에 통합 잔액에서 차감. **같은 체인 인출은 전송 수수료가 없다.**

**가스 수수료** — burn intent 마다 소스 체인 실행 비용. 체인별 고정값이다.

| 소스 체인 | 가스 수수료 (USDC) |
|---|---|
| Ethereum | $1.00 |
| Solana | $0.15 |
| HyperEVM | $0.05 |
| Avalanche | $0.02 |
| Arbitrum · Base · Sonic · World Chain | $0.01 |
| OP · Polygon PoS | $0.0015 |
| Sei · Unichain | $0.001 |

**전달 수수료** — Forwarding Service 를 쓰면 **서비스 수수료 $0.05 정액** + 목적지 체인 mint 가스(위 표와 비슷한 수준). `/estimate` 를 `enableForwarder=true` 로 호출하면 `forwardingFee` 로 두 항목 합계가 온다.

`maxFee` 는 이렇게 잡는다.

```
maxFee ≥ 가스 수수료 + 전달 수수료 + (전송액 × 0.00005)
```

Base 에서 1,000 USDC 를 보내면 전달 서비스 없이 최소 $0.06, 전달 서비스를 쓰면 최소 $0.12 다. 가스 변동을 감안해 여유를 두라고 안내한다.

비용을 줄이는 방법으로 둘을 든다 — 잔액을 가스가 싼 체인(OP·Polygon PoS·Sei·Unichain)에 두고, burn intent 를 묶는다(추가 burn intent 마다 mint 가스가 약 60k gas 늘어난다).

## 지원 체인과 예치 대기

메인넷 12 · 테스트넷 13. **Solana 가 들어 있다** — Fireblocks 표에는 없다.

예치가 통합 잔액에 반영되기까지 체인별 확정 대기가 있다. attestation 발급도 그 뒤다.

| 체인 | 블록 수 | 평균 시간 |
|---|---|---|
| Ethereum · Arbitrum · Base · OP · Unichain · World Chain | ~65 ETH 블록 | **~13~19분** |
| Avalanche · Sonic | 1 | ~8초 |
| Polygon PoS · Solana | ~2~3 | ~8초 |
| HyperEVM · Sei | ~1 | ~5초 |
| Arc testnet | ~1 | ~0.5초 |

**"500ms 미만" 은 잔액이 확립된 뒤의 전송 시간**이다. 예치부터 세면 이더리움·Base 계열은 13~19분이 앞에 붙는다. Circle 은 이 대기를 CCTP 와 대비해 **선불로 치르는 확정 대기**로 설명한다 — 전송 도중이 아니라 미리 기다린다.

Circle 은 이 대기가 긴 경우를 위해 제3자 빠른 예치 서비스(예: Eco)를 언급하면서, 보증·유지·감사하지 않는다고 밝힌다.

## CCTP 와의 차이

| | CCTP | Gateway |
|---|---|---|
| 쓰는 목적 | 한 체인에서 다른 체인으로 USDC 전송 | 체인 무관 단일 잔액 보유 |
| 속도 | Fast ~8~20초 · Standard 15~19분 | 잔액 확립 후 500ms 미만 |
| 잔액 모델 | 지점 간 전송 | 통합 잔액 |
| 수탁 | 비수탁 | 비수탁 + 7일 무신뢰 인출 |

## 감사

Gateway 스마트컨트랙트는 ChainSecurity · OtterSec 두 곳의 외부 감사를 받았고 보고서가 공개돼 있다.

## 우리 문서와 맞춰 볼 것

- **수탁 판단** — Wallet 컨트랙트는 비수탁이고 7일 무신뢰 인출 경로와 외부 감사 보고서가 있다. [기능](02-usdc-gateway.md)의 "자금이 Circle 컨트랙트에 있다" 와 함께 본다.
- **소요 시간** — Base·이더리움을 쓰면 예치 확정에 13~19분이 든다. [기능](02-usdc-gateway.md)에서 미확인으로 둔 것은 Fireblocks 를 통했을 때의 전체 시간이고, 그 안에 이 대기가 들어간다.
- **수수료** — Fireblocks 문서는 소스 체인 가스를 "인출 시점에 Circle 이 견적" 이라고만 한다. Circle 쪽은 체인별 고정값을 공개한다.
- **승인 거래** — Fireblocks 연동은 첫 입금에 `APPROVE` 를 쓴다. allowance 를 요구하는 `deposit` 경로다. **직접 연동하면 서명 기반 메서드도 고를 수 있다.** Fireblocks 가 그쪽을 쓰지 않는 이유는 벤더 문의 후보다.
- **직접 붙이는 경우** — permissionless 라 가입은 없다. 대신 burn intent 구성·서명, `maxFee` 산정, attestation 처리와 10분 만료, minter 호출, 위임 관리가 우리 몫이 되고 Fireblocks 의 정책·기록 경계 밖으로 나간다.

## 아직 안 본 것

- Forwarding Service 상세와 수수료 징수 방식
- 컨트랙트 인터페이스·이벤트 목록, 배포 주소
- Solana 프로그램·메시지 인코딩 차이
- ERC-1271 서명의 제약
- 웹훅
