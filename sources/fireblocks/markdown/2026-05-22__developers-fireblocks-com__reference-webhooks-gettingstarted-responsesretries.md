> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Responses & retries

The Fireblocks server will look for a response to confirm the webhook notification was received. All webhook events should receive an HTTP 200 (OK) response.

If no response is received, Fireblocks will resend the 5xx request several more times. The retry schedule (in seconds) follows an exponential backoff of 10, 30, 120, 300, 900, 1800, 3600, 7200, and 14400.

## Retries for 4xx errors

Fireblocks will not attempt to retry sending webhook notifications for client-side errors (HTTP 4xx) except for the following cases:

* **429 - Too Many Requests**: Indicates rate limits have been exceeded.
* **408 - Request Timeout**: Indicates the server took too long to respond.

After a total of 10 failed attempts, the notification will be marked as failed, and no further retries will be made.

***
