<!--
★ TIER: UNVERIFIED VENDOR ANALYSIS (★ 출처 = LLM 생성 자료, ChatGPT 추정)
ingested_at: 2026-06-01 (Stage 44 promote)
ingested_as: hypothesis tier — B1/B2/B3 와 같은 LLM 생성, but 외부 URL traceability 가장 높음

★ B4 특징 (B1/B2/B3 와 차이):
- 36 개 외부 URL footnote 본문 명시 (Coinbase blog, Fireblocks developers, Upbit/Bithumb/Coinone/Korbit docs, Binance tech blog)
- 자체 tier 분리 ("확인됨 / 부분 확인 / 미확인") 모든 항목에 일관 적용
- 7 거래소 비교 (Fireblocks / Coinbase / Binance / Upbit / Bithumb / Coinone / Korbit)
- Coinbase ChainStorage / ChainNode 의 공개 아키텍처 매우 specific

★ 그래도 unverified tier 유지 이유:
- LLM 이 자료를 종합 작성 — 각 URL 의 실제 paragraph-level 인용은 별도 verify 필요
- 거래소 internal architecture 의 자체 분류 ("미확인" 표기) 는 신뢰 가능, 다만 specific 수치/이름은 verify 필요

→ promote 결정: Stage 44 (2026-06-01) — Stage 42 hypothesis 페이지의 §6 로 흡수
원본 PDF: sources/indexer/Fireblocks와 국내외 거래소의 블록체인 인덱서 설계·구현 비교 보고서.pdf (9 페이지)
-->

# Fireblocks 와 국내외 거래소의 블록체인 인덱서 설계·구현 비교 보고서

*pdftotext extract 후 fact mining + 재구성. 원본 PDF 의 footnote 번호 보존.*

## Executive Summary

공개 자료 기준 핵심 결론:
- **Coinbase 가 가장 "인덱서다운" 공개**: ChainStorage + ChainNode 의 raw-block-lake + 파생 인덱서 다층 구조 명시
- **Fireblocks 는 범용 인덱서 제품 아님**: 거래 오케스트레이션 / 정책 / 웹훅 / 영수증 / 라우팅 중심
- **국내 4 거래소 중 Korbit 만 상세 공개**: Kafka + Temporal + Go/Rust + gRPC + EKS
- Upbit / Bithumb / Coinone / Binance: 외부 API 표면은 풍부, 내부 인덱서는 블랙박스

3 부류 패턴:
1. **Coinbase 형**: 원시 체인 데이터 레이어 + 도메인별 파생 인덱서 분리
2. **Fireblocks 형**: 온체인 데이터 질의보다 트랜잭션 라이프사이클 제어 / 정책 / 웹훅 / 영수증 / 네트워크 라우팅 집중
3. **거래소 형 (대부분)**: 외부 = 상태 조회 API / 입출금 API / Private WebSocket 만 / 내부 인덱서 블랙박스

## Fireblocks 영역 (B4 분석)

### 자체 tier 분류

**확인됨** (B4 가 Fireblocks 공식 docs URL 인용):
- `/blockchains` + 자산 목록 API 로 지원 체인 / 자산 메타데이터 제공 (footnote 7, 24)
- EVM 체인 transaction receipt 조회 API
- 네트워크 연결 + 라우팅 정책 API
- Webhooks v2 — 트랜잭션 / 오더 등 리소스 이벤트 (footnote 3, 9)
- Webhook 순서 비보장, exponential backoff 재시도, **최대 30일 재전송**, JWKS 서명 검증, IP allowlisting, balance validation
- `destinations` 배열 multi-destination batching 출금
- **`externalTxId` 영구 멱등성** — 금융성 출금 API 중복 차단 (footnote 10)
- 같은 vault account 의 같은 블록체인 표준 계열 (EVM 등) = 한 번에 하나씩 처리, 이종 체인 (BTC vs Solana) = 동시 처리 가능 (footnote 8)

**부분 확인** (Fireblocks 의 기능에서 추론):
- 노드 운영 (Full / Archive / RPC) — 다중 체인 지원 + 라우팅 + receipt 제공이므로 내부 노드 또는 외부 제공자 조합 계층 존재 시사
- 이벤트 수집 = Webhooks v2 중심
- 메시지 큐 권장 = 공식 문서가 "웹훅을 비동기 큐로 처리" 명시 → 권장 아키텍처는 큐 기반

**미확인** (B4 의 명시):
- 노드 토폴로지 (자체 풀 / 아카이브 / 서드파티 RPC 혼합 여부)
- Kafka 사용 여부
- DB 선택 (Postgres / ClickHouse / RocksDB 등)
- 스트리밍 버스 기술
- 캐시 / 검색 엔진 / 분석 스토어
- 백필 전략

### B4 의 Fireblocks 결론

> "Fireblocks 는 인덱서 자체보다 트랜잭션 제어·정합성·서명·이벤트 전달 신뢰성이 중심인 아키텍처를 공개"

→ "**입금 감지**" 와 "**잔고 반영**" 의 분리 강조: incoming transaction 웹훅만 믿지 말고 balance update 웹훅 + block height 교차검증 권고 — 본 wiki 의 [[docs/architecture/deposit-lifecycle]] §1.3 "observation 이 곧 deposit 이 아니다" 와 정합.

## Coinbase 영역 (B4 분석) — 가장 specific 한 공개

### ChainStorage (raw 데이터 레이어)

**Footnote 1, 11 (Coinbase blog Part 1)**:
- 로드밸런싱된 노드 클러스터에서 raw block 동시 추출
- Blob storage (S3 계열) + Key-value storage (DynamoDB 계열) 저장
- **ELT 방식** — 변환은 ingestion 이후로 미룸
- Chain-native parser + chain-agnostic parser 지원
- **Reorg = block overwrite 안 함, 추가 (+) / 제거 (-) 이벤트 시퀀스로 적재** → CDC 류 downstream 동기화 가능
- Merkle hash validation + node failover
- AWS Ethereum 예시: **1~2 초 freshness, 실험적 약 1000 blocks/sec**

### ChainNode (파생 인덱서 레이어)

**Footnote 12 (Coinbase blog Part 3)**:
- **Temporal workflows** orchestration
- DynamoDB data sink
- Golang RPC service serving layer
- ChainStorage 변경분 지속 복제 → 재인덱싱

### 다른 인덱서 (Coinbase 인덱서 글)
- Source: S3 parquet + DynamoDB (지난 계산 상태)
- Sink: DynamoDB (실시간) / S3 (대형 payload) / Delta Lake (분석) / Kafka (알림)
- Serving: Kubernetes 위 Go 서비스
- Cache: watermark + immutable contract metadata
- 계산: Spark
- 배포: exclusive deployment locks (동시에 한 job 만)

### CDP Webhooks (외부 제품)

**Footnote 13**:
- At-least-once delivery
- 최대 60 회 재시도
- 온체인 데이터 이벤트 **< 500ms freshness**
- Onchain Data Quickstart: SQL 기반 온체인 데이터 조회 + Base Node Playground

## Binance 영역 (B4 분석)

### 외부 API (확인됨, footnote 14, 26)
- `GET /sapi/v1/capital/config/getall` — coin/network metadata, depositEnable/withdrawEnable
- Deposit history / withdraw history / deposit address
- Spot User Data Stream — balance update (입출금 + 계정 간 이체)
- REST timeout 시 User Data Stream 확인 후 재조회 권고
- WebSocket 운영 제약: 24h 연결 갱신 / ping-pong / 단일 연결 최대 **1024 streams**

### 내부 인덱서 (미확인)
노드 운영 / 파서 / 트랜스포머 / DB / 캐시 / 백필 / 포크 처리 / RPC 로드밸런싱 = Binance Exchange 공식 개발자 문서 미확인.

### 조직 차원의 데이터 인프라 (footnote 15, Binance tech blog)
- Risk AI: Flink job + Kafka ingestion + S3 또는 Elasticsearch sink
- Batch + stream 구조: Kafka / Kinesis / Hive / Snowflake
- Kafka 7 일 보존 한계 → S3 / Hive 백업
- Notebook 환경 backfill

## 국내 거래소 영역 (B4 분석)

### Upbit (footnote 5, 16, 17)

**확인됨**:
- `GET /v1/status/wallet` — 입출금 서비스 상태
- `GET /v1/deposits/chance/coin` — 입금 가능 + **`minimum_deposit_confirmations`**
- 입금 주소 생성 / 목록
- Private WebSocket `myAsset` / `myOrder`
- **입출금 상태와 입금 가능 정보 실시간 보장 안 함 — 수 분 지연 가능**
- Private WebSocket `myAsset` 최초 구독 시 수 분간 데이터 안 옴
- WebSocket idle timeout **120 초**, private endpoint 분리, 인증 토큰, 재연결

**미확인**: 노드 / 큐 / DB / 캐시 / 포크 / 백필 / 장애복구 내부 구현

### Bithumb (footnote 18)

**확인됨**:
- REST + WebSocket — 시세 / 주문 / 입출금 / 계정
- `GET /v1/status/wallet` — 입출금 + 블록 상태
- 2024 년 9 월부터 Private WebSocket `MyOrder` / `MyAsset` 지원

**미확인**: Upbit 와 동일 영역

### Coinone (footnote 19, 27)

**확인됨** (가장 세밀한 상태 enum):
- `txid`, `confirmations`, 입출금 주소, 상태값
- **상태 enum**: `DEPOSIT_WAIT` / `DEPOSIT_SUCCESS` / `DEPOSIT_REJECT` / `WITHDRAWAL_REGISTER` / `WITHDRAWAL_WAIT` / `WITHDRAWAL_REFUND_FAIL`
- Private WebSocket `MYASSET` — 잔고 변경 실시간 스트림

**부분 확인** (코인원 리크루팅 인터뷰, footnote 20):
- Kotlin / Spring 기반 MSA 전환
- AWS Managed Service 활용
- Replica DB → AWS DMS 실시간 동기화 → Spring Boot Batch 가공 적재
- AML 정보 배치 프로그램

**미확인**: 인덱서 전용 노드 / 큐 / DB / 포크 처리 / RPC 로드밸런싱

### Korbit (footnote 21, 22, 23, 28) — 국내 최다 공개

**확인됨**:
- REST + WebSocket, Open API 비동기 시스템 (응답 지연 가능 명시)
- WebSocket Public / Private 분리
- Private: `myOrder` / `myTrade` / `myAsset`
- 입출금 상태: `pending` / `actionRequired` / `reviewing` / `processing` / `done` / `failed`
- `transactionHash` 가 아직 블록체인에 안 보내졌으면 `null` 반환

**기술 블로그 공개** (tech.korbit.co.kr):
- **Kafka 중심 비동기 이벤트 아키텍처 + Event Sourcing**
- 주문 서비스 이벤트 발행 → 체결 엔진 소비 → 잔고·시세 서비스 소비
- 언어: Open API/주문 = **Go**, 체결 엔진/시세 = **Rust**
- 서비스 간 통신: **gRPC** 또는 Kafka + Protocol Buffers
- 런타임: **AWS EKS**

**입출금 워크플로** (Temporal 사용):
- 입금 감지 → 외부 AML (Chainalysis 등) 스크리닝 → 잔고 반영 또는 계류 → 반환 확정 시 자산 이동·블록체인 출금
- Temporal 기능: durable timer (`Workflow.sleep`), Activity Retry Policy, 장애 후 Replay, 멱등성, `ALLOW_DUPLICATE_FAILED_ONLY`, `continueAsNew`, 대시보드 추적
- **Chronos**: 입출금 중단 / 재개 예약, Slack Fail-safe, 노드 상태·수수료·업그레이드 실시간 모니터링, 수수료 지갑 자동 충전 계획

**미확인**: 인덱서 전용 저장소 종류, 체인별 full / archive 토폴로지

## 비교 표

| 조직 | 공개 수준 | 인덱서 존재 / 형태 | 핵심 설계 | 정합성·보안·복구 | 미확인 영역 |
|---|---|---|---|---|---|
| **Fireblocks** | 부분 확인 | 내부 체인 추적 + API/웹훅/영수증. 범용 인덱서 제품 설명 미확인 | 블록체인/자산 API, EVM receipt, network routing, Webhooks v2, multi-destination batching | 순서 비보장, expo backoff, 30일 재전송, JWKS, IP allowlist, balance validation, externalTxId 영구 멱등성 | 노드 / 큐 / DB / 캐시 / 검색·분석 스토어 / 백필 |
| **Coinbase** | 확인됨 | 자체 인덱서 플랫폼 + 외부 CDP 데이터/API 제품화 | 로드밸런싱 노드 클러스터, ELT, S3+DynamoDB, chain-native parser, ChainNode/Temporal/Go RPC, DynamoDB/S3/Delta Lake/Kafka, K8s, Spark, 캐시 | Reorg = add/remove event sequence, Merkle 검증, node failover, 배포 lock, streaming/batch 병행 | 일부 세부 캐시/서빙 스키마, 체인별 노드 수량 |
| **Binance** | 부분 확인 | Wallet API + User Data Stream + 상태/이력 API. 내부 인덱서 미확인 | coin/network metadata, deposit/withdraw history, balance update WS, 1024 streams 제한 | REST timeout → stream 재조회, batch+stream, S3/Hive backfill | 노드 / 파서 / 포크 처리 / DB / 캐시 / 인덱싱 파티셔닝 |
| **Upbit** | 부분 확인 | 입출금 상태 + 입금 가능 + Private WS | status/wallet, deposits/chance/coin, myAsset/myOrder, idle 120s, reconnect | minimum_deposit_confirmations 제공, 수 분 지연 가능, 최초 myAsset 구독 1 초 지연 가능 | 노드 / 큐 / DB / 캐시 / 포크 / 백필 / 장애복구 |
| **Bithumb** | 부분 확인 | 입출금 API + Private WS | REST+WS, wallet/block status, MyOrder/MyAsset | 외부 API 풍부, 내부 정합성 메커니즘 비공개 | 노드 / 큐 / DB / 캐시 / 백필 / 포크 / 장애복구 |
| **Coinone** | 부분 확인 | 입출금 이력/주소/Private WS | txid, confirmations, 세밀한 deposit/withdraw/refund/reject status, MYASSET WS, MSA + Replica DB + DMS + Spring Batch + AML | 상태 모델 세밀, 환급/거절 상태 노출 | 인덱서 전용 노드 / 큐 / DB / 포크 / RPC LB |
| **Korbit** | 확인됨 | 내부 이벤트/워크플로 처리 + 외부 REST/WS | Kafka Event Bus, Event Sourcing, Go (Open API/주문) + Rust (체결/시세), gRPC/protobuf, AWS EKS, Temporal 기반 입금 계류·반환·운영 자동화 | durable timer, Retry Policy, Replay, 중복 방지, continueAsNew, Slack fail-safe, 상태기계 중심 | 인덱서 전용 저장소 종류, 체인별 full/archive 토폴로지 |

## 비교 핵심: 3 평면 분리

거래소 인덱서 = 모놀리식 ✗, 3 개 분리 평면:

1. **원시 체인 데이터 수집 평면**
2. **파생 인덱서 / 서빙 평면** (특정 조회 패턴에 맞게 변환)
3. **원장 / 워크플로 평면** (입금 / 출금 / 환급 / AML / 승인 / 잔고 반영)

| 조직 | 가장 분명히 공개한 평면 |
|---|---|
| Coinbase | 세 평면 모두 |
| Fireblocks | 워크플로 / 정책 평면 |
| Korbit | 거래소 이벤트 / 워크플로 평면 |
| Upbit/Bithumb/Coinone/Binance | 외부 = 서빙 평면만 |

## 권장 아키텍처 (B4 결론)

### 중소 거래소 (footnote 33)

> "모든 체인의 풀 자체 인덱싱 ✗, 주요 체인만 직접 통제 + 나머지는 관리형 RPC / 스트리밍 / 오픈 프레임워크 혼합"

구성:
- 상위 체인만 자가 Full/Archive
- Long-tail = 관리형 RPC / 색인 소스 (SQD / HyperIndex 등)
- Postgres + Redis
- Object Storage (raw receipts / logs / backfill files)
- 하나의 durable workflow engine (Temporal 등)

### 대형 거래소 (footnote 34)

> "Coinbase 의 raw-data lake + multi-sink serving + Korbit 의 Kafka/Temporal 워크플로 + Fireblocks 의 웹훅 보안/멱등성 패턴 결합"

핵심 3 원칙:
1. 원시 블록 버리지 말고 저장
2. 도메인별 파생 인덱서 분리
3. 입출금 상태 전이를 durable workflow 에 올림

### 기관용 서비스 (footnote 35)

> "Fireblocks류 정책/서명/웹훅 플레인 + 자체 인덱서 플레인 분리. 인덱서는 체인별 최소 read model 중심"

→ 서명 평면과 데이터 평면을 혼합하면 장애 전파 반경이 커짐.

## 최종 결론 (B4)

> "거래소 인덱서는 'RPC 를 읽어서 DB 에 넣는 프로그램' 이 아니라, 거래소 원장과 고객 자산을 안전하게 연결하는 **정산 시스템의 일부**. 좋은 설계는 빠른 인덱싱보다 **재처리 가능성 / reorg 안전성 / 멱등성 / 운영 자동화 / 이벤트 재전송 / 상태 전이 가시성** 우선."

설계 출발점: "**모든 것을 직접 만들 것인가**" 가 아니라 "**어떤 평면을 직접 소유해야 사업 리스크를 통제할 수 있는가**".

## Sources (36 external URL footnotes)

본 보고서의 외부 URL footnote 보존:

- **1, 2, 4, 6, 11, 25, 29, 31, 32, 33, 34, 36**: Coinbase blog Part 1 - ChainStorage `coinbase.com/blog/part-1-chainstorage-the-enterprise-blockchain-data-availability-layer`
- **3, 9**: Fireblocks docs - webhooks getting started `developers.fireblocks.com/reference/webhooks-gettingstarted-responsesretries`
- **5, 16, 17**: Upbit docs - service status `docs.upbit.com/kr/reference/get-service-status`
- **7, 24**: Fireblocks docs - list blockchains `developers.fireblocks.com/api-reference/blockchains-%26-assets/list-blockchains`
- **8**: Fireblocks docs - statuses `developers.fireblocks.com/reference/statuses`
- **10**: Fireblocks docs - manage withdrawals at scale `developers.fireblocks.com/docs/manage-withdrawals-at-scale`
- **12**: Coinbase blog Part 3 - From Block to APIs `coinbase.com/blog/part-3-from-block-to-apis-building-indexers-on-chainstack`
- **13**: Coinbase CDP docs `docs.cdp.coinbase.com/data/get-started/quickstart`
- **14, 26**: Binance docs - wallet capital `developers.binance.com/docs/wallet/capital`
- **15**: Binance tech blog `binance.com/en/blog/tech/7972341655591522254`
- **18**: Bithumb developer docs `apidocs.bithumb.com/docs/빗썸-developer-docs`
- **19, 27**: Coinone docs - coin transaction history `docs.coinone.co.kr/reference/coin-transaction-history`
- **20**: Coinone recruiting blog `recruit.coinonecorp.com/blog3`
- **21, 28**: Korbit docs `docs.korbit.co.kr/`
- **22**: Korbit tech blog - 차세대 거래 시스템 `tech.korbit.co.kr/posts/system-architecture-design-of-cryptocurrency-exchange/`
- **23**: Korbit tech blog - Temporal 입금 계류 `tech.korbit.co.kr/posts/building-deposit-pending-with-temporal/`
- **30**: The Graph docs `thegraph.com/docs/en/`
- **35**: Fireblocks docs - validating webhooks `developers.fireblocks.com/reference/validating-webhooks`

## For full content
`sources/indexer/Fireblocks와 국내외 거래소의 블록체인 인덱서 설계·구현 비교 보고서.pdf` (9 페이지, Korean).

## Related Pages

- [[docs/architecture/vendor-indexer-implementations-hypothesis]] §6 — B4 본 자료 흡수
- [[docs/architecture/blockchain-indexer-architecture-reference]] — Stage 41 fact-tier reference
- [[docs/architecture/deposit-lifecycle]] — "입금 감지 vs 잔고 반영" 분리 원칙
- [[vendors/fireblocks/blockchains]] — Fireblocks DCCP
- [[open-questions/fireblocks]] Q-2026-05-18-B03
