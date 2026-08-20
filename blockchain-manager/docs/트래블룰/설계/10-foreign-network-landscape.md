---
title: 10. 해외 솔루션 지형 — 주요 솔루션·거래소·Notabene 도달 여부
status: To Do
---

해외 상대가 어느 트래블룰 솔루션에 있고, 우리 Notabene 게이트로 도달되는지를 정리한다 — 6장 병행 구성·게이트 배치의 배경이다.
이 장은 공개 웹 자료(2024–2025) 기준이다 — Fireblocks 공식 문서가 아니라 각 솔루션·거래소 공지·업계 보도가 근거이며, 회원 구성은 수시로 바뀐다. 우리 설계에서 해외 상대는 Notabene 게이트로 라우팅하므로, 관심은 "어느 거래소가 어느 솔루션이냐"보다 **"Notabene 게이트로 도달되느냐"**다.

## 큰 갈래 셋 + 게이트웨이

해외는 국내처럼 두 솔루션으로 깔끔히 갈리지 않는다. 큰 갈래는 셋이고, 거래소는 보통 여러 솔루션에 걸쳐 있다.

- **TRUST** — Coinbase 주도, 미국·글로벌. 2025 초 기준 125+ VASP. 회원사끼리 종단간 암호화로 직접 전송하고 중앙 저장은 없다.
- **GTR(Global Travel Rule)** — Binance 계열(Infozone Technologies) 주도 얼라이언스. 세계 top 10 거래소 중 6곳(Binance·Bitget·BingX·Bybit·Gate.io·OKX) 온보딩. CODE·Sygna·Sumsub 과 협력.
- **Sygna Bridge** — CoolBitX 단일 벤더, 아시아권.
- **Notabene** — 솔루션이 아니라 프로토콜 비종속 **게이트웨이**. TRP·OpenVASP·TRUST·TRNow·Sygna·TRISA·Shyft·Netki 를 브릿지한다. **VerifyVASP 는 게이트웨이 지원 대상이나 라이브 여부가 공개 자료로 불확실**하다(검증은 9장).

## 거래소 ↔ 솔루션 ↔ 도달

| 거래소 | 주 소속 솔루션 | Notabene 게이트 도달 |
|---|---|---|
| Coinbase · Kraken · Gemini · Crypto.com · Binance.US · PayPal · Revolut · bitFlyer · Coincheck | TRUST | ○ — Notabene 이 TRUST 를 브릿지 |
| OKX · Bybit | GTR + TRUST 양쪽 | ○ — TRUST 경로로 우회 도달 |
| Binance(글로벌) · Bitget · BingX · Gate.io | GTR 중심 | △ Notabene 으로는 불가 — Sumsub/GTR 제공자 추가로 도달 |

## 설계상 주의 — 제공자 선택으로 닫히는 공백

Notabene 이 브릿지하는 목록에 **GTR·CODE 는 없다**(TRUST·Sygna 등은 있음). 그래서 우리가 붙인 **Notabene 게이트만으로는 GTR 단독 상대(대표적으로 Binance 글로벌)에 도달하지 못한다.** 다만 이는 도달 불가가 아니라 **제공자 선택 문제**다 — Fireblocks 는 여러 트래블룰 제공자를 **TRLink 프레임워크**로 얹을 수 있고, 그중 **Sumsub 이 GTR·CODE·Sygna 를 포함해 1,800+ VASP 를 커버**한다(GTR 자체도 Fireblocks 연동 확대 중). 즉 GTR 상대까지 열려면 Notabene 외에 **Sumsub(또는 GTR 직접) 제공자를 추가**하면 된다. TRUST 에도 걸친 OKX·Bybit 은 지금도 TRUST 경로로 우회된다.

**TRLink 는 제공자가 아니라 Fireblocks 의 프레임워크**다. Notabene 은 직접 통합이고 GTR·Sumsub 등은 이 TRLink 로 붙는다(6장의 제공자 목록 "Sumsub·GTR(TRLink)" 표기가 이 프레임워크를 가리킨다). 다만 Sumsub 경유로 GTR·CODE 에 도달할 때 원화 임계·역추적 같은 솔루션 전용 기능이 보존되는지는 확인 대상이다(14장).

근거(공개 웹): [Binance GTR 가입](https://www.binance.com/en/blog/compliance/binance-joins-the-global-travel-rule-alliance-to-advance-interoperable-compliance-and-strengthen-security-7936965740530669104) · [GTR 얼라이언스](https://www.globaltravelrule.com/en/home) · [TRUST 회원](https://www.coinbase.com/travelrule) · [Notabene 지원 프로토콜](https://notabene.id/travel-rule-messaging-protocols) · [Fireblocks 컴플라이언스·TRLink](https://www.fireblocks.com/platforms/compliance) · [Sumsub×Fireblocks — GTR·CODE·Sygna·1,800+ VASP](https://docs.sumsub.com/docs/fireblocks-integration).
