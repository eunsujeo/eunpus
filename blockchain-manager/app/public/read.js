'use strict';

/* 공유용 읽기 페이지 — read.html?cat=<대카테고리>&sub=<중카테고리>
   완료된 카테고리의 문서를 순서대로 이어 읽는 단일 페이지. 보드 없이 이 URL 만 공유한다.
   파라미터가 없으면 카테고리 목록(랜딩)을 보여준다. */

const { esc, renderMarkdown } = window.MD;

const params = new URLSearchParams(location.search);
const cat = params.get('cat');
const sub = params.get('sub') || '';

const titleTop = document.getElementById('read-title-top');
const headingEl = document.getElementById('read-heading');
const subEl = document.getElementById('read-sub');
const tocEl = document.getElementById('read-toc');
const bodyEl = document.getElementById('read-body');
const readPage = document.querySelector('.read-page');
const tocToggle = document.getElementById('toc-toggle');

async function load() {
  window.MD.initMermaid();
  if (!cat) {
    await renderLanding();
    return;
  }
  await renderCategory();
}

// 파라미터 없이 진입 — 읽을 수 있는 카테고리 목록
async function renderLanding() {
  document.title = '읽기 — 블록체인매니저';
  titleTop.textContent = '읽기';
  headingEl.textContent = '문서 읽기';
  subEl.textContent = '카테고리를 골라 순서대로 읽으세요.';
  tocEl.innerHTML = '';
  readPage.classList.remove('with-toc', 'toc-hidden');
  if (tocToggle) tocToggle.style.display = 'none';
  bodyEl.innerHTML = '<p class="muted">불러오는 중…</p>';
  try {
    const board = await fetch('/api/board').then((r) => r.json());
    const tree = board.tree || {};
    const cards = board.cards || [];
    const items = [];
    const push = (c, s) => {
      const inIt = cards.filter((x) => x.category === c && (x.subcategory || '') === s);
      if (inIt.length) items.push({ cat: c, sub: s, n: inIt.length, done: inIt.every((d) => d.status === 'Done') });
    };
    for (const c of Object.keys(tree)) {
      push(c, ''); // 대카테고리 직속 문서
      for (const s of tree[c] || []) push(c, s);
    }
    const shown = items.filter((it) => it.done); // 공유용 — 모두 Done 된 카테고리만 노출
    if (!shown.length) {
      bodyEl.innerHTML = '<p class="muted">아직 완료(모두 Done)된 카테고리가 없습니다.</p>';
      return;
    }
    bodyEl.innerHTML =
      '<ul class="read-index">' +
      shown
        .map((it) => {
          const label = it.sub ? `${it.cat} · ${it.sub}` : it.cat;
          const href = `read?cat=${encodeURIComponent(it.cat)}${it.sub ? `&sub=${encodeURIComponent(it.sub)}` : ''}`;
          return `<li><a href="${href}">${esc(label)} <span class="muted">(${it.n})</span></a><span class="read-done">완료</span></li>`;
        })
        .join('') +
      '</ul>';
  } catch (e) {
    bodyEl.innerHTML = `<p class="muted">불러오기 실패: ${esc(e.message)}</p>`;
  }
}

// cat(+sub) 지정 — 그 카테고리 문서를 순서대로 이어 렌더
async function renderCategory() {
  const heading = sub || cat;
  document.title = `${heading} — 블록체인매니저`;
  titleTop.textContent = heading;
  headingEl.textContent = heading;
  subEl.textContent = sub ? cat : '';

  tocEl.innerHTML = '';
  bodyEl.innerHTML = '<p class="muted">불러오는 중…</p>';
  try {
    const board = await fetch('/api/board').then((r) => r.json());
    const cards = (board.cards || [])
      .filter((c) => c.category === cat && (c.subcategory || '') === sub)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!cards.length) {
      bodyEl.innerHTML = '<p class="muted">이 카테고리에 문서가 없습니다. <a href="read">목록으로</a></p>';
      return;
    }

    const docs = await Promise.all(
      cards.map((c) =>
        fetch(`/api/doc?path=${encodeURIComponent(c.path)}`)
          .then((r) => r.json())
          .then((data) => ({ card: c, data }))
          .catch(() => ({ card: c, data: null }))
      )
    );

    const toc = [];
    const sections = [];
    docs.forEach(({ card, data }, i) => {
      const title = (data && data.meta && data.meta.title) || card.title || card.name;
      const anchor = `ch-${i}`;
      toc.push(`<li><a href="#${anchor}">${esc(title)}</a></li>`);
      const html = data && data.body ? renderMarkdown(data.body) : '<p class="muted">불러오기 실패</p>';
      sections.push(
        `<section class="read-chapter"><h1 id="${anchor}" class="read-ch-title">${esc(title)}</h1>${html}</section>`
      );
    });

    // 목차 — 제목에 이미 번호가 있으므로 자동 번호(ol) 대신 ul
    tocEl.innerHTML = `<ul>${toc.join('')}</ul>`;
    bodyEl.innerHTML = sections.join('\n');
    setupTocDrawer();

    await window.MD.runMermaid('#read-body .mermaid');
    window.MD.enhanceDiagrams(bodyEl);
  } catch (e) {
    bodyEl.innerHTML = `<p class="muted">불러오기 실패: ${esc(e.message)}</p>`;
  }
}

// 목차를 사이드 드로어로 — 토글로 슬라이드 인/아웃 (좁은 화면은 기본 닫힘)
function setupTocDrawer() {
  readPage.classList.add('with-toc');
  if (window.innerWidth < 900) readPage.classList.add('toc-hidden');
  if (tocToggle) {
    tocToggle.style.display = '';
    tocToggle.onclick = () => readPage.classList.toggle('toc-hidden');
  }
  tocEl.onclick = (e) => {
    if (e.target.tagName === 'A' && window.innerWidth < 900) readPage.classList.add('toc-hidden');
  };
  setupActiveToc();
}

// 현재 보고 있는 장을 목차에서 강조
function setupActiveToc() {
  const links = {};
  tocEl.querySelectorAll('a').forEach((a) => {
    links[a.getAttribute('href').slice(1)] = a;
  });
  const titles = document.querySelectorAll('.read-ch-title');
  if (!titles.length || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        Object.values(links).forEach((a) => a.classList.remove('active'));
        const a = links[en.target.id];
        if (a) a.classList.add('active');
      });
    },
    { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
  );
  titles.forEach((h) => obs.observe(h));
}

load();
