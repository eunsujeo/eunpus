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
//   node scripts/export-board.mjs --only "디지털 자산,블록체인매니저/API,컴플라이언스/API" --out ../digital-assets.html
//   node scripts/export-board.mjs --with-ref            → 참고 문서(ref:)까지 포함
//     --only : 지정한 대카테고리(또는 대/중카테고리)만 담는다 — embed 뷰어도 그 카드 것만 내장
import { access, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { assembleBoardHtml, attachCardMeta, excludeRefDocs } from '../public/export.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUB = join(HERE, '..', 'public');
// 값 없는 플래그는 먼저 걷어낸다 — 아래 파서가 "플래그 값" 짝을 전제하기 때문
const WITH_REF = process.argv.includes('--with-ref');
const argv = process.argv.slice(2).filter((a) => a !== '--with-ref');
const args = new Map();
for (let i = 0; i < argv.length; i += 2) {
  args.set(argv[i].replace(/^--/, ''), argv[i + 1]);
}
const DIR = resolve(HERE, args.get('dir') || '../../docs');
const DOCS_PATH = (args.get('docs-path') || 'blockchain-manager/docs').replace(/\/+$/, '');
const FROM = args.get('from') || 'http://127.0.0.1:8788';
const OUT = resolve(HERE, args.get('out') || '../../board.html');
const execFileAsync = promisify(execFile);

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

function cardDate(meta, fallback) {
  return /^\d{4}-\d{2}-\d{2}$/.test(meta.date || '')
    ? `${meta.date}T00:00:00.000Z`
    : fallback;
}

function mermaidJobs(data) {
  const fence = /^```mermaid\s*\r?\n([\s\S]*?)\r?\n```\s*$/gim;
  const jobs = [];
  for (const [path, doc] of Object.entries(data.docs || {})) {
    [...String(doc.body || '').matchAll(fence)].forEach((m, index) => {
      jobs.push({ path, index, source: m[1].trim() });
    });
  }
  return jobs;
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { await access(candidate); return candidate; } catch { /* 다음 후보 */ }
  }
  return '';
}

// Node 경로도 브라우저의 HTML ↓와 같은 결과를 만든다. 프로젝트에 무거운 DOM 의존성을 추가하는 대신
// 설치된 Chrome에서 vendored Mermaid를 한 번 실행하고 SVG 캐시만 다시 가져온다.
async function preRenderMermaidWithChrome(data, mermaidSource) {
  const jobs = mermaidJobs(data);
  data.mermaidSvgs = {};
  data.mermaidPreRendered = true;
  if (!jobs.length) return 0;

  const chrome = await findChrome();
  if (!chrome) {
    delete data.mermaidSvgs;
    data.mermaidPreRendered = false;
    console.warn('  경고: Chrome을 찾지 못해 Mermaid 런타임을 포함합니다 (CHROME_PATH로 지정 가능)');
    return 0;
  }

  const tempDir = await mkdtemp(join(tmpdir(), 'blockchain-manager-mermaid-'));
  const renderer = join(tempDir, 'render.html');
  const safeJobs = JSON.stringify(jobs).replace(/</g, '\\u003c');
  const inlineMermaid = mermaidSource.replace(/<\/script/gi, '<\\/script');
  const page = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<pre id="result">pending</pre>
<script>${inlineMermaid}</script>
<script>
const jobs = ${safeJobs};
mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict' });
(async () => {
  const cache = {};
  for (let i = 0; i < jobs.length; i += 1) {
    const job = jobs[i];
    const rendered = await mermaid.render('export-mermaid-' + (i + 1), job.source);
    if (!cache[job.path]) cache[job.path] = [];
    cache[job.path][job.index] = { source: job.source, svg: rendered.svg };
  }
  const json = JSON.stringify({ cache });
  document.getElementById('result').textContent = btoa(unescape(encodeURIComponent(json)));
})().catch((error) => {
  document.getElementById('result').textContent = 'ERROR:' + (error && error.message || error);
});
</${'script'}></body></html>`;

  try {
    await writeFile(renderer, page, 'utf8');
    const { stdout } = await execFileAsync(chrome, [
      '--headless=new', '--no-first-run', '--disable-gpu', '--disable-background-networking',
      `--user-data-dir=${join(tempDir, 'profile')}`, '--virtual-time-budget=15000', '--dump-dom',
      `file://${renderer}`,
    ], { timeout: 45000, maxBuffer: 20 * 1024 * 1024 });
    const encoded = /<pre id="result">([^<]+)<\/pre>/.exec(stdout)?.[1] || '';
    if (!encoded || encoded.startsWith('ERROR:')) throw new Error(encoded || 'Chrome SVG 결과 없음');
    const parsed = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    data.mermaidSvgs = parsed.cache;
    return jobs.length;
  } catch (error) {
    delete data.mermaidSvgs;
    data.mermaidPreRendered = false;
    console.warn(`  경고: Mermaid SVG 사전 생성 실패 — 런타임 포함 (${error.message})`);
    return 0;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
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
    group: meta.group || '',
    summary,
    updatedAt: cardDate(meta, st.mtime.toISOString()),
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
const ONLY = new Set((args.get('only') || '').split(',').map((s) => s.trim()).filter(Boolean));
if (ONLY.size) {
  const onlyArg = [...ONLY]; // ref-scan 확장 전 원본 — 홈에 보일 카테고리 산출용
  const allCards = board.cards.slice();
  const inScope = (c) => ONLY.has(c.category) || ONLY.has(`${c.category}/${c.subcategory}`);
  // 담긴 문서가 ?cat=…&sub=… 로 가리키는 카테고리를 자동으로 함께 담는다 (상호참조 링크 유지)
  const refRe = /\?cat=([^&\s)]+)&sub=([^)\s&]+)/g;
  for (const c of allCards.filter(inScope)) {
    const raw = await readFile(join(DIR, c.path.slice(DOCS_PATH.length + 1)), 'utf8');
    let m;
    while ((m = refRe.exec(raw))) ONLY.add(`${decodeURIComponent(m[1])}/${decodeURIComponent(m[2])}`);
  }
  board.cards = allCards.filter(inScope);
  const tree = {};
  for (const [cat, subs] of Object.entries(board.tree)) {
    if (ONLY.has(cat)) { tree[cat] = subs; continue; }
    const keep = subs.filter((s) => ONLY.has(`${cat}/${s}`));
    if (keep.length) tree[cat] = keep;
  }
  board.tree = tree;
  // 홈에 타일로 보일 카테고리 = 명시적으로 고른 것만 (ref-scan 으로 딸려온 건 숨김)
  board.homeCats = [...new Set(onlyArg.map((o) => o.split('/')[0]))];
}

// --- 2) 문서 본문: /api/doc 응답과 같은 모양으로 내장 ---
// 내보내기는 공유용이라 `ref:` 가 붙은 참고 문서(판단 재료·심화)는 기본으로 뺀다. --with-ref 로 포함.
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
attachCardMeta({ board, docs });
for (const p of excludeRefDocs({ board, docs }, WITH_REF)) console.log(`  제외(참고): ${p}`);

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
const data = { board, docs, embeds };
const svgCount = await preRenderMermaidWithChrome(data, mermaid);
if (svgCount) console.log(`  Mermaid SVG ${svgCount}개 사전 생성`);
const out = assembleBoardHtml({ html, css, mermaid, md, theme, app }, data);

await writeFile(OUT, out, 'utf8');
console.log(`board.html 내보내기 완료 — ${OUT}`);
console.log(`  문서 ${board.cards.length}건 · 상태 출처: ${source} · ${(out.length / 1024 / 1024).toFixed(1)}MB`);
