(() => {
  'use strict';

  const fileName = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const isContentPage = fileName === 'index.html' || /^page-\d{2}\.html$/i.test(fileName);
  if (!isContentPage) return;

  const STORAGE_KEY = `oral-health-ink-v2:${fileName}`;
  const SETTINGS_KEY = 'oral-health-ink-settings-v2';
  const MAX_POINTS = 5000;
  const COLORS = ['#15211f', '#1769aa', '#c43f3f', '#23825f', '#8a4ec6', '#f0bd2e'];

  let state = loadState();
  let settings = loadSettings();
  let hosts = new Map();
  let undoStack = [];
  let redoStack = [];
  let activePointer = null;
  let activeStroke = null;
  let activeHostId = null;
  let eraserBatch = null;
  let saveTimer = null;
  let lastMouseNotice = 0;

  function safeParse(value, fallback) {
    try { return JSON.parse(value); } catch (_) { return fallback; }
  }

  function loadState() {
    let saved = null;
    try { saved = safeParse(localStorage.getItem(STORAGE_KEY), null); } catch (_) {}
    if (!saved || saved.version !== 2 || typeof saved.hosts !== 'object') {
      return { version: 2, page: fileName, hosts: {}, updatedAt: Date.now() };
    }
    return saved;
  }

  function loadSettings() {
    let saved = {};
    try { saved = safeParse(localStorage.getItem(SETTINGS_KEY), {}); } catch (_) {}
    return {
      tool: ['pen', 'highlighter', 'eraser'].includes(saved.tool) ? saved.tool : 'pen',
      color: COLORS.includes(saved.color) ? saved.color : '#1769aa',
      highlighterColor: COLORS.includes(saved.highlighterColor) ? saved.highlighterColor : '#f0bd2e',
      size: [1, 2, 3].includes(saved.size) ? saved.size : 2
    };
  }

  function persistSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
  }

  function saveState(immediate = false) {
    const status = document.getElementById('inkSaveState');
    if (status) {
      status.textContent = 'جارٍ الحفظ…';
      status.className = 'ink-toolbar__save-state is-saving';
    }
    clearTimeout(saveTimer);
    const write = () => {
      state.updatedAt = Date.now();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (status) {
          status.textContent = 'محفوظ تلقائياً';
          status.className = 'ink-toolbar__save-state is-saved';
        }
      } catch (_) {
        if (status) {
          status.textContent = 'تعذر الحفظ';
          status.className = 'ink-toolbar__save-state';
        }
      }
      updateSummaryVisibility();
    };
    if (immediate) write();
    else saveTimer = setTimeout(write, 220);
  }

  function showToast(message) {
    let toast = document.querySelector('.ink-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ink-toast no-print';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  function ensureSummarySheet() {
    const panel = document.getElementById('overviewPanel');
    if (!panel || panel.querySelector('.ink-summary-sheet')) return;
    const section = document.createElement('section');
    section.className = 'content-section print-block ink-summary-sheet no-bookmark';
    section.innerHTML = `
      <div class="section-heading">
        <div><div class="section-kicker">تلخيص حر</div><h2>مساحة التلخيص والملاحظات</h2></div>
        <span class="chapter-badge">✎</span>
      </div>
      <div class="ink-summary-paper" data-ink-host-id="summary"></div>`;
    panel.appendChild(section);
  }

  function hostIdFor(element, index) {
    if (element.dataset.inkHostId) return element.dataset.inkHostId;
    const prefix = element.classList.contains('hero-card') ? 'hero' : 'section';
    const id = `${prefix}-${index}`;
    element.dataset.inkHostId = id;
    return id;
  }

  function createLayer(host, id) {
    host.classList.add('ink-host');
    let svg = host.querySelector(':scope > svg.ink-layer');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('ink-layer');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('preserveAspectRatio', 'none');
      host.appendChild(svg);
    }
    const entry = { id, host, svg, width: 1, height: 1, resizeObserver: null };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      entry.width = Math.max(1, rect.width);
      entry.height = Math.max(1, rect.height);
      svg.setAttribute('viewBox', `0 0 ${entry.width} ${entry.height}`);
      redrawHost(entry);
    };
    entry.resizeObserver = new ResizeObserver(resize);
    entry.resizeObserver.observe(host);
    svg.addEventListener('pointerdown', (event) => handlePointerDown(event, entry));
    svg.addEventListener('pointermove', (event) => handlePointerMove(event, entry));
    svg.addEventListener('pointerup', (event) => handlePointerUp(event, entry));
    svg.addEventListener('pointercancel', (event) => handlePointerUp(event, entry));
    hosts.set(id, entry);
    requestAnimationFrame(resize);
  }

  function initHosts() {
    ensureSummarySheet();
    const elements = [
      ...document.querySelectorAll('#overviewPanel > .hero-card, #overviewPanel > .content-section:not(.ink-summary-sheet)'),
      ...document.querySelectorAll('.ink-summary-paper')
    ];
    elements.forEach((element, index) => createLayer(element, hostIdFor(element, index)));
  }

  function pointsToPath(points, width, height) {
    if (!points?.length) return '';
    const px = points.map(([x, y]) => [x * width, y * height]);
    if (px.length === 1) {
      const [x, y] = px[0];
      return `M ${x} ${y} L ${x + .01} ${y + .01}`;
    }
    let d = `M ${px[0][0]} ${px[0][1]}`;
    for (let i = 1; i < px.length - 1; i += 1) {
      const [x, y] = px[i];
      const [nx, ny] = px[i + 1];
      d += ` Q ${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
    }
    const last = px[px.length - 1];
    d += ` L ${last[0]} ${last[1]}`;
    return d;
  }

  function strokeWidth(stroke, entry) {
    return Math.max(.8, stroke.widthNorm * entry.width);
  }

  function renderStroke(entry, stroke) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.dataset.strokeId = stroke.id;
    path.dataset.tool = stroke.tool;
    path.setAttribute('d', pointsToPath(stroke.points, entry.width, entry.height));
    path.setAttribute('stroke', stroke.color);
    path.setAttribute('stroke-width', String(strokeWidth(stroke, entry)));
    path.setAttribute('opacity', String(stroke.opacity ?? 1));
    return path;
  }

  function redrawHost(entry) {
    const strokes = state.hosts[entry.id] || [];
    entry.svg.replaceChildren(...strokes.map((stroke) => renderStroke(entry, stroke)));
  }

  function redrawAll() { hosts.forEach(redrawHost); }

  function localPoint(event, entry) {
    const rect = entry.svg.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    return [x / Math.max(1, rect.width), y / Math.max(1, rect.height)];
  }

  function currentWidthPx(tool) {
    const level = settings.size;
    if (tool === 'highlighter') return [13, 22, 34][level - 1];
    return [2.2, 4.2, 7.2][level - 1];
  }

  function currentColor(tool) {
    return tool === 'highlighter' ? settings.highlighterColor : settings.color;
  }

  function makeStroke(entry, point) {
    const tool = settings.tool;
    return {
      id: `ink-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      tool,
      color: currentColor(tool),
      widthNorm: currentWidthPx(tool) / entry.width,
      opacity: tool === 'highlighter' ? .32 : 1,
      points: [point]
    };
  }

  function appendCoalescedPoints(event, entry, stroke) {
    const events = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [event];
    events.forEach((item) => {
      if (stroke.points.length >= MAX_POINTS) return;
      const p = localPoint(item, entry);
      const last = stroke.points[stroke.points.length - 1];
      const dx = (p[0] - last[0]) * entry.width;
      const dy = (p[1] - last[1]) * entry.height;
      if (Math.hypot(dx, dy) >= 1.1) stroke.points.push(p);
    });
  }

  function handlePointerDown(event, entry) {
    if (!document.body.classList.contains('ink-mode')) return;
    if (event.pointerType !== 'pen') {
      if (event.pointerType === 'mouse' && Date.now() - lastMouseNotice > 1800) {
        lastMouseNotice = Date.now();
        showToast('الكتابة مفعلة للقلم فقط — استخدم الإصبع أو الماوس للتمرير');
      }
      return;
    }
    event.preventDefault();
    entry.svg.setPointerCapture?.(event.pointerId);
    activePointer = event.pointerId;
    activeHostId = entry.id;
    document.body.classList.add('ink-pen-down');

    if (settings.tool === 'eraser') {
      eraserBatch = { type: 'delete', hostId: entry.id, strokes: [] };
      eraseAt(event, entry);
      return;
    }

    const point = localPoint(event, entry);
    activeStroke = makeStroke(entry, point);
    state.hosts[entry.id] ||= [];
    state.hosts[entry.id].push(activeStroke);
    const path = renderStroke(entry, activeStroke);
    entry.svg.appendChild(path);
  }

  function handlePointerMove(event, entry) {
    if (event.pointerId !== activePointer || event.pointerType !== 'pen') return;
    if (activeHostId !== entry.id) return;
    event.preventDefault();
    if (settings.tool === 'eraser') {
      eraseAt(event, entry);
      return;
    }
    if (!activeStroke) return;
    appendCoalescedPoints(event, entry, activeStroke);
    const path = entry.svg.querySelector(`[data-stroke-id="${activeStroke.id}"]`);
    if (path) path.setAttribute('d', pointsToPath(activeStroke.points, entry.width, entry.height));
  }

  function handlePointerUp(event, entry) {
    if (event.pointerId !== activePointer) return;
    if (event.pointerType === 'pen') event.preventDefault();
    try { entry.svg.releasePointerCapture?.(event.pointerId); } catch (_) {}

    if (settings.tool === 'eraser') {
      if (eraserBatch?.strokes.length) {
        undoStack.push(eraserBatch);
        redoStack = [];
        saveState();
      }
      eraserBatch = null;
    } else if (activeStroke) {
      if (activeStroke.points.length === 1) {
        activeStroke.points.push([activeStroke.points[0][0] + .00001, activeStroke.points[0][1] + .00001]);
      }
      undoStack.push({ type: 'add', hostId: entry.id, stroke: structuredClone(activeStroke) });
      redoStack = [];
      saveState();
    }

    activePointer = null;
    document.body.classList.remove('ink-pen-down');
    activeStroke = null;
    activeHostId = null;
    updateUndoButtons();
  }

  function distanceToSegment(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const denom = abx * abx + aby * aby;
    const t = denom ? Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / denom)) : 0;
    const dx = px - (ax + t * abx);
    const dy = py - (ay + t * aby);
    return Math.hypot(dx, dy);
  }

  function strokeHit(stroke, point, entry) {
    const px = point[0] * entry.width;
    const py = point[1] * entry.height;
    const radius = 16 + strokeWidth(stroke, entry) / 2;
    const pts = stroke.points || [];
    if (pts.length === 1) {
      return Math.hypot(px - pts[0][0] * entry.width, py - pts[0][1] * entry.height) <= radius;
    }
    for (let i = 1; i < pts.length; i += 1) {
      const a = pts[i - 1];
      const b = pts[i];
      if (distanceToSegment(px, py, a[0] * entry.width, a[1] * entry.height, b[0] * entry.width, b[1] * entry.height) <= radius) return true;
    }
    return false;
  }

  function eraseAt(event, entry) {
    const point = localPoint(event, entry);
    const list = state.hosts[entry.id] || [];
    const removed = [];
    const kept = [];
    list.forEach((stroke, index) => {
      if (strokeHit(stroke, point, entry)) removed.push({ stroke: structuredClone(stroke), index });
      else kept.push(stroke);
    });
    if (!removed.length) return;
    state.hosts[entry.id] = kept;
    eraserBatch.strokes.push(...removed);
    redrawHost(entry);
  }

  function undo() {
    const action = undoStack.pop();
    if (!action) return;
    if (action.type === 'add') {
      state.hosts[action.hostId] = (state.hosts[action.hostId] || []).filter((s) => s.id !== action.stroke.id);
    } else if (action.type === 'delete') {
      const list = state.hosts[action.hostId] || [];
      action.strokes.slice().sort((a, b) => a.index - b.index).forEach(({ stroke, index }) => list.splice(Math.min(index, list.length), 0, structuredClone(stroke)));
      state.hosts[action.hostId] = list;
    } else if (action.type === 'clear') {
      state.hosts = structuredClone(action.before);
    }
    redoStack.push(action);
    redrawAll(); saveState(); updateUndoButtons();
  }

  function redo() {
    const action = redoStack.pop();
    if (!action) return;
    if (action.type === 'add') {
      state.hosts[action.hostId] ||= [];
      state.hosts[action.hostId].push(structuredClone(action.stroke));
    } else if (action.type === 'delete') {
      const ids = new Set(action.strokes.map((item) => item.stroke.id));
      state.hosts[action.hostId] = (state.hosts[action.hostId] || []).filter((s) => !ids.has(s.id));
    } else if (action.type === 'clear') {
      state.hosts = {};
    }
    undoStack.push(action);
    redrawAll(); saveState(); updateUndoButtons();
  }

  function clearAll() {
    const count = Object.values(state.hosts).reduce((sum, strokes) => sum + (strokes?.length || 0), 0);
    if (!count) { showToast('لا توجد كتابات لمسحها'); return; }
    if (!confirm('هل تريد مسح جميع الكتابات والتحديدات في هذه الصفحة؟')) return;
    undoStack.push({ type: 'clear', before: structuredClone(state.hosts) });
    redoStack = [];
    state.hosts = {};
    redrawAll(); saveState(true); updateUndoButtons();
    showToast('تم مسح جميع الكتابات — يمكنك التراجع');
  }

  function updateUndoButtons() {
    const undoBtn = document.getElementById('inkUndo');
    const redoBtn = document.getElementById('inkRedo');
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
  }

  function setTool(tool) {
    settings.tool = tool;
    persistSettings();
    document.body.dataset.inkTool = tool;
    document.querySelectorAll('[data-ink-tool]').forEach((button) => button.classList.toggle('is-active', button.dataset.inkTool === tool));
    refreshColors();
  }

  function setColor(color) {
    if (settings.tool === 'highlighter') settings.highlighterColor = color;
    else settings.color = color;
    persistSettings();
    refreshColors();
  }

  function setSize(size) {
    settings.size = size;
    persistSettings();
    document.querySelectorAll('[data-ink-size]').forEach((button) => button.classList.toggle('is-active', Number(button.dataset.inkSize) === size));
  }

  function refreshColors() {
    const selected = settings.tool === 'highlighter' ? settings.highlighterColor : settings.color;
    document.querySelectorAll('[data-ink-color]').forEach((button) => button.classList.toggle('is-active', button.dataset.inkColor === selected));
  }

  function buildToolbar() {
    if (document.querySelector('.ink-toolbar')) return;
    const toolbar = document.createElement('div');
    toolbar.className = 'ink-toolbar no-print';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'أدوات القراءة والكتابة بالقلم');
    toolbar.innerHTML = `
      <button class="ink-tool-button" id="inkExit" type="button" title="إنهاء وضع القراءة" aria-label="إنهاء وضع القراءة">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg><span class="ink-button-label">إنهاء</span>
      </button>
      <div class="ink-toolbar__brand"><strong>القراءة والتلخيص</strong><span>القلم يكتب — الإصبع يمرّر الصفحة</span></div>
      <div class="ink-tool-group" aria-label="نوع الأداة">
        <button class="ink-tool-button" data-ink-tool="pen" type="button" title="قلم" aria-label="قلم">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.4-10.4-3.2-3.2L5 15.8 4 20Z"/><path d="m13.8 7 3.2 3.2M4 20h5"/></svg><span class="ink-button-label">قلم</span>
        </button>
        <button class="ink-tool-button" data-ink-tool="highlighter" type="button" title="قلم تحديد" aria-label="قلم تحديد">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 16 8.7-8.7 3 3L10 19H7v-3Z"/><path d="M4 21h16M13.5 9.5l3 3"/></svg><span class="ink-button-label">تحديد</span>
        </button>
        <button class="ink-tool-button" data-ink-tool="eraser" type="button" title="ممحاة الخط الملموس" aria-label="ممحاة الخط الملموس">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.5 15.5 8-10a2 2 0 0 1 2.8-.3l3.5 2.8a2 2 0 0 1 .3 2.8l-6.5 8.2H7.3l-2.8-2.2a1 1 0 0 1 0-1.3Z"/><path d="m10 19 5-6"/></svg><span class="ink-button-label">ممحاة</span>
        </button>
      </div>
      <div class="ink-tool-group ink-colors" aria-label="ألوان القلم">
        ${COLORS.map((color) => `<button class="ink-color-button" data-ink-color="${color}" type="button" style="--ink-color:${color}" title="اختيار اللون" aria-label="اختيار اللون ${color}"></button>`).join('')}
      </div>
      <div class="ink-tool-group" aria-label="سماكة الخط">
        <button class="ink-size-button" data-ink-size="1" type="button" style="--dot:4px" title="خط رفيع" aria-label="خط رفيع"></button>
        <button class="ink-size-button" data-ink-size="2" type="button" style="--dot:7px" title="خط متوسط" aria-label="خط متوسط"></button>
        <button class="ink-size-button" data-ink-size="3" type="button" style="--dot:11px" title="خط عريض" aria-label="خط عريض"></button>
      </div>
      <div class="ink-tool-group" aria-label="التراجع والطباعة">
        <button class="ink-tool-button" id="inkUndo" type="button" title="تراجع" aria-label="تراجع">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6"/></svg><span class="ink-button-label">تراجع</span>
        </button>
        <button class="ink-tool-button" id="inkRedo" type="button" title="إعادة" aria-label="إعادة">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 7 5 5-5 5"/><path d="M19 12h-8a6 6 0 0 0-6 6"/></svg><span class="ink-button-label">إعادة</span>
        </button>
        <button class="ink-tool-button" id="inkSummary" type="button" title="الانتقال إلى ورقة التلخيص" aria-label="الانتقال إلى ورقة التلخيص">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg><span class="ink-button-label">تلخيص</span>
        </button>
        <button class="ink-tool-button" id="inkPrint" type="button" title="طباعة أو حفظ PDF مع الكتابات" aria-label="طباعة أو حفظ PDF مع الكتابات">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"/></svg><span class="ink-button-label">PDF</span>
        </button>
        <button class="ink-tool-button is-danger" id="inkClear" type="button" title="مسح جميع الكتابات" aria-label="مسح جميع الكتابات">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M8 10v8M12 10v8M16 10v8M6 7l1 14h10l1-14"/></svg><span class="ink-button-label">مسح الكل</span>
        </button>
      </div>
      <span id="inkSaveState" class="ink-toolbar__save-state is-saved">محفوظ تلقائياً</span>`;
    document.body.appendChild(toolbar);

    toolbar.querySelectorAll('[data-ink-tool]').forEach((button) => button.addEventListener('click', () => setTool(button.dataset.inkTool)));
    toolbar.querySelectorAll('[data-ink-color]').forEach((button) => button.addEventListener('click', () => setColor(button.dataset.inkColor)));
    toolbar.querySelectorAll('[data-ink-size]').forEach((button) => button.addEventListener('click', () => setSize(Number(button.dataset.inkSize))));
    document.getElementById('inkExit').addEventListener('click', exitMode);
    document.getElementById('inkUndo').addEventListener('click', undo);
    document.getElementById('inkRedo').addEventListener('click', redo);
    document.getElementById('inkClear').addEventListener('click', clearAll);
    document.getElementById('inkSummary').addEventListener('click', () => {
      document.querySelector('.ink-summary-sheet')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('inkPrint').addEventListener('click', () => {
      saveState(true);
      showToast('اختر «حفظ بصيغة PDF» من نافذة الطباعة');
      setTimeout(() => window.print(), 250);
    });

    const intro = document.createElement('div');
    intro.className = 'ink-mode-intro no-print';
    intro.textContent = 'القلم فقط للكتابة — الإصبع للتمرير والتكبير';
    document.body.appendChild(intro);

    setTool(settings.tool);
    setSize(settings.size);
    refreshColors();
    updateUndoButtons();
  }

  function ensureEntryButtons() {
    const actions = document.querySelector('.topbar__actions');
    if (actions && !actions.querySelector('.ink-entry-pill')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ink-entry-pill no-print';
      button.title = 'وضع القراءة والتلخيص بالقلم';
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.4-10.4-3.2-3.2L5 15.8 4 20Z"/><path d="m13.8 7 3.2 3.2M4 20h5"/></svg><span>قراءة وتلخيص</span>`;
      button.addEventListener('click', enterMode);
      actions.insertBefore(button, actions.querySelector('.icon-button'));
    }
    const dockButton = document.getElementById('globalInkToggle');
    if (dockButton) dockButton.addEventListener('click', enterMode);
  }

  function enterMode() {
    const overviewTab = document.getElementById('overviewTab');
    if (overviewTab && !overviewTab.classList.contains('is-active')) overviewTab.click();
    document.body.classList.add('ink-mode');
    document.body.dataset.inkTool = settings.tool;
    showToast('تم تفعيل وضع القراءة: اكتب بالقلم، واستخدم الإصبع للتمرير');
  }

  function exitMode() {
    saveState(true);
    document.body.classList.remove('ink-mode');
    showToast('تم حفظ الكتابات والملاحظات');
  }

  function updateSummaryVisibility() {
    const section = document.querySelector('.ink-summary-sheet');
    if (!section) return;
    const hasInk = (state.hosts.summary || []).length > 0;
    section.classList.toggle('has-ink', hasInk);
  }

  function init() {
    buildToolbar();
    initHosts();
    ensureEntryButtons();
    updateSummaryVisibility();
    redrawAll();

    const observer = new MutationObserver(() => ensureEntryButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('touchmove', (event) => {
      if (activePointer !== null) event.preventDefault();
    }, { passive: false });

    window.addEventListener('beforeunload', () => saveState(true));
    window.addEventListener('keydown', (event) => {
      if (!document.body.classList.contains('ink-mode')) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
      }
      if (event.key === 'Escape') exitMode();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
