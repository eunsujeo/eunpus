> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SDK - Multichain Deployment

# What is a Multichain Deployment?

The Multichain Deployment feature in Fireblocks allows you to deploy the same smart contract to the same address across multiple EVM-compatible blockchain networks, all in one streamlined UI flow.

> **Note:**
>
> This feature is currently available only for EVM chains.

This is particularly useful when:

* Maintaining identical contract addresses on different networks (for example, Ethereum, Arbitrum, or Polygon) for seamless cross-chain integration.
* Having your dApp, token, or protocol rely on a consistent contract address to simplify frontends, indexers, or backend services.
* Reducing complexity for developers, indexers, and frontend apps by using a single contract address across all chains.
* Improving user experience: Users interacting with your protocol on different chains do not have to deal with varying addresses.

Fireblocks utilizes a deterministic deployment mechanism to ensure the same address across blockchains. To perform a multichain deployment, use the Fireblocks SDK to select the chains where the contract will be deployed. As long as you have enough gas on each selected network, deployment proceeds simultaneously.

# Multichain Deployment using the Fireblocks SDK

## Step 1: Install dependencies & bootstrap the SDK

1. Add packages:

   <img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/a9c9b400c212f35f3a298bb2783f986e8e5d355cd8d8469417ea4e4be2fc8eaa-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=3926b2f82a1f59e25b56e135bbcdaa29" alt="" width="1270" height="57" data-path="images/docs/a9c9b400c212f35f3a298bb2783f986e8e5d355cd8d8469417ea4e4be2fc8eaa-image.png" />

2. Create .env and store the public and private key of your api-user:

   <img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/71e9defb41cfd652229a1e15a34c6f2d4b8f066d6fe617c222f89c20f3579812-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=53fd7dad98a040acfa41e452b10c12cb" alt="" width="1922" height="220" data-path="images/docs/71e9defb41cfd652229a1e15a34c6f2d4b8f066d6fe617c222f89c20f3579812-image.png" />

3. Initialize the client:

   <img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/dd5f1a15b690f6bca62a5d05c11bc3e41b2f6dc2f4ddbf70f25534dcced258a9-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=ac6ae75e52c772edace364a4f2655191" alt="" width="1675" height="546" data-path="images/docs/dd5f1a15b690f6bca62a5d05c11bc3e41b2f6dc2f4ddbf70f25534dcced258a9-image.png" />

## Step 2: Define the deployment scope

### Fields:

* **contractId** - ensure the contract template is uploaded, and you have the `templateId` from the template.
* **deployerVaultAccountId** - the `deployerVaultAccountId` that will deploy the tokens. Ensure the vault has sufficient native gas for transaction fees. Use the [Get Vault Accounts endpoint](/reference/getpagedvaultaccounts) to retrieve the correct vault account ID.
* **targetChains** - the Fireblocks asset IDs for each network you are deploying to (for example, ETH\_TEST5).
* **feeLevel** - the gas-price tier for broadcasting each deployment transaction..

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/8539da6299ba30bba6ae1bac271883ea9345b96f2e94e8a508129c097ed876a7-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=ba6cd2a4776ede84404349177fabc5c3" alt="" width="2179" height="551" data-path="images/docs/8539da6299ba30bba6ae1bac271883ea9345b96f2e94e8a508129c097ed876a7-image.png" />

## Step 3: Build the CreateMultichainTokenRequest

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/c5ca58c8f29bad4468dc77c3283a4e8206da30d3603cba802afc7d2e44cf64a8-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=6f502ddb19e6afa846e92d9f5db2d994" alt="" width="915" height="1110" data-path="images/docs/c5ca58c8f29bad4468dc77c3283a4e8206da30d3603cba802afc7d2e44cf64a8-image.png" />

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/78fac444be630024d0032f24397b56a9580caf32a518178fd0fad03fa942cf9c-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=e0ad49ead06a698788c728de178429ab" alt="" width="990" height="415" data-path="images/docs/78fac444be630024d0032f24397b56a9580caf32a518178fd0fad03fa942cf9c-image.png" />

### What each block does

* **\_logic** – points the proxy to your implementation contract.
* **\_data** – packs the proxy’s initialize() call to create a name, symbol, and set roles for the ERC-20F deployment.

### What deployFunctionParams represents

The deployFunctionParams represents the list of constructor/initializer arguments that Fireblocks will pass to the specific contract template you picked. For an upgradeable proxy you usually see two items (\_logic and \_data). For a non-upgradeable contract, you might have one, three, or zero items, depending on the template’s ABI requirements. Always adjust the entire **deployFunctionParams** array—the field names, types, order, and values—to match the constructor or initializer of the contract you’re deploying. For instructions on finding the initializer’s parameters, see “**Highlights**” in this [guide](/reference/issue-new-erc-20f-tokens#highlights).

## Step 4: Submit & monitor the deployment

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/0e872006a6d76c5c526d6811d76ca26b0cbf37bdbf705dc88e4618fa5746f4ad-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=bf58c21a13d3b1618607f9fdee907f8d" alt="" width="1718" height="332" data-path="images/docs/0e872006a6d76c5c526d6811d76ca26b0cbf37bdbf705dc88e4618fa5746f4ad-image.png" />

### On Success:

Once deployment is complete, you can view your deployed contracts in the Fireblocks Console on the Tokenization page, in the Tokens and Contracts section, or use the [Get Deployed Contracts endpoint](/reference/getdeployedcontracts). You can also track the status of each deployment in the Recent Activity tab. In this example, we deployed to Ethereum Holesky and Ethereum Sepolia. Both deployments share the same contract address, confirming a successful multichain deployment.

**Deployed Contracts:**

* [Ethereum Holesky Contract](https://holesky.etherscan.io/address/0x24810534B24e3927152C1B814A9B25EC4AEff29B)
* [Ethereum Sepolia Contract](https://sepolia.etherscan.io/address/0x24810534B24e3927152C1B814A9B25EC4AEff29B)

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/0ec0a1a6eb233e53c90fc2af74561d87ada02984ebece01df5c36e05900237a2-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=13d9d1f740678f13354afa8ba1fbc513" alt="" width="2134" height="1460" data-path="images/docs/0ec0a1a6eb233e53c90fc2af74561d87ada02984ebece01df5c36e05900237a2-image.png" />

## Important deployment information

Before proceeding with a multichain deployment, keep the following in mind:

* You need gas for transaction fees on every selected network. Ensure the deployer wallet has enough of each base asset (for example, ETH, MATIC) on each chain to cover deployment costs. Being unable to pay transaction fees will block deployment.
* Deployment is pre-validated across all chains. Fireblocks runs simulations before executing transactions. If any chain is predicted to fail, the deployment will not proceed for any chain. This guarantees consistency across your selected networks.
* Transactions must be signed per chain. Even though the deployment is unified, a separate transaction must be signed for each chain. Expect multiple signing prompts during execution.
* Inputs apply uniformly across all chains. Deployment parameters, such as token name, symbol, supply, and roles (this includes the minter address), are shared across all selected networks. You cannot customize them per chain. If different parameters are required per network, you need to deploy each token contract separately,and the contract address will differ.

## Additional SDK capability – getDeployableAddress

You can predict the contract address before broadcasting using the getDeployableAddress endpoint. This uses the initializer and salt in issueTokenMultiChain() to compute the deterministic address that a template will deploy to. After following Steps 1-3 above, call tokenization.getDeployableAddress().

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/5d35809243e92f7d2f75116a9f478ef8e32e4bc9d8b92ad23e8c088aef10d421-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=74b161f236847998b17b37d0267dce26" alt="" width="2174" height="1224" data-path="images/docs/5d35809243e92f7d2f75116a9f478ef8e32e4bc9d8b92ad23e8c088aef10d421-image.png" />

### Fields

* **templateId** - the contract template ID you will deploy.
* **initParams** - the exact deployFunctionParams array from Step 3.
* **chainDescriptor** - the Fireblocks asset IDs of the network you are deploying to (for example . ETH\_TEST5).
* **salt** - any arbitrary whole number that becomes part of the deterministic calculation and therefore fixes the resulting contract address.

Knowing the address ahead of time lets you pre-whitelist or publish it before the actual *issueTokenMultiChain()* call.
