#!/usr/bin/env node
// 로컬 개발용 문서 사이드카 — docs 폴더를 파일시스템에서 직접 읽어 board/doc API 에 공급한다.
// wrangler(workerd)는 fs 접근이 안 되므로 이 작은 Node 서버가 대신 읽고, Functions 가 fetch 한다.
// LOCAL_DOCS_URL 이 설정된 로컬 모드에서만 쓰이며 배포에는 포함되지 않는다.
// 매 요청마다 fs 를 새로 읽으므로, 문서를 고치면 브라우저 새로고침만으로 반영된다(커밋·push 불필요).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildBoardBase, resolveDocPath } from './docs-data.mjs';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
}
const DIR = resolve(args.get('dir') || '../docs'); // docs 폴더 절대경로
const DOCS_PATH = (args.get('docs-path') || 'blockchain-manager/docs').replace(/\/+$/, ''); // 논리 prefix
const PORT = Number(args.get('port') || 8790);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  try {
    if (url.pathname === '/board') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(await buildBoardBase({ dir: DIR, docsPath: DOCS_PATH })));
    } else if (url.pathname === '/doc') {
      const abs = resolveDocPath({
        dir: DIR,
        docsPath: DOCS_PATH,
        logicalPath: url.searchParams.get('path'),
      });
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
