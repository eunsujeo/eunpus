> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Consolidate UTXOs

# Overview

If you regularly run operations on the Bitcoin blockchain, you will likely notice that the list of UTXOs in your wallets grows very quickly. This is especially common in situations where you have multiple addresses used to consolidate into an omnibus account or just as part of an ongoing operation. This can be a major problem for retail-facing operations.

A process utilized by most companies is "consolidating UTXOs", or creating a transaction that will take many small unspent UTXOs and turn them into a single bigger UTXO.

This is done by creating an "internal" transaction within your own vault account that takes the maximum amount of inputs (250) and turns them into a single output.

Although Bitcoin is the most popular UTXO blockchain, this limitation applies to Bitcoin Cash, Bitcoin SV, Dash, Litecoin, ZCash, and a maximum of 110 inputs for Cardano.

# Example

The logic to decide which unspent UTXOs to use can be as simple or complex as you wish, but in this example, we will use any small unspent UTXO that has received enough confirmations.

We have 3 steps in the process of consolidating UTXOs:

1. Retrieve the max spendable amount for a specific wallet.
2. This will result in an amount that considers up to 250 UTXOs within the wallet (by default, from smallest to biggest).
3. Create a transaction with the amount provided.

```javascript theme={"system"}
const getMaxSpendableAmount = async (
  assetId: string,
  vaultAccountId: string,
): Promise<GetMaxSpendableAmountResponse | undefined> => {
  try {
    const maxSpendableAmount = await fireblocks.vaults.getMaxSpendableAmount({
      vaultAccountId,
      assetId,
    });
    console.log(
      JSON.stringify(maxSpendableAmount.data.maxSpendableAmount, null, 2),
    );
    return maxSpendableAmount.data;
  } catch (error) {
    console.error(error);
  }
};

let transactionPayload = {};

const consolidateWallet = async (
  assetId: string,
  vaultAccountId: string,
  treasuryVault: string,
): Promise<CreateTransactionResponse | undefined> => {
  const amount = await getMaxSpendableAmount(assetId, vaultAccountId);
  transactionPayload = {
    assetId,
    amount: amount?.maxSpendableAmount,
    source: {
      type: TransferPeerPathType.VaultAccount,
      id: vaultAccountId,
    },
    destination: {
      type: TransferPeerPathType.VaultAccount,
      id: treasuryVault,
    },
  };
  console.log(JSON.stringify(transactionPayload, null, 2));
  try {
    const result = await fireblocks.transactions.createTransaction({
      transactionRequest: transactionPayload,
    });
    console.log(JSON.stringify(result.data, null, 2));
    return result.data;
  } catch (error) {
    console.error(error);
  }
};
getMaxSpendableAmount("BTC", "2");
consolidateWallet("BTC", "2", "0");
```

```javascript theme={"system"}
async function consolidate(vaultAccountId, assetId, treasuryVault){
    let amountToConsolidate = await fireblocks.getMaxSpendableAmount(vaultAccountId, assetId).maxSpendableAmount
    const payload = {
        assetId,
        amount: amountToConsolidate.maxSpendableAmount,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: vaultAccountId
        },
        destination: {
            type: PeerType.VAULT_ACCOUNT,
            id: treasuryVault
        },
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
 }
 consolidate("0", "BTC", "1");
```

```python theme={"system"}
from  fireblocks_sdk import TransferPeerPath, DestinationTransferPeerPath

def consolidate(vault_id: str, asset: str, treasury_id: str):
  amountToConsolidate = fireblocks.get_max_spendable_amount(vault_id, asset)["maxSpendableAmount"]

  fireblocks.create_transaction(
     asset_id=asset,
     amount=amountToConsolidate,
     source=TransferPeerPath(VAULT_ACCOUNT, vault_id),
     destination=DestinationTransferPeerPath(VAULT_ACCOUNT, treasury_id)
  )

 consolidate("0", "BTC", "1");
```

Retrieving the maximum spendable amount for consolidation is used through the getMaxSpendableAmount endpoint.

Do note you need the `vaultId` and `assetId`.

Once we create a transaction with the specified amount, Fireblocks automatically selects all of the inputs (smallest to biggest) to consolidate. You can [contact Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new) in order to change the default consolidation selection method and reverse it to a selection going from largest to smallest.

> **UTXO consolidation to source**
>
> You can send a transaction to yourself, thus just consolidating the UTXOs without sending them outwards.
