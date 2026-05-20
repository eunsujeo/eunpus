#!/usr/bin/env python3
"""Retrieval Gap Detector (P4).

For each non-PASS question in retrieval-eval.yml, extract gap signal and match
Source Lake evidence candidates (PDFs / lightweight indexes / sitemap URLs /
Open Qs).

No PDF/llms.txt body load. Pure rule-based matching.

Usage:
    python3 scripts/retrieval_gap_detector.py
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import yaml  # type: ignore

from lib.wiki_scanner import (
    OpenQuestion,
    SourceMarkdown,
    WikiPage,
    _normalize_keywords,
    opens_for_target,
    scan_entities,
    scan_hubs,
    scan_open_questions,
    scan_sitemap_urls,
    scan_source_markdowns,
    scan_source_pdfs,
    search_open_questions,
    search_pdfs,
    search_sitemap,
    search_source_markdowns,
)

EVAL_YAML = ROOT / "tests" / "retrieval" / "retrieval-eval.yml"
QBANK = ROOT / "tests" / "questions" / "question-bank.yml"
OUT_YAML = ROOT / "tests" / "retrieval" / "gap-report.yml"
OUT_MD = ROOT / "tests" / "retrieval" / "gap-report.md"


# Signal types
SIG_HUB_STUB = "hub_stub"
SIG_HUB_THIN = "hub_thin"
SIG_ENTITY_MISSING = "entity_missing"
SIG_CATALOG_ONLY_CLUSTER = "catalog_only_cluster"
SIG_CATALOG_ONLY_INDEX = "catalog_only_index"
SIG_OPEN_Q_UNANSWERED = "open_q_unanswered"
SIG_OPEN_Q_PARTIAL = "open_q_partial"
SIG_COMPARISON_INCOMPLETE = "comparison_incomplete"
SIG_NO_EVIDENCE = "no_evidence"


def gap_signal(res: dict) -> str:
    cls = res["classification"]
    reason = res["reason"].lower()
    if cls == "FAIL":
        if "empty stub" in reason:
            return SIG_HUB_STUB
        if "entity not found" in reason or "hub not found" in reason:
            return SIG_ENTITY_MISSING
        if "comparison" in reason or "neither entity" in reason:
            return SIG_COMPARISON_INCOMPLETE
        return SIG_NO_EVIDENCE
    if cls == "PROMOTE_NEEDED":
        if "cluster catalog only" in reason:
            return SIG_CATALOG_ONLY_CLUSTER
        if "lightweight" in reason or "catalog only" in reason:
            return SIG_CATALOG_ONLY_INDEX
        if "open — promote needed" in reason:
            return SIG_OPEN_Q_UNANSWERED
        return SIG_NO_EVIDENCE
    if cls == "WEAK":
        if "partial" in reason and "promote can complete" in reason:
            return SIG_OPEN_Q_PARTIAL
        if "only 1/2 entities" in reason:
            return SIG_COMPARISON_INCOMPLETE
        if "no source citation" in reason:
            return SIG_HUB_THIN
        return SIG_NO_EVIDENCE
    return SIG_NO_EVIDENCE


def collect_evidence(q: dict, signal: str, scan_state) -> dict:
    """Return evidence candidate dict with H1 explicit-source boost + H2 section
    matching + H4 generic-token down-weight applied."""
    src, pdfs, urls, opens, src_idx, hubs, entities, q_index = scan_state
    keywords = _normalize_keywords(q["question"])
    keywords = [k for k in keywords if k not in {"q-", "promote", "verification"}]

    explicit_sources: list[str] = []
    # For verification Q, use the Open Q's title + sources_to_check (H1)
    if q["answer_type"] == "verification":
        op = q_index.get(q.get("verifies_open_question", ""))
        if op:
            keywords = _normalize_keywords(op.title)
            explicit_sources = list(op.explicit_sources)

    keywords = sorted(set(keywords), key=lambda k: -len(k))[:6]

    # H1 — explicit Sources-to-check matches get EXPLICIT_SOURCE_WEIGHT boost
    # H2 — section header match inside search_source_markdowns
    # H4 — generic-token down-weight inside _kw_weight
    pdf_hits = [(n, round(s, 2)) for n, s in search_pdfs(keywords, pdfs)[:5] if s >= 1]
    md_hits = [
        (m.slug, round(s, 2))
        for m, s in search_source_markdowns(keywords, src, explicit_slugs=explicit_sources)[:5]
        if s >= 1
    ]
    url_hits = [(u, round(s, 2)) for u, s in search_sitemap(keywords, urls)[:5] if s >= 1]

    related_qs: set[str] = set()
    if q["answer_type"] == "verification":
        if q.get("verifies_open_question"):
            related_qs.add(q["verifies_open_question"])
    target = q.get("expected_entity") or q.get("expected_hub")
    if isinstance(target, str):
        for op in opens_for_target(target, opens):
            related_qs.add(op.qid)
    for op, sc in search_open_questions(keywords, opens)[:3]:
        if op.status != "answered":
            related_qs.add(op.qid)

    return {
        "keywords": keywords,
        "explicit_sources": explicit_sources,  # H1
        "pdf_candidates": pdf_hits,
        "markdown_candidates": md_hits,
        "sitemap_candidates": url_hits,
        "related_open_questions": sorted(related_qs),
    }


def recommend_mode(signal: str, evidence: dict, q: dict, src_idx: dict[str, SourceMarkdown]) -> tuple[str, str]:
    """Return (recommended_mode, rationale).

    Modes:
      hub_content_draft — hub stub; ingest 불필요, 기존 entity/source 로 hub 본문 작성
      mode_a            — Source Lake hygiene only (rename + meta.yml)
      mode_b            — lightweight index + cluster catalog
      mode_c            — full body ingest (외부 chunked text 필요)
      none              — no actionable promote (e.g. comparison entity 미존재 → 정책 결정 필요)
    """
    pdfs = evidence["pdf_candidates"]
    mds = evidence["markdown_candidates"]
    urls = evidence["sitemap_candidates"]

    if signal == SIG_HUB_STUB:
        return ("hub_content_draft",
                "Empty TODO stub. Stage 10 sources (admin-quorum / approval-groups / about-policies / "
                "how-policies-work / DCCP / FSPM) 가 이미 full-ingest 되어 있고 본문은 [[entities/fireblocks/policy]] "
                "(15 KB) 에 있음. Hub 는 existing entity + Stage 10 source 로 manual draft 가능 — PDF ingest 불필요.")
    if signal == SIG_CATALOG_ONLY_CLUSTER:
        # Find which raw PDFs are in this cluster — recommend top promote target
        seed = q.get("source_seed", "")
        cluster_slug = Path(seed).stem if seed else ""
        return ("mode_c",
                f"Cluster catalog ({cluster_slug}) 의 TIER 1 lightweight index 가 이미 다수 존재. "
                f"Mode C 시 외부 도구로 cluster 내 1순위 PDF body chunked text 추출 → curated wiki entity/hub 보강.")
    if signal == SIG_CATALOG_ONLY_INDEX:
        # If matching PDF exists in Source Lake, Mode C recommended
        if mds:
            return ("mode_c",
                    f"Lightweight index 존재 ({mds[0][0]}). Body chunked text 추출 → 본문 fact 화.")
        if pdfs:
            return ("mode_b",
                    f"Raw PDF 존재 ({pdfs[0][0]}). Mode B 로 normalize + lightweight index 생성 우선.")
        return ("mode_c", "Catalog evidence 있음. Body 추출 필요.")
    if signal == SIG_OPEN_Q_UNANSWERED:
        if pdfs or urls or mds:
            return ("mode_c",
                    "Source Lake / sitemap 에 evidence 있음. 외부 chunked text 추출 → Open Q 응답 + entity/hub 보강.")
        return ("none", "Source Lake 에 명시적 evidence 없음. 1차 자료 수집 필요 (Fireblocks Support / 외부 docs).")
    if signal == SIG_OPEN_Q_PARTIAL:
        if pdfs or urls or mds:
            return ("mode_c", "Partial answered — 잔여 영역 evidence 있음. 추가 chunked text 로 완성.")
        return ("mode_b",
                "Partial answered — 잔여 영역은 본 자료 외 source 필요. 새 PDF/webpage 식별 후 Mode B.")
    if signal == SIG_HUB_STUB:
        return ("hub_content_draft", "empty stub. existing entity 로 draft.")
    if signal == SIG_HUB_THIN:
        return ("mode_b", "Hub 존재하지만 cite 부족 — 새 source 식별 + lightweight index.")
    if signal == SIG_ENTITY_MISSING:
        return ("none", "Entity/hub 부재 — entity-min discipline 위반 위험. hub section 또는 attribute 으로 흡수 가능한지 우선 검토.")
    if signal == SIG_COMPARISON_INCOMPLETE:
        return ("none", "Comparison entity 부재 — entity 추가 (entity-min 위반 위험) 또는 question 재설계 결정 필요.")
    return ("none", "Actionable promote signal 없음.")


def main() -> None:
    if not EVAL_YAML.exists():
        print(f"ERROR: run retrieval_eval.py first")
        sys.exit(1)
    eval_data = yaml.safe_load(EVAL_YAML.read_text(encoding="utf-8"))
    qbank = yaml.safe_load(QBANK.read_text(encoding="utf-8"))
    q_lookup = {q["id"]: q for q in qbank["questions"]}

    src = scan_source_markdowns()
    src_idx = {s.slug: s for s in src}
    pdfs = scan_source_pdfs()
    urls = scan_sitemap_urls()
    opens = scan_open_questions(src_slugs=[s.slug for s in src])  # H1 explicit_sources resolution
    hubs = {h.slug: h for h in scan_hubs()}
    entities = {e.slug: e for e in scan_entities()}
    q_open_index = {q.qid: q for q in opens}
    scan_state = (src, pdfs, urls, opens, src_idx, hubs, entities, q_open_index)

    gaps: list[dict] = []
    for r in eval_data["results"]:
        if r["classification"] == "PASS":
            continue
        q = q_lookup[r["id"]]
        sig = gap_signal(r)
        ev = collect_evidence(q, sig, scan_state)
        mode, rationale = recommend_mode(sig, ev, q, src_idx)
        gaps.append({
            "question_id": r["id"],
            "question": r["question"],
            "answer_type": r["answer_type"],
            "classification": r["classification"],
            "signal": sig,
            "reason": r["reason"],
            "evidence": ev,
            "recommended_mode": mode,
            "rationale_1_line": rationale,
        })

    # ---- aggregate counts ----
    from collections import Counter
    sig_counts = Counter(g["signal"] for g in gaps)
    mode_counts = Counter(g["recommended_mode"] for g in gaps)

    report = {
        "generated_at": date.today().isoformat(),
        "version": "v0.1 (P4)",
        "source_eval": str(EVAL_YAML.relative_to(ROOT)),
        "total_gaps": len(gaps),
        "by_signal": dict(sig_counts),
        "by_recommended_mode": dict(mode_counts),
        "gaps": gaps,
    }

    OUT_YAML.parent.mkdir(parents=True, exist_ok=True)
    with OUT_YAML.open("w", encoding="utf-8") as f:
        yaml.safe_dump(report, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
    _write_md(report, OUT_MD)

    print(f"detected {len(gaps)} gaps → {OUT_MD.relative_to(ROOT)}")
    print()
    print("By signal:")
    for s, c in sig_counts.most_common():
        print(f"  {s:30s} {c:3d}")
    print()
    print("By recommended mode:")
    for m, c in mode_counts.most_common():
        print(f"  {m:25s} {c:3d}")


def _write_md(report: dict, path: Path) -> None:
    lines: list[str] = []
    lines.append("<!-- AUTO-GENERATED by scripts/retrieval_gap_detector.py — do not edit -->")
    lines.append(f"# Gap Report ({report['generated_at']})")
    lines.append("")
    lines.append(f"**Total gaps**: {report['total_gaps']}  ")
    lines.append(f"**Source**: `{report['source_eval']}`")
    lines.append("")
    lines.append("## By Signal")
    lines.append("")
    lines.append("| Signal | Count |")
    lines.append("|---|---:|")
    for s, c in sorted(report["by_signal"].items(), key=lambda x: -x[1]):
        lines.append(f"| {s} | {c} |")
    lines.append("")
    lines.append("## By Recommended Mode")
    lines.append("")
    lines.append("| Mode | Count |")
    lines.append("|---|---:|")
    for m, c in sorted(report["by_recommended_mode"].items(), key=lambda x: -x[1]):
        lines.append(f"| {m} | {c} |")
    lines.append("")
    # group by mode for readability
    by_mode: dict[str, list[dict]] = {}
    for g in report["gaps"]:
        by_mode.setdefault(g["recommended_mode"], []).append(g)
    order = ["hub_content_draft", "mode_c", "mode_b", "mode_a", "none"]
    for mode in order:
        if mode not in by_mode:
            continue
        gs = by_mode[mode]
        lines.append("")
        lines.append(f"## {mode} ({len(gs)})")
        lines.append("")
        for g in gs:
            lines.append(f"### `{g['question_id']}` — {g['question']}")
            lines.append("")
            lines.append(f"- **Signal**: `{g['signal']}` ({g['classification']})")
            lines.append(f"- **Reason**: {g['reason']}")
            lines.append(f"- **Rationale**: {g['rationale_1_line']}")
            ev = g["evidence"]
            if ev["pdf_candidates"]:
                lines.append(f"- **PDF candidates**: {', '.join(f'`{p}` (score={s})' for p, s in ev['pdf_candidates'][:3])}")
            if ev["markdown_candidates"]:
                lines.append(f"- **Source markdown candidates**: {', '.join(f'`{m}` (score={s})' for m, s in ev['markdown_candidates'][:3])}")
            if ev["sitemap_candidates"]:
                lines.append(f"- **Sitemap URL candidates**: {len(ev['sitemap_candidates'])} (first: `{ev['sitemap_candidates'][0][0]}`)")
            if ev["related_open_questions"]:
                lines.append(f"- **Related Open Q**: {', '.join(ev['related_open_questions'][:5])}")
            lines.append("")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
