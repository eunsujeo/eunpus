import {
  gh,
  ghGraphQL,
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

    // 파일 내용·마지막 커밋일을 GraphQL 로 배치 조회한다.
    // 파일마다 REST 2회(내용+커밋)를 돌리면 subrequest 한도(무료 50)를 넘으므로,
    // 20개씩 묶어 chunk 당 1회 GraphQL 로 내려받는다.
    const CHUNK = 20;
    const chunks = [];
    for (let i = 0; i < files.length; i += CHUNK) chunks.push(files.slice(i, i + CHUNK));

    const cardChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const blobs = chunk
          .map((f, i) => `b${i}: object(expression: ${JSON.stringify(`${branch}:${f.path}`)}) { ... on Blob { text } }`)
          .join('\n');
        const hist = chunk
          .map((f, i) => `h${i}: history(first: 1, path: ${JSON.stringify(f.path)}) { nodes { committedDate } }`)
          .join('\n');
        const query = `query {
  repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(repo)}) {
    ${blobs}
    ref(qualifiedName: ${JSON.stringify(`refs/heads/${branch}`)}) {
      target { ... on Commit { ${hist} } }
    }
  }
}`;
        const data = await ghGraphQL(env, query);
        const r = data.repository || {};
        const commit = r.ref && r.ref.target ? r.ref.target : {};

        return chunk.map((f, i) => {
          const raw = (r[`b${i}`] && r[`b${i}`].text) || '';
          const { meta, body } = parseFrontmatter(raw);
          const summary = body
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter((s) => s && !s.startsWith('#'))
            .slice(0, 2);
          const node = commit[`h${i}`] && commit[`h${i}`].nodes && commit[`h${i}`].nodes[0];
          return {
            path: f.path,
            name: f.name,
            title: meta.title || f.name.replace(/\.md$/, ''),
            category: f.category,
            subcategory: f.subcategory,
            status: normalizeStatus(meta.status),
            summary,
            updatedAt: node ? node.committedDate : null,
          };
        });
      })
    );

    const cards = cardChunks.flat();
    cards.sort((a, b) => a.name.localeCompare(b.name));
    return json({ tree, cards });
  } catch (e) {
    const status = e instanceof GhError ? 502 : 500;
    return json({ error: String(e.message || e) }, status);
  }
}
