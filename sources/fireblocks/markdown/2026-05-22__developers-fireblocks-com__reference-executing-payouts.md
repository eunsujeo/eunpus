> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Execute Payouts

# Creating a payout instruction set

When a user wants to send a payment to one or more of their merchants, they can use the Payout Service API to send the payout from their exchange account.

First, the user creates a payout instruction set using the [Create a payout instruction set](/reference/createpayout) API call. The instruction set defines:

* the payment account and its account type (vault, exchange, or fiat).
* the account type (vault account, exchange account, whitelisted address, network connection, fiat account, or merchant account), the amount, and the asset of payment for each payee account.

In this example, the user wants to send funds from an exchange account (id: “EX\_SUB3”) in their Fireblocks workspace. They want to send 43 USDC to Merchant 1 (id: “bef85a1c-b605-4b2e-bdb5-2d400f4d0bf3”) who is configured as an external wallet and 4,423 USDC to Merchant 2 (id: “3adc1f92-e791-44a8-9aee-7f31c2108b78”) who is configured as a Fireblocks Network connection.

## Example

```json theme={"system"}
{
  "paymentAccount": {
    "id": "EX_SUB3",
    "type": "EXCHANGE_ACCOUNT"
  },
  "instructionSet": [
    {
      "payeeAccount": {
        "id": "bef85a1c-b605-4b2e-bdb5-2d400f4d0bf3",
        "type": "EXTERNAL_WALLET"
      },
      "amount": {
        "amount": "43",
        "assetId": "USDC"
      }
    },
    {
      "payeeAccount": {
        "id": "3adc1f92-e791-44a8-9aee-7f31c2108b78",
        "type": "NETWORK_CONNECTION"
      },
      "amount": {
        "amount": "4423",
        "assetId": "USDC"
      }
    }
  ]
}
```

## Response

The user then receives a unique payoutId ("1fe3b61f-7e1f-4a19-aff0-4f0a524d44d7") for their payout instruction set. This payoutId can then be used for executing the payout.

The response body also lists the state of the payout instruction set as REQUESTED and the two payment states as NOT\_STARTED.

Following are descriptions of the parameters in the response:

* **payoutId**: unique ID for the payout
* **paymentAccount**
  * **id**: the ID of the payment account
  * **type**: the type of payment account (vault account, exchange account, or fiat account)
* **createdAt**: when the instruction set was created
* **state**: the state of the instruction set
* **initMethod**: method of creating the instruction set
* **instructionSet**: an array of instructions for the payout. Each one details the payee, the payment amount, and the status of the payment.
  * **id**: the ID for the individual payment in the instruction set
  * **name**: the name of the payee
  * **payeeAccount**
    * **id**: the ID of the account receiving the payment
    * **type**: the type of account receiving the payment
  * **amount**
    * **amount**: the amount being sent
    * **assetId**: the asset being sent
  * **state**: the status of the individual payment
  * **transactions**: the transactions included in the payment

```json theme={"system"}
{
  "payoutId": "1fe3b61f-7e1f-4a19-aff0-4f0a524d44d7",
  "paymentAccount": {
    "id": "EX_SUB3",
    "type": "EXCHANGE_ACCOUNT"
  },
  "createdAt": 1645365800,
  "state": "REQUESTED",
  "initMethod": "API",
  "instructionSet": [
    {
      "id": "6ea4a016-536b-49af-b1a0-40b343ccf879",
      "name": "Merchant 1",
      "payeeAccount": {
        "id": "bef85a1c-b605-4b2e-bdb5-2d400f4d0bf3",
        "type": "EXTERNAL_WALLET"
      },
      "amount": {
        "amount": "43",
        "assetId": "USDC"
      },
      "state": "NOT_STARTED",
      "transactions": []
    },
    {
      "id": "e783a79b-6acc-4d18-885d-ed533cad8eeb",
      "name": "Merchant 2",
      "payeeAccount": {
        "id": "3adc1f92-e791-44a8-9aee-7f31c2108b78",
        "type": "NETWORK_CONNECTION"
      },
      "amount": {
        "amount": "4423",
        "assetId": "USDC"
      },
      "state": "NOT_STARTED"
      "transactions": []
    }
  ]
}
```

***

# Executing a payout instruction set

Once the payout instruction set is created, the user can execute the payout using the [Execute a payout instruction set](/reference/executepayoutaction) API call and entering the payoutId of the instruction set that was just created ("1fe3b61f-7e1f-4a19-aff0-4f0a524d44d7").

***

# Monitoring payouts

The user can also monitor the status of the newly executed payout using the [Get the status of a payout instruction set](/reference/getpayout) API call and entering the payoutId.

## Example

`GET /payments/payout/1fe3b61f-7e1f-4a19-aff0-4f0a524d44d7`

## Response

The state and the payout status are returned.

```json theme={"system"}
{
  "payoutId": "1fe3b61f-7e1f-4a19-aff0-4f0a524d44d7",
  "paymentAccount": {
    "id": "EX_SUB3",
    "type": "EXCHANGE_ACCOUNT"
  },
  "createdAt": 1645365800,
  "state": "FINALIZED",
  "status": " DONE"
  "initMethod": "API",
  "instructionSet": [
    {
      "id": "6ea4a016-536b-49af-b1a0-40b343ccf879",
      "name": "Merchant 1",
      "payeeAccount": {
        "id": "bef85a1c-b605-4b2e-bdb5-2d400f4d0bf3",
        "type": "EXTERNAL_WALLET"
      },
      "amount": {
        "amount": "4312",
        "assetId": "USDC"
      },
      "state": "COMPLETED",
      "transactions": [{
            "id": "35a4b10c-1f83-4f0b-ba2a-da0e73be2d6e",
            "state": "COMPLETED",
            "timestamp": 1645367429
      }]
    },
    {
      "id": "e783a79b-6acc-4d18-885d-ed533cad8eeb",
      "name": "Merchant 2",
      "payeeAccount": {
        "id": "3adc1f92-e791-44a8-9aee-7f31c2108b78",
        "type": "NETWORK_CONNECTION"
      },
      "amount": {
        "amount": "4423",
        "assetId": "USDC"
      },
      "state": "COMPLETED",
      "transactions": [{
            "id": "4505e7d9-bfc7-41bc-9750-54311fcbbf26",
            "state": "COMPLETED",
            "timestamp": 1645367449
      }]
    }
    }
  ],
  "reportUrl": "https://some-url.com/reports/cc5777c1-75a9-4337-aebd-f1f5a40a9391"
}
```
