# Wiki 내부 잔재 제거 — public docs cleanup

internal wiki (Layer 2) 작성 시에는 evidence-isolation / stage 추적 / fact-citation 을 위해 여러 marker 를 사용한다. 이것이 public docs (Layer 4) 로 옮겨갈 때는 모두 정리되어야 한다. 다음 목록은 본 docs-site 운영 중 누적되어온 정리 대상.

## 제거 대상

### 1. 인라인 `.md` 파일명
- 패턴: `<code>foo-bar.md</code>` · `<code>foo-bar.md</code>, p.N` · `(source: foo-bar.md)`
- 이유: public 독자가 wiki repo 에 접근 못 함. 향후 wiki 재정리 시 stale 가능
- 예외: blockquote 직접 인용의 attribution (그것마저도 가능하면 callout-title 안에 가두기)

### 2. Page-pin `p.N`
- 패턴: `…, p.1` · `…, p.7-8 권한표`
- 이유: raw PDF/markdown 의 page 번호 — public 독자 무용
- 정리: 그냥 사실만 진술. 또는 페이지 상단 callout 으로 일괄 disclosure

### 3. `★ Stage N` 마커
- 패턴: `(★ Stage 7)` · `★ Stage N spine` · `(★ Stage 24 ANSWERED)`
- 이유: wiki 의 stage 누적 작업 추적용 marker. public 무의미
- 처리: 일괄 제거. 의미 없는 raw stage 표기는 단순 삭제

### 4. `★ 정식 명세` / `★ 정식 명시`
- 패턴: `(★ 정식 명세)` · `(★ 정식 명시)` · `[Stage N 정식 명세]`
- 의미 (wiki 내부): "Fireblocks 공식 문서에 정식 enumerate / 명시되어 있는 fact"
- 처리: 제거. 페이지 상단 출처 callout 이 이미 disclosure 를 처리하므로 본문 마커는 redundant

### 5. `(hypothesis)` 라벨
- 패턴: `### Reorg Handling (hypothesis)` · `(hypothesis 만 명시)`
- 처리:
  - 의미 있는 path (reorg 처리, edge case schema 표현 등) 이면 **"필수 path"** 로 격상 + (hypothesis) 라벨 제거
  - 무의미하면 본문에서 제거

### 6. `§` section sign
- 패턴: `§1.5` · `§ 1.3 절`
- 이유: 한글 독자에 낯섦
- 처리: "1.5 절" 또는 "1.5" 만으로

### 7. Wiki 내부 경로 / 분류
- 패턴: `persistence-architecture/07 패턴` · `Stage 15 sitemap` · `TIER 3 source-lake-only` · `Mode C`
- 이유: wiki 내부 layer / file 구조 reference — public 무용
- 처리: 의미 보존이 필요하면 일반 표현으로 치환 ("일반 패턴 차용" 등), 그렇지 않으면 제거

### 8. `chain-specific quirk` 같은 영문 직역
- 패턴: 본문에 "chain-specific quirk" 그대로 노출
- 정리: "chain 별 특이 제약" 등 평이한 한글로

## 유지 대상 (제거하면 안 되는 ★)

다음 ★ 는 schema discipline marker 라 SQL comment 에 유지:

| Marker | 의미 |
|---|---|
| `★ append-only` | UPDATE/DELETE 절대 불가 — trigger 로 강제 |
| `★ set-once` | NULL → 값 1 회만 허용, 이후 변경 불가 |
| `★ HSM-wrapped, never plaintext` | 민감 데이터의 저장 형태 강제 |
| `★ byte-equal cross-DB binding` | audit 평면과의 binary 일치 강제 |

이들은 schema discipline 정보를 SQL 안에 압축적으로 표시하는 functional marker. 본문 산문에는 풀어쓰지만 SQL 안에서는 유지.

## 자동 sweep

[scripts/check-consistency.py](../scripts/check-consistency.py) 가 다음을 자동 확인:

- 인라인 `.md` 출처 잔존 개수
- ★ wiki 내부 마커 (SQL comment 제외) 개수
- §, Stage N 등 잔존 개수
- (hypothesis), (★ Stage N) 패턴 잔존

배포 전 0 인지 확인 필수.

## "본 schema 의 범위 밖" callout 패턴

특정 페이지 schema 가 다루지 않고 다른 평면으로 위임하는 항목이 있을 때:

```html
<div class="callout">
<div class="callout-title">본 schema 의 범위 밖 — 후속 검토 위치</div>
<ul>
<li><strong>[항목 이름]</strong> — 왜 본 페이지 schema 가 안 다루는지 + 어디서 다루는지 cross-ref</li>
</ul>
</div>
```

이 callout 은 "이 문서가 무엇을 의도적으로 안 다루는지" 를 명시해서 reader 의 기대 관리. 단순 누락이 아니라 명시적 위임임을 알리는 가치.

## "수탁형 본연 기능 아님" scope-out 패턴

특정 기능 (mint / burn / contract role 등) 이 도메인 본연 범위를 넘는 경우:

```html
<div class="callout callout-warn">
<div class="callout-title">⚠️ Scope out — [기능] 는 본 문서 범위 밖</div>
<p>[기능] 는 수탁형 지갑의 본연 기능이 아닙니다 — [이유]. 별도 시스템에서 다룰 항목.</p>
</div>
```

운영 결정 기록의 가치 + 향후 reader 가 "왜 이 부분이 없지?" 물을 때 답이 됨.
