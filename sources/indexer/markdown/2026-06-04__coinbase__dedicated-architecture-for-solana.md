# A Dedicated Architecture for Solana at Coinbase (extracted)

> **출처**: <https://www.coinbase.com/blog/a-dedicated-architecture-for-solana-at-coinbase> (Coinbase Engineering blog)
> **저자**: Bill Sahin, Linda Liu, Andrew Allen, Ning Wei, Xiaying Peng — 2026-01-30
> **추출**: 2026-06-04, 사용자 저장 PDF → `pdftotext` (PDF 직접 Read 없음). 원본 PDF: `../pdf/2026-06-04__coinbase__dedicated-architecture-for-solana.pdf` (7p). fact tier: **official-vendor-engineering** (Coinbase 공식).

## TL;DR
Solana 스케일 수요 대응 위해 legacy **chain-agnostic** 처리 모델 탈피 → 전용 high-throughput **streaming 아키텍처 + 병렬 블록 처리**. 결과: **트랜잭션 처리량 12x ↑, deposit latency 20% ↓**.

## Legacy 시스템 (chain-agnostic, 6년 전 통합, 60개 체인)
3 레이어:
- **Node Layer**: 블록체인 인프라 운영, raw ledger data 용 RPC 엔드포인트 제공.
- **Indexing Layer (Blockchain I/O)**: chain-agnostic 추상화 — finalized block 폴링 + 트랜잭션 파싱.
- **Wallet Layer (Wallet Service)**: Coinbase 관리 주소의 source of truth. **sequential gRPC stream** 으로 Coinbase 관련 tx 필터, balance 조회 + tx 생성.

"one-size-fits-all" — 60개 체인 통합은 단순화했으나 "lowest common denominator" 네트워크 동작에 제약됨.

### 2 병목 (peak traffic 시 deposit/withdrawal 지연)
1. **Sequential Processing**: 다른 체인 때문에 필요한 제약(nonce 관리 strict sequential, chain reorg 대비)을 Solana 에도 적용 — **Solana 는 nonce 미사용 + fast finality** 이므로 인위적 병목.
2. **Polling Latency**: Blockchain I/O 가 finalized slot 을 RPC 폴링 → 불가피한 지연, high-traffic 시 심각, **Solana Alpenglow consensus 업그레이드의 sub-second finality 와 비호환**.

## The Innovation — 전용 Streaming Pipeline
- 협업: **Solana Foundation, Anza, Helius, Triton One**.
- 중심: **Solana I/O** — 커스텀 인덱싱·추상화 레이어. Solana high-throughput 데이터 스트림을 공유 legacy stack 에서 **분리(decouple)**. Wallet Service 인터페이스는 유지 → 기존 보안 프로토콜·reconciliation 로직 보존.

병렬 streaming pipeline 5단계:
1. **Address Registration**: Wallet Service 가 신규 주소 식별 → Solana I/O 에 통지 → DB 기록 (a.1, a.2).
2. **Hybrid Real-Time Ingestion**: 느린 폴링 → **하이브리드 모델**. **Geyser** 활용해 finalized slot height 실시간 스트림 → 병렬 RPC 호출로 block data 조회 (b.1~b.3). 높은 신뢰성 + zero data loss, node failover + historical backfill 용이 (push-only Geyser 전용 아키텍처에선 통상 어려운 부분).
3. **Parallel Filtering + Kafka Streaming**: Solana I/O processor 가 블록 파싱 + tracked 주소 tx 를 **병렬 필터** → 전용 **Kafka** 클러스터에 개별 메시지로 write (b.4, b.5).
4. **Concurrent Processing**: 전용 Kafka consumer 가 파싱된 블록 + 필터된 tx ingest → 기존 entity 구조로 transform → Wallet Service DB 에 **병렬** 저장 (b6~b8). "transform-then-store" = legacy 서브컴포넌트 drop-in 대체. 병렬 처리로 순서 뒤바뀜 발생 가능 → **high-water mark** 체크포인트로 strict sequencing 유지(필요 컴포넌트).
5. **Event Notification**: write 확정 → Solana I/O consumer 가 event-driven 프로세스(실시간 deposit 알림) 트리거 (b.9).

→ 다중 블록의 동시 파싱·필터·영속화로 legacy backlog 제거, end-to-end latency 대폭 감소.

## Impact
- **30일 Shadow Mode** (legacy 와 병렬 운영, balance/tx 상태 zero discrepancy 검증) → 2025-09-10 프로덕션 승격.
- **12x** Solana tx 처리량 증가.
- **5x** Solana withdrawal volume capacity 증가.
- 라이브 후 baseline **8x** traffic spike 무열화 흡수, **deposit latency 20% 감소**.
