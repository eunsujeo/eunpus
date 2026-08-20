> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Workflow Configuration

Call the [POST /payments/workflow\_config](/reference/createflowconfiguration) endpoint.

After a configuration is created, the operation type for the WC can’t be changed. However, other WC parameters can be defined and edited later when creating the WE.

## Example

```json theme={"system"}
{
  configName: 'some-name',
  preScreening: {
    enabled: true
  },
  failureHandling: {
    enabled: true,
    type: 'REVERSE'
  },
  configOperations: {
    type: 'TRANSFER',
    params: {
      source: {
        accountId: 'xyz',
        accountType: 'EXCHANGE_ACCOUNT',
      },
      assetId: 'USDC_POLYGON',
      destination: {
        accountType: 'VAULT_ACCOUNT',
        accountId: '0',
      },
    },
  },
  {
    type: 'TRANSFER',
    params: {
      destination: {
        accountType: 'EXCHANGE_ACCOUNT',
        accountId: 'abc',
      },
      source: {
        accountType: 'VAULT_ACCOUNT',
        accountId: '0',
      },
      assetId: 'USDC_POLYGON',
    },
  },
}
```

This route returns the configuration ID which will be used to create the WE.

A configuration proceeds through the following statuses during its creation. These statuses will be applied to each WCO and the WC as a whole.

1. **PENDING:** The configuration is about to start the validation process.
2. **VALIDATION\_IN\_PROGRESS:** The validation process has started, ensuring the configuration is valid.
3. **VALIDATION\_FAILED** or **READY\_FOR\_EXECUTION:** The validation failed or the configuration can be executed. These statuses are finite states.

All the operation validation processes must succeed for the configuration validation to succeed.

If one or more operation validations fail, the entire configuration validation fails. Failed WCOs may show VALIDATION\_FAILED while others may show VALIDATION\_COMPLETED. However, the WC status will show VALIDATION\_FAILED. The failure details will be included under the failed operation in the validationFailure field. In this scenario, you should call the API endpoint again with the corrected configuration.
