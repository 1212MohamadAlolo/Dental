(() => {
  'use strict';
  const pages = window.LEARNING_MAP_PAGES || [];
  const MAP_KEY = 'oral-health-learning-map-v1';
  const progressKeys = { 1: 'maxilla-page-01-progress-v1', 2: 'mandible-page-02-progress-v1', 3: 'oral-mucosa-page-03-progress-v1' };
  for (let page = 4; page <= 17; page += 1) progressKeys[page] = `oral-anatomy-page-${String(page).padStart(2, '0')}-progress-v1`;
  const labels = { not_started: 'لم يبدأ', in_progress: 'قيد الدراسة', complete: 'مكتمل', review: 'يحتاج مراجعة', mastered: 'متقن' };
  const colors = { not_started: '#8b9995', in_progress: '#c78545', complete: '#4d8bab', review: '#c05a58', mastered: '#3d9171' };

  function readJSON(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (_) { return fallback; }
  }
  let map = readJSON(MAP_KEY, {});
  const result = readJSON('oral-course-comprehensive-exam-result-v4', null) || readJSON('oral-course-comprehensive-exam-result-v3', null);

  function pageExamPercent(page) {
    if (!result?.details) return null;
    const rows = result.details.filter((item) => item.page === page);
    if (!rows.length) return null;
    return Math.round((rows.filter((item) => item.isCorrect).length / rows.length) * 100);
  }
  function pageProgress(page) {
    const state = readJSON(progressKeys[page], null);
    if (!state?.answers || !Array.isArray(state.answers)) return { answered: 0, total: 0, pct: 0 };
    const answered = state.answers.filter((value) => value !== null).length;
    return { answered, total: state.answers.length, pct: state.answers.length ? Math.round((answered / state.answers.length) * 100) : 0 };
  }
  function autoStatus(page) {
    const saved = map[page] || {};
    const progress = pageProgress(page);
    const exam = pageExamPercent(page);
    if (exam !== null && exam >= 85) return 'mastered';
    if (exam !== null && exam < 60) return 'review';
    if (progress.total && progress.answered === progress.total) return 'complete';
    if (progress.answered > 0 || saved.visited) return 'in_progress';
    return 'not_started';
  }
  function status(page) { return map[page]?.manual || autoStatus(page); }
  function persist() { try { localStorage.setItem(MAP_KEY, JSON.stringify(map)); } catch (_) {} }

  function render() {
    const groups = document.getElementById('mapGroups');
    groups.innerHTML = '';
    const grouped = pages.reduce((result, page) => {
      (result[page.group] ??= []).push(page);
      return result;
    }, {});
    const counts = { not_started: 0, in_progress: 0, complete: 0, review: 0, mastered: 0 };
    Object.entries(grouped).forEach(([name, items]) => {
      const section = document.createElement('section');
      section.className = 'map-group';
      section.innerHTML = `<div class="map-group__heading"><h3>${name}</h3><span>${items.length} صفحات</span></div><div class="map-grid"></div>`;
      const grid = section.querySelector('.map-grid');
      items.forEach((page) => {
        const currentStatus = status(page.page);
        counts[currentStatus] += 1;
        const progress = pageProgress(page.page);
        const exam = pageExamPercent(page.page);
        const visual = currentStatus === 'mastered' ? 100 : currentStatus === 'review' ? (exam ?? progress.pct) : currentStatus === 'complete' ? 100 : progress.pct;
        const card = document.createElement('article');
        card.className = 'map-card';
        card.style.setProperty('--status-color', colors[currentStatus]);
        card.innerHTML = `<div class="map-card__top"><span class="map-card__number">${String(page.page).padStart(2, '0')}</span><span class="map-status">${labels[currentStatus]}</span></div><h4>${page.title}</h4><div class="map-card__progress"><span style="width:${visual}%"></span></div><div class="map-card__meta">${progress.total ? `أسئلة الصفحة: ${progress.answered}/${progress.total}` : 'لم تُسجل إجابات بعد'}${exam !== null ? ` · الاختبار الشامل: ${exam}%` : ''}</div><div class="map-card__actions"><a href="${page.file}">فتح الصفحة</a><select aria-label="تعديل حالة الصفحة ${page.page}"><option value="auto">تلقائي</option><option value="not_started">لم يبدأ</option><option value="in_progress">قيد الدراسة</option><option value="complete">مكتمل</option><option value="review">يحتاج مراجعة</option><option value="mastered">متقن</option></select></div>`;
        const select = card.querySelector('select');
        select.value = map[page.page]?.manual || 'auto';
        select.addEventListener('change', () => {
          map[page.page] = map[page.page] || {};
          if (select.value === 'auto') delete map[page.page].manual;
          else map[page.page].manual = select.value;
          persist();
          render();
        });
        grid.appendChild(card);
      });
      groups.appendChild(section);
    });
    document.getElementById('notStartedStat').textContent = counts.not_started;
    document.getElementById('inProgressStat').textContent = counts.in_progress;
    document.getElementById('completeStat').textContent = counts.complete;
    document.getElementById('reviewStat').textContent = counts.review;
    document.getElementById('masteredStat').textContent = counts.mastered;
    const weighted = counts.mastered + counts.complete + counts.in_progress * 0.5;
    document.getElementById('mapProgressBar').style.width = `${Math.round((weighted / pages.length) * 100)}%`;
    renderContinue();
  }
  function renderContinue() {
    const visited = pages.map((page) => ({ page, last: map[page.page]?.lastVisited || 0 })).sort((a, b) => b.last - a.last)[0];
    const box = document.getElementById('continueCard');
    if (!visited?.last) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `<div><strong>متابعة من آخر صفحة</strong><span> ${String(visited.page.page).padStart(2, '0')} · ${visited.page.title}</span></div><a href="${visited.page.file}">متابعة الدراسة</a>`;
  }
  render();
})();
