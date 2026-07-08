'use strict';

/* 문서 전용 페이지 — doc.html?path=<repo path> */

const { esc, renderMarkdown } = window.MD;

const titleTop = document.getElementById('doc-title-top');
const titleEl = document.getElementById('doc-title');
const chipsEl = document.getElementById('doc-chips');
const bodyEl = document.getElementById('doc-body');
const toast = document.getElementById('toast');

let currentDoc = null;
let toastTimer = null;

function showToast(msg, isError) {
  toast.textContent = msg;
  toast.classList.toggle('error', !!isError);
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
}

async function load() {
  window.MD.initMermaid();
  const path = new URLSearchParams(location.search).get('path');
  if (!path) {
    bodyEl.innerHTML = '<p style="color:var(--danger)">path 파라미터가 없습니다.</p>';
    return;
  }
  bodyEl.innerHTML = '<p style="color:var(--muted)">불러오는 중…</p>';
  try {
    const res = await fetch(`/api/doc?path=${encodeURIComponent(path)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    const m = data.meta || {};
    const title = m.title || path.split('/').pop();
    document.title = `${title} — 블록체인매니저`;
    titleTop.textContent = title;
    titleEl.textContent = title;
    chipsEl.innerHTML = [
      m.status ? `<span class="chip status">${esc(m.status)}</span>` : '',
      m.category ? `<span class="chip">${esc(m.category)}</span>` : '',
      m.subcategory ? `<span class="chip">${esc(m.subcategory)}</span>` : '',
    ].join('');

    currentDoc = { name: path.split('/').pop(), raw: data.raw || data.body };
    bodyEl.innerHTML = renderMarkdown(data.body);
    await window.MD.runMermaid('#doc-body .mermaid');
    window.MD.enhanceDiagrams(bodyEl);
  } catch (e) {
    bodyEl.innerHTML = `<p style="color:var(--danger)">불러오기 실패: ${esc(e.message)}</p>`;
  }
}

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

load();
