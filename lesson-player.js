(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const unitId = params.get('unit');
  const requestedLessonId = params.get('lesson');
  const requestedMode = params.get('mode');
  const mode = requestedMode === 'checkpoint' ? 'checkpoint' : (requestedMode === 'review' ? 'review' : 'lesson');
  const forceNew = params.get('new') === '1';
  const progress = window.LearningProgress;
  const course = window.ORAL_HEALTH_COURSE;
  const questions = course.questionBank;
  const unit = progress.getUnit(unitId);
  const stage = document.getElementById('lessonStage');
  const printView = document.getElementById('lessonPrintView');
  const primary = document.getElementById('lessonPrimary');
  const previous = document.getElementById('lessonPrev');
  const feedback = document.getElementById('lessonFeedback');
  const alertBox = document.getElementById('lessonAlert');
  let lesson = null;
  let steps = [];
  let index = 0;
  let selectedOriginal = null;
  let checked = false;
  let retryPending = false;
  let finished = false;
  let checkpointAttempt = null;
  let reviewAttempt = null;

  if (!unit) return showFatal('تعذر العثور على الوحدة المطلوبة.');
  if (mode === 'checkpoint') {
    if (progress.checkpointStatus(unit.id) === 'locked') return showFatal('اختبار الإتقان مقفل حتى تكمل دروس الوحدة.');
    checkpointAttempt = progress.startCheckpointAttempt(unit.id, unit.checkpoint.questionIds, forceNew);
  } else {
    lesson = progress.getLesson(requestedLessonId) || progress.firstTargetInUnit(unit.id)?.lesson || unit.lessons[0];
    if (!lesson || !unit.lessons.some((item) => item.id === lesson.id)) return showFatal('تعذر العثور على الدرس المطلوب.');
    if (mode === 'lesson' && progress.lessonStatus(lesson.id) === 'locked') return showFatal('هذا الدرس مقفل حالياً. أكمل الخطوة السابقة أولاً.');
    if (mode === 'review') {
      reviewAttempt = progress.startLessonReview(lesson.id, forceNew);
      if (!reviewAttempt.questionOrder.length) return showReviewEmpty();
    }
  }

  steps = mode === 'checkpoint' ? buildCheckpointSteps() : (mode === 'review' ? buildReviewSteps() : buildLessonSteps());
  index = initialIndex();
  buildPrintView();

  function showFatal(message) {
    document.getElementById('lessonUnitName').textContent = 'مسار التعلم';
    document.getElementById('lessonName').textContent = 'تعذر فتح المحتوى';
    stage.innerHTML = `<section class="lesson-error"><h1>${message}</h1><p>يمكنك العودة إلى المسار واختيار درس متاح.</p><a class="primary-button" href="learning-map.html">العودة إلى مسار التعلم</a></section>`;
    document.querySelector('.lesson-controls').hidden = true;
  }

  function showReviewEmpty() {
    document.getElementById('lessonUnitName').textContent = unit.title;
    document.getElementById('lessonName').textContent = 'المراجعة القصيرة';
    stage.innerHTML = '<section class="lesson-card lesson-card--finish"><span>لا توجد أخطاء معلقة</span><h1>هذا الدرس لا يحتاج إلى مراجعة حالياً</h1><div class="finish-actions"><a href="review.html">مركز المراجعة</a><a href="learning-map.html">مسار التعلم</a></div></section>';
    document.querySelector('.lesson-controls').hidden = true;
  }

  function questionSteps(ids, type = 'question') {
    return ids.map((id, idx) => ({ type, question: questions[id], number: idx + 1 })).filter((s) => s.question);
  }

  function templateKind() {
    const title = lesson.title || '';
    if (/<img\b/i.test(lesson.contentHtml || '') || /مشاهد|صورة|معالم/.test(title)) return 'image';
    if (/فرق|مقارن|أنواع|تصنيف|تمييز|شذوذ/.test(title)) return 'compare';
    if (/التهاب|مرض|نخر|قلاع|سلاق|نكاف|سرطان/.test(title)) return 'disease';
    if (/مصطلحات|قاموس/.test(title)) return 'terms';
    return 'standard';
  }

  function buildLessonSteps() {
    const rec = progress.lessonRecord(lesson.id);
    const qSteps = questionSteps(lesson.questionIds, 'question');
    let base;
    switch (templateKind()) {
      case 'image': base = [{ type: 'objective' }, { type: 'content' }, ...qSteps.slice(0, 1), { type: 'memory' }, ...qSteps.slice(1), { type: 'summary' }]; break;
      case 'compare': base = [{ type: 'objective' }, { type: 'content' }, { type: 'memory' }, ...qSteps, { type: 'summary' }]; break;
      case 'disease': base = [{ type: 'objective' }, { type: 'content' }, ...qSteps, { type: 'memory' }, { type: 'summary' }]; break;
      case 'terms': base = [{ type: 'objective' }, { type: 'memory' }, { type: 'content' }, ...qSteps, { type: 'summary' }]; break;
      default: base = [{ type: 'objective' }, { type: 'content' }, { type: 'memory' }, ...qSteps, { type: 'summary' }];
    }
    if (rec.reviewRoundStarted && rec.reviewAttempt && !rec.reviewAttempt.completed && rec.reviewAttempt.questionOrder?.length) {
      const at = Math.max(0, base.findIndex((s) => s.type === 'summary'));
      base.splice(at, 0, { type: 'review-intro' }, ...questionSteps(rec.reviewAttempt.questionOrder, 'review-question'));
      reviewAttempt = rec.reviewAttempt;
    }
    return base;
  }

  function buildCheckpointSteps() {
    return checkpointAttempt.questionOrder.map((id, idx) => ({ type: 'checkpoint-question', question: questions[id], number: idx + 1 }));
  }
  function buildReviewSteps() {
    return [{ type: 'review-intro' }, ...reviewAttempt.questionOrder.map((id, idx) => ({ type: 'review-question', question: questions[id], number: idx + 1 }))];
  }

  function initialIndex() {
    if (mode === 'checkpoint') return Math.max(0, Math.min(Number(checkpointAttempt.currentStep) || 0, steps.length - 1));
    if (mode === 'review') return 0;
    const rec = progress.lessonRecord(lesson.id);
    return Number.isInteger(rec.step) && rec.step >= 0 && rec.step < steps.length ? rec.step : 0;
  }

  function header() {
    const title = mode === 'checkpoint' ? unit.checkpoint.title : (mode === 'review' ? `مراجعة: ${lesson.title}` : lesson.title);
    document.title = `${title} | مسار التعلم`;
    document.getElementById('lessonUnitName').textContent = `${unit.moduleTitle} · الصفحة ${String(unit.pageNumber).padStart(2, '0')}`;
    document.getElementById('lessonName').textContent = title;
    document.getElementById('lessonStepCount').textContent = `${index + 1}/${Math.max(steps.length, 1)}`;
    document.getElementById('lessonProgressBar').style.width = `${((index + 1) / Math.max(steps.length, 1)) * 100}%`;
  }

  function getQuestionState(step) {
    const qid = step.question.id;
    if (mode === 'checkpoint') return { answers: checkpointAttempt.answers || {}, verified: checkpointAttempt.verified || {}, outcomes: checkpointAttempt.outcomes || {}, attempts: {} };
    if (mode === 'review' || step.type === 'review-question') {
      const attempt = mode === 'review' ? reviewAttempt : progress.lessonRecord(lesson.id).reviewAttempt;
      return { answers: attempt?.answers || {}, verified: attempt?.verified || {}, outcomes: attempt?.outcomes || {}, attempts: {} };
    }
    const rec = progress.lessonRecord(lesson.id);
    return { answers: rec.answers || {}, verified: rec.verified || {}, outcomes: rec.outcomes || {}, attempts: rec.questionAttempts || {} };
  }

  function optionOrder(step) {
    const q = step.question;
    if (!q.options) return [];
    if (mode === 'checkpoint') return checkpointAttempt.optionOrders[q.id] || q.options.map((_, i) => i);
    if (mode === 'review' || step.type === 'review-question') {
      const attempt = mode === 'review' ? reviewAttempt : progress.lessonRecord(lesson.id).reviewAttempt;
      return attempt?.optionOrders?.[q.id] || q.options.map((_, i) => i);
    }
    return progress.ensureLessonOptionOrder(lesson.id, q.id, q.options.length, false, false);
  }

  function questionMarkup(step, savedOriginal) {
    const q = step.question;
    if (!q) return '<p>لا يوجد سؤال مرتبط بهذه الخطوة.</p>';
    if (q.flashAnswer) {
      return `<div class="lesson-question"><span class="question-type">${q.type}</span><h2>${q.prompt}</h2><button class="flash-reveal" id="flashReveal" type="button">إظهار الجواب</button><div class="flash-answer" id="flashAnswer" hidden>${q.flashAnswer}</div><div class="self-assess" id="selfAssess" hidden><button type="button" data-self="0">أتقنتها</button><button type="button" data-self="1">أحتاج مراجعتها</button></div></div>`;
    }
    const order = optionOrder(step);
    const options = order.map((originalIdx, displayIdx) => `<button type="button" class="lesson-option ${savedOriginal === originalIdx ? 'is-selected' : ''}" data-option-original="${originalIdx}"><span>${['أ','ب','ج','د','هـ'][displayIdx] || displayIdx + 1}</span><strong>${q.options[originalIdx]}</strong></button>`).join('');
    return `<div class="lesson-question"><span class="question-type">${q.type}</span><h2>${q.prompt}</h2><div class="lesson-options">${options}</div></div>`;
  }

  function render() {
    header(); selectedOriginal = null; checked = false; retryPending = false;
    feedback.textContent = ''; feedback.className = 'lesson-feedback'; previous.disabled = index === 0;
    const step = steps[index];
    if (!step) return showFatal('تعذر استعادة خطوة الدرس.');
    if (step.type === 'objective') {
      stage.innerHTML = `<section class="lesson-card lesson-card--objective"><span>هدف الدرس</span><h1>${lesson.objective}</h1><p>الوقت المتوقع: ${lesson.estimatedMinutes} دقائق · ${lesson.questionIds.length} أنشطة</p></section>`;
      primary.textContent = 'ابدأ'; primary.disabled = false;
    } else if (step.type === 'content') {
      stage.innerHTML = `<section class="lesson-card lesson-card--content"><header><span>الفكرة الأساسية</span><h1>${lesson.title}</h1></header><div class="lesson-source-content">${lesson.contentHtml}</div><a class="lesson-reference-link" href="${unit.referenceFile}">فتح المرجع العلمي الكامل</a></section>`;
      primary.textContent = 'متابعة'; primary.disabled = false;
    } else if (step.type === 'memory') {
      stage.innerHTML = `<section class="lesson-card lesson-card--memory"><span>نقطة تذكّر</span><h1>${lesson.memoryPoint}</h1><p>ركّز على هذه الفكرة قبل متابعة النشاط.</p></section>`;
      primary.textContent = 'متابعة'; primary.disabled = false;
    } else if (step.type === 'review-intro') {
      stage.innerHTML = '<section class="lesson-card lesson-card--memory"><span>جولة أخطاء قصيرة</span><h1>أعد الأسئلة التي احتاجت تثبيتاً</h1><p>لن تعيد محتوى الدرس كاملاً. صحّح النقاط المتبقية ثم تابع.</p></section>';
      primary.textContent = 'بدء المراجعة'; primary.disabled = false;
    } else if (['question','checkpoint-question','review-question'].includes(step.type)) {
      const state = getQuestionState(step);
      selectedOriginal = Number.isInteger(state.answers[step.question.id]) ? state.answers[step.question.id] : null;
      const counter = step.type === 'checkpoint-question' ? `<div class="checkpoint-counter">السؤال ${step.number} من ${steps.length}</div>` : (step.type === 'review-question' ? `<div class="checkpoint-counter">مراجعة ${step.number}</div>` : '');
      stage.innerHTML = `<section class="lesson-card lesson-card--question">${counter}${questionMarkup(step, selectedOriginal)}</section>`;
      bindQuestion(step);
      if (state.verified[step.question.id]) {
        checked = true; applyVerifiedVisual(step, state.outcomes[step.question.id] === true, selectedOriginal);
        primary.textContent = index === steps.length - 1 ? finishButtonText() : 'متابعة'; primary.disabled = false;
      } else {
        primary.textContent = 'تحقق من الإجابة'; primary.disabled = selectedOriginal === null;
      }
    } else if (step.type === 'summary') {
      stage.innerHTML = `<section class="lesson-card lesson-card--summary"><span>خلاصة الدرس</span><h1>ثبت أهم النقاط</h1><ul>${lesson.summary.map((item) => `<li>${item}</li>`).join('')}</ul><a class="lesson-reference-link" href="${unit.referenceFile}">فتح المرجع الكامل</a></section>`;
      primary.textContent = 'إنهاء الدرس'; primary.disabled = false;
    }
    if (mode === 'lesson') progress.saveLessonProgress(lesson.id, { status: index > 0 ? 'in_progress' : progress.lessonRecord(lesson.id).status, step: index });
    if (mode === 'checkpoint') { checkpointAttempt = progress.saveCheckpointAttempt(unit.id, { currentStep: index }); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindQuestion(step) {
    const reveal = document.getElementById('flashReveal');
    if (reveal) {
      reveal.addEventListener('click', () => {
        document.getElementById('flashAnswer').hidden = false; document.getElementById('selfAssess').hidden = false; reveal.hidden = true;
      });
      document.querySelectorAll('[data-self]').forEach((button) => button.addEventListener('click', () => {
        if (checked) return; selectedOriginal = Number(button.dataset.self);
        document.querySelectorAll('[data-self]').forEach((b) => b.classList.toggle('is-selected', b === button)); primary.disabled = false;
      }));
    }
    document.querySelectorAll('[data-option-original]').forEach((button) => button.addEventListener('click', () => {
      if (checked) return; selectedOriginal = Number(button.dataset.optionOriginal);
      document.querySelectorAll('[data-option-original]').forEach((b) => b.classList.toggle('is-selected', b === button)); primary.disabled = false;
    }));
  }

  function applyVerifiedVisual(step, isCorrect, selected) {
    const q = step.question;
    feedback.className = `lesson-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    feedback.textContent = `${isCorrect ? 'إجابة صحيحة. ' : 'راجع هذه النقطة. '}${q.explanation || ''}`;
    document.querySelectorAll('[data-option-original]').forEach((button) => {
      button.disabled = true; const value = Number(button.dataset.optionOriginal);
      if (value === q.correct) button.classList.add('is-correct');
      if (value === selected && !isCorrect) button.classList.add('is-wrong');
    });
    document.querySelectorAll('[data-self]').forEach((button) => { button.disabled = true; });
  }

  function saveQuestionResult(step, isCorrect, verified, attempts) {
    const qid = step.question.id;
    if (mode === 'checkpoint') {
      const wrong = new Set(checkpointAttempt.wrongQuestionIds || []); isCorrect ? wrong.delete(qid) : wrong.add(qid);
      checkpointAttempt = progress.saveCheckpointAttempt(unit.id, { answers: { [qid]: selectedOriginal }, outcomes: { [qid]: isCorrect }, verified: { [qid]: verified }, wrongQuestionIds: [...wrong], currentStep: index });
      return;
    }
    if (mode === 'review' || step.type === 'review-question') {
      progress.saveReviewAnswer(lesson.id, qid, { answers: { [qid]: selectedOriginal }, outcomes: { [qid]: isCorrect }, verified: { [qid]: verified } });
      reviewAttempt = progress.lessonRecord(lesson.id).reviewAttempt;
      return;
    }
    const rec = progress.lessonRecord(lesson.id); const wrong = new Set(rec.wrongQuestionIds || []);
    isCorrect ? wrong.delete(qid) : wrong.add(qid);
    progress.saveLessonProgress(lesson.id, { answers: { [qid]: selectedOriginal }, outcomes: { [qid]: isCorrect }, verified: { [qid]: verified }, questionAttempts: { [qid]: attempts }, wrongQuestionIds: [...wrong] });
  }

  function verify() {
    const step = steps[index]; const q = step?.question;
    if (!q || selectedOriginal === null) return;
    const isCorrect = q.flashAnswer ? selectedOriginal === 0 : selectedOriginal === q.correct;
    const isReviewQuestion = mode === 'review' || step.type === 'review-question';
    const rec = progress.lessonRecord(lesson?.id || '');
    const attempts = Number(rec.questionAttempts?.[q.id] || 0) + 1;
    if (!isCorrect && mode === 'lesson' && !isReviewQuestion && !q.flashAnswer && attempts < 2) {
      saveQuestionResult(step, false, false, attempts);
      feedback.className = 'lesson-feedback is-wrong'; feedback.textContent = 'الإجابة غير صحيحة. حاول مرة ثانية قبل إظهار الحل.';
      retryPending = true; primary.textContent = 'أعد المحاولة'; primary.disabled = false; return;
    }
    checked = true; saveQuestionResult(step, isCorrect, true, attempts);
    applyVerifiedVisual(step, isCorrect, selectedOriginal);
    primary.textContent = index === steps.length - 1 ? finishButtonText() : 'متابعة'; primary.disabled = false;
  }

  function finishButtonText() { return mode === 'checkpoint' ? 'عرض النتيجة' : (mode === 'review' ? 'إنهاء المراجعة' : 'متابعة'); }

  function resetForRetry() {
    selectedOriginal = null; checked = false; retryPending = false;
    const step = steps[index];
    if (mode === 'lesson') progress.saveLessonProgress(lesson.id, { answers: { [step.question.id]: null }, verified: { [step.question.id]: false } });
    render();
  }

  function maybeInjectReviewRound() {
    if (mode !== 'lesson') return false;
    const next = steps[index + 1]; if (!next || next.type !== 'summary') return false;
    const rec = progress.lessonRecord(lesson.id); const wrong = rec.wrongQuestionIds || [];
    if (!wrong.length || rec.reviewRoundStarted) return false;
    reviewAttempt = progress.startLessonReview(lesson.id, true);
    progress.saveLessonProgress(lesson.id, { reviewRoundStarted: true, reviewAttempt });
    const insert = [{ type: 'review-intro' }, ...questionSteps(wrong, 'review-question')];
    steps.splice(index + 1, 0, ...insert); return true;
  }

  function lessonOutcome() {
    const rec = progress.lessonRecord(lesson.id); const review = rec.reviewAttempt;
    const outcomes = { ...(rec.outcomes || {}), ...(review?.outcomes || {}) };
    const unique = [...new Set(lesson.questionIds)];
    const correct = unique.filter((id) => outcomes[id] === true).length;
    const wrong = unique.filter((id) => outcomes[id] !== true);
    return { score: Math.round((correct / Math.max(unique.length, 1)) * 100), correct, total: unique.length, wrong };
  }

  function finishLesson() {
    finished = true; const result = lessonOutcome();
    if (progress.lessonRecord(lesson.id).reviewAttempt) progress.completeLessonReview(lesson.id);
    progress.completeLesson(lesson.id, result.score, result.wrong);
    const target = progress.nextAfterLesson(lesson.id);
    const statusText = result.score >= 70 && !result.wrong.length ? 'متقن' : 'مكتمل ويحتاج مراجعة';
    stage.innerHTML = `<section class="lesson-card lesson-card--finish"><span>اكتمل الدرس</span><h1>${lesson.title}</h1><div class="finish-score">${result.score}%</div><div class="finish-stats"><strong>${result.correct}/${result.total}</strong><span>إجابات متقنة</span><strong>${result.wrong.length}</strong><span>نقاط للمراجعة</span></div><p class="finish-status">الحالة: ${statusText}</p><div class="finish-actions"><a href="${unit.referenceFile}">فتح المرجع الكامل</a>${result.wrong.length ? `<a href="lesson.html?unit=${unit.id}&lesson=${lesson.id}&mode=review&new=1">مراجعة الأخطاء</a>` : ''}<a href="learning-map.html">العودة إلى المسار</a></div></section>`;
    previous.hidden = true; feedback.textContent = '';
    primary.textContent = target.type === 'checkpoint' ? 'بدء اختبار الإتقان' : (target.type === 'complete' ? 'العودة إلى المسار' : 'الدرس التالي');
    primary.onclick = () => { location.href = progress.targetUrl(target); };
  }

  function finishReview() {
    finished = true; const updated = progress.completeLessonReview(lesson.id); const remaining = updated.wrongQuestionIds || [];
    stage.innerHTML = `<section class="lesson-card lesson-card--finish"><span>اكتملت المراجعة</span><h1>${remaining.length ? 'بقيت نقاط تحتاج تثبيتاً' : 'تم تصحيح الأخطاء المسجلة'}</h1><div class="finish-score">${remaining.length}</div><p>عدد النقاط المتبقية للمراجعة.</p><div class="finish-actions"><a href="review.html">مركز المراجعة</a><a href="learning-map.html">متابعة المسار</a><a href="${unit.referenceFile}">فتح المرجع الكامل</a></div></section>`;
    previous.hidden = true; feedback.textContent = ''; primary.textContent = 'متابعة المسار'; primary.onclick = () => { location.href = 'learning-map.html'; };
  }

  function finishCheckpoint() {
    finished = true; const attempt = progress.unitRecord(unit.id).currentAttempt || checkpointAttempt;
    const total = attempt.questionOrder.length; const correct = attempt.questionOrder.filter((id) => attempt.outcomes?.[id] === true).length;
    const wrong = attempt.questionOrder.filter((id) => attempt.outcomes?.[id] !== true);
    const score = Math.round((correct / Math.max(total, 1)) * 100);
    progress.completeCheckpoint(unit.id, score, wrong);
    const next = progress.nextAfterCheckpoint(unit.id);
    stage.innerHTML = `<section class="lesson-card lesson-card--finish"><span>نتيجة اختبار الإتقان</span><h1>${score >= 80 ? 'تم إتقان الوحدة' : 'اكتمل الاختبار وتوجد نقاط للمراجعة'}</h1><div class="finish-score">${score}%</div><div class="finish-stats"><strong>${correct}/${total}</strong><span>إجابات صحيحة</span><strong>${wrong.length}</strong><span>أخطاء</span></div><p>حد الإتقان هو ${unit.checkpoint.passScore}%، وأفضل نتيجة محفوظة.</p><div class="finish-actions"><a href="${unit.referenceFile}">فتح المرجع الكامل</a><a href="lesson.html?unit=${unit.id}&mode=checkpoint&new=1">محاولة جديدة</a><a href="review.html">مركز المراجعة</a></div></section>`;
    previous.hidden = true; feedback.textContent = '';
    primary.textContent = next.type === 'complete' ? 'العودة إلى المسار' : 'متابعة إلى الوحدة التالية'; primary.onclick = () => { location.href = progress.targetUrl(next); };
  }

  function buildPrintView() {
    if (!printView || mode !== 'lesson' || !lesson) return;
    printView.innerHTML = `<article class="print-lesson"><header><span>${unit.moduleTitle} · الصفحة ${String(unit.pageNumber).padStart(2, '0')}</span><h1>${lesson.title}</h1></header><section><h2>هدف الدرس</h2><p>${lesson.objective}</p></section><section><h2>المحتوى العلمي</h2><div class="lesson-source-content">${lesson.contentHtml}</div></section><section><h2>نقطة تذكّر</h2><p>${lesson.memoryPoint}</p></section><section><h2>الخلاصة</h2><ul>${lesson.summary.map((x) => `<li>${x}</li>`).join('')}</ul></section></article>`;
  }

  primary.addEventListener('click', () => {
    if (finished) return;
    const step = steps[index];
    if (retryPending) { resetForRetry(); return; }
    if (['question','checkpoint-question','review-question'].includes(step.type) && !checked) { verify(); return; }
    if (maybeInjectReviewRound()) { index += 1; render(); return; }
    if (index < steps.length - 1) { index += 1; render(); return; }
    if (mode === 'checkpoint') finishCheckpoint(); else if (mode === 'review') finishReview(); else finishLesson();
  });
  previous.addEventListener('click', () => { if (index > 0) { index -= 1; render(); } });
  window.addEventListener('beforeunload', () => {
    if (finished) return;
    if (mode === 'lesson') progress.saveLessonProgress(lesson.id, { status: 'in_progress', step: index });
    if (mode === 'checkpoint') progress.saveCheckpointAttempt(unit.id, { currentStep: index });
  });

  render();
})();
