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
    { prompt: 'تتجاوز نسبة انتشار نخر الأسنان في بعض البلاد:', options: ['90% من السكان', '10% من السكان', '25% من السكان', '50% من السكان'], correct: 0, explanation: 'النص يذكر أن نسبة الانتشار قد تفوق 90% في بعض البلاد.' },
    { prompt: 'أقرب النظريات المقبولة لتفسير حدوث النخر هي:', options: ['نظرية تكون الحموض', 'نظرية زيادة الكلس', 'نظرية نقص اللعاب فقط', 'نظرية التآكل الحراري'], correct: 0, explanation: 'الصفحة تذكر نظرية تكون الحموض كأقرب تفسير مقبول.' },
    { prompt: 'العوامل الأساسية اللازمة لحدوث النخر هي:', options: ['السن، الجراثيم، الغذاء', 'العمر، الجنس، الهرمونات', 'الألم، الالتهاب، النزف', 'اللعاب، الشفة، اللسان'], correct: 0, explanation: 'هذه هي العناصر الثلاثة الأساسية المذكورة لحدوث النخر.' },
    { prompt: 'اللويحات الجرثومية هي:', options: ['تجمع جرثومي عضوي على السطوح السنية', 'طبقة معدنية واقية', 'نوع من الحشوات', 'نسيج عظمي جديد'], correct: 0, explanation: 'اللويحات الجرثومية هي التجمع الذي تنمو فيه الجراثيم على الأسنان.' },
    { prompt: 'أي أنواع السكريات أكثر أهمية في إحداث النخر بحسب النص؟', options: ['السكروز', 'اللاكتوز', 'الفركتوز فقط', 'الغلوكوز الوريدي'], correct: 0, explanation: 'الصفحة تشير بوضوح إلى أهمية السكر ثنائي السكروز.' },
    { prompt: 'من المقاومة المادية للويحات الجرثومية:', options: ['تنظيف الفم بالفرشاة والخيط', 'الإكثار من الحلويات', 'إبقاء اللويحة دون إزالة', 'ترك بقايا الطعام على الأسنان'], correct: 0, explanation: 'النظافة الفموية تعرقل نمو اللويحات وتزيلها.' },
    { prompt: 'يزداد التأثير الضار للسكريات عندما تكون:', options: ['لاصقة وتبقى في الفم مدة أطول', 'مذابة وتمكث ثوانٍ فقط', 'تؤكل أثناء الوجبة الرئيسية فقط', 'مزوجة دائماً بمواد دهنية'], correct: 0, explanation: 'المنتجات اللاصقة تبقى في الفم مدة أطول، لذلك تكون أكثر خطورة.' },
    { prompt: 'تناول نفس كمية السكر على فترة زمنية أطول يؤدي إلى:', options: ['ضرر أكبر على الأسنان', 'ضرر أقل', 'لا فرق إطلاقاً', 'منع تشكل الأحماض'], correct: 0, explanation: 'النص يذكر أن تناول كمية محدودة خلال فترة قصيرة أقل ضرراً من تناولها لفترة أطول.' },
    { prompt: 'تناول السكريات بين الوجبات يسبب:', options: ['انخفاضاً متكرراً في pH اللعاب وزيادة انتشار النخر', 'تثبيطاً كاملاً للجراثيم', 'زيادة فورية في التمعدن', 'اختفاء اللويحات الجرثومية'], correct: 0, explanation: 'هبوط pH المتكرر يطيل مرحلة إزالة التمعدن ويزيد النخر.' },
    { prompt: 'أي مما يلي يعد من العوامل العامة للنخر؟', options: ['الوراثة والعمر والجنس', 'موقع السن فقط', 'سوء التوضع فقط', 'الأجهزة الصناعية فقط'], correct: 0, explanation: 'هذه أمثلة مباشرة على العوامل العامة.' },
    { prompt: 'من العوامل الموضعية للنخر:', options: ['موقع السن وسوء التوضع والأجهزة الصناعية', 'الحمل والإرضاع', 'الفيتامينات', 'الأمراض العامة فقط'], correct: 0, explanation: 'هذه العوامل تندرج تحت العوامل الموضعية.' },
    { prompt: 'تكون الأسنان الأمامية السفلية:', options: ['أقل تعرضاً نسبياً للنخر', 'أكثر عرضة من الأرحاء دائماً', 'معدومة المقاومة', 'لا تتأثر إطلاقاً'], correct: 0, explanation: 'ذلك بسبب إحاطتها باللعاب بشكل أفضل.' },
    { prompt: 'يبدأ نخر الميناء غالباً بـ:', options: ['تبدل لون الميناء دون أعراض واضحة', 'ألم عفوي شديد ليلي', 'خراج فوري', 'تنخر في اللب مباشرة'], correct: 0, explanation: 'نخر الميناء عادةً لا يسبب أعراضاً واضحة حتى يصل إلى العاج.' },
    { prompt: 'نخر العاج يمتاز بأنه:', options: ['أسرع انتشاراً ويترافق مع حساسية للمثيرات', 'أبطأ من نخر الميناء ولا يسبب ألماً', 'مرحلة لا تعبر الميناء', 'مرحلة لا تتأثر بالمواد السكرية'], correct: 0, explanation: 'العاج أقل مقاومة وأكثر غنى بالمواد العضوية من الميناء.' },
    { prompt: 'من صفات التهاب اللب الناتج عن وصول النخر إليه:', options: ['ألم شديد قد يكون عفوياً ويشتد ليلاً', 'غياب الألم تماماً', 'تغير اللون فقط دون أعراض', 'تحسن مع وضع المسكنات على اللثة'], correct: 0, explanation: 'هذه من الصفات السريرية الواضحة لالتهاب اللب.' },
    { prompt: 'من الممارسات الخاطئة المذكورة عند ألم السن:', options: ['وضع أدوية أو مسكنات مباشرة على السن واللثة', 'مراجعة طبيب الأسنان', 'تنظيف الفم', 'تخفيف السكريات'], correct: 0, explanation: 'النص يذكر أن ذلك لا يفيد وقد يؤذي اللثة.' },
    { prompt: 'إذا فقدت السن كمية كبيرة من النسج بعد معالجة اللب فقد تحتاج إلى:', options: ['وتد وقلب معدني ثم تتويج', 'تركها دون ترميم دائماً', 'قلع كل الأسنان المجاورة', 'مضاد حيوي فقط'], correct: 0, explanation: 'هذا مذكور في نهاية الصفحة ضمن تدبير الأسنان الشديدة التخرب.' }
  ];

  const storageKey = 'oral-anatomy-page-17-progress-v1';
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
