import {
  gh,
  ghRaw,
  json,
  GhError,
  encodePath,
  parseFrontmatter,
  normalizeStatus,
  validDocPath,
  b64decodeUtf8,
  b64encodeUtf8,
  requireEnv,
  STATUSES,
  STATUS_SLUG,
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
    const raw = await ghRaw(
      env,
      `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`
    );
    const { meta, body } = parseFrontmatter(raw);
    // docs/<대카테고리>/<중카테고리>/<file>.md — 폴더가 카테고리의 source of truth
    const rel = path.slice(env.DOCS_PATH.replace(/\/+$/, '').length + 1).split('/');
    const category = rel.length > 1 ? rel[0] : '';
    const subcategory = rel.length > 2 ? rel[1] : '';
    return json({
      path,
      meta: { ...meta, category, subcategory, status: normalizeStatus(meta.status) },
      body,
      raw, // 복사·다운로드용 원문 (frontmatter 포함)
    });
  } catch (e) {
    const status = e instanceof GhError ? (e.status === 404 ? 404 : 502) : 500;
    return json({ error: String(e.message || e) }, status);
  }
}

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

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';

  try {
    const cur = await gh(
      env,
      `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`
    );
    const text = b64decodeUtf8(cur.content);
    const fm = parseFrontmatter(text);

    if (normalizeStatus(fm.meta.status) === status) {
      return json({ ok: true, path, status, unchanged: true });
    }

    let next;
    if (fm.raw) {
      let block = fm.raw;
      if (/^status:.*$/m.test(block)) {
        block = block.replace(/^status:.*$/m, `status: ${status}`);
      } else {
        block = block.replace(/\r?\n---\r?\n?$/, (end) => `\nstatus: ${status}${end}`);
      }
      next = block + fm.body;
    } else {
      next = `---\nstatus: ${status}\n---\n\n${text}`;
    }

    const name = path.split('/').pop();
    const put = await gh(env, `/repos/${owner}/${repo}/contents/${encodePath(path)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `kanban: ${name} -> ${STATUS_SLUG[status]}`,
        content: b64encodeUtf8(next),
        sha: cur.sha,
        branch,
      }),
    });

    return json({
      ok: true,
      path,
      status,
      commit: put.commit?.sha || null,
      updatedAt: put.commit?.committer?.date || null,
    });
  } catch (e) {
    const code = e instanceof GhError ? (e.status === 409 ? 409 : 502) : 500;
    return json({ error: String(e.message || e) }, code);
  }
}
