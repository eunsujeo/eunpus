> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Travel Rule with Notabene - Validate Travel Rule

# Overview

> **Note**
>
> This guide contains links to Notabene API documentation, which is password protected. If you need help accessing it, contact your Customer Success Manager.

The Travel Rule states that Virtual Asset Service Providers (VASPs), which include businesses that exchange virtual assets, must provide additional data on the senders and recipients of certain transactions. Each jurisdiction decides which transactions must adhere to the Travel Rule and what data must be included.

The Fireblocks API allows you to send your transactions to Notabene to ensure they comply with the Travel Rule. After creating a key to encrypt personally identifiable information (PII) data included in the transactions, you use the Validation API to verify all the necessary data is included for the Travel Rule check. Once these API calls are set up, you can use the Fireblocks SDK or the Fireblocks API to submit your transactions for Travel Rule validation.

The following transaction routes in Fireblocks are not subject to Travel Rule screening:

* Gas Station to Vault
* Vault to Network Connection(s)
* Vault to Exchange
* Vault to Vault

# Before you begin

Before you can validate Travel Rule transactions, you must create a dedicated DID Key for encrypting customer PII data and add it to your Notabene VASP account. With this public-private keypair, you allow other VASPs to retrieve the public key and encrypt PII data to you.

You can create a new key pair using [@notabene/cli](https://www.npmjs.com/package/@notabene/cli) and then publishing it to the Notabene directory under the pii\_didkey field.

## Creating an encryption key

1. Install the Notabene CLI tool.
   1. Install the library globally using Yarn `yarn global add @notabene/cli` or NPM `npm i -g @notabene/cli`.
   2. Ensure the path to globally installed packages is in your \$PATH environment variable.
2. Generate an M2M token.
   1. Generate an M2M token for use with the Notabene Travel Rule gateway: `notabene auth:token`.
3. Create the encryption key.
   1. You can use the CLI to generate a key that can be used to encrypt PII information to be sent as part of a Travel Rule message: `notabene keys:create`.
   2. This generates a JSON object containing an [Ed25519](https://en.wikipedia.org/wiki/EdDSA) key and metadata which can be passed to the [Notabene SDK](https://gitlab.com/notabene/open-source/notabene-nodejs) when creating transactions to encrypt the PII.

```json theme={"system"}
{
  "did":"did:key:z6MkjwpTikNZkp********************************",
  "controllerKeyId":"519b59a6b7ebf128f6c6**********************",
  "keys":\[{"type":"Ed25519","kid":"519b59a6b7eb768****************************************",
  "publicKeyHex":"519b59a6b7ebf128f6c7********************************",
  "meta":{"algorithms":["Ed25519","EdDSA"]},
  "kms":"local",
  "privateKeyHex":"0d07d8acda928f98765e4a0b80013e2be369c29564419a**********************************************"}],
  "services":\[],
  "provider":"did:key"
}
```

## Adding the encryption key to your Notabene account

After creating your encryption key, you must add it to your Notabene VASP account. Send a PUT request to `/v1/screening/travel-rule/vasp/update` with your VASP DID Key and JSON DID Key.

```javascript theme={"system"}
    const result = await fireblocks.updateVasp({
        did: "did:ethr:0x2215002eabcdabcdabcdabcdabcdabcdabcdabcd",
        encryptionKey: "did:key:z6MkgtY4abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
    } as any)
```

Be sure to replace the example above with your VASP DID and the encryption key you created in the previous step.

# Validation and sending Travel Rule transactions

Validating transactions ensures all the necessary information is included in the Travel Rule check. After you transaction has been validated, you can send the transaction to the counterparty.

The Travel Rule transaction flow consists of four steps:

1. Initial validation
2. Collecting additional data
3. Validating the full transaction
4. Sending the Travel Rule transaction

## Step 1: Initial validation

The Transaction Validate API call checks what beneficiary details are required by your jurisdiction and the beneficiary VASP’s jurisdiction. Since Travel Rule compliance is only required for transactions above a certain threshold, the Transaction Validate API call also checks whether or not the transaction meets the threshold and must comply with the Travel Rule. Travel Rule thresholds and required data are defined by the [jurisdictions](https://intercom.help/helpnotabene/en/collections/3648427-jurisdictional-requirements) of the VASPs involved.

This API works with a [customerToken](https://devx.notabene.id/docs/customertoken) and may be used from the front end of your application.

[Learn more about how the validation API works](https://devx.notabene.id/docs/validation-api).

### Example

```json theme={"system"}
{
  "transactionAsset": "BTC",
  "destination": "bc1qxy2kgdygjrsqtzq2n0yrf1234p83kkfjhx0wlh",
  "transactionAmount": "10",
  "originatorVASPdid": "did:ethr:0x44957e75d6ce4a5bf37aae117da86422c848f7c2",
  "originatorEqualsBeneficiary": false
}
```

### Response

```json theme={"system"}
{
    "isValid": false,
    "type": "NON_CUSTODIAL",
    "beneficiaryAddressType": "UNKNOWN",
    "addressSource": "UNKNOWN",
    "errors": [
        "beneficiaryNameMissing",
        "beneficiaryOwnershipProofMissing"
    ]
}
```

The response to this initial validation step tells us:

1. If the value of this transaction is above or below the Travel Rule threshold.
2. If the destination address was identified by blockchain analytics or your address book.

If the address was not automatically identified, search and select the correct VASP from Notabene’s directory by querying [Search API](https://devx.notabene.id/docs/search). You can search using the `/v1/screening/travel_rule/vasp?q=Fireblocks` API endpoint.

### Response

```json theme={"system"}
{
    "isValid": "true" or "false",
    "type": "BELOW_THRESHOLD" or "TRAVELRULE" or "NON_CUSTODIAL",
    "beneficiaryAddressType": "UNKNOWN" or "HOSTED" or "UNHOSTED",
    "addressSource": "ADDRESS_GRAPH" or "NAME_OF_BLOCKCHAIN_ANALYTICS",
    "beneficiaryVASPname": "VASP_NAME",
    "errors": "MISSING_FIELDS_REQUIRED_BY_YOUR_JURISDICTION"
    "warnings": "MISSING_FIELDS_REQUIRED_BY_COUNTERPARTY_JURISDICTION"
}
```

[Read the Notabene API documentation for more information on the responses to the Transaction Validate API call](https://devx.notabene.id/docs/validation-api#response).

If the transaction is below the threshold, you don’t need to collect data for the Travel Rule. Depending on the initial call response, the following scenarios can happen:

1. [Known VASP (address book)](https://devx.notabene.id/docs/validation-api#known-vasp-address-book)
2. [Known VASP (blockchain analytics)](https://devx.notabene.id/docs/validation-api#known-vasp-blockchain-analytics)
3. [Known VASP (manually selected)](https://devx.notabene.id/docs/validation-api#known-vasp-manually-selected)
4. [Unknown/unlisted VASP](https://devx.notabene.id/docs/validation-api#unknownunlisted-vasp)
5. [Unhosted wallet](https://devx.notabene.id/docs/validation-api#unhosted-wallet)

## Step 2: Collecting additional data

Once you perform the initial validation step to determine if the Travel Rule data requirements apply, you have two options to collect the necessary information listed in the errors array from step 1. You can use the Notabene widget or replicate the widget's functionality using API calls.

[Read the Notabene API documentation for more information on front-end data collection](https://devx.notabene.id/docs/validate-1).

## Step 3: Validating the full transaction

After reacting to the response of the initial Transaction Validate API call and collecting the necessary information about the beneficiary, you can perform a final request to confirm that you have all the data needed for the Travel Rule.

The Transaction Validate Full API call validates the beneficiary and the originator data included in your transaction. The originator data is the information about your organization and is static.

This API requires an [accessToken](https://devx.notabene.id/docs/auth0) and must be called from the back-end of your application.

[Learn more about how the validation API works](https://devx.notabene.id/docs/validation-api).

### Example

```json theme={"system"}
{
    "transactionAsset": "ETH",
    "destination": "bc1qxy2kgdygjrsqtzq2n0yrf1234p83kkfjhx0wlh",
    "transactionAmount": "10000000000000000000",
    "originatorVASPdid": "{{vaspDID}}",
    "originatorEqualsBeneficiary": false,
    "beneficiaryVASPdid": "did:ethr:0x47463999eb42dc2aaacb29624c512603221227a1",
    "beneficiaryName": "Bruce Wayne",
    "beneficiaryAccountNumber": "bc1qxy2kgdygjrsqtzq2n0yrf1234p83kkfjhx0wlh"
}
```

### Response

```json theme={"system"}
{
    "isValid": true,
    "type": "TRAVELRULE",
    "beneficiaryAddressType": "HOSTED",
    "addressSource": "ADDRESS_GRAPH",
    "beneficiaryVASPname": "Notabene VASP US"
}
```

If all the necessary information is included, you receive the response *isValid*=**true**.

## Step 4: Sending the Travel Rule transaction

Once the full transaction is validated, move the information used in the final validation request to the back-end, add information about your customer (the originator), and create the actual Travel Rule message using the Fireblocks API or the Fireblocks SDK.

If the outgoing transaction doesn’t contain a Travel Rule message, the transaction bypasses screening.

### Fireblocks API

First, encrypt the data for the transaction using the Notabene PII SDK. This encryption ensures the privacy and security of PII data during the transaction. The PII data should only be decrypted by authorized parties.

```python theme={"system"}
import PIIsdk, { PIIEncryptionMethod } from "@notabene/pii-sdk";
import { TransactionArguments, TravelRule, TravelRuleEncryptionOptions, TravelRuleOptions } from "./types";
import * as util from "util";

const requiredFields = [
    "baseURLPII",
    "audiencePII",
    "clientId",
    "clientSecret",
    "authURL",
    "jsonDidKey",
];

export class PIIEncryption {
    public toolset: PIIsdk;

    constructor(private readonly config: TravelRuleOptions) {
        this.config = config;
        const missingFields = requiredFields.filter(
            (field) => !(field in this.config)
        );

        if (missingFields.length > 0) {
            throw new Error(
                `Missing PII configuration fields: ${missingFields.join(", ")}`
            );
        }

        this.toolset = new PIIsdk({
            piiURL: config.baseURLPII,
            audience: config.audiencePII,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            authURL: config.authURL,
        });
    }

    async hybridEncode(transaction: TransactionArguments, travelRuleEncryptionOptions?: TravelRuleEncryptionOptions) {
        const { travelRuleMessage } = transaction;
        const pii = travelRuleMessage.pii || {
            originator: travelRuleMessage.originator,
            beneficiary: travelRuleMessage.beneficiary,
        };
        const { jsonDidKey } = this.config;
        const counterpartyDIDKey = travelRuleEncryptionOptions?.beneficiaryPIIDidKey;

        let piiIvms;

        try {
            piiIvms = await this.toolset.generatePIIField({
                pii,
                originatorVASPdid: travelRuleMessage.originatorVASPdid,
                beneficiaryVASPdid: travelRuleMessage.beneficiaryVASPdid,
                counterpartyDIDKey,
                keypair: JSON.parse(jsonDidKey),
                senderDIDKey: JSON.parse(jsonDidKey).did,
                encryptionMethod: travelRuleEncryptionOptions?.sendToProvider
                    ? PIIEncryptionMethod.HYBRID
                    : PIIEncryptionMethod.END_2_END,
            });
        } catch (error) {
            const errorMessage = error.message || error.toString();
            const errorDetails = JSON.stringify(error);
            throw new Error(`Failed to generate PII fields error: ${errorMessage}. Details: ${errorDetails}`);
        }

        transaction.travelRuleMessage = this.travelRuleMessageHandler(travelRuleMessage, piiIvms);

        return transaction;
    }

    private travelRuleMessageHandler(travelRuleMessage: TravelRule, piiIvms: any): TravelRule {
        travelRuleMessage.beneficiary = piiIvms.beneficiary;
        travelRuleMessage.originator = piiIvms.originator;

        return travelRuleMessage;
    }
}
```

Then, create the transaction using the [Transaction Create](/api-reference/transactions/create-a-new-transaction) endpoint and include the information you validated with Notabene.

```javascript theme={"system"}
const travelRuleEncryptedMessage = {
  originatorVASPdid: 'did:ethr:0x44957e75d6ce4a5bf37aae117da86422c848f7c2',
  travelRuleBehavior: false,
  beneficiaryVASPdid: 'did:ethr:0xf9139d9ca3cd9824a7fb623b1d34618a155137bc',
  beneficiaryVASPname: '',
  originatorDid: '',
  beneficiaryDid: '',
  originator: {
    originatorPersons: [
      {
        naturalPerson: {
          name: [
            {
              nameIdentifier: [
                {
                  primaryIdentifier: 'QmQMWeaZVMuR4eD2YxLwLT6uEdnbNX5f5KS1V6rWWgdNN4',
                  secondaryIdentifier: 'QmQUusxQZ2GAezHKKAgMnj4ZRrRCccZfeADmeeQGxfKEwe'
                }
              ]
            }
          ],
          geographicAddress: [
            {
              streetName: 'QmdMT2uowJmQnefc1noRxGx69pAa3tvAeEvNEAsEe8aKac',

  ............
  ......
}

const transaction = {
        assetId: 'XRP_TEST',
        source: {
            type: 'VAULT_ACCOUNT',
            id: '0',
            virtualId: undefined,
            virtualType: undefined
        },
        destination: {
            type: 'ONE_TIME_ADDRESS',
            id: undefined,
            oneTimeAddress: {
                address: 'rn7tTh4Dvsc3G5k1TJo9X1vpHREG3Cac6r',
                tag: undefined
            },
            virtualId: undefined,
            virtualType: undefined
        },
        operation: 'TRANSFER',
        amount: '5.007',
        fee: undefined,
        gasPrice: undefined,
        gasLimit: undefined,
        feeLevel: undefined,
        maxFee: undefined,
        failOnLowFee: false,
        priorityFee: undefined,
        note: 'Created with love by fireblocks SDK from BDD Travel Rule TEST',
        autoStaking: undefined,
        cpuStaking: undefined,
        networkStaking: undefined,
        replaceTxByHash: '',
        extraParameters: undefined,
        destinations: undefined,
        externalTxId: undefined,
        treatAsGrossAmount: undefined,
        travelRuleMessage: travelRuleEncryptedMessage,
    }

....

apiClient.issuePostRequest("https://api.fireblocks.io/v1/transactions", transaction);
```

### Fireblocks SDK

To create a Fireblocks blockchain transaction with encrypted PII data, you must provide the necessary Notabene PII SDK credentials in the `sdkOptions` field. You can choose to use an [end-to-end encryption method](https://devx.notabene.id/docs/encryption#end-to-end-encryption) or a [hybrid encryption method](https://devx.notabene.id/docs/encryption#hybrid-encryption).

```javascript theme={"system"}
fireblocks = new FireblocksSDK(privateKey, userId, serverAddress, undefined, {
        customAxiosOptions: {
            interceptors: {
                response: {
                    onFulfilled: (response) => {
                        console.log(`Request ID: ${response.headers["x-request-id"]}`);
                        return response;
                    },
                    onRejected: (error) => {
                        console.log(`Request ID: ${error.response.headers["x-request-id"]}`);
                        throw error;
                    }
                }
            }
        },
        travelRuleOptions: {
            kmsSecretKey:
                "75099860d284bb22a2c96a6e41ee024d04171a4ba33b2f3720d2bec17d1ced78",
            authURL: "[https://auth.notabene.id"](https://auth.notabene.id"),
            baseURL: "[https://api.notabene.dev"](https://api.notabene.dev"),
            audience: "[https://api.notabene.dev"](https://api.notabene.dev"),
            baseURLPII: "[https://pii.notabene.dev"](https://pii.notabene.dev"),
            audiencePII: "[https://pii.notabene.dev"](https://pii.notabene.dev"),
            clientId: "7iQ6MNg*****************************",
            clientSecret: "1rg17YZtmFT***********************************************",
            jsonDidKey: "{\"did\":\"did:key:z6MknL8ERKo2MqArMvJdA2EdZcUWehR7t3gDDc9hsbB7TCfZ\",\"controllerKeyId\":\"75099860d284bb22a2c96a6e41ee024d04171a4ba33b2f3720d2bec17d1ced78\",\"keys\":\[{\"type\":\"Ed25519\",\"kid\":\"75099860d284bb22a2c96a6e41ee024d04171a4ba33b2f3720d2bec17d1ced78\",\"publicKeyHex\":\"75099860d284bb22a2c96a6e41ee024d04171a4ba33b2f3720d2bec17d1ced78\",\"meta\":{\"algorithms\":[\"Ed25519\",\"EdDSA\"]},\"kms\":\"local\",\"privateKeyHex\":\"c0add0d8b45f704bbc8235d05ee449dc19453dce94df2b07c7bddb36cf7de59475099860d284bb22a2c96a6e41ee024d04171a4ba33b2f3720d2bec17d1ced78\"}],\"services\":\[],\"provider\":\"did:key\"}"
        }
    });
```

Then provide the Travel Rule Message data to Fireblocks Transaction in the requested format.

```json theme={"system"}
{
    "transactionAsset": "ETH",
    "transactionAmount": "10044000000000000000",
    "originatorVASPdid": "{{vaspDID}}",
    "beneficiaryVASPdid": "did:ethr:0xc7d10be62c7a5af366a13511fe5e0584b8918114",
    "transactionBlockchainInfo": {
        "txHash": "",
        "origin": "5342b5234hioutewry87y78sdfghy783t4t34",
        "destination": "0xDB6A31EC49D5FB35EF6BA6CE0A3B071C8BA7F7F0"
    },
    "originator": {
        "originatorPersons": \[
            {
                "naturalPerson": {
                    "name": \[
                        {
                            "nameIdentifier": [
                                {
                                    "primaryIdentifier": "Wunderland",
                                    "secondaryIdentifier": "Alice"
                                }
                            ]
                        }
                    ],
                    "geographicAddress": [
                        {
                            "streetName": "Robinson road",
                            "townName": "Singapore",
                            "country": "SG",
                            "buildingNumber": "71",
                            "postCode": "123456"
                        }
                    ],
                    "nationalIdentification": {
                        "countryOfIssue": "SG",
                        "nationalIdentifier": "987654321",
                        "nationalIdentifierType": "DRLC"
                    }
                }
            }
        ],
        "accountNumber": [
            "5342b5234hioutewry87y78sdfghy783t4t34"
        ]
    },
    "beneficiary": {
        "beneficiaryPersons": \[
            {
                "naturalPerson": {
                    "name": \[
                        {
                            "nameIdentifier": [
                                {
                                    "primaryIdentifier": "Bobson",
                                    "secondaryIdentifier": "Bob"
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "accountNumber": [
            "5643jn5h34y2g7hg42jt24j890y345gfgh65"
        ]
    }
}
```

```javascript theme={"system"}
/**
 * Creates a new transaction with the specified options
 */
public async createTransaction(transactionArguments: TransactionArguments, requestOptions?: RequestOptions, travelRuleEncryptionOptions?: TravelRuleEncryptionOptions): Promise<CreateTransactionResponse> {
    const opts = { ...requestOptions };

    if (transactionArguments?.travelRuleMessage) {
        transactionArguments = await this.piiClient.hybridEncode(transactionArguments, travelRuleEncryptionOptions);
    }

    if (transactionArguments.source?.type === PeerType.END_USER_WALLET && !opts.ncw?.walletId) {
        const { walletId } = transactionArguments.source;
        opts.ncw = { ...opts.ncw, walletId };
    }

    return await this.apiClient.issuePostRequest("/v1/transactions", transactionArguments, opts);
}
```

# Get VASP details

You can use the `POST {{baseUrl}}/tx/vasp/{did}` API call to get details on a specific VASP from Notabene’s database. This API call allows you to receive your VASPdid key from Notabene. Once received, you can use it to [integrate your workspace with Notabene](https://support.fireblocks.io/hc/en-us/articles/8271611252764-Setting-up-Travel-Rule-integration#h_01GZ1S2MBYGNGZFDGG8K5087H4).

```json theme={"system"}
{
"vasps": \[
{
"did": "did:ethr:0x44957e75d6ce4a5bf37aae117da86422c848f7c2",
"name": "Fireblocks",
"verificationStatus": "PENDING",
"addressLine1": "Tel Aviv",
"addressLine2": null,
"city": "Tel Aviv",
"country": "IL",
"emailDomains": "[\"fireblocks.com\"]",
"website": "[https://fireblocks.com"](https://fireblocks.com"),
"logo": null,
"legalStructure": "CORPORATION",
"legalName": "Fireblocks Ltd",
"yearFounded": "2018",
"incorporationCountry": "IL",
"isRegulated": "NO",
"otherNames": null,
"identificationType": null,
"identificationCountry": null,
"businessNumber": null,
"regulatoryAuthorities": null,
"jurisdictions": "IL",
"street": null,
"number": null,
"unit": null,
"postCode": null,
"state": null,
"certificates": null,
"description": null,
"travelRule_OPENVASP": null,
"travelRule_SYGNA": null,
"travelRule_TRISA": null,
"travelRule_TRLIGHT": "active",
"travelRule_EMAIL": null,
"travelRule_TRP": null,
"travelRule_SHYFT": null,
"travelRule_USTRAVELRULEWG": null,
"createdAt": "2022-12-01T09:12:11.048Z",
"createdBy": "did:ethr:0x44957e75d6ce4a5bf37aae117da86422c848f7c2",
"updatedAt": "2023-04-20T21:13:46.696Z",
"updatedBy": null,
"lastSentDate": "2023-04-20T21:13:46.678Z",
"lastReceivedDate": "2023-04-18T18:36:40.331Z",
"documents": null,
"hasAdmin": true,
"isNotifiable": true,
"issuers": {
"verificationStatus": {
"issuerDid": "did:ethr:0x19b5ff8440019b635a86bbb632db854f2ea80423"
},
"emailDomains": {
"issuerDid": "did:ethr:0xf33cbc1a777bcfba6f9f66de276e8072d18fadae"
},
"travelRule_TRLIGHT": {
"issuerDid": "did:ethr:0xf33cbc1a777bcfba6f9f66de276e8072d18fadae"
},
"jurisdictions": {
"issuerDid": "did:ethr:0xf33cbc1a777bcfba6f9f66de276e8072d18fadae"
},
"country": {
"issuerDid": "did:ethr:0xf33cbc1a777bcfba6f9f66de276e8072d18fadae"
},
"city": {
"issuerDid": "did:ethr:0xf33cbc1a777bcfba6f9f66de276e8072d18fadae"
},
"addressLine1": {
"issuerDid": "did:ethr:0xf33cbc1a777bcfba6f9f66de276e8072d18fadae"
},
"isReg
```

# Additional resources

* [Notabene docs](https://devx.notabene.id/docs/using-notabene-and-fireblocks)
* [Testing transactions](https://devx.notabene.id/docs/fireblocks-testing)
* [Postman Collection](https://www.postman.com/notabene/workspace/fireblocks-notabene-integration/overview)
* [More code samples for using the PII-SDK and Fireblocks API](https://devx.notabene.id/recipes/using-the-pii-sdk-and-fireblocks-api)
