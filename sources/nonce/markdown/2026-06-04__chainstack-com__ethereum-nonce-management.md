# Ethereum Nonce Management — Chainstack (tool-extracted)

> **출처**: <https://chainstack.com/ethereum-nonce-management/> (Chainstack 기술 블로그)
> **추출**: 2026-06-04, WebFetch 구조화 추출. ★ 소형 모델 요약본 — fact tier "tool-extracted". 1차 원문 재확인 시 fact 승격.
> meta: `../webpages/chainstack.com/ethereum-nonce-management.meta.yml`

## Nonce 정의 & 핵심 규칙

- 계정별 카운터, 0부터 시작, 트랜잭션당 1씩 증가.
- Sequential: nonce N 은 N-1 이 포함되기 전에 포함 불가. "No gaps, no reordering" (네트워크 전역 강제).
- per-account scope — 계정마다 독립적 nonce 시퀀스.

## Nonce 관련 문제

### Stuck transaction cascade
- 단일 underpriced/dropped tx 가 "nonce hole" 생성 → 이후 모든 tx 차단.
- production 에서 stuck tx 가 해당 계정의 전체 파이프라인 동결.
- 증상: receipt 누락, blocked tx 위에 재서명하는 retry 루프, 큐 무한 증가, state drift.

### Concurrency & race condition
- 여러 worker 가 동시에 `eth_getTransactionCount(address, "pending")` 호출 → 동일 nonce 수신.
- 같은 nonce slot 으로 서명 → 하나는 수락, 다른 하나는 "replacement transaction underpriced" 실패 또는 조용히 덮어씀.
- cross-node inconsistency: 노드마다 pending mempool 상태 불일치.

### Mempool visibility
- "pending" nonce 는 노드별(per-node) — RPC 노드마다 mempool 내용 다름.
- private tx 는 public mempool 에 전파 안 됨 → pending view 에 gap.
- Flashbots Protect 는 private nonce 를 pending count 에 포함시키려면 EIP-191 서명된 JSON-RPC 요청 필요.

## 해결 전략

### Local nonce tracking (기반 패턴)
- 서명 계정당 in-process 카운터 1개 유지, locking(chained promises 권장)으로 직렬화.
- 체인에서 1회만 bootstrap, 이후 local 증가. 실패 tx 는 reset 으로 nonce slot 재사용.
- production 안전 규칙: 카운터 durable 영속화(crash 생존), 부팅 시 max(영속값, 현재 체인 상태), 외부 lock 없이 서명키 프로세스 간 공유 금지, **분산 Redis lock 보다 전용 단일 signer 서비스가 안전**.
- ethers v6 `NonceTracker` 클래스 패턴 (reserve()/reset(), Promise lock).

### RPC 메서드
- `eth_getTransactionCount(address, "pending")`: mempool 포함 nonce.
- `eth_getTransactionCount(address, "latest")`: 확정(confirmed) nonce 만.
- bootstrap 시 "pending" 사용, hot path 에서는 호출 회피 — local tracker 사용.

### 탐지 & replacement
- stuck 탐지: `tx.wait(1, timeoutMs)` 폴링, 임계 L1 30–60초(L2 는 초 단위), window 내 미채굴 시 stuck 처리.
- replacement 요건: **같은 nonce**(skip/increment 불가), `maxFeePerGas` **와** `maxPriorityFeePerGas` **둘 다** ≥10% 인상. 한쪽만 올리면 "replacement transaction underpriced" 거부.
- 에스컬레이션: 1.2× → 1.5× → 2× 단계, hard ceiling. ceiling 초과 시 무한 bump 말고 alert.
- cancellation: 같은 nonce 로 zero-value self-send + fee bump.
- ★ **가장 오래된 stuck tx 를 먼저 고친다** — 뒤 nonce 를 먼저 bump 금지.

### Mempool 용량 관리
- per-account 한도: pending sub-pool ~16, queued sub-pool ~64 (Geth/Reth 기본값).
- 초과분은 queued 영역 보관 또는 global 압력 시 evict.
- 가이드: 큰 per-account backlog 회피, 다음 전송 전 confirm. saturation 모니터링, 한도 전 throttle 또는 서명키 sharding.

## Private route (Flashbots, MEV-Boost)
- flow: private relay → MEV-Boost sidecar → Builder → Validator. public mempool 미진입(front-run 불가시).
- nonce 는 동일 slot 점유, builder 미선택 시 stuck 가능.
- Flashbots RPC 는 X-Flashbots-Signature(EIP-191) 없으면 private tx 제외한 pending nonce 반환.
- 권장: local tracker 를 source of truth 로, critical path 에서 RPC pending nonce 조회 금지.

## L2 sequencer (Arbitrum, Base, Optimism)
- per-account nonce 와 cascade 규칙은 L1 과 동일.
- 차이: healthy sequencer 에서 sub-second inclusion(stuck 은 초 단위). sequencer 가 SPOF(uptime/검열). Chainlink L2 sequencer uptime feed 를 health 신호로.
- force inclusion escape hatch: L1 inbox 직접 제출. Optimism/Base 거의 즉시, Arbitrum 은 ~24시간 sequencer-delay window 후. 검열 저항이나 느린 fallback.
- nonce 로직 동일, timeout 만 초 단위로 tighten.

## 아키텍처 권장
- 단일 계정: 계정당 in-process lock + 카운터 1개, 전송 직렬화.
- 멀티 프로세스: 전용 signer 서비스(프로세스 간 공유) 권장, 외부 lock 은 차선.
- 고처리량: per-account mempool 캡(~16 pending) 존중 후 서명키 sharding, local tracker + private route(MEV 노출 전송), L2 sequencer health 모니터링.

## Build vs Buy
- **ethers NonceManager**: local sequencing 만 — 탐지/replacement/re-broadcast 는 직접 구현.
- **OpenZeppelin Defender**: atomic nonce 할당, gas 재추정, 자동 재제출 (자체 구축보다 저렴한 경우 많음).
- 공통 요건: 일관된 pending read, 안정적 WebSocket 스트림, 신뢰할 수 있는 RPC provider.
