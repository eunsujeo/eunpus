import {
  gh,
  ghRaw,
  json,
  GhError,
  encodePath,
  parseFrontmatter,
  normalizeStatus,
  requireEnv,
} from './_lib.js';

export async function onRequestGet({ env }) {
  const bad = requireEnv(env);
  if (bad) return bad;

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  const docsPath = env.DOCS_PATH.replace(/\/+$/, '');

  try {
    const rootList = await gh(
      env,
      `/repos/${owner}/${repo}/contents/${encodePath(docsPath)}?ref=${encodeURIComponent(branch)}`
    );
    const entries = Array.isArray(rootList) ? rootList : [];
    const isMd = (f) => f.type === 'file' && f.name.endsWith('.md');

    // 1단계 하위 폴더 = 중카테고리. docs/ 직속 .md 는 중카테고리 없음.
    const rootFiles = entries.filter(isMd).map((f) => ({ ...f, subcategory: '' }));
    const dirs = entries.filter((e) => e.type === 'dir');
    const nested = await Promise.all(
      dirs.map((d) =>
        gh(
          env,
          `/repos/${owner}/${repo}/contents/${encodePath(d.path)}?ref=${encodeURIComponent(branch)}`
        ).then((list) =>
          (Array.isArray(list) ? list : [])
            .filter(isMd)
            .map((f) => ({ ...f, subcategory: d.name }))
        )
      )
    );
    const files = [...rootFiles, ...nested.flat()];

    const cards = await Promise.all(
      files.map(async (f) => {
        const [raw, commits] = await Promise.all([
          ghRaw(env, `/repos/${owner}/${repo}/contents/${encodePath(f.path)}?ref=${encodeURIComponent(branch)}`),
          gh(
            env,
            `/repos/${owner}/${repo}/commits?path=${encodeURIComponent(f.path)}&sha=${encodeURIComponent(branch)}&per_page=1`
          ).catch(() => []),
        ]);

        const { meta, body } = parseFrontmatter(raw);
        const summary = body
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s && !s.startsWith('#'))
          .slice(0, 2);

        return {
          path: f.path,
          name: f.name,
          title: meta.title || f.name.replace(/\.md$/, ''),
          category: meta.category || '',
          subcategory: f.subcategory || meta.subcategory || '',
          status: normalizeStatus(meta.status),
          summary,
          updatedAt: commits[0]?.commit?.committer?.date || null,
        };
      })
    );

    cards.sort((a, b) => a.name.localeCompare(b.name));
    return json({ cards });
  } catch (e) {
    const status = e instanceof GhError ? 502 : 500;
    return json({ error: String(e.message || e) }, status);
  }
}
