<!--
source_url: https://github.com/canton-network/wallet (+ /tree/main/core/signing-fireblocks)
fetched_at: 2026-06-10
status: full (WebFetch — 공식 Canton wallet SDK 레포)
priority: TIER1 (1차 — canton-network org 공식 코드)
domain: canton-network / custody / signing / fireblocks
-->

# canton-network/wallet — 공식 Canton Wallet SDK (Fireblocks 서명 드라이버)

> Fireblocks 가 Canton 에서 1급 서명 프로바이더임을 **공식 SDK 코드**로 확정. 기존 근거(wallet-gateway
> docs · CC 복구 문서)보다 강함.

## (1) 레포 정체

source: https://github.com/canton-network/wallet README

- "A **TypeScript framework** for building wallet integrations on the Canton Network." 구성:
  **Wallet Gateway**(server[Express] + browser extension) · **dApp SDK** · **Wallet SDK** · core 모듈.
- (README 명시: "wallet 자체가 아니라 wallet 통합을 만드는 프레임워크".) canton-network org 공식.
- 언어 **TypeScript ~90%**.

## (2) 서명 드라이버 (core-signing-*)

source: README + /tree/main/core/signing-fireblocks

- 제공 드라이버: **`core-signing-internal`**(내부 Ed25519) · **`core-signing-participant`**(participant
  노드 관리 서명) · **`core-signing-fireblocks`**(Fireblocks) · **`core-signing-blockdaemon`**(Blockdaemon).
  (docs 의 wallet-gateway signing-providers 는 Dfns 도 언급 — Stage 57.)
- **`core-signing-fireblocks`** = "A driver for signing and retrieving transactions using the
  **Fireblocks API** implementing the **`SigningDriverInterface`** from `@canton-network/core-signing-lib`."
- **셋업**: RSA **4096-bit** signing key(OpenSSL) → env `FIREBLOCKS_SECRET`, Fireblocks **API User**(CSR
  업로드) 생성 → **API Key(UUIDv4)**, 계정/키 승인. (이 RSA 키는 Fireblocks **API 인증용** — 온원장
  party 서명 알고리즘(EdDSA/ECDSA Raw Signing, fireblocks-recover-canton-coin)과는 별개 층.)
- src 파일 상세는 페이지에서 미노출(README·package.json·tsconfig·tsup·vitest 존재).

## (3) Wallet SDK 능력

source: README

- synchronizer 인증, **external keypair 로 party allocate**, active contract(ACS) 읽기, prepared
  transaction decode/validate, **Ledger API 로 서명·제출**. → 본 위키 external party·prepare/sign/execute
  (entities/canton/canton-network) 와 정확히 일치.

## 시사점 (수탁)

- Fireblocks 는 docs 의 추상 "지원" 이 아니라 **공식 SDK 에 드라이버로 구현**된 1급 옵션. 우리 Fireblocks
  수탁 스택을 Canton 서명에 붙이는 표준 경로 = `core-signing-fireblocks`.
- 다만 SDK 는 **TypeScript** — 기존 위키의 "Fireblocks Java SDK" 표기는 Fireblocks 일반 SDK 얘기였고,
  Canton wallet SDK 의 fireblocks 드라이버는 TS. (정정)

## Source

GitHub canton-network/wallet — <https://github.com/canton-network/wallet> · core/signing-fireblocks
