> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# AWS Nitro API Co-signer Maintenance

> **Note:** You must have root privileges on the Co-signer machine to perform maintenance operations. Ensure you are logged in as a root user or use `sudo` to execute the commands.

## View the logs

You can export the logs to a file in the local directory, tagged with the current date and time, by running the following command:

```bash theme={"system"}
./fireblocks/cosigner logs
```

Append a number to the command to retrieve the specified most recent amount of lines.

The Co-signer's logs are saved on the EC2 instance in the following file location: `/var/log/customer_cosigner.log`

The log policy is as follows:

```xml theme={"system"}
 <appender name="log_file" class="org.apache.log4j.RollingFileAppender">
   <rollingPolicy class="org.apache.log4j.rolling.TimeBasedRollingPolicy">
     <param name="FileNamePattern"
     value="log/customer_cosigner-%d{dd-MM-yyyy}.log"/>
     <param name="activeFileName" value="log/customer_cosigner.log"/>
   `</rollingPolicy>`
   <param name="File" value="log/customer_cosigner.log"/>
   <param name="Fppend" value="true"/>
   <param name="MaxFileSize" value="4MB"/>
   <param name="MaxBackupIndex" value="2"/>
   <layout class="org.apache.log4j.PatternLayout">
   <param name="ConversionPattern" value="%X{proc}:%X{tid} %p
   %d{dd/MM/yyyy HH:mm:ss,SSS} %l %C::%M- %m Context=%X{context}%n" />
   `</layout>`
 `</appender>`
```

***

## Observe the status

You can observe the Co-signer's status by running the following command from the EC2 instance:

```bash theme={"system"}
./fireblocks/cosigner get-status
```

It should return an output similar to the following:

```json theme={"system"}
[root@ip-x-x-x-x ~]# ./fireblocks/cosigner get-status
 ========= Cosigner Status =========
 Enclave Name: cosigner
 Enclave ID: i-0b11aeabc7d3bee3d-enc190641e6f0ce80a
 Process ID: 377331
 Enclave State: RUNNING
 Service State: ACTIVE
 ===================================
 Latest Service Messages:------------------------
 Jun 29 13:10:41 ip-x-x-x-x.us-east-2.compute.internal start_service.sh[377329]:
 Jun 29 13:10:41 ip-x-x-x-x.us-east-2.compute.internal start_service.sh[377329]:
 1,
 3
 Jun 29 13:10:41 ip-x-x-x-x.us-east-2.compute.internal start_service.sh[377329]: ],
 Jun 29 13:10:41 ip-x-x-x-x.us-east-2.compute.internal start_service.sh[377329]:
 "MemoryMiB": 4096
 Jun 29 13:10:41 ip-x-x-x-x.us-east-2.compute.internal start_service.sh[377329]: }
 ===================================
```

If you get anything other than `ACTIVE` in the "Service State" field, there’s a problem. Contact Fireblocks support and **attach the Co-signer’s logs so we can investigate**.

***

## List the paired API users

You can list all API users paired with the Co-signer across the connected workspaces by running the following command:

```bash theme={"system"}
./fireblocks/cosigner list-users
```

The output will display a list of all API users paired with your Co-Signer, including the workspace name they are connected to, the API user's ID (its API key), and the associated Callback Handler server URL (if applicable).

***

## Retrieve the public key

You can retrieve the Co-signer's public key, used by your optional Callback Handler server to authenticate requests from the Co-signer, by running the following command:

```bash theme={"system"}
./fireblocks/cosigner print-public-key
```

***

## Stop the Co-signer

You can stop the Co-signer by running the command:

```bash theme={"system"}
./fireblocks/cosigner stop
```

***

## Start the Co-Signer

You can Start the Co-signer by running the command:

```bash theme={"system"}
./fireblocks/cosigner start
```

***

## Restart the Co-Signer

You can restart the Co-signer by running the command:

```bash theme={"system"}
./fireblocks/cosigner restart
```

***

## Update the Co-signer

Retrieve the URL of the AWS Nitro installation package from the Console and use the `wget` command to download the package directly to the EC2 machine. Paste the appropriate URL into the following command:

```bash theme={"system"}
wget -O nitro-cosigner.tar.gz "URL"
```

> **Note:** If you have any issues with finding the installation package URL, please contact [Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=360003372200\&tf_360023089139=global_settings\&tf_360023089159=get_api_co-signer_installation_script).

Unpack the installation package by running the following command:

```bash theme={"system"}
tar -xzf nitro-cosigner.tar.gz
```

Now stop the Co-signer run the following commands to stop the Co-signer service and update it by forcing a new installation, overwriting the existing one:

```bash theme={"system"}
systemctl stop cosigner
./install.sh --force
```

The script will prompt for the following parameters:

* Pairing token
* S3 bucket
* ARN of the CMK

Use the same settings that were used to install the existing running version. These settings can be found in the file `/opt/fireblocks/env.txt`, where they are labeled as follows:

* PAIRING\_TOKEN
* BUCKET\_NAME
* KEY\_ARN

It will take about a minute to reinstall, and then the Co-signer will load using the new version.

***

## Migrate to a new machine

> **Note:** Since the logs are saved to the EC2 instance, you might want to save them before terminating the machine.

Throughout the migration process, refer to the [AWS Nitro Co-signer installation guide](/reference/install-api-cosigner-aws), as some operations are identical.

Follow these steps to migrate the Co-signer to a new EC2 machine:

1. Set up a new EC2 Nitro-capable instance.
2. Download the installation package to the new instance.
3. Create a new API user that will be used to connect to the new Co-signer instance.
4. Stop the running Co-signer operation by executing the command `systemctl stop cosigner` on the existing EC2.
5. Run the installation script and provide the same S3 bucket and CMK values when prompted to enter parameters during the installation.

***

## Configure a proxy server

By default, the Co-signer is configured to communicate directly with Fireblocks SaaS without using a proxy server. Since the Co-signer uses certificate pinning for secure communication with Fireblocks SaaS, **only a transparent proxy can be used** between the Co-signer and Fireblocks SaaS.

To configure a proxy server, add the key value `HTTPS_PROXY="URL"` as an environment variable to the following file:

`/opt/fireblocks/env.txt`

```bash theme={"system"}
 HTTPS_PROXY="URL" # Replace URL with your transparent proxy server
```

Changing the proxy server settings requires restarting the Co-signer. Run this command to restart it:

```bash theme={"system"}
systemctl restart cosigner
```

***

## Configure the communication protocol

By default, the Co-signer is configured to use WebSocket to communicate with Fireblocks SaaS. You can switch to HTTPS Long Polling by turning WebSocket off.

To turn WebSocket off, add the key value `WEBSOCKET=0` as an environment variable to the following file:

`/opt/fireblocks/env.txt`

```bash theme={"system"}
 WEBSOCKET=1 # Use WebSocket
 WEBSOCKET=0 # Use HTTPS Long Polling
```

Switching between the communication modes requires restarting the Co-signer. Run this command to restart it:

```bash theme={"system"}
systemctl restart cosigner
```
