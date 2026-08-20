> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Python SDK (Legacy)

> **We released our new official Python SDK! Make sure to check it out in the Python SDK guide**

# Overview

A Python developer can use the Fireblocks API in 2 different ways:

1. [The Fireblocks Python SDK.](https://github.com/fireblocks/fireblocks-sdk-py)
2. A standard HTTP library such as [http.client](https://docs.python.org/3/library/http.client.html) or [Requests](https://requests.readthedocs.io/en/latest/).

In this guide, you'll set up the Fireblocks SDK and see an example of non-SDK usage (including signing the JWT token).

# Using the Fireblocks SDK

## Install Python 3.6 or newer

The Fireblocks Python SDK requires **Python 3.6 or newer**. You can check which version of Python you already have installed with the following command.

`python --version` or `python3 --version`

[Learn how to install or update Python to a newer version.](https://docs.python-guide.org/starting/installation/)

## Install fireblocks-sdk

The Fireblocks Python SDK is open-source and hosted on both GitHub and PIP, the official package repository.

* **Source code:** [https://github.com/fireblocks/fireblocks-sdk-py](https://github.com/fireblocks/fireblocks-sdk-py)
* **Python Package:** [https://pypi.org/project/fireblocks-sdk/](https://pypi.org/project/fireblocks-sdk/)

Installing the latest SDK is easy with `pip`:

`pip install fireblocks-sdk`

## Your First Fireblocks Python script!

Now that you're set up, run a quick check for the API. The script will query existing vaults, create a new vault and then query again to see that the vaults were created.

The requests-based implementation will require some library dependencies:

* [requests](https://requests.readthedocs.io/en/latest/)
* [pyjwt](https://pyjwt.readthedocs.io/en/stable/)

> **Use the correct API Base URL**
>
> Depending on the script, make sure you're using the correct value for `base_url` for your environment:
>
> * For Sandbox workspaces: `https://sandbox-api.fireblocks.io`
> * For Mainnet or Testnet workspaces: `https://api.fireblocks.io`

```python theme={"system"}
from fireblocks_sdk import FireblocksSDK, VAULT_ACCOUNT, PagedVaultAccountsRequestFilters
import json

api_secret = open('`</path/to/fireblocks_secret.key>`', 'r').read()
api_key = '<your-api-key-here>'
base_url = 'https://sandbox-api.fireblocks.io' # Choose the right api url for your workspace type
fireblocks = FireblocksSDK(api_secret, api_key, api_base_url=base_url)

# Print vaults before creation
vault_accounts = fireblocks.get_vault_accounts_with_page_info(PagedVaultAccountsRequestFilters())
print(json.dumps(vault_accounts, indent = 1))

# Create new vault
vault_account = fireblocks.create_vault_account(name = "Quickstart_Vault")

# Print vaults after creation
vault_accounts = fireblocks.get_vault_accounts_with_page_info(PagedVaultAccountsRequestFilters())
print(json.dumps(vault_accounts, indent = 1))
```

```python theme={"system"}
import json
import math
import secrets
import time
import urllib.parse
from hashlib import sha256

import jwt
import requests

class FireblocksRequestHandler(object):
    def __init__(self, base_url, private_key, api_key):
        self.base_url = base_url
        self.private_key = private_key
        self.api_key = api_key

    def _sign_jwt(self, path, body_json=""):
        timestamp = time.time()
        nonce = secrets.randbits(63)
        timestamp_secs = math.floor(timestamp)
        path = path.replace("[", "%5B")
        path = path.replace("]", "%5D")
        token = {
            "uri": path,
            "nonce": nonce,
            "iat": timestamp_secs,
            "exp": timestamp_secs + 55,
            "sub": self.api_key,
            "bodyHash": sha256(json.dumps(body_json).encode("utf-8")).hexdigest()
        }
        return jwt.encode(token, key=self.private_key, algorithm="RS256")

    def get_request(self, path):
        token = self._sign_jwt(path)
        headers = {
            "X-API-Key": self.api_key,
            "Authorization": f"Bearer {token}"
        }

        return requests.get(urllib.parse.urljoin(self.base_url, path), headers=headers)

    def post_request(self, path, body_json={}):
        token = self._sign_jwt(path, body_json)
        headers = {
            "X-API-Key": self.api_key,
            "Authorization": f"Bearer {token}"
        }

        response = requests.post(urllib.parse.urljoin(self.base_url, path), json=body_json, headers=headers)
        return response

api_secret = open('`</path/to/fireblocks_secret.key>`', 'r').read()
api_key = '<your-api-key-here>'
base_url = 'https://sandbox-api.fireblocks.io' # Choose the right api url for your workspace type
request_handler = FireblocksRequestHandler(base_url, api_secret, api_key)

# Print vaults before creation
response = request_handler.get_request('/v1/vault/accounts_paged')
print(response.text)

# Create new vault
response = request_handler.post_request('/v1/vault/accounts', body_json={'name': 'Quickstart_Vault'})
print(response.text)

# Print vaults after creation
response = request_handler.get_request('/v1/vault/accounts_paged')
print(response.text)
```
