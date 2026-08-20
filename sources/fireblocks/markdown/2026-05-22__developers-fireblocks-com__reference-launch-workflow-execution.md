> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Launch Workflow Execution

Once the WE is in **READY\_FOR\_LAUNCH** status, call the [POST /payments/workflow\_execution/{workflowExecutionId}/actions/execute](/reference/launchflowexecution) endpoint.

The WE proceeds through the following statuses. These statuses will be applied to each WEO and the WE as a whole.

1. **EXECUTION\_IN\_PROGRESS:** The execution process has started.
2. **EXECUTION\_COMPLETED** or **EXECUTION\_FAILED:** The execution completed or failed. These are finite states.
