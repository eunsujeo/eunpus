/* 워크스루 다이어그램 — 인라인 확대/축소/이동(svg-pan-zoom) + 전체화면 모달.
   작은 인라인 뷰에서 "크게 보기" 버튼을 누르면 화면 전체 모달로 열리고,
   모달 안에서도 휠/버튼 줌·드래그 이동이 된다. Esc·배경 클릭·닫기 버튼으로 종료. */
(function () {
  if (typeof window.mermaid === 'undefined') return;

  window.mermaid.initialize({
    startOnLoad: false, theme: 'default', securityLevel: 'loose',
    sequence: { wrap: true, useMaxWidth: true, actorMargin: 70, messageMargin: 34 },
    flowchart: { useMaxWidth: true, htmlLabels: true }
  });

  function panZoom(svg) {
    if (typeof window.svgPanZoom === 'undefined') return null;
    svg.removeAttribute('height');
    svg.style.maxWidth = 'none'; svg.style.width = '100%'; svg.style.height = '100%';
    try {
      return window.svgPanZoom(svg, {
        zoomEnabled: true, panEnabled: true, controlIconsEnabled: true,
        fit: true, center: true, minZoom: 0.3, maxZoom: 16, zoomScaleSensitivity: 0.3,
        dblClickZoomEnabled: true, mouseWheelZoomEnabled: true
      });
    } catch (e) { console.warn('svg-pan-zoom init failed', e); return null; }
  }

  var rid = 0;
  function openModal(src, title) {
    document.body.classList.add('modal-open');
    var modal = document.createElement('div');
    modal.className = 'diagram-modal';
    modal.innerHTML =
      '<div class="diagram-modal-bar">' +
        '<span class="diagram-modal-title"></span>' +
        '<button class="diagram-modal-close" type="button" aria-label="닫기">닫기 ✕ (Esc)</button>' +
      '</div>' +
      '<div class="diagram-modal-stage"></div>';
    modal.querySelector('.diagram-modal-title').textContent = title || '다이어그램';
    var stage = modal.querySelector('.diagram-modal-stage');
    document.body.appendChild(modal);

    var pz = null;
    function close() {
      if (pz) { try { pz.destroy(); } catch (e) {} }
      modal.remove();
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    modal.querySelector('.diagram-modal-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', onKey);

    window.mermaid.render('modal-dgm-' + (++rid), src).then(function (res) {
      stage.innerHTML = res.svg;
      var svg = stage.querySelector('svg');
      if (svg) { pz = panZoom(svg); }
    }).catch(function (e) {
      stage.textContent = '다이어그램을 불러오지 못했습니다.';
      console.error('modal render failed', e);
    });
  }

  function setup() {
    document.querySelectorAll('.diagram').forEach(function (dg) {
      var pre = dg.querySelector('pre.mermaid');
      if (!pre) return;
      var src = pre.getAttribute('data-src');
      var svg = pre.querySelector('svg');
      if (svg) { var inst = panZoom(svg); if (inst) svg.__pz = inst; }

      if (!src) return;
      var cap = dg.nextElementSibling;
      var title = (cap && cap.classList && cap.classList.contains('diagram-caption')) ? cap.textContent.trim() : '';
      var btn = document.createElement('button');
      btn.className = 'diagram-zoom-btn';
      btn.type = 'button';
      btn.textContent = '⛶ 크게 보기';
      btn.addEventListener('click', function () { openModal(src, title); });
      dg.appendChild(btn);
    });
  }

  async function render() {
    // mermaid 가 pre 내용을 svg 로 치환하기 전에 원본 소스를 보존(모달 재렌더용)
    document.querySelectorAll('.diagram pre.mermaid').forEach(function (pre) {
      pre.setAttribute('data-src', pre.textContent);
    });
    try { await window.mermaid.run({ querySelector: '.mermaid' }); }
    catch (e) { console.error('mermaid render failed', e); }
    setup();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      document.querySelectorAll('.diagram pre.mermaid svg').forEach(function (svg) {
        if (svg.__pz) { try { svg.__pz.resize(); svg.__pz.fit(); svg.__pz.center(); } catch (e) {} }
      });
    }, 200);
  });
})();
