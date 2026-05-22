> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# EVM Web3 Provider

# Overview

Popular blockchain choices for building Web3 capabilities are based typically on the Ethereum Virtual Machine (EVM), and therefore share the development tech stack.

Some examples of EVM blockchains:

* Ethereum
* BNB Chain (BSC)
* Polygon
* Avalanche
* Arbitrum

# Convenience libraries

Most commonly, developers interact with EVM-based blockchains using "convenience libraries" such as [web3.js](https://web3js.readthedocs.io/) and [ethers.js](https://docs.ethers.io).

To streamline your JavaScript development experience, we created the [Fireblocks Web3 Provider](https://github.com/fireblocks/fireblocks-web3-provider), to easily connect `ethers.js` and `web3.js` to your Fireblocks workspace.

# web3.js integration

The [Fireblocks Web3 Provider](https://github.com/fireblocks/fireblocks-web3-provider) helps seamlessly integrate Fireblocks into your [`web3.js`](https://web3js.readthedocs.io/) development stack. Use it to deploy contracts, sign messages, and send transactions.

### Installation

```bash theme={"system"}
npm install @fireblocks/fireblocks-web3-provider web3
```

### Setup

```javascript theme={"system"}
import { FireblocksWeb3Provider, ChainId, ApiBaseUrl } from "@fireblocks/fireblocks-web3-provider";

const eip1193Provider = new FireblocksWeb3Provider({
    apiBaseUrl: ApiBaseUrl.Sandbox, // If using a sandbox workspace
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.SEPOLIA,
})
```

If you are not using a Sandbox environment, but rather a regular one, just comment the apiBaseUrl line.

### Usage

```javascript theme={"system"}
import Web3 from "web3";

const web3 = new Web3(eip1193Provider);
```

Now you can use the `web3` object exactly as you normally would!

### Example

In this example we are executing the 'approve' method of [USDC](https://goerli.etherscan.io/address/0x07865c6E87B9F70255377e024ace6630C1Eaa37F#writeProxyContract) (ERC20) token on Sepolia by using web3.js and Fireblocks web3 provider.

```javascript theme={"system"}
const { FireblocksWeb3Provider, ChainId, ApiBaseUrl } = require("@fireblocks/fireblocks-web3-provider")
const Web3 = require("web3");

// Import the Sepolia USDC ABI
const ABI = require("./USDC_SEPOLIA_ABI.json");

// Sepolia USDC Contract Address
const CONTRACT_ADDRESS = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8"

const eip1193Provider = new FireblocksWeb3Provider({
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.SEPOLIA,
 // apiBaseUrl: ApiBaseUrl.Sandbox // If using a sandbox workspace
});

(async() => {

  	const web3 = new Web3(eip1193Provider);
  	const myAddr = await web3.eth.getAccounts()
  	const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  	const spenderAddr = "<spender_address>"

    // 1 USDC to approve
    const amount = 1e6

    // Invoke approve method
    console.log(
        await contract.methods.approve(spenderAddr, amount).send({
            from: myAddr[0]
        })
    )

})().catch(error => {
    console.log(error)
});
```

# ethers.js integration

The [Fireblocks Web3 Provider](https://github.com/fireblocks/fireblocks-web3-provider) helps seamlessly integrate Fireblocks into your [`ethers.js`](https://docs.ethers.io/) development stack.

You can use it to deploy contracts, sign messages, and send transactions.

### Installation

```bash theme={"system"}
npm install @fireblocks/fireblocks-web3-provider ethers@5
```

### Setup

```javascript theme={"system"}
import { FireblocksWeb3Provider, ChainId, ApiBaseUrl } from "@fireblocks/fireblocks-web3-provider";

const eip1193Provider = new FireblocksWeb3Provider({
    apiBaseUrl: ApiBaseUrl.Sandbox, // If using a sandbox workspace
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.SEPOLIA,
})
```

If you are not using a Sandbox environment, but rather a regular one, just comment the apiBaseUrl line.

### Usage

```javascript theme={"system"}
import * as ethers from "ethers"

const provider = new ethers.providers.Web3Provider(eip1193Provider);
```

Now you can use the `provider` object exactly as you normally would!

### Example

In this example we are executing the 'approve' method of [USDC](https://goerli.etherscan.io/address/0x07865c6E87B9F70255377e024ace6630C1Eaa37F#writeProxyContract) (ERC20) token on Sepolia by using ethers.js and Fireblocks web3 provider.

```javascript theme={"system"}
const { FireblocksWeb3Provider, ChainId, ApiBaseUrl } = require("@fireblocks/fireblocks-web3-provider")
const ethers = require("ethers")

// Import the Sepolia USDC ABI
const ABI = require("./USDC_SEPOLIA_ABI.json");

// Sepolia USDC Contract Address
const CONTRACT_ADDRESS = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8"

const eip1193Provider = new FireblocksWeb3Provider({
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.SEPOLIA,
 // apiBaseUrl: ApiBaseUrl.Sandbox // If using a sandbox workspace
});

(async() => {

    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
    const spenderAddr = "<spender_address>"

    // 1 USDC to approve
    const amount = 1e6

    // Invoke approve method
    const tx = await myContract.approve(
        spenderAddr,
        amount
    )

    console.log(JSON.stringify(tx, null, 2))

})().catch(error => {
    console.log(error)
});
```

# Viem integration

The [Fireblocks Web3 Provider](https://github.com/fireblocks/fireblocks-web3-provider) helps seamlessly integrate Fireblocks into your [viem](https://viem.sh/) development stack.

You can use it to deploy contracts, sign messages, and send transactions.

### Installation

```bash theme={"system"}
npm install @fireblocks/fireblocks-web3-provider viem
```

### Setup

```javascript theme={"system"}
import { FireblocksWeb3Provider, ChainId, ApiBaseUrl } from "@fireblocks/fireblocks-web3-provider";

const eip1193Provider = new FireblocksWeb3Provider({
    apiBaseUrl: ApiBaseUrl.Sandbox, // If using a sandbox workspace
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.SEPOLIA,
})
```

If you are not using a Sandbox environment, but rather a regular one, just comment the apiBaseUrl line.

### Usage

```javascript theme={"system"}
const { createWalletClient, custom } = require("viem")
const { sepolia } = require("viem/chains")

const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(eip1193Provider),
});
```

Now you can use the `walletClient` object exactly as you normally would!

### Example

In this example we are executing the 'approve' method of [USDC](https://goerli.etherscan.io/address/0x07865c6E87B9F70255377e024ace6630C1Eaa37F#writeProxyContract) (ERC20) token on Sepolia by using *viem* and Fireblocks web3 provider.

```javascript theme={"system"}
const { sepolia } = require("viem/chains")
const {
  ChainId,
  FireblocksWeb3Provider,
  ApiBaseUrl
} = require("@fireblocks/fireblocks-web3-provider")

const {
  createWalletClient,
  custom,
  createPublicClient,
  http
} = require("viem")

// Import the Sepolia USDC ABI
const ABI = require("./USDC_SEPOLIA_ABI.json");

// Sepolia USDC Contract Address
const CONTRACT_ADDRESS = '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8'

(async () => {

  const spenderAddr = "<spender_addr>";

  // 1 USDC to approve
  const amount = 1e6;

  const eip1193Provider = new FireblocksWeb3Provider({
   // apiBaseUrl: ApiBaseUrl.Sandbox, // If using a sandbox workspace
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.SEPOLIA
  });

  // Create wallet client instance
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(eip1193Provider),
  });

  // Create public client instance
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })

  // Get my account's address
  const [ account ] = await walletClient.getAddresses();

  // Simulate the 'approve' call
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'approve',
    args: [spenderAddr, amount],
    account
  })

  // Execute approve call via Fireblocks
  await walletClient.writeContract(request)
})();
```

# Ethereum Smart Contract Development

Smart contract development frameworks make it easy to develop, test, and deploy smart contracts on EVM-based blockchains.

# Using Truffle

Use the [Fireblocks Web3 Provider](https://github.com/fireblocks/fireblocks-web3-provider) to seamlessly work with Truffle on top of Fireblocks.

### Installation

```bash theme={"system"}
npm install -g truffle
npm install @fireblocks/fireblocks-web3-provider
```

## Configuration

### Step 1:

Set the [environment variables](https://github.com/fireblocks/fireblocks-json-rpc/blob/main/.env.example)

### Step 2:

Initialize an example Truffle NFT project:

```bash theme={"system"}
truffle unbox nft-box
```

### Step 3:

Edit the **truffle-config.js** file:

```javascript theme={"system"}
require('dotenv').config();
const { FireblocksWeb3Provider, ChainId } = require("@fireblocks/fireblocks-web3-provider");

module.exports = {
  networks: {
    sepolia: {
      provider: () => new FireblocksWeb3Provider({
        privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
        apiKey: process.env.FIREBLOCKS_API_KEY,
        vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
        chainId: ChainId.SEPOLIA,
      }),
      network_id: ChainId.SEPOLIA,
    },
  },
  compilers: {
    solc: {
      version: "0.8.13"
    }
  },
};
```

### Usage:

```bash theme={"system"}
truffle migrate --network sepolia
```
