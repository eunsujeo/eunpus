> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# JS SDK (Legacy)

> **We released our official TypeScript SDK! Make sure to check it out in here**

# Overview

A JavaScript or Typescript developer can use the Fireblocks API in 2 different ways:

1. [The Fireblocks JavaScript SDK.](https://github.com/fireblocks/fireblocks-sdk-js)
2. A standard HTTP library, such as [Axios.](https://axios-http.com/docs/intro)

In this guide, you'll set up the Fireblocks SDK and see an example of non-SDK usage (including signing the JWT token).

Additionally if you are developing on EVM chains - you might be using some of the familiar libraries, such as `web3.js` or `ethers.js` - Fireblocks is well intergrated into these libraries as described in the [Ethereum Development](doc:ethereum-development).

# Using the Fireblocks SDK

## Install Node v16 or newer

The Fireblocks JavaScript SDK requires **Node v16 or newer**. You can check which version of Node you already have installed by running the following command.

`node -v`

[Learn how to install or update Node to a newer version.](https://nodejs.org/en/download/)

## Install fireblocks-sdk

The Fireblocks JavaScript SDK is open-source and hosted on both GitHub and PIP, the official package repository.

* **Source code:** [https://github.com/fireblocks/fireblocks-sdk-js](https://github.com/fireblocks/fireblocks-sdk-js)
* **JavaScript Package:** [https://www.npmjs.com/package/fireblocks-sdk](https://www.npmjs.com/package/fireblocks-sdk)

Installing the latest SDK is easy with `npm`:

`npm install fireblocks-sdk`

## Your First Fireblocks JavaScript script!

Now that you're set-up, run a quick check for the API. The script will query existing vaults, create a new vault and then query again to see that the vaults were created.

This Axios-based implementation will require some library dependencies:

* [Axios](https://www.npmjs.com/package/axios)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

> **Use the correct API Base URL**
>
> In the following script, make sure you're using the correct value for `baseUrl` for your environment:
>
> * For Sandbox workspaces: `https://sandbox-api.fireblocks.io`
> * For Mainnet or Testnet workspaces: `https://api.fireblocks.io`
>
> [Learn more about workspace differences](doc:workspace-environments).

```javascript theme={"system"}
const fs = require('fs');
const path = require('path');
const { FireblocksSDK } = require('fireblocks-sdk');
const { exit } = require('process');
const { inspect } = require('util');

const apiSecret = fs.readFileSync(path.resolve("`</path/to/fireblocks_secret.key>`"), "utf8");
const apiKey = "<your-api-key-here>"
// Choose the right api url for your workspace type
const baseUrl = "https://sandbox-api.fireblocks.io";
const fireblocks = new FireblocksSDK(apiSecret, apiKey, baseUrl);

(async () => {

    // Print vaults before creation
    let vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo({});
    console.log(inspect(vaultAccounts, false, null, true));

    // Create vault account
    const vaultCreation = await fireblocks.createVaultAccount("QuickStart_Vault");
    console.log(inspect(vaultCreation, false, null, true));

    // Print vaults after creation
    vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo({});
    console.log(inspect(vaultAccounts, false, null, true));

})().catch((e)=>{
    console.error(`Failed: ${e}`);
    exit(-1);
})
```

```javascript theme={"system"}
const fs = require('fs');
const path = require('path');
const { FireblocksSDK } = require('fireblocks-sdk');
const { exit } = require('process');
const { inspect } = require('util');
const axios = require('axios');
const { sign } = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const crypto = require('crypto');

const apiSecret = fs.readFileSync(path.resolve("`</path/to/fireblocks_secret.key>`"), "utf8");
const apiKey = "<your-api-key-here>"
// Choose the right api url for your workspace type
const baseUrl = "https://sandbox-api.fireblocks.io";
const fireblocks = new FireblocksSDK(apiSecret, apiKey, baseUrl);

class FireblocksRequestHandler{

    baseUrl;
    apiSecret;
    apiKey;

    constructor(apiSecret, apiKey, baseUrl = "https://api.fireblocks.io"){
        this.baseUrl = baseUrl;
        this.apiSecret = apiSecret;
        this.apiKey = apiKey;
    }

    async post(path, data){
        const jwt = this.jwtSign(path,data);
        return (await this.req(jwt, path, data, "POST"));
    }

    async get(path) {
        const jwt = this.jwtSign(path);
        return (await this.req(jwt, path, undefined, "GET"));
    }

    async req(jwt, path, data, method){
        const resp = await axios({
            url: `${this.baseUrl}${path}`,
            method: method,
            data,
            headers:{
                "X-API-Key":this.apiKey,
                "Authorization": `Bearer ${jwt}`
            }
        });
        return resp.data;
    }

    jwtSign(path, data){
        const token = sign({
            uri: path,
            nonce: uuid(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 55,
            sub: this.apiKey,
            bodyHash: crypto.createHash("sha256").update(JSON.stringify(data || "")).digest().toString("hex")
        }, this.apiSecret, {algorithm: "RS256"});
        return token;
    }

}

(async () => {

    const requestHandler = new FireblocksRequestHandler(apiSecret, apiKey);

    // Print vaults before creation
    let vaults = await requestHandler.get("/v1/vault/accounts_paged");
    console.log(inspect(vaults, false, null, true));

    // Create vault account
    const vaultCreation = await requestHandler.post("/v1/vault/accounts", {"name":"QuickStart_Vault"});
    console.log(inspect(vaultCreation, false, null, true));

    // Print vaults after creation
    vaults = await requestHandler.get("/v1/vault/accounts_paged");
    console.log(inspect(vaults, false, null, true));

})().catch((e)=>{
    console.error(`Failed: ${e}`);
    exit(-1);
});
```
