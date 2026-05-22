> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Fireblocks Hardhat Plugin

# Overview

Hardhat is a development environment for Ethereum software that provides tools for editing, compiling, debugging, and deploying smart contracts and dApps.

The [Fireblocks Hardhat Plugin](https://github.com/fireblocks/hardhat-fireblocks) integrates Fireblocks' secure transaction features into your Hardhat workflow, enabling secure deployment and transaction signing.

# Using Hardhat

To use the Fireblocks Hardhat Plugin, you must have [Hardhat installed](https://hardhat.org/hardhat-runner/docs/getting-started).

You can follow our abridged Hardhat installation steps below or skip to the [Fireblocks Hardhat Plugin](ref:hardhat-plugin#fireblocks-plugin) section if you already have Hardhat installed.

## Install Hardhat

If you need to install Hardhat, you can use our abridged installation guide below. For a complete guide, refer to the official [Hardhat installation guide](https://hardhat.org/hardhat-runner/docs/getting-started).

### Abridged Hardhat installation guide

1. Install the Hardhat package:

```bash theme={"system"}
npm install --save-dev hardhat
```

2. Initialize a new Hardhat project:

```bash theme={"system"}
npx hardhat
```

This generates the following Hardhat menu display:

```text theme={"system"}
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.10.1 👷‍

? What do you want to do? …
❯ Create a JavaScript project
  Create a TypeScript project
  Create an empty hardhat.config.js
```

3. Select **Create a JavaScript project** and press **Enter**.
4. Follow the proceeding setup prompts.

Complete these steps to generate a new JavaScript Hardhat project in your current directory.

## Fireblocks Plugin

The [Fireblocks Hardhat Plugin](https://github.com/fireblocks/hardhat-fireblocks) helps seamlessly integrate Fireblocks into your Hardhat development stack. You can use it to deploy contracts, sign messages, and send transactions securely through Fireblocks.

### Installing the Hardhat plugin

1. Install the plugin package:

```bash theme={"system"}
npm install @fireblocks/hardhat-fireblocks
```

2. Import the plugin into your `hardhat.config.js` file:

```javascript theme={"system"}
require("@fireblocks/hardhat-fireblocks");
const { ApiBaseUrl } = require("@fireblocks/fireblocks-web3-provider");
require('dotenv').config();
```

### Configuring the Hardhat plugin

This plugin extends the `HttpNetworkUserConfig` object with an optional `fireblocks` field.

1. For this example, copy the code sample below into your `hardhat.config.js` configuration file:

```javascript theme={"system"}
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://sepolia.drpc.org",
      fireblocks: {
        apiBaseUrl: ApiBaseUrl.Sandbox, // Only use in a Sandbox workspace
        privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
        apiKey: process.env.FIREBLOCKS_API_KEY,
        vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
      }
    },
  },
};
```

> **Working in Sandbox**
>
> If you are not using a Sandbox workspace, remove the `apiBaseUrl` line.

2. Delete the `Lock.sol` file that came with your generated Hardhat environment:

```bash theme={"system"}
rm contracts/Lock.sol
```

## Deploy a contract using Hardhat Ignition

Now that your Hardhat plugin has been configured to work with Fireblocks, you can begin deploying a smart contract to the Sepolia Ethereum Testnet.

### Create and compile the Solidity file

1. Create a Solidity file in your project folder:

```bash theme={"system"}
touch contracts/HelloWorld.sol
```

2. Copy the following code sample into your `HelloWorld.sol` file:

```solidity theme={"system"}
pragma solidity ^0.8.17;

contract HelloWorld {
    string public greet = "Hello World!";
}
```

3. Run the following command to compile the project:

```bash theme={"system"}
npx hardhat compile
```

### Update and deploy the script

1. Create a new file `ignition/modules/HelloWorld.js` and add the following module definition:

```javascript theme={"system"}
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HelloWorld", (m) => {
	const helloWorld = m.contract("HelloWorld");

	return { helloWorld };
});
```

2. Deploy your contract to the Ethereum Sepolia Testnet using Hardhat Ignition:

```bash theme={"system"}
npx hardhat ignition deploy ignition/modules/HelloWorld.js --network sepolia
```

This should take a couple of minutes to run if everything was configured correctly.

Once the deploy script has finished running successfully, the following message will appear:

```bash theme={"system"}
Hardhat Ignition 🚀

Deploying [ HelloWorld ]

Batch #1
	Executed HelloWorld#HelloWorld

[ HelloWorld ] successfully deployed 🚀

Deployed Addresses

HelloWorld#HelloWorld - <contract_address>
```

### Post-deployment

Hardhat Ignition creates an `ignition/deployments/chain-11155111` folder for Sepolia that contains all the deployment details. This data enables Hardhat Ignition to recover from errors, resume interrupted deployments, and manage deployment states.

## Summary

You have now integrated the Fireblocks Hardhat Plugin into your Ethereum development workflow and deployed a smart contract to the Sepolia Testnet using Hardhat Ignition! This setup enables you to securely deploy contracts and manage transactions with Fireblocks’ infrastructure.
