<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/13950564581660-Node-Router
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__node-router.pdf
-->

# Node Router

*Updated 5 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

> **Premium feature**: This is a premium feature that requires additional purchase and enablement by Fireblocks Support. If you're interested in this feature for your workspace, contact your Customer Success Manager.

## Overview

You may prefer to route your submitted transactions to your blockchain node or a third-party node instead of using our default-supported blockchain nodes. There can be various reasons for this, such as your organization wanting more customization and control (i.e., you want to use nodes with specific, preferred features) or needing to do so for compliance reasons (i.e., you may be obligated to maintain your nodes in-house).

## Use scenarios

There are two possible scenarios for using a Node Router.

### Static dedicated route

A static dedicated route is when you can provide us with a dedicated node that will be used for all your outgoing transactions by default (API, UI, WC).

<!-- page: 2 -->

### On-demand route

An on-demand route is when you can provide us with dedicated nodes that will be used on-demand via API — specifically, the desired node once the transaction API call is created.

<!-- page: 3 -->

## Restrictions

- **Only a single node** can be provided in the Static Dedicated Route case. This node will be used for all vaults related to the tenant.
- **At this time this feature can work exclusively with EVMs.**
- Your alternative node is used for operations related to transaction preparation and submission (`sendRawTransaction`, `getTransactionCount`). All other operations that are considered publicly available are routed to our default nodes.

## How to activate Node Router

Contact your Customer Success Manager to activate the node router feature, which routes your transactions to your alternative, non-Fireblocks node.

> **Notes**:
> - Your organization is responsible for your node's maintenance.
> - Your organization cannot use our default node as a fallback when your static dedicated node is not functional.
