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
      prompt: 'ما علاقة الغشاء المخاطي المبطن للخد بالغشاء المخاطي الشفوي؟',
      options: ['هو استمرار له وله البنية نفسها', 'نسيج عظمي منفصل', 'غشاء مختلف تماماً', 'نسيج غضروفي'],
      correct: 0,
      explanation: 'الغشاء المخاطي المبطن للخد هو امتداد للغشاء المخاطي الشفوي وله البنية نفسها.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الوظيفة التشريحية الأساسية لسقف الفم؟',
      options: ['الفصل بين جوف الفم والحفرتين الأنفيتين', 'وصل اللسان بالشفاه', 'تشكيل الفك السفلي', 'حمل الأسنان فقط'],
      correct: 0,
      explanation: 'يشكل سقف الفم حاجزاً بين حفرة الفم والحفرتين الأنفيتين.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي جزء يشكل القسم الأمامي من قبة الحنك؟',
      options: ['قبة الحنك الصلبة', 'شراع الحنك', 'اللهاة', 'البلعوم الأنفي'],
      correct: 0,
      explanation: 'قبة الحنك الصلبة هي الجزء الأمامي، ويدخل في تشكيلها أربعة عظام.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما الفرق البنيوي والوظيفي بين الحنك الصلب والحنك الرخو؟',
      flashAnswer: 'الحنك الصلب أمامي وعظمي ومغطى بنسيج كثيف، أما الحنك الرخو فخلفي متحرك يشبه الشراع ويسهم في إغلاق فوهة البلعوم الأنفي أثناء البلع.',
      explanation: 'اربط دائماً: صلب = أمامي ثابت، رخو = خلفي متحرك.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما اسم البروز المتدلي من الحنك الرخو نحو الأسفل؟',
      options: ['اللهاة', 'لجام اللسان', 'الحليمة الكأسية', 'اللوزة اللسانية'],
      correct: 0,
      explanation: 'تنتهي قبة الحنك الرخوة ببروز متدلٍ يسمى اللهاة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ماذا يحدث لشراع الحنك أثناء البلع؟',
      options: ['يُشد إلى الأعلى والخلف فيغلق فوهة البلعوم الأنفي', 'يتجه إلى الأسفل فقط', 'يبقى ثابتاً تماماً', 'يلتصق بالأسنان'],
      correct: 0,
      explanation: 'تتقلص عضلاته المخططة فتشده إلى الأعلى والخلف لإغلاق فوهة البلعوم الأنفي.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كم عضلة يتكون منها اللسان بحسب النص؟',
      options: ['17 عضلة', '7 عضلات', '12 عضلة', '24 عضلة'],
      correct: 0,
      explanation: 'ورد في الصفحة أن اللسان عضو عضلي مكوّن من 17 عضلة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر أنواع الحليمات اللسانية الأربعة.',
      flashAnswer: 'الحليمات الخيطية، والكمئية، والوريقية، والكأسية.',
      explanation: 'احفظ الأنواع الأربعة كوحدة واحدة، ثم اربط الحليمات الكأسية بموقعها على شكل V.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي الحليمات لا تحتوي على براعم الذوق بحسب النص؟',
      options: ['الحليمات الخيطية', 'الحليمات الكأسية', 'الحليمات الوريقية', 'الحليمات الكمئية'],
      correct: 0,
      explanation: 'توجد براعم الذوق في الحليمات اللسانية جميعها عدا الحليمات الخيطية.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'كيف تتوضع الحليمات الكأسية وكم يبلغ عددها تقريباً؟',
      flashAnswer: 'تتوضع عند الحد بين الثلث الخلفي والثلثين الأماميين على شكل الرقم 7 أو حرف V، وزاويتها الحادة نحو الخلف، وعددها نحو 8–10 حليمات.',
      explanation: 'الموقع والشكل والعدد هي أهم ثلاث نقاط امتحانية للحليمات الكأسية.'
    }
  ];

  const storageKey = 'oral-anatomy-page-04-progress-v1';
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
    } catch (_) { /* Ignore malformed local storage data. */ }
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
