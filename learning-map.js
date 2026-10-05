(() => {
  'use strict';
  const course = window.ORAL_HEALTH_COURSE;
  const progress = window.LearningProgress;
  const modulesRoot = document.getElementById('pathModules');
  const continueCard = document.getElementById('continueCard');
  const labels = { locked: 'مقفل', available: 'متاح', in_progress: 'قيد الدراسة', completed: 'مكتمل', mastered: 'متقن', needs_review: 'يحتاج مراجعة', not_started: 'لم يبدأ' };
  const icons = { locked: '🔒', available: '▶', in_progress: '◔', completed: '✓', mastered: '★', needs_review: '↻', not_started: '○' };

  function unitPercent(unit) {
    const lessonDone = unit.lessons.filter((lesson) => ['completed', 'mastered', 'needs_review'].includes(progress.lessonRecord(lesson.id).status)).length;
    const cpDone = ['completed', 'mastered', 'needs_review'].includes(progress.unitRecord(unit.id).checkpointStatus) ? 1 : 0;
    return Math.round(((lessonDone + cpDone) / (unit.lessons.length + 1)) * 100);
  }

  function renderContinue(target) {
    const reviewCount = progress.reviewQueue().length;
    if (target.type === 'complete') {
      continueCard.innerHTML = `<div><span>اكتمل المسار</span><strong>يمكنك الآن مراجعة الوحدات أو بدء الاختبار الشامل.</strong></div><div class="path-continue__actions"><a href="comprehensive-exam.html">فتح الاختبار الشامل</a>${reviewCount ? `<a href="review.html">مراجعة النقاط الضعيفة (${reviewCount})</a>` : ''}</div>`;
      return;
    }
    const title = target.type === 'checkpoint' ? target.unit.checkpoint.title : target.lesson.title;
    const meta = target.type === 'checkpoint' ? `اختبار صفحة ${String(target.unit.pageNumber).padStart(2, '0')}` : `${target.unit.title} · درس قصير`;
    continueCard.innerHTML = `<div><span>${meta}</span><strong>${title}</strong></div><div class="path-continue__actions"><a href="${progress.targetUrl(target)}">متابعة من حيث توقفت</a>${reviewCount ? `<a class="secondary-review-link" href="review.html">مراجعة النقاط الضعيفة (${reviewCount})</a>` : ''}</div>`;
  }

  function render() {
    progress.refresh();
    const target = progress.nextLearningTarget();
    renderContinue(target);
    document.getElementById('overallPercent').textContent = `${progress.totals().percent}%`;
    modulesRoot.innerHTML = '';
    course.modules.forEach((module, moduleIndex) => {
      const section = document.createElement('section'); section.className = 'path-module';
      const modulePercent = Math.round(module.units.reduce((sum, unit) => sum + unitPercent(unit), 0) / module.units.length);
      section.innerHTML = `<header class="path-module__head"><div><span>الوحدة الرئيسية ${String(moduleIndex + 1).padStart(2, '0')}</span><h2>${module.title}</h2><p>${module.description}</p></div><div class="path-module__percent">${modulePercent}%</div></header><div class="path-unit-list"></div>`;
      const list = section.querySelector('.path-unit-list');
      module.units.forEach((unit) => {
        const percent = unitPercent(unit);
        const isCurrent = target.type !== 'complete' && target.unit?.id === unit.id;
        const unitCard = document.createElement('article');
        unitCard.className = `path-unit ${progress.isUnitUnlocked(unit.id) ? '' : 'is-locked'} ${isCurrent ? 'is-current-unit' : ''} ${percent === 100 && !isCurrent ? 'is-collapsed' : ''}`;
        unitCard.innerHTML = `<header class="path-unit__head"><div><span>صفحة ${String(unit.pageNumber).padStart(2, '0')}</span><h3>${unit.title}</h3></div><div class="path-unit__progress"><span style="width:${percent}%"></span></div><small>${percent}%</small><button class="unit-collapse" type="button" aria-expanded="${percent === 100 && !isCurrent ? 'false' : 'true'}">${percent === 100 && !isCurrent ? 'إظهار' : 'طي'}</button></header><div class="path-unit__body"><div class="lesson-nodes"></div><div class="path-unit__links"><a href="${unit.referenceFile}">فتح المرجع الكامل</a></div></div>`;
        const nodes = unitCard.querySelector('.lesson-nodes');
        unit.lessons.forEach((lesson, index) => {
          const status = progress.lessonStatus(lesson.id);
          const node = document.createElement(status === 'locked' ? 'div' : 'a');
          node.className = `lesson-node status-${status} ${target.type === 'lesson' && target.lesson?.id === lesson.id ? 'is-current-lesson' : ''}`;
          if (status !== 'locked') node.href = `lesson.html?unit=${unit.id}&lesson=${lesson.id}`;
          node.setAttribute('aria-label', `${lesson.title} — ${labels[status]}`);
          node.innerHTML = `<span class="lesson-node__icon">${icons[status]}</span><span class="lesson-node__text"><small>الدرس ${index + 1} · ${lesson.estimatedMinutes} دقائق · ${lesson.questionIds.length} أنشطة</small><strong>${lesson.title}</strong><em>${labels[status]}</em></span>`;
          nodes.appendChild(node);
        });
        const cpStatus = progress.checkpointStatus(unit.id);
        const checkpoint = document.createElement(cpStatus === 'locked' ? 'div' : 'a');
        checkpoint.className = `lesson-node lesson-node--checkpoint status-${cpStatus} ${target.type === 'checkpoint' && target.unit?.id === unit.id ? 'is-current-lesson' : ''}`;
        if (cpStatus !== 'locked') checkpoint.href = `lesson.html?unit=${unit.id}&mode=checkpoint`;
        checkpoint.innerHTML = `<span class="lesson-node__icon">${icons[cpStatus]}</span><span class="lesson-node__text"><small>${unit.checkpoint.questionIds.length} أسئلة موضوعية</small><strong>${unit.checkpoint.title}</strong><em>${labels[cpStatus]}</em></span>`;
        nodes.appendChild(checkpoint);
        unitCard.querySelector('.unit-collapse').addEventListener('click', (event) => {
          unitCard.classList.toggle('is-collapsed'); const collapsed = unitCard.classList.contains('is-collapsed');
          event.currentTarget.textContent = collapsed ? 'إظهار' : 'طي'; event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
        });
        list.appendChild(unitCard);
      });
      modulesRoot.appendChild(section);
    });
  }
  render();
})();
