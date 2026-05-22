> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Address Registry

# Overview

Address Registry lets you verify the legal entity controlling a blockchain address before sending or receiving a transaction. When enabled, Address Registry allows you to query blockchain addresses and receive certain legal entity information about the institution controlling the associated vault. The Address Registry is designed solely to facilitate counterparty discovery and verification in connection with digital asset transactions.

Address Registry is a free capability available to all Fireblocks customers and enabled by default. Coverage is currently limited to addresses within the Fireblocks network.

<Note>
  **Early access**

  This feature is currently in Early Access (a Beta Service). To request access, enable it in [Settings > Labs](https://console.fireblocks.io/v2/settings/labs) or contact your Fireblocks Customer Success Manager. Early Access features are subject to the beta terms under [Product Specific Terms](https://www.fireblocks.com/product-specific-terms#beta-services).
</Note>

## Look up an address

Query a blockchain address to retrieve the legal entity information associated with it.

### Request

```http theme={"system"}
GET /v1/address_registry/legal_entities/{address}
```

| Parameter | Type   | Required? | Description                        |
| --------- | ------ | --------- | ---------------------------------- |
| `address` | string | Yes       | The blockchain address to look up. |

### Response

If the address resolves to an opted-in Fireblocks customer:

```json theme={"system"}
{
  "verified": true,
  "entityName": "ACME Corporation",
  "jurisdiction": "US",
  "lei": "254900GC33RBE6FQA817",
  "travelRuleProviders": [
    "TRAVEL_RULE_PROVIDER_NOTABENE",
    "TRAVEL_RULE_PROVIDER_SYGNA"
  ],
  "email": "compliance@example.com"
}
```

| Field                 | Type    | Description                                                                                                                                                |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verified`            | boolean | `true` if entity data is sourced from an approved LEI and validated by Fireblocks. `false` if sourced from Fireblocks data without independent validation. |
| `entityName`          | string  | Legal entity name associated with the vault controlling the address.                                                                                       |
| `jurisdiction`        | string  | ISO country code of the legal entity.                                                                                                                      |
| `lei`                 | string  | Legal Entity Identifier (LEI) of the counterparty, if available.                                                                                           |
| `travelRuleProviders` | array   | Travel Rule providers the counterparty supports, if declared.                                                                                              |
| `email`               | string  | Counterparty's Travel Rule contact email, if declared.                                                                                                     |

If the address is not found — because the counterparty is not a Fireblocks customer, has opted out, or is on an unsupported environment — the response returns HTTP 404:

```json theme={"system"}
{
  "code": "2142",
  "message": "Address could not be resolved"
}
```

<Note>
  **Notes about the Address Registry lookup**

  * A `not_found` result does not indicate that the address is unhosted, illicit, or non-compliant.
  * The registry is designed to prevent bulk data extraction or misuse. We put in place various controls like query authentication, API rate limiting, daily request caps, and alerts to ensure the number of queries remains proportional to the number of transactions. See [the FAQ](https://support.fireblocks.io/hc/en-us/articles/26105830582940-Address-Registry#h_01KP5Z8EQMTNW36W3RSNQJV9C9) for more details.
</Note>

## Register a legal entity

To appear as a verified entity when counterparties look up your addresses, register your Legal Entity Identifier (LEI) with Fireblocks. This step is optional if you only want to query addresses, but required to return verified data and to use Address Registry in compliance workflows.

Each workspace can register multiple legal entities.

### Request

```http theme={"system"}
POST /v1/legal_entities
```

```json theme={"system"}
{
  "lei": "529900HNOAA1KXQJUQ27",
  "travelRuleProviders": [
    "MY_OWN"
  ],
  "travelRuleContactEmail": "compliance@example.com"
}
```

| Parameter                | Type   | Required? | Description                                                                                                                                                                 |
| ------------------------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lei`                    | string | Yes       | A valid 20-character LEI present in the GLEIF registry.                                                                                                                     |
| `travelRuleProviders`    | array  | No        | Travel Rule providers to associate with this entity. Enum: `CODE`, `GTR`, `MY_OWN`, `NOTABENE`, `SYGNA`, `SUMSUB`, `TRISA`, `TRUST`, `TWENTY_ONE_ANALYTICS`, `VERIFY_VASP`. |
| `travelRuleContactEmail` | string | No        | Contact email for Travel Rule communications.                                                                                                                               |

### Response (success)

```json theme={"system"}
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "lei": "529900HNOAA1KXQJUQ27",
  "status": "PENDING",
  "isDefault": false,
  "travelRuleProviders": [
    "MY_OWN"
  ],
  "travelRuleContactEmail": "compliance@example.com",
  "gleifData": {
    "lei": "529900HNOAA1KXQJUQ27",
    "legalName": "Example Corporation Ltd.",
    "otherNames": [
      "ExCorp",
      "Example Corp"
    ],
    "legalAddressRegion": "NY",
    "legalAddressCountry": "US",
    "nextRenewalDate": "2025-12-31T00:00:00Z"
  },
  "createdAt": "1700000000000",
  "updatedAt": "1700000000000"
}
```

### Error responses

| Code     | Meaning                                                               |
| -------- | --------------------------------------------------------------------- |
| HTTP 400 | Invalid LEI or request parameters.                                    |
| HTTP 404 | LEI not found in the GLEIF registry.                                  |
| HTTP 409 | A legal entity with this LEI is already registered for the workspace. |

### LEI states

After you submit an LEI, it moves through the following states:

| State      | Description                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `Pending`  | Submitted and under Fireblocks review. Your addresses appear as unverified to counterparties during this time. |
| `Approved` | Verified by Fireblocks. Queries against your addresses return your legal entity name, jurisdiction, and LEI.   |
| `Denied`   | Rejected by Fireblocks. You can view the reason and resubmit.                                                  |
| `Revoked`  | Previously approved, then revoked due to an expired or invalid LEI.                                            |

### Map vault accounts to legal entities

After Fireblocks approves your first LEI, all vault accounts map to that entity by default. If you register additional legal entities and want to map specific vault accounts to them, refer to the [legal entity endpoints in the API reference](https://docs.fireblocks.com/api/swagger-ui/#/Compliance/assignVaultsToLegalEntity). Each vault account supports a maximum of one legal entity.

## Opt out of Address Registry

You can opt out your entire workspace or individual vault accounts. When you opt out, lookups against your addresses return `not_found`. You can disable and re-enable at any time.

<Note>
  **Notes about opting out**

  * Opting out prevents you from querying addresses or using compliance workflows that depend on Address Registry.
  * Opting out disables all compliance workflows built on Address Registry. Re-enabling restores them.
</Note>

### Opt out an entire workspace

```sql theme={"system"}
DELETE /v1/address_registry/tenant
```

No request body is required. A successful response returns a status of `OPTED_OUT` using the same JSON structure as the [GET participation status endpoint](https://docs.fireblocks.com/api/swagger-ui/#/Compliance/getAddressRegistryTenantParticipationStatus).

### Opt out individual vault accounts

Add vault account IDs to the opt-out list:

```http theme={"system"}
POST /v1/address_registry/vaults
```

```json theme={"system"}
{
  "vaultAccountIds": [
    10001,
    "10002"
  ]
}
```

| Parameter         | Type  | Required? | Description                                                                      |
| ----------------- | ----- | --------- | -------------------------------------------------------------------------------- |
| `vaultAccountIds` | array | Yes       | Vault account IDs to add to the opt-out list. Accepts both integers and strings. |

## Use Address Registry in compliance workflows

You can use Address Registry inside your transaction screening policy to automate compliance decisions based on counterparty identity. The workflow has two parts: define counterparty groups, then apply rules to those groups in a screening policy.

<Note>
  **Feature coming soon**

  Compliance workflows are not yet available but will be added during the Early Access phase.
</Note>

### Define counterparty groups

A *counterparty group* is a named set of counterparties that share specific attributes. You can create as many groups as you need. Jurisdiction is the only available grouping attribute initially. Additional attributes such as business type and license type are planned.

**API endpoints:**

```http theme={"system"}
POST   /v1/counterparty-groups          # Create a group
GET    /v1/counterparty-groups          # List all groups
PUT    /v1/counterparty-groups/{id}     # Update a group
DELETE /v1/counterparty-groups/{id}     # Delete a group
```

### Set a screening policy

The screening policy consists of two parts:

* **Transaction screening policy**: Defines which transactions trigger a counterparty check. Build rules using source, destination, asset, and amount. Rules evaluate from top to bottom, and the first match wins. A catch-all default rule is required as the last entry. You also configure timeout behavior separately to define what happens if the registry check times out during a transaction (accept or reject).
* **Post-screening policy**: Defines the action to take based on the counterparty check result.

| Condition                       | Action           |
| ------------------------------- | ---------------- |
| Counterparty is in \[Group]     | Accept or Reject |
| Counterparty is not in \[Group] | Accept or Reject |
| Address not found in registry   | Accept or Reject |

**API endpoints:**

```http theme={"system"}
PUT    /v1/counterparty-groups/policy   # Configure screening policy
GET    /v1/counterparty-groups/policy   # Get current policy
GET    /v1/counterparty-groups/address  # Get group context for an address
```

## Availability and limitations

Fireblocks does not currently support Address Registry for workspaces hosted on European or Swiss environments due to infrastructure isolation between production instances. We plan to add support for these environments shortly after the initial release. In the meantime, queries against addresses from European or Swiss-hosted workspaces return `not_found`.

Address Registry is not available in Developer Sandbox workspaces.
