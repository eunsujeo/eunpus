> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Select UTXOs

Manual UTXO selection lets you control which unspent transaction outputs (UTXOs) are spent in a transaction, instead of relying on the default selection logic. Use it to send only from UTXOs that match criteria such as label, amount, or address, or to manage funds across multiple clients with precision.

> **Note: Beta endpoints** — The UTXO labeling and listing endpoints, and the `utxoSelectionParams` field on Create Transaction, are in beta and may change. Supported assets: BTC, LTC, DOGE, BCH. To request access, contact your Customer Success Manager.

## How UTXO selection works

UTXO selection has three building blocks. You can use them independently or in combination:

* **Labels** are arbitrary strings you attach to UTXOs (for example, `client-a` or `counterparty`). You can use them later as filter criteria.
* **Filters** narrow a set of UTXOs by label, amount, address, and other attributes. Filters work both in the listing endpoint and inside `utxoSelectionParams` when you create a transaction.
* **Explicit selection** lets you specify exact UTXOs to spend by `txHash` and `vout`.

When you create a transaction with `utxoSelectionParams`, you can pass either filters, an explicit selection, or both. When you pass both, Fireblocks spends the explicit picks first and uses filters to select any additional UTXOs needed to cover the fee, if `fillFeeForSelectedInputs` is set to `true`.

## API reference

| Endpoint                                                                       | Description                                                                                                                                                                                                                                                 |
| :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Label UTXOs — `PATCH /utxo_management/{vaultAccountId}/{assetId}/labels`       |                                                                                                                                                                                                                                                             |
| List UTXOs — `GET /utxo_management/{vaultAccountId}/{assetId}/unspent_outputs` | Paginated, filterable listing of unspent outputs. Filter by labels, amount range, address, status, change/coinbase. Default page size 50, max 250. [Endpoint reference](https://developers.fireblocks.com/reference/list-unspent-outputs)                   |
| Create Transaction — `POST /transactions`                                      | New `utxoSelectionParams` field for server-side UTXO filtering (`filters`) and explicit UTXO picks (`inputSelection`). [Endpoint reference](https://developers.fireblocks.com/reference/create-a-new-transaction)                                           |
| Estimate Transaction Fee — `POST /transactions/estimate_fee`                   | New `utxoSelectionParams` field for server-side UTXO filtering (`filters`) and explicit UTXO picks (`inputSelection`). [Endpoint reference](https://developers.fireblocks.com/api-reference/transactions/estimate-transaction-fee#estimate-transaction-fee) |

## Label UTXOs

Attach or detach labels by identifying UTXOs with `{txHash, vout}` or `{txId}`.

<CodeGroup>
  ```typescript TypeScript theme={"system"}
  import { Fireblocks } from "@fireblocks/ts-sdk";

  const fireblocks = new Fireblocks();

  await fireblocks.utxoManagementBeta.updateUtxoLabels({
    vaultAccountId: "0",
    assetId: "BTC",
    attachDetachUtxoLabelsRequest: {
      utxoIdentifiers: [{ txHash: "abc123...def", vout: 0 }],
      labelsToAttach: ["counterparty"],
    },
  });
  ```

  ```python Python theme={"system"}
  from fireblocks.client import Fireblocks

  fireblocks = Fireblocks()

  fireblocks.utxo_management_beta.update_utxo_labels(
      vault_account_id="0",
      asset_id="BTC",
      attach_detach_utxo_labels_request={
          "utxo_identifiers": [{"tx_hash": "abc123...def", "vout": 0}],
          "labels_to_attach": ["counterparty"],
      },
  ).result()
  ```

  ```java Java theme={"system"}
  Fireblocks fireblocks = new Fireblocks();

  fireblocks.utxoManagementBeta().updateUtxoLabels(
      "0",
      "BTC",
      new AttachDetachUtxoLabelsRequest()
          .utxoIdentifiers(List.of(new UtxoIdentifier().txHash("abc123...def").vout(0)))
          .labelsToAttach(List.of("counterparty")),
      null  // idempotencyKey
  ).get();
  ```
</CodeGroup>

## List UTXOs

Retrieve a paginated list of unspent outputs for a vault account and asset. Filter by labels, amount range, address, status, and change/coinbase.

<CodeGroup>
  ```typescript TypeScript theme={"system"}
  const { data: utxoList } = await fireblocks.utxoManagementBeta.getUtxos({
    vaultAccountId: "0",
    assetId: "BTC",
    includeAnyLabels: ["counterparty"],
  });

  utxoList.data.forEach((utxo) => {
    console.log(utxo.input.txHash, utxo.input.index, utxo.amount, utxo.address);
  });
  ```

  ```python Python theme={"system"}
  api_response = fireblocks.utxo_management_beta.get_utxos(
      vault_account_id="0",
      asset_id="BTC",
      include_any_labels=["counterparty"],
  ).result()

  for utxo in api_response.data.data:
      print(utxo.input.tx_hash, utxo.input.index, utxo.amount, utxo.address)
  ```

  ```java Java theme={"system"}
  ListUtxosResponse utxoList = fireblocks.utxoManagementBeta().getUtxos(
      "0",                // vaultAccountId
      "BTC",              // assetId
      null,               // pageCursor
      null,               // pageSize
      null,               // sort
      null,               // order
      null,               // includeAllLabels
      List.of("counterparty"),  // includeAnyLabels
      null,               // excludeAnyLabels
      null,               // includeStatuses
      null,               // address
      null,               // minAmount
      null,               // maxAmount
      null,               // useChange
      null                // useCoinbase
  ).get().getData();

  for (UtxoOutput utxo : utxoList.getData()) {
      System.out.println(utxo.getInput().getTxHash() + " " + utxo.getInput().getIndex()
          + " " + utxo.getAmount() + " " + utxo.getAddress());
  }
  ```
</CodeGroup>

## Select UTXOs in a transaction

The `utxoSelectionParams` field on Create Transaction has two subfields:

* `filters` — server-side filter criteria. Fireblocks selects UTXOs that match.
* `inputSelection` — an explicit list of UTXOs to spend. Set `fillFeeForSelectedInputs: true` to let Fireblocks add more UTXOs (subject to `filters`) if the selected inputs don't cover the fee.

> **Note:** `utxoSelectionParams` replaces the previous `extraParameters.inputsSelection` field. You can still use `extraParameters.inputsSelection` in requests, but you cannot use both fields together or the transaction will fail.

### Example: Send from labeled UTXOs above a minimum amount

When you manage funds for multiple clients using labels, you can send from UTXOs labeled for specific clients without picking them manually. Filters alone are enough — Fireblocks selects matching UTXOs that cover the transaction amount.

<CodeGroup>
  ```typescript TypeScript theme={"system"}
  import { Fireblocks, TransferPeerPathType } from "@fireblocks/ts-sdk";

  const fireblocks = new Fireblocks();

  const { data: tx } = await fireblocks.transactions.createTransaction({
    transactionRequest: {
      assetId: "BTC",
      amount: "0.5",
      source: { type: TransferPeerPathType.VaultAccount, id: "0" },
      destination: {
        type: TransferPeerPathType.OneTimeAddress,
        oneTimeAddress: { address: "bc1q..." },
      },
      utxoSelectionParams: {
        filters: {
          includeAnyLabels: ["client-a", "client-b"],
          minAmount: "0.1",
        },
      },
    },
  });
  ```

  ```python Python theme={"system"}
  from fireblocks.client import Fireblocks
  from fireblocks.models.transfer_peer_path_type import TransferPeerPathType

  fireblocks = Fireblocks()

  api_response = fireblocks.transactions.create_transaction(
      transaction_request={
          "asset_id": "BTC",
          "amount": "0.5",
          "source": {"type": TransferPeerPathType.VAULT_ACCOUNT, "id": "0"},
          "destination": {
              "type": TransferPeerPathType.ONE_TIME_ADDRESS,
              "one_time_address": {"address": "bc1q..."},
          },
          "utxo_selection_params": {
              "filters": {
                  "include_any_labels": ["client-a", "client-b"],
                  "min_amount": "0.1",
              },
          },
      }
  ).result()
  ```

  ```java Java theme={"system"}
  Fireblocks fireblocks = new Fireblocks();

  TransactionRequest request = new TransactionRequest()
      .assetId("BTC")
      .amount(new TransactionRequestAmount("0.5"))
      .source(new SourceTransferPeerPath()
          .type(TransferPeerPathType.VAULT_ACCOUNT).id("0"))
      .destination(new DestinationTransferPeerPath()
          .type(TransferPeerPathType.ONE_TIME_ADDRESS)
          .oneTimeAddress(new OneTimeAddress().address("bc1q...")))
      .utxoSelectionParams(new UtxoSelectionParams()
          .filters(new UtxoSelectionFilters()
              .includeAnyLabels(List.of("client-a", "client-b"))
              .minAmount("0.1")));

  fireblocks.transactions().createTransaction(request, null, null).get();
  ```
</CodeGroup>

### Example: Drain a specific address and pay fees from another address (same vault)

A common pattern for omnibus vault operators: transfer the full balance of a specific customer address and have the network fee paid by a different address in the same vault (a dedicated "gas station" address). This keeps the customer's transaction clean on the block explorer — no extra fee-related transfers.

The flow:

1. Call List UTXOs filtered by the customer's address to get all their unspent outputs.
2. Sum the UTXO amounts to get the transfer amount.
3. Call Create Transaction with `inputsToSpend` set to those UTXOs and `fillFeeForSelectedInputs: true`. Fireblocks automatically picks additional UTXOs from other addresses in the vault to cover the fee.

Optionally, use `filters` to restrict which UTXOs Fireblocks can pick for fee coverage (for example, only UTXOs labeled `gas-station`).

<CodeGroup>
  ```typescript TypeScript theme={"system"}
  import { Fireblocks, TransferPeerPathType } from "@fireblocks/ts-sdk";

  const fireblocks = new Fireblocks();

  const VAULT_ID = "0";
  const ASSET_ID = "BTC";
  const CUSTOMER_ADDRESS = "bc1q...customer";
  const DESTINATION_ADDRESS = "bc1q...destination";

  // Step 1: List all UTXOs for the customer's address
  const { data: utxoList } = await fireblocks.utxoManagementBeta.getUtxos({
    vaultAccountId: VAULT_ID,
    assetId: ASSET_ID,
    address: CUSTOMER_ADDRESS,
    pageSize: 250,
  });

  const utxos = utxoList.data;
  if (!utxos || utxos.length === 0) {
    throw new Error(`No UTXOs found for address ${CUSTOMER_ADDRESS}`);
  }

  // Step 2: Calculate total amount and build inputsToSpend
  const totalAmount = utxos
    .reduce((sum, u) => sum + parseFloat(u.amount), 0)
    .toString();

  const inputsToSpend = utxos.map((u) => ({
    txHash: u.input.txHash,
    vout: u.input.index,
  }));

  // Step 3: Create transaction — drain the address, fee paid by other UTXOs in the vault
  const { data: tx } = await fireblocks.transactions.createTransaction({
    transactionRequest: {
      assetId: ASSET_ID,
      amount: totalAmount,
      source: { type: TransferPeerPathType.VaultAccount, id: VAULT_ID },
      destination: {
        type: TransferPeerPathType.OneTimeAddress,
        oneTimeAddress: { address: DESTINATION_ADDRESS },
      },
      utxoSelectionParams: {
        inputSelection: {
          inputsToSpend,
          fillFeeForSelectedInputs: true,
        },
        // Optional: restrict fee-covering UTXOs to a labeled pool
        // filters: { includeAllLabels: ["gas-station"] },
      },
    },
  });

  console.log(`Transaction ${tx.id} — status: ${tx.status}`);
  ```

  ```python Python theme={"system"}
  from fireblocks.client import Fireblocks
  from fireblocks.models.transfer_peer_path_type import TransferPeerPathType

  fireblocks = Fireblocks()

  VAULT_ID = "0"
  ASSET_ID = "BTC"
  CUSTOMER_ADDRESS = "bc1q...customer"
  DESTINATION_ADDRESS = "bc1q...destination"

  # Step 1: List all UTXOs for the customer's address
  api_response = fireblocks.utxo_management_beta.get_utxos(
      vault_account_id=VAULT_ID,
      asset_id=ASSET_ID,
      address=CUSTOMER_ADDRESS,
      page_size=250,
  ).result()

  utxos = api_response.data.data
  if not utxos:
      raise Exception(f"No UTXOs found for address {CUSTOMER_ADDRESS}")

  # Step 2: Calculate total amount and build inputs_to_spend
  total_amount = sum(float(u.amount) for u in utxos)
  inputs_to_spend = [
      {"tx_hash": u.input.tx_hash, "vout": u.input.index}
      for u in utxos
  ]

  # Step 3: Create transaction — drain the address, fee paid by other UTXOs in the vault
  api_response = fireblocks.transactions.create_transaction(
      transaction_request={
          "asset_id": ASSET_ID,
          "amount": str(total_amount),
          "source": {"type": TransferPeerPathType.VAULT_ACCOUNT, "id": VAULT_ID},
          "destination": {
              "type": TransferPeerPathType.ONE_TIME_ADDRESS,
              "one_time_address": {"address": DESTINATION_ADDRESS},
          },
          "utxo_selection_params": {
              "input_selection": {
                  "inputs_to_spend": inputs_to_spend,
                  "fill_fee_for_selected_inputs": True,
              },
              # Optional: restrict fee-covering UTXOs to a labeled pool
              # "filters": {"include_all_labels": ["gas-station"]},
          },
      }
  ).result()

  print(f"Transaction {api_response.data.id} — status: {api_response.data.status}")
  ```

  ```java Java theme={"system"}
  import com.fireblocks.sdk.Fireblocks;
  import com.fireblocks.sdk.model.*;
  import java.util.List;
  import java.util.stream.Collectors;

  Fireblocks fireblocks = new Fireblocks();

  String VAULT_ID = "0";
  String ASSET_ID = "BTC";
  String CUSTOMER_ADDRESS = "bc1q...customer";
  String DESTINATION_ADDRESS = "bc1q...destination";

  // Step 1: List all UTXOs for the customer's address
  ListUtxosResponse utxoList = fireblocks.utxoManagementBeta().getUtxos(
      VAULT_ID,           // vaultAccountId
      ASSET_ID,           // assetId
      null,               // pageCursor
      250,                // pageSize
      null,               // sort
      null,               // order
      null,               // includeAllLabels
      null,               // includeAnyLabels
      null,               // excludeAnyLabels
      null,               // includeStatuses
      CUSTOMER_ADDRESS,   // address
      null,               // minAmount
      null,               // maxAmount
      null,               // useChange
      null                // useCoinbase
  ).get().getData();

  List<UtxoOutput> utxos = utxoList.getData();
  if (utxos == null || utxos.isEmpty()) {
      throw new RuntimeException("No UTXOs found for address " + CUSTOMER_ADDRESS);
  }

  // Step 2: Calculate total amount and build inputsToSpend
  double totalAmount = utxos.stream()
      .mapToDouble(u -> Double.parseDouble(u.getAmount()))
      .sum();

  List<UtxoInput> inputsToSpend = utxos.stream()
      .map(u -> new UtxoInput()
          .txHash(u.getInput().getTxHash())
          .vout(u.getInput().getIndex()))
      .collect(Collectors.toList());

  // Step 3: Create transaction — drain the address, fee paid by other UTXOs in the vault
  TransactionRequest request = new TransactionRequest()
      .assetId(ASSET_ID)
      .amount(new TransactionRequestAmount(String.valueOf(totalAmount)))
      .source(new SourceTransferPeerPath()
          .type(TransferPeerPathType.VAULT_ACCOUNT).id(VAULT_ID))
      .destination(new DestinationTransferPeerPath()
          .type(TransferPeerPathType.ONE_TIME_ADDRESS)
          .oneTimeAddress(new OneTimeAddress().address(DESTINATION_ADDRESS)))
      .utxoSelectionParams(new UtxoSelectionParams()
          .inputSelection(new UtxoInputSelection()
              .inputsToSpend(inputsToSpend)
              .fillFeeForSelectedInputs(true))
          // Optional: restrict fee-covering UTXOs to a labeled pool
          // .filters(new UtxoSelectionFilters().includeAllLabels(List.of("gas-station")))
      );

  CreateTransactionResponse tx = fireblocks.transactions()
      .createTransaction(request, null, null).get().getData();

  System.out.printf("Transaction %s — status: %s%n", tx.getId(), tx.getStatus());
  ```
</CodeGroup>

Key points:

* `fillFeeForSelectedInputs: true` tells Fireblocks to use the specified UTXOs for the transfer amount, and to automatically select additional UTXOs from the vault to cover the network fee.
* Without this flag, if the specified UTXOs don't have enough to cover both the amount and the fee, the transaction fails.

## Field reference

| Field                                | Used in                                   | Description                                                                                                                                                     |
| :----------------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `utxoIdentifiers`                    | Label UTXOs                               | Array identifying the UTXOs to label. Each entry is `{txHash, vout}` or `{txId}`.                                                                               |
| `labelsToAttach`                     | Label UTXOs                               | Array of label strings to attach to the identified UTXOs.                                                                                                       |
| `labelsToDetach`                     | Label UTXOs                               | Array of label strings to detach from the identified UTXOs.                                                                                                     |
| `txHash / vout`                      | UTXO identifiers                          | `txHash` is the transaction hash; `vout` is the output index within that transaction. `txId` is accepted as an alternative identifier in labeling requests.     |
| `includeAllLabels`                   | List UTXOs, `utxoSelectionParams.filters` | Array of labels. Matches UTXOs that carry **all** of the listed labels (AND logic). Use when you need every label to be present.                                |
| `includeAnyLabels`                   | List UTXOs, `utxoSelectionParams.filters` | Array of labels. Matches UTXOs that carry **at least one** of the listed labels (OR logic).                                                                     |
| `excludeAnyLabels`                   | List UTXOs, `utxoSelectionParams.filters` | Array of labels. Excludes UTXOs that carry any of the listed labels.                                                                                            |
| `utxoSelectionParams`                | Create Transaction                        | Container for UTXO selection criteria. Replaces `extraParameters.inputsSelection`.                                                                              |
| `utxoSelectionParams.filters`        | Create Transaction                        | Server-side filter criteria. Supported sub-fields include `address`, `minAmount`, `includeAllLabels`, and `includeAnyLabels`.                                   |
| `utxoSelectionParams.inputSelection` | Create Transaction                        | Explicit UTXO picks. Spent first, before any filter-based selection.                                                                                            |
| `inputsToSpend`                      | `inputSelection`                          | Array of UTXOs to spend explicitly. Each entry is `{txHash, vout}`.                                                                                             |
| `fillFeeForSelectedInputs`           | `inputSelection`                          | When `true`, Fireblocks adds more UTXOs (subject to `filters`) if the explicit selection doesn't cover the fee. Requires at least one entry in `inputsToSpend`. |
