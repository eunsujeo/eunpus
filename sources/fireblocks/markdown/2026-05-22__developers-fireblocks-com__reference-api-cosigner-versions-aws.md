> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# AWS Nitro API Co-signer Version History

Fireblocks updates the API Co-signer software to include stability enhancements and new features. This article details the most recent AWS Nitro Co-signer versions. Always use the latest version listed here for optimal performance.

## Latest version

### **Version 2026.04.27 (April 2026)**

**Version hash:** `1d5b48eeef`

* Performance improvements and bug fixes

***

## Version history

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

* The callback can now return a “retry” response in an exchange withdraw operation

### Version 2025.11.20 (November 2025)

**Version hash:** 82a5cc0078

* Fixed a bug that may cause the Co-signer not to load correctly after a graceful shutdown

### Version 2025.10.09 (October 2025)

**Version hash:** 4e34888c01

* Fixed bug parsing messages after websocket reconnect
* Fixed bug sending messages on half closed websocket connections

### Version 2025.08.12 (August 2025; US environments only)

**Version hash:** 19c07421dc

* Fixed WebSocket bug causing performance issues

### Version 2025.07.16 (July 2025)

**Version hash:** bb61e507

* Fixed bugs and increased performance
* Better support for web sockets

### Version 2.1.1 (April 2025)

**Version hash:** 7160d7b833

* Bug fixes and performance improvements

### Version 2.0.5 (September 2024)

**Version hash:** d177e696c3

* Decreased signing latency along with general performance increases
* Extended filtering of environment variables
* Improvements to key handling within the enclave
* Bug fixes

### Version 2.0.4 (August 2024)

**Version hash:** 41d1888dc8

* Fixed the issue when setting AWS region using environment variables
* Removed unnecessary testing artifacts

### Version 2.0.2 (August 2024)

* Modified KMS CMK ARN prompt
* Added start, stop and restart commands
* Added echo to show where logs are saved to
* Fixed AWS NTP sync issue
* Fixed Callback Handler public key issue on install
* Removed unnecessary testing artifacts

### Version 2.0.1 (July 2024)

* Added check for force flag and existence of destination before the user is prompted for details
* Added route DNS queries to the DNS server defined on the host EC2 instance

### Version 2.0.0 (June 2024)

* Initial release
