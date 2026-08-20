# Fireblocks Gasless Service — lightweight index (Mode B, 본문 미수집)

> 출처: support.fireblocks.io 라이브 sitemap fetch (2026-07-03) + 사용자 제공 헬프센터 사이드바 스크린샷. **본문은 Cloudflare 챌린지로 curl·WebFetch 모두 403 — fact 추출 보류.** 제목·존재만 확정.

## ★ 부정 확인 정정

Stage 129 리서치의 "Fireblocks 는 gasless 미지원" 판정은 **developers.fireblocks.com llms.txt(개발자 문서)에 한정**된 것이었다. **support.fireblocks.io 헬프센터에 "Gasless Service" 섹션이 실재** — 개발자 문서 인덱스에 없다고 제품이 없는 게 아니다. (교훈: 부정 확인의 범위를 명시할 것)

## 문서 트리 (스크린샷 + sitemap 교차)

### Gasless Service 섹션
| 제목 | URL |
|---|---|
| About the Fireblocks Gasless Service | /articles/14771633894940 |
| Using a local gasless relay in your workspace | /articles/18946638033692 |
| Using an external workspace as a gasless relay | /articles/14772712920604 |
| Using the Fireblocks Gasless Relay | /articles/23508430639516 |
| Using a workspace as a gasless relay provider | /articles/14773041139868 |
| Gasless settings for individual transfers | /articles/14773823572124 |
| Gasless fee contingencies | /articles/16746653708828 |
| Universal Gasless | /articles/19948199000092 |
| Configuring Universal Gasless transactions | /articles/19948348855964 |
| Universal Gasless integrated chains | /articles/21285504712988 |
| Configuring Solana Gasless transactions | /articles/20170988182300 |

### 인접 (tokenization 계열, sitemap 발견)
- Deploying gasless contracts /articles/17737183089948
- Gasless tokenization infrastructure /articles/17737201086876
- Resolving gasless tokenization issues /articles/17737215753500
- Interacting with gasless contracts /articles/17737217770012

## 제목에서 읽히는 구조 신호 (fact 아님 — 제목 기반 추정, 본문 확인 필요)

- relay 3형태로 보임: **local relay(자기 워크스페이스)** / **외부 워크스페이스 relay** / **Fireblocks 제공 relay** — 즉 "gas 를 대신 내는 relay 주체"를 고를 수 있는 모델로 추정.
- **Solana Gasless 존재** → ERC-4337 기반이 아니라 Fireblocks 자체 relay 아키텍처일 가능성.
- "fee contingencies" = 대납 실패/정산 케이스 문서로 추정.

## Promote 조건

본문 수집 경로: 사용자 브라우저 복사 제공(권장) 또는 인증 세션 fetch. 최소 3건 우선 — About / Universal Gasless / Universal Gasless integrated chains.
