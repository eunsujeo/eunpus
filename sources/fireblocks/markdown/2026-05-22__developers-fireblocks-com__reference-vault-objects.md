> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Vault Objects

## VaultAccountsPagedResponse

| Parameter   | Type                                   | Description                                                     |
| ----------- | -------------------------------------- | --------------------------------------------------------------- |
| accounts    | Array of [VaultAccount](#vaultaccount) | List of vault account objects                                   |
| paging      | object                                 | Contains two fields: **before** (string) and **after** (string) |
| previousUrl | string                                 | URL string of the request for the previous page                 |
| nextUrl     | string                                 | URL string of the request for the next page                     |

***

## CreateVaultAssetResponse

| Parameter      | Type   | Description                                                                                                                             |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| id             | string | The ID of the vault account                                                                                                             |
| address        | string | Address of the asset in a vault account; for BTC and LTC, the address is in Segwit (Bech32) format, and the cash address format for BCH |
| legacyAddress  | string | Legacy address format for BTC, LTC, and BCH                                                                                             |
| tag            | string | Used as destination tag for XRP; `memo` for ATOM, EOS, HBAR, LUNA, LUNC, XDB, XEM; `memo_text` for XLM; `notes` for ALGO.               |
| eosAccountName | string | Returned for EOS; the account name                                                                                                      |

***

## VaultAsset

| Parameter            | Type   | Description                                                                                    |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| id                   | string | The ID of the asset                                                                            |
| total                | string | Total wallet balance                                                                           |
| balance              | string | Deprecated - replaced by "total"                                                               |
| available            | string | Funds that are available for transfer, equal to the blockchain balance minus any locked amount |
| pending              | string | The cumulative balance of all pending transactions to be cleared                               |
| staked               | string | Staked funds; returned only for DOT                                                            |
| frozen               | string | Frozen by your workspace's AML policies                                                        |
| lockedAmount         | string | Funds in outgoing transactions not yet published to the network                                |
| totalStakedCPU       | string | \[optional] Deprecated                                                                         |
| totalStakedNetwork   | string | \[optional] Deprecated                                                                         |
| selfStakedCPU        | string | \[optional] Deprecated                                                                         |
| selfStakedNetwork    | string | \[optional] Deprecated                                                                         |
| pendingRefundCPU     | string | \[optional] Deprecated                                                                         |
| pendingRefundNetwork | string | \[optional] Deprecated                                                                         |
| blockHeight          | string | The height (number) of the block of the balance                                                |
| blockHash            | string | The hash of the block of the balance                                                           |

***

## VaultAccountAssetAddress

| Parameter         | Type   | Description                                                                                                                                                                                       |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assetId           | string | The ID of the asset                                                                                                                                                                               |
| address           | string | Address of the asset in a vault account; for BTC and LTC, the address is in Segwit (Bech32) format, and the cash address format for BCH                                                           |
| legacyAddress     | string | Legacy address format for BTC, LTC, and BCH                                                                                                                                                       |
| description       | string | Description of the address                                                                                                                                                                        |
| tag               | string | Used as destination tag for XRP; `memo` for EOS, HBAR, XDB `memo_text` for XLM; `notes` for ALGO; Bank Transfer Description for fiat providers                                                    |
| type              | string | Address type                                                                                                                                                                                      |
| customerRefId     | string | \[optional] The ID for AML providers to associate the owner of funds with transactions                                                                                                            |
| bip44AddressIndex | number | \[optional] The `address_index`, `addressFormat`, and `enterpriseAddress` in the derivation path of this address based on [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) |

***

## VaultAccountBalanceUpdate

| Parameter      | Type   | Description                                                      |
| -------------- | ------ | ---------------------------------------------------------------- |
| vaultAccountId | number | The ID of the vault account                                      |
| assetId        | string | The ID of the asset                                              |
| total          | string | Total wallet balance                                             |
| pending        | string | The cumulative balance of all pending transactions to be cleared |
| frozen         | string | Frozen by your workspace's AML policies                          |
| staked         | string | The amount of funds that have been staked                        |
| lockedAmount   | string | Funds in outgoing transactions not yet published to the network  |
| blockHeight    | string | The height (number) of the block of the balance                  |
| blockHash      | string | The hash of the block of the balance                             |

***

## CreateAddressResponse

| Parameter         | Type   | Description                                                                                                                                 |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| address           | string | Address of the asset in a vault account; for BTC and LTC, the address is in Segwit (Bech32) format, and the cash address format for BCH     |
| legacyAddress     | string | Legacy address format for BTC, LTC, and BCH                                                                                                 |
| tag               | string | Used as destination tag for XRP; `memo` for EOS, HBAR, XDB `memo_text` for XLM; `notes` for ALGO.                                           |
| bip44AddressIndex | number | The `address_index` in the derivation path of this address based on [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) |

***

## VaultAccount

| Parameter     | Type                               | Description                                                                               |
| ------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| id            | string                             | The ID of the vault account                                                               |
| name          | string                             | Name of the vault account                                                                 |
| hiddenOnUI    | boolean                            | Specifies whether this vault account is visible in the Console UI                         |
| customerRefId | string                             | \[optional] The ID for AML providers to associate the owner of funds with transactions    |
| autoFuel      | boolean                            | Specifies whether this vault account's Ethereum address is auto-fueled by the Gas Station |
| assets        | Array of [VaultAsset](#vaultasset) | List of assets under this vault account                                                   |

> **Note**
>
> When the [VAULT\_ACCOUNT\_ADDED webhook](/reference/event-types#vault_account_added) is used, the VaultAccount object does not contain the `customerRefId` and `autoFuel` parameters.

***

## UnspentInputsData

| Parameter     | Type            | Description                                                 |
| ------------- | --------------- | ----------------------------------------------------------- |
| input         | [Input](#input) | An object containing the `txHash` and `index` of this input |
| address       | string          | The destination address of this input                       |
| amount        | string          | The amount of this input                                    |
| confirmations | number          | Number of confirmations for the transaction of this input   |
| status        | string          | The status is based on the status of the transaction        |

***

## PublicKey

| Parameter      | Type             | Description                                                                                                            |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| publicKey      | string           | The requested public key                                                                                               |
| algorithm      | string           | One of the [SigningAlgorithms](/reference/vault-objects#signingalgorithm)                                              |
| derivationPath | Array of numbers | Used for [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) derivation to retrieve the public key |

***

## SigningAlgorithm

| Parameter | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| algorithm | string | \[ MPC\_ECDSA\_SECP256K1, MPC\_EDDSA\_ED25519, MPC\_ECDSA\_SECP256R1 ] |
