const API = 'https://api.github.com';

export const STATUSES = ['To Do', 'In Progress', 'Done', '아카이브'];

export const STATUS_SLUG = {
  'To Do': 'todo',
  'In Progress': 'in-progress',
  'Done': 'done',
  '아카이브': 'archive',
};

export function normalizeStatus(s) {
  return STATUSES.includes(s) ? s : 'To Do';
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export class GhError extends Error {
  constructor(status, body) {
    super(`GitHub API ${status}: ${body}`);
    this.status = status;
  }
}

function ghHeaders(env, accept) {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: accept,
    'User-Agent': 'blockchain-manager-kanban',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function gh(env, path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: { ...ghHeaders(env, 'application/vnd.github+json'), ...(init.headers || {}) },
  });
  if (!res.ok) throw new GhError(res.status, await res.text());
  return res.json();
}

export async function ghRaw(env, path) {
  const res = await fetch(API + path, {
    headers: ghHeaders(env, 'application/vnd.github.raw+json'),
  });
  if (!res.ok) throw new GhError(res.status, await res.text());
  return res.text();
}

// GraphQL 은 한 번의 subrequest 로 여러 파일 내용·커밋일을 배치 조회한다.
// (Workers 무료 플랜의 invocation 당 subrequest 한도를 넘기지 않기 위함)
export async function ghGraphQL(env, query) {
  const res = await fetch(API + '/graphql', {
    method: 'POST',
    headers: {
      ...ghHeaders(env, 'application/vnd.github+json'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new GhError(res.status, await res.text());
  const body = await res.json();
  if (body.errors) throw new GhError(502, JSON.stringify(body.errors));
  return body.data;
}

export function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

// docs 폴더 밖 파일 접근 차단
export function validDocPath(env, path) {
  const base = (env.DOCS_PATH || '').replace(/\/+$/, '');
  return (
    typeof path === 'string' &&
    base.length > 0 &&
    path.startsWith(base + '/') &&
    path.endsWith('.md') &&
    !path.includes('..')
  );
}

export function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { meta: {}, body: text, raw: null };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: text.slice(m[0].length), raw: m[0] };
}

export function b64decodeUtf8(b64) {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function b64encodeUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function requireEnv(env) {
  const missing = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'DOCS_PATH'].filter(
    (k) => !env[k]
  );
  if (missing.length) {
    return json({ error: `환경변수 미설정: ${missing.join(', ')}` }, 500);
  }
  return null;
}
