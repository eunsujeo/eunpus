<!--
source: 2026-08-11__support-fireblocks-io__usdc-gateway-{overview,prerequisites-and-setup-guide}.pdf
        2026-08-11__support-fireblocks-io__setting-up-policy-rules-for-usdc-gateway.pdf
status: Mode C 로 승격됨 (Stage 39) — 본문 적재 완료. 이 문서는 색인 단계의 기록
priority: TIER1 후보
domain: Governance
downloaded_at: 2026-08-11
-->

# USDC Gateway — lightweight index

Fireblocks Help Center 3부작. **이후 Mode C 로 승격돼 본문을 적재했다** — 정리는 [브릿지 3장](../../../blockchain-manager/docs/블록체인매니저/브릿지/03-usdc-gateway.md). 아래는 색인 단계의 기록으로, 파일명·URL·문서 안의 링크 구조에서만 얻은 것이다.

| 파일 | URL |
|---|---|
| `…__usdc-gateway-overview.pdf` | [27419996238620-USDC-Gateway-Overview](https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview) |
| `…__usdc-gateway-prerequisites-and-setup-guide.pdf` | [27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide](https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide) |
| `…__setting-up-policy-rules-for-usdc-gateway.pdf` | [28897919442588-Setting-up-policy-rules-for-USDC-Gateway](https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway) |

## Why TIER 1 후보

- 정책 룰 편이 **Governance** 도메인 직격이다. 현재 [배치 sweep PoC](../../../blockchain-manager/docs/BC/설계/95-approve-pull-poc-result.md)의 다음 시나리오가 TAP 룰 실측이라, 벤더가 특정 기능에 대해 정책 룰을 어떻게 안내하는지가 바로 참고가 된다.
- 세 문서가 서로를 참조하는 한 묶음이라 promote 시 함께 다뤄야 한다.

## Cross-cut signal (링크 구조에서만)

각 PDF 안에 걸린 Help Center 링크다. 본문 주장이 아니라 **문서가 무엇을 옆에 두고 설명하는지**의 신호다.

- **정책 룰 계열** — swap orders / Typed Message / minting·burning / Solana program calls / automation actions / Travel Rule screening 의 정책 룰 문서가 함께 걸려 있다. 우리 [TAP entity](../../../vendors/fireblocks/tap.md)의 transactionType 8종과 대조할 후보.
- **On/Off-ramp 계열** — On/Off-ramp orders overview 와 그 정책 룰 예시가 두 문서에서 반복 등장한다.
- **co-signer** — 설정 편이 `CloudFormation template for API Co-signers on AWS Nitro` 를 참조한다. [12-csm-poc](../../../blockchain-manager/docs/BC/설계/12-csm-poc.md) 의 co-signer 질문과 접점 가능.
- **계정 연결** — Circle account · Mopay account · Verified Assets · Fireblocks Labs Early Access 가 개요 편에 걸려 있다.

## Related (promote 시 확인할 대상)

- [[vendors/fireblocks/tap]] — 정책 룰 편이 기존 transactionType·rule 구조와 어떻게 맞물리는지
- [[entities/fireblocks/policy]] — 5 default policy rules 와의 관계
- [[entities/fireblocks/transaction]] — Gateway 거래가 어떤 operation 으로 잡히는지

## Promote 조건

**TAP 룰 실측에 착수할 때** 정책 룰 편부터 Mode C 로 올린다. 개요·설정 편은 USDC Gateway 자체를 도입 검토할 때.

지금은 우리 설계가 USDC Gateway 를 쓰지 않으므로 세 편 모두 보류 상태로 둔다.
