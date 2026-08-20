> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Structure the API Call

> **Learn more about Typed Message Signing in Fireblocks in the following guide**

# Structuring the API Call:

Typed message signing in Fireblocks is performed through the [Fireblocks API - Create Transaction](/reference/createtransaction) Endpoint. The following parameters are required for any Typed Message Signing API request:

```json theme={"system"}
{
  operation: "TYPED_MESSAGE",
    assetId: "ETH"/"BTC"/"TRX",
    source: {
      type: "VAULT_ACCOUNT",
      id: "<vaultAccountId>"
  },
    extraParameters: {
    rawMessageData: {
      messages: [{
        content: "my_message",
        type: "EIP191"/"EIP712"/"TIP191"/"BTC_MESSAGE"
      }]
    }
  }
}
```

* `assetId` - The network to use (possible values are `ETH`, `BTC` and `TRX`
* `operation` - Transaction operation type (`TYPED_MESSAGE`)
* `source` - The vault account from which the Typed Message Signing is to be executed
* `extraParameters` - An additional parameters object that includes the `rawMessageData` object, which contains the messages array. Each message in this array specifies its `content` and the `type` of message signing. The possible types are: `EIP191`, `EIP712`, `TIP191` and `BTC_MESSAGE`

> **Fireblocks users are not required to prefix the message before submitting it to the API. The only requirement is that for any message type other than EIP712, the message to be signed must be submitted in hexadecimal format.**

For more detailed examples on how to structure your API calls correctly for the relevant supported asset, please refer to the guides per asset provided in this section.
