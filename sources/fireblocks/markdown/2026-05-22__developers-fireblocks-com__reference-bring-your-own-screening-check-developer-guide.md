> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Bring your own screening check developer guide

Bring Your Own Screening Check lets you add a manual review step to Fireblocks transaction screening. After automatic AML screening completes, eligible transactions pause for your verdict before Travel Rule processing begins. For a conceptual overview, see [Bring Your Own Screening Check](https://support.fireblocks.io/hc/en-us/articles/26230042914076-Bring-Your-Own-Screening-Check-Integration-Guide) (requires Help Center login).

## Quickstart

Follow these steps to set up and activate Bring Your Own Screening Check:

1. Contact your Customer Success Manager to enable the feature for your workspace.
2. Configure incoming and outgoing timeouts with `PUT /v1/screening/byork/config/timeouts`.
3. Open a support ticket to configure your pre-screening rules.
4. Set up your webhook listener for screening events.
5. Test your verdict API integration in the sandbox environment.
6. Activate the feature with `POST /v1/screening/byork/config/activate`.
7. Monitor verdict submission latency against your configured timeouts.

## Configuration

### Get current configuration

```http theme={"system"}
GET /v1/screening/byork/config
```

Returns your current configuration, including timeouts and active status.

#### Response example

```json theme={"system"}
{
  "active": false,
  "incomingTimeoutSeconds": 3600,
  "outgoingTimeoutSeconds": 3600,
  "provider": "BYORK_LITE",
  "lastUpdate": "2026-03-01T00:00:00.000Z",
  "timeoutRangeIncoming": { "minSeconds": 10, "maxSeconds": 604800 },
  "timeoutRangeOutgoing": { "minSeconds": 10, "maxSeconds": 604800 }
}
```

| Field                    | Type    | Description                                                                                          |
| ------------------------ | ------- | ---------------------------------------------------------------------------------------------------- |
| `active`                 | boolean | Whether the feature is currently active for your tenant                                              |
| `incomingTimeoutSeconds` | number  | Verdict timeout for incoming transactions (seconds)                                                  |
| `outgoingTimeoutSeconds` | number  | Verdict timeout for outgoing transactions (seconds)                                                  |
| `preScreeningRules`      | array   | Configured pre-screening rules. See [Pre-screening rules reference](#pre-screening-rules-reference). |
| `provider`               | string  | Provider identifier (e.g., `BYORK_LITE`)                                                             |
| `lastUpdate`             | string  | ISO 8601 timestamp of the last configuration update                                                  |
| `timeoutRangeIncoming`   | object  | Valid min/max bounds for `incomingTimeoutSeconds`                                                    |
| `timeoutRangeOutgoing`   | object  | Valid min/max bounds for `outgoingTimeoutSeconds`                                                    |

### Set timeouts

Configure how long the system waits for your verdict before auto-rejecting a transaction. Timeouts are set separately for incoming and outgoing transactions.

Always submit your verdict before the timeout expires. Once the timeout is reached, Fireblocks automatically rejects the transaction and the rejection cannot be reversed.

#### Request

```http theme={"system"}
PUT /v1/screening/byork/config/timeouts
```

Include at least one of `incomingTimeoutSeconds` or `outgoingTimeoutSeconds` in the request body. The response returns the full updated configuration.

#### Response example

```json theme={"system"}
{
  "incomingTimeoutSeconds": 7200,
  "outgoingTimeoutSeconds": 3600
}
```

| Parameter                | Default | Min | Max                  |
| ------------------------ | ------- | --- | -------------------- |
| `incomingTimeoutSeconds` | 3600    | 10  | 604800 (7 days)      |
| `outgoingTimeoutSeconds` | 3600    | 10  | JWT lifetime − 1800s |

### Configure pre-screening rules

Pre-screening rules determine which transactions are held for review and which bypass the check. Rules are evaluated in order — the first match wins. Omitted fields match any value.

To configure or update your pre-screening rules, open a support ticket. See [Pre-screening rules reference](#pre-screening-rules-reference) for the full list of available rule fields.

### Activate and deactivate

Once your timeouts and rules are set, activate to start screening transactions:

```http theme={"system"}
POST /v1/screening/byork/config/activate
```

To pause screening without removing your configuration:

```http theme={"system"}
POST /v1/screening/byork/config/deactivate
```

Both endpoints return the full updated configuration. When deactivated, all transactions bypass the review step and continue to Travel Rule or completion.

## Submitting verdicts

### Submit a verdict

```http theme={"system"}
POST /v1/screening/byork/verdict
```

Use an [idempotency key](/reference/api-idempotency) on `POST verdict` to avoid duplicate submissions.

#### Request body

```json theme={"system"}
{
  "txId": "3b9cc47a-f8c2-4b09-9b1f-e12a53d9f74c",
  "verdict": "ACCEPT"
}
```

| Field     | Type   | Description               |
| --------- | ------ | ------------------------- |
| `txId`    | string | Fireblocks transaction ID |
| `verdict` | string | `ACCEPT` or `REJECT`      |

#### Response example

```json theme={"system"}
{
  "status": "COMPLETED",
  "message": "Verdict ACCEPT applied"
}
```

### Get verdict status

```http theme={"system"}
GET /v1/screening/byork/verdict?txId={txId}
```

Returns the current verdict status for a transaction.

| Status         | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `PRE_ACCEPTED` | Verdict submitted before the wait step was reached; applied automatically |
| `PENDING`      | The transaction is waiting for a verdict                                  |
| `RECEIVED`     | Verdict received and being applied                                        |
| `COMPLETED`    | Verdict applied; transaction continues                                    |

## Pre-acceptance

You can submit a verdict before a transaction reaches the review wait step — for example, while automatic AML screening is still running. Fireblocks stores the verdict and applies it automatically when the transaction reaches the waiting state.

This is useful when you have already completed your own review and want to avoid any delay.

### Request

```http theme={"system"}
POST /v1/screening/byork/verdict
```

### Response example

```json theme={"system"}
{
  "txId": "3b9cc47a-f8c2-4b09-9b1f-e12a53d9f74c",
  "verdict": "ACCEPT"
}
```

The response returns `"status": "PRE_ACCEPTED"` if the transaction has not reached the wait step yet.

## Error handling

| HTTP status       | Meaning                                                                   | Action                                                                      |
| ----------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `400 Bad Request` | Bring Your Own Screening Check not enabled for tenant, or invalid payload | Check that the feature is enabled and the request body is correct           |
| `404 Not Found`   | No verdict found for this transaction (GET only)                          | Verify `txId` is correct and the transaction has reached the screening step |
| `409 Conflict`    | Verdict already submitted, or transaction screening is complete           | Do not retry; verdict is final                                              |
| `425 Too Early`   | Transaction not found yet; screening has not started                      | Retry after a short delay                                                   |

## Pre-screening rules reference

Rules are evaluated in order. The first matching rule determines whether the transaction is held for review (`SCREEN`) or bypasses it (`PASS`).

| Field                 | Type    | Description                                                         |
| --------------------- | ------- | ------------------------------------------------------------------- |
| `sourceWorkspaceName` | string  | Source workspace name. For incoming transactions.                   |
| `destWorkspaceName`   | string  | Destination workspace name. For outgoing transactions.              |
| `sourceType`          | string  | Source address type (e.g., `VAULT_ACCOUNT`, `EXCHANGE`).            |
| `sourceSubType`       | string  | Source address sub-type.                                            |
| `sourceAddress`       | string  | Source on-chain address.                                            |
| `sourceId`            | string  | ID of the source vault, exchange account, or unmanaged wallet.      |
| `destType`            | string  | Destination address type.                                           |
| `destSubType`         | string  | Destination address sub-type.                                       |
| `destAddress`         | string  | Destination on-chain address.                                       |
| `destId`              | string  | ID of the destination vault, exchange account, or unmanaged wallet. |
| `asset`               | string  | Asset ID (e.g., `BTC`, `ETH`).                                      |
| `amount`              | object  | Amount range with currency. See [Amount object](#amount-object).    |
| `operation`           | string  | Transaction operation type.                                         |
| `direction`           | string  | `INBOUND` or `OUTBOUND`. Limits the rule to one direction.          |
| `isDefault`           | boolean | When `true`, applies when no other rule matches.                    |
| `action`              | string  | **Required.** `PASS` (skip review) or `SCREEN` (hold for verdict).  |

### Amount object

```json theme={"system"}
{
  "range": {
    "min": "1000",
    "max": "50000"
  },
  "currency": "USD"
}
```

`currency` is either `"USD"` (fiat-equivalent value) or `"NATIVE"` (on-chain amount). `min` and `max` are both optional.
