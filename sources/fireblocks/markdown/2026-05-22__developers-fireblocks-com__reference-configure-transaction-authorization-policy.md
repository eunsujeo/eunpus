> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Configure Policies

# The Policy Rules structure

The Policy Rule object represents a single unit of logic that Policies enforce. Understanding the structure and constraints of this object is crucial to working with Policy Editor APIs. The same object is used when working with Policy Drafts. To publish a single rule or a set of rules, pass an array inside the request body that holds one or more Policy Rule objects. Each Policy Rule object in the array should have the following mandatory fields:

| Field          | Type   | Values                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Action         | String | ALLOW, BLOCK, 2-TIER  | Defines what occurs when a transaction meets the rule's criteria.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Asset          | String |                       | Defines the type of asset being transacted. Use “\*” for all assets, or specify a specific `assetID` string that can be obtained using the [List all asset types supported by Fireblocks endpoint](/api-reference/blockchains-&-assets/list-assets-legacy) .                                                                                                                                                                                                                                            |
| amountCurrency | String | USD, EURO, NATIVE     | Limits the amount of any asset users can transfer based on their NATIVE value or based on their USD or EURO equivalents.                                                                                                                                                                                                                                                                                                                                                                                |
| Src and dst    | String |                       | Defines source and destination accounts the rule allows transfers to originate from and be sent to.                                                                                                                                                                                                                                                                                                                                                                                                     |
| amountScope    | String | SINGLE\_TX, TIMEFRAME | This limit applies to a single transaction or to all transactions within the defined time period.                                                                                                                                                                                                                                                                                                                                                                                                       |
| Amount         | String |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| periodSec      | Number |                       | Time period in seconds which applies to the `amountScope` field to accumulate transferred amounts in transactions that match the rule, until the total exceeds the value you specify under Minimum. When the specified amount is reached within that period, whether by one or many transactions, further transactions in that period either fail or require more approvals.   - *Note:*\* If `amountScope` = “SINGLE\_TX”, meaning that the rule should not cover a Time period, set `periodSec` = “0” |
| Type           | String | TRANSFER (Default)    | The default value of TRANSFER is fixed and the value cannot be changed. If you wish to change the rule to apply on any of the other possible transaction types, add the `transactionType` key. \*\*Note:\*\*Additional mandatory fields apply when changing the `transactionType`.                                                                                                                                                                                                                      |

# Objects within the Policy Rule

## externalDescriptor

Each Policy rule receives a unique string ID identifying it. A “rule” is an object managed separately in Fireblocks as part of the Policy. The `externalDescriptor` key is an object holding that string ID value. This value is used to reference the specific rule when you wish to overwrite an existing rule using the [Send publish request for a set of policy rules endpoint](/api-reference/policy-editor-beta/send-publish-request-for-a-set-of-policy-rules). It is also referenced after the Policy Validation process is executed, and its response is returned under the `checkResult` object.

## Operators

Pass one or more `userID` strings inside an array of strings as the value for the “users” key in order to represent the users that are allowed to sign the transactions which are relevant under the scope of this rule. Use the [List users endpoint](/api-reference/users/list-users) to obtain the user IDs.

```json theme={"system"}
"operators": {
             "usersGroups": ["userId1", "userId2", "userId3"]
           },
```

Alternatively, to configure a rule where all users are allowed, replace the “users” key with the "wildcard" key and pass `*`.

```json theme={"system"}
"operators": {
             "wildcard": "*"
           },
```

Passing an Array of “userGroups” instead of “users” is optional. Use the [List user groups endpoint](/reference/getusergroups) to obtain the `userGroups` IDs.

```json theme={"system"}
"operators": {
             "userGroups": ["userGroupID1", "userGroupID2"]
           },
```

Check the example section below for payloads that have rules defined with either option.

## transactionType

It is possible to pass the transactionType key with either of the below values to configure a rule for the following types:

* TRANSFER - Default. Transfers funds from one account to another.
* CONTRACT\_CALL - calls a smart contract.
* APPROVE - enables the approve function to be used for a smart contract to withdraw from a designated wallet. [Learn more](https://support.fireblocks.io/hc/en-us/articles/4404616097426-Approve-Transaction-Amount-Cap).
* MINT - performs a mint operation (increases supply) on a supported token.
* BURN - performs a burn operation (reduces supply) on a supported token.
* STAKE - allows you to allocate and lock assets supported for staking to accrue rewards. [Learn more](https://support.fireblocks.io/hc/en-us/articles/4417214701970-Staking-on-Fireblocks).
* RAW - an off-chain message used to sign any message with your private key.
* TYPED\_MESSAGE - an off-chain message type that follows a predefined format and used to sign specific ETH or BTC messages.

Each of the Policy rule types may have different mandatory fields that are seen inside the endpoint’s [API reference documentation](/api-reference/policy-editor-beta/send-publish-request-for-a-set-of-policy-rules). For example, for the TRANSFER type, you can use any of the following sources or destinations:

* `*`
* VAULT
* ONE\_TIME\_ADDRESS
* EXCHANGE
* UNMANAGED
* NETWORK\_CONNECTION
* FIAT\_ACCOUNT

> **Note**
>
> Using ONE\_TIME\_ADDRESS, UNMANAGED & NETWORK\_CONNECTION is only possible under DST.

## SRC & DST

Standard Transfer rules as well as Contract Call rules limit the activity for specific sources or destinations. Exceptions to these rules, where the rule should not include a destination limitation, are Typed Message, RAW and Burn rule types.

The SRC & DST object structures should be an array of arrays. Each array can hold an array of either:

* A single key - “wildcard”, as the type of address should not be indicated
* Two keys - ID and Type
* Three keys - ID, Type, and Subtype of the address

```json theme={"system"}
            "dst": {
                 "ids": [
                     [
                         "*",
                         "UNMANAGED"
                     ],
                     [
                         "*",
                         "EXCHANGE",
                         "*"
                     ],
                     [
                         "*",
                         "NETWORK_CONNECTION",
                         "*"
                     ]
                 ]
             },
             "src": {
                 "ids": [
                     [
                         "*",
                         "VAULT",
                         "*"
                     ],
                     [
                         "*",
                         "EXCHANGE",
                         "KRAKEN"
                     ]
                 ]
             },
```

Check the example section below for full payloads that have rules defined with either option.

# Publishing, approving and validating Policy rules

A Policy should normally have more than a single rule to govern the operations of the workspace. Therefore, multiple Policy Rule objects are passed inside the “rules” object. The [Send publish request for a set of policy rules endpoint](/api-reference/policy-editor-beta/send-publish-request-for-a-set-of-policy-rules) should receive a payload of your entire Policy. Check the example section below for payloads that have multiple rules defined.

# Publish a Poli​​cy using an SDK

To publish your Policy, use the `publishPolicyRules` SDK method and include the Policy Rule object. In the following example, you can see the passed object named “rule”. As mentioned, a typical Policy includes rules which are sent under the same array as a separate object.

Here is a code sample for configuring a single rule allowing ETH transactions:

```javascript theme={"system"}
async function publishPolicyRules(){[
   rule = [
       	{
             "action": "ALLOW",
             "asset": "ETH",
             "amountCurrency": "USD",
             "src": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
      "dst": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
             "amountScope": "SINGLE_TX",
             "amount": "0",
             "periodSec": 0,
             "type": "TRANSFER",
             "operators": {
                 "wildcard": "*"
             }
      }
  	]
   ]
   console.log(typeof(rule));
   const publishPolicyRules = await fireblocks.publishPolicyRules(rule);
   console.log(JSON.stringify(publishPolicyRules, null, 2));
}
```

Check the example section below for payloads that have multiple rules defined.

## Edit an Existing Policy rule

Using the [Send publish request for a set of policy rules endpoint](/api-reference/policy-editor-beta/send-publish-request-for-a-set-of-policy-rules), you can edit existing rules by passing the Policy Rule object details and adding the externalDescriptor ID of an existing rule that you wish to overwrite. Get the externalDescriptor from the [Get the active policy and its validation endpoint](/api-reference/policy-editor-beta/get-the-active-policy-and-its-validation). To edit multiple rules, pass the Policy Rule object and add each rule’s unique externalDescriptor in every rule object.

# Approving the Policy change inside the Console

Once you execute the code as the example above shows, your workspace Owner will receive a **Review Policy changes** notification in their Console. They will have to login and review the changes prior to getting the approval request on their mobile device.

Below is the notification that the Owner should look for once logging into the Console and navigating to the **Settings** page:

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/8d77558-img2.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=07b53d8953fc786145a1b021bd0d9698" alt="" width="634" height="236" data-path="images/docs/8d77558-img2.png" />

On the top-right side of the screen, the following will appear:

<img src="https://mintcdn.com/fireblocks-43c4b3ee/Pe8CxJ47xNI_qfOs/images/docs/f5cbace-img3.png?fit=max&auto=format&n=Pe8CxJ47xNI_qfOs&q=85&s=152bf0bc4dd2decf57d50d06d98c40a9" alt="" width="760" height="158" data-path="images/docs/f5cbace-img3.png" />

# Customizing the Rules

## Time-Based Threshold

Passing the `amountAggregation` object, together with the amountScope key (set to “TIMEFRAME”) and the `periodSec` (representing the time period in seconds), will configure the rule to match the aggregated value of transactions, the source and destination inclusion pattern, and the time period.

### Note:

This is a mandatory ***number*** parameter that should be set to “0” if no Time Based Threshold is used in the rule.

**Example**: Block transfers when a \$15,000 accumulation is reached over a 12-hour period (12hx60mx60s=43200 seconds))

```json theme={"system"}
             "action": "BLOCK",
             "amount": "15000",
             "amountCurrency": "USD",
             "transactionType": "TRANSFER",
             "allowedAssetTypes": "FUNGIBLE",

             "amountAggregation": {
                 "operators": "ACROSS_ALL_MATCHES",
                 "dstTransferPeers": "ACROSS_ALL_MATCHES",
                 "srcTransferPeers": "ACROSS_ALL_MATCHES"
             },
             "amountScope": "TIMEFRAME",
             "periodSec": 43200,
```

## applyForApprove

Passing this key with a True value, will configure a Contract\_Call rule to match for initial “Approve” transaction used in Web3 smart contracts.

```json theme={"system"}
       "applyForApprove": true,
```

## applyForTypedMessage

Passing this key with a True value, when configuring a Contract\_Call rule, will match interactions with decentralized apps (dApps) that require signing EIP-712 or ETH personal messages. Alternatively, you can create a separate Typed\_Message type rule for that purpose only. Configuring this key is relevant for Contract\_Call rules when one-time address (OTA) and whitelisted destinations are used or for Off-chain messages that have no destination.

```json theme={"system"}
           "applyForTypedMessage": true,
```

## rawMessageSigning

Passing this object, will configure the rule to match specific Raw Signing messages by either their derivation paths(s) or their signing algorithm.

```json theme={"system"}
       "rawMessageSigning": {
          "algorithm": "MPC_ECDSA_SECP256K1",
          "derivationPath": {
            "path": [
              44,0,0,0,0
            ]
          }
        },
```

This is applicable when the rule is configured with the “All vaults” as the source. In the example below, the SRC object limits the source to the “Vault” type. Unlike the other types of sources allowed, vaults have a derivation path per each asset wallet. [See Policy Rules for RAW Signing](https://support.fireblocks.io/hc/en-us/articles/4413379762450-Raw-Signing).

```json theme={"system"}
           "src": {
               "ids": [
                   [
                     "*",
                     "VAULT",
                     "*"
                   ]
                 ]
           },
```

Note that passing the “derivationPath” key is mandatory while passing “algorithm” is optional.

# Policy Validation

Fireblocks checks your rule submission for errors. Each rule receives a unique string ID identifying the rule. The rule ID is returned under the Policy response body inside the `externalDescriptor` parameter. Together with the details of the submitted rule(s), the Policy response object shows additional validation-related details under the status key and the `checkResult` object:

* `status`: the status of the Policy operation
* `checkResult`: an object showing the details of the check for each rule submitted
* `errors`(1): a number indicating the total amount of errors found
* `results`: an array holding the details of the validation per each rule submitted. Each validation result will have an index key that represents the position of the rule within the set of Policy rules. Each validation will contain an array of errors found within it.
* `errors` (2): an array of objects, each reflecting the specific error details identified.

Here is an example Response object showing the validation fields (the rule itself is redacted):

```json theme={"system"}
{
 "status": "INVALID_CONFIGURATION",
 "checkResult": {
   "errors": 1,
   "results": [
     {
       "index": 0,
       "externalDescriptor": "{\"id\":\"1e9cf057-028d-4657-8da1-b604800ed198\"}",
       "status": "failure",
       "errors": [
         {
           "errorMessage": "INVALID_ASSET_TYPE",
           "errorCode": 2,
           "errorCodeName": "INVALID_PARAMETERS",
           "errorField": "allowedAssetTypes"
         }
       ]
     }
   ]
 }
}
```

# Metadata response object

Together with the details of the submitted rule(s), the status of the Policy submission, and the `checkResult` object, the Policy response object holds a few important metadata details:

* `editedAt`: the timestamp of receiving the Policy edit request
* `editedBy`: the user ID submitting the Policy
* `publishedAt`: the timestamp of publishing the Policy
* `publishedBy`: the user ID that published the Policy

Example Metadata object details that are a part of the Policy Response object:

```yaml theme={"system"}
 "metadata": {
 "editedAt": 1708865838000,
 "editedBy": "a54eb4b7-6a90-2e26-50c1-94369aa00177",
 "publishedAt": 1708865838314,
 "publishedBy": "a54eb4b7-6a90-2e26-50c1-94369aa00177"
}
```

# Policy examples

* Transfer OTA
* Transfer accumulated
* Contract Call

The following JSON sequence shows a set of transfer rules demonstrating the usage of `designatedSigners`, `authorizationGroups`, and operators (initiators) in an individual/group/combined configuration. Also, notice that `dstAddressType` matches the specific destination type.

The flow in this example shows:

* A separate handling of One-time Address destinations, requiring special approvals and signature.
* Four consecutive rules that define permitted transfers to whitelisted destinations for:
  * Overall accumulation which blocks deviating transfers.
  * Requirement of special approvals for single transactions above a certain amount and between specific sets of venues.
  * Definition of the most permitted transfer rule for transactions that do not match preceding rules.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/e13a587-img4.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=1eee975b61d598b3e535ed6a29b7fc5f" alt="" width="2394" height="576" data-path="images/docs/e13a587-img4.png" />

```json theme={"system"}
{
 "draftResponse": {
     "draftId": "0f8f98d8-43d8-4b68-b167-9b1e35c99e2e",
     "status": "UNVALIDATED",
     "rules": [
         {
             "dst": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
             "src": {
                 "ids": [
                     [
                         "*",
                         "VAULT",
                         "*"
                     ]
                 ]
             },
             "type": "TRANSFER",
             "asset": "*",
             "action": "2-TIER",
             "amount": "0",
             "operators": {
                 "usersGroups": [
                     "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                 ]
             },
             "periodSec": 0,
             "amountScope": "SINGLE_TX",
             "amountCurrency": "USD",
             "dstAddressType": "ONE_TIME",
             "applyForApprove": false,
             "transactionType": "TRANSFER",
             "allowedAssetTypes": "FUNGIBLE",
             "designatedSigners": {
                 "users": [
                     "316c2789-e8f0-45a3-9d2f-16cfec340a10"
                 ],
                 "usersGroups": [
                     "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                 ]
             },
             "externalDescriptor": "{\"id\":\"ca863088-718b-4516-820c-3d06e80c4aad\"}",
             "authorizationGroups": {
                 "logic": "OR",
                 "groups": [
                     {
                         "th": 2,
                         "users": [
                             "9e165261-cffc-4a7f-9f7e-3ed515cfbf16"
                         ],
                         "usersGroups": [
                             "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                         ]
                     }
                 ],
                 "allowOperatorAsAuthorizer": false
             }
         },
         {
             "dst": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
             "src": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
             "type": "TRANSFER",
             "asset": "*",
             "action": "BLOCK",
             "amount": "10000000",
             "operators": {
                 "usersGroups": [
                     "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                 ]
             },
             "periodSec": 86400,
             "amountScope": "TIMEFRAME",
             "amountCurrency": "USD",
             "dstAddressType": "WHITELISTED",
             "applyForApprove": false,
             "transactionType": "TRANSFER",
             "allowedAssetTypes": "FUNGIBLE",
             "amountAggregation": {
                 "operators": "ACROSS_ALL_MATCHES",
                 "dstTransferPeers": "ACROSS_ALL_MATCHES",
                 "srcTransferPeers": "ACROSS_ALL_MATCHES"
             },
             "externalDescriptor": "{\"id\":\"b4c22327-e0cb-4a8b-9d81-7e352ab4e213\"}"
         },
         {
             "dst": {
                 "ids": [
                     [
                         "*",
                         "UNMANAGED"
                     ],
                     [
                         "*",
                         "EXCHANGE",
                         "*"
                     ],
                     [
                         "*",
                         "NETWORK_CONNECTION",
                         "*"
                     ]
                 ]
             },
             "src": {
                 "ids": [
                     [
                         "*",
                         "VAULT",
                         "*"
                     ],
                     [
                         "*",
                         "EXCHANGE",
                         "KRAKEN"
                     ]
                 ]
             },
             "type": "TRANSFER",
             "asset": "*",
             "action": "2-TIER",
             "amount": "100000",
             "operators": {
                 "usersGroups": [
                     "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                 ]
             },
             "periodSec": 0,
             "amountScope": "SINGLE_TX",
             "amountCurrency": "USD",
             "dstAddressType": "WHITELISTED",
             "applyForApprove": false,
             "transactionType": "TRANSFER",
             "allowedAssetTypes": "FUNGIBLE",
             "externalDescriptor": "{\"id\":\"ea2a03cc-05da-4bdc-a119-4ba23798ed22\"}",
             "authorizationGroups": {
                 "logic": "OR",
                 "groups": [
                     {
                         "th": 1,
                         "users": [
                             "9e165261-cffc-4a7f-9f7e-3ed515cfbf16",
                             "316c2789-e8f0-45a3-9d2f-16cfec340a10"
                         ],
                         "usersGroups": [
                             "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                         ]
                     }
                 ],
                 "allowOperatorAsAuthorizer": false
             }
         },
         {
             "dst": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
             "src": {
                 "ids": [
                     [
                         "*"
                     ]
                 ]
             },
             "type": "TRANSFER",
             "asset": "*",
             "action": "ALLOW",
             "amount": "0",
             "operators": {
                 "usersGroups": [
                     "5a325451-d970-4dd0-87e4-ae2c54936f4f"
                 ]
             },
             "periodSec": 0,
             "amountScope": "SINGLE_TX",
             "amountCurrency": "USD",
             "dstAddressType": "WHITELISTED",
             "applyForApprove": false,
             "transactionType": "TRANSFER",
             "allowedAssetTypes": "FUNGIBLE",
             "externalDescriptor": "{\"id\":\"3972a016-6903-4eb6-85f4-07192392f82f\"}"
         }
     ],
     "metadata": {
         "editedBy": "316c2789-e8f0-45a3-9d2f-16cfec340a10",
         "editedAt": "2024-02-18T16:19:51.000Z"
     }
 },
 "validation": {
     "status": "SUCCESS",
     "checkResult": {
         "errors": 0,
         "results": [
             {
                 "index": 0,
                 "externalDescriptor": "{\"id\":\"ca863088-718b-4516-820c-3d06e80c4aad\"}",
                 "status": "ok",
                 "errors": []
             },
             {
                 "index": 1,
                 "externalDescriptor": "{\"id\":\"b4c22327-e0cb-4a8b-9d81-7e352ab4e213\"}",
                 "status": "ok",
                 "errors": []
             },
             {
                 "index": 2,
                 "externalDescriptor": "{\"id\":\"ea2a03cc-05da-4bdc-a119-4ba23798ed22\"}",
                 "status": "ok",
                 "errors": []
             },
             {
                 "index": 3,
                 "externalDescriptor": "{\"id\":\"3972a016-6903-4eb6-85f4-07192392f82f\"}",
                 "status": "ok",
                 "errors": []
             }
         ]
     }
 }
}
```

The next JSON example demonstrates similar sets of rules which can be placed within your Policy, according to the first-match principle, to allow web3 interactions.

The flow in this example shows:

* A permissive rule for Contract Calls performed from a specific vault designated to whitelisted contracts
* A Contract Call rule that allows other vaults to interact with whitelisted contracts upon approval
* A rule that allows users to interact with non-whitelisted contracts with more restrictive approvals

<img src="https://mintcdn.com/fireblocks-43c4b3ee/Pe8CxJ47xNI_qfOs/images/docs/f5dcec8-img5.png?fit=max&auto=format&n=Pe8CxJ47xNI_qfOs&q=85&s=8f8e8eba692aad2c67a6416c1daca9d7" alt="" width="2376" height="588" data-path="images/docs/f5dcec8-img5.png" />

```json theme={"system"}
{
 "policy": {
   "rules": [
     {
       "dst": {
         "ids": [
           [
             "*",
             "UNMANAGED",
             "CONTRACT"
           ]
         ]
       },
       "src": {
         "ids": [
           [
             "0",
             "VAULT",
             "*"
           ]
         ]
       },
       "type": "TRANSFER",
       "asset": "*",
       "action": "ALLOW",
       "amount": 0,
       "operators": {
         "usersGroups": [
           "5a325451-d970-4dd0-87e4-ae2c54936f4f"
         ]
       },
       "periodSec": 0,
       "amountScope": "SINGLE_TX",
       "amountCurrency": "USD",
       "dstAddressType": "WHITELISTED",
       "applyForApprove": true,
       "transactionType": "CONTRACT_CALL",
       "allowedAssetTypes": "FUNGIBLE",
       "applyForDeployment": false,
       "externalDescriptor": "{\"id\":\"3972a016-6903-4eb6-85f4-07192392f82f\"}",
       "applyForTypedMessage": true
     },
     {
       "dst": {
         "ids": [
           [
             "*",
             "UNMANAGED",
             "CONTRACT"
           ]
         ]
       },
       "src": {
         "ids": [
           [
             "*",
             "VAULT",
             "*"
           ]
         ]
       },
       "type": "TRANSFER",
       "asset": "*",
       "action": "2-TIER",
       "amount": 0,
       "operators": {
         "usersGroups": [
           "5a325451-d970-4dd0-87e4-ae2c54936f4f"
         ]
       },
       "periodSec": 0,
       "amountScope": "SINGLE_TX",
       "amountCurrency": "USD",
       "dstAddressType": "WHITELISTED",
       "applyForApprove": true,
       "transactionType": "CONTRACT_CALL",
       "allowedAssetTypes": "FUNGIBLE",
       "applyForDeployment": false,
       "externalDescriptor": "{\"id\":\"059c0bb7-807a-4de2-a250-bc933e3c8969\"}",
       "authorizationGroups": {
         "logic": "OR",
         "groups": [
           {
             "th": 1,
             "usersGroups": [
               "5a325451-d970-4dd0-87e4-ae2c54936f4f"
             ]
           }
         ],
         "allowOperatorAsAuthorizer": false
       },
       "applyForTypedMessage": true
     },
     {
       "dst": {
         "ids": [
           [
             "*"
           ]
         ]
       },
       "src": {
         "ids": [
           [
             "*",
             "VAULT",
             "*"
           ]
         ]
       },
       "type": "TRANSFER",
       "asset": "*",
       "action": "2-TIER",
       "amount": 0,
       "operators": {
         "usersGroups": [
           "5a325451-d970-4dd0-87e4-ae2c54936f4f"
         ]
       },
       "periodSec": 0,
       "amountScope": "SINGLE_TX",
       "amountCurrency": "USD",
       "dstAddressType": "ONE_TIME",
       "applyForApprove": true,
       "transactionType": "CONTRACT_CALL",
       "allowedAssetTypes": "FUNGIBLE",
       "applyForDeployment": false,
       "externalDescriptor": "{\"id\":\"ee775834-e46c-4413-a713-de114c0193eb\"}",
       "authorizationGroups": {
         "logic": "OR",
         "groups": [
           {
             "th": 2,
             "usersGroups": [
               "5a325451-d970-4dd0-87e4-ae2c54936f4f"
             ]
           }
         ],
         "allowOperatorAsAuthorizer": false
       },
       "applyForTypedMessage": true
     }
   ],
   "metadata": {
     "publishedBy": "316c2789-e8f0-45a3-9d2f-16cfec340a10",
     "publishedAt": 1710168706517
   }
 },
 "validation": {
   "status": "SUCCESS",
   "checkResult": {
     "errors": 0,
     "results": [
       {
         "index": 0,
         "externalDescriptor": "{\"id\":\"3972a016-6903-4eb6-85f4-07192392f82f\"}",
         "status": "ok",
         "errors": []
       },
       {
         "index": 1,
         "externalDescriptor": "{\"id\":\"059c0bb7-807a-4de2-a250-bc933e3c8969\"}",
         "status": "ok",
         "errors": []
       },
       {
         "index": 2,
         "externalDescriptor": "{\"id\":\"ee775834-e46c-4413-a713-de114c0193eb\"}",
         "status": "ok",
         "errors": []
       }
     ]
   }
 }
}
```
