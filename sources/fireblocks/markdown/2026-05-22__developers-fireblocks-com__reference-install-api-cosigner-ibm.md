> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Install SGX IBM Cloud API Co-signer

## Overview

To install an SGX Co-signer in IBM Cloud and connect it to your workspace, follow these steps:

1. **Setup and configure your IBM Cloud environment**

   Prepare your IBM Cloud environment by creating and configuring the required resources. Ensure it meets the necessary specifications and security settings.

2. **Add a Co-signer to the workspace using an API user**

   Using the Fireblocks Console or APIs, create an API user and use it to add a Co-signer to the workspace.

3. **Install and connect the Co-signer to the workspace**

   Download the installation script to the SGX-capable virtual machine and run the script to install the Co-signer. Once installation is complete, the workspace owner approves the new MPC key shares for the API user through the Fireblocks mobile app.

You can now view the Co-signer and its paired API user in your Fireblocks Console. Additionally, you can retrieve information about them using the Co-signer APIs.

***

## Step 1: Setup and configure your IBM Cloud environment

### 1.1. Allowlist domains

To ensure the Co-signer can be installed and operated successfully, add the following domains to your allowlist:

| Domain                                  | Owner                      |
| --------------------------------------- | -------------------------- |
| `mobile-api.fireblocks.io`              | Fireblocks                 |
| `signurl.fireblocks.io`                 | Fireblocks                 |
| `s3signurl.fireblocks.io`               | Fireblocks                 |
| `fb-certs.s3.amazonaws.com`             | AWS                        |
| `fb-cosigner-images.s3.amazonaws.com`   | AWS                        |
| `fb-customers.s3.amazonaws.com`         | AWS                        |
| `fb-customers.s3.amazonaws.com/uploads` | AWS                        |
| `download.docker.com`                   | Docker                     |
| `registry.gitlab.com`                   | GitLab                     |
| `cdn.registry.gitlab-static.net`        | GitLab                     |
| `gitlab.com`                            | GitLab                     |
| `github.com`                            | GitHub                     |
| `download.01.org`                       | Intel SGX Driver           |
| `bootstrap.pypa.io`                     | Python Software Foundation |
| `files.pythonhosted.org`                | Python Software Foundation |
| `pypi.org`                              | Python Software Foundation |
| `pypi.python.org`                       | Python Software Foundation |

Fireblocks-owned domains differ based on the specific Fireblocks SaaS environment you are connected to. If you are connected to the European or Swiss SaaS, update your allowlist according to the domains listed in the table below:

| Fireblocks SaaS | Domains to Allow                                                                           |
| --------------- | ------------------------------------------------------------------------------------------ |
| Global          | `mobile-api.fireblocks.io`  `signurl.fireblocks.io`  `s3signurl.fireblocks.io`             |
| Europe          | `eu2-mobile-api.fireblocks.io`  `eu2-signurl.fireblocks.io`  `eu2-s3signurl.fireblocks.io` |
| Swiss           | `eu-mobile-api.fireblocks.io`  `eu-signurl.fireblocks.io`  `eu-s3signurl.fireblocks.io`    |

Additionally, ensure port access is configured for the following services:

| Port | Service URL                                      |
| ---- | ------------------------------------------------ |
| 443  | `https://mobile-api.fireblocks.io`               |
| 443  | `https://s3signurl.fireblocks.io`                |
| 443  | `https://fb-certs.s3.amazonaws.com`              |
| 443  | `https://fb-customers.s3.amazonaws.com/uploads/` |
| 443  | `https://bootstrap.pypa.io/get-pip.py`           |
| 443  | `https://download.docker.com/linux`              |
| 443  | `https://download.01.org/intel-sgx/`             |
| 5000 | `https://registry.gitlab.com/customer-cosigner`  |

### 1.2. Create an SGX virtual machine

**The minimum hardware requirements for the VM are:**

* RAM: 32GB
* Storage: 256GB
* OS:
  * Ubuntu 20.04
  * Latest Linux kernel version
  * Latest Intel microcode (BIOS update)

Complete the following steps to create an SGX-capable VM in IBM Cloud:

1. On the Dashboard page, select **Create Resource**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/1e9a3df5b35aca345ebc5e17c6d11f396681f11a8c42c4511b4edf163a57acd8-Screenshot_2024-12-06_161558.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=ed177a8968fe8261e9a08e6b910dbb08" alt="" width="1227" height="637" data-path="images/docs/1e9a3df5b35aca345ebc5e17c6d11f396681f11a8c42c4511b4edf163a57acd8-Screenshot_2024-12-06_161558.png" />

2. Go to **IBM Cloud catalog** > **Compute** > **Bare Metal Servers**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/b884e4f8df0d02f9663dce7ed397e6344f89021ac14f327ac407f957cf6497b7-Screenshot_2024-12-06_161647.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=4e07db986b30d62b29ade17ea1603171" alt="" width="1227" height="644" data-path="images/docs/b884e4f8df0d02f9663dce7ed397e6344f89021ac14f327ac407f957cf6497b7-Screenshot_2024-12-06_161647.png" />

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/3d53339df7c54c843f7e7e2f719eda00408ce23e9ebcfb84bef3e3805fffca54-Screenshot_2024-12-06_161709.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=7be343ebdc1bd061e9ac2d014e5f6189" alt="" width="1226" height="635" data-path="images/docs/3d53339df7c54c843f7e7e2f719eda00408ce23e9ebcfb84bef3e3805fffca54-Screenshot_2024-12-06_161709.png" />

3. In the Server Profile section, select **View all profiles**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/7cfcef2372aaa7c61e80c173562fa512078073b23d8343f44214c8b782321742-Screenshot_2024-12-06_161737.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=3080e5d5f7909f121c6e0b6fee166817" alt="" width="1221" height="598" data-path="images/docs/7cfcef2372aaa7c61e80c173562fa512078073b23d8343f44214c8b782321742-Screenshot_2024-12-06_161737.png" />

4. Select **Intel Xeon E-2174G CPU**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/495a466f6189c2bd24671bc227402b69d7e4c739cc7a01e276f4f1b6a3c966f8-Screenshot_2024-12-06_161911.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=17e04f3afd1b2df5974d2a0d3deee23f" alt="" width="1018" height="858" data-path="images/docs/495a466f6189c2bd24671bc227402b69d7e4c739cc7a01e276f4f1b6a3c966f8-Screenshot_2024-12-06_161911.png" />

5. In the Operating System section, select the following options:
   1. Vendor: Ubuntu
   2. Version: 18.04 LTS (64-bit)
   3. RAM (recommended): 32 GB

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/449fb3a17b0fb4224bdbc3582c644ec51619461973a54d99390b564befdfffbc-Screenshot_2024-12-06_162045.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=10ee68f0bcb95ebd230d6dc1ecc20826" alt="" width="747" height="880" data-path="images/docs/449fb3a17b0fb4224bdbc3582c644ec51619461973a54d99390b564befdfffbc-Screenshot_2024-12-06_162045.png" />

6. Select the **Software Guard Extensions** toggle under Add-ons > **Security and Business Continuity**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/Pe8CxJ47xNI_qfOs/images/docs/fa2ff87006b490f4aa93dc6711f2c0b1ce61468af2723ccdfd5d5b1fb4445024-Screenshot_2024-12-06_162120.png?fit=max&auto=format&n=Pe8CxJ47xNI_qfOs&q=85&s=0927ef101e2064037d6ee301ebcc6e7d" alt="" width="813" height="757" data-path="images/docs/fa2ff87006b490f4aa93dc6711f2c0b1ce61468af2723ccdfd5d5b1fb4445024-Screenshot_2024-12-06_162120.png" />

7. Lastly, create the VM.

### 1.3. Verify SGX is enabled on your VM

After creating your virtual machine, confirm that SGX is enabled. The SGX Co-signer requires a server with SGX enabled and the latest patches applied. This verification ensures smooth operation and avoids potential issues.

To verify that SGX is enabled on the VM, run the following commands with root privileges::

```bash theme={"system"}
 apt update
 apt upgrade
 apt install cpuid
 cpuid -1 | grep -i sgx
```

Verify the following:

1. `SGX`: Software Guard Extensions supported is **true**
2. `SGX_LC`: SGX launch config supported is **true**

<img src="https://mintcdn.com/fireblocks-43c4b3ee/Pe8CxJ47xNI_qfOs/images/docs/fe23ee1939feee21b46aa47061c3d01ab28840989133235e3d3b578d3722630a-Screenshot_2024-12-06_133814.png?fit=max&auto=format&n=Pe8CxJ47xNI_qfOs&q=85&s=79db17bab8bfbeff948a5374cf9a8363" alt="" width="748" height="301" data-path="images/docs/fe23ee1939feee21b46aa47061c3d01ab28840989133235e3d3b578d3722630a-Screenshot_2024-12-06_133814.png" />

### 1.4. Additional security recommendations

It is highly recommended to control user and network access to Co-signer's machine. See [API Co-signer security checklist and recommended defense and monitoring systems](/docs/co-signer-security-checklist-defense-monitoring) for further information.

***

## Step 2: Add a Co-signer to the workspace using an API user

Follow the instructions to [add a new Co-signer to the workspace](/reference/install-api-cosigner-add-new-cosigner-p2). Ensure you copy to your clipboard the following items, which you will use during the installation process:

* The API user's pairing token
* The download link of the Co-signer's installation script

***

## Step 3: Install and connect the Co-signer to the workspace

> **Note:** You must have root privileges on the Co-signer machine to install the Co-signer. Ensure you are logged in as a root user or use `sudo` to execute the commands.

### 3.1. Download the installation script

Using the download link of the SGX Co-signer installation script you copied from the Console, run the `curl` command to download the package directly to your machine.

Paste the appropriate URL into the following command:

```bash theme={"system"}
curl -o cosigner "URL"
```

### 3.2. Run the installation script

After downloading the installation script, navigate to the directory containing the script and modify the script's permissions to make it executable:

```bash theme={"system"}
chmod +x cosigner
```

To install the Co-signer, run:

```bash theme={"system"}
./cosigner setup
```

You will be prompted to enter the **Pairing token** for the API user, which you retrieve from the Fireblocks Console. This token pairs the API user with the Co-signer.

At this stage, you will have the option to configure the Callback Handler parameters for the API user connecting the Co-signer to the workspace. This feature is optional. You can [configure it later through the Console, APIs, or locally](/reference/api-cosigner-operate) from the Co-signer's host machine.

For detailed instructions on setting up your Callback Handler's interface to the Co-signer and implement its logic and code, refer to the [Setup API Co-signer Callback Handler](/reference/api-cosigner-setup-callback-handler) section.

The setup process validates the machine's hardware and installs the necessary drivers to support the appropriate SGX version and the SGX Co-signer's executable image. It includes an attestation flow to ensure that the SGX Co-signer's executable runs securely inside an Intel SGX enclave. Additionally, the script installs other required components.

Once the installation is complete, the Co-signer will automatically start running. At the end of the process, the Co-Signer generates a JSON configuration file, which can be used for future configuration updates.

### 3.3: Approve MPC key shares for the API user

If the API user used to pair with the Co-Signer and connect it to your workspace has an Admin or User role, the workspace owner will receive a notification. This notification will prompt them to approve a new MPC key share request for that API user using the Fireblocks mobile app.

You can now see the Co-signer you installed in the Co-signers tab within the Console's Developer Center. Observe it is online and that the API user is paired to it.

***

> **To check the Co-signer's status and observe the logs, see the SGX Co-signer Maintenance article.**
