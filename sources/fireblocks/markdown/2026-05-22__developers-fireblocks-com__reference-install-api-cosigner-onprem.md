> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Install SGX On-prem API Co-signer

## Overview

To install an SGX Co-signer on-premises and connect it to your workspace, follow these steps:

1. **Setup and configure your on-prem environment:** Prepare your on-prem environment by creating and configuring the required resources. Ensure it meets the necessary specifications and security settings.
2. **Add a Co-signer to the workspace using an API user:** Using the Fireblocks Console or APIs, create an API user and use it to add a Co-signer to the workspace.
3. **Install and connect the Co-signer to the workspace:** Download the installation script to the SGX-capable machine, then run it to install the Co-signer. Once installation is complete, the workspace owner approves the new MPC key shares for the API user through the Fireblocks mobile app.

You can now view the Co-signer and its paired API user in your Fireblocks Console. Additionally, you can retrieve information about them using the Co-signer APIs.

## Step 1: Set up and configure your on-prem environment and SGX server

### Step 1.1: Allowlist domains

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
| `github.com`                            | GitHub                     |
| `cdn.registry.gitlab-static.net`        | GitLab                     |
| `gitlab.com`                            | GitLab                     |
| `registry.gitlab.com`                   | GitLab                     |
| `download.01.org`                       | Intel SGX Driver           |
| `bootstrap.pypa.io`                     | Python Software Foundation |
| `files.pythonhosted.org`                | Python Software Foundation |
| `pypi.org`                              | Python Software Foundation |
| `pypi.python.org`                       | Python Software Foundation |

Fireblocks-owned domains differ based on the specific Fireblocks SaaS environment you are connected to. If you are connected to the European or Swiss SaaS, update your allowlist according to the domains listed in the table below:

| Fireblocks SaaS | Domains to Allow                                                                         |
| --------------- | ---------------------------------------------------------------------------------------- |
| Global          | `mobile-api.fireblocks.io` `signurl.fireblocks.io` `s3signurl.fireblocks.io`             |
| Europe          | `eu2-mobile-api.fireblocks.io` `eu2-signurl.fireblocks.io` `eu2-s3signurl.fireblocks.io` |
| Swiss           | `eu-mobile-api.fireblocks.io` `eu-signurl.fireblocks.io` `eu-s3signurl.fireblocks.io`    |

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

### Step 1.2: Set up and configure an on-prem SGX server

Your on-prem SGX server should meet the following hardware requirements:

* **CPU processor:** Only one of the following [Intel® processors](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions-processors.html)
* **CPU cores:** Minimum 4
* **OS:** Ubuntu 22.04 LTS or 24.04 LTS (Canonical) with -
  * Latest Linux kernel version
  * Latest Intel microcode (BIOS update)
* **RAM:** Minimum 16GB
* **Storage:** Minimum 128GB
* **SGX Memory:** Minimum 2GB EPC

> **Fireblocks also supports on-prem SGX servers installed on OVHcloud providers.**

Additionally, configure your on-prem SGX server BIOS to match the following setup:

* Enable Intel SGX (Software Guard Extension)
* Enable DCAP (FLC)
* Disable hyper threading
* Disable Intel SpeedStep Technology
* Disable Onboard VGA

### Step 1.3: Verify SGX is enabled on your SGX server

After setting up your on-prem SGX server, confirm that SGX is enabled. The SGX Co-signer requires a server with SGX enabled and the latest patches applied. This verification ensures smooth operation and avoids potential issues.

To verify that SGX is enabled on the VM, run the following commands with root privileges:

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

### Step 1.4: Install the SGX drivers

1. [Subscribe to the Intel PCS for ECDSA Attestation and to obtain the required API keys](https://api.portal.trustedservices.intel.com/provisioning-certification).
2. Set up Intel's reference caching service, the Provisioning Certification Caching Service (PCCS):
   1. **Redhat/Debian:** [Installation Guide, page 39](https://download.01.org/intel-sgx/latest/dcap-latest/linux/docs/Intel_SGX_SW_Installation_Guide_for_Linux.pdf?#page=39)
   2. **Another Debian approach:** Follow the steps in the document above (intel-dcap.pdf), but skip the *Verify the empty cache* step.
   3. **Cache Fill Mode:** [Intel SGX DCAP Caching Service Design Guide, page 38](https://download.01.org/intel-sgx/latest/dcap-latest/linux/docs/SGX_DCAP_Caching_Service_Design_Guide.pdf#page=38)
3. Provision the Intel SGX-enabled platform for Intel SGX workloads. The goal is to run PCKIDRetrievalTool. *Make sure pckid\_retrieval.csv is created.* This file will be used to register the CPU data with Intel. Without this registration, the remote attestation will fail.
   1. **Debian resources:** [Intel SGX DCAP Quick Install Guide, page 4](https://drive.google.com/file/d/1lZWM4_dTSdOID9PdKGFDenkyi4DA9OR8/view)
   2. **Redhat resources:** Download the binary file from one of these locations:
      1. [https://download.01.org/intel-sgx/sgx-dcap/1.18/linux/distro/rhel8.6-server/](https://download.01.org/intel-sgx/sgx-dcap/1.18/linux/distro/rhel8.6-server/)
      2. [https://github.com/intel/SGXDataCenterAttestationPrimitives/tree/main/tools/PCKRetrievalTool](https://github.com/intel/SGXDataCenterAttestationPrimitives/tree/main/tools/PCKRetrievalTool)
4. Convert the pckid\_retrieval.csv file to JSON format using this Python script and submit it to Intel for registration. You can view a sample JSON [here](https://drive.google.com/file/d/1x9NCvFHYMR8-MaauEWspZZAsZjU6qjdS/view).

   ```python theme={"system"}
   import json
   import sys

   if len(sys.argv) != 2 and len(sys.argv) != 3:
       print("usage: pckid2json <pckid file path> <outputfile>")
       exit(0)

   f = open(sys.argv[1], 'r')
   data = f.read().split(',')
   f.close()

   if len(data) == 5:
       print("WARNING: platform metadata is missing from pckid file")
   elif len(data) != 6:
       print("ERROR: pckid file has invalid format")
       exit(-1)

   obj = {}
   obj['enc_ppid'] = data[0]
   obj['pce_id'] = data[1]
   obj['cpu_svn'] = data[2]
   obj['pce_svn'] = data[3]
   obj['qe_id'] = data[4]
   if len(data) == 6:
       obj['platform_manifest'] = data[5]

   if len(sys.argv) == 3:
       f = open(sys.argv[2], 'w')
       json.dump(obj, f)
       f.close()
   else:
       print(json.dumps(obj))
   ```

   1. For more information about the registration process, visit the following references:
      1. [Design Guide for Intel SGX PCCS, page 20](https://download.01.org/intel-sgx/latest/dcap-latest/linux/docs/SGX_DCAP_Caching_Service_Design_Guide.pdf#page=20\&zoom=100,92,200)
      2. [Get PCK Certificates, V4](https://api.portal.trustedservices.intel.com/content/documentation.html#pcs-certificates-v4)
5. When prompted to verify the provisioning data, skip this step.
6. Reimage the Intel SGX-enabled platform.
7. Load the Intel SGX runtime stack onto the reimaged system:
   1. **Debian:** Refer to the [Intel SGX DCAP Quick Install Guide, page 5](https://drive.google.com/file/d/1lZWM4_dTSdOID9PdKGFDenkyi4DA9OR8/view). Note that steps 5 and 6 are bulked up in the "Runtime configuration" section.
   2. **Redhat:** Refer to the [Intel Confidential Computing Documentation](https://cc-enabling.trustedservices.intel.com/intel-sgx-sw-installation-guide-linux/01/introduction/).

### Step 1.5: Registration with Intel

1. Follow the registration instructions located [here](https://api.portal.trustedservices.intel.com/content/documentation.html#pcs-tcb-info-v4). Note that you'll need the JSON format of the pckid\_retrieval.csv file for this step.

2. Verify that your CSV is registered with Intel via Fireblocks:

   ```bash theme={"system"}
   curl -L
   "https://mobile-api.fireblocks.io/sgx/certification/v3/pckcert?qeid=FC88E54A32E9BE6455A01CE78A55B85C&encrypted_ppid=635DBA646F13077DC75291B12ABE96D4D69A956D7FF5524D8090290EEB8ACC6450F72CD7539D1578E636911321D96E0CEC15E04FACBC7652DE1775F76DF460D472A7F5C8118B22C37F4590789F46161D99F2758D120C5BD4CD8FD302C444F56E620A98DFAFD156887B73DAEEB04EA6C9007C2EEB9B00DF49FBBD4B9535B8DB61445A28F73CADDADB36B27E35DACE6A4287621D2FF6E01B31C579FC9D73512B631558427370020DAB10DF315D740400ED73D64AACBFC76A0B88975A52086CD656809A58821A9B8516A4571BF33CBA042B76EC4409745635ADF2DE5F62FA8C0F6E4970712209F3D2EF83E5850646105B841F1905CB3E7F5AE21BF8759250C9981F8DEA229265CC619D9990842AC71739BCF155FCBA6AD262EDF04AA8A9E668E2F87A3FA822E7F6F330CA955C9B6244E5C35BFA71DA08655C1244156E598F97B97BAF1DF6CF79B624E5129AF190A24930436BDCC2371BEA322EEF2D733769372D5F763763B937BF680D4245441F234623051FAFCF0DA8FA79D744E3F261FD352275&cpusvn=0C0C0F0EFFFF01000000000000000000&pcesvn=0C00&pceid=0000"
   ```

3. A certificate will appear in the response if the registration was successful:

   ```yaml theme={"system"}
   -----BEGIN CERTIFICATE-----
   MIIE8jCCBJigAwIBAgIUUWcKdCIgJwOmz/lT0UrRd9zVUU8wCgYIKoZIzj0EAwIw
   cDEiMCAGA1UEAwwZSW50ZWwgU0dYIFBDSyBQbGF0Zm9ybSBDQTEaMBgGA1UECgwR
   SW50ZWwgQ29ycG9yYXRpb24xFDASBgNVBAcMC1NhbnRhIENsYXJhMQswCQYDVQQI
   DAJDQTELMAkGA1UEBhMCVVMwHhcNMjQxMjAzMDg1MzA2WhcNMzExMjAzMDg1MzA2
   …….
   …….
   …….
   -----END CERTIFICATE-----
   ```

## Step 2: Add a Co-signer to the workspace using an API user

Follow the instructions to [add a new Co-signer to the workspace](/reference/install-api-cosigner-add-new-cosigner-p2). Ensure you copy to your clipboard the following items, which you will use during the installation process:

* The API user's pairing token
* The download link of the Co-signer's installation script

## Step 3: Install and connect the Co-signer to the workspace

> **You must have root privileges on the Co-signer server to install the Co-signer**
>
> Ensure you are logged in as a root user or use `sudo` to execute the commands.

### Step 3.1: Download the installation script

Using the download link of the SGX Co-signer installation script you copied from the Console, run the `curl` command to download the package directly to your machine.

Paste the appropriate URL into the following command:

```bash theme={"system"}
curl -o cosigner "URL"
```

### Step 3.2: Run the installation script

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

For detailed instructions on setting up your Callback Handler's interface to the Co-signer and implementing its logic and code, refer to the [Setup API Co-signer Callback Handler](/reference/api-cosigner-setup-callback-handler) section.

The setup process validates the machine's hardware and installs the necessary drivers to support the appropriate SGX version and the SGX Co-signer's executable image. It includes an attestation flow to ensure that the SGX Co-signer's executable runs securely inside an Intel SGX enclave. Additionally, the script installs other required components.

Once the installation is complete, the Co-signer will automatically start running. At the end of the process, the Co-Signer generates a JSON configuration file, which can be used for future configuration updates.

### Step 3.3: Approve MPC key shares for the API user

If the API user used to pair with the Co-Signer and connect it to your workspace has an Admin or User role, the workspace owner will receive a notification. This notification prompts them to approve a new MPC key share request for that API user in the Fireblocks mobile app.

You can now see the Co-signer you installed in the Co-signers tab within the Console's Developer Center. Observe it is online and that the API user is paired to it.

> **To check the Co-signer's status and observe the logs, see the SGX Co-signer Maintenance article.**
