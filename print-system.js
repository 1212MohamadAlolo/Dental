(() => {
  'use strict';

  const state = {
    active: false,
    originalOverviewHidden: null,
    originalStudyHidden: null,
    originalImageLoading: new Map(),
    originalTheme: null,
    originalImagesHidden: false
  };

  const toothSvg = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 9c8-5 18-5 26 0 3 2 4 6 3 10l-5 17c-1 4-5 5-8 2l-3-4-3 4c-3 3-7 2-8-2L8 19c-1-4 0-8 3-10Z"/><path d="M18 12c4-2 8-2 12 0"/></svg>';

  function lessonNumber() {
    const pill = document.querySelector('.page-pill')?.textContent?.trim();
    if (pill) return pill;
    const file = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    const number = file === 'index.html' ? '01' : file.match(/^page-(\d{2})\.html$/)?.[1];
    return number ? `الصفحة ${number}` : 'درس تعليمي';
  }

  function ensurePrintIdentity() {
    const main = document.querySelector('main.page-main');
    const overview = document.getElementById('overviewPanel');
    if (!main || !overview) return;

    if (!document.querySelector('.print-masthead')) {
      const title = document.querySelector('.brand__title')?.textContent?.trim() || document.title.split('|')[0].trim();
      const course = document.querySelector('.brand__eyebrow')?.textContent?.trim() || 'تشريح الفم والأسنان';
      const description = document.querySelector('meta[name="description"]')?.content?.trim() || 'مادة تعليمية مرتبة للطباعة والمراجعة.';
      const header = document.createElement('header');
      header.className = 'print-masthead';
      header.setAttribute('aria-hidden', 'true');
      header.innerHTML = `
        <div class="print-masthead__brand">
          <span class="print-masthead__mark">${toothSvg}</span>
          <span>${escapeHtml(course)}</span>
        </div>
        <div class="print-masthead__meta"><span class="print-masthead__pill">${escapeHtml(lessonNumber())}</span><span>A4</span></div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>`;
      main.insertBefore(header, overview);
    }

  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function warmPrintAssets() {
    document.querySelectorAll('#overviewPanel img[src]').forEach((image) => {
      if (image.complete && image.naturalWidth > 0) return;
      const preloader = new Image();
      preloader.decoding = 'async';
      preloader.src = image.currentSrc || image.src;
    });
  }

  function showPreparingToast() {
    let toast = document.querySelector('.print-preparing-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'print-preparing-toast no-print';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<span class="print-preparing-toast__spinner" aria-hidden="true"></span><strong>جارٍ تجهيز الدرس للطباعة بصيغة A4…</strong>';
      document.body.appendChild(toast);
    }
    toast.hidden = false;
  }

  function hidePreparingToast() {
    const toast = document.querySelector('.print-preparing-toast');
    if (toast) toast.hidden = true;
  }

  function prepareSynchronously() {
    if (state.active) return;
    state.active = true;

    ensurePrintIdentity();
    document.body.classList.add('is-printing');
    document.body.setAttribute('aria-busy', 'true');

    const overview = document.getElementById('overviewPanel');
    const study = document.getElementById('studyPanel');
    state.originalOverviewHidden = overview ? overview.hidden : null;
    state.originalStudyHidden = study ? study.hidden : null;
    if (overview) overview.hidden = false;
    if (study) study.hidden = true;

    state.originalTheme = document.documentElement.dataset.theme || '';
    state.originalImagesHidden = document.documentElement.classList.contains('images-hidden');
    document.documentElement.dataset.theme = 'light';
    document.documentElement.classList.remove('images-hidden');
    document.documentElement.classList.add('print-force-images');

    const openDialog = document.querySelector('dialog[open]');
    if (openDialog && typeof openDialog.close === 'function') openDialog.close();

    document.querySelectorAll('#overviewPanel img').forEach((image) => {
      state.originalImageLoading.set(image, image.getAttribute('loading'));
      image.setAttribute('loading', 'eager');
      image.setAttribute('decoding', 'sync');
    });
  }

  async function waitForAssets() {
    const imagePromises = [...document.querySelectorAll('#overviewPanel img')].map((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return typeof image.decode === 'function' ? image.decode().catch(() => undefined) : Promise.resolve();
      }
      return new Promise((resolve) => {
        const done = () => resolve();
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      });
    });

    const fontsPromise = document.fonts?.ready || Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 4500));
    await Promise.race([Promise.all([fontsPromise, ...imagePromises]), timeout]);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function cleanup() {
    if (!state.active) return;

    const overview = document.getElementById('overviewPanel');
    const study = document.getElementById('studyPanel');
    if (overview && state.originalOverviewHidden !== null) overview.hidden = state.originalOverviewHidden;
    if (study && state.originalStudyHidden !== null) study.hidden = state.originalStudyHidden;

    state.originalImageLoading.forEach((value, image) => {
      if (value === null) image.removeAttribute('loading');
      else image.setAttribute('loading', value);
      image.setAttribute('decoding', 'async');
    });
    state.originalImageLoading.clear();

    if (state.originalTheme) document.documentElement.dataset.theme = state.originalTheme;
    else delete document.documentElement.dataset.theme;
    document.documentElement.classList.toggle('images-hidden', state.originalImagesHidden);
    document.documentElement.classList.remove('print-force-images');
    document.body.classList.remove('is-printing');
    document.body.removeAttribute('aria-busy');
    hidePreparingToast();
    state.active = false;
  }

  async function printLesson() {
    if (state.active) return;
    showPreparingToast();
    prepareSynchronously();
    await waitForAssets();
    hidePreparingToast();
    window.print();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('#printBtn');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    printLesson();
  }, true);

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      event.stopImmediatePropagation();
      printLesson();
    }
  }, true);

  window.addEventListener('beforeprint', prepareSynchronously);
  window.addEventListener('afterprint', cleanup);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensurePrintIdentity, { once: true });
  } else {
    ensurePrintIdentity();
  }

  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) requestIdleCallback(warmPrintAssets, { timeout: 2500 });
    else setTimeout(warmPrintAssets, 900);
  }, { once: true });

  window.OralHealthPrint = { print: printLesson };
})();
