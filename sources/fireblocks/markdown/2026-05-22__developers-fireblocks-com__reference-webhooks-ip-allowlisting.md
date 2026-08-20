> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# IP allowlisting

In some environments, firewalls or other security configurations may block incoming traffic unless it originates from approved IP addresses. If your environment requires IP addresses to be approved, you'll need to add the following outbound IP addresses used by Fireblocks to send webhooks.

Fireblocks strongly recommends validating webhook signatures instead of relying solely on IP addresses. Signature validation ensures the authenticity of the notification regardless of your network configuration.

## IP addresses by environment

### US environment

* 3.135.57.98

### EU environment

* 63.179.12.78

### EU2 environment

* 3.77.138.100

### Developer Sandbox environment

* 18.117.207.128
