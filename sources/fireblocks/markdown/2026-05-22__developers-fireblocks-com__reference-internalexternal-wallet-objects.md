> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Internal/External Wallet Objects

## WalletAsset

| Parameter      | Type                                                                              | Description                                                                                                               |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| id             | string                                                                            | The ID of the asset                                                                                                       |
| balance        | string                                                                            | The balance of the wallet                                                                                                 |
| lockedAmount   | string                                                                            | Locked amount in the wallet                                                                                               |
| status         | [ConfigChangeRequestStatus](/reference/general-objects#configchangerequeststatus) | Status of the Internal Wallet                                                                                             |
| activationTime | string                                                                            | The time the wallet will be activated if wallet activation is postponed according to the workspace definition             |
| address        | string                                                                            | The address of the wallet                                                                                                 |
| tag            | string                                                                            | Used as destination tag for XRP; `memo` for ATOM, EOS, HBAR, LUNA, LUNC, XDB, XEM; `memo_text` for XLM; `notes` for ALGO. |

***

## ExternalWalletAsset

| Parameter      | Type                                                                              | Description                                                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | string                                                                            | The ID of the asset                                                                                                                                                    |
| status         | [ConfigChangeRequestStatus](/reference/general-objects#configchangerequeststatus) | Status of the External Wallet                                                                                                                                          |
| activationTime | string                                                                            | The time the wallet will be activated if wallet activation is postponed according to the workspace definition                                                          |
| address        | string                                                                            | The address of the wallet                                                                                                                                              |
| tag            | string                                                                            | Used as destination tag for XRP; `memo` for ATOM, EOS, HBAR, LUNA, LUNC, XDB, XEM; `memo_text` for XLM; `notes` for ALGO; bank transfer description for fiat providers |

***

## UnmanagedWallet

| Parameter     | Type                                 | Description                                                                            |
| ------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| id            | string                               | The ID of the Unmanaged Wallet                                                         |
| name          | string                               | Name of the Wallet Container                                                           |
| customerRefId | string                               | \[optional] The ID for AML providers to associate the owner of funds with transactions |
| assets        | Array of [WalletAsset](#walletasset) | An array of the assets available in the unmanaged wallet                               |

***

## ExternalWallet

| Parameter     | Type                                                 | Description                                                                            |
| ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| id            | string                                               | The ID of the Unmanaged Wallet                                                         |
| name          | string                                               | Name of the Wallet Container                                                           |
| customerRefId | string                                               | \[optional] The ID for AML providers to associate the owner of funds with transactions |
| assets        | Array of [ExternalWalletAsset](#externalwalletasset) | An array of the assets available in the external wallet                                |
