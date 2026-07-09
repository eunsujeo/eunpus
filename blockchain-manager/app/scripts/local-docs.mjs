#!/usr/bin/env node
// 로컬 개발용 문서 사이드카 — docs 폴더를 파일시스템에서 직접 읽어 board/doc API 에 공급한다.
// wrangler(workerd)는 fs 접근이 안 되므로 이 작은 Node 서버가 대신 읽고, Functions 가 fetch 한다.
// LOCAL_DOCS_URL 이 설정된 로컬 모드에서만 쓰이며 배포에는 포함되지 않는다.
// 매 요청마다 fs 를 새로 읽으므로, 문서를 고치면 브라우저 새로고침만으로 반영된다(커밋·push 불필요).
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, relative, sep } from 'node:path';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
}
const DIR = resolve(args.get('dir') || '../docs'); // docs 폴더 절대경로
const DOCS_PATH = (args.get('docs-path') || 'blockchain-manager/docs').replace(/\/+$/, ''); // 논리 prefix
const PORT = Number(args.get('port') || 8790);

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

function toLogicalPath(absFile) {
  return `${DOCS_PATH}/${relative(DIR, absFile).split(sep).join('/')}`;
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
    path: toLogicalPath(absFile),
    name,
    title: meta.title || name.replace(/\.md$/, ''),
    category,
    subcategory,
    seedStatus: norm(meta.status), // frontmatter 기본값 — 라이브 status 는 KV 오버레이
    summary,
    updatedAt: st.mtime.toISOString(),
  };
}

// board.js 의 buildBase 와 같은 모양을 파일시스템에서 만든다.
async function buildBoard() {
  const treeDirs = {};
  const cards = [];
  let gitOrder = null;
  try {
    gitOrder = JSON.parse(await readFile(join(DIR, '.board-order.json'), 'utf8'));
  } catch {
    /* 없으면 null */
  }

  for (const cat of (await entries(DIR)).filter((e) => e.isDirectory())) {
    const catDir = join(DIR, cat.name);
    const inCat = await entries(catDir);
    treeDirs[cat.name] = inCat.filter((e) => e.isDirectory()).map((e) => e.name);
    for (const f of inCat.filter((e) => e.isFile() && isMd(e.name))) {
      cards.push(await card(join(catDir, f.name), cat.name, ''));
    }
    for (const sub of inCat.filter((e) => e.isDirectory())) {
      const subDir = join(catDir, sub.name);
      for (const f of (await entries(subDir)).filter((e) => e.isFile() && isMd(e.name))) {
        cards.push(await card(join(subDir, f.name), cat.name, sub.name));
      }
    }
  }
  return { treeDirs, cards, gitOrder };
}

// 논리 path → 절대 파일경로. docs 폴더 밖 접근 차단.
function resolveDocPath(logical) {
  if (typeof logical !== 'string' || !logical.startsWith(DOCS_PATH + '/') || logical.includes('..')) {
    return null;
  }
  const abs = resolve(DIR, logical.slice(DOCS_PATH.length + 1));
  if (abs !== DIR && !abs.startsWith(DIR + sep)) return null;
  return abs;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  try {
    if (url.pathname === '/board') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(await buildBoard()));
    } else if (url.pathname === '/doc') {
      const abs = resolveDocPath(url.searchParams.get('path'));
      if (!abs) {
        res.statusCode = 400;
        res.end('bad path');
        return;
      }
      const raw = await readFile(abs, 'utf8').catch(() => null);
      if (raw == null) {
        res.statusCode = 404;
        res.end('not found');
        return;
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(raw);
    } else {
      res.statusCode = 404;
      res.end('not found');
    }
  } catch (e) {
    res.statusCode = 500;
    res.end(String((e && e.message) || e));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`  ↳ local-docs sidecar: http://127.0.0.1:${PORT}  (dir: ${DIR})`);
});
