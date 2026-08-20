> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Java SDK

<Note>
  **Install the Fireblocks Documentation MCP first.** Whether you're using an AI assistant or not, this makes it easy to search, reference, and keep your Fireblocks work grounded in the official docs. The setup steps are in [Getting Started](/docs/quickstart).
</Note>

# Overview

Java developers can use [the official Fireblocks Java SDK](https://github.com/fireblocks/java-sdk) to interact with the Fireblocks API. Instructions for setup and usage can be found in the repo's README.md file.

# Using the Fireblocks Java SDK

Building the API client library requires:

1. Java 11+
2. Maven/Gradle

## Installation

To install the API client library to your local Maven repository, execute:

```bash theme={"system"}
mvn clean install
```

To deploy it to a remote Maven repository instead, configure the settings of the repository and execute:

```bash theme={"system"}
mvn clean deploy
```

Refer to the [OSSRH Guide](http://central.sonatype.org/pages/ossrh-guide.html) for more information.

### Maven users

Add this dependency to your project's POM:

```xml theme={"system"}
<dependency>
  <groupId>com.fireblocks.sdk`</groupId>`
  <artifactId>fireblocks-sdk`</artifactId>`
  <version>0.0.0`</version>`
  <scope>compile`</scope>`
`</dependency>`
```

### Gradle users

Add this dependency to your project's build file:

```groovy theme={"system"}
compile "com.fireblocks.sdk:fireblocks-sdk:0.0.0"
```

### Others

At first, generate the JAR by executing:

```bash theme={"system"}
mvn clean package
```

Then manually install the following JARs:

* `target/fireblocks-sdk-0.0.0.jar`
* `target/lib/*.jar`

## Getting Started

### Initiate Fireblocks Client

You can initialize the Fireblocks SDK in two ways: either by setting environment variables or by providing the parameters directly:

**Using Environment Variables**
You can initialize the SDK using environment variables from your .env file or by setting them programmatically.

> **Use the correct API Base URL**
>
> In the following script, make sure you're using the correct value for `FIREBLOCKS_BASE_PATH` for your environment:
>
> * For Sandbox workspaces: `https://sandbox-api.fireblocks.io`
> * For US Mainnet or Testnet workspaces: `https://api.fireblocks.io`
> * For EU Mainnet or Testnet workspaces: `https://eu-api.fireblocks.io`
> * For EU2 Mainnet or Testnet workspaces: `https://eu2-api.fireblocks.io`
>
> [Learn more about workspace differences](doc:workspace-environments).

Use bash commands to set environment variables:

```bash theme={"system"}
export FIREBLOCKS_BASE_PATH="https://sandbox-api.fireblocks.io/v1"
export FIREBLOCKS_API_KEY="my-api-key"
export FIREBLOCKS_SECRET_KEY="my-secret-key"
```

Execute the following Java code:

```java theme={"system"}
import com.fireblocks.sdk.Fireblocks;
import com.fireblocks.sdk.ConfigurationOptions;

ConfigurationOptions configurationOptions = new ConfigurationOptions();
Fireblocks fireblocks = new Fireblocks(configurationOptions);
```

**Providing Local Variables**
Alternatively, you can directly pass the required parameters when initializing the Fireblocks API instance:

```java theme={"system"}
import com.fireblocks.sdk.BasePath;
import com.fireblocks.sdk.Fireblocks;
import com.fireblocks.sdk.ConfigurationOptions;

ConfigurationOptions configurationOptions = new ConfigurationOptions()
    .basePath(BasePath.Sandbox)
    .apiKey("my-api-key")
    .secretKey("my-secret-key");
Fireblocks fireblocks = new Fireblocks(configurationOptions);
```

## Examples

### Creating a Vault Account

```java theme={"system"}
CreateVaultAccountRequest request = new CreateVaultAccountRequest().name("My Vault Account");
String idempotencyKey = Integer.toString(new Random().nextInt()); // String | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours.
// Async request
CompletableFuture<VaultAccount> response = fireblocks.vaults().createVaultAccount(request, idempotencyKey);
// Waiting for the request
VaultAccount vaultAccount = response.get();
```

### Retrieving Vault Accounts

```java theme={"system"}
BigDecimal limit = new BigDecimal(10);
CompletableFuture<VaultAccountsPagedResponse> response = fireblocks.vaults().getPagedVaultAccounts(null, null, null, null, null, null, null, limit);
VaultAccountsPagedResponse vaultAccountsPagedResponse = response.get();
```

### Creating a Transaction

```java theme={"system"}
TransactionRequest transactionRequest = new TransactionRequest()
    .operation(TransactionOperation.TRANSFER)
    .source(new TransferPeerPath()
        .type(TransferPeerPath.TypeEnum.VAULT_ACCOUNT)
        .id("0"))
    .destination(new DestinationTransferPeerPath()
        .type(DestinationTransferPeerPath.TypeEnum.VAULT_ACCOUNT)
        .id("1"))
    .amount(new TransactionRequestAmount("0.001"))
    .assetId("ETH_TEST3"); // Ethereum Goerli testnet
    .note("My first Java transaction!");
String idempotencyKey = Integer.toString(new Random().nextInt()); // String | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours.
CompletableFuture<CreateTransactionResponse> response = fireblocks.transactions().createTransaction(transactionRequest, null, idempotencyKey);
CreateTransactionResponse transactionResponse = response.get();
String txId = transactionResponse.getId();
```
