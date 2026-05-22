> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Sign Typed Messages in Ethereum

Ethereum provides robust capabilities for typed message signing, particularly through [EIP-191](https://eips.ethereum.org/EIPS/eip-191) and [EIP-712](https://eips.ethereum.org/EIPS/eip-712).

These Ethereum Improvement Proposals enhance the security and usability of signing data on the Ethereum blockchain.

***

## EIP-191: Versioned Signatures

EIP-191 specifies a standard for signing messages that includes a versioning scheme. The version byte in the signature tells how the message should be structured, enabling multiple types of signatures under a single framework.

### How EIP-191 Works

* **Prefix Addition:** A standard prefix `\x19Ethereum Signed Message:\n` is added to the message. This prefix includes a declaration of the length of the message that follows, which helps ensure that the message is exactly as intended when signed and verified.
* **Message Concatenation:** The length of the message and the message itself are then concatenated following the prefix.
* **Hashing:** The entire string (prefix + length + message) is typically hashed using a cryptographic hash function like `keccak-256`.
* **Signing:** The resulting hash is then signed using the private key associated with the Ethereum address of the signer.

***

## EIP-712: Signing Structured Data

EIP-712 takes typed message signing further by introducing a standard for signing structured data that humans and machines can read. This EIP aims to make blockchain interactions as understandable as possible, providing users with a clear understanding of what they are signing, thereby reducing the risk of malicious activities.

### How EIP-712 Works

* **Data Typing and Structuring:** Data is structured into types, each defined with a name and a series of fields. EIP-712 allows you to define custom types in addition to predefined types.
* **Domain Separation:** EIP-712 introduces the concept of domain separation, which allows different applications to define their own unique "domains" to prevent signature collisions. A domain includes defining the contract's name, version, and the chain it's deployed on.
* **Message Creation:** The message to be signed is composed of typed data according to the specified schema. This can include multiple fields and data types.
* **Signing the Data:** Users sign the structured data using their private keys. This signature can be verified against the signer’s public key.
* **Verification:** The smart contract can then verify the signature directly by reconstructing the typed data and using the signer’s public address.

***

## Ethereum Typed Message Signing in Fireblocks:

Fireblocks supports both EIP-191 and EIP-712 Typed Message Signing. Additionally, Fireblocks users can sign Typed Messages for any EVM-compatible blockchain supported by Fireblocks. This capability is facilitated by all EVM networks using the same address derivation, resulting in the same address within the same vault account.

> **For any EVM compatible network other than Ethereum, users must still specify ETH as the assetId when calling the API.**

Below you can find TypeScript SDK examples on how to use Fireblocks for EIP712 and EIP191 Typed Message Signing:

```javascript theme={"system"}
import {
  BasePath,
  Fireblocks,
  FireblocksResponse,
  TransactionOperation,
  TransactionResponse,
  TransactionStateEnum,
  TransferPeerPathType,
} from "@fireblocks/ts-sdk";
import { readFileSync } from "fs";

require("dotenv").config();

const FIREBLOCKS_API_KEY = process.env.FIREBLOCKS_API_KEY;
const FIREBLOCKS_SECRET_KEY_PATH = process.env.FIREBLOCKS_SECRET_KEY_PATH;
const FIREBLOCKS_SECRET_KEY = readFileSync(FIREBLOCKS_SECRET_KEY_PATH, "utf-8");

const fireblocks = new Fireblocks({
  apiKey: FIREBLOCKS_API_KEY,
  secretKey: FIREBLOCKS_SECRET_KEY,
  basePath: BasePath.US,
});

let txInfo: any;

const transactionPayload = {
  operation: TransactionOperation.TypedMessage,
  assetId: "ETH",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0", // The vault account ID representing the address used to sign
  },
  note: `Test EIP-191 Message`,
  extraParameters: {
    rawMessageData: {
      messages: [
        {
          content: Buffer.from("Hello, Ethereum!").toString("hex"),
          type: "EIP191",
        },
      ],
    },
  },
};

const getTxStatus = async (txId: string): Promise<TransactionResponse> => {
  try {
    let response: FireblocksResponse<TransactionResponse> =
      await fireblocks.transactions.getTransaction({ txId });
    let tx: TransactionResponse = response.data;
    let messageToConsole: string = `Transaction ${tx.id} is currently at status - ${tx.status}`;

    console.log(messageToConsole);
    while (tx.status !== TransactionStateEnum.Completed) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      response = await fireblocks.transactions.getTransaction({ txId });
      tx = response.data;

      switch (tx.status) {
        case TransactionStateEnum.Blocked:
        case TransactionStateEnum.Cancelled:
        case TransactionStateEnum.Failed:
        case TransactionStateEnum.Rejected:
          throw new Error(
            `Signing request failed/blocked/cancelled: Transaction: ${tx.id} status is ${tx.status}`,
          );
        default:
          console.log(messageToConsole);
          break;
      }
    }
    while (tx.status !== TransactionStateEnum.Completed);

    return tx;
  } catch (error) {
    throw error;
  }
};

const signArbitraryMessage = async (): Promise<
  TransactionResponse | undefined
> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    const txId = transactionResponse.data.id;
    if (!txId) {
      throw new Error("Transaction ID is undefined.");
    }
    txInfo = await getTxStatus(txId);

    console.log(txInfo);
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};

signArbitraryMessage();
```

```javascript theme={"system"}
import {
  BasePath,
  Fireblocks,
  FireblocksResponse,
  TransactionOperation,
  TransactionResponse,
  TransactionStateEnum,
  TransferPeerPathType,
} from "@fireblocks/ts-sdk";
import { readFileSync } from "fs";

require("dotenv").config();

const FIREBLOCKS_API_KEY = process.env.FIREBLOCKS_API_KEY;
const FIREBLOCKS_SECRET_KEY_PATH = process.env.FIREBLOCKS_SECRET_KEY_PATH;
const FIREBLOCKS_SECRET_KEY = readFileSync(FIREBLOCKS_SECRET_KEY_PATH, "utf-8");

const fireblocks = new Fireblocks({
  apiKey: FIREBLOCKS_API_KEY,
  secretKey: FIREBLOCKS_SECRET_KEY,
  basePath: BasePath.US,
});

const getTxStatus = async (txId: string): Promise<TransactionResponse> => {
  try {
    let response: FireblocksResponse<TransactionResponse> =
      await fireblocks.transactions.getTransaction({ txId });
    let tx: TransactionResponse = response.data;
    let messageToConsole: string = `Transaction ${tx.id} is currently at status - ${tx.status}`;

    console.log(messageToConsole);
    while (tx.status !== TransactionStateEnum.Completed) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      response = await fireblocks.transactions.getTransaction({ txId });
      tx = response.data;

      switch (tx.status) {
        case TransactionStateEnum.Blocked:
        case TransactionStateEnum.Cancelled:
        case TransactionStateEnum.Failed:
        case TransactionStateEnum.Rejected:
          throw new Error(
            `Signing request failed/blocked/cancelled: Transaction: ${tx.id} status is ${tx.status}`,
          );
        default:
          console.log(messageToConsole);
          break;
      }
    }
    while (tx.status !== TransactionStateEnum.Completed);
    return tx;
  } catch (error) {
    throw error;
  }
};

const chainId = 1; // Update the chainId for the relevant EVM network

const eip712message = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    Permit: [
      { name: "holder", type: "address" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "expiry", type: "uint256" },
      { name: "allowed", type: "bool" },
    ],
  },
  primaryType: "Permit",
  domain: {
    name: "Dai Stablecoin",
    version: "1",
    chainId, // Update the chainId for the relevant EVM network
    verifyingContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  message: {
    holder: "0x289826f7248b698B2Aef6596681ab0291BFB2599",
    spender: "0x043f38E9e8359ca32cD57503df25B8DEF2845356",
    nonce: 123,
    expiry: 1655467980,
    allowed: true,
  },
};

const transactionPayload = {
  operation: TransactionOperation.TypedMessage,
  assetId: "ETH",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0", // The vault account ID represnting the address used to sign
  },
  note: "Test EIP-712 Message",
  extraParameters: {
    rawMessageData: {
      messages: [
        {
          content: eip712message,
          type: "EIP712",
        },
      ],
    },
  },
};

let txInfo: any;

const signArbitraryMessage = async (): Promise<
  TransactionResponse | undefined
> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    const txId = transactionResponse.data.id;
    if (!txId) {
      throw new Error("Transaction ID is undefined.");
    }
    txInfo = await getTxStatus(txId);
    console.log(txInfo);

    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};

signArbitraryMessage();
```

***

## Structuring the Signature

Once the Typed Message Signing request is successfully signed, you can retrieve the transaction using the [Get Transaction By TxId Endpoint](/reference/gettransaction). The signed transaction will appear in the following format:

```json theme={"system"}
{
  "id": "<your_transaction_id>",
  "assetId": "ETH",
  "source": {
    "id": "<vault_account_id>",
    "type": "VAULT_ACCOUNT",
    "name": "<vault_account_name>",
    "subType": ""
  },
  "destination": {
    "id": null,
    "type": "UNKNOWN",
    "name": "N/A",
    "subType": ""
  },
  "requestedAmount": null,
  "amount": null,
  "netAmount": -1,
  "amountUSD": null,
  "fee": -1,
  "networkFee": -1,
  "createdAt": 1712522541024,
  "lastUpdated": 1712522564793,
  "status": "COMPLETED",
  "txHash": "",
  "subStatus": "",
  "sourceAddress": "",
  "destinationAddress": "",
  "destinationAddressDescription": "",
  "destinationTag": "",
  "signedBy": [],
  "createdBy": "<API_KEY>",
  "rejectedBy": "",
  "addressType": "",
  "note": "Test EIP191 Message",
  "exchangeTxId": "",
  "feeCurrency": "ETH",
  "operation": "TYPED_MESSAGE",
  "amountInfo": {},
  "feeInfo": {},
  "signedMessages": [
    {
      "derivationPath": [
        44,
        60,
        0,
        0,
        0
      ],
      "algorithm": "MPC_ECDSA_SECP256K1",
      "publicKey": "03af66c4551559d54bfbfd14c84870a337b06bf2738ed6427480ec56ee551c7458",
      "signature": {
        "r": "c8ab06c7c3447ac8f594a643d5942ceb2451b9434bb29c4b1a40da5cf3240300",
        "s": "2bfba73d825b240f2e2949df139c2f3e26e6cdd36579eb1a0cbd4abc4e6e348a",
        "v": 0,
        "fullSig": "c8ab06c7c3447ac8f594a643d5942ceb2451b9434bb29c4b1a40da5cf32403002bfba73d825b240f2e2949df139c2f3e26e6cdd36579eb1a0cbd4abc4e6e348a"
      },
      "content": "90089ed244695164981f5f54e78bea15387a2bdda0dca6a81e1fe79cd30075db"
    }
  ],
  "extraParameters": {
    "rawMessageData": {
      "messages": [
        {
          "type": "ETH_MESSAGE",
          "index": 0,
          "content": "494e53455254205445585420484552452121"
        }
      ]
    }
  },
  "destinations": [],
  "blockInfo": {},
  "assetType": "BASE_ASSET"
}
```

```json theme={"system"}
{
  "id": "<your_transaction_id>",
  "assetId": "ETH",
  "source": {
    "id": "<vault_account_id>",
    "type": "VAULT_ACCOUNT",
    "name": "<vault_account_name>",
    "subType": ""
  },
  "destination": {
    "id": null,
    "type": "UNKNOWN",
    "name": "N/A",
    "subType": ""
  },
  "requestedAmount": null,
  "amount": null,
  "netAmount": -1,
  "amountUSD": null,
  "fee": -1,
  "networkFee": -1,
  "createdAt": 1712520602396,
  "lastUpdated": 1712520622523,
  "status": "COMPLETED",
  "txHash": "",
  "subStatus": "",
  "sourceAddress": "",
  "destinationAddress": "",
  "destinationAddressDescription": "",
  "destinationTag": "",
  "signedBy": [],
  "createdBy": "<API_KEY>",
  "rejectedBy": "",
  "addressType": "",
  "note": "Test EIP-712 Message",
  "exchangeTxId": "",
  "feeCurrency": "ETH",
  "operation": "TYPED_MESSAGE",
  "amountInfo": {},
  "feeInfo": {},
  "signedMessages": [
    {
      "derivationPath": [
        44,
        60,
        0,
        0,
        0
      ],
      "algorithm": "MPC_ECDSA_SECP256K1",
      "publicKey": "03af66c4551559d54bfbfd14c84870a337b06bf2738ed6427480ec56ee551c7458",
      "signature": {
        "r": "2e31d257c1bcd232c50d628e9e97407373c4a1c5cc79672039a1f7946984a702",
        "s": "370b8e16123e30968ba7018a6726f97dfc82f5547f99fe78b432a40a1d1f8564",
        "v": 0,
        "fullSig": "2e31d257c1bcd232c50d628e9e97407373c4a1c5cc79672039a1f7946984a702370b8e16123e30968ba7018a6726f97dfc82f5547f99fe78b432a40a1d1f8564"
      },
      "content": "36c0b1b40bcd032c871ca176243f5ff7e603a9ce91ff8dae62d79ab8dee6817a"
    }
  ],
  "extraParameters": {
    "rawMessageData": {
      "messages": [
        {
          "type": "EIP712",
          "index": 0,
          "content": {
            "types": {
              "Permit": [
                {
                  "name": "holder",
                  "type": "address"
                },
                {
                  "name": "spender",
                  "type": "address"
                },
                {
                  "name": "nonce",
                  "type": "uint256"
                },
                {
                  "name": "expiry",
                  "type": "uint256"
                },
                {
                  "name": "allowed",
                  "type": "bool"
                }
              ],
              "EIP712Domain": [
                {
                  "name": "name",
                  "type": "string"
                },
                {
                  "name": "version",
                  "type": "string"
                },
                {
                  "name": "chainId",
                  "type": "uint256"
                },
                {
                  "name": "verifyingContract",
                  "type": "address"
                }
              ]
            },
            "domain": {
              "name": "Dai Stablecoin",
              "chainId": 1,
              "version": "1",
              "verifyingContract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            },
            "message": {
              "nonce": 123,
              "expiry": 1655467980,
              "holder": "0x289826f7248b698B2Aef6596681ab0291BFB2599",
              "allowed": true,
              "spender": "0x043f38E9e8359ca32cD57503df25B8DEF2845356"
            },
            "primaryType": "Permit"
          }
        }
      ]
    }
  },
  "destinations": [],
  "blockInfo": {},
  "assetType": "BASE_ASSET"
}
```

To access the signature, navigate to the object at the first index (0) of the `signedMessages` array. Within this object, the `signature` object contains three components: `r`, `s`, and `v`:

* `r`: This is the first 32 bytes of the signature, representing the X coordinate of the point on the elliptic curve
* `s`: This is the second 32 bytes of the signature, representing the scalar component of the elliptic curve point
* `v`: This parameter is crucial for correctly reconstructing the public key used in signing. It helps distinguish between the possible public keys that could correspond to the signature

There are principally two methods to assemble a complete, correctly structured signature on EVM-based blockchains, differing primarily in how the `v` value is calculated, a modification introduced by [EIP-155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md).
EIP-155 prevents certain types of replay attacks by incorporating the `chainId` into the `v` value:

```javascript theme={"system"}
const signature = txInfo.signedMessages[0].signature;
const v = 27 + signature.v;

const finalSignature =  "0x" + signature.r + signature.s + v.toString(16);
```

```javascript theme={"system"}
const signature = txInfo.signedMessages[0].signature;
const v = chainId * 2 + 35 + signature.v;

const finalSignature = "0x" + signature.r + signature.s + v.toString(16);
```

It is important to consider the `chainId` value when working with any EVM-based blockchain as it directly affects the calculation of the `v` parameter.

Properly calculating `v` ensures that the signature correctly corresponds to the network on which the transaction is intended, thus preventing cross-chain replay attacks.

A full list of EVM Networks `chainId` values can be found [here](https://chainlist.org/).

***

## Verifying the Signature

In the examples below we are using [ethers.js](https://docs.ethers.org/v6/) (v6.11.1) in order to verify the signed Typed Message:

```javascript theme={"system"}
import { verifyMessage } from "ethers"

const mySignerAddress = "<my_signer_address>"
const message = "Hello, Ethereum!"
const signature = "<signature_from_fireblocks>"

function verifyMessageWithEthers(message, signature) {
    const signerAddress = verifyMessage(message, signature);
    return signerAddress;
}

const signerAddress = verifyMessageWithEthers(message, signature);

if(signerAddress === mySignerAddress) {
  console.log(`Signature is valid!`);
} else {
  console.log('Signature is invalid!');
}
```

```javascript theme={"system"}
const { ethers } = require('ethers');

const domain = {
  name: "Dai Stablecoin",
  version: "1",
  chainId: 1,
  verifyingContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
};

const types = {
  Permit: [
    { name: "holder", type: "address" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "expiry", type: "uint256" },
    { name: "allowed", type: "bool" }
  ]
};

const value = {
  holder: "0x289826f7248b698B2Aef6596681ab0291BFB2599",
  spender: "0x043f38E9e8359ca32cD57503df25B8DEF2845356",
  nonce: 123,
  expiry: 1655467980,
  allowed: true
};

const signature = '<my_signature_from_fireblocks>';

async function verifySignature() {
  try {
    const signerAddress = await ethers.verifyTypedData(domain, types, value, signature);
    console.log('Recovered address:', signerAddress);

    if (signerAddress.toLowerCase() === value.holder.toLowerCase()) {
      console.log('Signature is valid!');
    } else {
      console.log('Signature is invalid.');
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
  }
}

verifySignature();
```
