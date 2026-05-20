"""Curated Wiki + Source Lake scanner.

v3.2.2 정합: PDF/markdown body 미로드. Frontmatter + filename + 첫 header + wikilink 추출만.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[2]
VENDORS_DIR = ROOT / "vendors" / "fireblocks"
ENTITIES_DIR = ROOT / "entities" / "fireblocks"
USER_ROLES_DIR = ENTITIES_DIR / "user-roles"
OPEN_Q_FILE = ROOT / "open-questions" / "fireblocks.md"
SOURCE_MD_DIR = ROOT / "sources" / "fireblocks" / "markdown"
SOURCE_PDF_DIR = ROOT / "sources" / "fireblocks" / "pdf"
SITEMAP_URLS = ROOT / "sources" / "fireblocks" / "webpages" / "developers" / "llms-urls.txt"

WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]")
SOURCE_CITE_RE = re.compile(r"`?(2026-\d{2}-\d{2}__[a-z0-9.-]+__[a-z0-9-]+)(?:\.md)?`?")
FRONTMATTER_RE = re.compile(r"^<!--(.*?)-->", re.DOTALL)
H1_RE = re.compile(r"^# (.+)$", re.MULTILINE)
SECTION_RE = re.compile(r"^(#{2,3}) (.+)$", re.MULTILINE)
STATUS_FIELD_RE = re.compile(r"^status:\s*(.+)$", re.MULTILINE)
PRIORITY_FIELD_RE = re.compile(r"^priority:\s*(.+)$", re.MULTILINE)
DOMAIN_FIELD_RE = re.compile(r"^domain:\s*(.+)$", re.MULTILINE)
CLUSTER_FIELD_RE = re.compile(r"^cluster:\s*(.+)$", re.MULTILINE)


@dataclass
class WikiPage:
    """Curated wiki page (vendor hub OR entity)."""
    kind: str  # "hub" | "entity" | "user-role"
    slug: str  # e.g. "api-co-signer"
    path: Path
    title: str  # H1 stripped
    outbound_wikilinks: list[str] = field(default_factory=list)
    source_citations: list[str] = field(default_factory=list)
    sections: list[str] = field(default_factory=list)
    size: int = 0


@dataclass
class SourceMarkdown:
    """Lightweight Source Lake markdown (status / priority / domain etc.)."""
    slug: str  # e.g. "2026-05-19__support-fireblocks-io__aws-nitro-cluster-catalog"
    path: Path
    status: str  # "full" | "lightweight-index" | "placeholder" | "cluster-catalog" | ...
    priority: str  # "TIER1" | "TIER2" | "TIER3" | ""
    domain: str
    cluster: str  # cluster name if any
    title: str
    line_count: int = 0  # body size — substantive heuristic for legacy ingests
    sections: list[str] = field(default_factory=list)  # H2/H3 headers — for H2 scoring

    def is_full_ingest(self) -> bool:
        """True if effectively full body ingest.

        Two paths: (a) explicit status:full, or (b) legacy pre-status-convention
        markdown with substantive body (≥ 50 lines). Stage 1–7 ingests predate
        the status field but are full-body markdowns.
        """
        if "full" in self.status.lower():
            return True
        # Legacy: no status field but substantive body
        if not self.status and self.line_count >= 50:
            return True
        return False

    def is_catalog_only(self) -> bool:
        """Lightweight index / placeholder / cluster-catalog — body NOT loaded."""
        s = self.status.lower()
        return any(t in s for t in ("lightweight-index", "placeholder", "cluster-catalog", "sitemap"))


@dataclass
class OpenQuestion:
    qid: str  # e.g. "Q-2026-05-18-G04"
    title: str
    status: str  # "open" | "answered" | "partial answered"
    where_came_up: list[str]  # wikilink targets
    sources_to_check: str = ""  # raw "Sources to check" line (free text)
    explicit_sources: list[str] = field(default_factory=list)  # source slugs heuristically matched (H1)


# ---------- parsing helpers ----------


def _read(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8")
    except Exception:
        return ""


def _frontmatter(text: str) -> str:
    m = FRONTMATTER_RE.search(text)
    return m.group(1) if m else ""


def _h1(text: str) -> str:
    # Skip frontmatter block, then find first H1
    body = FRONTMATTER_RE.sub("", text, count=1)
    m = H1_RE.search(body)
    return m.group(1).strip() if m else ""


def _wikilinks(text: str) -> list[str]:
    return [m.group(1).strip() for m in WIKILINK_RE.finditer(text)]


def _sections(text: str) -> list[str]:
    return [m.group(2).strip() for m in SECTION_RE.finditer(text)]


def _source_cites(text: str) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for m in SOURCE_CITE_RE.finditer(text):
        s = m.group(1)
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out


# ---------- public API ----------


def scan_entities() -> list[WikiPage]:
    pages: list[WikiPage] = []
    for p in sorted(ENTITIES_DIR.glob("*.md")):
        pages.append(_load_wiki_page(p, kind="entity"))
    for p in sorted(USER_ROLES_DIR.glob("*.md")):
        pages.append(_load_wiki_page(p, kind="user-role"))
    return pages


def scan_hubs() -> list[WikiPage]:
    return [_load_wiki_page(p, kind="hub") for p in sorted(VENDORS_DIR.glob("*.md"))]


def _load_wiki_page(p: Path, kind: str) -> WikiPage:
    text = _read(p)
    return WikiPage(
        kind=kind,
        slug=p.stem,
        path=p,
        title=_h1(text) or p.stem,
        outbound_wikilinks=_wikilinks(text),
        source_citations=_source_cites(text),
        sections=_sections(text),
        size=len(text),
    )


def scan_source_markdowns() -> list[SourceMarkdown]:
    out: list[SourceMarkdown] = []
    if not SOURCE_MD_DIR.exists():
        return out
    for p in sorted(SOURCE_MD_DIR.glob("*.md")):
        text = _read(p)
        fm = _frontmatter(text)
        out.append(
            SourceMarkdown(
                slug=p.stem,
                path=p,
                status=_field(fm, STATUS_FIELD_RE),
                priority=_field(fm, PRIORITY_FIELD_RE),
                domain=_field(fm, DOMAIN_FIELD_RE),
                cluster=_field(fm, CLUSTER_FIELD_RE),
                title=_h1(text) or p.stem,
                line_count=text.count("\n"),
                sections=_sections(text),
            )
        )
    return out


def _field(fm: str, regex: re.Pattern[str]) -> str:
    m = regex.search(fm)
    return m.group(1).strip() if m else ""


def scan_cluster_catalogs() -> list[SourceMarkdown]:
    return [s for s in scan_source_markdowns() if "cluster-catalog" in s.status.lower()]


def scan_open_questions(src_slugs: list[str] | None = None) -> list[OpenQuestion]:
    """Parse Open Q file. If src_slugs provided, resolve `Sources to check` phrases to explicit source slug matches (H1)."""
    text = _read(OPEN_Q_FILE)
    out: list[OpenQuestion] = []
    q_re = re.compile(r"^### (Q-\d{4}-\d{2}-\d{2}-[A-Z0-9]+):\s*(.+)$", re.MULTILINE)
    src_slugs = src_slugs or []
    for m in q_re.finditer(text):
        qid, title = m.group(1), m.group(2).strip()
        start = m.end()
        next_m = q_re.search(text, start)
        end = next_m.start() if next_m else len(text)
        block = text[start:end]
        status = _qstatus(block)
        where = [w.group(1).strip() for w in WIKILINK_RE.finditer(block)]
        where = [w for w in where if w.startswith(("entities/", "vendors/"))]
        sources_line = _sources_to_check_line(block)
        explicit = _resolve_explicit_sources(sources_line, src_slugs)
        out.append(OpenQuestion(
            qid=qid,
            title=title,
            status=status,
            where_came_up=where,
            sources_to_check=sources_line,
            explicit_sources=explicit,
        ))
    return out


SOURCES_TO_CHECK_RE = re.compile(r"\*\*Sources to check\*\*:\s*(.+?)$", re.MULTILINE)


def _sources_to_check_line(block: str) -> str:
    m = SOURCES_TO_CHECK_RE.search(block)
    return m.group(1).strip() if m else ""


_SOURCE_PHRASE_STOP = {
    "the", "pdf", "doc", "docs", "guide", "guidelines", "stage", "ingest",
    "확인됨", "수집됨", "전용", "관련", "보완", "별도", "tier", "placeholder",
    "외부", "본문", "후속", "문서", "settings", "노하우", "of", "for", "in",
    "and", "or", "vs", "전용", "article", "whitepaper", "release", "notes",
}


def _resolve_explicit_sources(sources_line: str, src_slugs: list[str]) -> list[str]:
    """Heuristic match: phrase ∩ slug ≥ 50% AND ≥ 1 non-generic token in overlap (H1).

    Non-generic requirement filters out matches driven solely by common tokens
    like 'add'/'users' that appear in many slugs.
    """
    if not sources_line:
        return []
    phrases = re.split(r"[,()/]|또는|and\s+", sources_line)
    phrases = [p.strip() for p in phrases if p.strip()]
    matched: set[str] = set()
    for phrase in phrases:
        phrase_tokens = set(
            t.lower() for t in re.findall(r"[a-zA-Z0-9가-힣]+", phrase)
        )
        phrase_tokens -= _SOURCE_PHRASE_STOP
        if len(phrase_tokens) < 2:
            continue
        for slug in src_slugs:
            slug_body = slug.split("__", 2)[-1].lower() if "__" in slug else slug.lower()
            slug_tokens = set(re.findall(r"[a-zA-Z0-9가-힣]+", slug_body))
            overlap = phrase_tokens & slug_tokens
            if not overlap:
                continue
            # H1 strict: require ≥ 1 non-generic token in overlap
            non_generic = overlap - GENERIC_TOKENS
            if not non_generic:
                continue
            ratio = len(overlap) / len(phrase_tokens)
            if ratio >= 0.5:
                matched.add(slug)
    return sorted(matched)


def _qstatus(block: str) -> str:
    # Match: "- **Status**: open"  OR  "- **Status**: **answered (...)**"  OR  "- **Status**: **partial answered ...**"
    m = re.search(r"\*\*Status\*\*:\s*(.+?)$", block, re.MULTILINE)
    if not m:
        return "unknown"
    raw = m.group(1).strip().lower()
    # Strip bold markers and trailing parens
    raw = raw.replace("**", "").strip()
    # Check status keyword at the START (ignore "(Stage 6 partial → Stage 10 complete)" annotations)
    if raw.startswith("partial"):
        return "partial answered"
    if raw.startswith("answered"):
        return "answered"
    if raw.startswith("open"):
        return "open"
    return raw


def scan_sitemap_urls() -> list[str]:
    """Stage 15 llms-urls.txt — URL list only (body 미로드)."""
    if not SITEMAP_URLS.exists():
        return []
    return [line.strip() for line in _read(SITEMAP_URLS).splitlines() if line.strip()]


def scan_source_pdfs() -> list[str]:
    """Raw + normalized PDF filenames (body 미로드)."""
    if not SOURCE_PDF_DIR.exists():
        return []
    return sorted(p.name for p in SOURCE_PDF_DIR.glob("*.pdf"))


# ---------- index helpers ----------


# ---------- keyword search ----------


def _normalize_keywords(s: str) -> list[str]:
    """Lowercase, strip Korean particles, tokenize. Drop stop tokens."""
    stop = {"가", "이", "는", "은", "을", "를", "에", "와", "과", "의", "에서", "로", "으로",
            "뭐야", "뭔가", "어떻게", "절차", "흐름", "환경", "세팅", "있는가", "필요한가",
            "what", "is", "the", "a", "an", "vs", "of", "for", "to", "in", "?"}
    s = s.lower()
    # Replace punctuation with space
    s = re.sub(r"[?·,()'\"]", " ", s)
    tokens = [t.strip(".:- ") for t in re.split(r"\s+", s) if t.strip()]
    return [t for t in tokens if t and t not in stop and len(t) > 1]


# H4 — generic tokens that appear in many sources and produce false positives
# when matched alone. Down-weighted by GENERIC_WEIGHT in scoring.
GENERIC_TOKENS = {
    "api", "user", "users", "key", "keys", "policy", "policies",
    "transaction", "transactions", "tx",
    "co-signer", "cosigner", "co", "signer",
    "mpc", "fireblocks", "workspace", "vault", "wallet",
    "console", "mobile", "device", "admin",
}
GENERIC_WEIGHT = 0.3  # multiplier for generic-only matches
SECTION_WEIGHT = 3.0  # H2: keyword match in section header
EXPLICIT_SOURCE_WEIGHT = 10.0  # H1: explicit Sources-to-check match


def _kw_weight(keyword: str) -> float:
    return GENERIC_WEIGHT if keyword in GENERIC_TOKENS else 1.0


def _score_against_text(keywords: list[str], haystack: str) -> float:
    """Sum of per-keyword weights for matches in haystack."""
    s = haystack.lower()
    return sum(_kw_weight(k) for k in keywords if k in s)


def _score_against_sections(keywords: list[str], sections: list[str]) -> float:
    """H2 — keyword match in section headers gets SECTION_WEIGHT per hit."""
    if not sections:
        return 0.0
    combined = " ".join(sections).lower()
    return SECTION_WEIGHT * sum(1 for k in keywords if k in combined)


def search_source_markdowns(
    keywords: list[str],
    src: list[SourceMarkdown],
    explicit_slugs: list[str] | None = None,
) -> list[tuple[SourceMarkdown, float]]:
    """Score = slug+title keyword match (H4-weighted) + H2 section match + H1 explicit boost."""
    explicit_set = set(explicit_slugs or [])
    results: list[tuple[SourceMarkdown, float]] = []
    for s in src:
        score = _score_against_text(keywords, s.slug + " " + s.title)
        score += _score_against_sections(keywords, s.sections)
        if s.slug in explicit_set:
            score += EXPLICIT_SOURCE_WEIGHT  # H1
        if score > 0:
            results.append((s, score))
    results.sort(key=lambda x: -x[1])
    return results


def search_pdfs(keywords: list[str], pdf_names: list[str]) -> list[tuple[str, float]]:
    """PDF filename match — generic-token weighted (H4)."""
    results: list[tuple[str, float]] = []
    for name in pdf_names:
        score = _score_against_text(keywords, name)
        if score > 0:
            results.append((name, score))
    results.sort(key=lambda x: -x[1])
    return results


def search_sitemap(keywords: list[str], urls: list[str]) -> list[tuple[str, float]]:
    """Sitemap URL match — generic-token weighted (H4)."""
    results: list[tuple[str, float]] = []
    for u in urls:
        score = _score_against_text(keywords, u)
        if score > 0:
            results.append((u, score))
    results.sort(key=lambda x: -x[1])
    return results


def search_open_questions(keywords: list[str], opens: list[OpenQuestion]) -> list[tuple[OpenQuestion, float]]:
    """Q-title keyword match — generic-token weighted (H4)."""
    results: list[tuple[OpenQuestion, float]] = []
    for q in opens:
        score = _score_against_text(keywords, q.title)
        if score > 0:
            results.append((q, score))
    results.sort(key=lambda x: -x[1])
    return results


# H3 — entity citation index for "already cited" detection
def build_citation_index(entities: list[WikiPage], hubs: list[WikiPage]) -> dict[str, set[str]]:
    """Return: wikilink → set of source slugs cited by that page.

    e.g. "entities/fireblocks/api-user" → {"2026-05-18__...__add-api-users", ...}
    """
    idx: dict[str, set[str]] = {}
    for e in entities:
        prefix = "entities/fireblocks/user-roles/" if e.kind == "user-role" else "entities/fireblocks/"
        idx[f"{prefix}{e.slug}"] = set(e.source_citations)
    for h in hubs:
        idx[f"vendors/fireblocks/{h.slug}"] = set(h.source_citations)
    return idx


def opens_for_target(target_wikilink: str, opens: list[OpenQuestion]) -> list[OpenQuestion]:
    """Open Qs that reference a given entity/hub wikilink (via where_came_up)."""
    return [q for q in opens if target_wikilink in q.where_came_up]


# ---------- index helpers ----------


def hub_outbound_entities(hub: WikiPage) -> list[str]:
    return [w for w in hub.outbound_wikilinks if w.startswith("entities/fireblocks/")]


def entity_outbound_hubs(entity: WikiPage) -> list[str]:
    return [w for w in entity.outbound_wikilinks if w.startswith("vendors/fireblocks/")]


def has_full_ingest_source(citations: Iterable[str], source_index: dict[str, SourceMarkdown]) -> bool:
    """True if any cite points to a source markdown with status: full."""
    for c in citations:
        sm = source_index.get(c)
        if sm and "full" in sm.status.lower():
            return True
    return False
