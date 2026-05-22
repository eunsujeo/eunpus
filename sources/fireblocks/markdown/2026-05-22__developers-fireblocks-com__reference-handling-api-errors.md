> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Handle API Errors

# Overview

Understanding errors and how to handle them is critical to user experience and business operations when working with *any* third-party API.

Some errors might include:

* A timeout as the third-party service is experiencing issues or is down.
* An improperly formatted request due to user error or a non-fatal software bug.
* A runtime error due to a system state or an "unexpected" error.

These types of errors are important to handle when working with third-party APIs and handling individual errors will depend on the nature of each API call.

## Error types

In this section, we will dive into how to handle API errors when using Fireblocks API in terms of best practices and common pitfalls.

As the Fireblocks API uses HTTP requests to send the calls, we will look into three main error types:

1. [Non-HTTP errors](doc:error-handling#non-http-errors)
2. [4xx status codes](doc:error-handling#4xx-status-codes)
3. [500 status code](doc:error-handling#500-status-code)

> **How to handle unspecified errors**
>
> While we do our best to cover all the errors that are possible, and are constantly improving error reporting, you might encounter an error you did not read about in this guide, or the approach and best practices do not suffice.
>
> We recommend making sure to read the message that accompanies every Fireblocks API error as these are usually descriptive and can help pinpoint the issue.

***

# Non-HTTP errors

Non-HTTP errors are a broad error type that relates to anything that is not specifically a response back from the Fireblocks API. As a result, this error type may contain many individual errors that can typically be resolved with the relevant third-party documentation.

Examples of such errors include:

* Errors that prevent the execution of `.js` or `.py` (or any other extension) files such as `command not found`, or `No such file or directory`
* Errors relating to internal formatting of a file (missing indent, missing bracket, `==` instead of `===`)
* Errors relating to system state, such as lack of memory, or network connectivity issues

As described in our API guides, signing a JWT (JSON Web Token) is a critical part of API usage as the means of authenticating your message and validating your identity. (This assumes the private key used to sign your API request is securely stored and not available to anyone else).

You may be unable to sign the JWT token if you are experiencing issues with your private key. These issues are classified as "**private key corruption**". While uncommon, it can be a serious issue when trying to sign API requests.

## Private key corruption

Observe the following error message:

(If you are unfamiliar with this error, a Google search will yield many results pointing to authentication problems.)

```text theme={"system"}
Error:  Error: error:1E08010C:DECODER routines::unsupported
    at Sign.sign (/myproject/lib/internal/crypto/sig.js:131:29)
    at Object.sign /myproject/node_modules/jwa/index.js:152:45)
    at Object.jwsSign [as sign] (/myproject/node_modules/jws/lib/sign-stream.js:32:24)
    at module.exports [as sign] (/myproject/node_modules/jsonwebtoken/sign.js:204:16)
    at ApiTokenProvider.signJwt (/myproject/fireblocks-sdk-js/src/api-token-provider.ts:11:28)
    at ApiClient.<anonymous> (/myproject/fireblocks-sdk-js/src/api-client.ts:15:41)
    at Generator.next (<anonymous>)
    at /myproject/fireblocks-sdk-js/dist/api-client.js:8:71
    at new Promise (<anonymous>)
    at __awaiter (/myproject/fireblocks-sdk-js/dist/api-client.js:4:12)
    at ApiClient.issueGetRequest (/myproject/fireblocks-sdk-js/dist/api-client.js:27:16)
    at FireblocksSDK.<anonymous> (/myproject/fireblocks-sdk-js/src/fireblocks-sdk.ts:537:37)
    at Generator.next (<anonymous>)
    at /myproject/fireblocks-sdk-js/dist/fireblocks-sdk.js:18:71
    at new Promise (<anonymous>)
    at __awaiter (/myproject/fireblocks-sdk-js/dist/fireblocks-sdk.js:14:12)
```

```text theme={"system"}
Traceback (most recent call last):
  File "/myproject/venv/lib/python3.10/site-packages/jwt/algorithms.py", line 257, in prepare_key
    key = load_pem_private_key(key, password=None)
  File "/myproject/venv/lib/python3.10/site-packages/cryptography/hazmat/primitives/serialization/base.py", line 22, in load_pem_private_key
    return ossl.load_pem_private_key(data, password)
  File "/myproject/venv/lib/python3.10/site-packages/cryptography/hazmat/backends/openssl/backend.py", line 900, in load_pem_private_key
    return self._load_key(
  File "/myproject/venv/lib/python3.10/site-packages/cryptography/hazmat/backends/openssl/backend.py", line 1168, in _load_key
    self._handle_key_loading_error()
  File "/myproject/venv/lib/python3.10/site-packages/cryptography/hazmat/backends/openssl/backend.py", line 1227, in _handle_key_loading_error
    raise ValueError(
ValueError: ('Could not deserialize key data. The data may be in an incorrect format, it may be encrypted with an unsupported algorithm, or it may be an unsupported key type (e.g. EC curves with explicit parameters).', [_OpenSSLErrorWithText(code=503841036, lib=60, reason=524556, reason_text=b'error:1E08010C:DECODER routines::unsupported')])
```

The issue within this error is a "corruption" of the private key. "Corruption" can also mean human error such as submitting an incorrect file that is not a private key. Follow the instructions below to resolve this error.

1. Verify that the file being used is indeed a private key.

   A private key typically looks like this:

   ```yaml theme={"system"}
   -----BEGIN PRIVATE KEY-----
              ...
   -----END PRIVATE KEY-----
   ```

2. Verify that the private key is intact.

3. Generate something out of the private key using OpenSSL.

   This command will attempt to convert the private key into its corresponding public key:

   `openssl rsa -in <api-private-key>.key -pubout`

   A valid response will look something like this:

   ```yaml theme={"system"}
   -----BEGIN PUBLIC KEY-----
               ...
   -----END PUBLIC KEY-----
   ```

***

# 4xx status codes

4xx status codes are codes that are returned as part of an HTTP request to indicate a problem on the client's side - in the context of this article, it means that there is an issue with the request that you have sent.

We will look into 3 specific status codes and how to handle each of them:

1. [400 - Bad request](doc:error-handling#400---bad-request) Indicates that the API request itself is incorrect and contains invalid or incorrect values
2. [401 - Unauthorized](doc:error-handling#401---unauthorized) - Indicates that the API request is sent with invalid authentication information (for example, bad JWT)
3. [403 - Forbidden](doc:error-handling#403---forbidden) - Indicates that the API request is trying to perform something that the user is not allowed to do
4. [404 - Not found](doc:error-handling#404---not-found) - Indicates that the API request is trying to query a page that does not exist

In addition to the three codes, we would also like to remind you that there is the status code `429 Too many requests`, which is caused by breaking the rate limits. More information can be found in the [Working with Rate Limits](doc:rate-limits) article.

> **Example code**
>
> The example code is written to illustrate how to approach the described scenario. It might contain functions or types which are not explicitly written out, but we add a short description of what they do after the code sample.
>
> No such type or function is written in the SDK and they merely are used to illustrate some logical container for an operation.

> **Assumptions for examples**
>
> Throughout each Error Handling section the following assumptions apply:
>
> * The user input ***may not*** be valid, through function call or direct integration.
> * The network connection is functioning as expected.
> * The system has sufficient resources (memory and disk space).
>
> This is important for security and stability, as it shows how to ensure your information is valid before submitting the request and how to double-check or sanitize the user input.
>
> Typical validations are provided at the bottom of the article.

## 400 - Bad request

As mentioned above, 400 response codes indicate that the request you sent contains incorrect information or is invalid.

#### 400 example - Bad request

Your internal database links users per asset public keys with their internal database reference (for example, their user ID).

To do this, upon registration or upon some update, your code calls the following `getPublicKey`\ `get_public_key` function with the asset **supplied by the user**:

```javascript theme={"system"}
const DEFAULT_VAULT_ACCOUNT_ID = "123";
/**
fbksSdk - an instance of FireblocksSDK
asset - the asset id
*/
async function getPublicKey(fbksSdk, asset){
  let pubKey = await fbks.getPublicKeyInfoForVaultAccount({
    vaultAccountId: DEFAULT_VAULT_ACCOUNT_ID,
    assetId:asset,
    compressed:true,
    addressIndex:"0",
    change:"0"
  });
  //... Some extra work on the public key ...
}
```

```python theme={"system"}
DEFAULT_VAULT_ACCOUNT_ID = "123";

def get_public_key(fbks, asset):
  """
  fbks - FireblocksSDK instance
  asset - the asset id
  """
  pub_key = fbks.get_public_key_info_for_vault_account(
    vault_account_id=DEFAULT_VAULT_ACCOUNT_ID,
    asset_id=asset,
    compressed=False,
    change="0",
    address_index="0"
  )
  # ... Some extra work on the public key ...
```

The user mistakenly put an invalid asset (for example `BTC1` instead of `BTC`). Your code will receive the following error:

```text theme={"system"}
Error: Request failed with status code 400
    at createError (/myproject/fireblocks-sdk-js/node_modules/axios/lib/core/createError.js:16:15)
    at settle (/myproject/fireblocks-sdk-js/node_modules/axios/lib/core/settle.js:17:12)
    at IncomingMessage.handleStreamEnd (/myproject/fireblocks-sdk-js/node_modules/axios/lib/adapters/http.js:293:11)
    at IncomingMessage.emit (node:events:525:35)
    at endReadableNT (node:internal/streams/readable:1359:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
```

```text theme={"system"}
Traceback (most recent call last):
  File "/myproject/main.py", line 10, in <module>
    get_public_key(fbksSdk, "jngjewqn")
  File "/myproject/main.py", line 8, in get_public_key
    fbks.get_public_key_info_for_vault_account(vault_account_id="2", asset_id=asset, compressed=False, change="0", address_index="0")
  File "/myproject/venv/lib/python3.10/site-packages/fireblocks_sdk/sdk.py", line 1066, in get_public_key_info_for_vault_account
    return self._get_request(url)
  File "/myproject/venv/lib/python3.10/site-packages/fireblocks_sdk/sdk.py", line 1334, in _get_request
    return handle_response(response, page_mode)
  File "/myproject/venv/lib/python3.10/site-packages/fireblocks_sdk/sdk.py", line 22, in handle_response
    raise FireblocksApiException("Got an error from fireblocks server: " + response.text, error_code)
fireblocks_sdk.api_types.FireblocksApiException:
  Got an error from fireblocks server: {
    "message":"The asset 'rando' is not supported by Fireblocks, please check the supported assets endpoint.",
    "code":1503
  }
```

For cases where you receive a 400 HTTP status code error, try using a `try{}catch{}`\ `try:...except...` block. This can be used to handle the error in the proper way, like notifying the user or adjusting the input parameters before attempting the call again.

The following is an example of how these types of 400-based errors can be handled for the specific scenario we described:

```javascript theme={"system"}
const DEFAULT_VAULT_ACCOUNT_ID = "123";
/**
fbksSdk - an instance of FireblocksSDK
asset - the asset id
*/
async function getPublicKey(fbksSdk, asset){
  let pubKeyResponse = undefined;
  try{
    pubKeyResponse = await fbks.getPublicKeyInfoForVaultAccount({
      vaultAccountId: DEFAULT_VAULT_ACCOUNT_ID,
      assetId:asset,
      compressed:true,
      addressIndex:"0",
      change:"0"
    });
  } catch (e) {
    let response = e.response;
    if(response.status < 400 || response.status >= 500){
      	// Non request based error
      	// We assume that execution of this function will be halted after this block is done
    }

    let respData = response.data;
    if(respData.code === 1503){ // This is discussed later on in the article
      	return new Error("The asset you specified is invalid, please verify that you're sending the correct asset.");
    }

    // Other handling
  }
  //... Some extra work on the public key ...
}
```

```python theme={"system"}
DEFAULT_VAULT_ACCOUNT_ID = "123"
# fbksSdk - an instance of FireblocksSDK
# asset - the asset id
def get_public_key(fbks_sdk, asset):
    pub_key = None
    try:
        pub_key = fbks_sdk.get_public_key_info_for_vault_account(
            vault_account_id=DEFAULT_VAULT_ACCOUNT_ID,
            asset_id=asset,
            compressed=True,
            address_index=0,
            change=0
        )
    except FireblocksApiException as e:
        if e.error_code == 1503:
            raise Exception("The asset you specified is invalid, please verify that you're sending the correct asset.")

        # Other handling

    # ... Some extra work on the public key ...
```

In both code samples, start by verifying that you received a 4xx response code (for 5xx refer to the information below). Then, you'll get the call response data and reference the parameter called `code` which represents the error code returned for the request. Each error code indicates a different issue with the request.

[Refer to our API Responses page to learn more.](ref:api-responses)

* Fireblocks Python SDK does this seamlessly for 4xx and 5xx errors, therefore handling should only consider the error code or message

### Handling a 400 error

When a 400 response is returned from the Fireblocks API, you will receive the following message:

```json theme={"system"}
{
  error_code: number (optional)
  message: string
}
```

This message will provide a description to inform you of any potential issues.

A best practice for error handling that you can see below is setting up a proper error handling flow for sensitive error code responses. This is done by first outlining the following:

1. Identify the features/components you're using - Are you performing wallet-specific operations (whitelisting, creating a new wallet, adding a deposit address to a wallet, etc.)?
2. Identify the user / system-provided inputs - What is constant? What is received as part of the system state (a database query, a read from a file, etc.)? What is received from user input?
3. Identify the potential errors from the [API Responses page](ref:api-responses).

After you've identified the points above, prepare your error handling respective to the API calls to best fit your needs (inform the user, run some runtime fix of the system state, etc.).

#### Implementing 400 error handling

> **Integrating into your code**
>
> The code sample, as well as the general flow, is customizable to fit your code, business logic, or existing implementation.
>
> The best practice is to change the code (shown below) to match your code language preference, as well as your business-specific practices, regulations and systems.
>
> Errors should also receive the same treatment, with the errors written in this section as an example, and should be changed to work with your flow.
>
> The most important part to take away from this section is to identify the components you'll be using and what potential errors might occur based on what input you'll receive.

For example, you're working on a system that receives a request from a user to perform a withdrawal of some amount of a given asset from their Fireblocks asset wallet address.

1. Refresh the balance of the specific asset they'd want to withdraw from the vault account we assigned to this user - using the [refresh asset balance data](ref:post_vault-accounts-vaultaccountid-assetid-balance) operation.
2. Create a transaction to send the asset from their vault account to the target address - using the [create transaction](ref:post_transactions) operation.

The refresh balance operation uses a vault account (`vaultAccountId`) and an asset (`assetId`), while the create transaction has very many potential parameters. This means that the errors returned from these parameters You can narrow down the cause of the error by going through each operation requirement to perform for your desired end result.

1. The [refresh asset balance data](ref:post_vault-accounts-vaultaccountid-assetid-balance) operation requires a valid vault account Id and a valid asset.
2. The [create transaction](ref:post_transactions) operation requires:
   1. A valid asset (can be assumed valid after operation #1 takes place)
   2. A valid amount of said asset (which does not exceed what they have in the wallet)
   3. A valid target address

Referencing the [API Responses page](ref:api-responses) shows that given the operation requirements you should expect to see these error codes:

1. `1503` - invalid asset
2. `11001` - invalid vault account id

You might be asking yourself - what about the amount and the target address? While incorrect in the scope of the example, these values could theoretically be anything (within their given domains, amount as a positive integer, and address as a string of some length).

> **Monitoring transaction status**
>
> The failures caused by amount and destination address values are not covered in this guide. [Please refer to Monitoring transaction status for more information about these specific errors.](doc:monitor-tx-status)

```javascript theme={"system"}
// Fireblocks SDK initialized beforehand and is defined as the parameter - fbks
// There exists some variable which allows us to query a database for information, defined as - dbSvc
async function withdrawal(userId, asset, amount, to){
    if(!dbSvc.userExists(userId)){
        return new Error(`Unknown user: ${userId}`);
    }
    if(!validateToAddress(to, asset)){
          return new Error("The address provided does not match conventions for the asset specificed.");
    }
    // We assume that the information is stored somewhere you are able to retrieve it, but where it's stored is irrelevant, this is merely for the example
    let userVaultAccountId = dbSvc.getVaultAccountForUser(userId);
    let assetBalance = undefined;
    try{
        assetBalance = parseFloat((await fbks.refreshVaultAssetBalance(userVaultAccountId, asset)).available);
    } catch (e) {
        fbksError(e);
    }

    // At this point you might want to do additional checks against different information
    // in your system, depending on what your needs are.

    let txArgs = {
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: userVaultAccountId
        },
        destination: {
            type: PeerType.ONE_TIME_ADDRESS,
            oneTimeAddress: {
                address: to
            }
        },
        operation: TransactionOperation.TRANSFER,
        amount: amount,
        assetId: asset
    };

    try{
        let {txId: id} = (await fbks.createTransaction(txArgs));
        // Continue monitoring the transaction
    } catch (e) {
        fbksError(e);
    }
}

// This function is used as a generic error handler for all FireblocksAPI calls, preventing us from duplicating code and
// allowing us to easily fix issues in a single location. If a call requires custom handling, its catch clause can
// be written without using this function
function fbksError(e){
    let resp = e.response;
    if(resp !== 400) {
        // Handle other errors and return
    }

    let respData = resp.data;
    switch(respData.code){
        case 1503:
            throw new Error("The asset specified is invalid");
        case 11001:
            // In this scenario, since the vault account Id is stored in a local database, we might want to
            // show a different error or potentially raise an alert, depending on your needs.
            throw new Error("The vault account Id used is invalid");
        default:
            // If we didn't map the potential error code, it's important to write as much information
            // about the error as possible, that way we can patch the code with minimal replications or intrusive investigation
            logUnexpectedError(`Faced error: ${util.inspect(respData,false,null,true)} which is not mapped.`);
            throw new Error("Unexpected error - please try again later");
    }
}
```

```python theme={"system"}
# Fireblocks SDK initialized beforehand and is defined as the parameter - fbks
# There exists some variable which allows us to query a database for information, defined as - db_svc
def withdrawal(user_id, asset, amount, to):
    if not db_svc.user_exists(user_id):
        raise Exception(f"User does not exist: {user_id}")
    if not validate_address(to, asset):
        raise Exception("The address provided does not match conventions for the asset specificed.")

    user_vault_account_id = db_svc.get_vault_account_for_user(user_id)
    asset_balance = None
    try:
        asset_balance = fbks.refresh_vault_asset_balance(user_vault_account_id, asset)
    except FireblocksApiException as e:
        fbks_error_handler(e)

    try:
        fbks.create_transaction(
            tx_type=fireblocks_sdk.TRANSACTION_TRANSFER,
            amount=amount,
            source=TransferPeerPath(fireblocks_sdk.VAULT_ACCOUNT, user_vault_account_id),
            destination=DestinationTransferPeerPath(fireblocks_sdk.ONE_TIME_ADDRESS, one_time_address=to)
        )
    except FireblocksApiException as e:
        fbks_error_handler(e)

# This function is used as a generic error handler for all FireblocksAPI calls, preventing us from duplicating code and
# allowing us to easily fix issues in a single location. If a call requires custom handling, its catch clause can
# be written without using this function
def fbks_error_handler(e):
    if e.error_code == 1503:
        raise Exception("The asset specified is invalid")
    elif e.error_code == 11001:
        # In this scenario, since the vault account Id is stored in a local database, we might want to
        # show a different error or potentially raise an alert, depending on your needs.
        raise Exception("The vault account Id used is invalid")
    else:
        # If we didn't map the potential error code, it's important to write as much information
        # about the error as possible, that way we can patch the code with minimal replications or intrusive investigation
        log_unexpected_error(f"Faced error: {e} which is not mapped.")
        raise Exception("Unknown error - please try again later")
```

Let's dissect the above code (almost identical for Python);

1. **Lines 4-6**: Performs checks on the user. (This depends on your business logic.)
2. **Lines 7-9**: Performs validation of the `to` address. Using the asset, you'll see the format of the address to expect. You'll have to define this more thoroughly, however, there are libraries that already provide this functionality.
   1. Example: BTC SegWit will start with `bc1`, and EVM-based chains will be a 40-character hex (with `0x` prefix and checksummed). You'll have to define this more thoroughly, however, there are libraries that already provide this functionality.
3. **Line 11**: Get the vault account id for the user. Similar to #1 it depends on your business logic and specific setup.
4. **Lines 13-17**: Refresh the balance of the provided information (asset and vault account ID), using the try and catch you catch any exceptions, and send them to the generic API handler (this is also specific to your implementation, the way it's described here might not be the correct way to handle it in your code). If there was an error, with one of the expected, we return some descriptive error message which can be changed to explain to the user what to do.
5. **Lines 22-36**: Build the withdrawal transaction.
6. **Lines 39-43**: Send the transaction. Refer to our generic handler for any error generated from creating the transaction.

> **Fixing live error code 11001**
>
> The only part of the above code above that does not apply to live error handling error code `11001`, which specifies an invalid vault account. In this example is derived from a mock database. In live scenarios you will need to decide how to fix this yourself.

## 401 - Unauthorized

This error, though not common, basically occurs when a request that was sent contains either a missing, invalid, or otherwise incorrect JWT, and therefore the transaction fails.

Different codes indicate different reasons for the error caused in the JWT. Unless there is a widespread issue with the SDKs themselves, 401 error response codes will only result from:

1. Signing with a different user's private key (e.g. signing with another API user's key instead of yours)
2. Signing with the correct private key, but the incorrect User ID.

Both scenarios are not directly code related, and will most likely occur during the development stages of integration or executions of impromptu scripts such as staking. As a result, we cannot provide code samples to address this.

[Refer to the API Responses page to review codes related to 401 errors for JWT.](ref:api-responses)

When encountered, simply validate the API User key and API User secret path (make sure it contains the correct private key). A JWT error code might indicate a critical issue on the production server which you should address immediately. If you encounter such an error during production, do the same on the server that the code is running on.

The only other cause of this error is when you do not use the official, unedited Fireblocks SDK (or one of the specific supported side branches). In this instance, modifications to the source code of the Fireblocks SDK caused the error.

To address this, you'll need to check code modification and check if a change was made that would yield such an error. Keep in mind, however, that there is no beneficial need to perform changes to the Fireblocks SDK. Therefore, we will not discuss any further details on this matter.

## 403 - Forbidden

For specific API calls, such as [get audit logs](ref:get_audits) or [list users](ref:get_users), you might receive HTTP status code 403. This is uncommon since the API currently does not include user changes capabilities and only a small number of operations that can trigger 403.

If you see that you might run into the error, test the code prior to moving it to production. This can make certain that your API user has the sufficient permissions needed.

[Refer to the API Responses page to review specific 403 errors.](ref:api-responses)

## 404 - Not Found

A very common error code, "404 not found". This indicates that the page you were looking for, does not exist. Simply, this error message type states that whatever query you performed, whatever information you wanted to get - does not exist.

How to address such an issue:

1. Identify what's missing - These errors usually happen with GET requests, more than with other HTTP methods, and those GET requests are usually no more than 3 different arguments (with some exceptions), to help you pinpoint which one is "incorrect".
2. Address the missing data by either regenerating it using a new Fireblocks API call or raising an exception/error to notify upstream whoever sent this data.

Let's take a look at an example:
We provide some code that is invoked by a different component of the system. This code will query a vault account for the number of different assets this wallet contains. If there are more than 10 different assets, `true`, otherwise, this value is `false`.

Using the [Find a vault account by ID](ref:get_vault-accounts-vaultaccountid) API reference, you know this specific call uses the vault feature, therefore you can quickly identify the likely one:

* `1004` - No vault account by that Id

You can assume this since the response of the API call provides all the data you need, while only needing a single argument - the vault account Id. So, you can identify that this is the most suitable error code.

The code:

```javascript theme={"system"}
// Fireblocks SDK initialized beforehand and is defined as the parameter - fbks
// There exists some variable which allows us to query a database for information, defined as - dbSvc
async function sufficientAssets(userId){
    if(!dbSvc.userExists(userId)){
        return new Error(`Unknown user: ${userId}`);
    }
    // We assume that the information is stored somewhere you are able to retrieve it, but where it's stored is irrelevant, this is merely for the example
    let userVaultAccountId = dbSvc.getVaultAccountForUser(userId);
    try{
        let numberOfAssets = (await fbks.getVaultAccountById(userVaultAccountId)).assets.length;
        return numberOfAssets <= 10;
    } catch (e) {
        fbksError(e);
    }
}

// This function is used as a generic error handler for all FireblocksAPI calls, preventing us from duplicating code and
// allowing us to easily fix issues in a single location. If a call requires custom handling, its catch clause can
// be written without using this function
function fbksError(e){
    let resp = e.response;
    if(resp !== 400) {
        // Handle other errors and return
    }

    let respData = resp.data;
    switch(respData.code){
        case 1004:
            throw new UnknownVaultAccountIdError();
        default:
            // If we didn't map the potential error code, it's important to write as much information
            // about the error as possible, that way we can patch the code with minimal replications or intrusive investigation
            logUnexpectedError(`Faced error: ${util.inspect(respData,false,null,true)} which is not mapped.`);
            throw new Error("Unexpected error - please try again later");
    }
}
```

```python theme={"system"}
# Fireblocks SDK initialized beforehand and is defined as the parameter - fbks
# There exists some variable which allows us to query a database for information, defined as - db_svc
def sufficient_assets(user_id):
    if not db_svc.user_exists(user_id):
        raise Exception(f"User does not exist: {user_id}")

    user_vault_account_id = db_svc.get_vault_account_for_user(user_id)
    try:
        asset_count = len(fbks.get_vault_account_by_id(user_vault_account_id)["assets"])
        return asset_count <= 10
    except FireblocksApiException as e:
        fbks_error_handler(e)

# This function is used as a generic error handler for all FireblocksAPI calls, preventing us from duplicating code and
# allowing us to easily fix issues in a single location. If a call requires custom handling, its catch clause can
# be written without using this function
def fbks_error_handler(e):
    if e.error_code == 1004:
        raise UnknownVaultAccountIdException()
    else:
        # If we didn't map the potential error code, it's important to write as much information
        # about the error as possible, that way we can patch the code with minimal replications or intrusive investigation
        log_unexpected_error(f"Faced error: {e} which is not mapped.")
        raise Exception("Unknown error - please try again later")
```

Let's dissect the code once more (almost identical for python):

1. Lines 4-6: Check the existence of such a `userId`
2. Line 8: Finds the vault account correlated to this `userId`
   1. Let's assume, in this case, that if no such vault account exists in your internal database, you need to add a new entry incrementing from the last added vault account id
3. Lines 9-14: Gets the vault account and counts the number of assets. Returns based on our previous explanation (at most 10).

   If there is an error, handle using the generic error handler. If there is an error code `1004`, you'll receive a specific type of error. This type of error, in our scenario, will generate a new vault account by something upstream from where the error occurred.

***

# 500 status code

500 status code is an indication that there was an issue that happened on the server side. Due to this, it is not possible for us to provide a way to handle such errors in the same manner as we did for the 4xx errors.

We suggest the following:

1. Do not immediately attempt the request again
2. Double-check the parameters you're passing, it might be that one of the parameters you're passing is not formatted correctly, thus resulting in a failure in our backend
3. Check the [status page](https://status.fireblocks.com/) to check if there is an ongoing issue
4. Open a Support ticket / reach out to Support on Slack to see address the issue

***

# Common validations to perform

Generally, validations should be done based on your needs and as soon as you have sufficient details to validate them. This will divide into two potential scenarios (but not limited to those two):

1. You received the value and can immediately perform validation on that value
2. You received the value but some additional data is required before performing the validation

We provide some common validations that can and should be done which will lower your risk of getting errors in your response that is caused by your code.

* Asset validation - When getting an asset, always verify that the asset is indeed a supported one. [More information can be found in the supported assets API reference](ref:get_supported-assets).
* OTA validation - When using one-time address, which is received from the user themselves, ensure that the format of the address matches the format of the network.
  * For example, BTC SegWit will require an address starting with `bc1` and complying with Bech32 formatting. EVMs will be a 40-character checksummed hex string with a prefix of `0x`.
* Amount validation - In cases where you allow users to specify amounts, such as partial withdrawal uses, you'll always need to:
  1. Get the current balance available for the user, either via an API call or via an internal ledger (depending on your business logic).
  2. Verify that the amount is a positive decimal value in the range of (0, retrieved balance] (excluding 0).
* Vault account validation - Ensure the vault account is a non-negative integer.

  You might want to add restrictions (both in your Transaction Authorization Policy and in your code, to prevent access to vault accounts you don't want users to be able to access).
