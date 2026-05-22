> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Fund the Gas Station

# Overview

Maintaining funds for the Gas Station is critical to avoid business interruptions. Transactions made from wallets with insufficient gas will continuously fail until you add more funds.

Ensure proper funding by depositing the appropriate base assets into the Gas Station wallet. The Gas Station will then use these assets to refuel your monitored vault accounts with gas for their outbound transactions.

***

# Funding with the API

1. Call the [List internal wallets endpoint](/api-reference/internal-wallets/list-internal-wallets) to find the Gas Station's wallet ID.
2. Call the [Create a new transaction endpoint](/api-reference/transactions/create-a-new-transaction), enter **INTERNAL\_WALLET** in the destination object's **type** field and the Gas Station's wallet ID in the **walletId** field, and then enter the appropriate base asset (as [defined in Fireblocks](/api-reference/blockchains-&-assets/list-assets-legacy)) in the **assetId** field.

The example below funds the Gas Station wallet with ETH based on its `gasStationWalletUUID`, in the value of 0.1 ETH transferred from vault account ID 0.

```javascript theme={"system"}
const fundGasStationWallet = async (
  payload: TransactionRequest,
): Promise<CreateTransactionResponse | undefined> => {
  try {
    const result = await fireblocks.transactions.createTransaction({
      transactionRequest: payload,
    });
    console.log(JSON.stringify(result, null, 2));
    return result.data;
  } catch (e) {
    console.error(e);
  }
};

fundGasStationWallet({
  assetId: "ETH", //update the assetID
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "1", // update to your funding vault account ID
  },
  destination: {
    type: TransferPeerPathType.InternalWallet,
    id: "904c6da6-5aae-4280-bcb3-d0b1a36fc6e9", //update to your Gas Station internal Wallet UUID
  },
  amount: 0.5,
  note: "Gas Station Internal Wallet Funding",
});
```

```javascript theme={"system"}
async function fundGasStationWallet(assetId, gasStationWalletUUID, fillAmount, fundingVaultId){
    const payload = {
        assetId: assetId,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: fundingVaultId
        },
        destination: {
            type: PeerType.INTERNAL_WALLET,
            id: gasStationWalletUUID
        },
        amount: fillAmount,
        note: "Gas Station Funding"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
 }
 fundGasStationWallet("ETH", "gasStationWalletUUID" ,"0.1","0");
```

```python theme={"system"}
def fund_gas_station(asset_id: str, gas_station_wallet_uuid: str, fill_amount: str,funding_vault_id: str):
    tx_id = fireblocks.create_transaction(asset_id=asset_id,
                                  				amount=fill_amount,
				                                  source=TransferPeerPath("VAULT_ACCOUNT", funding_vault_id),
        				                          destination=DestinationTransferPeerPath("INTERNAL_WALLET",gas_station_wallet_uuid)
                				                 )
    print(tx_id)

fund_gas_station("ETH","gasStationWalletUUID", "0.1","0")
```
