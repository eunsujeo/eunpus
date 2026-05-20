<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/13697251854108-Fireblocks-IP-addresses-to-whitelist
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__fireblocks-ip-addresses-to-whitelist.pdf
status: full
priority: TIER2
domain: Security-Access
-->

# Fireblocks IP addresses to whitelist

*Updated 2 months ago*

## One-line summary

**Customer egress firewall** 에서 허용해야 할 Fireblocks-side **ingress IP** 목록. **3-region (US/EU/EU2) ingress + Cloudflare 범위 + region-별 webhook source IP**. → 기존 ip-allowlist entity 의 두 plane (API/Console ingress) 에 더해 **"customer egress → Fireblocks" 라는 세 번째 plane** 등장.

## Key Concepts

### Platform Ingress (customer 의 firewall 에서 Fireblocks Console/mobile/API 로 나가는 트래픽 허용)
p.1:
- **Cloudflare IP range** (전체)
- **Ingress addresses**:
  - **US**: `3.133.194.13`
  - **EU**: `3.126.240.51`
  - **EU2**: `3.77.238.179`

→ 3 region 배포 확인 (US, EU, EU2).

### Webhook Source IPs (Fireblocks → customer webhook receiver, customer receiver firewall 에서 허용)
- **US**: `3.134.25.131`
- **EU**: `3.72.125.45`, `18.184.217.45`, `18.198.71.192`

→ Webhook 은 단일 IP (US) 또는 3 IP (EU) — webhook source plane 별도.

## Implication

**IP allowlist plane 이 3개로 확장:**

| Plane | 방향 | 형식 | 목적 |
|---|---|---|---|
| **API user IP allowlist** | customer → Fireblocks (ingress to Fireblocks) | /32 strict | API key 별 호출 source 제한 |
| **Console IP allowlist** | customer → Fireblocks (ingress to Fireblocks) | CIDR/range | Console 접근 source 제한 |
| **Fireblocks egress to customer (webhook)** | Fireblocks → customer (egress from Fireblocks) | individual IP | customer 가 webhook receiver firewall 에서 허용 |
| **(별도)** Customer egress to Fireblocks | customer → Fireblocks (egress from customer) | individual IP + Cloudflare | customer 가 자신의 firewall 에서 허용 |

→ 기존 spine 의 "**two IP allowlist planes**" 표현은 부정확. 정확히 표현하면 **two Fireblocks-side ingress planes (API user / Console)** 와 **two customer-side firewall configs (egress allow / webhook ingress allow)** 로 4 plane.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__fireblocks-ip-addresses-to-whitelist.pdf` (1 page).

## Related Pages (cite targets)
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/security]]
- [[entities/fireblocks/ip-allowlist]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/console-user]]
