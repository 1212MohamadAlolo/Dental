(() => {
  'use strict';

  const tabs = [...document.querySelectorAll('.mode-tab')];
  const panels = {
    overview: document.getElementById('overviewPanel'),
    study: document.getElementById('studyPanel')
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      Object.entries(panels).forEach(([key, panel]) => {
        panel.hidden = key !== mode;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  const dialog = document.getElementById('imageDialog');
  const dialogImage = document.getElementById('dialogImage');
  const dialogTitle = document.getElementById('dialogTitle');
  document.querySelectorAll('.image-zoom').forEach((button) => {
    button.addEventListener('click', () => {
      dialogImage.src = button.dataset.image;
      dialogImage.alt = button.dataset.title;
      dialogTitle.textContent = button.dataset.title;
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const questions = [
    { prompt: 'بخر الفم هو:', options: ['رائحة غير طبيعية خارجة من الفم', 'تبدل لون الأسنان فقط', 'حركة سنية مرضية', 'نزف لثوي فقط'], correct: 0, explanation: 'هذا هو التعريف المباشر لبخر الفم.' },
    { prompt: 'الفم النظيف في الحالة الطبيعية:', options: ['ليس له رائحة مزعجة', 'له دائماً رائحة كريهة', 'يفرز غازات نتنة باستمرار', 'يسبب دواراً'], correct: 0, explanation: 'النص يذكر أن الفم النظيف ليس في الحالة الطبيعية أية رائحة مزعجة.' },
    { prompt: 'تنشأ الرائحة غالباً من:', options: ['تخمر الفضلات الغذائية بين الأسنان وفي الحفر النخرة بفعل الجراثيم', 'امتصاص الكالسيوم', 'زيادة صلابة الميناء', 'تبدل لون اللثة فقط'], correct: 0, explanation: 'هذه هي الآلية الأساسية المذكورة لحدوث البخر الفموي.' },
    { prompt: 'أي من التالي ذُكر كأمثلة للغازات المسببة للرائحة؟', options: ['الإندول والسكاتول والبوتريسين', 'الأكسجين والآزوت', 'الهيدروجين والهيليوم', 'الكلور والفلور'], correct: 0, explanation: 'هذه المركبات ذكرت صراحة ضمن الغازات الناتجة عن التفسخ.' },
    { prompt: 'جفاف الفم يؤدي إلى:', options: ['زيادة بخر الفم', 'اختفاء الرائحة تماماً', 'ازدياد التذوق فقط', 'قوة في اللثة'], correct: 0, explanation: 'المادة تنص على أن جفاف الفم يزيد من الرائحة.' },
    { prompt: 'بخر الفم يُعد:', options: ['عرضاً وليس مرضاً بحد ذاته', 'مرضاً سنياً مستقلاً دائماً', 'كسراً في الفك', 'نوعاً من أنواع القلح'], correct: 0, explanation: 'يجب النظر إلى البخر كعرض وكاشف عن سبب كامن.' },
    { prompt: 'تكون رائحة الفم في الصباح عادة:', options: ['أشد من بقية النهار', 'أضعف من بقية النهار دائماً', 'معدومة تماماً', 'غير مرتبطة باللعاب'], correct: 0, explanation: 'وذلك بسبب نقص اللعاب أثناء النوم وتفسخ البقايا.' },
    { prompt: 'من أسباب بخر الفم العامة:', options: ['أمراض الممرات التنفسية العلوية', 'نخر سن واحد فقط حصراً', 'ترسب القلح فوق اللثوي فقط', 'التسنين اللبني'], correct: 0, explanation: 'الأمراض التنفسية العلوية ذُكرت ضمن الأسباب العامة.' },
    { prompt: 'أي من التالي مثال على سبب عام مطروح مع هواء الزفير؟', options: ['الثوم أو الكحول أو المركبات المحتوية على اليود', 'تقلقل الأسنان', 'التسوّس العميق فقط', 'الحليمات اللسانية'], correct: 0, explanation: 'هذه المواد ذكرت ضمن المواد التي تطرح عبر الهواء وتسبب رائحة.' },
    { prompt: 'من الأسباب العامة ذات الطابع الاستقلابي:', options: ['داء السكري', 'القلح فقط', 'التهاب اللثة البسيط فقط', 'غياب الحليمات بين السنية'], correct: 0, explanation: 'ذكر السكري ضمن الأمراض الاستقلابية المؤدية للبخر.' },
    { prompt: 'من الأسباب الفموية لبخر الفم:', options: ['انحصار فضلات الطعام بسبب سوء توضع الأسنان أو الأجهزة', 'فقط التقدم بالعمر', 'فقط تناول السوائل', 'فقط أمراض الرئة'], correct: 0, explanation: 'هذه من أشهر الأسباب الفموية المذكورة.' },
    { prompt: 'أمراض اللثة قد تسبب بخر الفم من خلال:', options: ['التقيح السني والجيوب الرعوية والانحلال الجرثومي للقيح', 'زيادة صلابة العظم', 'نقص عدد الأسنان اللبنية', 'التسنين الطبيعي'], correct: 0, explanation: 'القيح والانحلال الجرثومي عوامل مباشرة في الرائحة الفموية.' },
    { prompt: 'معالجة الأسباب العامة للبخر تتم:', options: ['من قبل المختص بحسب المرض العام المسبب', 'بفرشاة الأسنان فقط', 'بالمضمضة المؤقتة فقط', 'بإزالة القلح فقط'], correct: 0, explanation: 'إذا كان السبب عاماً فالمعالجة يجب أن تكون سببية لدى المختص.' },
    { prompt: 'المعالجة الفموية للبخر تشمل:', options: ['العناية بالصحة الفموية وإزالة العوامل الموضعية وتوجيه المريض للتنظيف الجيد', 'ترك الجيوب اللثوية دون علاج', 'الاعتماد على العطور فقط', 'عدم تنظيف اللسان أبداً'], correct: 0, explanation: 'هذه هي الخطوات الأساسية لمعالجة البخر الفموي.' },
    { prompt: 'مضادات البخر تعمل بشكل رئيسي عبر:', options: ['تعديل التفاعلات الناتجة عن التفسخ وتخريب الفضلات وكبح العوامل الجرثومية', 'زيادة ترسب القلح', 'إضعاف اللعاب', 'إزالة الأسنان السليمة'], correct: 0, explanation: 'هذه هي الوظيفة الجوهرية لمضادات البخر كما ورد في النص.' }
  ];

  const storageKey = 'oral-anatomy-page-15-progress-v1';
  let current = 0;
  let state = loadState();

  const questionCounter = document.getElementById('questionCounter');
  const questionText = document.getElementById('questionText');
  const answerArea = document.getElementById('answerArea');
  const feedbackBox = document.getElementById('feedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackText = document.getElementById('feedbackText');
  const prevButton = document.getElementById('prevQuestion');
  const nextButton = document.getElementById('nextQuestion');
  const dots = document.getElementById('quizDots');

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && Array.isArray(saved.answers) && saved.answers.length === questions.length) return saved;
    } catch (_) {}
    return { answers: Array(questions.length).fill(null) };
  }
  function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function completedCount() { return state.answers.filter((v) => v !== null).length; }
  function updateProgress() {
    const count = completedCount();
    const pct = Math.round((count / questions.length) * 100);
    document.getElementById('progressText').textContent = `${count} من ${questions.length}`;
    document.getElementById('progressPercent').textContent = `${pct}%`;
    document.getElementById('progressBar').style.width = `${pct}%`;
    const ring = document.getElementById('progressRing');
    ring.style.setProperty('--progress', `${pct * 3.6}deg`);
    ring.setAttribute('aria-label', `نسبة التقدم ${pct} بالمئة`);
  }
  function renderDots() {
    dots.innerHTML = '';
    questions.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'quiz-dot';
      dot.classList.toggle('is-current', index === current);
      dot.classList.toggle('is-done', state.answers[index] !== null);
      dot.setAttribute('aria-label', `الانتقال إلى السؤال ${index + 1}`);
      dot.addEventListener('click', () => { current = index; renderQuestion(); });
      dots.appendChild(dot);
    });
  }
  function showFeedback(isCorrect, explanation) {
    feedbackBox.hidden = false;
    feedbackBox.className = `feedback-box ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    feedbackIcon.textContent = isCorrect ? '✓' : '×';
    feedbackTitle.textContent = isCorrect ? 'إجابة صحيحة' : 'راجع هذه النقطة';
    feedbackText.textContent = explanation;
  }
  function renderQuestion() {
    const question = questions[current];
    const saved = state.answers[current];
    questionCounter.textContent = `السؤال ${current + 1} من ${questions.length}`;
    questionText.textContent = question.prompt;
    answerArea.innerHTML = '';
    feedbackBox.hidden = true;
    feedbackBox.className = 'feedback-box';
    const letters = ['أ', 'ب', 'ج', 'د'];
    question.options.forEach((option, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-option';
      btn.innerHTML = `<span class="answer-option__letter">${letters[idx]}</span><span>${option}</span>`;
      if (saved !== null) {
        btn.disabled = true;
        if (idx === question.correct) btn.classList.add('is-revealed');
        if (idx === saved && saved === question.correct) btn.classList.add('is-correct');
        if (idx === saved && saved !== question.correct) btn.classList.add('is-wrong');
      }
      btn.addEventListener('click', () => {
        if (state.answers[current] !== null) return;
        state.answers[current] = idx;
        saveState();
        renderQuestion();
      });
      answerArea.appendChild(btn);
    });
    if (saved !== null) showFeedback(saved === question.correct, question.explanation);
    prevButton.disabled = current === 0;
    nextButton.disabled = current === questions.length - 1;
    nextButton.textContent = current === questions.length - 1 ? 'النهاية' : 'التالي';
    renderDots();
    updateProgress();
  }

  prevButton.addEventListener('click', () => { if (current > 0) { current -= 1; renderQuestion(); } });
  nextButton.addEventListener('click', () => { if (current < questions.length - 1) { current += 1; renderQuestion(); } });
  document.getElementById('resetProgress').addEventListener('click', () => {
    state = { answers: Array(questions.length).fill(null) };
    current = 0; saveState(); renderQuestion();
  });
  renderQuestion();
})();
