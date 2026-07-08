/* 라이트/다크 테마 토글 — 선택은 localStorage 에 저장, 없으면 시스템 설정을 따른다.
   초기 적용(FOUC 방지)은 각 HTML <head> 의 인라인 스크립트가 담당하고,
   여기서는 토글 버튼 배선과 아이콘 갱신만 한다. */
(function () {
  function current() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function icon(theme) {
    // 다음에 전환될 모드를 가리키는 아이콘
    return theme === 'light' ? '\u{1F319}' : '☀️'; // 🌙 : ☀️
  }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = icon(theme);
      btn.setAttribute('aria-label', theme === 'light' ? '다크 모드로' : '라이트 모드로');
      btn.title = theme === 'light' ? '다크 모드로' : '라이트 모드로';
    }
  }
  function init() {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      apply(current());
      btn.addEventListener('click', function () {
        apply(current() === 'light' ? 'dark' : 'light');
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
