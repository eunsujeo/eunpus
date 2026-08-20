---
updatedAt: 2026-01-14T18:29:40.000Z
---

Fetch the complete documentation index at: https://devx.notabene.id/llms.txt. Use this file to discover all available pages before exploring further.

# Encryption managed by the Customer

Guide on submitting encrypted PII for end-to-end encrypted forwarding, including endpoint usage and payload requirements.

<br />

#### **For Direct Forwarding to Counterparties (End-to-End Encrypted PII):**

<br />

**Use Case:** Submit encrypted PII for end-to-end encrypted forwarding to a counterparty. This data won't be stored on your entity or the Notabene platform.

**Endpoints to Use:**

* Fulfill open Travel Rule policies: `{{url}}/entity/:entityDID/tx/:tx/presentation?skipValidation=`
* Fulfill a specific policy: `{{url}}/entity/:entityDID/tx/:tx/policy/:policy/presentation?skipValidation=`

See the examples in the [Postman collection](https://www.postman.com/notabene/notabene-public-travel-rule-apis/folder/04un9iw/encrypted).

**Parameters:**

* **Policy (Optional):** ID of the policy to fulfill.
* **skipValidation (Optional):** Set to "true" or "false". "True" skips validation against required fields.

**Payload Requirements:**

* Must be IVMS101 compliant.
* Include a valid transferId.
* Validates against local jurisdiction for Travel Rule type.

<Image border={false} src="https://files.readme.io/98e96aa11689f32d3779321a1a6fdcf677be7e4da55e8a51bb0f8b9f477ae17f-image.png" />

<br />

**Response:**

**Success (202):**

```json
{
	"message": "Presentation accepted and processing"
}
```

* set `skipValidation` to `True` if you want to avoid error messages for **incomplete** travel rule transfers. This means our API will not validate your payload against any jurisdictional requirements.

**Error (400):**

* Missing Beneficiary confirmation: "Settlement agent relationship must be confirmed before sending presentation."
* Invalid IVMS101 data:

```json
{
  "error": "Invalid IVMS101 data",
  "details": {
    "errors": [
      "Missing required fields for the definition https://pd.notabene.id/ivms101/v1/JP-0.json"
    ],
    "missingFields": [
      "$.originator.originatorPersons[0].naturalPerson.name.nameIdentifier[0].primaryIdentifier"
    ]
  }
}
```