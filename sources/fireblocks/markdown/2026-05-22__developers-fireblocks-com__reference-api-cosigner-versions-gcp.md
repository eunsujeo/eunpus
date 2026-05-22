> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# GCP Confidential Space API Co-signer Version History

Fireblocks updates the API Co-signer software to include stability enhancements and new features. This article details the most recent Google Cloud Confidential Space Co-signer versions. Always use the latest version listed here for optimal performance.

***

## Latest version

### **Version 2026.04.27 (April 2026)**

**Version hash:** `1d5b48eeef`

* The cosigner can now connect through a proxy. User/password authentication and no\_proxy values are also supported.
* Performance improvements and bug fixes

***

## Version history

### Version 2026.03.02 (March 2026)

**Version hash:** `95a317d3c7`

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

### Version 2025.08.12 (August 2025; US environments only)

**Version hash:** 19c07421dc

* Fixed WebSocket bug causing performance issues
* Image digest SHA (US): sha256:61f951f0b8a66e906ab3ef742a3aa6b0312b279190c3e6478feae6d4b002be3f
* Image path (US): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:2025.08.12

### Version 2025.07.16 (July 2025)

**Version hash:** bb61e507

* Fixed bugs and increased performance
* Better support for web sockets
* Image digest SHA (US): sha256:19b651f855f697ffc67ba97c33639f5a4c6db717019412df62e3ee5994ea6c44
* Image Path (US): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:2025.07.16
* Image details for EU:
  Digest SHA - sha256:4318bf2b9c0eccf8fd2cda2291366a6cf406e426c8a97b3d754a3d9bcc4e1d13 Path - us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:2025.07.16.eu
* Image details for EU2:
  Digest SHA - sha256:1f11be136216311532d1277d7fe9e4aba3e4394c6f699904f8969aca097c3dc0 Path - us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:2025.07.16.eu2
* Image details for Sandbox:
  Digest SHA - sha256:5155a2258fba75b7321ca3136aab47f2af0a14dd0cdf29e0132ab06da1ab6086 Path - us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:2025.07.16.sandbox

### Version 1.1.1 (April 2025)

**Version hash:** 7160d7b833

* Bug fixes and performance improvements

### Version 1.1.0 (March 2025)

**Version hash:** 2584ed02d1

* Image SHA (US): sha256:40893bdf713df66f4cfa857420989b583c0011c84fee0b8f92acd182d37a7f81
* Image Path (US): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.1.0
* Image SHA (EU): sha256:2e4f02f5c90e92819111fd93822cf557ab1ffd5a8faed919bd3144ce0563e6cc
* Image Path (EU): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.1.0.eu
* Image SHA (EU2): sha256:af2178f2f80a64107b04d7627e3e0e2483c745f999fdf30f60c2808900ae40ff
* Image Path (EU2): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.1.0.eu2
* Bug fixes and performance improvements

### Version 1.0.0 (January 2025)

**Version hash:** 27de90bb6f

* Image SHA (US): sha256:af6b7e6276af09e20e389ec2f63299bca293f646154e48b8144a2a9179c0b06e
* Added helper script for updating an existing GCP Customer Co-Signer to a newer image
* Validated + handled if missing physicalDeviceId in the Co-Signer’s config (relevant to all Co-Signers)
* Added default image path and image SHA to GCP Customer Co-Signer scripts
* Image SHA (US): sha256:af6b7e6276af09e20e389ec2f63299bca293f646154e48b8144a2a9179c0b06e
  Image Path (US): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.0.0
* Image SHA (EU): sha256:5c456aa3e5953e0fedfa80717d8cc977e9d9ee94eb561cbabe69379baa587386
* Image Path (EU): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.0.0.eu
* Image SHA (EU2): sha256:861c5d90fdb345a794cea4a8ce2c886c2cb3a9d531b825da38cc27848b978a0c
* Image Path (EU2): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.0.0.eu2
* Image SHA (Sandbox): sha256:18018d945f1bf7f8cd82273798d997c0bdef56db67a1c101c87d8e12aaf6df79
* Image Path (Sandbox): us-docker.pkg.dev/fireblocks-customer-cosigner/fireblocks-customer-cosigner-repository/gcp-cosigner:1.0.0.sandbox

### Version 0.9.5 (October 2024)

**Version hash:** 121b4c2775

* Image SHA: sha256:894c4e573b52e785cf7b2ad2e10f73d766b4a88cb1078daf087ce8ab8703f928
* Security policy enhancements
* Bug fixes

### Version 0.9.4 (November 2024; EU version)

**Version hash:** d177e696c3

* Image SHA: sha256:30aca13b7dcb7db41a4138066ca3bc6e601ad1cdc417484f8c6a7433851eba62
* Added support for platform remote commands
* Performance optimizations
* Security policy enhancements
* Bug fixes

### Version 0.9.4 (October 2024; non-EU version)

**Version hash:** d177e696c3

* Image SHA: sha256:7ecfc480ccb65613db0f2b1cedfcd765be944bbadb5da1e0e098fa0ccb0876cb (Prod, not EU)
* Added support for platform remote commands
* Performance optimizations
* Security policy enhancements
* Bug fixes

### Version 0.9.3 (August 2024)

**Version hash:** 6647aa5291

* Image SHA: sha256:ed12b926a7d46e98be9943791c4e350dd193a4bc5f7c222ce1c765715b11bf9e
* Added printing the Co-signer Public Key to the logs

### Version 0.9.2 (July 2024)

**Version hash:** 257b33246b

* Image SHA: sha256:5bd371e9a877bcf7cc662ecaae5791b3b5c8b797348e1540faaf272cc153cb39
* Initial release
