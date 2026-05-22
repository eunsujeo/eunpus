> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# API Idempotency

The Fireblocks API supports idempotent requests (multiple requests which have the same result as making a single request). This is helpful when you don’t get a response or the API call isn’t completed successfully.

## Idempotency key

> **Notes**
>
> * You can use idempotency keys with **POST** requests. Using `Idempotency-Key` in your request header for **GET** and **DELETE** will not work as they are inherently idempotent.
> * The \`\` value in your idempotent request can have a maximum of 40 characters.

To submit an idempotent request, you must add `Idempotency-Key: ` to the header of your POST request.
Resubmission of the same request with the same idempotency key will not trigger the same operation, but will instead return the original response. This ensures a transaction request with the same idempotency key is not executed multiple times if you try to re-submit it due to network errors or delays experienced for a prior submission.
Fireblocks stores the responses for all requests with the `Idempotency-Key` header and resends them for every request with the same idempotency key for 24 hours. After 24 hours, you will need a new key.

## Transaction Idempotency

When creating transactions, Fireblocks strongly recommends using the `externalTxId` parameter in the [Create Transaction API](/reference/create-transactions) call. This parameter ensures that the transaction is idempotent. If another transaction request is made with the same `externalTxId` value, it will be rejected with an HTTP 400 code an [error message](/reference/api-responses#:~:text=for%20Kraken%20exchange-,1438,-400) .
Learn more about the `externalTxId` parameter [here](/docs/manage-withdrawals-at-scale#idempotent-transactions)
