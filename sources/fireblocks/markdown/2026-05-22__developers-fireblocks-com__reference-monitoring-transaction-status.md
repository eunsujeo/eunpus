> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Monitoring Transaction Statuses

# Overview

Fireblocks posts several transaction statuses and sub-status messages while a transaction is progressing and based on the asset type. For example:

* UTXO-based assets: A notification of an incoming transaction is created when the transaction is present in the mempool.
* Account-based assets: A notification of an incoming transaction is created when the transaction is mined.

The best practice is to use webhooks to receive these status updates and populate your front-end or back-end as the transaction progresses.

***

# Webhook examples - best practice

If you've installed a webhook server inside your environment and configured it in your workspace, following the [Webhooks guide](/reference/configure-webhook-urls) , you'll now receive push notifications for transactions created or other workspace notifications.

On your webhook server, you can trigger additional behaviors with the code you place for the response to the webhook event post message your server got, basing it on the Transaction ID.

Your webhook server notification includes the primary status of the transaction and its sub-status.

[See a full list of the transaction statuses and sub-statuses.](/reference/statuses)

## Basic example

The example below shows how the `app.post` function, which is a part of our basic example for a Webhooks server, responds to the Console with the transaction ID, status, and sub-status details received inside the Webhook.

```javascript theme={"system"}
app.post( '/', ( req, res ) => {
    console.log( '********************* received webhook ******************');
    console.log( 'Transaction ID:', req.body.data.id);
    console.log( 'Transaction Sub Status:', req.body.data.subStatus);
    console.log( 'Transaction Status:', req.body.data.status );
    res.sendStatus( 200 )
} );
```

```python theme={"system"}
class SimpleRequest:
  def on_post(self, req, resp):
    request = json.loads(req.body.decode("utf-8"))
    print("********************* received webhook ******************")
    print("Transaction ID:", request["id"])
    print("Transaction Sub Status:", request["subStatus"])
    print("Transaction Status:", request["status"])
    resp.status = falcon.HTTP_200

app.add_route('/', SimpleRequest())
```

### Act on transaction success example

The example below shows how the `app.post` function responds with a call to an example backend function to report the failure and provide the details around it.

```javascript theme={"system"}
app.post( '/', ( req, res ) => {
    console.log( '********************* received webhook ******************');
		 if (req.body.data.status === TransactionStatus.BLOCKED || tx.status === TransactionStatus.CANCELLED || tx.status === TransactionStatus.FAILED) {
            failedTx(req.body.data.id);
     }
    res.sendStatus( 200 )
} );
```

```python theme={"system"}
class SuccessfulRequest:
  def on_post(self, req, resp):
    request = json.loads(req.body.decode("utf-8"))
    if request["status"] in (TRANSACTION_STATUS_BLOCKED, TRANSACTION_STATUS_FAILED, TRANSACTION_STATUS_CANCELLED):
      failed_tx([request["id"])
    resp.status = falcon.HTTP_200

app.add_route('/', SuccessfulRequest())
```

### Act on transaction failure example

[See examples of transaction failures and how to handle them.](/reference/api-error-codes)

> **Learn more about Balance Validation in the following guide**

***

# Non-production monitoring example

If you have not yet configured a webhook and would like to monitor transaction status on your non-production environment, you can use the example below which regularly calls the Fireblocks [Find a specific transaction](/reference/gettransaction) endpoint to get the status.

The example below calls the `getTransactionById` function with the transaction ID as its parameter (`txId`) and continuously polls for status change in a fixed interval, returning an error if it is not finalized with the completed status.

```javascript theme={"system"}
const getTxStatus = async (
  txId: string,
): Promise<TransactionStateEnum | string> => {
  try {
    let response: FireblocksResponse<TransactionResponse> =
      await fireblocks.transactions.getTransaction({ txId });
    let tx: TransactionResponse = response.data;
    let messageToConsole: string = `Transaction ${tx.id} is currently at status - ${tx.status}`;

    if (!tx) {
      return "Transaction does not exist";
    }

    console.log(messageToConsole);
    while (tx.status !== TransactionStateEnum.Completed) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      response = await fireblocks.transactions.getTransaction({ txId });
      tx = response.data;

      switch (tx.status) {
        case TransactionStateEnum.Blocked:
        case TransactionStateEnum.Cancelled:
        case TransactionStateEnum.Failed:
        case TransactionStateEnum.Rejected:
          throw new Error(
            `Signing request failed/blocked/cancelled: Transaction: ${tx.id} status is ${tx.status}`,
          );
        default:
          console.log(messageToConsole);
          break;
      }
    }

    return tx.status;
  } catch (error) {
    throw error;
  }
};

getTxStatus("<SOME_TX_ID>");
```

```javascript theme={"system"}
async function getTxStatus(txId){
    let tx = await fireblocks.getTransactionById(txId);
    console.log('TX ' + tx.id + ' is currently at status - '+ tx.status);
    while (tx.status !== TransactionStatus.COMPLETED) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        tx = await fireblocks.getTransactionById(txId);
        if (tx.status === TransactionStatus.BLOCKED || tx.status === TransactionStatus.CANCELLED || tx.status === TransactionStatus.FAILED) {
            throw new Error("Signing request failed.");
        }
        console.log('TX ' + tx.id + ' is currently at status - '+ tx.status);
    }
}
```

```python theme={"system"}
def get_tx_status(tx_id) -> dict:
   timeout = 0
   current_status = fireblocks.get_transaction_by_id(tx_id)[STATUS_KEY]
   while current_status not (TRANSACTION_STATUS_COMPLETED):
       print(f"TX [{tx_id}] is currently at status - {current_status} {'.' * (timeout % 3)}                ",
             end="\r")
       time.sleep(3)
       current_status = fireblocks.get_transaction_by_id(tx_id)[STATUS_KEY]
       timeout += 1
```

> **Rate limits with monitoring:**
>
> Rate limits can affect monitoring. Use webhooks whenever possible to minimize the number of API calls made against your rate limits. More information at [Working with Rate Limits](doc:rate-limits) .
>
> This method also allows you to scale monitoring for more transactions as you build your business, without affecting your ability to actually process more transactions.
