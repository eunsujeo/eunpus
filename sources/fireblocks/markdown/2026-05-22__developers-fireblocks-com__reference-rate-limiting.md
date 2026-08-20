> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Rate Limiting

# Overview

Fireblocks strives to offer a stable and secure platform at all times. Accordingly, API call traffic is continuously monitored by all parties to identify patterns that might affect the network. API rate limits assure that a single client can't overload the system for other clients.

Error responses with HTTP status code **429** indicate that rate limits have been temporarily exceeded.

If normal test or production operations repeatedly result in rate limiting, you can contact your [Customer Success Manager](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=6947882197532) or [Fireblocks Support.](https://support.fireblocks.io/hc/en-us/requests/new).

API rate limits are set at the API user level. If you regularly receive HTTP 429 responses, do your best to limit the rate of requests, spread them out across minute intervals, or spread them out across multiple API users.

Some **common mistakes** that can result in receiving many API rate limit errors are:

* Not monitoring 429 errors on the client
* Retry API calls whenever they fail without noticing the error type - causing an escalation in rate limits
* Using too many parallel processes for batch operations
* Monitoring many transactions via polling instead of using webhooks
* Excessively checking gas prices or token prices

Rate limits for traffic are based on a per API endpoint and per minute basis.

### Rate limit error response

If you reach your rate limit, you'll see a 429 error response to let you know your rate limit has been exceeded.

### Increasing your rate limit

If you would like to raise your rate limits, please contact your Customer Success Manager or [Fireblocks support](mailto:support@fireblocks.com).

**Note:** Not all requests to increase rate limits will be honored, and additional charges may apply for higher limits.

***

# Best Practices

**Monitor rate limit errors** - if you receive 429 errors more than a handful of times a day - something is probably not done properly. Consider what change in the solution architecture can reduce the number of API calls you are making.

**Retry API calls reasonably** - If you are calling an API periodically - consider not retrying and relying on the next time it will be checked. Additional, an exponential backoff retry strategy is recommended when it is required to try again.

**Use Webhooks to monitor applications** - using push notifications and webhooks will dramatically reduce the number of API calls you need to make for standard operations. It will reduce the load on both your internal system and the Fireblocks backed.

**Use Cache** - Some elements do not need to be checked on every transaction or every second - consider using cache for data points that you only need to update periodically.

> **Note**
>
> Developer Sandbox workspaces have a very low rate limit configuration and so you might see many rate limit errors if you try to test for scale.
>
> The Developer Sandbox workspace was not meant for that level of testing, so you should use a Testnet workspace. Testnet environment rate limits are more flexible and handle large amounts of requests for testing.
