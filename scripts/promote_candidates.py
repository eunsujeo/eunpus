#!/usr/bin/env python3
"""Promote Recommendation Engine (P4).

Aggregate gap-report entries by source candidate (PDF / lightweight index /
sitemap URL / hub stub). Rank by composite value and emit ranked
recommendations with rationale.

No write to vendors/ or entities/ — candidates only. User decides per-candidate
whether to execute Mode B / Mode C / hub_content_draft.

Usage:
    python3 scripts/promote_candidates.py
"""
from __future__ import annotations

import sys
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import yaml  # type: ignore

from lib.wiki_scanner import (
    build_citation_index,
    scan_entities,
    scan_hubs,
    scan_open_questions,
    scan_source_markdowns,
)

GAP_YAML = ROOT / "tests" / "retrieval" / "gap-report.yml"
OUT_YAML = ROOT / "tests" / "retrieval" / "promote-candidates.yml"
OUT_MD = ROOT / "tests" / "retrieval" / "promote-candidates.md"

# Priority domain weights (5 priority domain)
DOMAIN_WEIGHT = {
    "identity-auth": 1.0,
    "governance": 1.0,
    "workspace-management": 1.0,
    "mobile-recovery": 1.0,
    "security-access": 1.0,
}

# Q category prefix → priority (★ high-value)
CATEGORY_PRIORITY = {
    "G": 1.0,  # Governance
    "S": 1.0,  # Security
    "A": 0.9,  # API
    "AU": 0.9,  # Authentication
    "M": 0.9,  # MPC
    "C": 0.9,  # Cosigner
    "D": 0.8,  # Device
    "P": 0.8,  # Policy
    "W": 0.8,  # Workspace
    "L": 0.7,  # Lifecycle
    "O": 0.6,  # Operations
    "B": 0.5,  # Blockchain
}


def open_q_value(qid: str) -> float:
    """Score Open Q by category prefix (G/S = highest priority domain)."""
    # qid like "Q-2026-05-18-G04" → extract "G"
    parts = qid.rsplit("-", 1)
    if len(parts) != 2:
        return 0.5
    cat = "".join(c for c in parts[1] if c.isalpha())
    return CATEGORY_PRIORITY.get(cat, 0.5)


@dataclass
class Candidate:
    identifier: str  # filename / slug / URL / hub-name
    candidate_type: str  # "pdf" | "source_markdown" | "sitemap_url" | "hub_stub" | "cluster_catalog"
    recommended_mode: str
    resolves_gaps: list[str] = field(default_factory=list)
    resolves_open_questions: set[str] = field(default_factory=set)
    strengthens_hubs: set[str] = field(default_factory=set)
    strengthens_entities: set[str] = field(default_factory=set)
    operational_decisions: list[str] = field(default_factory=list)
    rationale_lines: list[str] = field(default_factory=list)
    evidence_already_ingested: bool = False  # PDF 가 이미 source markdown 으로 ingest 되어 있음
    cited_by_target_entities: int = 0  # H3: # of Q's target entities/hubs that already cite this source
    cited_by_total_entities: int = 0  # H3: # of all entities/hubs that already cite this source

    def score(self) -> float:
        gap_score = len(self.resolves_gaps)
        open_q_score = sum(open_q_value(q) for q in self.resolves_open_questions)
        hub_coverage = len(self.strengthens_hubs) * 0.5
        mode_bonus = {
            "mode_c": 1.2,
            "mode_b": 1.0,
            "hub_content_draft": 1.5,
            "entity_deepen": 0.9,
            "none": 0.3,
        }.get(self.recommended_mode, 1.0)
        # H3: already-cited heavily → re-extraction value low (multiplier 0.5)
        h3_mult = 0.5 if self.cited_by_target_entities >= 2 else 1.0
        return (gap_score + open_q_score + hub_coverage) * mode_bonus * h3_mult

    def priority_tier(self) -> int:
        """Sort tier per user priority:
           T1 = hub_stub (FAIL fix) — empty stubs
           T2 = cluster_catalog (PROMOTE_NEEDED non-verification)
           T3 = Open Q evidence resolving ≥ 2 high-value (G/S/A/M/C/AU) Open Qs
           T4 = rest
        """
        if self.candidate_type == "hub_stub":
            return 1
        if self.candidate_type == "cluster_catalog":
            return 2
        high_value = sum(1 for q in self.resolves_open_questions if open_q_value(q) >= 0.9)
        if high_value >= 2:
            return 3
        return 4


# ---------- aggregation ----------


def aggregate(gaps: list[dict], src_idx: dict) -> list[Candidate]:
    """Aggregate gap entries into per-candidate Candidates.

    Detect "already-ingested" PDFs (their .pdf filename matches a source
    markdown with substantive body) and switch recommendation to
    `entity_deepen` (re-extract from existing markdown into entity/hub).
    """
    cand_index: dict[str, Candidate] = {}

    for g in gaps:
        mode = g["recommended_mode"]
        evidence = g["evidence"]

        if mode == "hub_content_draft":
            ident = _hub_stub_id(g)
            ctype = "hub_stub"
            cand = _get_or_create(cand_index, ident, ctype, mode)
            cand.rationale_lines.append(g["rationale_1_line"])
        elif mode == "mode_c" and g["signal"] == "catalog_only_cluster":
            ident = _seed_slug(g)
            ctype = "cluster_catalog"
            cand = _get_or_create(cand_index, ident, ctype, mode)
            if not cand.rationale_lines:
                cand.rationale_lines.append(g["rationale_1_line"])
        else:
            ident, ctype = _pick_primary_evidence(evidence)
            if not ident:
                continue
            # Detect already-ingested PDF — switch to entity_deepen
            actual_mode = mode
            already = False
            if ctype == "pdf":
                stem = ident.replace(".pdf", "")
                sm = src_idx.get(stem)
                if sm and sm.is_full_ingest():
                    actual_mode = "entity_deepen"
                    already = True
            cand = _get_or_create(cand_index, ident, ctype, actual_mode)
            cand.evidence_already_ingested = already
            if not cand.rationale_lines:
                if already:
                    cand.rationale_lines.append(
                        f"Source markdown 이미 full ingest ({stem}). 본문은 LLM context 에 진입 가능 — "
                        f"entity/hub 가 해당 fact 를 미흡 cite. Mode C 가 아닌 entity_deepen (기존 markdown 재추출)."
                    )
                else:
                    cand.rationale_lines.append(g["rationale_1_line"])

        cand.resolves_gaps.append(g["question_id"])
        cand.resolves_open_questions.update(evidence.get("related_open_questions", []))

    return list(cand_index.values())


def _hub_stub_id(g: dict) -> str:
    # "Policy Engine 운영 절차?" → "vendors/fireblocks/policy-engine"
    q = g["question"].lower()
    if "policy engine" in q:
        return "vendors/fireblocks/policy-engine"
    if "tap" in q or "transaction authorization" in q:
        return "vendors/fireblocks/tap"
    return f"hub:{g['question_id']}"


def _seed_slug(g: dict) -> str:
    # Try to derive cluster name from question text
    q = g["question"].lower()
    mapping = {
        "aws-nitro-cosigner": ["aws", "nitro"],
        "aml-compliance": ["aml"],
        "cold-wallet": ["cold wallet", "cold"],
        "key-link": ["key-link", "key link"],
    }
    for cluster, keywords in mapping.items():
        if any(k in q for k in keywords):
            return cluster
    return f"cluster:{g['question_id']}"


def _pick_primary_evidence(evidence: dict) -> tuple[str, str]:
    """Choose the strongest evidence candidate among PDF / markdown / URL."""
    pdfs = evidence.get("pdf_candidates") or []
    mds = evidence.get("markdown_candidates") or []
    urls = evidence.get("sitemap_candidates") or []
    # Prefer raw PDF (Mode B/C target), then sitemap URL, then markdown
    if pdfs:
        return (pdfs[0][0], "pdf")
    if urls:
        return (urls[0][0], "sitemap_url")
    if mds:
        return (mds[0][0], "source_markdown")
    return ("", "")


def _get_or_create(idx: dict, ident: str, ctype: str, mode: str) -> Candidate:
    if ident not in idx:
        idx[ident] = Candidate(identifier=ident, candidate_type=ctype, recommended_mode=mode)
    return idx[ident]


# ---------- enrichment: hubs/entities/operational decisions ----------


def enrich(candidates: list[Candidate], opens, hubs, entities, citation_idx: dict) -> None:
    """Compute strengthens_* + operational_decisions + H3 already-cited counters."""
    open_by_id = {q.qid: q for q in opens}
    for c in candidates:
        # Collect target wikilinks from resolved Open Qs
        target_wikilinks: set[str] = set()
        for qid in c.resolves_open_questions:
            q = open_by_id.get(qid)
            if not q:
                continue
            for ref in q.where_came_up:
                target_wikilinks.add(ref)
                if ref.startswith("vendors/"):
                    c.strengthens_hubs.add(ref)
                elif ref.startswith("entities/"):
                    c.strengthens_entities.add(ref)
        # H3 — count how many of these target entities/hubs already cite this candidate source
        cand_slug = c.identifier.replace(".pdf", "") if c.candidate_type == "pdf" else c.identifier
        if c.candidate_type in ("pdf", "source_markdown"):
            for wl in target_wikilinks:
                if cand_slug in citation_idx.get(wl, set()):
                    c.cited_by_target_entities += 1
            # Also count total: any entity/hub citing this source
            c.cited_by_total_entities = sum(
                1 for cites in citation_idx.values() if cand_slug in cites
            )
        c.operational_decisions = _infer_operational_decisions(c)


def _infer_operational_decisions(c: Candidate) -> list[str]:
    ident = c.identifier.lower()
    out: list[str] = []
    if "aws-nitro" in ident or "cloudformation" in ident:
        out.append("AWS Co-signer 배포 (CloudFormation parameter / IAM / region) 결정")
        out.append("3 TEE plane (Nitro / SGX / GCP) trust 모델 등가성 검증")
    if "cold-wallet" in ident or "cold_wallet" in ident:
        out.append("Cold Wallet 운영 governance + Cold↔Hot rebalancing 설계")
        out.append("Cold Wallet MPC share 분포 명확화 (vs Hot)")
    if "key-link" in ident or "key_link" in ident:
        out.append("Customer-held key plane 도입 (MPC plane 과 boundary)")
        out.append("Vault Account ↔ Key Link 결합 패턴")
    if "aml" in ident or "compliance" in ident or "travel-rule" in ident:
        out.append("AML/Travel Rule provider 통합 + Global Policy hierarchy 결정")
    if "policy-engine" in ident or "tap" in ident:
        out.append("Policy Engine / TAP hub 본문 채움 — Stage 10 evidence 기반 manual draft")
    if "cosigner" in ident and not out:
        out.append("Co-signer 운영 패턴 + Callback Handler auth 명세")
    if "callbackhandler" in ident or "callback-handler" in ident:
        out.append("Callback Handler 인증 방식 / payload spec 확정 (Q-A04 / Q-C01)")
    if "audit-log" in ident or "siem" in ident:
        out.append("Audit Log API + SIEM forwarding 운영 결정")
    return out


# ---------- main ----------


def main() -> None:
    if not GAP_YAML.exists():
        print("ERROR: run retrieval_gap_detector.py first")
        sys.exit(1)
    gap_report = yaml.safe_load(GAP_YAML.read_text(encoding="utf-8"))
    gaps = gap_report["gaps"]

    src = scan_source_markdowns()
    opens = scan_open_questions()
    hubs = scan_hubs()
    entities = scan_entities()

    src_idx = {s.slug: s for s in src}
    citation_idx = build_citation_index(entities, hubs)  # H3
    candidates = aggregate(gaps, src_idx)
    enrich(candidates, opens, hubs, entities, citation_idx)
    # Sort by (priority_tier, -score) so user-priority hierarchy comes first
    candidates.sort(key=lambda c: (c.priority_tier(), -c.score()))

    # ---- output ----
    payload = {
        "generated_at": date.today().isoformat(),
        "version": "v0.1 (P4)",
        "source_gap_report": str(GAP_YAML.relative_to(ROOT)),
        "total_candidates": len(candidates),
        "candidates": [
            {
                "rank": i + 1,
                "priority_tier": c.priority_tier(),
                "identifier": c.identifier,
                "candidate_type": c.candidate_type,
                "recommended_mode": c.recommended_mode,
                "evidence_already_ingested": c.evidence_already_ingested,
                "cited_by_target_entities": c.cited_by_target_entities,
                "cited_by_total_entities": c.cited_by_total_entities,
                "score": round(c.score(), 2),
                "resolves_gaps": c.resolves_gaps,
                "resolves_open_questions": sorted(c.resolves_open_questions),
                "strengthens_hubs": sorted(c.strengthens_hubs),
                "strengthens_entities": sorted(c.strengthens_entities),
                "operational_decisions_enabled": c.operational_decisions,
                "rationale_1_line": c.rationale_lines[0] if c.rationale_lines else "",
            }
            for i, c in enumerate(candidates)
        ],
    }

    OUT_YAML.parent.mkdir(parents=True, exist_ok=True)
    with OUT_YAML.open("w", encoding="utf-8") as f:
        yaml.safe_dump(payload, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
    _write_md(payload, OUT_MD)

    # ---- console ----
    from collections import Counter
    tier_counts = Counter(c.priority_tier() for c in candidates)
    print(f"{len(candidates)} candidates → {OUT_MD.relative_to(ROOT)}")
    print()
    print("By priority tier:")
    tier_labels = {1: "T1 hub_stub (FAIL)", 2: "T2 cluster_catalog (PROMOTE)", 3: "T3 high-value OpenQ", 4: "T4 rest"}
    for t in [1, 2, 3, 4]:
        if tier_counts.get(t, 0):
            print(f"  {tier_labels[t]:38s} {tier_counts[t]:3d}")
    print()
    print(f"{'Rank':>4} {'T':>2} {'Mode':<22} {'Score':>6} {'Gaps':>5} {'OpenQ':>6}  Identifier")
    print("-" * 110)
    for i, c in enumerate(candidates[:20]):
        ident = c.identifier
        if len(ident) > 55:
            ident = ident[:52] + "..."
        already = "★" if c.evidence_already_ingested else " "
        print(f"{i+1:>4} {c.priority_tier():>2} {c.recommended_mode:<22} {c.score():>6.1f} {len(c.resolves_gaps):>5} {len(c.resolves_open_questions):>6}  {already}{ident}")


def _write_md(payload: dict, path: Path) -> None:
    lines: list[str] = []
    lines.append("<!-- AUTO-GENERATED by scripts/promote_candidates.py — do not edit -->")
    lines.append(f"# Promote Candidates ({payload['generated_at']})")
    lines.append("")
    lines.append(f"**Total candidates**: {payload['total_candidates']}  ")
    lines.append(f"**Source**: `{payload['source_gap_report']}`")
    lines.append("")
    # Group by priority tier
    by_tier: dict[int, list[dict]] = {}
    for c in payload["candidates"]:
        by_tier.setdefault(c["priority_tier"], []).append(c)
    tier_labels = {
        1: "T1 — hub_stub (FAIL fix priority)",
        2: "T2 — cluster_catalog (PROMOTE_NEEDED non-verification)",
        3: "T3 — high-value Open Q evidence (≥ 2 priority-domain Q)",
        4: "T4 — rest",
    }
    lines.append("## Priority Tier Distribution")
    lines.append("")
    lines.append("| Tier | Label | Count |")
    lines.append("|---|---|---:|")
    for t in [1, 2, 3, 4]:
        if t in by_tier:
            lines.append(f"| T{t} | {tier_labels[t].split(' — ')[1]} | {len(by_tier[t])} |")
    lines.append("")
    lines.append("## Top 20 Ranked")
    lines.append("")
    lines.append("| Rank | T | Mode | Score | Gaps | OpenQ | Identifier |")
    lines.append("|---:|---:|---|---:|---:|---:|---|")
    for c in payload["candidates"][:20]:
        ident = c["identifier"]
        if len(ident) > 60:
            ident = ident[:57] + "..."
        ingested = " ★" if c["evidence_already_ingested"] else ""
        lines.append(
            f"| {c['rank']} | T{c['priority_tier']} | {c['recommended_mode']} | {c['score']} | "
            f"{len(c['resolves_gaps'])} | {len(c['resolves_open_questions'])} | `{ident}`{ingested} |"
        )
    lines.append("")
    lines.append("★ = source markdown 이미 full ingest (entity_deepen 후보)")
    lines.append("")

    for t in [1, 2, 3, 4]:
        if t not in by_tier:
            continue
        lines.append(f"## {tier_labels[t]} ({len(by_tier[t])})")
        lines.append("")
        for c in by_tier[t]:
            ingested = " ★ already-ingested" if c["evidence_already_ingested"] else ""
            lines.append(f"### #{c['rank']} — `{c['identifier']}`{ingested}")
            lines.append("")
            lines.append(f"- **Recommended mode**: `{c['recommended_mode']}` (type: {c['candidate_type']})")
            lines.append(f"- **Score**: {c['score']}")
            if c.get("cited_by_target_entities", 0) > 0:
                lines.append(
                    f"- **H3 already-cited**: {c['cited_by_target_entities']} of Q target entities/hubs already cite this source "
                    f"(total citers: {c['cited_by_total_entities']}) — re-extraction value lower"
                )
            lines.append(f"- **Rationale**: {c['rationale_1_line']}")
            lines.append(f"- **Resolves gaps** ({len(c['resolves_gaps'])}): {', '.join(f'`{q}`' for q in c['resolves_gaps'][:8])}{' …' if len(c['resolves_gaps']) > 8 else ''}")
            if c["resolves_open_questions"]:
                lines.append(f"- **Resolves Open Q** ({len(c['resolves_open_questions'])}): {', '.join(c['resolves_open_questions'][:8])}{' …' if len(c['resolves_open_questions']) > 8 else ''}")
            if c["strengthens_hubs"]:
                lines.append(f"- **Strengthens hubs**: {', '.join(f'[[{h}]]' for h in c['strengthens_hubs'][:5])}")
            if c["strengthens_entities"]:
                lines.append(f"- **Strengthens entities**: {', '.join(f'[[{e}]]' for e in c['strengthens_entities'][:5])}")
            if c["operational_decisions_enabled"]:
                lines.append("- **Operational decisions enabled**:")
                for d in c["operational_decisions_enabled"]:
                    lines.append(f"  - {d}")
            lines.append("")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
