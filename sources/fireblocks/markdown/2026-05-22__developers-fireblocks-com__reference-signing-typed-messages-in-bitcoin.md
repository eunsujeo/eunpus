> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Sign Typed Messages in Bitcoin

Bitcoin typed message signing, commonly referred to as "Bitcoin personal message signing," is a way for users to prove ownership of a Bitcoin address by signing a message with the private key associated with that address.

This functionality is widely used in the Bitcoin ecosystem to verify ownership without requiring a transaction or revealing the private key. Here's a detailed breakdown of the process, including the structure of the message to sign, the prefix used, and the structure of the signature.

When signing a message in Bitcoin, the user typically inputs a plain text message.

The actual message that gets signed, however, includes a standard prefix to prevent certain types of attacks and to distinguish these personal messages from other types of data that might be signed with Bitcoin keys (like transactions).
The prefix used is not part of the message itself but is added to the message during the signing process to create a complete hash that will be signed. The standard prefix is: `"\x18Bitcoin Signed Message:\n"`

## Process of Signing a Message

* **Concatenation:** The actual text that gets signed is a concatenation of the prefix and the message. Specifically, it's the prefix followed by the length of the message (as a single byte or varint) and then the message itself.
* **Hashing:** Before signing, the concatenated string is hashed twice using SHA-256 (SHA-256d). This double hashing is a common practice in Bitcoin for added security.
* **Signing:** The double `SHA-256` hash of the message is then signed using the private key associated with the Bitcoin address. This signing is done according to the ECDSA (Elliptic Curve Digital Signature Algorithm) standard used in Bitcoin.

***

## Bitcoin Typed Message Signing in Fireblocks:

Below is a TypeScript SDK code example on how to execute Typed Message Signing (Personal Message) in Bitcoin.
In this example we are specifically showing how to sign a [TRUST platform](https://www.coinbase.com/blog/introducing-the-travel-rule-universal-solution-technology-trust) compatible message:

```javascript theme={"system"}
const transactionPayload = {
  operation: TransactionOperation.TypedMessage,
  assetId: "BTC",
  source: {
    type: TransferPeerPathType.VaultAccount,
    id: "0", // The vault account ID represnting the address used to sign
  },
  note: "Bitcoin Message",
  extraParameters: {
    rawMessageData: {
      messages: [
        {
          content: "", // Content remains blank and is replaced by the message built when signing the TX
          type: "BTC_MESSAGE",
        },
      ],
    },
  },
};
const getWalletAddress = async (): Promise<VaultWalletAddress | any> => {
  try {
    const addressResponse =
      await fireblocks.vaults.getVaultAccountAssetAddressesPaginated({
        vaultAccountId: transactionPayload.source.id,
        assetId: transactionPayload.assetId,
      });
    if (addressResponse.data.addresses.length === 0) {
      throw new Error("No wallet addresses found");
    }
    return addressResponse.data;
  } catch (error) {
    console.error(error);
  }
};

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

const signArbitraryMessage = async (): Promise<
  TransactionResponse | undefined
> => {
  const address = await getWalletAddress();
  try {
    // replacing payload message with the format required before creating the transaction
    // message format is {vasp_prefix}{address}{UUID}
    const message =
      "tripleaio" + address + "975f0090-a88f-4be0-a123-d38484e8394d";
    transactionPayload.extraParameters.rawMessageData.messages[0].content =
      message;

    const transactionResponse = await fireblocks.transactions.createTransaction(
      {
        transactionRequest: transactionPayload,
      },
    );
    const txId = transactionResponse.data.id;
    if (!txId) {
      throw new Error("Transaction ID is undefined.");
    }
    txInfo = await getTxStatus(txId);
    const signature = txInfo.signedMessages[0].signature;

    const encodedSig =
      Buffer.from([Number.parseInt(signature.v, 16) + 31]).toString("hex") +
      signature.fullSig;
    console.log(
      "Encoded Signature:",
      Buffer.from(encodedSig, "hex").toString("base64"),
    );

    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};

signArbitraryMessage();
```

### Structure of the Signature:

The signature produced in Bitcoin message signing is composed of the following:

A single-byte recovery ID `recid` - this byte helps in recovering the public key (and thus the address) from the signature and the signed message.

Two 32-byte numbers representing the ECDSA signature components - `r` and `s`.
The signature is usually encoded in `Base64` format when being displayed or transmitted, making it easier to handle in web interfaces and other applications.
