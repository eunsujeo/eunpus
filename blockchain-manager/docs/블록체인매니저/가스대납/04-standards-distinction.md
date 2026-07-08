---
title: 4. 일반 표준과의 구분 — GSN·ERC-4337 Paymaster
status: To Do
---

가스 대납이라는 같은 문제를 푸는 두 일반 표준 — GSN 과 ERC-4337 Paymaster — 을 나란히 놓고, Fireblocks 가 왜 이 둘을 그대로 쓰지 않는지 정리한다.
GSN·ERC-4337 은 공개 명세에 대한 저자 정리이므로, 실제 적용 전 명세 원문 확인을 권한다. Fireblocks 의 Gasless·Gas Station 은 공식 문서로 확인된 사실이다.

## 같은 문제, 두 일반 표준

"사용자에게 ETH 를 쥐여 주지 않고 거래를 내보낸다"는 문제는 우리만 푸는 게 아니다. EVM 생태계에는 같은 목표를 겨냥한 공개 표준이 둘 있다 — **GSN(Gas Station Network)** 과 **ERC-4337 Paymaster**. 아래는 이 두 표준을 공개 명세 기준으로 정리한 것이고, **Fireblocks 는 이 둘을 그대로 채택하지 않는다**. 왜 그런지는 표 다음 관계 정리에서 짚는다.

| 항목 | GSN (Gas Station Network) | ERC-4337 Paymaster |
|---|---|---|
| **무엇** | meta-transaction relay 네트워크 — 사용자는 서명만 하고, relayer 가 대신 온체인 제출하며 gas 를 낸다 | account abstraction 의 gas 대납 컨트랙트 — UserOperation 의 gas 를 스폰서하거나 ERC-20(USDC 등)으로 받는다 |
| **전제** | 수신 컨트랙트가 ERC-2771(trusted forwarder)을 지원해야 한다 — 일반 ERC-20 전송엔 못 쓴다 | 지갑이 smart account 여야 하고, EntryPoint·bundler 인프라가 필요하다 |
| **왜 쓰나** | ETH 없는 사용자의 온보딩 UX | gasless UX · 토큰으로 수수료 · 스폰서십 |
| **체인** | EVM (수신 컨트랙트가 ERC-2771 을 지원할 때) | EntryPoint 가 배포된 EVM 전반 — Base 생태계가 활발하다 |
| **현황** | 생태계가 4337 로 이동 — GSN 계보 자체는 쇠퇴 | account abstraction 표준의 주류 |

두 표준의 갈림은 **전제**에서 가장 뚜렷하다. GSN 은 *받는 쪽 컨트랙트*가 ERC-2771 을 미리 심어 둬야 동작하므로, 그런 지원이 없는 평범한 ERC-20 토큰 전송에는 손을 대지 못한다. ERC-4337 은 *보내는 쪽 지갑*을 smart account 로 바꾸고 EntryPoint·bundler 라는 별도 실행 인프라를 깔아야 한다. 둘 다 "사용자가 자기 지갑에서 직접 거래를 보낸다"는 세계관을 공유한다.

## 관계 정리 — Fireblocks 는 어디에 서 있나

Fireblocks 는 이 두 표준을 부품처럼 골라 재조합한다.

- **GSN 과의 관계** — Fireblocks 는 GSN "네트워크"에 참여하는 게 아니라, 그 밑에 깔린 **ERC-2771 표준을 자체 relay 로 구현**했다. 즉 공개된 relayer 네트워크 대신 Fireblocks Relay 라는 자기 발신 경로를 쓴다.
- **ERC-4337 과의 관계** — Fireblocks 는 Paymaster(4337) 노선을 택하지 않고 **EIP-7702 노선**으로 간다. smart account + EntryPoint + bundler 스택을 도입하는 대신, 기존 EOA 에 코드를 위임하는 방향이다.
- **이름 함정 — Gas Station ≠ GSN** — Fireblocks 의 **"Gas Station"(가스 충전 자동화 기능)** 은 GSN(Gas Station Network)과 **이름만 비슷할 뿐 무관**하다. 이름이 헷갈리기 쉬우니 둘을 섞지 않는다.

두 일반 표준이 우리와 결정적으로 다른 지점은 **누가 거래를 발신하느냐**다. GSN·ERC-4337 은 *사용자가 자기 지갑에서 직접* 거래를 보내는 모델의 도구다. 반면 우리 모델은 **모든 거래를 수탁자 vault 가 발신**한다 — 사용자는 지갑 키도, vault 의 존재도 다루지 않는다. 그래서 사용자-발신 모델에서 이 두 표준이 맡던 자리를, 수탁자-발신 모델에서는 **Fireblocks Gasless 가 대신** 채운다.

정리하면 GSN·ERC-4337 은 "비교 대상"이지 "채택 후보"가 아니다. Fireblocks 는 GSN 에서 ERC-2771 이라는 뼈대만 빌려 자체 relay 로 구현했고, 4337 대신 EIP-7702 를 골랐다. 두 표준의 구성요소·흐름·정산 구조를 뜯어보는 상세는 6~10장(서명·제출 분리 계보, GSN 상세, ERC-4337 Paymaster, EIP-7702)에서 이어진다.
