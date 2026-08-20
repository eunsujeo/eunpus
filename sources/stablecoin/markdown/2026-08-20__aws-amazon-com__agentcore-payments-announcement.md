# Agents that transact: Introducing Amazon Bedrock AgentCore payments (AWS 공식 블로그)

> source: https://aws.amazon.com/blogs/machine-learning/agents-that-transact-introducing-amazon-bedrock-agentcore-payments-built-with-coinbase-and-stripe/
> fetched: 2026-08-20 (WebFetch 추출 — ★ 원문 verbatim 아님, 추출기가 구조 재편성한 요약본. 세부 인용 시 원문 재확인 필요)
> 발표: 2026-05-07, Preethi CN (Director of AgentCore)

## Overview

AWS has announced Amazon Bedrock AgentCore payments (preview), enabling AI agents to autonomously access and pay for resources including web content, APIs, MCP servers, and other agents.

## Key Partnership Details

- **Coinbase** — Providing wallet infrastructure and stablecoin payment rails built on the x402 protocol
- **Stripe** — Offering wallet infrastructure through Privy to enable agent transactions

## Core Features

**Payment Authentication & Security:**
- Agents connect to either Coinbase or Stripe Privy wallets
- End users must explicitly authorize agent wallet access
- Session-based spending limits enforce budget constraints
- Payment credentials are managed by AgentCore, preventing agent misuse

**Transaction Processing:**
- Agents receive HTTP 402 "Payment Required" responses from paid endpoints
- The payment manager orchestrates stablecoin micropayments using the x402 protocol
- Full transaction traceability available in the AgentCore console
- Transactions occur within the agent's execution loop

**Service Discovery:**
- The Coinbase x402 Bazaar MCP server helps agents independently discover and access paid services
- Agents can find merchants without hardcoded integrations

## Use Cases in Preview

Initial focus: agent-to-agent micropayments for real-time market data and paywalled publications, specialized APIs and paid MCP servers, private package registries and sandboxed execution environments.

## Regional Availability

Preview in US East (N. Virginia), US West (Oregon), Europe (Frankfurt), Asia Pacific (Sydney).

## Future Direction

Beyond micropayments: flight bookings, hotel reservations, direct consumer purchases — requiring deeper payment ecosystem integration and enhanced buyer intent verification.

## Industry Adoption

Early adopters mentioned: Cox Automotive, Thomson Reuters, PGA TOUR, Heurist AI (financial analysis agents), Warner Bros. Discovery (evaluating).
