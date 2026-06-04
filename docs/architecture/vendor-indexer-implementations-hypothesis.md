---
title: Vendor-Specific Indexer Implementations — Hypothesis (UNVERIFIED)
layer: architecture
stage: 42
date: 2026-06-01
status: hypothesis (★ unverified vendor analysis)
source_tier: LLM-generated (not Fireblocks/BitGo/Coinbase official)
reasoning_mode: hypothesis-tier hedged commentary
depends_on:
  - blockchain-indexer-architecture-reference.md — Stage 41 vendor-neutral (28 공식 출처)
related_external:
  - sources/indexer/블록체인_인덱서_구현_리서치.md (LLM-generated, unverified)
  - sources/indexer/엔터프라이즈_블록체인_인덱서_설계_구조.html (LLM-generated, unverified)
core_thesis: |
  These are HYPOTHESES, not facts.
  Promote to fact tier only after cross-verifying each claim against vendor official documentation
  or vendor engineering team confirmation.
---

# Vendor-Specific Indexer Implementations — Hypothesis (UNVERIFIED)

> ★★★ **CRITICAL DISCLAIMER** ★★★
>
> **본 페이지의 모든 fact, 수치, 아키텍처 명칭은 LLM 생성 자료 기반**. Fireblocks / BitGo / Coinbase Mesh 의 공식 문서 / engineering team / Solutions Engineer 와 cross-verify 안 됨.
>
> **운영 결정에 사용 금지** — 본 페이지는 (a) Q-2026-05-18-B03 (Fireblocks internal-tx 감지 메커니즘) 의 잠정 가설 + (b) Stage 41 의 vendor-neutral reference 와의 hypothesis-tier 대비 보존 + (c) 향후 vendor 측 cross-verification 의 reference 만 의 목적으로 작성.
>
> **혼합 금지** — 본 페이지의 fact 는 Fireblocks 공식 fact (예: DCCP, MPC-CMP, blockchains.md 의 SLA 표) 와 절대 동일 tier 로 다루지 않음. 인용 시 반드시 "본 자료에 따르면" hedged 표현 + "Q-VRF-NN" 검증 필요 마커.

---

## 0. 본 페이지의 위치 (Stage 41 reference 와의 차이)

| | Stage 41 reference | 본 페이지 (Stage 42) |
|---|---|---|
| **출처** | 28 외부 공식 source (Polkadot / SubQuery / The Graph / NEAR / Solana / Ethereum / Blockscout / AWS) | **LLM 생성 자료 (출처 없음)** |
| **Tier** | fact (vendor-neutral) | **hypothesis (unverified)** |
| **인용 형식** | 직접 인용 (source: `xxx.md`, p.N) | "본 자료에 따르면" hedged |
| **운영 사용** | ✅ 권장 | **❌ 금지 — cross-verify 후만** |
| **목적** | 일반화된 indexer 설계 reference | Q-B03 의 잠정 가설 보존 + vendor 비교 hypothesis |

---

## 1. Fireblocks 인덱서 — 본 자료에 따르면 (UNVERIFIED HYPOTHESIS)

### 1.1 Mempool 비대칭 감시 (UTXO vs Account)

본 자료에 따르면, Fireblocks 인덱서는 자산 모델별로 알림 시점이 이원화:

- **UTXO 기반 (BTC 등)**: 트랜잭션이 노드 mempool 에 진입하는 즉시 인덱서가 가로채 수신 알림
- **Account 기반 (ETH 등)**: 트랜잭션이 실제 블록에 mined 된 직후에 알림 발행 (상태 변경 원자성 보장 목적)

→ **★ Q-VRF-01 필요**: Fireblocks 공식 문서에 mempool-level 수신 알림 timing 명시 없음. webhook 의 `TransactionStatus` enum (Stage 9) 의 어느 status 에 해당하는지 cross-ref 필요.

### 1.2 비대칭 timeout 윈도우 (UNVERIFIED 수치)

본 자료의 표 인용:

| 트랜잭션 방향 | 수집 timeout | 식별 메커니즘 | 실시간 통제 |
|---|---|---|---|
| **송신 (Outgoing)** | **1분** | 주소 기반 (Address-based Resolution) | 서명 전 Policy Engine 매칭, 출금 검증·중단 |
| **수신 (Incoming)** | **10분** | tx hash 기반 (Tx Hash-based Resolution) | 입금 블록 확정 후 미달 시 UTXO 강제 빙결 |

→ **★ Q-VRF-02 필요**: 1분 / 10분 수치의 출처 미상. Fireblocks 공식 문서 / Help Center / Developer Portal 의 4 source 전수 검색에 본 수치 없음.

### 1.3 Chainalysis / Elliptic 실시간 API 연결

본 자료에 따르면 인덱싱 엔진 내부적으로 Chainalysis / Elliptic 등 서드파티 AML/CFT 시스템과 실시간 API 연결, 비대칭 timeout 윈도우 적용.

→ **Partially verified**: Fireblocks 의 AML 통합은 공식 문서에 명시됨 (Travel Rule webhook + `transaction-screening-objects.md` 의 verdict enum: `ACCEPT/REJECT/ALERT/WAIT/FREEZE/CANCEL`). 다만 "Chainalysis / Elliptic 직접 API 연결" 수준의 vendor-specific 통합은 미확인.

### 1.4 ATC (Account Traffic Control) 아키텍처

본 자료에 따르면 Fireblocks 는 EVM stuck transaction 해소를 위해 **`stuck_confirming` 지표** 를 상시 수집하는 **ATC (Account Traffic Control)** 아키텍처 운영. 실패한 nonce 를 신규 transfer 요청에 즉각 재할당.

→ **★ Q-VRF-03 필요**: "ATC" 라는 명칭은 Fireblocks 공식 문서에 없음. `stuck_confirming` 지표 명칭도 미확인. Fireblocks 의 stuck tx 해소 메커니즘 (RBF / cancel-replace 등) 은 별도 공식 문서 (`reference-transaction-rbf.md` 등) 에 일부 다뤄지지만 명칭이 다름.

### 1.5 Durable Nonces 1,000 동시 처리

본 자료에 따르면 Solana / Tron 등 서명 직렬화 지연 없는 체인에서 Durable Nonces 를 개별 tx 별 독립 생성, **vault 1 개 당 최대 1,000 건 동시 pending** 처리.

→ **Partially verified**: Stage 7 의 `solana-maximum-queued-transactions.md` 에 "최대 600 tx Queue 동시" 명시. 본 자료의 1,000 건 수치와 차이 — Solana 의 600 (공식) vs 1,000 (본 자료) 의 mismatch.

### 1.6 Stellar 라운드 로빈

본 자료에 따르면 Stellar 의 sequence number 제약 (ledger 주기 ~5초 당 1 tx) 을 우회하기 위해 **1 TPS 당 최소 10 개 wallet 라운드 로빈** 스케줄링.

→ **★ Q-VRF-04 필요**: Stellar 의 sequence 제약은 공식 (Stage 7 `funding-a-new-stellar-account.md` 등). 10 wallet 라운드 로빈 수치는 미확인.

### 1.7 BTC unconfirmed change output chain 25 한계

본 자료에 따르면 Fireblocks 는 BTC 의 25 개 unconfirmed change output chain 한계를 우회하기 위해:
- 30 초 윈도우 기반 다중 수신 주소 일괄 transaction batching
- 10 분당 발생 tx 20 건 미만 억제
- 적체 시 CPFP (Child Pays For Parent) 수수료 인상

→ **★ Q-VRF-05 필요**: BTC core 의 25 chain 한계는 BTC 공식 fact. Fireblocks 의 batching / CPFP 운영 수치 (30 초, 20 건, 10 분) 는 미확인.

---

## 2. BitGo 인덱서 — 본 자료에 따르면 (UNVERIFIED HYPOTHESIS)

### 2.1 BigInt 라이브러리 (256bit → 6 field 분할)

본 자료에 따르면 초기 BitGo 는 MongoDB 의 256bit BigInt 미지원 문제를 우회하기 위해 **6 개 DB field 로 분할 저장** 하는 **"BitGo BigInt"** 라이브러리 자체 구현. 그러나 write amplification + CPU 부하 문제로 폐기.

→ **★ Q-VRF-06 필요**: BitGo 의 internal architecture 는 공식 공개 거의 없음. 6 field 분할 / 라이브러리 명칭 미확인.

### 2.2 제 3 세대 범용 인덱서 (Generic Indexer)

본 자료에 따르면 BitGo 의 현 indexer 는:
- **자료형 단순화**: 부호 없는 거대 정수 → 유니코드 문자열로 영구 저장
- **단일 스레드 EVM 파이프라인**: 시퀀싱 / 원자성 보존
- **VM 격리**: Parity archive node 의 tracing interface 로 EVM 연산 아웃소싱, indexer 는 디코딩만

→ "**단일 스레드** 가 이전 다중 스레드 대비 **수십 배 빠르다**" 라는 본 자료의 주장은 검증 안 됨. Q-VRF-07.

### 2.3 CREATE2 dynamic wallet + Forwarder + Gas Tanks

본 자료에 따르면:
- 수탁 계정 개설 시 **CREATE2 + salt** 로 오프체인 사전 계산만 (배포 안 함)
- 자산 유입 감지 시점에만 contract 활성화 (consolidation deployment)
- ERC-20 / NFT 자동 forwarding (consolidation sweep)
- 가스비는 **Gas Tanks** 라는 중앙 가스 풀에서 정산

→ **Partially plausible**: CREATE2 forwarder pattern 은 일반적 industry pattern. BitGo 의 "Gas Tanks" 명명 / 운영 디테일은 미확인. Q-VRF-08.

### 2.4 탭루트 자산 (TAP) Universe

본 자료에 따르면 BitGo 는 Taproot Asset Protocol (TAP) 의 자산 증명 / 메타데이터를 **"Universe"** 라는 오프체인 인덱싱 레이어에 보관, 서명 시 verify.

→ **External fact**: TAP 의 Universe 개념은 Lightning Labs 의 공식 spec — BitGo specific 운영 디테일은 미확인. Q-VRF-09.

---

## 3. Coinbase Mesh (Rosetta) — 본 자료에 따르면 (UNVERIFIED HYPOTHESIS)

### 3.1 Mesh 의 Data API + Construction API

본 자료에 따르면 Rosetta (현 Mesh) = (a) Data API (원시 블록 → 기계 검증 데이터 변환) + (b) Construction API (오프라인 서명).

→ **Verified**: Coinbase Mesh 의 공식 spec — 검증 가능 (출처: `github.com/coinbase/mesh-specifications`). 단, 본 자료의 hedge 없음.

### 3.2 Mina Protocol Mesh 구조 (4 계층)

본 자료의 ASCII diagram 인용:

```
Mina Daemon (P2P:8302, GraphQL:3085)
       ↓ GraphQL Query
Mina Archive Node (3086)
       ↓ Data Ingest
PostgreSQL (5432)
       ↓ State Query
Mina Rosetta API (Online:3087, Offline:3088)
```

→ **Plausible**: Mina + Rosetta 통합 example 은 공식 spec 에 가까움. 정확한 포트 / 컴포넌트 매핑은 cross-verify 필요. Q-VRF-10.

### 3.3 BadgerDB 튜닝 파라미터

본 자료에 따르면 Rosetta Bitcoin 등 Mesh 수집 엔진은 **BadgerDB** 를 LSM tree 캐시로 내장, 극도로 디테일하게 튜닝:

| 파라미터 | 값 | 사유 (본 자료) |
|---|---|---|
| `Compression` | `options.None` | 압축 시 CPU 점유율 급증 → 명시적 해제 |
| `TableLoadingMode` / `ValueLogLoadingMode` | `options.FileIO` | mmap 회피 → 디스크 버퍼 오버플로우 감쇄 |
| `NumMemtables` | `1` | 활성 buffer table 격리 제약 |
| `NumLevelZeroTables` | `1` | OOM kill 회피 |

→ **★ Q-VRF-11 필요**: Mesh Bitcoin 의 BadgerDB 튜닝값은 GitHub repo 에서 cross-verify 가능 (출처 후보: `github.com/coinbase/mesh-bitcoin`). 본 자료 인용 시 코드 line 검증 필요.

### 3.4 WaitTable 패턴 (비순차 처리)

본 자료에 따르면 Mesh Bitcoin 의 병렬 동기화는:
- `BlockSeen` 단계: 원시 블록 파싱 후 휘발성 `coinCache` 에 적재
- `AddBlock` 단계: DB 영구 기록 + `coinCache` flush
- 부모 UTXO 미발견 thread 는 **`WaitTable`** 에 hash 등록 + mutex sleep → 부모 도착 시 wake

→ **Plausible**: 비순차 처리는 일반 indexer pattern. WaitTable 명명은 Mesh 특정일 수 있음. GitHub repo cross-verify 필요. Q-VRF-12.

---

## 4. Modern Decoupled ETL — 본 자료에 따르면 (UNVERIFIED HYPOTHESIS)

### 4.1 cryo + Reth ExEx

본 자료에 따르면 모던 ETL 은 양분된 비대칭 구조:
- **역방향 백필링**: cryo (Paradigm 개발) 다중 스레드 RPC 호출 → 캐시 디스크 직접 다운로드, 수십 배 단축
- **순방향 실시간**: **Reth 의 ExEx (Execution Extensions)** — 노드 합의 실행 루프 내부에서 thread-level 연동, 1ms 단위 가로채

→ **Verified (external)**: cryo / Reth ExEx 는 공식 open-source — 검증 가능. Stage 41 reference 의 P1 + P4 조합의 modern 변형.

### 4.2 Kafka + Flink 파이프라인

본 자료에 따르면:
- 원시 stream → Apache Kafka (또는 AWS MSK) 의 3 partition (`blocks` / `transactions` / `logs`)
- Apache Flink 가 ABI 스키마 매핑 + 디코딩
- 스마트 계약 schema 변경 시 Kafka offset 0 시점 으로 되돌리고 신규 Flink 모듈만 onboarding → **수 시간 안에 수 TB 재정제**

→ **Verified architecture**: Kafka + Flink 는 industry standard. Stage 41 reference 의 stream bus + projection workers 의 modern 구현.

### 4.3 Reorg 감지 + 카프카 Revert Signal

본 자료에 따르면 순방향 수집 엔진은 매 블록마다:

```
BlockNumber_New = BlockNumber_CurrentHead + 1
ParentHash_New == Hash_CurrentHead
```

불일치 시 **"Revert Signal"** 메시지를 Kafka bus 에 broadcast → Flink 노드들이 orphan 블록 height 의 DB row 삭제 / rollback.

→ **Plausible**: 일반적 reorg 처리 pattern. 명명은 본 자료 specific. Q-VRF-13.

### 4.4 Bloom Filter 화이트리스트 매칭

본 자료에 따르면 인덱서는 수신 tx 의 destination address 를 **Bloom Filter** 로 1 차 매칭 (0ms overhead), positive match 만 Redis / Postgres 조회.

→ **Verified pattern**: Bloom filter 는 일반 indexer 의 standard pattern. 본 자료의 hedge 없는 단정형 표현만 주의.

---

## 5. B3 (Stage 43 추가 자료) — 자체 tier 분리된 LLM 분석

**원본**: [[sources/indexer/블록체인 인덱서 구현 사례와 Fireblocks 사례 분석.md]] (242 lines, ChatGPT 추정)

**B1/B2 와의 차이**:
- ChatGPT citation tag (`citeturn34view0`, `citeturn30view2` 등) 본문 포함 → 외부 source 부분적 traceable
- Fireblocks 영역에서 **"공개적으로 확인됨 / 합리적 추론 / 미확인"** 자체 tier 분리 (B1 의 단정형과 대비)
- 비용 수치는 vendor 공식 페이지에서 cross-verify 가능

### 5.1 B3 의 Fireblocks 자체 tier 분리 인용

본 자료에 따르면 (★ unverified — 다만 자체 분류는 존중):

| 자체 분류 | 항목 |
|---|---|
| **공개적으로 확인됨** | 트랜잭션 히스토리 API, 상태 API, 웹훅, EVM receipt/log 조회, 확인 수 정책, blockHeight 기반 잔액 검증, AML 실시간 모니터링, 정책 엔진·감사 추적 |
| **합리적 추론** | 내부 체인 감시기, 정규화 레이어, 상태 저장소, 확인 수·재조직 처리 로직 존재 (위 기능들의 안정 제공 위해) |
| **미확인** | 내부 노드 구성 (자체 풀/아카이브/서드파티 RPC 혼합 여부), Kafka 사용 여부, DB 선택 (Postgres/ClickHouse/RocksDB 등), 스트리밍 버스, 특허 귀속, 구현 세부 |

→ ★ B3 의 "공개적으로 확인됨" 영역은 본 wiki 의 fact-tier 자료 (Stage 36 `transaction-objects.md`, Stage 40 DCCP, Stage 4 webhook docs 등) 와 cross-confirm 가능. B1 의 unverified vendor analysis 와 분리.

### 5.2 B3 가 추가로 제공하는 fact (Stage 41 과 cross-confirm)

| 항목 | B3 의 인용 | Stage 41 reference 와 일치? |
|---|---|---|
| Geth path-based archive flat state 2TB | "약 2TB의 flat state history" (B3 §요구사항) | ✓ 일치 (Stage 41 §7.5 동일 수치) |
| Geth + trie data 6.5TB | "trie data까지 보관하면 약 6.5TB" (B3) | ✓ 일치 |
| Alchemy `indexed` 태그는 캐시, 최신보다 지연 | B3 §기업별 비교 | △ 새로운 fact (Stage 41 미포함) |
| Alchemy Webhooks at-least-once 전달 | B3 §기업별 비교 | △ 새로운 fact |
| **Alchemy Subgraphs 2025-12-08 sunset** | B3 §기업별 비교 | △ 새로운 fact (Stage 41 의 The Graph 영역 보강) |
| Infura 의 `removed=true` + 재조직 시 중복 가능성 | B3 §요구사항, §데이터 일관성 | ✓ 일치 (Stage 41 §8.2 reorg 처리) |
| The Graph query nodes ↔ index nodes 분리 권장 | B3 §엔터프라이즈 권장 | ✓ 일치 (Stage 41 §3.1) |
| QuickNode Streams exactly-once delivery (finality order 기준) | B3 §기업별 비교 | △ 새로운 fact |

→ Stage 41 fact 와 일치하는 항목은 cross-confirm 효과 (Stage 41 reference 의 fact tier 강화). 새로운 fact 는 B3 의 citation tag 기반으로 vendor 공식 cross-verify 필요.

### 5.3 B3 의 비용 추정 (★ 공식 단가 cross-verify 가능)

B3 가 제공하는 비용 모델:

| 항목 | B3 인용 | 비고 |
|---|---|---|
| Alchemy 무료 플랜 | 월 30M CU + 5 webhooks | vendor 공식 페이지 cross-verify 필요 |
| QuickNode Build 플랜 | 월 $42~49, 80M API credits + Streams/Webhooks | vendor 공식 페이지 cross-verify 필요 |
| QuickNode Business 플랜 | 월 $849~999, 2B API credits + 500 RPS | vendor 공식 페이지 cross-verify 필요 |
| AWS EC2 t3.large on-demand | 시간당 $0.0832 | AWS 공식 (Stage 41 §9 의 AWS gp3 / S3 단가와 같은 source family) |
| AWS gp3 | GB-월 $0.08 | ✓ Stage 41 §9 와 동일 (cross-confirm) |
| **AWS MSK 예시** | 3 broker + 1,000GB ingest/storage = $1,020.66/월 | Stage 41 §9 에 미포함 — 새로운 fact |

**B3 의 운영 추정 범위**:
- 스타트업: **월 $100~$800** (Alchemy 무료/저사용량 + 소형 EC2 1~2대) ~ (QuickNode Build $42-49 + EC2 2-3대 + 수백 GB gp3)
- 엔터프라이즈: **월 $3,000~$20,000 이상** (QuickNode Business $849-999 + AWS MSK $1,020 + 자체 archive node 2TB-6.5TB + ClickHouse + Postgres + 멀티리전)

→ Stage 41 §9.1 3-tier 예산 모델과 같은 방향성. **B3 의 구체 수치는 vendor 공식 페이지에서 별도 cross-verify 후 fact 승격 가능**.

### 5.4 B3 의 Fireblocks 핵심 해석 (인용)

본 자료 §"Fireblocks 사례의 핵심 해석" 인용:

> "Fireblocks 사례는 '범용 인덱서 회사'의 사례라기보다, **지갑·거래소·결제·컴플라이언스 서비스가 실제로 어떤 인덱서 기능을 필요로 하는가** 를 보여준다. 이 회사가 공개적으로 강조하는 것은 GraphQL/SQL 자체가 아니라, **트랜잭션의 운영 상태, 확인 수, 블록 높이 정합성, 실시간 정책 검사, 감사 가능성** 이다. 따라서 Fireblocks 가 보여주는 인덱서의 본질은 '데이터 접근성' 보다 더 넓은 **운영 안전성 계층** 이라고 보는 것이 맞다."

→ 이 해석은 본 wiki 의 [[docs/architecture/three-way-custody-decision-framework]] 의 SaaS vs direct-build 책임 분담 관점과 정렬. B3 의 ChatGPT 출처지만 framing 은 본 wiki 의 fact-tier 결론과 일치.

### 5.5 B3 가 답하는 Q-VRF 일부

| Q-VRF | B3 의 답 | 답 tier |
|---|---|---|
| Q-VRF-01 (UTXO mempool / Account mined 알림 timing) | "UTXO 기반 자산은 mempool 단계에서 incoming notification 이 생성되고, account-based 자산은 mined 시점에 생성된다고 적시" (Fireblocks `Monitoring Transaction Statuses` docs 인용) | △ 공식 문서명 인용 — Fireblocks 공식 docs 에서 cross-verify 가능 (★ 권장) |
| Q-VRF-08 (Chainalysis/Elliptic 통합) | "Chainalysis나 Elliptic과 연계해 incoming/outgoing transaction을 실시간으로 스크리닝" (AML 기능 문서 인용) | △ 공식 문서명 인용 — Fireblocks AML overview docs 에서 cross-verify 가능 |
| Q-VRF-02 (1분 / 10분 timeout 수치) | **B3 미언급** | B1 에만 등장, 여전히 unverified |
| Q-VRF-03 (ATC + `stuck_confirming`) | **B3 미언급** | B1 에만 등장, 여전히 unverified |

→ B3 는 B1 의 가장 specific 한 수치 (1분/10분, ATC 등) 는 다루지 않음. B3 가 다루는 영역은 더 generalized — Fireblocks 공식 docs 인용 위주.

## 6. B4 (Stage 44 추가 자료) — 7 거래소 비교 + 외부 URL footnote

**원본**: [[sources/indexer/Fireblocks와 국내외 거래소의 블록체인 인덱서 설계·구현 비교 보고서.pdf]] (9 페이지, Korean), markdown extract: [[sources/indexer/2026-06-01__Fireblocks와-국내외-거래소-인덱서-비교-보고서]]

**B1/B2/B3 와의 차이**:
- **36 개 외부 URL footnote 본문 명시** — Coinbase blog (Part 1 + Part 3) / Fireblocks developers / Upbit/Bithumb/Coinone/Korbit docs / Binance tech blog / Korbit tech blog 직접 인용
- 모든 항목에 자체 tier 분류 ("확인됨 / 부분 확인 / 미확인") 일관 적용
- 7 거래소 비교 (Fireblocks / Coinbase / Binance / Upbit / Bithumb / Coinone / Korbit)
- Coinbase ChainStorage / ChainNode 의 공개 아키텍처 가장 specific
- Korbit 의 국내 거래소 사례 최초 (Kafka + Temporal + Go/Rust + gRPC + EKS)

### 6.1 B4 의 Fireblocks 자체 tier 분류 (★ 본 자료에 따르면)

| 분류 | 항목 | B4 의 footnote |
|---|---|---|
| **확인됨** | `/blockchains` + 자산 API, EVM receipt 조회, network routing, Webhooks v2 (순서 비보장, 30일 재전송, JWKS, IP allowlist, balance validation), `externalTxId` 영구 멱등성, multi-destination batching, 같은 EVM vault account 한 번에 하나, 이종 체인 동시 처리 | 3, 7, 8, 9, 10, 24, 35 |
| **부분 확인** | 노드 운영 (다중 체인 + receipt 제공이므로 내부 노드/외부 제공자 조합 시사), 메시지 큐 (공식 docs 가 "큐 기반 권장") | 추론 |
| **미확인** | 노드 토폴로지, Kafka 사용, DB 선택, 스트리밍 버스, 캐시 / 검색 / 분석 스토어, 백필 전략 | — |

→ B4 의 Fireblocks 결론: **"인덱서 자체보다 트랜잭션 제어·정합성·서명·이벤트 전달 신뢰성이 중심"**

→ B4 가 강조하는 "**입금 감지 vs 잔고 반영 분리**" — incoming transaction 웹훅만 믿지 말고 balance update 웹훅 + block height 교차검증 권고. 본 wiki [[docs/architecture/deposit-lifecycle]] §1.3 와 정합 (cross-confirm).

### 6.2 Coinbase ChainStorage / ChainNode — B4 가 공개 자료에서 정리한 architecture (★)

**B4 의 가장 specific 한 영역** — Coinbase 공식 blog (Part 1, Part 3) 직접 인용:

**ChainStorage (raw 데이터 레이어, footnote 11)**:
- 로드밸런싱된 노드 클러스터 → raw block 동시 추출
- Blob storage (S3 계열) + Key-value storage (DynamoDB 계열) 저장
- **ELT 방식** (변환은 ingestion 이후로 미룸)
- Chain-native parser + chain-agnostic parser
- **Reorg = block overwrite ✗, 추가 (+) / 제거 (-) 이벤트 시퀀스로 적재** ← ★ 본 wiki Stage 41 reference §8.2 reorg 처리의 구체 패턴
- Merkle hash validation + node failover
- AWS Ethereum 예시: **1~2 초 freshness, 실험적 약 1000 blocks/sec**

**ChainNode (파생 인덱서 레이어, footnote 12)**:
- Temporal workflows orchestration
- DynamoDB data sink
- Golang RPC service serving layer
- ChainStorage 변경분 지속 복제 → 재인덱싱

**다른 인덱서** (Source: S3 parquet + DynamoDB / Sink: DynamoDB + S3 + Delta Lake + Kafka / Serving: K8s + Go / Cache: watermark + immutable contract metadata / 계산: Spark / 배포: exclusive deployment locks)

**CDP Webhooks** (외부 제품, footnote 13):
- At-least-once delivery
- 최대 60 회 재시도
- **< 500ms freshness**

→ Coinbase 의 raw-block-lake + 파생 인덱서 다층 구조는 Stage 41 reference §3 의 참조 아키텍처와 정합 (★ cross-confirm).

### 6.3 Korbit — 국내 거래소 사례 최초 specific 공개

**B4 가 Korbit tech blog 직접 인용** (footnote 22, 23):

**기술 스택**:
- **Kafka 중심 비동기 이벤트 아키텍처 + Event Sourcing**
- 주문 → 체결 엔진 → 잔고·시세 서비스 (event-driven flow)
- 언어: Open API/주문 = **Go**, 체결 엔진/시세 = **Rust**
- 통신: **gRPC** 또는 Kafka + Protocol Buffers
- 런타임: **AWS EKS**

**입출금 워크플로 (Temporal)**:
- 입금 감지 → 외부 AML (**Chainalysis 등**) 스크리닝 → 잔고 반영 또는 계류 → 반환 확정 시 자산 이동·블록체인 출금
- Temporal 기능: durable timer (`Workflow.sleep`), Activity Retry Policy, Replay, 멱등성, `ALLOW_DUPLICATE_FAILED_ONLY`, `continueAsNew`, 대시보드
- **Chronos**: 입출금 중단/재개 예약, Slack Fail-safe, 노드 상태·수수료·업그레이드 실시간 모니터링, 수수료 지갑 자동 충전 계획

**상태 모델** (Korbit docs, footnote 21):
- 입출금: `pending` / `actionRequired` / `reviewing` / `processing` / `done` / `failed`
- `transactionHash` = null 가능 (아직 블록체인 미전송)

→ ★ **국내 거래소 인덱서/워크플로 영역의 reference 사례** — KR 은행 도입 시 Korbit 패턴이 가장 가까운 정밀 사례. Chainalysis 통합 = Fireblocks 와 동일 (Q-VRF-08 의 추가 cross-confirm).

### 6.4 국내 4 거래소 상태 모델 비교 (B4 인용)

| 거래소 | 공개 상태 enum | 공개 수준 |
|---|---|---|
| Upbit | `minimum_deposit_confirmations` 만 노출 (myAsset/myOrder Private WS) | 부분 확인 |
| Bithumb | 2024-09 부터 `MyOrder` / `MyAsset` Private WS | 부분 확인 |
| **Coinone** | `DEPOSIT_WAIT` / `DEPOSIT_SUCCESS` / `DEPOSIT_REJECT` / `WITHDRAWAL_REGISTER` / `WITHDRAWAL_WAIT` / `WITHDRAWAL_REFUND_FAIL` (가장 세밀) | 부분 확인 (리크루팅 인터뷰로 MSA + Replica DB + DMS + Spring Batch + AML 단서) |
| **Korbit** | `pending` / `actionRequired` / `reviewing` / `processing` / `done` / `failed` + Kafka/Temporal 워크플로 공개 | 확인됨 (가장 상세) |

→ KR 은행 도입 시 입출금 상태 모델 reference 우선순위: **Korbit > Coinone > Bithumb ≈ Upbit**.

### 6.5 B4 의 권장 아키텍처 3 분류

**중소 거래소** (footnote 33):
- 모든 체인 풀 자체 인덱싱 ✗
- 상위 체인만 자가 Full/Archive, 나머지 = 관리형 RPC + SQD/HyperIndex
- Postgres + Redis + Object Storage + Single Temporal workflow

**대형 거래소** (footnote 34):
- Coinbase 의 raw-data lake + multi-sink serving
- Korbit 의 Kafka/Temporal 워크플로
- Fireblocks 의 웹훅 보안·멱등성 패턴 결합
- 3 원칙: 원시 블록 저장 / 파생 인덱서 분리 / 입출금 durable workflow

**기관용 서비스** (footnote 35):
- Fireblocks 류 정책/서명/웹훅 플레인 + 자체 인덱서 플레인 분리
- 인덱서 = 체인별 최소 read model 중심
- 서명 평면과 데이터 평면 혼합 ✗

→ Stage 41 reference §11.3 (3-way custody 책임 분담) 와 정합. KR 은행 도입 시 "기관용 서비스" 분류 적용 가능.

### 6.6 B4 가 Stage 41 fact 와 cross-confirm 한 항목

| 항목 | B4 인용 | Stage 41 / 본 wiki 와 일치? |
|---|---|---|
| Coinbase reorg = add/remove event sequence | footnote 11 | ✓ Stage 41 §8.2 (Idempotent projection + checkpoint + rollback) 과 정합 |
| Coinbase serving 분리 (S3 + DynamoDB + Delta Lake + Kafka + K8s + Spark) | footnote 11, 12 | ✓ Stage 41 §3 참조 아키텍처와 정합 |
| Fireblocks externalTxId 영구 멱등성 | footnote 10 | ✓ 본 wiki Stage 36 transaction.md 와 정합 (이미 fact-tier) |
| Fireblocks Webhook JWKS 서명 검증 | footnote 9, 35 | ✓ 본 wiki Stage 4 webhook docs 와 정합 (이미 fact-tier) |
| Fireblocks 입금 감지 vs 잔고 반영 분리 | footnote 9 | ✓ 본 wiki deposit-lifecycle.md §1.3 와 정합 |
| Korbit 의 Chainalysis 통합 | footnote 23 | △ B1 의 "Fireblocks Chainalysis 실시간 API" 와 같은 vendor 통합 사례 — Q-VRF-08 의 cross-confirm 기반 강화 |

### 6.7 B4 가 답하는 Q-VRF 일부

| Q-VRF | B4 의 답 | 답 tier |
|---|---|---|
| Q-VRF-08 (Chainalysis/Elliptic 통합) | Korbit 가 Chainalysis 사용 명시 (footnote 23) — Fireblocks 의 통합과 별개로 KR 거래소도 동일 vendor 사용 | △ 별도 사례 — Fireblocks specific 통합은 여전히 cross-verify 필요 |
| Q-2026-05-18-B03 (Fireblocks internal-tx 감지) | "Fireblocks 는 범용 인덱서 제품 노출 안 함, 내부 인덱싱은 미확인" — 정책적 비공개 결정 명시 | ✓ Q-B03 의 답: Fireblocks 의 indexer 비공개는 의도적 |

### 6.8 B4 의 핵심 결론 (인용)

> "거래소 인덱서는 'RPC 를 읽어서 DB 에 넣는 프로그램' 이 아니라, 거래소 원장과 고객 자산을 안전하게 연결하는 **정산 시스템의 일부**. 좋은 설계는 빠른 인덱싱보다 **재처리 가능성 / reorg 안전성 / 멱등성 / 운영 자동화 / 이벤트 재전송 / 상태 전이 가시성** 우선."

> 설계 출발점 = "**어떤 평면을 직접 소유해야 사업 리스크를 통제할 수 있는가**"

→ 본 wiki 의 [[docs/architecture/three-way-custody-decision-framework]] 의 책임 분담 원리와 동일.

## 7. Stage 41 reference 와의 hypothesis-tier 비교

| 측면 | Stage 41 (fact) | Stage 42 (hypothesis) |
|---|---|---|
| Fireblocks 의 4 pattern 매핑 | "EVM 은 P1+P3 추정, Solana 는 P2 추정" — vendor API surface 분석 기반 hedged | "Mempool 비대칭 + ATC + 1분/10분 timeout" — vendor 명시적 명칭 사용 (검증 안 됨) |
| BTC chain 25 한계 | 일반 BTC fact (체인 spec) | Fireblocks 의 30초 batching + 10분 20건 억제 (구체 수치 미검증) |
| Bloom filter 매칭 | reference §8 의 일반 pattern | 화이트리스트 매칭 구체 메커니즘 (검증 안 됨) |
| BadgerDB 튜닝 | reference §6 의 RocksDB 비교 | Mesh Bitcoin 의 4 파라미터 구체값 (GitHub cross-verify 필요) |

→ 본 페이지의 hypothesis 가 cross-verify 되면 Stage 41 reference 의 §11.4 (Fireblocks 구현 추정) 영역으로 fact 승격 가능. 그 전까지는 분리 유지.

---

## 8. Q-2026-05-18-B03 의 hypothesis-tier 잠정 답

본 페이지의 fact 가 **모두 정확하다면 (UNVERIFIED)** Q-B03 (Fireblocks internal-tx 감지 메커니즘) 의 답은:

- **UTXO 체인** (BTC): mempool-level 가로채 + 30초 batching window
- **Account 체인** (EVM): block-mined 후 emit, **Parity-style archive node 의 tracing interface 로 EVM 연산 아웃소싱** (BitGo style 동일 패턴 가능성)
- **`evmTransferType=INTERNAL`** (Stage 36 transaction-objects.md fact) → tracing interface 기반 추정 (본 자료가 이 추정을 강화)
- **AML 시스템 연결**: Chainalysis / Elliptic 실시간 API + 비대칭 timeout window (1분/10분)
- **Stuck tx**: ATC / `stuck_confirming` 지표 + nonce 재할당

→ ★ 위의 **모든 항목은 unverified hypothesis**. Q-B03 의 fact tier 답이 되려면 vendor 측 cross-verification 필요.

---

## 9. Cross-verification 필요 항목 (Q-VRF list)

각 항목은 vendor 측 cross-verify 통과 시 Stage 41 reference / Fireblocks 본문 으로 fact 승격 가능.

**★ Stage 43 update**: B3 (`블록체인 인덱서 구현 사례와 Fireblocks 사례 분석.md`) 가 Fireblocks 공식 docs 명칭 인용 → 일부 Q-VRF 의 cross-verify path 명확화.

### Fireblocks 관련 (8 건)

- **Q-VRF-01**: Fireblocks UTXO mempool-level 수신 알림 timing 명세 (webhook status enum 매핑)
  - ★ Stage 43: B3 가 Fireblocks `Monitoring Transaction Statuses` docs 인용 — 해당 공식 문서에서 직접 확인 가능 (cross-verify path 명확)
- **Q-VRF-02**: 송신 1분 / 수신 10분 timeout 수치 출처
  - B3 미언급 → 여전히 B1 only, unverified 유지
- **Q-VRF-03**: "ATC (Account Traffic Control)" 아키텍처 명칭 + `stuck_confirming` 지표 명칭
  - B3 미언급 → 여전히 B1 only, unverified 유지
- **Q-VRF-04**: Stellar 1 TPS 당 10 wallet 라운드 로빈 운영 수치
  - B3 미언급 → 여전히 B1 only, unverified 유지
- **Q-VRF-05**: BTC 30초 batching / 10분 20건 억제 / CPFP 운영 수치
  - B3 미언급 → 여전히 B1 only, unverified 유지
- **Q-VRF-06**: Solana 1,000 동시 pending 수치 (공식 600 vs 본 자료 1,000 mismatch)
  - B3 미언급 → 여전히 B1 only, unverified 유지
- **Q-VRF-07**: Fireblocks 의 stuck EVM tx 해소 메커니즘 (RBF / cancel-replace 등 공식 명칭)
  - B3 미언급 → 여전히 B1 only, unverified 유지
- **Q-VRF-08**: Chainalysis / Elliptic 통합의 vendor-specific API 수준 (실시간 API 직접 연결 여부)
  - ★ Stage 43: B3 가 Fireblocks AML overview docs 인용 — 해당 공식 문서에서 직접 확인 가능 (cross-verify path 명확)

### BitGo 관련 (4 건)

- **Q-VRF-09**: "BitGo BigInt" 라이브러리 6 field 분할 명세
- **Q-VRF-10**: 단일 스레드 EVM 파이프라인의 throughput 수치
- **Q-VRF-11**: "Gas Tanks" 중앙 가스 풀 명칭 + 운영 디테일
- **Q-VRF-12**: TAP Universe 의 BitGo-specific 구현

### Coinbase Mesh 관련 (3 건)

- **Q-VRF-13**: Mesh Bitcoin 의 BadgerDB 4 파라미터 구체값 (GitHub repo line 검증)
- **Q-VRF-14**: WaitTable 구현 명칭 + Mutex 채널 패턴 (GitHub repo line 검증)
- **Q-VRF-15**: Mina Mesh 의 4 계층 + 포트 매핑

### Modern ETL 관련 (2 건)

- **Q-VRF-16**: cryo 의 백필 "수십 배 단축" 수치 출처
- **Q-VRF-17**: Reth ExEx 의 "1ms 단위 가로채" 수치 출처

### B3 추가 영역 (Stage 43 신규, 5 건)

- **Q-VRF-18**: Alchemy 무료 플랜 30M CU + 5 webhooks 의 vendor 공식 페이지 cross-verify
- **Q-VRF-19**: QuickNode Build $42-49, Business $849-999 pricing tier cross-verify
- **Q-VRF-20**: Alchemy `indexed` 태그 캐시 지연 + Subgraphs 2025-12-08 sunset 공식 공지 확인
- **Q-VRF-21**: AWS MSK 3-broker + 1,000GB 예시 $1,020.66/월 의 AWS 공식 calculator cross-verify
- **Q-VRF-22**: QuickNode Streams "exactly-once delivery (finality order)" 공식 문서 인용

### B4 추가 영역 (Stage 44 신규, 9 건) — ★ 외부 URL footnote 직접 추적 가능

- **Q-VRF-23**: Coinbase ChainStorage 의 raw block + S3 + DynamoDB + ELT (Part 1 blog URL traceable)
- **Q-VRF-24**: Coinbase reorg = add/remove event sequence 메커니즘 (Part 1 blog 직접 확인)
- **Q-VRF-25**: Coinbase ChainNode + Temporal + DynamoDB sink + Golang RPC (Part 3 blog URL traceable)
- **Q-VRF-26**: Coinbase AWS Ethereum 1-2초 freshness + 1000 blocks/sec 실험치
- **Q-VRF-27**: CDP Webhooks 최대 60회 재시도 + <500ms freshness
- **Q-VRF-28**: Binance tech blog Flink + Kafka + Hive + S3 + ElasticSearch + Snowflake stack
- **Q-VRF-29**: Binance WebSocket 단일 연결 1024 streams 제약
- **Q-VRF-30**: Korbit tech blog Kafka Event Sourcing + Go (주문) + Rust (체결/시세) + gRPC + EKS
- **Q-VRF-31**: Korbit Temporal 입금 계류 워크플로 디테일 (durable timer, Retry Policy, Replay, ALLOW_DUPLICATE_FAILED_ONLY, continueAsNew, Chronos)
- **Q-VRF-32** (Stage 48): SQD/Subsquid 의 vs-The-Graph 성능·기능 주장(~1k–50k vs ~100–150 blocks/sec, unfinalized block 지원, custom sink, TS vs WASM) — **SQD 자체 마케팅 자료** 이므로 중립 벤치마크 + The Graph 공식 문서로 cross-verify 필요. ([[blockchain-indexer-architecture-reference]] §7.6)
- **Q-VRF-33** (Stage 49): GCP Blockchain Node Engine 의 node type(full/archive) · 클라이언트(geth/erigon) · 보안(Private Service Connect/Cloud Armor/IAM) · pricing · Ethereum 외 체인 — 공식 하위 페이지(supported-networks/create-node/secure/pricing)가 ingest 시 404/truncated. 재fetch 또는 사용자 제공으로 확인. ([[blockchain-indexer-architecture-reference]] §9.4)

---

## Open Questions (이 페이지 자체)

- **Q-2026-06-01-IDX04** — 본 페이지의 17 Q-VRF 항목 중 어떤 것을 우선 cross-verify 할지 priority 결정 (Fireblocks 운영 결정에 직접 영향 크기 순)
- **Q-2026-06-01-IDX05** — 본 페이지의 hypothesis 가 검증 실패 시 (vendor 공식 부정) 보존 정책 — sources/indexer/ 에 raw 보존만 + wiki 본문 삭제, 또는 "verified false" 라벨 유지

## Sources

### 본 페이지의 1 차 자료 (★ unverified)

- [[sources/indexer/블록체인_인덱서_구현_리서치.md]] — LLM 생성, 36 KB (B1, Stage 42)
- [[sources/indexer/엔터프라이즈_블록체인_인덱서_설계_구조.html]] — LLM 생성, 30 KB (B2, Stage 42 시각화 짝)
- [[sources/indexer/블록체인 인덱서 구현 사례와 Fireblocks 사례 분석.md]] — ChatGPT 추정, 242 lines (B3, Stage 43, citation tag 포함 + 자체 tier 분리)
- [[sources/indexer/Fireblocks와 국내외 거래소의 블록체인 인덱서 설계·구현 비교 보고서.pdf]] + [[sources/indexer/2026-06-01__Fireblocks와-국내외-거래소-인덱서-비교-보고서]] — ChatGPT 추정, 9 페이지 PDF + extract (B4, Stage 44, 36 외부 URL footnote + 7 거래소 비교)

### 동급 fact-tier reference (cross-ref)

- [[docs/architecture/blockchain-indexer-architecture-reference]] — Stage 41 vendor-neutral (28 공식 출처)
- [[vendors/fireblocks/blockchains]] — Fireblocks 공식 fact (DCCP, SLA, Node Router)
- [[entities/fireblocks/transaction]] — Stage 9 17-status state machine + Stage 36 API contract
- [[open-questions/fireblocks]] Q-2026-05-18-B03

### External cross-verification 후보 source

- Fireblocks Developer Portal + Help Center (Q-VRF-01~08)
- BitGo GitHub repos + engineering blog (Q-VRF-09~12)
- `github.com/coinbase/mesh-bitcoin` + `github.com/coinbase/mesh-specifications` (Q-VRF-13~15)
- Paradigm cryo + Reth ExEx 공식 docs (Q-VRF-16~17)

## Related Pages

- [[docs/architecture/blockchain-indexer-architecture-reference]]
- [[docs/architecture/multi-chain-adapter-pattern]]
- [[docs/architecture/deposit-lifecycle]]
- [[vendors/fireblocks/blockchains]]
- [[open-questions/fireblocks]] Q-B03
