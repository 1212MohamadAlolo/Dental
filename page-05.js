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
      prompt: 'أي وظيفة ذُكرت للّعاب في الصفحة؟',
      options: ['تسهيل المضغ والبلع والمساهمة في هضم بعض العناصر', 'تشكيل الأسنان الدائمة', 'تحريك الفك السفلي', 'إنتاج خلايا الدم'],
      correct: 0,
      explanation: 'يسهّل اللعاب المضغ والبلع، ويسهم في هضم بعض عناصر الطعام.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'كيف تُصنّف الغدد اللعابية بحسب طبيعة إفرازها؟',
      flashAnswer: 'تُصنّف إلى غدد مخاطية، وغدد مصلية، وغدد مختلطة.',
      explanation: 'احفظ التصنيف الثلاثي كوحدة واحدة: مخاطية، مصلية، مختلطة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما أكبر الغدد اللعابية؟',
      options: ['الغدة النكفية', 'الغدة تحت اللسان', 'الغدد الشفوية الصغرى', 'الغدة تحت الفك'],
      correct: 0,
      explanation: 'الغدة النكفية هي أكبر الغدد اللعابية.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'أين تفتح قناة ستنسن؟',
      flashAnswer: 'تفتح على مخاطية الخد مقابل الرحى الثانية العلوية عبر فوهة ذات حليمة صغيرة.',
      explanation: 'اربط ستنسن دائماً بالغدة النكفية والرحى الثانية العلوية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أين يتوضع القسم الأكبر من الغدة تحت الفك؟',
      options: ['خلف وأسفل العضلة الضرسية اللامية', 'أمام الأذن الخارجية', 'داخل الشفة العليا', 'فوق الحنك الصلب'],
      correct: 0,
      explanation: 'يتوضع القسم الأكبر في المنطقة تحت الفكية خلف وأسفل العضلة الضرسية اللامية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أين تفتح قناة وارتون؟',
      options: ['في أرض الفم على جانبي لجام اللسان', 'مقابل الرحى الثانية العلوية', 'في الحنك الرخو', 'على ظهر اللسان'],
      correct: 0,
      explanation: 'تفتح قناة وارتون في أرض الفم على طرفي لجام اللسان.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'إلى أي غدة تنتمي قناة بارتولين؟',
      options: ['الغدة تحت اللسان', 'الغدة النكفية', 'الغدة تحت الفك', 'الغدد الحنكية الصغرى'],
      correct: 0,
      explanation: 'قناة بارتولين هي القناة المفرغة للغدة تحت اللسان بحسب المصدر.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'أين تنتشر الغدد اللعابية الصغرى؟',
      flashAnswer: 'تنتشر في الشفاه، ودهليز الفم، واللسان، وقبة الحنك، ومناطق أخرى.',
      explanation: 'الغدد الصغرى عديدة ومنتشرة، بخلاف الأزواج الثلاثة الكبرى المحددة الموضع.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي غدد تسهم بالنسبة الأكبر من الإفراز اللعابي الوسطي؟',
      options: ['الغدد تحت الفك بنسبة 69%', 'الغدد النكفية بنسبة 69%', 'الغدد تحت اللسان بنسبة 69%', 'الغدد الصغرى بنسبة 69%'],
      correct: 0,
      explanation: 'النسب الواردة: تحت الفك 69%، النكفية 26%، وتحت اللسان 5%.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'لماذا يجب ذكر ظروف جمع اللعاب عند عرض نسب مكوناته؟',
      flashAnswer: 'لأن تركيب اللعاب يتغير باختلاف الشخص والغدة وطبيعة وشدة التحريض وظروف جمع العينة؛ لذلك لا تكفي النسب وحدها دون سياق.',
      explanation: 'قيمة النسبة العلمية مرتبطة بظروف القياس والجمع.'
    }
  ];

  const storageKey = 'oral-anatomy-page-05-progress-v1';
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
    } catch (_) {
      // Ignore malformed local storage data.
    }
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
