---
updatedAt: 2026-07-14T08:25:42.000Z
---

Fetch the complete documentation index at: https://docs.verifyvasp.com/llms.txt. Use this file to discover all available pages before exploring further.

# Running and Integrating the Enclave

Once the Enclave database has been configured, you can proceed with downloading the Enclave Docker image and launching the server. This document provides guidance on running the Enclave and setting the necessary environment variables.

## Step 1. Prepare the Enclave Docker Image

The VerifyVASP Enclave server is distributed via AWS ECR (Elastic Container Registry) as a Docker image.\
To obtain access credentials, please send the email address that will receive the AWS CLI Access Key to: [support@verifyvasp.com](mailto:corporate@verifyvasp.com).

<Callout icon="💡" theme="default">
  ### When Supporting Both TravelRule and VerifyName Protocols

  The VerifyVASP solution operates on a single Enclave Docker image, regardless of which protocol is used.\
  If you support both TravelRule and VerifyName—or wish to add more protocols later—make sure to always use the latest Docker image and configure the required environment variables per protocol.
</Callout>

<br />

## Step 2. Run the Enclave Server & Set Environment Variables

Once access is granted, download and run the Enclave server within your internal infrastructure. Before launching the server, you must configure the required environment variables to ensure smooth communication between Enclave and its components.

Enclave uses the following five groups of environment variables:

<HTMLBlock>{`
<style>
.enclave-env-table {
  width: 100%;
  background-color: white;
  border-collapse: collapse;
  table-layout: fixed;
}

.enclave-env-table th,
.enclave-env-table td {
  background-color: white;
  border: 1px solid #ddd;
  padding: 12px;
  vertical-align: top;
  word-break: break-word;
}

.enclave-env-table th {
  text-align: left;
  font-weight: bold;
  background-color: #f0f0f0;
}
</style>
<table class="enclave-env-table">
  <thead>
    <tr>
      <th>Environment Variable Group</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Server and Database Settings</td>
      <td>For setting up the server and connecting to the database</td>
      <td>e.g., endpoint/port, DB username/password</td>
    </tr>
    <tr>
      <td>Authentication Keys</td>
      <td>Credentials for integrating with the VerifyVASP central server and 3rd party services</td>
      <td>access key/secret key, Chainalysis API key, Refinitiv API key, etc.</td>
    </tr>
    <tr>
      <td>VASP API Endpoints</td>
      <td>API endpoints used when Enclave calls the VASP’s APIs</td>
      <td>User account verification API, user identity verification API, etc.</td>
    </tr>
    <tr>
      <td>Security and Configuration Settings</td>
      <td>Variables for configuring Enclave server security level and operations</td>
      <td>Public key cache options, etc.</td>
    </tr>
    <tr>
      <td>Enclave Mode Configuration</td>
      <td>Enclave operating modes, configured per supported protocol</td>
      <td>TR (TravelRule), VN1_CALL/VN1_RESPONSE (VerifyName 1.0), VN2, etc.</td>
    </tr>
  </tbody>
</table>
`}</HTMLBlock>

<br />

The following table summarizes the purpose, default values, and configuration methods for each environment variable. Do not modify the environment variable names—they must be used exactly as defined.

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Variable Name
      </th>

      <th>
        Default Value
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        `VEGA_SERVER_PORT`
      </td>

      <td>
        21117
      </td>

      <td>
        Port number for the Enclave server.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_SERVER_KEEPALIVE_TIMEOUT_MS`
      </td>

      <td>
        `5000`
      </td>

      <td>
        HTTP keep-alive timeout of the Enclave server, in milliseconds (Node `keepAliveTimeout`).\
        Default 5000 (5s) is fine for most deployments. When the Enclave runs behind a reverse proxy or service mesh (e.g. Istio/Envoy), set this **longer than the proxy's idle timeout** so the proxy closes idle connections first; otherwise sporadic 503 errors (Envoy `upstream connect error ... reset reason: connection termination`, flag `UC`) may occur.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_ENCLAVE_MODE`
      </td>

      <td>

      </td>

      <td>
        Enclave operating mode. Specifies the VerifyVASP protocols supported by the Enclave.

        Single or multiple values allowed, separated by commas (e.g., VEGA\_ENCLAVE\_MODE=TR,VN2).

        Supported values: TR, VN2, VN1\_CALL, VN1\_RESPONSE.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_ENCLAVE_PUBLIC_ENDPOINT`
      </td>

      <td>
        –
      </td>

      <td>
        Public endpoint URL of the Enclave server.

        Must be a publicly accessible HTTPS address reachable by the VerifyVASP central server.

        `https://api.vasp.com/enclave`
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_ALLIANCE_ACCESS_KEY`
      </td>

      <td>
        –
      </td>

      <td>
        VerifyVASP API Access Key issued during onboarding.

        **Link**: [Onboarding](https://docs.verifyvasp.com/reference/onboarding)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_ALLIANCE_SECRET_KEY`
      </td>

      <td>
        –
      </td>

      <td>
        VerifyVASP API Secret Key issued during onboarding.

        **Link**: [Onboarding](https://docs.verifyvasp.com/reference/onboarding)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_CLIENT`
      </td>

      <td>
        `mysql2`
      </td>

      <td>
        DBMS type for the Enclave database. Supported: pg, mysql, mysql2, oracledb, mssql.

        **Link**: [Enclave Database Setup](https://docs.verifyvasp.com/reference/travelrule-database-setup)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_USERNAME`
      </td>

      <td>
        –
      </td>

      <td>
        Database username..
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_PASSWORD`
      </td>

      <td>
        –
      </td>

      <td>
        Database password.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_HOST`
      </td>

      <td>
        –
      </td>

      <td>
        Host URL for the database connection.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_PORT`
      </td>

      <td>
        `3306`
      </td>

      <td>
        Port number for the database connection.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_DB`
      </td>

      <td>
        `verifyvasp`
      </td>

      <td>
        Database name.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SEARCH_PATH`
      </td>

      <td>
        `enclave`
      </td>

      <td>
        Custom schema name (PostgreSQL only).
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_POOL_MIN`
      </td>

      <td>
        `0`
      </td>

      <td>
        Minimum size of the database connection pool.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_POOL_MAX`
      </td>

      <td>
        `5`
      </td>

      <td>
        Maximum size of the database connection pool.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL`
      </td>

      <td>
        `false`
      </td>

      <td>
        Enable SSL for the database connection (set to `true` to enable)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL_CA`
      </td>

      <td>
        –
      </td>

      <td>
        Path to CA certificate file for SSL connection
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL_KEY`
      </td>

      <td>
        –
      </td>

      <td>
        Path to client SSL certificate private key.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL_CERT`
      </td>

      <td>
        –
      </td>

      <td>
        Path to client SSL certificate.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL_CAPATH`
      </td>

      <td>
        –
      </td>

      <td>
        Directory path for CA certificates
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL_CIPHER`
      </td>

      <td>
        –
      </td>

      <td>
        Cipher suite for SSL connection
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DATABASE_SSL_REJECT_UNAUTHORIZED`
      </td>

      <td>
        `true`
      </td>

      <td>
        Reject connection if certificate validation fails (set to true to enable)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_API_PATH`
      </td>

      <td>

      </td>

      <td>
        Endpoint for the Verify User API.\
        **Link**:  [Verify User API](https://docs.verifyvasp.com/reference/travelrule-user-verification)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_ACCOUNT_API_PATH`
      </td>

      <td>

      </td>

      <td>
        Endpoint for the Verify User Account API\
        **Link**: [Verify User Account API](https://docs.verifyvasp.com/reference/travelrule-user-account-verification)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_TRANSACTION_API_PATH`
      </td>

      <td>

      </td>

      <td>
        Endpoint for the Check Transaction Status API.\
        **Link**: [Check Transaction Status API](https://docs.verifyvasp.com/reference/travelrule-check-transaction-status)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_CALLBACK_API_PATH`
      </td>

      <td>
        –
      </td>

      <td>
        Callback API Endpoint.\
        **Link**: [Callback API](https://docs.verifyvasp.com/reference/travelrule-callback)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_AUTHORIZATION_TOKEN`
      </td>

      <td>
        –
      </td>

      <td>
        Authorization token for VASP API calls.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_AUTHORIZATION_KEY`
      </td>

      <td>
        –
      </td>

      <td>
        Header key used for the authorization token. If not set, default is `Authorization`.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_API_ENDPOINT`
      </td>

      <td>
        –
      </td>

      <td>
        Endpoint for the VerifyVASP Central API Server:

        * PRD (KR): `https://api-kr.vega-protocol.com`
        * PRD (Global): `https://api.vega-protocol.com`
        * STG (KR): `https://api-kr.vega-protocol.xyz`
        * STG (Global): `https://api.vega-protocol.xyz`
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_LOG_LEVEL`
      </td>

      <td>
        `info`
      </td>

      <td>
        Logging level.\
        Supported values: `none`, `error`, `warn`, `info`, `debug`.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_PUBLIC_KEY_TTL`
      </td>

      <td>
        `1800000`
      </td>

      <td>
        Public key caching TTL (ms) for counterparty VASPs.

        Default is 1800000 (30 mins), minimum is 600000 (10 mins).
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_VERIFICATION_RETENTION_DAYS`
      </td>

      <td>
        –
      </td>

      <td>
        Optional data-retention period, in days. When set, the Enclave hourly deletes `verifications` rows (and, if present, the Chainalysis sanction/KYT/KYT-alert and Refinitiv WCO screening tables) whose `created_at` is older than this many days.\
        **Opt-in — leave unset to disable.** A value below `1` (or a non-numeric value) is treated as the 1-day minimum.\
        **Requires an index whose leading column is `created_at` (`idx_verifications_created_at`) on the `verifications` table before startup**; otherwise the Enclave logs an error and keeps retrying instead of starting. See [Operations](https://docs.verifyvasp.com/reference/travelrule-maintenance).
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DECRYPT_API_ENDPOINT`
      </td>

      <td>
        –
      </td>

      <td>
        API path for retrieving the encryption key for database decryption.\
        Link: [Database Management API](https://docs.verifyvasp.com/reference/travelrule-get-decrypted-enckey)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_ENCRYPTION_KEY_BASE64`
      </td>

      <td>
        –
      </td>

      <td>
        Reference value for the encryption key, or the key itself if directly injected.\
        Link: [Database Management API](https://docs.verifyvasp.com/reference/travelrule-get-decrypted-enckey)
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_DECRYPT_API_ENDPOINT`
      </td>

      <td>

      </td>

      <td>
        This is the endpoint of an external service used to decrypt the encryption key specified in `VEGA_ENCRYPTION_KEY_BASE64`.

        This endpoint should be configured to use an encryption-related external service such as an HSM (Hardware Security Module).
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_CHAINALYSIS_SANCTION_API_KEY`
      </td>

      <td>

      </td>

      <td>
        Chainalysis Sanction API key for wallet address screening.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_CHAINALYSIS_KYT_API_KEY`
      </td>

      <td>

      </td>

      <td>
        Chainalysis KYT API key for transaction risk assessments.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_REFINITIV_WCO_API_KEY`
      </td>

      <td>

      </td>

      <td>
        Refinitiv World Check One API key for user risk assessments.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_REFINITIV_WCO_API_SECRET`
      </td>

      <td>

      </td>

      <td>
        Secret key issued with the Refinitiv API key.
      </td>
    </tr>

    <tr>
      <td>
        `VEGA_REFINITIV_WCO_GROUP_ID`
      </td>

      <td>

      </td>

      <td>
        Group ID from the Refinitiv console for API usage.
      </td>
    </tr>
  </tbody>
</Table>

<br />

## Step 3. Network Whitelisting

After the Enclave server is up and running, you must configure mutual network access between your infrastructure and the VerifyVASP Central Server.

### Whitelist Your Enclave Server IP

Send the public IP of your Enclave server to: [support@verifyvasp.com](mailto:corporate@verifyvasp.com). Only IP addresses are accepted. Domain names are not supported.

### Allow VerifyVASP Central IP Access

Ensure your firewall allows inbound traffic from the VerifyVASP Central Server. Request current IP ranges from [support@verifyvasp.com](mailto:corporate@verifyvasp.com) or your Slack channel.

<br />

## Step 4. Integrate Enclave with Your Backend

Once the Enclave server is running and connected to the VerifyVASP Central server, you can start invoking Enclave APIs from your backend. These APIs will allow you to implement user and transaction verification as part of your deposit/withdrawal flow using TravelRule.

#### VASP Discovery APIs

* [Get VASP ID API](https://docs.verifyvasp.com/reference/travelrule-get-vasp-id)
* [List VASP API](https://docs.verifyvasp.com/reference/travelrule-list-vasp-ids)

#### Verification APIs

* [User Account Verification API](https://docs.verifyvasp.com/reference/travelrule-enclave-user-account-verification)
* [User Verification API](https://docs.verifyvasp.com/reference/travelrule-encalve-request-user-verification)
* [List Verification Result API](https://docs.verifyvasp.com/reference/travelrule-enclave-list-verification-result)
* [Get Verification Result API](https://docs.verifyvasp.com/reference/travelrule-enclave-get-verification-result)

#### Report API

* [Report Transaction Result API](https://docs.verifyvasp.com/reference/travelrule-enclave-report-transaction-result)
* [Report Error API](https://docs.verifyvasp.com/reference/travelrule-enclave-report-error)

#### Transaction API

* [Check Transaction Status API](https://docs.verifyvasp.com/reference/travelrule-enclave-check-transaction-status)

#### 3rd Party Risk Assessment API

* [Risk Assessment Via Chainalysis Sanction API](https://docs.verifyvasp.com/reference/travelrule-chainalysis-sanction)
* [Risk Assessment Via Chainalysis KYT API](https://docs.verifyvasp.com/reference/travelrule-chainalysis-kyt)
* [Risk Assessment Via Refinitiv WCO API](https://docs.verifyvasp.com/reference/travelrule-refinitiv-wco)