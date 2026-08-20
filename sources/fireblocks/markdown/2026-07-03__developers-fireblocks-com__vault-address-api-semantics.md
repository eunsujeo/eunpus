# Vault·Address 생성 API semantics — 1차 자료 추출 (2026-07-03)

> 출처: developers.fireblocks.com llms.txt 인덱스 → 개별 API reference (.md) + `fireblocks/fireblocks-openapi-spec` `open_api_spec.yml` (master, 14688행). Q-2026-07-03-V01 근거.

## createVaultAccount — `POST /v1/vault/accounts` (openapi L72-114)

- description: "Creates a new vault account with the requested name." (vault name = ASCII only)
- requestBody `required: true` (바디 자체는 필수), schema properties:
  - `name` (Account Name, string) — **개별 required 목록 없음 → optional**
  - `hiddenOnUI` (bool, "Optional")
  - `customerRefId` (string, "Optional - Sets a customer reference ID")
  - `autoFuel` (bool, "Optional")
- **유니크 제약·중복 거부 표현 전무.** → 같은 name(또는 무명)으로 **중복 vault 생성 가능**. name 은 dedup 키가 아니라 라벨.
- 별도 엔드포인트 "Assign AML customer reference ID" 존재 → `customerRefId` = AML/KYT 귀속 전용 재확인.

## accounts_paged — `GET /v1/vault/accounts_paged` (openapi L115~)

- query params: **`namePrefix`** (string, required:false), `nameSuffix`, ... → **서버측 name prefix 필터 지원 확정.**
- (참고: deprecated `GET /vault/accounts` L20-37 에도 namePrefix/nameSuffix 존재. 신규는 accounts_paged 사용.)
- 함의: name=ref 복구 검색이 전 계정 페이지네이션이 아니라 **prefix 필터**로 가능. 단 name 이 유니크가 아니므로 결과가 복수일 수 있어 정확 일치는 클라이언트에서 재확인 필요.

## API Idempotency (developers.fireblocks.com/reference/api-idempotency)

- **POST·PUT** 요청에 `Idempotency-Key: <key>` 헤더 지원 (GET·DELETE 는 본래 멱등이라 무시).
- 키 **최대 40자**.
- 같은 키 재요청 시 **첫 요청의 저장된 응답을 그대로 반환(에러였어도)**, 연산 재실행 안 함. **24시간 보관**, 이후 새 키 필요.
- → createVaultAccount·주소 생성 모두 POST → Idempotency-Key 적용 가능. 크래시-재시도 중복 vault 방지의 벤더 네이티브 수단.
- Transaction 은 `externalTxId` 권장(중복 시 HTTP 400).

## create-new-asset-deposit-address — `POST /v1/vault/accounts/{vaultAccountId}/{assetId}/addresses`

- description: "Should be used for **UTXO or Tag/Memo based assets ONLY. Requests with account based assets will fail.**"
- → **EVM(account-based)은 이 호출이 실패**. EVM 은 vault·자산당 **단일 주소**이고, 그 주소는 **asset wallet 활성화**(Create/Activate vault wallet)에서 나온다. 추가 주소 생성 불가.
- "Bulk creation of new deposit addresses" 도 UTXO 전용.
- **확인(spec L504·8756)**: `POST /vault/accounts/{vaultAccountId}/{assetId}`(create vault wallet) 응답 `CreateVaultAssetResponse` 에 `address`·`legacyAddress`·`tag`·`status`·`activationTxId` 포함 → **자산 지갑 활성화가 곧 EVM 단일 주소 발급**(address 필드).
- **1차 페이지 확정(2026-07-03, `create-vault-wallets.md`)**: 두 작업이 SDK 레벨에서 갈림 — **`createVaultAccountAsset`(Create Vault Wallet)** = 자산 지갑 생성·응답에 address(EVM 단일 주소 출처) / **`createVaultAccountAssetAddress`=`generate_new_address`(Create Deposit Address)** = UTXO·Tag/Memo 추가 주소 전용. ETH(no tag)는 *"can only generate one deposit address per asset, per vault account"*, 추가 주소는 vault account 추가로만.

## 설계 함의 (docs-site wallet-design-walkthrough)

- **createAccount**: 1차 = `Idempotency-Key=f(ref)`(24h 재시도 멱등) + DB `ref` UNIQUE(영구 유일성). name 은 라벨이라 벤더가 유일성 미보장 → `namePrefix` 검색은 24h 밖 갭의 fallback 복구.
- **createDepositAddress(EVM)**: create-address 를 부르지 말 것(account-based 실패). asset wallet 활성화의 단일 주소를 읽어 재사용 → get-or-create 가 벤더 차원에서 "한 번 활성화 → 주소 하나 영구" 로 못박힘.
