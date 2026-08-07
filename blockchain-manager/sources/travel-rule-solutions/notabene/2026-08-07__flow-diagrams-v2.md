---
updatedAt: 2026-03-19T08:03:30.000Z
---

Fetch the complete documentation index at: https://devx.notabene.id/llms.txt. Use this file to discover all available pages before exploring further.

# Diagrams

Here you will find diagrams for withdrawals and deposits, showing how your system interacts with Notabene in both.

## Withdrawals

### 1a:  Data collection with Embedded Component

The diagram below shows the steps when your customer wants to request a withdrawal, and you have integrated the Notabene Embedded Component (widget) into your UI:

<Image align="center" src="https://files.readme.io/9904013c525fa8e42f894095c3f9848e3df92a53253820d920e7ba8b77d752de-withdrawalWidget.png" />

Once your customer has added the withdrawal information (asset, address, amount), the embedded component displays the required fields for the wallet itself and/or the beneficiary.

After the embedded component has collected all the data, push it to your backend, then pull the remaining PII for your customer from your internal KYC database.

<br />

Learn more about the [SafeConnect Components](https://devx.notabene.id/docs/safe-connect-components-v2)

***

<br />

### 1b:  Data collection with APIs

This diagram, similar to the above, shows the steps when using your \*\*own custom-built

UI\*\* to collect the required travel rule data:

<Image align="center" src="https://files.readme.io/3a88149cc76510ccffa867d6c8287de44f91e1e250523d87738e8522fdcb88ba-withdrawalOwnUI.png" />

<br />

Here you can see that there are two APIs that you'd usually call after your customer has added the withdrawal details:

1. <Anchor label="Address Ownership API" target="_blank" href="ref:address-ownership">Address Ownership API</Anchor> - returns information about the VASP hosting the destination wallet address, if available;
2. [GET /travelrule ](https://www.postman.com/notabene/notabene-public-travel-rule-apis/request/uxwi1or/check-threshold)to check if your transfer is subject to the Travel Rule;
3. [GET /travelrule](https://www.postman.com/notabene/notabene-public-travel-rule-apis/request/uxwi1or/check-threshold) API- returns which PII fields need to be collected from your customer;

**Note:** if the <Anchor label="Address Ownership API" target="_blank" href="ref:address-ownership">Address Ownership API</Anchor> doesn't return an owner, you should have your customer declare whether the destination wallet is `hosted` or `unhosted`.

If it is `hosted`, you should have a search field in your UI from where they can input the name of the VASP, which in turn <Anchor label="searches our network" target="_blank" href="ref:listentities">searches our network</Anchor> for a match.

The user selects the correct entity, and you use the vaspDID in a later API call when creating the message itself.

Learn more [here](https://devx.notabene.id/docs/data-collection#discovering-counterparties-optional)

***

<br />

### Using pre-collected/whitelisted data

If you require your customer to **pre-register** all addresses they want to interact with and they provide the type of wallet (unhosted or, if hosted, by whom), beneficiary name, etc., you might not need to make any changes to your UI and can jump straight to calling [create transfer](https://devx.notabene.id/reference/createtransfer) and [transfer append ](https://devx.notabene.id/reference/appendtransferpii)

> 📘 Using Notabene Embedded Component for interacting with the end user
>
> If you are not already collecting this data from your customer but wish to start doing so, you can use the embedded component to collect the data, or build your own UI.
>
> Learn more on the [SafeConnect Components](https://devx.notabene.id/docs/safe-connect-components-v2)

<br />

Learn more in the [data collection](https://devx.notabene.id/docs/data-collection)section.

***

### 2:  Creating a TR transfer, getting status updates, and settling on-chain

Once you have all the required travel rule data about the beneficiary person, the beneficiary VASP, and your own customer, you are ready to create and send the travel rule message:

<Image align="center" src="https://files.readme.io/a57c7440fa519ab2b663bddccfbd278ed755cc94e7799056dc0fc0b127ac944b-withdrawalSending.png" />

<br />

1. [Create transfers](https://devx.notabene.id/docs/transfer) is used to create messages.
2. [Append PII](https://devx.notabene.id/reference/appendtransferpii) or [Present PII](https://devx.notabene.id/reference/presenttransferpii)is used to add the collected Travel Rule PII to your messages.
3. A [webhook](https://devx.notabene.id/docs/webhook-flow) is used to notify your system
4. [Settle a transfer](https://devx.notabene.id/reference/settletransfer) is used to add the transaction hash to your messages after the blockchain validation

The [policy engine](https://intercom-help.eu/helpnotabene/en/collections/865419-policies) checks if the outgoing message should be sent automatically, held for manual review, or rejected.

<br />

Learn more in the [Create Outgoing transfers](https://devx.notabene.id/docs/create-outgoing-transfers) section

***

<br />

## Deposits

There are a few scenarios that can happen when there is a deposit to your VASP:

1. Deposit **with travel rule**: originator is a VASP and sends a travel rule message for that transaction
2. Deposit **without travel rule**, this can happen when the originator is a non-custodial wallet or a VASP but is not sending a TR message for that transaction.

***

### Deposit with travel rule

Here, the originator VASP sends a travel rule message and a deposit:

<Image align="center" src="https://files.readme.io/fe689bc30ec9c38f9c99279a81a4051d174bc7b6638d6dfac9d6a68e4dd85820-depositWithNew.png" />

When you receive the travel rule message, confirm the destination wallet address first. This can happen automatically if it has been done before, or your side is triggered to confirm the address via a webhook message.

Once the address is confirmed as yours, your side might trigger a beneficiary name match before the automated policies can make a decision. Before or after your decision is made, the originator VASP executes the value transfer on the blockchain.

When your side detects this deposit, call [txMatch](https://devx.notabene.id/reference/matchtransfers) using the blockchain details to identify the corresponding travel rule message. Based on the information in that travel rule message, you can decide whether to release the funds to the customer or withhold them for further checks.

<br />

Learn more in the [Confirm address](https://devx.notabene.id/docs/confirm-address) and subsequent sections.

***

### Deposit without travel rule

This can be a deposit from an unhosted wallet, or an originator VASP that is not required to transmit travel rule data because of their threshold or regulation, or they might be using a different provider:

<Image align="center" src="https://files.readme.io/f2cfc7db2ff27b829c257311647b79a49fe134fdac51258d3a933466e7d19f66-depositWithoutNew.png" />

When your side calls [txMatch](https://devx.notabene.id/reference/matchtransfers), there is no travel rule message that matches the blockchain data.

You can now call [create transfer](https://devx.notabene.id/reference/createtransfer) with yourself as the beneficiary VASP, requesting the data from the originator VASP, or appending the missing travel rule data yourself with [Append PII](https://devx.notabene.id/reference/appendtransferpii).

<br />

Learn more in the [Reconcile received transfers](https://devx.notabene.id/docs/recieve-transfer) section.

***

## Withdrawals with custodians

If there are multiple parties in the payment flow, they can be added either by calling an API or automatically if that agent has registered the address in advance.

<br />

### Custodian is manually added

<Image align="center" src="https://files.readme.io/f37a174cbdcde3d500da24a2d912db17129023e6a925e1ece216487dc909c3b0-Agents_manually_added.png" />

<br />

### Custodian is automatically added

<Image align="center" src="https://files.readme.io/17a6fd487331357ab131507149fac2242eb5a1a11ae34fddf861ca1076850335-Agents_are_automatically_added.png" />

<br />

***

<br />

<br />