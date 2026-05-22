> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transfer NFTs

Fireblocks enables you to transfer your NFTs using both the API and the Console. To transfer tokens through the Console, simply click the "Withdraw" button in the NFT view.

For clients wishing to use the API to move their NFTs out of their Fireblocks vault accounts or between their vault accounts, they can do so by calling the Fireblocks Create Transaction API - [POST /v1/transactions](/api-reference/transactions/create-a-new-transaction)

# Using the API

Here is a code example for transferring your NFTs from your Fireblocks Vault using the Fireblocks TS SDK:

> **Constant Parameters:**
>
> Please note that the `amount` value for any NFT transfer is always '1'

```javascript theme={"system"}
import { TransferPeerPathType } from "@fireblocks/ts-sdk";

const transferNFT = async (
  sourceId: string,
  destType: TransferPeerPathType,
  destId: string,
  assetId: string
) => {
  try {
    const txId = await fireblocks.transactions.createTransaction({
      transactionRequest: {
        assetId,
        source: {
          type: TransferPeerPathType.VaultAccount,
          id: sourceId,
        },
        destination: {
          type: destType,
          id: destId,
        },
        amount: "1",
      },
    });

    console.log(txId.data);
  } catch (e) {
    console.error(e);
  }
};

transferNFT("0", TransferPeerPathType.VaultAccount, "1", "NFT-6a94587325e091b15f4a52159a51d4476b5bdc7b");
```
