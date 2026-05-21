# 글쓰기 스타일 — 평이한 한글 + jargon 처리

## 기본 원칙

영어 jargon 을 그대로 두면 일반 독자가 통과 못 합니다. 다음 3 단계로 처리:

1. **풀어쓰기** — 본문 흐름 안에서 의미를 설명 ("nonce 는 같은 주소에서 출금하는 tx 의 0, 1, 2, … 순서 번호")
2. **Glossary tooltip `(?)`** — 본문 흐름을 끊지 않고 마우스오버 시 풀이. 한 문서에서 같은 용어가 여러 번 등장하면 모든 인스턴스에 동일 tooltip 부착 (검색 가능성)
3. **표/도식** — 같은 차원에서 비교 가능한 항목은 표로

## Glossary tooltip 패턴

```html
<span class="g" data-tip="간결한 한 문장 의미. 핵심만." tabindex="0">(?)</span>
```

- `class="g"` — CSS 의 tooltip 스타일 트리거
- `data-tip="..."` — 한 줄 풀이. 2~3 문장 넘기지 말 것
- `tabindex="0"` — 키보드 포커스 가능 (접근성)
- 본문 단어 바로 뒤에 inline 으로 부착

## 한국어 어휘 매핑 (자주 쓰는 정정)

| 영어 직역 (X) | 자연스러운 한국어 (O) |
|---|---|
| 운영 동사 | 운영 액션 |
| chain-specific quirk | chain 별 특이 제약 |
| hard stuck / soft throttle | 막힘 (영구) / 기다림 (일시) — 풀어쓰기 |
| burst | 짧은 시간에 한꺼번에 몰리는 상황 |
| sequential bottleneck | 순서 정체 |
| idempotent insert | 중복 방지 (idempotency) |
| stuck | 멈춤 |
| reorg | reorg (블록 재구성) — 영문은 처음 등장 시만 |
| webhook delivery 추적 | 알림 도착 추적 |
| set-once | set-once — schema discipline marker 라 영문 유지 |
| append-only | append-only — 동일 |
| FK / PK | FK / PK — 자료형 컬럼에서 약어 OK |

## 첫 등장 패턴

영문 약어가 본문에 처음 나올 때:

**나쁜 예 (그대로 노출)**:
> Solana 는 RBF 가 없다.

**좋은 예 (풀어쓰기)**:
> Solana 에는 fee 인상으로 stuck tx 를 교체하는 메커니즘 (EVM/BTC 의 RBF — Replace-By-Fee — 같은 것) 이 없다.

**짧게 보존이 필요하면 tooltip**:
> Solana 에는 RBF<span class="g" data-tip="Replace-By-Fee. broadcast 중 fee 인상으로 stuck tx 교체" tabindex="0">(?)</span> 가 없다.

## 길어지는 enumeration 은 `<dl>` 로

chain 별 · 케이스별 · type 별로 항목이 4 개 이상이고 각 항목 설명이 한 줄 넘는 경우 `<ul>` → `<dl>`:

```html
<dl class="chain-rr">
<dt><strong>EVM (Ethereum · Polygon · Arbitrum 등)</strong></dt>
<dd>여러 줄 설명…<br>→ 권장 처리</dd>

<dt><strong>Bitcoin</strong></dt>
<dd>여러 줄 설명…<br>→ 권장 처리</dd>
</dl>
```

`<dt>` 가 굵게, `<dd>` 가 indent 되어 chain 별 비교가 시각적으로 명확.

## 헤딩 패턴

섹션 제목은 "X — 짧은 의미" 형식:

| 나쁨 | 좋음 |
|---|---|
| DCCP | DCCP — 입금/출금에 필요한 confirmation 횟수 정책 |
| Reorg Handling (hypothesis) | Reorg (블록 재구성) 처리 — schema 가 반드시 표현해야 할 path |
| Internal Transactions (EVM) | EVM 의 internal transaction — "안 보이는" 입금 |
| 운영 동사 | 운영 액션 — 어느 상태에서 무엇이 가능한가 |

## 문장 끝 처리

- "필요합니다." / "권장합니다." 같은 분명한 종결
- "~ 일 수 있습니다" / "~ 인 것 같습니다" 추정형 남용 금지 (출처 명확하면 확정형, 명확치 않으면 callout 으로 분리)
- 한 문단 안에 같은 추정형 동사 반복 회피
