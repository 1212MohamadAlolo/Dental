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
    { prompt: 'تشمل العادات الفموية السيئة في هذه الصفحة:', options: ['دفع اللسان، التنفس الفموي، مص الإصبع، والتبغ', 'بخر الفم فقط', 'القلح فقط', 'أمراض لب السن فقط'], correct: 0, explanation: 'هذه هي المحاور الأربعة الواردة في الصفحة.' },
    { prompt: 'عادة دفع اللسان تسبب غالباً:', options: ['قوة دفع مستمرة على الأسنان الأمامية', 'تكلس سني فقط', 'ضموراً فورياً في العظم', 'اختفاء الإطباق المفتوح'], correct: 0, explanation: 'النص يذكر أن هذه العادة تسبب قوة دفع مستمرة غالباً على الأسنان الأمامية.' },
    { prompt: 'من نتائج الدفع اللساني:', options: ['افتتاح في المناطق الأمامية أو الخلفية من الإطباق', 'زيادة سماكة الميناء', 'انعدام تأثير على النسج', 'اختفاء الهجرة الشفوية'], correct: 0, explanation: 'هذه إحدى التأثيرات المهمة المذكورة لعادات دفع اللسان.' },
    { prompt: 'المعالجة الأساسية لدفع اللسان تكون بـ:', options: ['وضع جهاز تقويمي للتعود على البلع الصحيح', 'إزالة الأسنان السليمة', 'المضادات الحيوية فقط', 'منع شرب الماء'], correct: 0, explanation: 'المعالجة المذكورة هي جهاز تقويمي يعلّم الطفل البلع الصحيح.' },
    { prompt: 'التنفس الفموي قد يكون ذا منشأ:', options: ['انسدادي أو اعتيادي أو تشريحي', 'سني فقط', 'لثوي فقط', 'نفسي فقط'], correct: 0, explanation: 'هذا هو الوصف الافتتاحي للتنفس الفموي في الصفحة.' },
    { prompt: 'من الأسباب المؤدية للتنفس الفموي:', options: ['انسداد المجاري التنفسية وانحراف الوتيرة الأنفية وضخامة اللوزات', 'بزوغ الأسنان فقط', 'نقص الفلور فقط', 'قلع الأسنان اللبنية فقط'], correct: 0, explanation: 'كل هذه الأمثلة وردت ضمن الأسباب.' },
    { prompt: 'من العلامات السريرية المرافقة للتنفس الفموي:', options: ['الشخير وضيق التنفس الليلي وشحوب الوجه', 'فقدان السمع', 'زيادة إفراز اللعاب فقط', 'تبدل لون اللسان فقط'], correct: 0, explanation: 'هذه علامات سريرية مذكورة بوضوح.' },
    { prompt: 'من التأثيرات الفموية للتنفس الفموي:', options: ['التهابات لثوية بسبب جفاف الفم ورائحة فم كريهة', 'تقوية اللثة', 'منع النخور السنية', 'زيادة عرض القوس السنية العلوية'], correct: 0, explanation: 'جفاف الفم والنخور والالتهابات من النتائج المهمة.' },
    { prompt: 'الشاشة الفموية الواقية تستخدم من أجل:', options: ['المساعدة على التحول التدريجي إلى التنفس الأنفي', 'زيادة التنفس الفموي', 'معالجة القلح فقط', 'تثبيت الأسنان الدائمة فقط'], correct: 0, explanation: 'هذا هو دورها العلاجي الرئيس كما ورد.' },
    { prompt: 'مص الإصبع هو غالباً تعويض عن:', options: ['اختصار مدة الرضاعة أو استبدال الرضاعة الطبيعية بالصناعية', 'زيادة شرب الماء', 'وجود سن زائدة فقط', 'التهاب اللثة فقط'], correct: 0, explanation: 'الصفحة تربط بين اختصار الرضاعة وميل الطفل إلى مص الإصبع.' },
    { prompt: 'من الأسباب الشائعة لعادة مص الإصبع:', options: ['العامل النفسي والاجتماعي ونقص حنان الأم', 'زيادة تنظيف الأسنان', 'استعمال الخيط السني', 'القلح تحت اللثوي'], correct: 0, explanation: 'هذا السبب ذُكر أولاً ضمن أسباب هذه العادة.' },
    { prompt: 'من صفات سوء الإطباق الناتج عن مص الإصبع:', options: ['بروز سني علوي وعضة مفتوحة وتضيق القوس العلوية', 'إطباق مثالي واتساع القوس', 'اختفاء الفراغ الأمامي', 'زيادة سماكة العاج'], correct: 0, explanation: 'هذه أهم السمات الإطباقية المذكورة.' },
    { prompt: 'تعتمد شدة تأثير مص الإصبع على:', options: ['وضع الإصبع ومدة العادة وعدد ساعات ممارستها', 'لون الإصبع فقط', 'وزن الطفل فقط', 'عمر الطبيب فقط'], correct: 0, explanation: 'العوامل المذكورة هي المحددات الأساسية لشدة التأثير.' },
    { prompt: 'في معالجة مص الإصبع، من الخطوات المهمة:', options: ['التوعية والمكافأة والوسائل الميكانيكية عند الحاجة', 'العقاب الشديد فقط', 'قلع الأسنان مباشرة', 'إهمال العامل النفسي'], correct: 0, explanation: 'المعالجة متعددة الجوانب وتشمل التوعية والتشجيع والوسائل التقويمية.' },
    { prompt: 'يعد التدخين في الفم:', options: ['مخرشاً موضعياً مع تجمع نواتج احتراق يسبب تغيرات فموية', 'وسيلة لمعالجة اللثة', 'سبباً لزيادة رطوبة الفم', 'بلا تأثير على الأسنان والنسج'], correct: 0, explanation: 'الصفحة تصف التبغ كمصدر حرارة ونواتج احتراق مخرشة.' },
    { prompt: 'من التغيرات الفموية عند المدخنين:', options: ['تلون الأسنان واللويحة/القلح وازدياد شدة الإصابات النسجية', 'انعدام أي إصابات لثوية', 'اختفاء اللويحة الجرثومية', 'عدم حدوث أي تغيرات مخاطية'], correct: 0, explanation: 'هذه التغيرات وردت ضمن آخر فقرة في الصفحة.' }
  ];

  const storageKey = 'oral-anatomy-page-16-progress-v1';
  let current = 0;
  let state = loadState();

  const questionCounter = document.getElementById('questionCounter');
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
  function completedCount() { return state.answers.filter((v) => v !== null).length; }
  function updateProgress() {
    const count = completedCount();
    const pct = Math.round((count / questions.length) * 100);
    document.getElementById('progressText').textContent = `${count} من ${questions.length}`;
    document.getElementById('progressPercent').textContent = `${pct}%`;
    document.getElementById('progressBar').style.width = `${pct}%`;
    const ring = document.getElementById('progressRing');
    ring.style.setProperty('--progress', `${pct * 3.6}deg`);
    ring.setAttribute('aria-label', `نسبة التقدم ${pct} بالمئة`);
  }
  function renderDots() {
    dots.innerHTML = '';
    questions.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'quiz-dot';
      dot.classList.toggle('is-current', index === current);
      dot.classList.toggle('is-done', state.answers[index] !== null);
      dot.setAttribute('aria-label', `الانتقال إلى السؤال ${index + 1}`);
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
    const saved = state.answers[current];
    questionCounter.textContent = `السؤال ${current + 1} من ${questions.length}`;
    questionText.textContent = question.prompt;
    answerArea.innerHTML = '';
    feedbackBox.hidden = true;
    feedbackBox.className = 'feedback-box';
    const letters = ['أ', 'ب', 'ج', 'د'];
    question.options.forEach((option, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-option';
      btn.innerHTML = `<span class="answer-option__letter">${letters[idx]}</span><span>${option}</span>`;
      if (saved !== null) {
        btn.disabled = true;
        if (idx === question.correct) btn.classList.add('is-revealed');
        if (idx === saved && saved === question.correct) btn.classList.add('is-correct');
        if (idx === saved && saved !== question.correct) btn.classList.add('is-wrong');
      }
      btn.addEventListener('click', () => {
        if (state.answers[current] !== null) return;
        state.answers[current] = idx;
        saveState();
        renderQuestion();
      });
      answerArea.appendChild(btn);
    });
    if (saved !== null) showFeedback(saved === question.correct, question.explanation);
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
