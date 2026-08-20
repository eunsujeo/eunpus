> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Install Google Cloud Confidential Space API Co-signer

## Overview

To install a Confidential Space Co-signer in Google Cloud and connect it to your workspace, follow these steps:

1. **Setup and configure your Google Cloud environment**
   Prepare your Google Cloud environment and the machine where you plan to install the Co-signer from (e.g., your laptop).
2. **Add a Co-signer to the workspace using an API user**
   Using the Fireblocks Console or APIs, create an API user and use it to add a Co-signer to the workspace.
3. **Install and connect the Co-signer to the workspace**
   Download the installation script to the machine where you plan to execute it, run the script to set up the necessary Google Cloud resources, and install the Co-signer. Once installation is complete, the workspace owner approves the new MPC key shares for the API user through the Fireblocks mobile app.

You can now view the Co-signer and its paired API user in your Fireblocks Console. Additionally, you can retrieve information about them using the Co-signer APIs.

## Step 1: Set up and configure your Google Cloud environment

Proper configuration of your Google Cloud environment is straightforward but must be performed step by step in the specified order. The installation script automates the resource creation and setup process and it is not recommended to change it. Any misconfiguration could compromise the Co-signer's functionality or security.

### 1.1. Allowlist Domains

To ensure the Co-signer can be installed and operated successfully, add the Fireblocks' domains to your allowlist. Fireblocks-owned domains differ based on the specific Fireblocks SaaS environment you are connected to. If you are connected to the European or Swiss SaaS, update your allowlist according to the domains in the table below.

| Fireblocks SaaS | Domains to Allow                                                                   |
| --------------- | ---------------------------------------------------------------------------------- |
| Global          | `mobile-api.fireblocks.iosignurl.fireblocks.ios3signurl.fireblocks.io`             |
| Europe          | `eu2-mobile-api.fireblocks.ioeu2-signurl.fireblocks.ioeu2-s3signurl.fireblocks.io` |
| Swiss           | `eu-mobile-api.fireblocks.ioeu-signurl.fireblocks.ioeu-s3signurl.fireblocks.io`    |

### 1.2. Install the required software packages

Ensure the following software packages are installed on the machine where you will run the installation script (e.g., your laptop):

* [**gcloud**](https://cloud.google.com/sdk/gcloud): The installation script automates the setup process by using gcloud and prompts you for the required inputs. It assumes you have the necessary credentials and permissions for your Google Cloud account. **gcloud sdk version of 396+ is required.**
* **uuidgen**: used for generating the Co-signer’s unique ID during installation.
* **jq**: used to create an output JSON configuration file.

The installation script uses those packages to create the resources and install the Co-signer.

### 1.3. Ensure account permissions for the required Google Cloud resources

You must have the necessary Google Cloud account permissions to enable network access to required domains and to create and configure the following resources:

* Project
* IAM Role
* Workload Identity Pool provider
* Customer Managed Key (CMK)
* Bucket
* Workload Container

### 1.4. Additional security recommendations

It is highly recommended to control user and network access to your Google Cloud environment. See [API Co-signer security checklist and recommended defense and monitoring systems](/docs/co-signer-security-checklist-defense-monitoring) for further information.

## Step 2: Add a Co-signer to the workspace using an API user

Follow the instructions to [add a new Co-signer to the workspace](/reference/install-api-cosigner-add-new-cosigner-p2). Ensure you copy to your clipboard the following items, which you will use during the installation process:

* The API user's pairing token
* The download link of the Co-signer's installation script

## Step 3: Install and connect the Co-signer to the workspace

### 3.1. Download and unpack the installation package

Using the download link of the GCP Co-signer installation package you copied from the Console, run the `wget` command to download the package directly to your machine.

Paste the appropriate URL into the following command:

`wget -O gcp-cosigner.zip "URL"`

Unpack the installation package by running the following command:

`tar -xzvf gcp-cosigner.zip`

### 3.2. Run the installation script

1. Log in to gcloud with `gcloud auth login`.
2. The installation package contains an installation script. To install the Co-signer, navigate to the directory where the installation package was unpacked and run `client_install_gcp_api_cosigner_script.sh` script in an interactive shell and respond to prompts as the script executes.
3. When prompted, select option **"1 - Create"** for first-time setup.

### 3.3. Approve MPC key shares for the API user

If the API user used to pair with the Co-Signer and connect it to your workspace has an Admin or User role, the workspace owner will receive a notification. This notification prompts them to approve a new MPC key share request for that API user in the Fireblocks mobile app.

You can now see the Co-signer you installed in the Co-signers tab within the Console's Developer Center. [Observe that it is online](/reference/api-cosigner-maintenance-gcp-confspace) and that the API user is paired to it.

## **Proxy configuration (optional)**

The Co-signer can route outbound traffic through an HTTPS proxy. When a proxy is configured, the Co-signer automatically switches from WebSocket to long-polling (REST), since WebSocket connections cannot reliably traverse proxies.

The script prompts you for a proxy URL during installation. If you don't need a proxy, press **Enter** to skip this step.

```text theme={"system"}
Please enter HTTPS proxy URL [can be empty; e.g. http://proxy:8080 or http://user:pass@proxy:8080]:
```

To authenticate to the proxy, include the credentials directly in the URL:

```http theme={"system"}
http://username:password@proxy.example.com:8080
```

The proxy URL — including any credentials — is encrypted immediately using your Cloud KMS key and is never stored in plaintext. Only the encrypted value is written to the `cloud-resources-*.yaml` file.

If you provide a proxy URL, the script also prompts for `NO_PROXY` patterns: a comma-separated list of hosts that should bypass the proxy. The recommended defaults are:

```text theme={"system"}
169.254.169.254,metadata.google.internal,googleapis.com
```

These cover the GCP metadata server and Google APIs, which must remain reachable directly.

**For non-interactive installs**, set these fields in your `install-config.yaml`:

```yaml theme={"system"}
# Optional proxy fields
proxy_url: http://username:password@proxy.example.com:8080
no_proxy: 169.254.169.254,metadata.google.internal,googleapis.com
```
