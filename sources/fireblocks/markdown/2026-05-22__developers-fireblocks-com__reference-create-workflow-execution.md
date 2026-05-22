> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Workflow Execution

Once the WC is in **READY\_FOR\_EXECUTION** status, call the [POST /payments/workflow\_execution](/reference/createflowexecution) endpoint.

When creating a WE, mandatory parameters, such as amounts and addresses, that weren’t provided during the configuration phase must be provided. Parameters provided when creating the WC can be overridden when creating the WE. Some parameters are only provided when creating the WE.

The `amount` parameter can only be provided during the WE since it’s required for the preview and launch but not for the WC, which is just a template. This parameter is usually provided to the first operation and then carried from one operation to another down the flow.

## Example

```json theme={"system"}
{
  "configId": "string",
  "preScreening":{
    "enabled": false
  },
  failureHandling: {
    enabled: true,
    type: 'REVERSE'
  },
  "params": [
    {
      "configOperationId": "string",
      "configOverrideParams": {
        "accountId": "string",
        "srcAssetId": "string",
        "destAssetId": "string",
        "slippageBasisPoints": 10000
      },
      "executionParams": {
        "amount": "string"
      }
    },
    {
      "configOperationId": "string",
      "configOverrideParams": {
        "paymentAccount": {
          "accountId": "string",
          "accountType": "EXCHANGE_ACCOUNT"
        },
        "instructionSet": [
          {
            "payeeAccount": {
              "accountId": "string",
              "accountType": "EXCHANGE_ACCOUNT"
            },
            "assetId": "string",
            "amount": "string"
          },
          {
            "payeeAccount": {
              "accountId": "string",
              "accountType": "EXCHANGE_ACCOUNT"
            },
            "assetId": "string",
            "percentage": "string"
          }
        ]
      },
      "executionParams": {
        "amount": "string"
      }
    }
  ]
}
```

The request body `configId` field must include the id for a WC in READY\_FOR\_EXECUTION status.

The request body `params` field holds an array. Each item of the array has a `configOperationId`, which points to a specific operation from the WC. This is necessary when overriding or setting an operation.

An execution proceeds through the following statuses during its creation:

1. **PENDING:** The execution is about to start the validation process.
2. **VALIDATION\_IN\_PROGRESS:** The validation process has started, ensuring the execution is valid.
3. **VALIDATION\_FAILED** or **VALIDATION\_COMPLETED:** The validation failed or completed. If completed, the preview process starts automatically.
4. **PREVIEW\_IN\_PROGRESS:** The preview process has started.
5. **PREVIEW\_FAILED** or **READY\_FOR\_LAUNCH:** The preview failed or the execution can be launched. These statuses are finite states.

If an execution is in VALIDATION\_FAILED status or a PREVIEW\_FAILED, it can't be launched or used again. To get another corrected preview, create a new WE to trigger the validation and preview processes.
