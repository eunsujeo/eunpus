> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Resend Webhook Notifications

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

Fireblocks customers can resend webhook notifications that were missed by their server by using the following API endpoints:

* [Resend failed webhooks](/reference/resendwebhooks) - Resends all failed webhook notifications
* [Resend webhooks for a transaction by ID](/reference/resendtransactionwebhooks) - Resends webhook notifications for a transaction by its unique identifier

# Resend all failed webhook notifications

The following command re-sends **all** the failed webhooks pending the backoff retry mechanism being re-sent.

```javascript theme={"system"}
const result = await fireblocks.resendWebhooks();
```

```python theme={"system"}
result = fireblocks.resend_webhooks()
```

* The above command returns `webhookCount`, which is the number of re-sent webhook notifications.

# Resend missed notifications for a specific transaction

Use the following command to resend a missing webhook notification per specific transaction:

```javascript theme={"system"}
const result = await fireblocks.resendTransactionWebhooksById(txId, resendCreated, resendStatusUpdated);
```

```python theme={"system"}
result = fireblocks.resend_transaction_webhooks_by_id(txId, resend_created, resend_status_updated)
```

> Returns 200 on success
