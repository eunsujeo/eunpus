> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# API Co-signer Troubleshooting

## Contacting Fireblocks API Co-signer Support

If you have a question or need assistance, [contact Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new) and include the following information in your request:

* Your workspace name
* The first four characters of the API key associated with the API user used to connect the Co-signer to the workspace.
* Indicate whether the API user is paired with an active Co-signer or is in the process of completing the initial setup.

Copy the logs from the API Co-signer and include them in the support ticket. Refer to [the Co-signer maintenance documentation](/reference/api-cosigner-maintenance) to locate the logs for your specific type of Co-signer.

***

## Error codes

| Error Code      | Description  | Possible Cause                                          |
| --------------- | ------------ | ------------------------------------------------------- |
| 401             | Unauthorized | User account-related issue.                             |
| 403             | Forbidden    | Your firewall, proxy, or WAF is blocking communication. |
| 500 / 502 / 504 | Server error | Temporary server-side issue.                            |

***

## Error messages

### Error message "MPC setup not completed"

This error message indicates that the workspace Owner must still approve the API user's MPC key shares.

#### Resolution

Check the Owner's device for pending MPC key share approval notifications.

* If the notification is less than 12 hours old, the Owner can still approve the key shares, and the API user will be ready to sign transactions. Once the owner approves your new MPC keys on their Fireblocks mobile app. You have 6 hours to complete the MPC registration.
* If the Owner is unable to approve the request due to [Error 52](https://support.fireblocks.io/hc/en-us/articles/9108149928092-Error-52), deny the pending request and [submit a request to Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new).
* If there is no notification or another error, unpair the API user and then pair it with the Co-signer again to resend the approval request.

### API Co-signer does not sign transactions

The API Co-signer may not sign transactions if its transaction queue is full. In this case, the API logs will include an error stating that the "**queue is full**". This means the API Co-signer's internal queue is overloaded and must be restarted. This is separate from your workspace transaction queue.

#### Resolution

To resolve a full Co-signer queue:

1. Cancel all the pending transactions.
2. Make sure there are no pending requests on the Co-signer.
3. Restart the Co-signer.
4. Wait a few minutes to confirm that the queue is empty.
5. Submit a new transaction.
6. Confirm the transaction is signed by the Co-signer as expected.

> **Confirm your Co-signer meets minimum hardware requirements**
>
> The root cause of the full queue may be server CPU capabilities. Confirm that your Co-signer server meets the recommended hardware requirements.

### API Co-signer does not sign raw-signing transactions

When this issue occurs, the API Co-Signer signs some raw signing transactions but not others. This usually results from [signature caching for off-chain messages](https://support.fireblocks.io/hc/en-us/articles/4413379762450).

> **Signature caching enabled by default**
>
> Signature caching for raw signing is enabled by default. [Submit a request to Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=5129187878556\&tf_5465594782876=api_co-signer_setup_and_configuration__what_are_you_trying_to_do___other) if you want this feature disabled.

### IO Exception: status code = 28

This error is a generic Linux filesystem error. It indicates that the disk is full, and your infrastructure and DevOps teams need to add additional disk space.

### SGX Co-signer: failed attestation to Fireblocks, try to perform microcode update

This error indicates that the OS or BIOS microcode version is outdated and can’t perform the SGX attestation with the Fireblocks server.

#### Resolution

Make sure the threads/processor, and hyperthreading (HT) are disabled and that SGX, DCAP, and FLC are enabled.

To verify whether HT is enabled, run the following command:

```bash theme={"system"}
hostname# lscpu | grep Thread
```

This command should output:

```text theme={"system"}
Thread(s) per core: 1
```

To verify the microcode version, run the following command:

```bash theme={"system"}
# cat /proc/cpuinfo | grep -E "model name|microcode"

# dmesg | grep microcode

# dpkg -l | grep intel-microcode
```

### SGX Co-signer: migration options when an Azure region outage occurs

When Azure region issues occur where an API Co-signer instance is running, it can have the following effects:

* Connectivity issues
* An instance crashing, becoming unavailable, or being damaged and irrecoverable
* Withdrawals are not being processed and are getting stuck in the `PENDING_SIGNATURE` or `QUEUED` statuses due to the API Co-signer being unable to sign transactions.

> **Check your Azure region status**
>
> To check your Azure region's status, visit the [Azure status page](https://status.azure.com/en-us/status).

#### Workarounds

During an Azure region outage, you can use one of the following workarounds to ensure your financial operations continue uninterrupted. After the outage is resolved, you can return to your normal setup and resume operations.

#### Step 1: Install a new API Co-signer instance in another region

After doing that, you can unpair your existing API user and pair it with your new Co-signer.

#### Step 2: Define a user's mobile device as a designated signer on your Policy

You can define a user's mobile device as the designated signer for Policy rules that previously required your Co-signer to sign. However, this solution may not be ideal for some customers since it requires you to manually cancel all already submitted transactions, resubmit them, and then have them signed manually.

If you decide to change your Policy rules, [contact Fireblocks Support](https://support.fireblocks.io/hc/en-us/articles/4808588554396).

#### Step 3: Migrate an existing Co-signer instance to an unaffected region

Follow the [official guide from Microsoft](https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-move-overview). If you require any additional clarification, contact Azure for technical assistance. Note that this operation might take a considerable amount of time.

#### Checking the instance's health post-migration

To verify the Co-signer is healthy after the maintenance reboot, run `docker ps -a` and check the output. You should be able to confirm that the `cosigner-init` container is not running and the `cosigner` container is not restarting.

Also, cancel any transactions that are stuck in the `PENDING_SIGNATURE` status and verify that the status of your `QUEUED` transactions have changed to `PENDING_SIGNATURE`, meaning that the Co-signer can process them.

### SGX Co-signer: setup fails with error "Failed to download loader enclave"

This error typically occurs during the initial setup process of an API Co-signer.

During the initial setup process, the First user on this machine checkbox must be selected when the first API user to be added to the Co-signer machine is created. If the API user is created and the checkbox is not selected, the error below appears in the `date_time_run.log` file (located in the same directory in which the API Co-signer script runs):

```text theme={"system"}
customer_cosigner:24 ERROR 31/12/2000 20:03:21,462
untrusted/ra_loader.cpp(457)fireblocks::common::ra_loader::download_loader_with_access_token - Failed to download loader enclave file, http status 401

customer_cosigner:24 FATAL 31/12/2000 20:03:21,463
main.cpp(490) ::init - Failed to download ra loader
```

#### Resolution

There are two resolutions for this issue.

#### Resolution 1: Start over with a new API user

1. Delete the API user that you attempted to pair with the Co-signer.
2. Create another API user. Make sure to select the **first user in this machine** checkbox.
3. Run the following command on the Co-signer instance:

```bash theme={"system"}
./cosigner stop
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
```

4. Run the following command to begin the setup process again:

```bash theme={"system"}
./cosigner setup
```

#### Resolution 2: Contact Fireblocks Support

If you cannot create an API user or require the setup to be completed with the existing API user, contact Fireblocks Support.

### SGX Co-signer: syntax error near unexpected token: “newline” or “ `<?xmlversion="1.0" encoding="UTF-8"?>` ”

This error indicates that the link for downloading the Co-signer script has expired. To confirm, run the following command:

```bash theme={"system"}
head cosigner
```

If the link has expired, you should get the following response:

```xml theme={"system"}
`<?xml version="1.0" encoding="UTF-8"?>`
<Error><Code>SignatureDoesNotMatch`</Code>`
<Message>The request signature we calculated does not match the signature you provided. Check your key and signing method.`</Message>`
<AWSAccessKeyId>AKIA5QO5IU7PYPUJ7AU6`</AWSAccessKeyId>`
<StringToSign>AWS4-HMAC-SHA256
```

#### Resolution

To resolve this issue, download a new SGX Co-signer install script from the Console and run it again.

### SGX Co-signer: setup fails with the error "gathering device information while adding custom device, "/dev/sgx\_enclave", or unable to find file or directory"

This error indicates that the target instance doesn't support SGX or its SGX is not enabled, or that other machine specs don't match or are missing. For example, the correct size should be `DC4s_V3`.

#### Resolution

* You can find a list of SGX-supported instance types [here](https://docs.microsoft.com/en-us/azure/confidential-computing/quick-create-portal).
* For product availability in different regions, see [here](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=virtual-machines\&regions=all).

### SGX Co-signer: invalid reference format

This error indicates that you upgraded an existing Azure instance with an older version installed, and the older version files are stored in your temp files (.local\_config / .revision).

#### Resolution

To resolve this issue:

1. Make sure to keep the docker-compose files and the script in the correct directory

   (`.local_config` / `.revision`) before performing the API Co-signer setup.

2. Remove all files in the directory except the docker-compose files and the script.

3. Run the following command:

```bash theme={"system"}
./cosigner setup
```

4. When you are prompted to pair the token, exit that installation but continue with the docker installation.

### SGX Co-singer: curl command to [https://mobileapi.fireblocks.io/broadcast\\\_mpc\\\_m](https://mobileapi.fireblocks.io/broadcast\\_mpc\\_m) failed with error "Couldn't resolve host 'mobile-api.fireblocks.io'"

> **Warning**
>
> This error is not common, so we recommend contacting Fireblocks Support before you take action.

This error indicates that the request failed to send a message for the signed transaction and will remain in the **Pending** status until it is canceled. This is typically due to a network issue. However, in one case, we found that the DNS prevented the message from reaching the signing phase.

#### Resolution

To resolve this issue:

1. Go to the `vi/etc/systemd/resolved.conf` directory.
2. Under the Resolve heading, change the DNS value to **8.8.8.8 8.8.4.4**.
3. Run the following command:

```bash theme={"system"}
systemctl restart systemd-resolved.service
```
