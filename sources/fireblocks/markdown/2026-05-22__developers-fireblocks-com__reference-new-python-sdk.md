> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Python SDK

<Note>
  **Install the Fireblocks Documentation MCP first.** Whether you're using an AI assistant or not, this makes it easy to search, reference, and keep your Fireblocks work grounded in the official docs. The setup steps are in [Getting Started](/docs/quickstart).
</Note>

# Overview

A Python developer can use the Fireblocks API easily with the official Python SDK:

* [The Fireblocks Python SDK.](https://github.com/fireblocks/py-sdk)

In this guide, you'll set up the Fireblocks Python SDK and see an example of a basic API script to create a vault and print its data.

Additionally if you are developing on EVM chains - you might be using some of the familiar library, such as `web3.py` - Fireblocks is well integrated into these libraries as described in the [Local JSON RPC guide](/reference/evm-local-json-rpc).

# Using the Fireblocks SDK

## Install Python 3.8 or newer

The Fireblocks Python SDK requires **Python 3.8 or newer**. You can check which version of Python you already have installed with the following command.

`python --version` or `python3 --version`

[Learn how to install or update Python to a newer version.](https://docs.python-guide.org/starting/installation/)

## Install py-sdk

The Fireblocks Python SDK is open-source and hosted on both GitHub and PIP, the official package repository.

* **Source code:** [Fireblocks GitHub](https://github.com/fireblocks/py-sdk)
* **Python Package:** [Pypi](https://pypi.org/project/fireblocks/)

Installing the latest SDK is easy with `pip`:

`pip install fireblocks`

## Your First Fireblocks Python script!

> **Use the correct API Base URL**
>
> Make sure you're using the correct value for the API base URL for your environment:
>
> ```
> from fireblocks.base_path import BasePath
> ```
>
> * For Sandbox workspaces: `BasePath.Sandbox`
> * For US Mainnet or Testnet workspaces: `BasePath.US`
> * For EU Mainnet or Testnet workspaces: `BasePath.EU`
> * For EU2 Mainnet or Testnet workspaces: `BasePath.EU2`

### Import

For this basic example, we should import the following from the fireblocks module:

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.base_path import BasePath
from fireblocks.models.create_vault_account_request import CreateVaultAccountRequest
from pprint import pprint
```

### Load your API Secret and API key

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.base_path import BasePath
from fireblocks.models.create_vault_account_request import CreateVaultAccountRequest
from pprint import pprint

my_api_key="your_api_key"
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()
```

### Build the configuration

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.base_path import BasePath
from fireblocks.models.create_vault_account_request import CreateVaultAccountRequest
from pprint import pprint

my_api_key="your_api_key"
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

configuration = ClientConfiguration(
        api_key=my_api_key,
        secret_key=secret_key_value,
        base_path=BasePath.US
)
```

### Create a new vault account

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.base_path import BasePath
from fireblocks.models.create_vault_account_request import CreateVaultAccountRequest
from pprint import pprint

my_api_key="your_api_key"
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

configuration = ClientConfiguration(
        api_key=my_api_key,
        secret_key=secret_key_value,
        base_path=BasePath.Sandbox
)

with Fireblocks(configuration) as fireblocks:
    create_vault_account_request: CreateVaultAccountRequest = CreateVaultAccountRequest(
                                    name='My First Vault Account',
                                    hidden_on_ui=False,
                                    auto_fuel=False
                                    )
    try:
        # Create a new vault account
        future = fireblocks.vaults.create_vault_account(create_vault_account_request=create_vault_account_request)
        api_response = future.result()  # Wait for the response
        print("The response of VaultsApi->create_vault_account:\n")
        pprint(api_response.data.to_json())
    except Exception as e:
        print("Exception when calling VaultsApi->create_vault_account: %s\n" % e)
```
