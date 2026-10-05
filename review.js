(() => {
  'use strict';
  const progress = window.LearningProgress;
  const root = document.getElementById('reviewList');
  const items = progress.reviewQueue();
  document.getElementById('reviewTotal').textContent = items.length;
  if (!items.length) {
    root.innerHTML = '<section class="review-empty"><h2>لا توجد نقاط ضعيفة معلقة</h2><p>تابع مسار التعلم، وستظهر هنا الدروس التي تحتاج مراجعة فقط.</p><a class="primary-button" href="learning-map.html">متابعة مسار التعلم</a></section>';
    return;
  }
  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'review-card';
    if (item.type === 'lesson') {
      const href = `lesson.html?unit=${encodeURIComponent(item.unit.id)}&lesson=${encodeURIComponent(item.lesson.id)}&mode=review&new=1`;
      card.innerHTML = `<div><span>${item.unit.title}</span><h2>${item.lesson.title}</h2><p>${item.wrongQuestionIds.length} أسئلة تحتاج مراجعة · آخر نتيجة ${item.score}%</p></div><div class="review-card__actions"><a class="primary-button" href="${href}">ابدأ مراجعة قصيرة</a><a href="${item.unit.referenceFile}">فتح المرجع الكامل</a></div>`;
    } else {
      const href = `lesson.html?unit=${encodeURIComponent(item.unit.id)}&mode=checkpoint&new=1`;
      card.innerHTML = `<div><span>اختبار إتقان</span><h2>${item.unit.title}</h2><p>${item.wrongQuestionIds.length} أخطاء · آخر نتيجة ${item.score}%</p></div><div class="review-card__actions"><a class="primary-button" href="${href}">إعادة اختبار الإتقان</a><a href="${item.unit.referenceFile}">فتح المرجع الكامل</a></div>`;
    }
    root.appendChild(card);
  });
})();
