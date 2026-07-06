/* indexer-design — Mermaid + svg-pan-zoom + 전체화면 + 사이드바 toggle */

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

  function setupScrollSpy() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main.content section[id]')
    );
    if (!sections.length) return;

    /* 현재 페이지의 섹션을 가리키는 사이드바 링크만 수집
       (href="#id" 또는 href="현재파일명#id") */
    var currentFile = location.pathname.split('/').pop();
    var linkById = {};
    document.querySelectorAll('.sidebar a[href*="#"]').forEach(function (a) {
      var href = a.getAttribute('href');
      var hashIdx = href.indexOf('#');
      var path = href.slice(0, hashIdx);
      if (path !== '' && path !== currentFile) return;
      linkById[href.slice(hashIdx + 1)] = a;
    });
    if (!Object.keys(linkById).length) return;

    var ticking = false;
    function update() {
      ticking = false;
      var currentId = sections[0].id;
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top <= 120) currentId = s.id;
      });
      /* 페이지 끝에 닿으면 마지막 섹션 */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        currentId = sections[sections.length - 1].id;
      }
      var target = linkById[currentId];
      if (!target || target.classList.contains('active')) return;
      document.querySelectorAll('.sidebar a.active').forEach(function (a) {
        a.classList.remove('active');
      });
      target.classList.add('active');
      scrollActiveSidebarIntoView();
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
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
      var instance = window.svgPanZoom(svg, {
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
      svg.__panZoom = instance;
    } catch (e) {
      console.warn('svg-pan-zoom init failed', e);
    }
  }

  function setupPanZoomForAllDiagrams() {
    var svgs = document.querySelectorAll('.diagram .mermaid svg');
    svgs.forEach(applyPanZoomTo);
  }

  function setupFullscreenButtons() {
    var diagrams = document.querySelectorAll('.diagram');
    diagrams.forEach(function (diagram) {
      if (diagram.querySelector('.diagram-fullscreen-btn')) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'diagram-fullscreen-btn';
      btn.setAttribute('aria-label', '다이어그램 전체화면');
      btn.textContent = '⛶ 전체화면';

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!document.fullscreenElement) {
          var req =
            diagram.requestFullscreen ||
            diagram.webkitRequestFullscreen ||
            diagram.mozRequestFullScreen ||
            diagram.msRequestFullscreen;
          if (req) {
            req.call(diagram).catch(function (err) {
              console.warn('fullscreen failed', err);
            });
          }
        } else {
          var exit =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;
          if (exit) exit.call(document);
        }
      });
      diagram.appendChild(btn);
    });

    function onFullscreenChange() {
      var isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      document.querySelectorAll('.diagram-fullscreen-btn').forEach(function (b) {
        b.textContent = isFs ? '✕ 닫기 (ESC)' : '⛶ 전체화면';
      });
      setTimeout(function () {
        document.querySelectorAll('.diagram .mermaid svg').forEach(function (svg) {
          if (svg.__panZoom) {
            try {
              svg.__panZoom.resize();
              svg.__panZoom.fit();
              svg.__panZoom.center();
            } catch (e) {}
          }
        });
      }, 100);
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
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
      securityLevel: 'loose',
    });

    try {
      await window.mermaid.run({ querySelector: '.mermaid' });
    } catch (e) {
      console.error('mermaid render failed', e);
      return;
    }

    setupPanZoomForAllDiagrams();
    setupFullscreenButtons();
  }

  function init() {
    setupSidebarToggle();
    scrollActiveSidebarIntoView();
    setupScrollSpy();
    initMermaid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
