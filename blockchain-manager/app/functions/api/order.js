import { gh, json, GhError, encodePath, b64encodeUtf8, requireEnv } from './_lib.js';

// docs/.board-order.json 에 대·중카테고리 순서를 커밋한다.
export async function onRequestPut({ request, env }) {
  const bad = requireEnv(env);
  if (bad) return bad;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'JSON body 필요' }, 400);
  }

  const order = {
    categories: Array.isArray(payload.categories) ? payload.categories : [],
    subcategories:
      payload.subcategories && typeof payload.subcategories === 'object' ? payload.subcategories : {},
  };

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  const path = env.DOCS_PATH.replace(/\/+$/, '') + '/.board-order.json';

  try {
    let sha;
    try {
      const cur = await gh(
        env,
        `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`
      );
      sha = cur.sha;
    } catch (e) {
      if (!(e instanceof GhError && e.status === 404)) throw e;
    }

    const put = await gh(env, `/repos/${owner}/${repo}/contents/${encodePath(path)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: 'kanban: reorder categories',
        content: b64encodeUtf8(JSON.stringify(order, null, 2) + '\n'),
        sha,
        branch,
      }),
    });

    return json({ ok: true, commit: put.commit?.sha || null });
  } catch (e) {
    const code = e instanceof GhError ? (e.status === 409 ? 409 : 502) : 500;
    return json({ error: String(e.message || e) }, code);
  }
}
