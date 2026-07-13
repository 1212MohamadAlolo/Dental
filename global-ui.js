(() => {
  'use strict';
  const SETTINGS_KEY = 'oral-health-ui-settings-v1';
  const MAP_KEY = 'oral-health-learning-map-v1';

  function readSettings() {
    try { return { theme: 'light', hideImages: false, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; }
    catch (_) { return { theme: 'light', hideImages: false }; }
  }
  let settings = readSettings();

  function persist() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
  }

  function applySettings() {
    document.documentElement.dataset.theme = settings.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('images-hidden', Boolean(settings.hideImages));
    const themeBtn = document.getElementById('globalThemeToggle');
    const imageBtn = document.getElementById('globalImagesToggle');
    if (themeBtn) {
      themeBtn.classList.toggle('is-active', settings.theme === 'dark');
      themeBtn.setAttribute('aria-pressed', String(settings.theme === 'dark'));
      themeBtn.title = settings.theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن';
    }
    if (imageBtn) {
      imageBtn.classList.toggle('is-active', settings.hideImages);
      imageBtn.setAttribute('aria-pressed', String(settings.hideImages));
      imageBtn.title = settings.hideImages ? 'إظهار الصور' : 'إخفاء الصور مؤقتاً';
    }
  }

  function ensureNavLinks() {
    const current = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.course-pages').forEach((container) => {
      const links = [
        ['search.html', 'البحث الشامل', 'course-page-link--search'],
        ['learning-map.html', 'خريطة التعلم', 'course-page-link--map']
      ];
      links.forEach(([href, label, cls]) => {
        let link = container.querySelector(`a[href="${href}"]`);
        if (!link) {
          link = document.createElement('a');
          link.href = href;
          link.className = `course-page-link ${cls}`;
          link.textContent = label;
          container.appendChild(link);
        }
        if (current === href) {
          link.classList.add('is-current');
          link.setAttribute('aria-current', 'page');
        }
      });
    });
  }

  function buildDock() {
    if (document.querySelector('.global-study-dock')) return;
    const dock = document.createElement('div');
    dock.className = 'global-study-dock no-print';
    dock.setAttribute('aria-label', 'أدوات القراءة والتنقل');
    dock.innerHTML = `
      <a href="search.html" title="البحث الشامل" aria-label="البحث الشامل">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
      </a>
      <a href="learning-map.html" title="خريطة التعلم" aria-label="خريطة التعلم">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5 9 4l6 2.5L20 4v13.5L15 20l-6-2.5L4 20V6.5Z"/><path d="M9 4v13.5M15 6.5V20"/></svg>
      </a>
      <button id="globalImagesToggle" type="button" aria-pressed="false" title="إخفاء الصور مؤقتاً">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="m5 16 4-4 3 3 2-2 5 4M8 9h.01"/></svg>
      </button>
      <button id="globalThemeToggle" type="button" aria-pressed="false" title="تفعيل الوضع الداكن">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 1 1 8.5 4 6.5 6.5 0 0 0 20 15.5Z"/></svg>
      </button>`;
    document.body.appendChild(dock);
    document.getElementById('globalThemeToggle').addEventListener('click', () => {
      settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
      persist(); applySettings();
    });
    document.getElementById('globalImagesToggle').addEventListener('click', () => {
      settings.hideImages = !settings.hideImages;
      persist(); applySettings();
    });
  }

  function markVisited() {
    const file = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    let page = file === 'index.html' ? 1 : Number(file.match(/^page-(\d{2})\.html$/)?.[1]);
    if (!page || page < 1 || page > 17) return;
    try {
      const data = JSON.parse(localStorage.getItem(MAP_KEY) || '{}');
      data[page] = { ...(data[page] || {}), visited: true, lastVisited: Date.now() };
      localStorage.setItem(MAP_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function init() {
    ensureNavLinks();
    buildDock();
    applySettings();
    markVisited();
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        location.href = 'search.html';
      }
    });
  }

  applySettings();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
