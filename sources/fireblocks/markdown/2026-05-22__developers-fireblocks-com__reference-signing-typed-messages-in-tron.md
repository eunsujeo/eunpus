> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Sign Typed Messages in Tron

[TIP-191](https://github.com/tronprotocol/tips/blob/master/tip-191.md), much like EIP-191 in Ethereum, defines a standard for signing messages in the Tron network. The protocol is designed to allow users to sign plain messages in a way that can be securely verified. This includes specifying how messages should be formatted and signed to ensure they are distinguishable from transactions and other types of data.

The TIP-191 standard does not involve complex structures like JSON or detailed data typing as in EIP-712.
Instead, it focuses on the secure signing of simpler, plain-text messages. Here’s how it generally works:

* **Message Formatting:** The message to be signed is typically prepared with a specific prefix to distinguish it from transaction data. This prefix is crucial to prevent certain types of attacks where signed data could be misused.
* **Prefixing the Message:** Similar to EIP-191, a common practice in message signing under TIP-191 would involve adding a prefix that clarifies the message is a signed message and not part of a transaction. The prefix often used in Ethereum (and likely a similar approach in Tron) is `"\x19Tron Signed Message:\n"`, where `\x19` serves as a control character to differentiate the data.
* **Hashing**: Once the message is concatenated with the prefix, it is hashed using a cryptographic hash function, typically `SHA-256`. This hash ensures that the message is converted into a fixed-length, unique data set.
* **Signing:** The resulting hash is then signed using the private key of the signer’s Tron wallet. Tron also uses ECDSA for digital signatures, similar to Bitcoin and Ethereum.

***

## Tron Typed Message Signing In Fireblocks:

Below you can find a TypeScript SDK example for TIP191 Typed Message Signing. This is very similar to Ethereum and Bitcoin while the main differences are the `assetId` and the `type` of the message:

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

let txInfo:any;

const transactionPayload = {
  operation: TransactionOperation.TypedMessage,
  assetId: "TRX",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0", // The vault account ID represnting the address used to sign
  },
  note: `Test TIP-191 Message`,
  extraParameters: {
    rawMessageData: {
      messages: [
        {
          content: Buffer.from("Hello, Tron!").toString("hex"),
          type: "TIP191",
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

    console.log(txInfo)
    return transactionResponse.data;

  } catch (error) {
    console.error(error);
  }
};

signArbitraryMessage();
```

```json theme={"system"}
{
  "id": "cfe8c2b5-4095-413d-b41a-17d06749f317",
  "assetId": "TRX",
  "source": {
    "id": "your_vault_account_id",
    "type": "VAULT_ACCOUNT",
    "name": "Your_Vault_Name",
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
  "createdAt": 1712857479116,
  "lastUpdated": 1712857494054,
  "status": "COMPLETED",
  "txHash": "",
  "subStatus": "",
  "sourceAddress": "",
  "destinationAddress": "",
  "destinationAddressDescription": "",
  "destinationTag": "",
  "signedBy": [],
  "createdBy": "69a744b2-65dd-4bc0-95b4-7e049f448f72",
  "rejectedBy": "",
  "addressType": "",
  "note": "Test TIP-191 Message",
  "exchangeTxId": "",
  "feeCurrency": "TRX",
  "operation": "TYPED_MESSAGE",
  "amountInfo": {},
  "feeInfo": {},
  "signedMessages": [
    {
      "derivationPath": [
        44,
        195,
        0,
        0,
        0
      ],
      "algorithm": "MPC_ECDSA_SECP256K1",
      "publicKey": "03f01fd4069816ae8ebc0804736418397f94aaaf723a5bd7d20e8bc5f6a5b65c83",
      "signature": {
        "r": "5eaa33459387d23fe807444ad354e41ef95d240a0437a0a5b3b27a8d067276b5",
        "s": "5c4acdce460030de8eb90d22fb80de2512444d3927a08023856c3f356c6a0b81",
        "v": 1,
        "fullSig":"5eaa33459387d23fe807444ad354e41ef95d240a0437a0a5b3b27a8d067276b55c4acdce460030de8eb90d22fb80de2512444d3927a08023856c3f356c6a0b81"
      },
      "content": "35b82ee9a41533dada0749e62b3ee561b55e3f4a1555dba5703aa322911d2618"
    }
  ],
  "extraParameters": {
    "rawMessageData": {
      "messages": [
        {
          "type": "TIP191",
          "index": 0,
          "content": "48656c6c6f2c2054726f6e21"
        }
      ]
    }
  }
```

***

## Structuring The Signature:

The final signature is just the concatenated `r`, `s` and `v` values of the signature, prefixed with `0x` while the returned `v` (integer) is `0`/`1` ( 1 byte in hex so `00` /`01`) or the same as [EVM signature structuring](/reference/sign-typed-messages-for-ethereum-and-evm-networks#structuring-the-signature):

```javascript theme={"system"}
const signature = txInfo.signedMessages[0].signature;
const v = 27 + signature.v;

const finalSignature =  "0x" + signature.r + signature.s + v.toString(16);
```

***

## Validating The Signature:

In the example below we are using `verifyMessageV2()` from the [TronWeb](https://tronweb.network/docu/docs/API%20List/trx/verifyMessageV2) JS library:

```python theme={"system"}
import TronWeb from "tronweb"

const mySignerAddress = "<my_signer_address>"
const message = "Hello, Tron!"
const signature = "<signature_from_fireblocks>" // '0x' + r + s + v (hex)

const signerAddress = TronWeb.Trx.verifyMessageV2(
  message,
  signature
)

if(signerAddress === mySignerAddress) {
  console.log(`Signature is valid!`);
} else {
  console.log('Signature is invalid!');
}
```
