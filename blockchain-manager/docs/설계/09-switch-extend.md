---
title: 9. 확장 — EVM 체인 확장·매니저 교체
category: 블록체인매니저
status: To Do
---

포트가 EVM 체인 확장과 매니저 교체를 흡수하는 법 — Service·Admin 백엔드 변경 0줄.
같은 EVM 어댑터에 체인·자산 등록만 추가하면 새 L2 를 태운다. 벤더 교체는 코드가 아니라 자금 이전(sweep)이 비용의 전부다.

# 확장 — 포트가 EVM 체인 확장·매니저 교체를 흡수하는 법

체인은 어댑터 등록, 벤더는 자금 이사 — 포트가 두 변화를 흡수한다

## EVM 체인 확장 — Base 는 이미 붙었다

```mermaid
flowchart LR
    SVC["Service 백엔드<br/>변경 0줄"]
    ADM["Admin 백엔드<br/>변경 0줄"]
    PORT["포트 (통로)<br/>같은 동사 · 체인 분기 숨김"]
    ADP["Fireblocks 어댑터<br/>체인·자산 등록만 추가"]
    ETH["이더리움<br/>(붙어 있음)"]
    BASE["Base<br/>(이미 붙음 — 같은 EVM 어댑터)"]
    L2["다른 EVM L2<br/>(등록 한 줄이면 태운다)"]

    SVC --> PORT
    ADM --> PORT
    PORT --> ADP
    ADP --> ETH
    ADP --> BASE
    ADP -.등록만 추가.-> L2

    classDef be fill:#dbeafe,stroke:#2563eb;
    classDef port fill:#e0e7ff,stroke:#6366f1;
    classDef impl fill:#dcfce7,stroke:#16a34a;
    classDef chain fill:#eef2ff,stroke:#818cf8;
    class SVC,ADM be; class PORT port; class ADP impl; class ETH,BASE,L2 chain;
```

## EVM 이 아닐 때 — Solana 를 붙인다면

| 다시 봐야 하는 것 | EVM 전제 | Solana 를 붙일 때의 결정 |
|---|---|---|
| **주소 형식 검증** (validateAddress) | 0x + 체크섬 — 로컬 규칙 하나 | 주소 형식이 다르다 — 로컬 규칙(AddressRules)에 그 체인의 형식을 추가해야 검증이 선다 |
| **체인 특화 파라미터** | ChainSpecific = Evm(nonce) 하나 | 새 타입을 추가한다 — sealed 라 추가만 하고 기존 EVM 의미는 안 바뀐다 |
| **막힘 대응** (6장 boost·cancel) | 같은 순번 재전송(RBF) 전제 | 같은 의미의 동작이 그 체인에 있는지부터 확인 — 없으면 **기능 부재로 선언**(capability 미구현)하고 막힘 운영 절차를 따로 설계 |
| **확정 판정** (4장) | confirmation 누적 ≥ DCCP 임계 | 그 체인의 확정 개념을 벤더가 어떤 상태·카운트로 번역해 주는지 확인하고 임계를 다시 정한다 |
| **입금 주소 모델** (2장) | vault·자산당 단일 주소 · memoTag null | 주소·memoTag 정책이 체인마다 다르다 — 2장의 단일 주소 전제를 재확인 |
| **gas 조달** | Universal Gasless — EIP-7702 기반, EVM 전용 | 그대로 이식되지 않는다 — 그 체인의 수수료 조달(네이티브 토큰 보유 여부 포함)을 별도로 결정 |

노드·서명·전파는 여전히 벤더 몫이다 — 위 목록은 전부 **우리 쪽 경계(어댑터 등록·로컬 규칙·정책)**의 결정이고, Solana 열의 각 항목은 적용 전 벤더 문서로 확인한다.

## 매니저(벤더) 교체 — 코드는 어댑터, 비용은 자금 이전

지금 매니저는 Fireblocks 이지만, 포트로 감쌌으므로 **다른 벤더로 바꾸거나 vault 구성을 재편해도** 두 백엔드는 그대로여야 합니다. 코드 관점에서 벤더 교체는 **어댑터를 하나 더 만들고 주입을 바꾸는 설정 수준**의 일입니다.

그런데 **한 가지는 설정으로 안 됩니다.** 벤더 A 의 주소는 A 의 키에서, 벤더 B 의 주소는 B 의 키에서 나옵니다(2장). 그래서 **주소와 그 위의 잔액은 이전되지 않습니다.** 이건 vault 를 재구성할 때도 마찬가지입니다 — 새 vault 의 주소는 새 키에서 나오니까요. 즉 **코드 교체는 싸고, 자금 이전(sweep)이 비용의 전부**입니다.

```mermaid
flowchart LR
    A["교체 시점<br/>어댑터·주입 변경<br/>신규 발급부터 새 주소"] --> B["이중 감시 기간<br/>구 주소 watch-list 유지<br/>(늦은 입금 수용)"]
    B --> C["이사 (sweep)<br/>구 주소 잔액을<br/>새 vault 로 출금"]
    C --> D["종료<br/>구 주소 안내 중단<br/>DB에 세대 기록"]

    classDef step fill:#dbeafe,stroke:#2563eb;
    classDef warn fill:#fef3c7,stroke:#d97706;
    class A,D step; class B,C warn;
```

벤더 교체(또는 vault 재구성) 운영 타임라인. 파랑은 값싼 코드·설정 작업, **노랑 구간이 비용의 전부**다. 그 비용은 **구 주소 수와 잔액에 비례**한다 — 옮길 돈이 많을수록 sweep 출금 건수·수수료가 는다. 늦은 입금을 놓치지 않도록 구 주소 watch-list 를 한동안 유지하다가, 잔액을 새 vault 로 출금(6장 출금 그대로)하고, DB 에 주소의 세대를 기록해 닫는다. 서명 관문의 규칙(화이트리스트·한도)도 새 벤더의 거버넌스 정책으로 이관하고 동등성을 검증하는 것까지가 교체다(6장).

## 코드 구조 — 이 문서를 모노레포로 옮기면

지금까지의 구성 요소(0장)와 성질이 코드에서 강제되려면 **모듈 경계가 곧 설계 경계**여야 합니다.

모듈 사이의 **의존 방향**이 이 문서의 성질들을 컴파일 타임에 강제합니다. 화살표는 "의존한다"라는 뜻이고, 전부 안쪽(domain)을 향합니다.

```mermaid
flowchart TB
    SAPI["apps/service-api<br/>(DI — 어댑터 주입)"]
    AAPI["apps/admin-api<br/>(DI — 어댑터 주입)"]
    HOOK["apps/poller"]
    SBE["backend/service"]
    ABE["backend/admin"]
    FBA["adapters/fireblocks<br/>주 구현"]
    FAKE["adapters/fake<br/>테스트용"]
    DOM["domain<br/>포트 + 값 객체 — 의존 0"]
    SDK["Fireblocks SDK (외부)"]

    SAPI --> SBE
    AAPI --> ABE
    SAPI -.주입.-> FBA
    AAPI -.주입.-> FBA
    SBE --> DOM
    ABE --> DOM
    FBA --> DOM
    FAKE --> DOM
    FBA --> SDK
    HOOK --> DOM

    classDef mine fill:#dcfce7,stroke:#16a34a;
    classDef impl fill:#dbeafe,stroke:#2563eb;
    classDef core fill:#e0e7ff,stroke:#6366f1;
    classDef ext fill:#f5f5f7,stroke:#86868b;
    class SBE,ABE mine; class FBA,FAKE impl; class DOM core; class SAPI,AAPI,HOOK,SDK ext;
```

## 인프라 — 무엇이 어디서 도는가

0장 에서 본 배치를 확장 관점으로 다시 봅니다. Fireblocks 기준이라 서명·키·노드·전파는 **벤더 안**이고, 이쪽엔 **두 백엔드와 폴링 워커, DB**만 남습니다. 직접 노드·HSM·인덱서를 운영하지 않으므로, 새 EVM 체인이 붙어도 **인프라 배치는 그대로**입니다 — 벤더가 그 체인을 지원하기만 하면 됩니다.

```mermaid
flowchart LR
    subgraph OUR["인프라"]
      SAPI["Service 백엔드<br/>고객 런타임"]
      HOOK["폴링 워커<br/>입금·상태 감지 — 주기 조회 (4·6장)"]
      AAPI["Admin 백엔드<br/>정책·승인·sweep·rebalance"]
      DB[("DB<br/>Service·Admin 공용")]
    end
    FB["Fireblocks (벤더 SaaS)<br/>vault · MPC 서명 · TAP 정책 · 노드·전파"]
    EVM["EVM 네트워크<br/>이더리움 · Base · (다른 L2)"]

    SAPI -->|포트 호출| FB
    AAPI -->|정책·운영·sweep 호출| FB
    SAPI --- DB
    AAPI --- DB
    HOOK --- DB
    HOOK -->|주기 조회 · outbound| FB
    FB -.->|webhook · 보조| HOOK
    FB --> EVM

    classDef svc fill:#dbeafe,stroke:#2563eb;
    classDef adm fill:#fef3c7,stroke:#d97706;
    classDef data fill:#dcfce7,stroke:#16a34a;
    classDef vendor fill:#f5f5f7,stroke:#86868b;
    classDef ext fill:#eef2ff,stroke:#818cf8;
    class SAPI,HOOK svc; class AAPI adm; class DB data; class FB vendor; class EVM ext;
```
