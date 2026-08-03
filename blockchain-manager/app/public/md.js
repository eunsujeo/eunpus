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
    const docLinksNewTab = opts.docLinksNewTab || false; // true 면 내부 .md 링크를 모달 대신 새 탭으로 (인덱스 문서용)
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
        // 용어 툴팁 — {{용어::풀이}} → 점선 밑줄 + hover 풀이. 풀이는 평문만 (마크다운 안 먹음)
        // 구분자가 :: 인 이유 — | 는 표 셀 구분자와 충돌해 표 안에서 셀이 갈라진다
        .replace(/\{\{([^{}]+?)::([^{}]+)\}\}/g, '<span class="term-tip" data-tip="$2">$1</span>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
          if (/^https?:\/\//.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${t}</a>`;
          // 앱 내부 링크(?cat=…&sub=…) — 새 탭 대신 그 자리 이동 (app.js 가 클릭을 가로챈다). 절대경로(/)는 새 탭.
          if (href.startsWith('?')) return `<a href="${href}">${t}</a>`;
          if (href.startsWith('/')) return `<a href="${href}" target="_blank" rel="noopener">${t}</a>`;
          // 문서로의 상대 링크(같은 폴더 · ../ 상위 경유, #절 앵커 허용)
          // — 클릭하면 모달(peek), Ctrl/Cmd·중클릭은 새 탭. API 없으면 href 로 폴백.
          const rel = /^([^#:]+\.md)(#.+)?$/.exec(href);
          if (docBase && rel && !href.startsWith('/')) {
            const stack = [];
            for (const seg of `${docBase}/${rel[1]}`.split('/')) {
              if (seg === '..') stack.pop();
              else if (seg && seg !== '.') stack.push(seg);
            }
            const p = stack.join('/');
            const h = rel[2] || '';
            if (docLinksNewTab) return `<a href="doc?path=${encodeURIComponent(p)}${h}" target="_blank" rel="noopener">${t}</a>`;
            return `<a href="doc?path=${encodeURIComponent(p)}${h}" class="doc-link" data-doc-path="${p}" data-doc-hash="${h}" target="_blank" rel="noopener">${t}</a>`;
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
          } else if (codeLang === 'anim') {
            // 단계 재생 애니메이션 — 펜스 본문 첫 줄이 애니메이션 이름 (mountAnims 가 마운트)
            out.push(`<div class="anim" data-anim="${esc(codeBuf.join('\n').trim())}"></div>`);
          } else if (codeLang === 'erd') {
            // 엔티티 카드 + SVG 관계선 (mountErds 가 마운트)
            out.push(`<div class="erd" data-erd="${esc(codeBuf.join('\n').trim())}"></div>`);
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
      const qa = /^\*\*([QA])\.\*\*\s/.exec(line);   // Q&A 문서 — 질문/답변 줄에 색 클래스
      if (qa) { out.push(`<p class="qa-${qa[1].toLowerCase()}">${inline(line)}</p>`); continue; }
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

  /* 렌더된 코드블록마다 복사 버튼을 붙인다 (mermaid 는 dviewer 가 담당) */
  function enhanceCodeCopy(root) {
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.closest('.code-wrap')) return;
      // pre 는 가로 스크롤 컨테이너라 버튼을 안에 두면 같이 밀려난다 — 래퍼에 고정
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = '복사';
      btn.title = '코드 복사';
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        try {
          await navigator.clipboard.writeText((code || pre).innerText.replace(/\n$/, ''));
          btn.textContent = '복사됨 ✓';
          btn.classList.add('copied');
        } catch {
          btn.textContent = '복사 실패';
        }
        setTimeout(() => { btn.textContent = '복사'; btn.classList.remove('copied'); }, 1600);
      });
      wrap.appendChild(btn);
    });
  }

  /* ---- 단계 재생 애니메이션 (```anim 코드펜스) ---- */

  // 공용 스텝 엔진 — 캡션·◀▶/재생 컨트롤·data-on/off 표시를 담당.
  // 각 애니메이션은 장면(scene HTML)과 단계별 값 채우기(render)만 정의한다.
  // data-on="N" = step ≥ N 에서 표시. data-off="M" 이 있으면 step ≥ M 에서 다시 숨김.
  function stepAnim(el, cfg) {
    el.className = 'banim';
    el.innerHTML =
      '<div class="banim-cap"><strong data-f="cap-t"></strong><span data-f="cap-d"></span></div>' +
      `<div class="banim-stage"><div class="banim-scene">${cfg.scene}</div></div>` +
      '<div class="banim-ctl">' +
      '<button type="button" data-act="prev" title="이전 단계">◀</button>' +
      '<button type="button" data-act="play"></button>' +
      '<button type="button" data-act="next" title="다음 단계">▶</button>' +
      '<span class="banim-dots">' +
      cfg.steps.map((_, i) => `<button type="button" data-step="${i}"></button>`).join('') +
      '</span></div>';

    const setF = (id, v) => {
      const n = el.querySelector(`[data-f="${id}"]`);
      if (n) n.innerHTML = v;
    };
    let step = 0, timer = null;
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    const render = () => {
      el.dataset.step = step;
      setF('cap-t', `${step + 1}. ${cfg.steps[step][0]}`);
      setF('cap-d', cfg.steps[step][1]);
      el.querySelectorAll('[data-on]').forEach((n) =>
        n.classList.toggle('on', step >= +n.dataset.on && !(n.dataset.off && step >= +n.dataset.off)));
      if (cfg.render) cfg.render(step, setF, el);
      el.querySelectorAll('.banim-dots button').forEach((b, i) =>
        b.classList.toggle('cur', i === step));
      el.querySelector('[data-act="play"]').textContent = timer ? '⏸ 정지' : '▶ 재생';
    };
    const go = (n) => { step = Math.min(cfg.steps.length - 1, Math.max(0, n)); render(); };

    el.querySelector('.banim-ctl').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.step !== undefined) { stop(); go(+b.dataset.step); }
      else if (b.dataset.act === 'prev') { stop(); go(step - 1); }
      else if (b.dataset.act === 'next') { stop(); go(step + 1); }
      else if (b.dataset.act === 'play') {
        if (timer) { stop(); }
        else {
          if (step >= cfg.steps.length - 1) step = -1; // 끝에서 재생 → 처음부터
          timer = setInterval(() => {
            if (step >= cfg.steps.length - 1) { stop(); render(); return; }
            go(step + 1);
          }, 2800);
          go(step + 1);
        }
        render();
      }
    });
    render();
  }

  // 투표 게이지 공용 조각 — --w 가 채움 비율. th=true 면 ⅔ 기준선 눈금 (finality 정족수용)
  const animGauge = (pct, on, th) =>
    `<div class="banim-gauge${th ? ' th' : ''}" data-on="${on}"><i style="--w:${pct}%"></i><span>투표 ${pct}%</span></div>`;

  // parentHash·해시 두 행을 가진 컴팩트 블록 상자 — reorg 계열 공용
  const animHashBlk = (cls, title, parent, hash, extra, on) =>
    `<div class="banim-block ${cls}"${on !== undefined ? ` data-on="${on}"` : ''}>` +
    `<div class="banim-bt">${title}</div>` +
    `<div class="banim-row"><span>parentHash</span><b>${parent}</b></div>` +
    `<div class="banim-row"><span>해시</span><b>${hash}</b></div>${extra || ''}</div>`;

  // 이더리움 블록 생성 과정 — mempool → 트랜잭션 선택 → 헤더 완성 → 부모 연결 → 체인 성장
  function buildBlockLifecycle(el) {
    const STEPS = [
      ['대기 중인 트랜잭션', '사용자가 서명해 보낸 트랜잭션은 먼저 mempool 대기열에 쌓인다.'],
      ['제안자 선출', '검증자 한 명이 이번 슬롯의 제안자로 뽑힌다. 번호·timestamp·prevRandao·baseFee·feeRecipient·gasLimit 는 시작부터 정해져 있다.'],
      ['트랜잭션 선택', '팁이 높은 트랜잭션부터 골라 바디에 담는다. 목록이 정해지면 그 요약인 txRoot 도 정해진다.'],
      ['실행', '담은 트랜잭션을 순서대로 실행한다. 결과로 stateRoot·receiptsRoot·logsBloom·gasUsed 가 채워진다.'],
      ['부모 연결 — 헤더 완성·전파', 'parentHash 에 직전 블록의 해시를 넣으면 헤더가 완성된다. 이제서야 이 블록의 해시가 정해지고 네트워크에 전파된다.'],
      ['체인이 자란다', '다음 슬롯에서 반복된다. 노란 값이 블록마다 바뀌는 필드다. 직전 블록이 한산해서 baseFee 는 내려갔고 gasLimit 만 그대로다.'],
    ];
    // 예시 값 — 설명용 가상 데이터
    const row = (label, id, chg) =>
      `<div class="banim-row${chg ? ' chg' : ''}"><span>${label}</span><b data-f="${id}">—</b></div>`;
    const block = (cls, title, rows, on) =>
      `<div class="banim-block ${cls}"${on ? ` data-on="${on}"` : ''}>` +
      `<div class="banim-bt">${title}</div>${rows}</div>`;

    stepAnim(el, {
      steps: STEPS,
      scene:
      '<div class="banim-pool"><span class="banim-pl">mempool</span>' +
      [3, 1, 4, 2, 5, 6].map((n, i) =>
        `<span class="banim-dot${i < 3 ? ' pick' : ''}" style="--tip:${n}"></span>`).join('') +
      '<span class="banim-chip" data-on="1">제안자 선출됨</span></div>' +
      '<div class="banim-chain">' +
      block('old', '블록 22,222,221',
        '<div class="banim-row"><span>해시</span><b>0x51c2…</b></div>') +
      '<span class="banim-link on">←</span>' +
      block('old', '블록 22,222,222',
        '<div class="banim-row"><span>해시</span><b>0x9c4e…</b></div>') +
      '<span class="banim-link" data-on="4">←</span>' +
      block('new', '블록 <b data-f="num">?</b>',
        row('parentHash', 'parent') + row('timestamp', 'time') +
        row('prevRandao', 'randao') + row('txRoot', 'txroot') +
        row('stateRoot', 'state') + row('receiptsRoot', 'rcpt') +
        row('logsBloom', 'bloom') + row('gasUsed', 'used') +
        row('baseFee', 'fee') + row('feeRecipient', 'recip') +
        row('gasLimit', 'limit') +
        '<div class="banim-body" data-on="2"><i>tx</i><i>tx</i><i>tx</i></div>' +
        '<div class="banim-row hash"><span>이 블록의 해시</span><b data-f="self">—</b></div>', 1) +
      '<span class="banim-link" data-on="5">←</span>' +
      block('next', '블록 <b class="cv">22,222,224</b>',
        '<div class="banim-row chg"><span>parentHash</span><b>0x7ab0…</b></div>' +
        '<div class="banim-row chg"><span>timestamp</span><b>12:00:24</b></div>' +
        '<div class="banim-row chg"><span>prevRandao</span><b>0x91e7…</b></div>' +
        '<div class="banim-row chg"><span>txRoot</span><b>0xe19d…</b></div>' +
        '<div class="banim-row chg"><span>stateRoot</span><b>0x02c7…</b></div>' +
        '<div class="banim-row chg"><span>receiptsRoot</span><b>0x5a1f…</b></div>' +
        '<div class="banim-row chg"><span>logsBloom</span><b>0x40…8a</b></div>' +
        '<div class="banim-row chg"><span>gasUsed</span><b>189,406</b></div>' +
        '<div class="banim-row chg"><span>baseFee</span><b>10.9 gwei</b></div>' +
        '<div class="banim-row chg"><span>feeRecipient</span><b>0x11c9…</b></div>' +
        '<div class="banim-row"><span>gasLimit</span><b>60,000,000</b></div>' +
        '<div class="banim-row hash"><span>이 블록의 해시</span><b>0x33d6…</b></div>', 5) +
      '</div>',
      render(step, setF) {
        setF('num', step >= 1 ? '22,222,223' : '?');
        setF('time', step >= 1 ? '12:00:12' : '—');
        setF('randao', step >= 1 ? '0x4d2c…' : '—');
        setF('fee', step >= 1 ? '12.4 gwei' : '—');
        setF('recip', step >= 1 ? '0xfe0a…' : '—');
        setF('limit', step >= 1 ? '60,000,000' : '—');
        setF('txroot', step >= 2 ? '0x6f21…' : '—');
        setF('state', step >= 3 ? '0xb3d8…' : '—');
        setF('rcpt', step >= 3 ? '0x88b5…' : '—');
        setF('bloom', step >= 3 ? '0x00…00' : '—');
        setF('used', step >= 3 ? '63,000' : '—');
        setF('parent', step >= 4 ? '0x9c4e…' : '—');
        setF('self', step >= 4 ? '0x7ab0…' : '—');
      },
    });
  }

  // reorg — 같은 높이에 블록 둘 → 투표 → 한쪽 폐기 → 내 tx 의 blockHash 변경 (1장 3절)
  function buildReorg(el) {
    const blk = animHashBlk;

    stepAnim(el, {
      steps: [
        ['정상 체인', '내 트랜잭션이 블록 100a 에 담겼다. 컨펌 1 — 아직 되돌아갈 수 있는 구간이다.'],
        ['포크', '같은 높이 100 에 경쟁 블록 100b 가 나타났다. 둘 다 parentHash 가 99 의 해시(0x3b21…)를 가리킨다 — 같은 부모의 두 자식이다.'],
        ['투표가 갈린다', '검증자 투표가 100b 쪽으로 몰리고, 다음 블록 101 도 100b 뒤에 붙는다 — 101 의 parentHash 가 100b 의 해시다.'],
        ['reorg', '100a 는 체인에서 빠진다. 그 안에 있던 내 트랜잭션은 mempool 로 돌아간다.'],
        ['재포함', '내 트랜잭션이 블록 102 에 다시 담겼다. blockHash 가 바뀌었다 — 저장해 둔 해시와 비교하면 이 사건이 잡힌다.'],
        ['다른 결말', '다시 담기지 못하면 탈락이다. 체인에는 아무 기록도 남지 않고, 입금이었다면 없었던 일이 된다.'],
      ],
      scene:
        '<div class="banim-chain">' +
        blk('old', '블록 99', '0xc4d7…', '0x3b21…') +
        '<span class="banim-link on">←</span>' +
        '<div class="banim-fork">' +
        '<div class="banim-branch">' +
        blk('old ba', '블록 100a', '0x3b21…', '0x51ab…',
          '<div class="banim-txchip" data-on="0" data-off="3">내 tx</div>' + animGauge(31, 2)) +
        '</div>' +
        '<div class="banim-branch">' +
        blk('old', '블록 100b', '0x3b21…', '0x84c0…', animGauge(69, 2), 1) +
        '<span class="banim-link" data-on="2">←</span>' +
        blk('old', '블록 101', '0x84c0…', '0x66d2…', '', 2) +
        '<span class="banim-link" data-on="4">←</span>' +
        blk('old', '블록 102', '0x66d2…', '0x9e77…',
          '<div class="banim-txchip" data-on="4">내 tx</div>', 4) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="banim-mem" data-on="3" data-off="4">mempool 로 복귀 — 내 tx 대기 중</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        root.querySelector('.ba').classList.toggle('dead', step >= 3);
        setF('rst',
          step < 3 ? '내 tx 의 blockHash: <b>0x51ab…</b> — 블록 100a · 컨펌 1'
          : step === 3 ? '내 tx — mempool 대기 · blockHash 없음'
          : step === 4 ? '내 tx 의 blockHash: <b class="cv">0x9e77…</b> — 블록 102 · 저장해 둔 0x51ab… 과 다르다 · 컨펌 1 부터 다시'
          : '탈락했다면 — blockHash: null · 체인 기록: 없음');
      },
    });
  }

  // deep-reorg — 컨펌이 쌓인 가지가 통째로 뒤집히는 경우 (1장 3절 끝 — finality 의 동기)
  function buildDeepReorg(el) {
    const blk = animHashBlk;

    stepAnim(el, {
      steps: [
        ['컨펌이 쌓이는 중', '내 트랜잭션이 블록 100a 에 담겼다. 컨펌 1.'],
        ['컨펌 2', '100a 위에 101a 가 붙었다. 위에 쌓일수록 되돌리기 어려워 보인다.'],
        ['숨은 가지', '그 사이 네트워크 다른 쪽에서는 100b 가지가 자라고 있었다. 전파가 갈라진 동안 서로 다른 끝 위에 블록을 지은 것이다.'],
        ['역전', '투표를 합산하니 b 가지가 더 무겁다. 다음 블록 102b 도 b 가지에 붙는다.'],
        ['깊은 reorg', '100a·101a 가 통째로 빠진다. 컨펌이 2 였어도 소용없이 내 트랜잭션은 mempool 로 돌아간다.'],
        ['그래서 finality', '컨펌 수는 확률적 지표일 뿐, 확정 전에는 몇 개가 쌓여도 0 이 될 수 있다. 이 한계를 프로토콜 보증으로 바꾼 것이 다음 절의 finality 다.'],
      ],
      scene:
        '<div class="banim-chain">' +
        blk('old', '블록 99', '0xc4d7…', '0x3b21…') +
        '<span class="banim-link on">←</span>' +
        '<div class="banim-fork">' +
        '<div class="banim-branch">' +
        blk('old da', '블록 100a', '0x3b21…', '0x51ab…',
          '<div class="banim-txchip" data-on="0" data-off="4">내 tx</div>') +
        '<span class="banim-link" data-on="1">←</span>' +
        blk('old da', '블록 101a', '0x51ab…', '0x77e4…', animGauge(42, 3), 1) +
        '</div>' +
        '<div class="banim-branch">' +
        blk('old', '블록 100b', '0x3b21…', '0x84c0…', '', 2) +
        '<span class="banim-link" data-on="2">←</span>' +
        blk('old', '블록 101b', '0x84c0…', '0x2fd1…', animGauge(58, 3), 2) +
        '<span class="banim-link" data-on="3">←</span>' +
        blk('old', '블록 102b', '0x2fd1…', '0x0b6e…',
          '<div class="banim-txchip" data-on="5">tx 재포함 대기</div>', 3) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="banim-mem" data-on="4">mempool 로 복귀 — 내 tx 대기 중</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        root.querySelectorAll('.da').forEach((b) => b.classList.toggle('dead', step >= 4));
        setF('rst',
          step === 0 ? '내 tx — 블록 100a · 컨펌 1'
          : step === 1 ? '내 tx — 블록 100a · 컨펌 2'
          : step === 2 ? '내 tx — 블록 100a · 컨펌 2 — b 가지는 아직 내 컨펌과 무관해 보인다'
          : step === 3 ? '내 tx — 블록 100a · 컨펌 2 — 하지만 투표는 b 가지로 몰린다'
          : step === 4 ? '내 tx — mempool 대기 · 컨펌 <b class="cv">2 → 0</b>'
          : '컨펌 수는 확률 — 확정(finality) 전에는 몇 컨펌이든 되돌아갈 수 있다');
      },
    });
  }

  // proposer — 제안자 추첨: 명단 + prevRandao 시드 → 전원이 같은 계산 (0장 3절)
  function buildProposer(el) {
    stepAnim(el, {
      steps: [
        ['검증자 명단', '예치금(기본 32 ETH)을 잠근 검증자들이 체인에 등록되어 있다 — 실제로는 백만 명이 넘는다. 뽑힐 확률은 예치금에 비례한다.'],
        ['시드 — prevRandao', '블록을 만들 때마다 제안자가 서명에서 나온 무작위 값을 하나씩 보탠다. 이 누적값이 추첨의 시드다. 여러 명의 기여가 섞여 한 사람이 결과를 정할 수 없다.'],
        ['전원이 같은 계산', '시드도 명단도 체인에 있는 공개 데이터다. 정해진 셔플 함수에 넣으면 누가 돌려도 같은 답이 나온다.'],
        ['에폭 스케줄', '에폭이 시작되면 32개 슬롯의 제안자가 슬롯마다 한 명씩 미리 정해진다.'],
        ['발표자는 없다', '뽑힌 검증자도 자기 차례를 계산해서 알고, 다른 노드들도 같은 계산으로 "이 슬롯의 블록은 V3 의 서명이어야 한다"를 검증한다.'],
        ['한계 두 가지', '시드가 아직 안 쌓인 먼 미래의 스케줄은 알 수 없다. 그리고 뽑힌 검증자가 다운이면 그 슬롯은 빈 슬롯으로 지나간다.'],
      ],
      scene:
        '<div class="banim-vals">' +
        [1, 2, 3, 4, 5, 6, 7, 8].map((n) =>
          `<span class="banim-val" data-v="${n}">V${n}<i>32 ETH</i></span>`).join('') +
        '</div>' +
        '<div class="banim-seedline" data-on="1">prevRandao 누적: <b>0x9a31… ⊕ 0x77c2… ⊕ 0x05ed… → 시드 0x4d2c…</b></div>' +
        '<div class="banim-seedline" data-on="2">모든 노드가 같은 계산: <b>shuffle(시드 0x4d2c…, 슬롯 번호) → 검증자 번호</b></div>' +
        '<div class="banim-sched" data-on="3">' +
        '<div class="banim-row"><span>슬롯 224,001</span><b data-f="s1">V3</b></div>' +
        '<div class="banim-row"><span>슬롯 224,002</span><b data-f="s2">V7</b></div>' +
        '<div class="banim-row"><span>슬롯 224,003</span><b>V5</b></div>' +
        '<div class="banim-row"><span>슬롯 224,004…</span><b>…</b></div>' +
        '</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        root.querySelectorAll('.banim-val').forEach((v) => {
          v.classList.toggle('sel', step >= 3 && v.dataset.v === '3');
          v.classList.toggle('down', step >= 5 && v.dataset.v === '7');
        });
        setF('s2', step >= 5 ? 'V7 다운 — 빈 슬롯' : 'V7');
        setF('rst',
          step === 0 ? '등록 검증자 8명 (예시 — 실제 약 124만)'
          : step === 1 ? '시드 0x4d2c… — 누구도 혼자 정할 수 없는 값'
          : step === 2 ? 'shuffle(0x4d2c…, 슬롯 224,001) = 검증자 3'
          : step === 3 ? '슬롯 224,001 의 제안자 = <b class="cv">V3</b>'
          : step === 4 ? '발표 없음 — 각자 계산해서 알고, 서명으로 검증한다'
          : 'V7 다운 → 슬롯 224,002 는 블록 없이 지나간다');
      },
    });
  }

  // erc20-transfer — 토큰 전송: 컨트랙트 장부 갱신 + Transfer 이벤트 (2장 2절)
  function buildErc20Transfer(el) {
    const row = (label, id, val) =>
      `<div class="banim-row"><span>${label}</span><b${id ? ` data-f="${id}"` : ''}>${val || '—'}</b></div>`;

    stepAnim(el, {
      steps: [
        ['두 개의 장부', 'ETH 잔액은 원장의 계정에 직접 있지만, USDC 잔액은 USDC 컨트랙트의 저장소에 적혀 있다. A(0xa11c…)가 B(0xb0b1…)에게 100 USDC 를 보내려 한다.'],
        ['트랜잭션 생성', '받는 사람 B 는 to 필드에 없다 — to 는 USDC 컨트랙트 주소이고, 진짜 수취인과 금액은 호출 데이터 안에 있다. ETH 를 보내는 게 아니라서 value 는 0.'],
        ['실행 — 장부 갱신', 'EVM 이 컨트랙트의 transfer 코드를 실행한다. 저장소의 숫자 두 개가 바뀐다 — A 에서 빼고 B 에 더한다.'],
        ['이벤트 기록', '표준에 따라 Transfer 이벤트가 receipt 에 남는다. 이벤트들의 압축 요약인 헤더의 logsBloom 도 전부 0 에서 0 이 아닌 값으로 바뀐다.'],
        ['입금 감지', '토큰 입금 감지는 트랜잭션의 to 가 아니라 Transfer 이벤트의 받는이를 본다 — 거기서 내 입금 주소를 찾는다.'],
        ['decimals', '저장값은 정수다. USDC 는 decimals 6 — 저장된 100,000,000 이 화면의 100 USDC 다.'],
      ],
      scene:
        '<div class="banim-chain">' +
        `<div class="banim-block new"><div class="banim-bt">트랜잭션</div>` +
        row('from', '', '0xa11c… — A') + row('to', 'txto') +
        row('value', 'txval') + row('data', 'txdata') +
        '<div class="banim-row hash"><span>txHash — 서명까지의 해시</span><b data-f="txh">—</b></div></div>' +
        `<div class="banim-block new"><div class="banim-bt">USDC 컨트랙트 저장소</div>` +
        row('0xa11c… — A', 'balA', '250,000,000') +
        row('0xb0b1… — B', 'balB', '40,000,000') +
        row('표시 잔액 ÷10⁶', 'disp') + '</div>' +
        `<div class="banim-block new" data-on="3"><div class="banim-bt">receipt</div>` +
        row('status', '', '성공') +
        row('Transfer', '', 'A → B · 100,000,000') +
        row('logsBloom — 헤더', 'bloom2') + '</div>' +
        '</div>' +
        '<div class="banim-note" data-on="4">감지기 — Transfer 이벤트의 받는이(0xb0b1…)가 매핑된 입금 주소 → DEPOSIT 발행</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF) {
        setF('txto', step >= 1 ? 'USDC 컨트랙트 — <span class="cv">B 아님</span>' : '—');
        setF('txval', step >= 1 ? '0 ETH' : '—');
        setF('txdata', step >= 1 ? 'transfer(0xb0b1…, 100000000)' : '—');
        setF('txh', step >= 1 ? '0x3c9f…' : '—');
        setF('balA', step >= 2 ? '<span class="cv">150,000,000</span>' : '250,000,000');
        setF('balB', step >= 2 ? '<span class="cv">140,000,000</span>' : '40,000,000');
        setF('bloom2', step >= 3 ? '0x00…00 → <span class="cv">0x40…8a</span>' : '—');
        setF('disp', step >= 5 ? '150 USDC · 140 USDC' : '—');
        setF('rst',
          step === 0 ? 'USDC 장부 (저장값) — A: 250,000,000 · B: 40,000,000'
          : step === 1 ? 'tx: to=컨트랙트 · value=0 · 수취인은 data 안'
          : step === 2 ? '장부 갱신 — A −100,000,000 · B +100,000,000'
          : step === 3 ? 'Transfer(0xa11c…, 0xb0b1…, 100,000,000) 기록됨'
          : step === 4 ? '이벤트의 받는이(0xb0b1…) → 입금 주소 매핑 확인 → DEPOSIT 발행'
          : 'decimals 6 — 100,000,000 = 100 USDC');
      },
    });
  }

  // slashing — 확정을 뒤집으면 왜 반드시 1/3 이 소각되는가: 2/3 겹침 산수 (1장 4절)
  function buildSlashing(el) {
    stepAnim(el, {
      steps: [
        ['확정의 무게', '확정된 체크포인트 A 는 전체 예치금의 3분의 2가 서명한 결과다.'],
        ['상충하는 확정 B', 'A 를 뒤집으려면 다른 가지의 체크포인트 B 도 3분의 2 를 모아야 한다. 그런데 전체 예치금은 하나뿐이다.'],
        ['겹침은 피할 수 없다', '3분의 2 + 3분의 2 = 3분의 4 — 전체를 넘는다. 최소 3분의 1은 A 와 B 양쪽 모두에 서명했다는 뜻이다.'],
        ['이중 투표 — 지울 수 없는 증거', '투표는 서명이다. 겹친 3분의 1에게는 상충하는 서명 두 벌이 남아 있다 — 그 자체가 위반의 물증이다.'],
        ['자동 소각', '누구든 그 두 서명을 체인에 제출하면 해당 검증자들의 예치금이 소각된다. 재판도 합의도 없다.'],
        ['그래서 되돌릴 수 없다', '소각은 되돌리기 위해 내는 수수료가 아니라 위반의 결과다 — 뒤집기에 성공하는 순간 최소 3분의 1이 반드시 불탄다.'],
      ],
      scene:
        '<div class="banim-el">전체 예치금 100%</div>' +
        '<div class="banim-stake">' +
        '<div class="banim-srow"><span class="banim-seg a">체크포인트 A 에 투표 — 2/3</span></div>' +
        '<div class="banim-srow"><span class="banim-seg b" data-on="1">체크포인트 B 에 투표 — 2/3</span></div>' +
        '<div class="banim-olap" data-on="2"><span data-f="olab"></span></div>' +
        '</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        root.querySelector('.banim-olap').classList.toggle('burn', step >= 4);
        setF('olab', step >= 4 ? '1/3 소각' : '최소 1/3 겹침');
        setF('rst',
          step === 0 ? '확정 A = 예치금 2/3 의 서명'
          : step === 1 ? 'B 도 2/3 필요 — 하지만 전체는 1 뿐'
          : step === 2 ? '2/3 + 2/3 − 1 = <b class="cv">최소 1/3</b> 이 양쪽에 서명'
          : step === 3 ? '겹친 1/3 — 상충하는 서명 두 벌 = 이중 투표 증거'
          : step === 4 ? '증거 제출 → 해당 예치금 자동 소각 — 약 1,300만 ETH 규모'
          : '얻을 이익보다 확실히 잃는 담보가 크도록 설계된 경제적 억제');
      },
    });
  }

  // finality — 슬롯 띠 → 체크포인트 투표 → 최종 확정 (1장 4·5절)
  function buildFinality(el) {
    const cells = (n, opts) => {
      let h = '';
      for (let i = 0; i < n; i++) {
        const c = ['banim-cell'];
        c.push(opts.empty && opts.empty.includes(i) ? 'e' : 'b');
        if (opts.future !== undefined && i >= opts.future) c.push('f');
        if (opts.mine === i) c.push('mine');
        h += `<span class="${c.join(' ')}"></span>`;
      }
      return h;
    };

    stepAnim(el, {
      steps: [
        ['슬롯 띠', '블록은 12초 슬롯마다 쌓인다. 테두리 친 칸이 내 트랜잭션이 담긴 블록 — 아직은 전부 되돌아갈 수 있는 구간이다. 빈 칸은 빈 슬롯.'],
        ['체크포인트', '32슬롯이 지나 에폭 N 이 끝났다. 에폭을 닫는 경계 블록이 체크포인트가 된다.'],
        ['1차 투표 — 지지 확보', '투표는 매 슬롯 들어온다 — 전원이 32개 조로 나뉘어 슬롯마다 한 조씩, 각자 에폭에 한 번. 에폭 동안 쌓인 표가 예치금의 3분의 2 를 넘으면 지지 확보(justified) — 아직 확정은 아니다.'],
        ['2차 투표 — 최종 확정', '다음 경계의 체크포인트도 지지를 얻으면 앞의 체크포인트가 확정되고, 그 조상 블록 전부가 한꺼번에 확정된다 — 블록별 나이가 아니라 투표가 기준이다. 약 두 에폭, 약 13분. 에폭 N 은 청록(확정), 에폭 N+1 은 아직 옐로(지지 확보)다.'],
        ['조회 태그', '노드에 물을 때 finalized·safe·latest 로 어느 구간 기준의 답을 받을지 고를 수 있다.'],
        ['되돌릴 수 없다', '확정 구간을 뒤집으려면 최소 3분의 1이 이중 투표를 해야 하고, 그 서명이 증거로 남아 예치금(모든 검증자가 잠근 ETH 총합)이 소각된다. 그래서 사실상 되돌릴 수 없다.'],
      ],
      scene:
        '<div class="banim-band">' +
        '<div class="banim-epoch" data-ep="n"><span class="banim-el">에폭 N — 32슬롯 · 약 6.4분</span>' +
        `<div class="banim-cells">${cells(32, { mine: 21, empty: [7, 26] })}</div>` +
        '<div class="banim-cpline"><span class="banim-cp" data-on="1">체크포인트</span>' +
        animGauge(78, 2, true) + '</div></div>' +
        '<div class="banim-epoch" data-ep="n1"><span class="banim-el">에폭 N+1</span>' +
        `<div class="banim-cells">${cells(32, { empty: [3], future: 0 })}</div>` +
        '<div class="banim-cpline"><span class="banim-cp" data-on="3">체크포인트</span>' +
        animGauge(74, 3, true) + '</div></div>' +
        '</div>' +
        '<div class="banim-tagrow">' +
        '<span class="banim-tag t1" data-on="4">finalized ▴</span>' +
        '<span class="banim-tag t2" data-on="4">safe ▴</span>' +
        '<span class="banim-tag t3" data-on="4">latest ▴</span>' +
        '</div>' +
        '<div class="banim-note" data-on="5">finalized 를 뒤집으면 최소 3분의 1의 이중 투표 증거가 남아 소각된다 — 사실상 되돌릴 수 없다</div>',
      render(step, setF, root) {
        const epN = root.querySelector('[data-ep="n"]');
        epN.classList.toggle('jus', step === 2);  // 1차 투표 통과 — 지지 확보 (옐로)
        epN.classList.toggle('fin', step >= 3);   // 2차 투표 통과 — 확정 (청록)
        root.querySelector('[data-ep="n1"]').classList.toggle('jus', step >= 3); // N+1 은 지지 확보 상태로
        // 에폭 N+1 의 슬롯은 시간이 흐르며 열린다 — 1차 투표 동안 절반, 2차 투표 시점엔 전부
        const open = step >= 3 ? 32 : step === 2 ? 16 : 0;
        root.querySelectorAll('[data-ep="n1"] .banim-cell').forEach((c, i) =>
          c.classList.toggle('f', i >= open));
      },
    });
  }

  // l2-settlement — Base 블록 → 배치 → 이더리움 기록 → finality: 두 층의 확정 (BASE 0장)
  function buildL2Settlement(el) {
    const cell = (cls, on) =>
      `<span class="banim-cell ${cls}"${on !== undefined ? ` data-on="${on}"` : ''}></span>`;

    stepAnim(el, {
      steps: [
        ['두 개의 체인', 'Base 는 2초마다, 이더리움은 12초마다 블록을 만든다. Base 의 블록은 Coinbase 가 운영하는 시퀀서 하나가 만든다.'],
        ['시퀀서 확인 — unsafe', '내 트랜잭션이 Base 블록에 담겼다. 데이터가 아직 이더리움에 없어서 시퀀서의 약속일 뿐이다. 태그로는 unsafe.'],
        ['배치로 묶인다', 'Base 는 계속 블록을 만들면서, 쌓인 블록들의 데이터를 묶어 이더리움에 보낼 준비를 한다.'],
        ['이더리움에 실린다 — safe', '배치가 blob 으로 이더리움 블록에 기록됐다. 시퀀서가 사라져도 이 데이터에서 Base 체인을 다시 만들 수 있다. 이더리움이 reorg 되면 뒤집힐 수 있어 태그는 safe.'],
        ['이더리움 finality — finalized', '배치를 실은 이더리움 블록이 finality 에 도달했다. 이더리움 1장의 보증이 그대로 이 Base 트랜잭션에 적용된다.'],
        ['임계 선택', '시퀀서 확인(약 2초) · safe(보통 5~10분) · finalized(약 15~20분) — 어디를 입금 확정으로 삼을지가 Base 판 임계 문제다.'],
      ],
      scene:
        '<div class="banim-el">Base — 2초마다 블록</div>' +
        '<div class="banim-l2row">' +
        '<span class="banim-l2batch">' +
        cell('b') + cell('b') + cell('b mycell') + cell('b') + cell('b') + cell('b') +
        '</span>' +
        cell('b', 2) + cell('b', 2) + cell('b', 3) + cell('b', 4) +
        '</div>' +
        '<div class="banim-el">Ethereum — 12초마다 블록</div>' +
        '<div class="banim-l2row">' +
        '<span class="banim-ecell">블록 N</span>' +
        '<span class="banim-ecell emid">블록 N+1<i class="banim-bchip" data-on="3">배치</i></span>' +
        '<span class="banim-ecell" data-on="4">블록 N+2 …</span>' +
        '</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        root.querySelector('.mycell').classList.toggle('mine', step >= 1);
        const batch = root.querySelector('.banim-l2batch');
        batch.classList.toggle('grouped', step >= 2);
        batch.classList.toggle('safe', step >= 3 && step < 4);
        batch.classList.toggle('fin', step >= 4);
        root.querySelector('.emid').classList.toggle('fin', step >= 4);
        setF('rst',
          step === 0 ? 'Base 2초 · 이더리움 12초 — 서로 다른 박자'
          : step === 1 ? '내 tx 태그: unsafe — 시퀀서 확인 (약 2초)'
          : step === 2 ? '블록 여섯 개의 데이터가 배치 하나로'
          : step === 3 ? '내 tx 태그: <b class="cv">safe</b> — 배치가 이더리움에 실림 (보통 5~10분)'
          : step === 4 ? '내 tx 태그: <b class="cv">finalized</b> — 그 이더리움 블록이 finality 도달 (약 15~20분)'
          : '시퀀서 확인 → safe → finalized — 뒤 단계로 갈수록 오래 걸리는 대신 보증이 세진다');
      },
    });
  }

  // nonce-replace — 같은 nonce 바꿔치기: 막힘 → 수수료 인상 교체 → 가속/취소 (3장 2절)
  function buildNonceReplace(el) {
    stepAnim(el, {
      steps: [
        ['순번', '계정의 다음 순번은 12 다. 트랜잭션은 이 번호를 달고 나가고, 체인은 한 계정의 트랜잭션을 번호 순서대로만 포함한다.'],
        ['막힘', 'nonce 12 를 낮은 팁으로 보냈다. 다른 트랜잭션에 밀려 뽑히지 못하고 mempool 에 머문다.'],
        ['뒤도 선다', 'nonce 13 을 보내도 12 가 포함되기 전에는 나갈 수 없다. 저가 수수료 한 건이 계정의 출금 전체를 세운다.'],
        ['바꿔치기', '같은 nonce 12 로 팁을 올린 트랜잭션을 다시 보낸다. 수수료가 충분히 오르면(대표 노드 소프트웨어 geth 의 기본값 기준 10% 이상) 노드가 기존 것을 밀어내고 새것을 받는다 — 원래 12 는 이 순간 무효가 된다.'],
        ['교체 완료', '새 12 가 블록에 담기고 13 도 이어서 포함된다. 밀려난 원래 12 는 체인에 아무 기록 없이 사라진다(익스플로러 표기는 dropped). 서명이 새로 되어 txHash 도 다르다 — 원래 해시(0x3c9f…)로는 영원히 조회되지 않는다.'],
        ['취소도 같은 원리', '아무 효과 없는 내용(to = 내 주소, data 비움)으로 같은 nonce 를 소모해 버리면 취소가 된다. 돈은 안 움직이고 취소 트랜잭션의 가스비만 낸다.'],
      ],
      scene:
        '<div class="banim-el">계정 0xa11c… — 다음 nonce: <b data-f="acct">12</b></div>' +
        '<div class="banim-mpool"><span class="banim-pl">mempool</span>' +
        '<span class="banim-txchip orig" data-on="1" data-off="4">nonce 12 · 팁 1 gwei · txHash 0x3c9f…</span>' +
        '<span class="banim-txchip" data-on="2" data-off="4">nonce 13 · txHash 0x5e44… · 순서 대기</span>' +
        '<span class="banim-txchip" data-on="3" data-off="4"><span class="cv">nonce 12 · 팁 2 gwei · txHash 0x81d2… — 교체</span></span>' +
        '</div>' +
        '<div class="banim-chain" data-on="4">' +
        '<div class="banim-block old"><div class="banim-bt">블록 N</div>' +
        '<div class="banim-row"><span>포함</span><b>nonce 12 — txHash <span class="cv">0x81d2…</span></b></div>' +
        '<div class="banim-row"><span>포함</span><b>nonce 13 — txHash 0x5e44…</b></div></div>' +
        '</div>' +
        '<div class="banim-note" data-on="5">취소 = 같은 nonce · 아무 효과 없는 내용 · 팁 인상 — 내용만 다른 같은 바꿔치기</div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        root.querySelector('.orig').classList.toggle('dead', step >= 3);
        setF('acct', step >= 4 ? '14' : '12');
        setF('rst',
          step === 0 ? '지금까지 보낸 트랜잭션 12개 — 다음 번호는 12'
          : step === 1 ? 'nonce 12: mempool 대기 — 팁이 낮아 안 뽑힌다'
          : step === 2 ? 'nonce 13: 12 뒤에서 대기 — 갭 없이 순서대로만'
          : step === 3 ? '노드는 팁 1 → 2 (100% 인상) 쪽만 남긴다 — 원래 12 는 <b class="cv">무효</b>'
          : step === 4 ? '포함된 것은 0x81d2… — 0x3c9f… 로는 아무것도 조회되지 않는다. 추적은 (계정, nonce) 기준으로'
          : '가속과 취소 모두 "같은 nonce + 수수료 인상" 하나의 원리');
      },
    });
  }

  // commitment — 솔라나 확정 단계: processed → confirmed(지분 투표) → finalized(31개 쌓임) (솔라나 0장)
  function buildCommitment(el) {
    const cells = Array.from({ length: 32 }, (_, i) =>
      `<span class="banim-cell b${i === 5 ? ' mycell' : ''}"></span>`).join('');

    stepAnim(el, {
      steps: [
        ['400ms 의 박자', '슬롯이 400ms 마다 지나간다. 리더 일정은 에폭 단위로 미리 계산되어 공개돼 있다.'],
        ['포함 — processed', '내 트랜잭션이 리더의 블록에 담겼다. 아직 투표 전 — 조회 기준으로는 processed.'],
        ['투표 — confirmed', '지분 3분의 2 이상이 이 블록에 투표했다. 약 1~2초 — confirmed. 이 단계가 뒤집힌 사례는 관측된 적이 없다.'],
        ['쌓임', '그 위로 confirmed 블록이 400ms 마다 하나씩 빠르게 쌓인다.'],
        ['finalized', '31개가 쌓이면 finalized — 약 13초. 노드가 이 블록을 뿌리로 고정한다.'],
        ['세 체인, 같은 질문', '이더리움 약 13분 · Base(L1 기준) 15~20분 · 솔라나 약 13초 — "언제 믿는가"의 답이 체인마다 다르다.'],
      ],
      scene:
        '<div class="banim-epoch" data-ep="s"><span class="banim-el">솔라나 슬롯 — 400ms 간격</span>' +
        `<div class="banim-cells">${cells}</div>` +
        '<div class="banim-cpline"><span class="banim-cp" data-on="2">지분 투표</span>' +
        animGauge(72, 2, true) + '</div></div>' +
        '<div class="banim-status" data-f="rst"></div>',
      render(step, setF, root) {
        const open = [5, 6, 10, 21, 32, 32][step];
        root.querySelectorAll('[data-ep="s"] .banim-cell').forEach((c, i) =>
          c.classList.toggle('f', i >= open));
        root.querySelector('.mycell').classList.toggle('mine', step >= 1);
        const box = root.querySelector('[data-ep="s"]');
        box.classList.toggle('jus', step >= 2 && step < 4); // confirmed — 옐로
        box.classList.toggle('fin', step >= 4);             // finalized — 청록
        setF('rst',
          step === 0 ? '슬롯 400ms — 이더리움 12초의 30배 박자'
          : step === 1 ? '내 tx: processed — 담겼지만 투표 전'
          : step === 2 ? '내 tx: <b class="cv">confirmed</b> — 지분 3분의 2 투표 (약 1~2초)'
          : step === 3 ? '내 tx 위로 confirmed 블록이 쌓이는 중 — finalized 까지 31개'
          : step === 4 ? '내 tx: <b class="cv">finalized</b> — 약 13초'
          : '이더리움 ≈ 13분 · Base(L1) ≈ 15~20분 · 솔라나 ≈ 13초');
      },
    });
  }

  // 범용 DB 시나리오 애니메이션 — ```anim 첫 줄이 `db` 면 아래 줄들을 해석한다.
  //   table: <이름> | <컬럼> | <컬럼> …          장면에 놓을 DB 테이블 (선언 순서대로)
  //   queue: <이름> | <컬럼> | <컬럼> …          메시지 큐 (색 구분)
  //   hook:  <이름> | <컬럼> | <컬럼> …          외부에서 들어오는 것 (웹훅 도착 등 · 색 구분)
  //   step:  <제목> | <설명>                     단계 시작
  //   ins:   <테이블> | <값> | <값> …            이 단계에서 행 추가
  //   source:<이름> | <컬럼> …                    벤더에서 당겨오는 것 (거래 목록 조회 등 · 색 구분)
  //   upd:   <테이블> | <행번호> | <컬럼>=<값> …  행 갱신 (행번호 = 그 테이블에 추가된 순서, 1부터)
  //   del:   <테이블> | <행번호>                  행 삭제 — 그 단계에 취소선, 다음 단계부터 사라짐
  //   alert: <테이블> | <행번호>                  그 행을 빨갛게 경보(장애·누락) — clear 전까지 유지
  //   clear: <테이블> | <행번호>                  경보 해제(복구)
  function buildDbScenario(el, src) {
    const tables = [];
    const steps = [];
    const byName = {};
    const BOX = { table: 'db', queue: 'queue', hook: 'hook', source: 'source' };
    src.split('\n').forEach((raw) => {
      const m = /^(table|queue|hook|source|step|ins|upd|del|alert|clear):\s*(.*)$/.exec(raw.trim());
      if (!m) return;
      const parts = m[2].split('|').map((s) => s.trim());
      if (BOX[m[1]]) {
        const t = { name: parts[0], cols: parts.slice(1), kind: BOX[m[1]] };
        tables.push(t);
        byName[t.name] = t;
      } else if (m[1] === 'step') {
        steps.push({ t: parts[0], d: parts[1] || '', ops: [] });
      } else if (steps.length) {
        steps[steps.length - 1].ops.push({ op: m[1], tbl: parts[0], args: parts.slice(1) });
      }
    });
    if (!tables.length || !steps.length) { el.textContent = 'db 애니메이션: table:/step: 줄이 필요합니다'; return; }

    stepAnim(el, {
      steps: steps.map((s) => [s.t, s.d]),
      scene:
        '<div class="dbanim">' +
        tables.map((t, i) =>
          `<div class="dbt ${t.kind}" data-f="dbt-${i}-box"><div class="dbt-name">${esc(t.name)}<span class="dbt-tag">${{ queue: '큐', hook: '웹훅', source: '조회' }[t.kind] || '테이블'}</span></div>` +
          `<table><thead><tr>${t.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>` +
          `<tbody data-f="dbt-${i}"></tbody></table></div>`).join('') +
        '</div>',
      render(step, setF) {
        // 매 단계 상태를 0단계부터 다시 접어 계산 — 뒤로 가기·점 이동에도 항상 맞는 상태가 나온다
        const state = tables.map(() => []);
        for (let s = 0; s <= step; s++) {
          steps[s].ops.forEach((o) => {
            const ti = tables.indexOf(byName[o.tbl]);
            if (ti < 0) return;
            const rows = state[ti];
            if (o.op === 'ins') rows.push({ vals: o.args.slice(), born: s, chg: {} });
            else if (o.op === 'upd') {
              const r = rows[+o.args[0] - 1];
              if (!r) return;
              o.args.slice(1).forEach((a) => {
                const eq = a.indexOf('=');
                const ci = tables[ti].cols.indexOf(a.slice(0, eq).trim());
                if (ci >= 0) { r.vals[ci] = a.slice(eq + 1).trim(); r.chg[ci] = s; }
              });
            } else if (o.op === 'del') {
              const r = rows[+o.args[0] - 1];
              if (r && r.deadAt === undefined) r.deadAt = s;
            } else if (o.op === 'alert') {
              const r = rows[+o.args[0] - 1];
              if (r) r.alert = true;
            } else if (o.op === 'clear') {
              const r = rows[+o.args[0] - 1];
              if (r) r.alert = false;
            }
          });
        }
        tables.forEach((t, ti) => {
          const box = el.querySelector(`[data-f="dbt-${ti}-box"]`);
          if (box) box.classList.toggle('act', steps[step].ops.some((o) => o.tbl === t.name));
          const live = state[ti].filter((r) => r.deadAt === undefined || step <= r.deadAt);
          setF(`dbt-${ti}`,
            live.length
              ? live.map((r) =>
                  `<tr class="${r.born === step ? 'new' : ''}${r.deadAt === step ? ' dead' : ''}${r.alert ? ' alert' : ''}">` +
                  t.cols.map((_, ci) =>
                    `<td${r.chg[ci] === step ? ' class="chg"' : ''}>${esc(r.vals[ci] ?? '')}</td>`).join('') +
                  '</tr>').join('')
              : `<tr class="none"><td colspan="${t.cols.length}">비어 있음</td></tr>`);
        });
      },
    });
  }

  const ANIM_DEFS = {
    'block-lifecycle': buildBlockLifecycle,
    'proposer': buildProposer,
    'reorg': buildReorg,
    'deep-reorg': buildDeepReorg,
    'finality': buildFinality,
    'slashing': buildSlashing,
    'erc20-transfer': buildErc20Transfer,
    'l2-settlement': buildL2Settlement,
    'nonce-replace': buildNonceReplace,
    'commitment': buildCommitment,
  };

  // 엔티티 카드 + SVG 관계선 ERD — ```erd 펜스.
  //   entity: <이름 @열,행> :: <테이블 설명> | <컬럼 PK> :: <필드 설명> | …
  //           `@열,행` 이 붙으면 격자 배치(없으면 flex) · `::` 뒤는 hover 툴팁 설명(선택)
  //   rel:    <from> | <to> | <라벨> | <카디널리티> | <스타일>
  //           카디널리티 = one-one | one-many (기본 one-many) — from=적은 쪽, to=많은 쪽 · 스타일 = solid(기본) | dashed
  function buildErd(el, src) {
    const ents = [], rels = [], idOf = {};
    const splitDesc = (s) => { const i = s.indexOf('::'); return i < 0 ? [s.trim(), ''] : [s.slice(0, i).trim(), s.slice(i + 2).trim()]; };
    src.split('\n').forEach((raw) => {
      const m = /^(entity|rel):\s*(.*)$/.exec(raw.trim());
      if (!m) return;
      const p = m[2].split('|').map((s) => s.trim());
      if (m[1] === 'entity') {
        const [nameTok, desc] = splitDesc(p[0]);
        const at = /^(.+?)\s*@\s*(\d+),(\d+)$/.exec(nameTok);
        const name = at ? at[1].trim() : nameTok;
        idOf[name] = ents.length;
        ents.push({
          name, desc, col: at ? +at[2] : null, row: at ? +at[3] : null,
          cols: p.slice(1).filter(Boolean).map((c) => { const [def, d] = splitDesc(c); return { def, desc: d }; }),
        });
      } else {
        rels.push({ from: p[0], to: p[1], label: p[2] || '', card: p[3] || 'one-many', style: p[4] || 'solid' });
      }
    });
    if (!ents.length) { el.textContent = 'erd: entity: 줄이 필요합니다'; return; }

    const tipAttr = (d) => (d ? ` data-tip="${esc(d)}"` : '');
    const card = (e, i) =>
      `<div class="erd-card" data-ei="${i}"${e.col ? ` style="grid-column:${e.col};grid-row:${e.row}"` : ''}>` +
      `<div class="erd-h"${tipAttr(e.desc)}>${esc(e.name)}</div>` +
      e.cols.map((c) => {
        const mm = /^(.*?)\s+(PK|UK|FK|PK,FK|PK,UK)$/.exec(c.def);
        const [nm, badge] = mm ? [mm[1], mm[2]] : [c.def, ''];
        return `<div class="erd-c">${esc(nm)}${badge ? ` <b class="erd-b b${badge.replace(',', ' b')}">${badge}</b>` : ''}</div>`;
      }).join('') + '</div>';

    const grid = ents.some((e) => e.col);
    const maxCol = Math.max(1, ...ents.map((e) => e.col || 1));
    const cardsOpen = grid
      ? `<div class="erd-cards grid" style="grid-template-columns:repeat(${maxCol},max-content)">`
      : '<div class="erd-cards">';
    el.innerHTML =
      '<div class="erd-wrap"><svg class="erd-svg"></svg>' +
      cardsOpen + ents.map(card).join('') + '</div>' +
      '<div class="erd-labels"></div></div>';
    const wrap = el.querySelector('.erd-wrap');
    const svg = el.querySelector('.erd-svg');
    const labels = el.querySelector('.erd-labels');
    const cardEls = [...el.querySelectorAll('.erd-card')];

    const draw = () => {
      const W = wrap.scrollWidth, H = wrap.scrollHeight;
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const wr = wrap.getBoundingClientRect();
      const rect = (i) => {
        const r = cardEls[i].getBoundingClientRect();
        const l = r.left - wr.left, t = r.top - wr.top;
        return { l, t, w: r.width, h: r.height, cx: l + r.width / 2, cy: t + r.height / 2 };
      };
      let paths = '', lab = '';
      rels.forEach((r) => {
        if (idOf[r.from] === undefined || idOf[r.to] === undefined) return;
        const a = rect(idOf[r.from]), b = rect(idOf[r.to]);
        const dx = b.cx - a.cx, dy = b.cy - a.cy;
        let p1, p2;
        if (Math.abs(dx) >= Math.abs(dy)) {
          p1 = { x: dx >= 0 ? a.l + a.w : a.l, y: a.cy };
          p2 = { x: dx >= 0 ? b.l : b.l + b.w, y: b.cy };
        } else {
          p1 = { x: a.cx, y: dy >= 0 ? a.t + a.h : a.t };
          p2 = { x: b.cx, y: dy >= 0 ? b.t : b.t + b.h };
        }
        // 부드러운 곡선 — 연결 방향으로 제어점을 뺀다
        const horiz = Math.abs(p2.x - p1.x) >= Math.abs(p2.y - p1.y);
        const k = Math.max(28, (horiz ? Math.abs(p2.x - p1.x) : Math.abs(p2.y - p1.y)) * 0.4);
        const c1 = horiz ? `${p1.x + (p2.x > p1.x ? k : -k)},${p1.y}` : `${p1.x},${p1.y + (p2.y > p1.y ? k : -k)}`;
        const c2 = horiz ? `${p2.x + (p2.x > p1.x ? -k : k)},${p2.y}` : `${p2.x},${p2.y + (p2.y > p1.y ? -k : k)}`;
        const dash = r.style === 'dashed' ? ' stroke-dasharray="4 4"' : '';
        paths += `<path class="erd-line" d="M${p1.x},${p1.y} C${c1} ${c2} ${p2.x},${p2.y}"${dash}/>`;
        // 끝 표식 — from=one(막대) · to=many(까마귀발). one-one 이면 양쪽 막대
        const many = r.card !== 'one-one';
        const dir = (from, to) => { const vx = to.x - from.x, vy = to.y - from.y, L = Math.hypot(vx, vy) || 1; return [vx / L, vy / L]; };
        const bar = (p, [ux, uy]) => { const px = -uy, py = ux, o = 9, s = 6; const bx = p.x + ux * o, by = p.y + uy * o; return `<line class="erd-mk" x1="${bx + px * s}" y1="${by + py * s}" x2="${bx - px * s}" y2="${by - py * s}"/>`; };
        const crow = (p, [ux, uy]) => { const px = -uy, py = ux, o = 12, s = 6; const ax = p.x + ux * o, ay = p.y + uy * o; return `<path class="erd-mk" d="M${p.x + px * s},${p.y + py * s} L${ax},${ay} M${p.x},${p.y} L${ax},${ay} M${p.x - px * s},${p.y - py * s} L${ax},${ay}"/>`; };
        paths += bar(p1, dir(p1, p2));
        paths += many ? crow(p2, dir(p2, p1)) : bar(p2, dir(p2, p1));
        if (r.label) {
          // 가로 선은 라벨을 선 위로 넉넉히 올려 선·끝표식을 안 가리게 · 세로 선은 선을 끊으며 중앙
          const ly = (p1.y + p2.y) / 2 - (horiz ? 22 : 0);
          lab += `<span class="erd-label" style="left:${(p1.x + p2.x) / 2}px;top:${ly}px">${esc(r.label)}</span>`;
        }
      });
      svg.innerHTML = paths;
      labels.innerHTML = lab;
    };

    // 테이블 hover 툴팁 — 카드 overflow 에 안 잘리게 wrap 에 띄우는 단일 툴팁
    //   헤더 hover = 테이블 설명 + 필드별 설명. 가로 위치는 showTip 에서 wrap 안으로 clamp 해 잘리지 않게 한다
    const tip = document.createElement('div');
    tip.className = 'erd-tip';
    wrap.appendChild(tip);
    const fieldLine = (col) => `<div class="erd-tip-f"><code>${esc(col.def)}</code>${col.desc ? `<span class="erd-tip-fd">${esc(col.desc)}</span>` : ''}</div>`;
    const showTip = (anchor, html) => {
      tip.innerHTML = html;
      tip.classList.add('on');
      const wr = wrap.getBoundingClientRect(), r = anchor.getBoundingClientRect();
      // 가로: 카드 중앙 기준, 단 wrap 밖으로 안 나가게 clamp (맨 왼쪽·오른쪽 카드에서 잘림 방지)
      const half = tip.offsetWidth / 2, pad = 4;
      tip.style.left = `${Math.max(half + pad, Math.min(r.left - wr.left + r.width / 2, wr.width - half - pad))}px`;
      if (r.top - wr.top - tip.offsetHeight - 10 < 0) { // 위로 넘치면 아래로
        tip.style.top = `${r.bottom - wr.top + 8}px`;
        tip.classList.add('below');
      } else {
        tip.style.top = `${r.top - wr.top - 8}px`;
        tip.classList.remove('below');
      }
    };
    wrap.addEventListener('mouseover', (e) => {
      const cardEl = e.target.closest('.erd-card');
      if (!cardEl || !wrap.contains(cardEl)) return;
      const ent = ents[+cardEl.dataset.ei];
      const h = e.target.closest('.erd-h');
      if (!h) return; // 헤더 hover 만 — 테이블 설명 + 필드별 설명
      let html = `<div class="erd-tip-t">${esc(ent.name)}</div>`;
      if (ent.desc) html += `<div class="erd-tip-d">${esc(ent.desc)}</div>`;
      html += ent.cols.map(fieldLine).join('');
      showTip(h, html);
    });
    wrap.addEventListener('mouseout', (e) => {
      const to = e.relatedTarget;
      if (!to || !to.closest || !to.closest('.erd-card')) tip.classList.remove('on');
    });

    if (window.ResizeObserver) new ResizeObserver(draw).observe(wrap);
    requestAnimationFrame(draw);
    setTimeout(draw, 60); // 폰트 로드 후 위치 보정
  }

  function mountErds(root) {
    root.querySelectorAll('.erd[data-erd]').forEach((el) => {
      if (el.dataset.ready) return;
      el.dataset.ready = '1';
      buildErd(el, el.dataset.erd.trim());
    });
  }

  function mountAnims(root) {
    root.querySelectorAll('.anim[data-anim]').forEach((el) => {
      if (el.dataset.ready) return;
      el.dataset.ready = '1';
      const src = el.dataset.anim.trim();
      const nl = src.indexOf('\n');
      const first = (nl < 0 ? src : src.slice(0, nl)).trim();
      if (first === 'db') { buildDbScenario(el, nl < 0 ? '' : src.slice(nl + 1)); return; }
      const build = ANIM_DEFS[src];
      if (build) build(el);
      else el.textContent = `알 수 없는 애니메이션: ${el.dataset.anim}`;
    });
  }

  /* 렌더된 .mermaid 마다 확대·이동·전체화면 컨트롤을 붙인다 */
  // 본문 제목(h2·h3)으로 접이식 목차를 만들어 본문 맨 위에 넣는다 — 모달·문서 뷰 공용.
  // root 는 스크롤 컨테이너 안의 본문 요소. 제목이 적으면(3개 미만) 목차를 만들지 않는다.
  function enhanceToc(root) {
    if (!root || root.querySelector(':scope > .doc-toc')) return; // 중복 방지
    const hs = [...root.querySelectorAll('h2, h3')].filter((h) => !h.closest('.doc-toc'));
    if (hs.length < 3) return;
    const nav = document.createElement('nav');
    nav.className = 'doc-toc';
    let h2n = 0, h3n = 0;
    nav.innerHTML =
      '<div class="doc-toc-t">목차</div>' +
      hs.map((h, i) => {
        if (!h.id) h.id = `sec-${i}`;
        let num;
        if (h.tagName === 'H2') { h2n += 1; h3n = 0; num = `${h2n}`; }
        else { h3n += 1; num = `${h2n}.${h3n}`; }
        return `<a href="#${h.id}" class="lv${h.tagName[1]}" data-i="${i}"><span class="doc-toc-n">${num}</span>${esc(h.textContent)}</a>`;
      }).join('');
    nav.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      e.preventDefault();
      hs[+a.dataset.i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    root.insertBefore(nav, root.firstChild);
  }

  function enhanceDiagrams(root) {
    enhanceCodeCopy(root); // 코드블록 복사 버튼도 같은 진입점에서 — 모든 호출처에 자동 적용
    mountAnims(root); // ```anim 애니메이션도 동일 — 보드·doc·모달·피크·export 전부 커버
    mountErds(root); // ```erd 엔티티 카드 + SVG 관계선
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
      // 내부 문서 링크 — 전체 경로를 알고 있으니 카드 조회 없이 바로 연다
      if (ref.kind === 'doc') {
        const data = await getDoc(ref.path);
        if (data.error) throw new Error(data.error);
        const docBase = ref.path.split('/').slice(0, -1).join('/');
        titleEl.textContent = (data.meta && data.meta.title) || ref.label;
        openEl.href = `doc?path=${encodeURIComponent(ref.path)}${ref.hash || ''}`;
        bodyEl.innerHTML = renderMarkdown(data.body, { docBase });
        await runMermaid('#peek-body .mermaid');
        enhanceDiagrams(bodyEl);
        enhanceSectionRefs(bodyEl, { docPath: ref.path });
        if (ref.hash) {
          const el = bodyEl.querySelector('[id="' + ref.hash.slice(1).replace(/"/g, '') + '"]');
          if (el) el.scrollIntoView();
        }
        return;
      }
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
  // "개념 (세트) N장"·"블록체인매니저 N장"·"이더리움 N장" 은 다른 문서 세트 참조라 제외 (같은 폴더에서만 푼다)
  // "6.4분"·"12.5%"·"10.9 gwei" 같은 소수점 수치는 절 참조가 아니다 — 단위어가 뒤따르면 제외
  // (거부 목록은 1차 필터일 뿐, 최종 판정은 enhanceSectionRefs 의 hasChapter — 대상 문서 존재 확인)
  const REF_RE = /(?<![\d.·])(?<!개념 )(?<!세트 )(?<!매니저 )(?<!이더리움 )(\d{1,2}(?:·\d{1,2})*장)|(?<![\d.])((?:\d{1,2}|A)\.\d{1,2})(?![.\d])(?!\s?(?:분|초|시간|회|배|건|%|gwei))|(부록 [AB])(?!\s*[—-])|\b(TxStatus|TrVerdict)\b/g;

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
    let sibs;
    try {
      const cards = await getCards();
      if (!cards.length) return; // 정적 내보내기 등 API 없는 환경이면 그대로 둔다
      const folder = ctx.docPath.split('/').slice(0, -1).join('/');
      sibs = cards.filter((c) => c.path.startsWith(folder + '/'));
    } catch { return; }

    // "N.M" 이 절 참조인가 — 같은 폴더에 그 절이 실제로 있을 때만 링크한다.
    // 수치(3.4 × 10³⁸ · 1.1조)를 단위 거부 목록으로만 막으면 계속 새므로, 대상 존재로 가린다.
    // 대상 문서 찾기는 openRef 의 chapter 매칭과 같은 규칙, 절은 그 문서의 "## N.M" 헤딩으로 확인한다.
    const secSet = new Set();
    const chapters = new Set();
    for (const m of (root.textContent || '').matchAll(/(?<![\d.])(\d{1,2}|A)\.\d{1,2}(?![.\d])/g))
      chapters.add(m[1]);
    await Promise.all([...chapters].map(async (ch) => {
      const target =
        sibs.find((c) => new RegExp('^' + ch + '\\.(?!\\d)').test(c.title || '')) ||
        (/^A$/i.test(ch) ? sibs.find((c) => (c.title || '').includes('부록 A')) : null);
      if (!target) return; // 그 장 문서가 없으면 절 참조일 수 없다
      try {
        const d = await getDoc(target.path);
        for (const h of (d.body || '').matchAll(/^##\s+((?:\d{1,2}|A)\.\d{1,2})(?!\d)/gm)) secSet.add(h[1]);
      } catch { /* 조회 실패 시 그 장의 절은 링크하지 않는다 */ }
    }));
    const SKIP = new Set(['A', 'CODE', 'PRE', 'BUTTON', 'SCRIPT', 'STYLE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        for (let el = n.parentElement; el && el !== root.parentElement; el = el.parentElement)
          if (SKIP.has(el.tagName) || el.classList.contains('mermaid') || el.classList.contains('banim'))
            return NodeFilter.FILTER_REJECT; // banim = 애니메이션 수치 텍스트 — 참조 아님
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
          if (secSet.has(sec))
            frag.appendChild(refButton(m[2], { kind: 'section', chapter: ch, sec, label: sec }));
          else frag.appendChild(document.createTextNode(m[2])); // 그 절이 없음 = 절 참조가 아니라 수치
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
        const dl = e.target.closest('a.doc-link');
        if (dl) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // 새 탭 등은 그대로
          e.preventDefault();
          openRef({ kind: 'doc', path: dl.dataset.docPath, hash: dl.dataset.docHash || '', label: dl.textContent }, root.__secRefCtx);
          return;
        }
        const btn = e.target.closest('.sec-ref');
        if (btn && btn.__ref) openRef(btn.__ref, root.__secRefCtx);
      });
    }
  }

  return { esc, renderMarkdown, initMermaid, runMermaid, enhanceDiagrams, enhanceCodeCopy, enhanceSectionRefs, enhanceToc, mountAnims };
})();
