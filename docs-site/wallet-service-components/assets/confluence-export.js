/* Confluence 변환 버튼 — 이 페이지의 raw HTML 을 Confluence 위키 마크업으로 변환해 복사창에 띄운다.
 * 다이어그램: sequenceDiagram → {plantuml}, flowchart → {graphviz}. 변환 애매하면 ⚠ 수동 표시.
 * (작성자 전용 유틸. 공개 배포 시 빼고 싶으면 이 스크립트 태그만 제거.) */
(function () {
  'use strict';

  // ---------- 인라인 텍스트 ----------
  function inline(node) {
    var out = '';
    node.childNodes.forEach(function (n) {
      if (n.nodeType === 3) { out += n.nodeValue.replace(/\s+/g, ' '); return; }
      if (n.nodeType !== 1) return;
      var tag = n.tagName.toLowerCase();
      if (tag === 'strong' || tag === 'b') out += '*' + inline(n).trim() + '*';
      else if (tag === 'em' || tag === 'i') out += '_' + inline(n).trim() + '_';
      else if (tag === 'code') out += '{{' + n.textContent + '}}';
      else if (tag === 'br') out += ' ';
      else if (n.classList && n.classList.contains('g')) { /* glossary 마커 drop */ }
      else if (tag === 'a') out += inline(n);            // 링크 텍스트만 (cross-page 링크는 수동)
      else out += inline(n);
    });
    return out;
  }
  function txt(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }

  // ---------- mermaid sequence → PlantUML ----------
  function seqToPlantuml(src) {
    var lines = src.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var out = ['@startuml'], m;
    lines.forEach(function (l) {
      if (/^sequenceDiagram/.test(l)) return;
      if (/^autonumber/.test(l)) { out.push('autonumber'); return; }
      if ((m = l.match(/^participant\s+(\S+)\s+as\s+(.+)$/))) { out.push('participant "' + m[2].trim() + '" as ' + m[1]); return; }
      if ((m = l.match(/^Note over\s+([^:]+):\s*(.+)$/i))) { out.push('note over ' + m[1].split(',').map(function (s) { return s.trim(); }).join(', ') + ' : ' + m[2].trim()); return; }
      if ((m = l.match(/^loop\s+(.+)$/))) { out.push('loop ' + m[1].trim()); return; }
      if ((m = l.match(/^(alt|opt|par)\s+(.+)$/))) { out.push(m[1] + ' ' + m[2].trim()); return; }
      if (/^else\b/.test(l)) { out.push(l); return; }
      if (/^end$/.test(l)) { out.push('end'); return; }
      if ((m = l.match(/^(\S+)\s*(--?>>?|-->>|->>)\s*(\S+)\s*:\s*(.*)$/))) {
        var arrow = m[2].indexOf('--') === 0 ? '-->' : '->';
        out.push(m[1] + ' ' + arrow + ' ' + m[3] + ' : ' + m[4].trim()); return;
      }
      out.push("' ⚠ 수동: " + l);   // ⚠ 수동
    });
    out.push('@enduml');
    return out.join('\n');
  }

  // ---------- mermaid flowchart → Graphviz DOT ----------
  function flowToGraphviz(src) {
    var lines = src.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var rankdir = 'TB', nodes = {}, order = [], edges = [], classes = {}, clusters = [], stack = [], manual = [], m;
    function reg(id, label) {
      if (!nodes[id]) { nodes[id] = { label: label || id, cluster: stack[stack.length - 1] || null }; order.push(id); }
      else if (label) nodes[id].label = label;
    }
    function stripDefs(line) {                                   // 인라인 노드 정의 추출 → id 만 남김
      return line.replace(/(\b[A-Za-z_]\w*)\[("?)([^\]]*?)\2\]/g, function (_, id, q, lbl) {
        reg(id, lbl.replace(/<br\s*\/?>/g, '\\n')); return id;
      });
    }
    lines.forEach(function (raw) {
      var l = raw;
      if ((m = l.match(/^flowchart\s+(TB|BT|LR|RL|TD)/))) { rankdir = m[1] === 'TD' ? 'TB' : m[1]; return; }
      if (/^direction\s/.test(l)) return;
      if ((m = l.match(/^subgraph\s+(\w+)\s*\[("?)(.*?)\2\]\s*$/))) { var c = { id: m[1], label: m[3].replace(/<br\s*\/?>/g, '\\n'), first: null }; clusters.push(c); stack.push(c); return; }
      if (/^subgraph\s+/.test(l)) { var c2 = { id: 'g' + clusters.length, label: l.replace(/^subgraph\s+/, ''), first: null }; clusters.push(c2); stack.push(c2); return; }
      if (/^end$/.test(l)) { stack.pop(); return; }
      if ((m = l.match(/^classDef\s+(\w+)\s+(.+)$/))) { var p = {}; m[2].split(',').forEach(function (kv) { var x = kv.split(':'); p[x[0].trim()] = (x[1] || '').trim(); }); classes[m[1]] = p; return; }
      if ((m = l.match(/^class\s+([\w,]+)\s+(\w+)$/))) { var cl = classes[m[2]] || {}; m[1].split(',').forEach(function (id) { id = id.trim(); reg(id); if (cl.fill) nodes[id].fill = cl.fill; if (cl.stroke) nodes[id].stroke = cl.stroke; }); return; }
      // 엣지 라인
      l = stripDefs(l);
      var em;
      if ((em = l.match(/^(\w+)\s*-->\s*\|"?(.+?)"?\|\s*(\w+)$/))) { reg(em[1]); reg(em[3]); edges.push({ a: em[1], b: em[3], label: em[2], dashed: false }); return; }
      if ((em = l.match(/^(\w+)\s*-\.(.+?)\.->\s*(\w+)$/)))      { reg(em[1]); reg(em[3]); edges.push({ a: em[1], b: em[3], label: em[2], dashed: true }); return; }
      if ((em = l.match(/^(\w+)\s*-\.->\s*(\w+)$/)))             { reg(em[1]); reg(em[2]); edges.push({ a: em[1], b: em[2], label: '', dashed: true }); return; }
      if ((em = l.match(/^(\w+)\s*-->\s*(\w+)$/)))               { reg(em[1]); reg(em[2]); edges.push({ a: em[1], b: em[2], label: '', dashed: false }); return; }
      if (l) manual.push(l);
    });
    // 클러스터 첫 노드 (cluster 로 향하는 엣지용)
    order.forEach(function (id) { var c = nodes[id].cluster; if (c && !c.first) c.first = id; });
    var clusterId = {}; clusters.forEach(function (c) { clusterId[c.id] = c; });
    function endpoint(id) {                                       // 엣지 끝이 subgraph id 면 첫 노드 + lhead/ltail
      if (clusterId[id]) return { node: clusterId[id].first, cluster: 'cluster_' + id };
      return { node: id, cluster: null };
    }
    var dot = ['digraph G {', '  rankdir=' + rankdir + '; compound=true;', '  node [shape=box, style="rounded,filled", fontname="sans-serif"];'];
    clusters.forEach(function (c) {
      dot.push('  subgraph cluster_' + c.id + ' {');
      dot.push('    label="' + c.label + '"; style="rounded";');
      order.forEach(function (id) { if (nodes[id].cluster === c) dot.push('    ' + nodeLine(id)); });
      dot.push('  }');
    });
    order.forEach(function (id) { if (!nodes[id].cluster) dot.push('  ' + nodeLine(id)); });
    edges.forEach(function (e) {
      var s = endpoint(e.a), t = endpoint(e.b), attrs = [];
      if (e.label) attrs.push('label="' + e.label.trim() + '"');
      if (e.dashed) attrs.push('style=dashed');
      if (s.cluster) attrs.push('ltail=' + s.cluster);
      if (t.cluster) attrs.push('lhead=' + t.cluster);
      dot.push('  ' + s.node + ' -> ' + t.node + (attrs.length ? ' [' + attrs.join(', ') + ']' : '') + ';');
    });
    manual.forEach(function (l) { dot.push('  // ⚠ 수동: ' + l); });
    dot.push('}');
    function nodeLine(id) {
      var n = nodes[id], a = ['label="' + n.label + '"'];
      if (n.fill) a.push('fillcolor="' + n.fill + '"');
      if (n.stroke) a.push('color="' + n.stroke + '"');
      return id + ' [' + a.join(', ') + '];';
    }
    return dot.join('\n');
  }

  // ---------- 블록 → 위키 마크업 ----------
  var PANEL = { 'callout-warn': 'note', 'callout-success': 'tip', 'callout-danger': 'warning' };
  function panelMacro(el) {
    var kind = 'info';
    for (var k in PANEL) if (el.classList.contains(k)) kind = PANEL[k];
    var titleEl = el.querySelector('.callout-title');
    var title = titleEl ? txt(titleEl) : '';
    var body = [];
    Array.prototype.forEach.call(el.children, function (c) {
      if (c.classList && c.classList.contains('callout-title')) return;
      body.push(blockOf(c));
    });
    return '{' + kind + (title ? ':title=' + title : '') + '}\n' + body.filter(Boolean).join('\n\n') + '\n{' + kind + '}';
  }
  function tableMarkup(wrap) {
    var t = wrap.querySelector('table'), rows = [], hasSpan = false;
    var th = t.querySelectorAll('thead th');
    if (th.length) rows.push('||' + Array.prototype.map.call(th, function (c) { return ' ' + inline(c).trim() + ' '; }).join('||') + '||');
    t.querySelectorAll('tbody tr').forEach(function (tr) {
      var cells = tr.querySelectorAll('td,th');
      cells.forEach(function (c) { if (c.getAttribute('rowspan') || c.getAttribute('colspan')) hasSpan = true; });
      rows.push('|' + Array.prototype.map.call(cells, function (c) { return ' ' + (inline(c).trim() || ' ') + ' '; }).join('|') + '|');
    });
    return (hasSpan ? '{note}⚠ rowspan/colspan 표 — 셀 정렬 수동 확인 필요{note}\n' : '') + rows.join('\n');
  }
  function blockOf(el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'h2') return 'h2. ' + txt(el);
    if (tag === 'h3') return 'h3. ' + txt(el);
    if (tag === 'h4') return 'h4. ' + txt(el);
    if (tag === 'span' && el.classList.contains('section-subtitle')) return '_' + txt(el) + '_';
    if (tag === 'p') return (el.classList.contains('diagram-caption') ? '_' + inline(el).trim() + '_' : inline(el).trim());
    if (tag === 'ul') return Array.prototype.map.call(el.children, function (li) { return '* ' + inline(li).trim(); }).join('\n');
    if (tag === 'ol') return Array.prototype.map.call(el.children, function (li) { return '# ' + inline(li).trim(); }).join('\n');
    if (tag === 'pre') { var code = el.textContent.replace(/ /g, ' '); return '{code}\n' + code.replace(/\s+$/, '') + '\n{code}'; }
    if (el.classList.contains('callout')) return panelMacro(el);
    if (el.classList.contains('table-wrap')) return tableMarkup(el);
    if (el.classList.contains('diagram')) {
      var pre = el.querySelector('pre.mermaid'); if (!pre) return '';
      var src = pre.textContent.trim();
      if (/^sequenceDiagram/.test(src)) return '{plantuml}\n' + seqToPlantuml(src) + '\n{plantuml}';
      if (/^flowchart/.test(src)) return '{graphviz}\n' + flowToGraphviz(src) + '\n{graphviz}';
      return '{code}\n' + src + '\n{code}';
    }
    return '';
  }

  function convert(doc) {
    var sec = doc.querySelector('main.content section') || doc.querySelector('.content section');
    if (!sec) return '(변환 실패: section 못 찾음)';
    var parts = [];
    Array.prototype.forEach.call(sec.children, function (c) { var b = blockOf(c); if (b) parts.push(b); });
    return parts.join('\n\n');
  }

  // ---------- UI ----------
  function showModal(text) {
    var bg = document.createElement('div');
    bg.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
    var box = document.createElement('div');
    box.style.cssText = 'background:#fff;width:min(900px,92vw);height:80vh;border-radius:10px;display:flex;flex-direction:column;padding:14px;box-shadow:0 10px 40px rgba(0,0,0,.3);';
    var bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center;';
    var h = document.createElement('strong'); h.textContent = 'Confluence 위키 마크업'; h.style.cssText = 'flex:1;font:600 14px sans-serif;';
    var copy = document.createElement('button'); copy.textContent = '복사'; copy.style.cssText = 'padding:6px 12px;cursor:pointer;';
    var close = document.createElement('button'); close.textContent = '닫기'; close.style.cssText = 'padding:6px 12px;cursor:pointer;';
    var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'flex:1;width:100%;font:12px/1.5 monospace;white-space:pre;overflow:auto;resize:none;';
    copy.onclick = function () { ta.select(); document.execCommand('copy'); copy.textContent = '복사됨 ✓'; setTimeout(function () { copy.textContent = '복사'; }, 1500); };
    close.onclick = function () { document.body.removeChild(bg); };
    bg.onclick = function (e) { if (e.target === bg) document.body.removeChild(bg); };
    bar.appendChild(h); bar.appendChild(copy); bar.appendChild(close);
    box.appendChild(bar); box.appendChild(ta); bg.appendChild(box); document.body.appendChild(bg); ta.focus();
  }

  function addButton() {
    var btn = document.createElement('button');
    btn.textContent = '⇄ Confluence';
    btn.title = '이 페이지를 Confluence 위키 마크업으로 변환';
    btn.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9000;padding:9px 13px;border:1px solid #2563eb;background:#dbeafe;color:#1e3a8a;border-radius:8px;font:600 13px sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15);';
    btn.onclick = function () {
      btn.textContent = '변환 중…';
      fetch(window.location.href).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        showModal(convert(doc));
        btn.textContent = '⇄ Confluence';
      }).catch(function (e) { alert('변환 실패: ' + e); btn.textContent = '⇄ Confluence'; });
    };
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
})();
