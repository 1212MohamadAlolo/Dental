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
      prompt: 'ما الوصف الأدق للفك السفلي؟',
      options: ['عظم زوجي ثابت', 'عظم مفرد يشبه نعل الفرس', 'عظم مسطح داخل الحجاج', 'جزء من الفك العلوي'],
      correct: 1,
      explanation: 'الفك السفلي عظم مفرد ذو شكل قريب من نعل الفرس.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ممّ يتألف الفك السفلي بصورة أساسية؟',
      options: ['جسم أفقي وشعبتان صاعدتان', 'شعبتان أفقيتان فقط', 'ثلاثة أجسام عظمية', 'ناتئ حنكي وناتئ وجني'],
      correct: 0,
      explanation: 'يتكون من جسم أفقي يحمل الأسنان ومن شعبتين صاعدتين على الجانبين.'
    },
    {
      type: 'صح أم خطأ',
      prompt: 'الفك السفلي هو العظم المتحرك الوحيد من عظام الجمجمة.',
      options: ['صح', 'خطأ'],
      correct: 0,
      explanation: 'صحيح؛ تتحقق حركته عبر المفصلين الفكيين الصدغيين.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'بأي جزء يرتبط الفك السفلي بالجمجمة؟',
      options: ['الناتئ الإكليلي فقط', 'اللقمتان ضمن المفصل الفكي الصدغي', 'الثقبتان الذقنيتان', 'الناتئ السنخي'],
      correct: 1,
      explanation: 'ترتبط لقمتا الفك السفلي بالعظم الصدغي ضمن المفصل الفكي الصدغي (TMJ).'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي بنية تقع على السطح الخارجي لجسم الفك وتظهر في المنظر الوحشي؟',
      options: ['الثقبة الذقنية', 'الحفرة تحت اللسان', 'الثقبة الفكية', 'الشوكة الذقنية الداخلية'],
      correct: 0,
      explanation: 'الثقبة الذقنية (Mental foramen) تُشاهد على السطح الخارجي لجسم الفك السفلي.'
    },
    {
      type: 'صح أم خطأ',
      prompt: 'الناتئ اللقمي هو نفسه الناتئ الإكليلي.',
      options: ['صح', 'خطأ'],
      correct: 1,
      explanation: 'خطأ؛ الناتئ اللقمي يشارك في المفصل، أما الناتئ الإكليلي فهو موضع ارتكاز عضلي.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما وظيفة جسم الفك السفلي؟',
      flashAnswer: 'يحمل الأسنان السفلية والناتئ السنخي، ويشكّل الجزء الأفقي من الفك.',
      explanation: 'اربط بين الجسم الأفقي وبين حمل الأسنان السفلية.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'كيف يرتبط الفك السفلي بالجمجمة؟',
      flashAnswer: 'بواسطة لقمتَي الفك السفلي ضمن المفصلين الفكيين الصدغيين على الجانبين.',
      explanation: 'هذه العلاقة هي أساس حركة الفتح والإغلاق والحركات الجانبية للفك.'
    }
  ];

  const storageKey = 'mandible-page-02-progress-v1';
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
    } catch (_) { /* ignore malformed data */ }
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
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flip(); }
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
    if (current > 0) { current -= 1; renderQuestion(); }
  });
  nextButton.addEventListener('click', () => {
    if (current < questions.length - 1) { current += 1; renderQuestion(); }
  });

  document.getElementById('resetProgress').addEventListener('click', () => {
    state = { answers: Array(questions.length).fill(null) };
    current = 0;
    saveState();
    renderQuestion();
  });

  renderQuestion();
})();
