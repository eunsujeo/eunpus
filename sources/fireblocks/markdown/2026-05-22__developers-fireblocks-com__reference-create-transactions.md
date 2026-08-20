> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Transactions

# Overview

Every transaction on the Fireblocks platform is initiated using the [Create a new transaction](/reference/createtransaction) API endpoint. Its default operation type is `TRANSFER`. However, other important operations are available as valid values for the `operation` body parameter:

* **TRANSFER:** Transfers funds from one account to another. UTXO blockchains allow multi-input and multi-output transfers. All other blockchains allow transfers with one source address and one destination address.
* **CONTRACT\_CALL:** Calls a smart contract method for Web3 operations on any EVM blockchain.
* **PROGRAM\_CALL:** Calls programs for Web3 operations on the Solana blockchain. Learn more [here](/reference/interact-with-solana-programs#/).
* **TYPED\_MESSAGE:** An off-chain message in either [Ethereum Personal Message](https://geth.ethereum.org/docs/rpc/ns-personal#personal_sign) or EIP-712 format. Used to sign specific readable messages that are not actual transactions.
* **RAW:** An off-chain message with no predefined format. Used to sign any message with your private key, including protocols such as blockchains and custom transaction types not natively supported by Fireblocks.
* **MINT:** Perform a mint operation to increase the supply of a token. Supported for Stellar, Ripple, and EVM-based blockchains.
* **BURN:** Perform a burn operation to reduce the supply of a token. Supported for Stellar, Ripple, and EVM-based blockchains.

The API call serves all possible source and destination combinations, including a one-time address destination (OTA), vault account, pre-whitelisted internal wallet, external wallet & contract wallet, Fireblocks Network connections and any connected exchange account and fiat account.

> **Optional parameters for assets & operations**
>
> Although there are required parameters for the [Create a new transaction](/reference/createtransaction) API call, you can pass other optional body parameters depending on the asset or the required operation.
>
> The endpoint also accepts the addition of the `extraParameters` object, used to describe additional details required for raw message signing, contract calls, and specific UTXO selections.
>
> [Learn how the `extraParameters` object works in transaction responses.](/reference/transaction-objects)

# Your first transaction

## Vault account to vault account transaction

To start, initiate a transaction from one Fireblocks vault account to another. Account-based assets allow single-destination transfers, and UTXO assets allow multi-destination transfers.

### Single destination transfer (ETH)

The example transfers 0.001 amount of ETH from vault account ID `0` to vault account ID `1`.

```javascript theme={"system"}
const transactionPayload = {
  assetId: "ETH",
  amount: "0.001",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  destination: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  note: "Your first transaction!",
};

const createTransaction = async (
  transactionPayload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    console.log(JSON.stringify(transactionResponse.data, null, 2));
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};

createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, destId){
    let payload = {
        assetId,
        amount,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: String(srcId)
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
            id: String(destId)
        },
        note: "Your first transaction!"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("ETH", "0.001", "0", "1");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, dest_id):
   tx_result = fireblocks.create_transaction(
       asset_id=asset_id,
       amount=amount,
       source=TransferPeerPath(VAULT_ACCOUNT, src_id),
       destination=DestinationTransferPeerPath(VAULT_ACCOUNT, dest_id),
       note="Your first transaction!"
   )
   print(tx_result)

create_transaction("ETH", "0.001", "0", "1")
```

### Multiple-destination transfer

Transfer 0.001 BTC from the first vault account (`"1"`), by sending 0.0005 BTC to the second vault account (using `id: "2"`) and 0.0005 BTC to the third vault account (`id: "3"`) as destinations.

```javascript theme={"system"}
const transactionPayload = {
  assetId: "BTC",
  amount: "0.001",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  destinations: [
    {
      amount: "0.0005",
      destination: {
        type: TransferPeerPathType.VaultAccount,
        id: "2",
      },
    },
    {
      amount: "0.0005",
      destination: {
        type: TransferPeerPathType.VaultAccount,
        id: "3",
      },
    },
  ],
  note: "Your first multiple destination transaction!",
};

const createTransaction = async (
  transactionPayload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    console.log(JSON.stringify(transactionResponse.data, null, 2));
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId){
    let payload = {
        assetId,
        amount,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: String(srcId)
        },
        destinations: [
            {amount: "0.0005", destination: {type: PeerType.VAULT_ACCOUNT, id: "2"}},
            {amount: "0.0005", destination: {type: PeerType.VAULT_ACCOUNT, id: "3"}}
        ],
        note: "Your first multiple destination transaction!"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("BTC", "0.001", "1");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destinations=[
            TransactionDestination("0.0005", DestinationTransferPeerPath(VAULT_ACCOUNT, "2")),
            TransactionDestination("0.0005", DestinationTransferPeerPath(VAULT_ACCOUNT, "3"))

        ],
        note="Your first multiple destination transaction!"
    )
    print(tx_result)

create_transaction("BTC", "0.001", "1")
```

## Vault account to one-time address transaction

Transfer 0.01 ETH between the vault account (`"1"`) to a specific one-time blockchain address.

```javascript theme={"system"}
const transactionPayload = {
  assetId: "ETH",
  amount: "0.001",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  destination: {
    type: TransferPeerPathType.OneTimeAddress,
    oneTimeAddress: {
      address: "0x13277a70e3F48EEAD9C8a8bab12EbEDbC3DB6446",
    },
  },
  note: "Your first OTA transaction!",
};

const createTransaction = async (
  transactionPayload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    console.log(JSON.stringify(transactionResponse.data, null, 2));
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, address){
    let payload = {
        assetId,
        amount,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: String(srcId)
        },
        destination: {
            type: PeerType.ONE_TIME_ADDRESS,
            oneTimeAddress: {
                address: String(address)
            }
        },
        note: "Your first OTA transaction!"
    };
   const result = await fireblocks.createTransaction(payload);
   console.log(JSON.stringify(result, null, 2));
}
createTransaction("ETH", "0.001", "1", "0x13277a70e3F48EEAD9C8a8bab12EbEDbC3DB6446");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, address):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destination=DestinationTransferPeerPath(ONE_TIME_ADDRESS, None, {"address": address}),
        note="Your first OTA transaction!"
    )
    print(tx_result)

create_transaction("ETH", "0.001", "1", "0x13277a70e3F48EEAD9C8a8bab12EbEDbC3DB6446")
```

> **API idempotency for transactions**
>
> The best practice for creating transactions is to use the `externalTxId` parameter as seen in the [Optional parameters section.](doc:creating-a-transaction#optional-parameters)

## Contract Call Transaction

```javascript theme={"system"}
import { readFileSync } from 'fs';
import {
  Fireblocks,
  BasePath,
  TransactionOperation,
  TransferPeerPathType
} from "@fireblocks/ts-sdk";

// Initialize a Fireblocks API instance with local variables
const FIREBLOCKS_API_SECRET_PATH = "<PATH_TO_YOUR_SECRET>";
const fireblocks = new Fireblocks({
    apiKey: "<API_KEY>",
    basePath: BasePath.US,
    secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, "utf8"),
});

(async() => {

  const contractAddress = "0x43506849D7C04F9138D1A2050bbF3A0c054402dd" // USDC contract address
  const contractCallData = "0x095ea7b3000000000000000000000000d09971d8ed6c6a5e57581e90d593ee5b94e348d4ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" // calling the approve function with some example params

  try{

    const contractCallTransaction = await fireblocks.transactions.createTransaction({
      transactionRequest: {
        operation: TransactionOperation.ContractCall,
        assetId: "ETH",
        source: {
          type: TransferPeerPathType.VaultAccount,
          id: "0"
        },
        destination: {
          type: TransferPeerPathType.OneTimeAddress,
          oneTimeAddress: {
            address: contractAddress
          }
        },
        amount: "0",
        extraParameters: {
          contractCallData
        }
      }
    })

    console.log(JSON.stringify(contractCallTransaction, null, 2))
  } catch(e){
    console.log(e)
  }
})();
```

***

# Optional parameters

Some blockchains have different technicalities when building transactions, handled using optional parameters.

## externalTxId

A *critical* practice to avoid processing multiple identical POST transaction requests more than once is to use the `externalTxId` parameter in the [Create a new transaction](/reference/createtransaction) API call.

The `externalTxId` value is an internal identifier of the transaction that you create and manage on your end.

This value is securely stored in the Fireblocks system, and additional transaction requests with the same `externalTxId` value are not processed on our system. The `externalTxId` is limited to a maximum of 255 characters.

```javascript theme={"system"}
const transactionPayload = {
  assetId: "ETH",
  amount: "0.001",
  externalTxId: "UniqueIdentifier", // the unique identifier of the transaction outside of Fireblocks
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  destination: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  note: "Your first transaction!",
};

const createTransaction = async (
  transactionPayload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    console.log(JSON.stringify(transactionResponse.data, null, 2));
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, destId, externalTxId){
    let payload = {
        assetId,
        amount,
        externalTxId, // the unique identifier of the transaction outside of Fireblocks
        source: {
            type: PeerType.VAULT_ACCOUNT,
         		id: String(srcId)
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
        		id: String(destId)
        },
        note: "Your first transaction identified by an external ID"
    };
		const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("ETH", "0.001", "0", "1", "uniqueTXid");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, dest_id, external_tx_id):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        external_tx_id=external_tx_id, # the unique identifier of the transaction outside of Fireblocks
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destination=DestinationTransferPeerPath(VAULT_ACCOUNT, dest_id),
        note="Your first transaction identified by an external ID"
    )
    print(tx_result)

create_transaction("ETH", "0.001", "0", "1", "uniqueTXid")
```

## treatAsGrossAmount

The value is`false` by default. If it is set to `true`, the network fee is deducted from the requested amount.

> **Note**
>
> If you send the entire vault account balance without the treatAsGrossAmount field, then the transaction amount will be treated as a gross amount.

```javascript theme={"system"}
const transactionPayload = {
	assetId: "ETH",
	amount: "0.001",
	treatAsGrossAmount: true, // true or false (by default - false)
	source: {
		type: TransferPeerPathType.VaultAccount,
		id: "0",
	},
	destination: {
		type: TransferPeerPathType.VaultAccount,
		id: "1",
	},
	note: "Your first treat as gross transaction!"
}

const createTransaction = async (
	transactionPayload:TransactionRequest
):Promise<CreateTransactionResponse | undefined > => {
	try {
		const transactionResponse = await fireblocks.transactions.createTransaction(
			{
				transactionRequest:transactionPayload
			}
		);
		console.log(JSON.stringify(transactionResponse.data, null, 2));
		return transactionResponse.data;
	}
	catch(error){
		console.error(error);
	}
}
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, destId){
    let payload = {
       assetId,
       amount,
       treatAsGrossAmount: true, // true / false (by default)
       source: {
           type: PeerType.VAULT_ACCOUNT,
           id: String(srcId)
       },
       destination: {
           type: PeerType.VAULT_ACCOUNT,
           id: String(destId)
       },
       note: "Your first treat as gross transaction!"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("ETH", "0.001", "0", "1");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, dest_id):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        treat_as_gross_amount=True, # true / false (by default)
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destination=DestinationTransferPeerPath(VAULT_ACCOUNT, dest_id),
     note: "Your first treat as gross transaction!"
    )
    print(tx_result)

create_transaction("ETH", "0.001", "0", "1")
```

## fee

For UTXO-based assets, `fee` refers to the fee per byte in the asset's smallest unit (Satoshi, Latoshi, etc).

```javascript theme={"system"}
const transactionPayload = {
	assetId: "BTC",
	amount: "0.001",
	fee: "15", // Satoshi per Byte
	source: {
		type: TransferPeerPathType.VaultAccount,
		id: "0",
	},
	destination: {
		type: TransferPeerPathType.VaultAccount,
		id: "1",
	},
	note: "Your first high fee transaction!"
}

const createTransaction = async (
	transactionPayload:TransactionRequest
):Promise<CreateTransactionResponse | undefined > => {
	try {
		const transactionResponse = await fireblocks.transactions.createTransaction(
			{
				transactionRequest:transactionPayload
			}
		);
		console.log(JSON.stringify(transactionResponse.data, null, 2));
		return transactionResponse.data;
	}
	catch(error){
		console.error(error);
	}
}
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, destId, fee){
    let payload = {
        assetId,
        amount,
        fee, //Satoshi per Byte
        source: {
            type: PeerType.VAULT_ACCOUNT,
         		id: String(srcId)
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
        		id: String(destId)
        },
        note: "Your first high fee transaction!"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("BTC", "0.001", "0", "1", "15");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, dest_id, fee):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        fee=fee, #Satoshi per Byte
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destination=DestinationTransferPeerPath(VAULT_ACCOUNT, dest_id),
        note="Your first high fee transaction!"
    )
    print(tx_result)

create_transaction("BTC", "0.001", "0", "1", "15")
```

## feeLevel

Defines the blockchain fee level that will be paid for the transaction (only for Ethereum, Solana, and UTXO-based blockchains). Set to `MEDIUM` by default. Valid values are `LOW` `MEDIUM` & `HIGH`.

```javascript theme={"system"}
const transactionPayload = {
  assetId: "ETH",
  amount: "0.001",
  feeLevel: TransactionRequestFeeLevelEnum.High, // Low / Medium / High
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  destination: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  note: "Your first high fee level transaction!",
};

const createTransaction = async (
  transactionPayload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    console.log(JSON.stringify(transactionResponse.data, null, 2));
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, destId, feeLevel){
    let payload = {
        assetId,
        amount,
        feeLevel, // LOW / MEDIUM / HIGH
        source: {
            type: PeerType.VAULT_ACCOUNT,
         		id: String(srcId)
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
        		id: String(destId)
        },
        note: "Your first high fee level transaction!"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("BTC", "0.001", "0", "1", "HIGH");
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, dest_id, fee_level):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        fee_level=fee_level, # LOW / MEDIUM / HIGH
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destination=DestinationTransferPeerPath(VAULT_ACCOUNT, dest_id),
        note="Your first high fee level transaction!"
    )
    print(tx_result)

create_transaction("BTC", "0.001", "0", "1", "HIGH")
```

## failOnLowFee

Set to`false` by default. If set to `true`, and the `feeLevel` (value: `MEDIUM`) is higher than the acceptable amount specified in the transaction, the transaction will fail, to avoid getting stuck with 0 confirmations.

```javascript theme={"system"}
const transactionPayload = {
  assetId: "ETH",
  amount: "0.001",
  failOnLowFee: true, // true / false (default - false)
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  destination: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  note: "Your first failOnLowFee transaction",
};

const createTransaction = async (
  transactionPayload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    console.log(JSON.stringify(transactionResponse.data, null, 2));
    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};
createTransaction(transactionPayload);
```

```javascript theme={"system"}
async function createTransaction(assetId, amount, srcId, destId, failOnLowFee){
    let payload = {
        assetId,
        amount,
        failOnLowFee, // true / false (default)
        source: {
            type: PeerType.VAULT_ACCOUNT,
         		id: String(srcId)
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
        		id: String(destId)
        },
        note: "Your first failOnLowFee transaction"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("BTC", "0.001", "0", "1", true);
```

```python theme={"system"}
def create_transaction(asset_id, amount, src_id, dest_id, fail_on_low_fee):
    tx_result = fireblocks.create_transaction(
        asset_id=asset_id,
        amount=amount,
        fail_on_low_fee=fail_on_low_fee, # True / False (by default)
        source=TransferPeerPath(VAULT_ACCOUNT, src_id),
        destination=DestinationTransferPeerPath(VAULT_ACCOUNT, dest_id),
        note="Your first failOnLowFee transaction"
    )
    print(tx_result)

create_transaction("BTC", "0.001", "0", "1", True)
```
