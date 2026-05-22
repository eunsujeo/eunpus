> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

Webhooks allow your application to react to real-time events in your Fireblocks workspace, such as deposits, withdrawals, transaction status changes, and more by delivering structured event data directly to your servers as they happen.

They are ideal for automating operational workflows, keeping systems in sync, and reducing the need for manual processes or inefficient polling.

Fireblocks webhooks are particularly useful for:

* Triggering internal workflows on deposit confirmations or transaction completions
* Integrating with external systems such as CRMs, compliance tools, or accounting platforms
* Creating custom alerts for specific event types

Instead of continuously polling Fireblocks APIs, webhooks provide a more scalable, responsive, and performant way to receive updates as soon as they occur.

***

## Why use Fireblocks Webhooks V2?

With Webhooks V2, Fireblocks offers a modern, reliable event delivery system with advanced controls:

* **Event catalog & subscriptions:** Browse the event catalog and subscribe only to the categories or specific event types relevant to your use case. This lets you focus on the events you need, reduce unnecessary processing, and maintain a cleaner integration.
* **Resend events up to 30 days:** Missed an event? You can programmatically resend notifications for up to 30 days after the original event occurred.
* **Improved retry mechanism:** Failed webhook deliveries are retried over an extended period using exponential backoff, increasing the chance of successful delivery even during outages.
* **Structured notification format:** Webhooks are delivered in a consistent format that includes metadata, a resource identifier, and a timestamp, making integration straightforward and predictable.

***

## Webhooks vs. polling

Polling APIs involves repeatedly asking Fireblocks, “Has anything changed yet?” This process can be inefficient, slow, and make it easy to miss critical updates.

Webhooks flip that model: instead of constantly checking, your system gets notified the moment something happens. This makes webhooks ideal for real-time use cases where speed, efficiency, and reliability matter.

With polling:

* You risk missing events that happen between requests
* You consume unnecessary API quota and system resources
* You often need to write extra logic to check for changes and handle duplicates

With webhooks:

* You get immediate, push-based updates as soon as events occur
* You can subscribe only to the event types you care about
* You reduce latency, improve performance, and simplify your integration

***

## Example use cases

* Notifying your back office system of completed transactions
* Triggering a withdrawal approval workflow when a new request is initiated
* Syncing asset balances with an external accounting platform
* Sending a Slack alert when a large deposit is detected
