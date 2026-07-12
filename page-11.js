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

  const questions = [
    {
      type: 'اختيار من متعدد',
      prompt: 'ما السبب الرئيسي في التهاب الفم القلاعي كما ورد في الصفحة؟',
      options: ['تجمع الصفيحة اللثوية السنية وتحولها إلى قلح', 'التعرض للزئبق', 'حساسية دوائية فقط', 'زيادة إفراز اللعاب'],
      correct: 0,
      explanation: 'الصفحة بدأت التهاب الفم القلاعي باعتباره ناجماً عن غياب الصحة الفموية وتجمع الصفيحة وتحولها إلى قلح.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'في أي منطقة يكثر التهاب الفم القلاعي بالنسبة للقواطع السفلية؟',
      options: ['السطوح اللسانية', 'السطوح الطاحنة', 'السطوح الأنفية', 'السطوح الوحشية فقط'],
      correct: 0,
      explanation: 'يكثر في اللسانية للقواطع السفلية بسبب قربها من فوهة الغدة تحت اللسان.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر الخطوط العامة لمعالجة التهاب الفم القلاعي.',
      flashAnswer: 'إزالة القلح، العناية بالصحة الفموية، معالجة الأسنان النخرة، إعادة نقاط التماس، وإصلاح وضع الأسنان الشاذة تقويمياً عند الحاجة.',
      explanation: 'هذا هو لب المعالجة في هذا القسم.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي مادة مما يلي عُدت من مواد التبغ المحرضة للالتهاب؟',
      options: ['الفينول', 'الكولاجين', 'الفلور', 'الهيدروكسي أباتيت'],
      correct: 0,
      explanation: 'الفينول ذُكر مع حمض سيان هيدريك وأكسيد الأزوت والقطران ضمن المواد المحرضة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما تأثير النيكوتين المذكور في الصفحة؟',
      options: ['ينقص إفراز اللعاب ويحرض زيادة الدوران الدموي', 'يزيد تكلس العظم', 'يقوي النشاط الهدبي', 'يزيد مقاومة المخاطية'],
      correct: 0,
      explanation: 'النص ذكر بوضوح أن النيكوتين ينقص إفراز اللعاب ويحرض زيادة الدوران الدموي.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما العلاج السببي الرئيسي لالتهاب الفم واللثة التبغي؟',
      options: ['الإقلاع عن التدخين', 'الاستمرار على نفس العادات', 'قلع الأسنان', 'تطبيق جهاز تقويمي'],
      correct: 0,
      explanation: 'المعالجة تعتمد على الإقلاع عن التدخين.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي مما يلي يعد عاملاً مسبباً لالتهاب الفم الناتج عن التعويضات الصناعية؟',
      options: ['استطالة حواف الجهاز', 'زيادة صلابة الميناء', 'قصر الجذر فقط', 'اللون الطبيعي للمخاطية'],
      correct: 0,
      explanation: 'استطالة الحواف أو وجود خشونة أو نتوءات كلها من العوامل المسببة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كم تدوم التقرحات الرضية الناتجة عن الجهاز عادة؟',
      options: ['7–10 أيام', '24 ساعة', 'شهر كامل دائماً', 'سنة كاملة'],
      correct: 0,
      explanation: 'النص ذكر أن هذه التقرحات تدوم من 7 إلى 10 أيام.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الاختيار الأفضل وقائياً عندما يكون ذلك ممكناً؟',
      options: ['التعويضات الثابتة أو الهيكلية ذات الدعم السني', 'كل التعويضات اللدنة دائماً', 'عدم تنظيف الأجهزة', 'إهمال التقرحات'],
      correct: 0,
      explanation: 'الوقاية تفضّل التعويضات الثابتة ما أمكن والهيكلية ذات الدعم السني.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'بماذا يتميز التهاب الفم الرصاصي؟',
      options: ['خط أزرق مسود يحيط باللثويات', 'لون أصفر للتاج', 'نقص حجم اللسان', 'غياب اللعاب فقط'],
      correct: 0,
      explanation: 'هذه هي العلامة الوصفية المميزة للفم الرصاصي.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي نوع من التهاب الفم المعدني قد يسبب طعماً معدنياً وتأكلاً ونخراً؟',
      options: ['التهاب الفم الزرنيخي', 'التهاب الفم الفوسفوري', 'التهاب الفم القلاعي', 'التهاب الفم القلحي'],
      correct: 0,
      explanation: 'الفم الزرنيخي يوصف بوجود طعم معدني وتبدلات سنية ومخاطية مختلفة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'في التهاب الفم البرموتي، ما الذي يحيط باللثويات؟',
      options: ['خط برموتي', 'خط أبيض طباشيري', 'تصبغ بنفسجي فقط في اللسان', 'لا تغيرات لثوية'],
      correct: 0,
      explanation: 'الفم البرموتي يتميز بحدوث خط برموتي يحيط باللثويات.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما أبرز ما قد يحدث في التهاب الفم الزئبقي؟',
      options: ['التهاب لثة تقرحي مع غزارة في اللعاب', 'زيادة سماكة الميناء', 'نقص الحساسية السنية دائماً', 'اختفاء كل الأعراض تلقائياً'],
      correct: 0,
      explanation: 'ذكر النص التهاب اللثة التقرحي، وانتباج الشفاه واللسان، وغزارة اللعاب في الفم الزئبقي.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'بماذا يتميز التهاب الفم الفوسفوري؟',
      options: ['ضياع سريع لأسنان المصاب بسبب تخرب العظم', 'خط أزرق حول اللثة', 'غياب كل التقرحات', 'يقتصر على اللسان فقط'],
      correct: 0,
      explanation: 'هذه هي الصفة الأهم المذكورة لهذا النوع.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'كيف تفرّق بسرعة بين الأنواع الأربعة الكبرى في هذه الصفحة؟',
      flashAnswer: 'القلاعي/القلحي: قلح وصحة فموية سيئة. التبغي: مواد التبغ والنيكوتين. التعويضات الصناعية: ضغط أو خرش الجهاز وحوافه. التحسس للمعادن: تعرض مزمن للرصاص أو الزرنيخ أو البرموت أو الزئبق أو الفوسفور.',
      explanation: 'هذا التصنيف السريع يسهل تذكر الصفحة كاملة.'
    }
  ];

  const storageKey = 'oral-anatomy-page-11-progress-v1';
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
