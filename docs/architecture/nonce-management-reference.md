---
title: EVM 트랜잭션 Nonce 관리 — Reference
layer: architecture
stage: 46
date: 2026-06-04
status: draft
reasoning_mode: generalized-reference (single vendor-blog 1차 자료 + Fireblocks broadcast/withdrawal 와의 대비)
source_primary: sources/nonce/markdown/2026-06-04__chainstack-com__ethereum-nonce-management.md
source_meta: sources/nonce/webpages/chainstack.com/ethereum-nonce-management.meta.yml
fact_tier: tool-extracted (WebFetch 구조화 추출 — 1차 원문 재확인 시 fact 승격)
depends_on:
  - multi-chain-adapter-pattern.md — EVM per-account nonce ordering / replacement 분류
  - withdrawal-lifecycle.md — account nonce idempotency / W6 broadcast
  - signing-workflow-orchestration.md — broadcast / STUCK→REPLACED
scope_disambiguation: |
  본 문서의 "nonce" = EVM **트랜잭션 nonce** (계정 시퀀스 카운터).
  MPC **서명 nonce** (재사용=키 유출) 와는 완전히 다른 개념 — §0.1 참조.
core_thesis: |
  EVM 트랜잭션 nonce 는 계정별 strict-sequential 카운터다. 하나가 막히면(stuck)
  이후 전부 막힌다(cascade). 따라서 운영 핵심은 (1) local nonce tracker 를 진실원천으로,
  (2) RPC pending 조회를 hot path 에서 배제, (3) stuck 탐지 → 같은 nonce 로 fee≥10% bump
  replacement, (4) per-account mempool 캡 존중 + 서명키 sharding.
---

# EVM 트랜잭션 Nonce 관리 — Reference

> **본 문서의 위치**: 직접구축 / 설치형 WaaS 가 EVM 계열 체인에 트랜잭션을 broadcast 할 때 마주치는 **트랜잭션 nonce 운영** reference. 단일 1차 자료(Chainstack 기술 블로그 "Ethereum nonce management")를 합성하되, Fireblocks 가 이 문제를 어떻게 흡수/노출하는지(`failOnLowFee`, multiple withdrawal vault round-robin, STUCK→REPLACED)와 대비한다.
>
> **★ fact tier**: 1차 자료가 WebFetch 소형 모델 **구조화 추출본** 이므로 본 문서 fact 는 `tool-extracted` tier. 원문(chainstack.com) 직접 재확인 시 fact 승격.
>
> **출처 표기**: 본 문서 fact 는 `(source: chainstack ethereum-nonce-management)` 로 1차 자료를, 위키 경로로 cross-ref 를 인용한다.

## 0. 핵심 명제 + 용어 구분 (10초 이해)

### 0.1 ★ "nonce" 두 의미 — 혼동 금지 (evidence isolation)

| 구분 | 본 문서 (B) EVM **트랜잭션 nonce** | (A) MPC **서명 nonce** |
|---|---|---|
| 정의 | 계정별 트랜잭션 시퀀스 카운터 (0부터 +1) | 서명 round 의 ephemeral 난수 |
| 재사용 시 | 같은 nonce → replacement(같은 tx) 또는 충돌 | **키 유출(key leak)** |
| 위키 canonical | **본 문서** | [[docs/architecture/signing-workflow-orchestration]] §"MPC retry ≠ idempotent" |
| retry 의미 | account-model: same nonce = idempotent | non-idempotent — 매 retry 새 nonce 필수 |

> ★ [[docs/architecture/withdrawal-lifecycle]] §6.3 의 "nonce reuse = key leak" 은 (A) MPC 서명 nonce. 본 문서 (B) 트랜잭션 nonce 의 "same nonce → idempotent" 와 **정반대** 이므로 절대 혼합하지 말 것.

### 0.2 핵심 명제

1. **Strict-sequential, no-gap.** nonce N 은 N-1 포함 전 불가. 계정 단위, 네트워크 전역 강제 (source: chainstack ethereum-nonce-management).
2. **Stuck = cascade.** 단일 underpriced/dropped tx 가 nonce hole → 이후 전부 차단. production 파이프라인 동결.
3. **Local tracker 가 진실원천.** in-process 카운터 + lock, 체인 1회 bootstrap, hot path 에서 RPC pending 조회 금지.
4. **Replacement = 같은 nonce + 양 fee ≥10% bump.** 가장 오래된 stuck 부터 고친다.
5. **Mempool 캡 존중.** per-account ~16 pending / ~64 queued (Geth/Reth) → 초과 전 throttle 또는 서명키 sharding.

---

## 1. Nonce 규칙 & 실패 모드 (source: chainstack ethereum-nonce-management)

### 1.1 규칙
- 계정별 카운터, 0부터 트랜잭션당 +1. nonce N 은 N-1 포함 전 포함 불가. **"No gaps, no reordering"** 네트워크 전역.

### 1.2 실패 모드
- **Stuck cascade**: underpriced/dropped tx → nonce hole → 이후 전부 차단. 증상: receipt 누락, blocked tx 위 재서명 retry 루프, 큐 무한 증가, state drift.
- **Concurrency race**: 여러 worker 가 동시 `eth_getTransactionCount(addr,"pending")` → 동일 nonce → 한쪽 "replacement transaction underpriced" 실패 또는 조용히 덮어씀. 노드 간 pending 상태 불일치.
- **Mempool visibility**: pending nonce 는 per-node. private tx 는 public mempool 미전파 → pending view gap.

> **Fireblocks 대비**: [[entities/fireblocks/transaction]] 의 **`failOnLowFee`** = "Pre-emptive fail > stuck transaction" 패턴 — underpriced tx 가 nonce hole 만들기 전에 차단. 본 reference 의 stuck cascade 문제에 대한 Fireblocks 측 mitigation. EVM withdrawal nonce 충돌은 **multiple withdrawal vault round-robin** 으로 회피([[entities/fireblocks/transaction]] Stage 9).

---

## 2. Local nonce tracking (기반 패턴) (source: chainstack ethereum-nonce-management)

- 서명 계정당 in-process 카운터 1개 + locking(chained promises)으로 직렬화.
- 체인에서 1회만 bootstrap("pending"), 이후 local 증가. 실패 tx 는 `reset(n)` 으로 nonce slot 재사용.
- ethers v6 `NonceTracker` 클래스: `reserve()`(prev lock await → 필요 시 bootstrap → `next++` → release), `reset(n)`.

**Production 안전 규칙**:
- 카운터 durable 영속화(crash 생존), 부팅 시 `max(영속값, 현재 체인 상태)`.
- 외부 lock 없이 서명키 프로세스 간 공유 금지.
- ★ **분산 Redis lock 보다 전용 단일 signer 서비스가 안전**.

### RPC 메서드
| 메서드 | 의미 |
|---|---|
| `eth_getTransactionCount(addr, "pending")` | mempool 포함 nonce (bootstrap 용) |
| `eth_getTransactionCount(addr, "latest")` | 확정(confirmed) nonce 만 |

→ hot path 에서 호출 회피, local tracker 사용.

> **Fireblocks/WaaS 대비**: [[docs/architecture/signing-workflow-orchestration]] 의 BroadcastAttempt 가 본 tracker 의 "account nonce" 역할. SaaS 는 이 tracker 를 vendor 가 흡수해 customer 에게 추상화.

---

## 3. Stuck 탐지 & Replacement (source: chainstack ethereum-nonce-management)

- **탐지**: `tx.wait(1, timeoutMs)` 폴링. 임계 L1 30–60초(L2 초 단위), window 내 미채굴 → stuck.
- **Replacement 요건**:
  - **같은 nonce** (skip/increment 불가).
  - `maxFeePerGas` **와** `maxPriorityFeePerGas` **둘 다** ≥10% 인상. 한쪽만 올리면 "replacement transaction underpriced" 거부.
  - 에스컬레이션 1.2× → 1.5× → 2× 단계 + hard ceiling. ceiling 초과 시 무한 bump 금지, alert.
- **Cancellation**: 같은 nonce 로 zero-value self-send + fee bump.
- ★ **가장 오래된 stuck tx 를 먼저** — 뒤 nonce 부터 bump 금지.

> **WaaS 대비**: [[docs/architecture/signing-workflow-orchestration]] §"STUCK → REPLACED 는 새 SigningRequest 필요(다른 nonce/fee)" 와 정합하되, EVM 은 **같은 nonce** replacement 가 핵심 — chain semantic 차이. [[docs/architecture/multi-chain-adapter-pattern]] 의 replacement 분류표(Nonce-replace + EIP-1559 RBF)와 매핑.

---

## 4. Mempool 용량 (source: chainstack ethereum-nonce-management)

- per-account 한도: pending sub-pool **~16**, queued sub-pool **~64** (Geth/Reth 기본값). 초과분 queued 보관 또는 global 압력 시 evict.
- 가이드: 큰 per-account backlog 회피, 다음 전송 전 confirm. saturation 모니터링 → 한도 전 throttle 또는 **서명키 sharding**.

---

## 5. Private route — Flashbots / MEV-Boost (source: chainstack ethereum-nonce-management)

- flow: private relay → MEV-Boost sidecar → Builder → Validator. public mempool 미진입(front-run 차단).
- nonce 동일 slot 점유, builder 미선택 시 stuck 가능.
- Flashbots RPC 는 `X-Flashbots-Signature`(EIP-191) 없으면 private tx 제외한 pending nonce 반환.
- 권장: local tracker 를 source of truth, critical path 에서 RPC pending 조회 금지.

---

## 6. L2 sequencer — Arbitrum / Base / Optimism (source: chainstack ethereum-nonce-management)

- per-account nonce + cascade 규칙은 L1 동일.
- 차이: healthy sequencer sub-second inclusion(stuck 초 단위). sequencer = SPOF(uptime/검열). Chainlink L2 sequencer uptime feed 를 health 신호로.
- **Force inclusion escape hatch**: L1 inbox 직접 제출. Optimism/Base 거의 즉시, Arbitrum ~24시간 sequencer-delay window 후. 검열 저항이나 느린 fallback.
- nonce 로직 동일, timeout 만 초 단위로 tighten.

> **대비**: [[docs/architecture/multi-chain-adapter-pattern]] 의 "Sequencer-mediated ordering/replacement" 행과 정합.

---

## 7. 아키텍처 권장 & Build-vs-Buy (source: chainstack ethereum-nonce-management)

| 구성 | 권장 |
|---|---|
| 단일 계정 | 계정당 in-process lock + 카운터 1개, 전송 직렬화 |
| 멀티 프로세스 | 전용 signer 서비스(공유) 권장, 외부 lock 은 차선 |
| 고처리량 | per-account mempool 캡 존중 후 서명키 sharding, local tracker + private route, L2 sequencer health 모니터링 |

**Build vs Buy**:
- **ethers `NonceManager`**: local sequencing 만 — 탐지/replacement/re-broadcast 직접 구현.
- **OpenZeppelin Defender**: atomic nonce 할당 + gas 재추정 + 자동 재제출 (자체 구축보다 저렴한 경우 多).
- 공통 요건: 일관된 pending read, 안정적 WebSocket 스트림, 신뢰할 수 있는 RPC provider.

> **3-way 함의**: SaaS(Fireblocks) 는 nonce tracker·replacement·mempool 캡을 전부 흡수해 customer 에게 `failOnLowFee` 등 정책 노브만 노출. 직접구축은 본 문서 전 항목을 자체 운영. 설치형 WaaS 는 그 중간 — vendor 제품이 tracker/replacement 를 어디까지 제공하는지가 관건.

---

## 8. Open Questions

- **Q-2026-06-04-NONCE01** — Chainstack 추출본의 mempool 캡(~16/~64)·fee bump(≥10%)·L2 force-inclusion(Arbitrum ~24h) 수치를 1차 원문 + Geth/Reth/Arbitrum 공식 문서로 재확인 (현재 tool-extracted tier).
- **Q-2026-06-04-NONCE02** — Fireblocks 가 EVM 트랜잭션 nonce tracker 를 내부적으로 어떻게 구현하는지 (local counter vs RPC pending; STUCK→REPLACED 시 같은 nonce 유지 여부). 비공개 추정.
- **Q-2026-06-04-NONCE03** — `sources/nonce/블록체인 nonce 관리 사례와 권장 아키텍처.pdf` (미처리) 와 본 reference 의 권장사항 cross-confirm — promote 시 통합.
- 전체: [[open-questions/nonce]]

## Sources

### 본 reference 의 1차 자료
- [[sources/nonce/markdown/2026-06-04__chainstack-com__ethereum-nonce-management]] — Chainstack "Ethereum nonce management" (tool-extracted). 원문 <https://chainstack.com/ethereum-nonce-management/>. meta: `sources/nonce/webpages/chainstack.com/ethereum-nonce-management.meta.yml`
- (미처리, 동일 도메인) `sources/nonce/블록체인 nonce 관리 사례와 권장 아키텍처.pdf`

### Fireblocks / WaaS cross-ref
- [[entities/fireblocks/transaction]] §"EVM nonce 충돌 → multiple withdrawal vault round-robin", §"`failOnLowFee`"
- [[docs/architecture/multi-chain-adapter-pattern]] §"Per-account nonce strict ordering / Replacement 분류"
- [[docs/architecture/withdrawal-lifecycle]] §"account nonce idempotency / W6"
- [[docs/architecture/signing-workflow-orchestration]] §"Broadcast / STUCK→REPLACED" (★ 단 MPC 서명 nonce 와 구분 — §0.1)

## Related Pages

- [[docs/architecture/multi-chain-adapter-pattern]]
- [[docs/architecture/withdrawal-lifecycle]]
- [[docs/architecture/signing-workflow-orchestration]]
- [[entities/fireblocks/transaction]]
- [[open-questions/nonce]]
