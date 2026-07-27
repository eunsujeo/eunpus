// 보드 단일 HTML 내보내기 조립 — 앱의 "HTML ↓" 버튼과 scripts/export-board.mjs 가 공용.
// 앱 UI 파일들을 인라인하고, fetch 를 내장 데이터로 가로채는 shim 을 심는다 (읽기 전용).
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
    .replace('<script src="vendor/mermaid.min.js"></script>', () => `<script>${inlineJs(mermaid)}</script>`)
    .replace('<script src="md.js"></script>', () => `<script>${inlineJs(md)}</script>`)
    .replace('<script src="theme.js"></script>', () => `<script>${inlineJs(theme)}</script>`)
    .replace('<script src="app.js"></script>', () => `${shim}\n<script>${staticApp}</script>`);

  for (const left of ['href="styles.css"', 'src="vendor/mermaid.min.js"', 'src="md.js"', 'src="theme.js"', 'src="app.js"']) {
    if (out.includes(left)) throw new Error(`인라인 실패 — index.html 의 ${left} 태그 확인`);
  }
  return out;
}
