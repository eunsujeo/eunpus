> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# How to Use Fireblocks TypeScript SDK with Travel Rule Messages

The legacy Fireblocks JS SDK already includes PII encryption, whereas the new Fireblocks TS SDK does not. Therefore, you need to implement a manual install to add the PII encryption to use Fireblocks TypeScript SDK with Travel Rule Messages. For details, please follow the steps below:

***

## Step 1: Install the SDK

* Run `yarn add @fireblocks/ts-sdk`or `npm install @fireblocks/ts-sdk`

## Step 2: Implement Notabene PII Encryption

Since the new TypeScript SDK does not include PII encryption, users must manually encrypt PII data before sending the request. The example below is using @notabene/pii-sdk:

```typescript theme={"system"}
import PIIsdk, { PIIEncryptionMethod } from "@notabene/pii-sdk";

const piiEncryption = new PIIsdk({
  piiURL: "[https://pii.notabene.dev"](https://pii.notabene.dev"),
  audience: "[https://pii.notabene.dev"](https://pii.notabene.dev"),
  clientId: process.env.NOTABENE\_CLIENT\_ID,
  clientSecret: process.env.NOTABENE\_CLIENT\_SECRET,
  authURL: "[https://auth.notabene.id/oauth/token"](https://auth.notabene.id/oauth/token"),
});

// Encrypt the PII data
async encode(
    travelRuleMessage: TravelRuleCreateTransactionRequest,
    travelRuleEncryptionOptions?: TravelRuleEncryptionOptions,
  ): Promise<TravelRule> {
    // If there's no "pii" field, default to originator & beneficiary
    const pii = travelRuleMessage.pii || {
      originator: travelRuleMessage.originator,
      beneficiary: travelRuleMessage.beneficiary,
    };
const jsonDidKey = this.configService.config.notabene.jsonDIDKey;
const counterpartyDIDKey =
  travelRuleEncryptionOptions?.beneficiaryPIIDidKey;

let piiIvms = await this.toolset.generatePIIField({
    pii,
    originatorVASPdid: travelRuleMessage.originatorVASPdid,
    beneficiaryVASPdid: travelRuleMessage.beneficiaryVASPdid,
    counterpartyDIDKey,
    keypair: JSON.parse(jsonDidKey),
    senderDIDKey: JSON.parse(jsonDidKey).did,
    encryptionMethod: travelRuleEncryptionOptions?.sendToProvider
      ? PIIEncryptionMethod.HYBRID
      : PIIEncryptionMethod.END_2_END,
  });
travelRuleMessage.beneficiary = piiIvms.beneficiary;
travelRuleMessage.originator = piiIvms.originator;
return travelRuleMessage;
}
```

## Step 3: Send a Fireblocks Transaction with the Travel Rule Message

Once PII data is encrypted, users can pass it into the Fireblocks TypeScript SDK when creating a blockchain transaction.

```javascript theme={"system"}
import { FireblocksSDK, PeerType, TransactionArguments, TravelRuleCreateTransactionRequest } from "@fireblocks/ts-sdk";

// Initialize Fireblocks SDK
const fireblocks = new FireblocksSDK(
  process.env.FIREBLOCKS_API_SECRET_KEY,
  process.env.FIREBLOCKS_API_KEY,
  process.env.FIREBLOCKS_API_URL
);

// Construct the transaction request
const transaction: TransactionArguments = {
  assetId: "ETH_TEST",
  source: {
    type: PeerType.VAULT_ACCOUNT,
    id: "1",
  },
  destination: {
    type: PeerType.ONE_TIME_ADDRESS,
    oneTimeAddress: {
      address: "0x123456789abcdef123456789abcdef123456789a",
    },
  },
  operation: "TRANSFER",
  amount: "0.5",
  note: "Travel Rule Test TX",
  travelRuleMessage: TravelRuleCreateTransactionRequest, // Pass the encrypted Travel Rule message here
};
// Send the transaction request
const result = await fireblocks.createTransaction(transaction);
console.log("Transaction Created:", result);
```
