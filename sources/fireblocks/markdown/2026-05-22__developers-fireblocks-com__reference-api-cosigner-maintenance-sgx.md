> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SGX API Co-signer Maintenance

> **Note:** You must have root privileges on the Co-signer machine to perform maintenance operations. Ensure you are logged in as a root user or use `sudo` to execute the commands.

## View the logs

You can export the logs to a file in the local directory, tagged with the current date and time, by running the following command:

```bash theme={"system"}
./cosigner logs
```

Append a number to the command to retrieve the specified most recent amount of lines.

By default, the Co-signer uses the Docker logging container. However, for better monitoring, the logs can be streamed to an external log delivery service, such as ELK, Splunk, or Datadog.

The SGX Co-signer generates two different types of logs for troubleshooting and auditing:

* `run.log` is an automatically generated log containing all of your Co-signer setup and configuration history.
* `customer_cosigner.log` contains workspace operation data, such as the workspace's transaction approving and signing history and new connection approvals. These log files are separated into 10 files limited to 4.1MB each. They are automatically overwritten in chronological order.

Your API Co-signer logs are structured using the following Regular Expression (RegEx):

```bash theme={"system"}
${AppName}:${Line} ${LogLevel} ${dd/MM/yyyy} ${HH:mm:ss,fff} ${ClassName} ::${MethodName} - ${LogMessage}
```

These logs are collected by the Docker container’s `STDOUT` stream and written into a log file on the container’s host machine at the location specified below. These log files are rotated with a max file size of 4MB for each log file.

```text theme={"system"}
/databases/cosigner/log/customer_cosigner.log
/databases/cosigner/log/customer_cosigner.log.1
/databases/cosigner/log/customer_cosigner.log.2
...
```

> **Note:** The Co-signer is Docker-based and uses the Docker JSON file driver for logging. By default, the driver uses a standard logging output but can be configured to support other logging mechanisms. Refer to the official Docker documentation for more detailed information.

***

## Verify SGX is enabled on the machine

After completing your server creation or installation, verify that SGX is enabled on the server. The Fireblocks API Co-Signers can only run on SGX-enabled servers with the latest patches, and verifying your configuration helps ensure you do not run into any potential issues later on.

1. Run the following commands on the server:

```bash theme={"system"}
sudo apt update
sudo apt upgrade
sudo apt install cpuid
cpuid -1 | grep -i sgx
```

2. Verify the following:
   1. SGX: Software Guard Extensions supported is `true`.
   2. SGX\_LC: SGX launch config supported is `true`.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/0c0a9cb9db9029ad2559a58ddcde807472c7674dc0a81d25cd6dd58f57f37c5b-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=128b5d0f685e48863e18cc368d7d140b" alt="" width="544" height="223" data-path="images/docs/0c0a9cb9db9029ad2559a58ddcde807472c7674dc0a81d25cd6dd58f57f37c5b-image.png" />

> Note: Azure Standard\_DC\*\_v2 instances do not support SGX2, but it is not necessary to run the signer.

***

## List the paired API users

You can list all API users paired with the Co-signer across the connected workspaces by running the following command:

```bash theme={"system"}
./cosigner list-users
```

The output will display a list of all API users paired with your Co-Signer, including the workspace name they are connected to, the API user's ID (its API key), and the associated Callback Handler server URL (if applicable).

***

## Retrieve the public key

You can retrieve the Co-signer's public key, used by your optional Callback Handler server to authenticate requests from the Co-signer, by running the following command:

```bash theme={"system"}
./cosigner print-public-key
```

***

## Stop the Co-signer

You can stop the Co-signer by running the following command:

```bash theme={"system"}
./cosigner stop
```

***

## Start the Co-signer

You can Start the Co-signer by running the following command:

```bash theme={"system"}
./cosigner start
```

***

## Restart the Co-Signer

You can restart the Co-signer by running the following command:

```bash theme={"system"}
./cosigner restart
```

***

## Retrieve the running image version

You can retrieve your running Co-Signer version by running the following command:

```bash theme={"system"}
docker inspect cosigner | jq -r '.[0].Config.Image' + " " + '.[0].Image'
```

***

## Retrieve the script version

You can retrieve your current Co-Signer script version by running the following command:

```bash theme={"system"}
head cosigner -n 3 | grep -i ver
```

***

## Update the Co-signer

Retrieve the URL of the SGX installation script from the Console and use the `curl` command to download the script to the path where the existing Co-Signer script is present. Paste the appropriate URL into the following command:

```bash theme={"system"}
curl -o cosigner "URL Download Link"
```

> **Note:** If you have any issues with finding the installation script URL, please contact [Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=360003372200\&tf_360023089139=global_settings\&tf_360023089159=get_api_co-signer_installation_script).

After downloading the installation script, navigate to the directory containing the script and modify the script's permissions to make it executable:

```bash theme={"system"}
chmod +x cosigner
```

Stop the Co-signer container by running the following command:

```bash theme={"system"}
./cosigner stop
```

Run `docker ps -a` and check the output. There should be no Co-signer container running.

Backup the Co-signer's database by running the following command:

```bash theme={"system"}
mv /databases/cosigner/enclave/enclave.signed.so /databases/cosigner/enclave/enclave.signed.so_old
```

Remove the current revision file:

```bash theme={"system"}
sudo rm -f .revision
```

You can now update the Co-signer to the latest version by running the following command:

```bash theme={"system"}
./cosigner start
```

You can update to a specific image version by replacing the `<image_version>` :

```bash theme={"system"}
./cosigner start <image_version>
```

Run `docker ps -a` and check the output. You should see the Co-signer container running.

If the update process did not succeed, try re-installing the Co-signer using the same version, but first remove the current version of the Co-Signer by running the following commands:

```bash theme={"system"}
sudo rm -rf /databases
sudo rm -f .local_config .revision
```

and then run:

```bash theme={"system"}
./cosigner setup
```

If that still doesn't work, refer to [API Co-signer Troubleshooting](/reference/api-cosigner-troubleshooting).

***

## Migrate to a new machine

Begin by setting up a new SGX-capable machine in your cloud or on-premises environment.

Migrating the SGX Co-Signer to a new machine is most effectively performed using backup data from the existing machine. This approach minimizes downtime and reduces the risk of interruptions to your workspace operations.

The following files and folders are generated automatically during the SGX Co-signer setup and are essential for backup and recovery purposes:

1. `/databases/cosigner/db`: The Co-signer DB folder stores the `secrets.db` file, the Co-Signer's secrets database. This file is encrypted with a key generated in a secure SGX enclave.
2. `/databases/cosigner/backup`: The backup folder maintained by the Co-Signer stores the backup upon any change to the database. The files are formatted using the following timestamp: `%Y%m%d%H%M%S.db` (e.g. `20220710184350.db`) based on the backup's date.
3. `/databases/cosigner/enclave/ra_loader_enclave.signed.so` - The enclave loader.

Backup the files `secrets.db` and `ra_loader_enclave.signed.so` and copy them to the same folder locations on the new server:

* `/databases/cosigner/db/secrets.db`
* `/databases/cosigner/enclave/ra_loader_enclave.signed.so`

After the above files have been copied to the new server, run `./cosigner start`.

If you don't have backups of either `secrets.db` or `ra_loader_enclave.signed.so` files, unpair (re-enroll) the API users that are associated with the Co-signer and set up a new Co-signer on the new machine. Refer to the [API Co-signer Installation Flow and Deployment Options](/reference/api-cosigner-installation-flow) article to find the specific SGX Co-signer environment you have.
