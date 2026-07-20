#!/usr/bin/env node
// 칸반보드 전체를 단일 HTML 파일로 내보낸다 — 파일 하나만 전달하면 더블클릭으로 보드 그대로 열린다.
// 앱 UI(index.html · styles.css · md.js · theme.js · app.js · mermaid)를 전부 인라인하고,
// fetch 를 내장 데이터로 가로채는 shim 을 심는다. 읽기 전용 — 드래그해도 저장되지 않는다.
//
// 상태·순서: 실행 중인 앱(기본 http://127.0.0.1:8788, KV 오버레이 반영)이 있으면 그 값을,
// 없으면 frontmatter seed + .board-order.json 을 쓴다.
//
//   node scripts/export-board.mjs                 → ../board.html (blockchain-manager/board.html)
//   node scripts/export-board.mjs --out <file> --from <url> --dir <docs>
//   node scripts/export-board.mjs --only "온보딩,블록체인매니저/API,컴플라이언스/API" --out ../onboarding.html
//     --only : 지정한 대카테고리(또는 대/중카테고리)만 담는다 — embed 뷰어도 그 카드 것만 내장
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleBoardHtml } from '../public/export.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUB = join(HERE, '..', 'public');
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
}
const DIR = resolve(HERE, args.get('dir') || '../../docs');
const DOCS_PATH = (args.get('docs-path') || 'blockchain-manager/docs').replace(/\/+$/, '');
const FROM = args.get('from') || 'http://127.0.0.1:8788';
const OUT = resolve(HERE, args.get('out') || '../../board.html');

const STATUSES = ['To Do', 'In Progress', 'Done', '아카이브'];
const norm = (s) => (STATUSES.includes(s) ? s : 'To Do');
const isMd = (n) => n.endsWith('.md');

function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: text.slice(m[0].length) };
}

async function entries(dir) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

// order 배열 기준 정렬 — 없는 항목은 뒤에 가나다순 (board.js 의 byManifest 와 동일)
function byManifest(items, order) {
  const idx = (x) => {
    const i = (order || []).indexOf(x);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...items].sort((a, b) => {
    const d = idx(a) - idx(b);
    return d !== 0 ? d : a.localeCompare(b);
  });
}

async function card(absFile, category, subcategory) {
  const raw = await readFile(absFile, 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const summary = body
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#'))
    .slice(0, 2);
  const st = await stat(absFile);
  const name = absFile.split(sep).pop();
  return {
    path: `${DOCS_PATH}/${relative(DIR, absFile).split(sep).join('/')}`,
    name,
    title: meta.title || name.replace(/\.md$/, ''),
    category,
    subcategory,
    status: norm(meta.status),
    view: meta.view || '',
    embed: meta.embed || '',
    summary,
    updatedAt: st.mtime.toISOString(),
  };
}

// /api/board 와 같은 모양을 파일시스템에서 만든다 (상태 = frontmatter seed)
async function buildBoardFromFs() {
  const treeDirs = {};
  const cards = [];
  let order = { categories: [], subcategories: {} };
  try {
    order = JSON.parse(await readFile(join(DIR, '.board-order.json'), 'utf8'));
  } catch {
    /* 없으면 가나다순 */
  }

  for (const cat of (await entries(DIR)).filter((e) => e.isDirectory())) {
    const catDir = join(DIR, cat.name);
    const inCat = await entries(catDir);
    treeDirs[cat.name] = inCat.filter((e) => e.isDirectory()).map((e) => e.name);
    for (const f of inCat.filter((e) => e.isFile() && isMd(e.name))) {
      cards.push(await card(join(catDir, f.name), cat.name, ''));
    }
    for (const sub of inCat.filter((e) => e.isDirectory())) {
      for (const f of (await entries(join(catDir, sub.name))).filter((e) => e.isFile() && isMd(e.name))) {
        cards.push(await card(join(catDir, sub.name, f.name), cat.name, sub.name));
      }
    }
  }

  const tree = {};
  for (const cat of byManifest(Object.keys(treeDirs), order.categories)) {
    tree[cat] = byManifest(treeDirs[cat], order.subcategories && order.subcategories[cat]);
  }
  cards.sort((a, b) => a.name.localeCompare(b.name));
  return { tree, cards };
}

// --- 1) 보드 데이터: 실행 중인 앱 우선, 없으면 fs ---
let board = null;
let source = 'frontmatter seed (.board-order.json)';
try {
  const r = await fetch(`${FROM}/api/board`, { signal: AbortSignal.timeout(1500) });
  if (r.ok) {
    const data = await r.json();
    if (data && data.cards) {
      board = data;
      source = `${FROM} (KV 상태·순서 반영)`;
    }
  }
} catch {
  /* 앱이 안 떠 있으면 fs 로 */
}
if (!board) board = await buildBoardFromFs();

// --- 1.5) --only 필터: 지정한 대카테고리(또는 대/중카테고리)만 남긴다 ---
const ONLY = (args.get('only') || '').split(',').map((s) => s.trim()).filter(Boolean);
if (ONLY.length) {
  board.cards = board.cards.filter(
    (c) => ONLY.includes(c.category) || ONLY.includes(`${c.category}/${c.subcategory}`)
  );
  const tree = {};
  for (const [cat, subs] of Object.entries(board.tree)) {
    if (ONLY.includes(cat)) { tree[cat] = subs; continue; }
    const keep = subs.filter((s) => ONLY.includes(`${cat}/${s}`));
    if (keep.length) tree[cat] = keep;
  }
  board.tree = tree;
}

// --- 2) 문서 본문: /api/doc 응답과 같은 모양으로 내장 ---
const docs = {};
for (const c of board.cards) {
  const raw = await readFile(join(DIR, c.path.slice(DOCS_PATH.length + 1)), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  docs[c.path] = {
    path: c.path,
    meta: { ...meta, category: c.category, subcategory: c.subcategory, status: c.status },
    body,
    raw,
  };
}

// --- 3) 앱 UI 인라인 + fetch shim 조립 (export.js — 앱의 "HTML ↓" 버튼과 공용) ---
const [html, css, mermaid, md, theme, app] = await Promise.all(
  ['index.html', 'styles.css', 'vendor/mermaid.min.js', 'md.js', 'theme.js', 'app.js'].map((f) =>
    readFile(join(PUB, f), 'utf8')
  )
);
// embed 뷰어(예: api.html)도 내장 — 정적 파일에서 원본 디자인 그대로 뜨게
const embeds = {};
for (const name of new Set(board.cards.map((c) => c.embed).filter(Boolean))) {
  if (!/^[\w][\w./-]*$/.test(name) || name.includes('..')) continue;
  try {
    embeds[name] = await readFile(join(PUB, name), 'utf8');
  } catch {
    /* 없으면 마크다운 뷰로 대체 (assembleBoardHtml 이 embed 를 비운다) */
  }
}
const out = assembleBoardHtml({ html, css, mermaid, md, theme, app }, { board, docs, embeds });

await writeFile(OUT, out, 'utf8');
console.log(`board.html 내보내기 완료 — ${OUT}`);
console.log(`  문서 ${board.cards.length}건 · 상태 출처: ${source} · ${(out.length / 1024 / 1024).toFixed(1)}MB`);
