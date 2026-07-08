'use strict';

const STATUSES = ['To Do', 'In Progress', 'Done', '아카이브'];

const board = document.getElementById('board');
const boardMeta = document.getElementById('board-meta');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalChips = document.getElementById('modal-chips');
const modalBody = document.getElementById('modal-body');
const toast = document.getElementById('toast');

let cards = [];
let activeFilter = '전체';
let toastTimer = null;

/* ---------- utils ---------- */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

/* ---------- 간이 마크다운 렌더러 (미리보기용) ---------- */

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let listTag = null;

  const closeList = () => {
    if (listTag) { out.push(`</${listTag}>`); listTag = null; }
  };

  const inline = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) =>
        /^https?:\/\//.test(href)
          ? `<a href="${href}" target="_blank" rel="noopener">${t}</a>`
          : t
      );

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      closeList();
      out.push(inCode ? '</code></pre>' : '<pre><code>');
      inCode = !inCode;
      continue;
    }
    if (inCode) { out.push(esc(line)); continue; }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) { closeList(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }

    if (/^\s*[-*]\s+/.test(line)) {
      if (listTag !== 'ul') { closeList(); out.push('<ul>'); listTag = 'ul'; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listTag !== 'ol') { closeList(); out.push('<ol>'); listTag = 'ol'; }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      continue;
    }

    closeList();
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { out.push('<hr>'); continue; }
    if (/^>\s?/.test(line)) { out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); continue; }
    if (line.trim() === '') continue;
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  if (inCode) out.push('</code></pre>');
  return out.join('\n');
}

/* ---------- board rendering ---------- */

function renderFilters() {
  const filters = document.getElementById('filters');
  const subs = [...new Set(cards.map((c) => c.subcategory).filter(Boolean))].sort();
  filters.innerHTML = '';
  if (!subs.length) return;
  for (const label of ['전체', ...subs]) {
    const btn = document.createElement('button');
    btn.className = 'filter-chip' + (label === activeFilter ? ' active' : '');
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      activeFilter = label;
      render();
    });
    filters.appendChild(btn);
  }
}

function visibleCards() {
  return activeFilter === '전체'
    ? cards
    : cards.filter((c) => c.subcategory === activeFilter);
}

function render() {
  board.innerHTML = '';
  board.removeAttribute('aria-busy');
  renderFilters();

  for (const status of STATUSES) {
    const col = document.createElement('section');
    col.className = 'column';
    col.dataset.status = status;

    const items = visibleCards().filter((c) => c.status === status);
    col.innerHTML = `
      <div class="column-head">
        <span class="column-dot"></span>
        <span class="column-title">${esc(status)}</span>
        <span class="column-count">${items.length}</span>
      </div>
      <div class="column-body"></div>`;

    const bodyEl = col.querySelector('.column-body');
    for (const c of items) bodyEl.appendChild(cardEl(c));

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

    board.appendChild(col);
  }

  boardMeta.textContent = `문서 ${visibleCards().length}건`;
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
  board.setAttribute('aria-busy', 'true');
  board.innerHTML = '<div class="board-status">보드를 불러오는 중…</div>';
  try {
    const data = await api('/api/board');
    cards = data.cards;
    render();
  } catch (e) {
    board.innerHTML = `<div class="board-status error">불러오기 실패: ${esc(e.message)}</div>`;
  }
}

async function moveCard(path, nextStatus) {
  const card = cards.find((c) => c.path === path);
  if (!card || card.status === nextStatus) return;

  const prevStatus = card.status;
  card.status = nextStatus; // 낙관적 이동
  render();
  const el = board.querySelector(`.card[data-path="${CSS.escape(path)}"]`);
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

async function openPreview(c) {
  modalTitle.textContent = c.title;
  modalChips.innerHTML = '';
  modalBody.innerHTML = '<p style="color:var(--muted)">불러오는 중…</p>';
  modal.classList.remove('hidden');

  try {
    const data = await api(`/api/doc?path=${encodeURIComponent(c.path)}`);
    const m = data.meta || {};
    modalChips.innerHTML = [
      m.status ? `<span class="chip status">${esc(m.status)}</span>` : '',
      m.category ? `<span class="chip">${esc(m.category)}</span>` : '',
      m.subcategory ? `<span class="chip">${esc(m.subcategory)}</span>` : '',
    ].join('');
    modalBody.innerHTML = renderMarkdown(data.body);
  } catch (e) {
    modalBody.innerHTML = `<p style="color:var(--danger)">미리보기 실패: ${esc(e.message)}</p>`;
  }
}

/* ---------- wiring ---------- */

modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) modal.classList.add('hidden');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modal.classList.add('hidden');
});
document.getElementById('refresh-btn').addEventListener('click', loadBoard);

loadBoard();
