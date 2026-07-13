(() => {
  'use strict';

  const STORAGE_KEY = 'oral-health-bookmarks-v1';
  const fileName = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const isContentPage = fileName === 'index.html' || /^page-\d{2}\.html$/i.test(fileName);
  const isSavedPage = fileName === 'saved.html';
  let bookmarks = [];
  let paragraphEntries = [];

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function escapeSelector(value) {
    if (window.CSS?.escape) return window.CSS.escape(value);
    return value.replace(/([ #;&,.+*~':"!^$[\]()=>|/@])/g, '\\$1');
  }

  class SharedStorageBridge {
    constructor() {
      this.pending = new Map();
      this.sequence = 0;
      this.loaded = false;
      this.frame = document.createElement('iframe');
      this.frame.src = 'bookmark-storage.html';
      this.frame.className = 'bookmark-storage-frame';
      this.frame.title = 'مخزن المحفوظات';
      this.frame.setAttribute('aria-hidden', 'true');
      this.frame.tabIndex = -1;
      this.frame.addEventListener('load', () => { this.loaded = true; });
      document.body.appendChild(this.frame);

      window.addEventListener('message', (event) => {
        if (event.source !== this.frame.contentWindow) return;
        const message = event.data || {};
        if (message.type !== 'OH_BOOKMARKS_RESPONSE') return;
        const pending = this.pending.get(message.requestId);
        if (!pending) return;
        clearTimeout(pending.timer);
        this.pending.delete(message.requestId);
        pending.resolve(Array.isArray(message.data) ? message.data : []);
      });
    }

    request(type, data) {
      return new Promise((resolve) => {
        const requestId = `bm-${Date.now()}-${this.sequence += 1}`;
        const send = () => {
          try {
            this.frame.contentWindow?.postMessage({ type, data, requestId }, '*');
          } catch (_) {
            resolve(this.fallbackRead());
          }
        };

        const timer = setTimeout(() => {
          this.pending.delete(requestId);
          resolve(this.fallbackRead());
        }, 1200);

        this.pending.set(requestId, { resolve, timer });
        if (this.loaded) {
          send();
        } else {
          this.frame.addEventListener('load', send, { once: true });
        }
      });
    }

    fallbackRead() {
      let local = [];
      let tab = [];
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        local = Array.isArray(parsed) ? parsed : [];
      } catch (_) {}
      try {
        const envelope = JSON.parse(window.name || '{}');
        tab = Array.isArray(envelope.oralHealthBookmarks) ? envelope.oralHealthBookmarks : [];
      } catch (_) {}
      return mergeBookmarks(local, tab);
    }

    fallbackWrite(data) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
      try {
        let envelope = {};
        try { envelope = JSON.parse(window.name || '{}') || {}; } catch (_) {}
        envelope.oralHealthBookmarks = data;
        window.name = JSON.stringify(envelope);
      } catch (_) {}
    }

    async get() {
      const shared = sanitizeBookmarks(await this.request('OH_BOOKMARKS_GET'));
      this.fallbackWrite(shared);
      return shared;
    }

    async set(data) {
      const clean = sanitizeBookmarks(data);
      this.fallbackWrite(clean);
      await this.request('OH_BOOKMARKS_SET', clean);
      return clean;
    }
  }

  function sanitizeBookmarks(items) {
    const result = [];
    const seen = new Set();
    (Array.isArray(items) ? items : []).forEach((item) => {
      if (!item || !item.id || seen.has(item.id)) return;
      seen.add(item.id);
      result.push({
        id: String(item.id),
        pageFile: String(item.pageFile || 'index.html'),
        pageTitle: normalizeText(item.pageTitle || 'صفحة تعليمية'),
        sectionTitle: normalizeText(item.sectionTitle || 'محتوى الصفحة'),
        text: normalizeText(item.text),
        savedAt: Number(item.savedAt) || Date.now()
      });
    });
    return result;
  }

  function mergeBookmarks(...collections) {
    const map = new Map();
    collections.flat().forEach((item) => {
      if (!item?.id) return;
      const existing = map.get(item.id);
      if (!existing || Number(item.savedAt) >= Number(existing.savedAt)) {
        map.set(item.id, item);
      }
    });
    return sanitizeBookmarks([...map.values()]);
  }

  const bridge = new SharedStorageBridge();

  function ensureNavLink() {
    document.querySelectorAll('.course-pages').forEach((container) => {
      let link = container.querySelector('a[href="saved.html"]');
      if (!link) {
        link = document.createElement('a');
        link.href = 'saved.html';
        link.className = 'course-page-link course-page-link--saved';
        link.innerHTML = 'المحفوظات <span class="bookmarks-count-badge" aria-label="عدد الفقرات المحفوظة">0</span>';
        container.appendChild(link);
      }
      if (!link.querySelector('.bookmarks-count-badge')) {
        const badge = document.createElement('span');
        badge.className = 'bookmarks-count-badge';
        badge.textContent = '0';
        link.appendChild(badge);
      }
      if (isSavedPage) {
        link.classList.add('is-current');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function updateCountBadges() {
    document.querySelectorAll('.bookmarks-count-badge').forEach((badge) => {
      badge.textContent = String(bookmarks.length);
      badge.setAttribute('aria-label', `${bookmarks.length} فقرة محفوظة`);
    });
    const count = document.getElementById('savedCount');
    if (count) count.textContent = String(bookmarks.length);
    const summary = document.getElementById('savedSummary');
    if (summary) {
      summary.textContent = bookmarks.length
        ? `لديك ${bookmarks.length} فقرة محفوظة من صفحات المقرر.`
        : 'لم تحفظ أي فقرة بعد.';
    }
  }

  function showToast(message) {
    let toast = document.querySelector('.bookmark-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'bookmark-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  function findSectionTitle(paragraph) {
    const article = paragraph.closest('article');
    const localHeading = article?.querySelector('h3');
    if (localHeading) return normalizeText(localHeading.textContent);
    const section = paragraph.closest('section');
    const sectionHeading = section?.querySelector('h2');
    if (sectionHeading) return normalizeText(sectionHeading.textContent);
    const heroHeading = document.querySelector('.hero-card h2');
    return normalizeText(heroHeading?.textContent || 'محتوى الصفحة');
  }

  function getPageTitle() {
    return normalizeText(document.querySelector('.brand__title')?.textContent || document.title.split('|')[0] || 'صفحة تعليمية');
  }

  function isSaved(id) {
    return bookmarks.some((item) => item.id === id);
  }

  function updateParagraphButton(entry) {
    const saved = isSaved(entry.item.id);
    entry.button.classList.toggle('is-saved', saved);
    entry.button.setAttribute('aria-pressed', String(saved));
    entry.button.title = saved ? 'إزالة الفقرة من المحفوظات' : 'حفظ الفقرة في المحفوظات';
    entry.button.setAttribute('aria-label', entry.button.title);
    entry.button.innerHTML = saved
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg><span>محفوظة</span>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg><span>حفظ</span>';
  }

  async function toggleBookmark(entry) {
    if (isSaved(entry.item.id)) {
      bookmarks = bookmarks.filter((item) => item.id !== entry.item.id);
      showToast('تمت إزالة الفقرة من المحفوظات');
    } else {
      bookmarks = [{ ...entry.item, savedAt: Date.now() }, ...bookmarks];
      showToast('تم حفظ الفقرة في المحفوظات');
    }
    bookmarks = await bridge.set(bookmarks);
    paragraphEntries.forEach(updateParagraphButton);
    updateCountBadges();
  }

  function initParagraphButtons() {
    const candidates = [...document.querySelectorAll('#overviewPanel p')].filter((paragraph) => {
      if (paragraph.closest('.no-bookmark, .section-heading, dialog, .bookmark-toast')) return false;
      return normalizeText(paragraph.textContent).length >= 20;
    });

    const pageTitle = getPageTitle();
    candidates.forEach((paragraph, index) => {
      if (paragraph.dataset.bookmarkReady === 'true') return;
      const text = normalizeText(paragraph.textContent);
      const id = `saved-${hashString(`${fileName}|${index}|${text}`)}`;
      paragraph.id = paragraph.id || id;
      const paragraphId = paragraph.id;
      paragraph.dataset.bookmarkReady = 'true';
      paragraph.classList.add('bookmarkable-paragraph');

      const content = document.createElement('span');
      content.className = 'bookmarkable-paragraph__content';
      while (paragraph.firstChild) content.appendChild(paragraph.firstChild);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'save-paragraph-button no-print';

      const item = {
        id: paragraphId,
        pageFile: fileName,
        pageTitle,
        sectionTitle: findSectionTitle(paragraph),
        text,
        savedAt: Date.now()
      };
      const entry = { paragraph, button, item };
      paragraphEntries.push(entry);
      updateParagraphButton(entry);
      button.addEventListener('click', () => toggleBookmark(entry));

      paragraph.append(button, content);
    });

    const target = location.hash ? document.querySelector(location.hash) : null;
    if (target?.classList.contains('bookmarkable-paragraph')) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }

  function formatDate(timestamp) {
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date(timestamp));
    } catch (_) {
      return '';
    }
  }

  function renderSavedPage() {
    const list = document.getElementById('savedItems');
    const empty = document.getElementById('savedEmpty');
    const searchInput = document.getElementById('savedSearch');
    const sortSelect = document.getElementById('savedSort');
    if (!list || !empty) return;

    const render = () => {
      const query = normalizeText(searchInput?.value).toLowerCase();
      let filtered = bookmarks.filter((item) => {
        const haystack = `${item.pageTitle} ${item.sectionTitle} ${item.text}`.toLowerCase();
        return !query || haystack.includes(query);
      });

      if (sortSelect?.value === 'page') {
        filtered.sort((a, b) => a.pageFile.localeCompare(b.pageFile, 'ar', { numeric: true }) || a.savedAt - b.savedAt);
      } else if (sortSelect?.value === 'oldest') {
        filtered.sort((a, b) => a.savedAt - b.savedAt);
      } else {
        filtered.sort((a, b) => b.savedAt - a.savedAt);
      }

      list.innerHTML = '';
      empty.hidden = filtered.length !== 0;
      document.getElementById('visibleSavedCount').textContent = String(filtered.length);

      filtered.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'saved-item-card';
        card.dataset.id = item.id;

        const top = document.createElement('div');
        top.className = 'saved-item-card__top';
        const meta = document.createElement('div');
        meta.className = 'saved-item-card__meta';
        const page = document.createElement('strong');
        page.textContent = item.pageTitle;
        const section = document.createElement('span');
        section.textContent = item.sectionTitle;
        meta.append(page, section);
        const date = document.createElement('time');
        date.dateTime = new Date(item.savedAt).toISOString();
        date.textContent = formatDate(item.savedAt);
        top.append(meta, date);

        const text = document.createElement('p');
        text.className = 'saved-item-card__text no-bookmark';
        text.textContent = item.text;

        const actions = document.createElement('div');
        actions.className = 'saved-item-card__actions';
        const open = document.createElement('a');
        open.className = 'saved-open-link';
        open.href = `${item.pageFile}#${item.id}`;
        open.textContent = 'فتح الفقرة في الصفحة';
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'saved-remove-button';
        remove.textContent = 'إزالة';
        remove.addEventListener('click', async () => {
          bookmarks = bookmarks.filter((bookmark) => bookmark.id !== item.id);
          bookmarks = await bridge.set(bookmarks);
          updateCountBadges();
          render();
          showToast('تمت إزالة الفقرة من المحفوظات');
        });
        actions.append(open, remove);
        card.append(top, text, actions);
        list.appendChild(card);
      });
    };

    searchInput?.addEventListener('input', render);
    sortSelect?.addEventListener('change', render);
    document.getElementById('clearSavedBtn')?.addEventListener('click', async () => {
      if (!bookmarks.length) return;
      if (!window.confirm('هل تريد حذف جميع الفقرات المحفوظة؟')) return;
      bookmarks = await bridge.set([]);
      updateCountBadges();
      render();
      showToast('تم حذف جميع المحفوظات');
    });
    render();
  }

  async function init() {
    ensureNavLink();
    bookmarks = await bridge.get();
    updateCountBadges();
    if (isContentPage) initParagraphButtons();
    if (isSavedPage) renderSavedPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
