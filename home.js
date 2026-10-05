(() => {
  'use strict';
  const progress = window.LearningProgress;
  const totals = progress.totals();
  const target = progress.continueTarget();
  const continueLink = document.getElementById('homeContinue');
  continueLink.href = progress.targetUrl(target);
  continueLink.textContent = totals.percent ? 'متابعة من حيث توقفت' : 'بدء مسار التعلم';
  document.getElementById('homeProgressPercent').textContent = `${totals.percent}%`;
  document.getElementById('homeProgressRing').style.setProperty('--home-progress', `${totals.percent * 3.6}deg`);
  document.getElementById('homeProgressText').textContent = totals.percent ? `${totals.completed} من ${totals.lessons} درساً مكتملًا` : 'لم تبدأ بعد';
  const reviewItems = progress.reviewQueue();
  const reviewCount = document.getElementById('homeReviewCount');
  if (reviewCount) reviewCount.textContent = reviewItems.length;
  const reviewLink = document.getElementById('homeReviewLink');
  if (reviewLink) reviewLink.hidden = reviewItems.length === 0;
  const current = document.getElementById('homeCurrent');
  if (target.type === 'complete') {
    current.innerHTML = '<div><span>أحسنت</span><h2>أنهيت مسار التعلم</h2><p>انتقل إلى الاختبار الشامل أو راجع الوحدات التي تحتاج تثبيتاً.</p></div><a href="comprehensive-exam.html">الاختبار الشامل</a>';
  } else {
    const title = target.type === 'checkpoint' ? target.unit.checkpoint.title : target.lesson.title;
    current.innerHTML = `<div><span>خطوتك التالية</span><h2>${title}</h2><p>${target.unit.title}</p></div><a href="${progress.targetUrl(target)}">متابعة</a>`;
  }
  const resetButton = document.getElementById('resetLearningProgress');
  if (resetButton) resetButton.addEventListener('click', () => {
    if (!confirm('هل تريد إعادة ضبط تقدم مسار التعلم فقط؟ لن تُحذف إجابات الصفحات القديمة.')) return;
    progress.reset();
    location.reload();
  });
})();
