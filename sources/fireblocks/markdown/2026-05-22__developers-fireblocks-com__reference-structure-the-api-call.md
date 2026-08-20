> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Structure the API Call

## Structuring The Raw Signing request for Vaults

In your vaults, you can sign RAW messages via the [Create Transaction API endpoint](/reference/createtransaction) for a natively supported or unsupported asset.

1. To sign RAW messages for a natively supported asset, you need to use `assetId`and source account id under the payload. For your reference, please use the following code:

```javascript theme={"system"}
const res = await signer.createTransaction({
      assetId: 'BTC_TEST',
      note: 'raw signing test',
      source: {
        type: PeerType.VAULT_ACCOUNT,
        id: "vaultAccountId",
      },
      operation: TransactionOperation.RAW,
      extraParameters: {
        rawMessageData: {
          messages: [
            {
              content,
            },
          ],
        },
      },
    },
  );
```

2. To sign RAW messages for an unsupported asset, you need to use `derivationPath` and `algorithm` under the payload. For your reference, please use the following code:

```javascript theme={"system"}
const res = await signer.createTransaction(
  {
    note: "raw signing test",
    source: {
      type: PeerType.VAULT_ACCOUNT,
    },
    operation: TransactionOperation.RAW,
    extraParameters: {
      rawMessageData: {
        messages: [
          {
            content: "<your_content_to_sign>",
            bip44AddressIndex: 0, // Optional
            bip44change: 0, // Optional
            derivationPath: [44, 0, 0, 0, 0],
          },
        ],
        algorithm: "MPC_ECDSA_SECP256K1" / "MPC_EDDSA_ED25519",
      },
    },
  },
);
```

## Structuring The Raw Signing request for Embedded Wallets

In your embedded wallets, you can sign RAW messages via the [Create Transaction API endpoint](/reference/createtransaction) for a natively supported or unsupported asset.

1. To sign RAW messages for a natively supported asset, you need to use `assetId`and source account id under the payload. For your reference, please use the following code:

```javascript theme={"system"}
const res = await signer.createTransaction({
      assetId: 'BTC_TEST',
      note: 'raw signing test',
      source: {
        type: PeerType.END_USER_WALLET,
        walletId,
        id: "walletaccountId",
      },
      operation: TransactionOperation.RAW,
      extraParameters: {
        rawMessageData: {
          messages: [
            {
              content,
            },
          ],
        },
      },
    },{ ncw: { walletId } });
```

2. To sign RAW messages for an unsupported asset, you need to use `derivationPath` and `algorithm` under the payload. For your reference, please use the following code:

```javascript theme={"system"}
const res = await signer.createTransaction(
  {
    note: "raw signing test",
    source: {
      type: PeerType.END_USER_WALLET,
      walletId,
    },
    operation: TransactionOperation.RAW,
    extraParameters: {
      rawMessageData: {
        messages: [
          {
            content: "<your_content_to_sign>",
            derivationPath: [44, 0, 0, 0, 0],
          },
        ],
        algorithm: "MPC_ECDSA_SECP256K1" / "MPC_EDDSA_ED25519",
      },
    },
  },
  { ncw: { walletId } }
);
```

> **rawMessageData object:**
>
> [See here for more details](/reference/raw-signing-objects#rawmessagedata) on how to construct the`rawMessageData` object

> **About messages**
>
> You can aggregate a maximum of 127 messages for Raw Signing
