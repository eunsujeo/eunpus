---
updatedAt: 2026-01-14T18:30:05.000Z
---

Fetch the complete documentation index at: https://devx.notabene.id/llms.txt. Use this file to discover all available pages before exploring further.

# Encryption managed by Notabene

Guide on PII encryption and submission using Notabene SafeTransact, including endpoint usage, PII re-use conditions, and response handling.

#### For Notabene SafeTransact-managed PII Encryption and Submission

* **Endpoint to use:** `{{url}}/entity/:entityDID/tx/:tx/append`
* **Use Case:** Submit PII to be encrypted and stored locally on Notabene’s platform.
  * **Encryption Process:** Notabene encrypts data with your Entity's keys to prevent unauthorized access.
  * **Data processing:** Notabene re-encrypts your data (PII) and sends it to requesting counterparties if and where applicable and not blocked.

<Image border={false} src="https://files.readme.io/2ebefbd3ad3e0c2d66581d5aa2c5c953535cfb1ecf7ad8fee0965329e76bb17e-image.png" />

<br />

**PII Re-use Conditions:**

* PII can be reused if `txAppend` is called with both originator and beneficiary `@id`.
* Reuse is only for PII you created; received PII is not reused.
* Update reusable PII by calling `txAppend` again with new data.
* ```
  {
    originator: {
      "@id": originatorIdentifier,
    },
    beneficiary: {
      "@id": beneficiaryIdentifier,
    }, //these are optional and set re-use to TRUE.
      "ivms101": {
          "originator": { /etc. 
  ```

<br />

**Payload Requirements:**

* Include only necessary fields in IVMS format.
* Optional: Reference originator and beneficiary `@id` for reuse eligibility.

**Validation:**

* Transfer ID must exist.
* Transfer must be of type Travel Rule (`"isTravelRule":"true"`).
* IVMS content is validated against local jurisdiction rules when your transfer is of type Travel Rule, otherwise validation is skipped.

**Responses:**

* Success (202):
  ```json
  {
  	"message": "Transfer appended successfully with encrypted PII"
  }
  ```
* Error (400):
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

<br />

**PII Blocking Conditions:**

* Transfer is flagged.
* Waiting for counterparty confirmation of wallet/beneficiary ownership
* Counterparty rejected or cancelled.

These conditions also apply to PII reuse.

<br />

<br />