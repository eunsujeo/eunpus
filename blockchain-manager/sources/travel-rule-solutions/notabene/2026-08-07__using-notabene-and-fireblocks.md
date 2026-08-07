---
updatedAt: 2026-01-21T13:23:24.000Z
---

Fetch the complete documentation index at: https://devx.notabene.id/llms.txt. Use this file to discover all available pages before exploring further.

# Fireblocks Integration Overview

Leveraging the power of Notabene travel rule compliance directly in your Fireblocks workspace.

> 📘 Fireblocks is currently integrated with Notabene V1

## What is the Notabene Fireblocks Integration?

Fireblocks has integrated Notabene directly into the Fireblocks workspace and API to allow customers to easily access Travel Rule compliance from their pre-existing Fireblocks installation.

***

<br />

## Why use the Notabene Fireblocks Integration?

The Notabene Fireblocks integration allows you to...

* Seamlessly tie the response of a travel rule message to the execution of a blockchain transaction
* Auto respond to incoming travel rule messages
* Detect incoming blockchain transactions missing a corresponding travel rule message
* Access travel rule compliance directly in your Fireblocks workspace

***

<br />

## How do you know if the Notabene Fireblocks Integration is right for you?

* Are you an existing Fireblocks customer?
* Are you using the Fireblocks API or Javascript SDK to create transactions?
* Are you interested in pre-transaction risk mitigation and travel rule compliance?
  * New to travel rule? Check out our travel rule 101 guide [here](https://notabene.id/crypto-travel-rule-101/what-is-the-crypto-travel-rule)!

If you answered yes to the above questions then the Notabene Fireblocks Integration is likely a good fit for you!

If you are not a Fireblocks customer but you are interested in travel rule compliance then check out our general docs [here](https://devx.notabene.id/docs/welcome).

If you are currently a Fireblocks customer but you are using the Fireblocks Python SDK then the integration will provide *some* but not *all* of the functionality needed for travel rule compliance, in which case you will need to fill in the gaps with the Notabene API. Reach out to Notabene [support](support@notabene.id) and we're happy to walk you through it.

***

<br />

## Using the Integration vs. using Notabene and Fireblocks Separately

How is using the Notabene Fireblocks Integration different from using Notabene and Fireblocks separately?

### Notabene Fireblocks Integration

<Image align="center" src="https://files.readme.io/e77cbf2-FireblocksNotabeneIntegration.png" />

#### What has Fireblocks already implemented?

Withdrawals:

1. The forwarding of travel rule data to Notabene.
2. Configuration of a webhook that detects when a travel rule message has reached the desired state to proceed with transferring funds on the blockchain.
3. Updating the travel rule message with the blockchain transaction hash.

Deposits:

1. Confirmation of destination blockchain address ownership.
2. Detecting and handling incoming blockchain transactions with no travel rule message.

***

<br />

#### What has to be implemented by the VASP?

Withdrawals:

1. Front end data collection and validation.
2. Encryption of PII data using the Notabene PII SDK.
3. Appending required travel rule data (including encrypted PII) to your transaction using the Fireblocks SDK or API.

Deposits:

1. **(optional depending on jurisdictional requirements):** Additional data collection from the user when a blockchain transaction comes without travel rule message.

***

<br />

### Using Notabene and Fireblocks Separately

<Image align="center" src="https://files.readme.io/b73e3ec-FireblocksNotabeneSeparate.png" />

You can also use Notabene and Fireblocks separately.

You would first follow a typical travel rule flow and then only initiate the transaction on Fireblocks once you have a positive travel rule status. This would involve more integration work as you need to integrate with both the Fireblocks API and the Notabene API, however you would no longer need to use the Notabene PII SDK as you can send the PII directly to Notabene and it does not have to pass through the Fireblocks system.

***

<br />

## Safeguarding PII Data

Travel Rule compliance involves sending and receiving PII data. Therefore extra measures must be taken to ensure the safeguarding of this sensitive data.

All travel rule messages sent through Fireblocks must be [hybrid encrypted](https://devx.notabene.id/docs/encryption-flows#hybrid-encryption) or [end-to-end encrypted](https://devx.notabene.id/docs/encryption-flows#end-to-end-encryption) using the Notabene PII SDK. You can read more about Notabene's PII encryption [here](https://devx.notabene.id/docs/encryption-flows) and you can see examples of how to encrypt data sent through Fireblocks on the next page.