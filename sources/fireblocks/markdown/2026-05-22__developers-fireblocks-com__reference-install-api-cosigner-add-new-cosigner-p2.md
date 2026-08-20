> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Add a new Co-signer to the workspace

To connect a new Co-signer to your workspace, pair it with an API user from the workspace. It is recommended to create a new API user for that purpose. The pairing process for the first API user requires admin-level access to the Fireblocks Console and the owner's availability to approve the necessary workspace configuration operations.

Pairing the Co-signer is performed using a JWT-encoded Pairing Token obtained from the Console for a specific API user. This pairing token is used during Co-signer installation to pair the initial API user, enabling communication with Fireblocks' SaaS. The Co-signer is identified exclusively by the workspace and the API user used to establish the connection.

***

## Prerequisites

During installation, you will use the following items from the Fireblocks Console. Copy them to your clipboard for later use.

* The API user's pairing token
* The download link of the installation script that matches your Co-signer type: Intel SGX, AWS Nitro, or Google Cloud Confidential Space.

***

## Step 1: Add a new API user

Add a new API user to the workspace using the [Fireblocks APIs](https://docs.fireblocks.com/api/swagger-ui/#/Api%20User/createApiUser) or the **API users** tab in the Console's Developer Center. This API user will enable the Co-signer to connect to the workspace.

* Enter the name of the new API user (you can enter up to 30 characters)
* Select the role you want to assign to the API user
* Attach [a CSR file](/docs/generate-a-csr-for-an-api-user)

> **Important note**
>
> While the Co-signer does not use the CSR file to connect to the workspace, you must still provide it. This is necessary because the API user can be used to make API calls.

***

## Step 2: Add a new Co-signer to the workspace

Add a new Co-signer to the workspace using the [Fireblocks Co-signer APIs](https://docs.fireblocks.com/api/swagger-ui/#/Cosigners%20\(Beta\)) or the **Co-signers** tab in the Console's Developer Center.

To add a new Co-signer to the workspace, click **Add co-signer** and follow the instructions:

* Enter the name of the new Co-signer
* Select **Install a new co-signer on the local machine** and press **Continue**
* Choose an available API user from the list (only API users not already paired with Co-signers will be displayed)
* Click **Add** to create a new Co-signer entry

The new Co-signer will now appear in the list of Co-signers in the Co-signers tab. It is not yet connected to the workspace, so it appears as offline. The connection will be established once you complete the installation process.

***

## Step 3: Copy the API user's pairing token & the installation script's download link

Click **Pair API user** in the new Co-signer's entry to open a dialog, and follow the instructions:

* Copy the API user's pairing token to your clipboard. In mainnet workspaces, the pairing token is valid for one hour.
* Copy the download link for the AWS Nitro Co-signer installation package (found under "Manual") to your clipboard. This link is valid for seven days.

> **Need help?**
>
> If you have any issues with finding or retrieving the download link of the Co-signer's installation script in the Console, [contact Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new).
