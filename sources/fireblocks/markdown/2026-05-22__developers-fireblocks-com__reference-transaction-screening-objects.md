> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transaction Screening Objects

## ComplianceResult

| Parameter       | Type                                                                                            | Description                                                    |
| --------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| aml             | [AmlScreeningResult](/reference/transaction-screening-objects#amlscreeningresult)               | An object containing AML screening result information.         |
| amlList         | array of [AmlScreeningResult](/reference/transaction-screening-objects#amlscreeningresult)      | List of AML screening result objects.                          |
| amlRegistration | [AmlRegistration](/reference/transaction-screening-objects#amlregistration)                     | An object containing AML registration information.             |
| tr              | [TravelRuleScreeningResult](/reference/transaction-screening-objects#travelrulescreeningresult) | An object containing Travel Rule screening result information. |
| status          | string                                                                                          | The status of the AML or Travel Rule screening request.        |

## AmlScreeningResult

| Parameter               | Type   | Description                                                                                                     |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| provider                | string | The AML service provider.                                                                                       |
| payload                 | any    | The response of the AML service provider.                                                                       |
| screeningStatus         | string | The status of the AML screening request.                                                                        |
| bypassReason            | string | The reason the transaction bypassed AML screening.                                                              |
| timestamp               | number | The date of the AML screening request in timestamp format.                                                      |
| category                | string | The risk category included the transaction screening.                                                           |
| categoryId              | number | The Chainalysis ID of the risk category.                                                                        |
| customerRefId           | string | The Customer Reference ID associated with the transaction.                                                      |
| destAddress             | string | For multi-destination transactions, the destination address with the highest risk of being screened.            |
| externalId              | string | The AML provider's ID of the screening result.                                                                  |
| matchedAlert            | any    | The alert corresponding to the result for matchedRule.                                                          |
| matchedRule             | any    | The AML Post-Screening Policy rule that matched the transaction.                                                |
| matchedPrescreeningRule | any    | The AML Transaction Screening Policy rule that matched the transaction.                                         |
| risk                    | string | The risk score for your transaction.                                                                            |
| verdict                 | string | The verdict that was made based on the provider's response and the post-screening policy rule that was matched. |

## AmlRegistration

| Parameter | Type    | Description                                            |
| --------- | ------- | ------------------------------------------------------ |
| provider  | string  | The AML service provider.                              |
| success   | boolean | Specifies whether the AML registration was successful. |
| timestamp | number  | The date of the AML registration in timestamp format.  |

## TravelRuleScreeningResult

| Parameter               | Type   | Description                                                                     |
| ----------------------- | ------ | ------------------------------------------------------------------------------- |
| provider                | string | The Travel Rule service provider.                                               |
| verdict                 | string | ACCEPT, REJECT, ALERT, WAIT, FREEZE, CANCEL                                     |
| payload                 | any    | The response of the Travel Rule service provider.                               |
| matchedRule             | any    | The Travel Rule Post-Screening Policy rule that matched the transaction.        |
| matchedPrescreeningRule | any    | The Travel Rule Transaction Screening Policy rule that matched the transaction. |
| bypassReason            | string | The reason the transaction bypassed Travel Rule screening.                      |
| timestamp               | number | The date of the Travel Rule screening request in timestamp format.              |
| status                  | string | The status of the Travel Rule screening request.                                |
