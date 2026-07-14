'use strict';

/* 공용: 마크다운 렌더러 + mermaid + 다이어그램 뷰어 (board / doc 페이지 공용) */

window.MD = (() => {
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderMarkdown(md, opts = {}) {
    const docBase = opts.docBase || ''; // 현재 문서의 폴더 경로 — 상대 .md 링크를 doc 페이지 링크로 푼다
    const lines = md.split(/\r?\n/);
    const out = [];
    let inCode = false;
    let codeLang = '';
    let codeBuf = [];
    let listTag = null;
    let tableRows = null;

    const closeList = () => {
      if (listTag) { out.push(`</${listTag}>`); listTag = null; }
    };

    const splitRow = (line) =>
      line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

    const flushTable = () => {
      if (!tableRows) return;
      const rows = tableRows;
      tableRows = null;
      if (!rows.length) return;
      const sepIdx = rows.findIndex((r) => r.every((c) => /^:?-{2,}:?$/.test(c)));
      const head = sepIdx > 0 ? rows[0] : null;
      const body = sepIdx > 0 ? rows.slice(sepIdx + 1) : rows;
      let html = '<table>';
      if (head) html += '<thead><tr>' + head.map((c) => `<th>${c}</th>`).join('') + '</tr></thead>';
      html += '<tbody>' + body.map((r) => '<tr>' + r.map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
      out.push(html);
    };

    const inline = (s) =>
      esc(s)
        .replace(/&lt;br\s*\/?&gt;/gi, '<br>') // 표 셀 줄바꿈용 <br/> 만 허용
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
          if (/^https?:\/\//.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${t}</a>`;
          // 문서로의 상대 링크(같은 폴더 · ../ 상위 경유, #절 앵커 허용) — 새창으로 doc 페이지를 연다
          const rel = /^([^#:]+\.md)(#.+)?$/.exec(href);
          if (docBase && rel && !href.startsWith('/')) {
            const stack = [];
            for (const seg of `${docBase}/${rel[1]}`.split('/')) {
              if (seg === '..') stack.pop();
              else if (seg && seg !== '.') stack.push(seg);
            }
            return `<a href="doc?path=${encodeURIComponent(stack.join('/'))}${rel[2] || ''}" target="_blank" rel="noopener">${t}</a>`;
          }
          return t;
        });

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        closeList();
        flushTable();
        if (!inCode) {
          codeLang = line.trim().slice(3).trim().toLowerCase();
          codeBuf = [];
          inCode = true;
        } else {
          if (codeLang === 'mermaid') {
            out.push(`<div class="mermaid">${esc(codeBuf.join('\n'))}</div>`);
          } else {
            out.push('<pre><code>' + codeBuf.map(esc).join('\n') + '</code></pre>');
          }
          inCode = false;
        }
        continue;
      }
      if (inCode) { codeBuf.push(line); continue; }

      if (/^\s*\|.*\|\s*$/.test(line)) {
        closeList();
        if (!tableRows) tableRows = [];
        tableRows.push(splitRow(line).map((c) => inline(c)));
        continue;
      }
      flushTable();

      const h = /^(#{1,6})\s+(.*)$/.exec(line);
      if (h) {
        closeList();
        // 제목에 앵커 id — 다른 문서에서 파일.md#절-제목 으로 바로 이동할 수 있게
        const id = h[2].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
        out.push(`<h${h[1].length} id="${id}">${inline(h[2])}</h${h[1].length}>`);
        continue;
      }

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
    flushTable();
    if (inCode) out.push('<pre><code>' + codeBuf.map(esc).join('\n') + '</code></pre>');
    return out.join('\n');
  }

  let mermaidReady = false;
  function initMermaid() {
    if (mermaidReady || !window.mermaid) return;
    // 다이어그램 원본이 밝은 파스텔 classDef 를 쓰므로 라이트 테마 + 밝은 패널에 렌더
    window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict' });
    mermaidReady = true;
  }

  async function runMermaid(selector) {
    if (!window.mermaid) return;
    initMermaid();
    await window.mermaid.run({ querySelector: selector }).catch(() => {});
  }

  /* 렌더된 .mermaid 마다 확대·이동·전체화면 컨트롤을 붙인다 */
  function enhanceDiagrams(root) {
    root.querySelectorAll('.mermaid').forEach((el) => {
      if (el.closest('.dviewer')) return;
      if (!el.querySelector('svg')) return; // 렌더 실패분은 코드 그대로 둠

      const viewer = document.createElement('div');
      viewer.className = 'dviewer';
      el.parentNode.insertBefore(viewer, el);
      const stage = document.createElement('div');
      stage.className = 'dviewer-stage';
      stage.appendChild(el);
      viewer.appendChild(stage);

      const bar = document.createElement('div');
      bar.className = 'dviewer-bar';
      bar.innerHTML =
        '<button type="button" data-act="out" title="축소">−</button>' +
        '<button type="button" data-act="in" title="확대">+</button>' +
        '<button type="button" data-act="reset" title="원래 크기">1:1</button>' +
        '<button type="button" data-act="full" title="전체화면">⛶</button>';
      viewer.appendChild(bar);

      let scale = 1, tx = 0, ty = 0;
      const apply = () => {
        el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        stage.classList.toggle('zoomed', scale !== 1 || tx !== 0 || ty !== 0);
      };
      el.style.transformOrigin = 'center center';

      const zoomAt = (factor) => {
        scale = Math.min(6, Math.max(0.4, scale * factor));
        apply();
      };

      bar.addEventListener('click', (e) => {
        const act = e.target.dataset && e.target.dataset.act;
        if (!act) return;
        if (act === 'in') zoomAt(1.25);
        else if (act === 'out') zoomAt(0.8);
        else if (act === 'reset') { scale = 1; tx = 0; ty = 0; apply(); }
        else if (act === 'full') {
          scale = 1; tx = 0; ty = 0; apply(); // 진입 시 초기화 — CSS 가 화면에 맞춰 키운다
          if (document.fullscreenElement === viewer) document.exitFullscreen();
          else viewer.requestFullscreen().catch(() => viewer.classList.toggle('fs-fallback'));
        }
      });

      // 드래그 이동
      let drag = null;
      stage.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        drag = { x: e.clientX, y: e.clientY, tx, ty };
        stage.setPointerCapture(e.pointerId);
        stage.classList.add('dragging');
      });
      stage.addEventListener('pointermove', (e) => {
        if (!drag) return;
        tx = drag.tx + (e.clientX - drag.x);
        ty = drag.ty + (e.clientY - drag.y);
        apply();
      });
      const endDrag = () => { drag = null; stage.classList.remove('dragging'); };
      stage.addEventListener('pointerup', endDrag);
      stage.addEventListener('pointercancel', endDrag);

      // 휠 확대 — 전체화면이거나 Ctrl/Cmd 누른 상태에서만 (문서 스크롤 보호)
      stage.addEventListener('wheel', (e) => {
        const fs = document.fullscreenElement === viewer || viewer.classList.contains('fs-fallback');
        if (!fs && !e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        zoomAt(e.deltaY < 0 ? 1.15 : 0.87);
      }, { passive: false });

      document.addEventListener('fullscreenchange', () => {
        viewer.classList.toggle('fs', document.fullscreenElement === viewer);
      });
    });
  }

  return { esc, renderMarkdown, initMermaid, runMermaid, enhanceDiagrams };
})();
