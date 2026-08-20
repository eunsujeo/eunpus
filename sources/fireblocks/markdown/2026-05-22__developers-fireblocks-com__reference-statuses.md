> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Statuses

# Overview

This article describes primary transaction statuses on Fireblocks and how they appear in the Fireblocks Console and API.

Many primary transaction statuses have substatuses that include additional status-related information. Learn more about [transaction substatuses](/reference/sub-statuses).

Transaction statuses are displayed in the Transaction History and the Recent Activity panel in the Fireblocks Console. You can hover over the status in the Recent Activity panel to see the substatus and additional details.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/51f0c38-Transaction_status_tooltip.jpg?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=f9df7c57f2cb8d88e1d6eed06bc7cd43" alt="" width="1044" height="946" data-path="images/docs/51f0c38-Transaction_status_tooltip.jpg" />

# Primary transaction statuses

## Submitted

The **Submitted** status indicates an outgoing transaction was submitted to the Fireblocks system and is currently being processed. It is the first stage for any outgoing transaction where AML/KYC screening is not enabled.

* **API status code:** SUBMITTED
* **Appears in the Fireblocks Console as:** Submitted

The status can be followed by **Queued** and then continue being processed.

Submitted transactions can be blocked by the Fireblocks Policy Engine or otherwise fail, with a substatus that includes additional information.

***

## Pending Screening

The **Pending Screening** status indicates a transaction’s progress depends on the transaction screening result from your Anti-Money Laundering (AML) provider or Travel Rule provider. Only transactions from workspaces with the AML or Travel Rule feature enabled can have this status.

* **API status code:** PENDING\_AML\_SCREENING
* **Appears in the Fireblocks Console as:** Pending Screening

This transaction status is not the same as the transaction’s [AML screening status](https://support.fireblocks.io/hc/en-us/articles/360014290380#screening-statuses-0-6) or [Travel Rule screening status](https://support.fireblocks.io/hc/en-us/articles/8271647366812-Travel-Rule-transaction-screening). Under certain circumstances, a transaction’s *screening* status can appear as **Pending** even when its transaction status shows as **Completed** on the Recent Activity panel. When you receive the screening result, you can view it in the transaction’s details on the Transaction History page.

***

## Pending Enrichment

The **Pending Enrichment** status indicates a transaction’s progress depends on the result of Fireblocks’ internal security screening. This security enhancement looks for connections to known smart contract vulnerabilities in limited situations. If a transaction is successfully enriched, some additional metadata is added to the transaction, and the transaction signer may see additional information on their Fireblocks mobile app. No additional notifications or actionable data are sent to the API Co-signer.

This internal security screening and enrichment takes place while initiating a transaction and usually takes a few seconds to complete. The status is followed by Pending Authorization. If security enrichment is unsuccessful, the transaction continues processing and does not fail. This security screening will not affect the approval flow of your transactions.

Three types of transactions can be enriched:

* **Typed messages on any EVM blockchain**: The typed message is parsed and displayed to the transaction signer.
* **Contract calls on Ethereum**: A simulation of the contract runs to see which vault assets and balances will be affected, and their projected final values. Outgoing and incoming values, and expected transaction fees are displayed to the transaction signer.
* **Any transaction initiated by a dApp**: The dApp and the transaction destination are scanned for malicious concern. If the dApp is identified as suspicious, or the destination address is flagged as sanctioned, a notification is shown to the transaction signer. The signer can still choose to sign the transaction and continue.

[Learn more about the dApp Protection feature and its security screening](https://support.fireblocks.io/hc/en-us/articles/11497035958940-dApp-Protection).

* **API status code:** PENDING\_ENRICHMENT
* **Appears in the Fireblocks Console as:** Pending Security Screening

This transaction status is not the same as the [Pending Screening status](#pending-screening) , which correlates to the screening from your AML or Travel Rule provider.

***

## Pending Authorization

The **Pending Authorization** status indicates an outgoing transaction’s progress depends on a Fireblocks Console user, an API user, or a group of users authorizing the transaction, as defined by the Policies.

* **API status code:** PENDING\_AUTHORIZATION
* **Appears in the Fireblocks Console as:** Pending Authorization

This status should be followed by **Queued** if the transaction is authorized or **Cancelled** if the transaction is not authorized. If no action is taken for two hours, the transaction will fail. Learn more about [transaction authorization expiration](https://support.fireblocks.io/hc/en-us/articles/360015963760).

***

## Queued

The **Queued** status indicates an outgoing transaction is queued for processing.

* **API status code:** QUEUED
* **Appears in the Fireblocks Console as:** Queued

Fireblocks can only process a single transaction per blockchain standard per vault account. For example, if you create a transaction for an Ethereum blockchain asset and another transaction for a Polygon blockchain asset from the same vault account, then Fireblocks will process them one at a time for signing because they are both EVM-compatible assets. However, if you create a Bitcoin transaction and a Solana transaction from the same vault account, then both transactions will be processed simultaneously.

### Transactions stuck in the Queued status

When a transaction appears stuck in the **Queued** status, you should check for another transaction in the **Pending Signature** status. This transaction's details will show the user or users who need to sign or reject the transaction for it to progress, which will allow the next transaction to progress.

To help streamline signing and avoid delays associated with manual signing, we recommend that you install and configure an API Co-Signer to process and sign transactions automatically according to your Policy rules.

***

## Pending Signature

The **Pending Signature** status indicates an outgoing transaction is waiting to be signed by the transaction’s designated signer as defined in your Policy. You can view who the designated signer is by hovering over the transaction's status in the Recent Activity panel.

* **API status code:** PENDING\_SIGNATURE
* **Appears in the Fireblocks Console as:** Pending Signature

If no action is taken for two hours after authorization, the transaction will fail. Learn more about [transaction signing expiration](https://support.fireblocks.io/hc/en-us/articles/360015963760).

To help streamline signing and avoid delays associated with manual signing, we recommend installing and configuring an API Co-Signer to process and sign transactions automatically according to your Policy rules.

***

## Pending email approval

The **Pending email approval** status indicates the transaction is waiting for the required approval from a third-party service, such as an exchange. The manual approval is usually sent via email.

* **API status code:** PENDING\_3RD\_PARTY\_MANUAL\_APPROVAL
* **Appears in the Fireblocks Console as:** Pending email approval

***

## Processing at the exchange

The **Processing at the exchange** status indicates a transaction is waiting for approval by a third-party service, such as an exchange.

* **API status code:** PENDING\_3RD\_PARTY
* **Appears in the Fireblocks Console as:** Processing at the exchange

Learn more about [Processing at the exchange substatuses](/reference/sub-statuses#pending_3rd_party-sub-statuses).

***

## Broadcasting

The **Broadcasting** status indicates an outgoing transaction is being broadcast to the blockchain network.

* **API status code:** BROADCASTING
* **Appears in the Fireblocks Console as:** Broadcasting

Typically, a transaction should remain in this status for no longer than one minute, but it depends on the current load on the Fireblocks system. When a transaction remains in this status for longer than one minute, check the [Fireblocks Status page](https://status.fireblocks.com/) to see if there are ongoing service disruptions. If you don’t see any service disruptions, contact Fireblocks Support for assistance.

***

## Confirming

The **Confirming** status indicates a transaction is waiting to be confirmed on the blockchain. Fireblocks monitors the state of the transaction on the blockchain and updates its status accordingly.

* **API status code:** CONFIRMING
* **Appears in the Fireblocks Console as:** Confirming

Learn more about [Confirming substatuses](/reference/sub-statuses#confirming-sub-statuses).

***

## Completed

The **Completed** status indicates the transaction was completed successfully, is now part of the blockchain, and all assets have been transferred.

* **API status code:** COMPLETED
* **Appears in the Fireblocks Console as:** Completed

**Completed** is a final transaction status and marks the transaction as successful. After a transaction is marked as completed, all associated assets are no longer available in their source account.

> **Note**
>
> If you use [webhooks](https://support.fireblocks.io/hc/en-us/articles/4408110107794) to receive transaction status updates, you may receive multiple updates to the **Completed** status. For example, if your Deposit Control & Confirmation Policy is set for zero confirmations for a particular blockchain, you may receive a webhook notification for the **Completed** status when the transaction appears on the blockchain as well as on its first or further confirmations.

Learn more about [Completed substatuses](/reference/sub-statuses#completed-sub-statuses).

***

## Cancelling

The **Cancelling** status indicates a transaction was canceled or rejected by a Fireblocks user, such as the transaction’s initiator, approver, or designated signer.

* **API status code:** CANCELLING
* **Appears in the Fireblocks Console as:** Cancelling

Typically, a transaction should remain in this status for no longer than 30 seconds, but it depends on the current load on the Fireblocks system. When a transaction remains in this status for longer than 30 seconds, check the [Fireblocks Status page](https://status.fireblocks.com/) to see if there are ongoing service disruptions. If you don’t see any service disruptions, contact Fireblocks Support for assistance.

***

## Cancelled

The **Cancelled** status indicates a transaction was canceled or rejected by a Fireblocks user, such as the transaction’s initiator, approver, or designated signer, or by the third-party service that was the source of the transaction.

* **API status code:** CANCELLED
* **Appears in the Fireblocks Console as:** Cancelled

**Cancelled** is a final transaction status and marks the transaction as unsuccessful. After a transaction is marked as canceled, all associated assets are available for new transactions.

Learn more about [Cancelled substatuses](/reference/sub-statuses#cancelled-sub-statuses).

***

## Blocked by policy

The **Blocked by policy** status indicates an outgoing transaction was blocked from being completed due to a Policy rule.

* **API status code:** BLOCKED
* **Appears in the Fireblocks Console as:** Blocked by policy

**Blocked by policy** is a final transaction status and marks the transaction as unsuccessful. After a transaction is marked as blocked, all associated assets are available for new transactions.

### Resolving blocked transactions

Transactions that are blocked by policy include the corresponding Policy rule number as it appears in your workspace's settings. If you want to allow these transactions, create a new policy rule in a position that allows the transaction to be correctly enforced according to the first-match principle.

Learn more about [Blocked by policy substatuses](/reference/sub-statuses#blocked-sub-statuses).

***

## Rejected

The **Rejected** status indicates an incoming or outgoing transaction was rejected by the Fireblocks system, an Approver or a Signer, or by a third-party service.

* **API status code:** REJECTED
* **Appears in the Fireblocks Console as:** Rejected by AML, Manually frozen

Transactions that are rejected or manually frozen mark the transaction as unsuccessful. Note that:

* After an *outgoing* transaction is marked as rejected, all associated assets are available for new transactions.
* After an *incoming* transaction is marked as rejected, all associated assets will not be available until an Admin-level user unfreezes them.

Learn more about [Rejected substatuses](/reference/sub-statuses#rejected-sub-statuses).

***

## Failed

The **Failed** status indicates the transaction is no longer being processed and no assets have been transferred. Transactions can fail from any state.

* **API status code:** FAILED
* **Appears in the Fireblocks Console as:** Failed

**Failed** is a final transaction status and marks the transaction as unsuccessful. After a transaction is marked as failed, all associated assets are available for new transactions.

Learn more about [Failed substatuses](/reference/sub-statuses#failed-sub-statuses).
