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

export function requireDocsConfig(env) {
  return env.DOCS_PATH ? null : json({ error: '환경변수 미설정: DOCS_PATH' }, 500);
}

export function generatedAssetUrl(request, assetPath) {
  const url = new URL(request.url);
  url.pathname = assetPath;
  url.search = '';
  url.hash = '';
  return url;
}

export function generatedDocAssetUrl(request, env, logicalPath) {
  const base = env.DOCS_PATH.replace(/\/+$/, '');
  const rel = logicalPath.slice(base.length + 1);
  const encoded = rel.split('/').map(encodeURIComponent).join('/');
  return generatedAssetUrl(request, `/_generated/docs/${encoded}`);
}

// ── KV 오버레이 ──────────────────────────────────────────────
// 문서 마크다운은 git 이 정본. 자주 바뀌는 상태·순서만 KV(BOARD)에 둔다.
// 단일 키 'state' = { statuses: { <path>: status }, order: { categories, subcategories } }.
// git frontmatter status 는 초기값(seed) — KV 에 값이 있으면 그것이 이긴다.

export function kvNs(env) {
  return env.BOARD || null;
}

export async function readState(env) {
  const ns = kvNs(env);
  const empty = { statuses: {}, order: null };
  if (!ns) return empty;
  const s = await ns.get('state', 'json');
  if (!s || typeof s !== 'object') return empty;
  return { statuses: s.statuses || {}, order: s.order || null };
}

export async function putState(env, state) {
  const ns = kvNs(env);
  if (!ns) throw new Error('KV(BOARD) 바인딩이 없습니다 — Pages KV 바인딩 필요');
  await ns.put('state', JSON.stringify(state));
}
