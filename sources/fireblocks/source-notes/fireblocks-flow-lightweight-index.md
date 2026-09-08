<!--
source: 2026-09-07__support-fireblocks-io__fireblocks-flow.pdf (11p)
status: Mode B lightweight-index (Stage 174) — 본문 미적재. 색인 작성용으로 pdftotext 1회 열람
priority: TIER 2
domain: integration (온오프램프·입금 경로)
downloaded_at: 2026-09-07
-->

# Fireblocks Flow — lightweight index

| 파일 | URL |
|---|---|
| `2026-09-07__support-fireblocks-io__fireblocks-flow.pdf` | [27647997928604-Fireblocks-Flow](https://support.fireblocks.io/hc/en-us/articles/27647997928604-Fireblocks-Flow) |

## 무엇인가 (문서 1p 요약)

Dynamic(Fireblocks 자회사) 과 함께 만든 **checkout 프리미티브**. 사용자 자금 출처(자체 지갑·거래소 계정)에서 정산 목적지(Fireblocks vault·자체 주소·embedded wallet·외부 주소)까지 라우팅·변환·컴플라이언스를 한 흐름으로 처리한다. 입금·출금·크로스체인/토큰 변환을 같은 객체(checkout)로 다룬다. **Early Access**, API-first(Dynamic JS SDK 또는 Dynamic REST API). UI 위젯은 로드맵.

## ★ 이름 충돌 주의

CSM 확답(2026-08-28)의 **"KeyLink Flow"**(Key Link 용 패키지형 온라인 서버, [[open-questions/fireblocks#Q-2026-08-28-KL06]]) 와 **다른 제품**이다. 이 문서는 Key Link·HSM·Customer Server 를 다루지 않는다. KL06 은 이 문서로 닫히지 않는다.

## Why TIER 2 (TIER 1 아님)

- 우리 BC 설계는 Dynamic SDK 를 쓰지 않고 Fireblocks API 직결이다. 직접 영향 없음.
- 온오프램프 장([블록체인매니저/개요 10-ramp](../../../blockchain-manager/docs/블록체인매니저/개요/))이 벤더 선택을 다시 볼 때 후보로 올라올 수 있다.

## Cross-cut signal (1회 열람에서 확인한 사실, 페이지)

- vault 는 checkout 의 **목적지 또는 source** 로 쓰인다. 입금은 vault 입금 주소를 checkout destination 으로 등록 (p.3).
- **Flow 경유 입금은 화이트리스트 밖 외부 주소(사용자 지갑 또는 브릿지·DEX 컨트랙트)에서 도착하는 것이 정상 동작** — vault Policy 가 unwhitelisted inbound 를 허용해야 한다 (p.3). 우리 04 감지의 "source UNKNOWN/External" 처리와 같은 형태.
- 상태축 3개(execution / settlement / risk) 가 독립. `source_confirmed`(원천 체인 확정) ≠ `completed`(목적지 도착) (p.3-5).
- 웹훅: 상태축별 3 이벤트, HMAC-SHA256, **순서 미보장**, 재시도 5회(15s→1d), 실패 누적 시 자동 비활성(live 6회/1,500건 per 30d) (p.5-6). Fireblocks 웹훅 v2 와는 별도 채널(Dynamic 대시보드).
- 컴플라이언스: Chainalysis 제재 스크리닝 + IP 지역 차단 기본. 다른 스크리닝 공급자 연결 경로 없음 (p.6).
- 대사 키 = `memo` (전 수명 주기·웹훅 payload 에 유지) (p.6).
- 실패 코드 3군(고객 해결 / 설정·정책 / 엔지니어링 에스컬레이션) (p.8-9).

## Related (promote 시 확인할 대상)

- [[entities/fireblocks/transaction]] — Flow 정산 입금이 vault 거래로 어떻게 잡히는지(source External)
- [[vendors/fireblocks/compliance]] — Chainalysis 스크리닝 층의 중복 여부
- blockchain-manager/docs/블록체인매니저/개요 (온오프램프)

## Promote 조건

온오프램프 공급자 재검토, 또는 Flow 가 GA 되어 Fireblocks 웹훅 v2 와의 통합 방식이 문서화될 때. 그 전에는 색인만 유지.
