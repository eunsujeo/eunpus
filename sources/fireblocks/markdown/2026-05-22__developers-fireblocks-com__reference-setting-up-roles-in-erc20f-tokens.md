> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Setting Up Roles in ERC20F Tokens

In this guide, we will walk you through how to set up roles for your ERC20F token. This is necessary because the ERC20F contract uses [Role-Based Access Control (RBAC)](https://docs.openzeppelin.com/contracts/4.x/access-control#role-based-access-control) for security purposes. RBAC ensures that specific actions within the contract, such as minting or pausing tokens, can only be performed by authorized accounts assigned to specific roles.

## What is RBAC?

Role-Based Access Control (RBAC) is a security model that restricts access to certain functionalities of a system based on roles assigned to users. In the context of the ERC20F token, RBAC ensures that only addresses with the appropriate roles—such as `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE`, and others—can perform actions like granting roles, minting and pausing or pausing the token. This approach enhances both security and flexibility by limiting critical operations to trusted parties.

## Prerequisites

Before granting roles to addresses, you need to have the following:

1. **ERC20F Contract Address**: The address of the ERC20F token contract you want to manage.
2. **Vault Account:** The `vaultAccountId` that will grant roles and manage the token. This account must have the`DEFAULT_ADMIN_ROLE` in the ERC20F contract. Ensure the vault has sufficient native gas for transaction fees. You can retrieve the vaultAccountId from the Fireblocks console by checking the URL of the selected vault, e.g., `https://console.fireblocks.io/v2/accounts/vault/<vaultAccountId>`. For more details about Vault Accounts, refer to the [Create Vault Account guide](/reference/create-vault-account).
3. **Implementation Contract ABI:** The `ABI` of the implementation contract of the ERC20F token. This is required to interact with the token contract. For more details about how to retrieve the ABI, refer to the [Issue New ERC20F Tokens guide](/reference/issue-new-erc-20f-tokens).
4. **Base Asset ID:** The `baseAssetId` of the blockchain where the token is deployed (e.g. ETH\_TEST5 for Sepolia). This is the Fireblocks ID of the gas token of the blockchain where the token is deployed. (To get the base asset ID, refer to this [base assetId list](https://support.fireblocks.io/hc/en-us/articles/8993656344092-Supported-blockchain-networks))

With these in place, you can use the Fireblocks SDK to set up roles for your ERC20F token.

## Example: Setting Up Roles in ERC20F Token

Here's an example of how to set up roles in an ERC20F token using the Fireblocks SDK:

### 1. Initialize the Fireblocks SDK

First, import the Fireblocks SDK and initialize the SDK with your Fireblocks API key and private key:

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

### 2. Read role hash

In order to assign or manage roles in the ERC20F token contract, you need the unique identifier (hash) for each role, such as `MINTER_ROLE`. This identifier allows the contract to distinguish between different roles. You can find the supported roles in the contract’s ABI.

For this example, we will retrieve the hash of the `MINTER_ROLE`. Once you locate the role in the ABI, you can use the `readCallFunction` method from the Fireblocks SDK to retrieve the role’s hash, which will be used in the next steps to grant the role to specific addresses.

Here’s an example:

```javascript theme={"system"}
   let minterRoleBytesRequest: ContractInteractionsApiReadCallFunctionRequest = {
    readCallFunctionDto: {
        abiFunction: {
            "name": "MINTER_ROLE",
            "type": "function",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
    },
    assetId: 'ETH_TEST5', // Fireblocks asset ID
    contractAddress: '0x549E73A4aDF85757BD5Aa170cFb51cd6bBBafBb0', // Address of the ERC20F contract
}
let response = await fireblocksSdk.contractInteractions.readCallFunction(minterRoleBytesRequest);
console.log('Response:', response);
let minterRoleBytes = response.data[0].value;
console.log('Minter Role Bytes:', minterRoleBytes);
```

### 3. Grant Role to Address

First we need to define the variables for the role grant:

* `granteeAddress`: The address to which you want to grant the role.
* `roleBytes`: The role hash retrieved in the previous step.

Example:

```javascript theme={"system"}
const roleBytes = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'; // MINTER_ROLE bytes
const granteeAddress = '0x1234567890123456789012345678901234567890'; // Address to receive the role
```

Use the `grantRole` function from the implementation contract ABI initially retrieved, to grant the role. Now let's
grant the role to the address:

```javascript theme={"system"}
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
                    "value": roleBytes
                },
                {
                    "name": "account",
                    "type": "address",
                    "internalType": "address",
                    "value": granteeAddress
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
    },
    contractAddress: '0x549E73A4aDF85757BD5Aa170cFb51cd6bBBafBb0', // Address of the ERC20F contract
    assetId: 'ETH_TEST5', // Fireblocks asset ID
}

// Grant the role
const response = await fireblocksSdk.contractInteractions.writeCallFunction(grantRoleRequest);
console.log('Grant role success:', response);
```

## Highlights:

* Ensure that the `vaultAccountId` has the `DEFAULT_ADMIN_ROLE`, as only the admin has the authority to grant roles to other addresses.

## Further Reading

For more detailed information on API parameters and responses, including examples for using plain HTTP requests or in other programming languages, please have a look at the [Fireblocks API Reference for read function](/reference/readcallfunction) and the [Fireblocks API Reference for write function](/reference/writecallfunction).

For more specific guidance on ERC20F contract operations, refer to the [Operating the Upgradable ERC20F Contract Support Center Articles](https://support.fireblocks.io/hc/en-us/articles/13926379966876-Operating-the-Upgradeable-ERC-20F-contract).
