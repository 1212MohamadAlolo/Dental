(() => {
  'use strict';

  const diagrams = {
    'dentin-tooth-cross-section.webp': {
      title: 'طبقات السن والأنسجة المحيطة',
      points: [
        ['الميناء', 'Enamel', 50, 9, 'الغلاف الخارجي شديد الصلابة الذي يغطي تاج السن ويحميه.'],
        ['العاج', 'Dentin', 47, 28, 'يشكّل الكتلة الأساسية للسن ويقع تحت الميناء والملاط.'],
        ['اللب', 'Dental pulp', 48, 47, 'نسيج حي يحتوي أوعية دموية وأعصاباً ويمنح السن الحساسية.'],
        ['اللثة', 'Gingiva', 18, 43, 'نسيج رخو يحيط بعنق السن ويحمي النسج الداعمة الأعمق.'],
        ['العظم السنخي', 'Alveolar bone', 17, 68, 'العظم الذي يكوّن السنخ ويحيط بجذور الأسنان.'],
        ['الجذر', 'Root', 70, 61, 'الجزء المثبت داخل العظم ويُغطى بالملاط بدلاً من الميناء.']
      ]
    },
    'dentin-microstructure.webp': {
      title: 'البنية المجهرية للعاج',
      points: [
        ['الأنابيب العاجية', 'Dentinal tubules', 30, 48, 'قنوات مجهرية تمتد خلال العاج من اللب باتجاه المحيط.'],
        ['ألياف توماز', 'Tomes’ fibers', 67, 49, 'امتدادات خلوية داخل الأنابيب العاجية وترتبط بنقل الإحساس.']
      ]
    },
    'cementum-source-diagram.webp': {
      title: 'الملاط وعلاقته ببقية نسج السن',
      points: [
        ['الميناء', 'Enamel', 47, 10, 'يغطي تاج السن ولا يمتد عادةً على سطح الجذر.'],
        ['العاج', 'Dentin', 48, 30, 'النسيج الصلب المركزي الموجود تحت الميناء والملاط.'],
        ['اللب', 'Pulp', 50, 45, 'النسيج العصبي الوعائي داخل السن.'],
        ['الملاط', 'Cementum', 41, 65, 'طبقة رقيقة تغطي سطح الجذر وتثبت فيها ألياف الرباط حول السني.'],
        ['الرباط حول السني', 'Periodontal ligament', 30, 68, 'نسيج ليفي يصل الملاط بالعظم السنخي ويسمح بامتصاص القوى.'],
        ['العظم السنخي', 'Alveolar bone', 18, 65, 'البنية العظمية الحاضنة لجذر السن.']
      ]
    },
    'pulp-source-diagram.webp': {
      title: 'اللب والعصب ضمن مقطع السن',
      points: [
        ['حجرة اللب', 'Pulp chamber', 50, 35, 'الجزء التاجي الأوسع من الحيز اللبي.'],
        ['قناة الجذر', 'Root canal', 50, 64, 'الامتداد الضيق للّب داخل الجذر.'],
        ['العصب', 'Nerve', 57, 87, 'الألياف العصبية الداخلة من ذروة الجذر والمسؤولة عن الحس.'],
        ['الأوعية الدموية', 'Blood vessels', 43, 84, 'تغذي الخلايا والأنسجة الحية داخل اللب.'],
        ['ذروة الجذر', 'Root apex', 50, 92, 'النهاية الجذرية التي تمر عبرها الأعصاب والأوعية.']
      ]
    },
    'periodontium-overview-diagram.webp': {
      title: 'النسج الداعمة المحيطة بالسن',
      points: [
        ['اللثة', 'Gingiva', 24, 34, 'نسيج رخو واقٍ يحيط بعنق السن.'],
        ['الملاط', 'Cementum', 43, 60, 'غلاف رقيق على سطح الجذر ترتبط به ألياف الرباط.'],
        ['الرباط حول السني', 'Periodontal ligament', 34, 63, 'نسيج ليفي بين الملاط والعظم يثبت السن ويمتص القوى.'],
        ['العظم السنخي', 'Alveolar bone', 17, 68, 'العظم المحيط بجذر السن والمكوّن للسنخ.'],
        ['الميناء', 'Enamel', 50, 12, 'الغلاف الصلب لتاج السن.'],
        ['اللب', 'Pulp', 51, 42, 'النسيج الحي المركزي داخل السن.']
      ]
    },
    'gingiva-anatomy-english.webp': {
      title: 'تشريح السن واللثة والعظم',
      points: [
        ['التاج', 'Crown', 27, 20, 'الجزء الظاهر من السن فوق مستوى اللثة.'],
        ['الجذر', 'Root', 28, 68, 'الجزء المثبت داخل العظم أسفل مستوى اللثة.'],
        ['اللثة', 'Gums / Gingiva', 73, 35, 'النسيج الوردي المحيط بعنق السن.'],
        ['العظم', 'Bone', 75, 55, 'العظم السنخي الداعم للجذر.'],
        ['اللب', 'Pulp', 52, 36, 'النسيج الحي في مركز التاج.'],
        ['قناة الجذر', 'Root canal', 53, 68, 'الممر اللبي الممتد داخل الجذر.']
      ]
    },
    'alveolar-bone-arabic-diagram.webp': {
      title: 'العظم السنخي وأجزاء السن',
      points: [
        ['العظم السنخي', 'Alveolar bone', 18, 68, 'العظم الذي يحيط بالجذر ويكوّن الحفرة السنخية.'],
        ['الرباط حول السني', 'Periodontal ligament', 31, 66, 'ألياف داعمة تصل الملاط بالعظم السنخي.'],
        ['الملاط', 'Cementum', 40, 65, 'طبقة تغطي سطح الجذر وتستقبل ألياف الرباط.'],
        ['اللثة', 'Gingiva', 24, 36, 'النسيج الرخو الواقي حول عنق السن.'],
        ['العاج', 'Dentin', 48, 31, 'النسيج الصلب الأساسي تحت الميناء والملاط.'],
        ['العصب واللب', 'Pulp and nerve', 51, 50, 'النسيج العصبي الوعائي في مركز السن.']
      ]
    }
  };

  function basename(src) {
    try { return new URL(src, location.href).pathname.split('/').pop(); }
    catch (_) { return String(src).split('/').pop(); }
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function renderInfo(panel, point, kind = 'info') {
    panel.classList.remove('is-success', 'is-error');
    if (kind === 'success') panel.classList.add('is-success');
    if (kind === 'error') panel.classList.add('is-error');
    if (!point) {
      panel.innerHTML = '<span class="interactive-image-info__eyebrow">استكشاف الصورة</span><strong>اضغط على أي رقم داخل الرسم</strong><p>ستظهر تسمية الجزء ووظيفته العلمية باختصار.</p>';
      return;
    }
    panel.innerHTML = `<span class="interactive-image-info__eyebrow">${kind === 'success' ? 'إجابة صحيحة' : kind === 'error' ? 'حاول مرة أخرى' : point[1]}</span><strong>${point[0]}</strong><p>${point[4]}</p>`;
  }

  function enhance(image, definition) {
    const stage = image.parentElement;
    const figure = image.closest('figure') || stage;
    if (!stage || stage.dataset.interactiveReady === 'true') return;
    stage.dataset.interactiveReady = 'true';
    stage.classList.add('interactive-image-stage');
    figure.classList.add('interactive-science-figure');

    const tools = document.createElement('div');
    tools.className = 'interactive-image-tools no-print';
    tools.innerHTML = `
      <span class="interactive-image-tools__title">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2M8 4l-2 2M16 4l2 2"/></svg>
        صورة علمية تفاعلية
      </span>
      <div class="interactive-image-tools__actions">
        <button class="interactive-image-control labels-toggle" type="button" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
          إظهار التسميات
        </button>
        <button class="interactive-image-control quiz-toggle" type="button" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9a3 3 0 1 1 5 2c-1 .8-2 1.2-2 3"/><path d="M12 18h.01"/><circle cx="12" cy="12" r="9"/></svg>
          اختبر نفسك
        </button>
      </div>`;
    stage.before(tools);

    const layer = document.createElement('div');
    layer.className = 'science-hotspot-layer no-print';
    const buttons = definition.points.map((point, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'science-hotspot';
      button.style.setProperty('--x', `${point[2]}%`);
      button.style.setProperty('--y', `${point[3]}%`);
      button.setAttribute('aria-label', `${point[0]} — ${point[1]}`);
      button.innerHTML = `<span aria-hidden="true">${index + 1}</span><span class="science-hotspot__label">${point[0]}</span>`;
      button.dataset.index = String(index);
      if (point[2] < 40) button.classList.add('label-opposite');
      layer.appendChild(button);
      return button;
    });
    stage.appendChild(layer);

    const info = document.createElement('div');
    info.className = 'interactive-image-info no-print';
    info.setAttribute('role', 'status');
    info.setAttribute('aria-live', 'polite');
    renderInfo(info, null);
    stage.after(info);

    const labelsToggle = tools.querySelector('.labels-toggle');
    const quizToggle = tools.querySelector('.quiz-toggle');
    let quizOrder = [];
    let quizStep = 0;
    let quizLocked = false;

    function clearButtonStates() {
      buttons.forEach((button) => button.classList.remove('is-active', 'is-correct', 'is-wrong', 'is-target'));
    }

    function updateQuizPrompt() {
      clearButtonStates();
      if (quizStep >= quizOrder.length) {
        figure.classList.remove('quiz-mode');
        quizToggle.classList.remove('is-active');
        quizToggle.setAttribute('aria-pressed', 'false');
        quizToggle.lastChild.textContent = ' اختبر نفسك';
        info.innerHTML = '<span class="interactive-image-info__eyebrow">اكتمل الاختبار</span><strong>أحسنت — راجعت جميع أجزاء الصورة</strong><p>يمكنك إعادة الاختبار بترتيب جديد أو إظهار جميع التسميات.</p>';
        info.classList.add('is-success');
        return;
      }
      const target = definition.points[quizOrder[quizStep]];
      info.classList.remove('is-success', 'is-error');
      info.innerHTML = `<span class="interactive-image-info__eyebrow">اختبار الصورة · ${quizStep + 1} من ${quizOrder.length}</span><strong>حدّد موضع: ${target[0]}</strong><p>اضغط على الرقم الذي يشير إلى هذا الجزء في الرسم.</p>`;
    }

    labelsToggle.addEventListener('click', () => {
      const enabled = !figure.classList.contains('show-all-labels');
      figure.classList.toggle('show-all-labels', enabled);
      labelsToggle.classList.toggle('is-active', enabled);
      labelsToggle.setAttribute('aria-pressed', String(enabled));
      labelsToggle.lastChild.textContent = enabled ? ' إخفاء التسميات' : ' إظهار التسميات';
    });

    quizToggle.addEventListener('click', () => {
      const starting = !figure.classList.contains('quiz-mode');
      figure.classList.toggle('quiz-mode', starting);
      quizToggle.classList.toggle('is-active', starting);
      quizToggle.setAttribute('aria-pressed', String(starting));
      figure.classList.remove('show-all-labels');
      labelsToggle.classList.remove('is-active');
      labelsToggle.setAttribute('aria-pressed', 'false');
      labelsToggle.lastChild.textContent = ' إظهار التسميات';
      if (starting) {
        quizOrder = shuffle(definition.points.map((_, index) => index));
        quizStep = 0;
        quizLocked = false;
        quizToggle.lastChild.textContent = ' إنهاء الاختبار';
        updateQuizPrompt();
      } else {
        clearButtonStates();
        quizToggle.lastChild.textContent = ' اختبر نفسك';
        renderInfo(info, null);
      }
    });

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        const point = definition.points[index];
        if (!figure.classList.contains('quiz-mode')) {
          clearButtonStates();
          button.classList.add('is-active');
          renderInfo(info, point);
          return;
        }
        if (quizLocked) return;
        const expected = quizOrder[quizStep];
        if (index === expected) {
          quizLocked = true;
          button.classList.add('is-correct');
          renderInfo(info, point, 'success');
          setTimeout(() => {
            quizStep += 1;
            quizLocked = false;
            updateQuizPrompt();
          }, 850);
        } else {
          button.classList.remove('is-wrong');
          void button.offsetWidth;
          button.classList.add('is-wrong');
          info.classList.remove('is-success');
          info.classList.add('is-error');
          info.innerHTML = `<span class="interactive-image-info__eyebrow">إجابة غير صحيحة</span><strong>ليست هذه النقطة</strong><p>حاول مرة أخرى وحدّد موضع: ${definition.points[expected][0]}.</p>`;
          setTimeout(() => button.classList.remove('is-wrong'), 600);
        }
      });
    });
  }

  function init() {
    document.querySelectorAll('img[src]').forEach((image) => {
      const definition = diagrams[basename(image.getAttribute('src'))];
      if (definition) enhance(image, definition);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
