(() => {
  'use strict';
  const data = Array.isArray(window.COURSE_SEARCH_DATA) ? window.COURSE_SEARCH_DATA : [];
  const input = document.getElementById('globalSearchInput');
  const results = document.getElementById('searchResults');
  const count = document.getElementById('searchCount');
  const pageFilter = document.getElementById('searchPageFilter');
  let type = 'all';
  let bookmarks = [];

  function normalize(value) {
    return String(value || '').normalize('NFKD').replace(/[ًٌٍَُِّْـ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function esc(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
  function highlight(text, query) {
    if (!query) return esc(text);
    const words = normalize(query).split(' ').filter((word) => word.length > 1).slice(0, 5);
    let out = esc(text);
    words.forEach((word) => {
      try {
        const safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out = out.replace(new RegExp(`(${safe})`, 'giu'), '<mark>$1</mark>');
      } catch (_) {}
    });
    return out;
  }
  function readBookmarksFallback() {
    try {
      const parsed = JSON.parse(localStorage.getItem('oral-health-bookmarks-v1') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }
  function loadBookmarks() {
    bookmarks = readBookmarksFallback();
    const frame = document.createElement('iframe');
    frame.src = 'bookmark-storage.html';
    frame.hidden = true;
    document.body.appendChild(frame);
    const requestId = `search-bm-${Date.now()}`;
    const listener = (event) => {
      if (event.source !== frame.contentWindow || event.data?.type !== 'OH_BOOKMARKS_RESPONSE' || event.data.requestId !== requestId) return;
      bookmarks = Array.isArray(event.data.data) ? event.data.data : bookmarks;
      window.removeEventListener('message', listener);
      render();
    };
    window.addEventListener('message', listener);
    frame.addEventListener('load', () => frame.contentWindow?.postMessage({ type: 'OH_BOOKMARKS_GET', requestId }, '*'), { once: true });
  }
  function currentItems() {
    if (type === 'saved') {
      return bookmarks.map((item, index) => ({
        id: item.id || `saved-${index}`,
        type: 'saved',
        page: Number((item.pageFile || '').match(/page-(\d+)/)?.[1] || ((item.pageFile || '') === 'index.html' ? 1 : 0)),
        pageTitle: item.pageTitle || 'محفوظات',
        section: item.sectionTitle || 'فقرة محفوظة',
        text: item.text || '',
        href: `${item.pageFile || 'index.html'}#${item.id || ''}`
      }));
    }
    return data.filter((item) => type === 'all' || item.type === type);
  }
  function score(item, query) {
    if (!query) return 1;
    const haystack = normalize(`${item.pageTitle} ${item.section} ${item.text} ${item.extra || ''}`);
    const words = query.split(' ').filter(Boolean);
    let result = 0;
    words.forEach((word) => {
      if (haystack.includes(word)) result += 1;
      if (normalize(item.section).includes(word)) result += 1;
      if (normalize(item.text).startsWith(word)) result += 1;
    });
    return words.every((word) => haystack.includes(word)) ? result + 4 : result;
  }
  function render() {
    const query = normalize(input.value);
    const page = pageFilter.value;
    const items = currentItems()
      .filter((item) => page === 'all' || String(item.page) === page)
      .map((item) => ({ item, score: score(item, query) }))
      .filter((entry) => !query || entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.page - b.item.page)
      .slice(0, 80);
    count.textContent = `${items.length}${items.length === 80 ? ' أو أكثر' : ''} نتيجة ظاهرة`;
    results.innerHTML = '';
    if (!items.length) {
      results.innerHTML = '<div class="search-empty">لا توجد نتائج مطابقة. جرّب كلمة أبسط أو غيّر نوع النتائج.</div>';
      return;
    }
    const labels = { content: 'فقرة', question: 'سؤال', image: 'صورة', saved: 'محفوظة' };
    items.forEach(({ item }) => {
      const card = document.createElement('article');
      card.className = 'search-card';
      card.innerHTML = `<div class="search-card__top"><span class="search-card__type">${labels[item.type] || 'محتوى'}</span><span class="search-card__page">الصفحة ${String(item.page || 0).padStart(2, '0')}</span></div><h3>${esc(item.section || item.pageTitle)}</h3><p>${highlight(item.text, query)}</p>${item.extra ? `<p>${highlight(item.extra, query)}</p>` : ''}<a href="${esc(item.href)}">فتح المصدر ←</a>`;
      results.appendChild(card);
    });
  }

  document.querySelectorAll('.search-filter').forEach((button) => button.addEventListener('click', () => {
    type = button.dataset.type;
    document.querySelectorAll('.search-filter').forEach((item) => item.classList.toggle('is-active', item === button));
    render();
  }));
  document.getElementById('searchForm').addEventListener('submit', (event) => { event.preventDefault(); render(); });
  input.addEventListener('input', render);
  pageFilter.addEventListener('change', render);
  loadBookmarks();
  render();
  setTimeout(() => input.focus(), 80);
})();
