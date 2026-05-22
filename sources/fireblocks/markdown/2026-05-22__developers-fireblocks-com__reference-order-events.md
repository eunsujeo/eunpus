> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Order events

This page covers all Orders events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Orders event types

To receive a specific event, include its `eventType` in the webhook's notification object.

| Event type    | Data object returned |
| ------------- | -------------------- |
| order.updated | orderDetails         |

## Data objects

orderDetails is the primary object returned in Orders webhook events. Nested objects are included only when relevant to the order type and lifecycle stage.

## orderDetails

| Parameter                   | Type                     | Description                                                       |
| --------------------------- | ------------------------ | ----------------------------------------------------------------- |
| id                          | string                   | Unique identifier for the order                                   |
| status                      | orderStatus              | Current status of the order                                       |
| createdAt                   | string                   | ISO 8601 timestamp for when the order was created                 |
| updatedAt                   | string                   | ISO 8601 timestamp for when the order was last updated (optional) |
| executionResponseDetails    | executionResponseDetails | Order execution details                                           |
| executionSteps              | executionSteps array     | Array of execution steps with their statuses                      |
| paymentInstructions         | paymentInstructions      | Payment instructions for on/off ramps orders (optional)           |
| receipt                     | receipt                  | Transfer receipt information (optional)                           |
| settlement                  | settlement               | Settlement details                                                |
| via                         | via                      | Account access information                                        |
| customerInternalReferenceId | string                   | Customer's internal reference ID for the order (optional)         |
| note                        | string                   | Note providing additional information about the order (optional)  |
| expiresAt                   | string                   | ISO 8601 timestamp for when the order expires (optional)          |
| failure                     | failure                  | Failure information for if the order failed                       |
| createdBy                   | string                   | Identifier of the user or service that created the order          |
| generalFees                 | fee array                | Array of fees associated with the order                           |

## orderStatus

| Value                 | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| CREATED               | Order was created but not yet initiated                              |
| PENDING\_USER\_ACTION | Order is waiting for user action, such as a policy check or approval |
| AWAITING\_PAYMENT     | Order is waiting for payment to be initiated                         |
| PROCESSING            | Order is currently being processed                                   |
| CANCELLED             | Order was cancelled                                                  |
| COMPLETED             | Order was successfully completed                                     |
| FAILED                | Order failed. Check the failure field for details                    |

## executionResponseDetails

| Parameter      | Type    | Description                                           |
| -------------- | ------- | ----------------------------------------------------- |
| type           | string  | Execution type. Possible values: QUOTE, MARKET        |
| quoteId        | string  | Quote ID. Required if type is QUOTE                   |
| reQuote        | boolean | Whether this is a re-quote. Required if type is QUOTE |
| side           | string  | Order side. Possible values: BUY, SELL                |
| baseAmount     | string  | Amount to convert                                     |
| quoteAmount    | string  | Quote amount. Optional, but required if type is QUOTE |
| baseAssetId    | string  | Source asset identifier                               |
| quoteAssetId   | string  | Target asset identifier                               |
| baseAssetRail  | string  | Base asset rail identifier (optional)                 |
| quoteAssetRail | string  | Quote asset rail identifier (optional)                |

## executionSteps

| Parameter | Type   | Description                                                                      |
| --------- | ------ | -------------------------------------------------------------------------------- |
| type      | string | Step type. Possible values: APPROVE, DELIVERY, EXECUTE, SETTLEMENT               |
| status    | string | Step status. Possible values: WAITING, PROCESSING, COMPLETED, FAILED, CANCELLED  |
| fee       | fee    | Fee associated with this step (optional)                                         |
| txId      | string | Transaction ID within the main workspace (optional)                              |
| txHash    | string | Blockchain transaction hash (optional)                                           |
| error     | string | Error information if the step failed. Possible value: INTERNAL\_ERROR (optional) |

## paymentInstructions

| Parameter   | Type   | Description                                                                                                                                    |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| type        | string | Payment instruction type. Possible values: IBAN, SWIFT, ACH, WIRE, SPEI, PIX, LOCAL\_BANK\_TRANSFER, EUROPEAN\_SEPA, MOBILE\_MONEY, BLOCKCHAIN |
| referenceId | string | Reference ID for the payment instruction (optional)                                                                                            |
| address     | object | Address details specific to the payment type                                                                                                   |

## receipt

| Parameter   | Type   | Description                                                 |
| ----------- | ------ | ----------------------------------------------------------- |
| type        | string | Receipt type. Possible values: BLOCKCHAIN, FIAT             |
| txHash      | string | Blockchain transaction hash. Required if type is BLOCKCHAIN |
| amount      | string | Transfer amount                                             |
| referenceId | string | Reference ID for fiat transfer (optional)                   |

## settlement

| Parameter          | Type                    | Description                                      |
| ------------------ | ----------------------- | ------------------------------------------------ |
| type               | string                  | Settlement type. Possible values: PREFUNDED, DVP |
| destinationAccount | accountReference        | Destination account reference                    |
| sourceAccount      | settlementSourceAccount | Source account (optional for PREFUNDED)          |

## accountReference

| Parameter | Type   | Description                                                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| accountId | string | Account ID. Optional for ONE\_TIME\_ADDRESS                                                                                                |
| type      | string | Account type. Possible values: VAULT\_ACCOUNT, EXCHANGE\_ACCOUNT, UNMANAGED\_WALLET, FIAT\_ACCOUNT, CONNECTED\_ACCOUNT, ONE\_TIME\_ADDRESS |
| address   | string | Address for one-time address accounts. Required for ONE\_TIME\_ADDRESS                                                                     |
| tag       | string | Tag or memo for one-time address accounts (optional)                                                                                       |

## settlementSourceAccount

| Parameter | Type   | Description                                                                                    |
| --------- | ------ | ---------------------------------------------------------------------------------------------- |
| type      | string | Account type. Possible values: EXTERNAL, VAULT\_ACCOUNT, EXCHANGE\_ACCOUNT, CONNECTED\_ACCOUNT |
| accountId | string | Account ID. Optional for EXTERNAL                                                              |

## via

| Parameter  | Type   | Description                                |
| ---------- | ------ | ------------------------------------------ |
| type       | string | Account access type. PROVIDER\_ACCOUNT     |
| accountId  | string | The ID of the account                      |
| providerId | string | The ID of the venue or provider (optional) |

## failure

| Parameter   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                        |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reason      | string | Failure reason. Possible values: INSUFFICIENT\_FUNDS, UNKNOWN\_REASON, INITIATE\_PAYMENT\_FAILURE, POLICY\_REJECTION, TRANSACTION\_FAILED, ACCOUNT\_NOT\_ACTIVE, ACCOUNT\_NOT\_FOUND, BAD\_REQUEST, QUOTE\_NOT\_READY, INVALID\_DATA, UNSUPPORTED\_CONVERSION, REFUNDED, FAILED\_BY\_PROVIDER, ORDER\_EXPIRED, TRANSACTION\_CANCELLED, TRANSACTION\_REJECTED, TRANSACTION\_BLOCKED |
| failureInfo | object | Additional failure information as key-value pairs                                                                                                                                                                                                                                                                                                                                  |

## fee

| Parameter  | Type             | Description                                                                                                           |
| ---------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| feeType    | string           | Fee type. Possible values: ORDER, NETWORK, SPREAD, REBATE                                                             |
| assetId    | string           | Asset identifier for the fee                                                                                          |
| amountType | string           | Amount type. Possible values: FIXED, BPS                                                                              |
| amount     | string or number | Fee amount. FIXED is a string value. BPS is a numeric value where 1 equals 0.01 percent and 10,000 equals 100 percent |

## IBAN

| Parameter     | Type                 | Description                       |
| ------------- | -------------------- | --------------------------------- |
| accountHolder | accountHolderDetails | Account holder information        |
| iban          | string               | International Bank Account Number |

## SWIFT

| Parameter     | Type                 | Description                                 |
| ------------- | -------------------- | ------------------------------------------- |
| accountHolder | accountHolderDetails | Account holder information                  |
| swiftCode     | string               | SWIFT or BIC code identifying the bank      |
| routingNumber | string               | Routing number identifying the bank account |

## ACH

| Parameter         | Type                 | Description                                           |
| ----------------- | -------------------- | ----------------------------------------------------- |
| accountHolder     | accountHolderDetails | Account holder information                            |
| bankName          | string               | Name of the bank (optional)                           |
| bankAccountNumber | string               | Bank account number for the ACH transfer              |
| routingNumber     | string               | Routing number identifying the bank account           |
| accountType       | string               | Bank account type. Possible values: CHECKING, SAVINGS |

## WIRE

| Parameter         | Type                 | Description                                 |
| ----------------- | -------------------- | ------------------------------------------- |
| accountHolder     | accountHolderDetails | Account holder information                  |
| bankName          | string               | Name of the bank (optional)                 |
| bankAccountNumber | string               | Bank account number for the wire transfer   |
| routingNumber     | string               | Routing number identifying the bank account |
| bankAddress       | bankAddress          | Bank address (optional)                     |

## SPEI

| Parameter         | Type                 | Description                               |
| ----------------- | -------------------- | ----------------------------------------- |
| accountHolder     | accountHolderDetails | Account holder information                |
| bankName          | string               | Name of the bank (optional)               |
| bankAccountNumber | string               | Bank account number for the SPEI transfer |

## PIX

| Parameter     | Type                 | Description                                                    |
| ------------- | -------------------- | -------------------------------------------------------------- |
| accountHolder | accountHolderDetails | Account holder information                                     |
| pixKey        | string               | PIX key identifier                                             |
| keyType       | string               | PIX key type. Possible values: CPF, CNPJ, EMAIL, PHONE, RANDOM |
| bankName      | string               | Name of the bank (optional)                                    |
| bankCode      | string               | Bank code identifier (optional)                                |

## LOCAL\_BANK\_TRANSFER

| Parameter     | Type                 | Description                |
| ------------- | -------------------- | -------------------------- |
| accountHolder | accountHolderDetails | Account holder information |
| accountNumber | string               | Bank account number        |
| bankName      | string               | Name of the bank           |
| bankCode      | string               | Bank code identifier       |

## EUROPEAN\_SEPA

| Parameter     | Type                 | Description                              |
| ------------- | -------------------- | ---------------------------------------- |
| accountHolder | accountHolderDetails | Account holder information               |
| iban          | string               | International Bank Account Number        |
| bic           | string               | Bank Identifier Code (optional)          |
| bankName      | string               | Name of the bank (optional)              |
| bankBranch    | string               | Bank branch information (optional)       |
| bankAddress   | string               | Bank address (optional)                  |
| purposeCode   | string               | Purpose code for the transfer (optional) |
| taxId         | string               | Tax identification number (optional)     |

## MOBILE\_MONEY

| Parameter               | Type                 | Description                                                              |
| ----------------------- | -------------------- | ------------------------------------------------------------------------ |
| accountHolder           | accountHolderDetails | Account holder information                                               |
| mobilePhoneNumber       | string               | Mobile phone number in E.164 format                                      |
| provider                | string               | Mobile money provider. Possible values: MPESA, AIRTEL, MTN, TIGO, ORANGE |
| beneficiaryDocumentId   | string               | Beneficiary document ID (optional)                                       |
| beneficiaryRelationship | string               | Relationship to the beneficiary (optional)                               |

## AccountHolderDetails

| Parameter   | Type   | Description                                                |
| ----------- | ------ | ---------------------------------------------------------- |
| name        | string | Account holder full name                                   |
| address     | string | Street address (optional)                                  |
| city        | string | City of residence (optional)                               |
| country     | string | Country code in ISO 3166-1 alpha-2 format (optional)       |
| subdivision | string | Administrative subdivision in ISO 3166-2 format (optional) |
| postalCode  | string | Postal or ZIP code (optional)                              |

## bankAddress

| Parameter      | Type   | Description                                                |
| -------------- | ------ | ---------------------------------------------------------- |
| streetName     | string | Street name (optional)                                     |
| buildingNumber | string | Building number (optional)                                 |
| postalCode     | string | Postal or ZIP code (optional)                              |
| city           | string | City (optional)                                            |
| subdivision    | string | Administrative subdivision in ISO 3166-2 format (optional) |
| district       | string | District or area within the city (optional)                |
| country        | string | Country code in ISO 3166-1 alpha-2 format (optional)       |

## Example of events

```json theme={"system"}
{
  "event": {
    "type": "order.updated",
    "data": {
      "id": "ramp-abc123def456",
      "status": "PROCESSING",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z",
      "executionResponseDetails": {
        "type": "QUOTE",
        "quoteId": "quote-xyz789",
        "reQuote": false,
        "side": "BUY",
        "baseAmount": "1000.00",
        "quoteAmount": "950.50",
        "baseAssetId": "USD",
        "quoteAssetId": "BTC",
        "baseAssetRail": "FIAT",
        "quoteAssetRail": "BLOCKCHAIN"
      },
      "executionSteps": [
        {
          "type": "APPROVE",
          "status": "COMPLETED",
          "txId": "tx-approve-001"
        },
        {
          "type": "EXECUTE",
          "status": "PROCESSING",
          "txId": "tx-execute-002"
        },
        {
          "type": "SETTLEMENT",
          "status": "WAITING"
        }
      ],
      "paymentInstructions": {
        "type": "IBAN",
        "referenceId": "ref-123456",
        "address": {
          "accountHolder": {
            "name": "John Doe",
            "address": "123 Main Street",
            "city": "New York",
            "country": "US",
            "subdivision": "NY",
            "postalCode": "10001"
          },
          "iban": "GB82WEST12345698765432"
        }
      },
      "receipt": {
        "type": "BLOCKCHAIN",
        "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "amount": "0.025"
      },
      "settlement": {
        "type": "DVP",
        "sourceAccount": {
          "accountId": "vault-account-123",
          "type": "VAULT_ACCOUNT"
        },
        "destinationAccount": {
          "accountId": "exchange-account-456",
          "type": "EXCHANGE_ACCOUNT"
        }
      },
      "via": {
        "type": "PROVIDER_ACCOUNT",
        "accountId": "provider-account-789",
        "providerId": "provider-coinbase"
      },
      "customerInternalReferenceId": "customer-ref-001",
      "note": "Monthly crypto purchase",
      "expiresAt": "2024-01-15T11:30:00.000Z",
      "createdBy": "user-12345",
      "generalFees": [
        {
          "feeType": "ORDER",
          "assetId": "USD",
          "amountType": "FIXED",
          "amount": "10.00"
        },
        {
          "feeType": "NETWORK",
          "assetId": "BTC",
          "amountType": "BPS",
          "amount": 50
        }
      ]
    }
  }
}
```
