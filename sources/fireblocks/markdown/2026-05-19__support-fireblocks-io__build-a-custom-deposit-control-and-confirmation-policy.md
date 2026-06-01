<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/10883650908572-Build-a-custom-Deposit-Control-and-Confirmation-Policy
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy.pdf
status: full
priority: TIER1
domain: Blockchain-Assets / Deposit-Lifecycle / Policy
-->

# Build a custom Deposit Control and Confirmation Policy

*Updated 8 months ago* (as of 2026-05-19 capture)

## One-line summary

Default DCCP 를 override 하려면 **template download → modify → Fireblocks Support 제출 → review/approval/implementation**. **Customer self-service 불가** — support 경유 mandatory. **First-match basis rule set** 으로 동작. 6 parameters: Source / Destination / Amount / Asset / Blockchain network / # of Confirmations.

## Key Concepts

### 1. Custom DCCP submission workflow (p.1)

> "First, download the DCCP template, then modify it according to your organization's business needs and risk models."
>
> "After you're done, submit your policy template to Fireblocks Support for review, approval, and implementation."

→ Workflow:
1. Customer download template
2. Customer modify
3. **Submit to Fireblocks Support**
4. Fireblocks **review + approval + implementation**

→ ★ Console UI 에서 customer 가 self-publish 하는 모델 아님. Fireblocks 가 sanity-check 후 적용. Lead-time / SLA 명시 없음 — open question.

### 2. Use cases (p.1)

> "You can enter zero or a small number for faster confirmations for known and trusted sources."
> "You can enter a higher number to help mitigate risks for unknown or untrusted sources."

→ 신뢰도 기반 latency-vs-risk trade-off 명시.

### 3. First-match basis rule set (p.1)

> "The DCCP operates on a first-match basis rule set using the following parameters"

→ TAP / Policy engine 의 first-match semantics 와 동일 패턴. 규칙 순서가 결과 결정.

### 4. Rule parameters (p.1-2)

| Parameter | 정의 | 허용 값 |
|---|---|---|
| **Source** | tx 출발 venue 유형 | specific (vault account) / group (all Binance accounts) / general (all exchanges, all Fireblocks P2P Network connections) |
| **Destination** | tx 도착 venue 유형 | Source 와 동일 값 셋 |
| **Amount** | rule 트리거 임계 (minimum or maximum) | USD equivalent / specific asset quantity / `Any` |
| **Asset** | tx 자산 유형 | Asset ID / contract address / symbol+blockchain / name+blockchain / `Any` |
| **Blockchain network** | 자산 체인 네트워크 | Fireblocks 지원 체인 (mainnet + testnet) |
| **# of Confirmations** | 완료에 필요한 confirmation 수 | whole number (chain 의 min/max 범위) / `Minimum` (해당 chain 의 minimum 값) |

### 5. Asset 지정의 주의 (p.2)

- Specific asset 지정 시 **blockchain 도 반드시 지정** (USDC on Avalanche vs USDC on Ethereum 구별 필수)
- Symbol/name 만 사용하면 충돌 가능 → **Asset ID 또는 contract address 권장** (특히 다중 asset rule 시)

### 6. `Minimum` 의 동작 (p.2-3)

> "For example, you may set all vault-to-vault transactions for any asset on any blockchain to the minimum number of confirmations. Then all vault-to-vault BTC transactions will move to complete after 0 confirmations, while transactions of any asset on Polygon will complete after 1 confirmation."

→ `Minimum` 값은 chain 별 minimum 으로 동적 매핑:
- BTC vault-to-vault: 0 confirmations
- Polygon vault-to-vault: 1 confirmation (EVM minimum)

### 7. Rule examples (p.3)

| # | Source | Destination | Amount | Asset | Blockchain | # Conf | 설명 |
|---|---|---|---|---|---|---|---|
| 1 | Any | Any | Any | ETC | Ethereum Classic | 500 | 51% attack risk |
| 2 | Vault | Vault | Any | Any | Any | Minimum | 자체 워크스페이스 내부 이동 |
| 3 | Coinbase Exchange | Vault | Any | Any | Litecoin | Minimum | 외부 → vault (LTC minimum = 6) |
| 4 | Any | Vault | 10K | BTC | Bitcoin | 6 | 고액 BTC 입금 |
| 5 | Any | Vault | Any | BTC | Bitcoin | 3 | 일반 BTC 입금 |
| 6 | Any | Vault | Any | USDC | Avalanche | 7 | USDC on AVAX |
| 7 | Any | Vault | Any | USDC | Ethereum | 6 | USDC on ETH |
| 8 | Any | Any | Any | Any | Any | 1 | catch-all |

→ 예제 자체가 운영 reference 로 가치 (특히 USDC 의 chain 별 차등).

## For full content
`sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy.pdf` (5 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/blockchains]]
- [[vendors/fireblocks/policy-engine]] — first-match semantics 공통
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/vault-account]]
- [[2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy]]
- [[2026-05-19__support-fireblocks-io__blockchain-confirmation-limitations]] — chain 별 min/max

## Open Questions
- Q-2026-05-29-DC02 — Fireblocks Support 의 custom DCCP review SLA / lead-time (자료 본문에 명시 없음)
- Q-2026-05-29-DC03 — Custom DCCP 변경 이력 audit trail (누가 언제 어떤 규칙으로 변경했는지 customer 측 audit 노출 여부)
- Q-2026-05-29-DC04 — "Override the DCCP for specific transactions" (Related Articles 에 언급) 의 메커니즘 — Custom DCCP 와 별도의 per-tx override plane 존재
