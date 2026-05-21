# Mermaid 도식 규약

## 색 팔레트 (classDef)

본 docs-site 의 표준 색. classDef 만 정의하면 동일한 시각 언어가 모든 도식에 일관:

```
classDef good fill:#dcfce7,stroke:#16a34a,stroke-width:2px;   /* 정상 완료 — 초록 */
classDef bad  fill:#fee2e2,stroke:#dc2626,stroke-width:2px;   /* 차단/실패/취소 — 빨강 */
classDef wait fill:#fef3c7,stroke:#d97706;                    /* 진행 중 — 노랑 */
classDef special fill:#e0e7ff,stroke:#6366f1;                 /* 특수 종착 — 파랑 */
classDef vault fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px; /* 자산 보관 단위 — 파랑 */
classDef addr fill:#dcfce7,stroke:#16a34a;                    /* 주소 — 초록 */
classDef tag fill:#fce7f3,stroke:#db2777;                     /* tag/memo — 분홍 */
classDef stuck fill:#fef3c7,stroke:#d97706;                   /* 정체된 노드 — 주황 */
```

색이 표현하는 의미가 도식마다 흔들리지 않도록 (good 이 어디서는 초록, 어디서는 파랑이 되지 않도록) 위 표준을 따른다.

## Direction

- **단일 흐름 (state machine, lifecycle)**: `direction LR` — 왼쪽에서 오른쪽으로 읽음
- **비교 도식 (단일 vs 분산 같은 좌우 비교)**: outer `flowchart TB` + 각 subgraph 안 `direction LR` (패널이 위/아래로 쌓이고 각 패널 내부는 좌→우)
- 위에서 아래 (TB) 흐름은 가독성 떨어지므로 가능한 LR 권장

## 노드 라벨 형식

기본:

```
state "✅ 입금 확정\n(COMPLETED)\n자금 사용 가능" as Done
```

3 줄 구성:
1. 이모지 + 한글 의미 ("✅ 입금 확정")
2. 영문 status code ("(COMPLETED)") — 영문 ENUM/API 와 일치
3. (선택) 한 줄 부연 ("자금 사용 가능")

이모지 매핑 (가독성):
- ✅ 완료 · ❌ 실패 · 🚫 차단/거절 · ↩️ 취소 · ⏳ 대기 · 📡 송신 · 🔍 심사 · 🛡️ 승인 대기 · ✍️ 서명 · 📨 외부 확인 · 🖊️ 특수 종착 · 📝 시작/요청 · 🏦 vault · 💰 wallet · 📍 address · 🏷️ tag

`<br/>` 사용 가능 (flowchart 와 stateDiagram-v2 양쪽). state diagram 의 quoted state 라벨에서는 `\n` 도 안전.

## Caption

모든 diagram 아래 `<span class="diagram-caption">` 으로 캡션:

```html
<span class="diagram-caption">Figure N. [도식 제목]. [색 분류 설명: 노란 박스=진행 중, 초록=성공, 빨강=실패]. [핵심 전이 요약]. [주의 사항 / 특수 케이스].</span>
```

캡션이 갖춰야 할 4 요소:
1. Figure 번호 + 제목
2. 색 분류 어떻게 읽는지
3. 핵심 path 요약 (정상 흐름)
4. 함정 / 예외 / 시간 제약 등

## State diagram (lifecycle / flow)

```mermaid
stateDiagram-v2
  direction LR

  state "🔍 AML 심사 대기\n(PENDING_AML_SCREENING)" as Aml
  state "⏳ confirmation 누적\n(CONFIRMING)" as Conf
  state "✅ 입금 확정\n(COMPLETED)" as Done
  state "🚫 차단\n(REJECTED)" as Rej

  [*] --> Aml : chain 관찰 + AML 사용
  [*] --> Conf : chain 관찰 + AML 미사용
  Aml --> Rej : 심사 거절
  Aml --> Conf : 통과
  Conf --> Done : DCCP 임계 도달
  Done --> [*]
  Rej --> [*]

  classDef good fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
  classDef bad fill:#fee2e2,stroke:#dc2626,stroke-width:2px;
  classDef wait fill:#fef3c7,stroke:#d97706;
  class Done good
  class Rej bad
  class Aml,Conf wait
```

## Flowchart (구조 / 비교)

```mermaid
flowchart TB
  subgraph SINGLE["❌ 단일 vault"]
    direction LR
    A --> B --> C
  end
  subgraph RR["✅ 분산"]
    direction LR
    D --> E
    D --> F
  end
```

비교 도식의 subgraph 제목에 ❌ / ✅ 사용해서 안티패턴 vs 권장 패턴 즉시 식별.

## 관계 도식 (vault → wallet → address 등)

```mermaid
graph TB
  VA["🏦 Vault Account"]
  VA --> AW1["💰 Asset Wallet — BTC"]
  AW1 --> A1["📍 address #1"]
  AW1 --> A2["📍 address #2"]
```

이모지로 계층의 의미 즉시 전달.

## Entity 보존 (BeautifulSoup 후처리 시 주의)

`<pre class="mermaid">` 안의 `-->`, `&`, `<br/>` 가 BS4 의 HTML 표준화로 `--&gt;`, `&amp;`, `</br>` 으로 깨지면 mermaid 가 parsing 실패.

처리 패턴:
1. BS4 parse 전 `<pre class="mermaid">` 블록을 placeholder 로 치환
2. BS4 수정 작업 수행
3. 결과 HTML 에 placeholder 자리에 원본 mermaid 블록 복원

scripts/check-consistency.py 가 사후 검증 (잔존 `&gt;` / `&amp;` / `</br>` 0 개).

## Caption / heading 가독성

도식이 너무 길어 화면을 넘으면 fullscreen 버튼이 자동 부착되어 있음 (assets/app.js 의 `setupFullscreenButtons()`). 별도 작업 불필요.

## 도식 중복 방지

여러 페이지에서 같은 개념의 도식을 그리지 말 것. 한 곳에서 정식 정의하고 다른 페이지는 cross-ref:

```html
<p>시각화는 <a href="other-page.html#section">X. Y 페이지</a> 의 "Z" 절 참조.</p>
```

ASCII art tree 같은 텍스트 도식은 mermaid 가 더 정확/예쁨 → 가능하면 mermaid 로.
