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
      prompt: 'ما المقصود بالنسج الداعمة للسن (Periodont)؟',
      options: ['جميع النسج الداعمة للسن وتشمل اللثة والرباط والعظم والملاط', 'طبقة الميناء فقط', 'النسج داخل اللب فقط', 'العاج واللب دون بقية الأنسجة'],
      correct: 0,
      explanation: 'النسج الداعمة للسن تضم اللثة والرباط والعظم والملاط والعناصر المساندة لها.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كيف يُكشف الجيب السني بحسب النص؟',
      options: ['بإدخال المسبار حول السن بعمق يزيد عن 3 ملم', 'بالتصوير الشعاعي فقط', 'بفحص لون الميناء', 'بقياس طول الجذر فقط'],
      correct: 0,
      explanation: 'الجيب السني يُكشف عندما يتجاوز عمق المسبار حول السن 3 ملم.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر المناطق الثلاث الرئيسية للثة.',
      flashAnswer: 'اللثة الحفافية (الحرة)، اللثة الحليمية، اللثة الملتصقة.',
      explanation: 'احفظها من حول العنق ثم بين الأسنان ثم باتجاه الغشاء المخاطي.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كم يبلغ عرض اللثة الحفافية تقريباً؟',
      options: ['نحو 1 ملم', 'نحو 5 ملم', 'نحو 10 ملم', 'أقل من 0.1 ملم دائماً'],
      correct: 0,
      explanation: 'ورد في النص أن عرض اللثة الحفافية نحو 1 ملم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما المجال الطبيعي المذكور لعمق الميزاب اللثوي؟',
      options: ['0.5–1 ملم', '2–3 ملم', '3–5 ملم', 'أكثر من 6 ملم'],
      correct: 0,
      explanation: 'يمكن إدخال الآلة ذات الرأس الكليل بين السن واللثة لمسافة 0.5–1 ملم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي صفة من الصفات السريرية للثة الطبيعية تتعلق بشكل يشبه قشر البرتقال؟',
      options: ['المنظر السطحي', 'الحجم', 'اللون', 'الجيب السني'],
      correct: 0,
      explanation: 'المنظر السطحي للثة الطبيعية يبدو متجعدات ناعمة تشبه قشر البرتقال.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما المقصود بالتصبغ الفيزيولوجي في اللثة؟',
      flashAnswer: 'هو وجود التصبغ الطبيعي في اللثة ومخاطية الفم، وقد يكثر ظهوره عند السود.',
      explanation: 'هو تغير لوني طبيعي وليس مرضياً بحد ذاته.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'مم يتشكل الرباط السنيخي السني أساساً؟',
      options: ['ألياف كثيفة تربط الملاط بالعظم السنخي', 'ماء فقط', 'أنابيب عاجية', 'أملاح كالسيوم فقط'],
      correct: 0,
      explanation: 'الرباط يتكون من ألياف كثيفة تثبت السن بين الملاط والعظم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ماذا قد يحدث للسن عند احتقان الرباط السنيخي السني؟',
      options: ['تندفع السن نحو الخارج قليلاً ويحدث ألم على الإطباق', 'تزرق الميناء فوراً', 'يتكون العاج الثالثي مباشرة', 'يختفي العظم السنخي فوراً'],
      correct: 0,
      explanation: 'زيادة السوائل في الرباط قد ترفع السن قليلاً وتسبب ألماً عند الضغط أو الإطباق.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما طبيعة العظم السنخي؟',
      options: ['عظم إسفنجي', 'عظم غضروفي', 'نسيج طلائي', 'نسيج عصبي'],
      correct: 0,
      explanation: 'العظم السنخي وصف في الصفحة بأنه عظم إسفنجي.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'مم يتألف العظم السنخي؟',
      flashAnswer: 'من صفيحة عظمية دهليزية وأخرى لسانية وحواجز سنخية بين سنية.',
      explanation: 'هذا هو التركيب البنيوي العام المذكور في الصفحة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الذي يحدث للعظم السنخي بعد فقد الأسنان أو قلعها؟',
      options: ['يمتص ويزول تدريجياً', 'يزداد سماكة دائماً', 'يتحول إلى ميناء', 'لا يتأثر إطلاقاً'],
      correct: 0,
      explanation: 'يرتبط وجود العظم السنخي بوجود الأسنان، لذا يمتص ويزول بعد فقدها.'
    }
  ];

  const storageKey = 'oral-anatomy-page-08-progress-v1';
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
