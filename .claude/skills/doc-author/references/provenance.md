# 출처 분리 (Provenance) — source vs author-inference

기술 reference 문서가 외부 source (vendor 공식 문서 등) 를 인용하는 경우, 어디까지가 출처 attributable 사실이고 어디부터가 저자가 합리적으로 추론해서 채운 설계인지를 **독자가 미리 알 수 있도록** 표시해야 한다. 이것은 신뢰의 기본.

## 페이지 상단 disclosure callout

외부 source 인용이 섞인 페이지에는 본문 시작 전에 다음 형태의 callout 을 둔다:

```html
<div class="callout">
<div class="callout-title">본 페이지의 출처 — 어디까지가 [Vendor] 정의이고, 어디부터가 추정인가</div>
<p>이 페이지의 내용은 두 갈래입니다. 미리 구분해두면 어떤 부분을 그대로 받아들이고 어떤 부분은 본인 환경에서 검증할지 판단이 쉬워집니다.</p>
<p><strong>[Vendor] 공식 문서에 정의된 사실</strong> — 그대로 받아들여도 안전</p>
<ul>
<li>… (구체 항목 1)</li>
<li>… (구체 항목 2)</li>
</ul>
<p><strong>저자가 합리적으로 추정해서 그린 설계</strong> — 참고용, 본인 환경에서 검증 권장</p>
<ul>
<li>… (구체 항목 1)</li>
<li>… (구체 항목 2)</li>
</ul>
</div>
```

## 라벨 어휘

| 사용 (X) | 사용 (O) |
|---|---|
| Fireblocks 명시 / Hypothesis | [Vendor] 공식 문서에 정의된 사실 / 저자가 합리적으로 추정해서 그린 설계 |
| ★ 정식 명세 | (그냥 명시 안 함 — 본문에 출처 인용으로 충분) |
| (hypothesis) | (의미 있는 path 면 제거 후 "필수 path" 로 격상, 무의미하면 제거) |
| TIER 3 / source-lake-only | (wiki 내부 분류 — public 에 노출 금지) |

## Callout style 선택

| Class | 용도 |
|---|---|
| `callout` | 중립 정보 — 출처 분리, 운영 노트 |
| `callout-warn` | 진짜 경고 — 시간 경합, 데이터 손실 위험 |

출처 disclosure 는 **경고가 아니므로 `callout` (중립)** 을 사용. `callout-warn` 은 운영자가 즉시 조심해야 하는 사항에만.

## 인라인 출처 표기 금지

public docs 본문에는 raw source 파일명을 그대로 노출하지 않는다:

| 나쁨 | 좋음 |
|---|---|
| `<code>account-and-wallet-structure.md</code>, p.1 에서 정식 enumerate.` | (그냥 본문 그대로. 페이지 상단 callout 으로 충분) |
| `<code>user-roles.md</code>, p.2 권한표:` | "공식 권한표에 따르면…" 또는 그냥 사실만 진술 |
| `(source: foo.md, p.5)` | (제거. 페이지 상단 callout 이 일괄 처리) |

이유: wiki repo 의 파일명은 public 독자가 접근할 수 없으므로 noise. 그리고 우리 wiki 내부 구조가 public 문서에 노출되면 향후 wiki 재정리 시 docs 가 모두 stale.

## 사실 검증 절차 (raw source grep)

fact 를 진술하기 전에 (특히 숫자, 임계치, 정책 이름):

1. `sources/<vendor>/markdown/` 또는 `entities/<vendor>/` 에서 grep
2. 일치하는 진술이 있으면 — 그대로 사용 OK
3. 없으면 — "추정" 으로 분리 (callout 의 두 번째 카테고리), 또는 사용자에게 확인
4. **추정인지 fact 인지 명확히 못 하면 진술하지 말 것** — "evidence isolation"

## Fabrication 발견 시 정정 절차

이전 draft 에 출처 없는 내용이 들어가 있었다면:

1. 사용자에게 정직하게 알린다 — "이전 작성 시 X 부분이 source 없이 들어갔습니다. raw source 확인 결과 …"
2. 정정한다 — 제거 또는 추정 카테고리로 이동
3. 다른 페이지에 같은 fabrication 이 더 있는지 sweep

예시 (이번 세션에서 실제 발생):
- `START → BROADCASTING` edge — incoming flow 에 잘못 들어가 있던 outgoing-only 상태. raw source grep 결과 outgoing #9 임을 확인 → 제거
- `"network conn / exchange / gas station"` 라벨 — raw source 에 없음 → 제거
- `"5-tx cap" 을 hard stuck 분류` — raw source 가 soft throttle 명시 → 분류 정정

## 인용 형태

본문 안에 source 의 정확한 표현을 인용하는 경우:

```html
<blockquote>
<p>"Stage 7 의 'Solana 600 queue cap' (vault account 가 아닌 workspace-wide) 와 별도. Per-vault 한도는 5, workspace 한도는 600."</p>
</blockquote>
```

또는 callout 안:

```html
<div class="callout">
<div class="callout-title"><code>primary-transaction-statuses.md</code> 직접 인용 (공식 확인)</div>
<p><em>"인용 본문"</em></p>
</div>
```

이렇게 따옴표로 분명히 구분된 형태로만 raw source 파일명 노출 허용 (직접 인용 단락의 attribution). 그 외 본문에는 안 둠.
