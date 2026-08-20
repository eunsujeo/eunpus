> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transaction Authorization Objects

## AuthorizationInfo

| Parameter                 | Type                                               | Description                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| allowOperatorAsAuthorizer | boolean                                            | Set to "true" if the initiator of the transaction can be one of the approvers                                                                                                                                                                                                                                                                    |
| logic                     | string                                             | "AND" or "OR"; is the logic that is applied between the different authorization groups listed below.                                                                                                                                                                                                                                             |
| groups                    | list of [AuthorizationGroups](#authorizationgroup) | The list of authorization groups and users that are required to approve this transaction. The logic applied between the different groups is the “logic” field above. Each element in the response is the user ID (found via the [List users](/api-reference/users/list-users) endpoint) and the value is their [ApprovalStatus](#approvalstatus) |

***

## AuthorizationGroup

| Parameter | Type            | Description                                                                                                                                                                                                                                                                                      |
| --------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| th        | number          | The threshold of required approvers in this authorization group                                                                                                                                                                                                                                  |
| users     | object of users | The mapping of users to which the threshold number is applied for transaction approval. Each user in the response is a "key:value" where the key is the user ID (found via the [List users](/api-reference/users/list-users) endpoint) and the value is their [ApprovalStatus](#approvalstatus). |

***

## ApprovalStatus

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| approval  | string | \[ PENDING\_AUTHORIZATION, APPROVED, REJECTED, NA ] |
