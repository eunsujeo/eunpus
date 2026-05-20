/* 수탁형 지갑 DB 구조와 상태 흐름 — Mermaid + pan/zoom + mobile sidebar */

(function () {
  'use strict';

  function setupSidebarToggle() {
    var toggle = document.querySelector('.menu-toggle');
    var sidebar = document.querySelector('.sidebar');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth > 768) return;
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  function scrollActiveSidebarIntoView() {
    var active = document.querySelector('.sidebar a.active');
    if (!active) return;
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    var rect = active.getBoundingClientRect();
    var sbRect = sidebar.getBoundingClientRect();
    if (rect.top < sbRect.top || rect.bottom > sbRect.bottom) {
      active.scrollIntoView({ block: 'center' });
    }
  }

  function applyPanZoomTo(svg) {
    if (typeof window.svgPanZoom === 'undefined') return;
    svg.style.maxWidth = 'none';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    if (!svg.hasAttribute('preserveAspectRatio')) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    try {
      window.svgPanZoom(svg, {
        zoomEnabled: true,
        panEnabled: true,
        controlIconsEnabled: true,
        dblClickZoomEnabled: true,
        mouseWheelZoomEnabled: true,
        preventMouseEventsDefault: true,
        fit: true,
        center: true,
        minZoom: 0.3,
        maxZoom: 8,
        contain: false,
      });
    } catch (e) {
      console.warn('svg-pan-zoom init failed', e);
    }
  }

  function setupPanZoomForAllDiagrams() {
    var svgs = document.querySelectorAll('.diagram .mermaid svg');
    svgs.forEach(applyPanZoomTo);
  }

  async function initMermaid() {
    if (typeof window.mermaid === 'undefined') return;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      themeVariables: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        fontSize: '13px',
        primaryColor: '#f5f5f7',
        primaryBorderColor: '#d2d2d7',
        primaryTextColor: '#1d1d1f',
        lineColor: '#86868b',
        secondaryColor: '#fafafa',
        tertiaryColor: '#ffffff',
      },
      flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis' },
      sequence: { useMaxWidth: false },
      stateDiagram: { useMaxWidth: false },
    });

    try {
      await window.mermaid.run({ querySelector: '.mermaid' });
    } catch (e) {
      console.error('mermaid render failed', e);
      return;
    }

    setupPanZoomForAllDiagrams();
  }

  function init() {
    setupSidebarToggle();
    scrollActiveSidebarIntoView();
    initMermaid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
