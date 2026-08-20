#!/usr/bin/env python3
"""Generate question bank from Curated Wiki + Source Lake.

P1 MVP — rule-based templates, no LLM, no body read.
Coverage: entity + hub + cluster (Q3=(b)).

Usage:
    python3 scripts/generate_questions.py
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
    WikiPage,
    SourceMarkdown,
    OpenQuestion,
    scan_entities,
    scan_hubs,
    scan_source_markdowns,
    scan_cluster_catalogs,
    scan_open_questions,
    scan_sitemap_urls,
)

OUT_DIR = ROOT / "tests" / "questions"
OUT_YAML = OUT_DIR / "question-bank.yml"
OUT_MD = OUT_DIR / "generated-questions.md"

# 6 question types per spec
TEMPLATES_DEFINITION = ["{name}가 뭐야?", "{name} 의미는?", "{name}는 무엇이고 어떻게 동작하나?"]
TEMPLATES_WORKFLOW = ["{name} 운영 절차?", "{name} 어떻게 사용?", "{name} workflow?"]
TEMPLATES_COMPARISON = ["{a} vs {b} 차이?", "{a} 와 {b} 비교?"]
TEMPLATES_INCIDENT = ["{name} 장애 시 처리?", "{name} 오류 발생 시 대응?"]
TEMPLATES_DECISION = ["{name} 운영 선택은 어떻게?", "{name} 도입 기준?"]
TEMPLATES_VERIFICATION = ["{qid} 답이 있는가?", "{qid} promote 필요한가?"]

# Domain inference heuristics (Curated Wiki 의 5 priority domain)
DOMAIN_HUB_MAP = {
    "user-management": "identity-auth",
    "authentication": "identity-auth",
    "cosigner": "identity-auth",
    "callback-handler": "identity-auth",
    "api": "identity-auth",
    "policy-engine": "governance",
    "tap": "governance",
    "compliance": "governance",
    "mobile-app": "mobile-recovery",
    "mpc": "mobile-recovery",
    "security": "security-access",
    "risks": "security-access",
    "architecture": "workspace-management",
    "blockchains": "workspace-management",
    "lifecycle-events": "workspace-management",
    "overview": "workspace-management",
}


# ---------- difficulty / confidence inference ----------


def difficulty_for_entity(e: WikiPage) -> str:
    if e.size < 2500:
        return "easy"
    if e.size < 8000:
        return "medium"
    return "hard"


def confidence_for_entity(e: WikiPage, src_idx: dict[str, SourceMarkdown]) -> str:
    """high = ≥1 full-ingest cite, medium = lightweight cite only, low = no cite."""
    if not e.source_citations:
        return "low"
    has_full = any(src_idx.get(c) and src_idx[c].is_full_ingest() for c in e.source_citations)
    return "high" if has_full else "medium"


def _sorted_cites(cites: list[str], src_idx: dict[str, SourceMarkdown], limit: int = 8) -> list[str]:
    """Sort cites: full-ingest first, then catalog-only, then unknown."""
    def rank(c: str) -> int:
        sm = src_idx.get(c)
        if sm is None:
            return 2
        if sm.is_full_ingest():
            return 0
        return 1
    return sorted(cites, key=rank)[:limit]


def confidence_for_cluster(c: SourceMarkdown) -> str:
    # cluster-catalog = catalog-level only → low (promote 필요)
    return "low"


def promote_expected(confidence: str) -> str:
    return {"high": "false", "medium": "mode_b", "low": "mode_c"}.get(confidence, "mode_c")


# ---------- generators ----------


def gen_entity_definition_questions(
    entities: list[WikiPage], src_idx: dict[str, SourceMarkdown]
) -> list[dict]:
    out: list[dict] = []
    for i, e in enumerate(entities):
        title = e.title.replace("Entity: ", "").split(" (")[0]
        for j, tmpl in enumerate(TEMPLATES_DEFINITION[:1]):  # 1 question per entity for MVP
            qid = f"Q-gen-def-{i:03d}"
            conf = confidence_for_entity(e, src_idx)
            out.append(
                {
                    "id": qid,
                    "question": tmpl.format(name=title),
                    "answer_type": "definition",
                    "difficulty": difficulty_for_entity(e),
                    "generator": "rule_based:entity_def",
                    "source_seed": str(e.path.relative_to(ROOT)),
                    "expected_entity": f"entities/fireblocks/{e.slug}"
                    if e.kind == "entity"
                    else f"entities/fireblocks/user-roles/{e.slug}",
                    "expected_hub": _infer_hub_for_entity(e),
                    "expected_source_candidates": _sorted_cites(e.source_citations, src_idx),
                    "expected_confidence": conf,
                    "promote_expected": promote_expected(conf),
                    "related_open_questions": _related_opens(e, _global_opens),
                }
            )
    return out


def gen_hub_workflow_questions(
    hubs: list[WikiPage], src_idx: dict[str, SourceMarkdown]
) -> list[dict]:
    out: list[dict] = []
    for i, h in enumerate(hubs):
        title = h.title.replace("Fireblocks — ", "").replace("Fireblocks ", "").strip()
        qid = f"Q-gen-wf-{i:03d}"
        conf = confidence_for_entity(h, src_idx)  # same logic
        out.append(
            {
                "id": qid,
                "question": TEMPLATES_WORKFLOW[0].format(name=title),
                "answer_type": "workflow",
                "difficulty": difficulty_for_entity(h),
                "generator": "rule_based:hub_workflow",
                "source_seed": str(h.path.relative_to(ROOT)),
                "expected_hub": f"vendors/fireblocks/{h.slug}",
                "expected_entity": None,
                "expected_source_candidates": _sorted_cites(h.source_citations, src_idx),
                "expected_confidence": conf,
                "promote_expected": promote_expected(conf),
                "expected_domain": DOMAIN_HUB_MAP.get(h.slug, "unknown"),
                "related_open_questions": _related_opens(h, _global_opens),
            }
        )
    return out


def gen_cluster_scenario_questions(clusters: list[SourceMarkdown]) -> list[dict]:
    out: list[dict] = []
    for i, c in enumerate(clusters):
        # cluster name from slug or cluster field
        topic = (c.cluster or c.slug.split("__")[-1].replace("-cluster-catalog", "").replace("-", " "))
        qid = f"Q-gen-cls-{i:03d}"
        out.append(
            {
                "id": qid,
                "question": f"{topic} 환경에서 어떻게 세팅?",
                "answer_type": "workflow",
                "difficulty": "medium",
                "generator": "rule_based:cluster_scenario",
                "source_seed": str(c.path.relative_to(ROOT)),
                "expected_cluster": c.cluster or topic,
                "expected_source_candidates": [c.slug],
                "expected_confidence": "low",
                "promote_expected": "mode_c",
                "expected_domain": c.domain,
                "related_open_questions": [],
            }
        )
    return out


def gen_comparison_questions(entities: list[WikiPage]) -> list[dict]:
    """Predefined comparison pairs — cross-cut signal high value."""
    pairs = [
        ("api-co-signer", "cosigner", "API Co-signer", "Mobile Co-signer"),
        ("admin-quorum", "approval-group", "Admin Quorum", "Approval Group"),
        ("workspace", "sandbox-workspace", "Hot Workspace", "Sandbox Workspace"),
        ("2fa", "sso", "2FA", "SSO"),
        ("mpc-key-share", "recovery-passphrase", "MPC Key Share", "Recovery Passphrase"),
    ]
    name_set = {e.slug for e in entities}
    out: list[dict] = []
    for i, (s1, s2, n1, n2) in enumerate(pairs):
        if s1 not in name_set or s2 not in name_set:
            continue
        qid = f"Q-gen-cmp-{i:03d}"
        out.append(
            {
                "id": qid,
                "question": TEMPLATES_COMPARISON[0].format(a=n1, b=n2),
                "answer_type": "comparison",
                "difficulty": "medium",
                "generator": "rule_based:entity_pair",
                "source_seed": None,
                "expected_entity": [f"entities/fireblocks/{s1}", f"entities/fireblocks/{s2}"],
                "expected_source_candidates": [],
                "expected_confidence": "medium",
                "promote_expected": "false",
                "related_open_questions": [],
            }
        )
    return out


def gen_verification_questions(opens: list[OpenQuestion]) -> list[dict]:
    """For each open + partial answered Q, generate verification-type Q."""
    out: list[dict] = []
    for i, q in enumerate(opens):
        if q.status not in ("open", "partial answered"):
            continue
        qid = f"Q-gen-ver-{i:03d}"
        out.append(
            {
                "id": qid,
                "question": f"{q.qid} 답이 있는가? promote 필요한가?",
                "answer_type": "verification",
                "difficulty": "easy",
                "generator": "rule_based:open_q_verify",
                "source_seed": "open-questions/fireblocks.md",
                "verifies_open_question": q.qid,
                "expected_open_question_status": q.status,
                "expected_source_candidates": [],
                "expected_confidence": "high" if q.status == "partial answered" else "low",
                "promote_expected": "mode_c" if q.status == "open" else "mode_b",
                "expected_entity": None,
                "expected_hub": None,
                "related_open_questions": [q.qid],
            }
        )
    return out


# ---------- helpers ----------


def _infer_hub_for_entity(e: WikiPage) -> str | None:
    hubs = [w for w in e.outbound_wikilinks if w.startswith("vendors/fireblocks/")]
    return hubs[0] if hubs else None


_global_opens: list[OpenQuestion] = []


def _related_opens(page: WikiPage, opens: list[OpenQuestion]) -> list[str]:
    page_link = f"{'entities' if page.kind in ('entity', 'user-role') else 'vendors'}/fireblocks/{page.slug}"
    if page.kind == "user-role":
        page_link = f"entities/fireblocks/user-roles/{page.slug}"
    return [q.qid for q in opens if page_link in q.where_came_up][:5]


# ---------- main ----------


def main() -> None:
    global _global_opens
    entities = scan_entities()
    hubs = scan_hubs()
    src = scan_source_markdowns()
    clusters = scan_cluster_catalogs()
    opens = scan_open_questions()
    sitemap = scan_sitemap_urls()
    _global_opens = opens
    src_idx = {s.slug: s for s in src}

    questions: list[dict] = []
    questions += gen_entity_definition_questions(entities, src_idx)
    questions += gen_hub_workflow_questions(hubs, src_idx)
    questions += gen_cluster_scenario_questions(clusters)
    questions += gen_comparison_questions(entities)
    questions += gen_verification_questions(opens)

    # ----- write YAML -----
    bank = {
        "version": 1,
        "generated_at": date.today().isoformat(),
        "generator_version": "v0.1 (P1 MVP)",
        "coverage": {
            "entities": f"{len([e for e in entities if e.kind == 'entity'])}/{len([e for e in entities if e.kind == 'entity'])}",
            "user_roles": f"{len([e for e in entities if e.kind == 'user-role'])}/{len([e for e in entities if e.kind == 'user-role'])}",
            "hubs": f"{len(hubs)}/{len(hubs)}",
            "clusters": f"{len(clusters)}/{len(clusters)}",
            "open_questions_open": sum(1 for q in opens if q.status == "open"),
            "open_questions_partial": sum(1 for q in opens if q.status == "partial answered"),
            "open_questions_answered": sum(1 for q in opens if q.status == "answered"),
            "sitemap_urls": len(sitemap),
        },
        "total_questions": len(questions),
        "by_type": _count_by_type(questions),
        "questions": questions,
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with OUT_YAML.open("w", encoding="utf-8") as f:
        yaml.safe_dump(bank, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

    # ----- write human MD view -----
    _write_md(bank, OUT_MD)

    print(f"generated {len(questions)} questions → {OUT_YAML.relative_to(ROOT)}")
    print(f"human view → {OUT_MD.relative_to(ROOT)}")
    for k, v in bank["by_type"].items():
        print(f"  {k}: {v}")


def _count_by_type(qs: list[dict]) -> dict[str, int]:
    out: dict[str, int] = {}
    for q in qs:
        t = q["answer_type"]
        out[t] = out.get(t, 0) + 1
    return out


def _write_md(bank: dict, path: Path) -> None:
    lines: list[str] = []
    lines.append("<!-- AUTO-GENERATED by scripts/generate_questions.py — do not edit -->")
    lines.append(f"# Generated Questions ({bank['generated_at']})")
    lines.append("")
    lines.append(f"**Total**: {bank['total_questions']} questions ({bank['generator_version']})")
    lines.append("")
    lines.append("## Coverage")
    for k, v in bank["coverage"].items():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("## By Type")
    for k, v in bank["by_type"].items():
        lines.append(f"- **{k}**: {v}")
    lines.append("")
    lines.append("## Questions")
    by_type: dict[str, list[dict]] = {}
    for q in bank["questions"]:
        by_type.setdefault(q["answer_type"], []).append(q)
    for t, qs in by_type.items():
        lines.append("")
        lines.append(f"### {t} ({len(qs)})")
        for q in qs:
            tag = _short_tag(q)
            lines.append(f"- `{q['id']}` {q['question']} {tag}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _short_tag(q: dict) -> str:
    conf = q.get("expected_confidence", "?")
    promote = q.get("promote_expected", "?")
    diff = q.get("difficulty", "?")
    return f"[conf={conf} promote={promote} diff={diff}]"


if __name__ == "__main__":
    main()
