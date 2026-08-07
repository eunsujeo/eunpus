---
updatedAt: 2025-12-22T16:40:36.000Z
---

Fetch the complete documentation index at: https://devx.notabene.id/llms.txt. Use this file to discover all available pages before exploring further.

# Create Outgoing transfers

Guide on creating outgoing transfers to hosted and unhosted wallets, including agent discovery and proof of ownership.

## To hosted wallets

Initiate a transfer to a counterparty hosting wallets for their users using the following endpoint:

**POST** `/entity/:entityDID/tx`

<br />

#### Required Data

* **Asset**: Type of asset (e.g., BTC)
* **Amount**: Amount to transfer
* **Deposit/Settlement Address**: Address for settlement
* **Receiving Entity**: Optional, if not provided, agent discovery will be performed

<br />

#### Process Overview

* **Agent Discovery**: Automatically performed unless a counterparty is specified.
* **Jurisdiction Check**: Updates `isTravelRule` and adds a presentation definition URL.
* **Transaction Authorization Policies (TAP)**: Default policies are applied if configured.
* **DIDComm Messaging**: Sends transfer request and TAP policies to counterparties.
* **Webhook Notifications**: Updates on transfer policies and confirmations.

<br />

Example (see more examples here: [Postman txCreate examples](https://www.postman.com/notabene/notabene-public-travel-rule-apis/folder/0q2qahi/to-hosted-wallets?action=share\&source=copy-link\&creator=32259505\&ctx=documentation))

POST /entities/:entityDID/tx

```
{
  "originator": {
    "@id": "{{originatorID}}"
  },
  "beneficiary": {
    "@id": "{{beneficiaryID}}"
  },
  "asset": "{{BTC}}",
  "amount": "{{$randomInt}}",
  "agents": [
    {
      "@id": "did:pkh:{{BTCaddressprefix}}:{{$randomAddress}}",
      "for": "{{originatorVASPdid}}",
      "role": "SourceAddress"
    },
    {
      "@id": "{{originatorVASPdid}}",
      "for": "{{originatorID}}",
      "role": "VASP"
    },
    {
      "@id": "{{beneficiaryVASPdid}}",
      "for": "{{beneficiaryID}}",
      "role": "VASP"
    },
    {
      "@id": "did:pkh:{{BTCaddressprefix}}:{{$randomAddress}}",
      "for": "{{beneficiaryVASPdid}}",
      "role": "SettlementAddress"
    }
  ],
  "ref": "{{$randomUUID}}"
}
```

<br />

**Agent discovery:**

Notabene provides multiple counterparty discovery flows:

1. Network Discoverability
2. Address book
3. Blockchain analytics query
4. Select manually

<br />

## To unhosted wallets

For transfers to self-hosted wallets, ensure the following:

* **Settlement Address Agent**: Set the `for` field to the beneficiary party.
* **Proof of Ownership**: Upload if required.

<br />

See also the Postman collection here: <Anchor label="Create to Unhosted" target="_blank" href="https://www.postman.com/notabene/notabene-public-travel-rule-apis/request/infklta/create-outgoing-transfer-unhosted">Create to Unhosted</Anchor>

```Text Example
{
  "originator": {
    "@id": "{{originatorEmail}}"
  },
  "beneficiary": {
    "@id": "{{beneficiaryEmail}}"
  },
  "asset": "{{BTC}}",
  "amount": "{{$randomInt}}",
  "agents": [
    {
      "@id": "{{BTCaddressprefix}}:{{$randomBitcoin}}",
      "for": "{{originatorVASPdid}}",
      "role": "SourceAddress"
    },
    {
      "@id": "{{originatorVASPdid}}",
      "for": "{{originatorEmail}}",
      "role": "VASP"
    },
    {
      "@id": "{{BTCaddressprefix}}:{{$randomBitcoin}}",
      "for": "{{beneficiaryEmail}}", // <-- benefiary @id goes here
      "role": "SettlementAddress"
    }
  ],
  "ref": "{{$randomUUID}}"
}
```

<br />

### Proof of ownership

rom above example, an UNCONFIRMED ownership is created between the settlement address and the beneficiary, something like:

```json Relationship in a transfer body
"relationship": {
                    "@id": "a7d13407-7e5b-4d64-9fdd-287d44971faa",
                    "status": "UNCONFIRMED",
                    "from": "{{BTCaddressprefix}}:{{$randomBitcoin}}",
                    "to": "{{beneficiaryEmail}}",
                    "proofs": []
                },
```

You can update such a relationship to `Confirmed` or `Proven` status by calling:

`PATCH /entities/:entityDID/relationship?from=settlementAddress&to=beneficiaryDID`

Establish ownership between users and wallets:

* **Signature Proof**: Update status to `PROVEN` using a signature.
* **Self-Declaration**: Declare control over the address.
* **Microtransfer**: Pending status until confirmed.
* **Screenshot**: Upload a screenshot as proof.

<br />

For signature proof - the only method to update to status `PROVEN`

```json Body signature proof
"proof": {
        "address": "{{destination}}",
        "attestation": "I certify that\n\neip155:1 account 0x9ecfbb28554cade5da58c82469f65f31aebd272b\n\nbelonged to did:key:z6MksamQq4oVRktkeSDxs6pbixYFUaUca8xgCvnTVLQA5PC5\n\non Thu, 04 Dec 2025 14:20:12 GMT",
        "type": "eip-191",
        "proof": "{{proof}}", //signature goes here
        "status": "verified",
        "did": "{{destination}}"
    }
```

For other proof types that update to status CONFIRMED see the <Anchor label="Postman Collection" target="_blank" href="https://www.postman.com/notabene/notabene-public-travel-rule-apis/folder/10gyiay/to-unhosted-wallets?action=share&source=copy-link&creator=32259505&ctx=documentation">Postman Collection</Anchor>.

<br />

<br />

<br />