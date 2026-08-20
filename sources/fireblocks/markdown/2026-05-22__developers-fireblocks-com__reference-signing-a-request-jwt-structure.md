> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Authenticate

> Before you begin
>
> Ensure you have created an **API User ID** (API key) in your [Fireblocks Console](https://console.fireblocks.io/v2/developer/api-users).

# Signing a request

Fireblocks uses **API keys** (API User IDs) to authenticate all API calls. Depending on the type of workspace environment, the **base API URL** will be one of the following:

* US Sandbox: `https://sandbox-api.fireblocks.io/v1`
* US Mainnet/Testnet: `https://api.fireblocks.io/v1`
* For EU Mainnet or Testnet workspaces: `https://eu-api.fireblocks.io/v1`
* For EU2 Mainnet or Testnet workspaces: `https://eu2-api.fireblocks.io/v1`

Every API request must contain the following headers:

* `X-API-Key` - The API key created from your Fireblocks workspace.
* `Authorization` - This value should be set to `Bearer <Access Token>`. The access token is a Base64-encoded JSON Web Token (JWT).

***

# JWT Structure

`Authorization: Bearer <JWT>`

The JWT payload field should contain the following fields:

* `uri` - The URI part of the request (e.g., /v1/transactions).
* `nonce` - Unique number or string. Each API request must have a unique nonce.
* `iat` - The time at which the JWT was issued, in seconds since Epoch.
* `exp` - The expiration time on and after which the JWT must not be accepted for processing, in seconds since Epoch. (Must be less than `iat`+30sec.)
* `sub` - The API key.
* `bodyHash` - Hex-encoded SHA-256 hash of the raw HTTP request body.

The JWT must be signed with the Fireblocks API private key and the RS256 (RSASSA-PKCS1-v1\_5 using SHA-256 hash) algorithm.

> **API Authentication code examples:**
>
> Check out the [following](https://github.com/fireblocks/developers-hub/tree/main/authentication_examples) API Authentication code examples

***

# Using the Fireblocks SDKs

You can set up the request headers using the [Fireblocks API SDKs](/reference/sdk-migration-guide):

```javascript theme={"system"}
import { Fireblocks } from "@fireblocks/ts-sdk";
import * as fs from "fs";

// Initialize the Fireblocks SDK
const fireblocks = new Fireblocks({
  apiKey: "your-api-key",
  secretKey: fs.readFileSync("/path/to/your/secret.key", "utf8"),
  basePath: "https://api.fireblocks.io"
});
```

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.base_path import BasePath

# load the secret key content from a file
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

# build the configuration
configuration = ClientConfiguration(
        api_key="your_api_key",
        secret_key=secret_key_value,
        base_path=BasePath.Sandbox, # or set it directly to a string "https://sandbox-api.fireblocks.io/v1"
)

# Enter a context with an instance of the API client
with Fireblocks(configuration) as fireblocks:
    pass
```

```bash theme={"system"}
export FIREBLOCKS_BASE_PATH="https://sandbox-api.fireblocks.io/v1"
export FIREBLOCKS_API_KEY="my-api-key"
export FIREBLOCKS_SECRET_KEY="my-secret-key"
```

> **Fireblocks API key**
>
> When using the above SDK code examples to sign a request, be sure to replace `apiKey` with your own API key.
