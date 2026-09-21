#!/usr/bin/env python3
"""Curated Wiki lint — prompts/update-wiki.md 의 Lint 체크리스트를 재현 가능하게 실행.

대상: vendors/fireblocks/*.md + entities/fireblocks/*.md + entities/fireblocks/user-roles/*.md
      + open-questions/*.md + log.md

기존 lint-report.md (Stage 35 prep) 는 1회성 수작업 산출물이었다. 본 스크립트는 같은
6 항목을 매 stage 재실행할 수 있게 하고, CLAUDE.md / index.md 동기화용 카운트도 함께 낸다.

Usage:
    python3 scripts/wiki_lint.py                 # lint-report.md 재생성 + stdout 요약
    python3 scripts/wiki_lint.py --check         # 파일 안 쓰고 요약만 (CI/사전 점검용)
    python3 scripts/wiki_lint.py --out <path>    # 출력 경로 지정

v3.2.2 정합: Source Lake 본문 미로드. curated wiki 본문만 읽는다.
"""
from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENDORS_DIR = ROOT / "vendors" / "fireblocks"
ENTITIES_DIR = ROOT / "entities" / "fireblocks"
USER_ROLES_DIR = ENTITIES_DIR / "user-roles"
OPEN_Q_DIR = ROOT / "open-questions"
DOCS_ARCH_DIR = ROOT / "docs" / "architecture"
LOG_FILE = ROOT / "log.md"
DEFAULT_OUT = ROOT / "lint-report.md"

REQUIRED_SECTIONS = [
    "Summary",
    "Key Concepts",
    "Details",
    "Related Pages",
    "Sources",
    "Open Questions",
]

# user-role 페이지는 Key Concepts / Details 대신 권한·제약 두 절을 쓴다 (CLAUDE.md 5절).
USER_ROLE_SECTIONS = [
    "Summary",
    "Permissions / Capabilities",
    "Restrictions",
    "Related Pages",
    "Sources",
    "Open Questions",
]

WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]")
YAML_FM_RE = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
H1_RE = re.compile(r"^# (.+)$", re.MULTILINE)
H2_RE = re.compile(r"^## (.+?)\s*$", re.MULTILINE)
STAGE_REF_RE = re.compile(r"Stage (\d+)")
# log.md 는 두 형식이 섞여 있다: 초기 `## [날짜] ingest | 제목 (Stage N)` 12 건,
# 이후 `## Stage N (날짜) — 제목` 219 건.
LOG_STAGE_RE = re.compile(r"^## Stage (\d+)\b", re.MULTILINE)
LOG_STAGE_LEGACY_RE = re.compile(r"^## \[.*?\].*?\(Stage (\d+)\b", re.MULTILINE)
LOG_H2_RE = re.compile(r"^## .+$", re.MULTILINE)
# Q heading 도 파일마다 다르다: `### Q-2026-05-18-G01: ...` / `## Q-2026-06-04-STBL01 — ...` / `## Q-CMP-01 — ...`
Q_ENTRY_RE = re.compile(r"^#{2,3} (Q-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\s*[:—-]?\s*(.*)$", re.MULTILINE)
Q_STATUS_RE = re.compile(r"^(?:-\s+)?\*\*Status\*\*:\s*(.+)$", re.MULTILINE)
# 답변 기록 라벨은 자유 형식이다: `**Answer**:` `**Stage 161 partial answer**:` `**부분 답 (2026-08-20)**:`
# `**진전 (Stage 149)**:` 등. 아래는 heuristic — 미탐지 = "확인 필요" 이지 "미반영" 확정이 아니다.
Q_ANSWER_RE = re.compile(
    r"^(?:-\s+)?\*\*[^*]*(?:answer|답|진전|확인됨|결론|signal|근거)[^*]*\*\*:",
    re.MULTILINE | re.IGNORECASE,
)
STATUS_WORD_RE = re.compile(r"(answered|partial|abandoned|open)", re.IGNORECASE)


# ---------- 로딩 ----------


class Page:
    """Curated wiki page 한 장."""

    def __init__(self, path: Path, kind: str) -> None:
        self.path = path
        self.kind = kind  # "hub" | "entity" | "user-role"
        self.slug = path.stem
        self.rel = path.relative_to(ROOT).as_posix()
        self.link_id = self.rel[: -len(".md")]  # wikilink 가 가리키는 경로 형태
        self.text = path.read_text(encoding="utf-8")
        self.frontmatter = _parse_frontmatter(self.text)
        self.body = YAML_FM_RE.sub("", self.text, count=1)
        m = H1_RE.search(self.body)
        self.title = m.group(1).strip() if m else self.slug
        self.sections = [s.strip() for s in H2_RE.findall(self.body)]
        self.outbound = _dedup(WIKILINK_RE.findall(self.body))
        self.related_links = _dedup(WIKILINK_RE.findall(_section_body(self.body, "Related Pages")))
        self.sources_body = _sections_by_prefix(self.body, "Sources")
        self.stage_refs = {int(n) for n in STAGE_REF_RE.findall(self.text)}


def _parse_frontmatter(text: str) -> dict:
    """YAML frontmatter 를 얕게 파싱. pyyaml 없이도 돌도록 최소 구현."""
    m = YAML_FM_RE.match(text)
    if not m:
        return {}
    out: dict = {}
    for line in m.group(1).splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        if line.startswith((" ", "\t", "-")):  # 중첩 블록은 related 만 별도 처리
            if "related_block" in out:
                item = line.strip().lstrip("- ").strip()
                if item:
                    out["related_block"].append(item)
            continue
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key, val = key.strip(), val.strip()
        if val == "":
            if key == "related":
                out["related_block"] = []
            continue
        if val.startswith("[") and val.endswith("]"):
            out[key] = [v.strip() for v in val[1:-1].split(",") if v.strip()]
        else:
            out[key] = val
    if "related_block" in out:
        out["related"] = out.pop("related_block")
    return out


def _section_body(body: str, heading: str) -> str:
    """`## <heading>` 부터 다음 `## ` 직전까지."""
    pat = re.compile(rf"^## {re.escape(heading)}\s*$(.*?)(?=^## |\Z)", re.MULTILINE | re.DOTALL)
    m = pat.search(body)
    return m.group(1) if m else ""


def _sections_by_prefix(body: str, prefix: str) -> str:
    """`## Sources`, `## Sources (추가)`, `## Sources (Stage 36 추가)` 를 모두 합친 본문.

    Stage 별 추가 인용을 별도 H2 로 다는 것이 이 위키의 확립된 관행이라 (45 건),
    Sources bullet 을 셀 때는 변형 heading 을 전부 합산해야 한다.
    """
    pat = re.compile(
        rf"^## {re.escape(prefix)}(?:\s*\([^)]*\))?\s*$(.*?)(?=^## |\Z)",
        re.MULTILINE | re.DOTALL,
    )
    return "".join(m.group(1) for m in pat.finditer(body))


def _dedup(items) -> list[str]:
    seen, out = set(), []
    for i in items:
        i = i.strip()
        if i and i not in seen:
            seen.add(i)
            out.append(i)
    return out


def load_pages() -> list[Page]:
    pages = [Page(p, "hub") for p in sorted(VENDORS_DIR.glob("*.md"))]
    pages += [Page(p, "entity") for p in sorted(ENTITIES_DIR.glob("*.md"))]
    pages += [Page(p, "user-role") for p in sorted(USER_ROLES_DIR.glob("*.md"))]
    return pages


# ---------- 검사 항목 ----------


def check_sections(pages: list[Page]) -> list[tuple[str, list[str]]]:
    """1. 6-section template 누락.

    `## Key Concepts (verb vocabulary)` `## Sources (Stage 36 추가)` 처럼 괄호 접미사를
    붙이는 것이 이 위키의 관행이라, 접미사를 떼고 대조한다.
    """
    out = []
    for p in pages:
        present = {re.sub(r"\s*\(.*\)\s*$", "", sec).strip() for sec in p.sections}
        required = USER_ROLE_SECTIONS if p.kind == "user-role" else REQUIRED_SECTIONS
        missing = [s for s in required if s not in present]
        if missing:
            out.append((p.rel, missing))
    return out


PLACEHOLDER_RE = re.compile(r"^\s*[-*]?\s*_TODO[^_]*_\s*$", re.MULTILINE)


def check_empty_sources(pages: list[Page]) -> list[str]:
    """2. Sources 가 비었는데 본문에 주장이 있는 페이지.

    `_TODO: …_` 만 채워진 placeholder 페이지는 주장이 없으므로 대상이 아니다.
    """
    out = []
    for p in pages:
        has_source_bullet = any(
            ln.strip().startswith(("-", "*")) for ln in p.sources_body.splitlines()
        )
        if has_source_bullet:
            continue
        # 본문 주장 유무 = Summary/Key Concepts/Details 에 실질 텍스트가 있는가
        substance = "".join(
            _sections_by_prefix(p.body, sec) for sec in ("Summary", "Key Concepts", "Details")
        )
        substance = PLACEHOLDER_RE.sub("", substance)
        if len(substance.strip()) > 100:
            out.append(p.rel)
    return out


def check_backlinks(pages: list[Page]) -> dict[str, list[str]]:
    """3. 단방향 wikilink — A 가 B 를 가리키는데 B 의 Related Pages 에 A 가 없음."""
    by_id = {p.link_id: p for p in pages}
    unidirectional: dict[str, list[str]] = defaultdict(list)
    for p in pages:
        for target in p.outbound:
            if target == p.link_id:
                continue  # 본문의 자기 인용 — 역링크 대상 아님
            tgt = by_id.get(target)
            if tgt is None:
                continue  # 위키 밖 (open-questions 등) 은 대상 아님
            if p.link_id not in tgt.related_links:
                unidirectional[p.slug].append(tgt.slug)
    return dict(unidirectional)


def check_open_questions() -> dict:
    """4. open-questions Status 표기 일관성 + answered 본문 반영 여부."""
    files = sorted(OPEN_Q_DIR.glob("*.md"))
    total, with_status, dist = 0, 0, defaultdict(int)
    missing_status: list[str] = []
    answered_without_answer: list[str] = []
    per_file: dict[str, int] = {}

    for f in files:
        text = f.read_text(encoding="utf-8")
        entries = list(Q_ENTRY_RE.finditer(text))
        # 템플릿 예시(Q-YYYY-MM-DD-NNN)는 제외
        entries = [e for e in entries if "YYYY" not in e.group(1)]
        per_file[f.name] = len(entries)
        for i, e in enumerate(entries):
            total += 1
            start = e.end()
            end = entries[i + 1].start() if i + 1 < len(entries) else len(text)
            block = text[start:end]
            sm = Q_STATUS_RE.search(block)
            if not sm:
                missing_status.append(f"{f.name} / {e.group(1)}")
                continue
            with_status += 1
            wm = STATUS_WORD_RE.search(sm.group(1))
            state = wm.group(1).lower() if wm else "unparsed"
            dist[state] += 1
            if state in ("answered", "partial") and not Q_ANSWER_RE.search(block):
                answered_without_answer.append(f"{f.name} / {e.group(1)}")

    return {
        "files": [f.name for f in files],
        "per_file": per_file,
        "total": total,
        "with_status": with_status,
        "dist": dict(sorted(dist.items())),
        "missing_status": missing_status,
        "answer_not_detected": answered_without_answer,
    }


def check_duplicate_titles(pages: list[Page]) -> dict[str, list[str]]:
    """5. 동일 H1 title 이 여러 파일에 정의됨."""
    by_title: dict[str, list[str]] = defaultdict(list)
    for p in pages:
        by_title[p.title].append(p.rel)
    return {t: paths for t, paths in by_title.items() if len(paths) > 1}


def check_stage_labels(pages: list[Page]) -> dict:
    """6. wiki 가 참조하는 stage ↔ log.md 의 stage 정합."""
    log_text = LOG_FILE.read_text(encoding="utf-8")
    log_stages = {int(n) for n in LOG_STAGE_RE.findall(log_text)}
    log_stages |= {int(n) for n in LOG_STAGE_LEGACY_RE.findall(log_text)}
    h2_total = len(LOG_H2_RE.findall(log_text))
    wiki_stages: set[int] = set()
    for p in pages:
        wiki_stages |= p.stage_refs
    return {
        "log_count": len(log_stages),
        "log_entries": h2_total,
        "log_unnumbered": sum(1 for h in LOG_H2_RE.findall(log_text) if not re.search(r"Stage \d+", h)),
        "log_max": max(log_stages) if log_stages else 0,
        "wiki_count": len(wiki_stages),
        "orphan": sorted(wiki_stages - log_stages),
        "unreferenced": sorted(log_stages - wiki_stages),
    }


def check_frontmatter(pages: list[Page]) -> dict:
    """7. frontmatter ↔ 본문 정합 (source_count / related / last_updated_stage)."""
    no_fm, count_mismatch, related_mismatch, stale_stage = [], [], [], []
    log_max = check_stage_labels(pages)["log_max"]
    for p in pages:
        fm = p.frontmatter
        if not fm:
            no_fm.append(p.rel)
            continue
        bullets = sum(
            1 for ln in p.sources_body.splitlines() if ln.strip().startswith(("-", "*"))
        )
        declared = fm.get("source_count")
        if declared is not None and str(declared).isdigit() and int(declared) != bullets:
            count_mismatch.append(f"{p.rel} (frontmatter {declared} ↔ 실제 {bullets})")
        fm_related = set(fm.get("related") or [])
        body_related = {t.rsplit("/", 1)[-1] for t in p.related_links}
        if fm_related and fm_related != body_related:
            only_fm = sorted(fm_related - body_related)
            only_body = sorted(body_related - fm_related)
            parts = []
            if only_fm:
                parts.append(f"frontmatter 만: {', '.join(only_fm)}")
            if only_body:
                parts.append(f"본문 만: {', '.join(only_body)}")
            related_mismatch.append(f"{p.rel} ({' / '.join(parts)})")
        lus = fm.get("last_updated_stage")
        if lus is None or not str(lus).isdigit():
            stale_stage.append(f"{p.rel} (last_updated_stage 없음)")
        elif int(lus) > log_max:
            stale_stage.append(f"{p.rel} (last_updated_stage {lus} > log 최대 {log_max})")
    return {
        "no_frontmatter": no_fm,
        "source_count_mismatch": count_mismatch,
        "related_mismatch": related_mismatch,
        "stage_field": stale_stage,
    }


def collect_counts(pages: list[Page], oq: dict, stages: dict) -> dict:
    """CLAUDE.md / index.md 동기화용 카운트."""
    open_pending = sum(v for k, v in oq["dist"].items() if k in ("open", "partial"))
    return {
        "stage_max": stages["log_max"],
        "stage_count": stages["log_count"],
        "hubs": sum(1 for p in pages if p.kind == "hub"),
        "entities": sum(1 for p in pages if p.kind == "entity"),
        "user_roles": sum(1 for p in pages if p.kind == "user-role"),
        "core_pages": len(pages),
        "docs_architecture": len(list(DOCS_ARCH_DIR.rglob("*.md"))) if DOCS_ARCH_DIR.exists() else 0,
        "open_q_total": oq["total"],
        "open_q_pending": open_pending,
    }


# ---------- 리포트 ----------


def render(pages: list[Page], results: dict) -> str:
    c = results["counts"]
    sec, empty_src, back = results["sections"], results["empty_sources"], results["backlinks"]
    oq, dup, stages, fm = results["oq"], results["duplicates"], results["stages"], results["fm"]

    back_total = sum(len(v) for v in back.values())
    L: list[str] = []
    a = L.append

    a(f"# Wiki Lint Report — Stage {c['stage_max']} 기준")
    a("")
    a(f"_생성: {date.today().isoformat()} · `python3 scripts/wiki_lint.py`_")
    a("")
    a(
        f"_점검 대상 {c['core_pages']} 페이지: vendors/fireblocks/ ({c['hubs']}) + "
        f"entities/fireblocks/ ({c['entities']}) + entities/fireblocks/user-roles/ ({c['user_roles']})_"
    )
    a("")
    a("Lint 항목 출처: [prompts/update-wiki.md](prompts/update-wiki.md) 의 Lint 체크리스트")
    a("")

    a("## 1. 6-section template 누락")
    a("")
    if sec:
        a(f"⚠️ {len(sec)} / {c['core_pages']} 페이지에서 누락:")
        a("")
        for rel, missing in sec:
            a(f"- `{rel}` — 누락: {', '.join('## ' + m for m in missing)}")
    else:
        a("✅ 전 페이지 6-section 충족")
    a("")

    a("## 2. Sources 비어있는데 본문 주장 있는 페이지")
    a("")
    if empty_src:
        a(f"⚠️ {len(empty_src)} 페이지:")
        a("")
        for rel in empty_src:
            a(f"- `{rel}`")
    else:
        a("✅ 본문 주장이 있는 페이지는 모두 Sources bullet 보유")
    a("")

    a("## 3. 단방향 wikilink (양방향 갱신 누락)")
    a("")
    if back:
        a(f"⚠️ {back_total} 단방향 link ({len(back)} 페이지에서 누락)")
        a("")
        top = sorted(back.items(), key=lambda kv: -len(kv[1]))[:10]
        a("Top 10 페이지 (out-link 많은 순):")
        for slug, targets in top:
            shown = ", ".join(targets[:5])
            more = "..." if len(targets) > 5 else ""
            a(f"- `{slug}` → 미회신 link {len(targets)} 개: {shown}{more}")
    else:
        a("✅ 모든 wikilink 가 양방향")
    a("")

    a("## 4. open-questions Status 표기 일관성")
    a("")
    a(f"- 대상 파일: {', '.join(oq['files'])}")
    a(f"- 총 Q entries: {oq['total']}")
    a(f"- `**Status**:` field 보유: {oq['with_status']}")
    a(f"- Status 분포: {oq['dist']}")
    a("")
    if oq["missing_status"]:
        a(f"⚠️ Status field 없는 Q {len(oq['missing_status'])} 건:")
        a("")
        for q in oq["missing_status"]:
            a(f"- {q}")
        a("")
    else:
        a("✅ **표기 일관** — 모든 Q entry 가 `**Status**:` field 보유")
        a("")
    if oq["answer_not_detected"]:
        a(f"⚠️ answered/partial 인데 답변 기록이 탐지되지 않은 Q {len(oq['answer_not_detected'])} 건 — **수동 확인 대상** (라벨이 자유 형식이라 미탐지일 수 있음):")
        a("")
        for q in oq["answer_not_detected"]:
            a(f"- {q}")
    else:
        a("✅ answered/partial Q 는 모두 답변 기록 보유")
    a("")

    a("## 5. 중복 entity 정의 (동일 h1 title 다중 위치)")
    a("")
    if dup:
        a(f"⚠️ {len(dup)} 건:")
        a("")
        for title, paths in sorted(dup.items()):
            a(f"- `{title}` — {', '.join(paths)}")
    else:
        a("✅ 중복 entity 정의 없음 (canonical 1 페이지 원칙 준수)")
    a("")

    a("## 6. Stage 라벨 정합 (wiki ↔ log.md)")
    a("")
    a(f"- log.md stage 수: {stages['log_count']} (최대 Stage {stages['log_max']})")
    a(f"- wiki 페이지에서 참조된 stage 수: {stages['wiki_count']}")
    if stages["orphan"]:
        a(f"- ⚠️ wiki 가 참조하는데 log 에 없는 stage: {stages['orphan']}")
    else:
        a("- ✅ wiki 가 참조하는 stage 는 모두 log.md 에 존재")
    unref = stages["unreferenced"]
    a(f"- ℹ️ log 에 있지만 wiki 미참조 stage (최근 10개): {unref[-10:]} (총 {len(unref)} 개)")
    a("")

    a("## 7. Frontmatter ↔ 본문 정합")
    a("")
    for label, key in (
        ("frontmatter 없음", "no_frontmatter"),
        ("source_count 불일치", "source_count_mismatch"),
        ("related ↔ Related Pages 불일치", "related_mismatch"),
        ("last_updated_stage 문제", "stage_field"),
    ):
        items = fm[key]
        if items:
            a(f"⚠️ **{label}** — {len(items)} 건")
            a("")
            for i in items[:15]:
                a(f"- `{i}`")
            if len(items) > 15:
                a(f"- … 외 {len(items) - 15} 건")
            a("")
        else:
            a(f"✅ {label}: 0 건")
            a("")

    a("## 8. 카운트 요약 (CLAUDE.md / index.md 동기화용)")
    a("")
    a("| 항목 | 실측값 |")
    a("|---|---|")
    a(f"| 최신 Stage | {c['stage_max']} |")
    a(f"| log.md stage entry | {c['stage_count']} |")
    a(f"| vendor hub | {c['hubs']} |")
    a(f"| entity | {c['entities']} |")
    a(f"| user-role | {c['user_roles']} |")
    a(f"| docs/architecture | {c['docs_architecture']} |")
    a(f"| open-questions 총 Q | {c['open_q_total']} |")
    a(f"| open-questions pending (open+partial) | {c['open_q_pending']} |")
    a("")

    a("---")
    a("")
    a("## Summary — 발견된 issue 별 priority")
    a("")
    a("| Issue | 건수 | Priority |")
    a("|---|---|---|")
    a(f"| 6-section 누락 | {len(sec)} | {'high' if sec else '-'} |")
    a(f"| Sources 부재 + 본문 주장 | {len(empty_src)} | {'high' if empty_src else '-'} |")
    a(f"| answered/partial 답변 기록 미탐지 (수동 확인) | {len(oq['answer_not_detected'])} | {'medium' if oq['answer_not_detected'] else '-'} |")
    a(f"| 단방향 wikilink | {back_total} | {'medium' if back else '-'} |")
    a(f"| Status field 부재 | {len(oq['missing_status'])} | {'medium' if oq['missing_status'] else '-'} |")
    a(f"| frontmatter source_count 불일치 | {len(fm['source_count_mismatch'])} | {'medium' if fm['source_count_mismatch'] else '-'} |")
    a(f"| frontmatter related 불일치 | {len(fm['related_mismatch'])} | {'medium' if fm['related_mismatch'] else '-'} |")
    a(f"| 중복 entity | {len(dup)} | {'high' if dup else '-'} |")
    a(f"| Stage orphan | {len(stages['orphan'])} | {'medium' if stages['orphan'] else '-'} |")
    a("")
    return "\n".join(L) + "\n"


# ---------- 기계적 교정 (--fix) ----------


def _replace_section(text: str, heading: str, new_body: str) -> str:
    """`## <heading>` 절의 본문을 통째로 교체."""
    pat = re.compile(rf"(^## {re.escape(heading)}[ \t]*$)(.*?)(?=^## |\Z)", re.MULTILINE | re.DOTALL)
    return pat.sub(lambda m: m.group(1) + new_body, text, count=1)


def _set_fm_field(text: str, key: str, value: str) -> str:
    """frontmatter 의 scalar field 를 교체. 없으면 마지막 줄 뒤에 추가."""
    m = YAML_FM_RE.match(text)
    if not m:
        return text
    fm = m.group(1)
    line_re = re.compile(rf"^{re.escape(key)}:.*$", re.MULTILINE)
    if line_re.search(fm):
        new_fm = line_re.sub(f"{key}: {value}", fm, count=1)
    else:
        new_fm = fm.rstrip("\n") + f"\n{key}: {value}"
    return text[: m.start(1)] + new_fm + text[m.end(1) :]


def _set_fm_list(text: str, key: str, items: list[str]) -> str:
    """frontmatter 의 list field 를 교체하되 파일이 쓰던 표기 (블록 / 인라인) 를 유지.

    CLAUDE.md 의 schema 는 블록 표기를 문서화하고 48 파일 중 28 이 그 표기를 쓴다.
    인라인으로 통일하면 schema 와 어긋나므로 기존 표기를 그대로 따른다.
    """
    m = YAML_FM_RE.match(text)
    if not m:
        return text
    fm = m.group(1)
    block_re = re.compile(rf"^{re.escape(key)}:[ \t]*$\n(?:^[ \t]+-.*$\n?)*", re.MULTILINE)
    inline_re = re.compile(rf"^{re.escape(key)}:[ \t]*\[.*?\][ \t]*$", re.MULTILINE)

    if block_re.search(fm):
        body = "".join(f"  - {i}\n" for i in items)
        new_fm = block_re.sub(f"{key}:\n{body}", fm, count=1)
    elif inline_re.search(fm):
        new_fm = inline_re.sub(f"{key}: [" + ", ".join(items) + "]", fm, count=1)
    else:
        new_fm = fm.rstrip("\n") + f"\n{key}: [" + ", ".join(items) + "]"
    # group(1) 은 `---` 사이 내용이라 개행으로 끝나지 않는다. 블록 교체 시 생기는 잉여 개행 제거.
    return text[: m.start(1)] + new_fm.rstrip("\n") + text[m.end(1) :]


def apply_fixes() -> dict:
    """단방향 wikilink · frontmatter drift · log.md Stage 1 표기를 교정.

    내용 판단이 필요한 항목 (6-section 누락, Sources 부재, 답변 라벨) 은 건드리지 않는다.
    """
    changed: dict[str, list[str]] = {
        "backlinks": [],
        "source_count": [],
        "related": [],
        "last_updated_stage": [],
        "log": [],
        "skipped": [],
    }

    # 1) 단방향 wikilink — 대상 페이지의 Related Pages 에 역링크 추가.
    #    추가한 역링크가 다시 그 페이지의 outbound 가 되므로 고정점까지 반복한다.
    totals: dict[str, int] = defaultdict(int)
    for _ in range(10):
        pages = load_pages()
        by_id = {p.link_id: p for p in pages}
        additions: dict[str, list[str]] = defaultdict(list)
        for p in pages:
            for target in p.outbound:
                if target == p.link_id:  # self-link 은 역링크 대상 아님
                    continue
                tgt = by_id.get(target)
                if tgt is None:
                    continue
                if p.link_id not in tgt.related_links and p.link_id not in additions[tgt.link_id]:
                    additions[tgt.link_id].append(p.link_id)
        if not additions:
            break
        for link_id, incoming in additions.items():
            tgt = by_id[link_id]
            text = tgt.path.read_text(encoding="utf-8")
            body = _section_body(YAML_FM_RE.sub("", text, count=1), "Related Pages")
            lines = [ln for ln in body.splitlines() if ln.strip()]
            lines += [f"- [[{src}]]" for src in incoming]
            tgt.path.write_text(
                _replace_section(text, "Related Pages", "\n\n" + "\n".join(lines) + "\n\n"),
                encoding="utf-8",
            )
            totals[tgt.rel] += len(incoming)
    for rel, n in sorted(totals.items()):
        changed["backlinks"].append(f"{rel} (+{n})")

    # 2·3·4) frontmatter — source_count / related / last_updated_stage
    for p in load_pages():  # 역링크 반영 후 다시 읽는다
        text = p.path.read_text(encoding="utf-8")
        orig = text
        if not p.frontmatter:
            changed["skipped"].append(f"{p.rel} (frontmatter 없음)")
            continue

        bullets = sum(1 for ln in p.sources_body.splitlines() if ln.strip().startswith(("-", "*")))
        declared = p.frontmatter.get("source_count")
        if str(declared) != str(bullets):
            text = _set_fm_field(text, "source_count", str(bullets))
            changed["source_count"].append(f"{p.rel} ({declared} → {bullets})")

        body_related = sorted({t.rsplit("/", 1)[-1] for t in p.related_links})
        if sorted(p.frontmatter.get("related") or []) != body_related:
            text = _set_fm_list(text, "related", body_related)
            changed["related"].append(f"{p.rel} ({len(body_related)} 개로 재동기화)")

        lus = p.frontmatter.get("last_updated_stage")
        if lus is None or not str(lus).isdigit():
            derived = max(p.stage_refs) if p.stage_refs else None
            if derived is None:
                changed["skipped"].append(f"{p.rel} (last_updated_stage 유도 불가 — Stage 언급 없음)")
            else:
                text = _set_fm_field(text, "last_updated_stage", str(derived))
                changed["last_updated_stage"].append(f"{p.rel} (본문 최대 Stage {derived} 로 유도)")

        if text != orig:
            p.path.write_text(text, encoding="utf-8")

    # 5) log.md 첫 entry 에 Stage 번호 표기 추가
    log_text = LOG_FILE.read_text(encoding="utf-8")
    first = "## [2026-05-18] ingest | fireblocks | User roles (Help Center)"
    if first in log_text:
        LOG_FILE.write_text(log_text.replace(first, first + " (Stage 1)", 1), encoding="utf-8")
        changed["log"].append("log.md 첫 entry 에 (Stage 1) 표기 추가")

    return changed


def run() -> dict:
    pages = load_pages()
    stages = check_stage_labels(pages)
    oq = check_open_questions()
    return {
        "pages": pages,
        "sections": check_sections(pages),
        "empty_sources": check_empty_sources(pages),
        "backlinks": check_backlinks(pages),
        "oq": oq,
        "duplicates": check_duplicate_titles(pages),
        "stages": stages,
        "fm": check_frontmatter(pages),
        "counts": collect_counts(pages, oq, stages),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="waas-wiki curated wiki lint")
    ap.add_argument("--check", action="store_true", help="파일 쓰지 않고 요약만 출력")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="리포트 출력 경로")
    ap.add_argument(
        "--fix",
        action="store_true",
        help="기계적 교정 적용 (역링크 / frontmatter / log Stage 표기). 내용 판단 항목은 제외",
    )
    args = ap.parse_args()

    if args.fix:
        ch = apply_fixes()
        print("=== --fix 적용 결과 ===")
        for label, key in (
            ("역링크 추가", "backlinks"),
            ("source_count 재계산", "source_count"),
            ("related 재동기화", "related"),
            ("last_updated_stage 유도", "last_updated_stage"),
            ("log.md", "log"),
            ("건너뜀", "skipped"),
        ):
            print(f"{label}: {len(ch[key])} 건")
            for item in ch[key]:
                print(f"  - {item}")
        print()

    results = run()
    report = render(results["pages"], results)

    c = results["counts"]
    back_total = sum(len(v) for v in results["backlinks"].values())
    print(f"점검 페이지: {c['core_pages']} (hub {c['hubs']} / entity {c['entities']} / user-role {c['user_roles']})")
    print(f"최신 Stage: {c['stage_max']} · open-Q {c['open_q_total']} (pending {c['open_q_pending']})")
    print(f"6-section 누락: {len(results['sections'])}")
    print(f"Sources 부재 + 본문 주장: {len(results['empty_sources'])}")
    print(f"단방향 wikilink: {back_total}")
    print(f"answered/partial 답변 기록 미탐지 (수동 확인): {len(results['oq']['answer_not_detected'])}")
    print(f"Status field 부재: {len(results['oq']['missing_status'])}")
    print(f"중복 entity: {len(results['duplicates'])}")
    print(f"Stage orphan: {len(results['stages']['orphan'])}")
    print(f"frontmatter — source_count {len(results['fm']['source_count_mismatch'])} / related {len(results['fm']['related_mismatch'])} / stage {len(results['fm']['stage_field'])}")

    if not args.check:
        args.out.write_text(report, encoding="utf-8")
        print(f"\n→ {args.out.relative_to(ROOT)} 재생성")
    return 0


if __name__ == "__main__":
    sys.exit(main())
