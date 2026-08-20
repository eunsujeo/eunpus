> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Web3 Connection Objects

## SessionMetadata

| Parameter      | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| appUrl         | string | URL for Walletconnect Web3 dapp            |
| appName        | string | Display name for the Web3 dApp             |
| appDescription | string | Description of the Web3 dApp               |
| appIcon        | string | Given ticker symbol to represent the dApp. |

***

## SessionDTO

| Parameter        | Type                   | Description                                                                                              |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| id               | string                 | The ID of the connection.                                                                                |
| userId           | string                 | The ID of the user that created the connection.                                                          |
| sessionMetadata  | SessionMetadata object | Metadata of the connection (provided by the dApp).                                                       |
| vaultAccountId   | string                 | The vault to connect.                                                                                    |
| feeLevel         | string                 | The default fee level. Valid values are `MEDIUM` and `HIGH`.                                             |
| chainIds         | array                  | The chains approved for the connection.                                                                  |
| connectionType   | string                 | The connection's type - Valid value: "WalletConnect".                                                    |
| connectionMethod | string                 | The method through which the connection was established. Valid values are: "DESKTOP", "MOBILE" or "API". |
| creationDate     | string                 | Timestamp of the session's creation.                                                                     |

***

## GetConnectionResponse

| Parameter | Type              | Description                                      |
| --------- | ----------------- | ------------------------------------------------ |
| data      | SessionDTO object | Array with the requested Web3 connection's data. |
| paging    | Paging            | Paging cursor settings                           |

***

## CreateConnectionRequest

| Parameter      | Type   | Description                                                      |
| -------------- | ------ | ---------------------------------------------------------------- |
| vaultAccountId | string | The ID of the vault to connect to the Web3 connection.           |
| feeLevel       | string | The default fee level. Valid values are `MEDIUM` and `HIGH`.     |
| uri            | string | The WalletConnect URI provided by the dApp.                      |
| chainIds       | array  | The ID of the blockchain network(s) used in the Web3 connection. |

***

## CreateConnectionResponse

| Parameter       | Type   | Description                                             |
| --------------- | ------ | ------------------------------------------------------- |
| id              | string | The ID of the initiated Web3 connection.                |
| sessionMetadata | array  | Metadata of the Web3 connection (provided by the dApp). |

***

## RespondToConnectionRequest

| Parameter | Type    | Description                                                             |
| --------- | ------- | ----------------------------------------------------------------------- |
| approve   | boolean | Approval of the initiated Web3 connection. The default value is "true". |
