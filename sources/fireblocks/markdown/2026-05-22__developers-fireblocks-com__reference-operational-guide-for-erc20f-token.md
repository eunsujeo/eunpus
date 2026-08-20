> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Operational Guide for ERC20F Token

In this guide, we will walk you through how to operate an ERC20F token. There are five functions available:

1. Deploy
2. Mint
3. Burn
4. Grant Role
5. Revoke Role

This guide will show you how to interact with the token contract for three common operations: minting, burning, and granting roles. It will help you manage your token with Fireblocks tooling.

## Prerequisites

Before operating an ERC20F token using the Fireblocks SDK, ensure you know the following:

1. **ERC20F Contract Address**: The address of the ERC20F token contract you want to manage.

2. **Vault Account (for minting/burning):** The `vaultAccountId` will either mint or burn tokens. You only need the vault account to have the role required for the specific action—either the `MINTER_ROLE` for minting or the `BURNER_ROLE` for burning. Ensure the vault has sufficient native gas for transaction fees. You can retrieve the `vaultAccountId` from the Fireblocks console by checking the URL of the selected vault,

   e.g., `https://console.fireblocks.io/v2/accounts/vault/<vaultAccountId>`. For more details about Vault Accounts, refer to the [Create Vault Account guide](/reference/create-vault-account).

3. **Vault Account (for granting roles):** The `vaultAccountId` is responsible for granting roles. Ensure this vault also has sufficient native gas for transaction fees.

4. **Implementation Contract ABI:** The `ABI` of the implementation contract of the ERC20F token. This is required to interact with the token contract. For more details about how to retrieve the ABI, refer to the [Issue New ERC20F Tokens guide](/reference/issue-new-erc-20f-tokens).

5. **BaseAssetId ID:** The `baseAssetId` of the blockchain where the token is deployed (e.g. ETH\_TEST5 for Sepolia). This is the Fireblocks ID of the gas token of the blockchain where the token is deployed. (To get the base asset ID, refer to this [base assetId list](https://support.fireblocks.io/hc/en-us/articles/8993656344092-Supported-blockchain-networks))

With these in place, you can use the Fireblocks SDK to manage privileged roles for your ERC20F token and perform minting operations.

## Preparation steps

Here's an example of how to prepare the Fireblocks SDK to interact with the ERC20F token contract:

### 1. Initialize the Fireblocks SDK

First, import ethers and the Fireblocks SDK, and initialize the SDK with your Fireblocks API key and private key:

```javascript theme={"system"}
import {
    Fireblocks,
    BasePath,
} from '@fireblocks/ts-sdk';

const privateKey = '...'; // Your Fireblocks API private key
const apiKey = '...'; // Your Fireblocks API key

const fireblocksSdk = new Fireblocks({
    apiKey,
    basePath: BasePath.US, // Use BasePath.EU for the EU region
    secretKey: privateKey,
});
```

## Example: Mint Tokens

Minting tokens allows you to create new tokens and assign them to a specific address. In this example, the `MINTER_ROLE` has already been granted to an address during deployment.

> **Note:**
>
> The `vaultAccountId` used in the request must have the `MINTER_ROLE`. If the account does not have this role, the minting transaction will fail.

First, define the parameters for minting tokens:

* `recipientAddress`: The address to receive the tokens.
* `amount`: The fixed-point (integer) representation of the amount of tokens to burn. Since `ERC20F` token has 18 decimals, 1 token can be represented as `1 * 10^18` wei. The amount should be specified in wei.

Example:

```javascript theme={"system"}
const recipientAddress = '0x1234567890123456789012345678901234567890'; // Address to receive the tokens
const amount = '1000000000000000000'; // 1 token (in wei)
```

Use the `mint` function from the implementation contract `ABI` initially retrieved. Here's how to mint the tokens:

```javascript theme={"system"}
let mintTokensRequest: ContractInteractionsApiWriteCallFunctionRequest = {
    writeCallFunctionDto: {
        vaultAccountId: '0', // The vault account ID that has the MINTER_ROLE
        abiFunction: {
            "name": "mint",
            "type": "function",
            "inputs": [
                {
                    "name": "to",
                    "type": "address",
                    "internalType": "address",
                    value: recipientAddress,

                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256",
                    value: amount
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
    },
    contractAddress: '0x549E73A4aDF85757BD5Aa170cFb51cd6bBBafBb0', // Address of the ERC20F contract
    baseAssetId: 'ETH_TEST5', // Fireblocks asset ID
}

// Mint tokens
const response = await fireblocksSdk.contractInteractions.writeCallFunction(mintTokensRequest);
console.log('Mint tokens success:', response);
```

## Example: Burn Tokens

Burning tokens allows you to remove tokens from circulation. In this example, the `BURNER_ROLE` has not been granted to an address during deployment. So we need to grant the `BURNER_ROLE` to an address before burning tokens.

> **Note:**
>
> The `vaultAccountId` used in the request must have the `BURNER_ROLE`. If the account does not have this role, the burn transaction will fail.

Additionally, ensure that the vault account initiating the burn transaction has enough tokens to burn from its balance,
as the transaction will fail if the balance is insufficient.

For more information on how to grant roles to addresses, refer to the [Setting Up Roles in ERC20F Tokens guide](/reference/setting-up-roles-in-erc20f-tokens).

Example:

```javascript theme={"system"}
const roleBytes = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'; // BURNER_ROLE bytes
const granteeAddress = '0x1234567890123456789012345678901234567890'; // Address to receive the role

let grantRoleRequest: ContractInteractionsApiWriteCallFunctionRequest = {
    writeCallFunctionDto: {
        vaultAccountId: '0', // The vault account ID to grant the role
        abiFunction: {
            "name": "grantRole",
            "type": "function",
            "inputs": [
                {
                    "name": "role",
                    "type": "bytes32",
                    "internalType": "bytes32",
                    "value": roleBytes // BURNER_ROLE bytes
                },
                {
                    "name": "account",
                    "type": "address",
                    "internalType": "address",
                    "value": granteeAddress // Address to receive the role
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
    },
    contractAddress: '0x549E73A4aDF85757BD5Aa170cFb51cd6bBBafBb0', // Address of the ERC20F contract
    baseAssetId: 'ETH_TEST5', // Fireblocks asset ID
}
```

Once we can confirm the vault account has been granted the role, we need to define the parameters for burning tokens:

* `amount`: The fixed-point (integer) representation of the amount of tokens to burn. Since `ERC20F` token has 18 decimals, 1 token can be represented as `1 * 10^18` wei. The amount should be specified in wei.

Example:

```javascript theme={"system"}
const amount = '1000000000000000000'; // 1 token (in wei)
```

Use the `burn` function from the implementation contract ABI initially retrieved. Here's how to burn the tokens:

```javascript theme={"system"}
let burnTokensRequest: ContractInteractionsApiWriteCallFunctionRequest = {
    writeCallFunctionDto: {
        vaultAccountId: '0', // The vault account ID that has the BURNER_ROLE
        abiFunction: {
            "name": "burn",
            "type": "function",
            "inputs": [
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256",
                    "value": amount
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
    },
    contractAddress: '0x549E73A4aDF85757BD5Aa170cFb51cd6bBBafBb0', // Address of the ERC20F contract
    baseAssetId: 'ETH_TEST5', // Fireblocks asset ID
}

// Burn tokens
const response = await fireblocksSdk.contractInteractions.writeCallFunction(burnTokensRequest);
console.log('Burn tokens success:', response);
```

## Further Reading

For more detailed information on API parameters and responses, including examples for using plain HTTP requests or in other programming languages, please have a look at the [Fireblocks API Reference for read function](/reference/readcallfunction) and the [Fireblocks API Reference for write function](/reference/writecallfunction).

For more specific guidance on ERC20F contract operations, refer to the [Operating the Upgradable ERC20F Contract Support Center Articles](https://support.fireblocks.io/hc/en-us/articles/13926379966876-Operating-the-Upgradeable-ERC-20F-contract).
