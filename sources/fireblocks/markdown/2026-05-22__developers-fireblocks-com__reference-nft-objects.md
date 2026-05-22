> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# NFT Objects

## MediaEntityResponse

| Parameter   | Type   | Description            |
| ----------- | ------ | ---------------------- |
| url         | string | Cached accessible URL. |
| contentType | string | Media Type.            |

***

## TokenCollectionResponse

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| id        | string | Unique token collection ID with Fireblocks. |
| name      | string | The display name of the token collection.   |
| symbol    | string | The ticker symbol for the token.            |

***

## TokenResponse

| Parameter            | Type                           | Description                                                                                     |
| -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| id                   | string                         | Unique token ID with Fireblocks.                                                                |
| tokenId              | string                         | Token ID within the contract/collection.                                                        |
| standard             | string                         | ERC721 or ERC1155                                                                               |
| metadataURI          | string                         | URL to original token metadata JSON                                                             |
| media                | MediaEntityResponse object     | Media items extracted from metadata JSON                                                        |
| collection           | TokenCollectionResponse object | Parent collection information                                                                   |
| blockchainDescriptor | string                         | Blockchain descriptor filter. Available values: ETH, ETH\_TEST3, POLYGON, POLYGON\_TEST\_MUMBAI |
| description          | string                         | A summary of the token.                                                                         |
| name                 | string                         | The display name of the token.                                                                  |

***

## TokenOwnershipResponse

| Parameter            | Type                           | Description                                                                                     |
| -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| id                   | string                         | Unique token ID with Fireblocks.                                                                |
| tokenId              | string                         | Token ID within the contract/collection.                                                        |
| standard             | string                         | ERC721 or ERC1155                                                                               |
| metadataURI          | string                         | URL to original token metadata JSON                                                             |
| media                | MediaEntityResponse object     | Media items extracted from metadata JSON                                                        |
| collection           | TokenCollectionResponse object | Parent collection information                                                                   |
| vaultAccountId       | string                         | The ID for the vault account that owns the token.                                               |
| balance              | number                         | Balance of vault token collection.                                                              |
| blockchainDescriptor | string                         | Blockchain descriptor filter. Available values: ETH, ETH\_TEST3, POLYGON, POLYGON\_TEST\_MUMBAI |
| description          | string                         | The description of the NFT                                                                      |
| name                 | string                         | The display name of the NFT                                                                     |
