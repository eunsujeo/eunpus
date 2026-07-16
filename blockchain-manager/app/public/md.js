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
      // 스크롤 래퍼 — 표가 좁으면 100% 로 채우고, 넓으면 래퍼 안에서만 가로 스크롤
      let html = '<div class="table-wrap"><table>';
      if (head) html += '<thead><tr>' + head.map((c) => `<th>${c}</th>`).join('') + '</tr></thead>';
      html += '<tbody>' + body.map((r) => '<tr>' + r.map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
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
          // 앱 내부 링크(보드 뷰 등) — ?cat=…&sub=… 형식은 그대로 앵커로
          if (href.startsWith('?') || href.startsWith('/')) return `<a href="${href}" target="_blank" rel="noopener">${t}</a>`;
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

  /* ---------- 절 번호 참조 → 피크(peek) 모달 ----------
     본문 속 "7.1" · "A.1" · "8장" · "6·8장" · "부록 A" 텍스트를 눌러
     같은 폴더(중카테고리)의 해당 절/장을 작은 모달로 미리 본다. */

  const refState = { boardPromise: null, docCache: new Map() };

  function getCards() {
    if (!refState.boardPromise)
      refState.boardPromise = fetch('/api/board').then((r) => r.json()).then((b) => b.cards || []);
    return refState.boardPromise;
  }

  function getDoc(path) {
    if (!refState.docCache.has(path))
      refState.docCache.set(path, fetch(`/api/doc?path=${encodeURIComponent(path)}`).then((r) => r.json()));
    return refState.docCache.get(path);
  }

  function headingId(text) {
    return text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
  }

  function sliceSection(body, secId) {
    const lines = body.split(/\r?\n/);
    const re = new RegExp('^##\\s+' + secId.replace('.', '\\.') + '(?!\\d)');
    const s = lines.findIndex((l) => re.test(l));
    if (s < 0) return null;
    let e = lines.length;
    for (let i = s + 1; i < lines.length; i++) if (/^##\s/.test(lines[i])) { e = i; break; }
    return { heading: lines[s].replace(/^##\s+/, ''), md: lines.slice(s + 1, e).join('\n') };
  }

  // 제목이 prefix 로 시작하는 ## 절을 자른다 — 용어 참조(TERM_REFS)용
  function sliceHeading(body, prefix) {
    const lines = body.split(/\r?\n/);
    const s = lines.findIndex((l) => {
      const m = /^##\s+(.*)$/.exec(l);
      return m && m[1].startsWith(prefix);
    });
    if (s < 0) return null;
    let e = lines.length;
    for (let i = s + 1; i < lines.length; i++) if (/^##\s/.test(lines[i])) { e = i; break; }
    return { heading: lines[s].replace(/^##\s+/, ''), md: lines.slice(s + 1, e).join('\n') };
  }

  function ensurePeek() {
    let peek = document.getElementById('peek');
    if (peek) return peek;
    peek = document.createElement('div');
    peek.id = 'peek';
    peek.className = 'peek hidden';
    peek.innerHTML =
      '<div class="peek-backdrop" data-close></div>' +
      '<div class="peek-card">' +
      '  <div class="peek-head"><h3 id="peek-title"></h3><div class="peek-actions">' +
      '    <a id="peek-open" target="_blank" rel="noopener">문서 열기</a>' +
      '    <button class="modal-close" type="button" data-close aria-label="닫기">×</button></div></div>' +
      '  <article id="peek-body" class="doc-body"></article>' +
      '</div>';
    document.body.appendChild(peek);
    peek.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close')) peek.classList.add('hidden');
      // "문서 열기"로 원문을 열면 피크는 닫는다 — 정적 내보내기에선 원문이 아래 모달로 뜨므로 겹침 방지
      if (e.target.id === 'peek-open') peek.classList.add('hidden');
    });
    // Escape 는 아래 깔린 카드 모달보다 피크를 먼저 닫는다 (capture)
    document.addEventListener('keydown', (e) => {
      if (peek.classList.contains('hidden')) return;
      if (e.key === 'Escape') { peek.classList.add('hidden'); e.stopImmediatePropagation(); }
    }, true);
    return peek;
  }

  async function openRef(ref, ctx) {
    const peek = ensurePeek();
    const titleEl = peek.querySelector('#peek-title');
    const bodyEl = peek.querySelector('#peek-body');
    const openEl = peek.querySelector('#peek-open');
    peek.classList.remove('hidden');
    titleEl.textContent = ref.label;
    openEl.removeAttribute('href');
    bodyEl.innerHTML = '<p style="color:var(--muted)">불러오는 중…</p>';
    bodyEl.scrollTop = 0;
    try {
      const cards = await getCards();
      const folder = ctx.docPath.split('/').slice(0, -1).join('/');
      const sibs = cards.filter((c) => c.path.startsWith(folder + '/'));
      let target = null;
      if (ref.kind === 'term') target = cards.find((c) => c.path.endsWith('/' + ref.path));
      else if (ref.kind === 'appendix') target = sibs.find((c) => (c.title || '').includes(`부록 ${ref.letter}`));
      else target = sibs.find((c) => new RegExp('^' + ref.chapter + '\\.(?!\\d)').test(c.title || ''));
      if (!target && ref.kind === 'section' && /^A$/i.test(String(ref.chapter)))
        target = sibs.find((c) => (c.title || '').includes('부록 A'));
      if (!target) throw new Error(`${ref.label} 문서를 이 폴더에서 못 찾았습니다`);

      const data = await getDoc(target.path);
      if (data.error) throw new Error(data.error);
      const docBase = target.path.split('/').slice(0, -1).join('/');
      let md = data.body;
      let heading = (data.meta && data.meta.title) || target.title;
      let hash = '';
      if (ref.kind === 'section') {
        const slice = sliceSection(data.body, ref.sec);
        if (slice) { md = slice.md; heading = slice.heading; hash = '#' + headingId(slice.heading); }
      } else if (ref.kind === 'term') {
        const slice = sliceHeading(data.body, ref.heading);
        if (slice) { md = slice.md; heading = slice.heading; hash = '#' + headingId(slice.heading); }
      }
      titleEl.textContent = heading;
      openEl.href = `doc?path=${encodeURIComponent(target.path)}${hash}`;
      bodyEl.innerHTML = renderMarkdown(md, { docBase });
      await runMermaid('#peek-body .mermaid');
      enhanceDiagrams(bodyEl);
      enhanceSectionRefs(bodyEl, { docPath: target.path }); // 피크 안의 참조도 이어서 열 수 있게
    } catch (e) {
      bodyEl.innerHTML = `<p style="color:var(--danger)">미리보기 실패: ${esc(e.message)}</p>`;
    }
  }

  // 공통 어휘 용어 — 눌러서 정의 절을 피크로 본다. path 는 docs 루트 기준 접미 일치.
  const TERM_REFS = {
    TxStatus: { path: '블록체인매니저/설계/16-interface.md', heading: 'TxStatus' },
    TrVerdict: { path: '컴플라이언스/설계/01-interface.md', heading: 'Verdict 타입' },
  };

  // "6·8장" 사슬 · "N장" · "N.M" · "A.M" · "부록 A/B" · 용어(TERM_REFS) — 코드·링크·제목 밖 텍스트만 감싼다
  // "개념 (세트) N장"·"블록체인매니저 N장" 은 다른 문서 세트 참조라 제외 (같은 폴더에서만 푼다)
  const REF_RE = /(?<![\d.·])(?<!개념 )(?<!세트 )(?<!매니저 )(\d{1,2}(?:·\d{1,2})*장)|(?<![\d.])((?:\d{1,2}|A)\.\d{1,2})(?![.\d])|(부록 [AB])(?!\s*[—-])|\b(TxStatus|TrVerdict)\b/g;

  function refButton(label, ref) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sec-ref';
    b.textContent = label;
    b.__ref = ref;
    return b;
  }

  async function enhanceSectionRefs(root, ctx) {
    if (!ctx || !ctx.docPath) return;
    try { if (!(await getCards()).length) return; } catch { return; } // 정적 내보내기 등 API 없는 환경이면 그대로 둔다
    const SKIP = new Set(['A', 'CODE', 'PRE', 'BUTTON', 'SCRIPT', 'STYLE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        for (let el = n.parentElement; el && el !== root.parentElement; el = el.parentElement)
          if (SKIP.has(el.tagName) || el.classList.contains('mermaid')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);

    for (const node of nodes) {
      const text = node.nodeValue;
      REF_RE.lastIndex = 0;
      if (!REF_RE.test(text)) continue;
      REF_RE.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      while ((m = REF_RE.exec(text))) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        if (m[1]) {
          // "6·8장" — 숫자마다 버튼, 마지막에 "장"
          const nums = m[1].slice(0, -1).split('·');
          nums.forEach((num, i) => {
            const isLast = i === nums.length - 1;
            frag.appendChild(refButton(num + (isLast ? '장' : ''), { kind: 'chapter', chapter: num, label: `${num}장` }));
            if (!isLast) frag.appendChild(document.createTextNode('·'));
          });
        } else if (m[2]) {
          const [ch, sec] = [m[2].split('.')[0], m[2]];
          frag.appendChild(refButton(m[2], { kind: 'section', chapter: ch, sec, label: sec }));
        } else if (m[3]) {
          frag.appendChild(refButton(m[3], { kind: 'appendix', letter: m[3].slice(-1), label: m[3] }));
        } else if (m[4]) {
          const t = TERM_REFS[m[4]];
          frag.appendChild(refButton(m[4], { kind: 'term', path: t.path, heading: t.heading, label: m[4] }));
        }
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }

    root.__secRefCtx = ctx; // 같은 컨테이너로 다른 문서를 다시 열어도 현재 문서 기준으로 푼다
    if (!root.__secRefWired) {
      root.__secRefWired = true;
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('.sec-ref');
        if (btn && btn.__ref) openRef(btn.__ref, root.__secRefCtx);
      });
    }
  }

  return { esc, renderMarkdown, initMermaid, runMermaid, enhanceDiagrams, enhanceSectionRefs };
})();
