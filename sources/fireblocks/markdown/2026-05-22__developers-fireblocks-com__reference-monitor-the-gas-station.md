> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Monitor the Gas Station

As your vault accounts get auto-fueled with gas assets transferred from the different Gas Station wallets, the level of each asset in your gas station is reduced and eventually requires additional funding.

* Check the asset balances in your Gas Station wallet regularly to ensure the wallet is funded properly. To add more funds, use the `fundGasStationWallet` function.
* Call the [Get an asset from an internal wallet endpoint](/api-reference/internal-wallets/get-an-asset-from-an-internal-wallet) to check your current Gas Station asset balances; for example, the code below retrieves the current ETH balance from the Gas Station wallet.

```javascript theme={"system"}
const getGasStationBalance = async (
  payload: ExternalWalletsApiGetExternalWalletAssetRequest,
): Promise<ExternalWalletAsset | undefined> => {
  try {
    const internalWalletAsset =
      await fireblocks.internalWallets.getInternalWalletAsset(payload);
    console.log(
      `Gas Station's ${payload.assetId} balance is: ${internalWalletAsset.data.balance}`,
    );
    return internalWalletAsset.data;
  } catch (e) {
    console.error(e);
  }
};

getGasStationBalance({
  walletId: "904c6da6-5aae-4280-bcb3-d0b1a36fc6e9", // update to your gas station internal wallet UUID
  assetId: "ETH", // update assetID
});
```

```javascript theme={"system"}
async function getGasStationBalance(walletId, assetId){
   const internalWalletAsset = await fireblocks.getInternalWalletAsset(walletId, assetId);
   console.log(JSON.stringify(internalWalletAsset.balance, null, 2));
}

getGasStationBalance("gasStationWalletUUID", "ETH");
```

```python theme={"system"}
def get_gas_station_balance(wallet_id: str, asset_id: str) -> str:
   print(fireblocks.get_internal_wallet_asset(wallet_id, asset_id)['balance'])

get_gas_station_balance("gas_station_wallet_uuid", "ETH")
```

* Monitor your transaction history for transactions that don't have enough gas to identify problems in this process. Learn more about [best practices for error handling with Fireblocks.](doc:error-handling)
