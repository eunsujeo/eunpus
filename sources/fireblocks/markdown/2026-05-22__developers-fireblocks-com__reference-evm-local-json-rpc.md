> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# EVM Local JSON RPC

# Overview

The Fireblocks JSON-RPC is a command-line server that utilizes the Fireblocks API to facilitate interactions with Ethereum Virtual Machine (EVM) chains. It enables users to perform blockchain operations through a JSON-RPC interface, and it was developed to simplify the integration of Fireblocks' secure wallet infrastructure with blockchain applications.

In this article, you will find installation instructions, code examples, and guidance on how to utilize Fireblocks JSON RPC and other frameworks (e.g. Brownie, Foundry) for smart contract development and interactions.

# Getting Started

## web3.py integration

[Fireblocks JSON-RPC](https://github.com/fireblocks/fireblocks-json-rpc) helps seamlessly integrate Fireblocks into your web3.py development stack.

You can use it to deploy contracts, sign messages, and send transactions.

### Installation

```bash theme={"system"}
npm install -g @fireblocks/fireblocks-json-rpc
pip install web3
```

### Setup

Set the [environment variables](https://github.com/fireblocks/fireblocks-json-rpc/blob/main/.env.example).

Create `example.py`:

```python theme={"system"}
import json
import os
from datetime import datetime
from web3 import Web3

web3 = Web3(Web3.IPCProvider(os.environ['FIREBLOCKS_JSON_RPC_ADDRESS'], 60000*180))
web3.eth.defaultAccount = web3.eth.accounts[0]
CONTRACT_ADDRESS = Web3.toChecksumAddress("0x8A470A36a1BDE8B18949599a061892f6B2c4fFAb")
GREETER_ABI = json.loads('[{"inputs":[{"internalType":"string","name":"_greeting","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_greeting","type":"string"}],"name":"setGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"}]')
GREETING = "Hello web3! By " + web3.eth.defaultAccount + " at " + str(datetime.now())

if __name__ == '__main__':
    print('last block number: ', web3.eth.blockNumber)
    for account in web3.eth.accounts:
        print('account: ', account)
        print('account balance: ', web3.fromWei(web3.eth.getBalance(account), "ether"), ' ETH\n')

    print('Greeter contract: https://sepolia.etherscan.io/address/' + CONTRACT_ADDRESS)

  	contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=GREETER_ABI)

    print('Current greeting:', contract.functions.greet().call())

    print('Setting greeting to:', GREETING)
    tx_hash = contract.functions.setGreeting(GREETING).transact({'from':web3.eth.defaultAccount})
    print('Transaction signed and broadcasted: https://sepolia.etherscan.io/tx/' + tx_hash.hex())
    print('Waiting for transaction to be mined...')
    web3.eth.wait_for_transaction_receipt(tx_hash)

    print('Current greeting:', contract.functions.greet().call())
```

### Usage

```bash theme={"system"}
fireblocks-json-rpc -- python example.py
```

You can now use the `web3` object exactly as you normally would!

# Ethereum Smart Contract Development

## Using Brownie

Use the [Fireblocks JSON-RPC](https://github.com/fireblocks/fireblocks-json-rpc) to seamlessly work with Brownie on top of Fireblocks.

## Installation

### Step 1 - Brownie installation:

Please follow the Brownie official [documentation](https://eth-brownie.readthedocs.io/en/stable/install.html) for installation

### Step 2 - Install Fireblocks JSON RPC server:

```bash theme={"system"}
npm install -g @fireblocks/fireblocks-json-rpc
```

## Setup

### Step 1 - Create a new example Brownie project:

```bash theme={"system"}
brownie bake token
cd token
```

### Step 2 - set environment variables:

Set the [environment variables](https://github.com/fireblocks/fireblocks-json-rpc/blob/main/.env.example)

### Step 3 - Add Fireblocks Sepolia network to Brownie:

```bash theme={"system"}
brownie networks add Fireblocks fireblocks-sepolia name="Sepolia (Fireblocks)" chainid=11155111 host='http://127.0.0.1:8545/${FIREBLOCKS_API_KEY}' timeout=600
```

### Step 4 - Configure brownie-config.yaml file:

Add ***dotenv: .env*** parameter to the config yaml file.

Example:

```yaml theme={"system"}
# exclude SafeMath when calculating test coverage
# https://eth-brownie.readthedocs.io/en/v1.10.3/config.html#exclude_paths
reports:
  exclude_contracts:
    - SafeMath
dotenv: .env
```

## Usage:

```bash theme={"system"}
fireblocks-json-rpc -- brownie run --network fireblocks-sepolia scripts/token.py
```

## Using Foundry

## Installing Foundry

You can skip this section if you already have Foundry installed or follow that [Foundry Installation guide](https://book.getfoundry.sh/getting-started/installation) , [Foundry New Project guide](https://book.getfoundry.sh/projects/creating-a-new-project) on the Foundry website for all details.

We provide you with a very basic process here for convenience:

```bash theme={"system"}
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init hello_foundry
cd hello_foundry
forge build
forge test
```

After you complete these steps, you'll have a new Foundry project.

## Foundry integration

The [Fireblocks Local JSON-RPC](https://github.com/fireblocks/fireblocks-json-rpc) helps seamlessly integrate Fireblocks into your [Foundry](https://book.getfoundry.sh/) development stack.

You can use it to deploy contracts, sign messages, and send transactions.

### Installation

```bash theme={"system"}
npm install -g @fireblocks/fireblocks-json-rpc
```

### Configuration

Configuration can be set via command line flags or environment variables.

Command line flags:

* Ignore apiBaseUrl if you are not using a sandbox environment

```bash theme={"system"}
fireblocks-json-rpc --apiKey <key> --privateKey <path_or_contents> --chainId <chainId> --apiBaseUrl https://sandbox-api.fireblocks.io
```

Environment variables:

* Ignore FIREBLOCKS\_API\_BASE\_URL if you are not using a sandbox environment

```bash theme={"system"}
FIREBLOCKS_API_KEY=<key> \
FIREBLOCKS_API_PRIVATE_KEY_PATH=<path_or_contents> \
FIREBLOCKS_CHAIN_ID=<chainId> \
FIREBLOCKS_API_BASE_URL=https://sandbox-api.fireblocks.io
fireblocks-json-rpc
```

Delete the files that came with your Foundry boilerplate template:

```bash theme={"system"}
rm test/Counter.t.sol script/Counter.s.sol src/Counter.sol
```

## Deploy Contract - Using 'forge script'

Now that you have a Foundry project set up, create your smart contract `src/Hello.sol` in the project folder and then deploy it to the Sepolia Ethereum Testnet.

### Step 1: Create and compile the Solidity file

```solidity theme={"system"}
pragma solidity ^0.8.17;

contract HelloWorld {
    string public greet = "Hello World!";
}
```

Run the following command to compile it:

```bash theme={"system"}
forge build
```

### Step 2: Create the deployment script

Create a deployment script `script/Hello.s.sol` :

```solidity theme={"system"}
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/Hello.sol";

contract MyScript is Script {
    function run() external {
        vm.startBroadcast();

        HelloWorld hello = new HelloWorld();

        vm.stopBroadcast();
    }
}
```

### Step 3: Deploy smart contract

Deploy your contract to the Ethereum Sepolia Testnet (It is recommended to use the `--slow` parameter in your forge script command, specifically when the script is processing few transactions sequentially):

```bash theme={"system"}
FIREBLOCKS_API_KEY=12345678-1234-1234-1234-123456789abc \
FIREBLOCKS_API_PRIVATE_KEY_PATH=/path/to/secret.key \
FIREBLOCKS_CHAIN_ID=11155111 \
fireblocks-json-rpc --http -- \
forge script script/Hello.s.sol:MyScript \
--sender <sender_address> --slow --broadcast --unlocked --rpc-url {}
```

* `sender_address` can be found in your Fireblocks workspace, through Fireblocks API, or using the JSON RPC directly.

  Get address of vault account 0:

```bash theme={"system"}
FIREBLOCKS_API_KEY=12345678-1234-1234-1234-123456789abc \
FIREBLOCKS_API_PRIVATE_KEY_PATH=/path/to/secret.key \
FIREBLOCKS_CHAIN_ID=11155111 \
fireblocks-json-rpc --http --vaultAccountIds 0 -- curl {} \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_accounts","id":1,"jsonrpc":"2.0"}'
```

This should take a couple of minutes to run if everything was configured correctly.
