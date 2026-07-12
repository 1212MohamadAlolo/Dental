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
      prompt: 'ما العاملان الأهمان المذكوران كسبب لالتهاب اللثة؟',
      options: ['الصفيحة الجرثومية والقلح', 'العاج والملاط', 'اللب والميناء', 'الناب والرباعية'],
      correct: 0,
      explanation: 'ذكرت الصفحة أن الصفيحة الجرثومية والقلح من أهم أسباب الالتهابات اللثوية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ماذا يعني أن يكون التهاب اللثة معمماً؟',
      options: ['يكون حول جميع الأسنان', 'يكون حول سن واحد فقط', 'يكون في الحليمة فقط', 'يكون في الفك السفلي فقط'],
      correct: 0,
      explanation: 'المعمم هو الذي يحيط بجميع الأسنان.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر الشكلين التشريحيين لالتهاب اللثة المذكورين في الصفحة.',
      flashAnswer: 'حليمي: يشمل الحليمة اللثوية، وحافي: يشمل اللثة الحفافية.',
      explanation: 'احفظهما مع تقسيم توزع المرض موضعاً أو تعمماً.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما العلامة التي تشكل السبب الأول للاستشارة عند المرضى في التهاب اللثة؟',
      options: ['النزف اللثوي', 'تغير لون الميناء', 'سقوط السن فوراً', 'ازدياد إفراز اللعاب فقط'],
      correct: 0,
      explanation: 'النزف اللثوي ورد بوضوح كأول سبب شائع للاستشارة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي مما يلي يصف التهاب اللثة البسيط؟',
      options: ['لا يمتد إلى المسافة الرباطية ولا يحدث امتصاص في النتوء السنخي', 'يسبب جيوب رباطية عميقة منذ البداية', 'ينتج فقط عن فيروس القوباء', 'يرتبط حصراً بالحمل'],
      correct: 0,
      explanation: 'التهاب اللثة البسيط يبقى سطحياً من دون امتداد للرباط أو العظم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'العامل الجرثومي الأساسي في التهاب اللثة الإنتاني هو:',
      options: ['المكورات العنقودية', 'لولبيات فنسان فقط', 'الفيروسات التنفسية', 'الفطور'],
      correct: 0,
      explanation: 'نصت الصفحة على أن المكورات العنقودية هي العامل الجرثومي الرئيسي.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'في أي الحالات يشيع التهاب اللثة الهرموني؟',
      options: ['المراهقة والبلوغ والحمل والطمث وسن اليأس', 'بعد قلع السن فقط', 'عند الأطفال حديثي الولادة فقط', 'بعد الكسور الوجهية فقط'],
      correct: 0,
      explanation: 'التهاب اللثة الهرموني يرتبط بتبدلات الهرمونات الجنسية أو اضطرابها.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما المرض الفيروسي المرتبط بالتهاب اللثة الفقاعي؟',
      options: ['فيروس القوباء البسيط', 'فيروس التهاب الكبد', 'فيروس الإنفلونزا', 'فيروس الحصبة'],
      correct: 0,
      explanation: 'التهاب اللثة الفقاعي ينجم عن الإصابة بفيروس القوباء البسيط.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما الأعراض العامة المهمة التي ترافق إنتان فنسان؟',
      flashAnswer: 'رائحة نفس كريهة، ألم، نزف، حمى، وتوعك، مع غشاء كاذب أصفر رمادي على القرحات.',
      explanation: 'هذه العلامات تساعد على تمييز الحالة عن التهاب اللثة البسيط.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الذي يميز التهاب اللثة حول السن؟',
      options: ['امتداد الالتهاب إلى الرباط والعظم مع جيوب رباطية وتخرب عظمي', 'بقاؤه محصوراً في الحليمة فقط', 'أنه يزول دائماً دون علاج', 'أنه لا يترافق مع تقلقل الأسنان'],
      correct: 0,
      explanation: 'يمتد التهاب اللثة حول السن إلى النسج الداعمة الأعمق، ومنها الرباط والعظم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كيف تتشكل الخراجات اللثوية الرباطية غالباً؟',
      options: ['بسبب انسداد الجيب الرباطي وانحصار الفضلات وغزو الجراثيم', 'بسبب نقص الكالسيوم فقط', 'بسبب تبدل لون الميناء', 'بسبب نقص اللعاب فقط'],
      correct: 0,
      explanation: 'احتباس القيح داخل الجيب الرباطي هو أساس تشكل الخراج.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الإجراء العلاجي المباشر الأبرز للخراج اللثوي الرباطي؟',
      options: ['تفجير الخراج لإخراج القيح', 'تطبيق تقويم أسنان', 'إجراء تبييض أسنان', 'إزالة الرباعية'],
      correct: 0,
      explanation: 'المعالجة تتضمن تفجير الخراج وإخراج القيح ثم معالجة السبب.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي دواء ذُكر مرتبطاً بالضخامة اللثوية التنسجية؟',
      options: ['بديلاتين الصوديوم', 'الباراسيتامول', 'الأنسولين', 'الأموكسيسيلين'],
      correct: 0,
      explanation: 'ذكرت الصفحة مثال مرضى الصرع الذين يتناولون بديلاتين الصوديوم باستمرار.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر أنماط الضخامة اللثوية الثلاثة.',
      flashAnswer: 'ضخامة لثوية التهابية، ضخامة لثوية تنسجية، وضخامة لثوية مختلطة.',
      explanation: 'هذا التقسيم يختصر الجزء العاشر من الصفحة.'
    }
  ];

  const storageKey = 'oral-anatomy-page-09-progress-v1';
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
