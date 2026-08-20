# Create Vault Wallets — 1차 페이지 (2026-07-03 fetch)

> 출처: developers.fireblocks.com "Create Vault Wallets" (사용자 fetch, 2026-07-03). Q-2026-07-03-V01 근거 보강.

Fireblocks vault accounts contain **vault wallets**. For each vault wallet, there are **one or more deposit addresses**.

## Address generation

### Account-based wallets
1. **no tag/memo (예: ETH)**: **can only generate one deposit address** → one deposit address **per asset, per vault account**. 같은 자산의 주소가 둘 이상 필요하면 **추가 vault account 를 만들어야 함**.
2. **with tag/memo (예: XRP)**: one or more addresses — 같은 on-chain 주소, tag/memo 로 구분.

### UTXO wallets
- BTC 등: 한 vault account 에 **여러 주소** 가능.

### Hedera HTS
- 신규 HTS 토큰 활성화 시 `blockchainWalletType` = `Unassociated`(첫 입금 시 fee 차감) 또는 `Associated`(활성화 직후 HBAR 잔액에서 차감, 서명 필요).

## 두 작업의 구분 (★ 핵심)

| 작업 | SDK (JS / Python) | 대상 | 응답 예시 |
|---|---|---|---|
| **Create Vault Wallet** = 자산 지갑 활성화 | `vaults.createVaultAccountAsset` / `create_vault_asset` | 모든 자산. **EVM 주소가 여기서 나옴** | `{ address, id, legacyAddress, tag }` (BTC 예: `bc1q…`) |
| **Create Deposit Address** = 추가 주소 채번 | `vaults.createVaultAccountAssetAddress` / `generate_new_address` | **UTXO·Tag/Memo 전용** | `{ address, bip44AddressIndex, legacyAddress, tag }` |

- `createVaultAccountAsset(vaultAccountId, assetId)` → 자산 지갑 생성. 응답에 **`address`** 포함 → **account-based(EVM)의 단일 입금 주소는 이 호출의 부산물**.
- `createVaultAccountAssetAddress(vaultAccountId, assetId, description)` = `generate_new_address` → **UTXO·Tag 추가 주소** 발급(`bip44AddressIndex` 증가). EVM(account-based)에는 쓰지 않음(실패).

## 설계 함의 (docs-site)

- **createDepositAddress(EVM)** = `createVaultAccountAsset`(자산 지갑 활성화) **1회** → 단일 주소. createAccount 와 같은 **create-once**(반복 조회는 getDepositAddress). "get-or-create" 라벨 부적합.
- 같은 자산의 추가 주소가 필요하면 **vault account 를 더** 만든다(개별 vault 패턴) — `generate_new_address` 는 UTXO·Tag 전용이라 EVM 우회가 아님.
