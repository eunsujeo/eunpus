# Wiki Lint Report — Stage 223 기준

_생성: 2026-09-21 · `python3 scripts/wiki_lint.py`_

_점검 대상 48 페이지: vendors/fireblocks/ (16) + entities/fireblocks/ (23) + entities/fireblocks/user-roles/ (9)_

Lint 항목 출처: [prompts/update-wiki.md](prompts/update-wiki.md) 의 Lint 체크리스트

## 1. 6-section template 누락

⚠️ 14 / 48 페이지에서 누락:

- `vendors/fireblocks/architecture.md` — 누락: ## Key Concepts
- `entities/fireblocks/api-user.md` — 누락: ## Open Questions
- `entities/fireblocks/console-user.md` — 누락: ## Open Questions
- `entities/fireblocks/transaction.md` — 누락: ## Key Concepts
- `entities/fireblocks/vault-account.md` — 누락: ## Key Concepts
- `entities/fireblocks/user-roles/admin.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/approver.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/editor.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/non-signing-admin.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/owner.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/security-admin.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/security-auditor.md` — 누락: ## Key Concepts, ## Details, ## Open Questions
- `entities/fireblocks/user-roles/signer.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/viewer.md` — 누락: ## Key Concepts, ## Details, ## Open Questions

## 2. Sources 비어있는데 본문 주장 있는 페이지

⚠️ 1 페이지:

- `vendors/fireblocks/policy-engine.md`

## 3. 단방향 wikilink (양방향 갱신 누락)

✅ 모든 wikilink 가 양방향

## 4. open-questions Status 표기 일관성

- 대상 파일: compliance.md, fireblocks.md, nonce.md, stablecoin.md, wallet-bank.md
- 총 Q entries: 129
- `**Status**:` field 보유: 129
- Status 분포: {'answered': 27, 'open': 86, 'partial': 16}

✅ **표기 일관** — 모든 Q entry 가 `**Status**:` field 보유

⚠️ answered/partial 인데 답변 기록이 탐지되지 않은 Q 1 건 — **수동 확인 대상** (라벨이 자유 형식이라 미탐지일 수 있음):

- fireblocks.md / Q-2026-05-18-S01

## 5. 중복 entity 정의 (동일 h1 title 다중 위치)

✅ 중복 entity 정의 없음 (canonical 1 페이지 원칙 준수)

## 6. Stage 라벨 정합 (wiki ↔ log.md)

- log.md stage 수: 216 (최대 Stage 223)
- wiki 페이지에서 참조된 stage 수: 58
- ✅ wiki 가 참조하는 stage 는 모두 log.md 에 존재
- ℹ️ log 에 있지만 wiki 미참조 stage (최근 10개): [214, 215, 216, 217, 218, 219, 220, 221, 222, 223] (총 158 개)

## 7. Frontmatter ↔ 본문 정합

✅ frontmatter 없음: 0 건

✅ source_count 불일치: 0 건

✅ related ↔ Related Pages 불일치: 0 건

⚠️ **last_updated_stage 문제** — 6 건

- `entities/fireblocks/api-key.md (last_updated_stage 없음)`
- `entities/fireblocks/csr.md (last_updated_stage 없음)`
- `entities/fireblocks/sso.md (last_updated_stage 없음)`
- `entities/fireblocks/user-roles/approver.md (last_updated_stage 없음)`
- `entities/fireblocks/user-roles/editor.md (last_updated_stage 없음)`
- `entities/fireblocks/user-roles/viewer.md (last_updated_stage 없음)`

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
| 6-section 누락 | 14 | high |
| Sources 부재 + 본문 주장 | 1 | high |
| answered/partial 답변 기록 미탐지 (수동 확인) | 1 | medium |
| 단방향 wikilink | 0 | - |
| Status field 부재 | 0 | - |
| frontmatter source_count 불일치 | 0 | - |
| frontmatter related 불일치 | 0 | - |
| 중복 entity | 0 | - |
| Stage orphan | 0 | - |

