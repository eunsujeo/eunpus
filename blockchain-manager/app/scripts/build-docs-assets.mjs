#!/usr/bin/env node
// docs 원문을 Pages 정적 자산으로 만든다. 배포 전에 실행하며 GitHub API는 사용하지 않는다.
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { buildBoardBase } from './docs-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_DIR = resolve(HERE, '..');
const REPO_ROOT = resolve(APP_DIR, '../..');
const DOCS_DIR = resolve(APP_DIR, '../docs');
const DOCS_PATH = 'blockchain-manager/docs';
const OUTPUT_DIR = join(APP_DIR, 'public', '_generated');
const OUTPUT_DOCS_DIR = join(OUTPUT_DIR, 'docs');
const execFileAsync = promisify(execFile);

function posixPath(path) {
  return path.split(sep).join('/');
}

async function gitUpdatedAtByRelative() {
  const docsFromRepo = posixPath(relative(REPO_ROOT, DOCS_DIR));
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['-c', 'core.quotepath=false', 'log', '--format=@@%cI', '--name-only', '--', docsFromRepo],
      { cwd: REPO_ROOT, maxBuffer: 20 * 1024 * 1024 }
    );
    const result = new Map();
    const prefix = `${docsFromRepo}/`;
    let committedAt = '';
    for (const line of stdout.split(/\r?\n/)) {
      if (line.startsWith('@@')) {
        committedAt = line.slice(2);
      } else if (committedAt && line.startsWith(prefix)) {
        const rel = line.slice(prefix.length);
        if (!result.has(rel)) result.set(rel, committedAt);
      }
    }
    return result;
  } catch {
    return new Map();
  }
}

const base = await buildBoardBase({
  dir: DOCS_DIR,
  docsPath: DOCS_PATH,
  updatedAtByRelative: await gitUpdatedAtByRelative(),
});

// 삭제 범위는 public/_generated 하나로 고정한다. 이전 빌드에서 사라진 문서가 남지 않게 매번 교체한다.
await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DOCS_DIR, { recursive: true });

for (const card of base.cards) {
  const rel = card.path.slice(DOCS_PATH.length + 1);
  const source = join(DOCS_DIR, ...rel.split('/'));
  const target = join(OUTPUT_DOCS_DIR, ...rel.split('/'));
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}

await writeFile(join(OUTPUT_DIR, 'board-base.json'), JSON.stringify(base), 'utf8');
console.log(`정적 문서 자산 생성 완료 — ${base.cards.length}건 · ${OUTPUT_DIR}`);
