(() => {
  'use strict';
  const KEY = 'oral-health-learning-path-v3';
  const PREVIOUS_KEY = 'oral-health-learning-path-v2';
  const MIGRATION_KEY = 'oral-health-learning-path-v3-migrated';
  const course = window.ORAL_HEALTH_COURSE;

  const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const doneStatuses = ['completed', 'mastered', 'needs_review'];

  function emptyState() {
    return {
      version: 3, currentLessonId: '', currentStep: 0, currentMode: 'lesson', lastActivityAt: 0,
      lessons: {}, units: {}, migration: { completed: false, at: 0, source: '' }
    };
  }

  function normalize(raw) {
    if (!raw || raw.version !== 3) return emptyState();
    return { ...emptyState(), ...raw, lessons: raw.lessons || {}, units: raw.units || {}, migration: raw.migration || {} };
  }

  function read() { return normalize(safeParse(localStorage.getItem(KEY), null)); }
  function write(next) {
    next.version = 3; next.lastActivityAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (_) {}
    return next;
  }

  function allUnits() {
    return course.modules.flatMap((module) => module.units.map((unit) => ({ ...unit, moduleId: module.id, moduleTitle: module.title })));
  }
  function allLessons() {
    return allUnits().flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id, unitTitle: unit.title, moduleId: unit.moduleId, moduleTitle: unit.moduleTitle })));
  }
  function getUnit(id) { return allUnits().find((unit) => unit.id === id); }
  function getLesson(id) { return allLessons().find((lesson) => lesson.id === id); }

  function migrateFromV2(next) {
    const old = safeParse(localStorage.getItem(PREVIOUS_KEY), null);
    if (!old || old.version !== 2) return false;
    Object.entries(old.lessons || {}).forEach(([id, rec]) => {
      if (!getLesson(id)) return;
      next.lessons[id] = {
        status: rec.status || 'not_started', score: Number(rec.score) || 0, attempts: Number(rec.attempts) || 0,
        step: Number.isInteger(rec.step) ? rec.step : 0, answers: rec.answers || {}, optionOrders: {},
        questionAttempts: {}, outcomes: {}, verified: {}, wrongQuestionIds: [], completedAt: rec.completedAt || 0,
        migratedFromV2: true
      };
    });
    Object.entries(old.units || {}).forEach(([id, rec]) => {
      if (!getUnit(id)) return;
      next.units[id] = {
        checkpointStatus: rec.checkpointStatus || 'locked', checkpointScore: Number(rec.checkpointScore) || 0,
        checkpointAttempts: Number(rec.checkpointAttempts) || 0, bestScore: Number(rec.checkpointScore) || 0,
        history: rec.checkpointCompletedAt ? [{ score: Number(rec.checkpointScore) || 0, completedAt: rec.checkpointCompletedAt, wrongQuestionIds: [] }] : [],
        currentAttempt: null, migratedFromV2: true
      };
    });
    next.currentLessonId = old.currentLessonId || '';
    next.currentStep = Number.isInteger(old.currentStep) ? old.currentStep : 0;
    next.currentMode = old.currentMode || 'lesson';
    next.migration = { completed: true, at: Date.now(), source: PREVIOUS_KEY };
    return true;
  }

  function migrateLegacyPages(next) {
    let changed = false;
    allUnits().forEach((unit) => {
      const legacy = safeParse(localStorage.getItem(unit.legacyStorageKey), null);
      if (!legacy || !Array.isArray(legacy.answers)) return;
      const answered = legacy.answers.filter((a) => a !== null && a !== undefined).length;
      if (!answered) return;
      const ratio = answered / Math.max(legacy.answers.length, 1);
      const count = Math.min(unit.lessons.length, Math.max(1, Math.floor(ratio * unit.lessons.length)));
      unit.lessons.forEach((lesson, index) => {
        if (index >= count || next.lessons[lesson.id]) return;
        next.lessons[lesson.id] = {
          status: ratio === 1 ? 'completed' : (index === count - 1 ? 'in_progress' : 'completed'),
          score: 0, attempts: 0, step: ratio === 1 ? 999 : 0, answers: {}, optionOrders: {}, questionAttempts: {},
          outcomes: {}, verified: {}, wrongQuestionIds: [], migratedFromLegacyPage: true, completedAt: ratio === 1 ? Date.now() : 0
        };
        changed = true;
      });
    });
    return changed;
  }

  function migrate() {
    let next = read();
    if (next.migration?.completed || localStorage.getItem(MIGRATION_KEY) === '1') return next;
    const fromV2 = migrateFromV2(next);
    const fromLegacy = migrateLegacyPages(next);
    next.migration = { completed: true, at: Date.now(), source: fromV2 ? PREVIOUS_KEY : (fromLegacy ? 'legacy-page-keys' : 'none') };
    try { localStorage.setItem(MIGRATION_KEY, '1'); } catch (_) {}
    return write(next);
  }

  let state = migrate();
  function refresh() { state = read(); return state; }
  function lessonRecord(id) {
    const rec = state.lessons[id] || {};
    return {
      status: 'not_started', score: 0, attempts: 0, step: 0, answers: {}, optionOrders: {}, questionAttempts: {},
      outcomes: {}, verified: {}, wrongQuestionIds: [], reviewedQuestionIds: [], reviewAttempt: null, ...rec
    };
  }
  function unitRecord(id) {
    const rec = state.units[id] || {};
    return { checkpointStatus: 'locked', checkpointScore: 0, checkpointAttempts: 0, bestScore: 0, history: [], currentAttempt: null, ...rec };
  }

  function previousUnit(unitId) {
    const units = allUnits(); const index = units.findIndex((u) => u.id === unitId);
    return index > 0 ? units[index - 1] : null;
  }
  function isUnitUnlocked(unitId) {
    const prev = previousUnit(unitId);
    return !prev || doneStatuses.includes(unitRecord(prev.id).checkpointStatus);
  }
  function lessonStatus(lessonId) {
    const lesson = getLesson(lessonId); if (!lesson) return 'locked';
    const unit = getUnit(lesson.unitId); if (!isUnitUnlocked(unit.id)) return 'locked';
    const index = unit.lessons.findIndex((x) => x.id === lessonId);
    if (index > 0 && !doneStatuses.includes(lessonRecord(unit.lessons[index - 1].id).status)) return 'locked';
    const status = lessonRecord(lessonId).status;
    return status && status !== 'not_started' ? status : 'available';
  }
  function checkpointStatus(unitId) {
    const unit = getUnit(unitId); if (!unit) return 'locked';
    if (!unit.lessons.every((lesson) => doneStatuses.includes(lessonRecord(lesson.id).status))) return 'locked';
    const status = unitRecord(unitId).checkpointStatus;
    return status === 'locked' ? 'available' : status;
  }

  function mergeLesson(prev, patch) {
    return {
      ...prev, ...patch,
      answers: { ...(prev.answers || {}), ...(patch.answers || {}) },
      optionOrders: { ...(prev.optionOrders || {}), ...(patch.optionOrders || {}) },
      questionAttempts: { ...(prev.questionAttempts || {}), ...(patch.questionAttempts || {}) },
      outcomes: { ...(prev.outcomes || {}), ...(patch.outcomes || {}) },
      verified: { ...(prev.verified || {}), ...(patch.verified || {}) },
      wrongQuestionIds: patch.wrongQuestionIds ? [...new Set(patch.wrongQuestionIds)] : (prev.wrongQuestionIds || []),
      reviewedQuestionIds: patch.reviewedQuestionIds ? [...new Set(patch.reviewedQuestionIds)] : (prev.reviewedQuestionIds || [])
    };
  }
  function saveLessonProgress(lessonId, patch) {
    refresh(); const prev = lessonRecord(lessonId);
    state.lessons[lessonId] = mergeLesson(prev, patch);
    state.currentLessonId = lessonId; state.currentMode = patch.currentMode || 'lesson';
    if (Number.isInteger(patch.step)) state.currentStep = patch.step;
    write(state); return state.lessons[lessonId];
  }
  function completeLesson(lessonId, score, wrongQuestionIds = []) {
    refresh(); const prev = lessonRecord(lessonId);
    const status = score >= 70 && wrongQuestionIds.length === 0 ? 'mastered' : 'needs_review';
    state.lessons[lessonId] = mergeLesson(prev, {
      status, score, wrongQuestionIds, attempts: (prev.attempts || 0) + 1, completedAt: Date.now(), step: 999
    });
    state.currentLessonId = lessonId; state.currentMode = 'lesson'; state.currentStep = 999;
    write(state); return state.lessons[lessonId];
  }

  function shuffleIndices(length) {
    const arr = Array.from({ length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }
  function ensureLessonOptionOrder(lessonId, questionId, optionCount, force = false, review = false) {
    refresh(); const prev = lessonRecord(lessonId);
    const key = review ? 'reviewOptionOrders' : 'optionOrders';
    const current = prev[key]?.[questionId];
    if (!force && Array.isArray(current) && current.length === optionCount) return current;
    const order = shuffleIndices(optionCount);
    state.lessons[lessonId] = mergeLesson(prev, { [key]: { ...(prev[key] || {}), [questionId]: order } });
    write(state); return order;
  }

  function startLessonReview(lessonId, force = false) {
    refresh(); const prev = lessonRecord(lessonId); const ids = prev.wrongQuestionIds || [];
    if (!force && prev.reviewAttempt && !prev.reviewAttempt.completed) return prev.reviewAttempt;
    const optionOrders = {};
    ids.forEach((id) => { const q = course.questionBank[id]; if (q?.options) optionOrders[id] = shuffleIndices(q.options.length); });
    const attempt = { id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, startedAt: Date.now(), questionOrder: [...ids], optionOrders, answers: {}, outcomes: {}, verified: {}, completed: false };
    state.lessons[lessonId] = mergeLesson(prev, { reviewAttempt: attempt }); write(state); return attempt;
  }
  function saveReviewAnswer(lessonId, questionId, patch) {
    refresh(); const prev = lessonRecord(lessonId); const attempt = prev.reviewAttempt || startLessonReview(lessonId);
    const next = { ...attempt, answers: { ...(attempt.answers || {}), ...(patch.answers || {}) }, outcomes: { ...(attempt.outcomes || {}), ...(patch.outcomes || {}) }, verified: { ...(attempt.verified || {}), ...(patch.verified || {}) } };
    state.lessons[lessonId] = mergeLesson(prev, { reviewAttempt: next }); write(state); return next;
  }
  function completeLessonReview(lessonId) {
    refresh(); const prev = lessonRecord(lessonId); const attempt = prev.reviewAttempt || { questionOrder: [], outcomes: {} };
    const remaining = (attempt.questionOrder || []).filter((id) => attempt.outcomes?.[id] !== true);
    const reviewed = (attempt.questionOrder || []).filter((id) => attempt.outcomes?.[id] === true);
    state.lessons[lessonId] = mergeLesson(prev, {
      status: remaining.length ? 'needs_review' : 'mastered', wrongQuestionIds: remaining,
      reviewedQuestionIds: [...(prev.reviewedQuestionIds || []), ...reviewed], reviewAttempt: { ...attempt, completed: true, completedAt: Date.now() }
    });
    write(state); return state.lessons[lessonId];
  }

  function startCheckpointAttempt(unitId, questionIds, forceNew = false) {
    refresh(); const prev = unitRecord(unitId); const existing = prev.currentAttempt;
    if (!forceNew && existing && !existing.completed && Array.isArray(existing.questionOrder) && existing.questionOrder.length) return existing;
    const objectiveIds = questionIds.filter((id) => course.questionBank[id]?.options && !course.questionBank[id]?.flashAnswer);
    const questionOrder = shuffleIndices(objectiveIds.length).map((i) => objectiveIds[i]);
    const optionOrders = {};
    questionOrder.forEach((id) => { optionOrders[id] = shuffleIndices(course.questionBank[id].options.length); });
    const attempt = {
      id: `checkpoint-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, startedAt: Date.now(), currentStep: 0,
      questionOrder, optionOrders, answers: {}, outcomes: {}, verified: {}, wrongQuestionIds: [], completed: false
    };
    state.units[unitId] = { ...prev, currentAttempt: attempt, checkpointStatus: 'in_progress' };
    state.currentLessonId = `${unitId}-checkpoint`; state.currentMode = 'checkpoint'; state.currentStep = 0;
    write(state); return attempt;
  }
  function saveCheckpointAttempt(unitId, patch) {
    refresh(); const prev = unitRecord(unitId); const old = prev.currentAttempt || {};
    const next = {
      ...old, ...patch,
      answers: { ...(old.answers || {}), ...(patch.answers || {}) }, outcomes: { ...(old.outcomes || {}), ...(patch.outcomes || {}) },
      verified: { ...(old.verified || {}), ...(patch.verified || {}) },
      wrongQuestionIds: patch.wrongQuestionIds ? [...new Set(patch.wrongQuestionIds)] : (old.wrongQuestionIds || [])
    };
    state.units[unitId] = { ...prev, currentAttempt: next, checkpointStatus: 'in_progress' };
    state.currentLessonId = `${unitId}-checkpoint`; state.currentMode = 'checkpoint';
    if (Number.isInteger(next.currentStep)) state.currentStep = next.currentStep;
    write(state); return next;
  }
  function completeCheckpoint(unitId, score, wrongQuestionIds = []) {
    refresh(); const prev = unitRecord(unitId); const attempt = prev.currentAttempt || {};
    const historyItem = { id: attempt.id || '', score, completedAt: Date.now(), wrongQuestionIds: [...wrongQuestionIds] };
    const status = score >= 80 ? 'mastered' : 'needs_review';
    state.units[unitId] = {
      ...prev, checkpointScore: score, checkpointAttempts: (prev.checkpointAttempts || 0) + 1,
      checkpointStatus: status, checkpointCompletedAt: historyItem.completedAt,
      bestScore: Math.max(Number(prev.bestScore) || 0, score), history: [...(prev.history || []), historyItem],
      currentAttempt: { ...attempt, completed: true, completedAt: historyItem.completedAt, score, wrongQuestionIds: [...wrongQuestionIds] }
    };
    state.currentLessonId = `${unitId}-checkpoint`; state.currentMode = 'checkpoint'; write(state);
    return state.units[unitId];
  }

  function firstTargetInUnit(unitId) {
    const unit = getUnit(unitId); if (!unit || !isUnitUnlocked(unitId)) return null;
    for (const lesson of unit.lessons) {
      const status = lessonStatus(lesson.id);
      if (status === 'in_progress' || status === 'available') return { type: 'lesson', unit, lesson };
    }
    const cp = checkpointStatus(unitId);
    if (cp === 'available' || cp === 'in_progress') return { type: 'checkpoint', unit };
    return null;
  }
  function nextLearningTarget() {
    refresh();
    if (state.currentMode === 'lesson' && state.currentLessonId) {
      const current = getLesson(state.currentLessonId);
      if (current && lessonStatus(current.id) === 'in_progress') return { type: 'lesson', unit: getUnit(current.unitId), lesson: current };
    }
    if (state.currentMode === 'checkpoint' && /-checkpoint$/.test(state.currentLessonId || '')) {
      const unitId = state.currentLessonId.replace(/-checkpoint$/, '');
      if (checkpointStatus(unitId) === 'in_progress') return { type: 'checkpoint', unit: getUnit(unitId) };
    }
    for (const unit of allUnits()) { const target = firstTargetInUnit(unit.id); if (target) return target; }
    return { type: 'complete' };
  }
  function continueTarget() { return nextLearningTarget(); }
  function nextAfterLesson(lessonId) {
    refresh(); const lesson = getLesson(lessonId); if (!lesson) return nextLearningTarget();
    const unit = getUnit(lesson.unitId); const index = unit.lessons.findIndex((x) => x.id === lessonId);
    if (index >= 0 && index < unit.lessons.length - 1) return { type: 'lesson', unit, lesson: unit.lessons[index + 1] };
    return { type: 'checkpoint', unit };
  }
  function nextAfterCheckpoint(unitId) {
    const units = allUnits(); const index = units.findIndex((u) => u.id === unitId);
    if (index >= 0 && index < units.length - 1) return { type: 'lesson', unit: units[index + 1], lesson: units[index + 1].lessons[0] };
    return { type: 'complete' };
  }
  function reviewQueue() {
    refresh(); const items = [];
    allLessons().forEach((lesson) => {
      const rec = lessonRecord(lesson.id);
      if (rec.status === 'needs_review' || (rec.wrongQuestionIds || []).length) items.push({ type: 'lesson', lesson, unit: getUnit(lesson.unitId), score: rec.score || 0, wrongQuestionIds: rec.wrongQuestionIds || [], updatedAt: rec.completedAt || 0 });
    });
    allUnits().forEach((unit) => {
      const rec = unitRecord(unit.id);
      if (rec.checkpointStatus === 'needs_review') items.push({ type: 'checkpoint', unit, score: rec.checkpointScore || 0, wrongQuestionIds: rec.currentAttempt?.wrongQuestionIds || [], updatedAt: rec.checkpointCompletedAt || 0 });
    });
    return items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
  function targetUrl(target) {
    if (!target || target.type === 'complete') return 'learning-map.html';
    if (target.type === 'checkpoint') return `lesson.html?unit=${encodeURIComponent(target.unit.id)}&mode=checkpoint`;
    return `lesson.html?unit=${encodeURIComponent(target.unit.id)}&lesson=${encodeURIComponent(target.lesson.id)}`;
  }
  function totals() {
    const lessons = allLessons();
    const completed = lessons.filter((lesson) => doneStatuses.includes(lessonRecord(lesson.id).status)).length;
    const mastered = lessons.filter((lesson) => lessonRecord(lesson.id).status === 'mastered').length;
    const checkpoints = allUnits().filter((unit) => doneStatuses.includes(unitRecord(unit.id).checkpointStatus)).length;
    const totalItems = lessons.length + allUnits().length;
    return { lessons: lessons.length, completed, mastered, checkpoints, totalItems, reviewCount: reviewQueue().length, percent: Math.round(((completed + checkpoints) / Math.max(totalItems, 1)) * 100) };
  }
  function reset() {
    state = emptyState(); state.migration = { completed: true, at: Date.now(), source: 'user-reset' };
    localStorage.removeItem(KEY); try { localStorage.setItem(MIGRATION_KEY, '1'); } catch (_) {}
    return write(state);
  }

  window.LearningProgress = {
    KEY, PREVIOUS_KEY, refresh, getState: () => state, allUnits, allLessons, getUnit, getLesson, lessonRecord, unitRecord,
    lessonStatus, checkpointStatus, isUnitUnlocked, saveLessonProgress, completeLesson, ensureLessonOptionOrder,
    startLessonReview, saveReviewAnswer, completeLessonReview, startCheckpointAttempt, saveCheckpointAttempt, completeCheckpoint,
    firstTargetInUnit, nextLearningTarget, continueTarget, nextAfterLesson, nextAfterCheckpoint, reviewQueue, targetUrl, totals, reset,
    _test: { shuffleIndices, doneStatuses }
  };
})();
