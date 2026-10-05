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
      prompt: 'الطلاوة تعد من أي نوع من الآفات؟',
      options: ['آفة ما قبل سرطانية مهمة', 'آفة رضية عابرة فقط', 'مرض عظمي', 'خلل في بزوغ الأسنان'],
      correct: 0,
      explanation: 'الطلاوة تذكر بوصفها من أهم الآفات ما قبل السرطانية في الفم.'
    },
    {
      prompt: 'من أكثر الفئات إصابة بالطلاوة بحسب الصفحة؟',
      options: ['الرجال المتقدمون بالعمر', 'الأطفال فقط', 'النساء الحوامل فقط', 'المراهقون فقط'],
      correct: 0,
      explanation: 'ورد أن الطلاوة تصيب الرجال أكثر من النساء، وخاصة المتقدمين بالعمر.'
    },
    {
      prompt: 'أي من المواضع التالية من أماكن توضع الطلاوة؟',
      options: ['الغشاء المخاطي الدهليزي واللسان وقاع الفم', 'العظم السنخي فقط', 'جذر السن فقط', 'الشفاه الخارجية فقط'],
      correct: 0,
      explanation: 'هذه من أكثر المواضع المذكورة في الصفحة.'
    },
    {
      prompt: 'كيف يوصف لون الطلاوة عادة؟',
      options: ['أبيض رمادي أو أبيض مصفر', 'أزرق غامق', 'أسود لامع', 'أحمر فقط'],
      correct: 0,
      explanation: 'هذا هو اللون السريري الموصوف للطلاوة في النص.'
    },
    {
      prompt: 'ما أهم عامل مساعد على تشكل الطلاوة؟',
      options: ['التدخين', 'الماء البارد', 'الحركة التقويمية', 'الفلورايد فقط'],
      correct: 0,
      explanation: 'التدخين هو العامل الأهم، وكثير من الآفات تتراجع بعد الإقلاع عنه.'
    },
    {
      prompt: 'أي عامل يعد أيضاً مخرشاً مهماً ويُذكر مع الطلاوة؟',
      options: ['الكحول', 'النوم المبكر', 'المضغ السليم', 'غسل الأسنان'],
      correct: 0,
      explanation: 'الكحول يخرش الغشاء المخاطي ويعد عاملاً مهماً، خاصة مع التدخين.'
    },
    {
      prompt: 'سرطان مخاطية دهليز الفم يرتبط بشكل واضح مع:',
      options: ['مضغ التبغ وبعض المواد المشابهة', 'نقص الكالسيوم فقط', 'تسنين الأطفال', 'استعمال الخيط السني'],
      correct: 0,
      explanation: 'من أهم أسبابه مضغ التبغ وما يشبهه.'
    },
    {
      prompt: 'كيف يمكن أن تبدو آفة سرطان مخاطية دهليز الفم؟',
      options: ['متقرحة ومؤلمة أو ثؤلولية', 'سليمة تماماً بلا تبدل', 'سوداء فقط', 'شفافة بلا حدود'],
      correct: 0,
      explanation: 'ذكرت الصفحة أنها قد تكون متقرحة مؤلمة أو ثؤلولية.'
    },
    {
      prompt: 'سرطان اللثة قد يؤدي إلى تأخر اكتشافه لأنه:',
      options: ['يشبه التهابات اللثة السنية المنشأ', 'يترافق دوماً بكسور فكية', 'يصيب الأسنان المؤقتة فقط', 'يختفي سريعاً من دون علاج'],
      correct: 0,
      explanation: 'تشابهه مع التهابات اللثة قد يسبب سوء التشخيص أو التأخر في اكتشافه.'
    },
    {
      prompt: 'كم يشكل سرطان اللثة تقريباً من سرطانات داخل الفم؟',
      options: ['10–12%', '1% فقط', '50–60%', '90%'],
      correct: 0,
      explanation: 'النص يذكر أنه يشكل 10–12% من سرطانات داخل الفم.'
    },
    {
      prompt: 'أي الشفتين تصاب أكثر بسرطان الشفة؟',
      options: ['الشفة السفلى', 'الشفة العليا', 'كلاهما بنفس النسبة دائماً', 'لا تصاب الشفتان'],
      correct: 0,
      explanation: 'سرطان الشفة يصيب الشفة السفلى في أغلب الحالات.'
    },
    {
      prompt: 'ما العامل الأهم في سرطان الشفة بحسب الصفحة؟',
      options: ['التدخين', 'الرياضة', 'الثلج', 'تبدل الأسنان اللبنية'],
      correct: 0,
      explanation: 'التدخين هو أهم عامل مذكور في سرطان الشفة.'
    },
    {
      prompt: 'سرطان اللسان يتوضع غالباً على:',
      options: ['السطوح الجانبية أو السطح السفلي', 'ظهر اللسان فقط', 'طرف اللسان فقط دوماً', 'اللثة حصراً'],
      correct: 0,
      explanation: 'هذا هو الموضع الأكثر شيوعاً المذكور في المادة.'
    },
    {
      prompt: 'أي من العوامل التالية له دور في سرطان اللسان؟',
      options: ['التهاب مزمن وتخريش مستمر مع التدخين والكحول', 'التمرين الرياضي', 'المضمضة بالماء فقط', 'التسنين المؤقت'],
      correct: 0,
      explanation: 'ذكرت الصفحة هذه العوامل مجتمعة بوصفها مهمة.'
    },
    {
      prompt: 'كيف يكون الألم في سرطان اللسان في كثير من الحالات؟',
      options: ['قد يغيب في البداية ولا يظهر إلا مع التهاب ثانوي', 'يكون شديداً دائماً منذ البداية', 'لا يمكن أن يحدث أبداً', 'يظهر فقط أثناء النوم'],
      correct: 0,
      explanation: 'لا يترافق بالألم سريرياً إلا عندما يتعرض لالتهاب ثانوي.'
    },
    {
      prompt: 'ما المعالجة العامة المذكورة لسرطان اللسان؟',
      options: ['الجراحة أو الأشعة', 'الانتظار فقط', 'المضغ على الجهة الأخرى', 'التبييض السني'],
      correct: 0,
      explanation: 'ورد أن معالجة سرطان اللسان تتم بالجراحة أو بالأشعة.'
    }
  ];

  const storageKey = 'oral-anatomy-page-13-progress-v1';
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

  function renderQuestion() {
    const question = questions[current];
    const savedAnswer = state.answers[current];
    questionCounter.textContent = `السؤال ${current + 1} من ${questions.length}`;
    questionType.textContent = 'اختيار من متعدد';
    questionText.textContent = question.prompt;
    answerArea.innerHTML = '';
    feedbackBox.hidden = true;
    feedbackBox.className = 'feedback-box';

    const letters = ['أ', 'ب', 'ج', 'د'];
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.innerHTML = `<span class="answer-option__letter">${letters[index]}</span><span>${option}</span>`;

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

    if (savedAnswer !== null) {
      showFeedback(savedAnswer === question.correct, question.explanation);
    }

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
