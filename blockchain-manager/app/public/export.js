// 보드 단일 HTML 내보내기 조립 — 앱의 "HTML ↓" 버튼과 scripts/export-board.mjs 가 공용.
// 앱 UI 파일들을 인라인하고, fetch 를 내장 데이터로 가로채는 shim 을 심는다 (읽기 전용).

// 내보내기는 공유용이라 frontmatter 에 `ref:` 가 붙은 참고 문서(판단 재료·심화)를 뺀다.
// 두 내보내기 경로가 같은 규칙을 쓰도록 여기 한 곳에만 둔다. 반환값 = 빠진 경로들.
const MD_LINK = /\[([^\]]+)\]\(([^)\s]+\.md)(#[^)]*)?\)/g;
const MERMAID_FENCE = /^```mermaid\s*\r?\n([\s\S]*?)\r?\n```\s*$/gim;

function mermaidBlocks(markdown) {
  return [...String(markdown || '').matchAll(MERMAID_FENCE)].map((m) => m[1].trim());
}

// 정적 HTML 은 업로드 환경에서 대용량 Mermaid 인라인 스크립트가 차단될 수 있다.
// 다운로드 전에 각 문서의 다이어그램을 SVG 로 확정해 두면 정적 파일에서는 Mermaid 런타임이 필요 없다.
// 문서별 배열인 이유: 같은 원본이 여러 번 나와도 SVG 내부 id 가 겹치지 않게 각 위치를 따로 렌더한다.
export async function preRenderMermaid(data, onProgress) {
  const jobs = [];
  for (const [path, doc] of Object.entries(data.docs || {})) {
    mermaidBlocks(doc.body).forEach((source, index) => jobs.push({ path, index, source }));
  }

  data.mermaidSvgs = {};
  data.mermaidPreRendered = true;
  if (!jobs.length) return { total: 0 };
  if (!globalThis.mermaid || typeof globalThis.mermaid.render !== 'function') {
    throw new Error('Mermaid SVG 생성기를 불러오지 못했습니다');
  }

  if (globalThis.MD && typeof globalThis.MD.initMermaid === 'function') globalThis.MD.initMermaid();
  for (let i = 0; i < jobs.length; i += 1) {
    const job = jobs[i];
    try {
      const fix = globalThis.MD && globalThis.MD.fixMermaidListLabels;
      const rendered = await globalThis.mermaid.render(`export-mermaid-${i + 1}`, fix ? fix(job.source) : job.source);
      if (!data.mermaidSvgs[job.path]) data.mermaidSvgs[job.path] = [];
      data.mermaidSvgs[job.path][job.index] = { source: job.source, svg: rendered.svg };
    } catch (error) {
      delete data.mermaidSvgs;
      data.mermaidPreRendered = false;
      throw new Error(`${job.path}의 Mermaid ${job.index + 1}번 SVG 생성 실패: ${error.message || error}`);
    }
    if (onProgress) onProgress(i + 1, jobs.length);
  }
  return { total: jobs.length };
}

// 카드에 문서 frontmatter 의 표시용 값을 옮긴다 — /api/board 는 이 값들을 담지 않는다.
export function attachCardMeta(data) {
  for (const c of data.board.cards) {
    const meta = (data.docs[c.path] || {}).meta || {};
    c.ref = meta.ref || '';
    c.group = meta.group || '';
  }
}

export function excludeRefDocs(data, withRef) {
  if (withRef) return [];
  const dropped = Object.keys(data.docs).filter((p) => (data.docs[p].meta || {}).ref);
  if (!dropped.length) return [];
  const droppedSet = new Set(dropped);

  data.board.cards = data.board.cards.filter((c) => !droppedSet.has(c.path));
  for (const p of dropped) delete data.docs[p];

  // 빠진 문서를 가리키던 링크는 죽은 링크가 되므로 라벨만 남긴 평문으로 바꾼다
  const strip = (text, ownPath) =>
    text.replace(MD_LINK, (whole, label, href) => {
      const segs = ownPath.split('/').slice(0, -1);
      for (const seg of href.split('/')) {
        if (seg === '..') segs.pop();
        else if (seg !== '.') segs.push(seg);
      }
      return droppedSet.has(segs.join('/')) ? label : whole;
    });

  for (const p of Object.keys(data.docs)) {
    const d = data.docs[p];
    if (d.body) d.body = strip(d.body, p);
    if (d.raw) d.raw = strip(d.raw, p);
  }
  return dropped;
}
export function assembleBoardHtml(assets, data) {
  const { html, css, mermaid, md, theme, app } = assets;

  // embed 뷰어는 data.embeds 에 HTML 원문이 내장된 것만 srcdoc 으로 띄운다 — 없으면 마크다운 뷰로 대체
  for (const c of data.board.cards) {
    if (c.embed && !(data.embeds && data.embeds[c.embed])) c.embed = '';
  }

  // <script> 안에 안전하게 넣는다 — 데이터의 < 를 전부 이스케이프
  const dataJs = JSON.stringify(data).replace(/</g, '\\u003c');
  const inlineJs = (s) => s.replace(/<\/script/gi, '<\\/script');

  const shim = `<script>
/* 정적 내보내기 shim — fetch 를 내장 데이터로 가로챈다 (읽기 전용) */
window.__STATIC_BOARD__ = ${dataJs};
(function () {
  var S = window.__STATIC_BOARD__;
  var realFetch = window.fetch.bind(window);
  function j(obj, status) {
    return Promise.resolve(new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  }
  window.fetch = function (url, init) {
    var u = String(url);
    if (u.indexOf('/api/board') === 0) return j(S.board);
    if (u.indexOf('/api/doc') === 0) {
      if (init && init.method && init.method !== 'GET') {
        return j({ error: '정적 내보내기 파일 — 상태 저장은 앱에서만 됩니다' }, 501);
      }
      var path = new URLSearchParams(u.split('?')[1]).get('path');
      return S.docs[path] ? j(S.docs[path]) : j({ error: 'not found' }, 404);
    }
    if (u.indexOf('/api/') === 0) return j({ error: '정적 내보내기 파일 — 저장 불가' }, 501);
    return realFetch(url, init);
  };
  // file:// 에서 pushState 가 막히는 브라우저 대비 — 실패해도 화면 전환은 계속
  var push = history.pushState.bind(history);
  history.pushState = function () { try { push.apply(null, arguments); } catch (e) {} };
  // 문서 간 상대 링크(doc?path=…)는 별도 페이지가 없으니 미리보기 모달로 연다
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="doc?"]');
    if (!a) return;
    e.preventDefault();
    e.stopImmediatePropagation(); // md.js 의 doc-link peek 핸들러가 겹쳐 뜨지 않게 (정적 파일은 카드 모달로만 연다)
    var path = new URLSearchParams(a.getAttribute('href').split('?')[1]).get('path');
    if (path) path = path.split('#')[0]; // 절 앵커가 붙은 링크(doc?path=…#절)도 경로만으로 연다
    if (window.__openDocByPath) window.__openDocByPath(path);
  }, true);
  // "새 창"·"HTML ↓" 버튼은 정적 파일에선 의미 없다 — 숨긴다
  ['open-page', 'export-html'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
})();
</${'script'}>`;

  // 정적 파일엔 export.js 가 없다(조립 전용). 인라인된 app.js 의 동적 import 참조를 없애
  // 업로드 검증기가 export.js 를 의존 파일로 오인하지 않게 한다 — 이 경로는 export 버튼(정적에선 숨김)에서만 쓰여 실행되지 않는다
  const staticApp = inlineJs(app).replace(
    /import\((['"])\.\/export\.js\1\)/g,
    'Promise.reject(new Error("export module unavailable in static export"))'
  );

  const out = html
    .replace('<link rel="stylesheet" href="styles.css" />', () => `<style>\n${css}\n</style>`)
    .replace(
      '<script src="vendor/mermaid.min.js"></script>',
      () => data.mermaidPreRendered ? '' : `<script>${inlineJs(mermaid)}</script>`
    )
    .replace('<script src="md.js"></script>', () => `<script>${inlineJs(md)}</script>`)
    .replace('<script src="theme.js"></script>', () => `<script>${inlineJs(theme)}</script>`)
    .replace('<script src="app.js"></script>', () => `${shim}\n<script>${staticApp}</script>`);

  for (const left of ['href="styles.css"', 'src="vendor/mermaid.min.js"', 'src="md.js"', 'src="theme.js"', 'src="app.js"']) {
    if (out.includes(left)) throw new Error(`인라인 실패 — index.html 의 ${left} 태그 확인`);
  }
  return out;
}
