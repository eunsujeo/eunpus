#!/usr/bin/env python3
"""openapi.yaml -> spec.js (커스텀 뷰어) + api.md (마크다운 export) + api.html (단일 HTML export).

- spec.js  : window.OPENAPI 로 감싼 JSON. index.html 이 라이브러리 없이 읽는다(file:// OK).
- api.md   : GitHub 등 어디서나 열리는 마크다운. `seq` 다이어그램은 mermaid 로 변환,
             enum 값·설명 표, 요청/응답 JSON 예시, 타입 링크(#schema-…→#heading) 포함.
- api.html : index.html 에 spec.js 를 인라인한 **단일 파일** — 파일 하나만 전달해도
             뷰어 그대로 열린다. export 파일이라 다운로드 버튼은 제거한다.
openapi.yaml 을 고치면:  python3 build.py
"""
import json
import os
import re

import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
spec = yaml.safe_load(open(os.path.join(HERE, "openapi.yaml"), encoding="utf-8"))

# ---------- spec.js (viewer) ----------
open(os.path.join(HERE, "spec.js"), "w", encoding="utf-8").write(
    "window.OPENAPI = " + json.dumps(spec, ensure_ascii=False, indent=2) + ";\n")

# ---------- api.md (markdown export) ----------
schemas = (spec.get("components") or {}).get("schemas") or {}


def resolve(o):
    if isinstance(o, dict) and "$ref" in o:
        cur = spec
        for p in o["$ref"].lstrip("#/").split("/"):
            cur = (cur or {}).get(p, {})
        return cur or {}
    return o or {}


def refname(o):
    return o["$ref"].split("/")[-1] if isinstance(o, dict) and "$ref" in o else None


def type_label(s):
    if not s:
        return "any"
    if "$ref" in s:
        return refname(s)
    if s.get("allOf"):
        return type_label(s["allOf"][0])
    if s.get("oneOf"):
        return " \\| ".join(type_label(x) for x in s["oneOf"])
    t = s.get("type")
    if isinstance(t, list):
        return " \\| ".join(x for x in t)
    if t == "array":
        return type_label(s.get("items") or {}) + "[]"
    return t or ("object" if s.get("properties") else "any")


def sample(s, depth=0):
    if not s or depth > 7:
        return None
    if "$ref" in s:
        s = resolve(s)
    if "example" in s:
        return s["example"]
    if s.get("allOf"):
        o = {k: sample(v, depth + 1) for k, v in (s.get("properties") or {}).items()}
        for x in s["allOf"]:
            v = sample(x, depth + 1)
            if isinstance(v, dict):
                o.update(v)
        return o
    if s.get("oneOf"):
        return sample(s["oneOf"][0], depth + 1)
    if "enum" in s:
        return s["enum"][0]
    t = s.get("type")
    if isinstance(t, list):
        t = next((x for x in t if x != "null"), "null")
    if t == "object" or s.get("properties"):
        return {k: sample(v, depth + 1) for k, v in (s.get("properties") or {}).items()}
    if t == "array":
        return [sample(s.get("items") or {}, depth + 1)]
    if t == "string":
        return "2026-07-13T04:05:06.789Z" if s.get("format") == "date-time" else "string"
    if t in ("integer", "number"):
        return 0
    if t == "boolean":
        return False
    return None


def media_example(media):
    if not media:
        return None
    return media["example"] if "example" in media else sample(media.get("schema") or {})


def prop_rows(s):
    s = resolve(s) if "$ref" in s else s
    if s.get("allOf"):
        merged = {"type": "object", "properties": dict(s.get("properties") or {}),
                  "required": list(s.get("required") or [])}
        for x in s["allOf"]:
            r = resolve(x)
            merged["properties"].update(r.get("properties") or {})
            merged["required"] += r.get("required") or []
        s = merged
    props = s.get("properties")
    if not props:
        return None
    req = set(s.get("required") or [])
    rows = []
    for k, raw in props.items():
        v = raw or {}
        desc = (v.get("description") or "")
        ev = v.get("enum") or (resolve(v).get("enum") if "$ref" in v else None)
        if ev:
            desc = (desc + " " if desc else "") + " ".join(f"`{e}`" for e in ev)
        rows.append((f"`{k}`", type_label(v), "필수" if k in req else "-", desc.replace("\n", " ")))
    return rows


def table(headers, rows):
    out = "| " + " | ".join(headers) + " |\n"
    out += "|" + "|".join("---" for _ in headers) + "|\n"
    for r in rows:
        out += "| " + " | ".join(str(c).replace("|", "\\|") for c in r) + " |\n"
    return out


def json_fence(v):
    return "```json\n" + json.dumps(v, ensure_ascii=False, indent=2) + "\n```\n"


def seq_to_mermaid(desc):
    def repl(m):
        out = ["```mermaid", "sequenceDiagram"]
        for ln in m.group(1).strip().split("\n"):
            mm = re.match(r"\s*(.+?)\s*->\s*(.+?)\s*:\s*(.*)", ln)
            if mm:
                out.append(f"    {mm.group(1).strip()}->>{mm.group(2).strip()}: {mm.group(3).strip()}")
        out.append("```")
        return "\n".join(out)
    return re.sub(r"```seq\n(.*?)\n```", repl, desc, flags=re.S)


def rewrite_links(text):
    # 뷰어용 #schema-Name 링크 → 마크다운 heading anchor(#name)
    return re.sub(r"\(#schema-([A-Za-z0-9]+)\)", lambda m: "(#" + m.group(1).lower() + ")", text)


info = spec["info"]
server = ((spec.get("servers") or [{}])[0]).get("url", "")
md = [f"# {info['title']}", "", f"`v{info['version']}`", ""]
md.append(rewrite_links(seq_to_mermaid(info.get("description", ""))).rstrip())

# operations grouped by tag (post-first: 생성이 조회보다 먼저)
tag_order = [t["name"] for t in spec.get("tags", [])]
groups = {}
for path, item in spec["paths"].items():
    common = item.get("parameters") or []
    for method in ["post", "put", "patch", "delete", "get"]:
        op = item.get(method)
        if not op:
            continue
        tag = (op.get("tags") or ["기타"])[0]
        groups.setdefault(tag, []).append((path, method, op, common + (op.get("parameters") or [])))
ordered = [t for t in tag_order if t in groups] + [t for t in groups if t not in tag_order]

md.append("\n## API")
for tag in ordered:
    md.append(f"\n### {tag}")
    tm = next((t for t in spec.get("tags", []) if t["name"] == tag), None)
    if tm and tm.get("description"):
        md.append(tm["description"])
    for path, method, op, params in groups[tag]:
        md.append(f"\n#### `{method.upper()}` {server}{path}")
        if op.get("summary"):
            md.append(f"\n**{op['summary']}**")
        if op.get("description"):
            md.append("\n" + op["description"].strip())
        prs = [resolve(p) for p in params]
        if prs:
            rows = []
            for p in prs:
                sc = p.get("schema") or {}
                ex = p.get("example", sc.get("example", sc.get("default", "")))
                rows.append((f"`{p.get('name')}`", p.get("in"), type_label(sc),
                             "필수" if p.get("required") else "-", ("" if ex is None else str(ex)),
                             (p.get("description") or "").replace("\n", " ")))
            md.append("\n_파라미터_\n\n" + table(["이름", "위치", "타입", "필수", "예시", "설명"], rows))
        rb = resolve(op["requestBody"]) if op.get("requestBody") else None
        rbm = (rb.get("content") or {}).get("application/json") if rb else None
        if rbm and rbm.get("schema"):
            md.append("\n_요청 본문_\n\n" + json_fence(media_example(rbm)))
            rows = prop_rows(rbm["schema"])
            if rows:
                md.append(table(["필드", "타입", "필수", "설명"], rows))
        if op.get("responses"):
            md.append("\n_응답_")
            for code, rraw in op["responses"].items():
                r = resolve(rraw)
                md.append(f"\n`{code}` — {r.get('description', '')}\n")
                m = (r.get("content") or {}).get("application/json")
                if m and m.get("schema"):
                    md.append(json_fence(media_example(m)))
                    rows = prop_rows(m["schema"])
                    if rows:
                        md.append(table(["필드", "타입", "필수", "설명"], rows))

md.append("\n## 타입")
for name, s in schemas.items():
    md.append(f"\n### {name}")
    if s.get("description"):
        md.append("\n" + s["description"].strip())
    rows = prop_rows(s)
    if rows:
        md.append("\n" + table(["필드", "타입", "필수", "설명"], rows))
    elif s.get("enum"):
        descs = s.get("x-enumDescriptions") or {}
        if descs:
            md.append("\n" + table(["값", "설명"], [(f"`{v}`", descs.get(v, "")) for v in s["enum"]]))
        else:
            md.append("\n" + table(["값"], [(f"`{v}`",) for v in s["enum"]]))

open(os.path.join(HERE, "api.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")

# ---------- api.html (단일 HTML export) ----------
html = open(os.path.join(HERE, "index.html"), encoding="utf-8").read()
specjs = open(os.path.join(HERE, "spec.js"), encoding="utf-8").read()
html = html.replace('<script src="./spec.js"></script>',
                    "<script>\n" + specjs + "</script>")
assert "window.OPENAPI" in html, "spec.js 인라인 실패 — index.html 의 script 태그 확인"
# export 파일에는 다운로드 버튼이 의미 없다(옆에 파일이 없음) — topact 의 anchor 만 제거
html = re.sub(r'\s*<a class="iconbtn" href="\./[^"]+" download>[^<]*</a>', "", html)
open(os.path.join(HERE, "api.html"), "w", encoding="utf-8").write(html)

print(f"spec.js + api.md + api.html 생성 완료 — paths {len(spec['paths'])}, schemas {len(schemas)}")
