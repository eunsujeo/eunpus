#!/usr/bin/env python3
"""
doc-author consistency sweep.

Checks an HTML docs-site directory for:
  1. sidebar number ↔ inline link number mismatches
  2. Mermaid block entity corruption (&gt; &amp; &lt; </br>)
  3. Wiki-internal residue: .md inline citations, ★ markers outside SQL, § section signs,
     "Stage N" references, "(hypothesis)" labels, "Mode A/B/C" pseudo-tags
  4. ENUM lines that are too long (>10 values on single line — split recommended)

Usage:
    python3 check-consistency.py <docs-site-path>
    python3 check-consistency.py /path/to/docs-site/custodial-wallet-db-design

Exits with non-zero status if any check fails.
"""
import re
import sys
from pathlib import Path


def find_sidebar_map(html_dir: Path) -> dict[str, tuple[str, str]]:
    """Use first HTML file to extract the canonical sidebar — href → (number, label)."""
    for f in sorted(html_dir.glob("*.html")):
        text = f.read_text()
        sidebar = {}
        for m in re.finditer(
            r'<li><a href="([^"]+\.html)">(\d+)\.\s+([^<]+)</a></li>', text
        ):
            sidebar[m.group(1)] = (m.group(2), m.group(3).strip())
        if sidebar:
            return sidebar
    return {}


def check_sidebar_mismatch(html_dir: Path) -> list[tuple]:
    """Find inline links whose number doesn't match the sidebar number for the same href."""
    sidebar_map = find_sidebar_map(html_dir)
    mismatches = []
    for f in sorted(html_dir.glob("*.html")):
        text = f.read_text()
        aside_close = text.find("</aside>")
        body = text[aside_close:] if aside_close >= 0 else text
        for m in re.finditer(
            r'<a href="([^"]+\.html)">(\d+)\.\s+([^<]+)</a>', body
        ):
            href, num, label = m.group(1), m.group(2), m.group(3).strip()
            if href in sidebar_map and num != sidebar_map[href][0]:
                mismatches.append(
                    (f.name, href, f"{num}. {label}", f"{sidebar_map[href][0]}. {sidebar_map[href][1]}")
                )
    return mismatches


def check_mermaid_entities(html_dir: Path) -> list[tuple]:
    """Find <pre class=mermaid> blocks with HTML-entity corruption."""
    issues = []
    for f in sorted(html_dir.glob("*.html")):
        text = f.read_text()
        for i, m in enumerate(re.finditer(r'<pre class="mermaid">(.*?)</pre>', text, re.DOTALL)):
            block = m.group(1)
            bad = [tok for tok in ["&gt;", "&amp;", "&lt;", "</br>"] if tok in block]
            if bad:
                issues.append((f.name, i, bad))
    return issues


def check_wiki_residue(html_dir: Path) -> dict[str, list[tuple]]:
    """Find wiki-internal residue patterns that should not be in public docs."""
    patterns = {
        # .md inline citations
        "md_citation": re.compile(r"<code>[a-z0-9-]+\.md</code>"),
        # ★ Stage N markers
        "stage_marker": re.compile(r"★\s*Stage\s+\d+"),
        # ★ followed by 정식 (wiki-internal)
        "official_marker": re.compile(r"★\s*정식"),
        # § section sign
        "section_sign": re.compile(r"§\s*\d"),
        # (hypothesis) labels
        "hypothesis_label": re.compile(r"\(hypothesis\)"),
        # Mode A/B/C pseudo-tags
        "mode_tag": re.compile(r"\bMode\s+[ABC]\b"),
        # TIER N source-lake markers
        "tier_marker": re.compile(r"\bTIER\s+\d+\b"),
        # persistence-architecture/NN references
        "wiki_path": re.compile(r"persistence-architecture/\d+"),
        # Stage N sitemap
        "stage_sitemap": re.compile(r"Stage\s+\d+\s+sitemap"),
    }
    findings = {k: [] for k in patterns}

    for f in sorted(html_dir.glob("*.html")):
        text = f.read_text()
        for key, pat in patterns.items():
            for m in pat.finditer(text):
                # Allow ★ in SQL <pre><code> blocks (set-once, append-only markers)
                if key in ("stage_marker", "official_marker"):
                    # Check if inside <pre><code>
                    start = m.start()
                    pre_open = text.rfind("<pre><code>", 0, start)
                    pre_close = text.rfind("</code></pre>", 0, start)
                    if pre_open > pre_close:
                        # Inside SQL block — but stage/정식 markers don't belong even in SQL
                        pass  # still flag
                findings[key].append((f.name, m.group(0)))
    return findings


def check_star_wiki_residue(html_dir: Path) -> list[tuple]:
    """★ followed by known wiki-internal patterns (Stage N, 정식 명세 등).

    Allows ★ for legitimate uses:
      - schema discipline markers in SQL (set-once, append-only, HSM-wrapped, byte-equal, Forbidden columns 의 ABSENCE)
      - direct quote attribution (★ Fireblocks 직접 인용)
      - functional emphasis (★ SPOC, ★ Risk, ★ NS 라벨, ★ 6 files, ★ Owner 의 별도 승인 등)
      - mermaid node labels (inside <pre class="mermaid">)
    Flags only patterns that are clearly wiki-internal carryover.
    """
    wiki_only_patterns = [
        re.compile(r"★\s*Stage\s+\d+"),           # ★ Stage N
        re.compile(r"★\s*정식\s+(명세|명시)"),     # ★ 정식 명세 / ★ 정식 명시
        re.compile(r"\(★[^)]*ANSWERED\)"),         # (★ Stage N ANSWERED)
    ]
    issues = []
    for f in sorted(html_dir.glob("*.html")):
        text = f.read_text()
        for pat in wiki_only_patterns:
            for m in pat.finditer(text):
                issues.append((f.name, m.group(0)[:60]))
    return issues


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2

    html_dir = Path(sys.argv[1])
    if not html_dir.is_dir():
        print(f"Not a directory: {html_dir}")
        return 2

    failed = False

    # 1. Sidebar mismatches
    print("=" * 60)
    print("1. Sidebar number ↔ inline link consistency")
    print("=" * 60)
    mismatches = check_sidebar_mismatch(html_dir)
    if mismatches:
        for m in mismatches:
            print(f"  {m[0]:30s}  {m[1]:25s}  inline='{m[2]}' ≠ sidebar='{m[3]}'")
        print(f"FAIL: {len(mismatches)} mismatches")
        failed = True
    else:
        print("PASS: 0 mismatches")

    # 2. Mermaid entity corruption
    print()
    print("=" * 60)
    print("2. Mermaid block entity preservation")
    print("=" * 60)
    mermaid_issues = check_mermaid_entities(html_dir)
    if mermaid_issues:
        for fn, idx, bad in mermaid_issues:
            print(f"  {fn} block {idx}: corrupted entities {bad}")
        print(f"FAIL: {len(mermaid_issues)} corrupted blocks")
        failed = True
    else:
        print("PASS: 0 entity corruptions")

    # 3. Wiki residue
    print()
    print("=" * 60)
    print("3. Wiki-internal residue (should be 0 for public docs)")
    print("=" * 60)
    residue = check_wiki_residue(html_dir)
    total_residue = sum(len(v) for v in residue.values())
    for key, hits in residue.items():
        if hits:
            print(f"  [{key}]: {len(hits)} occurrences")
            for fn, m in hits[:5]:
                print(f"    {fn}: {m}")
            if len(hits) > 5:
                print(f"    ... and {len(hits) - 5} more")
    if total_residue == 0:
        print("PASS: 0 residue patterns")
    else:
        print(f"FAIL: {total_residue} residue occurrences")
        failed = True

    # 4. ★ wiki residue (only clearly wiki-internal patterns — Stage N, 정식 명세, ANSWERED)
    print()
    print("=" * 60)
    print("4. ★ wiki-internal patterns (Stage N / 정식 명세 / ANSWERED)")
    print("=" * 60)
    star_issues = check_star_wiki_residue(html_dir)
    if star_issues:
        print(f"  ({len(star_issues)} occurrences):")
        for fn, txt in star_issues[:10]:
            print(f"    {fn}: {txt}")
        if len(star_issues) > 10:
            print(f"    ... and {len(star_issues) - 10} more")
        failed = True
    else:
        print("PASS: 0 wiki-internal ★ patterns")

    print()
    print("=" * 60)
    print("RESULT:", "FAIL — fix the above before deploy" if failed else "PASS — ready for deploy")
    print("=" * 60)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
