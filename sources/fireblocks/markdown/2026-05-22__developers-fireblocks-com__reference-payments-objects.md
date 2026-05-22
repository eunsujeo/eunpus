> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Payments Objects

## XBSettlementConfigCreationRequestBody

| Parameter  | Type                                                            | Description                                                      |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| name       | string                                                          | The text name of the settlement configuration.                   |
| corridorId | string                                                          | The ID of the cross-border corridor.                             |
| steps      | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | The recorded steps of the cross-border settlement configuration. |

***

## XBSettlementConfigCreationResponse

| Parameter  | Type                                                            | Description                                                      |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| tenantId   | string                                                          | The ID of the tenant.                                            |
| configId   | string                                                          | The ID of the cross-border settlement configuration.             |
| corridorId | string                                                          | The ID of the cross-border corridor.                             |
| name       | string                                                          | The text name of the settlement configuration.                   |
| steps      | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | The recorded steps of the cross-border settlement configuration. |

***

## XBSettlementConfigEditRequestBody

| Parameter | Type                                                            | Description                                                                 |
| --------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| name      | string                                                          | Optional - The text name of the settlement configuration.                   |
| steps     | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | Optional - The recorded steps of the cross-border settlement configuration. |

***

## XBSettlementConfigEditResponse

| Parameter  | Type                                                            | Description                                                      |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| tenantId   | string                                                          | The ID of the tenant.                                            |
| configId   | string                                                          | The ID of the cross-border settlement configuration.             |
| corridorId | string                                                          | The ID of the cross-border corridor.                             |
| name       | string                                                          | The text name of the settlement configuration.                   |
| steps      | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | The recorded steps of the cross-border settlement configuration. |

***

## XBSettlementConfigDeletionResponse

| Parameter | Type   | Description                                          |
| --------- | ------ | ---------------------------------------------------- |
| configId  | string | The ID of the cross-border settlement configuration. |

***

## GetXBSettlementConfigResponse

| Parameter  | Type                                                            | Description                                                      |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| tenantId   | string                                                          | The ID of the tenant.                                            |
| configId   | string                                                          | The ID of the cross-border settlement configuration.             |
| corridorId | string                                                          | The ID of the cross-border corridor.                             |
| name       | string                                                          | The text name of the settlement configuration.                   |
| steps      | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | The recorded steps of the cross-border settlement configuration. |

***

## GetAllXBSettlementConfigsResponse

| Parameter      | Type                                                | Description                                       |
| -------------- | --------------------------------------------------- | ------------------------------------------------- |
| configurations | [XBSettlementConfigModel](#xbsettlementconfigmodel) | The configuration of the cross-border settlement. |

***

## XBCreateSettlementFlowRequestBody

| Parameter | Type                                    | Description                                                                         |
| --------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| configId  | string                                  | The ID of the cross-border settlement configuration.                                |
| amount    | [XBSettlementAsset](#xbsettlementasset) | The type and amount of an asset setup in the cross-border settlement configuration. |

***

## XBCreateSettlementFlowResponse

| Parameter          | Type                                                            | Description                                                                                      |
| ------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| tenantId           | string                                                          | The ID of the tenant.                                                                            |
| flowId             | string                                                          | The ID of the settlement flow configuration.                                                     |
| configId           | string                                                          | The ID of the cross-border settlement configuration.                                             |
| steps              | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | The recorded steps of the cross-border settlement configuration.                                 |
| inputAmount        | [XBSettlementAsset](#xbsettlementasset)                         | The type and amount of an asset input in the cross-border settlement configuration.              |
| outputAmount       | [XBSettlementAsset](#xbsettlementasset)                         | The type and amount of an asset output in the cross-border settlement configuration.             |
| totalEstimatedFees | [XBSettlementAsset](#xbsettlementasset)                         | The type and amount of estimated asset fees setup in the cross-border settlement configuration.  |
| totalEstimatedTime | number                                                          | The total amount of time estimated for the complete cross-border settlement flow to be executed. |

***

## XBSettlementFlowExecutionResponse

| Parameter    | Type                                                                | Description                                                                                     |
| ------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| tenantId     | string                                                              | The ID of the tenant.                                                                           |
| flowId       | string                                                              | The ID of the settlement flow configuration.                                                    |
| configId     | string                                                              | The ID of the cross-border settlement configuration.                                            |
| steps        | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord)     | The recorded steps of the cross-border settlement configuration.                                |
| inputAmount  | [XBSettlementAsset](#xbsettlementasset)                             | The type and amount of an asset input in the cross-border settlement configuration.             |
| outputAmount | [XBSettlementAsset](#xbsettlementasset)                             | The type and amount of an asset output in the cross-border settlement configuration.            |
| totalFees    | [XBSettlementAsset](#xbsettlementasset)                             | The type and amount of estimated asset fees setup in the cross-border settlement configuration. |
| initiatedAt  | number                                                              | The time the flow execution was initiated.                                                      |
| initiatedBy  | string                                                              | The ID of the user who initiated the flow execution.                                            |
| state        | [XBSettlementFlowExecutionStatus](#xbsettlementflowexecutionstatus) | The status of the flow execution.                                                               |

***

## XBSettlementFlowExecutionStep

| Parameter    | Type                                                                        | Description                                                                          |
| ------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| id           | string                                                                      | The ID of the individual flow execution step.                                        |
| accountId    | string                                                                      | The ID of the account initiating the flow execution step.                            |
| status       | [XBSettlementFlowExecutionStepStatus](#xbsettlementflowexecutionstepstatus) | The status of the individual step of the flow execution.                             |
| inputAmount  | [XBSettlementAsset](#xbsettlementasset)                                     | The type and amount of an asset input in the cross-border settlement configuration.  |
| outputAmount | [XBSettlementAsset](#xbsettlementasset)                                     | The type and amount of an asset output in the cross-border settlement configuration. |
| fee          | [XBSettlementAsset](#xbsettlementasset)                                     | The type and amount of an asset setup in the cross-border settlement configuration.  |
| startedAt    | number                                                                      | The time the specific flow execution step began.                                     |

***

## XBSettlementFlowExecutionStepStatus

| Parameter                           | Type   | Description                                                |
| ----------------------------------- | ------ | ---------------------------------------------------------- |
| XBSettlementFlowExecutionStepStatus | string | Valid values: NOT\_STARTED, PROCESSING, COMPLETED, FAILED. |

***

## XBSettlementFlowExecutionStatus

| Parameter                       | Type   | Description                                                |
| ------------------------------- | ------ | ---------------------------------------------------------- |
| XBSettlementFlowExecutionStatus | string | Valid values: NOT\_STARTED, PROCESSING, COMPLETED, FAILED. |

***

## XBSettlementConfigModel

| Parameter | Type                                                            | Description                                                      |
| --------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| tenantId  | string                                                          | The ID of the tenant.                                            |
| flowId    | string                                                          | The ID of the settlement flow configuration.                     |
| configId  | string                                                          | The ID of the cross-border settlement configuration.             |
| name      | string                                                          | The text name of the cross-border settlement configuration.      |
| steps     | [XBSettlementConfigStepsRecord](#xbsettlementconfigstepsrecord) | The recorded steps of the cross-border settlement configuration. |

***

## XBSettlementConfigStep

| Parameter | Type                                          | Description                                               |
| --------- | --------------------------------------------- | --------------------------------------------------------- |
| stepType  | [XBSettlementStepType](#xbsettlementsteptype) | The type of step specified in the configuration.          |
| accountId | string                                        | The ID of the account initiating the flow execution step. |

***

## XBSettlementStepType

| Parameter            | Type   | Description                                                            |
| -------------------- | ------ | ---------------------------------------------------------------------- |
| XBSettlementStepType | string | Valid values: ON\_RAMP, VAULT\_ACCOUNT, OFF\_RAMP, FIAT\_DESTINATION . |

***

## XBSettlementFlowSetupStep

| Parameter          | Type                                    | Description                                                                                          |
| ------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| accountId          | string                                  | The ID of the account initiating the flow execution step.                                            |
| inputAmount        | [XBSettlementAsset](#xbsettlementasset) | The type and amount of an asset input in the cross-border settlement configuration.                  |
| outputAmount       | [XBSettlementAsset](#xbsettlementasset) | The type and amount of an asset output in the cross-border settlement configuration.                 |
| estimatedFeeAmount | [XBSettlementAsset](#xbsettlementasset) | The type and amount of asset fees estimated in the cross-border settlement configuration.            |
| estimatedTime      | number                                  | The amount of time estimated for the complete cross-border settlement flow setup step to be executed |

***

## XBSettlementFlowSetupModel

| Parameter               | Type                                                        | Description                                                                                         |
| ----------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| tenantId                | string                                                      | The ID of the tenant.                                                                               |
| flowId                  | string                                                      | \[Optional] The ID of the settlement flow configuration.                                            |
| configId                | string                                                      | The ID of the cross-border settlement configuration.                                                |
| steps                   | [XBSettlementFlowStepsRecord](#xbsettlementflowstepsrecord) | The specified steps for the cross-border settlement flow configuration.                             |
| inputAmount             | [XBSettlementAsset](#xbsettlementasset)                     | The type and amount of an asset input in the cross-border settlement configuration.                 |
| outputAmount            | [XBSettlementAsset](#xbsettlementasset)                     | The type and amount of an asset output in the cross-border settlement configuration.                |
| totalEstimatedFeeAmount | [XBSettlementAsset](#xbsettlementasset)                     | The type and total amount of asset fees estimated in the cross-border settlement configuration.     |
| totalEstimatedTime      | number                                                      | The amount of total time estimated for each cross-border settlement flow setup step to be executed. |

***

## XBSettlementFlowExecutionModel

| Parameter    | Type                                                                | Description                                                                           |
| ------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| tenantId     | string                                                              | The ID of the tenant.                                                                 |
| flowId       | string                                                              | The ID of the settlement flow configuration.                                          |
| configId     | string                                                              | The ID of the cross-border settlement configuration.                                  |
| steps        | [XBSettlementFlowExecutionStep](#xbsettlementflowexecutionstep)     | The instructions for the specified cross-border settlement flow configuration step.   |
| inputAmount  | [XBSettlementAsset](#xbsettlementasset)                             | The type and amount of an asset input in the cross-border settlement configuration.   |
| outputAmount | [XBSettlementAsset](#xbsettlementasset)                             | The type and amount of an asset output in the cross-border settlement configuration.  |
| totalFees    | [XBSettlementAsset](#xbsettlementasset)                             | The type and amount of total asset fees in the cross-border settlement configuration. |
| initiatedAt  | number                                                              | The time the flow execution was initiated.                                            |
| initiatedBy  | string                                                              | The ID of the user who initiated the flow execution.                                  |
| state        | [XBSettlementFlowExecutionStatus](#xbsettlementflowexecutionstatus) | The status of the flow execution.                                                     |

***

## XBSettlementConfigStepsRecord

| Parameter | Type                                          | Description                                               |
| --------- | --------------------------------------------- | --------------------------------------------------------- |
| stepType  | [XBSettlementStepType](#xbsettlementsteptype) | The type of step specified in the configuration.          |
| accountId | string                                        | The ID of the account initiating the flow execution step. |

***

## XBSettlementFlowStepsRecord

| Parameter                 | Type                                                    | Description                                                                 |
| ------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| stepType                  | [XBSettlementStepType](#xbsettlementsteptype)           | The type of step specified in the configuration.                            |
| XBSettlementFlowSetupStep | [XBSettlementFlowSetupStep](#xbsettlementflowsetupstep) | The arrangement and setup of steps for the cross-border configuration flow. |

***

## XBSettlementAsset

| Parameter | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| amount    | string | The amount of the asset being used in the cross-border settlement.           |
| assetId   | string | The ID of the specific asset type being used in the cross-border settlement. |
