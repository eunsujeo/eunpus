> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Estimate Transaction Fee

> **Learn more about Fee Management in Fireblocks in [the following guide](/docs/verify-fee-effeciency)**

# Overview

Ethereum (ETH) fees, also referred to as "gas price" or "gas fees," are calculated based on the amount of network activity and the network resources required. Fireblocks allows you to set the fee when creating a new transaction. You can either use a **custom fee** to set the amount used manually, or you can have Fireblocks estimate the fee by default.

You can estimate network gas fees using the Fireblocks API:

* Estimate a tentative fee for low, medium, or high rates by making a request to [Estimate the required fee for an asset.](/reference/estimatenetworkfee)
* Estimate a specific fee based on your transaction's parameters by making a request to [Estimate the transaction fee.](/reference/estimatetransactionfee)

> **Fee levels determine transaction speed**
>
> The fee rate dictates the speed at which your transaction will be picked up and confirmed by the blockchain. When setting a tentative fee rate, the fee amount is an estimate only. Gas fee calculation is not finalized until your transaction is signed.

> **Using custom fee**
>
> Using the custom fee option can be complex as it offers different parameters, similar to stock trading, that allow you to set options like:
>
> * **Maximum priority fee** - Transaction time takes priority over gas fee price.
> * **Max fee** - The gas fee max price is preset and takes priority over transaction time.
>
> [Learn more about the current Ethereum Network EIP-1559 standard for fee estimation.](https://support.fireblocks.io/hc/en-us/articles/4403728014994-London-Fork-and-EIP-1559)

***

# Estimated network fee

> **Response Caching:**
>
> The network fee response is cached for 30 seconds on the Fireblocks side. Customers should consider this interval when using this endpoint, as querying it more frequently than every 30 seconds will not provide additional value.

You'll see the tentative fee estimation in your fee values before creating your transaction data. This example shows how the estimated network fee is returned by the `getFeeForAsset` SDK function for the ETH asset. A high `priorityFee` estimation is used here to create a transaction sending 0.001 from vault ID `0` to vault ID `1`.

The fee level can be either `LOW` / `MEDIUM` / `HIGH`. It will be `MEDIUM` by default.

* **Note**: You are required to specify the `maxFee`when using `priorityFee`.

```javascript theme={"system"}
const createTxWithNetworkFee = async (
  payload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const fee = await fireblocks.transactions.estimateNetworkFee({
      assetId: payload.assetId as string,
    });
    console.log(
      JSON.stringify(
        `Priority fee for the Tx is: ${fee.data.high.priorityFee}`,
      ),
    );
    payload.priorityFee = fee.data.high.priorityFee;
    payload.maxFee = "120";
    const result = await fireblocks.transactions.createTransaction({
      transactionRequest: payload,
    });
    console.log(JSON.stringify(result.data, null, 2));
    return result.data;
  } catch (error: any) {
    console.error(error);
  }
};

createTxWithNetworkFee({
  assetId: "ETH",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  destination: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  amount: 0.01,
});
```

```javascript theme={"system"}
async function createTransactionWithNetworkFee(assetId, amount, sourceId, destId){
    const fee = await getFee(assetId)
    console.log(JSON.stringify("Priority Fee for Transaction is: " + fee.high.priorityFee, null, 2));

    const payload = {
        assetId,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: sourceId
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
            id: destId
        },
        amount,
        priorityFee: fee.high.priorityFee,
        maxFee: "120"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransactionWithNetworkFee("ETH", "0.001", "0", "1");
```

```python theme={"system"}
def create_transaction_with_network_fee(asset_id: str, amount: str, source_id: str, dest_id: str):
    fee = fireblocks.get_fee_for_asset(asset_id=asset_id)
    print("Priority Fee for Transaction is:", fee["high"]["priorityFee"])
    result = fireblocks.create_transaction(
        asset_id=asset_id,
        source=TransferPeerPath(
            peer_type=VAULT_ACCOUNT,
            peer_id=source_id
        ),
        destination=DestinationTransferPeerPath(
            peer_type=VAULT_ACCOUNT,
            peer_id=dest_id
        ),
        amount=amount,
        priority_fee=fee["high"]["priorityFee"],
        max_fee="120"
    )

    print(result)

create_transaction_with_network_fee("ETH", "0.001", "0", "1")
```

***

# Estimate transaction fee

You'll see the `feeLevel` parameter value inside your transaction data based on the fee level selection from the `estimateFeeForTransaction` SDK function.

This example shows how the estimated network fee is returned by the `getFeeForAsset` SDK function for the ETH asset. A high `priorityFee` estimation is used here to create a transaction sending 0.001 from vault ID `0` to vault ID `1`:

```javascript theme={"system"}
const getTxFee = async (
  payload: TransactionRequest,
): Promise<EstimatedTransactionFeeResponse | undefined> => {
  try {
    const txFee = await fireblocks.transactions.estimateTransactionFee({
      transactionRequest: payload,
    });
    return txFee.data;
  } catch (error: any) {
    console.error(error);
  }
};

// The function should include the logic that will determine the fee level used
// it should be based on the threshold relevant for your use-case
// The logic options are HIGH/LOW as MEDIUM is the default when feeLevel is null

const getFeeLevelToUse = (
  feeEstimation: EstimatedTransactionFeeResponse,
): TransactionRequestFeeLevelEnum | undefined => {
  let feeLevelToUse: TransactionRequestFeeLevelEnum | undefined;
  if ("<ADD_YOUR_LOGIC_HERE>") {
    feeLevelToUse = TransactionRequestFeeLevelEnum.High;
  } else if ("<ADD_MORE_LOGIC_HERE>") {
    feeLevelToUse = TransactionRequestFeeLevelEnum.Low;
  }
  return feeLevelToUse;
};

const createTxWithFeeEstimation = async (
  payload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const txFee = (await getTxFee(payload)) as EstimatedTransactionFeeResponse;
    const feeLevel = getFeeLevelToUse(txFee);
    payload.feeLevel = feeLevel as TransactionRequestFeeLevelEnum;
    const result = await fireblocks.transactions.createTransaction({
      transactionRequest: payload,
    });
    console.log(JSON.stringify(result.data, null, 2));
    return result.data;
  } catch (error: any) {
    console.error(error);
  }
};

createTxWithFeeEstimation({
  assetId: "ETH",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0",
  },
  destination: {
    type: TransferPeerPathType.VaultAccount,
    id: "1",
  },
  amount: 0.01,
});
```

```javascript theme={"system"}
async function getTxFee(payload){
    const getTxFee = await fireblocks.estimateFeeForTransaction(payload);
    return getTxFee;
}

// the function should include the logic that will determine the fee level used
// it should be based on the threshold relevant for your use-case
// The logic options are HIGH/LOW as MEDIUM is the default when feeLevel is null
function logicForWhatFeeLevelToUse(feeEstimation){
    if(... <= myThreshold){
        feeLevelToUse = FeeLevel.HIGH
    }
    else if(.....){
        feeLevelToUse = FeeLevel.LOW
    }
    return feeLevelToUse;
}

async function createTransaction(assetId, amount, sourceId, destId){
    var feeLevel;

    const payload = {
        assetId,
        amount,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: sourceId
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
            id: destId
        },
        feeLevel
    };
    payload.feeLevel = logicForWhatFeeLevelToUse(getTxFee(payload));
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
}
createTransaction("ETH", "0.001", "0", "1");
```

```python theme={"system"}
def create_transaction(asset_id: str, amount: str, source_id: str, dest_id: str):
    fee_level = ""

    payload = {
        "asset_id": asset_id,
        "amount": amount,
        "source": TransferPeerPath(
            peer_type=VAULT_ACCOUNT,
            peer_id=source_id
        ),
        "destination": DestinationTransferPeerPath(
            peer_type=VAULT_ACCOUNT,
            peer_id=dest_id
        ),
        "fee_level": fee_level
    }

    try:
        payload["fee_level"] = logic_for_what_fee_level_to_use(fireblocks.estimate_fee_for_transaction(**payload))
        result = fireblocks.create_transaction(**payload)
        print(result)
    except Exception as e:
        print("Error:", e)
```
