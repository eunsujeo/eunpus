> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# API Co-signer Management

In addition to manual transaction signing and Workspace configuration approvals using a mobile device, you can automate signing and approvals with an API Co-signer. This is ideal for workspaces that handle high transaction volumes or frequent activity.

A Co-signer is connected to a workspace by pairing it with an [API user](https://support.fireblocks.io/hc/en-us/articles/4407823826194-Adding-new-API-Users). Once connected, assuming the API user has a [Signer](https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles#h_01H9P4D2W1436XZYXESPTQE2J7) or [Admin](https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles#h_01H9P4D2W138W3F36TX45S8WFX) role, you will be asked to approve MPC key shares for that API user.

To activate automatic signing through the Co-signer, configure the [Policy](https://support.fireblocks.io/hc/en-us/articles/7354983580316-About-the-TAP) to [designate the API user](https://support.fireblocks.io/hc/en-us/articles/7365877039004-Rule-parameters#h_01HGBN9QQ0T42NR8XT4Y96V7YH) paired with the Co-signer as the signer. When a transaction you initiate meets the criteria defined in the policy, it will be automatically signed by the Co-signer associated with the configured API user.

At that point, you can add multiple API users to the Co-signer and configure the Callback Handler for each API user paired with it.

Use the articles below for detailed guides and information.

***

## CO-SIGNER INSTALLATION

[Co-signer installation flow](/reference/api-cosigner-installation-flow)

[Install AWS Nitro](/reference/install-api-cosigner-aws)
[Install GCP Confidential Space](/reference/install-api-cosigner-gcp)
[Install SGX on Microsoft Azure](/reference/install-api-cosigner-azure)
[Install SGX via Azure Marketplace](/reference/install-api-cosigner-azure-marketplace)
[Install SGX on IBM Cloud](/reference/install-api-cosigner-ibm)
[Install SGX on Alibaba Cloud](/reference/install-api-cosigner-alibaba)

[Install SGX On-Premise](/reference/install-api-cosigner-onprem)

## SETUP AND TESTING

[Using the Communal Test Co-signer](/reference/use-communal-cosigner)

[Establishing Secure Communication Between the Co-signer and the Callback Handler](/reference/cosigner-callbackhandler-secure-communication-authentication)
[Callback Handler Response Object](/reference/response-object)
[Approve Transactions](/reference/approve-transactions)
[Approve Configuration Changes](/reference/approve-configuration-changes)

[Callback Handler Code Example](/reference/basic-code-example)
[Use the Plugin-based Callback Handler](/reference/plugin-based-callback-handler)
[Validate ETH Raw Transactions](/reference/validate-eth-raw-transactions)

MAINTENANCE

[Overview](/reference/api-cosigner-maintenance)
[SGX Co-signer Maintenance](/reference/api-cosigner-maintenance-sgx)
[AWS Co-signer Maintenance](/reference/api-cosigner-maintenance-aws-nitro)
[GCP Co-signer Maintenance](/reference/api-cosigner-maintenance-gcp-confspace)

## CO-SIGNER OPERATION

[Using APIs, Console and Command-Line Interface to Operate the Co-signer](/reference/api-cosigner-operate)

## VERSIONS

[Overview](/reference/api-cosigner-versions)
[SGX Co-signer Version History](/reference/api-cosigner-versions-sgx)
[AWS Co-signer Version History](/reference/api-cosigner-versions-aws)
[GCP Co-signer Version History](/reference/api-cosigner-versions-gcp)

## SUPPORT

[Troubleshooting](/reference/api-cosigner-troubleshooting)
