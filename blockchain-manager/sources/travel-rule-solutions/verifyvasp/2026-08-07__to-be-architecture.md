---
updatedAt: 2025-08-20T04:37:24.000Z
---

Fetch the complete documentation index at: https://docs.verifyvasp.com/llms.txt. Use this file to discover all available pages before exploring further.

# To-Be Architecture

This section outlines the To-Be Architecture of a VASP backend for TravelRule integration, along with the required implementation scope.

## VASP Backend To-Be Architecture

Diagram 1 shows the To-Be Architecture of a VASP backend after completing TravelRule integration.\
To enable TravelRule support, integrate the processes shown within the dotted boundary (outside the VASP’s core business logic) and implement the required features.

<Image align="center" border={false} caption="Diagram 1. Future-State VASP: Implementation Scope" src="https://files.readme.io/50e08e8212d7e0a2aaf3ca0ec924c3311a70710be8ef6e0273ea8d700c2d6b52-tr_to_be_arct_1.png" width="400px" />

<br />

### Withdrawal Verification Process Integration

To operate as a Travel Rule–compliant Ordering VASP, all VASPs must integrate both beneficiary account verification and beneficiary identity verification scenarios into the withdrawal process.\
Following the Best Practice workflow defined in the [Scenarios and Flows](https://docs.verifyvasp.com/reference/travelrule-scenarios-and-flows) section ensures compliance with regulatory requirements and strengthens the VASP’s operational capabilities.

<br />

### Implementing Required APIs

For TravelRule integration, VASPs must implement four core APIs and one auxiliary API (for database management) as indicated in Diagram 1. These APIs are essential for performing verification and reporting procedures, and must be accessible to the Enclave for invocation.

Required VASP APIs:

* [Verify User Account API](https://docs.verifyvasp.com/reference/travelrule-user-account-verification)
* [Verify User API](https://docs.verifyvasp.com/reference/travelrule-user-verification)
* [Check Transaction Status API](https://docs.verifyvasp.com/reference/travelrule-enclave-check-transaction-status)
* [Callback API](https://docs.verifyvasp.com/reference/travelrule-callback)
* [Database Setup](https://docs.verifyvasp.com/reference/travelrule-database-setup)

<br />

## Full System To-Be Architecture

<Image align="center" border={false} caption="Diagram 2. Future-State VASP: Final Architecture" src="https://files.readme.io/00c107710ed90f7bd0430933f94e66c07db48f94e255b7db41651086fcda0413-tr_to_be_arct_2.webp" />

Diagram 2 shows the final system architecture for a VASP. Each VASP must install the Enclave server within the same infrastructure as the VASP backend, and configure it to exchange API calls required for the TravelRule process. The VASP must also set up a dedicated Enclave database to store and retrieve integration logs and related data from the Enclave.

* **Gray arrows** represent the integration flow when acting as the Ordering VASP.
* **Green arrows** represent the integration flow when acting as the Beneficiary VASP.