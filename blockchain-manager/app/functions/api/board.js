import {
  gh,
  ghRaw,
  ghGraphQL,
  json,
  GhError,
  encodePath,
  parseFrontmatter,
  normalizeStatus,
  requireEnv,
  readState,
  kvNs,
} from './_lib.js';

// order 배열 기준으로 정렬 — order 에 없는 항목은 뒤에 가나다순.
function byManifest(items, order) {
  const idx = (x) => {
    const i = (order || []).indexOf(x);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...items].sort((a, b) => {
    const d = idx(a) - idx(b);
    return d !== 0 ? d : a.localeCompare(b);
  });
}

async function headSha(env) {
  const branch = env.GITHUB_BRANCH || 'main';
  const r = await gh(
    env,
    `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/git/refs/heads/${encodeURIComponent(branch)}`
  );
  return r && r.object && r.object.sha;
}

// 비싼 부분: 디렉터리 트리 + 파일 내용/제목/요약/마지막 커밋일 (GitHub 대량 호출).
// 문서가 바뀔 때만(=커밋 SHA 변경) 다시 만들면 되므로 SHA 기준으로 KV 에 캐시한다.
async function buildBase(env) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  const docsPath = env.DOCS_PATH.replace(/\/+$/, '');

  const list = (path) =>
    gh(env, `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`)
      .then((r) => (Array.isArray(r) ? r : []));
  const isMd = (f) => f.type === 'file' && f.name.endsWith('.md');

  const [root, gitOrder] = await Promise.all([
    list(docsPath),
    ghRaw(env, `/repos/${owner}/${repo}/contents/${encodePath(docsPath + '/.board-order.json')}?ref=${encodeURIComponent(branch)}`)
      .then((t) => JSON.parse(t))
      .catch(() => null),
  ]);

  const treeDirs = {}; // { 대카테고리: [중카테고리...] } — 디렉터리 순서 그대로
  const files = [];

  await Promise.all(
    root
      .filter((e) => e.type === 'dir')
      .map(async (cat) => {
        const inCat = await list(cat.path);
        treeDirs[cat.name] = inCat.filter((e) => e.type === 'dir').map((e) => e.name);
        for (const f of inCat.filter(isMd)) files.push({ ...f, category: cat.name, subcategory: '' });
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

  // 파일 내용 + 마지막 커밋일을 20개씩 묶어 GraphQL 로 배치 조회 (subrequest 한도 보호).
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
          seedStatus: normalizeStatus(meta.status), // frontmatter 기본값 — 라이브 status 는 KV 오버레이
          view: meta.view || '', // 'doc' = 칸반 대신 원본 문서로 표시
          embed: meta.embed || '', // 앱 public/ 내 HTML — iframe 으로 원본 뷰어를 그대로 띄운다
          summary,
          updatedAt: node ? node.committedDate : null,
        };
      });
    })
  );

  return { treeDirs, cards: cardChunks.flat(), gitOrder };
}

// docs/<대카테고리>/<중카테고리>/*.md — 폴더가 카테고리의 source of truth
export async function onRequestGet({ env }) {
  try {
    const ns = kvNs(env);
    let base = null;

    if (env.LOCAL_DOCS_URL) {
      // 로컬 모드: 사이드카가 파일시스템에서 읽은 board 를 쓴다 (GitHub·SHA 캐시 건너뜀 → push 불필요)
      const r = await fetch(`${env.LOCAL_DOCS_URL}/board`);
      if (!r.ok) throw new Error(`local-docs ${r.status}`);
      base = await r.json();
    } else {
      const bad = requireEnv(env);
      if (bad) return bad;
      const sha = await headSha(env).catch(() => null);
      // SHA 캐시 히트면 GitHub 대량 호출을 건너뛴다. status·order 는 매 요청 KV 로 덧씌운다.
      if (ns && sha) base = await ns.get(`cache:base:v3:${sha}`, 'json').catch(() => null);
      if (!base) {
        base = await buildBase(env);
        if (ns && sha) {
          await ns.put(`cache:base:v3:${sha}`, JSON.stringify(base), { expirationTtl: 86400 }).catch(() => {});
        }
      }
    }

    const state = await readState(env);
    const order = state.order || base.gitOrder || { categories: [], subcategories: {} };
    const statuses = state.statuses || {};

    const cards = base.cards
      .map((c) => ({
        path: c.path,
        name: c.name,
        title: c.title,
        category: c.category,
        subcategory: c.subcategory,
        status: normalizeStatus(statuses[c.path] || c.seedStatus),
        view: c.view || '',
        embed: c.embed || '',
        summary: c.summary,
        updatedAt: c.updatedAt,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const tree = {};
    for (const cat of byManifest(Object.keys(base.treeDirs), order.categories)) {
      tree[cat] = byManifest(base.treeDirs[cat], order.subcategories && order.subcategories[cat]);
    }

    return json({ tree, cards });
  } catch (e) {
    const status = e instanceof GhError ? 502 : 500;
    return json({ error: String(e.message || e) }, status);
  }
}
