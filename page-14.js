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
      prompt: 'ما هو القلح؟',
      options: ['كتل صلبة متكلسة تلتصق على سطوح الأسنان والتعويضات الصناعية', 'غشاء مخاطي طبيعي', 'نسيج عظمي جديد', 'مادة دوائية على اللثة'],
      correct: 0,
      explanation: 'هذا هو التعريف المباشر المذكور للقلح في الصفحة.'
    },
    {
      prompt: 'كم تبلغ تقريباً نسبة الأملاح المعدنية في القلح؟',
      options: ['70–90%', '10–20%', '30–40%', '100%'],
      correct: 0,
      explanation: 'المادة تذكر أن القلح يحتوي على أملاح معدنية بنسبة 70–90%.'
    },
    {
      prompt: 'أي مكوّن يشكل النسبة الغالبة من الأملاح المعدنية في القلح؟',
      options: ['فوسفات الكالسيوم', 'كلور الصوديوم', 'أكسيد الحديد', 'فلوريد الصوديوم'],
      correct: 0,
      explanation: 'فوسفات الكالسيوم هي النسبة الغالبة من الأملاح المعدنية.'
    },
    {
      prompt: 'من مكونات المحتوى العضوي في القلح:',
      options: ['بروتينات عديدة السكريات وخلايا متوسفة وعضويات دقيقة', 'عظم ولُب فقط', 'هواء فقط', 'ماء فقط'],
      correct: 0,
      explanation: 'هذا هو المحتوى العضوي المذكور في الصفحة.'
    },
    {
      prompt: 'أكثر أماكن توضع القلح شيوعاً هي:',
      options: ['السطوح اللسانية للقواطع السفلية والسطوح الدهليزية للرحى العلوية', 'السطوح الإطباقية للرحى فقط', 'جذور الأسنان المطمورة فقط', 'الحنك فقط'],
      correct: 0,
      explanation: 'هذه المناطق مرتبطة بمناطق الانصباب اللعابي ولذلك يكثر فيها القلح.'
    },
    {
      prompt: 'القلح فوق اللثوي أو اللعابي يكون عادة:',
      options: ['أبيض أو أبيض مصفر ويزال بسهولة نسبياً', 'أسود مخضر وغير مرئي', 'مرناً شفافاً', 'داخل العظم السنخي'],
      correct: 0,
      explanation: 'هذا الوصف يخص القلح فوق اللثوي.'
    },
    {
      prompt: 'القلح تحت اللثوي أو المصلي يتميز بأنه:',
      options: ['غير مرئي وكثيف وداكن اللون ويلتصق بشدة بسطح السن', 'أبيض هش على التاج فقط', 'سهل الإزالة جداً', 'موجود على الشفاه فقط'],
      correct: 0,
      explanation: 'هذا هو الوصف الكلاسيكي للقلح تحت اللثوي.'
    },
    {
      prompt: 'التلون السني هو:',
      options: ['أصبغة ملونة تتوضع على سطوح الأسنان مسببة مشكلات تجميلية', 'فقدان في العظم السنخي', 'التهاب حاد في اللثة', 'حركة سنية مرضية'],
      correct: 0,
      explanation: 'التلون السني عُرّف بهذه الطريقة في الصفحة.'
    },
    {
      prompt: 'أي من التالي قد يسبب التلون السني؟',
      options: ['جراثيم مولدة للأصباغ أو الأطعمة أو بعض المواد الكيميائية', 'الهواء البارد فقط', 'الحركة التقويمية فقط', 'التسنين اللبني'],
      correct: 0,
      explanation: 'كل هذه الأسباب ذُكرت بوصفها عوامل للتلون السني.'
    },
    {
      prompt: 'كيف يكون لون التصبغات التبغية عادة؟',
      options: ['كستنائي غامق أو أسود', 'أبيض شفاف', 'أزرق سماوي', 'أحمر وردي'],
      correct: 0,
      explanation: 'التصبغات التبغية توصف بأنها كستنائية غامقة أو سوداء.'
    },
    {
      prompt: 'التلون الناتج عن التبغ يتعلق بدرجة كبيرة بـ:',
      options: ['الأغشية السنية الموجودة مسبقاً', 'عمر المريض فقط', 'شكل الفك فقط', 'لون الشفاه'],
      correct: 0,
      explanation: 'ذكرت الصفحة أن التلون يتعلق بدرجة عالية بالأغشية السنية الموجودة مسبقاً.'
    },
    {
      prompt: 'غبار النحاس يسبب أي لون من التلون المعدني؟',
      options: ['أخضر', 'أسمر', 'أسود فقط', 'أبيض'],
      correct: 0,
      explanation: 'غبار النحاس يسبب تلوناً أخضر.'
    },
    {
      prompt: 'أي من التالي من أمثلة التلونات المعدنية الأخرى؟',
      options: ['منغنيز (أسود) وزئبق (أسود مخضر) ونيكل (أخضر) وفضة (أسود)', 'كالسيوم فقط', 'ماء فقط', 'فيتامين A'],
      correct: 0,
      explanation: 'هذه الأمثلة ذُكرت حرفياً في النص.'
    },
    {
      prompt: 'كيف تسهم هذه التلونات في المرض اللثوي؟',
      options: ['بإيواء الجراثيم ومفرزاتها وتخريش اللثة', 'بتقوية الرباط السني', 'بتسريع بزوغ الأسنان', 'بزيادة صلابة الميناء فقط'],
      correct: 0,
      explanation: 'الخلاصة السريرية تؤكد أنها تشارك في إحداث مرض لثوي عبر الجراثيم وتخريش اللثة.'
    }
  ];

  const storageKey = 'oral-anatomy-page-14-progress-v1';
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

  function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function completedCount() { return state.answers.filter((value) => value !== null).length; }

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
      dot.addEventListener('click', () => { current = index; renderQuestion(); });
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

    if (savedAnswer !== null) showFeedback(savedAnswer === question.correct, question.explanation);
    prevButton.disabled = current === 0;
    nextButton.disabled = current === questions.length - 1;
    nextButton.textContent = current === questions.length - 1 ? 'النهاية' : 'التالي';
    renderDots();
    updateProgress();
  }

  prevButton.addEventListener('click', () => { if (current > 0) { current -= 1; renderQuestion(); } });
  nextButton.addEventListener('click', () => { if (current < questions.length - 1) { current += 1; renderQuestion(); } });
  document.getElementById('resetProgress').addEventListener('click', () => {
    state = { answers: Array(questions.length).fill(null) };
    current = 0; saveState(); renderQuestion();
  });

  renderQuestion();
})();
