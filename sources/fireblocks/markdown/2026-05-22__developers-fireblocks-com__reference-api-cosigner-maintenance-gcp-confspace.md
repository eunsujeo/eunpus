> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# GCP Confidential Space API Co-signer Maintenance

> **Note:** You must have the necessary privileges to your Google Cloud account to perform maintenance operations.

## View the logs

To view the Co-Signer's logs, go to the [GCP's VM instances page](https://console.cloud.google.com/compute/instances) and validate that you see the right project (for example, "GCP-Customer-Cosigner-Dev"). After that, click on the relevant VM name and then press "logging" (which appears under "Logs"). This will open a new window with the customer Co-signer's logs.

## Observe the status

To check the Co-signer's health, run the following command:

```bash theme={"system"}
gcloud compute instances describe <vm-name> --zone=<vm-zone> | grep status
```

Search for the `status` field of the VM in the output and confirm it is set to `RUNNING`. However, this does not guarantee the health of the Co-signer. To verify its functionality, monitor the transaction activity passing through it.

Also, use the [Co-signers management tab](https://support.fireblocks.io/hc/en-us/articles/14492251068060-The-Co-signer-management-tab) to observe the online / offline status.

## List the paired API users

Use the [Co-signers management tab](https://support.fireblocks.io/hc/en-us/articles/17923671680540-The-Co-signer-management-tab) to observe the paired API users.

## Retrieve the public key

You can view the Co-signer's logs in Google Cloud's console to find the public key used by the Callback Handler's server for JWT-encoded signed message authentication. Search for `public key` in the logs, as shown in the example below.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/P9NyquD_UBc75wK-/images/docs/2149e195156b61df438b2fa99953f296af9e77da0d9c89c873f6b4837ae93488-image.png?fit=max&auto=format&n=P9NyquD_UBc75wK-&q=85&s=3ff51267e7b3aa2ae114519e89f798d2" alt="" width="1398" height="88" data-path="images/docs/2149e195156b61df438b2fa99953f296af9e77da0d9c89c873f6b4837ae93488-image.png" />

## Stop the Co-signer

You can stop the Co-signer by running:

```bash theme={"system"}
gcloud compute instances stop <vm-name> --zone=<vm-zone>
```

> **Note**: This operation will not delete the VM.

You can also stop the VM from the GCP console.

## Restart the Co-Signer

In case the Co-signer's VM is down, given the Co-signer was already created, you can restart the Co-signer by running:

```bash theme={"system"}
gcloud compute instances start <vm-name> --zone=<vm-zone>
```

When you restart the Co-signer after installing it, it will use the same configuration (metadata), so you don't need to enter all the parameters again.

## Retrieve the running version

Use Google Cloud's console to check the Co-signer's running image version by observing the `tee-image-reference` field in `Custom metadata` in the `Details` section.

Alternatively, you can search for `Initializing CustomerCosignerGCPConfidentialSpace, commit sha` within the instance logs.

## **Update proxy settings**

You can update or remove proxy settings on a running Co-signer without performing a full upgrade. The `--update-proxy` flag on the install/upgrade script handles this. It updates the VM's instance metadata in place and resets the VM to apply the change. No new VM is created.

The operation causes approximately 2 minutes of downtime while the VM restarts.

### **Run the update**

```bash theme={"system"}
./client_install_upgrade_api_cosigner_script.sh --update-proxy cloud-resources-<timestamp>.yaml
```

Replace `cloud-resources-<timestamp>.yaml` with the resources file generated during your installation.

#### **What the script does**

1. Loads your current configuration from the resources YAML file and displays a summary, including whether a proxy is currently configured.
2. Prompts you for the new proxy URL. To remove an existing proxy, press **Enter** without entering a value.
3. If a proxy URL is provided, encrypts it using your Cloud KMS key (credentials are never stored in plaintext), then prompts for `NO_PROXY` patterns. The current `NO_PROXY` value is shown as the default; press **Enter** to keep it.
4. Displays a summary of the changes and asks for confirmation before touching the running VM.
5. Updates the VM's instance metadata with the new configuration and resets the VM.
6. Writes the updated proxy settings to your resources YAML file.

#### **Proxy URL format**

```http theme={"system"}
http://proxy.example.com:8080
```

To authenticate to the proxy, include credentials in the URL:

```http theme={"system"}
http://username:password@proxy.example.com:8080
```

#### **Effect on WebSocket vs. long-polling**

When a proxy is configured, the Co-signer uses long-polling (REST) for communication with Fireblocks. WebSocket connections cannot reliably traverse proxies. When you remove a proxy, the Co-signer reverts to the WebSocket setting that was active before the proxy was added.

#### **Verify the update**

Once the VM is back online (approximately 2 minutes after the reset), proxy activity appears in Cloud Logging. To stream recent logs:

```bash theme={"system"}
gcloud logging read 'resource.type=gce_instance AND labels.instance_name=YOUR_VM_NAME' \
  --limit=50 \
  --order=desc
```

Replace `YOUR_VM_NAME` with your Co-signer VM name (visible in the summary the script prints before confirmation).

## Update the Co-signer

You can update the Co-signer by running the following script:

```bash theme={"system"}
client_stop_and_update_gcp_api_cosigner_script.sh
```

This script performs the following:

* Stops the existing VM running the current Co-signer.
* Updates the OIDC workload identity pool provider's attestation verification with the new image's SHA of the new version.
* Create a new VM that runs the new image.

The new Co-Signer VM utilizes the same database, keys, and cloud resources as the previous one.

> **Important notes:**
>
> * **Delete the old VM once the new one is fully operational.** Because the policy is configured to protect the VM from deletion, use the GCP console to disable the deletion protection under `VM > Edit > UNtag "Enable deletion protection"` and save the new settings before deleting the VM.
> * If a proxy was configured when the Co-signer was installed, the upgrade carries that configuration forward automatically. No additional input is required. To change or remove proxy settings on a running Co-signer, use the `--update-proxy` flag instead of performing an upgrade. See the [<u>Update proxy settings</u>](https://fireblocks.atlassian.net/browse/DOC-3350# "#") section.
> * Please make sure to refer this [doc](/reference/api-cosigner-versions-gcp) to get the Image SHA number.

## Migrate to a new machine

Stop the current Co-signer VM and set up a new one using the same resources besides the VM.

## Configure the communication protocol

WebSocket is the default protocol the Co-signer uses to communicate with the Fireblocks SaaS. You can switch to HTTP Long Polling by configuring the `client_install_gcp_api_cosigner_script.sh` script.

To configure the Co-signer to use HTTP long polling, you can create a new VM that will use the same resources, but ensure you remove the `\"--websocket\"` parameter from the `create_vm_cmd` line so that it will look like this:

```bash theme={"system"}
--metadata
^~^tee-image-reference=$image_ref~tee-container-log-redirect=true~tee-cmd='[\"--initial-config\", \"$initial_config\", \"$bucket\", \"$key_path\"]'"
```

Instead of:

```bash theme={"system"}
--metadata
^~^tee-image-reference=$image_ref~tee-container-log-redirect=true~tee-cmd='[\"--initial-config\", \"$initial_config\", \"$bucket\", \"$key_path\",\"--websocket\"]'"
```

If you don't want to create a new VM, you can edit the VM's metadata and instruct it to restart in HTTP Long Polling.

* Stop the Co-signer0 VM
* From the GCP console, locate `VM > Edit > Metadata`
* Remove "`--websocket`" from the "`Value 1`" matching Key 1 which is "`tee-cmd`"
* Click Save and restart the VM to apply the changes to the Co-signer
