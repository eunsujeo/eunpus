> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SGX API Co-signer Version History

Fireblocks updates the API Co-signer software to include stability enhancements and new features. This article provides details about the most recent SGX Co-signer versions. Always use the latest version listed here for optimal performance.

## Latest SGX Co-signer image version

### **Version 2026.04.27 (April 2026)**

**Version hash:** `1d5b48eeef`

* Performance improvements and bug fixes

***

## SGX Co-signer image version history

### Version 2026.03.02 (March 2026)

**Version hash:** 95a317d3c7

* Added support for POLICY\_CHANGE approval request type (the customer co-signer can now approve policy changes via Policy Service v2)
* Performance improvements and bug fixes

### Version 2026.01.29 (January 2026)

**Version hash:** 340d9f6057

* Bug fixes and performance improvements

### Version 2025.12.30 (December 2025)

**Version hash:** a294449c1b

* Added support for "Protected Tags" approval requests

### Version 2025.12.11 (December 2025)

**Version hash:** c44604398e

* The callback handler can now authenticate using a certificate signed by a root CA certificate preloaded to the Co-signer
* The callback handler can now authenticate using both JWT and a certificate provided directly to the Co-signer (or signed by a root CA certificate provided to the Co-signer)
* The callback can now return a "retry" response on exchange withdraw operation

### Version 2025.10.09 (October 2025)

**Version hash:** 4e34888c01

* Fixed bug parsing messages after websocket reconnect.
* Fixed bug sending messages on half-closed websocket connections.

### Version 2025.08.12 (August 2025; US environments only)

**Version hash:** 19c07421dc

* Fixed WebSocket bug causing performance issues

### Version 2025.07.16 (July 2025)

**Version hash:** bb61e507

* Fixed bugs and increased performance
* Better support for web sockets

### Version 3.10.1 (April 2025)

**Version hash:** 7160d7b833

* Bug fixes and performance improvements

### Version 3.7.1 (October 2024)

**Version hash:** 4ec196aec5

* Decreased signing latency, along with general performance increases
* Remote management capabilities through Fireblocks Console
* Support for more types of approval requests
* Various fixed and improved handling of internal errors
* Timing details are logged after every outgoing network request
* The cosigner version will be reflected in the HTTP User-Agent header

### Version 3.6.5 (February 2024)

**Version hash:** 3b807e2af7

* Improved logging for easier problem-solving
* Improved stability, security, and performance
* Enhanced deployment flexibility
* Added support for the Callback Handler retry mechanism, enabling the Callback Handler to respond asynchronously
* Updated major and minor dependencies
* Preliminary support for upcoming features
* Bug fixes

### Version 3.5.0 (August 2023)

* [MPC-CMP security enhancements](https://support.fireblocks.io/hc/en-us/articles/10167020461596-MPC-CMP-security-enhancements-version-update-August-2023)
* Bug fixes

### Version 3.3.0 (January 2022)

* Added support for HTTP network proxy on outbound requests
* Bug fixes

***

## Latest SGX Co-signer script version

### Version 2025.10.11 (December 2025)

* New default Docker image: 2025.10.11

## SGX Co-Signer script version history

### Version 2025.10.09 (October 2025)

* New default Docker image: 2025.10.09
* Switched to Calendar Versioning to align script versions with default image versions

### Version 1.1.13 (August 2025)

* New default Docker image 2025.08.12

### Version 1.1.11 (April 2025)

* New default Docker image 3.10.1

### Version 1.1.10 (January 2025)

* New default Docker image 3.7.1

### Version 1.1.9 (February 2024)

* New default Docker image 3.6.5

### Version 1.1.8 (January 2024)

* Added support for Callback Handler configuration via Azure Marketplace
* Same default Docker image as in image version 3.5.0 and used as in script version 1.1.7

### Version 1.1.7 (August 2023)

* New default Docker image 3.5.0

### Version 1.1.6 (February 2023)

* Added support for Docker version 1.29.2
* Added validation for microcode:
  * Additional information about the microcode version appears in the logs
  * Relevant only to customers with SGX Co-signers installed on-prem
* Added validation to make sure Hyper-Threading is disabled
  * If Hyper-Threading is enabled, additional information appears in the logs
  * Relevant only to customers with SGX Co-signers installed on-prem

### Version 1.1.5 (February 2022)

* New default Docker image 3.3.0
* Added support for Co-signers in high-availability
* Updated authentication model
* Added support for HTTP network proxy on outbound requests

***

## Checking SGX Co-signer versions

### How do I check the version of my running SGX Co-signer image?

To check your running SGX Co-signer image version, run the following command on your VM:

```bash theme={"system"}
 docker inspect cosigner | jq -r '.[0].Config.Image +" " + . [0].Image'
```

### How do I check the version of my running SGX Co-signer script?

To check your running SGX Co-signer script version, run the following command on your VM:

```bash theme={"system"}
 head cosigner -n 3 | grep -i ver
```
