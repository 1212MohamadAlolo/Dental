(() => {
  'use strict';

  const fileName = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const isLesson = fileName === 'index.html' || /^page-\d{2}\.html$/i.test(fileName);
  if (!isLesson) return;

  const STORAGE_KEY = `oral-health-learning-mode-v1:${fileName}`;
  const descriptions = {
    reading: 'قراءة هادئة للمحتوى والصور والجداول دون أدوات إضافية.',
    study: 'أسئلة وبطاقات تذكّر واختبار ذاتي لترسيخ المعلومات.',
    summary: 'الكتابة بالقلم والتحديد وإعداد ملخص قابل للحفظ والطباعة.'
  };

  function allTabs() { return [...document.querySelectorAll('.mode-tab')]; }

  function persistMode(mode) {
    // وضع القلم مؤقت بطبيعته. لا نعيد فتح الصفحة داخله بعد التحديث أو إغلاق المتصفح.
    const safeMode = mode === 'study' ? 'study' : 'reading';
    try { localStorage.setItem(STORAGE_KEY, safeMode); } catch (_) {}
  }

  function setActiveTab(mode) {
    allTabs().forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }

  function setPanels(mode) {
    const overview = document.getElementById('overviewPanel');
    const study = document.getElementById('studyPanel');
    if (overview) {
      overview.hidden = mode === 'study';
      overview.setAttribute('aria-labelledby', mode === 'summary' ? 'summaryTab' : 'overviewTab');
    }
    if (study) study.hidden = mode !== 'study';
  }

  function inkApi() {
    return window.OralHealthInk || null;
  }

  function leaveInkSilently() {
    const api = inkApi();
    if (api?.isActive?.()) api.exit({ silent: true });
    else document.body.classList.remove('ink-mode');
  }

  function applyMode(mode, options = {}) {
    if (!['reading', 'study', 'summary'].includes(mode)) mode = 'reading';

    if (mode === 'summary') {
      setPanels('reading');
      const api = inkApi();
      if (api?.enter) api.enter({ silent: Boolean(options.silent) });
      else document.body.classList.add('ink-mode');
    } else {
      leaveInkSilently();
      setPanels(mode);
    }

    document.body.dataset.learningMode = mode;
    setActiveTab(mode);
    const note = document.querySelector('.mode-status-note');
    if (note) note.textContent = descriptions[mode];
    persistMode(mode);

    if (options.scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    document.dispatchEvent(new CustomEvent('oral-health:mode-change', { detail: { mode } }));
  }

  function createSummaryTab(container) {
    if (container.querySelector('[data-mode="summary"]')) return;
    const tab = document.createElement('button');
    tab.className = 'mode-tab';
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.id = 'summaryTab';
    tab.dataset.mode = 'summary';
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'overviewPanel');
    tab.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.4-10.4-3.2-3.2L5 15.8 4 20Z"/><path d="m13.8 7 3.2 3.2M4 20h5"/></svg>
      <span><strong>التلخيص والقلم</strong><small class="mode-tab__hint">كتابة · تحديد · PDF</small></span>`;
    container.appendChild(tab);
  }

  function improveExistingTabs(container) {
    const reading = container.querySelector('[data-mode="overview"]');
    const study = container.querySelector('[data-mode="study"]');
    if (reading) {
      reading.dataset.mode = 'reading';
      reading.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/></svg>
        <span><strong>القراءة</strong><small class="mode-tab__hint">محتوى وصور</small></span>`;
    }
    if (study) {
      study.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-5 9 5-9 5-9-5Zm4 3v4c3 2 7 2 10 0v-4"/></svg>
        <span><strong>الدراسة</strong><small class="mode-tab__hint">أسئلة وتذكّر</small></span>`;
    }
  }

  function init() {
    const switcher = document.querySelector('.mode-switch');
    const container = switcher?.querySelector('.mode-switch__inner');
    if (!switcher || !container) return;

    improveExistingTabs(container);
    createSummaryTab(container);
    document.documentElement.classList.add('mode-system-ready');

    let note = switcher.querySelector('.mode-status-note');
    if (!note) {
      note = document.createElement('p');
      note.className = 'mode-status-note shell';
      note.setAttribute('aria-live', 'polite');
      switcher.appendChild(note);
    }

    container.addEventListener('click', (event) => {
      const tab = event.target.closest('.mode-tab');
      if (!tab) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      applyMode(tab.dataset.mode, { scroll: true });
    }, true);

    container.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      const tabs = allTabs();
      const current = Math.max(0, tabs.indexOf(document.activeElement));
      let next = current;
      if (event.key === 'ArrowRight') next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowLeft') next = (current + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });

    let saved = 'reading';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'reading'; } catch (_) {}
    // حماية من الحبس داخل وضع التلخيص بسبب جلسة سابقة أو نسخة قديمة من المشروع.
    if (saved === 'summary' || !['reading', 'study'].includes(saved)) {
      saved = 'reading';
      persistMode('reading');
    }
    applyMode(saved, { silent: true });
  }

  window.OralHealthLearningModes = {
    apply: (mode, options = {}) => applyMode(mode, options),
    current: () => document.body.dataset.learningMode || 'reading'
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
