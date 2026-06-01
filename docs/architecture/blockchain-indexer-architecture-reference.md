---
title: Blockchain Indexer — Architecture Reference (vendor-neutral)
layer: architecture
stage: 41
date: 2026-06-01
status: draft
reasoning_mode: generalized-reference (5 ecosystem 사례 + Fireblocks 와의 대비)
depends_on:
  - multi-chain-adapter-pattern.md — chain semantic variance
  - deposit-lifecycle.md — confirmation/finality truth-determination
  - reconciliation-settlement-consistency.md — projection vs raw log
related_external:
  - sources/indexer/2026-06-01__블록체인-인덱서-심층-분석-보고서.md
core_thesis: |
  Indexer is not cache. It is the data operating system between chain and user.
  Keep raw immutable, project disposably, expose finality as contract, isolate query plane.
---

# Blockchain Indexer — Architecture Reference (vendor-neutral)

> **본 문서의 위치**: SaaS (Fireblocks 등) 가 indexer 를 흡수해 customer 에게 webhook 만 노출하는 모델과 대비되는 **direct-build / 설치형 WaaS / vendor-neutral reference** 영역. Polkadot · SubQuery · The Graph · NEAR · Solana · Ethereum · Blockscout 의 공식 문서 합성. **Fireblocks 의 비공개 indexer 구현이 본 reference 의 어떤 pattern 에 매핑되는지** 도 함께 reasoning.

> **본 문서가 답하는 핵심 질문**: 왜 인덱서는 RPC wrapper 가 아닌가? 왜 raw 와 projection 을 분리해야 하는가? 왜 confirmation 정책이 API 계약이어야 하는가? 왜 query plane 격리가 단순 분리가 아닌 핵심 안전장치인가? Fireblocks 같은 SaaS 가 indexer 를 흡수하는 model 과 자체 구축 model 의 trade-off 는 무엇인가?

---

## 0. 핵심 명제 (10초 이해)

1. **Indexer is the data operating system between chain and user.** 단순 cache 아님. 성능 · UX · 정합성 · 보안 · 비용 · 분산성의 교환관계의 균형점이 indexer 설계.
2. **검증 가능한 소스에서 raw append-only 이벤트 보존 → idempotent projection 별도 → query plane 독립 확장 → reorg 정책 API 계약으로 노출.** The Graph · NEAR ReadRPC · Solana Geyser · SubQuery · Blockscout 가 서로 다른 stack 으로 공통으로 보여주는 패턴.
3. **인덱서 전략 = 위험 모델 + 신뢰 모델의 일부.** 자체 풀노드 = 높은 검증성 + 높은 운영비. 호스티드 스트림 = 빠른 개발 + 외부 공급자 의존성. (source: `ethereum.org/.../light-clients/`, `thegraph.com/docs/en/indexing/tap/`)
4. **확정성은 API 계약이지 implementation 디테일이 아니다.** `processed` / `confirmed` / `finalized` 를 API spec 에 노출하지 않으면 UX 팀과 데이터 팀이 서로 다른 숫자를 보게 됨. (source: `solana.com/developers/guides/advanced/confirmation`)

---

## 1. 인덱서의 4 가지 본질적 필요성

### 1.1 성능

블록체인 데이터는 본질적으로 순차 + 분산 — 다중 블록 · 과거 상태 · 집계 질의를 직접 RPC 로 수행 시 느림 · 비쌈. Polkadot 문서: 복잡한 교차 블록 질의와 집계는 **수일 ~ 수주** 걸릴 수 있고 직접 체인 질의는 dApp 성능을 해침. Solana 문서: `getProgramAccounts` 같은 무거운 RPC 부하로 validator 가 네트워크를 따라가지 못할 수 있어 Geyser 외부화. NEAR: 복잡한 컨트랙트 상태 질의에서 RPC 최적 아님.

### 1.2 UX

"지금 막 발생한 이벤트" + "역사 전체 가공 결과" 동시 요구. SubQuery: 추가 레이어 indexer 가 지연 만들 수 있음을 전제로 미확정 데이터 실시간 인덱싱 + reorg 자동 롤백 지원. Solana: `processed` / `confirmed` / `finalized` commitment 공식 구분. → 실무자는 **UX 위한 낮은 지연** vs **정합성 위한 높은 확정성** 을 정책적으로 결정해야 함.

### 1.3 데이터 접근성

원시 RPC 만으론 부족 — 도메인 schema · 검색 · 페이징 · 집계 · 전문검색 필요. Ethereum 의 JSON-RPC + pub/sub + tracing 도 과거 상태 / tracing 은 archive node 사실상 필요. Geth hash-based archive 는 **20TB 초과** 가능.

### 1.4 분산성

★ 가장 미묘한 axis. Indexer 는 양날의 검:
- **탈중앙화 보완**: Ethereum 풀노드 직접 운영 = 가장 trustless · private · censorship resistant. The Graph 는 indexer 가 token staking + 잘못된 데이터/인덱싱 시 slashing → 질의 레이어 자체를 네트워크 형태로 분산.
- **탈중앙화 역전**: NEAR 비교 표 — 과거 Lake Framework 는 S3 기반이라 "Decentralized: No", 직접 체인 read 하는 NEAR Indexer 는 "Yes" 로 구분. **잘못 설계된 indexer 는 체인 위에 새 데이터 권력층** 생성.

→ "무엇을 누가 검증하느냐" 가 핵심. 자체 풀노드 기반 = 검증성 ↑ + 운영비 ↑. 호스티드 스트림 = 개발 속도 ↑ + 외부 공급자 의존성 ↑.

---

## 2. 4 구현 패턴

| 패턴 | 메커니즘 | 대표 사례 | 장점 | 단점 |
|---|---|---|---|---|
| **(P1) 풀노드 기반 pull** | JSON-RPC / WebSocket / tracing API / 내부 framework 직접 read | Geth · Reth · nearcore · NEAR Indexer · Ethereum eth_subscribe + tracing | 정합성 · 분산성 | 노드 운영 · 스토리지 부담 |
| **(P2) 이벤트 스트리밍** | validator plugin / pub/sub push | Solana Geyser · Yellowstone gRPC · Ethereum WebSocket · Kafka | 저지연 | 재전송 · 중복 · reorg 처리 필요 |
| **(P3) 트랜잭션·이벤트 스캔** | 체인 전체 훑되 handler/topic/address filter + dictionary 로 선택 | EVM logs · SubQuery dictionary · Blockscout catchup | 선택적 필터링 효율 | filter 설계 의존도 |
| **(P4) 상태 스냅샷 / 데이터 레이크** | 파일 · 오브젝트 스토리지 · gRPC 스트림 외부화 | NEAR Lake · Firehose | 대량 재처리 · 병렬화 쉬움 | 외부 공급자 의존도 |

**실무 조합**: 보통 2~3 패턴 mix. 예: The Graph = Firehose (P4 병렬) + Graph Node (P1 pull) + Postgres 적재.

---

## 3. 참조 아키텍처

```
체인 데이터 소스 (Full Node · Archive · Geyser · Firehose · S3 Lake)
        │
        ▼
데이터 수집기 (RPC Poller · WebSocket · gRPC · File Reader)
        │
        ▼
체크포인트 · 리오그 관리자 (Cursor · Block Confirmation · Rollback)
        │
        ▼
파서 / 디코더 (ABI · IDL · Schema decode)
        │
        ▼
정규화 이벤트 로그 (Append-only Raw Store) ◀── ★ immutable, 핵심
        │                       │
        ▼                       ▼
Projection Workers      Stream Bus (Kafka, optional)
(Balances · Transfers ·         │
 NFTs · Search Docs)     백업 · 복구 · 재동기화
        │
        ▼
저장 계층 (역할별 분리):
  • 기준 (PostgreSQL — system of record)
  • 상태/캐시 (RocksDB · Redis)
  • 검색 (Elasticsearch · OpenSearch)
        │
        ▼
Query API (GraphQL · REST · SQL · gRPC)
        │
        ▼
게이트웨이 / WAF / Rate Limit
        │
        ▼
모니터링 (Prometheus · Grafana · Logs)
```

### 3.1 수집-질의 분리가 핵심

"인덱서 성능" 은 단일 프로세스 속도보다 **파이프라인 분리** 에서 더 많이 나옴:
- Graph Node = 전용 query node + dedicated indexing node + Postgres shard
- Blockscout = indexer mode / API mode / webapp mode 분리, same DB 공유 가능
- Solana = validator 가 무거운 RPC 질의로 밀리지 않도록 Geyser 외부화

### 3.2 재동기화 · 리커버리 별도 기능

- Firehose: cursor-based resumption + fork-aware streaming
- SubQuery: block confirmation + 자동 rollback
- Kafka: consumer offset 재설정 + log 재처리 + retention 정책
- → **"처음부터 다시 sync"** 가 아닌 **"체크포인트 이후만 replay"** 가 운영비 핵심.

### 3.3 모니터링 = 필수

가장 흔한 장애 4 가지: **체인 헤드 추격 실패 · DB 디스크 고갈 · RPC rate limit · reorg 후 projection 불일치**. 모두 모니터링 부재 시 악화. Graph Node 는 Prometheus 메트릭 + Grafana 예시 공식 제공, SubQuery 는 인덱서/쿼리 헬스체크 + CPU/메모리/디스크/외부 RPC/DB 용량 모니터링 권장.

**필수 지표**: `head lag` / `finalized lag` / `DB connection wait` / `RPC error rate` / `replay duration` / `query p95` / `disk free` / `queue depth`.

---

## 4. 데이터 모델 (vendor-neutral)

원시 블록 구조 복사 ❌. **공통 entity + 도메인 entity 분리**.

**공통 layer (5 core)**: `Block` / `Transaction` / `Log/Event` / `StateChange` / `Checkpoint`
**도메인 layer**: `TokenTransfer` / `NFTTransfer` / `PoolSwap` / `AccountBalance` / `OrderBookFill` etc.

EVM · Substrate · NEAR · Solana 공통 적용 가능한 GraphQL schema 는 [[sources/indexer/2026-06-01__블록체인-인덱서-심층-분석-보고서]] §3 참조.

**Materialized projection 의 핵심 invariant**:
- 모든 projection row 에 `as_of_block` 또는 `finalized_at` 남김
- Raw log 절대 삭제 안 함 (replay 의 source of truth)
- Projection 은 disposable (언제든 재생성 가능)

---

## 5. 비기능 요구사항 8-axis

| 요구사항 | 의미 | 권장 전술 | 지표 |
|---|---|---|---|
| **일관성·정합성** | reorg / 미확정 / 중복 수신에도 결과 불변 | block confirmation 정책 · append-only raw log · idempotent upsert · cursor 저장 · rollback/replay | rollback 성공률, data drift 건수 |
| **지연시간** | UX 최신성 | 소스별 commitment 분리 · hot projection 우선 · cache/streaming | head lag · p95 ingest latency |
| **처리량** | 고 TPS · 대규모 백필 | filter/dictionary · parallel worker · Kafka partitioning · bulk write | blocks/s · tx/s · rows/s |
| **확장성** | 체인 수 · projection 수 · 질의량 증가 | API/Indexer 분리 · query node 분리 · DB sharding · table partitioning | shard 별 QPS · DB wait time |
| **보안** | 데이터 위조 · DoS · 오염 | signed receipts · WAF/API gateway · query complexity 제한 · 최소 포트 노출 | invalid proof 비율 · rate-limit hit |
| **프라이버시** | 오프체인 enrichment · 운영 로그 노출 | query receipt/log 분리 · TLS · 접근제어 · 최소 정보 보관 | PII 항목 수 · 암호화 범위 |
| **운영성** | 백업 · 재동기화 · 장애 복구 | raw log 보존 · snapshot 백업 · 재처리 파이프라인 · Grafana/Prometheus | RPO · RTO · replay 시간 |
| **마이그레이션** | 스키마 변경 시 서비스 중단 최소화 | schema migration flag · blue/green projection · versioned API | migration 시간 · rollback 가능 여부 |

### 5.1 정합성은 체인별로 다름

- **Solana**: `processed` = 최신 but 롤백 가능 / `finalized` = 보수적
- **SubQuery EVM**: 기본 `block confirmations = 200` + 자동 롤백
- **Firehose**: fork-aware streaming + cursor-based resumption
- → **"이 인덱서의 질의 결과가 어느 확정 수준을 반영하는가" 를 API 계약서에 반드시 명시.**

### 5.2 처리량 = 덜 읽고, 덜 쓰고, 더 굵게 쓰기

- SubQuery: mapping filter · dictionary 가 처리 블록 수 크게 감소. worker thread + store cache 조정으로 **최대 4배 가속**.
- PostgreSQL: 파티셔닝 (hot partition 메모리 유지) + DROP/DETACH PARTITION 으로 bulk delete 가속.
- 복합 인덱스: `height` / `timestamp` / `contract/program` / `account` + 월별·높이대별 파티셔닝.

### 5.3 검색 / 분석 분리

- **검색 / 전문집계** 필요 시 Elasticsearch 추가 (JSON document + shard 기반 수평확장 + metric/bucket/pipeline aggregation 공식 지원).
- **기준 저장소** 는 여전히 Postgres 가 유리.
- → "정합성의 원본(DB of record) = Postgres, 검색·전문집계 = Elasticsearch" 이중 구조.

### 5.4 Schema migration ≠ 전체 재색인

NEAR Indexer for Explorer: 공개 SQL 스키마 진화 가능, release note 추적 권장, 일부 migration 은 `CONCURRENTLY` 수동 적용. SubQuery: `--allow-schema-migration` 플래그로 자동 schema migration. → **projection 버전과 백필 전략을 분리**. 현재 버전 + 다음 버전 병행 운영 후 백필 완료 시점에 스위칭.

---

## 6. 기술 스택 비교

| 기술 | 주 용도 | 장점 | 단점 | 적합한 상황 |
|---|---|---|---|---|
| **The Graph / Graph Node** | Subgraph 기반 인덱싱·GraphQL | 분산형 indexer 네트워크 · query node 분리 · Postgres shard · Prometheus/Grafana | GraphQL/entity 모델 중심 자유도 ↓ · Postgres 의존 | dApp 공개 API · 표준 이벤트 도메인 |
| **Firehose / Substreams** | 대규모 병렬 추출·변환 | sub-second live streaming · fork-aware · cursor resume · 병렬 실행 · 일부 subgraph 100x+ | 도입·학습 비용 · 별도 저장/서빙 설계 필요 | 대규모 백필 · 멀티프로젝션 · 고성능 ETL |
| **SubQuery** | 멀티체인 인덱서 SDK + GraphQL | EVM·Substrate·NEAR 폭넓은 지원 · filter/dictionary · worker thread · schema migration | 프레임워크 복잡도 · Postgres/RPC 품질 좌우 | 멀티체인 · 빠른 개발 · 자체 호스팅 또는 네트워크 |
| **Blockscout** | EVM 탐색기 / 인덱서 | realtime + catchup 이중 인덱서 · 다수 secondary fetcher · API/UI/Indexer 분리 | explorer 성격 강해 범용 DW 가공 필요 | 탐색기 · API · verification · 멀티 EVM |
| **Kafka** | 스트림 버스 · 재처리 · 역압 | partition 병렬성 · offset replay · retention/compaction · replication/idempotence | 운영 복잡도 · broker/partition 설계 필요 | high-volume event bus · fan-out 파이프라인 |
| **PostgreSQL** | 기준 저장소 · GraphQL 백엔드 | 강한 SQL · 파티셔닝 · jsonb · 운영 성숙도 | 쓰기 폭주 · 대규모 전문검색 약점 · shard 운영 난이도 | 대부분 인덱서의 system of record |
| **RocksDB** | 로컬 상태 저장 · 고속 KV | LSM 고성능 · SSD 친화 · 임베디드 · 저지연 | 운영형 질의엔진 ✗ · API 적음 | state store · cache · checkpoint |
| **Elasticsearch** | 검색 · 분석 · 전문검색 | shard 기반 확장 · JSON documents · aggregations · full-text search | 기준 저장소엔 정합성 부담 | 탐색기 검색 · 로그 분석 · 랭킹·검색 UI |

### 6.1 워크로드별 추천 조합

- **고성능 분석형**: Firehose/Substreams + Kafka + PostgreSQL + Elasticsearch
- **dApp API형**: Graph Node 또는 SubQuery + PostgreSQL + Redis 캐시
- **탐색기형**: Blockscout (이미 secondary fetcher · verification 마이크로서비스 보유)
- **초저지연 Solana형**: Geyser/Yellowstone + Kafka 또는 직접 Postgres + 로컬 KV 캐시

**선택 기준 한 줄**: "백필·재처리 핵심 → streaming/file-first / 운영 단순성 → framework + Postgres-first / 검색 UX → search engine 보조 인덱스 / 탐색기 → Blockscout / 검증 가능한 분산 질의 → The Graph"

---

## 7. 5 대표 사례 비교

| 사례 | 데이터 원천 | 핵심 패턴 | 공개 수치 / 설정값 | 강점 | 한계 |
|---|---|---|---|---|---|
| **The Graph** | Graph Node + Firehose/Substreams | entity projection + sharding + query node | 일부 subgraph sync 100x+, Prometheus endpoint, Postgres sharding | 분산형 indexer 네트워크 · 표준 GraphQL | Postgres 의존 · 대규모 변환 Substreams 필요 |
| **NEAR** | nearcore Indexer / 과거 Lake / ReadRPC | full-node stream + state/tx indexer 분리 | 3.8s min / 5–7s avg, Lake 6–8s avg, **$500+/mo vs $20/mo**, Explorer mainnet 3TB | 체인 직접 read · 상태변화 모델 명확 | Lake 2026-03-24 중단, 일부 수치 역사적 |
| **Polkadot/Substrate + SubQuery** | RPC + dictionary + filter | selected block scan + GraphQL | worker threads **최대 4배**, batch-size 100, default block confirmations **200 (EVM)** | 멀티체인 · filter/dictionary 최적화 | RPC 품질 의존 · 운영 지식 필요 |
| **Solana** | Geyser / Yellowstone / WebSocket | validator-side streaming | **slot 400–600ms**, plugin 예시 `threads=20 batch_size=20` | 초저지연 · validator/RPC 분리 | 고 TPS · 대용량 · 운영 리소스 큼 |
| **Ethereum + Blockscout** | JSON-RPC / eth_subscribe / tracing / archive | realtime + catchup + secondary fetchers | **path archive ~2TB or 6.5TB**, **hash archive 20TB+**, **sync 약 2주 ~ 수개월** | explorer/API 운영성 · historical/tracing 강 | 스토리지·컴퓨트 비용 큼 |

### 7.1 The Graph — 네트워크형 indexer
- GRT staking + query fee + indexing reward + slashing
- GraphTally signed receipt + RAV (Redeemable Aggregate Voucher) → 데이터 평면과 결제 평면 분리
- 일부 subgraph 100x+ sync (Substreams 병렬화)

### 7.2 NEAR — Full-node + Lake + ReadRPC 3 model 비교
- ReadRPC = `rpc-server` (Postgres/S3/실시간 RPC 조합) + `state-indexer` (상태변화) + `tx-indexer` (transactions/receipts/execution outcomes) → **CQRS 구조**
- NEAR Lake 2026-03-24 신규 인덱싱 중단, Neardata 또는 Nearcore Indexer 권장
- 비교: Indexer 가 Lake 보다 지연 ↓ + 분산성 ↑ but 인프라 비용 + 유지보수 ↑

### 7.3 SubQuery — 선택적 스캔 모범
- `project.ts`: data source · startBlock · ABI · handler · filter 선언
- `schema.graphql`: projection 정의
- dictionary = "relevant block height 만 받아옴" → 불필요한 블록 처리량 ↓

### 7.4 Solana Geyser/Yellowstone — Validator-side push
- Anza 공식: validator 가 무거운 RPC 질의에 밀릴 수 있어 plugin 으로 `accounts` · `slots` · `blocks` · `transactions` 를 Postgres/NoSQL/Kafka 외부화
- Yellowstone gRPC: slots · blocks · transactions · account updates · deshred pre-execution transactions
- Solana RPC 공식: shared public endpoint = production 금지, 429/403 발생

### 7.5 Ethereum + Blockscout — 다층 secondary fetcher
- realtime importer + catchup importer
- internal transactions · pending tx · dropped/replaced tx · contract bytecodes · balances · NFT instances · chain-specific fetcher
- → "원시 블록 적재만으로 끝나지 않음" — 파생 데이터가 훨씬 많음
- mode separation: indexer/API/UI 분리, same DB 공유

---

## 8. 보안 · 공격면 6 가지

1. **데이터 위조 / 오염** — 검증 가능한 소스가 첫 방어선. Ethereum: 풀노드 = 가장 trustless. The Graph: signed receipt + on-chain redemption + slashing. → 고신뢰 서비스는 최소 1 개 이상의 자체 검증 소스 (full/archive/light client, protocol-integrated receipt verification).
2. **Replay & reorg** — `append-only raw log + idempotent projection + checkpoint + rollback` 조합 mandatory. Firehose fork-aware · SubQuery 자동 롤백 · Solana commitment 분리. **모든 projection row 에 `as_of_block` 또는 `finalized_at` 남기고, raw log 삭제 금지**.
3. **DoS / query 폭주** — Solana 공식: shared public RPC = production ✗, 429/403 발생. SubQuery: API gateway + WAF + rate limit + TTL cache + 최소 포트. Graph Node + Blockscout: API 와 query plane 분리 가능. **공용 인터넷에는 query plane 만 노출.**
4. **Off-chain enrichment 오염** — query receipt/log 분리, TLS, 최소 정보 보관.
5. **운영자 실수 → schema 불일치** — schema version vs API version 분리. NEAR: release note 추적 + 수동 migration. SubQuery: 자동 schema migration + 헬스체크.
6. **DB / Storage 자원 고갈** — head lag · DB disk · external RPC health · query p95 · replay duration · proof validation error 모니터링 부재 시 악화.

---

## 9. 비용 모델 (AWS 공식 단가 직접 인용)

```
월 총비용 =
  노드 컴퓨트 (풀노드/아카이브/인덱서/API)
+ DB 스토리지 (핫)
+ 오브젝트 스토리지 (백업/레이크)
+ 스트림 버스 비용 (Kafka 등)
+ 네트워크 egress
+ 모니터링/로그 저장
+ 운영 인력비
```

**공식 단가** (변동 가능, 공식 페이지 우선):
- AWS gp3: **$0.08/GB-month**
- AWS S3 Standard: **$0.023/GB-month**, PUT/COPY/POST/LIST **$0.005/1,000 requests**

**Ethereum archive 스토리지 비용 하한** (gp3 기준, compute · snapshot · egress 제외):
- Geth path-based archive 2TB: **~$163.84/월**
- Geth path-based archive 6.5TB: **~$532.48/월**
- Geth hash-based archive 20TB: **~$1,638.40/월**

→ Ethereum archive 기반 indexer 는 **스토리지만으로 중형 SaaS 한 대 비용**.

### 9.1 3-tier 예산 모델

| 규모 | 워크로드 | 인프라 | 비용 드라이버 | 실무 해석 |
|---|---|---|---|---|
| **경량** | 특정 컨트랙트/프로그램 이벤트만 | private RPC + indexer app + Postgres 수백 GB | DB 저장·쿼리 | 빠른 개발 + 저비용 |
| **중간** | 멀티프로토콜 API · explorer-lite · search | full node 또는 managed stream + Kafka optional + Postgres 1–3TB + ES | DB IOPS · 인덱스 수 · query traffic | 가장 흔한 production |
| **중량** | Ethereum explorer/analytics · Solana low-latency | archive/full node cluster + streaming + 대형 DB + search + backup | archive storage · sustained compute · egress | 자체 인프라 팀 없으면 운영 난도 매우 ↑ |

### 9.2 비용 최적화 3 원칙

1. **raw 와 projection 분리** → projection 재생성 가능 → backup 주기 공격적 단축
2. **필요한 블록만 read** → dictionary · topic/address filter · startBlock 최적화 = 비용 절감
3. **archive node 무조건 self-host 금지** → 초기엔 private archived RPC 또는 lake/firehose 공급자. 트래픽이 비용 역전 시점에만 self-hosting.

### 9.3 Hypothesis-tier 추가 비용 데이터 (★ Stage 43, unverified)

[[docs/architecture/vendor-indexer-implementations-hypothesis]] §5.3 에 LLM 생성 자료 (B3) 의 추가 vendor pricing 데이터 보존:

- Alchemy 무료 플랜 (월 30M CU + 5 webhooks)
- QuickNode Build $42-49/월, Business $849-999/월
- AWS MSK 3-broker + 1,000GB ingest/storage 예시 = $1,020.66/월
- AWS EC2 t3.large on-demand 시간당 $0.0832
- 스타트업 운영 추정: 월 $100-800, 엔터프라이즈: 월 $3,000-20,000+

★ 위 수치는 LLM 생성 자료 인용 — vendor 공식 페이지에서 cross-verify 후 fact 승격 가능 (Q-VRF-18~22). 본 reference 의 AWS gp3 / S3 단가 (§9 위) 는 vendor 공식 cross-verify 완료, B3 는 별도 verify 필요.

---

## 10. 설계 체크리스트 (11 항목)

- [ ] 데이터 원천이 명확한가 (자체 풀노드 / archive RPC / Firehose / Geyser / lake)
- [ ] API 반환 확정 수준 명시 (`latest` vs `finalized` 구분)
- [ ] raw append-only 로그 보존 (projection 만 저장 ✗)
- [ ] reorg/replay 시나리오 테스트 + checkpoint + rollback 로직
- [ ] 필요한 블록만 read (filter/dictionary/startBlock 최적화)
- [ ] 기준 저장소 vs 검색 저장소 분리 (Postgres ≠ Elasticsearch 역할)
- [ ] query plane 만 외부 공개 + WAF/rate limit/query complexity 제한
- [ ] DB 파티셔닝 + 보조 인덱스 (`height` · `timestamp` · `contract` · `account`)
- [ ] schema migration 전략 (online migration · dual-write · backfill · rollback)
- [ ] 모니터링 항목 + SLO (head lag · query p95)
- [ ] 비용 모델에서 storage 와 egress 각각 계산, archive node 필요성 검증

---

## 11. Fireblocks 와의 관계 (★ 본 wiki 특화)

본 reference 의 vendor-neutral 분석을 Fireblocks SaaS 모델과 대비.

### 11.1 Fireblocks 가 흡수한 영역 (customer 입장에서 invisible)

| 영역 | Fireblocks 가 흡수 | 본 reference 의 4 pattern 매핑 (추정) |
|---|---|---|
| Full node + archive 운영 | ✅ AWS Public VPC (Node Infrastructure) | **P1** 풀노드 기반 pull |
| Indexer (P1~P4 조합) | ✅ 비공개 구현 | 추정: P1 + P2 + P3 조합 (체인별 다름) |
| Confirmation policy | ✅ DCCP — default + custom (Q-DC02 lead-time open) | 본 reference §5.1 "확정성은 API 계약" 의 SaaS 변형 |
| Webhook 송출 | ✅ HMAC + idempotency + resend API | 본 reference §3.2 재동기화 |
| Reorg handling | ✅ chain 별 finality + SOL `Confirmed` empirical 정책 | 본 reference §8.2 replay & reorg |

→ Fireblocks 의 명시 정책은 본 reference 의 8 NFR 중 **일관성·정합성** + **지연시간** 의 axis 를 정책 layer 로 흡수. Customer 는 **DCCP 통해 일부 override 만 가능** (single self-service 불가, Fireblocks Support 경유).

### 11.2 Fireblocks 가 흡수하지 않는 영역 (customer 책임)

- **Projection / domain-specific entity 설계** — 은행 의 회계 원장 · KR Travel Rule · 사용자 잔액 view 등은 customer 측 indexer/DB 영역. Fireblocks webhook 을 raw stream 으로 받아 자체 projection 구축.
- **검색 / 분석 / 전문집계** — Fireblocks API 는 일부 query 만 제공, 복잡한 cross-vault analytics 는 customer 측 Elasticsearch / OLAP 필요.
- **Query plane 격리** — Fireblocks API gateway 외에 customer 측 게이트웨이 별도 필요 (KR 망분리 환경).

### 11.3 3-way custody 모델과의 정렬

[[docs/architecture/three-way-custody-decision-framework]] §"Indexer / chain ingestion" 표 와 정합:

| | SaaS (Fireblocks) | 설치형 WaaS | Direct-build |
|---|---|---|---|
| Full node 운영 | Vendor | Vendor (대부분) | Customer multi-RPC |
| Indexer (P1~P4) | **Vendor (비공개)** | Vendor (대부분) | **Customer** — 본 reference 의 전체 적용 영역 |
| Projection / domain | Customer | Customer | Customer |
| Confirmation policy | Vendor 제공 + customer DCCP override | Vendor 제공 | Customer 결정 |
| Query API (Postgres/ES/GraphQL) | Customer | Customer | Customer |

→ **direct-build path** 가 본 reference 의 가장 큰 적용 영역. 설치형 WaaS 도 projection 이후는 customer 영역이므로 본 reference 의 §4 (데이터 모델) ~ §6 (기술 스택) 은 동일하게 적용.

### 11.4 Q-2026-05-18-B03 의 추가 부분 답

본 reference 의 4 pattern 관점에서 Fireblocks 의 indexer 구현은 다음으로 추정 (★ 비공개라 확정 불가):

- **EVM chains**: P1 (eth_subscribe + tracing API) + P3 (event/log scan with filter) 조합
- **Solana**: P2 (Geyser / Yellowstone 또는 자체 구현 — Fireblocks 는 SOL `Confirmed` empirical 정책)
- **Cosmos chains**: P1 (Tendermint WebSocket) + P3
- **Internal-tx 감지** (`debug_traceTransaction` 등): Fireblocks 의 `evmTransferType=INTERNAL` 노출 (source: Stage 36 `transaction-objects.md`) 으로 보아 **trace API 기반** 추정 — but RPC method 자체는 비공개.

→ Q-B03 의 본질은 "Fireblocks 가 4 pattern 중 어느 조합인가" — 본 reference 로 일반화된 분류는 가능, 구체 구현은 여전히 비공개.

**Stage 42 hypothesis-tier 추가 자료**: [[docs/architecture/vendor-indexer-implementations-hypothesis]] 에 LLM 생성 자료 기반의 vendor-specific 추정 (Fireblocks ATC / 1분-10분 timeout / BitGo BigInt / Coinbase Mesh BadgerDB / Modern Decoupled ETL 등) 보존. **★ 본 reference 와 tier 가 다름** — 본 페이지는 28 공식 출처 fact, hypothesis 페이지는 unverified. 17 개 Q-VRF cross-verification 항목 통과 시점에 fact 승격 가능.

---

## 12. Open Questions

- **Q-2026-06-01-IDX01** — 본 reference 의 11 체크리스트를 Fireblocks SaaS 모델에 적용 시 customer 가 직접 verify 가능한 항목은 어떤 것인가 (Fireblocks 측 audit log 노출 범위)
- **Q-2026-06-01-IDX02** — 설치형 WaaS (Fireblocks Hosted MPC / BCM) 의 indexer 평면이 vendor 와 customer 사이 어떻게 분리되는지 (BCM 이 vendor indexer 도 흡수하는가?)
- **Q-2026-06-01-IDX03** — KR 은행이 direct-build indexer 운영 시 KR 금융위 가상자산 가이드 (2026) 가 요구하는 audit/trace 항목과 본 reference 의 모니터링 지표 매핑

## Sources

### 본 reference 의 1차 자료
- [[sources/indexer/2026-06-01__블록체인-인덱서-심층-분석-보고서]] (16 페이지, 28 외부 출처)

### Fireblocks 측 cross-ref
- [[vendors/fireblocks/blockchains]] §"Deposit Control and Confirmation Policy (DCCP) — Stage 40"
- [[vendors/fireblocks/architecture]] §"Node infrastructure (Stage 7)"
- [[entities/fireblocks/transaction]] §"Stage 40 — DCCP 와 confirmation lifecycle"
- [[open-questions/fireblocks]] Q-2026-05-18-B03 (internal-tx 감지)

### 동급 generalized reference cross-ref
- [[docs/architecture/multi-chain-adapter-pattern]] §"Indexer layer"
- [[docs/architecture/deposit-lifecycle]] §"Indexer 가 본 tx vs system 의 deposit truth"
- [[docs/architecture/three-way-custody-decision-framework]] §"Indexer / chain ingestion" 책임 분담

## Related Pages

- [[docs/architecture/multi-chain-adapter-pattern]]
- [[docs/architecture/deposit-lifecycle]]
- [[docs/architecture/reconciliation-settlement-consistency]]
- [[docs/architecture/three-way-custody-decision-framework]]
- [[vendors/fireblocks/blockchains]]
- [[entities/fireblocks/transaction]]
