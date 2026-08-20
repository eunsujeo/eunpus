# tests/ — Retrieval Loop (P1 + P3 + P4 MVP)

waas-wiki 의 retrieval quality / Open Q backlog / gap detection / promote 추천 자동 loop.

## Usage

```bash
# 1. Generate question bank (rule-based, no LLM, no body load)
python3 scripts/generate_questions.py

# 2. Evaluate predicted retrievability + Q7 target check
python3 scripts/retrieval_eval.py

# 3. Detect gap signals + match evidence candidates (Stage 21 신규)
python3 scripts/retrieval_gap_detector.py

# 4. Aggregate + rank promote candidates with priority tier (Stage 21 신규)
python3 scripts/promote_candidates.py
```

각 step idempotent — Curated Wiki / Source Lake 변경 후 재실행 시 새 결과 생성.

## Outputs

```
tests/
├── questions/
│   ├── question-bank.yml        # 정형 metadata (YAML)
│   └── generated-questions.md   # 사람 view
└── retrieval/
    ├── retrieval-eval.{yml,md}        # 분류 (PASS/WEAK/PROMOTE_NEEDED/FAIL) + Q7
    ├── gap-report.{yml,md}            # gap signal + evidence candidates (P4)
    └── promote-candidates.{yml,md}    # ranked Mode B/C/hub_content_draft/entity_deepen 추천 (P4)
```

## Classification

| Class | 의미 |
|---|---|
| **PASS** | expected entity/hub 존재 + ≥1 full-ingest cite (Source Lake 본문 ingest 완료) |
| **WEAK** | entity/hub 존재 but cite/evidence 부족 |
| **PROMOTE_NEEDED** | entity/hub 존재 + Source Lake catalog 만 (body 미로드 — Mode C 필요) |
| **FAIL** | entity/hub 부재 또는 empty stub |

## Q7 Target (Q7=PASS ≥ 70%, FAIL+PROMOTE ≤ 20%)

**Scope**: 비-verification questions (definition / workflow / comparison) — Curated Wiki retrieval quality 측정 영역.

Verification questions (Open Q 상태 확인) 는 별도 **Open Q Backlog** 메트릭으로 분리 — open Q → PROMOTE_NEEDED 는 의도된 신호.

## v3.2.2 정합

- PDF body 미로드 ✓ (scanner 는 markdown / meta.yml / filename 만)
- llms.txt body 미로드 ✓ (URL list grep 만)
- entity 자동 생성 금지 ✓ (script 가 entity 생성 안 함)
- curated wiki 자동 수정 금지 ✓ (read-only)
- LLM 호출 ✓ (P3 MVP 는 rule-based only, LLM tiebreaker 는 stub)

## When to re-run

- 신규 PDF / lightweight index 추가 후 (Source Lake 확장 시)
- Curated Wiki entity / hub 수정 후
- Open Q 응답 후 (verification metric 갱신)
- Stage 진행 마무리 시점

## Promote Modes (P4 산출물)

| Mode | 언제 | 행동 |
|---|---|---|
| `hub_content_draft` | hub 가 empty stub 인데 backing entity/source 가 이미 존재 | PDF ingest 불필요. 기존 entity + Stage X source 로 hub 본문 manual draft |
| `mode_c` (cluster_catalog) | cluster catalog 존재, body 미로드 | 외부 도구로 1순위 PDF body chunked text 추출 |
| `mode_c` (PDF/markdown) | lightweight index 존재, body 필요 | 외부 도구로 PDF body 추출 → entity/hub 보강 |
| `entity_deepen` (★ marker) | PDF 가 이미 source markdown 으로 ingest 됨, but entity 가 fact 미흡 cite | 새 ingest 불필요. 기존 markdown 재추출 + entity/hub 보강 |
| `mode_b` | Raw PDF / new source | normalize + meta.yml + lightweight index |
| `none` | 명시적 evidence 없음 | 외부 1차 자료 수집 필요 (Fireblocks Support / docs.fireblocks.com 등) |

## Priority Tiers (P4 output 정렬 기준)

| Tier | 의미 |
|---|---|
| **T1** | `hub_stub` — FAIL fix 최우선 |
| **T2** | `cluster_catalog` — PROMOTE_NEEDED non-verification |
| **T3** | high-value Open Q evidence (≥ 2 priority-domain Q resolve) |
| **T4** | rest |

## P5 — Source Lake Auto-Triage

[scripts/source_triage.py](../scripts/source_triage.py) — 신규 raw PDF 자동 탐지 + rename + meta.yml + Mode 추천.

### Usage
```bash
python3 scripts/source_triage.py                                # dry-run (writes nothing)
python3 scripts/source_triage.py --apply-hygiene                # rename + meta.yml
python3 scripts/source_triage.py --apply-hygiene --draft-markdown   # + TIER 1 markdown drafts to tests/triage/drafts/
```

### Approval Gate (Q4=(b))
- **rename + meta.yml**: auto-write OK (reversible, low-risk)
- **lightweight markdown**: draft-only to `tests/triage/drafts/` — 사용자 검토 후 `sources/fireblocks/markdown/` 로 수동 이동
- **자동 sources/markdown/ 진입 금지** / **자동 entity 생성 금지** / **자동 deep ingest 금지**

### Outputs

```
tests/triage/
├── triage-report.{yml,md}    # 분류 결과 + 통계
└── drafts/                   # TIER 1 lightweight markdown 초안 (--draft-markdown 시)
```

## Limits

- LLM tiebreaker = stub (실 LLM 호출 없음)
- Real-answer eval 미구현 — P6+
- Source triage 의 domain/tier 분류는 filename keyword 기반 heuristic — body 미참조
