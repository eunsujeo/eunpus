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

let tree = {};   // { 대카테고리: [중카테고리...] }
let cards = [];
let nav = { cat: null, sub: null }; // 현재 위치
let toastTimer = null;

/* ---------- utils ---------- */

function fmtDate(iso) {
  if (!iso) return '';
  return iso.slice(0, 10);
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

window.addEventListener('popstate', () => { readURL(); render(); });

function renderCrumbs() {
  const parts = [`<button type="button" class="crumb" data-cat="" data-sub="">홈</button>`];
  if (nav.cat) parts.push(`<button type="button" class="crumb" data-cat="${esc(nav.cat)}" data-sub="">${esc(nav.cat)}</button>`);
  if (nav.sub) parts.push(`<span class="crumb current">${esc(nav.sub)}</span>`);
  crumbs.innerHTML = parts.join('<span class="crumb-sep">›</span>');
  crumbs.querySelectorAll('button.crumb').forEach((b) =>
    b.addEventListener('click', () => goTo(b.dataset.cat || null, null))
  );
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

function tile(label, metaText, onClick) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'cat-tile';
  el.innerHTML = `<span class="cat-tile-name">${esc(label)}</span><span class="cat-tile-meta">${esc(metaText)}</span>`;
  el.addEventListener('click', onClick);
  return el;
}

function renderHome() {
  view.className = 'view cat-grid';
  const cats = Object.keys(tree).sort();
  if (!cats.length) {
    view.innerHTML = '<div class="board-status">카테고리가 없습니다.</div>';
    return;
  }
  for (const cat of cats) {
    const n = cards.filter((c) => c.category === cat).length;
    const subs = tree[cat].length;
    view.appendChild(tile(cat, `${subs}개 분류 · 문서 ${n}건`, () => goTo(cat, null)));
  }
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
  for (const sub of subs) {
    const n = cards.filter((c) => c.category === nav.cat && c.subcategory === sub).length;
    view.appendChild(tile(sub, `문서 ${n}건`, () => goTo(nav.cat, sub)));
  }
  boardMeta.textContent = `문서 ${cards.filter((c) => c.category === nav.cat).length}건`;
}

function boardCards() {
  return cards.filter((c) => c.category === nav.cat && c.subcategory === nav.sub);
}

function renderBoard() {
  view.className = 'view board';
  const items = boardCards();

  for (const status of STATUSES) {
    const col = document.createElement('section');
    col.className = 'column';
    col.dataset.status = status;

    const inCol = items.filter((c) => c.status === status);
    col.innerHTML = `
      <div class="column-head">
        <span class="column-dot"></span>
        <span class="column-title">${esc(status)}</span>
        <span class="column-count">${inCol.length}</span>
      </div>
      <div class="column-body"></div>`;

    const bodyEl = col.querySelector('.column-body');
    for (const c of inCol) bodyEl.appendChild(cardEl(c));

    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });
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

function cardEl(c) {
  const el = document.createElement('article');
  el.className = 'card';
  el.draggable = true;
  el.dataset.path = c.path;
  el.innerHTML = `
    <h3 class="card-title">${esc(c.title)}</h3>
    <p class="card-summary">${esc(c.summary.join(' '))}</p>
    <div class="card-foot">
      ${c.subcategory ? `<span class="card-badge">${esc(c.subcategory)}</span>` : ''}
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
    showToast(`"${card.title}" → ${nextStatus} 커밋 완료`);
  } catch (e) {
    card.status = prevStatus; // 실패 시 원위치
    render();
    showToast(`이동 실패: ${e.message}`, true);
  }
}

let currentDoc = null; // 복사·다운로드·새창용 { name, path, raw }

async function openPreview(c) {
  modalTitle.textContent = c.title;
  modalChips.innerHTML = '';
  modalBody.innerHTML = '<p style="color:var(--muted)">불러오는 중…</p>';
  modal.classList.remove('hidden');
  currentDoc = null;

  try {
    const data = await api(`/api/doc?path=${encodeURIComponent(c.path)}`);
    const m = data.meta || {};
    currentDoc = { name: c.name, path: c.path, raw: data.raw || data.body };
    modalChips.innerHTML = [
      m.status ? `<span class="chip status">${esc(m.status)}</span>` : '',
      m.category ? `<span class="chip">${esc(m.category)}</span>` : '',
      m.subcategory ? `<span class="chip">${esc(m.subcategory)}</span>` : '',
    ].join('');
    modalBody.innerHTML = renderMarkdown(data.body);
    await window.MD.runMermaid('#modal-body .mermaid');
    window.MD.enhanceDiagrams(modalBody);
  } catch (e) {
    modalBody.innerHTML = `<p style="color:var(--danger)">미리보기 실패: ${esc(e.message)}</p>`;
  }
}

/* ---------- wiring ---------- */

window.MD.initMermaid();

const goHome = () => goTo(null, null);
document.getElementById('brand-home').addEventListener('click', goHome);
document.getElementById('brand-home').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') goHome();
});

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
  if (e.key === 'Escape') modal.classList.add('hidden');
});
document.getElementById('refresh-btn').addEventListener('click', loadBoard);

loadBoard();
