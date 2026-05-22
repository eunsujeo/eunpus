> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Upload Contract Template

# Upload Contract Template

This guide explains how to use the `/v1/tokenization/templates` endpoint. This endpoint allows you to upload smart contract templates to your Fireblocks workspace, using the Fireblocks Tokenization API.

## What are Contract Templates?

Contract Templates are one pillar of the Fireblocks Tokenization, built to streamline the process of deploying smart contracts. They serve as reusable blueprints for smart contracts, allowing developers and organizations to standardize their contract deployments across various projects and use cases.

Contract Templates can be used to:

* Follow upgradable patterns, where the logic contracts (implementation) are deployed once, and proxy contracts pointing to the implementation are deployed on-demand.
* Create a library of reusable token utilities for different use cases.
* Deploy a set of contracts or an entire protocol by using the Factory pattern.

***

## Prerequisites

Before using this endpoint, ensure you have:

1. Compiled your contract's code (e.g. Solidity) into bytecode (required)
2. Generated ABI (Application Binary Interface) from the compilation process (required)
3. Written NatSpec comments in your contract (optional, but recommended for better documentation)

***

## Example: Uploading a Counter Contract Template

Let's walk through uploading a simple `Counter` contract template.

### 1. Contract Code

Here's a simple Counter contract:

```solidity theme={"system"}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @title A simple Counter contract
/// @notice You can use this contract to increment, set and get a counter value
contract Counter {
    uint256 private count;

    function setNumber(uint256 newNumber) public {
        count = newNumber;
    }

    /// @notice Increment the counter by 1
    function increment() public {
        count++;
    }

    /// @notice Get the current counter value
    /// @return The current count
    function getCount() public view returns (uint256) {
        return count;
    }
}
```

### 2. Bytecode

After compilation, you'll get the bytecode. Depending on the tool/framework being used (e.g. Foundry, Hardhat, solc), you may find the bytecode in different location, and in a different property inside the artifact object.

* [Foundry](https://book.getfoundry.sh/reference/forge/forge-build): Saves the contract [artifacts](https://book.getfoundry.sh/reference/forge/forge-build?highlight=artifact#artifacts) in `out/` directory.
* [Hardhat](https://hardhat.org/hardhat-runner/docs/guides/compile-contracts#artifacts): Saves the contract [artifacts](https://hardhat.org/hardhat-runner/docs/advanced/artifacts) in the `artifacts/` directory.

  For brevity, we'll use a placeholder variable :

```text theme={"system"}
0x60806040...   => artifact.bytecode
```

### 3. ABI

The ABI is also part of the compilation artifact. For the `Counter` contract it would look like this:

```json theme={"system"}
[
	{
		"type": "function",
		"name": "getCount",
		"inputs": [],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "increment",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setNumber",
		"inputs": [{ "name": "newNumber", "type": "uint256", "internalType": "uint256" }],
		"outputs": [],
		"stateMutability": "nonpayable"
	}
]
```

For convenience, we'll use a placeholder variable to represent the JSON ABI above:

```javascript theme={"system"}
artifact.abi;
```

### 4. Uploading the Contract Template

Here's a TypeScript example of how to upload this contract template:

```javascript theme={"system"}
import {
	ContractTemplateDto,
	ContractUploadRequest,
	ContractUploadRequestTypeEnum,
	Fireblocks,
	FireblocksResponse,
} from '@fireblocks/ts-sdk';

async function uploadContractTemplate() {
	const privateKey = '...'; // Your Fireblocks API private key
	const apiKey = '...'; // Your Fireblocks API key

	const fireblocksSdk = new Fireblocks({
		apiKey,
		secretKey: privateKey,
	});

	const template: ContractUploadRequest = {
		name: 'Simple Counter',
		description: 'A basic counter contract for demonstration',
		longDescription:
			"This contract allows incrementing a counter and retrieving its current value. It's a simple example of state management in Solidity.",
		bytecode: artifact.bytecode.object,
		sourcecode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.13;\n\ncontract Counter {...}', // Optional: full source code
		type: ContractUploadRequestTypeEnum.TokenUtility,
		abi: artifact.abi,
		attributes: {
			useCases: ['Demo', 'Education'],
			standards: ['None'],
			auditor: {
				name: 'N/A',
				imageURL: '',
				link: '',
			},
		},
		docs: {
			details: 'A basic counter contract for demonstration purposes.',
			kind: 'user',
			version: 1,
			methods: {
				'increment()': {
					details: 'Increments the counter by 1',
				},
				'getCount()': {
					details: 'Returns the current counter value',
					returns: { '': 'The current count as a uint256' },
				},
			},
		},
	};

	try {
		const response: FireblocksResponse<ContractTemplateDto> = await sdk.contractTemplates.uploadContractTemplate({
			contractUploadRequest: template,
		});
		console.log('Template uploaded successfully. Template ID:', response.data.id);
		return response.data.id;
	} catch (error) {
		console.error('Error uploading template:', error);
	}
}

uploadContractTemplate().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
```

### 5. Viewing the Uploaded Template

After uploading, you can retrieve the template using its ID:

```javascript theme={"system"}
async function getContractTemplate(templateId: string) {
	try {
		const response: FireblocksResponse<ContractTemplateDto> =
			await fireblocksSdk.contractTemplates.getContractTemplateById({
				contractTemplateId: templateId,
			});
		console.log('Retrieved template:', response.data);
	} catch (error) {
		console.error('Error retrieving template:', error);
	}
}
```

***

## Endpoint Model

### Contract Template Type

The `type` field in the template is crucial:

* Use `FUNGIBLE_TOKEN` for ERC-20 tokens
* Use `NON_FUNGIBLE_TOKEN` for ERC-721 or ERC-1155 tokens
* Use `TOKEN_UTILITY` for everything else, including generic smart contracts like our Counter example

### Documentation Field

The `docs` field is used to populate "tooltips" for constructor/initialization parameters at deploy time.

This is an example of what the tooltips look like in the Fireblocks Console:

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/0e849e2-parameter-tooltip-viz.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=066f57dad1993553179964241a4ce511" alt="" width="2522" height="1382" data-path="images/docs/0e849e2-parameter-tooltip-viz.png" />

These tooltips provide valuable context and guidance during the deployment process. In some cases, the user deploying a contract from this template are not those who created the contract. As a template publisher, you can improve the user experience and reducing potential errors by providing a comprehensive `docs` field.

***

## Gotchas and Tips

1. Ensure your bytecode is prefixed with "0x" when submitting.
2. The ABI must be a valid JSON array of function descriptions.
3. NatSpec comments in your Solidity code can be used to inform the `docs` field.
4. The `attributes` field is optional but highly recommended for better categorization and searchability in the template library.

***

## Further Reading

For more detailed information on API parameters and responses, including examples for using plain HTTP requests or in other programming languages, please have a look at the [Fireblocks API Reference](/reference/getcontracttemplates).
