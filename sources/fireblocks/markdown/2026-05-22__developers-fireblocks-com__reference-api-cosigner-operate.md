> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Operating the API Co-signer

Once the Co-signer is connected to your workspace, you can manage it through the Console or APIs. This includes sending commands such as pairing additional API users or configuring the Callback Handler for a paired API user.

For all types of SGX Co-signers and the AWS Nitro Co-signer, all operations can also be performed via the command-line interface (CLI) on the Co-signer's host machine.

However, due to the enclave architecture of the Google Cloud Confidential Space Co-signer, all operations on this type of Co-signer must be performed exclusively through the Console or APIs.

## Co-signer API operations

Refer to [Fireblocks Cosigners API](/reference/getcosigners) for the list of Co-signer operations you can do using Fireblocks APIs.

The operations include:

* Get all the Co-signers that are connected to the workspace
* Get the details of a specific Co-signer that is connected to the workspace
* Rename the Co-signer
* Get a list of all the API users that are paired with the Co-signer
* Get the details of a specific API user that is paired with the Co-signer
* Add a Co-signer to the workspace
* ❗ Pair an additional API user with a Co-signer
* Unpair an API user from a Co-signer
* ❗Update the callback handler of a paired API user

> **The operations that are marked with ❗ will only work with Co-signers with the following versions:**
>
> * SGX Co-signer: version 3.7.1 or later
> * AWS Nitro Co-signer: version 2.0.5 or later
> * Google Cloud Confidential Space Co-signer: version 0.9.4 or later

***

## Co-signer Console operations

For a detailed description of the Co-signer operations available through the Console, visit the [Co-signer Management tab](https://support.fireblocks.io/hc/en-us/articles/17923671680540-The-Co-signers-management-tab) in the Help Center.

***

## Co-signer command-line operations

This section covers operations related to Co-signer management, including adding and configuring API users. For maintenance operations such as viewing logs, updating the Co-signer, and more, refer to the [API Co-signer maintenance](/reference/api-cosigner-maintenance) article.

### List the paired API users

You can list all API users paired with the Co-signer across the connected workspaces by running the following command:

```bash theme={"system"}
./cosigner list-users
```

The output will display a list of all API users paired with your Co-Signer, including the workspace name they are connected to, the API user's ID (its API key), and the associated Callback Handler server URL (if applicable).

### Add API user

You can pair an additional API user with your Co-Signer instance by running the following command:

```bash theme={"system"}
./cosigner add-user
```

> **Note:** This command works only after the first API user has been paired during the Co-Signer installation.

You will be prompted to provide the API user's pairing token, which can be retrieved from the Console. If you opt to connect this API user with a Callback Handler, you must also provide the Callback Handler's URL and its public key or certificate. For more information, refer to the **Setup API Co-Signer Callback Handler** article.

### Setup and update Callback Handler for API user

You can setup the Callback Handler for an API user paired with the Co-signer, provided it does not already have a configured Callback Handler, by running the following command:

```bash theme={"system"}
./cosigner callback-update [API user ID]
```

If only one API user is paired with your Co-Signer, you don't have to specify the `API user ID` , which is its API key.

If you want to configure the URL of the Callback Handler of an API user that is paired with the Co-signer, run the following command:

```bash theme={"system"}
./cosigner callback-update [API user ID]
```

You will be prompted to enter the URL and public key or certificate parameters, but **only the URL you provide will be updated**. To change the Callback Handler's public key or the certificate through the CLI, you must unpair (re-enroll) the API user and pair it again with the Co-Signer using the `add-user` CLI command.

Note that if only one API user is paired with your Co-Signer, unpairing (re-enrolling) the API user results in a full Co-signer setup to initialize the API user and pair it with the new Callback Handler.

Alternatively, instead of unpairing the API user and pairing it again, you can configure the Callback Handler's public key or certificate of an API user that is paired with the Co-signer using APIs or through the Console.

> Note: To configure the Callback Handler's public key or certificate using APIs or through the Console, your Co-signer should meet the requirements for Co-signer platform commands, as described in the [Co-signer API operations section](/reference/api-cosigner-operate#co-signer-api-operations) within this article,
