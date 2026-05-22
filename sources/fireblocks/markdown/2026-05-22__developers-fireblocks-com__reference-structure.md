> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Structure

Overview of the structure of the Fireblocks retail demo application, including the database models and the business-logic services.

## Database Models

<img src="https://mintcdn.com/fireblocks-43c4b3ee/FiflkT4_8XrCBz_e/images/docs/b09a4e7b5f71e2350cca6d66fe1cd00bb7cc9fd588d61d9b0c958fd244b7e5d6-image.png?fit=max&auto=format&n=FiflkT4_8XrCBz_e&q=85&s=9632ae1ea656bcedcc8c57246205f869" alt="" width="2385" height="1676" data-path="images/docs/b09a4e7b5f71e2350cca6d66fe1cd00bb7cc9fd588d61d9b0c958fd244b7e5d6-image.png" />

### User

Represents a user of the application.

**Columns**: id (PK), email, name, googleId, githubId, password, wallet (FK)

### Wallet

Represents a user's wallet.

**Columns**: id (PK), name, user (FK), assets (FK), transactions (FK), assetBalances (FK), description

### Asset

Represents a cryptocurrency asset.

**Columns**: id (PK), assetId, assetName, address, isSwept, balance, vaultAccount (FK), wallet (FK)

### Transaction

Represents a cryptocurrency transaction.

**Columns**: id (PK), assetId, status, fireblocksTxId, txHash, amount, isSweeping, wallet (FK), sourceVaultAccount (FK), destinationVaultAccount (FK), sourceExternalAddress, destinationExternalAddress, outgoing, createdAt

### VaultAccount

Represents a Fireblocks vault account.

**Columns**: id (PK), fireblocksVaultId, name, assets (FK), balance, sourceTransactions (FK), destinationTransactions (FK)

### WalletAssetBalance

Represents the balance of an asset in a wallet.

**Columns**: id (PK), wallet (FK), assetId, totalBalance, incomingPendingBalance, outgoingPendingBalance

### SupportedAssets

Represents the list of the assets supported by the demo application.

**Columns**: id (PK), explorerUrl, fireblocksAssetId, depositCounter, name

<img src="https://mintcdn.com/fireblocks-43c4b3ee/FiflkT4_8XrCBz_e/images/docs/5972222ddc68ed3012a4e58fcb6730fd1ce345b78b0a93a1d034e2f10cfa9532-image.png?fit=max&auto=format&n=FiflkT4_8XrCBz_e&q=85&s=5ed6025a357036d19c10dfc44dad833c" alt="" width="2259" height="1769" data-path="images/docs/5972222ddc68ed3012a4e58fcb6730fd1ce345b78b0a93a1d034e2f10cfa9532-image.png" />

## Services

### [AuthService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/auth.service.ts)

Handles user authentication and creation.

**Description**: The AuthService provides the functionality for user authentication and log in with email & password / GoogleOAuth2 / GitHub userId.

### [AssetService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/asset.service.ts)

Handles balance updates for users' asset records and tracks which assets have already been swept to Omnibus.

### [WalletService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/wallet.service.ts)

Manages wallet-related operations.

### [VaultService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/vault.service.ts)

Interacts with Fireblocks vault accounts.

### [TransactionService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/transaction.service.ts)

Handles transaction-related operations and updates users' transaction records on the database.

### [ApiClient](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/fireblocks/api.client.ts)

Handles the initialization of a Fireblocks API Client using environment variables.

**Description**: This service handles the creation of the Fireblocks API Client, which the app uses to interact with the Fireblocks API gateway.\
For more information on SDK initialization, check the [TypeScript SDK guide](/reference/typescript-sdk#your-first-fireblocks-typescript-code-example).\
The ApiClient also introduces two important concepts when working with the Fireblocks API:\
a. [Idempotent Requests ](/reference/api-idempotency)\
b. [Rate Limits](/reference/rate-limiting)

### [FireblocksTransactionService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/fireblocks/transaction.service.ts)

Interacts with Fireblocks API for transaction creation and processing.\
**Description**: This service wraps the primary endpoints of the Fireblocks SDK to provide the required transaction-related functionality for the demo app.\
For more information on these endpoints, check the [Transaction section](/reference/gettransactions) on our API documentation.\
It also introduces the important concept of the *externalTxId* parameter, which is used for unique transaction identification and ensures transactions are idempotent forever.\
Learn more in the [Manage Withdrawals guide](/docs/manage-withdrawals-at-scale#idempotent-transactions).

### [FireblocksVaultAccountService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/fireblocks/vaultAccount.service.ts)

Interacts with Fireblocks API for vault account-related operations.\
**Description**: This service wraps several endpoints of the Fireblocks SDK and provides vault account-related functionality to the demo application. It manages vault account creation and updates, as well as asset wallet and deposit address creation for users on the Fireblocks workspace.\
For more information on these endpoints, check the [Vaults section](/reference/createvaultaccount) on our API documentation.\
Also, useful information about your vault structure can be found in the [Manage Deposits guide](/docs/manage-deposits-at-scale).

### [ConsolidationService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/consolidation.service.ts)

Manages UTXO asset deposits, monitors their count, and initiates UTXO consolidations in the omnibus vault account\
**Description**: This service handles all the UTXO asset deposit consolidation functionality. It will update the deposit counter for each supported UTXO asset per deposit and will trigger a consolidation Tx to burn small unspent inputs on the omnibus wallet to allow high withdrawal availability for users. Additionally, the service has an automated job that runs periodically to act as a backup to the deposit-triggered process and prevent a situation where more than 250 UTXOs are stored in the omnibus wallet.\
For more information, check the [Consolidate UTXOs guide](/reference/consolidate-utxos).

### [FeeService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/fee.service.ts)

Handles the functionality to obtain the Tx fee estimations from Fireblocks API and calculates the required fee for a withdrawal Tx.\
For more information, check the [Estimate Transaction Fee guide](/reference/estimate-transaction-fee).

### [SweepingService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/sweeping.service.ts)

Handles the functionality for sweeping account-based asset deposits from intermediate deposit vault accounts to the omnibus vault account.\
**Description**: This service acts as a job that runs periodically and checks for balances in the intermediate deposit vault accounts created for users. Once a balance above the sweeping threshold is found, a sweeping Tx is triggered to accumulate all user deposits of account-based assets into the omnibus vault account.\
For more information, check the [Sweep to Omnibus guide](/reference/sweep-to-omnibus-1).

### [WebhookService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/webhook.service.ts)

Handles balance updates for user deposits based on the webhooks events sent from Fireblocks.\
Learn more about Fireblocks webhooks in the [Configure Webhooks guide](/reference/configure-webhook-urls).

### [WebSocketService](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/websocket.service.ts)

Manages real-time communication with the front end.
