import {
  json,
  normalizeStatus,
  readState,
  generatedAssetUrl,
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

// docs/<대카테고리>/<중카테고리>/*.md — 폴더가 카테고리의 source of truth
export async function onRequestGet({ request, env }) {
  try {
    let base = null;

    if (env.LOCAL_DOCS_URL) {
      // 로컬 모드: 사이드카가 파일시스템에서 읽은 board 를 쓴다 (GitHub·SHA 캐시 건너뜀 → push 불필요)
      const r = await fetch(`${env.LOCAL_DOCS_URL}/board`);
      if (!r.ok) throw new Error(`local-docs ${r.status}`);
      base = await r.json();
    } else {
      const asset = await env.ASSETS.fetch(generatedAssetUrl(request, '/_generated/board-base.json'));
      if (!asset.ok) throw new Error(`정적 board 자산 ${asset.status}`);
      base = await asset.json();
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
        group: c.group || '',
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
    return json({ error: String(e.message || e) }, 500);
  }
}
