#!/usr/bin/env python3
"""Retrieval evaluator (P3 MVP).

For each question in question-bank.yml, assess whether retrieval can produce a
high-quality answer given current Curated Wiki + Source Lake state.

P3 mode = "predicted" — no actual LLM/human answer required.
Classification rule (Q2=(c) hybrid — rule-based first, LLM tiebreaker stub):

  PASS            — expected entity/hub exists + has ≥ 1 full-ingest cite
  WEAK            — entity/hub exists but cite is catalog/lightweight only
  PROMOTE_NEEDED  — Source Lake has matching evidence but body not loaded
  FAIL            — no entity/hub/source evidence found

Target (Q7): PASS ≥ 70%, FAIL+PROMOTE_NEEDED ≤ 20%

Usage:
    python3 scripts/retrieval_eval.py
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import yaml  # type: ignore

from lib.wiki_scanner import (
    scan_entities,
    scan_hubs,
    scan_source_markdowns,
    scan_sitemap_urls,
    scan_open_questions,
)

QBANK = ROOT / "tests" / "questions" / "question-bank.yml"
OUT_MD = ROOT / "tests" / "retrieval" / "retrieval-eval.md"
OUT_YAML = ROOT / "tests" / "retrieval" / "retrieval-eval.yml"

CLASSES = ["PASS", "WEAK", "PROMOTE_NEEDED", "FAIL"]

# Q7 targets
TARGET_PASS_MIN = 0.70
TARGET_FAIL_PROMOTE_MAX = 0.20


# ---------- index builders ----------


def build_indexes():
    entities = {e.slug: e for e in scan_entities()}
    hubs = {h.slug: h for h in scan_hubs()}
    src = scan_source_markdowns()
    src_idx = {s.slug: s for s in src}
    sitemap_urls = scan_sitemap_urls()
    opens = {q.qid: q for q in scan_open_questions()}
    return entities, hubs, src_idx, sitemap_urls, opens


# ---------- classifier (rule-based first) ----------


def classify(q: dict, entities, hubs, src_idx, sitemap_urls, opens) -> tuple[str, str, list[str]]:
    """Returns (classification, reason, evidence_pointers)."""
    qtype = q.get("answer_type")
    if qtype == "definition":
        return _classify_definition(q, entities, src_idx)
    if qtype == "workflow":
        return _classify_workflow(q, hubs, src_idx, q.get("source_seed", ""))
    if qtype == "comparison":
        return _classify_comparison(q, entities)
    if qtype == "verification":
        return _classify_verification(q, opens)
    return ("FAIL", "unknown question type", [])


def _classify_definition(q: dict, entities, src_idx) -> tuple[str, str, list[str]]:
    expected = q.get("expected_entity", "")
    if not expected:
        return ("FAIL", "no expected_entity", [])
    # strip the entities/fireblocks/ prefix
    slug = expected.replace("entities/fireblocks/", "").replace("user-roles/", "")
    ent = entities.get(slug)
    if not ent:
        return ("FAIL", f"entity not found: {slug}", [])
    cites = q.get("expected_source_candidates") or []
    if not cites:
        return ("WEAK", "entity exists but no source citation", [str(ent.path)])
    full_cites = [c for c in cites if src_idx.get(c) and src_idx[c].is_full_ingest()]
    if full_cites:
        return ("PASS", f"entity + {len(full_cites)} full-ingest cite", full_cites)
    light_cites = [c for c in cites if src_idx.get(c) and src_idx[c].is_catalog_only()]
    if light_cites:
        return ("PROMOTE_NEEDED", "entity exists, cite is lightweight/catalog only", light_cites)
    return ("WEAK", "cite slugs don't match Source Lake index or no body evidence", cites)


def _classify_workflow(q: dict, hubs, src_idx, seed: str) -> tuple[str, str, list[str]]:
    expected = q.get("expected_hub", "")
    slug = expected.replace("vendors/fireblocks/", "")
    hub = hubs.get(slug)
    if not hub:
        # Cluster-based workflow: check expected_source_candidates
        cites = q.get("expected_source_candidates") or []
        if cites and any(src_idx.get(c) for c in cites):
            return ("PROMOTE_NEEDED", "cluster catalog only, body needed", cites)
        return ("FAIL", f"hub not found: {slug}", [])
    cites = q.get("expected_source_candidates") or []
    if not cites:
        # Check for TODO stubs (small hub size)
        if hub.size < 1500:
            return ("FAIL", f"hub is empty stub ({hub.size} bytes)", [str(hub.path)])
        return ("WEAK", "hub exists but no source citation", [str(hub.path)])
    full_cites = [c for c in cites if src_idx.get(c) and src_idx[c].is_full_ingest()]
    if full_cites:
        return ("PASS", f"hub + {len(full_cites)} full-ingest cite", full_cites)
    light_cites = [c for c in cites if src_idx.get(c) and src_idx[c].is_catalog_only()]
    if light_cites:
        return ("PROMOTE_NEEDED", "hub exists, cite is lightweight/catalog only", light_cites)
    return ("WEAK", "cite slugs don't match Source Lake index or no body evidence", cites)


def _classify_comparison(q: dict, entities) -> tuple[str, str, list[str]]:
    pair = q.get("expected_entity") or []
    if not isinstance(pair, list) or len(pair) != 2:
        return ("FAIL", "comparison needs 2 entities", [])
    slugs = [p.replace("entities/fireblocks/", "") for p in pair]
    found = [s for s in slugs if s in entities]
    if len(found) == 2:
        return ("PASS", "both entities exist", slugs)
    if len(found) == 1:
        return ("WEAK", f"only 1/2 entities exist: {found}", slugs)
    return ("FAIL", "neither entity exists", slugs)


def _classify_verification(q: dict, opens) -> tuple[str, str, list[str]]:
    qid = q.get("verifies_open_question", "")
    op = opens.get(qid)
    if not op:
        return ("FAIL", f"open question not found: {qid}", [])
    if op.status == "answered":
        return ("PASS", f"{qid} already answered", [qid])
    if op.status == "partial answered":
        return ("WEAK", f"{qid} partial — promote can complete", [qid])
    if op.status == "open":
        return ("PROMOTE_NEEDED", f"{qid} open — promote needed", [qid])
    return ("FAIL", f"unknown {qid} status: {op.status}", [qid])


def _empty():
    from lib.wiki_scanner import SourceMarkdown
    return SourceMarkdown(slug="", path=Path(), status="", priority="", domain="", cluster="", title="")


# ---------- llm tiebreaker (stub for P3 MVP) ----------


def llm_tiebreaker(q: dict, rule_result: tuple[str, str, list[str]]) -> tuple[str, str, list[str]]:
    """Q2=(c) — LLM tiebreaker for fuzzy cases.

    P3 MVP: pass-through (no LLM call). Future: call LLM only when rule_result
    confidence is low (e.g. WEAK with conflicting signals).
    """
    return rule_result


# ---------- main ----------


def main() -> None:
    if not QBANK.exists():
        print(f"ERROR: question bank not found — run generate_questions.py first")
        sys.exit(1)
    bank = yaml.safe_load(QBANK.read_text(encoding="utf-8"))
    entities, hubs, src_idx, sitemap_urls, opens = build_indexes()

    results: list[dict] = []
    for q in bank["questions"]:
        cls, reason, ev = classify(q, entities, hubs, src_idx, sitemap_urls, opens)
        cls, reason, ev = llm_tiebreaker(q, (cls, reason, ev))
        results.append(
            {
                "id": q["id"],
                "question": q["question"],
                "answer_type": q["answer_type"],
                "classification": cls,
                "reason": reason,
                "evidence": ev,
                "expected_confidence": q.get("expected_confidence"),
                "promote_expected": q.get("promote_expected"),
            }
        )

    counts = {c: sum(1 for r in results if r["classification"] == c) for c in CLASSES}
    total = len(results)

    # Q7 target measures Curated Wiki retrieval quality — verification Qs are by
    # design an Open-Q backlog metric (open Q → PROMOTE_NEEDED is intentional),
    # so they're tracked separately.
    non_ver = [r for r in results if r["answer_type"] != "verification"]
    nv_total = len(non_ver)
    nv_counts = {c: sum(1 for r in non_ver if r["classification"] == c) for c in CLASSES}
    pass_rate = nv_counts["PASS"] / nv_total if nv_total else 0
    fp_rate = (nv_counts["FAIL"] + nv_counts["PROMOTE_NEEDED"]) / nv_total if nv_total else 0

    ver = [r for r in results if r["answer_type"] == "verification"]
    ver_counts = {c: sum(1 for r in ver if r["classification"] == c) for c in CLASSES}

    meets_q7_pass = pass_rate >= TARGET_PASS_MIN
    meets_q7_fp = fp_rate <= TARGET_FAIL_PROMOTE_MAX

    summary = {
        "evaluated_at": date.today().isoformat(),
        "evaluator_version": "v0.1 (P3 MVP, predicted mode)",
        "question_bank": str(QBANK.relative_to(ROOT)),
        "total": total,
        "counts": counts,
        "rates": {c: round(counts[c] / total, 4) if total else 0 for c in CLASSES},
        "retrieval_quality": {
            "scope": "non-verification questions (definition + workflow + comparison)",
            "total": nv_total,
            "counts": nv_counts,
            "PASS_rate": round(pass_rate, 4),
            "FAIL+PROMOTE_rate": round(fp_rate, 4),
        },
        "open_question_backlog": {
            "scope": "verification questions (Open Q status check)",
            "total": len(ver),
            "counts": ver_counts,
            "PROMOTE_NEEDED": ver_counts["PROMOTE_NEEDED"],
            "WEAK_partial": ver_counts["WEAK"],
            "PASS_answered": ver_counts["PASS"],
        },
        "q7_targets": {
            "scope": "retrieval_quality (non-verification)",
            "PASS_min": TARGET_PASS_MIN,
            "FAIL+PROMOTE_max": TARGET_FAIL_PROMOTE_MAX,
            "pass_target_met": meets_q7_pass,
            "fp_target_met": meets_q7_fp,
            "overall_met": meets_q7_pass and meets_q7_fp,
        },
        "results": results,
    }

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    with OUT_YAML.open("w", encoding="utf-8") as f:
        yaml.safe_dump(summary, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
    _write_md(summary, OUT_MD)

    # ----- console summary -----
    print(f"evaluated {total} questions → {OUT_MD.relative_to(ROOT)}")
    print()
    print(f"Retrieval Quality (non-verification, n={nv_total}):")
    print(f"  PASS:           {nv_counts['PASS']:3d} ({nv_counts['PASS']/nv_total*100:.1f}%)")
    print(f"  WEAK:           {nv_counts['WEAK']:3d} ({nv_counts['WEAK']/nv_total*100:.1f}%)")
    print(f"  PROMOTE_NEEDED: {nv_counts['PROMOTE_NEEDED']:3d} ({nv_counts['PROMOTE_NEEDED']/nv_total*100:.1f}%)")
    print(f"  FAIL:           {nv_counts['FAIL']:3d} ({nv_counts['FAIL']/nv_total*100:.1f}%)")
    print()
    print(f"Open Q Backlog (verification, n={len(ver)}):")
    print(f"  open (PROMOTE_NEEDED):      {ver_counts['PROMOTE_NEEDED']:3d}")
    print(f"  partial answered (WEAK):    {ver_counts['WEAK']:3d}")
    print(f"  answered (PASS):            {ver_counts['PASS']:3d}")
    print()
    print(f"Q7 targets (retrieval quality scope):")
    print(f"  PASS ≥ {TARGET_PASS_MIN*100:.0f}%:             {'✓' if meets_q7_pass else '✗'} ({pass_rate*100:.1f}%)")
    print(f"  FAIL+PROMOTE ≤ {TARGET_FAIL_PROMOTE_MAX*100:.0f}%:    {'✓' if meets_q7_fp else '✗'} ({fp_rate*100:.1f}%)")


def _write_md(summary: dict, path: Path) -> None:
    lines: list[str] = []
    lines.append("<!-- AUTO-GENERATED by scripts/retrieval_eval.py — do not edit -->")
    lines.append(f"# Retrieval Eval ({summary['evaluated_at']})")
    lines.append("")
    lines.append(f"**Evaluator**: {summary['evaluator_version']}  ")
    lines.append(f"**Source**: `{summary['question_bank']}`  ")
    lines.append(f"**Total**: {summary['total']}")
    lines.append("")
    lines.append("## Distribution (all)")
    lines.append("")
    lines.append("| Class | Count | Rate |")
    lines.append("|---|---:|---:|")
    for c in CLASSES:
        lines.append(
            f"| {c} | {summary['counts'][c]} | {summary['rates'][c]*100:.1f}% |"
        )
    lines.append("")
    rq = summary["retrieval_quality"]
    lines.append(f"## Retrieval Quality — {rq['scope']}")
    lines.append("")
    lines.append("| Class | Count | Rate |")
    lines.append("|---|---:|---:|")
    nv_total_ = rq["total"]
    for c in CLASSES:
        cnt = rq["counts"][c]
        rate = (cnt / nv_total_ * 100) if nv_total_ else 0
        lines.append(f"| {c} | {cnt} | {rate:.1f}% |")
    lines.append("")
    oqb = summary["open_question_backlog"]
    lines.append(f"## Open Q Backlog — {oqb['scope']}")
    lines.append("")
    lines.append(f"- **open** (PROMOTE_NEEDED): {oqb['PROMOTE_NEEDED']} — Mode C 후보")
    lines.append(f"- **partial answered** (WEAK): {oqb['WEAK_partial']} — Mode B/C 보강 후보")
    lines.append(f"- **answered** (PASS): {oqb['PASS_answered']}")
    lines.append("")
    lines.append("## Q7 Targets")
    lines.append("")
    t = summary["q7_targets"]
    lines.append(f"**Scope**: {t['scope']}")
    lines.append("")
    lines.append(f"- **PASS ≥ {t['PASS_min']*100:.0f}%**: {'✓ met' if t['pass_target_met'] else '✗ miss'} ({rq['PASS_rate']*100:.1f}%)")
    lines.append(f"- **FAIL+PROMOTE ≤ {t['FAIL+PROMOTE_max']*100:.0f}%**: {'✓ met' if t['fp_target_met'] else '✗ miss'} ({rq['FAIL+PROMOTE_rate']*100:.1f}%)")
    lines.append(f"- **Overall**: {'✓ all targets met' if t['overall_met'] else '✗ targets missed'}")
    lines.append("")
    lines.append("## Per-Question Results")
    lines.append("")
    by_class = {c: [] for c in CLASSES}
    for r in summary["results"]:
        by_class[r["classification"]].append(r)
    for c in CLASSES:
        if not by_class[c]:
            continue
        lines.append(f"### {c} ({len(by_class[c])})")
        lines.append("")
        lines.append("| ID | Question | Reason |")
        lines.append("|---|---|---|")
        for r in by_class[c]:
            q = r["question"].replace("|", "\\|")
            reason = r["reason"].replace("|", "\\|")
            lines.append(f"| `{r['id']}` | {q} | {reason} |")
        lines.append("")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
