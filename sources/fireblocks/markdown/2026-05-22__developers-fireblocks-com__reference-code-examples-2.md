> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Code Examples

# Bitcoin Arbitrary Message

> **BTC arbitrary message signing can be also performed by Typed Message signing and it is considered more secure. Check out our Typed Message guide**

The example below illustrates the use of the Raw Signing feature for Bitcoin arbitrary message signing:

```javascript theme={"system"}
import { readFileSync } from 'fs';
import {
  Fireblocks,
  BasePath,
  TransactionOperation,
  TransferPeerPathType,
  TransactionRequest,
  TransactionResponse,
  FireblocksResponse,
  TransactionStateEnum,
  CreateTransactionResponse
} from "@fireblocks/ts-sdk";
import { createHash } from "crypto";

const FIREBLOCKS_API_SECRET_PATH = "<PATH_TO_SECRET>";
const API_KEY = "<API_KEY>"

// Initialize a Fireblocks API instance with local variables
const fireblocks = new Fireblocks({
    apiKey: API_KEY,
    basePath: BasePath.US, // Basepath.Sandbox for the sandbox env
    secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, "utf8"),
});

const transactionPayload: TransactionRequest = {
  assetId: "BTC",
  operation: TransactionOperation.Raw,
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  note: ``,
  extraParameters: {
    rawMessageData: {},
  },
};

let txInfo: any;

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

const rawSign = async (
  message: string,
): Promise<CreateTransactionResponse | undefined> => {
  const wrappedMessage =
    "\x18Bitcoin Signed Message:\n" +
    String.fromCharCode(message.length) +
    message;
  const hash = createHash("sha256").update(wrappedMessage, "utf8").digest();
  const content = createHash("sha256").update(hash).digest("hex");
  //@ts-ignore
  transactionPayload.extraParameters.rawMessageData = {
    messages: [
      {
        content,
        bip44addressIndex: 0,
      },
    ],
  };
  transactionPayload.note = `BTC Message: ${message}`;
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    //@ts-ignore
    console.log(transactionPayload.extraParameters.rawMessageData);
    const txId = transactionResponse.data.id;
    if (!txId) {
      throw new Error("Transaction ID is undefined.");
    }
    txInfo = await getTxStatus(txId);
    console.log(JSON.stringify(txInfo, null, 2));
    const signature = txInfo.signedMessages[0].signature;

    console.log(JSON.stringify(signature));

    const encodedSig =
      Buffer.from([Number.parseInt(signature.v, 16) + 31]).toString("hex") +
      signature.fullSig;
    console.log(
      "Encoded Signature:",
      Buffer.from(encodedSig, "hex").toString("base64"),);
    return
  } catch (error) {
    console.error(error);
  }
};

rawSign("My message23");
```

```javascript theme={"system"}
import { createHash } from "crypto";
import * as fs from "fs"
import * as path from "path"
import { FireblocksSDK, PeerType, TransactionOperation, TransactionStatus } from "fireblocks-sdk";

const apiKey = "<YOUR_API_KEY>"
const apiSecretPath = "<PATH_TO_SECRET>"
const apiSecret = fs.readFileSync(path.resolve(__dirname, apiSecretPath), "utf8");
const fireblocks = new FireblocksSDK(apiSecret, apiKey);

async function signArbitraryMessage(fireblocks: FireblocksSDK, vaultAccountId: string, message: string, bip44addressIndex = 0) {
    const wrappedMessage = "\x18Bitcoin Signed Message:\n" +  String.fromCharCode(message.length) + message;

    const hash = createHash('sha256').update(wrappedMessage, 'utf8').digest();

    const content = createHash('sha256').update(hash).digest("hex");

    const { status, id } = await fireblocks.createTransaction({
        operation: TransactionOperation.RAW,
        assetId: "BTC",
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: vaultAccountId
        },
        note: `BTC Message: ${message}`,
        extraParameters: {
            rawMessageData: {
                messages: [{
                    content,
                    bip44addressIndex
                }]
            }
        }
    });

    let txInfo;
    let currentStatus = status;
  	while(currentStatus != TransactionStatus.COMPLETED && currentStatus != TransactionStatus.FAILED) {
        try {
            console.log("keep polling for tx " + id + "; status: " + currentStatus);
            txInfo = await fireblocks.getTransactionById(id);
            currentStatus = txInfo.status;
        } catch (err) {
            console.log("err", err);
        }
        await new Promise(r => setTimeout(r, 1000));
    };

    const signature = txInfo.signedMessages[0].signature;

    console.log(JSON.stringify(signature));

    const encodedSig = Buffer.from([signature.v + 31]).toString("hex") + signature.fullSig;
    console.log("Encoded Signature:", Buffer.from(encodedSig,"hex").toString("base64"));
}
 signArbitraryMessage(fireblocks, "0", "INSERT TEXT HERE");
```

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.base_path import BasePath
from fireblocks.models.transaction_request import TransactionRequest
from fireblocks.models.destination_transfer_peer_path import DestinationTransferPeerPath
from fireblocks.models.source_transfer_peer_path import SourceTransferPeerPath
from fireblocks.models.transfer_peer_path_type import TransferPeerPathType
from fireblocks.models.transaction_request_amount import TransactionRequestAmount
from pprint import pprint

# load the secret key content from a file
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

# build the configuration
configuration = ClientConfiguration(
        api_key="your_api_key",
        secret_key=secret_key_value,
        base_path=BasePath.Sandbox, # or set it directly to a string "https://sandbox-api.fireblocks.io/v1"
)

# Enter a context with an instance of the API client
with Fireblocks(configuration) as fireblocks:
    transaction_request: TransactionRequest = TransactionRequest(
        asset_id="BTC",
        amount=TransactionRequestAmount("0.1"),
        source=SourceTransferPeerPath(
            type=TransferPeerPathType.VAULT_ACCOUNT,
            id="0"
        ),
        destination=DestinationTransferPeerPath(
            type=TransferPeerPathType.VAULT_ACCOUNT,
            id="1"
        ),
        note="Your first transaction!"
    )
    # or you can use JSON approach:
    #
    # transaction_request: TransactionRequest = TransactionRequest.from_json(
    #     '{"note": "Your first transaction!", '
    #     '"assetId": "BTC", '
    #     '"source": {"type": "VAULT_ACCOUNT", "id": "0"}, '
    #     '"destination": {"type": "VAULT_ACCOUNT", "id": "1"}, '
    #     '"amount": "0.1"}'
    # )
    try:
        # Create a new transaction
        future = fireblocks.transactions.create_transaction(transaction_request=transaction_request)
        api_response = future.result()  # Wait for the response
        print("The response of TransactionsApi->create_transaction:\n")
        pprint(api_response)
        # to print just the data:                pprint(api_response.data)
        # to print just the data in json format: pprint(api_response.data.to_json())
    except Exception as e:
        print("Exception when calling TransactionsApi->create_transaction: %s\n" % e)
```

3. Start by creating a transaction of type **RAW**, shown under `operation` (JS) or by using `create_raw_transaction()` (PY).
4. Now, specify the source who is signing the message, which is the default vault (`Id 0`) in our case.

After sending the transaction for signing, wait for its completion so you can retrieve the signature.

The loop in the example above waits for the status of the transaction to be `COMPLETED`, or until an issue arises.

Once the transaction is complete, we print the full signature by accessing the transaction object `signedMessages`, then `signature`.
