> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Travel Rule Support Integration Guide

## Overview

Travel Rule Support (TRSupport) is Fireblocks' comprehensive compliance solution for meeting cryptocurrency travel rule regulations across global jurisdictions. TRSupport automates the collection, encryption, and exchange of counterparty information required by regulatory frameworks like the Financial Action Task Force Travel Rule, ensuring your organization remains compliant while maintaining transaction speed and security.

## Prerequisites

Before integrating TRSupport:

* **Enable TRSupport Feature**: Contact your [Customer Success Manager](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=6947882197532) to enable TRSupport for your Fireblocks workspace
* **API Access**: Ensure you have valid API credentials for your Fireblocks workspace
* **Policy Planning**: Design your three-stage policy configuration strategy
* **Development Environment**: Set up test environments for integration testing

## Core Concepts

### Three-Stage Policy Framework

TRSupport processes transactions through three configurable policy stages:

1. **Screening Policy**: Determines whether to contact Travel Rule providers (TRP)
2. **Missing Travel Rule Message (TRM) Policy**: Handles scenarios when TRMs are unavailable
3. **Post-screening Policy**: Determines final actions based on screening results

### Multi-Destination Support

TRSupport intelligently handles transactions with multiple destinations:

* Each destination is evaluated independently
* Results combine using "worst result wins" logic
* Single transaction verdict with per-destination visibility

### Providers

TRSupport integrates with TRP networks to facilitate compliant information exchange between Virtual Asset Service Providers (VASPs).

#### Sumsub

Learn more about the integration flow in the [Fireblocks integration article](https://docs.sumsub.com/docs/fireblocks-integration) on Sumsub's documentation site.

#### Global Travel Rule (GTR)

Learn more about the integration flow in the [Fireblocks integration article](https://www.globaltravelrule.com/documentation/connect-fireblocks-with-gtr) on GTR's documentation site.

## Common Patterns and Best Practices

### Setup Flow

The initial setup process is typically performed once during onboarding and consists of two main stages: configuring legal entities and establishing TRP integrations.

### Legal Entities

TRSupport requires at least one legal entity to be configured. A legal entity represents a distinct business entity within your organization, subject to travel rule compliance. Most customers should use a single legal entity for their entire operation. However, if you operate as a large holding company across multiple jurisdictions with different compliance requirements, you can configure multiple legal entities and assign specific vault accounts to each jurisdiction.

When configuring legal entities, be aware that only one entity should be configured without vault restrictions. This entity will serve as the default for all vaults not explicitly assigned to other entities. Each legal entity can have multiple TRSupport integrations with different TRPs.

For example, a multi-jurisdictional organization might configure:

* **Legal Entity 1**: EU compliance rules (vaults 0-5)
* **Legal Entity 2**: US compliance rules (vaults 6-10)
* **Legal Entity 3**: APAC compliance rules (vaults 11-15)

Alternatively, you can designate one entity (e.g., US) as the "global" default, which will apply to all unassigned vaults.

Use the following endpoints to manage legal entities:

* `getLegalEntities` - Retrieves all configured legal entities
* `getTRLinkCustomerById` - Retrieves a specific legal entity
* `createTRLinkCustomer` - Creates a new legal entity
* `updateTRLinkCustomer` - Modifies an existing legal entity
* `deleteTRLinkCustomer` - Removes a legal entity

Below is an example of a legal entity creation:

```typescript theme={"system"}
const acmeLegalEntity = await fireblocks.trLink.createTRLinkCustomer({
  shortName: "ACME Corp",
  fullLegalName: "ACME Corporation Ltd",
  countryOfRegistration: "US",
  vaults: [0, 1]
});
```

### TRSupport Integrations

After configuring your legal entities, you must establish integrations for each legal entity with your chosen TRP(s).

First, initiate the integration by creating a customer integration record. This action generates a unique Customer Integration ID that identifies the connection between your legal entity and the TRP. You can share this Customer Integration ID with your TRP to initiate an "auto-connect" procedure (Sumsub only supports this method), where the TRP automatically provides your API credentials to Fireblocks. Alternatively, you can manually configure the API key and secret using the `connectLegalEntityIntegration` endpoint.

Once credentials are configured, use the `testTRLinkIntegrationConnection` endpoint to verify that the integration is functioning correctly before proceeding with travel rule operations.

```typescript theme={"system"}
// 1. Get available partners
const partners = await fireblocks.trLink.getTRLinkPartners();
const partnerX = partners.find(p => p.ident === "partnerX");

// 2. Create integration
const integration = await fireblocks.trLink.createTRLinkIntegration({
  customerId: acmeLegalEntity.id,
  partnerIdent: partnerX.ident
});

// 3. Connect with credentials
const connected = await fireblocks.trLink.connectTRLinkIntegration(
  integration.customerIntegrationId,
  {
    apiKey: "your-trp-api-key",
    secret: "your-trp-secret"
  }
);

// 4. Test connection
const testResult = await fireblocks.trLink.testTRLinkIntegrationConnection(
  integration.customerIntegrationId
);

if (testResult.success) {
  console.log("Setup complete and connection verified!");
} else {
  console.error("Connection test failed:", testResult.message);
}
```

### Inbound and Outbound Transaction Flows

Always use the `assessTravelRuleRequirement` endpoint before creating a TRM. This endpoint is the single source of truth for determining if a TRM is needed and what data it must contain.

The endpoint evaluates the transaction against compliance rules and will tell you if the status is `REQUIRED`, `NOT_REQUIRED`, or if you `NEED_MORE_INFO`. When required, it provides a precise list of mandatory IVMS101 fields to guide your data collection process.

#### Inbound Transaction Flow

For inbound transactions, use the existing Fireblocks transaction ID:

```typescript theme={"system"}
const txId = "12345678-1234-1234-1234-123456789abc";

// 1. Assess travel rule requirement using txId
const assessment = await fireblocks.trLink.assessTRLinkTravelRuleRequirement(
  customerIntegrationId,
  {
    txId: txId,
    originatorVaspId: "originator-vasp-123"
  }
);

if (assessment.decision === "REQUIRED") {
  // 2. Get public key for encryption and save to temp file
  const publicKey = await fireblocks.trLink.getTRLinkIntegrationPublicKey(customerIntegrationId);

 await fs.writeFile(path.join(__dirname, 'public-key.json'), JSON.stringify(publicKey, null, 2), 'utf8');

  // 3. Encrypt IVMS data (encrypt data + IVMS specification)

  // WARNING: This is not production-ready code. 
  // Due to the use of fixed file paths (like 'ivms.json'), 
  // race conditions can occur during parallel execution. 
  // It is recommended to use a solution for generating unique temporary 
  // filenames (e.g., using the 'tmp' npm package, or relying on 
  // system-level functions like the Linux tempnam()).
  const publicKeyPath = path.join(__dirname, 'public-key.json');
  const privateKeyPath = path.join(__dirname, 'private-key.json');
  const ivmsDataPath = path.join(__dirname, 'ivms.json');
  const scriptPath = path.join(__dirname, 'encrypt.js');

  const ivmsOutput = execSync(`node "${scriptPath}" "${publicKeyPath}" "${privateKeyPath}" "${ivmsDataPath}"`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  const ivms = JSON.parse(ivmsOutput.trim());


  // 4. Create TRM with txId
  const trm = await fireblocks.trLink.createTRLinkTrm(
    customerIntegrationId,
    {
      txId: txId,
      originatorVaspId: "originator-vasp-123",
      ivms,
    }
  );

  // 5. Link TRM to transaction.  Recommendation - use the <partnerIdent>:<trmId> format, indicating not only trmId, but also a partner where trm is registered

  await fireblocks.trLink.setTRLinkTransactionTravelRuleMessageId(txId, {
    travelRuleMessageId: trm.id
  });
}

```

#### Outbound Transaction Flow

For outbound transactions, create the TRM before creating the Fireblocks transaction:

```typescript theme={"system"}
// 1. Assess travel rule requirement
const assessment = await fireblocks.trLink.assessTRLinkTravelRuleRequirement(
  customerIntegrationId,
  {
    amount: "1500",
    assetId: "ETH",
    direction: "outbound",
    source: { type: "VAULT_ACCOUNT", id: "0" },
    destination: {
      type: "ONE_TIME_ADDRESS",
      oneTimeAddress: { address: "0xabcd..." }
    },
    beneficiaryVaspId: "vasp-456"
  }
);

if (assessment.decision === "REQUIRED") {
  // 2. Get public key for encryption and save to temp file
  const publicKey = await fireblocks.trLink.getTRLinkIntegrationPublicKey(customerIntegrationId);

  await fs.writeFile(path.join(__dirname, 'public-key.json'), JSON.stringify(publicKey, null, 2), 'utf8');

  // 3. Encrypt IVMS data (encrypt data + IVMS specification)
  
  // WARNING: This is not production-ready code. 
  // Due to the use of fixed file paths (like 'ivms.json'), 
  // race conditions can occur during parallel execution. 
  // It is recommended to use a solution for generating unique temporary 
  // filenames (e.g., using the 'tmp' npm package, or relying on 
  // system-level functions like the Linux tempnam()).
  
  const publicKeyPath = path.join(__dirname, 'public-key.json');
  const privateKeyPath = path.join(__dirname, 'private-key.json');
  const ivmsDataPath = path.join(__dirname, 'ivms.json');
  const scriptPath = path.join(__dirname, 'encrypt.js');

  const ivmsOutput = execSync(`node "${scriptPath}" "${publicKeyPath}" "${privateKeyPath}" "${ivmsDataPath}"`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  const ivms = JSON.parse(ivmsOutput.trim());

  // 4. Create TRM
  const trm = await fireblocks.trLink.createTRLinkTrm(
    customerIntegrationId,
    {
      amount: "1500",
      assetId: "ETH",
      direction: "outbound",
      source: { type: "VAULT_ACCOUNT", id: "0" },
      destination: {
        type: "ONE_TIME_ADDRESS",
        oneTimeAddress: { address: "0xabcd..." }
      },
      beneficiaryVaspId: "vasp-456",
      ivms,
    }
  );

  // 5a. Create Fireblocks transaction - use travelRuleMessageId field to set TRM id
  // recommendation - use the <partnerIdent>:<trmId> format, indicating not only trmId, but also a partner where trm is registered
  const txId = await createFireblocksTransaction({ 
/* ... */ 
travelRuleMessageId: `${partnerIdent}:${trm.id}`
});

  // Or, 5b. Link TRM to transaction later if not set during tx creation
  await fireblocks.trLink.setTRLinkTransactionTravelRuleMessageId(txId, {
    travelRuleMessageId: `${partnerIdent}:${trm.id}`
  });
}

```

### Encryption and Decryption (Partner: Sumsub using JWT encryption)

Below is an example of how to encrypt and decrypt IVMS data retrieved from Sumsub. To do this, we must use our private key to sign IVMS data and the partner's public key (as described in the [API Integration](#api-integration) section) to encrypt data. For decrypting, we need our own private key to decrypt the IVMS data and a partner's public key to verify the signature. At the moment, our public/private key pair is generated by a partner on their marketplace and available to download.

<Note>
  **Note:**

  Custom key pair upload is under consideration for future releases.
</Note>

#### Encryption Example

The following illustrates a partner's public key response:

```json theme={"system"}
{
  "issuer": "sumsub.com",
  "publicKey": {
    "kty": "RSA",
    "kid": "test-sender-2025",
    "e": "AQAB",
    "n": "q6fmy_rjX2xizMiXoWKRVZSrDXXYLnMk6J_q-5FAD5q7CdqK10XmQZrlzItLpj9qxl0LfcZhZ93PL55abei1F4u6Jdzh9LrfUF5WZ7Cvi25n6aeJoOd7JIERY0hP8s-xdiDrr5fRqdseHymENhvwK5J8_adEOcWHR_7ymb17c3ivFQmprytkJD6BfXaF7qGeE6cx0UiDlD1sHCGcd26I1JNjYQZJie0qlPT8x7jILNA7sW1_Nk8wx9jRDtUv6-K2qnz4MvFe1D6rddcnCsiX7MRPWKm10hy41MTJkQcWUYgtDqfdOXNo8D8BnaVuaLEsByNxMQiL8ePXZpBro0nrnw"
  }
}
```

Here is an example of a private key:

```json theme={"system"}
{
  "kty": "RSA",
  "kid": "test-recipient-2025",
  "e": "AQAB",
  "n": "m58UpcvahBK3-Uma_S4HTGwijmASh_3ATDwkjIb1svp2jnrv6lhjE2Yz28b0oUsEa7Wau6x0NPbaUCrQjjN5iUoumn4Jwq6jKttXFtd4v3583co4sBjGoPqk7GbkeYKzEOs2wmKgKbQjjk1BaHFpTPlAmS2JbNy6VmHNj-62BK1vIeegXheqxkr-b-MvESmL746juz_LlTMPmJqbaNuMeQMktT9lBLPfZermLfUuC7myuQhrsD8zJaNiNDWJQ6dzNi-Cy0uGlDcy9xtSQMW1Tv3Fc7hO_bRD1NI-sJp7nVi6hdc-QMOyrv8tzlhTV7gh3Wnn2kIFFkWy86gYYHw79Q",
  "d": "HJYLvmrkYGdp2QZ-zGwUliK09E9MiCOCG97eXdv6rR5aAdEuWe9Tf8BB3Wi-DhTQIpLw8fF7RTFlJ929gqmM9T2lsuZdF6Bpw5kX9c-t1AtBl6IqaJqcffycp_o8lN9_0idK30krn42CDIU_cxaGH8gXaCvXtyISroR3tK1GTTRfLSqcAQ3wI5Kj7IRf_oCyU6zZ9Vo30X1Tus-yE9Gv0D5wDOybfRljQJ7D7lA-thXzVeO8YwvoIp_K7aA5BaJjMg2TaYdPskCV4Wbu3O0ezHw2GCbkgusIG_ZEtcCFbldR45Vwtpp6Hm82g2lqDynNyRrTqeCoigkIqLwW8vir3w",
  "p": "0huuQD7Cv4R6pgucabPQt7I-1BSG5Ao32ZzTQzqB6H5zeyF76G82TRuSu3Ky4WBCJiFr1czHlA5RlpllU6lEivoOaslc4NtgABLyfTE3EPhP45xBhfOh1FmtMkZdJFXGwpIGOlPByc2nQC3mO9I8wRltvDAB0hds4vsEdQPPpNs",
  "q": "vZy-PHqEib7mYEGmhwoJcHzTrFjK5CAcQ0gqH41ALvKdArk1RzGJWEduQqG8s2_g84z3iobnlslSFM_FVvtQjGGqw8ul9VvHTOCiKlOCnJtCTOHqhGZMQTVSxoQito-RidKNA4rHpjHbU5Gq_3gLmVqdMeQw_Fx_NS1D2y5-k28",
  "dp": "YZA4-dwq0oPR8Ai0OOEmqiY6xoBBouKbzJDmCPHCIROWzDZgMy5xKJ0FJcW9CqqIDOy4Bi9w_W8os6XHR3HyQhabWzrlxgQYL_CcaUXRLDAh6K9GPc1D-DcsFYxW8-hgwzjLa4o5ElxMraCiqGSXkZMdQaWJMuVtyniFOVDrusE",
  "dq": "s3uvx-fhldISmIMMcz9Y-BXw-G-EfrS2jCm_VeaLHuWhInbWq_GEJQBYqtIWoXQB6AlEOOjCR8WB4Rlbn558_KVm07ft_HdIDMmGN7KdLEj7VXN0XqfG_uLO3AMwKMd16JRZz0SLABKpnk2BJBoqQJu5uQRcKkYUU-3pEYzNXBk",
  "qi": "k1qx6Qd4FpHw1185FZiRm4wGv6wzqSIm1LC0KS29CsGl4D6CVqVVaBwoW0Olw3jkrQe7znSuezC1_lZOGmjB2h3I5bKPlAUVKVqdfk4mwlh7Dfgs6AFcqUj5mpSx1a2L0SHQeZXsprA_EtXs0L37iLCEsoOre9qYRivZBqiTdJk"
}
```

Here is an example of source IVMS data:

```json theme={"system"}
{
  "Originator": {
    "originatorPersons": [
      {
        "naturalPerson": {
          "name": {
            "nameIdentifier": [
              {
                "primaryIdentifier": "John",
                "secondaryIdentifier": "Doe",
                "nameIdentifierType": "BIRT"
              }
            ],
            "localNameIdentifier": [],
            "phoneticNameIdentifier": []
          },
          "customerIdentification": "e8nvdf2vwa5036ix",
          "dateAndPlaceOfBirth": {
            "dateOfBirth": "1992-05-08"
          }
        }
      }
    ],
    "accountNumber": []
  },
  "Beneficiary": {
    "beneficiaryPersons": [
      {
        "naturalPerson": {
          "name": {
            "nameIdentifier": [
              {
                "primaryIdentifier": "Jack",
                "secondaryIdentifier": "Doe",
                "nameIdentifierType": "BIRT"
              }
            ],
            "localNameIdentifier": [],
            "phoneticNameIdentifier": []
          },
          "customerIdentification": "67b4defbfa5d2e41d8177ab3",
          "dateAndPlaceOfBirth": {
            "dateOfBirth": "1991-04-07"
          }
        }
      }
    ],
    "accountNumber": []
  }
}
```

This utility processes the paths to a partner's public key, our private key, and IVMS data, which are provided as arguments. It then generates an IVMS block containing encrypted data, along with all accompanying filled fields.

```javascript theme={"system"}
const jose = require('node-jose');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs/promises');

const SIGNATURE_ALGORITHM = 'RS256';
const ENCRYPTION_ALGORITHM = 'RSA-OAEP-256';
const ENCRYPTION_METHOD = 'A256GCM';
const DEFAULT_EXPIRY_MS = 300000; // 5 minutes
const CLOCK_SKEW_SEC = 60; // ±60s skew
const CLAIM_DATA = 'data'; // The JWT claim holding the payload

/**
 * Travel Rule JWT Codec for PII Data Encryption
 *
 * Implements a nested JWT (JWS signed token encrypted inside a JWE)
 * for secure PII exchange, compatible with the Java TRJWTCodec implementation.
 *
 * Features:
 * - Object signing and encryption: `prepareIvmsData` / `decryptAndDecode`
 * - JTI (JWT ID) claim for replay attack protection
 * - Standard claims validation (iss, iat, exp)
 */
class TRJWTCodec {
  constructor() {
    this.keyStore = jose.JWK.createKeyStore();
    this.publicKey = null; // Partner's public key (for encryption)
    this.privateKey = null; // Our private key (for signing)
    this.initialized = false;
  }

  /**
   * Initialize the codec with RSA key pairs.
   *
   * @param {Object} config - Configuration object
   * @param {string} config.publicKey - PEM-encoded RSA public key (partner's key for encryption)
   * @param {string} config.privateKey - PEM-encoded RSA private key (our key for signing)
   */
  async initialize(config) {
    this._assert(config.publicKey, 'Public key is required');
    this._assert(config.privateKey, 'Private key is required');

    try {
      this.publicKey = await this.keyStore.add(config.publicKey);
      this.privateKey = await this.keyStore.add(config.privateKey);
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize TRJWTCodec with provided keys: ${error.message}`);
    }
  }

  /**
   * Encrypt and sign an object as a nested JWT (JWS inside JWE).
   * This is the lower-level function that returns only the JWE string.
   *
   * @param {Object} data - The JSON-serializable object to encrypt.
   * @param {string} issuer - The 'iss' claim (our identifier).
   * @param {number} [expiryMs=DEFAULT_EXPIRY_MS] - Expiry time in milliseconds.
   * @returns {Promise<string>} - The compact-serialized JWE token string.
   */
  async encodeAndEncrypt(data, issuer, expiryMs = DEFAULT_EXPIRY_MS) {
    this._assertInitialized();
    this._assert(data, 'Data cannot be null or undefined');
    this._assert(issuer && typeof issuer === 'string' && issuer.trim(), 'Issuer must be a non-empty string');

    // 1. Serialize the object to a JSON string
    const dataJson = JSON.stringify(data);
    // 2. Encode the JSON string as base64url
    const dataB64Url = Buffer.from(dataJson, 'utf8').toString('base64url');
    // 3. Pass the base64url string to the byte-level encryption method
    return this.encryptBytes(dataB64Url, issuer, expiryMs);
  }

  /**
   * Prepares the full IVMS data object, including the encrypted JWE
   * and the list of filled fields.
   *
   * @param {Object} data - The IVMS data object to encrypt.
   * @param {string} issuer - The 'iss' claim (our identifier).
   * @param {number} [expiryMs=DEFAULT_EXPIRY_MS] - Expiry time in milliseconds.
   * @returns {Promise<{version: string, data: string, filledFields: string[]}>}
   * An object containing the API version, the encrypted JWE string,
   * and the dot-notation paths of all non-null fields.
   */
  async prepareIvmsData(data, issuer, expiryMs = DEFAULT_EXPIRY_MS) {
    // 1. Create the encrypted JWE string from the data object.
    // This handles signing with our private key and encrypting with the partner's public key.
    const encryptedData = await this.encodeAndEncrypt(data, issuer, expiryMs);
    // 2. Extract all filled field paths from the original data object.
    const filledFields = this._extractFilledFields(data);

    return {
      version: 'IVMS101.2023', // API version
      data: encryptedData,
      filledFields: filledFields
    };
  }

  /**
   * Decrypt and decode data from an encrypted JWE token.
   *
   * @param {string} encryptedJWT - The compact-serialized JWE token.
   * @param {string} [expectedIssuer] - (Optional) The expected 'iss' claim for validation.
   * @returns {Promise<Object>} - The original decrypted and parsed JSON object.
   */
  async decryptAndDecode(encryptedJWT, expectedIssuer = null) {
    this._assertInitialized();
    this._assert(encryptedJWT, 'Encrypted JWT cannot be null or empty');

    // --- JWE Decryption ---
    // 1. Decrypt the outer JWE layer using our private key.
    const jweResult = await jose.JWE.createDecrypt(this.privateKey)
      .decrypt(encryptedJWT);

    // The payload of the JWE is the inner JWS.
    const signedJWT = jweResult.payload.toString('utf8');

    // --- JWS Verification ---
    // 2. Verify the signature of the inner JWS using the partner's public key.
    const jwsResult = await jose.JWS.createVerify(this.publicKey)
      .verify(signedJWT);

    // The payload of the JWS is the claims object.
    const claimsJson = jwsResult.payload.toString('utf8');
    const claims = JSON.parse(claimsJson);

    // --- Claims Validation ---
    // 3. Validate standard JWT claims (iat, exp, iss, jti).
    if (expectedIssuer && claims.iss !== expectedIssuer) {
      throw new Error(`Invalid issuer: expected ${expectedIssuer}, got ${claims.iss}`);
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (claims.iat && claims.iat > nowSec + CLOCK_SKEW_SEC) {
      throw new Error('Token "iat" (issued at) is in the future');
    }
    if (claims.exp && nowSec - CLOCK_SKEW_SEC > claims.exp) {
      throw new Error('Token has expired');
    }
    if (!claims.jti) {
      throw new Error('Missing "jti" (JWT ID) claim');
    }

    // --- Payload Extraction ---
    // 4. Extract, decode, and parse the custom 'data' claim.
    const dataB64Url = claims[CLAIM_DATA];
    if (!dataB64Url) {
      throw new Error(`Missing required "${CLAIM_DATA}" claim`);
    }

    const dataBuffer = Buffer.from(dataB64Url, 'base64url');
    const dataJson = dataBuffer.toString('utf8');

    return JSON.parse(dataJson);
  }

  /**
   * Encrypts a base64url-encoded string payload into a nested JWS-in-JWE token.
   *
   * @param {string} dataB64Url - The base64url-encoded data string.
   * @param {string} issuer - The 'iss' claim.
   * @param {number} expiryMs - Expiry time in milliseconds.
   * @returns {Promise<string>} - The compact-serialized JWE token string.
   * @private
   */
  async encryptBytes(dataB64Url, issuer, expiryMs) {
    this._assertInitialized();

    try {
      // --- JWS Claims Setup ---
      // 1. Create the claims for the inner JWS token.
      const nowMs = Date.now();
      const iat = Math.floor(nowMs / 1000); // Issued at
      const exp = Math.floor((nowMs + expiryMs) / 1000); // Expiration
      const jti = crypto.randomUUID(); // Unique token ID

      const claims = {
        iss: issuer,
        iat: iat,
        exp: exp,
        jti: jti,
        [CLAIM_DATA]: dataB64Url,
      };
      const claimsJson = JSON.stringify(claims);

      // --- JWS Creation (Signing) ---
      // 2. Sign the claims with our private key.
      const jwsOptions = {
        format: 'compact',
        fields: {
          alg: SIGNATURE_ALGORITHM,
          typ: 'JWT',
          kid: this.privateKey.kid
        }
      };

      const signedJWT = await jose.JWS.createSign(jwsOptions, this.privateKey)
        .update(claimsJson)
        .final();

      // --- JWE Creation (Encryption) ---
      // 3. Encrypt the signed JWS with the partner's public key.
      const jweOptions = {
        format: 'compact',
        contentAlg: ENCRYPTION_METHOD,
        fields: {
          alg: ENCRYPTION_ALGORITHM,
          enc: ENCRYPTION_METHOD,
          kid: this.publicKey.kid,
          cty: 'JWT' // Content Type: Indicates payload is a JWT
        }
      };

      const encryptedJWT = await jose.JWE.createEncrypt(jweOptions, this.publicKey)
        .update(signedJWT)
        .final();

      return encryptedJWT;

    } catch (error) {
      throw new Error(`Nested JWT encryption failed: ${error.message}`);
    }
  }

  /**
   * Recursively extracts all filled (non-null, non-undefined)
   * leaf node paths from an object in dot-notation.
   *
   * @param {Object} obj - The object to traverse.
   * @returns {string[]} - An array of dot-notation field paths.
   * @private
   */
  _extractFilledFields(obj) {
    // Start the recursion with the root object and no path prefix
    return this._recursiveExtract(obj, '');
  }

  /**
   * Helper function for _extractFilledFields.
   * @param {*} current - The current value being inspected.
   * @param {string} path - The dot-notation path to this value.
   * @returns {string[]} - A flat array of leaf paths found from this node.
   * @private
   */
  _recursiveExtract(current, path) {
    // 1. Base Case: Null/Undefined values are "empty" and ignored.
    if (current === null || current === undefined) {
      return [];
    }

    // 2. Array Case: Recurse on each item, but keep the *same* path.
    // This "flattens" the array, so 'person.addresses[0].city' and
    // 'person.addresses[1].city' both map to 'person.addresses.city'.
    if (Array.isArray(current)) {
      // Use flatMap to collect and flatten results from all items.
      return current.flatMap(item => this._recursiveExtract(item, path));
    }

    // 3. Object Case: Recurse on each key/value pair, *extending* the path.
    if (typeof current === 'object') {
      return Object.entries(current).flatMap(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        return this._recursiveExtract(value, newPath);
      });
    }

    // 4. Primitive Case: This is a leaf node (string, number, boolean).
    // Return its path, as long as it's not an empty path (i.e., a root primitive).
    return path ? [path] : [];
  }

  /**
   * Throws an error if the codec is not initialized.
   * @private
   */
  _assertInitialized() {
    if (!this.initialized || !this.privateKey || !this.publicKey) {
      throw new Error('TRJWTCodec is not initialized. Call initialize() with keys first.');
    }
  }

  /**
   * Simple assertion helper.
   * @private
   */
  _assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
}


// --- Command-Line Execution ---

/**
 * Helper to read and parse a JSON file from a given path.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Promise<Object>} - The parsed JSON object.
 */
async function readJsonFile(filePath) {
  const absolutePath = path.resolve(filePath);
  try {
    const content = await fs.readFile(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read or parse file ${absolutePath}: ${error.message}`);
  }
}

/**
 * Main execution function for the command-line demo.
 */
async function main() {
  const args = process.argv;
  // Basic argument check
  if (args.length < 5) {
    console.error('Usage: node your-script-name.js <partnerPublicKeyFile> <ourPrivateKeyFile> <ivmsDataFile>');
    console.error('Example: node encrypt.js partner-public.json my-private.json data.json');
    process.exit(1);
  }

  const [,, publicKeyFile, privateKeyFile, ivmsDataFile] = args;

  try {
    // 1. Load keys and data from files
    const publicKeyData = await readJsonFile(publicKeyFile);
    const privateKey = await readJsonFile(privateKeyFile);
    const ivmsData = await readJsonFile(ivmsDataFile);

    const { issuer, publicKey } = publicKeyData;
    if (!issuer || !publicKey) {
      throw new Error('Public key JSON file must contain "issuer" and "publicKey" fields.');
    }

    // 2. Initialize the Codec
    const codec = new TRJWTCodec();
    await codec.initialize({
      publicKey,  // Partner's public key (for encryption)
      privateKey, // Our private key (for signing)
    });

    // 3. Prepare the IVMS Data
    // This signs with our private key and encrypts with the partner's public key.
    const ivmsRequest = await codec.prepareIvmsData(ivmsData, issuer);

    console.log(JSON.stringify(ivmsRequest, null, 2)); // Pretty-print the result
  } catch (error) {
    console.error(`\n❌ An error occurred: ${error.message}`);
    // console.error(error.stack); // Uncomment for full stack trace
    process.exit(1);
  }
}

// Run the main function
main();

```

Executing the previous utility with proper arguments produces the following output:

```shell theme={"system"}
node dec-encrypt.ts public-key.json private-key.json ivms.json
Reading JSON from: public-key.json
Reading JSON from: private-key.json
Reading JSON from: ivms.json
✅ Codec initialized successfully.

Encrypting IVMS data for issuer: sumsub.com...

--- ✅ Prepared IVMS Request ---
{
  "version": "IVMS101.2023",
  "data": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwia2lkIjoidGVzdC1zZW5kZXItMjAyNSIsImN0eSI6IkpXVCJ9.KNNX0QweA41Dhif_tLS26OFM3TIz7V8SuOnbGjVBJ1erB9GkhSGy3Q638ArSabSN0UoQKObd11UpDkw-ZiwWiGZ_OG1LsTKkfEWBtAQ5YSsNeJNMoQh3voIFHuLRm_RC2f0gj_v4q4iGpkyRqB6YN-kAFYQhWm_RuMuHSbatpBCzFT9XYybvRHe-oQ33WhIPFumiByq2FMzK94JNjwfILeqBtCiL9uWZSQtAPiOTQa88TMilZdeqOWmtg0_j7pYq8fl6x8tp3cyMfYKzpRaTZ8y8VDqt67BTehC0fOrn_Wh8TeuyYFKdiR3ROjIFBWnYEKimSgUeXMMynGMLnLq5Lg.bLixunwV8XdEi-TF.Mu8tSaJH_9fuZ7Sqk6gaR9m1hFJHU8mrPxHlT-jHp0x-3FBfPAxZM1N1vApS_foFIUgbbQA65FlG6kihGvvUBwpOlkQ9TjCaraaFyI3YSacJfBzDLQcL8NsBuaIqTanRcHlu77ph9A2Q0Rsqod_wwkMThAhb47vrq240fNKwwvKw5USeEUISVVc684CsLxxTC9n6PyfTCgUlWWdILxZ5Nv1LKtbHd_6IfNkBwi-ChKVz4E_N9B_KsJSRTquAlQMSLSHopOi50p5mq3LJCy97ZGc5ZKdAuoUV3lkYC7mQlY_T8A4o84pp-9uLI1pHTfyxCy0PUhIXb515jFRt5dFXt9fOWHOqMhCzBdHc_rfkaENw8zJSi3D3bqj8_dAQtw7xzCm0-bDmkj7Zb4-O_XBtehxFxQcQAWAoWdWBpRLw1XeMLgQSvGSGYkgDYJOxYzjTi0Ib8T1k8wQydfEqmdUPWcsw1_P-eDiG-NLdZuMLTdKNQsd2zSZ50JQILSyhsJ-MTYRN_Xn4RveND_sGud_Ck68dISSCUfrbdr7V9MStagCvCzyg6Vsd34g9-o2tjVV4QXR0S5ixweNpG-4mjVymIEf80XK4Eb1fkleLNa3L2vKnT8FjxZQUDbF4DMH2Enf9wx626hPx21AclJHvXWKJlA2bfHhqBpigIDClNQZZ5RZsekjTjCkW90u6myBxC6jz6rKVLkOY8zGY95VomI7aVzGDnWkQkW8v-dJZT9FMN8Z0u4EsH1SMFfOSjVVkTx_HikrHOaXuQ2_v5_-xvT8Cow8P2bkm1MYFQiAmzUwVaIJ87QDd09_iLL5xdOBjRY00M3CWXbvZxo_Oqp-qu62I4_TEIsl8rE42hMOH6lm4-FWJpnk-K8lakjXjSpVQMkPTNHFY3TyWhD3D7V3qa2oxWOWUcJxm0lsAspkNlgg4tG5ReWQlA002HwO4gaX8U0dGxkLqDaJYGIWeFlbn1IaQGEQ3Ia-f4mj9wTBGVDb0nk1dtTMQ-nNRHxDjh5ibbSIi2NCiMu7AKjN7xogh5EkWoSmIYrSZN6cDhSFMlNfsFbkhV8ruQrkV3bZB-kYbuyc1KLLIXdfR0MSTbqCogI3Ud2oJe0DRXpCoQnfb6FWKlXf5wjT5TKgNm6v6i3wj4QMYAzK1NvvmSd4e0XROtFxzz6wcb01IglrjRTN1Ot9G2Z-kycxfT1wkuv2NX0LqrQ3ljDm-virAGMfdamuMzkly2U8AErpBNAXDjFGKm6jdyjtyMvzUgjfpCU_l4H37rJgLaUuHq7L8F_RCLxfzJKQN24Bv4bpdUaji3f2HB0e3HosI4Sn_ZMIwHULs0FwrVeCLnOtn_5VoHFDbl9Vyku5Za6eij6cwU0vcpOgXRnksXdD_p72IUaMbgdJy8O3GiS0Ga9kFeqW9aqQ_JFBo1aUhhRbJVHIOG_AhEMVNBtbm7FkqQ1Qvp-kHSoZGLw4-ymrG60EKdyicGPwMXSeach1tdHZ965vJOpqMEjnjFOCYkkPweaAd-rQjXkGytQ_2N0UacP1SAsr8RQrE1BLBEgr9Yg8GFf4ChF8WcjYp-M68-h0WkG-zWYCXvc7bSJ9R5BdfOVourb1a2lo1Mvbd42Ad6dXx7Libs1yqMOnpCNVj5cWsPuEInd0Amco1UEdoyrsLVHRiJUAWlbZOzNP537StaTt6aK8gf1VkJP8EPZA70U7qdlWF1RyQtjIPORd4FoY-4_4X8IOZbt8yi8uCB7o9wiQyMM_fFHCpftLa5Sy8KHBzzR2pB78T2Pe6wWvRBKsQzxv50w4V7IyWHo8wLz72baG1_dSoLGp0RwxC9MrRNh6ZJF28iYqPCIPaDlikEierJd1JZ5bXt4A_-DvuQopTKhC3fB5_LNilIyNK80BjsgpWh6Fd7a07t8XXz6YvrBZ_2aJRDlVWwsHlmrbRi94OUyIbP5LcY6Z2YOhMIaUL1phMK9voPavhTlA1dDf52aKLnoAmNq_KRkq98n6HagyYscaSuusErKwAQEm7pjw7YxZyEXB47BXhVKTi4ZUQWgZLTpyH29gn0_CAuIfO21q9qa3Gc39GPjxIGF_Ss4i_DKjHnWframX6fOTVjYEtYFfxnE6bjhd9-KqZ0NrZelTIgdHWLxaFv7_RwPTCoTQ6wXSSGXKn-OJM_rITcNg0ikzc2Gv1z3Uvpf_cKmOBXSSwyXjxO4lQRSWTZppVuTDT1AfwfNtR0tsfJJel3lzTo_ldJlOFWWDuoBfOl0t1SAB5Yqh9ABXF89LknqwmIpxL8ykGsP-iByuaJhVngqbLDJdS4KO17VcX69o2oHC47CjzF0sB0lM_jWk69_Kmfl61Ky1nWjZNrDPoiW71oxdmNfAfsS7Rg5v9.Gi1d0Ou_IOu-WuHP8rIOMw",
  "filledFields": [
    "Originator.originatorPersons.naturalPerson.name.nameIdentifier.primaryIdentifier",
    "Originator.originatorPersons.naturalPerson.name.nameIdentifier.secondaryIdentifier",
    "Originator.originatorPersons.naturalPerson.name.nameIdentifier.nameIdentifierType",
    "Originator.originatorPersons.naturalPerson.customerIdentification",
    "Originator.originatorPersons.naturalPerson.dateAndPlaceOfBirth.dateOfBirth",
    "Beneficiary.beneficiaryPersons.naturalPerson.name.nameIdentifier.primaryIdentifier",
    "Beneficiary.beneficiaryPersons.naturalPerson.name.nameIdentifier.secondaryIdentifier",
    "Beneficiary.beneficiaryPersons.naturalPerson.name.nameIdentifier.nameIdentifierType",
    "Beneficiary.beneficiaryPersons.naturalPerson.customerIdentification",
    "Beneficiary.beneficiaryPersons.naturalPerson.dateAndPlaceOfBirth.dateOfBirth"
  ]
}
---------------------------------

```

#### Decryption Example

Here is an example of source IVMS structure with encrypted IVMS data. Note that this data is just an example input file and cannot be used for actual testing, as the parser will throw a token-expired exception. This encrypted data should be the content the partner has sent to us as part of creating or getting a TRM (i.e., signed with their private key and encrypted with our public key). In other words, the output of the previous script cannot be used here for testing.

```json theme={"system"}
{
  "version": "IVMS101.2023",
  "data": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwia2lkIjoidGVzdC1zZW5kZXItMjAyNSIsImN0eSI6IkpXVCJ9.Q2TS_6NOsy_bfmOmS23uYItJJqtU8mhSxXCvkvuP2aLtZSgBmtnICnfq1l4CJmxP0MI03RHWqfhg4NmNBPwih524GCwu16Vt1T1MUmoEyzUGRGHl1x8rYam_x6tihfGADbXzrCiSOwZYPrc4mbP31wRCiFC8vhTx2PEzCvZrEGfGjWanZIPARtczxfjzN_QEok3D8HVIJOmTq-lYFf6mgaOWwoSz0xbae7wzlLFScWHwaGdQ-Un6_F7OR8ed-6bCrp24_qlpwLkA3dMVqX4cQarVca-DmfGmvVaoXSflUwePRfwkRkcJcvRxECekvoFpQvCQ6VDBg3SAvxK-khFzwQ.AkMTJBpld5ZhxECk.ZgWkgarTGWFnkDCcur9Z0Wr1HDPAG3G11SK5YZ5c8vE2hLTVWmRbof1YedpdVHiWEoUQjBEEzNmIqVIVoRSQ9-pbehXIN_i_lYgBehPJ_dVp0j79nXCGRSY5-vSRzVpMRWtqM-3R6cav-3ftduPEzn6XIjjkVxC_G7Hhp-BIuHNafaoAKJgxOWVZfUyw4HRHZ4s1f14l2lRQymVVFPyIAiNDWSWYivFqybIaMyDrmhJEBlSQKwKBhBMc11JEe11IaJb2asgZkeaf-C77ls-ZG4oVEAK03Rjk_I5C7sRQtunmJSrwBh5coDY_XGL9cmjCGlKW-n3eQMK01cHIHLikYxEN9DQo4XPF0Oi3L6czE7I5lFfzm4BBNeZejP8dvIAce7T-HhFk3SpnJ94omwmCrw_MNLfVFPGCNAxHUX5oM5XdWuazOVA8_fF6F18gVk7nWddkuQsyJEfCRT_-BRmdHhw4CGHDd1nMKjg0its2uHzrFM0hrd88NRLtzwX-7G-elSsydxuD5fWU4um93oYj5BgA70JDoS_N8bGFlBrpt0rv8cP3lEUlblIFAxbSFa3-5N6GP_bKmR02WFy7zaV5TQaQsods015glvTz0DBrNmyOmAu0xUzMj46KOC9qDDGRnZjCiBZW-ySt9CpFnesGEmfln1aw7TgSQ0kel4F7nwB0HykCTGKe8Wm9bEgl6w_aCEtSFt0IioA5lmNyZA8cZf6Cf8rgeihv--sbSWM5Y0zcaaO41_bifTUGnbTE63fApYmn2TceTz2KNy9Db9kMAsnb4moC1DgnVeb3-bRl_NNnnuRftM5LEsBqc-RC1Yt7t6gTmwCMqT3BghZjqm3GPJufXaulG7LpxLUVwcM7NhpJGw3DpCEtBkWJWwHE27EQy-17x2Mwpk_3TLmhvP2W0ZV1uFB_Qz_tsMz9lxQ4NStwmbDyBHBQSZ5gS-FpZzfrtilgIxKBt7-GaalcXRd8wV_MbLbHP4W7k1d3uFYwxAfFUDKWvxderSUQ-TmfzEHyJiXxXSpHIDMEJz9pGC_JKxM6G9zgAfosJ76bBqT3v_YdtPmuFUx9TVxBW_1EPk58yTJR5V1XL7B6HYd_qrCsOahnyaZ6zq3Ygsfza5IOP3-7rSF15JXMoQtN47rgOeplHa3xrTsCuEraXAbVwVp99n3OpPQ9R2MZwPzUEbDkQ7XRYHIhaKYrEiYE9E0atK1Dn4Kd2dB1nukVlC3k1ETMIb6evR0x2JpcrGFlk71rjd61uS07XpDV3gU09JbI-aRsUSbJ7-crssx0158aHsfO_XiTLiQ3e9Mz5vjY6gjiefo-fybxNmOZ7skWuG5-BOrbOAqWEu9j-QfMiHWi3L_r8vPNtythOIh4VkOF-x1SnEujJWEfyvEl6zTqVyy4ArWeJxiIx7eY0jdAh-DQ0lR70iALnr-MudqFbrb5Kda2Yf20B8f6rgcnvLUOm4rNS9ewgzNmzDjS3L_OAFdQahBve2t-8rDvbWYIdYEy4XdU9uBwN47CjfZRqxLbClMsUrEGJyffVsKXkE2q0kPSlHjsVcSIBpuUaFaRXPZDAp-vv0dRlgJnu7ojzmO9twe4rg5gCYWvhuTP6fvLNyxzpVjbuMNso5V_Kh1841510DofG8uJXl_Yweo9AaQ1_km_8PfClKAF9s90hhkc-bDXIQCv2tZasJ-l62iBXL9RgytDr73k5KCNAfREUN-pVT-ePhyoFkRjiJTp4i0UO7DMLHH2evnc6dDPoL38Imc5XVZ3nKDXBCtJqlP_b0fVNialqW-j86bVXPp-ROCZqN8568ohb2w7BcfnrG3Mu5-Z1uuUXkduROIR2YfpIYHs5MF7ibXx_KGDsyhQibqchCDHSihdQl0GcCf1ShIMGYJ6zHsjcRFMD6q_QbS14QSJWGYX5otCK_TEkKRKBDtP5LlPxzOb7t1X5aDkAWABOhiExengSvXKj_fh1LrrG0_hNHuZ3ZTdN33a9sHESwjTG9ftfTFmi8RD_SabVIOKNMjCbA21UAVBeLbj6O16lTMEqwyAg165o3nKIdwrgT4NTz2Q7OEjcmPpTrMUmJNhV5V8MrL6s3K9XOSq245nSfE5VC6U-bXM_U2GSK1_dAAA2PjH6OxiGzrDz3yhrXN_D2gOUkAtxI9zQOF5f__kbE4i4mT9wWLUBnk2zie2X7mPJMrTTPy6S1uPdm811hkmA7pEKwMyh4LI58boeORipzIY7yERWK516GFA1ISIX7AirlHxrgaiojBJ5K7kyI2futrDchX8m-cAnT6dDtzE5fvq_kw_4XzWn-NCtO1nMe7ZydzlNCmI_dHaADHAfxQo9Fi3yTeVV76wWnFEVcrEnoYmibyoW7fNS0Yjlh3D.M6DlnVu5kCnzXwtp3y1ToA",
  "filledFields": [
    "Originator.originatorPersons.naturalPerson.name.nameIdentifier.primaryIdentifier",
    "Originator.originatorPersons.naturalPerson.name.nameIdentifier.secondaryIdentifier",
    "Originator.originatorPersons.naturalPerson.name.nameIdentifier.nameIdentifierType",
    "Originator.originatorPersons.naturalPerson.customerIdentification",
    "Originator.originatorPersons.naturalPerson.dateAndPlaceOfBirth.dateOfBirth",
    "Beneficiary.beneficiaryPersons.naturalPerson.name.nameIdentifier.primaryIdentifier",
    "Beneficiary.beneficiaryPersons.naturalPerson.name.nameIdentifier.secondaryIdentifier",
    "Beneficiary.beneficiaryPersons.naturalPerson.name.nameIdentifier.nameIdentifierType",
    "Beneficiary.beneficiaryPersons.naturalPerson.customerIdentification",
    "Beneficiary.beneficiaryPersons.naturalPerson.dateAndPlaceOfBirth.dateOfBirth"
  ]
}
```

This utility processes the paths to a partner's public key, our private key, and encrypted IVMS data, which are provided as arguments. It then decrypts an IVMS block containing encrypted data.

```javascript theme={"system"}
const jose = require('node-jose');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs/promises');

const SIGNATURE_ALGORITHM = 'RS256';
const ENCRYPTION_ALGORITHM = 'RSA-OAEP-256';
const ENCRYPTION_METHOD = 'A256GCM';
const DEFAULT_EXPIRY_MS = 300000; // 5 minutes
const CLOCK_SKEW_SEC = 60; // ±60s skew
const CLAIM_DATA = 'data'; // The JWT claim holding the payload

/**
 * Travel Rule JWT Codec for PII Data Encryption
 *
 * Implements a nested JWT (JWS signed token encrypted inside a JWE)
 * for secure PII exchange, compatible with the Java TRJWTCodec implementation.
 *
 * Features:
 * - Object signing and encryption: `prepareIvmsData` / `decryptAndDecode`
 * - JTI (JWT ID) claim for replay attack protection
 * - Standard claims validation (iss, iat, exp)
 */
class TRJWTCodec {
  constructor() {
    this.keyStore = jose.JWK.createKeyStore();
    this.publicKey = null; // Partner's public key (for encryption)
    this.privateKey = null; // Our private key (for signing)
    this.initialized = false;
  }

  /**
   * Initialize the codec with RSA key pairs.
   *
   * @param {Object} config - Configuration object
   * @param {string} config.publicKey - PEM-encoded RSA public key (partner's key for encryption)
   * @param {string} config.privateKey - PEM-encoded RSA private key (our key for signing)
   */
  async initialize(config) {
    this._assert(config.publicKey, 'Public key is required');
    this._assert(config.privateKey, 'Private key is required');

    try {
      this.publicKey = await this.keyStore.add(config.publicKey);
      this.privateKey = await this.keyStore.add(config.privateKey);
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize TRJWTCodec with provided keys: ${error.message}`);
    }
  }

  /**
   * Encrypt and sign an object as a nested JWT (JWS inside JWE).
   * This is the lower-level function that returns only the JWE string.
   *
   * @param {Object} data - The JSON-serializable object to encrypt.
   * @param {string} issuer - The 'iss' claim (our identifier).
   * @param {number} [expiryMs=DEFAULT_EXPIRY_MS] - Expiry time in milliseconds.
   * @returns {Promise<string>} - The compact-serialized JWE token string.
   */
  async encodeAndEncrypt(data, issuer, expiryMs = DEFAULT_EXPIRY_MS) {
    this._assertInitialized();
    this._assert(data, 'Data cannot be null or undefined');
    this._assert(issuer && typeof issuer === 'string' && issuer.trim(), 'Issuer must be a non-empty string');

    // 1. Serialize the object to a JSON string
    const dataJson = JSON.stringify(data);
    // 2. Encode the JSON string as base64url
    const dataB64Url = Buffer.from(dataJson, 'utf8').toString('base64url');
    // 3. Pass the base64url string to the byte-level encryption method
    return this.encryptBytes(dataB64Url, issuer, expiryMs);
  }

  /**
   * Prepares the full IVMS data object, including the encrypted JWE
   * and the list of filled fields.
   *
   * @param {Object} data - The IVMS data object to encrypt.
   * @param {string} issuer - The 'iss' claim (our identifier).
   * @param {number} [expiryMs=DEFAULT_EXPIRY_MS] - Expiry time in milliseconds.
   * @returns {Promise<{version: string, data: string, filledFields: string[]}>}
   * An object containing the API version, the encrypted JWE string,
   * and the dot-notation paths of all non-null fields.
   */
  async prepareIvmsData(data, issuer, expiryMs = DEFAULT_EXPIRY_MS) {
    // 1. Create the encrypted JWE string from the data object.
    // This handles signing with our private key and encrypting with the partner's public key.
    const encryptedData = await this.encodeAndEncrypt(data, issuer, expiryMs);
    // 2. Extract all filled field paths from the original data object.
    const filledFields = this._extractFilledFields(data);

    return {
      version: 'IVMS101.2023', // API version
      data: encryptedData,
      filledFields: filledFields
    };
  }

  /**
   * Decrypt and decode data from an encrypted JWE token.
   *
   * @param {string} encryptedJWT - The compact-serialized JWE token.
   * @param {string} [expectedIssuer] - (Optional) The expected 'iss' claim for validation.
   * @returns {Promise<Object>} - The original decrypted and parsed JSON object.
   */
  async decryptAndDecode(encryptedJWT, expectedIssuer = null) {
    this._assertInitialized();
    this._assert(encryptedJWT, 'Encrypted JWT cannot be null or empty');

    // --- JWE Decryption ---
    // 1. Decrypt the outer JWE layer using our private key.
    const jweResult = await jose.JWE.createDecrypt(this.privateKey)
      .decrypt(encryptedJWT);

    // The payload of the JWE is the inner JWS.
    const signedJWT = jweResult.payload.toString('utf8');

    // --- JWS Verification ---
    // 2. Verify the signature of the inner JWS using the partner's public key.
    const jwsResult = await jose.JWS.createVerify(this.publicKey)
      .verify(signedJWT);

    // The payload of the JWS is the claims object.
    const claimsJson = jwsResult.payload.toString('utf8');
    const claims = JSON.parse(claimsJson);

    // --- Claims Validation ---
    // 3. Validate standard JWT claims (iat, exp, iss, jti).
    if (expectedIssuer && claims.iss !== expectedIssuer) {
      throw new Error(`Invalid issuer: expected ${expectedIssuer}, got ${claims.iss}`);
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (claims.iat && claims.iat > nowSec + CLOCK_SKEW_SEC) {
      throw new Error('Token "iat" (issued at) is in the future');
    }
    if (claims.exp && nowSec - CLOCK_SKEW_SEC > claims.exp) {
      throw new Error('Token has expired');
    }
    if (!claims.jti) {
      throw new Error('Missing "jti" (JWT ID) claim');
    }

    // --- Payload Extraction ---
    // 4. Extract, decode, and parse the custom 'data' claim.
    const dataB64Url = claims[CLAIM_DATA];
    if (!dataB64Url) {
      throw new Error(`Missing required "${CLAIM_DATA}" claim`);
    }

    const dataBuffer = Buffer.from(dataB64Url, 'base64url');
    const dataJson = dataBuffer.toString('utf8');

    return JSON.parse(dataJson);
  }

  /**
   * Encrypts a base64url-encoded string payload into a nested JWS-in-JWE token.
   *
   * @param {string} dataB64Url - The base64url-encoded data string.
   * @param {string} issuer - The 'iss' claim.
   * @param {number} expiryMs - Expiry time in milliseconds.
   * @returns {Promise<string>} - The compact-serialized JWE token string.
   * @private
   */
  async encryptBytes(dataB64Url, issuer, expiryMs) {
    this._assertInitialized();

    try {
      // --- JWS Claims Setup ---
      // 1. Create the claims for the inner JWS token.
      const nowMs = Date.now();
      const iat = Math.floor(nowMs / 1000); // Issued at
      const exp = Math.floor((nowMs + expiryMs) / 1000); // Expiration
      const jti = crypto.randomUUID(); // Unique token ID

      const claims = {
        iss: issuer,
        iat: iat,
        exp: exp,
        jti: jti,
        [CLAIM_DATA]: dataB64Url,
      };
      const claimsJson = JSON.stringify(claims);

      // --- JWS Creation (Signing) ---
      // 2. Sign the claims with our private key.
      const jwsOptions = {
        format: 'compact',
        fields: {
          alg: SIGNATURE_ALGORITHM,
          typ: 'JWT',
          kid: this.privateKey.kid
        }
      };

      const signedJWT = await jose.JWS.createSign(jwsOptions, this.privateKey)
        .update(claimsJson)
        .final();

      // --- JWE Creation (Encryption) ---
      // 3. Encrypt the signed JWS with the partner's public key.
      const jweOptions = {
        format: 'compact',
        contentAlg: ENCRYPTION_METHOD,
        fields: {
          alg: ENCRYPTION_ALGORITHM,
          enc: ENCRYPTION_METHOD,
          kid: this.publicKey.kid,
          cty: 'JWT' // Content Type: Indicates payload is a JWT
        }
      };

      const encryptedJWT = await jose.JWE.createEncrypt(jweOptions, this.publicKey)
        .update(signedJWT)
        .final();

      return encryptedJWT;

    } catch (error) {
      throw new Error(`Nested JWT encryption failed: ${error.message}`);
    }
  }

  /**
   * Recursively extracts all filled (non-null, non-undefined)
   * leaf node paths from an object in dot-notation.
   *
   * @param {Object} obj - The object to traverse.
   * @returns {string[]} - An array of dot-notation field paths.
   * @private
   */
  _extractFilledFields(obj) {
    // Start the recursion with the root object and no path prefix
    return this._recursiveExtract(obj, '');
  }

  /**
   * Helper function for _extractFilledFields.
   * @param {*} current - The current value being inspected.
   * @param {string} path - The dot-notation path to this value.
   * @returns {string[]} - A flat array of leaf paths found from this node.
   * @private
   */
  _recursiveExtract(current, path) {
    // 1. Base Case: Null/Undefined values are "empty" and ignored.
    if (current === null || current === undefined) {
      return [];
    }

    // 2. Array Case: Recurse on each item, but keep the *same* path.
    // This "flattens" the array, so 'person.addresses[0].city' and
    // 'person.addresses[1].city' both map to 'person.addresses.city'.
    if (Array.isArray(current)) {
      // Use flatMap to collect and flatten results from all items.
      return current.flatMap(item => this._recursiveExtract(item, path));
    }

    // 3. Object Case: Recurse on each key/value pair, *extending* the path.
    if (typeof current === 'object') {
      return Object.entries(current).flatMap(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        return this._recursiveExtract(value, newPath);
      });
    }

    // 4. Primitive Case: This is a leaf node (string, number, boolean).
    // Return its path, as long as it's not an empty path (i.e., a root primitive).
    return path ? [path] : [];
  }

  /**
   * Throws an error if the codec is not initialized.
   * @private
   */
  _assertInitialized() {
    if (!this.initialized || !this.privateKey || !this.publicKey) {
      throw new Error('TRJWTCodec is not initialized. Call initialize() with keys first.');
    }
  }

  /**
   * Simple assertion helper.
   * @private
   */
  _assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
}


// --- Command-Line Execution ---

/**
 * Helper to read and parse a JSON file from a given path.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Promise<Object>} - The parsed JSON object.
 */
async function readJsonFile(filePath) {
  const absolutePath = path.resolve(filePath);
  try {
    const content = await fs.readFile(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read or parse file ${absolutePath}: ${error.message}`);
  }
}

/**
 * Main execution function for the command-line demo.
 */
async function main() {
  const args = process.argv;
  // Basic argument check
  if (args.length < 5) {
    console.error('Usage: node your-script-name.js <partnerPublicKeyFile> <ourPrivateKeyFile> <encryptedIvmsDataFile>');
    console.error('Example: node decrypt.js partner-public.json my-private.json data.json');
    process.exit(1);
  }

  const [,, publicKeyFile, privateKeyFile, ivmsDataFile] = args;

  try {
    // 1. Load keys and data from files
    const publicKeyData = await readJsonFile(publicKeyFile);
    const privateKey = await readJsonFile(privateKeyFile);
    const ivmsData = await readJsonFile(ivmsDataFile);

    const { issuer, publicKey } = publicKeyData;
    if (!issuer || !publicKey) {
      throw new Error('Public key JSON file must contain "issuer" and "publicKey" fields.');
    }

    // 2. Initialize the Codec
    const codec = new TRJWTCodec();
    await codec.initialize({
      publicKey,  // Partner's public key (for signature verification)
      privateKey, // Our private key (for decryption)
    });

    // 3. Decrypt the IVMS Data
    // This decrypts with our private key and verifies the signature with the partner's public key.
    const decryptedIvms = await codec.decryptAndDecode(ivmsData.data, issuer);

    console.log(JSON.stringify(decryptedIvms, null, 2)); // Pretty-print the result
  } catch (error) {
    console.error(`\n❌ An error occurred: ${error.message}`);
    // console.error(error.stack); // Uncomment for full stack trace
    process.exit(1);
  }
}

// Run the main function
main();

```

### Encryption and Decryption (Partner: GTR using Curve25519)

<Note>
  **Security requirement:**

  All PII must be encrypted before transmission to GTR. Plain-text PII is prohibited.
</Note>

GTR requires Curve25519 encryption with ED25519 key pairs. The IVMS101 data format remains consistent across providers.

#### Key Requirements

* **Algorithm:** Curve25519
* **Key Format:** ED25519 (Public/Private Key Pair)
* **Key Conversion:** ED25519 keys must be converted to Curve25519 format
* **Key Management:** Configure public key in GTR Dashboard (Settings > Public Key)

#### Differences from Sumsub

| Aspect                    | Sumsub                                    | GTR                           |
| ------------------------- | ----------------------------------------- | ----------------------------- |
| **Encryption Algorithm**  | RSA with JWT (JWS inside JWE)             | Curve25519                    |
| **Key Format**            | JWK (JSON Web Key)                        | ED25519                       |
| **Key Conversion**        | Not required                              | ED25519 → Curve25519 required |
| **Public Key Management** | Retrieved via `getPublicKeyForEncryption` | Configured in GTR Dashboard   |

#### Implementation

1. Configure public key in GTR Dashboard (Settings > Public Key) with curve25519 algorithm
2. Obtain GTR's public key from GTR integration settings
3. Encrypt IVMS101 data using GTR's encryption tool
4. Submit encrypted data via `createTravelRuleMessage` endpoint
5. Decrypt received data using GTR's decryption tool for inbound TRMs

#### GTR Encryption Tool

GTR provides a standalone open source encryption tool that handles ED25519 to Curve25519 key conversion, IVMS101 encryption, and decryption. This tool operates independently from the Fireblocks SDK.

Use GTR's encryption tool rather than implementing Curve25519 encryption manually to ensure compatibility with GTR's requirements.

Learn more about the encryption tool in the [GTR Fireblocks integration guide](https://www.globaltravelrule.com/documentation/connect-fireblocks-with-gtr).

<Note>
  **Note:**

  The `getPublicKeyForEncryption` endpoint does not apply to GTR integrations. Public keys are managed directly in the GTR Dashboard.
</Note>

## API Integration

### Legal Entity Management

Legal entity management endpoints handle the creation and maintenance of legal entities requiring travel rule compliance. Each legal entity can have multiple TRSupport integrations with different TRP partners. Legal entities contain essential identifying information such as legal names, geographic addresses, national identifiers, and associated vault accounts. The `discoverable` field controls visibility in partner address books for counterparty discovery.

#### Create a Legal Entity

Creates a new legal entity for TRSupport integrations. This is the first step in setting up travel rule compliance for a legal entity. The legal entity stores all the legal and identification information required for IVMS101 compliance, including geographic address, national identification numbers, and date of incorporation. Once created, the legal entity can be linked to one or more TRPs through customer integrations. The `vaults` array associates specific Fireblocks vault accounts with this customer entity, while the `discoverable` setting determines if this legal entity should be visible to counterparties in the partner's address book.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers
```

**Request Body:**

```typescript theme={"system"}
{
  shortName: string;                // Short name for the legal entity
  fullLegalName?: string;           // Full legal name
  countryOfRegistration?: string;   // ISO 3166-1 alpha-2 code (e.g., "US")
  nationalIdentification?: string;  // National identifier
  dateOfIncorporation?: string;     // ISO date string (e.g., "2023-01-15")
  geographicAddress?: {             // Geographic address
    formattedAddress?: string;
    country?: string;
    streetName?: string;
    buildingNumber?: string;
    city?: string;
    postalCode?: string;
  };
  vaults?: number[];                // Array of vault IDs
  trPrimaryPurpose?: string;        // Travel rule primary purpose enum
  discoverable?: string;            // "discoverable", "hidden", or "anonymous"
}
```

**Response (201):**

```typescript theme={"system"}
{
  id: string;
  discoverable: string;
  shortName: string;
  fullLegalName: string;
  geographicAddress: {
    formattedAddress?: string;
    country?: string;
    streetName?: string;
    buildingNumber?: string;
    city?: string;
    postalCode?: string;
  };
  countryOfRegistration: string;
  nationalIdentification: string;
  dateOfIncorporation: Date;
  trPrimaryPurpose: string;
  createDate: Date;
  lastUpdate: Date;
  vaults: number[];
}
```

**SDK Example:**

```typescript theme={"system"}
// Create a legal entity
const { data: customer } = await fireblocks.trLink.createTRLinkCustomer({
  shortName: "ACME Corp",
  fullLegalName: "ACME Corporation Ltd",
  countryOfRegistration: "US",
  nationalIdentification: "EIN-123456789",
  dateOfIncorporation: "2020-01-15",
  geographicAddress: {
    formattedAddress: "123 Main St, New York, NY 10001",
    country: "US",
    streetName: "Main St",
    buildingNumber: "123",
    city: "New York",
    postalCode: "10001"
  },
  vaults: [0, 1],
  discoverable: "discoverable",
  trPrimaryPurpose: "BUSINESS"
});

console.log(`Legal entity created with ID: ${customer.id}`);
```

#### Get a Legal Entity

Retrieves complete details for a specific legal entity by its unique ID. This endpoint returns all stored information about the legal entity, including their legal identifiers, geographic address, associated vaults, and travel rule configuration. Use this endpoint to verify legal entity details before creating integrations or to display legal entity information in your application.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/:customerId
```

**Path Parameters:**

* `customerId` (string, UUID) - The legal entity ID

**Response (200):**

```typescript theme={"system"}
{
  id: string;
  discoverable: string;
  shortName: string;
  fullLegalName: string;
  geographicAddress: object;
  countryOfRegistration: string;
  nationalIdentification: string;
  dateOfIncorporation: Date;
  trPrimaryPurpose: string;
  createDate: Date;
  lastUpdate: Date;
  vaults: number[];
}
```

**SDK Example:**

```typescript theme={"system"}
const customerId = "12345678-1234-1234-1234-123456789abc";
const { data: legalEntity } = await fireblocks.trLink.getTRLinkCustomerById(customerId);
console.log(`Legal entity: ${legalEntity.shortName}`);
```

#### Get All Legal Entities

Retrieves a list of all legal entities associated with the current tenant. This endpoint is useful for displaying a list of all legal entities configured for travel rule compliance. Each legal entity in the response includes full details, including vaults, addresses, and identifiers. The response is scoped to the authenticated tenant to ensure data isolation between different organizations.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers
```

**Response (200):**

```typescript theme={"system"}
Array<{
  id: string;
  discoverable: string;
  shortName: string;
  fullLegalName: string;
  geographicAddress: object;
  countryOfRegistration: string;
  nationalIdentification: string;
  dateOfIncorporation: Date;
  trPrimaryPurpose: string;
  createDate: Date;
  lastUpdate: Date;
  vaults: number[];
}>

```

**SDK Example:**

```typescript theme={"system"}
const { data: legalEntities } = await fireblocks.trLink.getTRLinkCustomers();

legalEntities.forEach(legalEntity => {
  console.log(`Legal entity: ${legalEntity.shortName} (${legalEntity.id})`);
});
```

#### Update a Legal Entity

Updates the information for an existing legal entity. This endpoint allows you to modify any legal entity field, including their legal name, geographic address, national identifiers, vault associations, and discoverability settings. Updates are typically needed when business information changes or when correcting registration data. All fields in the request body are optional, allowing partial updates while preserving unchanged fields.

**Endpoint:**

```http theme={"system"}
PUT /v1/screening/trlink/customers/:customerId
```

**Path Parameters:**

* `customerId` (string, UUID) - The legal entity ID

**Request Body:**

```typescript theme={"system"}
{
  shortName: string;                // Short name for the legal entity
  fullLegalName?: string;           // Full legal name
  countryOfRegistration?: string;   // ISO 3166-1 alpha-2 code (e.g., "US")
  nationalIdentification?: string;  // National identifier
  dateOfIncorporation?: string;     // ISO date string (e.g., "2023-01-15")
  geographicAddress?: {             // Geographic address
    formattedAddress?: string;
    country?: string;
    streetName?: string;
    buildingNumber?: string;
    city?: string;
    postalCode?: string;
  };
  vaults?: number[];                // Array of vault IDs
  trPrimaryPurpose?: string;        // Travel rule primary purpose enum
  discoverable?: string;            // "discoverable", "hidden", or "anonymous"
}
```

**Response (200):**

```typescript theme={"system"}
{
  id: string;
  discoverable: string;
  shortName: string;
  fullLegalName: string;
  geographicAddress: object;
  countryOfRegistration: string;
  nationalIdentification: string;
  dateOfIncorporation: Date;
  trPrimaryPurpose: string;
  createDate: Date;
  lastUpdate: Date;
  vaults: number[];
}
```

**SDK Example:**

```typescript theme={"system"}
const customerId = "12345678-1234-1234-1234-123456789abc";

const { data: updatedLegalEntity } = await fireblocks.trLink.updateTRLinkCustomer(customerId, {
  shortName: "ACME Corp Updated",
  fullLegalName: "ACME Corporation Ltd - Updated",
  vaults: [0, 1, 2]
});

console.log(`Legal entity updated: ${updatedLegalEntity.shortName}`);
```

#### Delete a Legal Entity

Permanently deletes a legal entity and all associated data, including integrations, TRMs, and configuration. This is a destructive operation that cannot be undone. Use this endpoint when a legal entity is no longer operating or when cleaning up test data. All active integrations for this legal entity will be disconnected, and any pending TRMs may fail. Ensure all transactions are complete before deleting a legal entity.

**Endpoint:**

```sql theme={"system"}
DELETE /v1/screening/trlink/customers/:customerId
```

**Path Parameters:**

* `customerId` (string, UUID) - The legal entity ID

**Response (204):** No content

**SDK Example:**

```typescript theme={"system"}
const customerId = "12345678-1234-1234-1234-123456789abc";
await fireblocks.trLink.deleteTRLinkCustomer(customerId);

console.log('Legal entity deleted successfully');
```

### Legal Entity Integrations

Legal entity integration endpoints manage the connections between legal entities and the TRP partners. Each integration represents a configured connection to a specific TRP, such as Sumsub, enabling the customer to send and receive TRMs through that provider's network. An integration requires API credentials from the TRP to establish connectivity. A single customer can have multiple integrations with different partners to support various compliance networks. These endpoints handle the full lifecycle of partner connections, including creation, credential management, connectivity testing, and disconnection.

#### Create a Legal Entity Integration

Creates a new TRSupport integration that associates a legal entity with a specific TRP partner. This endpoint initializes the integration record but does not yet establish connectivity with the partner's API. After creation, you must use the `connectLegalEntityIntegration` endpoint to provide API credentials. The `partnerIdent` parameter identifies which TRP to integrate with (e.g., "Sumsub"). You can retrieve available partners using the `getPartners` endpoint. Each integration is assigned a unique `customerIntegrationId` used in subsequent API calls for TRM operations.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration
```

**Request Body:**

```typescript theme={"system"}
{
  customerId: string;     // Required - UUID of the legal entity
  partnerIdent: string;   // Required - Partner identifier (e.g., "notabene")
}
```

**Response (201):**

```typescript theme={"system"}
{
  customerIntegrationId: string;
  apiKey: string;              // Partially censored (e.g., "abc****xyz")
  secret: string;              // Censored (e.g., "***")
  createDate: Date;
  lastUpdate: Date;
  partner: {
    ident: string;
    name: string;
    description: string;
    baseUrl: string;
    active: boolean;
    isTest: boolean;
  };
  customer: {
    id: string;
    shortName: string;
    // ... other customer fields
  };
}
```

**SDK Example:**

```typescript theme={"system"}
const customerId = "12345678-1234-1234-1234-123456789abc";
const partnerIdent = "<partner ident>";

const { data: integration } = await fireblocks.trLink.createTRLinkIntegration({
  customerId: customerId,
  partnerIdent: partnerIdent
});

console.log(`Integration created with ID: ${integration.customerIntegrationId}`);
console.log(`Partner: ${integration.partner.name}`);
```

#### Connect a Legal Entity Integration

Establishes active connectivity to the TRP by supplying API credentials. This endpoint stores the API key and optional secret provided by the TRP, enabling the integration to authenticate and communicate with the partner's API. After connecting, the integration can be used for travel rule operations such as creating TRMs and querying VASPs. The credentials are securely stored and partially censored in API responses. Use the `testTRLinkIntegrationConnection` endpoint after connecting to verify that the credentials are valid and the integration is functioning properly.

**Endpoint:**

```http theme={"system"}
PUT /v1/screening/trlink/customers/integration/:customerIntegrationId
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Request Body:**

```typescript theme={"system"}
{
  apiKey: string;      // Required - API key from the travel rule provider
  secret?: string;     // Optional - API secret from the travel rule provider
}
```

**Response (200):**

```typescript theme={"system"}
{
  customerIntegrationId: string;
  apiKey: string;              // Partially censored (e.g., "abc****xyz")
  secret: string;              // Censored (e.g., "***")
  createDate: Date;
  lastUpdate: Date;
  partner: {
    ident: string;
    name: string;
    description: string;
    baseUrl: string;
    active: boolean;
    isTest: boolean;
  };
  customer: {
    id: string;
    shortName: string;
    // ... other customer fields
  };
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

const { data: connectedIntegration } = await fireblocks.trLink.connectTRLinkIntegration(
  customerIntegrationId,
  {
    apiKey: "trp-api-key-12345",
    secret: "trp-secret-67890"
  }
);

console.log(`Integration connected: ${connectedIntegration.customerIntegrationId}`);
console.log(`Partner: ${connectedIntegration.partner.name}`);
```

#### Get a Legal Entity Integration

Retrieves detailed information about a specific legal entity integration, including its connection status, associated partner details, and legal entity information. The response includes partially censored API credentials for security. This endpoint is useful for displaying integration details in administrative interfaces or verifying integration configuration before performing travel rule operations. Both the legal entity ID and integration ID are required as path parameters for additional security validation.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/:customerId/integrations/:customerIntegrationId
```

**Path Parameters:**

* `customerId` (string, UUID) - The legal entity ID
* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Response (200):**

```typescript theme={"system"}
{
  customerIntegrationId: string;
  apiKey: string;              // Partially censored (e.g., "abc****xyz")
  secret: string;              // Censored (e.g., "***")
  createDate: Date;
  lastUpdate: Date;
  partner: {
    ident: string;
    name: string;
    description: string;
    baseUrl: string;
    active: boolean;
    isTest: boolean;
  };
  customer: {
    id: string;
    shortName: string;
    // ... other customer fields
  };
}
```

**SDK Example:**

```typescript theme={"system"}
const customerId = "12345678-1234-1234-1234-123456789abc";
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

const { data: integration } = await fireblocks.trLink.getTRLinkCustomerIntegrationById(
  customerId,
  customerIntegrationId
);

console.log(`Integration: ${integration.customerIntegrationId}`);
console.log(`Partner: ${integration.partner.name}`);
```

#### Get Legal Entity Integrations

Retrieves all TRP integrations configured for a specific legal entity. This endpoint returns a complete list of TRP connections, including their status, partner details, and configuration. Use this to display all available TRP connections for a legal entity or to select which integration to use for a specific transaction. Legal entities may have multiple integrations to support different compliance networks or redundant provider setups.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/:customerId/integrations
```

**Path Parameters:**

* `customerId` (string, UUID) - The legal entity ID

**Response (200):** Array of legal entity integrations (same structure as Create legal entity integration response)

**SDK Example:**

```typescript theme={"system"}
const customerId = "12345678-1234-1234-1234-123456789abc";

const { data: integrations } = await fireblocks.trLink.getTRLinkCustomerIntegrations(customerId);

integrations.forEach(integration => {
  console.log(`Integration: ${integration.partner.name} (${integration.customerIntegrationId})`);
});
```

#### Disconnect a Legal Entity Integration

Disconnects and permanently removes a legal entity's integration with a TRP. This endpoint deletes the stored API credentials and removes the integration record. After disconnection, the integration can not be used for travel rule operations. Any pending TRMs may fail or become inaccessible. This is typically used when migrating to a different TRP, cleaning up unused integrations, or when API credentials are compromised and need to be fully removed before reconnecting with new credentials.

**Endpoint:**

```sql theme={"system"}
DELETE /v1/screening/trlink/customers/integration/:customerIntegrationId
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Response (204):** No content

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

await fireblocks.trLink.disconnectTRLinkIntegration(customerIntegrationId);

console.log('Integration disconnected successfully');
```

#### Test Connection

Validates that a legal entity integration can successfully communicate with the TRP's API. This endpoint makes a test call to the TRP using the stored API credentials to verify authentication and connectivity. It returns a success indicator along with any error messages if the connection fails. This is essential after connecting or updating integration credentials to ensure the setup is correct before attempting actual travel rule operations. Regular connection testing can also be used to monitor integration health.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/test_connection
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Response (200):**

```typescript theme={"system"}
{
  success: boolean;
  message?: string;          // Error message if connection failed
  timestamp: string;         // ISO timestamp
  partnerIdent?: string;
  partnerName?: string;
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

const { data: result } = await fireblocks.trLink.testTRLinkIntegrationConnection(customerIntegrationId);

if (result.success) {
  console.log(`Connection successful to ${result.partnerName} at ${result.timestamp}`);
} else {
  console.error(`Connection failed: ${result.message}`);
}
```

### Travel Rule Operations

Travel rule operations manage the core compliance workflows for creating, managing, and tracking TRMs. These endpoints assess whether transactions require travel rule compliance based on thresholds and counterparty VASP identification, create and transmit TRMs containing encrypted IVMS101 customer data, and manage TRM lifecycle states, including cancellation and redirection. The operations support both outbound transactions (where you create the TRM before the blockchain transaction) and inbound transactions (where you create the TRM after receiving funds and reference an existing Fireblocks transaction).

#### Assess a Travel Rule Requirement

Determines whether a specific transaction requires travel rule compliance based on regulatory thresholds, transaction amounts, and counterparty VASP identification. This endpoint evaluates the transaction against the partner's configured travel rule policies and jurisdictional requirements. It returns a decision of `"REQUIRED"`, `"NOT_REQUIRED"`, or `"NEED_MORE_INFO"` along with an explanation.

When required, it also provides a list of mandatory IVMS101 fields that must be populated in the TRM. Use this endpoint before creating a TRM to verify compliance requirements and understand what legal entity data needs to be collected. For outbound transactions, provide transaction details explicitly. For inbound transactions, you can reference an existing Fireblocks `txId` to auto-populate transaction data.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/trm/assess
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Request Body:**

```typescript theme={"system"}
{
  txId?: string;                        // Fireblocks transaction ID (recommended for inbound)
  amount?: string;                      // Required if txId not provided
  amountUSD?: string;                   // Amount in USD
  destination?: {                       // Required if txId not provided
    type: string;                       // "ONE_TIME_ADDRESS" for outbound, "VAULT_ACCOUNT" for inbound
    id?: string;                        // Required for VAULT_ACCOUNT
    oneTimeAddress?: {
      address: string;
      tag?: string;
    };
  };
  destAddress?: string;                 // Destination address
  destTag?: string;                     // Destination tag
  source?: {                            // 
    type: string;                       // "VAULT_ACCOUNT" for outbound, "UNKNOWN" for inbound
    id?: string;                        // Required for VAULT_ACCOUNT
  };
  srcAddress?: string;                  // Source address
  assetId?: string;                     // Required if txId not provided (e.g., "ETH", "BTC")
  direction?: string;                   // "inbound" or "outbound"
  txHash?: string;                      // Blockchain transaction hash
  originatorVaspId?: string;            // Required for inbound transactions
  beneficiaryVaspId?: string;           // Required for outbound transactions
}
```

**Response (200):**

```typescript theme={"system"}
{
  decision: string;                     // "REQUIRED", "NOT_REQUIRED", or "NEED_MORE_INFO"
  reason: string;                       // Explanation of the decision
  requiredFields?: string[];            // List of required IVMS fields if travel rule is required
  missingInfo?: string[];               // List of missing fields if more info is needed
  thresholds?: {
    amount?: string;
    currency?: string;
  };
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

// Example 1: Assess for outbound transaction (before Fireblocks transaction)
const { data: assessment1 } = await fireblocks.trLink.assessTRLinkTravelRuleRequirement(
  customerIntegrationId,
  {
    amount: "1500",
    assetId: "ETH",
    direction: "outbound",
    source: {
      type: "VAULT_ACCOUNT",
      id: "0"
    },
    destination: {
      type: "ONE_TIME_ADDRESS",
      oneTimeAddress: {
        address: "0xabcdef1234567890abcdef1234567890abcdef12"
      }
    },
    beneficiaryVaspId: "beneficiary-vasp-456"
  }
);

if (assessment1.decision === "REQUIRED") {
  console.log(`Travel rule is required: ${assessment1.reason}`);
  console.log(`Required fields: ${assessment1.requiredFields.join(', ')}`);
} else {
  console.log(`Travel rule not required: ${assessment1.reason}`);
}

// Example 2: Assess for existing Fireblocks transaction (inbound)
const { data: assessment2 } = await fireblocks.trLink.assessTRLinkTravelRuleRequirement(
  customerIntegrationId,
  {
    txId: "12345678-1234-1234-1234-123456789abc",
    originatorVaspId: "originator-vasp-123"
  }
);

console.log(`Decision: ${assessment2.decision}`);
```

#### Create a TRM

Creates and submits a new TRM to the partner TRP containing IVMS101-compliant legal entity data for a cryptocurrency transaction. The TRM includes encrypted originator and beneficiary information, transaction details, and wallet addresses.

For outbound transactions, create the TRM before executing the blockchain transaction to ensure compliance is in place before funds move.

For inbound transactions, create the TRM after receiving the transaction and reference the existing Fireblocks `txId`.

The IVMS data must be encrypted using the partner's public key (retrieved via the `getPublicKey` endpoint). The endpoint returns a TRM ID that can be used to track the message status and should be associated with the Fireblocks transaction using the set transaction travel rule message ID endpoint.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/trm
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Request Body:**

```typescript theme={"system"}
{
  assetId?: string;                     // Required if txId not provided (e.g., "ETH", "BTC")
  amount?: string;                      // Required if txId not provided
  amountUSD?: string;                   // Optional - Force specific USD value
  source?: {                            // Required if txId not provided
    type: string;                       // "VAULT_ACCOUNT" for outbound, "UNKNOWN" for inbound
    id?: string;                        // Required for VAULT_ACCOUNT
  };
  srcAddress?: string;                  // Optional
  destination?: {                       // Required for single-destination transactions
    type: string;                       // "ONE_TIME_ADDRESS" for outbound, "VAULT_ACCOUNT" for inbound
    id?: string;                        // Required for VAULT_ACCOUNT
    oneTimeAddress?: {
      address: string;
      tag?: string;
    };
  };
  destAddress?: string;                 // Optional
  destTag?: string;                     // Optional
  txId?: string;                        // Optional - Fireblocks transaction ID (recommended for inbound)
  txHash?: string;                      // Optional - Blockchain transaction hash
  direction?: string;                   // Optional - "inbound" or "outbound"
  originatorVaspId?: string;            // Required for inbound transactions
  beneficiaryVaspId?: string;           // Required for outbound transactions
  ivms: {                               // Required - IVMS101 data
    version: string;                    // e.g., "IVMS101.2023"
    data: string;                       // Base64 encoded encrypted IVMS101 data
    filledFields: string[];             // Array of filled field paths
  };
}
```

**Response (201):**

```typescript theme={"system"}
{
  id: string;                           // TRM message ID
  version?: string;
  status?: string;                      // "PENDING", "ACCEPTED", "REJECTED"
  reason?: string;
  externalId: string;                   // Fireblocks transaction ID
  asset: {
    format: string;
    data: string;
  };
  amount: string;
  fiatValue?: {
    amount: string;
    currency: string;
  };
  direction: string;                    // "in" or "out"
  originatorVaspId?: string;
  beneficiaryVaspId?: string;
  txnInfo: {
    originatorWalletAddress: string;
    beneficiaryWalletAddress: string;
    txHash: string;
  };
  ivms101: {
    version: string;
    data: string;
    filledFields: string[];
  };
  providerData?: {
    provider?: string;
    data?: any;
  };
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

// Example 1: Create TRM for outbound transaction (before Fireblocks transaction)
const { data: trm1 } = await fireblocks.trLink.createTRLinkTrm(
  customerIntegrationId,
  {
    amount: "1500",
    assetId: "ETH",
    direction: "outbound",
    source: {
      type: "VAULT_ACCOUNT",
      id: "0"
    },
    destination: {
      type: "ONE_TIME_ADDRESS",
      oneTimeAddress: {
        address: "0xabcdef1234567890abcdef1234567890abcdef12"
      }
    },
    beneficiaryVaspId: "beneficiary-vasp-456",
    ivms: {
      version: "IVMS101.2023",
      data: "aGVsbG8gd29ybGQgdGhpcyBpcyBlbmNyeXB0ZWQgZGF0YQ==",
      filledFields: [
        "Beneficiary.beneficiaryPersons[].legalPerson.name.nameIdentifier",
        "Originator.originatorPersons[].legalPerson.name.nameIdentifier"
      ]
    }
  }
);

console.log(`TRM created with ID: ${trm1.id}`);
console.log(`Status: ${trm1.status}`);

// Example 2: Create TRM for existing Fireblocks transaction (inbound)
const { data: trm2 } = await fireblocks.trLink.createTRLinkTrm(
  customerIntegrationId,
  {
    txId: "12345678-1234-1234-1234-123456789abc",
    originatorVaspId: "originator-vasp-123",
    ivms: {
      version: "IVMS101.2023",
      data: "aGVsbG8gd29ybGQgdGhpcyBpcyBlbmNyeXB0ZWQgZGF0YQ==",
      filledFields: [
        "Beneficiary.beneficiaryPersons[].naturalPerson.name.nameIdentifier",
        "Originator.originatorPersons[].naturalPerson.name.nameIdentifier"
      ]
    }
  }
);

console.log(`TRM created with ID: ${trm2.id}`);
```

#### Get a TRM

Retrieves the current state and details of a specific TRM from the TRP. This endpoint fetches real-time information directly from the partner's API, including the message status (`PENDING`, `ACCEPTED`, `REJECTED`), encrypted IVMS data, transaction details, and any status reasons. Use this to monitor TRM progress, check for counterparty acceptance, or retrieve message details for audit purposes. The response includes both the original submitted data and any updated fields from the partner network.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/trm/:trmId
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `trmId` (string) - The TRM message ID

**Response (200):** Same as Create Travel Rule Message response

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const messageId = "trm-12345678-1234-1234-1234-123456789abc";

const { data: trm } = await fireblocks.trLink.getTRLinkTrmById(
  customerIntegrationId,
  messageId
);

console.log(`TRM ID: ${trm.id}`);
console.log(`Status: ${trm.status}`);
console.log(`Direction: ${trm.direction}`);
console.log(`Amount: ${trm.amount} (${trm.fiatValue?.amount} ${trm.fiatValue?.currency})`);
```

#### Cancel a TRM

Cancels a previously submitted TRM and notifies the counterparty VASP of the cancellation. This endpoint should be used when a transaction is aborted, reversed, or when incorrect information was submitted and needs to be resent. The cancellation reason is transmitted to the counterparty to explain why the TRM is being cancelled. Once cancelled, the TRM cannot be reused, and a new TRM must be created if the transaction proceeds. This returns an asynchronous 202 status as the cancellation is communicated through the TRP network.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/trm/:trmId/cancel
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `trmId` (string) - The TRM message ID

**Request Body:**

```typescript theme={"system"}
{
  reason?: string;          // Optional - Cancellation reason
  cancelledBy?: string;     // Optional - User ID who cancelled
}
```

**Response (202):** Same as Create travel rule message response

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const messageId = "trm-12345678-1234-1234-1234-123456789abc";

const { data: result } = await fireblocks.trLink.cancelTRLinkTrm(
  customerIntegrationId,
  messageId,
  {
    reason: "Transaction cancelled by user",
    cancelledBy: "user-123"
  }
);

console.log(`TRM cancelled: ${result.id}`);
console.log(`Status: ${result.status}`);
```

#### Redirect a TRM

Redirects an existing TRM to a subsidiary or nested VASP within a parent VASP's organization. This functionality is used in nested VASP scenarios where a parent VASP operates multiple subsidiary entities and needs to route the TRM to the specific subsidiary managing the legal entity relationship. The partner must support nested VASP capabilities for this endpoint to function. The TRM is redirected with its existing data to the specified `subsidiaryVaspId`. This returns an asynchronous 202 status as the redirection is processed through the TRP network.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/trm/:trmId/redirect
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `trmId` (string) - The TRM message ID

**Request Body:**

```typescript theme={"system"}
{
  subsidiaryVaspId: string;     // Required - ID of the subsidiary VASP
}
```

**Response (202):** Same as Create travel rule message response

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const messageId = "trm-12345678-1234-1234-1234-123456789abc";

const { data: result } = await fireblocks.trLink.redirectTRLinkTrm(
  customerIntegrationId,
  messageId,
  {
    subsidiaryVaspId: "subsidiary-vasp-789"
  }
);

console.log(`TRM redirected: ${result.id}`);
console.log(`New beneficiary VASP: ${result.beneficiaryVaspId}`);
```

#### Get Required Actions

Retrieves the list of actions required to process a TRM that is in `PENDING` status. A TRM may enter PENDING when additional information is needed — for example, missing beneficiary PII data or a manual compliance review. This endpoint returns one or more required actions, each with a type, description, and action-specific data such as the list of required IVMS101 fields.

Use this endpoint after receiving a `TRLink.RequiredActions` webhook notification, or poll it to check the current state of a PENDING TRM. The same endpoint serves both automated systems and manual review workflows.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/trm/:trmId/required_actions
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `trmId` (string) - The TRM message ID

**Response (200):**

```typescript theme={"system"}
{
  actions: Array<{
    type: string;                         // "UPLOAD_BENEFICIARY_PII" or "MANUAL_REVIEW"
    description?: string;                 // Human-readable description of what's needed
    data?: {                              // Action-specific data
      beneficiaryRequiredFields?: string[]; // Required IVMS101 fields for PII upload
    };
  }>;
}
```

**Action Types:**

| Action Type              | Description                                                     | Required Data                                    |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------ |
| `UPLOAD_BENEFICIARY_PII` | Client must provide beneficiary PII in encrypted IVMS101 format | `data.beneficiaryPii.ivms101` via Resolve Action |
| `MANUAL_REVIEW`          | Requires manual compliance review at the TRP                    | Varies (may be empty)                            |

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const trmId = "trm-12345678-1234-1234-1234-123456789abc";

const { data: requiredActions } = await fireblocks.trLink.getTRLinkTrmRequiredActions(
  customerIntegrationId,
  trmId
);

console.log(`${requiredActions.actions.length} action(s) required:`);

requiredActions.actions.forEach(action => {
  console.log(`  Type: ${action.type}`);
  console.log(`  Description: ${action.description}`);

  if (action.type === "UPLOAD_BENEFICIARY_PII" && action.data?.beneficiaryRequiredFields) {
    console.log(`  Required fields:`);
    action.data.beneficiaryRequiredFields.forEach(field => {
      console.log(`    - ${field}`);
    });
  }
});
```

#### Resolve Action

Resolves a single required action on a PENDING TRM by submitting the requested data. For example, when the required action is `UPLOAD_BENEFICIARY_PII`, this endpoint accepts encrypted IVMS101 data containing the beneficiary's personally identifiable information.

The TRP processes the action synchronously and returns the updated TRM. If the action resolves the last pending requirement, the TRM status will change from PENDING to the next state (e.g., ACCEPTED). If multiple actions are required, call this endpoint once for each action — it resolves one action at a time.

After resolving an action, call `getRequiredActions` to check if additional actions remain.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/trm/:trmId/resolve_action
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `trmId` (string) - The TRM message ID

**Request Body:**

```typescript theme={"system"}
{
  type: string;                           // Required - Action type to resolve (must match one from getRequiredActions)
  data?: {                                // Action-specific data
    beneficiaryPii?: {                    // Required for UPLOAD_BENEFICIARY_PII
      ivms101: {
        version: string;                  // e.g., "IVMS101.2023"
        data: string;                     // Base64-encoded encrypted PII data
        filledFields: string[];           // List of IVMS101 fields included
      };
    };
  };
}
```

**Response (200):** Same as Create travel rule message response (returns the updated TRM).

<Note>
  The TRP also pushes the updated TRM via webhook to Fireblocks after processing. The synchronous response lets you see the immediate result, while the webhook ensures the screening pipeline is updated.
</Note>

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const trmId = "trm-12345678-1234-1234-1234-123456789abc";

// Step 1: Get required actions
const { data: requiredActions } = await fireblocks.trLink.getTRLinkTrmRequiredActions(
  customerIntegrationId,
  trmId
);

const piiAction = requiredActions.actions.find(a => a.type === "UPLOAD_BENEFICIARY_PII");

if (piiAction) {
  // Step 2: Get public key for encryption
  const { data: { publicKey } } = await fireblocks.trLink.getTRLinkIntegrationPublicKey(
    customerIntegrationId
  );

  // Step 3: Encrypt beneficiary IVMS data (using your encryption implementation)
  const ivms = await encryptIVMSData(beneficiaryData, publicKey);

  // Step 4: Resolve the action
  const { data: updatedTrm } = await fireblocks.trLink.resolveActionTRLinkTrm(
    customerIntegrationId,
    trmId,
    {
      type: "UPLOAD_BENEFICIARY_PII",
      data: {
        beneficiaryPii: {
          ivms101: ivms
        }
      }
    }
  );

  console.log(`TRM updated - ID: ${updatedTrm.id}`);
  console.log(`New status: ${updatedTrm.status}`);

  // Step 5: Check if more actions are required
  const { data: remaining } = await fireblocks.trLink.getTRLinkTrmRequiredActions(
    customerIntegrationId,
    trmId
  );

  if (remaining.actions.length === 0) {
    console.log("All actions resolved.");
  } else {
    console.log(`${remaining.actions.length} more action(s) still required.`);
  }
}
```

#### Webhook: TRLink.RequiredActions

When a TRM enters PENDING status with required actions, Fireblocks sends a compliance webhook notification to the client.

**Event ID:** `Screening_TRLinkRequiredActions`

**Payload:**

```typescript theme={"system"}
{
  trmId: string;                          // TRM identifier
  customerIntegrationId: string;          // Integration to call endpoints with
  destinationScreeningId: string;         // Destination identifier (for deduplication)
  requiredActions: Array<{                // List of required actions
    type: string;
    description: string;
    data?: object;
  }>;
  screeningMessage: string;               // "Travel Rule message requires additional actions"
  messageType: string;                    // "TRLink.RequiredActions"
}
```

This notification is sent once per destination (deduplicated). Upon receiving it:

1. Optionally call `getRequiredActions` to refresh the current state
2. Collect the required data (e.g., encrypt beneficiary PII)
3. Call `resolveAction` for each required action

### TRM Operations

TRM operations manage the association between Fireblocks transactions and TRMs created with partner TRPs. These endpoints link TRM identifiers to transactions and specific destinations, enabling tracking and audit trails that connect blockchain transactions to their compliance data.

The operations support both transaction-level linking (for simple single-destination transactions) and destination-level linking (for multi-destination transactions where each output may have its own TRM). These associations are critical for maintaining compliance records and enabling automated monitoring of transaction vs. TRM status.

#### Set Transaction TRM ID

Associates a TRM ID with a Fireblocks transaction. This creates a link between the TRM and the transaction record, enabling compliance tracking and audit trails. For single-destination transactions, this single association is typically sufficient. The endpoint accepts the TRM ID as a string or null to clear an existing association. This should be called after creating a TRM to establish the compliance record link. The association enables the Fireblocks platform to display TRM status alongside transaction details and enforce any configured compliance policies.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/transaction/:txId/travel_rule_message_id
```

**Path Parameters:**

* `txId` (string, UUID) - The Fireblocks transaction ID

**Request Body:**

```typescript theme={"system"}
{
  travelRuleMessageId: string | null;   // TRM ID or null to clear
}
```

**Response (200):**

```typescript theme={"system"}
{
  success: boolean;
}
```

**SDK Example:**

```typescript theme={"system"}
const txId = "12345678-1234-1234-1234-123456789abc";
const trmId = "trm-12345678-1234-1234-1234-123456789abc";

// Set TRM ID
const result1 = await fireblocks.trLink.setTRLinkTransactionTravelRuleMessageId(
  txId,
  {
    travelRuleMessageId: trmId
  }
);

console.log(`TRM ID set: ${result1.success}`);

// Clear TRM ID
const result2 = await fireblocks.trLink.setTRLinkTransactionTravelRuleMessageId(
  txId,
  {
    travelRuleMessageId: null
  }
);

console.log(`TRM ID cleared: ${result2.success}`);
```

#### Set Destination TRM ID

Associates a TRM ID with specific destinations in a multi-destination Fireblocks transaction. This endpoint supports two matching methods:

1. **Direct lookup** (recommended): Use the `destinationScreeningId` from a webhook notification (`TRLink.NoTRMessage` or `TRLink.RequiredActions`) for a direct, reliable match.
2. **Attribute matching** (legacy): Match destinations by amount and destination criteria (type, address).

For batch transactions sent to multiple counterparties, each destination may require a separate TRM. The endpoint returns a success status along with counts of successfully and unsuccessfully updated destinations, enabling error handling for partial failures. Set the TRM ID to null to clear an existing destination association.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/transaction/:txId/destination/travel_rule_message_id
```

**Path Parameters:**

* `txId` (string, UUID) - The Fireblocks transaction ID

**Request Body (Option 1 — Direct Lookup via destinationScreeningId):**

```typescript theme={"system"}
{
  destinationScreeningId: string;       // From webhook notification - direct lookup
  travelRuleMessageId: string | null;   // TRM ID or null to clear
}
```

**Request Body (Option 2 — Attribute Matching):**

```typescript theme={"system"}
{
  amount: string;                       // Required - Destination amount to match
  destination: {                        // Required - Destination criteria to match
    type?: string;                      // e.g., "ONE_TIME_ADDRESS"
    id?: string;
    subType?: string;
    address?: string;
  };
  travelRuleMessageId: string | null;   // TRM ID or null to clear
}
```

When `destinationScreeningId` is provided, `amount` and `destination` are not required. The `destinationScreeningId` is a unique identifier for the destination screening record, available in webhook notifications.

**Response (200):**

```typescript theme={"system"}
{
  success: boolean;
  updatedDestinations: number;          // Number of successfully updated destinations
  failedDestinations: number;           // Number of failed updates
  errors?: string[];                    // Error messages if any failed
}
```

**SDK Example:**

```typescript theme={"system"}
const txId = "12345678-1234-1234-1234-123456789abc";
const trmId = "trm-12345678-1234-1234-1234-123456789abc";

// Option 1: Direct lookup using destinationScreeningId (recommended)
// The destinationScreeningId comes from webhook notifications
const { data: result1 } = await fireblocks.trLink.setTRLinkDestinationTravelRuleMessageId(
  txId,
  {
    destinationScreeningId: "dest-screening-id-from-webhook",
    travelRuleMessageId: trmId
  }
);

console.log(`Updated ${result1.updatedDestinations} destination(s)`);

// Option 2: Attribute matching (legacy, still supported)
const { data: result2 } = await fireblocks.trLink.setTRLinkDestinationTravelRuleMessageId(
  txId,
  {
    amount: "1500",
    destination: {
      type: "ONE_TIME_ADDRESS",
      address: "0xabcdef1234567890abcdef1234567890abcdef12"
    },
    travelRuleMessageId: trmId
  }
);

if (result2.success) {
  console.log(`Updated ${result2.updatedDestinations} destination(s)`);
} else {
  console.error(`Failed to update ${result2.failedDestinations} destination(s)`);
  console.error(`Errors: ${result2.errors?.join(', ')}`);
}
```

#### Manual Decision for Missing TRM

Allows clients to manually ACCEPT or REJECT a transaction when its destinations are waiting for a Travel Rule Message (Missing TRM state), instead of waiting for the automatic policy timeout or TRM arrival. This is useful when clients have internal compliance data (KYC status, risk scores) that allows them to make an immediate decision.

The decision applies to **all destinations currently in Missing TRM state** for the given transaction. Destinations in other states (Screen, Postscreen, Completed) are not affected and will be skipped. If no destinations are in Missing TRM state, the endpoint returns a 400 error.

Manual decisions are recorded with `source: "manual"` in the screening result, distinguishing them from automatic policy-based decisions.

**Endpoint:**

```http theme={"system"}
POST /v1/screening/trlink/customers/integration/:customerIntegrationId/transactions/:txId/manual_decision
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `txId` (string, UUID) - The Fireblocks transaction ID

**Request Body:**

```typescript theme={"system"}
{
  action: string;                         // Required - "ACCEPT" or "REJECT"
  reason?: string;                        // Optional - Reason for audit trail (max 500 characters)
}
```

**Response (200):**

```typescript theme={"system"}
{
  action: string;                         // The action that was applied
  source: string;                         // Always "manual"
  txId: string;                           // Transaction ID
  destinationsAffected: number;           // Count of destinations where decision was applied
  destinationsSkipped: number;            // Count of destinations skipped
  details: Array<{
    destinationScreeningId: string;       // Destination identifier
    applied: boolean;                     // Whether the decision was applied to this destination
    skipReason?: string;                  // Reason if the destination was skipped
  }>;
}
```

**Override behavior:**

* If the same action is sent again for a destination already carrying that decision, the destination is skipped (idempotent).
* A different action overwrites the previous decision (last call wins).
* Once a destination has moved past the Missing TRM state, the decision cannot be changed.

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const txId = "12345678-1234-1234-1234-123456789abc";

// Accept a transaction — e.g., beneficiary verified via internal KYC
const { data: result } = await fireblocks.trLink.createTRLinkManualDecision(
  customerIntegrationId,
  txId,
  {
    action: "ACCEPT",
    reason: "Beneficiary verified via internal KYC - known counterparty"
  }
);

console.log(`Action: ${result.action}`);           // "ACCEPT"
console.log(`Source: ${result.source}`);            // "manual"
console.log(`Destinations affected: ${result.destinationsAffected}`);
console.log(`Destinations skipped: ${result.destinationsSkipped}`);

result.details.forEach(dest => {
  console.log(`  ${dest.destinationScreeningId}: ${dest.applied ? "applied" : "skipped"}`);
  if (dest.skipReason) {
    console.log(`    Reason: ${dest.skipReason}`);
  }
});
```

**Webhook-driven example:**

```typescript theme={"system"}
// Listen for TRLink.NoTRMessage webhook, then decide based on internal data
app.post("/webhooks/compliance", async (req, res) => {
  const event = req.body;

  if (event.data?.messageType === "TRLink.NoTRMessage") {
    const { txId } = event.data;

    // Check internal KYC/risk system
    const internalDecision = await checkInternalCompliance(event.data.destAddress);

    const { data: result } = await fireblocks.trLink.createTRLinkManualDecision(
      customerIntegrationId,
      txId,
      {
        action: internalDecision.approved ? "ACCEPT" : "REJECT",
        reason: internalDecision.reason
      }
    );

    console.log(`${result.action}: ${result.destinationsAffected} destination(s)`);
  }

  res.sendStatus(200);
});
```

#### Get a Public Key for PII Encryption

<Note>
  **Note:**

  This endpoint applies to Sumsub integrations. GTR integrations configure public keys in GTR Dashboard. See the GTR Encryption section for details.
</Note>

Retrieves the TRP's public encryption key in JSON Web Key (JWK) format. This key must be used to encrypt IVMS101 data containing personally identifiable information (PII) before submitting TRMs. The encryption ensures that sensitive legal entity data is protected in transit and at rest, with only the partner and counterparty VASP able to decrypt it. Always fetch the current public key before encrypting IVMS data, as keys may rotate periodically. The response includes the key type (RSA), key ID (`kid`), and the public key components (modulus and exponent) needed for encryption operations.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/public_key
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Response (200):**

```typescript theme={"system"}
{
  issuer: string;
  publicKey: {
    kty: string;              // "RSA"
    e: string;                // Public exponent
    use: string;              // "enc"
    kid: string;              // Key ID
    n: string;                // Modulus
  };
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

const { data: { publicKey, issuer } } = await fireblocks.trLink.getTRLinkIntegrationPublicKey(customerIntegrationId);

console.log(`Issuer: ${issuer}`);
console.log(`Key ID: ${publicKey.kid}`);
console.log(`Key type: ${publicKey.kty}`);

// Use the public key to encrypt IVMS data
const encryptedData = encryptIVMSData(ivmsData, keyResponse.publicKey);
```

### VASP Operations

VASP (Virtual Asset Service Provider) operations provide access to the partner's VASP directory to discover and identify counterparties in TRM exchanges. These endpoints query the TRP's address book of registered VASPs, retrieving information about VASP identities, geographic locations, national identifiers, and public keys. This information is essential for determining whether a destination address requires travel rule compliance, obtaining VASP IDs for TRM creation, and validating counterparty information before sending TRMs.

#### List VASPs

Retrieves a paginated list of Virtual Asset Service Providers (VASPs) registered in the partner's network. This endpoint returns the partner's VASP directory containing all counterparties available for TRM exchanges. Each VASP entry includes identification details, legal names, national identifiers, and geographic addresses. Use pagination parameters to handle large VASP directories. This is useful for building VASP selection interfaces, implementing VASP search functionality, or syncing the partner's VASP directory to local storage for offline access. The `limit` parameter accepts values from 1 to 1000 VASPs per request.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/vasps
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Query Parameters:**

```typescript theme={"system"}
{
  pageSize?: number;    // Optional - Max items per page (1-100, default: 100)
  pageCursor?: string;  // Optional - Pagination cursor from previous response
}

```

**Response (200):**

```typescript theme={"system"}
{
  data: Array<{
    id: string;
    name: string;
    legalName?: string;
    nationalIdentification?: {
      identifier: string;
      type?: string;
      authority?: string;
    };
    geographicAddress?: {
      formattedAddress?: string;
      country?: string;
      streetName?: string;
      buildingNumber?: string;
      city?: string;
      postalCode?: string;
    };
  }>;
  next?: string;                      // Pagination cursor for next page
}

```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

// Get first page of VASPs
const vasps1 = await fireblocks.trLink.listTRLinkVasps(customerIntegrationId, {
  pageSize: 50
});

console.log(`Page 1 VASPs: ${vasps1.data.length}`);
vasps1.data.forEach(vasp => {
  console.log(`VASP: ${vasp.name} (${vasp.id})`);
  if (vasp.geographicAddress?.country) {
    console.log(`  Country: ${vasp.geographicAddress.country}`);
  }
});

// Get next page
if (vasps1.next) {
  const vasps2 = await fireblocks.trLink.listTRLinkVasps(customerIntegrationId, {
    pageSize: 50,
    pageCursor: vasps1.next
  });

  console.log(`Page 2 VASPs: ${vasps2.data.length} VASPs`);
}
```

#### Get VASP by ID

Retrieves complete detailed information about a specific VASP by its unique identifier. This endpoint returns more comprehensive data than the list endpoint, including the VASP's public key if available. The TRP uses the public key for encrypted communication with that VASP. Use this endpoint when you have a VASP ID (e.g., from VASP attribution or address ownership verification) and need to retrieve full details about the counterparty, verify their identity information, or obtain their public key for secure messaging. This is particularly useful before creating TRMs to verify counterparty details.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/vasps/:vaspId
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `vaspId` (string) - The VASP ID

**Response (200):**

```typescript theme={"system"}
{
  id: string;
  name: string;
  legalName?: string;
  nationalIdentification?: {
    identifier: string;
    type?: string;
    authority?: string;
  };
  geographicAddress?: {
    formattedAddress?: string;
    country?: string;
    streetName?: string;
    buildingNumber?: string;
    city?: string;
    postalCode?: string;
  };
  publicKey?: string;       // VASP's public key
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";
const vaspId = "beneficiary-vasp-456";

const { data: vasp } = await fireblocks.trLink.getTRLinkVaspById(customerIntegrationId, vaspId);

console.log(`VASP Name: ${vasp.name}`);
console.log(`Legal Name: ${vasp.legalName}`);
console.log(`Country: ${vasp.geographicAddress?.country}`);
if (vasp.nationalIdentification) {
  console.log(`National ID: ${vasp.nationalIdentification.identifier} (${vasp.nationalIdentification.type})`);
}
if (vasp.publicKey) {
  console.log(`Has public key: Yes`);
}
```

### Asset Operations

Asset operations provide access to the partner's supported cryptocurrency asset catalog and enable verification of asset support for travel rule compliance. These endpoints allow you to discover which blockchain assets and tokens are supported by a specific TRP, retrieve detailed asset information, including naming conventions and network identifiers, and determine whether the partner can handle assets not explicitly listed. This information is critical for validating transaction asset compatibility before creating TRMs and understanding the partner's asset support capabilities.

#### List Supported Assets

Retrieves a paginated list of cryptocurrency assets supported by a specific customer integration's TRP. This endpoint returns the partner's asset catalog containing asset identifiers, names, blockchain networks, and other metadata needed for travel rule messaging. Each asset entry is normalized to the Fireblocks asset format for consistency. The response includes a `partnerCanHandleAnyAsset` flag that indicates whether the partner can process TRMs for assets not explicitly listed in their catalog. Use pagination parameters to handle large asset catalogs. This is useful for validating asset support before creating TRMs, building asset selection interfaces, or syncing the partner's asset catalog for reference.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/assets
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID

**Query Parameters:**

```typescript theme={"system"}
{
  pageSize?: number;    // Optional - Max items per page (1-100, default: 100)
  pageCursor?: string;  // Optional - Pagination cursor from previous response
}

```

**Response (200):**

```typescript theme={"system"}
{
  data: Array<{
    id: string;                       // Fireblocks asset ID (e.g., "ETH", "BTC_TEST")
    name?: string;                    // Asset display name
    type?: string;                    // Asset type (e.g., "BASE_ASSET", "ERC20_TOKEN")
    contractAddress?: string;         // Contract address for tokens
    nativeAsset?: string;             // Native blockchain asset
    decimals?: number;                // Decimal precision
    issuerAddress?: string;           // issuer address (used on SOL, and some other blockchains) 
  }>;
  next?: string;                      // Pagination cursor for next page
  partnerCanHandleAnyAsset: boolean;  // Whether partner supports unlisted assets
  note: string;                       // Support capability note
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

// Get first page of supported assets
const assetsPage1 = await fireblocks.trLink.listTRLinkSupportedAssets(
  customerIntegrationId,
  {
    pageSize: 50
  }
);

console.log(`Partner can handle any asset: ${assetsPage1.partnerCanHandleAnyAsset}`);
console.log(`Note: ${assetsPage1.note}`);
console.log(`\nSupported assets (page 1):`);
assetsPage1.data.forEach(asset => {
  console.log(`- ${asset.id}: ${asset.name} (${asset.type})`);
  if (asset.contractAddress) {
    console.log(`  Contract: ${asset.contractAddress}`);
  }
});

// Get next page if available
if (assetsPage1.next) {
  const assetsPage2 = await fireblocks.trLink.listTRLinkSupportedAssets(
    customerIntegrationId,
    {
      pageSize: 50,
      pageCursor: assetsPage1.next
    }
  );
  console.log(`\nPage 2: ${assetsPage2.data.length} more assets`);
}
```

#### Get a Supported Asset

Retrieves detailed information about a specific cryptocurrency asset's support status and metadata from the TRP. This endpoint validates whether a partner supports a particular asset and returns comprehensive asset details, including the Fireblocks-normalized asset data, the raw partner response, and a support status indicator. The `supported` field will be true if either the asset is explicitly listed in the partner's catalog, or if the partner can handle any asset (`partnerCanHandleAnyAsset=true`). Use this endpoint before creating TRMs to verify that the transaction's asset is supported, retrieve the correct asset identifiers and formats required by the partner, or understand asset-specific requirements for compliance messaging.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/customers/integration/:customerIntegrationId/assets/:assetId
```

**Path Parameters:**

* `customerIntegrationId` (string, UUID) - The legal entity integration ID
* `assetId` (string) - The Fireblocks asset ID (e.g., "ETH", "BTC", "USDC\_ETH")

**Response (200):**

```typescript theme={"system"}
{
  fireblocksAsset: {
    id: string;                       // Fireblocks asset ID
    name?: string;                    // Asset display name
    type?: string;                    // Asset type
    contractAddress?: string;         // Contract address for tokens
    nativeAsset?: string;             // Native blockchain asset
    decimals?: number;                // Decimal precision
    issuerAddress?: string;           // issuer address (used on SOL, and some other blockchains) 
  };
  partnerResponse: {
    // Raw response from partner API with partner-specific format
    // Structure varies by partner
  };
  partnerCanHandleAnyAsset: boolean;  // Whether partner supports unlisted assets
  note: string;                       // Support capability note
  supported: boolean;                 // Whether asset is supported (true if in catalog OR partner handles any asset)
}
```

**SDK Example:**

```typescript theme={"system"}
const customerIntegrationId = "87654321-4321-4321-4321-123456789abc";

// Check if ETH is supported
const { data: ethAsset } = await fireblocks.trLink.getTRLinkSupportedAsset(
  customerIntegrationId,
  "ETH"
);

console.log(`Asset: ${ethAsset.fireblocksAsset.name} (${ethAsset.fireblocksAsset.id})`);
console.log(`Supported: ${ethAsset.supported}`);
console.log(`Partner can handle any asset: ${ethAsset.partnerCanHandleAnyAsset}`);
console.log(`Note: ${ethAsset.note}`);

if (ethAsset.supported) {
  console.log('\nAsset details:');
  console.log(`  Type: ${ethAsset.fireblocksAsset.type}`);
  console.log(`  Decimals: ${ethAsset.fireblocksAsset.decimals}`);
  if (ethAsset.fireblocksAsset.contractAddress) {
    console.log(`  Contract: ${ethAsset.fireblocksAsset.contractAddress}`);
  }

  // Asset is supported, safe to create TRM
  console.log('\nThis asset can be used for travel rule messages.');
} else {
  console.warn('\nWarning: Asset not supported by this partner.');
  console.warn('Choose a different partner or use a supported asset.');
}

// Check a custom token
const { data: customToken } = await fireblocks.trLink.getTRLinkSupportedAsset(
  customerIntegrationId,
  "CUSTOM_TOKEN_ETH"
);

if (customToken.supported) {
  console.log(`\nCustom token ${customToken.fireblocksAsset.id} is supported.`);
} else if (customToken.partnerCanHandleAnyAsset) {
  console.log(`\nCustom token not in catalog, but partner accepts any asset.`);
} else {
  console.log(`\nCustom token not supported by this partner.`);
}
```

### Partner Operations

Partner operations provide access to the catalog of available TRP partners that can be integrated with legal entities. Partners represent different TRP networks, such as Sumsub, each offering varying capabilities, geographic coverage, and supported jurisdictions. These endpoints help discover available partners and their characteristics, enabling informed decisions about which TRP to integrate for specific compliance requirements.

#### Get All Partners

Retrieves the complete catalog of TRP partners available for integration. Each partner entry includes identifying information (`ident`, `name`), a description of their services and network coverage, their API base URL, active status, and whether they're in test or production mode.

Use this endpoint during initial setup to discover available TRPs, present partner selection options to administrators, or filter partners based on environment (test vs. production). The `isTest` field helps distinguish between sandbox/testing partners and production-ready partners. Only active partners should be used for new integrations.

**Endpoint:**

```http theme={"system"}
GET /v1/screening/trlink/partners
```

**Response (200):**

```typescript theme={"system"}
Array<{
  ident: string;
  name: string;
  description: string;
  baseUrl: string;
  active: boolean;
  isTest: boolean;
}>
```

**SDK Example:**

```typescript theme={"system"}
const { data: partners } = await fireblocks.trLink.getTRLinkPartners();

console.log('Available Travel Rule Partners:');
partners.forEach(partner => {
  console.log(`- ${partner.name} (${partner.ident})`);
  console.log(`  Description: ${partner.description}`);
  console.log(`  Active: ${partner.active}`);
  console.log(`  Test Environment: ${partner.isTest}`);
  console.log('');
});

// Filter for production partners
const prodPartners = partners.filter(p => p.active && !p.isTest);
console.log(`Production partners: ${prodPartners.length}`);
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```typescript theme={"system"}
{
  message: string;
  code: number;     // e.g., 2120
}
```

### 401 Unauthorized

Returned when JWT authentication fails or API key is invalid.

### 404 Not Found

Returned when a requested resource (customer, integration, TRM, VASP) is not found.

### 500 Internal Server Error

```typescript theme={"system"}
{
  message: string;
  code: number;     // e.g., 2125
}
```

## Transaction Submission

Submit transactions for TRSupport screening using the standard Fireblocks transaction API:

```javascript theme={"system"}
const transaction = {
    assetId: 'BTC',
    source: {
        type: 'VAULT_ACCOUNT',
        id: '0'
    },
    destination: {
        type: 'ONE_TIME_ADDRESS',
        oneTimeAddress: {
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        }
    },
    amount: '5000',
    note: 'TRSupport screened transaction',
    travelRuleMessageId: 'sumsub:12345'
    // TRSupport will process based on your configured policies
};

const response = await fireblocks.createTransaction(transaction);
```

### Multi-Destination Transactions

For transactions with multiple destinations:

```javascript theme={"system"}
const multiDestTransaction = {
    assetId: 'BTC',
    source: {
        type: 'VAULT_ACCOUNT',
        id: '0'
    },
    destinations: [
        {
            destination: {
                type: 'VAULT_ACCOUNT',
                id: '1'
            },
            amount: '2500',
            travelRuleMessageId: 'sumsub:qwerty'
        },
        {
            destination: {
                type: 'ONE_TIME_ADDRESS',
                oneTimeAddress: {
                    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                }
            },
            amount: '3000',
            travelRuleMessageId: 'sumsub:12345'
        },
    ],
    note: 'Multi-destination TRSupport transaction'
};

const response = await fireblocks.createTransaction(multiDestTransaction);
```

## Result Data Structure

### TRSupport Result Object

TRSupport returns comprehensive screening results:

```typescript theme={"system"}
interface TRSupportResult {
    // Core compliance information
    verdict: 'ACCEPT' | 'REJECT' | 'ALERT' | 'WAIT';
    status: 'completed' | 'pending' | 'bypassed' | 'failed';
    
    // Policy context
    bypassReason?: 'POLICY' | 'UNSUPPORTED_ASSET' | 'UNSUPPORTED_ROUTE';
    appliedPolicies: {
        preScreening?: PolicyRule;
        missingTRM?: PolicyRule;
        postScreening?: PolicyRule;
    };
    
    // Multi-destination intelligence
    trSupportDestinations?: TRSupportDestinationResult[];
    
    // Registration status
    trsupportRegistration?: {
        status: string;
        success: boolean;
        timestamp: number;
    };
    
    // Provider information
    provider?: string;
    trmStatus?: 'ACCEPTED' | 'REJECTED' | 'PENDING' | 'FAILED';
    
    // Metadata
    processingTime: number;
    timestamp: number;
}
```

### Per-Destination Results

For multi-destination transactions:

```typescript theme={"system"}
interface TRSupportDestinationResult {
    destRecordId: string;
    destAddress: string;
    timestamp: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    verdict: 'ACCEPT' | 'REJECT' | 'ALERT' | 'WAIT';
    provider?: string;
    bypassReason?: string;
}
```

## Policy Configuration

### Screening Policy Rules

Configure which transactions require screening:

```typescript theme={"system"}
interface PreScreeningRule {
    // Matching criteria
    customerId?: string;
    direction?: 'inbound' | 'outbound';
    asset?: string;
    amount?: {
        range?: {
            min?: number;
            max?: number;
        };
        currency: 'USD' | 'NATIVE';
    };
    sourceType?: string;
    destType?: string;
    
    // Required action
    action: 'SCREEN' | 'PASS';
}
```

### Missing TRM Policy Rules

Configure timeout behaviors:

```typescript theme={"system"}
interface MissingTRMRule {
    // Matching criteria (same as screening)
    // Plus timing constraints
    validBefore?: number;  // seconds
    validAfter?: number;   // seconds
    
    // Required action
    action: 'WAIT' | 'ACCEPT' | 'REJECT';
}
```

### Post-screening Policy Rules

Configure responses to screening results:

```typescript theme={"system"}
interface PostScreeningRule {
    // Matching criteria (same as screening)
    // Plus TRM status
    trmStatus?: 'ACCEPTED' | 'REJECTED' | 'PENDING' | 'FAILED';
    
    // Timing constraints
    validBefore?: number;
    validAfter?: number;
    
    // Required action
    action: 'ACCEPT' | 'REJECT' | 'ALERT' | 'WAIT';
}
```

## Implementation Patterns

### Pattern 1: Basic Integration

```javascript theme={"system"}
class TRSupportIntegration {
    constructor(fireblocks) {
        this.fireblocks = fireblocks;
    }
    
    async submitTransaction(txData) {
        try {
            // Create transaction - TRSupport policies apply automatically
            const result = await this.fireblocks.createTransaction(txData);
            
            // Check screening result
            if (result.trsupportResult) {
                return this.handleTRSupportResult(result.trsupportResult);
            }
            
            return result;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }
    
    handleTRSupportResult(trsupportResult) {
        switch (trsupportResult.verdict) {
            case 'ACCEPT':
                console.log('Transaction approved');
                break;
            case 'REJECT':
                console.log('Transaction blocked by policy');
                break;
            case 'ALERT':
                console.log('Transaction approved with monitoring');
                this.triggerAlert(trsupportResult);
                break;
            case 'WAIT':
                console.log('Waiting for Travel Rule data');
                this.scheduleRecheck(trsupportResult);
                break;
        }
        return trsupportResult;
    }
}
```

### Pattern 2: Multi-Destination Handling

```javascript theme={"system"}
class MultiDestinationHandler {
    async processMultiDestination(txData) {
        const result = await this.fireblocks.createTransaction(txData);
        
        if (result.trsupportResult?.trSupportDestinations) {
            // Analyze per-destination results
            const destinations = result.trsupportResult.trSupportDestinations;
            
            destinations.forEach(dest => {
                console.log(`Destination ${dest.destAddress}:`);
                console.log(`  Verdict: ${dest.verdict}`);
                console.log(`  Status: ${dest.status}`);
                
                if (dest.bypassReason) {
                    console.log(`  Bypassed: ${dest.bypassReason}`);
                }
            });
            
            // Overall transaction verdict
            console.log(`Transaction verdict: ${result.trsupportResult.verdict}`);
        }
        
        return result;
    }
}
```

### Pattern 3: Monitoring Integration

```javascript theme={"system"}
class TRSupportMonitoring {
    async monitorTransaction(txId) {
        const tx = await this.fireblocks.getTransaction(txId);
        
        if (tx.trsupportResult) {
            // Track metrics
            this.metrics.record({
                verdict: tx.trsupportResult.verdict,
                processingTime: tx.trsupportResult.processingTime,
                provider: tx.trsupportResult.provider,
                policyBypassed: !!tx.trsupportResult.bypassReason
            });
            
            // Monitor registration health
            if (tx.trsupportResult.trsupportRegistration) {
                this.checkProviderHealth(tx.trsupportResult.trsupportRegistration);
            }
        }
        
        return tx;
    }
    
    checkProviderHealth(registration) {
        if (!registration.success) {
            console.warn('Provider registration issue detected');
            // Alert operations team
        }
    }
}
```

## Testing and Validation

### Test Scenarios

#### Policy Bypass Testing

```javascript theme={"system"}
// Test internal transfer bypass
const internalTransfer = {
    source: { type: 'VAULT_ACCOUNT', id: '0' },
    destination: { type: 'VAULT_ACCOUNT', id: '1' },
    amount: '1000',
    assetId: 'BTC'
};
// Should bypass if configured
```

#### Threshold Testing

```javascript theme={"system"}
// Test amount thresholds
const belowThreshold = { amount: '2999', ... };  // Should bypass
const aboveThreshold = { amount: '3001', ... };  // Should screen
```

#### Multi-Destination Testing

```javascript theme={"system"}
// Test worst-result-wins logic
const mixedDestinations = {
    destinations: [
        { /* internal - should accept */ },
        { /* trusted - should accept */ },
        { /* unknown - should reject */ }
    ]
};
// Overall should reject
```

### Using Test Networks

Test with testnet assets:

* `BTC_TEST`
* `ETH_TEST5`
* `XRP_TEST`

## Error Handling

### Common Error Scenarios

```javascript theme={"system"}
class TRSupportErrorHandler {
    handleError(error) {
        if (error.code === 'TRSUPPORT_POLICY_REJECTION') {
            // Transaction blocked by policy
            return { action: 'blocked', reason: error.message };
        }
        
        if (error.code === 'TRSUPPORT_TIMEOUT') {
            // Processing timeout exceeded
            return { action: 'timeout', fallback: 'accept' };
        }
        
        if (error.code === 'PROVIDER_UNAVAILABLE') {
            // Provider connectivity issue
            return { action: 'failover', fallback: 'business_continuity' };
        }
        
        throw error;
    }
}
```

## Performance Considerations

### Processing Times

* **Policy Bypass**: \< 1 second
* **Standard Screening**: 2-10 seconds
* **Multi-Destination**: 30+ seconds
* **Extended Wait**: Hours to days (configurable)

### Optimization Tips

* **Use Bypass Rules**: Configure `PASS` actions for clear exemptions
* **Optimize Rule Order**: Most specific rules first
* **Limit Complex Matching**: Minimize multi-field rules
* **Cache Policy Results**: Store bypass decisions when applicable

## Support Resources

* **API Documentation**: Full API reference at docs.fireblocks.com
* **Policy Examples**: See Help Centre articles for configuration examples
* **Technical Support**: Contact [support@fireblocks.com](mailto:support@fireblocks.com)
* **Customer Success**: Reach out to your [Customer Success Manager](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=6947882197532)

## Appendix: Status Codes and Enums

### TRSupport Verdicts

* `ACCEPT`: Transaction approved
* `REJECT`: Transaction blocked
* `ALERT`: Approved with monitoring
* `WAIT`: Awaiting additional data

### Processing Statuses

* `completed`: Final verdict reached
* `pending`: Still processing
* `bypassed`: Policy bypass applied
* `failed`: Technical failure

### TRM Statuses

* `ACCEPTED`: Provider approved
* `REJECTED`: Provider blocked
* `PENDING`: Awaiting provider response
* `FAILED`: Provider technical issue

<br />
