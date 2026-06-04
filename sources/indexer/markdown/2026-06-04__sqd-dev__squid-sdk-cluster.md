# SQD / Subsquid (Squid SDK) — 인덱서 클러스터 (extracted)

> **출처**: docs.sqd.dev (SQD/Subsquid 공식 docs), WebFetch 추출 2026-06-04. fact tier: **vendor-official** (단 vs-The-Graph 비교는 **vendor-claimed 편향**).
> 3 페이지 합성: [A] processors/architecture, [B] subsquid-vs-thegraph, [C] tutorials/bayc/step-one.
> meta: `../webpages/sqd.dev/squid-sdk-cluster.meta.yml`

## [A] Processor 아키텍처 (reference/processors/architecture)

- **Processor service**: Node.js 프로세스 — data ingestion·transformation·persistence. entry `src/main.ts` → `node lib/main.js`.
- **Processor 클래스**: `EvmBatchProcessor`(EVM), `SubstrateBatchProcessor`(Substrate). 정의 `src/processor.ts`.
- **Data source**: **SQD Network**(archive data) + **Node RPC**. processor 설정에서 block range·data selector 지정.
- **Data sink**: `ctx.store`(Store 인터페이스) — target DB.
- **Lifecycle** `processor.run(db, batchHandler)`: `db`=data sink, `batchHandler`=async, `DataHandlerContext` 받아 transform·persist.
- **DataHandlerContext**:
  - `ctx.blocks` — on-chain data item 을 block 단위로 그룹. EVM iterable: `logs`/`transactions`/`stateDiffs`/`traces`. Substrate: `events`/`calls`/`extrinsics`.
  - `ctx._chain` — 내부 RPC 핸들(typegen facade 가 주로 사용, 직접 사용 드뭄).
  - `ctx.store` — 영속화 sink. `ctx.log` — 로거. `ctx.isHead` — chain head 도달 시 true.
- **Boundary blocks**: 매칭 데이터 없어도 valid header 와 함께 `ctx.blocks` 에 항상 포함. batch 엔 최소 1 block.
- **Canonical ordering**: ctx.blocks 의 canonical on-chain 순서 → in-memory 압축 효율. (단 transactions 는 canonical 정렬, traces 는 아님)
- **필터링 책임**: processor 가 filter 미통과 데이터 배제를 **보장하지 않음** → handler 에서 추가 필터 필요.
- **`setFields()`**: item object shape(필드 선택) 결정 — context 데이터 형태 좌우(selective fetching).

## [B] vs The Graph (subsquid-vs-thegraph) — ★ SQD 자체 주장(편향)

SQD = "radically open modular architecture" (데이터 추출 ↔ client-side 변환 분리) vs The Graph "black-box WASM".

| 차원 | SQD 주장 | The Graph |
|---|---|---|
| 성능 | ~1k–50k blocks/sec | ~100–150 blocks/sec |
| 언어 | TypeScript | AssemblyScript(WASM) |
| real-time | **unfinalized block 지원** | finalized only |
| 데이터 타깃 | custom (BigQuery/Parquet/CSV) | Postgres-only |
| 셋업 | 쉬운 local | archival node 필요 |
| 커스터마이즈 | custom resolver/mutation/migration | 제한적 |
| 가격 | fiat subscription | GRT token, pay-per-query |
| 탈중앙화 | opt-in | protocol-native |

★ 위 수치·우열은 SQD 자체 마케팅 자료 — 중립 출처 cross-verify 필요(open-Q).

## [C] BAYC 튜토리얼 (tutorials/bayc/step-one-indexing-transfers)

ERC-721(BAYC) Transfer 이벤트를 Postgres 적재 + GraphQL 노출하는 인덱서 패턴:
1. **Contract interface**: `squid-evm-typegen` 으로 ABI→TS 바인딩(type-safe event decode).
2. **Processor config**: `EvmBatchProcessor` 에 data source(SQD Network gateway), RPC, block range, log filter(address + topic) 설정.
3. **Batch handler**: `processor.run()` 에서 block/log 순회 → contract address·event topic 검증 → 생성된 ABI 메서드로 decode.
4. **Persistence**: `schema.graphql` entity 정의 → TypeORM 모델 생성 → in-memory 누적 후 `ctx.store.insert()` 배치 삽입.
5. **API**: TypeORM 모델 → GraphQL 스키마 자동 생성, `squid-graphql-server` 가 서빙.

재사용 패턴: **filter-before-decode**(address+topic0 매칭 후 decode → 무관 log 처리 방지), **batch insert**(누적 후 단일 삽입 → sync 성능), **schema-driven codegen**(schema.graphql 단일 진실원천 → TypeORM+GraphQL), block 메타(timestamp/번호) enrich.
