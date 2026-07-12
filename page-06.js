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
    {
      type: 'اختيار من متعدد',
      prompt: 'كم عدد الأسنان المؤقتة في الفم؟',
      options: ['20 سناً', '24 سناً', '28 سناً', '32 سناً'],
      correct: 0,
      explanation: 'الأسنان المؤقتة عشرون: عشرة في كل فك وخمسة في كل جانب.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'متى تبدأ الأسنان الدائمة بالظهور غالباً؟',
      options: ['نحو السنة السادسة', 'نحو الشهر السادس', 'نحو السنة الثانية', 'نحو السنة الخامسة عشرة'],
      correct: 0,
      explanation: 'تبدأ المجموعة الدائمة عادةً بالظهور قرب السنة السادسة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر ترتيب الأسنان المؤقتة الخمس في كل جانب.',
      flashAnswer: 'ثنية، رباعية، ناب، رحى أولى، رحى ثانية.',
      explanation: 'لا توجد ضواحك في الأسنان اللبنية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما موعد بزوغ الثنايا اللبنية السفلية بحسب الجدول؟',
      options: ['6–10 أشهر', '9–13 شهراً', '16–22 شهراً', '25–33 شهراً'],
      correct: 0,
      explanation: 'الثنايا السفلية اللبنية تبزغ بين 6 و10 أشهر.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما سبب أهمية بقاء السن اللبنية حتى موعد سقوطها الطبيعي؟',
      options: ['تحفظ المسافة المخصصة للسن الدائمة', 'تزيد عدد الأسنان الدائمة', 'تمنع نمو الجذر الدائم', 'توقف بزوغ الأرحاء'],
      correct: 0,
      explanation: 'السن اللبنية تحفظ المسافة وتساعد في توجيه السن الدائمة القادمة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما معنى حافظة المسافة؟',
      flashAnswer: 'جهاز يُستخدم بعد القلع المبكر لسن لبنية للمحافظة على المسافة اللازمة لبزوغ السن الدائمة.',
      explanation: 'هدفها الأساسي منع انغلاق المسافة قبل وصول السن الدائمة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي عبارة أدق بحسب المصدر حول الأعراض العامة المنسوبة للتسنين؟',
      options: ['قد تتزامن مع التسنين دون أن يثبت أن البزوغ سببها المباشر', 'كل حمى سببها البزوغ', 'الإسهال علامة لازمة للبزوغ', 'البزوغ مرض التهابي عام'],
      correct: 0,
      explanation: 'البزوغ عملية فيزيولوجية، وقد تكون الأعراض العامة متزامنة أو مرتبطة بعوامل أخرى.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كم عدد الأسنان الدائمة؟',
      options: ['32 سناً', '20 سناً', '28 سناً فقط دائماً', '36 سناً'],
      correct: 0,
      explanation: 'العدد الكامل للأسنان الدائمة هو 32 سناً.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر ترتيب الأسنان الدائمة الثمانية في كل جانب.',
      flashAnswer: 'ثنية، رباعية، ناب، ضاحك أول، ضاحك ثانٍ، رحى أولى، رحى ثانية، رحى ثالثة.',
      explanation: 'الرحى الثالثة هي ضرس العقل.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما أول الأرحاء الدائمة بزوغاً عادةً؟',
      options: ['الرحى الأولى بعمر 6–7 سنوات', 'الرحى الثالثة بعمر 6–7 سنوات', 'الرحى الثانية بعمر 4 سنوات', 'الضاحك الثاني بعمر 5 سنوات'],
      correct: 0,
      explanation: 'الرحى الدائمة الأولى تبزغ عادةً بين 6 و7 سنوات.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أين تظهر السن الزائدة الأكثر شيوعاً المذكورة في المصدر؟',
      options: ['بين الثنايا العلوية', 'خلف الرحى الثالثة السفلية فقط', 'داخل اللسان', 'في الشفة السفلى'],
      correct: 0,
      explanation: 'السن الأنسيّة الزائدة تظهر غالباً بين القواطع المركزية العلوية.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما المقصود بغياب الأسنان؟',
      flashAnswer: 'نقص خلقي أو وراثي في عدد الأسنان، وقد يكون جزئياً أو كاملاً.',
      explanation: 'يختلف عن تأخر البزوغ؛ فالسن قد تكون غير متشكلة أساساً.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'لماذا قد تكون السن الولادية متحركة؟',
      options: ['لعدم اكتمال نمو الجذر', 'لوجود جذر طويل جداً', 'لأنها سن دائمة مكتملة', 'لأنها دائماً سن زائدة'],
      correct: 0,
      explanation: 'الحركة ترتبط غالباً بعدم اكتمال نمو الجذر.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الوصف الأدق لكيس البزوغ؟',
      options: ['تجمع سائل أو دم حول السن البازغة وغالباً ينفتح تلقائياً', 'نخر عميق في كل سن بازغة', 'التصاق دائم بين سنيـن', 'غياب كامل للميناء'],
      correct: 0,
      explanation: 'كيس البزوغ تجمع داخل النسج فوق السن، وغالباً يفتح تلقائياً مع البزوغ.'
    }
  ];

  const storageKey = 'oral-anatomy-page-06-progress-v1';
  let current = 0;
  let state = loadState();

  const questionCounter = document.getElementById('questionCounter');
  const questionType = document.getElementById('questionType');
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

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function completedCount() {
    return state.answers.filter((value) => value !== null).length;
  }

  function updateProgress() {
    const count = completedCount();
    const percentage = Math.round((count / questions.length) * 100);
    document.getElementById('progressText').textContent = `${count} من ${questions.length}`;
    document.getElementById('progressPercent').textContent = `${percentage}%`;
    document.getElementById('progressBar').style.width = `${percentage}%`;
    const ring = document.getElementById('progressRing');
    ring.style.setProperty('--progress', `${percentage * 3.6}deg`);
    ring.setAttribute('aria-label', `نسبة التقدم ${percentage} بالمئة`);
  }

  function renderDots() {
    dots.innerHTML = '';
    questions.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'quiz-dot';
      dot.setAttribute('aria-label', `الانتقال إلى السؤال ${index + 1}`);
      dot.classList.toggle('is-current', index === current);
      dot.classList.toggle('is-done', state.answers[index] !== null);
      dot.addEventListener('click', () => {
        current = index;
        renderQuestion();
      });
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

  function renderMultipleChoice(question, savedAnswer) {
    const letters = ['أ', 'ب', 'ج', 'د'];
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.innerHTML = `<span class="answer-option__letter">${letters[index] ?? index + 1}</span><span>${option}</span>`;

      if (savedAnswer !== null) {
        button.disabled = true;
        if (index === question.correct) button.classList.add('is-revealed');
        if (index === savedAnswer && savedAnswer === question.correct) button.classList.add('is-correct');
        if (index === savedAnswer && savedAnswer !== question.correct) button.classList.add('is-wrong');
      }

      button.addEventListener('click', () => {
        if (state.answers[current] !== null) return;
        state.answers[current] = index;
        saveState();
        renderQuestion();
      });
      answerArea.appendChild(button);
    });

    if (savedAnswer !== null) showFeedback(savedAnswer === question.correct, question.explanation);
  }

  function renderFlashCard(question, savedAnswer) {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'اقلب البطاقة لإظهار الجواب');
    card.innerHTML = `
      <div class="flip-card__inner">
        <div class="flip-card__face flip-card__front"><div><small>فكّر أولاً، ثم اضغط</small><strong>${question.prompt}</strong></div></div>
        <div class="flip-card__face flip-card__back"><div><small>الجواب</small><strong>${question.flashAnswer}</strong></div></div>
      </div>`;

    const flip = () => card.classList.toggle('is-flipped');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flip();
      }
    });
    answerArea.appendChild(card);

    const controls = document.createElement('div');
    controls.className = 'answer-area';
    controls.style.marginTop = '14px';

    ['أتقنتها', 'أحتاج مراجعتها'].forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.innerHTML = `<span class="answer-option__letter">${index === 0 ? '✓' : '↻'}</span><span>${label}</span>`;

      if (savedAnswer !== null) {
        button.disabled = true;
        if (savedAnswer === index) button.classList.add(index === 0 ? 'is-correct' : 'is-wrong');
      }

      button.addEventListener('click', () => {
        if (state.answers[current] !== null) return;
        state.answers[current] = index;
        saveState();
        renderQuestion();
      });
      controls.appendChild(button);
    });

    answerArea.appendChild(controls);

    if (savedAnswer !== null) {
      feedbackBox.hidden = false;
      feedbackBox.className = `feedback-box ${savedAnswer === 0 ? 'is-correct' : 'is-wrong'}`;
      feedbackIcon.textContent = savedAnswer === 0 ? '✓' : '↻';
      feedbackTitle.textContent = savedAnswer === 0 ? 'ممتاز' : 'ستثبت في المراجعة القادمة';
      feedbackText.textContent = question.explanation;
    }
  }

  function renderQuestion() {
    const question = questions[current];
    const savedAnswer = state.answers[current];
    questionCounter.textContent = `السؤال ${current + 1} من ${questions.length}`;
    questionType.textContent = question.type;
    questionText.textContent = question.prompt;
    answerArea.innerHTML = '';
    feedbackBox.hidden = true;
    feedbackBox.className = 'feedback-box';

    if (question.flashAnswer) renderFlashCard(question, savedAnswer);
    else renderMultipleChoice(question, savedAnswer);

    prevButton.disabled = current === 0;
    nextButton.disabled = current === questions.length - 1;
    nextButton.textContent = current === questions.length - 1 ? 'النهاية' : 'التالي';
    renderDots();
    updateProgress();
  }

  prevButton.addEventListener('click', () => {
    if (current > 0) {
      current -= 1;
      renderQuestion();
    }
  });

  nextButton.addEventListener('click', () => {
    if (current < questions.length - 1) {
      current += 1;
      renderQuestion();
    }
  });

  document.getElementById('resetProgress').addEventListener('click', () => {
    state = { answers: Array(questions.length).fill(null) };
    current = 0;
    saveState();
    renderQuestion();
  });

  renderQuestion();
})();
