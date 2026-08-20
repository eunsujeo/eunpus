> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Add Tokens

Fireblocks allows clients to add tokens across various blockchains via the Fireblocks API. To register a new token, use the [Register a New Asset](/reference/registernewasset) endpoint with the appropriate parameters for the supported blockchain.

The blockchains supported for self-token addition via the API include:

* EVM-based chains
* Algorand
* NEAR
* Solana
* Stellar
* Sui
* TON
* TRON

The API requires a `POST` request with the following parameters:

* **blockchainId:** The unique network identifier (e.g., `ETH`).
* **address:** The asset address:
  * **EVM-based chains:** Token contract address
  * **Algorand (ALGO):** Asset ID
  * **NEAR:** Token address
  * **Solana:** Token's mint account address
  * **Stellar (XLM):** Issuer address
  * **Sui:** The token's type
  * **TON:** Token address
  * **TRON (TRX):** Token contract address
* **symbol:** Required for XLM tokens only

## Code example

Below is a code example for adding a new token to your workspace:

```javascript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from "@fireblocks/ts-sdk";

const FIREBLOCKS_API_SECRET_PATH = "<PATH_TO_YOUR_SECRET>";

// Initialize a Fireblocks API instance with local variables
const fireblocks = new Fireblocks({
    apiKey: "<YOUR_API_KEY>",
    basePath: BasePath.US,
    secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, "utf8"),
});

(async() => {

  const addTokenRes = await fireblocks.blockchainsAssets.registerNewAsset({
    registerNewAssetRequest: {
      blockchainId: "ETH",
      address: "0xdBA8e8021FE321af91FC3A08e223EF15908cB2bB"
    }
  })

  console.log(JSON.stringify(addTokenRes, null, 2))

})();
```

In this example, we are adding the`0xdBA8e8021FE321af91FC3A08e223EF15908cB2bB` token (Smart Contract address) on the Ethereum network.
