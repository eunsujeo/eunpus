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

### Page-wide consistency — 새 tooltip 추가 시 같은 용어 전수 sweep 필수

용어를 본문 어딘가에 풀이하거나 tooltip 을 새로 붙일 때, **그 용어가 같은 페이지의 다른 곳 (특히 상단 출처 callout / 한눈 비교 표 / 다이어그램 caption 등 reader 가 본문보다 먼저 만나는 위치) 에 처리되지 않은 채 남아 있는지 반드시 grep** 해야 한다.

**왜** — 본문에서 풀이를 봤더라도 reader 가 페이지를 위에서 아래로 순서대로 읽기 시작하는 경우, **상단 callout 의 같은 용어가 acronym 만으로 노출되어 있으면 그 시점에 막힘**. 본문에 도달하기 전에 이미 신뢰가 깨짐.

**적용 패턴**:
1. 본문에 용어 풀이 / tooltip 추가 직후 `grep -n "<용어>"` 로 같은 페이지의 다른 occurrence 점검
2. 다른 곳에 동일 용어가 있으면 모두 같은 tooltip 텍스트 부착 (검색 가능성 + 일관성)
3. 특히 점검 우선순위:
   - 페이지 상단 출처 callout (가장 먼저 읽힘)
   - 비교 / 요약 표 (본문보다 먼저 읽는 경우 많음)
   - 다이어그램의 caption
   - 섹션 heading

이 룰은 [site-template](site-template-custodial-db.md) 의 tooltip 사전과 함께 쓰임 — 새 용어를 처음 풀이할 때 사전에도 추가하면 다음 페이지에서 같은 용어가 등장할 때 일관 적용 가능.

## 한국어 어휘 매핑 (자주 쓰는 정정)

| 정정 대상 (영어 jargon / 한자어 / 격식어) | 자연스러운 한국어 |
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
| 불요 (한자어) | 필요 없음 / 없이 진행 / 없음 — 문맥에 맞게 |
| 발효 (한자어) | 적용 / 효력 발생 — 법률/정책 맥락이라도 평이한 한글로 |
| 함의 (한자어) | 미치는 영향 / 운영상 의미 / 시사하는 것 — 학술적 표현 회피 |
| SOP | 운영 절차 (체크리스트) — Standard Operating Procedure 의 약어, 일반 독자에게 낯섦 |
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
