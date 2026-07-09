import {
  ghRaw,
  json,
  GhError,
  encodePath,
  parseFrontmatter,
  normalizeStatus,
  validDocPath,
  requireEnv,
  STATUSES,
  readState,
  putState,
} from './_lib.js';

export async function onRequestGet({ request, env }) {
  const bad = requireEnv(env);
  if (bad) return bad;

  const url = new URL(request.url);
  const path = url.searchParams.get('path');
  if (!validDocPath(env, path)) return json({ error: '잘못된 path' }, 400);

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';

  try {
    const [raw, state] = await Promise.all([
      ghRaw(env, `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`),
      readState(env),
    ]);
    const { meta, body } = parseFrontmatter(raw);
    // docs/<대카테고리>/<중카테고리>/<file>.md — 폴더가 카테고리의 source of truth
    const rel = path.slice(env.DOCS_PATH.replace(/\/+$/, '').length + 1).split('/');
    const category = rel.length > 1 ? rel[0] : '';
    const subcategory = rel.length > 2 ? rel[1] : '';
    // 상태는 KV 오버레이 우선, 없으면 frontmatter seed
    const status = normalizeStatus(state.statuses[path] || meta.status);
    return json({
      path,
      meta: { ...meta, category, subcategory, status },
      body,
      raw, // 복사·다운로드용 원문 (frontmatter 포함)
    });
  } catch (e) {
    const status = e instanceof GhError ? (e.status === 404 ? 404 : 502) : 500;
    return json({ error: String(e.message || e) }, status);
  }
}

// 상태 변경은 git 커밋이 아니라 KV(BOARD) 오버레이에 기록한다 — 커밋 노이즈 0.
export async function onRequestPatch({ request, env }) {
  const bad = requireEnv(env);
  if (bad) return bad;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'JSON body 필요' }, 400);
  }

  const { path, status } = payload || {};
  if (!validDocPath(env, path)) return json({ error: '잘못된 path' }, 400);
  if (!STATUSES.includes(status)) {
    return json({ error: `status 는 ${STATUSES.join(' | ')} 중 하나` }, 400);
  }

  try {
    const state = await readState(env);
    state.statuses = state.statuses || {};
    state.statuses[path] = status;
    await putState(env, state);
    return json({ ok: true, path, status });
  } catch (e) {
    return json({ error: String(e.message || e) }, 500);
  }
}
