> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Mint an NFT

First, upload an image of your newly almost minted NFT. The minting function will receive it as one of its parameters.

> **Image hosting options**
>
> You can upload your selected image using any image-hosting site.
>
> While not covered in this guide, another option would be to use a system like [IPFS protocol](https://en.wikipedia.org/wiki/InterPlanetary_File_System) to store your image on-chain as a decentralized solution.

Then we call upon the function while passing these values with it.

| Parameter | Description                                                 |
| --------- | ----------------------------------------------------------- |
| `sender`  | The transaction signer address (your address)               |
| `tokenId` | The ID value of the newly minted NFT                        |
| `uri`     | The NFT's name, description, properties, and image location |

Now we will use Hardhat for the actual deployment. First, we need to make sure it is well set up as described in the [Fireblocks Hardhat Plugin](/reference/hardhat-plugin) guide and then we follow the steps described in this guide.

***

# Using Hardhat

> **Hardhat Runtime Environment required**
>
> We specifically require the Hardhat Runtime Environment.
>
> This is optional but useful for running the script in a standalone fashion through `node <script>`.
>
> You can also run a script with `npx hardhat run <script>`. If you run that script, Hardhat will compile your contracts, add the Hardhat Runtime Environment's members to the global scope, and execute the script.

In the scripts directory, create a new minting script titled: `scripts/mint.js`

```javascript theme={"system"}
const hre = require("hardhat");
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

async function main() {
  const collectionAddress = "<CONTRACT_ADDRESS>";
  const signer = await hre.ethers.getSigner()
  const signerAdderss = await signer.getAddress()
  const nftContract = await hre.ethers.getContractAt("<COLLECTION_NAME>", collectionAddress, signer);
  const tokenData = {
    "name": "<NFT_NAME>",
    "image": "<IMAGE_URL>",
  }

  const tokenURI = parser.format('.json', JSON.stringify(tokenData)).content

  const tx = await nftContract.safeMint(signerAdderss, tokenURI);
  await tx.wait()

  console.log("A new NFT has been minted to:", signerAdderss);
  // console.log("tokenURI:", await nftContract.tokenURI(0))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

***

# Verify your NFT

Now that you have your very own NFT collection, verify it on your Fireblocks workspace and the NFT marketplace [Rarible](https://rarible.com/).

## In your Fireblocks workspace

Log in to your Fireblocks Console to see whether the last transaction was completed successfully. It will be a **Contract Call** type.

## On Rarible

1. Visit Rarible using the following URL: [https://testnet.rarible.com/user/your\_wallet\_address/owned](https://testnet.rarible.com/user/your_wallet_address/owned)
2. Look for your NFT collection in your Rarible account.

> **Note**
>
> The `your_wallet_address` value is the address you used to receive the NFT (the vault that deployed the contract).
