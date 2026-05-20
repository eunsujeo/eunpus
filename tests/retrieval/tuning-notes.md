# Retrieval Tuning Notes

P4 evaluator (gap detector + promote candidates) 운영 중 발견된 정확도 한계 + 보강 후보를 누적 기록. P5+ 의 알고리즘 개선 입력.

본 파일은 LLM/사람 모두 reference 용 — 자동화 스크립트는 본 파일을 read 하지 않음 (informational only).

---

## Finding 2026-05-19-001 — Generic keyword false positive (add-api-users 케이스)

### 관찰
P4 promote_candidates 가 `add-api-users.pdf` 를 **rank 7 entity_deepen 후보** 로 표시 — 5 gaps + 9 Open Q resolve 예상 (score 11.88).

### 실측 (Stage 22 entity_deepen 분석)
- 본 source 만으로 해결되는 Open Q: **0건** (complete 응답 기준)
- Cross-cut signal 강화 가능 Q: **1건** (Q-L02 partial boost)
- 실제 entity 보강 yield: 2 minor enhancement (3rd-party trust warning + Add actor pattern)

→ eval engine 예측치의 **~10% 실 yield**.

### 근본 원인
P4 의 keyword 매칭 (`scripts/lib/wiki_scanner.search_open_questions`) 이 generic 단어 ("API user", "API key") 로 false positive 생성:
- Q-A01 (Admin-level users 정의) — add-api-users 본문에 "Admin-level users" 표현 **없음**. Q-A01 의 source 는 edit-users.md / re-enrolling-api-users.md / rename-and-delete-api-users.md
- Q-A02 (unpair 절차) — rename-and-delete-api-users.md 의 내용
- Q-A03 (key 만료/rotation) — add-api-users 본문에 명시 없음
- Q-A04 (Callback Handler auth method) — re-enrolling-api-users.md 의 내용
- Q-C01 (API Co-signer payload) — 다른 source 영역

### 가설 — P5+ 알고리즘 보강 후보

| H | 보강 방안 |
|---|---|
| H1 | Open Q 의 `Sources to check` 필드와 source markdown slug **직접 일치** 가중치 추가 (가장 강한 signal) |
| H2 | Source markdown 의 H2/H3 section 헤더와 Q title 매칭에 가중치 (slug+title 외) |
| H3 | Open Q 의 `Where this came up` (wikilink) 와 entity citation source 의 **교집합** 매칭 — entity 가 이미 cite 한 source 는 entity_deepen 가치 낮음 (이미 추출 시도됨) |
| H4 | Generic token blacklist 확장 — "api user", "api key" 같은 1-2 토큰만으로 일치하는 keyword 는 점수 가중치 down |

### 운영 시사점

**Source 존재 ≠ Open Q 해결**: catalog-level 매칭은 후보 식별까지만. 실 yield 확정은 source body 의 section 구조 + Q 의 specific evidence requirement 매칭이 필요.

→ P4 의 promote-candidates.md 는 **후보 우선순위 리스트** 로 봐야 하고, 각 후보의 실 yield 검증은 entity_deepen 작업의 첫 step (본 source 의 body section ↔ Q evidence 직접 매칭) 으로 분리.

---

## Finding 2026-05-19-002 — H1-H4 구현 + 효과 검증 (Stage 23)

### 구현 요약

| H | 구현 위치 | weight |
|---|---|---|
| **H1** explicit `Sources to check` slug match | `wiki_scanner._resolve_explicit_sources` + `search_source_markdowns` | **+10 score** per match |
| **H2** section header match | `wiki_scanner._score_against_sections` (via `SourceMarkdown.sections`) | **+3 score** per match |
| **H3** already-cited by Q target entity/hub | `promote_candidates.enrich` + `build_citation_index` | **0.5x multiplier** if cited_by_target ≥ 2 |
| **H4** generic-only keyword down-weight | `wiki_scanner._kw_weight` + `GENERIC_TOKENS` set | **0.3x weight** per generic token |

추가 보강: explicit_sources 매칭에 **non-generic overlap 요구** 추가 → "add users" 같은 generic-only 매칭으로 인한 false positive 차단.

### 효과 (Stage 21 → Stage 23 동일 input 비교)

**add-api-users.pdf 의 정확한 demotion**:
- Stage 21: **rank 7, score 11.88** (false-positive top entity_deepen 후보)
- Stage 23: **rank 23, score 3.51** (낮은 우선순위로 정확히 분류)
- 원인: H3 (already-cited by 1 target entity, 14 total) + H4 (generic keyword down-weight)

**기타 already-cited demotion**:
| Candidate | cited_by_target | Stage 23 rank |
|---|---:|---:|
| recovery-passphrase.md | 4/14 | rank 24 |
| support-verification | 3/5 | rank 25 |
| rename-and-delete-api-users | 2/12 | rank 47 |
| blockchains-that-support | 2/2 | rank 36 |

**신규 high-quality 후보 surface** (H1 explicit + H2 section match):
- **`/docs/create-api-co-signer-callback-handler`** → rank 9 — Q-A04 (Callback Handler auth) 직접 evidence
- **`/api-reference/cosigners-beta/...`** → rank 11 — Q-A02 (unpair 절차) 직접 evidence
- **best-practices-for-choosing-user-roles** → rank 7-8 — Stage 8 deep ingest 의 Owner role spine

### 검증된 사실

- ✓ generic keyword false positive 차단 작동 (add-api-users 정확히 demoted)
- ✓ already-cited 자료 down-weight 작동 (recovery-passphrase / rename-and-delete 등)
- ✓ explicit Sources-to-check 매칭으로 sitemap URL 후보 surface (이전엔 keyword search 만 의존)
- ✓ Q7 eval target 영향 없음 (89.5% PASS / 10.5% FAIL+PROMOTE 유지)
- ✓ Curated Wiki 수정 0건, 신규 entity 0건

### 남은 한계 + 다음 H5+ 후보

| 한계 | 잠재적 보강 |
|---|---|
| H1 explicit_sources 가 일부 generic phrase 에서 noise (Q-G01 → add-api-users via "add users") | H5: slug-frequency 기반 IDF 가중치 (자주 등장 tokens 자동 다운) |
| H2 section match 가 section 헤더 keyword 보유 시만 작동 — 본문 fact 는 안 봄 | H6: Q-specific entity boost — Q의 expected_entity 가 candidate 의 inbound entity 면 +score |
| H4 generic blacklist 가 static — domain 별 generic 다름 | H7: domain context-aware 가중치 (mobile-recovery 에서는 "mobile" generic, 다른 도메인은 specific) |
| LLM tiebreaker 미구현 (Q2=(c) 의 LLM 부분) | H8: 모호한 케이스에만 LLM judge 호출 (rule confidence < threshold 일 때) |

### 운영 시사점

P4 evaluator 의 **catalog-level precision 가 architectural reasoning 기반 promote 결정에 충분한 수준** 으로 향상. add-api-users 같은 generic keyword false positive 가 자동 제거되어 사용자가 검토할 후보 list 의 신뢰도 ↑.

→ Stage 22 의 hosted-mpc-overview entity_deepen (high-yield) 처럼, 새 high-rank 후보 (best-practices-for-choosing-user-roles / callback-handler docs 등) 가 next entity_deepen targets 로 surface.

---

## (다음 finding 자리)
