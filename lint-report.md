# Wiki Lint Report — Stage 223 기준

_생성: 2026-09-21 · `python3 scripts/wiki_lint.py`_

_점검 대상 48 페이지: vendors/fireblocks/ (16) + entities/fireblocks/ (23) + entities/fireblocks/user-roles/ (9)_

Lint 항목 출처: [prompts/update-wiki.md](prompts/update-wiki.md) 의 Lint 체크리스트

## 1. 6-section template 누락

✅ 전 페이지 6-section 충족

## 2. Sources 비어있는데 본문 주장 있는 페이지

✅ 본문 주장이 있는 페이지는 모두 Sources bullet 보유

## 3. 단방향 wikilink (양방향 갱신 누락)

✅ 모든 wikilink 가 양방향

## 4. open-questions Status 표기 일관성

- 대상 파일: compliance.md, fireblocks.md, nonce.md, stablecoin.md, wallet-bank.md
- 총 Q entries: 129
- `**Status**:` field 보유: 129
- Status 분포: {'answered': 27, 'open': 86, 'partial': 16}

✅ **표기 일관** — 모든 Q entry 가 `**Status**:` field 보유

✅ answered/partial Q 는 모두 답변 기록 보유

## 5. 중복 entity 정의 (동일 h1 title 다중 위치)

✅ 중복 entity 정의 없음 (canonical 1 페이지 원칙 준수)

## 6. Stage 라벨 정합 (wiki ↔ log.md)

- log.md stage 수: 216 (최대 Stage 223)
- wiki 페이지에서 참조된 stage 수: 59
- ✅ wiki 가 참조하는 stage 는 모두 log.md 에 존재
- ℹ️ log 에 있지만 wiki 미참조 stage (최근 10개): [213, 214, 215, 216, 217, 218, 219, 220, 221, 222] (총 157 개)

## 7. Frontmatter ↔ 본문 정합

✅ frontmatter 없음: 0 건

✅ source_count 불일치: 0 건

✅ related ↔ Related Pages 불일치: 0 건

✅ last_updated_stage 문제: 0 건

## 8. 카운트 요약 (CLAUDE.md / index.md 동기화용)

| 항목 | 실측값 |
|---|---|
| 최신 Stage | 223 |
| log.md stage entry | 216 |
| vendor hub | 16 |
| entity | 23 |
| user-role | 9 |
| docs/architecture | 66 |
| open-questions 총 Q | 129 |
| open-questions pending (open+partial) | 102 |

---

## Summary — 발견된 issue 별 priority

| Issue | 건수 | Priority |
|---|---|---|
| 6-section 누락 | 0 | - |
| Sources 부재 + 본문 주장 | 0 | - |
| answered/partial 답변 기록 미탐지 (수동 확인) | 0 | - |
| 단방향 wikilink | 0 | - |
| Status field 부재 | 0 | - |
| frontmatter source_count 불일치 | 0 | - |
| frontmatter related 불일치 | 0 | - |
| 중복 entity | 0 | - |
| Stage orphan | 0 | - |

