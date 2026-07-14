'use strict';

/* 문서 전용 페이지 — doc.html?path=<repo path> */

const { esc, renderMarkdown } = window.MD;

const titleTop = document.getElementById('doc-title-top');
const titleEl = document.getElementById('doc-title');
const chipsEl = document.getElementById('doc-chips');
const bodyEl = document.getElementById('doc-body');
const navEl = document.getElementById('doc-nav');
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

    // 복사·다운로드 = frontmatter 제거 + 제목을 H1 로 (title:/status: 가 텍스트로 새지 않게)
    currentDoc = { name: path.split('/').pop(), raw: `# ${title}\n\n${data.body}` };
    bodyEl.innerHTML = renderMarkdown(data.body, { docBase: path.split('/').slice(0, -1).join('/') });
    await window.MD.runMermaid('#doc-body .mermaid');
    window.MD.enhanceDiagrams(bodyEl);
    window.MD.enhanceSectionRefs(bodyEl, { docPath: path });
    renderNav(path);
    // doc?path=...#절-앵커 로 열렸으면 해당 절로 스크롤 (mermaid 렌더 후 — 높이 확정 뒤)
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  } catch (e) {
    bodyEl.innerHTML = `<p style="color:var(--danger)">불러오기 실패: ${esc(e.message)}</p>`;
  }
}

// 같은 중카테고리 형제 문서로 이전/다음 이동
async function renderNav(path) {
  try {
    const board = await fetch('/api/board').then((r) => r.json());
    const cards = board.cards || [];
    const cur = cards.find((c) => c.path === path);
    if (!cur) return;
    const sibs = cards
      .filter((c) => c.category === cur.category && c.subcategory === cur.subcategory)
      .sort((a, b) => a.name.localeCompare(b.name));
    const i = sibs.findIndex((c) => c.path === path);
    const prev = sibs[i - 1];
    const next = sibs[i + 1];
    const link = (c, dir, arrow) =>
      c
        ? `<a class="doc-nav-link ${dir}" href="doc?path=${encodeURIComponent(c.path)}"><span class="doc-nav-dir">${arrow}</span><span class="doc-nav-title">${esc(c.title)}</span></a>`
        : `<span class="doc-nav-link ${dir} empty"></span>`;
    navEl.innerHTML = link(prev, 'prev', '‹ 이전') + link(next, 'next', '다음 ›');
  } catch {
    /* 내비게이션은 보조 — 실패해도 본문은 그대로 */
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
