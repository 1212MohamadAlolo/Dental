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
      prompt: 'بأي اتجاه تظهر الحركة الطبيعية للأسنان بشكل أوضح؟',
      options: ['دهليزي لساني', 'شاقولي فقط', 'أنسي وحشي فقط', 'دوراني فقط'],
      correct: 0,
      explanation: 'الحركة الطبيعية للأسنان تكون دهليزية لسانية بشكل أوضح.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما السبب العام للحركة المرضية للأسنان؟',
      options: ['فقدان جزئي أو تام للأنسجة الداعمة', 'ازدياد سماكة الميناء', 'زيادة إفراز اللعاب', 'تبدل لون اللثة فقط'],
      correct: 0,
      explanation: 'الحركة المرضية تنتج عن فقدان النسج الداعمة أو تناقص الدعم العظمي.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'اذكر درجات الحركة السنية الثلاث.',
      flashAnswer: 'درجة أولى: دهليزي لساني. درجة ثانية: أنسي وحشي إضافة إلى دهليزي لساني. درجة ثالثة: حركة شاقولية بالإضافة إلى السابقتين.',
      explanation: 'هذا من أهم التصنيفات السريرية في الصفحة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي مما يلي يُعد من أسباب الانحسار اللثوي؟',
      options: ['الصفيحة الجرثومية والإطباق الرضي', 'نقص اللعاب وحده فقط', 'ازدياد صلابة الميناء', 'بزوغ الأسنان اللبنية'],
      correct: 0,
      explanation: 'ذكرت الصفحة الصفيحة الجرثومية والإطباق الرضي من أهم الأسباب.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما العامل التشريحي الذي يزيد ظهور الانحسار اللثوي؟',
      options: ['رقة النسج العظمي المغطي', 'زيادة حجم اللب', 'قصر الجذر فقط', 'زيادة سماكة الميناء'],
      correct: 0,
      explanation: 'كلما كانت الصفيحة العظمية المغطية رقيقة زاد احتمال الانحسار.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما هو صرير الأسنان؟',
      options: ['تشنج عضلي غير طبيعي لعضلات المضغ', 'التهاب حاد في اللثة', 'امتصاص في الميناء', 'زيادة نمو العظم السنخي'],
      correct: 0,
      explanation: 'الصفحة عرّفت صرير الأسنان بأنه داء التشنج العضلي غير الطبيعي لعضلات المضغ.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي عامل من التالي قد يتدخل في حدوث صرير الأسنان؟',
      options: ['وجود حشوة أو تاج مرتفع على مستوى الإطباق', 'ازدياد التروية الدموية', 'سماكة الميناء', 'عمر المريض فقط'],
      correct: 0,
      explanation: 'ذكرت الصفحة أن الإطباق الرضي، ومنها الحشوة أو التاج المرتفع، قد يسبب الصرير.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الإجراء الإسعافي المذكور لكسر الحلقة المفرغة في صرير الأسنان؟',
      options: ['جهاز رفع العضة', 'قلع السن مباشرة', 'غسل الفم بالماء فقط', 'تبييض الأسنان'],
      correct: 0,
      explanation: 'العلاج الإسعافي يكون بجهاز رفع العضة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما التمارين الثلاثة الموصوفة في المعالجة الفيزيائية لاضطرابات المفصل الفكي الصدغي؟',
      flashAnswer: '1) وضع اللسان خلفياً قرب اللهاة ثم فتح الفم قسرياً. 2) فتح الفم وإغلاقه على الخط المتوسط. 3) فتح الفم قسرياً واليد موضوعة على الفك السفلي.',
      explanation: 'احفظها كجزء من المعالجة المرافقة للصرير واضطرابات المفصل.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'كيف تعرّف الصفحة الإطباق الرضي؟',
      options: ['قوى إطباقية غير طبيعية تؤذي النسج الداعمة', 'حركة طبيعية للأسنان', 'التهاب في اللثة فقط', 'فرط نمو لثوي حول سن بازغ'],
      correct: 0,
      explanation: 'الإطباق الرضي هو قوى إطباقية غير طبيعية تقع على الأسنان وتؤذي النسج الداعمة.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'أي مما يلي من أسباب الإطباق الرضي؟',
      options: ['المضغ وحيد الجانب', 'زيادة سماكة العاج', 'نقص التاج السريري', 'زيادة إفراز اللعاب'],
      correct: 0,
      explanation: 'من الأسباب المذكورة بوضوح: المضغ وحيد الجانب.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما الأثر الذي قد يحدث إذا ترافق الإطباق الرضي مع صفيحة جرثومية؟',
      options: ['تشكل الجيوب اللثوية', 'اختفاء الألم تماماً', 'زيادة سماكة الميناء', 'توقف حركة الأسنان الطبيعية'],
      correct: 0,
      explanation: 'من أعراض الإطباق الرضي تشكل الجيوب اللثوية عندما يترافق مع صفيحة جرثومية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما أهم إجراء وقائي مذكور لتجنب الإطباق الرضي بعد فقد الأسنان؟',
      options: ['التعويض عن الأسنان المفقودة مباشرة', 'تأخير العلاج سنوات', 'المضغ على جهة واحدة', 'عدم معالجة النخور'],
      correct: 0,
      explanation: 'التعويض المباشر عن الأسنان المفقودة من أهم الإجراءات الوقائية.'
    },
    {
      type: 'اختيار من متعدد',
      prompt: 'ما هو التواج غالباً؟',
      options: ['التهاب النسج المحيطة بسن في طور البزوغ', 'حركة شاقولية للسن', 'فرط نشاط عضلي', 'التهاب بسبب حشوة مرتفعة'],
      correct: 0,
      explanation: 'هذا هو تعريف التواج كما ورد في الصفحة.'
    },
    {
      type: 'بطاقة تذكّر',
      prompt: 'ما السمات المهمة للتواج من حيث السن الأكثر إصابة والمضاعفة والعلاج؟',
      flashAnswer: 'يصيب غالباً الرحى الثالثة السفلية، قد يترافق بانتقال الالتهاب للخد أو البلعوم وبالضزز، ويعالج بقطع القلنسوة اللثوية وغسل المنطقة والمضامض.',
      explanation: 'هذا يلخص القسم الأخير من الصفحة.'
    }
  ];

  const storageKey = 'oral-anatomy-page-10-progress-v1';
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
