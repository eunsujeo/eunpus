> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a Staking Position

1. [Approve the terms of service](/reference/approvetermsofservicebyproviderid) of your desired staking provider (Kiln or Figment):

```javascript theme={"system"}
const FireblocksSDK = require("fireblocks-sdk").FireblocksSDK;
const fireblocks = new FireblocksSDK(privateKey, apiKey);

const approveRequest = await fireblocks.approveStakingProviderTermsOfService("kiln");
```

2. [Create your staking position](/reference/stake) :

```javascript theme={"system"}
const stakeRequest = await fireblocks.executeStakingStake(
  "SOL",{
		vaultAccountId:"1",
		providerId:"kiln",
		stakeAmount:"100",
		txNote:"stake 100 SOL from vaultId 1, 24 Jan 2024"
  }
);
```

**Important:**
The response object from the staking action includes an ID that serves as the unique identifier for the staking position.
It's essential to save this ID for future reference. If you lose this ID, you can retrieve all the IDs from the staking position in your workspace by using the `fireblocks.getStakingPositions()` function.

## Monitor and sign the staking request

[Find the relevant transaction](/reference/getdelegationbyid) - After creating the staking position, find the new transaction ID using `getStakingPosition(id)`. The transaction ID can be found under `responseBody.relatedTransactions[0].txId`:

```javascript theme={"system"}
const positionId = stakeRequest.id
const position = await fireblocks.getStakingPosition(positionId);

// When creating a new staking position, there is only 1 transaction
const txId = position.relatedTransactions[0].txId

// ... sign it
```

To sign the transaction, please follow the necessary steps outlined. Learn more about the [transaction signing request and approval process](https://support.fireblocks.io/hc/en-us/articles/12006018592156-API-Co-Signer-Overview) .

Once the stake position is created, you can monitor the position status and available actions, such as unstaking or withdrawing, using `getPosition(positionId)`.
