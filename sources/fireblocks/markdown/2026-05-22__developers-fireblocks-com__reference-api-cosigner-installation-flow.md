> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# API Co-signer Deployment Options and Installation Flow

This article outlines the available deployment options and the process for setting up a Co-signer to enable automatic transaction signing and approval of workspace configuration changes.

## API Co-signer installation flow

After installing the Co-signer, configure the [Policy](https://support.fireblocks.io/hc/en-us/articles/7354983580316-About-the-TAP) to [designate the API user](https://support.fireblocks.io/hc/en-us/articles/7365877039004-Rule-parameters#h_01HGBN9QQ0T42NR8XT4Y96V7YH) paired with the Co-signer as the signer. This ensures that when a transaction meets the criteria defined in the policy, it will be automatically signed by the Co-signer that is paired to the specified API user.

### Step 1: Setup and configure your deployment environment

Setup and configure the resources needed for the Co-signer to function within your environment. Additionally, configure your network and security services to allow access to the domains required for the Co-signer's installation and operation.

### Step 2: Add a new Co-signer to the workspace using an API user

Using the Fireblocks Console or APIs, create an API user and use it to add a new Co-signer to the workspace.

### Step 3: Install and connect the Co-signer to the workspace

After preparing and configuring all necessary resources, download and run the installation script that matches your Co-signer type. Please select to deployment options below depending on which environment you have.

## API Co-signer deployment options

> **The environment setup and Co-signer installation process vary based on the chosen Co-signer type and deployment environment.**
>
> Click on the links below for detailed step-by-step setup and installation instructions

<CardGroup cols={2}>
  <Card title="Azure SGX" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/a16dd0775d8db32b488d3073bef8dd66d15d83713718c5b6c5a5004626a12851-Asset_9300x_1.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=4e09c7b23853e1f648d06515db4e184a" href="/reference/install-api-cosigner-azure" width="252" height="253" data-path="images/docs/a16dd0775d8db32b488d3073bef8dd66d15d83713718c5b6c5a5004626a12851-Asset_9300x_1.png">
    Install in Microsoft Azure
  </Card>

  <Card title="On-Prem SGX" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/a16dd0775d8db32b488d3073bef8dd66d15d83713718c5b6c5a5004626a12851-Asset_9300x_1.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=4e09c7b23853e1f648d06515db4e184a" href="/reference/install-api-cosigner-onprem" width="252" height="253" data-path="images/docs/a16dd0775d8db32b488d3073bef8dd66d15d83713718c5b6c5a5004626a12851-Asset_9300x_1.png">
    Install On-Premise
  </Card>

  <Card title="AWS Nitro" img="https://mintcdn.com/fireblocks-43c4b3ee/Pe8CxJ47xNI_qfOs/images/docs/fd86eebab344ef5d293268881a57d315a559d86dfe79eebd12486d680885f21a-Asset_10300x_1.png?fit=max&auto=format&n=Pe8CxJ47xNI_qfOs&q=85&s=71d1668e6031d0e356b4257a863af609" href="/reference/install-api-cosigner-aws" width="252" height="253" data-path="images/docs/fd86eebab344ef5d293268881a57d315a559d86dfe79eebd12486d680885f21a-Asset_10300x_1.png">
    Install in Amazon Web Services
  </Card>

  <Card title="GCP Confidential Space" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/5ca73c3e63d6abb29bb2e9959b25433188bc7157e30760a90027f40fe7ad0554-Asset_6300x.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=75d77b7c04505591550e37242bb8d133" href="/reference/install-api-cosigner-gcp" width="253" height="253" data-path="images/docs/5ca73c3e63d6abb29bb2e9959b25433188bc7157e30760a90027f40fe7ad0554-Asset_6300x.png">
    Install in Google Cloud
  </Card>

  <Card title="Alibaba Cloud SGX" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/7385442544ce2a2771fbe492a6b29fd380425be1ae726173d71cb0d3e0c3782b-Asset_8300x_1.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=98f7e2d8425ac89dd842754ee27d36cb" href="/reference/install-api-cosigner-alibaba" width="253" height="253" data-path="images/docs/7385442544ce2a2771fbe492a6b29fd380425be1ae726173d71cb0d3e0c3782b-Asset_8300x_1.png">
    Install in Alibaba Cloud
  </Card>

  <Card title="IBM Cloud SGX" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/7d9aa427c05bac0694c1f9560b5414a7f94a81720855308caf259359ba954984-Asset_7300x_2.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=6bb4ac8fbd19d186f7a3cca817eefc92" href="/reference/install-api-cosigner-ibm" width="252" height="253" data-path="images/docs/7d9aa427c05bac0694c1f9560b5414a7f94a81720855308caf259359ba954984-Asset_7300x_2.png">
    Install in IBM Cloud
  </Card>
</CardGroup>
