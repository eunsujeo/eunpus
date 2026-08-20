> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Contract Objects

## ContractAsset

| Parameter      | Type                      | Description                                                                                                                  |
| -------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| id             | string                    | The ID of the contract wallet.                                                                                               |
| balance        | string                    | The balance of the contract wallet.                                                                                          |
| lockedAmount   | string                    | Locked amount in the contract wallet.                                                                                        |
| status         | ConfigChangeRequestStatus | Status of the contract wallet.                                                                                               |
| activationTime | string                    | The time the contract wallet will be activated in case wallet activation is postponed according to the workspace definition. |
| address        | string                    | The address of the contract wallet.                                                                                          |
| tag            | string                    | Used as destination tag for XRP; `memo` for ATOM, EOS, HBAR, LUNA, LUNC, XDB, XEM; `memo_text` for XLM; `notes` for ALGO.    |

***

## UnmanagedContract

| Parameter | Type                                             | Description                                                    |
| --------- | ------------------------------------------------ | -------------------------------------------------------------- |
| id        | string                                           | The ID of the unmanaged contract wallet.                       |
| name      | string                                           | Name of the contract wallet container.                         |
| assets    | Array of [ContractAsset](#contractasset) objects | An array of assets available in the unmanaged contract wallet. |
