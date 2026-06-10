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

## (4) core 모듈 맵 + Gateway + SigningDriverInterface (이어서 확인, Stage 74)

source: /tree/main/core · sdk/wallet-sdk · core/signing-lib · wallet-gateway/remote

- **core 모듈(36개) 중 수탁 관련**: `acs-reader`(ACS 읽기) · `ledger-client`(+`ledger-client-types`/`ledger-proto`, Ledger API 클라이언트) · `token-standard`(+`token-standard-service`) · `tx-parser`·`tx-visualizer` · `wallet-auth` · `wallet-store`(+`inmemory`/`sql`) · `splice-client`/`splice-provider` · `amulet-service` · **서명 드라이버 5종** `signing-{internal,participant,fireblocks,blockdaemon,dfns}` + `signing-lib` + `signing-store-sql`.
  - ★ **Dfns 도 레포 드라이버**(`signing-dfns`) — Stage 73 에서 "internal/participant/fireblocks/blockdaemon" 만 적은 것 보강(5종).
  - 즉 수탁사가 ACS 읽기·Ledger 클라이언트·token-standard·tx 파싱·store 를 **직접 안 만들고 SDK 모듈로** 쓸 수 있다.
- **Wallet SDK**(`sdk/wallet-sdk`): "TypeScript SDK … making wallet integrations easy." `npm i @canton-network/wallet-sdk`, **NodeJS 전용**. 능력 = synchronizer 인증·external keypair party allocate·ACS 읽기·prepared tx decode/validate·서명/제출.
- **SigningDriverInterface**(`core/signing-lib`):
  ```ts
  export interface SigningDriverInterface {
    partyMode: PartyMode
    signingProvider: SigningProvider
    controller: (authContext?: AuthContext) => Methods   // buildController, Methods 는 OpenRPC 생성
  }
  ```
  Fireblocks/Dfns/HSM 가 이 인터페이스를 구현해 끼워진다. 실제 sign 메서드는 OpenRPC 로 생성된 `Methods` 에.
- **Wallet Gateway(remote)**: RPC 서버, **기본 port 3030**. 엔드포인트 `/`(user web UI) · **`/api/v0/dapp`**(dApp JSON-RPC) · **`/api/v0/user`**(user JSON-RPC). 서명 요청을 **드라이버 백엔드(Fireblocks·Dfns)로 라우팅**, wallet provisioning/activation/signing 관리(Canton + CantonTestnet). **Postgres** 로 wallet store·signing credential store 분리 보관. JSON config. JSON-RPC 메서드는 API spec 에서 strongly-typed 생성.

## (5) signing-fireblocks 구현 + acs-reader (raw 파일, Stage 75)

source: raw core/signing-fireblocks/src/fireblocks.ts · core/acs-reader README

- **Fireblocks 서명 알고리즘 = EdDSA Ed25519** (코드 상수 `PublicKeyInformationAlgorithmEnum.EddsaEd25519`). → 기존 "EdDSA Raw Signing"(CC 복구 문서)을 **공식 드라이버 코드로 확정**, PartyId fingerprint(Ed25519 pubkey)와 정합.
- **Fireblocks Raw Signing 사용**: `client.transactions.createTransaction({ transactionRequest:{ operation:'RAW', ... rawMessageData.messages:[{ content: txHash, derivationPath }] }})` — prepared transaction **hash(`txHash`)를 RAW 로 직접 서명**.
- **공개키**: `client.vaults.getPublicKeyInfo({ algorithm: EddsaEd25519, derivationPath })` → `keyInfoByPublicKey` 캐시.
- 파일: `fireblocks.ts`·`index.ts`(+ `.test.ts`).
- **acs-reader**(`@canton-network/core-acs-reader`): `ACSReader` 클래스 — `read()`(필터 옵션)·`readJsContracts()`(JS 형태)·`paginated.read()`(대량). 필터 = `templateIds`·`parties`(+`filterByParty:true`)·`interfaceIds`. caching 내장. 반환 = createdEvent 전 필드 + `synchronizerId` → holdings/잔액 판단. (문서 API 엔 `includeLocked` 미언급 — locked 구분은 holding 필드/template 로.)
- token-standard README = "TBD"(미문서화), ledger-client README 미노출 — src 직접 확인 필요(보류).
