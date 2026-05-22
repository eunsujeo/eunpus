> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieve NFTs

# Overview

Fireblocks enables retrieving and refreshing data related to all Non-Fungible Tokens (NFTs) listed in your vault accounts. This allows builders who want to present NFTs on their platform to use the data directly from the Fireblocks database, without the need to query an external node or IPFS for the metadata or media.

Given the different characteristics of fungible assets and NFTs, listing the NFTs owned by your vaults uses other endpoints than the ones used for listing your fungible assets.

# Managing NFTs

Currently, native NFT listing is enabled for tokens that implement ERC-721 or ERC-1155 standards, on the following blockchains.

| Blockchain | Chain   | Descriptor            |
| ---------- | ------- | --------------------- |
| Ethereum   | Mainnet | ETH                   |
| Ethereum   | Goerli  | ETH\_TEST3            |
| Polygon    | Mainnet | POLYGON               |
| Polygon    | Mumbai  | POLYGON\_TEST\_MUMBAI |

# Initial account synchronization

Customers with existing Fireblocks vault accounts can use the refresh function to sync their vault with NFTs not already stored in the Fireblocks database.

```javascript theme={"system"}
// Get vaults
const vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo({});

console.log(inspect(vaultAccounts, false, null, true));

// Extract vault account ids
const vaultAccountsIds = vaultAccounts.accounts.map((va: any) => va.id);
console.log(inspect(vaultAccountsIds, false, null, true));

// Refresh tokens metadata per vault
for (const vaId of vaultAccountsIds) {
  try {
    await fireblocks.refreshNftOwnershipByVault({
      vaultAccountId: vaId,
      blockchainDescriptor: "ETH_TEST3",
    });
  } catch (e) {
    console.log(`Could not refresh vault vtId=${vtId}`);
  }
}
```

```python theme={"system"}
# Get vaults
vault_accounts = fireblocks.get_vault_accounts_with_page_info(
    PagedVaultAccountsRequestFilters()
)

# Extract vault account ids
vault_accounts_ids = [va.get("id") for va in vault_accounts.get("accounts")]
print(vault_accounts_ids)

# Refresh tokens metadata per vault
for va_id in vault_accounts_ids:
    try:
        fireblocks.refresh_nft_ownership_by_vault(
            vault_account_id=va_id,
            blockchain_descriptor="ETH_TEST3",
        )
    except FireblocksApiException:
        print(f"Could not refresh vault {vt_id=}")
```

# Listing NFTs

Users can list and retrieve metadata regarding the NFTs stored in their vault accounts.

```javascript theme={"system"}
const getNFTsList = async (
  blockchainDescriptor?: GetOwnershipTokensBlockchainDescriptorEnum,
  pageSize?: number,
): Promise<GetOwnershipTokens200Response | undefined> => {
  try {
    let nextPage: boolean = true;
    let pageCursor: string | undefined = "";

    // Fetch all owned tokens in workspace with their corresponding balance
    const ownedNFTs: GetOwnershipTokens200Response = (
      await fireblocks.nfts.getOwnershipTokens({
        blockchainDescriptor: blockchainDescriptor,
        pageSize: pageSize,
        pageCursor: pageCursor,
      })
    ).data;
    pageCursor = ownedNFTs.paging?.next;
    // iterate over all pages to fetch all NTFs
    while (nextPage) {
      const nextPageNFTs: GetOwnershipTokens200Response = (
        await fireblocks.nfts.getOwnershipTokens({
          blockchainDescriptor: blockchainDescriptor,
          pageSize: pageSize,
          pageCursor: pageCursor,
        })
      ).data;
      if (!nextPageNFTs.paging) {
        nextPage = false;
      } else {
        pageCursor = nextPageNFTs.paging?.next;
        nextPageNFTs.data?.forEach((item) => {
          ownedNFTs.data?.push(item);
        });
      }
    }
    console.log(
      JSON.stringify(ownedNFTs.data, null, 2),
      "\nNumber of NFTs: ",
      ownedNFTs.data?.length,
    );
    return ownedNFTs;
  } catch (e) {
    console.log(e);
  }
};
getNFTsList(); // add blockchainDescriptorEnum and/or pageSize to filter the response and set the results per page size
```

```javascript theme={"system"}
// Get vaults
const vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo({});

// Extract vault account ids
const vaultAccountsIds = vaultAccounts.accounts.map((va: any) => va.id);
console.log(inspect(vaultAccountsIds, false, null, true));

// Fetch all owned tokens in tenant with their corresponding balance
const ownedNFTs = await fireblocks.getOwnedNFTs({
  vaultAccountIds: vaultAccountsIds,
  blockchainDescriptor: "POLYGON_TEST_MUMBAI",
});

console.log(inspect(ownedNFTs, false, null, true));
```

```python theme={"system"}
# Get vaults
vault_accounts = fireblocks.get_vault_accounts_with_page_info(
    PagedVaultAccountsRequestFilters()
)

# Extract vault account ids
vault_accounts_ids = [va.get("id") for va in vault_accounts.get("accounts")]
print(vault_accounts_ids)

# Fetch all owned tokens in tenant with their corresponding balance
print(
    fireblocks.get_owned_nfts(
        vault_account_ids=vault_accounts_ids,
        blockchain_descriptor="POLYGON_TEST_MUMBAI",
    )
)
```

# Refreshing a token's metadata

The metadata of some NFTs may change over time. To make sure an NFT has the most up-to-date metadata, call `refreshNFTMetadata` function

```javascript theme={"system"}
const refreshNFTsMetada = async (
  TokensBlockchainDescriptorEnum?: GetOwnershipTokensBlockchainDescriptorEnum,
) => {
  try {
    const ownedNFTs: GetOwnershipTokens200Response | undefined = (
      await fireblocks.nfts.getOwnershipTokens({
        blockchainDescriptor: TokensBlockchainDescriptorEnum,
      })
    ).data;

    // Extract NFT ids
    const nftIds: any[] | undefined =
      ownedNFTs.data?.map((nft: { id: string }) => nft.id) ?? [];

    // Refresh metadata for every ids
    for (const nftId of nftIds) {
      try {
        await fireblocks.nfts.refreshNFTMetadata(nftId);
      } catch (error) {
        console.log(`Could not refresh NFT metadata for ${nftId}`);
      }
    }
    console.log(`NFTs metadata was updated successfully!`);
  } catch (e) {
    console.error(e);
  }
};

refreshNFTsMetada(); // add TokensBlockchainDescriptorEnum to update the metada of NFTs only on a specific chain.
```

```javascript theme={"system"}
// Get vaults
const vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo({});

// Filter for ids
const vaultAccountsIds = vaultAccounts.accounts.map((va: any) => va.id);
console.log(inspect(vaultAccountsIds, false, null, true));

// Fetch all owned tokens in tenant with their corresponding balance
const ownedNFTs = await fireblocks.getOwnedNFTs({
  vaultAccountIds: vaultAccountsIds,
  blockchainDescriptor: "POLYGON_TEST_MUMBAI",
});

// Extract NFT ids
const nftIds: string[] = ownedNFTs.data?.map((nft: { id: string; }) => nft.id) ?? [];

// Refresh metadata for every ids
for (const nftId of nftIds) {
  try {
    await fireblocks.refreshNFTMetadata(nftId);
  } catch (error) {
    console.log(`Could not refresh NFT metadata for ${nftId}`);
  }
}
```

```python theme={"system"}
# Get vaults
vault_accounts = fireblocks.get_vault_accounts_with_page_info(
    PagedVaultAccountsRequestFilters()
)

# Extract vault account ids
vault_accounts_ids = [va.get("id") for va in vault_accounts.get("accounts")]

# Fetch all owned tokens in tenant with their corresponding balance
nfts_data = fireblocks.get_owned_nfts(
    vault_account_ids=vault_accounts_ids,
    blockchain_descriptor="ETH_TEST3",
)

# Extract NFT ids
nft_ids = [nft_id.get("id") for nft_id in nfts_data.get("data", [])]

# Refresh metadata for every ids
for nft_id in nft_ids:
    try:
        fireblocks.refresh_nft_metadata(id=nft_id)
    except FireblocksApiException:
        print(f"Could not refresh NFT metadata for {nft_id=}")
```

# NFT webhook examples

The `TRANSACTION_CREATED` webhook shows that an NFT transaction was created and includes all the relevant transaction details.

> **Note**
>
> This webhook does not indicate that the NFT itself was created, only that a transaction using the specified NFT was created.

```json theme={"system"}
{
  "type": "TRANSACTION_CREATED",
  "tenantId": "00...00",
  "timestamp": 1685537055712,
  "data": {
    "id": "00...00",
    "createdAt": 1685537045477,
    "lastUpdated": 1685537045477,
    "assetId": "ETH_TEST3",
    "source": {
      "id": "34",
      "type": "VAULT_ACCOUNT",
      "name": "Vault 2",
      "subType": ""
    },
    "destination": {
      "id": "",
      "type": "ONE_TIME_ADDRESS",
      "name": "N/A",
      "subType": ""
    },
    "amount": 0,
    "netAmount": 0,
    "sourceAddress": "",
    "destinationAddress": "0x...00",
    "destinationAddressDescription": "",
    "destinationTag": "",
    "status": "SUBMITTED",
    "txHash": "",
    "subStatus": "",
    "signedBy": [],
    "createdBy": "00...00",
    "rejectedBy": "",
    "amountUSD": null,
    "addressType": "",
    "note": "Created by ",
    "exchangeTxId": "",
    "requestedAmount": 0,
    "feeCurrency": "ETH_TEST3",
    "operation": "CONTRACT_CALL",
    "amountInfo": {
      "amount": "0",
      "requestedAmount": "0",
      "netAmount": "0"
    },
    "feeInfo": {},
    "externalTxId": null,
    "blockInfo": {},
    "contractCallDecodedData": {
      "contractName": "SampleERC1155",
      "functionCalls": [
        {
          "name": "safeTransferFrom",
          "params": [
            {
              "name": "from",
              "type": "address",
              "value": "0x...00"
            },
            {
              "name": "to",
              "type": "address",
              "value": "0x...00"
            },
            {
              "name": "id",
              "type": "uint256",
              "value": "676"
            },
            {
              "name": "amount",
              "type": "uint256",
              "value": "3"
            },
            {
              "name": "data",
              "type": "bytes",
              "value": "0x00"
            }
          ],
          "payloadSuffix": ""
        }
      ]
    },
    "extraParameters": {
      "contractCallData": "0x...00"
    }
  }
}
```

The `TRANSACTION_STATUS_UPDATED` webhook shows the NFT transaction's most recent status in the transaction flow.

```json theme={"system"}
{
  "type": "TRANSACTION_STATUS_UPDATED",
  "tenantId": "00...00",
  "timestamp": 1685537118476,
  "data": {
    "id": "00...00",
    "createdAt": 1685537045477,
    "lastUpdated": 1685537108198,
    "assetId": "ETH_TEST3",
    "source": {
      "id": "34",
      "type": "VAULT_ACCOUNT",
      "name": "Vault 2",
      "subType": ""
    },
    "destination": {
      "id": "",
      "type": "ONE_TIME_ADDRESS",
      "name": "N/A",
      "subType": ""
    },
    "amount": 0,
    "networkFee": 0.004458229302275784,
    "netAmount": 0,
    "sourceAddress": "",
    "destinationAddress": "0x...00",
    "destinationAddressDescription": "",
    "destinationTag": "",
    "status": "COMPLETED",
    "txHash": "0x...00",
    "subStatus": "CONFIRMED",
    "signedBy": [],
    "createdBy": "00...00",
    "rejectedBy": "",
    "amountUSD": 0,
    "addressType": "",
    "note": "Created by ",
    "exchangeTxId": "",
    "requestedAmount": 0,
    "feeCurrency": "ETH_TEST3",
    "operation": "CONTRACT_CALL",
    "numOfConfirmations": 3,
    "amountInfo": {
      "amount": "0",
      "requestedAmount": "0",
      "netAmount": "0",
      "amountUSD": null
    },
    "feeInfo": {
      "networkFee": "0.004458229302275784",
      "gasPrice": "76.16217886899999"
    },
    "externalTxId": null,
    "blockInfo": {
      "blockHeight": "0...0",
      "blockHash": "00...00"
    },
    "contractCallDecodedData": {
      "contractName": "SampleERC1155",
      "functionCalls": [
        {
          "name": "safeTransferFrom",
          "params": [
            {
              "name": "from",
              "type": "address",
              "value": "0x...00"
            },
            {
              "name": "to",
              "type": "address",
              "value": "0x...00"
            },
            {
              "name": "id",
              "type": "uint256",
              "value": "676"
            },
            {
              "name": "amount",
              "type": "uint256",
              "value": "3"
            },
            {
              "name": "data",
              "type": "bytes",
              "value": "0x00"
            }
          ],
          "payloadSuffix": ""
        }
      ]
    },
    "networkRecords": [
      {
        "source": {
          "id": "34",
          "type": "VAULT_ACCOUNT",
          "name": "Vault 2",
          "subType": ""
        },
        "destination": {
          "id": "",
          "type": "ONE_TIME_ADDRESS",
          "name": "N/A",
          "subType": ""
        },
        "txHash": "0x...00",
        "networkFee": "0.004458229302275784",
        "assetId": "NFT-00...00",
        "netAmount": "3",
        "isDropped": false,
        "type": "CONTRACT_CALL",
        "destinationAddress": "0x...00",
        "amountUSD": null
      },
      {
        "source": {
          "id": "34",
          "type": "VAULT_ACCOUNT",
          "name": "Vault 2",
          "subType": ""
        },
        "destination": {
          "id": "",
          "type": "ONE_TIME_ADDRESS",
          "name": "N/A",
          "subType": ""
        },
        "txHash": "0x...00",
        "networkFee": "0.004458229302275784",
        "assetId": "ETH_TEST3",
        "netAmount": "0.000000000000000000",
        "isDropped": false,
        "type": "CONTRACT_CALL",
        "destinationAddress": "0x...00",
        "amountUSD": "0.00"
      }
    ],
    "signedMessages": [],
    "extraParameters": {
      "contractCallData": "0x...00"
    },
    "assetType": "BASE_ASSET"
  }
}
```
