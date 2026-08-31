#!/usr/bin/env node
// 로컬 개발 서버 — Cloudflare 런타임 없이 정적 앱과 문서 API를 Node.js로 제공한다.
// 문서는 매 요청마다 파일시스템에서 읽고, 상태·순서 오버레이는 .local/state.json에 보존한다.
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STATUSES,
  buildBoardBase,
  materializeBoard,
  normalizeStatus,
  parseFrontmatter,
  resolveDocPath,
} from './docs-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_DIR = resolve(HERE, '..');
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
}

const PORT = Number(args.get('port') || 8788);
const PUBLIC_DIR = resolve(args.get('public-dir') || join(APP_DIR, 'public'));
const DOCS_DIR = resolve(args.get('docs-dir') || join(APP_DIR, '..', 'docs'));
const DOCS_PATH = (args.get('docs-path') || 'blockchain-manager/docs').replace(/\/+$/, '');
const STATE_FILE = resolve(args.get('state-file') || join(APP_DIR, '.local', 'state.json'));
const LEGACY_KV_DIR = resolve(
  args.get('legacy-kv-dir') || join(APP_DIR, '.wrangler', 'state', 'v3', 'kv')
);
const MAX_BODY_BYTES = 1024 * 1024;

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendJson(res, data, statusCode = 200) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendText(res, text, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text),
  });
  res.end(text);
}

async function readState() {
  try {
    const state = JSON.parse(await readFile(STATE_FILE, 'utf8'));
    return state && typeof state === 'object'
      ? { statuses: state.statuses || {}, order: state.order || null }
      : { statuses: {}, order: null };
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      const legacy = await readLegacyState();
      if (legacy) {
        await writeState(legacy);
        console.log(`  기존 Wrangler 로컬 상태를 ${STATE_FILE}로 이관했습니다.`);
        return legacy;
      }
      return { statuses: {}, order: null };
    }
    throw new Error(`로컬 상태를 읽지 못했습니다: ${error.message}`);
  }
}

async function readLegacyState() {
  let namespaces;
  try {
    namespaces = await readdir(LEGACY_KV_DIR, { withFileTypes: true });
  } catch {
    return null;
  }

  const candidates = [];
  for (const namespace of namespaces.filter((entry) => entry.isDirectory())) {
    const blobsDir = join(LEGACY_KV_DIR, namespace.name, 'blobs');
    let blobs;
    try {
      blobs = await readdir(blobsDir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const blob of blobs.filter((entry) => entry.isFile())) {
      const file = join(blobsDir, blob.name);
      try {
        const [raw, fileStat] = await Promise.all([readFile(file, 'utf8'), stat(file)]);
        const state = JSON.parse(raw);
        if (
          state &&
          typeof state === 'object' &&
          state.statuses &&
          typeof state.statuses === 'object' &&
          (state.order == null || typeof state.order === 'object')
        ) {
          candidates.push({ state, modifiedAt: fileStat.mtimeMs });
        }
      } catch {
        // KV blob 중 보드 state JSON이 아닌 파일은 건너뛴다.
      }
    }
  }

  candidates.sort((a, b) => b.modifiedAt - a.modifiedAt);
  const found = candidates[0] && candidates[0].state;
  return found ? { statuses: found.statuses || {}, order: found.order || null } : null;
}

async function writeState(state) {
  await mkdir(dirname(STATE_FILE), { recursive: true });
  const temporary = `${STATE_FILE}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  await rename(temporary, STATE_FILE);
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('요청 본문이 너무 큽니다.'), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('JSON body 필요'), { status: 400 });
  }
}

async function handleBoard(req, res) {
  if (req.method !== 'GET') return sendJson(res, { error: 'Method Not Allowed' }, 405);
  const [base, state] = await Promise.all([
    buildBoardBase({ dir: DOCS_DIR, docsPath: DOCS_PATH }),
    readState(),
  ]);
  return sendJson(res, materializeBoard(base, state));
}

async function handleDoc(req, res, url) {
  if (req.method === 'GET') {
    const logicalPath = url.searchParams.get('path');
    const abs = resolveDocPath({ dir: DOCS_DIR, docsPath: DOCS_PATH, logicalPath });
    if (!abs || !logicalPath.endsWith('.md')) return sendJson(res, { error: '잘못된 path' }, 400);
    let raw;
    try {
      raw = await readFile(abs, 'utf8');
    } catch (error) {
      if (error && error.code === 'ENOENT') return sendJson(res, { error: 'not found' }, 404);
      throw error;
    }
    const state = await readState();
    const { meta, body } = parseFrontmatter(raw);
    const rel = logicalPath.slice(DOCS_PATH.length + 1).split('/');
    const category = rel.length > 1 ? rel[0] : '';
    const subcategory = rel.length > 2 ? rel[1] : '';
    return sendJson(res, {
      path: logicalPath,
      meta: {
        ...meta,
        category,
        subcategory,
        status: normalizeStatus(state.statuses[logicalPath] || meta.status),
      },
      body,
      raw,
    });
  }

  if (req.method === 'PATCH') {
    const payload = await readJsonBody(req);
    const { path, status } = payload || {};
    const abs = resolveDocPath({ dir: DOCS_DIR, docsPath: DOCS_PATH, logicalPath: path });
    if (!abs || !path.endsWith('.md')) return sendJson(res, { error: '잘못된 path' }, 400);
    if (!STATUSES.includes(status)) {
      return sendJson(res, { error: `status 는 ${STATUSES.join(' | ')} 중 하나` }, 400);
    }
    const state = await readState();
    state.statuses[path] = status;
    await writeState(state);
    return sendJson(res, { ok: true, path, status });
  }

  return sendJson(res, { error: 'Method Not Allowed' }, 405);
}

async function handleOrder(req, res) {
  if (req.method !== 'PUT') return sendJson(res, { error: 'Method Not Allowed' }, 405);
  const payload = await readJsonBody(req);
  const order = {
    categories: Array.isArray(payload.categories) ? payload.categories : [],
    subcategories:
      payload.subcategories && typeof payload.subcategories === 'object'
        ? payload.subcategories
        : {},
  };
  const state = await readState();
  state.order = order;
  await writeState(state);
  return sendJson(res, { ok: true });
}

function staticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.startsWith('/_generated/')) return null;
  if (decoded === '/') decoded = '/index.html';
  else if (!extname(decoded)) decoded += '.html';
  const abs = resolve(PUBLIC_DIR, `.${decoded}`);
  return abs.startsWith(`${PUBLIC_DIR}${sep}`) ? abs : null;
}

async function serveStatic(req, res, pathname) {
  if (!['GET', 'HEAD'].includes(req.method)) return sendText(res, 'Method Not Allowed', 405);
  const abs = staticPath(pathname);
  if (!abs) return sendText(res, 'Not Found', 404);
  let fileStat;
  try {
    fileStat = await stat(abs);
  } catch (error) {
    if (error && error.code === 'ENOENT') return sendText(res, 'Not Found', 404);
    throw error;
  }
  if (!fileStat.isFile()) return sendText(res, 'Not Found', 404);

  res.writeHead(200, {
    'Content-Type': CONTENT_TYPES[extname(abs).toLowerCase()] || 'application/octet-stream',
    'Content-Length': fileStat.size,
    'Cache-Control': 'no-store',
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(abs).on('error', () => res.destroy()).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  try {
    if (url.pathname === '/api/board') return await handleBoard(req, res);
    if (url.pathname === '/api/doc') return await handleDoc(req, res, url);
    if (url.pathname === '/api/order') return await handleOrder(req, res);
    if (url.pathname.startsWith('/api/')) return sendJson(res, { error: 'Not Found' }, 404);
    return await serveStatic(req, res, url.pathname);
  } catch (error) {
    return sendJson(res, { error: error.message || String(error) }, error.status || 500);
  }
});

function shutdown(signal) {
  server.close((error) => process.exit(error ? 1 : 0));
  setTimeout(() => process.exit(1), 3000).unref();
  console.log(`\n${signal} 수신 — 로컬 서버 종료`);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

server.listen(PORT, '127.0.0.1', () => {
  console.log(`▶ http://localhost:${PORT}`);
  console.log(`  로컬 Node 서버 · Wrangler/GitHub 미사용`);
  console.log(`  문서: ${DOCS_DIR}`);
  console.log(`  상태: ${STATE_FILE}`);
});
