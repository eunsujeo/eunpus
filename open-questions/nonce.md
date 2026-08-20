# Open Questions — Nonce (EVM 트랜잭션 nonce)

> Stage 46 (2026-06-04) 도입. `sources/nonce/webpages/chainstack.com/ethereum-nonce-management` (Chainstack 기술 블로그) Mode C ingest 의 부산물.
> ★ 본 도메인의 "nonce" = EVM **트랜잭션 nonce** (계정 카운터). MPC **서명 nonce** (키 유출 위험) 와 구분 — [[docs/architecture/nonce-management-reference]] §0.1.
> 1차 자료가 WebFetch 추출본이므로 fact tier "tool-extracted" — 원문/공식 문서 재확인 시 ANSWERED.
> Canonical reference: [[docs/architecture/nonce-management-reference]]

## Q-2026-06-04-NONCE01 — Chainstack 추출본 수치의 1차 원문 재확인

**Status**: open
**Stage**: 46
**Question**: 본 reference 의 정량값 — mempool per-account 캡(pending ~16 / queued ~64, Geth/Reth), replacement fee bump 임계(양 필드 ≥10%), stuck 임계(L1 30–60초), Arbitrum force-inclusion window(~24h) — 이 WebFetch 소형 모델 추출본 기반. chainstack.com 원문 + Geth/Reth txpool 설정 문서 + Arbitrum 공식 docs 로 paragraph-level 재확인 필요.
**Source**: chainstack ethereum-nonce-management (tool-extracted) → 1차: chainstack.com 원문, geth/reth txpool config, arbitrum docs

## Q-2026-06-04-NONCE02 — Fireblocks 의 EVM nonce tracker 내부 구현

**Status**: open
**Stage**: 46
**Question**: Fireblocks 가 EVM 트랜잭션 nonce 를 local counter 로 관리하는지 RPC pending 조회 기반인지, STUCK→REPLACED 시 같은 nonce 를 유지하는지(본 reference §3 의 "같은 nonce + fee bump" 원칙과 일치 여부). `failOnLowFee` 와 multiple withdrawal vault round-robin 외의 nonce 내부 메커니즘은 비공개 추정.
**Source**: [[entities/fireblocks/transaction]] §"failOnLowFee" / Stage 9 ↔ chainstack ethereum-nonce-management §2-3

## Q-2026-06-04-NONCE03 — 미처리 nonce PDF 와 cross-confirm

**Status**: open
**Stage**: 46
**Question**: `sources/nonce/블록체인 nonce 관리 사례와 권장 아키텍처.pdf` (480KB, 미처리) 의 권장 아키텍처가 본 chainstack 기반 reference 와 일치/보완/상충하는지. promote 시 nonce-management-reference 에 통합하고 fact tier 승격 검토.
**Source**: sources/nonce/블록체인 nonce 관리 사례와 권장 아키텍처.pdf (pending)
