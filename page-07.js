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
      prompt: 'ما النسيج الذي يغطي التاج ويقاوم المؤثرات الخارجية؟',
      options: ['الميناء', 'العاج', 'الملاط', 'اللب'],
      correct: 0,
      explanation: 'الميناء هي الطبقة الخارجية المغطية للتاج وتحميه من المؤثرات المختلفة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما مجال سماكة الميناء المذكور في الصفحة؟',
      flashAnswer: 'تقريباً من 0.01 مم عند الأعناق حتى 2 مم عند ذرى الحدبات، وقد لا تتجاوز 3 مم في بروزات الأرحاء.',
      explanation: 'احفظ الفكرة العامة: رقيقة عند العنق وأكثر سماكة عند الحدبات.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي عبارة صحيحة حول الميناء؟',
      options: ['تعد من أقسى أنسجة الجسم', 'تغلف الجذر فقط', 'تحوي أوعية دموية', 'أقل صلابة من العظم'],
      correct: 0,
      explanation: 'الميناء هي الأشد صلابة بين الأنسجة السنية، بل من أقسى أنسجة الجسم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ممّ يتركب الميناء كيميائياً بحسب المصدر؟',
      options: ['97% أملاح كالسيوم و3% ماء ومواد عضوية', '70% معادن و17% مواد عضوية و13% ماء', '50% معادن و50% ماء', '100% هيدروكسي أباتيت فقط'],
      correct: 0,
      explanation: 'النسب الواردة للميناء هي 97% أملاح الكالسيوم و3% ماء ومواد عضوية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الذي يشكل أساس السن والكتلة المركزية لها؟',
      options: ['العاج', 'الميناء', 'الملاط', 'اللثة'],
      correct: 0,
      explanation: 'العاج هو أساس السن ومصدر قوتها والكتلة المركزية لأنسجتها الصلبة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما التركيب الكيميائي للعاج؟',
      flashAnswer: '70% مواد معدنية، و17% مواد عضوية، و13% ماء.',
      explanation: 'يمكن حفظها بالترتيب: 70 – 17 – 13.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما اسم الألياف الموجودة في الأنابيب العاجية والتي تنقل الإحساسات الألمية؟',
      options: ['ألياف توماز', 'ألياف شاربي', 'ألياف كولاجين فقط', 'ألياف مرنة'],
      correct: 0,
      explanation: 'تسمى الألياف المذكورة ضمن الأنابيب العاجية ألياف توماز.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أين يوجد الملاط؟',
      options: ['يغلف الجذر فقط', 'يغطي الحد القاطع فقط', 'داخل الحجرة اللبية', 'فوق اللثة حصراً'],
      correct: 0,
      explanation: 'الملاط نسيج يغلف الجذور فقط وينتهي عند العنق.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر إحدى حالات التقاء الميناء بالملاط عند العنق.',
      flashAnswer: 'إما أن يغطي الملاط الميناء قليلاً، أو تغطي الميناء الملاط، أو يكون بينهما فراغ بسيط ينكشف فيه العاج.',
      explanation: 'يكفي حفظ الحالات الثلاث كقائمة قصيرة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما وظيفة اللب الأساسية المذكورة في المصدر؟',
      options: ['إعطاء الحساسية للسن', 'تلوين السن', 'تغليف الجذر', 'زيادة صلابة الميناء فقط'],
      correct: 0,
      explanation: 'اللب هو النسيج الحي العصبي الوعائي، ووظيفته إعطاء الحساسية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما العاج الذي يتشكل كرد فعل دفاعي تجاه العوامل المؤذية؟',
      options: ['العاج الثالثي أو المرمم', 'العاج الأولي', 'الميناء الثانوي', 'الملاط الترميمي'],
      correct: 0,
      explanation: 'العاج الثالثي أو المرمم يتشكل استجابةً للعوامل المؤذية الخارجية.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'رتّب أنسجة السن من الخارج إلى الداخل في التاج.',
      flashAnswer: 'الميناء ثم العاج ثم اللب.',
      explanation: 'أما في الجذر فيكون الملاط خارجاً ثم العاج ثم اللب.'
    }
  ];

  const storageKey = 'oral-anatomy-page-07-progress-v1';
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
        if (savedAnswer == index) button.classList.add(index === 0 ? 'is-correct' : 'is-wrong');
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
