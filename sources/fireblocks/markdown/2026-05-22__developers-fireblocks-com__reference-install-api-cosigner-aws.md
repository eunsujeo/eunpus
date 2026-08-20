> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Install AWS Nitro API Co-signer

## Overview

To install a Nitro Co-signer in AWS and connect it to your workspace, follow these steps:

1. **Setup and configure your AWS environment:** Prepare your AWS environment by creating and configuring the required resources. Ensure it meets the necessary specifications and security settings.
2. **Add a Co-signer to the workspace using an API user:** Using the Fireblocks Console or APIs, create an API user and use it to add a Co-signer to the workspace.
3. **Install and connect the Co-signer to the workspace:** Download the installation script to the Nitro-capable EC2 machine and run the script to install the Co-signer. Once installation is complete, the workspace owner approves the new MPC key shares for the API user through the Fireblocks mobile app.

You can now view the Co-signer and its paired API user in your Fireblocks Console. Additionally, you can retrieve information about them using the Co-signer APIs.

***

## Step 1: Set up and configure your AWS environment

Proper configuration of your AWS environment is straightforward but must be performed step by step in the specified order. Any misconfiguration could compromise the Co-signer's functionality or security.

### Required AWS account permissions

You must have the necessary AWS account permissions to enable network access to the required domains and to create and configure the following resources:

* IAM Role
* Customer Managed Key (CMK)
* S3 bucket
* Nitro-capable EC2 machine

### Step 1.1: Allowlist domains

To ensure the Co-signer can be installed and operated successfully, add the following domains to your allowlist:

| Domain                       | Owner                                            |
| ---------------------------- | ------------------------------------------------ |
| `mobile-api.fireblocks.io`   | Fireblocks                                       |
| `signurl.fireblocks.io`      | Fireblocks                                       |
| `s3signurl.fireblocks.io`    | Fireblocks                                       |
| `s3.{region}.amazonaws.com`  | AWS (Replace `{region}` with the applicable one) |
| `kms.{region}.amazonaws.com` | AWS (Replace `{region}` with the applicable one) |
| `bootstrap.pypa.io`          | Python Software Foundation                       |
| `files.pythonhosted.org`     | Python Software Foundation                       |
| `pypi.org`                   | Python Software Foundation                       |
| `pypi.python.org`            | Python Software Foundation                       |
| `fb-certs.s3.amazonaws.com`  | AWS                                              |

Fireblocks-owned domains differ based on the specific Fireblocks SaaS environment you are connected to. If you are connected to the European or Swiss SaaS, update your allowlist according to the domains listed in the table below:

| Fireblocks SaaS | Domains to Allow                                                                           |
| --------------- | ------------------------------------------------------------------------------------------ |
| Global          | `mobile-api.fireblocks.io`  `signurl.fireblocks.io`  `s3signurl.fireblocks.io`             |
| Europe          | `eu2-mobile-api.fireblocks.io`  `eu2-signurl.fireblocks.io`  `eu2-s3signurl.fireblocks.io` |
| Swiss           | `eu-mobile-api.fireblocks.io`  `eu-signurl.fireblocks.io`  `eu-s3signurl.fireblocks.io`    |

> **Additional notes**
>
> * For a better understanding of the Co-Signer's communication with the above URLs, refer to the [AWS Nitro API Co-signer Architecture](/docs/aws-nitro-api-co-signer) article.
> * If you cannot support DNS IP whitelisting with an advanced firewall or within the cloud itself, you must allow egress traffic to any destination on port 443.

### Step 1.2: Set up and configure an IAM role

Identity and Access Management (IAM) roles are used to delegate access to your AWS resources. Create an IAM security role that ties everything together by granting only the necessary permissions to the specific resources.

1. From the Identity and Access Management (IAM) page, select **Roles** and **Create role**. On the Select trusted entity page, select:
   1. **Trusted entity type:** AWS service
   2. **Service or use case:** EC2
2. Select **Next**. On the Add permissions page, don’t make any selections.
3. Select **Next**. Enter the role’s name and select **Create role** without changing the trust policy.
4. Select the newly created role and copy the IAM ARN for the next steps. The IAM ARN has the following structure:

   `arn:aws:iam::{ACCOUNT-ID}:role/{ROLE-NAME}`

When you finish, the Permissions policies section will be empty (as shown below). After setting up the S3 bucket and the Customer Managed Key (CMK) in the Key Management Service (KMS), you will return to Permissions policies to add the required policies for those resources.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/7e5cfac157f5cda0cc174c05f219867122f55864da6ef9f3e675691495a5fda7-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=1dc8791491f925613d11f7db4dbcc68c" alt="" width="1237" height="373" data-path="images/docs/7e5cfac157f5cda0cc174c05f219867122f55864da6ef9f3e675691495a5fda7-image.png" />

### Step 1.3: Set up and configure an S3 bucket

Create the S3 bucket that serves as the Co-signer's persistent storage.

1. From the Amazon S3 page, select **Create bucket**. Enter its name, leave everything else as default, and create the bucket.
2. Select the newly created bucket and on the bucket’s details page, select **Permissions**.
3. In the Bucket policy section, select **Edit** and copy-paste the S3 policy from the text box below.
4. Select **Save changes** to complete the operation.
5. Select the newly created bucket and copy the Bucket ARN for the next steps. The Bucket ARN has the following structure:

   `arn:aws:s3:::\{BUCKET-NAME}`

Make sure you replace the`{BUCKET-NAME}`, `{ACCOUNT-ID}` and `{ROLE-NAME}` with the correct values.

```json theme={"system"}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Principal": "*",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:ListBucketMultipartUploads",
                "s3:AbortMultipartUpload",
                "s3:GetObjectAcl",
                "s3:PutObjectAcl",
                "s3:RestoreObject"
            ],
            "Resource": [
                "arn:aws:s3:::{BUCKET-NAME}",
                "arn:aws:s3:::{BUCKET-NAME}/*"
            ],
            "Condition": {
                "ArnNotEquals": {
                    "aws:PrincipalArn": "arn:aws:iam::{ACCOUNT-ID}:role/{ROLE-NAME}"
                }
            }
        }
    ]
}
```

### Step 1.4: Set up and configure a KMS Customer-Managed Key (CMK)

Create a Customer-Managed Key (CMK) in KMS to safeguard the Co-signer’s MPC key shares.

#### Create the key

1. Open the Key Management Service (KMS) page and select **Create key**.

2. On the Configure key page, select:
   1. **Key type:** Symmetric
   2. **Key usage:** Encrypt and decrypt

3. Expand the **Advanced options** section and select:
   1. **Key material origin:** KMS
   2. **Regionality:** Single-Region key.

      **Note:** Select the Multi-Region key only if the EC2 instance is in a different region.

4. Select **Next**.

#### Add labels

1. On the Add labels page, set a display name for the key in the **Alias** field (e.g., `fireblocks-nitro-cosigner`).
2. Optionally, fill in the **Description** and **Tags** fields.
3. Select **Next**.

#### Configure permissions

1. On the Define key administrative permissions page, leave the **Key administrators** section blank and leave the **Key deletion** option checked.
2. Select **Next**.
3. On the Define key usage permissions page, leave the **Key users** section blank.
4. Select **Next**.

#### Finalize the key

1. On the Review page, scroll down to the Key policy section.
2. Paste the KMS policy in the Key policy section.
3. Select **Finish**.

#### Get the key ARN

1. Select the newly created key.
2. Copy the KMS ARN for the next steps.

The KMS ARN has the following structure: `arn:aws:kms:{KEY-REGION}:{ACCOUNT-ID}:key/{KEY-ID}`

Ensure you replace `{ACCOUNT-ID}` and `{KEY-ID}` with the correct values.

#### Understanding the policy warning

When you paste the KMS policy, you might see the following warning:

> **Unsupported Action For Condition Key**
>
> The following actions: `kms:GetKeyPolicy` are not supported by the condition key `kms:RecipientAttestation:PCR8`. The condition will not be evaluated for these actions. We recommend that you move these actions to a different statement without this condition key.

**Why you can safely ignore this warning:**

* The `kms:RecipientAttestation:PCR8` condition is only evaluated on KMS calls that include an attestation report from the enclave.
* AWS ignores the condition on actions that never carry a report in the request (such as `GetKeyPolicy` and `Encrypt`) and emits this advisory.
* **Security impact:** None. All sensitive operations (`Decrypt`, `DeriveSharedSecret`, `GenerateDataKey`, `GenerateRandom`) remain protected by the PCR8 attestation check.
* **Functionality impact:** Unaffected. This behavior is by design, and the key can be used by the Fireblocks Nitro Co-signer immediately.

The value for PCR8 varies based on the Fireblocks SaaS environment to which you are connected. Copy the correct value into the CMK policy:

| Fireblocks SaaS | `{PCR8-VALUE}`                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------- |
| Global          | `da1d9eca20ce98ab4fdbc51f8e5a2307fd4c61829b7d8bff40976cd6676862c8f3476ff4bdd0f65ecf4a48d6eb3099a8` |
| Europe          | `fffc94d68a150b49dc39b23954c793cd1a4f7972f528a1ee258dc130b6cd9454e29ae72ef66bd9697a55e774e17a2d49` |
| Swiss           | `69b1fbe9fb4ea49e084fe6f9f9623d871bd22ceb5efad47b1a8d3708e6674868cad8bf088ced3976c2194360c7d58219` |

```json theme={"system"}
{
    "Version": "2012-10-17",
    "Id": "key-consolepolicy-4",
    "Statement": [
        {
            "Sid": "Enable enclave data processing for specific role",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::{ACCOUNT-ID}:role/{ROLE-NAME}"
            },
            "Action": [
                "kms:Decrypt",
                "kms:Encrypt",
                "kms:GenerateDataKey",
                "kms:GenerateDataKeyPair",
                "kms:GenerateDataKeyWithoutPlaintext",
                "kms:GenerateDataKeyPairWithoutPlaintext",
                "kms:GenerateRandom",
                "kms:GetKeyPolicy"
            ],
            "Resource": "*",
            "Condition": {
                "StringEqualsIgnoreCase": {
                    "kms:RecipientAttestation:PCR8": "{PCR8-VALUE}"
                }
            }
        },
        {
            "Sid": "Allow GetKeyPolicy to co-signer",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::{ACCOUNT-ID}:role/{ROLE-NAME}"
            },
            "Action": "kms:GetKeyPolicy",
            "Resource": "*"
        },
        {
            "Sid": "Allow policy management to root user",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::{ACCOUNT-ID}:root"
            },
            "Action": [
                "kms:DescribeKey",
                "kms:GetKeyPolicy",
                "kms:PutKeyPolicy",
                "kms:CreateAlias"
            ],
            "Resource": "*"
        }
    ]
}
```

### Step 1.5: Edit the IAM role's policy

Return to the IAM service and select the IAM role you created.

1. In the Permissions policies section, select **Attach policies**, select the `AmazonSSMManagedInstanceCore` policy, and then select **Add permissions**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/94dba93837abd2061803908a20600e6936504f0d3050ea2dafab3bf01b9d6665-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=5762491e668dfac43599197e2619fce6" alt="" width="1233" height="414" data-path="images/docs/94dba93837abd2061803908a20600e6936504f0d3050ea2dafab3bf01b9d6665-image.png" />

2. In the Permissions policies section, select **Create inline policy** and choose **JSON** in the Policy editor section. Copy-paste the IAM policy below in there. Finally, create the policy and assign it a name.

Make sure you replace the `{BUCKET-NAME}`, `{KEY-REGION}`, `{ACCOUNT-ID}` and `{KEY-ID}` with the correct values.

```json theme={"system"}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListBuckets",
            "Effect": "Allow",
            "Action": "s3:ListAllMyBuckets",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::{BUCKET-NAME}"
        },
        {
            "Sid": "WritePermissionsOnBucket",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::{BUCKET-NAME}/*"
        },
        {
            "Sid": "AccessToTheKey",
            "Effect": "Allow",
            "Action": [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:GenerateDataKey",
                "kms:GenerateDataKeyPair",
                "kms:GenerateDataKeyWithoutPlaintext",
                "kms:GenerateDataKeyPairWithoutPlaintext",
                "kms:GenerateRandom",
                "kms:GetKeyPolicy"
            ],
            "Resource": [
                "arn:aws:kms:{KEY-REGION}:{ACCOUNT-ID}:key/{KEY-ID}"
            ]
        }
    ]
}
```

### Step 1.6: Set up and configure an EC2 instance

> **Use only the c5.xlarge or c5a.xlarge instance types!**
>
> AWS Nitro secure enclaves must have a minimum of two dedicated vCPUs and 4GB memory per enclave, and Nitro secure enclaves can utilize up to 50% of the host EC2 instance's resources. Therefore, the minimum requirement is to have an instance with four vCPUs and 8GB memory (`c5.xlarge`).

1. Create a Nitro-capable EC2 instance by selecting **Launch instances** from the EC2 Instances page. Enter its name and choose the Amazon Machine Image (AMI) **Amazon Linux 2023 AMI with 64-bit (x86) architecture**.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/a5335b60d66ac36dba62fcc78e97e167d4578a666dbaca5166f7c2849dd26003-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=42c2771bdec78603cd6d4f455385e3df" alt="" width="992" height="749" data-path="images/docs/a5335b60d66ac36dba62fcc78e97e167d4578a666dbaca5166f7c2849dd26003-image.png" />

2. In the Instance type section, select `c5.xlarge` (4vCPUs, 8GB RAM) or `c5a.xlarge` if the former is not available in your region.
3. In the Network settings section, set where to allow SSH traffic from. We recommend restricting access as much as possible.
4. In the Advanced details section:
   1. **IAM instance profile:** Select the IAM Role you created in the previous steps.
   2. **Nitro Enclave:** Select **Enable**. This field will be grayed out if you selected an instance type that is incompatible with Nitro.
   3. **Metadata version:** Select **V2 only (token required)**.
   4. **Metadata response hop limit:** Set to a minimum of 2 (two).

When you’re done, launch the instance.

### Step 1.7: Additional security recommendations

* It is highly recommended to control user and network access to your AWS environment and EC2 instance by properly configuring your VPC and security groups. Learn more about [controlling network traffic](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/infrastructure-security.html#control-network-traffic) in the AWS documentation.
* See [API Co-signer security checklist and recommended defense and monitoring systems](/docs/co-signer-security-checklist-defense-monitoring) for further information.

***

## Step 2: Add a Co-signer to the workspace using an API user

[Use this guide](/reference/install-api-cosigner-add-new-cosigner-p2) to add a new Co-signer to the workspace. Be sure to copy-paste (or otherwise record) the following items to your notes since they are required during the installation process:

* The API user's pairing token
* The download link of the Co-signer's installation script

***

## Step 3: Install and connect the Co-signer to the workspace

> **You must have root privileges on the EC2 instance to install the Co-signer**
>
> Ensure you are logged in as a root user or use `sudo` to execute the installation commands.

### Step 3.1: Connect to your EC2 Instance

Connect to your EC2 instance with your preferred method.

### Step 3.2: Download and unpack the installation package

Using the download link of the AWS Nitro Co-signer installation package you copied from the Console, run the `wget` command to download the package directly to your machine.

Paste the appropriate URL into the following command:

```bash theme={"system"}
wget -O nitro-cosigner.tar.gz "URL"
```

Unpack the installation package by running the following command:

```bash theme={"system"}
tar -xzvf nitro-cosigner.tar.gz
```

### Step 3.3: Run the installation script

The installation package contains an Enclave Image File (EIF) and installation scripts. To install the Co-signer, navigate to the directory where the installation package was unpacked and run:

```bash theme={"system"}
./install.sh
```

You will be prompted to enter the following parameters:

* **Pairing token**: Enter the API user’s pairing token that you copied from the Fireblocks Console. This token pairs the API user with the Co-signer, establishing the connection between the Co-signer and the workspace.
* **S3 bucket name**: Enter the name of the S3 bucket that you created before. You should only add the bucket name and not the full ARN of the bucket. For example: If your bucket ARN is `arn:aws:s3:::{BUCKET-NAME}`, you need to enter only `{BUCKET-NAME}`.
* **CMK ARN:** Enter the Amazon Resource Name (ARN) of the CMK that you created before.

At this stage, you will have the option to configure the Callback Handler parameters for the API user connecting the Co-signer to the workspace. This feature is optional. You can [configure it later through the Console, APIs, or locally](/reference/api-cosigner-operate) from the Co-signer's host machine.

For detailed instructions on setting up your Callback Handler's interface to the Co-signer and implementing its logic and code, refer to the [Setup API Co-signer Callback Handler](/reference/api-cosigner-setup-callback-handler) section.

Once the installation is complete, the Co-signer will automatically start running.

> **The Nitro cosigner installation script installs the below components as services**
>
> * cosigner
> * cosigner-networking
> * cosigner-logging
> * cosigner-env-export
>
> The cosigner service is started up during the execution of the installation script, and is also enabled to start on boot, which in turn starts up the three remaining services.

### Step 3.4: Approve MPC key shares for the API user

If the API user paired with the Co-signer has an Admin or Signer role, the workspace Owner will receive a notification. This notification will prompt them to approve a new MPC key share request for that API user using the Fireblocks mobile app. The Owner must approve this request within 120 hours of receiving it.

You can now see the Co-signer you installed in the Co-signers tab within the Console's Developer Center. Observe that it is online and that the API user is paired to it.

> **Looking for the Co-signer's status and logs?**
>
> Refer to the [AWS Nitro Co-signer Maintenance](/reference/api-cosigner-maintenance-aws-nitro) guide for more information.

***
