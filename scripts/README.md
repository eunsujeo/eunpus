# scripts/ — Retrieval Loop Automation

waas-wiki 의 retrieval quality 측정 + gap detection + promote recommendation 자동화 scripts.

## Active (P1 + P3 + P4 + P5 MVP)

| Script | Phase | 역할 |
|---|---|---|
| `lib/wiki_scanner.py` | shared | Curated Wiki + Source Lake parsing + 키워드 search (H1-H4 tuning 통합) |
| `lib/triage.py` | shared | Source Lake triage helpers (slug 정규화 + domain/tier 분류) |
| `generate_questions.py` | P1 (Stage 20) | Rule-based question bank 생성 (6 question types) |
| `retrieval_eval.py` | P3 (Stage 20) | Predicted retrievability 분류 + Q7 check |
| `retrieval_gap_detector.py` | P4 (Stage 21) | Non-PASS 질문의 gap signal 추출 + 후보 evidence 매칭 |
| `promote_candidates.py` | P4 (Stage 21) | Source 후보별 aggregate + priority tier + Mode 추천 (H3 already-cited 통합) |
| `source_triage.py` | P5 (Stage 25) | 신규 raw PDF 자동 탐지 + rename + meta.yml + Mode 추천 (approval-gated, dry-run default) |

### Usage

```bash
# === Retrieval loop (P1 / P3 / P4) ===
python3 scripts/generate_questions.py        # → tests/questions/
python3 scripts/retrieval_eval.py            # → tests/retrieval/retrieval-eval.{yml,md}
python3 scripts/retrieval_gap_detector.py    # → tests/retrieval/gap-report.{yml,md}
python3 scripts/promote_candidates.py        # → tests/retrieval/promote-candidates.{yml,md}

# === Source Lake triage (P5, approval-gated) ===
python3 scripts/source_triage.py                          # dry-run report only
python3 scripts/source_triage.py --apply-hygiene          # rename + meta.yml
python3 scripts/source_triage.py --apply-hygiene --draft-markdown  # also TIER 1 markdown drafts
```

각 step idempotent. 자동 deep ingest / entity 생성 / curated wiki 수정 모두 금지.

## v3.2.2 운영 정합

- PDF body 미로드 / llms.txt body 미로드 / entity 자동 생성 금지 / curated wiki 자동 수정 금지
- 자세히: [tests/README.md](../tests/README.md)
- 디자인 / 설계 근거: `log.md` Stage 20 entry
