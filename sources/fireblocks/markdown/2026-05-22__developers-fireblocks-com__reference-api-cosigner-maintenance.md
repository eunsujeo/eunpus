> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# API Co-signer Maintenance

This article outlines the most common maintenance operations for Co-signers. Since each Co-signer type has a unique architecture and is installed in a specific environment, refer to the relevant article for detailed maintenance instructions for your Co-signer type.

> **Note**: Due to the enclave architecture of the Google Cloud Confidential Space Co-signer, maintenance operations can only be performed through Google Cloud's portal or using `gcloud`.

Co-signer maintenance include:

* View the logs
* Observe the status
* List the paired API users
* Retrieve the public key (used for the Callback Handler JWT authentication)
* Stop the Co-signer
* Restart the Co-signer
* Retrieve the running version
* Update the Co-signer
* Migrate to a new machine
* Configure a proxy server
* Configure the communication protocol

Use the [Co-signer management tab](https://support.fireblocks.io/hc/en-us/articles/17923671680540-The-Co-signer-management-tab) to observe the Co-signer's online / offline status and the list of paired API users and refer to the following guides to learn about platform-specific Co-signer maintenance:

<CardGroup cols={3}>
  <Card title="AWS Nitro" img="https://mintcdn.com/fireblocks-43c4b3ee/Pe8CxJ47xNI_qfOs/images/docs/fd86eebab344ef5d293268881a57d315a559d86dfe79eebd12486d680885f21a-Asset_10300x_1.png?fit=max&auto=format&n=Pe8CxJ47xNI_qfOs&q=85&s=71d1668e6031d0e356b4257a863af609" href="/reference/api-cosigner-maintenance-aws-nitro" width="252" height="253" data-path="images/docs/fd86eebab344ef5d293268881a57d315a559d86dfe79eebd12486d680885f21a-Asset_10300x_1.png">
    AWS Nitro Co-signer maintenance
  </Card>

  <Card title="GCP Confidential Space" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/5ca73c3e63d6abb29bb2e9959b25433188bc7157e30760a90027f40fe7ad0554-Asset_6300x.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=75d77b7c04505591550e37242bb8d133" href="/reference/api-cosigner-maintenance-gcp-confspace" width="253" height="253" data-path="images/docs/5ca73c3e63d6abb29bb2e9959b25433188bc7157e30760a90027f40fe7ad0554-Asset_6300x.png">
    Google Cloud Confidential Space Co-signer maintenance
  </Card>

  <Card title="Intel SGX" img="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/7d9aa427c05bac0694c1f9560b5414a7f94a81720855308caf259359ba954984-Asset_7300x_2.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=6bb4ac8fbd19d186f7a3cca817eefc92" href="/reference/api-cosigner-maintenance-sgx" width="252" height="253" data-path="images/docs/7d9aa427c05bac0694c1f9560b5414a7f94a81720855308caf259359ba954984-Asset_7300x_2.png">
    SGX-based Co-signer maintenance on Azure, On-Premise, IBM Cloud, or Alibaba Cloud
  </Card>
</CardGroup>
