#!/usr/bin/env python3
"""Source Lake auto-triage (P5).

Scan sources/<vendor>/pdf/ for non-normalized PDFs, propose rename + meta.yml +
Mode A/B/C recommendation. User-approval gated per v3.2.2 + Q4=(b).

Modes:
  (no flag)         — DRY-RUN: report only, no writes
  --apply-hygiene   — execute rename + meta.yml (rename auto, meta.yml auto)
  --draft-markdown  — additionally write lightweight markdown DRAFTS to tests/triage/drafts/

Forbidden (v3.2.2):
  - PDF body read (filename + size only)
  - Auto-write to sources/<vendor>/markdown/ (drafts go to tests/triage/drafts/)
  - Auto-edit vendors/ or entities/
  - Auto entity creation
  - Auto Mode C execution (Mode C = recommendation only)

Usage:
    python3 scripts/source_triage.py                  # dry-run report
    python3 scripts/source_triage.py --apply-hygiene  # rename + meta.yml
    python3 scripts/source_triage.py --apply-hygiene --draft-markdown
"""
from __future__ import annotations

import argparse
import sys
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from lib.triage import (
    TriageResult,
    classify_domain,
    count_domain_siblings,
    is_normalized,
    matched_tier3_keywords,
    normalize_slug,
    recommend_mode,
    triage_one,
)

PDF_DIR = ROOT / "sources" / "fireblocks" / "pdf"
TRIAGE_DIR = ROOT / "tests" / "triage"
DRAFTS_DIR = TRIAGE_DIR / "drafts"
REPORT_MD = TRIAGE_DIR / "triage-report.md"
REPORT_YAML = TRIAGE_DIR / "triage-report.yml"

DEFAULT_HOST = "support-fireblocks-io"


# ---------- triage pipeline ----------


def collect_non_normalized() -> list[str]:
    """Return list of non-normalized PDF filenames."""
    if not PDF_DIR.exists():
        return []
    out: list[str] = []
    for p in sorted(PDF_DIR.glob("*.pdf")):
        if not is_normalized(p.name):
            out.append(p.name)
    return out


def triage_all(filenames: list[str], iso_date: str) -> list[TriageResult]:
    """Two-pass: triage each, then re-score Mode based on sibling counts."""
    # Pass 1: initial triage
    results = [triage_one(fn, host=DEFAULT_HOST, iso_date=iso_date) for fn in filenames]
    # Pass 2: re-score mode using sibling count (cluster detection)
    domain_counts = count_domain_siblings(results)
    for r in results:
        if r.domain == "unknown":
            continue
        sib = domain_counts.get(r.domain, 0) - 1  # exclude self
        r.recommended_mode, r.rationale = recommend_mode(r.tier, sib)
    return results


# ---------- I/O ----------


def write_meta_yml(result: TriageResult, target_dir: Path, iso_date: str) -> Path:
    """Write meta.yml next to the (renamed) PDF."""
    stem = result.proposed_filename.replace(".pdf", "")
    meta_path = target_dir / f"{stem}.meta.yml"
    content = f"""url: https://support.fireblocks.io/hc/en-us/articles/{result.proposed_slug}
url_status: inferred (slug 기반 추정, 실 article ID 미확인)
fetched_at: {iso_date}
source_type: pdf
domain: {result.domain}
tier: {result.tier}
title: "{_pretty_title(result.original_filename)}"
crawl_status: not-fetched (body 미로드)
promote_condition: "Source Lake hygiene only — full ingest 필요시 결정"
recommended_mode: {result.recommended_mode}
triage_stage: Stage 25 (source_triage.py auto)
"""
    meta_path.write_text(content, encoding="utf-8")
    return meta_path


def _pretty_title(original: str) -> str:
    base = original.replace(".pdf", "")
    base = base.split("–")[0].strip()  # strip "– Fireblocks Help Center" suffix
    base = base.split("-")[0].strip() if "Fireblocks" in base else base
    return base.replace('"', "'")


def write_markdown_draft(result: TriageResult, iso_date: str) -> Path:
    """Write lightweight markdown DRAFT to tests/triage/drafts/ — NOT to sources/markdown/."""
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    stem = result.proposed_filename.replace(".pdf", "")
    md_path = DRAFTS_DIR / f"{iso_date}__{DEFAULT_HOST}__{result.proposed_slug}.md"
    title = _pretty_title(result.original_filename)
    content = f"""<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/{result.proposed_slug}
url_status: inferred
downloaded_at: {iso_date}
status: lightweight-index (Stage 25, v3.2.2, draft — user 검토 후 sources/markdown/ 로 이동)
priority: TIER{result.tier}
domain: {result.domain}
triage_recommended_mode: {result.recommended_mode}
-->

# {title} (Stage 25 triage draft)

**LIGHTWEIGHT INDEX DRAFT** — body 미로드. source_triage.py 자동 생성. 사용자 검토 후 sources/fireblocks/markdown/ 로 이동.

## Triage 결과

- Domain: **{result.domain}** (keywords: {", ".join(result.domain_keywords_matched) or "none"})
- Tier: **{result.tier}**
- Recommended mode: **{result.recommended_mode}**
- Rationale: {result.rationale}
- Tier 3 keywords matched: {", ".join(result.tier3_keywords_matched) or "none"}

## Cross-cut Signal (★ catalog-level only — body 미확인)

(TODO: 사용자 검토 시 채움 — 본문 fact 추측 금지)

## Promote Condition

- Mode B 진행 시: 본 lightweight index 를 sources/fireblocks/markdown/ 로 이동 + 본 source 의 cluster catalog 에 등재
- Mode C 진행 시: body 외부 추출 → entity/hub 보강 후 status 변경

## Notes

- 본 draft 는 v3.2.2 정합 — body 미로드, filename 기반 triage 만
- 사용자 검토 후 commit (자동 sources/markdown/ 진입 금지)
- 신규 entity 생성 0건 — entity-min discipline 유지
"""
    md_path.write_text(content, encoding="utf-8")
    return md_path


def rename_pdf(original: str, new_name: str, target_dir: Path) -> tuple[Path, Path]:
    """Rename PDF in target_dir. Returns (old_path, new_path)."""
    old = target_dir / original
    new = target_dir / new_name
    old.rename(new)
    return (old, new)


# ---------- report ----------


def write_report(results: list[TriageResult], iso_date: str, mode: str) -> None:
    TRIAGE_DIR.mkdir(parents=True, exist_ok=True)
    # YAML summary
    import yaml  # type: ignore
    payload = {
        "generated_at": iso_date,
        "run_mode": mode,
        "total_non_normalized": len(results),
        "by_domain": dict(Counter(r.domain for r in results).most_common()),
        "by_tier": dict(Counter(r.tier for r in results).most_common()),
        "by_recommended_mode": dict(Counter(r.recommended_mode for r in results).most_common()),
        "results": [
            {
                "original": r.original_filename,
                "proposed": r.proposed_filename,
                "domain": r.domain,
                "tier": r.tier,
                "recommended_mode": r.recommended_mode,
                "rationale": r.rationale,
            }
            for r in results
        ],
    }
    with REPORT_YAML.open("w", encoding="utf-8") as f:
        yaml.safe_dump(payload, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

    # MD view (grouped by domain × tier × mode)
    lines: list[str] = []
    lines.append("<!-- AUTO-GENERATED by scripts/source_triage.py — do not edit -->")
    lines.append(f"# Source Triage Report ({iso_date})")
    lines.append("")
    lines.append(f"**Run mode**: `{mode}`  ")
    lines.append(f"**Total non-normalized**: {len(results)}")
    lines.append("")
    lines.append("## Distribution by Domain")
    lines.append("")
    lines.append("| Domain | Count |")
    lines.append("|---|---:|")
    for d, c in payload["by_domain"].items():
        lines.append(f"| {d} | {c} |")
    lines.append("")
    lines.append("## Distribution by Tier")
    lines.append("")
    lines.append("| Tier | Count |")
    lines.append("|---|---:|")
    for t, c in payload["by_tier"].items():
        lines.append(f"| TIER {t} | {c} |")
    lines.append("")
    lines.append("## Distribution by Recommended Mode")
    lines.append("")
    lines.append("| Mode | Count |")
    lines.append("|---|---:|")
    for m, c in payload["by_recommended_mode"].items():
        lines.append(f"| `{m}` | {c} |")
    lines.append("")
    lines.append("## Files (grouped by domain)")
    lines.append("")
    by_domain: dict[str, list[TriageResult]] = {}
    for r in results:
        by_domain.setdefault(r.domain, []).append(r)
    for domain in sorted(by_domain.keys()):
        rs = by_domain[domain]
        lines.append(f"### {domain} ({len(rs)})")
        lines.append("")
        lines.append("| TIER | Mode | Proposed slug | Original |")
        lines.append("|---|---|---|---|")
        for r in rs:
            orig_short = r.original_filename[:50] + ("..." if len(r.original_filename) > 50 else "")
            lines.append(
                f"| {r.tier} | `{r.recommended_mode}` | `{r.proposed_slug[:60]}` | {orig_short} |"
            )
        lines.append("")
    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------- main ----------


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--apply-hygiene", action="store_true",
                    help="Execute rename + meta.yml (default: dry-run report only)")
    ap.add_argument("--draft-markdown", action="store_true",
                    help="Additionally write lightweight markdown drafts to tests/triage/drafts/")
    ap.add_argument("--only-slugs",
                    help="Comma-separated proposed slugs — restrict to these (for sample apply)")
    args = ap.parse_args()

    iso_date = date.today().isoformat()
    run_mode = "dry-run"
    if args.apply_hygiene:
        run_mode = "apply-hygiene"
    if args.draft_markdown:
        run_mode += "+draft-markdown"

    filenames = collect_non_normalized()
    if not filenames:
        print("No non-normalized PDFs found. Source Lake hygiene clean.")
        return

    results = triage_all(filenames, iso_date)

    # --only-slugs filter (sample apply support)
    if args.only_slugs:
        requested = {s.strip() for s in args.only_slugs.split(",") if s.strip()}
        filtered = [r for r in results if r.proposed_slug in requested]
        missing = requested - {r.proposed_slug for r in filtered}
        if missing:
            print(f"WARN: {len(missing)} requested slugs not matched in current non-normalized set:")
            for m in sorted(missing):
                print(f"  - {m}")
        print(f"--only-slugs: filtered {len(filtered)} of {len(results)} (requested {len(requested)})")
        print()
        results = filtered
        if not results:
            print("No matching results after filter — aborting.")
            return

    # ---- console summary ----
    print(f"Source Triage — {iso_date} ({run_mode} mode)")
    print(f"  Non-normalized PDFs: {len(results)}")
    print(f"  By tier: TIER1={sum(1 for r in results if r.tier == '1')}, "
          f"TIER2={sum(1 for r in results if r.tier == '2')}, "
          f"TIER3={sum(1 for r in results if r.tier == '3')}")
    by_mode = Counter(r.recommended_mode for r in results)
    for m, c in by_mode.most_common():
        print(f"  {m}: {c}")
    print()

    # ---- execute (if flags set) ----
    renamed_count = 0
    meta_count = 0
    draft_count = 0
    skipped_existing: list[tuple[str, str]] = []
    if args.apply_hygiene:
        for r in results:
            target = PDF_DIR / r.proposed_filename
            if target.exists():
                skipped_existing.append((r.original_filename, r.proposed_filename))
                continue
            rename_pdf(r.original_filename, r.proposed_filename, PDF_DIR)
            write_meta_yml(r, PDF_DIR, iso_date)
            renamed_count += 1
            meta_count += 1
        print(f"  ✓ Renamed {renamed_count} PDFs + wrote {meta_count} meta.yml")
        if skipped_existing:
            print(f"  ⚠ Skipped {len(skipped_existing)} (target already exists):")
            for orig, target in skipped_existing:
                print(f"    - {orig} → {target}")

    if args.draft_markdown:
        for r in results:
            # Only draft TIER 1 markdowns (per Mode A/B rule — TIER 2/3 stay as meta-only)
            if r.tier == "1":
                write_markdown_draft(r, iso_date)
                draft_count += 1
        print(f"  ✓ Wrote {draft_count} TIER 1 lightweight markdown drafts to tests/triage/drafts/")

    # ---- write reports ----
    write_report(results, iso_date, run_mode)
    print(f"\nReport: {REPORT_MD.relative_to(ROOT)}")
    print(f"YAML:   {REPORT_YAML.relative_to(ROOT)}")
    if args.draft_markdown:
        print(f"Drafts: {DRAFTS_DIR.relative_to(ROOT)}/ (★ user 검토 후 sources/fireblocks/markdown/ 로 이동)")


if __name__ == "__main__":
    main()
