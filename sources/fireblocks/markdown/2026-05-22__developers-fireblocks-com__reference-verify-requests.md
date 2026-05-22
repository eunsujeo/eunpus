> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Validate Requests

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

Fireblocks sends events to your webhook endpoint URL(s) associated with the workspace, as part of a POST request with a JSON payload.

### Validation

You can validate Fireblocks webhook events by validating the signature attached in the request header:

**Fireblocks-Signature:** `Base64(RSA512(_WEBHOOK_PRIVATE_KEY_, SHA512(eventBody)))`

To validate the signature in **Production workspaces**, please use the public key below:

```yaml theme={"system"}
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0+6wd9OJQpK60ZI7qnZG
jjQ0wNFUHfRv85Tdyek8+ahlg1Ph8uhwl4N6DZw5LwLXhNjzAbQ8LGPxt36RUZl5
YlxTru0jZNKx5lslR+H4i936A4pKBjgiMmSkVwXD9HcfKHTp70GQ812+J0Fvti/v
4nrrUpc011Wo4F6omt1QcYsi4GTI5OsEbeKQ24BtUd6Z1Nm/EP7PfPxeb4CP8KOH
clM8K7OwBUfWrip8Ptljjz9BNOZUF94iyjJ/BIzGJjyCntho64ehpUYP8UJykLVd
CGcu7sVYWnknf1ZGLuqqZQt4qt7cUUhFGielssZP9N9x7wzaAIFcT3yQ+ELDu1SZ
dE4lZsf2uMyfj58V8GDOLLE233+LRsRbJ083x+e2mW5BdAGtGgQBusFfnmv5Bxqd
HgS55hsna5725/44tvxll261TgQvjGrTxwe7e5Ia3d2Syc+e89mXQaI/+cZnylNP
SwCCvx8mOM847T0XkVRX3ZrwXtHIA25uKsPJzUtksDnAowB91j7RJkjXxJcz3Vh1
4k182UFOTPRW9jzdWNSyWQGl/vpe9oQ4c2Ly15+/toBo4YXJeDdDnZ5c/O+KKadc
IMPBpnPrH/0O97uMPuED+nI6ISGOTMLZo35xJ96gPBwyG5s2QxIkKPXIrhgcgUnk
tSM7QYNhlftT4/yVvYnk0YcCAwEAAQ==
-----END PUBLIC KEY-----
```

To validate the signature in **EU and EU2 workspaces**, use the public key below:

```yaml theme={"system"}
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6hLRQL0jPf5OEuaDYGjO
xSyaYIlv08S0+4giiwgKSfV3Onc5hn03mvE0znzaUq2ReSxi9KYDdMYFfzf1uwF7
7kYy2MY0oTYGdQb+PS4Ym4R4tgZ2otuoAXt8YRKq2maWyguFiaowMcYwwAVQv8JB
afIm6Jq1nI6v1mEDVX065ePlBlAt+BGAqr6ahPxnaIz3L4eztpuNrt5nTbSxs7eF
aqQx1p56W1nl3Hl0V3tLkaXbuVtbFNR/mGMInrkPnpsG+mt35b9vmqAOvLPI0Cx1
59uVeEs62Hj1AOCRyT6SuwIaFynRj2KnD42ioQtkodHQ0xDtgdiYGsxuwQ9vTIe7
5oLsL8gBDeX5gdcTfSZhfGjZ7RggLNJ7vCAbYKMuUOdgWVMYnJfrhNLCq3zDSZPO
+H0x5m/Yeq/Hn5o7xCmLNT3qARfwDd5IHfQyXqVYB6TMU75xqH5fdSRw0iMdoPyL
ALnr9/JT0av3qssNMRdWCXr+j9Ys3NkfcbU/a49657mg8e2QGSkl9w39csEKojnr
omUz25szIL8CcXLmc5cAmnimFCe4L7UT4mvVP3+fOo+cbc/82zqA8tsSwd2Y93/6
ueGnNZD9V5rewrKjmdPfrwoI2gntzc8QJUu+nxAWhoqHV91AQeglu6WIF/DiEJC5
WPoNk2SdlAuA6RYmgB2YyikCAwEAAQ==
-----END PUBLIC KEY-----
```

To validate the signature in **Sandbox workspaces**, please use the public key below:

```yaml theme={"system"}
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZE6wL2+7P1ohvVYSpCd
gSgtmyGwiLbUC1UoGJhn1zwfY7ZWbNH7Pg8Osk8OzZTZHSG/arcgE8HnGCmGKtbE
QBkf2XlBRBQ01FcCMlZuJQJ3nElCPaMl9N6fq0VKNEIlVSVUpDCgvag5kFhDKS/L
p3YYJLFR46/hDlVLn+vM84diO3xGyMc16YJGNz7Z4jb8dmSZQE5E2XaQMDXW6uxC
c2ChjWJ3X5H70MzRG35JsN0j58SQTwbf4Pxm0aJfhPuaIBn3mJuZL5etsuFihoFG
FDnT+qWRcgD/pRNulBFAFhJeUnFrE4fFTJ1iaHhjBrStBCrxJk6QI0pGznoapTgA
2QIDAQAB
-----END PUBLIC KEY-----
```

### Check event objects

Each event is structured as an object with a type and a data sub-object that holds the transaction ID, as well as other related information. Your endpoint must check the event type and parse the payload of each event.

Example: transaction created webhook

```json theme={"system"}
{
    "type": "TRANSACTION_CREATED",
    "tenantId”:  ".........-.....-....-....-...........",
    "timestamp": 1679651214621,
    "data": {
        "id": "........-....-....-....-............",
        "createdAt": 1679651104380,
        "lastUpdated": 1679651104380,
        "assetId": "WETH_TEST3",
        "source": {
            "id": "0",
            "type": "VAULT_ACCOUNT",
            "name": "Main",
            "subType": ""
        },
        "destination": {
            "id": "12",
            "type": "VAULT_ACCOUNT",
            "name": "MintBurn",
            "subType": ""
        },
        "amount": 0.001,
        "sourceAddress": "",
        "destinationAddress": "",
        "destinationAddressDescription": "",
        "destinationTag": "",
        "status": "SUBMITTED",
        "txHash": "",
        "subStatus": "",
        "signedBy": [],
        "createdBy": ".........-.....-....-....-...........",
        "rejectedBy": "",
        "amountUSD": null,
        "addressType": "",
        "note": "",
        "exchangeTxId": "",
        "requestedAmount": 0.001,
        "feeCurrency": "ETH_TEST3",
        "operation": "TRANSFER",
        "customerRefId": null,
        "amountInfo": {
            "amount": "0.001",
            "requestedAmount": "0.001"
        },
        "feeInfo": {},
        "destinations": [],
        "externalTxId": null,
        "blockInfo": {},
        "signedMessages": [],
        "assetType": "ERC20"
    }
}
```

```json theme={"system"}
{
    "eventType": "TRANSACTION_CREATED",
    "tenantId”:  ".........-.....-....-....-...........",
 	  "resourceId”:  ".........-.....-....-....-...........",
    "eventVersion”:  1,
    "timestamp": 1679651214621,
    "data": {
        "id": "........-....-....-....-............",
        "createdAt": 1679651104380,
        "lastUpdated": 1679651104380,
        "assetId": "WETH_TEST3",
        "source": {
            "id": "0",
            "type": "VAULT_ACCOUNT",
            "name": "Main",
            "subType": ""
        },
        "destination": {
            "id": "12",
            "type": "VAULT_ACCOUNT",
            "name": "MintBurn",
            "subType": ""
        },
        "amount": 0.001,
        "sourceAddress": "",
        "destinationAddress": "",
        "destinationAddressDescription": "",
        "destinationTag": "",
        "status": "SUBMITTED",
        "txHash": "",
        "subStatus": "",
        "signedBy": [],
        "createdBy": ".........-.....-....-....-...........",
        "rejectedBy": "",
        "amountUSD": null,
        "addressType": "",
        "note": "",
        "exchangeTxId": "",
        "requestedAmount": 0.001,
        "feeCurrency": "ETH_TEST3",
        "operation": "TRANSFER",
        "customerRefId": null,
        "amountInfo": {
            "amount": "0.001",
            "requestedAmount": "0.001"
        },
        "feeInfo": {},
        "destinations": [],
        "externalTxId": null,
        "blockInfo": {},
        "signedMessages": [],
        "assetType": "ERC20"
    }
}
```

Example: transaction status updated webhook

```json theme={"system"}
{
    "type": "TRANSACTION_STATUS_UPDATED",
    "tenantId”:  ".........-.....-....-....-...........",
    "timestamp": 1679651214621,
    "data": {
        "id": "........-....-....-....-............",
        "createdAt": 1680014718734,
        "lastUpdated": 1680014729691,
        "assetId": "TRX_USDT",
        "source": {
            "id": "",
            "type": "UNKNOWN",
            "name": "External",
            "subType": ""
        },
        "destination": {
            "id": "2107",
            "type": "VAULT_ACCOUNT",
            "name": "Main",
            "subType": ""
        },
        "amount": 370,
        "networkFee": 27.2559,
        "netAmount": 370,
        "sourceAddress": "",
        "destinationAddress": "",
        "destinationAddressDescription": "",
        "destinationTag": "",
        "status": "COMPLETED",
        "txHash": "e9e1asdade125be06638c8675fdsfsdc79594dd45ff095b7683c3f03b81a9389684",
        "subStatus": "CONFIRMED",
        "signedBy": [],
        "createdBy": "",
        "rejectedBy": "",
        "amountUSD": 0,
        "addressType": "",
        "note": "",
        "exchangeTxId": "",
        "requestedAmount": 370,
        "feeCurrency": "TRX",
        "operation": "TRANSFER",
        "customerRefId": "........-....-....-....-............",
        "numOfConfirmations": 1,
        "amountInfo": {
            "amount": "370",
            "requestedAmount": "370",
            "netAmount": "370",
            "amountUSD": null
        },
        "feeInfo": {
            "networkFee": "27.2559"
        },
        "destinations": [],
        "externalTxId": null,
        "blockInfo": {
            "blockHeight": "49800684",
            "blockHash": "0000000002f7e5ece07efd8dfnjngfh76dda5f2645a9aba5e6h4534ba1bc7d97a8e2"
        },
        "signedMessages": [],
        "amlScreeningResult": {
            "screeningStatus": "BYPASSED",
            "bypassReason": "PASSED_BY_POLICY",
            "timestamp": 1680014729455
        },
        "assetType": "TRON_TRC20"
    }
}
```

```json theme={"system"}
{
    "eventType": "TRANSACTION_STATUS_UPDATED",
    "tenantId”:  ".........-.....-....-....-...........",
 	  "resourceId”:  ".........-.....-....-....-...........",
    "eventVersion”:  1,
    "timestamp": 1679651214621,
    "data": {
        "id": "........-....-....-....-............",
        "createdAt": 1679651104380,
        "lastUpdated": 1679651104380,
        "assetId": "WETH_TEST3",
        "source": {
            "id": "0",
            "type": "VAULT_ACCOUNT",
            "name": "Main",
            "subType": ""
        },
        "destination": {
            "id": "12",
            "type": "VAULT_ACCOUNT",
            "name": "MintBurn",
            "subType": ""
        },
        "amount": 0.001,
        "sourceAddress": "",
        "destinationAddress": "",
        "destinationAddressDescription": "",
        "destinationTag": "",
        "status": "SUBMITTED",
        "txHash": "",
        "subStatus": "",
        "signedBy": [],
        "createdBy": ".........-.....-....-....-...........",
        "rejectedBy": "",
        "amountUSD": null,
        "addressType": "",
        "note": "",
        "exchangeTxId": "",
        "requestedAmount": 0.001,
        "feeCurrency": "ETH_TEST3",
        "operation": "TRANSFER",
        "customerRefId": null,
        "amountInfo": {
            "amount": "0.001",
            "requestedAmount": "0.001"
        },
        "feeInfo": {},
        "destinations": [],
        "externalTxId": null,
        "blockInfo": {},
        "signedMessages": [],
        "assetType": "ERC20"
    }
}
```

### Response

The Fireblocks server will look for a response to confirm the webhook notification was received. All webhook events should receive an HTTP 200 (OK) response.

If no response is received, Fireblocks will resend the 5xx request several more times. The retry schedule (in seconds) is 5, 15, 35, 75, 155, 315, 635, 1275, 2555 for webhooks v1. For webhooks v2, the retry schedule (in seconds) is 0, 30, 120, 300, 900, 1800, 3600, 7200, 14400.
