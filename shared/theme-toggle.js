/* =====================================================================
   Four Gate Alpha — Theme toggle (shared across all teaser versions)
   Injects a fixed glass toggle button (top-right), persists the choice
   in localStorage, and applies data-theme="dark"|"light" to <html>.
   ===================================================================== */
(function () {
  var KEY = 'fga-theme';
  var html = document.documentElement;

  // Initial theme (default dark)
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  html.dataset.theme = saved === 'light' ? 'light' : 'dark';

  // Inject styles
  var css = '\
    .fga-theme-btn{\
      position:fixed; top:14px; right:14px; z-index:200;\
      width:42px; height:42px; border-radius:999px;\
      display:inline-flex; align-items:center; justify-content:center;\
      background: rgba(255,255,255,0.04);\
      backdrop-filter: blur(10px) saturate(120%);\
      -webkit-backdrop-filter: blur(10px) saturate(120%);\
      border:1px solid rgba(212,197,169,0.32);\
      color: var(--accent-fga, #d4c5a9);\
      cursor: pointer;\
      transition: background .2s ease, border-color .2s ease, transform .18s ease;\
    }\
    .fga-theme-btn:hover{ background: rgba(212,197,169,0.10); border-color: rgba(212,197,169,0.55); transform: translateY(-1px); }\
    .fga-theme-btn svg{ width:18px; height:18px; }\
    .fga-theme-btn .moon{ display:none; }\
    .fga-theme-btn .sun{  display:block; }\
    [data-theme="light"] .fga-theme-btn{\
      background: rgba(42,39,34,0.06);\
      border-color: rgba(138,111,42,0.42);\
      color: #8a6f2a;\
    }\
    [data-theme="light"] .fga-theme-btn:hover{ background: rgba(138,111,42,0.10); }\
    [data-theme="light"] .fga-theme-btn .moon{ display:block; }\
    [data-theme="light"] .fga-theme-btn .sun{  display:none; }\
    @media (min-width: 820px){\
      .fga-theme-btn{ top:22px; right:22px; }\
    }\
  ';
  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  // Inject button
  function mount() {
    if (document.querySelector('.fga-theme-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'fga-theme-btn';
    btn.setAttribute('aria-label', 'Toggle light / dark mode');
    btn.innerHTML = ''
      + '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
      + '  <circle cx="12" cy="12" r="4"/>'
      + '  <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>'
      + '  <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'
      + '  <line x1="4.6" y1="4.6" x2="6.8" y2="6.8"/><line x1="17.2" y1="17.2" x2="19.4" y2="19.4"/>'
      + '  <line x1="4.6" y1="19.4" x2="6.8" y2="17.2"/><line x1="17.2" y1="6.8" x2="19.4" y2="4.6"/>'
      + '</svg>'
      + '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
      + '  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
      + '</svg>';
    btn.addEventListener('click', function () {
      var next = html.dataset.theme === 'light' ? 'dark' : 'light';
      html.dataset.theme = next;
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
    document.body.appendChild(btn);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
