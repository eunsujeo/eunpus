'use strict';

const { esc, renderMarkdown } = window.MD;

const STATUSES = ['To Do', 'In Progress', 'Done', '아카이브'];

const view = document.getElementById('view');
const crumbs = document.getElementById('crumbs');
const boardMeta = document.getElementById('board-meta');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalChips = document.getElementById('modal-chips');
const modalBody = document.getElementById('modal-body');
const toast = document.getElementById('toast');

let tree = {};       // { 대카테고리: [중카테고리...] } — 서버 순서 유지
let catOrder = [];   // 대카테고리 순서 (Object.keys(tree) 미러)
let cards = [];
let nav = { cat: null, sub: null };
let toastTimer = null;

/* ---------- utils ---------- */

function fmtDate(iso) {
  return iso ? iso.slice(0, 10) : '';
}

function showToast(msg, isError) {
  toast.textContent = msg;
  toast.classList.toggle('error', !!isError);
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
}

async function api(url, init) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

/* ---------- navigation ---------- */

function goTo(cat, sub, push = true) {
  nav = { cat: cat || null, sub: sub || null };
  if (push) {
    const q = new URLSearchParams();
    if (nav.cat) q.set('cat', nav.cat);
    if (nav.sub) q.set('sub', nav.sub);
    history.pushState(nav, '', q.toString() ? `?${q}` : location.pathname);
  }
  render();
}

function readURL() {
  const q = new URLSearchParams(location.search);
  nav = { cat: q.get('cat') || null, sub: q.get('sub') || null };
}

window.addEventListener('popstate', () => {
  // 해시(#절)만 바뀌어도 popstate 가 온다 — 위치(cat/sub)가 실제로 바뀔 때만 다시 그린다
  // (문서 뷰에서 목차 이동 때 화면이 초기화되는 것 방지)
  const prev = nav;
  readURL();
  if (nav.cat !== prev.cat || nav.sub !== prev.sub) render();
});

function renderCrumbs() {
  const parts = [`<button type="button" class="crumb" data-cat="" data-sub="">홈</button>`];
  if (nav.cat) parts.push(`<button type="button" class="crumb" data-cat="${esc(nav.cat)}" data-sub="">${esc(nav.cat)}</button>`);
  if (nav.sub) parts.push(`<span class="crumb current">${esc(nav.sub)}</span>`);
  crumbs.innerHTML = parts.join('<span class="crumb-sep">›</span>');
  crumbs.querySelectorAll('button.crumb').forEach((b) =>
    b.addEventListener('click', () => goTo(b.dataset.cat || null, null))
  );
}

/* ---------- reorderable tiles (드래그로 순서 변경) ---------- */

// 드래그하는 동안 다른 타일이 실시간으로 비켜나는 sortable.
// 놓는 순간의 DOM 순서를 읽어 확정한다.
function makeReorderable(container, itemEls, arr, onReorder) {
  let dragEl = null;
  itemEls.forEach((el) => {
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      dragEl = el;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', el.dataset.key || '');
      // 브라우저가 dragstart 직후 스냅샷을 뜨므로, 클래스는 다음 틱에 붙인다
      setTimeout(() => el.classList.add('dragging'), 0);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      dragEl = null;
      const next = [...container.querySelectorAll('.cat-tile')].map((t) => t.dataset.key);
      if (next.length === arr.length && next.some((k, i) => k !== arr[i])) onReorder(next);
    });
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!dragEl || dragEl === el) return;
      const r = el.getBoundingClientRect();
      const before = e.clientX < r.left + r.width / 2;
      container.insertBefore(dragEl, before ? el : el.nextSibling);
    });
  });
  // 빈 공간(맨 끝)에 떨어뜨리면 마지막으로
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (dragEl && e.target === container) container.appendChild(dragEl);
  });
}

async function persistOrder() {
  try {
    await api('/api/order', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: catOrder, subcategories: tree }),
    });
    showToast('순서 저장됨');
  } catch (e) {
    showToast(`순서 저장 실패: ${e.message}`, true);
  }
}

/* ---------- views ---------- */

function render() {
  view.innerHTML = '';
  view.removeAttribute('aria-busy');
  renderCrumbs();

  if (!nav.cat) renderHome();
  else if (!nav.sub) renderCatView();
  else renderBoard();
}

// 카드 묶음의 상태 분포 → 세그먼트 바 + 카운트 라벨
function statusSummary(subset) {
  const slug = { 'To Do': 'todo', 'In Progress': 'prog', 'Done': 'done', '아카이브': 'arch' };
  const counts = { 'To Do': 0, 'In Progress': 0, 'Done': 0, '아카이브': 0 };
  // view: doc 원본 문서는 워크플로우 상태가 없다 — 집계에서 제외
  for (const c of subset) {
    if (c.view === 'doc') continue;
    counts[c.status] = (counts[c.status] || 0) + 1;
  }
  const bar = STATUSES
    .filter((s) => counts[s] > 0)
    .map((s) => `<span class="seg seg-${slug[s]}" style="flex:${counts[s]}" title="${esc(s)} ${counts[s]}"></span>`)
    .join('');
  const label =
    `할일 ${counts['To Do']} · 진행 ${counts['In Progress']} · 완료 ${counts['Done']}` +
    (counts['아카이브'] ? ` · 보관 ${counts['아카이브']}` : '');
  return { bar, label };
}

function tile(label, metaText, subset, onClick) {
  const el = document.createElement('div');
  el.className = 'cat-tile';
  el.dataset.key = label;
  el.setAttribute('role', 'button');
  el.tabIndex = 0;
  const { bar, label: counts } = statusSummary(subset);
  const allDoc = subset.length > 0 && subset.every((c) => c.view === 'doc'); // 상태 없는 원본 문서 분류
  el.innerHTML =
    `<span class="cat-tile-name">${esc(label)}</span>` +
    `<span class="cat-tile-meta">${esc(metaText)}</span>` +
    (subset.length
      ? allDoc
        ? '<span class="cat-tile-counts">원본 문서</span>'
        : `<div class="cat-tile-bar">${bar}</div><span class="cat-tile-counts">${esc(counts)}</span>`
      : '<span class="cat-tile-counts">문서 없음</span>') +
    `<span class="cat-tile-grip" title="드래그로 순서 변경">⠿</span>`;
  el.addEventListener('click', onClick);
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') onClick(); });
  return el;
}

function renderHome() {
  view.className = 'view cat-grid';
  if (!catOrder.length) {
    view.innerHTML = '<div class="board-status">카테고리가 없습니다.</div>';
    boardMeta.textContent = '';
    return;
  }
  const els = catOrder.map((cat) => {
    const subset = cards.filter((c) => c.category === cat);
    return tile(cat, `${tree[cat].length}개 분류 · 문서 ${subset.length}건`, subset, () => goTo(cat, null));
  });
  els.forEach((el) => view.appendChild(el));
  makeReorderable(view, els, catOrder, (next) => { catOrder = next; persistOrder(); render(); });
  boardMeta.textContent = `문서 ${cards.length}건`;
}

function renderCatView() {
  view.className = 'view cat-grid';
  const subs = tree[nav.cat] || [];
  if (!subs.length) {
    view.innerHTML = `<div class="board-status">"${esc(nav.cat)}" 에 아직 분류가 없습니다 — docs/${esc(nav.cat)}/&lt;분류&gt;/ 폴더를 만들면 나타납니다.</div>`;
    boardMeta.textContent = '';
    return;
  }
  const els = subs.map((sub) => {
    const subset = cards.filter((c) => c.category === nav.cat && c.subcategory === sub);
    return tile(sub, `문서 ${subset.length}건`, subset, () => goTo(nav.cat, sub));
  });
  els.forEach((el) => view.appendChild(el));
  makeReorderable(view, els, subs, (next) => { tree[nav.cat] = next; persistOrder(); render(); });
  boardMeta.textContent = `문서 ${cards.filter((c) => c.category === nav.cat).length}건`;
}

function boardCards() {
  return cards
    .filter((c) => c.category === nav.cat && c.subcategory === nav.sub)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderBoard() {
  const items = boardCards();

  // view: doc 문서만 있는 분류는 칸반(4컬럼) 대신 원본 문서를 그대로 보여준다
  if (items.length && items.every((c) => c.view === 'doc')) {
    // embed 지정 문서 하나면 원본 뷰어(HTML)를 iframe 으로 그대로 띄운다
    if (items.length === 1 && items[0].embed) renderDocEmbed(items[0]);
    else renderDocView(items);
    return;
  }

  view.className = 'view board';

  for (const status of STATUSES) {
    const col = document.createElement('section');
    col.className = 'column';
    col.dataset.status = status;

    const inCol = items.filter((c) => c.status === status);
    col.innerHTML = `
      <div class="column-head">
        <span class="column-title">${esc(status)}</span>
        <span class="column-count">${inCol.length}</span>
      </div>
      <div class="column-body"></div>`;

    const bodyEl = col.querySelector('.column-body');
    for (const c of inCol) bodyEl.appendChild(cardEl(c));

    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const path = e.dataTransfer.getData('text/plain');
      if (path) moveCard(path, status);
    });

    view.appendChild(col);
  }

  boardMeta.textContent = `문서 ${items.length}건`;
}

// 원본 뷰어 embed — 앱 public/ 안의 자체 HTML 뷰어(예: api.html)를 iframe 으로 그대로 띄운다.
// 앱 테마(data-theme)를 iframe 문서에 따라 붙여 토글에도 같이 바뀐다 (같은 출처라 접근 가능).
let embedThemeObserver = null;
function renderDocEmbed(c) {
  // 같은 출처의 상대 경로만 허용 (외부 URL·상위 경로 차단)
  if (!/^[\w][\w./-]*$/.test(c.embed) || c.embed.includes('..')) {
    renderDocView([c]);
    return;
  }
  view.className = 'view doc-embed';
  boardMeta.textContent = '문서 1건';

  const frame = document.createElement('iframe');
  frame.className = 'embed-frame';
  // 정적 내보내기 파일은 뷰어 HTML 이 내장돼 있다 — srcdoc 으로 띄운다 (파일 하나로 동작)
  const inlined =
    window.__STATIC_BOARD__ && window.__STATIC_BOARD__.embeds && window.__STATIC_BOARD__.embeds[c.embed];
  if (inlined) frame.srcdoc = inlined;
  else frame.src = c.embed;
  frame.title = c.title;

  const syncTheme = () => {
    try {
      frame.contentDocument.documentElement.setAttribute(
        'data-theme',
        document.documentElement.getAttribute('data-theme') || 'dark'
      );
    } catch { /* 로드 전이면 다음 이벤트에서 */ }
  };
  frame.addEventListener('load', () => {
    syncTheme();
    // srcdoc 문서는 base URL 을 부모(내보내기 파일)에서 물려받아, #앵커 클릭이
    // iframe 을 부모 페이지 전체로 이동시킨다 (상단 바가 겹으로 뜸) — 가로채서 스크롤만 한다
    if (!inlined) return;
    const doc = frame.contentDocument;
    if (!doc) return;
    doc.addEventListener('click', (e) => {
      if (e.defaultPrevented) return; // 뷰어 자체 핸들러(예: 스키마 모달)가 처리한 링크는 그대로
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const target = doc.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      if (target) target.scrollIntoView({ block: 'start' });
    });
  });
  if (embedThemeObserver) embedThemeObserver.disconnect();
  embedThemeObserver = new MutationObserver(syncTheme);
  embedThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  view.appendChild(frame);
}

// 원본 문서 뷰 — 상태 컬럼 없이 본문을 그대로 렌더 (doc.html 과 같은 지면) + 목차 사이드바
async function renderDocView(items) {
  view.className = 'view doc-view';
  boardMeta.textContent = `문서 ${items.length}건`;
  view.innerHTML =
    '<aside class="doc-side"><nav class="doc-side-nav"></nav></aside><div class="doc-col"></div>';
  const col = view.querySelector('.doc-col');

  const pages = items.map(() => {
    const page = document.createElement('article');
    page.className = 'doc-page';
    page.innerHTML = '<p style="color:var(--muted)">불러오는 중…</p>';
    col.appendChild(page);
    return page;
  });

  await Promise.all(items.map(async (c, i) => {
    try {
      const data = await api(`/api/doc?path=${encodeURIComponent(c.path)}`);
      pages[i].innerHTML =
        `<article class="doc-body">${renderMarkdown(data.body, { docBase: c.path.split('/').slice(0, -1).join('/') })}</article>`;
    } catch (e) {
      pages[i].innerHTML = `<p style="color:var(--danger)">불러오기 실패: ${esc(e.message)}</p>`;
    }
  }));

  // 다른 화면으로 이동했으면(view 가 갈렸으면) 렌더 마무리를 건너뛴다
  if (!pages[0].isConnected) return;
  buildDocSideNav(view.querySelector('.doc-side'), col);
  await window.MD.runMermaid('.doc-view .mermaid');
  window.MD.enhanceDiagrams(view);
}

// 본문 제목(h2–h4)으로 사이드바 목차를 만들고, 스크롤 위치를 따라 현재 절을 표시한다.
// 구조·스타일은 api-docs 뷰어의 사이드바(.nav-group / .nav-link / 메서드 배지)를 따른다.
function buildDocSideNav(side, col) {
  const navEl = side.querySelector('.doc-side-nav');
  const hs = [...col.querySelectorAll('h2, h3, h4')];
  if (!hs.length) {
    side.remove();
    return;
  }

  const seen = new Set();
  for (const h of hs) {
    let id = h.id || 'sec';
    while (seen.has(id)) id += '-';
    seen.add(id);
    h.id = id;
  }

  const lvl = (h) => Number(h.tagName[1]);
  const links = [];
  let group = null;
  const addGroup = (title) => {
    group = document.createElement('div');
    group.className = 'nav-group';
    const t = document.createElement('div');
    t.className = 'nav-title';
    t.textContent = title;
    group.appendChild(t);
    navEl.appendChild(group);
  };

  hs.forEach((h, i) => {
    const next = hs[i + 1];
    // 다음 제목이 한 단계 깊으면 이 제목은 묶음 라벨 (API → 태그 → 오퍼레이션)
    if (next && lvl(next) > lvl(h)) {
      addGroup(h.textContent);
      return;
    }
    if (!group) addGroup('개요');
    // 오퍼레이션 제목(GET https://…/v1/…)은 메서드 배지 + 경로로 — 서버 URL 은 생략
    const m = /^(GET|POST|PUT|PATCH|DELETE)\s+(.*)$/.exec(
      h.textContent.replace(/https?:\/\/[^\s/]+/, '').trim()
    );
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = `#${h.id}`;
    a.title = h.textContent;
    a.innerHTML = m
      ? `<span class="m m-${m[1].toLowerCase()}">${m[1]}</span><span class="label">${esc(m[2])}</span>`
      : `<span class="label">${esc(h.textContent)}</span>`;
    // URL 해시를 바꾸지 않고 스크롤만 — 해시 변경은 popstate 를 일으켜 재렌더될 수 있다 (file:// 포함)
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView();
    });
    group.appendChild(a);
    links.push([a, h]);
  });

  // 항목 없이 라벨만 남은 그룹 제거 (예: 태그 묶음을 다시 감싸는 "API" 상위 제목)
  for (const g of [...navEl.children]) {
    if (!g.querySelector('.nav-link')) g.remove();
  }

  const byId = new Map(links.map(([a, h]) => [h.id, a]));
  let active = null;
  const setActive = (id) => {
    const a = byId.get(id);
    if (!a || a === active) return;
    if (active) active.classList.remove('active');
    active = a;
    a.classList.add('active');
  };
  const obs = new IntersectionObserver(
    (entries) => {
      const vis = entries.filter((e) => e.isIntersecting);
      if (vis.length) setActive(vis[0].target.id);
    },
    { rootMargin: '-72px 0px -70% 0px' }
  );
  links.forEach(([, h]) => obs.observe(h));
}

function cardEl(c) {
  const el = document.createElement('article');
  el.className = 'card';
  el.draggable = true;
  el.dataset.path = c.path;
  el.innerHTML = `
    <h3 class="card-title">${esc(c.title)}</h3>
    <p class="card-summary">${esc(c.summary.join(' '))}</p>
    <div class="card-foot">
      <span class="card-date">${fmtDate(c.updatedAt)}</span>
    </div>`;

  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', c.path);
    e.dataTransfer.effectAllowed = 'move';
    el.classList.add('dragging');
  });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));
  el.addEventListener('click', () => openPreview(c));
  return el;
}

/* ---------- actions ---------- */

async function loadBoard() {
  view.setAttribute('aria-busy', 'true');
  view.className = 'view';
  view.innerHTML = '<div class="board-status">불러오는 중…</div>';
  try {
    const data = await api('/api/board');
    tree = data.tree || {};
    catOrder = Object.keys(tree);
    cards = data.cards || [];
    readURL();
    render();
  } catch (e) {
    view.innerHTML = `<div class="board-status error">불러오기 실패: ${esc(e.message)}</div>`;
  }
}

async function moveCard(path, nextStatus) {
  const card = cards.find((c) => c.path === path);
  if (!card || card.status === nextStatus) return;

  const prevStatus = card.status;
  card.status = nextStatus; // 낙관적 이동
  render();
  const el = view.querySelector(`.card[data-path="${CSS.escape(path)}"]`);
  if (el) el.classList.add('pending');

  try {
    const res = await api('/api/doc', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, status: nextStatus }),
    });
    if (res.updatedAt) card.updatedAt = res.updatedAt;
    render();
    showToast(`"${card.title}" → ${nextStatus} 저장됨`);
  } catch (e) {
    card.status = prevStatus; // 실패 시 원위치
    render();
    showToast(`이동 실패: ${e.message}`, true);
  }
}

/* ---------- 미리보기 모달 + 이전/다음 ---------- */

let currentDoc = null;   // 복사·다운로드·새창용 { name, path, raw }
let previewList = [];    // 같은 중카테고리 형제 카드 (순서대로)
let previewIdx = -1;

function openPreview(c) {
  // 형제 = 같은 대·중카테고리, 파일명 순
  previewList = cards
    .filter((x) => x.category === c.category && x.subcategory === c.subcategory)
    .sort((a, b) => a.name.localeCompare(b.name));
  previewIdx = previewList.findIndex((x) => x.path === c.path);
  modal.classList.remove('hidden');
  showPreviewAt(previewIdx);
}

async function showPreviewAt(idx) {
  if (idx < 0 || idx >= previewList.length) return;
  previewIdx = idx;
  const c = previewList[idx];
  modalTitle.textContent = c.title;
  modalChips.innerHTML = '';
  modalBody.innerHTML = '<p style="color:var(--muted)">불러오는 중…</p>';
  modalBody.scrollTop = 0;
  currentDoc = null;
  updatePrevNext();

  try {
    const data = await api(`/api/doc?path=${encodeURIComponent(c.path)}`);
    const m = data.meta || {};
    // 복사·다운로드 = frontmatter 제거 + 제목을 H1 로 (title:/status: 가 텍스트로 새지 않게)
    currentDoc = { name: c.name, path: c.path, raw: `# ${m.title || c.title || c.name}\n\n${data.body}` };
    modalChips.innerHTML = [
      m.status ? `<span class="chip status">${esc(m.status)}</span>` : '',
      m.category ? `<span class="chip">${esc(m.category)}</span>` : '',
      m.subcategory ? `<span class="chip">${esc(m.subcategory)}</span>` : '',
      previewList.length > 1 ? `<span class="chip">${idx + 1} / ${previewList.length}</span>` : '',
    ].join('');
    modalBody.innerHTML = renderMarkdown(data.body, { docBase: c.path.split('/').slice(0, -1).join('/') });
    await window.MD.runMermaid('#modal-body .mermaid');
    window.MD.enhanceDiagrams(modalBody);
  } catch (e) {
    modalBody.innerHTML = `<p style="color:var(--danger)">미리보기 실패: ${esc(e.message)}</p>`;
  }
}

// 정적 내보내기(export-board.mjs)에서 문서 간 링크(doc?path=…)를 모달로 열기 위한 훅
window.__openDocByPath = (path) => {
  const c = cards.find((x) => x.path === path);
  if (c) openPreview(c);
};

function updatePrevNext() {
  document.getElementById('prev-doc').disabled = previewIdx <= 0;
  document.getElementById('next-doc').disabled = previewIdx >= previewList.length - 1;
}

/* ---------- wiring ---------- */

window.MD.initMermaid();

const goHome = () => goTo(null, null);
document.getElementById('brand-home').addEventListener('click', goHome);
document.getElementById('brand-home').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') goHome();
});

document.getElementById('prev-doc').addEventListener('click', () => showPreviewAt(previewIdx - 1));
document.getElementById('next-doc').addEventListener('click', () => showPreviewAt(previewIdx + 1));

document.getElementById('open-page').addEventListener('click', () => {
  if (!currentDoc) return;
  window.open(`doc?path=${encodeURIComponent(currentDoc.path)}`, '_blank');
});

document.getElementById('copy-md').addEventListener('click', async () => {
  if (!currentDoc) return;
  try {
    await navigator.clipboard.writeText(currentDoc.raw);
    showToast('마크다운을 클립보드에 복사했습니다');
  } catch {
    showToast('복사 실패 — 브라우저 권한을 확인하세요', true);
  }
});

document.getElementById('download-md').addEventListener('click', () => {
  if (!currentDoc) return;
  const blob = new Blob([currentDoc.raw], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = currentDoc.name;
  a.click();
  URL.revokeObjectURL(a.href);
});

modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) modal.classList.add('hidden');
});
document.addEventListener('keydown', (e) => {
  if (modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') modal.classList.add('hidden');
  else if (e.key === 'ArrowLeft') showPreviewAt(previewIdx - 1);
  else if (e.key === 'ArrowRight') showPreviewAt(previewIdx + 1);
});
document.getElementById('refresh-btn').addEventListener('click', loadBoard);

// 보드 전체 → 단일 HTML 다운로드. 조립은 export.js (scripts/export-board.mjs 와 공용)
async function exportBoardHtml() {
  const btn = document.getElementById('export-html');
  btn.disabled = true;
  showToast('보드 내보내는 중…');
  try {
    const { assembleBoardHtml } = await import('./export.js');
    const [html, css, mermaid, md, theme, app] = await Promise.all(
      ['index.html', 'styles.css', 'vendor/mermaid.min.js', 'md.js', 'theme.js', 'app.js'].map((f) =>
        fetch(f).then((r) => {
          if (!r.ok) throw new Error(`${f} ${r.status}`);
          return r.text();
        })
      )
    );
    const board = await api('/api/board');
    const docs = {};
    const paths = board.cards.map((c) => c.path);
    const CHUNK = 8;
    for (let i = 0; i < paths.length; i += CHUNK) {
      await Promise.all(
        paths.slice(i, i + CHUNK).map(async (p) => {
          docs[p] = await api(`/api/doc?path=${encodeURIComponent(p)}`);
        })
      );
      showToast(`보드 내보내는 중… ${Math.min(i + CHUNK, paths.length)}/${paths.length}`);
    }
    // embed 뷰어(예: api.html)도 내장 — 정적 파일에서 원본 디자인 그대로 뜨게
    const embeds = {};
    for (const name of new Set(board.cards.map((c) => c.embed).filter(Boolean))) {
      const r = await fetch(name);
      if (r.ok) embeds[name] = await r.text();
    }
    const out = assembleBoardHtml({ html, css, mermaid, md, theme, app }, { board, docs, embeds });
    const blob = new Blob([out], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'board.html';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('board.html 저장됨 — 파일을 더블클릭으로 열면 됩니다');
  } catch (e) {
    showToast(`내보내기 실패: ${e.message}`, true);
  } finally {
    btn.disabled = false;
  }
}
document.getElementById('export-html').addEventListener('click', exportBoardHtml);

loadBoard();
