/* 워크스루 다이어그램 — mermaid 렌더 후 확대/축소/이동(svg-pan-zoom).
   휠/버튼 확대·축소, 드래그 이동, 더블클릭 확대, 컨트롤 아이콘(+/−/리셋) 제공. */
(function () {
  if (typeof window.mermaid === 'undefined') return;

  window.mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    sequence: { wrap: true, useMaxWidth: true, actorMargin: 70, messageMargin: 34 },
    flowchart: { useMaxWidth: true, htmlLabels: true }
  });

  function attach() {
    if (typeof window.svgPanZoom === 'undefined') return;
    document.querySelectorAll('.diagram pre.mermaid svg').forEach(function (svg) {
      if (svg.__pz) return;
      svg.removeAttribute('height');
      svg.style.maxWidth = 'none';
      svg.style.width = '100%';
      svg.style.height = '100%';
      try {
        svg.__pz = window.svgPanZoom(svg, {
          zoomEnabled: true,
          panEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.4,
          maxZoom: 12,
          zoomScaleSensitivity: 0.3,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true
        });
      } catch (e) { console.warn('svg-pan-zoom init failed', e); }
    });
  }

  async function render() {
    try {
      await window.mermaid.run({ querySelector: '.mermaid' });
    } catch (e) { console.error('mermaid render failed', e); }
    attach();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

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
