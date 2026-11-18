/* =====================================================================
   Home-page figure. One synthetic signal on a grid of cells, drawn under
   three constraints (one per research area):
     compute   - only the highest-scoring fifth of the cells is kept
     labels    - two annotators label each cell; near the boundaries they
                 disagree (split cells), and a few labels are plain noise (dots)
     encrypted - the input is scrambled; only a small result is readable
   The data is random and regenerated on every visit. Colours: viridis.
   ===================================================================== */
(function () {
  'use strict';
  var root = document.getElementById('fig');
  if (!root) return;
  var svg = root.querySelector('.fig-art');
  var legend = root.querySelector('.fig-legend');
  var readout = root.querySelector('.fig-readout');
  var modeBtns = [].slice.call(root.querySelectorAll('[data-fig-mode]'));
  var redrawBtn = root.querySelector('[data-fig-redraw]');
  var captions = [].slice.call(document.querySelectorAll('[data-fig-cap]'));
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  var VIRIDIS = [[68, 1, 84], [72, 36, 117], [65, 68, 135], [53, 95, 141], [42, 120, 142], [33, 144, 141],
                 [34, 168, 132], [66, 190, 113], [122, 209, 81], [187, 223, 39], [253, 231, 37]];
  function viridis(t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    var x = t * 10, i = Math.min(9, Math.floor(x)), f = x - i, a = VIRIDIS[i], b = VIRIDIS[i + 1];
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' + Math.round(a[1] + (b[1] - a[1]) * f) + ',' + Math.round(a[2] + (b[2] - a[2]) * f) + ')';
  }
  /* small seeded random generator (mulberry32), so one sample can be redrawn at a new size */
  function rng(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function el(name, attrs) { var e = document.createElementNS(NS, name); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  var S = { mode: modeBtns.length ? modeBtns[0].getAttribute('data-fig-mode') : 'compute', seed: (Math.random() * 1e9) | 0,
            cols: 0, rows: 0, w: 0, size: 0, gap: 0, cells: [], field: null, rule: null };
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- grid ---------- */
  function layout() {
    var w = svg.getBoundingClientRect().width;
    if (w < 60) return false;
    var small = w < 520;
    var gap = small ? 3 : 4;
    var cols = Math.max(12, Math.min(36, Math.round(w / (small ? 23 : 27))));
    var rows = small ? 8 : 9;
    if (cols === S.cols && rows === S.rows && Math.abs(w - S.w) < 1) return true;
    var size = (w - gap * (cols - 1)) / cols;
    var h = rows * size + gap * (rows - 1);
    S.cols = cols; S.rows = rows; S.w = w; S.size = size; S.gap = gap;
    svg.setAttribute('viewBox', '0 0 ' + w.toFixed(2) + ' ' + h.toFixed(2));
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = el('defs', {}), clip = el('clipPath', { id: 'fig-cell', clipPathUnits: 'objectBoundingBox' });
    clip.appendChild(el('rect', { x: 0, y: 0, width: 1, height: 1, rx: 0.13, ry: 0.13 }));
    defs.appendChild(clip); svg.appendChild(defs);
    S.cells = [];
    var rad = (size * 0.13).toFixed(2);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = c * (size + gap), y = r * (size + gap);
        var a = el('rect', { 'class': 'c-a off', x: x.toFixed(2), y: y.toFixed(2), width: size.toFixed(2), height: size.toFixed(2), rx: rad, ry: rad });
        var b = el('path', { 'class': 'c-b', 'clip-path': 'url(#fig-cell)',
          d: 'M' + (x + size).toFixed(2) + ' ' + y.toFixed(2) + 'V' + (y + size).toFixed(2) + 'H' + x.toFixed(2) + 'Z' });
        var dot = el('circle', { 'class': 'c-dot', cx: (x + size / 2).toFixed(2), cy: (y + size / 2).toFixed(2), r: (size * 0.17).toFixed(2) });
        svg.appendChild(a); svg.appendChild(b); svg.appendChild(dot);
        S.cells.push({ a: a, b: b, dot: dot, r: r, c: c });
      }
    }
    S.rule = el('line', { 'class': 'c-rule', x1: 0, x2: 0, y1: -2, y2: (h + 2).toFixed(2) });
    svg.appendChild(S.rule);
    makeField();
    return true;
  }

  /* a smooth signal: a few soft bumps plus a little grain, scaled to 0..1 */
  function makeField() {
    var R = rng(S.seed), cols = S.cols, rows = S.rows, n = cols * rows, f = new Array(n), bumps = [], i, r, c;
    var nb = cols > 20 ? 3 : 2;
    for (i = 0; i < nb; i++) {
      bumps.push({ x: (0.1 + 0.8 * (i + 0.25 + 0.5 * R()) / nb) * (cols - 1), y: (0.18 + 0.64 * R()) * (rows - 1),
                   sx: (0.075 + 0.06 * R()) * cols, sy: (0.2 + 0.16 * R()) * rows, a: 0.75 + 0.25 * R() });
    }
    var lo = Infinity, hi = -Infinity;
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      var v = 0;
      for (i = 0; i < nb; i++) { var b = bumps[i], dx = (c - b.x) / b.sx, dy = (r - b.y) / b.sy; v += b.a * Math.exp(-0.5 * (dx * dx + dy * dy)); }
      v += 0.07 * R();
      f[r * cols + c] = v; if (v < lo) lo = v; if (v > hi) hi = v;
    }
    for (i = 0; i < n; i++) f[i] = (f[i] - lo) / (hi - lo || 1);
    S.field = f;
  }

  /* ---------- painting ---------- */
  function paint(cell, o) {
    var d = (reduce || !o.delay ? 0 : o.delay) + 's';
    cell.a.style.transitionDelay = d; cell.b.style.transitionDelay = d; cell.dot.style.transitionDelay = d;
    if (o.a) { cell.a.style.fill = o.a; cell.a.classList.remove('off'); } else { cell.a.style.fill = ''; cell.a.classList.add('off'); }
    if (o.b) { cell.b.style.fill = o.b; cell.b.classList.add('on'); } else { cell.b.classList.remove('on'); }
    cell.dot.classList.toggle('on', !!o.dot);
  }
  function showRule(col, on) {
    if (!S.rule) return;
    if (on) { var x = col * (S.size + S.gap) - S.gap / 2; S.rule.setAttribute('x1', x.toFixed(2)); S.rule.setAttribute('x2', x.toFixed(2)); }
    S.rule.classList.toggle('on', !!on);
  }
  function heat(delayFn) {
    S.cells.forEach(function (cell, i) { paint(cell, { a: viridis(S.field[i]), delay: delayFn ? delayFn(cell) : 0 }); });
  }
  function key(swatch, text) { return '<span class="key">' + swatch + text + '</span>'; }

  var scenes = {
    /* Limited compute: keep the top fifth, lowest scores go first */
    compute: function (animate) {
      var n = S.cells.length, keep = Math.round(n * 0.2), order = [], rank = new Array(n), i;
      for (i = 0; i < n; i++) order.push(i);
      order.sort(function (p, q) { return S.field[p] - S.field[q]; });
      order.forEach(function (ci, k) { rank[ci] = k; });
      function prune() {
        S.cells.forEach(function (cell, ci) {
          if (rank[ci] >= n - keep) paint(cell, { a: viridis(S.field[ci]) });
          else paint(cell, { a: null, delay: animate ? 0.1 + 1.5 * rank[ci] / (n - keep) : 0 });
        });
      }
      showRule(0, false);
      if (animate) { heat(function (cell) { return 0.25 * cell.c / S.cols; }); later(prune, 950); } else prune();
      legend.className = 'fig-legend';
      legend.innerHTML = key('<span class="ramp"></span>', 'score, low to high') + key('<span class="sw sw-off"></span>', 'dropped');
      readout.textContent = keep + ' of ' + n + ' cells kept';
    },

    /* Noisy labels: two annotators per cell; disagreement near the boundary, noise anywhere */
    labels: function (animate) {
      var R = rng(S.seed ^ 0x2F6E2B1), lo = viridis(0.27), hi = viridis(0.87), split = 0, noisy = 0;
      S.cells.forEach(function (cell, i) {
        var v = S.field[i], truth = v > 0.5;
        var la = v + (R() - 0.5) * 0.2 > 0.5, lb = v + (R() - 0.5) * 0.2 > 0.5, wrong = R() < 0.055;
        if (wrong) { la = !truth; lb = !truth; noisy++; } else if (la !== lb) split++;
        paint(cell, { a: la ? hi : lo, b: la !== lb ? (lb ? hi : lo) : null, dot: wrong, delay: animate ? 0.05 + 0.8 * cell.c / S.cols : 0 });
      });
      showRule(0, false);
      legend.className = 'fig-legend';
      legend.innerHTML = key('<span class="sw" style="background:' + lo + '"></span><span class="sw" style="background:' + hi + '"></span>', 'two labels') +
        key('<span class="sw sw-split" style="--a:' + hi + ';--b:' + lo + '"></span>', 'annotators disagree') +
        key('<span class="sw sw-dot" style="--a:' + hi + '"></span>', 'label noise');
      readout.textContent = split + ' cells split, ' + noisy + ' noisy';
    },

    /* Encrypted data: scrambled input on the left, a small readable result on the right */
    encrypted: function (animate) {
      var R = rng(S.seed ^ 0x51ED27), cols = S.cols, rows = S.rows, k = Math.max(4, Math.round(cols * 0.2)), cut = cols - k, r;
      var scores = [], top = 0;
      for (r = 0; r < rows; r++) { scores.push(0.12 + 0.6 * R()); }
      top = Math.floor(R() * rows); scores[top] = 1;
      function scramble(base, span) {
        S.cells.forEach(function (cell) {
          if (cell.c < cut) paint(cell, { a: viridis(R()), delay: animate ? base + span * cell.c / cols : 0 });
        });
      }
      function result(base) {
        S.cells.forEach(function (cell) {
          if (cell.c < cut) return;
          var len = Math.max(1, Math.round(scores[cell.r] * k)), on = cell.c - cut < len;
          paint(cell, { a: on ? (cell.r === top ? viridis(1) : viridis(0.6)) : null, delay: animate ? base + 0.4 * (cell.c - cut) / k : 0 });
        });
        showRule(cut, true);
      }
      showRule(0, false);
      if (animate) {
        scramble(0.05, 0.8);                               /* encrypt */
        later(function () { scramble(0, 0.5); }, 1250);      /* compute on the scrambled cells */
        later(function () { result(0); }, 1900);             /* only the result is opened */
        S.cells.forEach(function (cell) { if (cell.c >= cut) paint(cell, { a: viridis(R()), delay: 0.05 + 0.8 * cell.c / cols }); });
      } else { scramble(0, 0); result(0); }
      legend.className = 'fig-legend is-split';
      legend.style.setProperty('--split', (100 * cut / cols).toFixed(2) + '%');
      legend.innerHTML = '<span class="span-left">Encrypted: all the model sees</span><span class="span-right">Opened with the key</span>';
      readout.textContent = (cut * rows) + ' cells stay encrypted';
    }
  };

  function draw(animate) {
    clearTimers();
    if (!layout()) return;
    (scenes[S.mode] || scenes.compute)(!!animate && !reduce);
    modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-fig-mode') === S.mode ? 'true' : 'false'); });
    captions.forEach(function (p) { p.hidden = p.getAttribute('data-fig-cap') !== S.mode; });
  }

  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { S.mode = btn.getAttribute('data-fig-mode'); draw(true); });
  });
  if (redrawBtn) redrawBtn.addEventListener('click', function () { S.seed = (Math.random() * 1e9) | 0; makeField(); draw(true); });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var w = svg.getBoundingClientRect().width;
      if (w > 60 && Math.abs(w - S.w) > 2) draw(false);
    }, 160);
  });

  draw(true);
})();
