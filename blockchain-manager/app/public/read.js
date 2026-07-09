'use strict';

/* 공유용 읽기 페이지 — read.html?cat=<대카테고리>&sub=<중카테고리>
   완료된 카테고리의 문서를 순서대로 이어 읽는 단일 페이지. 보드 없이 이 URL 만 공유한다. */

const { esc, renderMarkdown } = window.MD;

const params = new URLSearchParams(location.search);
const cat = params.get('cat');
const sub = params.get('sub') || '';

const titleTop = document.getElementById('read-title-top');
const headingEl = document.getElementById('read-heading');
const subEl = document.getElementById('read-sub');
const tocEl = document.getElementById('read-toc');
const bodyEl = document.getElementById('read-body');

async function load() {
  window.MD.initMermaid();

  if (!cat) {
    bodyEl.innerHTML = '<p class="muted">cat 파라미터가 없습니다 — read?cat=&lt;대카테고리&gt;&amp;sub=&lt;중카테고리&gt;</p>';
    return;
  }

  const heading = sub || cat;
  document.title = `${heading} — 블록체인매니저`;
  titleTop.textContent = heading;
  headingEl.textContent = heading;
  subEl.textContent = sub ? cat : '';

  bodyEl.innerHTML = '<p class="muted">불러오는 중…</p>';
  try {
    const board = await fetch('/api/board').then((r) => r.json());
    const cards = (board.cards || [])
      .filter((c) => c.category === cat && (c.subcategory || '') === sub)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!cards.length) {
      bodyEl.innerHTML = '<p class="muted">이 카테고리에 문서가 없습니다.</p>';
      return;
    }

    // 문서 병렬 로드 (순서는 cards 순서대로 보존)
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
      const html =
        data && data.body ? renderMarkdown(data.body) : '<p class="muted">불러오기 실패</p>';
      sections.push(
        `<section class="read-chapter"><h1 id="${anchor}" class="read-ch-title">${esc(title)}</h1>${html}</section>`
      );
    });

    tocEl.innerHTML = `<ol>${toc.join('')}</ol>`;
    bodyEl.innerHTML = sections.join('\n');

    await window.MD.runMermaid('#read-body .mermaid');
    window.MD.enhanceDiagrams(bodyEl);
  } catch (e) {
    bodyEl.innerHTML = `<p class="muted">불러오기 실패: ${esc(e.message)}</p>`;
  }
}

load();
