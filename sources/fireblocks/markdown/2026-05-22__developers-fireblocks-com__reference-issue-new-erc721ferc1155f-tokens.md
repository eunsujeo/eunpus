> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Issue new ERC721F/ERC1155F Tokens

This guide explains how to use the `v1/tokenization/collections` endpoint through the Fireblocks SDK to issue new ERC721F/ERC1155F tokens. It will walk you through the process that will result in deploying collection contracts, making them available in the Tokenization Engine. It will also show how to perform minting, burning, and other operations related to their respective standards.

## What are ERC721F and ERC1155F contracts?

ERC721F and ERC1155F are non-fungible and semi-fungible token reference implementations developed by Fireblocks. They build upon the widely used ERC-721 and ERC-1155 token standards. ERC721F and ERC1155F tokens can represent ownership of digital or physical assets. They are used in various applications such as digital art, collectibles, and gaming. These implementations are designed to be flexible, allowing for token minting, burning, and secure integration within Fireblocks' ecosystem. They are designed for compliance, making them ideal for organizations requiring scalable and customizable token management solutions.

## Why use Collections API?

The Collections API allows you to easily deploy mint, burn and manage non-fungible and semi-fungible tokens. It is a wrapper around the Tokenization API that enables you to handle operations related to ERC721F/ERC1155F tokens. This means the Collections API will deploy and link the NFT contract by leveraging the tokenization API, with additional helpers to manage the NFT metadata. Essentially, it's a convenience layer on top of the Tokenization API that abstracts the complexity of deploying and linking NFT contracts.

> **Note:**
>
> Collections API is only available for ERC721F and ERC1155F tokens.

## Prerequisites

Before issuing a new ERC721F/ERC1155F token using the Fireblocks SDK, ensure you know the following:

1. assetId: The Asset Id of the blockchain where the token will be deployed (e.g. ETH\_TEST5 for Sepolia). This is the Fireblocks ID of the gas token of the blockchain where the token will be deployed. (To get the asset ID, refer to this [assetId](https://support.fireblocks.io/hc/en-us/articles/8993656344092-Supported-blockchain-networks) list)
2. vaultAccountId: The Id of the Vault that will deploy the token. Ensure the vault has sufficient native gas for transaction fees. The vaultAccountId can be retrieved from the Fireblocks console by checking the URL of the selected vault, e.g., `https://console.fireblocks.io/v2/accounts/vault/<vaultAccountId>`. For more details about Vault Accounts, refer to the Create Vault Account [guide](/reference/create-vault-account).
3. Ensure you have access to the Fireblocks Smart Contracts package, which includes the reference protocol contracts. Contact your CSM if unsure if your workspace has this SKU.

## Example 1: Issuing a New NFT collection

Here's an example of how to issue a new ERC721F or ERC1155F token using the Fireblocks SDK:

### 1. Initialize the Fireblocks SDK

First, import the Fireblocks SDK and initialize it by providing your Fireblocks API key and private key:

```javascript theme={"system"}
import {
    Fireblocks,
    BasePath,
} from '@fireblocks/ts-sdk';

const privateKey = '...'; // Your Fireblocks API private key
const apiKey = '...'; // Your Fireblocks API key

const fireblocksSdk = new Fireblocks({
    apiKey,
    basePath: BasePath.US, // Use BasePath.EU for the EU region
    secretKey: privateKey,
});
```

### 2. Create a new Collection

To deploy a new ERC721F/ERC1155F collection contract, you need to know the following:

* `baseAssetId`: The assetId of the blockchain where the collection will be deployed (e.g. ETH\_TEST5 for Sepolia).
* `vaultAccountId`: The vaultAccountId of the vault that will deploy the token.
* `type`: The type of the collection, either `NON_FUNGIBLE_TOKEN` or `SEMI_FUNGIBLE_TOKEN`.
  * when type is `NON_FUNGIBLE_TOKEN` the collection will be an ERC721F contract.
  * when type is `SEMI_FUNGIBLE_TOKEN` the collection will be an ERC1155F contract.
* `name`: The name of the collection. This name will be stored on the smart contract.
* `symbol`: The symbol of the collection.
* `adminAddress`: The address that will receive admin roles on the contract. Ensure that it's an address you control.
* `displayName`: The display name of the collection. This name will be displayed in the Fireblocks console.

For the purpose of this example, we will create an ERC721F collection on the Ethereum Sepolia network.

```javascript theme={"system"}
let collectionRequest: CollectionDeployRequestDto = {
    baseAssetId: 'ETH_TEST5',
    vaultAccountId: '0',
    type: 'NON_FUNGIBLE_TOKEN',
    name: 'My Collection',
    symbol: 'MC',
    adminAddress: '0x5503766D27d1ED4525f5053222E18b29C38eDdB2',
    displayName: 'My Collection',
};

const collection = await fireblocksSdk.tokenization.createCollection({
			collectionDeployRequest: collectionRequest,
		});
```

This will return a collection object with the following properties:

* `id`: The token link id of the collection. Since collections are linked to Tokenization Engine just like fungible tokens deployed using the tokenization API, the collection will have a token link id.
* `status`: The token link status. Possible values are `PENDING`, `COMPLETED` and `FAILED` but, right after sending create collection request, status will be `PENDING`.
* `type`: The type of the collection, either `NON_FUNGIBLE_TOKEN` or `SEMI_FUNGIBLE_TOKEN`.
* `displayName`: The display name of the collection as it appears in the Fireblocks console.
* `tokenMetadata`: The metadata of the collection. For now, it will be empty. But once the deployment transaction is completed, and the collection is linked, the metadata will be updated with the contract address and other details. For more information, refer to the [Collection Metadata](/reference/issue-new-erc721ferc1155f-tokens#collection-metadata) section below.

> **Note:**
>
> The procedure for creating an ERC1155F collection is the same, only that the type should be changed to `SEMI_FUNGIBLE_TOKEN`.

#### Collection Metadata:

The token metadata can be one of the following:

* `ContractMetadataDto`: If the contract is a utility contract (i.e. any arbitrary contract).
* `AssetMetadataDto`: If the contract is a fungible token (i.e. ERC20).
* `CollectionMetadataDto`: If the contract is a non-fungible token (i.e. ERC721 or ERC1155).

Once the contract is deployed and the collection is linked. The `tokenMetadata` will assume a value of type `collectionMetadataDto`. This metadata object that holds the contract address and other details. This object will be stored on the Fireblocks database and it looks like this:

```json theme={"system"}
{
    name: "My Collection",
    symbol: "MC",
    standard: "ERC721F",
    blockchainDescriptor: "ETH",
    contractAddress: "0x5503766D27d1ED4525f5053222E18b29C38eDdB2",
}
```

Now that we have a token link with a pending status, we can poll the status of the token link to check if the collection is deployed and the linkage is complete. To do that we can use the `getLinkedCollections` method.

#### 2.1 Fetching a Collection

To fetch a collection, you need to know the id of the collection, which is the token link id of the linked token. In this example we will use the id of the collection we created in the previous step. If the id is not known, you can use the getLinkedCollections method, which will return a list of all linked collections. Then you can find and use the id of the collection you want to fetch.

```javascript theme={"system"}
const collectionId = collection.id; // collection object from the previous step
const fetchedCollection = await fireblocksSdk.tokenization.getCollectionById({ TokenIdParamDto: collectionId });
This will return a collection object with the same properties as mentioned in the previous step.
```

If you want to continue to mint an NFT, you can proceed to the next example below.

## Example 2: Minting an NFT

To mint an NFT, the caller must have the `MINTER_ROLE` role on the collection contract. If the collection was deployed through Collections API, the `MINTER_ROLE` role is assigned to the adminAddress that was provided when creating the collection. You also need to perform two steps mentioned in Issuing a New NFT collection example above.

> **Note:**
>
> If you wish to use a different address to mint tokens, you can assign the `MINTER_ROLE` role to the desired address. The process is similar to the one described in the [Assigning Roles](/reference/setting-up-roles-in-erc20f-tokens#3-grant-role-to-address) guide for ERC20F.

### 3. Minting an NFT

To mint an NFT, you need to know the following:

* `vaultAccountId`: The vaultAccountId that will mint the token. Make sure this vault has enough native gas tokens for the transaction fees and the MINTER\_ROLE role on the smart contract.
* `to`: The address that will receive the minted token.
* `tokenId`: The id of the token to mint. This id must be unique within the collection. For this field, it is recommended to have a numerical format and in sequential order.
* `amount`: (Optional) The amount of the token to mint. For ERC721F, amount is ignored. For ERC1155F, the amount should be 1 or greater.
* `metadataURI`: (Optional) The metadata URI of the token. This URI will be stored on the smart contract and can be used to fetch the metadata of the token. This URL is usually an IPFS URL.
* `metadata`: (Optional) The metadata of the token. This metadata object will be uploaded to IPFS and the URI will be stored on the smart contract. For detailed information about the metadata, refer to the [NFT metadata](/reference/issue-new-erc721ferc1155f-tokens#nft-metadata) section below.

#### NFT Metadata:

The metadata object should have the following properties:

* `name`: The name of the token.
* `description`: The description of the token.
* `image`: (Optional) The image of the token. This should be a URL to the image of the token. (e.g. [https://some\\\_domain.com/image\\\_filepath](https://some\\_domain.com/image\\_filepath)).
* `animation`: (Optional) The animation of the token. This should be a URL to the animation of the token. (e.g. [https://some\\\_domain.com/animation\\\_filepath](https://some\\_domain.com/animation\\_filepath)).
* `external_url`: (Optional) The external URL of the token. This should be a URL to the token's external page. (e.g. [https://some\\\_domain.com/token\\\_page](https://some\\_domain.com/token\\_page)).
* `attributes`: (Optional) The attributes of the token. The token can have many attributes or traits depending on the use case. This should be an array of objects, each object should have the following properties:
* `trait_type`: The trait type of the attribute. (e.g. rarity).
* `value`: The value of the attribute. (e.g. common, legendary).
* `display_type`: (Optional) The display type of the attribute. This describes how would you like the trait to be displayed (e.g. number, date).

Here is an example of a metadata object:

```json theme={"system"}
{
    name: "My Token",
    description: "This is my token",
    image: "https\://some_domain.com/image_filepath",
    animation: "https\://some_domain.com/animation_filepath",
    external_url: "https\://some_domain.com/token_page",
    attributes: [
        {
            trait_type: "rarity",
            value: "common",
            display_type: "string"
        },
        {
            trait_type: "level",
            value: 1,
            display_type: "number"
        }
    ]
}
```

**What if I don't want to upload images and animations to a hosted server?**

If you don't want to upload images and animations to a hosted server, you can encode the image and animation files to base64 and pass them in the metadata object. Fireblocks will upload the metadata object containing base64 content to IPFS. This can be done as follows for an image in PNG format:

```javascript theme={"system"}
const image = fs.readFileSync('path/to/fileimage.png').toString('base64');

const metadata = {
    name: "My Token",
    description: "This is my token",
    image: `data:image/png;base64,${image}`,
    attributes: [
        {
            trait_type: "rarity",
            value: "common",
            display_type: "string"
        },
        {
            trait_type: "level",
            value: 1,
            display_type: "number"
        }
    ]
}
```

Once you have the metadata object, you can pass it to the metadata field in the mint request.

For this example, we assume that the metadata is already uploaded to IPFS and we have the URI of the metadata. We are also minting an ERC721F token, so we will not use the amount field. If you are minting an ERC1155F token, you can set the amount field to the desired amount.

> **Caution:**
>
> Make sure to use either `metadataURI` or `metadata` - not both. If you use both metadataURI and metadata the request will fail.

```javascript theme={"system"}
let mintRequest: CollectionMintRequestDto = {
    vaultAccountId: 'vaultAccountId',
    to: '0x5503766D27d1ED4525f5053222E18b29C38eDdB2',
    tokenId: 1,
    metadataURI: 'ipfs://QmP4P6f7mDHzikhdwLBVSCxCPEgmjwcWSVBHbtSyfBYzBC',
};
const collectionId: CollectionIdParamDto = { id: collection.id }; // collection object from the previous step

const txId = await fireblocksSdk.tokenization.mintCollectionToken({
			colletionId,
			collectionMintRequest: mintRequest,
		});
```

This will return the Fireblocks transaction id of the Mint transaction.

#### 3.1. Fetching the minted token

To fetch the minted token, you need to know the tokenId of the token. In this example we will use the tokenId we minted in the previous step. To fetch the token you can use the fetchCollectionTokenDetails method that will return the nft token object.

```javascript theme={"system"}
const tokenId = mintRequest.tokenId; // tokenId from the mint request
const fetchedToken = await fireblocksSdk.tokenization.fetchCollectionTokenDetails(collectionId, tokenId);
```

This will return a token object with the following properties:

* `tokenId`: The id of the token.
* `metadataURI`: The metadata URI of the token.
* `totalSupply`: The total supply of the token.

If you would like to continue learn how to burn NFT, you can proceed to the next example.

## Example 3: Burning an NFT

To burn an NFT, the caller must have the `BURNER_ROLE` role on the collection contract. The `BURNER_ROLE` role is not assigned to anyone by default. You also need to make sure you have a collection of NFTs and an NFT to burn which described in example 1 and 2. To assign the `BURNER_ROLE` role to an address, you can use the `grantRole` method. For more information, refer to the [Assigning Roles](/reference/setting-up-roles-in-erc20f-tokens#3-grant-role-to-address) guide for ERC20F. The process is the same for ERC721F/ERC1155F.

### 4. Burning an NFT

To burn an NFT, you need to know the following:

* `collectionId`: The id of the collection.
* `vaultAccountId`: The vaultAccountId that will burn the token. Make sure this vault has enough native gas for the transaction fees and the BURNER\_ROLE role on the smart contract.
* `tokenId`: The id of the token to burn.
* `amount`: (Optional) The amount of the token to burn. For ERC721F, amount is ignored. For ERC1155F, amount should be 1 or greater.

For this example, we will burn an ERC721F token, so we will not use the amount field. If you are burning an ERC1155F token, you can set the amount field to the desired amount.

```javascript theme={"system"}
let burnRequest: CollectionBurnRequestDto = {
    vaultAccountId: 'vaultAccountId',
    tokenId: 1,
};
let collectionId = { id: collection.id }: CollectionIdParamDto; // collection object from the previous step

const txId = await fireblocksSdk.tokenization.burnCollectionToken({
            colletionId,
            collectionBurnRequestDto: burnRequest,
        });
```

This will return the Fireblocks transaction id of the Burn transaction.

## Summary

The Collections API is a high-level API provides a simple interface to manage NFTs. Without collections API, you would need to:

1. Fetch the templates from `getContractTemplates`.
2. Find the template (e.g. ERC721F) from the list.
3. Fetch the template using `getContractTemplate`.
4. Deploy the contract.
5. Mint the NFT.

With collections API all of that is abstracted into the purpose-driven methods explained in this guide.

## Further Reading

For more detailed information on API parameters and responses, including examples for using plain HTTP requests or in other programming languages, please have a look at the [Fireblocks API Reference](/reference/createnewcollection).

For more specific guidance on ERC721F and ERC1155F contracts operations, refer to the \[Operating the Upgradable ERC721F Contract Support Center Articles]\(Operating the Upgradable ERC721F Contract Support Center Articles) guides.
