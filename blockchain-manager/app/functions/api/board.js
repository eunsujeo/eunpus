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

// docs/<대카테고리>/<중카테고리>/*.md — 폴더가 카테고리의 source of truth
export async function onRequestGet({ env }) {
  const bad = requireEnv(env);
  if (bad) return bad;

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  const docsPath = env.DOCS_PATH.replace(/\/+$/, '');

  const list = (path) =>
    gh(
      env,
      `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`
    ).then((r) => (Array.isArray(r) ? r : []));

  const isMd = (f) => f.type === 'file' && f.name.endsWith('.md');

  try {
    const root = await list(docsPath);
    const catDirs = root.filter((e) => e.type === 'dir');

    const tree = {}; // { 대카테고리: [중카테고리...] } — 문서가 없어도 폴더면 노출
    const files = []; // { ...entry, category, subcategory }

    await Promise.all(
      catDirs.map(async (cat) => {
        const inCat = await list(cat.path);
        tree[cat.name] = inCat.filter((e) => e.type === 'dir').map((e) => e.name).sort();
        // 대카테고리 직속 .md 는 중카테고리 없음으로 취급
        for (const f of inCat.filter(isMd)) {
          files.push({ ...f, category: cat.name, subcategory: '' });
        }
        await Promise.all(
          inCat
            .filter((e) => e.type === 'dir')
            .map(async (sub) => {
              const inSub = await list(sub.path);
              for (const f of inSub.filter(isMd)) {
                files.push({ ...f, category: cat.name, subcategory: sub.name });
              }
            })
        );
      })
    );

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
          category: f.category,
          subcategory: f.subcategory,
          status: normalizeStatus(meta.status),
          summary,
          updatedAt: commits[0]?.commit?.committer?.date || null,
        };
      })
    );

    cards.sort((a, b) => a.name.localeCompare(b.name));
    return json({ tree, cards });
  } catch (e) {
    const status = e instanceof GhError ? 502 : 500;
    return json({ error: String(e.message || e) }, status);
  }
}
