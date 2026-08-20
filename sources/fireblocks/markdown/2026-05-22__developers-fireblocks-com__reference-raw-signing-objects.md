> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Raw Signing Objects

## RawMessageData

| Parameter | Type                                                       | Description                                                                                                                                     |
| --------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| messages  | array of [UnsignedRawMessage](#unsignedrawmessage) objects | The messages that should be signed                                                                                                              |
| algorithm | string                                                     | \[optional] The algorithm which will be used to sign the transaction, one of the [SigningAlgorithms](/reference/vault-objects#signingalgorithm) |

***

## SignedMessage

| Parameter      | Type             | Description                                                                                                                                                               |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content        | string/object    | The content that was sent to be signed.  For RAW signing - the message for signing (hex-formatted).  For EIP712 Typed Message signing - the object (payload) for signing. |
| algorithm      | string           | The algorithm that was used for signing, one of the [SigningAlgorithms](/reference/vault-objects#signingalgorithm)                                                        |
| derivationPath | Array of numbers | [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) derivation path of the signing key. E.g.                                                          |
| signature      | dictionary       | The message signature                                                                                                                                                     |
| publicKey      | string           | The signature's public key is used for verification.                                                                                                                      |

***

## UnsignedRawMessage

| Parameter         | Type                                                                                                                           | Description                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content           | string                                                                                                                         | The message to be signed in hex format encoding                                                                                                                                                                                                           |
| bip44AddressIndex | number                                                                                                                         | RawMess [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) address\_index path level                                                                                                                                                 |
| bip44change       | number                                                                                                                         | RawMess [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) change path level                                                                                                                                                         |
|                   | The 2 fields above complement the derivation path given the source id and asset were provided in the transaction body request. |                                                                                                                                                                                                                                                           |
|                   | In case none of the above was provided, please specify the derivation path.                                                    |                                                                                                                                                                                                                                                           |
| derivationPath    | array of numbers                                                                                                               | RawMess Should be passed only if asset and source were not specified.   - *Note:*\* for Testnet assets, `coin_type` is always '1'.                                                                                                                        |
| type              | string                                                                                                                         | RawMess Should be passed only if `operation` is `TYPED_MESSAGE`. Possible values are:   - `EIP191`: for ETH/EVM personal messages - `EIP712`: For ETH/EVM typed messages - `TIP191`: For TRX personal messages - `BTC_MESSAGE`: For BTC personal messages |
| preHash           | [PreHash object](/reference/raw-signing-objects#prehash)                                                                       | An object to send (described below) when creating ECDSA Raw signing requests in cold wallet workspaces.  **Required in Cold Wallet workspaces only. Regular Fireblocks workspaces do not require this object to be sent.**                                |

## PreHash

| Parameter     | Type   | Description                                                                                                                       |
| ------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| content       | string | The pre-hashed content in hexadecimal representation.                                                                             |
| hashAlgorithm | string | The hashing algorithm to apply to the provided content.  Possible values:   - SHA256 - KECCAK256 - BLAKE2 - SHA3 - DOUBLE\_SHA256 |
