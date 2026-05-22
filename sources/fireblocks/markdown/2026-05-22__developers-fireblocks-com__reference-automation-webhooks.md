> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Automation Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events relating to Fireblocks Automations that produce Webhook notifications, and their associated data objects.

The `type` parameter is automatically set to the description name for the data objects below.

## Automation Run

An AUTOMATION\_EXECUTION\_WEBHOOK\_UPDATE webhook is sent when an automation rule runs.

| Parameter   | Type   | Description                                                                                                                       |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| ruleId      | string | Unique ID for the Automation rule as a ratio to executions (1/N)                                                                  |
| executionId | string | Number of times this rule has been executed                                                                                       |
| state       | enum   | Current status of the rule.  Available values: `CREATED`; `TRIGGERED`; `CONDITION_MET`; `CONDITION_NOT_MET`; `EXECUTED`; `FAILED` |
| trigger     | enum   | Available values: `TIME`; `TRANSACTION`                                                                                           |
| condition   | enum   | Available values: `BALANCE`; `TRANSACTION_AMOUNT`; `UNCONDITIONAL`                                                                |
| actions     | enum   | Available values: `TRANSFER`; `TOP_UP`; `REBALANCE`; `START_WORKFLOW`; `CONVERT`; `SWEEP`                                         |
| createdAt   | number | The time the rule was created, in milliseconds (epoch)                                                                            |
| createdBy   | string | ID of the user who created the rule                                                                                               |
| rule        | string | Name of the Automation Rule                                                                                                       |
| failure     | enum   | Available values: `CONDITION_CHECK_FAILED`, `ACTION_FAILED`, `EXECUTION_FAILED`                                                   |
