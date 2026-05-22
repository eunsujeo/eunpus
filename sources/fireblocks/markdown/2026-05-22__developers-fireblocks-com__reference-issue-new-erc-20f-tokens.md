> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Issue New ERC20F Tokens

This guide explains how to use the `/v1/tokenization/tokens` endpoint through the SDK to issue a new ERC20F token. This will allow you to deploy and link the token to an asset, enabling easy management of issuance, minting, and burning operations.

## What is ERC20F?

ERC20F is a fungible token reference implementation developed by Fireblocks. It builds upon the widely used ERC-20 token standard, with added functionality for upgradability and enhanced control over token operations. This implementation is designed to be flexible, allowing for token minting, burning, and secure integration within Fireblocks' ecosystem. It is optimized for compliance, making it ideal for organizations requiring scalable and customizable token management solutions.

It's important to note that the ERC20F token uses a proxy pattern, which decouples the state (in the proxy) from the
smart contract logic (referred to as `implementation` in this guide) to support upgradability. Read more about the upgradability features of this contract [here](https://support.fireblocks.io/hc/en-us/articles/14018887816476-Fireblocks-upgradeable-smart-contracts).

We built a contract template for ERC20F tokens that you can use to issue new tokens. To find more information about Templates, refer to the [Contract Template guide](/reference/upload-contract-template#what-are-contract-templates).

## Prerequisites

Before issuing a new ERC20F token using the Fireblocks SDK, ensure you know the following:

1. **Asset ID:** The `assetId` of the blockchain where the token will be deployed (e.g. ETH\_TEST5 for Sepolia). This is the Fireblocks ID of the gas token of the blockchain where the token will be deployed. (To get the asset ID, refer to this [assetId list](https://support.fireblocks.io/hc/en-us/articles/8993656344092-Supported-blockchain-networks))
2. **Vault Account:** The `vaultAccountId` that will deploy the token. Ensure the vault has sufficient native gas for transaction fees. You can retrieve the vaultAccountId from the Fireblocks console by checking the URL of the selected vault, e.g., `https://console.fireblocks.io/v2/accounts/vault/<vaultAccountId>`. For more details about Vault Accounts, refer to the [Create Vault Account guide](/reference/create-vault-account).
3. **Contract Template:** Ensure the contract template is uploaded, and you have the `templateId` from the template. for details. (For `ERC20F`, the contract template ID is `41c76f08-3144-4641-96c9-260c8fe846a7` for `Prod US` workspaces).
4. Ensure you have access to the `Fireblocks Smart Contracts package`, which includes the reference protocol contracts.

With these in place, you can use the Fireblocks SDK to issue a new token.

## Example: Issuing a New ERC20F Token

Here's an example of how to issue a new ERC20F token using the Fireblocks SDK:

### 1. Initialize the Fireblocks SDK

First, the Fireblocks SDK and initialize the SDK with your Fireblocks API key and private key:

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

### 2. Retrieve ERC20F Contract Template

We need to retrieve the ERC20F contract template using the `getContractTemplate` method:
For more information, refer to the [Get Contract Template API reference page](/reference/getcontracttemplatebyid).

```javascript theme={"system"}
const template = await fireblocksSdk.contractTemplates.getContractTemplate({contractTemplateId: '00000000-0000-0000-0000-000000000003'});
```

As part of the response, you'll receive the `implementationContractId` which is required for the next steps.

### 3. Retrieve Implementation Contract Address

To get the address of the implementation contract, you need to call the `getDeployedContracts` method:

This extra step is required only for templates of contracts that follow the proxy pattern (such as ERC20F).

```javascript theme={"system"}
    const contractDetails = await fireblocksSdk.deployedContracts.getDeployedContracts({
    baseAssetId: 'ETH_TEST5',
    contractTemplateId: 'YOUR_TEMPLATE_ID_HERE'
})
```

As part of the response, you'll receive the `contractAddress` which is required for the next step.

### 4. Issue New Token

To proceed with deploying the new token, you need to define the following deployment variables:

* `name`: The token name (e.g., "MyToken").
* `symbol`: The token symbol (e.g., "MTK").
* `defaultAdminAddress`: The address that will receive the DEFAULT\_ADMIN\_ROLE.
* `minterAddress`: The address that will receive the MINTER\_ROLE.
* `pauserAddress`: The address that will receive the PAUSER\_ROLE.

For more information about the roles, refer to the [Roles in Fireblocks smart contracts article](https://support.fireblocks.io/hc/en-us/articles/13926413716892-Roles-in-Fireblocks-smart-contracts).

Example:

```javascript theme={"system"}
const name = 'MyToken';
const symbol = 'MTK';
const defaultAdminAddress = '0x1234567890123456789012345678901234567890';
const minterAddress = '0x1234567890123456789012345678901234567890';
const pauserAddress = '0x1234567890123456789012345678901234567890';
```

It's important to recall that the ERC20F token uses a proxy pattern. This means that when deploying the token, you must provide both the implementation contract address and the encoded initialize function in the `constructorParams` field. The proxy will reference the implementation contract and use the initialize method to set up the token parameters.

Now let's issue the new token:

```javascript theme={"system"}
let deployRequest: CreateTokenRequestDto = {
    assetId: 'ETH_TEST5', // Fireblocks asset ID for Sepolia network
    vaultAccountId: '0',  // The vault account ID to manage the token
    createParams: {
        contractId: '41c76f08-3144-4641-96c9-260c8fe846a7', // The ERC20F contract template ID
        deployFunctionParams: [
            {
                name: 'implementation',
                type: 'address',
                internalType: 'address',
                value: 'implementationContractAddress', // Address of the implementation contract retrieved in Step 3
            },
            {
                "name": "_data",
                "type": "bytes",
                "functionValue": {
                    "name": "initialize",
                    "type": "function",
                    "inputs": [
                        {
                            "name": "_name",
                            "type": "string",
                            "internalType": "string",
                            "value": name // _name (e.g., 'MyToken')
                        },
                        {
                            "name": "_symbol",
                            "type": "string",
                            "internalType": "string",
                            "value": symbol // _symbol (e.g., 'MTK')
                        },
                        {
                            "name": "defaultAdmin",
                            "type": "address",
                            "internalType": "address",
                            "value": defaultAdminAddress // Address with DEFAULT_ADMIN_ROLE
                        },
                        {
                            "name": "minter",
                            "type": "address",
                            "internalType": "address",
                            "value": minterAddress // Address with MINTER_ROLE
                        },
                        {
                            "name": "pauser",
                            "type": "address",
                            "internalType": "address",
                            "value": pauserAddress // Address with PAUSER_ROLE
                        }
                    ],
                }
            }
        ],
    },
};

// Issue the token
const response = await fireblocksSdk.tokenization.issueNewToken({createTokenRequestDto: deployRequest});
console.log('New token issued:', response);
```

## Highlights:

* Ensure that `contractId` passed in the `createParams` corresponds to the template ID of the contract you want to deploy. In this case, it is the ERC20F contract template ID.
* Replace the example addresses with your own values for `defaultAdminAddress`, `minterAddress`, and `pauserAddress`.
* Ensure that the vault account has sufficient native gas for transaction fees.
* If you need to obtain the ABI for the `initialize` function of the proxy used in step 4, you can find it in the

  contract template:

  ```javascript theme={"system"}
    const implementationTemplate = await fireblocksSdk.contractTemplates.getContractTemplate({contractTemplateId: 'implementationContractId'});
  ```

## Further Reading

For more detailed information on API parameters and responses, including examples for using plain HTTP requests or in other programming languages, please have a look at the [Fireblocks API Reference](/reference/issuenewtoken).

For more specific guidance on ERC20F contract operations, refer to the [Operating the Upgradable ERC20F Contract Support Center Articles](https://support.fireblocks.io/hc/en-us/articles/13926379966876-Operating-the-Upgradeable-ERC-20F-contract).
