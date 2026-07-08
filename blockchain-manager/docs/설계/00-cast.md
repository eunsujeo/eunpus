---
title: 0. 구성 요소
category: 블록체인매니저
status: In Progress
---

별도 서비스인 블록체인 매니저를 백엔드가 HTTP API 로 부르고 온체인 이벤트는 메시지 큐로 받는 두 층 구조와 기능 × 사용처 표를 한 장에 정리한다.
워크스루 전체의 등장인물표로, 이후 모든 장은 이 구성 요소 이름을 그대로 쓴다.

## 구조는 두 층입니다

이 시스템은 두 층입니다. 위는 **지갑 백엔드** — 항상 직접 만들고 여기서는 **물리적으로 분리된 두 개**입니다. **Service 백엔드**는 고객 런타임(계정·주소·입금·출금·잔액)을, **Admin 백엔드**는 운영·거버넌스(정책·승인·키 운영·동결·rebalance)를 맡고, 별도 배포·권한·감사 경계로 나뉩니다. 아래는 **블록체인 매니저** — 별도 배포되는 독립 서비스로, 두 백엔드가 **HTTP API** 로 부르고 온체인 이벤트는 매니저가 **메시지 큐에 publish** 하고 백엔드가 **consume** 합니다.

```mermaid
flowchart TB
    SVC["Service 백엔드<br/>고객 런타임 · 입금·출금·잔액"]
    ADM["Admin 백엔드<br/>운영·거버넌스 · 정책·승인·키·동결"]
    BM["블록체인 매니저 — 별도 서비스 · 1차 목표<br/>HTTP API: createAccount · createDepositAddress · depositAddressOf<br/>submitTransaction · balanceOf · transactionsOf …<br/>이벤트: onChainEvent → 메시지 큐 publish"]
    MQ["메시지 큐<br/>onchain-events"]
    FB["Fireblocks"]
    ETH["이더리움"]
    BASE["Base"]

    SVC -->|API| BM
    ADM -->|API| BM
    BM -.->|publish| MQ
    MQ -.->|consume| SVC
    BM --> FB
    FB --> ETH
    FB --> BASE

    classDef be fill:#dbeafe,stroke:#2563eb;
    classDef port fill:#e0e7ff,stroke:#6366f1;
    classDef vendor fill:#dcfce7,stroke:#16a34a;
    classDef chain fill:#eef2ff,stroke:#818cf8;
    classDef mq fill:#fef9c3,stroke:#ca8a04;
    class SVC,ADM be; class BM port; class FB vendor; class ETH,BASE chain; class MQ mq;
```

## 어디서 도는가 — 물리 배치

위가 논리 구조라면, 구성 요소가 실제로 **어디서 도는지**도 잡아 두면 1~8페이지가 쉽습니다. Fireblocks 기준 배치는 이렇습니다 — 서명·키·노드·전파는 **벤더 안**이고 이쪽엔 **두 백엔드·블록체인 매니저(별도 서비스)·DB 둘·Co-signer**가 남습니다.

```mermaid
flowchart LR
    subgraph OUR["인프라"]
      direction TB
      SVCBE["Service 백엔드<br/>유스케이스 · 큐 컨슈머"]
      ADMBE["Admin 백엔드<br/>정책·승인·키 운영·동결·rebalance"]
      BM["블록체인 매니저 — 별도 서비스<br/>API·메시지 큐 제공 · Fireblocks 연동 (SDK 래핑·체인 라우팅)<br/>내부 폴링 — 입금·상태 감지 (4·6장)"]
      MQ["메시지 큐<br/>onchain-events"]
      BDB[("백엔드 DB<br/>customer_ledger · 출금 지시 상태")]
      MDB[("블록체인 매니저 DB<br/>ref↔vault↔주소 매핑 · 이벤트 체크포인트")]
      COS["API Co-signer (SGX/TEE)<br/>MPC 온프렘 키 share · 자동 공동서명"]
      CB["Callback Handler<br/>정책 훅 · 승인·거부"]
    end
    FBV["Fireblocks (벤더 SaaS)<br/>vault · MPC 클라우드 share · TAP 정책<br/>노드 · 전파"]
    EVM["EVM 네트워크<br/>이더리움 · Base"]

    SVCBE -->|API| BM
    ADMBE -->|API| BM
    BM -.->|publish| MQ
    MQ -.->|consume| SVCBE
    ADMBE -->|정책·승인·운영| FBV
    SVCBE --- BDB
    ADMBE --- BDB
    BM --- MDB
    FBV <-->|서명 요청 · MPC share| COS
    COS -->|승인 질의| CB
    BM -->|주기 조회 · outbound| FBV
    FBV -.->|webhook · 보조| BM
    FBV --> EVM

    classDef svc fill:#dbeafe,stroke:#2563eb;
    classDef adm fill:#fef3c7,stroke:#d97706;
    classDef sec fill:#fee2e2,stroke:#dc2626;
    classDef data fill:#dcfce7,stroke:#16a34a;
    classDef vendor fill:#f5f5f7,stroke:#86868b;
    classDef ext fill:#eef2ff,stroke:#818cf8;
    classDef policy fill:#ffedd5,stroke:#ea580c;
    classDef mq fill:#fef9c3,stroke:#ca8a04;
    class SVCBE,BM svc; class ADMBE adm; class COS sec; class CB policy; class BDB,MDB data; class FBV vendor; class EVM ext; class MQ mq;
```

Fireblocks 기준 배치. **Service**·**Admin** 은 **물리적으로 분리**돼 각자 **블록체인 매니저 API** 를 부른다 — **블록체인 매니저는 별도 배포되는 독립 서비스**이고, Fireblocks 연동(SDK 래핑·체인 라우팅)은 매니저 내부 구현이다. **ref↔vault↔주소 매핑과 이벤트 체크포인트는 블록체인 매니저 DB**, **원장(customer_ledger·귀속·잔액)과 출금 지시 상태는 백엔드 DB**에 둔다. 서명은 **벤더 단독이 아니다** — MPC 키 share 하나는 **보안 존(SGX/TEE)의 API Co-signer**가 들고 매 서명마다 **공동서명**하며 서명 직전 **Callback Handler**(정책 훅)가 승인·거부를 건다. vault·MPC 클라우드 share·노드·전파는 벤더 몫이다(5·6장). 입금·상태 **감지는 매니저 내부 폴링이 벤더로 나가는 주기 조회**(outbound)이고, webhook 은 환경이 허용할 때 붙이는 보조다(4장). 감지 결과는 매니저가 **메시지 큐(onchain-events 토픽)에 publish** 하고 백엔드의 큐 컨슈머가 consume 한다.

## Fireblocks 기능 × 사용처 표

매니저 API 오퍼레이션들은 어디서 왔을까요. **Fireblocks 의 API 표면을 분석한 결과**입니다.

| 기능 | Fireblocks 표면 | 온보딩 | 입금 | 출금 | 운영·CS | 매니저 API | 백엔드 | 페이지 |
|---|---|---|---|---|---|---|---|---|
| 고객 계정 생성 | createVaultAccount | ● | | | | `createAccount` | S | 1장 |
| 입금 주소 **생성** | createVaultAsset · 자산 지갑 활성화 (EVM=단일) | ● | ● | | | `createDepositAddress` | S | 2장 |
| 입금 주소 **조회** | (매니저 DB 읽기 · Fireblocks 왕복 없음 — API 1홉) | | ● | | ● | `depositAddressOf` | S | 3장 |
| 수신·확정 이벤트 | 매니저 내부 폴링 (webhook 보조) | | ● | ● | | `onChainEvent` — 메시지 큐 publish/consume | S | 4장 |
| 수수료 추정 | estimateFee | | | ● | | `estimateFee` | S | 7장 |
| 출금 제출 | **createTransaction** | | | ● | | `submitTransaction` | S | 6장 |
| 상태 조회 | getTransactionById | | | ● | ● | `statusOf` | S·A | 6장 |
| 막힌 출금 재촉·취소 | boost / cancel | | | ● | ● | `boost` `cancel` | A | 6장 |
| 잔액 (가용·대기·잠김) | getVaultAccountAsset | | ● | ● | ● | `balanceOf` | S·A | 8장 |
| 내 거래 이력 | 거래 목록 조회 | | | | ● | `transactionsOf` | S·A | 8장 |
| 서명 정책 (한도·화이트리스트) | co-signer · Callback Handler — 서명 직전 재검증 | | | ● | ● | (동사 없음 — 서명 관문) | A | 6장 |
| gas 조달 | Universal Gasless (대납 — 스테이블코인 전용이라 ETH 이동 없음) | | | ● | ● | (동사 없음 — 운영·설정) | A | 문서 |
