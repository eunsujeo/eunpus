---
updatedAt: 2025-08-20T05:09:41.000Z
---

Fetch the complete documentation index at: https://docs.verifyvasp.com/llms.txt. Use this file to discover all available pages before exploring further.

# VASP API Implementation

The first step for TravelRule integration is implementing the VASP APIs. This section describes the API specifications and requirements for the REST APIs that must be implemented in your VASP backend.

VASP APIs are essential for the TravelRule protocol. They execute business logic for verification and transaction management based on the VASP’s policies and data. These APIs are implemented in the VASP backend and are called by the Enclave server to:

* Verify accounts and users
* Check transaction status
* Receive result reports

By implementing these APIs, you ensure compliance with regulatory requirements and complete the overall protocol flow. This section covers:

* List of required APIs
* API specifications
* API call flows
* Implementation considerations

<br />

## Required VASP APIs

Each VASP must be capable of acting as both Ordering VASP and Beneficiary VASP. The table below lists the required APIs, when they are called, and their primary business logic. For detailed implementation requirements, refer to the API Specification document.

<HTMLBlock>{`
<style>
  .api-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    font-size: 14px;
    margin-top: 24px;
  }

  .api-table th, .api-table td {
    border: 1px solid #ddd;
    padding: 12px 14px;
    vertical-align: top;
    text-align: left;
    background-color: #fff;
    min-width: 180px;
  }

	.api-table th {
    background-color: #f8f9fa;
    color: #333;
    font-weight: bold;
  }

  .api-name a {
    color: #1364FF;
    text-decoration: none;
  }

  .api-name a:hover {
    text-decoration: underline;
  }

  .api-role {
    color: #555;
    font-weight: 500;
  }

  .callback-events code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
    display: inline-block;
    margin: 2px 0;
  }

  .badge-key {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    color: #fff;
    background-color: #1364FF;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
</style>

<table class="api-table">
  <thead>
    <tr>
      <th width=220px>API</th>
      <th>Role</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="api-name"><a href="travelrule-user-account-verification">Verify User Account API</a></td>
      <td class="api-role">Beneficiary VASP</td>
      <td>Checks whether the beneficiary account is issued by the VASP.</td>
    </tr>
    <tr>
      <td class="api-name"><a href="travelrule-user-verification">Verify User API</a></td>
      <td class="api-role">Beneficary VASP</td>
      <td>
        <span class="badge-key">Core API</span><br>
        Verifies beneficiary information entered by the originator against the VASP’s KYC/AML data and policies. Returns a decision to allow or deny the transfer.
      </td>
    </tr>
    <tr>
      <td class="api-name"><a href="travelrule-check-transaction-status">Check Transaction Status API</a></td>
      <td class="api-role">Ordering VASP</td>
      <td>Returns the current processing status of an on-chain withdrawal transaction.</td>
    </tr>
    <tr>
      <td class="api-name"><a href="travelrule-callback">Callback API</a></td>
      <td class="api-role">Both</td>
      <td>
        Common interface for asynchronous communication with the Enclave. Must handle the following event types:
        <div class="callback-events">
          <code>VERIFICATION_RESULT</code> : Verification result received<br>
          <code>TX_REPORT</code> : Verification result received<br>
          <code>ERROR_REPORT</code> : Error during protocol processing<br>
          <code>CHAINALYSIS_KYT_RESULT</code> : Chainalysis risk assessment result<br>
          <code>REFINITIV_WCO_RESULT</code> : Refinitiv WCO risk assessment result
        </div>
      </td>
    </tr>
    <tr>
      <td class="api-name"><a href="travelrule-get-decrypted-enckey">Database Management API</a></td>
      <td class="api-role">Both</td>
      <td>Returns the encryption key to be used by the Enclave database at runtime.</td>
    </tr>
  </tbody>
</table>
`}</HTMLBlock>

<br />

## \[Optional] API Authentication

You can restrict API access so that only the Enclave can call your VASP APIs. Define an authentication header and implement logic to validate the token. Then, configure Enclave environment variables to include the authentication header in all API requests.

#### Enclave Environment Variables

* `VEGA_VERIFICATION_AUTHORIZATION_TOKEN`: The token value to include in the header.
* `VEGA_VERIFICATION_AUTHORIZATION_KEY`: The HTTP header key used to pass the token.
  * If not set, the default `Authorization` header with Bearer authentication is used.
  * If set, the specified header key will be used to pass the token.

**Header Examples**

```json
// Default (Bearer authentication):
Authorization: Bearer <VEGA_VERIFICATION_AUTHORIZATION_TOKEN>

// Custom header key (X-Api-Key):
X-Api-Key: <VEGA_VERIFICATION_AUTHORIZATION_TOKEN>
```