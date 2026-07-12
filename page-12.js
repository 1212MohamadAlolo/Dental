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
      prompt: 'ما القطر التقريبي للتقرح القلاعي البسيط المذكور في الصفحة؟',
      options: ['1–5 ملم', '1–5 سم', '10–20 ملم دائماً', 'أقل من 0.1 ملم'],
      correct: 0,
      explanation: 'وصف المصدر التقرح البسيط بقطر يقارب 1–5 ملم.'
    },
    {
      prompt: 'ما المظهر اللوني النموذجي للقلاع؟',
      options: ['مركز مصفر وهالة حمراء', 'مركز أسود دون احمرار', 'بقعة زرقاء فقط', 'مركز أخضر وهالة بيضاء'],
      correct: 0,
      explanation: 'القلاع يوصف بمركز مصفر تحيط به هالة حمامية.'
    },
    {
      prompt: 'أين يمكن أن تتوضع الآفات القلاعية؟',
      options: ['مخاطية الشفة والدهليز والخدود واللسان وقاع الفم', 'على الميناء فقط', 'داخل العظم فقط', 'في الجلد دون الفم'],
      correct: 0,
      explanation: 'هذه هي المواضع التي ذكرها المصدر.'
    },
    {
      prompt: 'كم تستغرق معظم حالات القلاع حتى الشفاء تقريباً؟',
      options: ['نحو أسبوعين', 'عدة سنوات', 'ساعة واحدة', 'ستة أشهر دائماً'],
      correct: 0,
      explanation: 'ذكر المصدر أن معظم الحالات تشفى بعد أسبوعين تقريباً.'
    },
    {
      prompt: 'ما الدواء المرتبط بضخامة اللثة لدى بعض مرضى الصرع؟',
      options: ['الديلانتين', 'الباراسيتامول', 'الفلورايد', 'الأموكسيسيلين فقط'],
      correct: 0,
      explanation: 'الديلانتين هو الدواء المذكور في هذا القسم.'
    },
    {
      prompt: 'أي وصف يناسب ضخامة اللثة الناتجة عن الديلانتين؟',
      options: ['قاسية وغير مؤلمة وقد تشمل الأسنان الأمامية', 'رخوة ومؤلمة دائماً ومحصورة بالأرحاء', 'تختفي فوراً بعد الاستعمال', 'لا علاقة لها بالصحة الفموية'],
      correct: 0,
      explanation: 'تكون الضخامة قاسية وغير مؤلمة وتميل إلى شمول الأسنان الأمامية.'
    },
    {
      prompt: 'ما العامل الفطري الأهم في السلاق؟',
      options: ['المبيضات البيض', 'المكورات العنقودية', 'فيروس النكاف', 'اللولبيات'],
      correct: 0,
      explanation: 'السلاق يرتبط أساساً بالمبيضات البيض (Candida albicans).'
    },
    {
      prompt: 'أي فئة تعد أكثر عرضة للسلاق؟',
      options: ['الرضع الضعفاء وكبار السن', 'الشباب الأصحاء فقط', 'الرياضيون فقط', 'من لا يتناولون أدوية إطلاقاً'],
      correct: 0,
      explanation: 'ذكر المصدر الرضع الضعفاء وكبار السن ضمن الفئات الأكثر تعرضاً.'
    },
    {
      prompt: 'ما العامل الذي قد يهيئ للسلاق عند استعماله مدة طويلة؟',
      options: ['بعض المضادات الحيوية', 'الماء فقط', 'الفلورايد الموضعي', 'فرشاة الأسنان الناعمة'],
      correct: 0,
      explanation: 'الاستعمال المطول للمضادات الحيوية قد يخل بالتوازن الميكروبي ويهيئ للسلاق.'
    },
    {
      prompt: 'ما الاسم الطبي الشائع للنكاف؟',
      options: ['التهاب الغدة النكفية الوبائي', 'التهاب اللب الحاد', 'التهاب الفم القلاعي', 'التهاب العظم والنقي'],
      correct: 0,
      explanation: 'النكاف هو التهاب الغدة النكفية الوبائي.'
    },
    {
      prompt: 'ما الغدة اللعابية الأكثر تأثراً بالنكاف؟',
      options: ['الغدة النكفية', 'الغدة تحت اللسان فقط', 'الغدة تحت الفك فقط', 'الغدد اللعابية الصغرى فقط'],
      correct: 0,
      explanation: 'أكثر ما تتأثر به الغدة النكفية.'
    },
    {
      prompt: 'ما فترة حضانة النكاف المذكورة؟',
      options: ['2–3 أسابيع', '2–3 ساعات', 'يوم واحد فقط', '6 أشهر'],
      correct: 0,
      explanation: 'تتراوح فترة الحضانة بين أسبوعين وثلاثة أسابيع.'
    },
    {
      prompt: 'كيف ينتقل النكاف؟',
      options: ['بالتماس والرذاذ اللعابي', 'عن طريق العظم', 'عن طريق الميناء', 'بالحرارة فقط'],
      correct: 0,
      explanation: 'ينتقل المرض عن طريق التماس والرذاذ اللعابي.'
    },
    {
      prompt: 'أي عرض يعد نموذجياً في النكاف؟',
      options: ['تورم أمام وأسفل وخلف الأذن مع ألم عند المضغ', 'نزف لثوي دون تورم', 'قرحة قلاعية فقط', 'انعدام اللعاب بشكل دائم'],
      correct: 0,
      explanation: 'تورم الغدة النكفية حول الأذن مع ألم المضغ من العلامات الأساسية.'
    },
    {
      prompt: 'أي مما يلي يعد من اختلاطات النكاف؟',
      options: ['التهاب الخصية أو التهاب البنكرياس أو التهاب السحايا', 'زيادة سماكة الميناء', 'تطور سن زائد', 'تحول اللثة إلى عاج'],
      correct: 0,
      explanation: 'هذه الاختلاطات الثلاثة وردت في المصدر.'
    },
    {
      prompt: 'ما الإجراء الوقائي الأساسي ضد النكاف؟',
      options: ['التلقيح', 'المضاد الحيوي الوقائي دائماً', 'إزالة الغدة النكفية', 'قلع الأسنان الخلفية'],
      correct: 0,
      explanation: 'الوقاية تعتمد على اللقاح الحي المضعف.'
    }
  ];

  const storageKey = 'oral-anatomy-page-12-progress-v1';
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
