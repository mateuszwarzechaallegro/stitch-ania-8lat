# Przygoda Ani — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-page static HTML/CSS/JS birthday scavenger hunt game for Ania (8 years old), Stitch + Hello Kitty theme, hosted on GitHub Pages, mobile-first, zero external dependencies.

**Architecture:** Multiple independent HTML files sharing one `style.css`. No build tools, no npm, no frameworks. Each page is a self-contained step in the adventure. NFC tags link between pages.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JavaScript (DeviceMotion API, Canvas API, Pointer Events, Vibration API, localStorage)

---

## File Map

| File | Purpose |
|---|---|
| `style.css` | CSS variables, reset, typography, buttons, animations, confetti keyframes |
| `index.html` | Step 1 — Reactor energy bar (accelerometer) |
| `zodiak.html` | Step 2 — Canvas maze → ♉ reveal |
| `misja.html` | Step 3 — Countdown 5min + placeholder maps + code "3" input |
| `final.html` | Step 4 — Days of week drag&drop + Simon Says emotions |
| `print.html` | Printable paper instruction A4 for organiser |

---

## Task 1: style.css — Shared theme

**Files:**
- Create: `style.css`

- [ ] **Step 1.1: Write style.css**

```css
/* ===== RESET + BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:         #0d0d1a;
  --surface:    #1a1230;
  --surface2:   #231840;
  --border:     #3a2060;
  --purple:     #c45cd9;
  --pink:       #ff6ba8;
  --blue:       #2d7dd2;
  --teal:       #00b4d8;
  --text:       #f0eaff;
  --muted:      #a89cc8;
  --success:    #52b788;
  --warning:    #ffb347;
  --radius:     14px;
  --radius-sm:  8px;
}

html { font-size: 16px; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 40px;
  overflow-x: hidden;
}

/* ===== LAYOUT ===== */
.page {
  width: 100%;
  max-width: 430px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== HEADER ===== */
.page-header {
  width: 100%;
  max-width: 430px;
  padding: 20px 16px 16px;
  text-align: center;
  background: linear-gradient(180deg, var(--surface) 0%, transparent 100%);
}
.page-header .chars { font-size: 2.4rem; margin-bottom: 4px; }
.page-header h1 {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--blue), var(--purple), var(--pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.page-header .step-badge {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 12px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ===== STORY CARD ===== */
.story-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--purple);
  border-radius: var(--radius);
  padding: 16px;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text);
}
.story-card .from {
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

/* ===== BUTTONS ===== */
.btn {
  display: block;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  text-align: center;
  text-decoration: none;
}
.btn:active { transform: scale(0.97); }
.btn-primary {
  background: linear-gradient(135deg, var(--purple), var(--pink));
  color: #fff;
  box-shadow: 0 4px 20px rgba(196, 92, 217, 0.4);
}
.btn-primary:hover { box-shadow: 0 6px 28px rgba(196, 92, 217, 0.6); }
.btn-secondary {
  background: var(--surface2);
  color: var(--muted);
  border: 1px solid var(--border);
}
.btn-success {
  background: linear-gradient(135deg, #2d6a4f, var(--success));
  color: #fff;
  box-shadow: 0 4px 20px rgba(82, 183, 136, 0.4);
}
.btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

/* ===== SECTION CARD ===== */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.card h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--pink);
}
.card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--purple);
}
.card p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--muted);
}

/* ===== SUCCESS BOX ===== */
.success-box {
  background: rgba(82, 183, 136, 0.12);
  border: 2px solid var(--success);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
  display: none;
}
.success-box.visible { display: block; }
.success-box .big-symbol { font-size: 3rem; margin-bottom: 8px; }
.success-box p { font-size: 1rem; font-weight: 600; color: var(--success); }

/* ===== ERROR BOX ===== */
.error-msg {
  font-size: 0.85rem;
  color: var(--pink);
  text-align: center;
  min-height: 1.2em;
  padding: 4px 0;
}

/* ===== PLACEHOLDER MAP ===== */
.map-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: var(--surface2);
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
  gap: 8px;
}
.map-placeholder .map-icon { font-size: 2.4rem; }

/* ===== CONFETTI ===== */
.confetti-container {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
@keyframes confetti-fall {
  0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
.confetti-piece {
  position: absolute;
  top: -20px;
  width: 10px; height: 10px;
  border-radius: 2px;
  animation: confetti-fall linear forwards;
}

/* ===== GLOW PULSE ===== */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 10px var(--purple); }
  50%       { box-shadow: 0 0 30px var(--purple), 0 0 60px var(--pink); }
}
@keyframes pop-in {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1);   opacity: 1; }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-8px); }
  40%,80% { transform: translateX(8px); }
}
.shake { animation: shake 0.4s ease; }

/* ===== INPUT ===== */
.input-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}
.input-row input {
  flex: 1;
  padding: 14px 16px;
  background: var(--surface2);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}
.input-row input:focus { border-color: var(--purple); }
.input-row .btn { width: auto; padding: 14px 20px; font-size: 1rem; flex-shrink: 0; }
```

- [ ] **Step 1.2: Verify style.css loaded** — Open any HTML file in browser, confirm CSS custom properties apply (dark background visible).

---

## Task 2: index.html — Naładuj reaktor

**Files:**
- Modify: `index.html` (replace existing placeholder content entirely)

- [ ] **Step 2.1: Write index.html**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>Misja Ania — Start</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .reactor-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .reactor-icon {
      font-size: 5rem;
      transition: filter 0.5s;
      filter: grayscale(1) brightness(0.5);
    }
    .reactor-icon.charged { filter: none; animation: glow-pulse 1.5s infinite; }
    .bar-track {
      width: 100%;
      height: 32px;
      background: var(--surface2);
      border: 2px solid var(--border);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .bar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--blue), var(--teal), var(--purple));
      border-radius: 999px;
      transition: width 0.4s ease;
    }
    .bar-label {
      font-size: 0.85rem;
      color: var(--muted);
      text-align: center;
    }
    .steps-count {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--teal);
      text-align: center;
    }
    #btn-next { display: none; }
    #btn-fallback { display: none; margin-top: 8px; }
    #permission-hint {
      font-size: 0.8rem;
      color: var(--muted);
      text-align: center;
      display: none;
    }
  </style>
</head>
<body>
  <div class="page-header">
    <div class="chars">👾🎀</div>
    <h1>Misja: Naprawa Statku</h1>
    <span class="step-badge">Etap 1 z 4</span>
  </div>

  <div class="page">
    <div class="story-card">
      <div class="from">📡 Wiadomość od Hello Kitty</div>
      Stitch leciał na Twoje urodziny, ale jego statek kosmiczny rozbił się w ogrodzie!
      Reaktor jest <strong>ZUPEŁNIE PUSTY</strong>. Musisz naładować energię zanim uruchomisz systemy pokładowe.
      <br><br>
      <strong>🏃 BIEGNIJ, żeby naładować reaktor!</strong>
    </div>

    <div class="card">
      <h2>⚡ Poziom energii reaktora</h2>
      <div class="reactor-wrap">
        <div class="reactor-icon" id="reactor-icon">🔋</div>
        <div class="steps-count"><span id="steps-display">0</span> / 200 kroków</div>
        <div class="bar-track">
          <div class="bar-fill" id="bar-fill"></div>
        </div>
        <div class="bar-label" id="bar-label">Biegnij żeby naładować!</div>
      </div>
    </div>

    <p id="permission-hint">Naciśnij przycisk poniżej aby zezwolić na dostęp do czujnika ruchu.</p>
    <button class="btn btn-secondary" id="btn-permission" onclick="requestPermission()">
      🔓 Zezwól na dostęp do ruchu
    </button>

    <a href="zodiak.html" class="btn btn-primary" id="btn-next">
      ⚡ Reaktor naładowany! Odpal systemy →
    </a>
    <button class="btn btn-secondary" id="btn-fallback" onclick="document.getElementById('btn-next').style.display='block'; this.style.display='none';">
      ⏭️ Pomiń (awaria czujnika)
    </button>
  </div>

  <script>
    const TARGET = 200;
    let steps = 0;
    let lastMag = 0;
    let fallbackTimer;

    const stepsDisplay = document.getElementById('steps-display');
    const barFill      = document.getElementById('bar-fill');
    const barLabel     = document.getElementById('bar-label');
    const reactorIcon  = document.getElementById('reactor-icon');
    const btnNext      = document.getElementById('btn-next');
    const btnFallback  = document.getElementById('btn-fallback');
    const btnPerm      = document.getElementById('btn-permission');
    const permHint     = document.getElementById('permission-hint');

    function updateBar() {
      const pct = Math.min(steps / TARGET * 100, 100);
      barFill.style.width = pct + '%';
      stepsDisplay.textContent = Math.min(steps, TARGET);

      if (steps >= TARGET) {
        barLabel.textContent = '✅ Reaktor w pełni naładowany!';
        reactorIcon.classList.add('charged');
        reactorIcon.textContent = '⚡';
        btnNext.style.display = 'block';
        clearTimeout(fallbackTimer);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      } else {
        const pctInt = Math.round(pct);
        barLabel.textContent = pctInt + '% — jeszcze ' + (TARGET - steps) + ' kroków!';
      }
    }

    function handleMotion(e) {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
      // Step detected: magnitude crosses 14 threshold upward
      if (mag > 14 && lastMag <= 14 && steps < TARGET) {
        steps++;
        updateBar();
      }
      lastMag = mag;
    }

    function startListening() {
      window.addEventListener('devicemotion', handleMotion);
      btnPerm.style.display = 'none';
      permHint.style.display = 'none';
      // Show fallback after 30s if no steps recorded
      fallbackTimer = setTimeout(() => {
        if (steps < 5) btnFallback.style.display = 'block';
      }, 30000);
    }

    function requestPermission() {
      if (typeof DeviceMotionEvent !== 'undefined' &&
          typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(state => { if (state === 'granted') startListening(); })
          .catch(() => { btnFallback.style.display = 'block'; });
      } else {
        startListening();
      }
    }

    // Auto-start on Android (no permission needed)
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission !== 'function') {
      startListening();
      btnPerm.style.display = 'none';
    } else {
      // iOS: show permission button
      permHint.style.display = 'block';
    }
  </script>
</body>
</html>
```

- [ ] **Step 2.2: Verify in browser**
  - Open `index.html` on desktop: confirm dark theme, story card, reactor bar visible
  - Open on Android phone: shake phone, confirm step counter increments and bar fills
  - At 200 steps: confirm "Reaktor naładowany!" button appears
  - Click button: confirm navigates to `zodiak.html` (404 is fine at this stage)

- [ ] **Step 2.3: Commit**
```bash
git add index.html style.css
git commit -m "feat: add shared styles and energy bar step 1"
```

---

## Task 3: zodiak.html — Labirynt kosmiczny

**Files:**
- Create: `zodiak.html`

- [ ] **Step 3.1: Write zodiak.html**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>Misja Ania — Labirynt</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .maze-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    #maze-canvas {
      border: 3px solid var(--border);
      border-radius: var(--radius-sm);
      background: #060612;
      touch-action: none;
      cursor: crosshair;
      max-width: 100%;
    }
    .maze-hint {
      font-size: 0.82rem;
      color: var(--muted);
      text-align: center;
    }
    #zodiac-reveal {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      animation: pop-in 0.5s ease both;
    }
    #zodiac-reveal .big-sign {
      font-size: 5rem;
      filter: drop-shadow(0 0 20px var(--purple));
      animation: glow-pulse 2s infinite;
    }
    #zodiac-reveal p {
      font-size: 1rem;
      font-weight: 600;
      color: var(--success);
      text-align: center;
      line-height: 1.5;
    }
    #btn-next-zodiak { display: none; }
  </style>
</head>
<body>
  <div class="page-header">
    <div class="chars">🔭✨</div>
    <h1>Labirynt Kosmiczny</h1>
    <span class="step-badge">Etap 2 z 4</span>
  </div>

  <div class="page">
    <div class="story-card">
      <div class="from">🖥️ Komputer pokładowy</div>
      System nawigacyjny wymaga kodu dostępu. Hasło to <strong>Twój kosmiczny znak</strong>.
      Komputer zaszyfrował go w labiryncie.
      <br><br>
      <strong>✏️ Przeprowadź rysik przez labirynt — ścieżka ujawni odpowiedź!</strong>
    </div>

    <div class="card">
      <div class="maze-wrap">
        <div class="maze-hint">Wejście: góra-lewo → Wyjście: dół-prawo</div>
        <canvas id="maze-canvas"></canvas>
        <div class="maze-hint" id="maze-status">Dotknij wejścia i prowadź rysik do wyjścia</div>
      </div>

      <div id="zodiac-reveal">
        <div class="big-sign">♉</div>
        <p>Komputer przeliczył Twoją trasę...<br>
        Odkryłaś swój kosmiczny znak — <strong>BYK ♉</strong>!<br>
        Ustaw ten symbol na pudełku!</p>
      </div>
    </div>

    <a href="misja.html" class="btn btn-secondary" id="btn-always">
      ➡️ Idź dalej (znasz już znak)
    </a>
    <a href="misja.html" class="btn btn-primary" id="btn-next-zodiak">
      🚀 System odblokowany! Następna misja →
    </a>
  </div>

  <script>
    // ─── CONFIG ───────────────────────────────────────────────
    const COLS = 9, ROWS = 11;
    const CELL = 30;
    const W = COLS * CELL, H = ROWS * CELL;
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width  = W;
    canvas.height = H;

    // ─── MAZE GENERATION (recursive backtracker) ──────────────
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // walls[row][col] = { top, right, bottom, left }  true = wall present
    function buildMaze() {
      const walls = Array.from({length: ROWS}, () =>
        Array.from({length: COLS}, () =>
          ({top: true, right: true, bottom: true, left: true})
        )
      );
      const visited = Array.from({length: ROWS}, () => new Array(COLS).fill(false));
      const DIRS = [
        {dc:  0, dr: -1, w: 'top',    ow: 'bottom'},
        {dc:  1, dr:  0, w: 'right',  ow: 'left'},
        {dc:  0, dr:  1, w: 'bottom', ow: 'top'},
        {dc: -1, dr:  0, w: 'left',   ow: 'right'},
      ];
      function carve(c, r) {
        visited[r][c] = true;
        shuffle([...DIRS]).forEach(({dc, dr, w, ow}) => {
          const nc = c + dc, nr = r + dr;
          if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && !visited[nr][nc]) {
            walls[r][c][w]   = false;
            walls[nr][nc][ow] = false;
            carve(nc, nr);
          }
        });
      }
      carve(0, 0);
      // Open entrance (top of 0,0) and exit (bottom of COLS-1, ROWS-1)
      walls[0][0].top           = false;
      walls[ROWS-1][COLS-1].bottom = false;
      return walls;
    }

    const mazeWalls = buildMaze();

    // ─── DRAW ─────────────────────────────────────────────────
    function drawMaze(tracePath) {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#060612';
      ctx.fillRect(0, 0, W, H);

      // Draw trace path
      if (tracePath && tracePath.length > 1) {
        ctx.strokeStyle = 'rgba(196, 92, 217, 0.6)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(tracePath[0].x, tracePath[0].y);
        tracePath.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }

      // Draw walls
      ctx.strokeStyle = '#4a3080';
      ctx.lineWidth = 2;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = c * CELL, y = r * CELL;
          const w = mazeWalls[r][c];
          ctx.beginPath();
          if (w.top)    { ctx.moveTo(x, y);          ctx.lineTo(x + CELL, y); }
          if (w.right)  { ctx.moveTo(x + CELL, y);   ctx.lineTo(x + CELL, y + CELL); }
          if (w.bottom) { ctx.moveTo(x, y + CELL);   ctx.lineTo(x + CELL, y + CELL); }
          if (w.left)   { ctx.moveTo(x, y);           ctx.lineTo(x, y + CELL); }
          ctx.stroke();
        }
      }

      // Entrance marker
      ctx.fillStyle = var_color('--teal');
      ctx.font = '18px system-ui';
      ctx.fillText('▶', 2, CELL - 4);

      // Exit marker
      ctx.fillStyle = var_color('--pink');
      ctx.fillText('★', W - CELL + 4, H - 4);
    }

    function var_color(v) {
      return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    }

    // ─── POINTER TRACKING ─────────────────────────────────────
    const tracePath = [];
    let tracking = false;
    let solved = false;

    function ptInCanvas(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const src = e.touches ? e.touches[0] : e;
      return {
        x: (src.clientX - rect.left) * scaleX,
        y: (src.clientY - rect.top)  * scaleY
      };
    }

    function cellAt(px, py) {
      return { c: Math.floor(px / CELL), r: Math.floor(py / CELL) };
    }

    function hitsWall(x, y, dx, dy) {
      const c = Math.floor(x / CELL), r = Math.floor(y / CELL);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return true;
      const w = mazeWalls[r][c];
      const MARGIN = 4; // pixels from wall before collision
      const lx = x - c * CELL, ly = y - r * CELL; // local pos in cell
      if (w.top    && ly < MARGIN)          return true;
      if (w.bottom && ly > CELL - MARGIN)   return true;
      if (w.left   && lx < MARGIN)          return true;
      if (w.right  && lx > CELL - MARGIN)   return true;
      return false;
    }

    function checkExit(x, y) {
      // Exit zone: bottom-right cell, bottom portion
      return x > (COLS - 1) * CELL && y > (ROWS - 1) * CELL + CELL * 0.4;
    }

    function onStart(e) {
      e.preventDefault();
      if (solved) return;
      const {x, y} = ptInCanvas(e);
      // Must start near entrance (top-left cell)
      if (x < CELL * 2 && y < CELL * 2) {
        tracking = true;
        tracePath.length = 0;
        tracePath.push({x, y});
        drawMaze(tracePath);
        document.getElementById('maze-status').textContent = 'Prowadź rysik przez labirynt...';
      }
    }

    function onMove(e) {
      e.preventDefault();
      if (!tracking || solved) return;
      const {x, y} = ptInCanvas(e);
      const last = tracePath[tracePath.length - 1];
      if (!last) return;

      if (hitsWall(x, y, x - last.x, y - last.y)) {
        // Hit wall — reset
        tracking = false;
        tracePath.length = 0;
        drawMaze([]);
        document.getElementById('maze-status').textContent = '💥 Ups! Wróć na start i spróbuj ponownie';
        if (navigator.vibrate) navigator.vibrate(100);
        return;
      }

      tracePath.push({x, y});
      drawMaze(tracePath);

      if (checkExit(x, y)) {
        onSolved();
      }
    }

    function onEnd(e) {
      e.preventDefault();
      tracking = false;
    }

    function onSolved() {
      solved = true;
      tracking = false;
      // Draw final bright path
      ctx.strokeStyle = 'rgba(255, 107, 168, 0.9)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (tracePath.length > 0) {
        ctx.moveTo(tracePath[0].x, tracePath[0].y);
        tracePath.forEach(p => ctx.lineTo(p.x, p.y));
      }
      ctx.stroke();

      // Show zodiac reveal
      setTimeout(() => {
        document.getElementById('zodiac-reveal').style.display = 'flex';
        document.getElementById('btn-next-zodiak').style.display = 'block';
        document.getElementById('maze-status').textContent = '🎉 Dotarłaś do wyjścia!';
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
        launchConfetti();
      }, 400);
    }

    canvas.addEventListener('pointerdown',  onStart, {passive: false});
    canvas.addEventListener('pointermove',  onMove,  {passive: false});
    canvas.addEventListener('pointerup',    onEnd,   {passive: false});
    canvas.addEventListener('pointercancel',onEnd,   {passive: false});

    // ─── CONFETTI ─────────────────────────────────────────────
    function launchConfetti() {
      const container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);
      const colors = ['#c45cd9','#ff6ba8','#2d7dd2','#00b4d8','#ffb347','#52b788'];
      for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width  = (8 + Math.random() * 8) + 'px';
        p.style.height = (8 + Math.random() * 8) + 'px';
        p.style.animationDuration = (2 + Math.random() * 2) + 's';
        p.style.animationDelay    = (Math.random() * 1) + 's';
        container.appendChild(p);
      }
      setTimeout(() => container.remove(), 5000);
    }

    // Initial draw
    drawMaze([]);
  </script>
</body>
</html>
```

- [ ] **Step 3.2: Verify in browser (desktop Chrome)**
  - Open `zodiak.html`: dark maze visible, entrance marker top-left, exit marker bottom-right
  - Click near entrance → drag mouse to exit: trace path appears
  - Drag into a wall: path resets and status shows error message
  - Reach exit: ♉ symbol appears with glow, "btn-next-zodiak" becomes visible
  - Click "Następna misja": navigates to `misja.html` (404 ok for now)

- [ ] **Step 3.3: Commit**
```bash
git add zodiak.html
git commit -m "feat: add canvas maze with taurus reveal (step 2)"
```

---

## Task 4: misja.html — Sygnał awaryjny

**Files:**
- Create: `misja.html`

- [ ] **Step 4.1: Write misja.html**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>Misja Ania — Sygnał</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .timer-display {
      text-align: center;
      font-size: 4rem;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.05em;
      color: var(--teal);
      text-shadow: 0 0 20px var(--teal);
      transition: color 0.5s;
    }
    .timer-display.urgent { color: var(--pink); text-shadow: 0 0 20px var(--pink); }
    .timer-display.expired { color: var(--muted); text-shadow: none; }
    .timer-label {
      text-align: center;
      font-size: 0.82rem;
      color: var(--muted);
      margin-top: 4px;
    }
    #map2-section { display: none; }
    #code-section { margin-top: 8px; }
  </style>
</head>
<body>
  <div class="page-header">
    <div class="chars">📡⚠️</div>
    <h1>Sygnał Awaryjny</h1>
    <span class="step-badge">Etap 3 z 4</span>
  </div>

  <div class="page">
    <div class="story-card">
      <div class="from">🛸 Systemy pokładowe</div>
      Skanery pokładowe wykryły sygnał zagubionej <strong>części reaktora</strong>!
      Sygnał jest słaby i zaniknie za <strong>5 minut</strong>.
      Idźcie w zaznaczone miejsce.
      <br><br>
      🔊 <strong>Gdy usłyszycie pikanie — jesteście blisko!</strong>
    </div>

    <!-- Timer -->
    <div class="card">
      <h2>⏱️ Odliczanie</h2>
      <div class="timer-display" id="timer">5:00</div>
      <div class="timer-label" id="timer-label">Do zaniku sygnału</div>
    </div>

    <!-- Map 1 — placeholder -->
    <div class="card">
      <h2>🗺️ Mapa sygnału</h2>
      <div class="map-placeholder" id="map1">
        <div class="map-icon">🗺️</div>
        <div><strong>PLACEHOLDER MAPY #1</strong></div>
        <div style="font-size:0.75rem">Podmień ten obrazek na zrzut<br>z prawdziwą lokalizacją przed imprezą</div>
      </div>
      <p style="margin-top:10px; font-size:0.82rem; color:var(--muted)">
        📍 Idźcie w zaznaczone miejsce. Gdy pikanie się nasili — szukajcie zakopanych bryloka NFC.
      </p>
    </div>

    <!-- Code section — always visible -->
    <div class="card" id="code-section">
      <h2>🔢 Numer seryjny części</h2>
      <p style="margin-bottom:12px">
        Znalazłyście brelok i dotarłyście do miejsca mechanika?
        Wpisz <strong>numer seryjny</strong> który widzisz na znaku:
      </p>
      <div class="input-row">
        <input type="number" id="code-input" placeholder="?" inputmode="numeric" max="9" min="0" />
        <button class="btn btn-primary" onclick="checkCode()">Sprawdź</button>
      </div>
      <div class="error-msg" id="code-error"></div>
    </div>

    <!-- Success: code correct -->
    <div class="success-box" id="code-success">
      <div class="big-symbol">🎉</div>
      <p>Cyfra <strong>3</strong> — zapamiętaj ją!<br>
        To numer do ustawienia na pudełku.<br><br>
        Teraz lecicie do <strong>BAZY</strong>! 🚀</p>
    </div>

    <!-- Map 2 — shown after correct code -->
    <div id="map2-section">
      <div class="card">
        <h2>🗺️ Mapa bazy</h2>
        <div class="map-placeholder" id="map2">
          <div class="map-icon">🏠</div>
          <div><strong>PLACEHOLDER MAPY #2</strong></div>
          <div style="font-size:0.75rem">Podmień na mapę z lokalizacją bazy<br>przed imprezą</div>
        </div>
        <p style="margin-top:10px; font-size:0.82rem; color:var(--muted)">
          🔍 W bazie szukajcie kolejnego breloka NFC — zeskanujcie go aby dostać ostatnie zadanie!
        </p>
      </div>
    </div>
  </div>

  <script>
    // ─── TIMER ────────────────────────────────────────────────
    const DURATION  = 5 * 60 * 1000;
    const START_KEY = 'misja_timer_start';
    const timerEl   = document.getElementById('timer');
    const labelEl   = document.getElementById('timer-label');

    function formatTime(ms) {
      const total = Math.max(0, Math.ceil(ms / 1000));
      const m = Math.floor(total / 60);
      const s = total % 60;
      return m + ':' + String(s).padStart(2, '0');
    }

    function tick() {
      const start   = parseInt(localStorage.getItem(START_KEY) || Date.now());
      const elapsed = Date.now() - start;
      const remaining = DURATION - elapsed;

      timerEl.textContent = formatTime(remaining);

      if (remaining <= 0) {
        timerEl.classList.add('expired');
        labelEl.textContent = 'Sygnał zanikł — ale część gdzieś jest! Szukajcie!';
        return;
      }

      timerEl.classList.remove('urgent', 'expired');
      if (remaining < 60000) timerEl.classList.add('urgent');

      requestAnimationFrame(tick);
    }

    // Start timer on first visit
    if (!localStorage.getItem(START_KEY)) {
      localStorage.setItem(START_KEY, Date.now());
    }
    tick();

    // ─── CODE CHECK ───────────────────────────────────────────
    const CORRECT = '3';
    let solved = false;

    function checkCode() {
      if (solved) return;
      const val = document.getElementById('code-input').value.trim();
      const err = document.getElementById('code-error');

      if (val === CORRECT) {
        solved = true;
        document.getElementById('code-section').style.display = 'none';
        document.getElementById('code-success').classList.add('visible');
        document.getElementById('map2-section').style.display = 'block';
        document.getElementById('map2-section').scrollIntoView({behavior:'smooth'});
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
        launchConfetti();
      } else {
        err.textContent = '❌ Nie to… Sprawdź jeszcze raz znak na drzewie.';
        const inp = document.getElementById('code-input');
        inp.classList.add('shake');
        inp.addEventListener('animationend', () => inp.classList.remove('shake'), {once: true});
      }
    }

    document.getElementById('code-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') checkCode();
    });

    // ─── CONFETTI ─────────────────────────────────────────────
    function launchConfetti() {
      const container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);
      const colors = ['#c45cd9','#ff6ba8','#2d7dd2','#00b4d8','#ffb347','#52b788'];
      for (let i = 0; i < 80; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width  = (8 + Math.random() * 8) + 'px';
        p.style.height = (8 + Math.random() * 8) + 'px';
        p.style.animationDuration = (2 + Math.random() * 2) + 's';
        p.style.animationDelay    = (Math.random() * 1.5) + 's';
        container.appendChild(p);
      }
      setTimeout(() => container.remove(), 6000);
    }
  </script>
</body>
</html>
```

- [ ] **Step 4.2: Verify in browser**
  - Open `misja.html`: timer counts down from 5:00
  - Refresh page: timer continues from where it was (localStorage)
  - Open DevTools → Application → localStorage → delete `misja_timer_start` → refresh: timer restarts
  - Type `3` in input, click Sprawdź: success box appears, map 2 section slides into view, confetti fires
  - Type any other digit: error message and shake animation
  - When timer < 1 min: color turns pink/urgent

- [ ] **Step 4.3: Commit**
```bash
git add misja.html
git commit -m "feat: add countdown timer, code validation and placeholder maps (step 3)"
```

---

## Task 5: final.html — Centrum dowodzenia

**Files:**
- Create: `final.html`

- [ ] **Step 5.1: Write final.html**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>Misja Ania — Finał</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    /* ── Days drag & drop ── */
    #days-game { user-select: none; -webkit-user-select: none; }
    .days-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 52px;
      padding: 8px;
      background: var(--surface2);
      border: 2px dashed var(--border);
      border-radius: var(--radius-sm);
    }
    .day-tile {
      padding: 10px 14px;
      background: linear-gradient(135deg, var(--blue), var(--purple));
      color: #fff;
      font-weight: 700;
      font-size: 0.9rem;
      border-radius: var(--radius-sm);
      cursor: grab;
      touch-action: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: transform 0.1s;
    }
    .day-tile:active { cursor: grabbing; }
    .day-tile.dragging { opacity: 0.35; }
    .day-tile.correct { background: linear-gradient(135deg, #2d6a4f, var(--success)); cursor: default; }
    .day-tile.highlight {
      background: linear-gradient(135deg, var(--pink), #ffb347);
      animation: glow-pulse 1s infinite;
      transform: scale(1.08);
    }
    .slots-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .day-slot {
      width: 40px;
      height: 40px;
      border: 2px dashed var(--border);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: var(--muted);
      background: var(--surface2);
      flex-direction: column;
    }
    .day-slot.occupied { border-color: transparent; }
    .day-slot span { font-size: 0.55rem; color: var(--muted); }

    /* ── Simon Says ── */
    #simon-game { display: none; }
    .emotion-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .emotion-btn {
      aspect-ratio: 1;
      background: var(--surface2);
      border: 3px solid var(--border);
      border-radius: var(--radius);
      font-size: 3.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s, border-color 0.2s;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
    }
    .emotion-btn:active { transform: scale(0.93); }
    .emotion-btn.lit {
      border-color: var(--pink);
      background: rgba(255,107,168,0.2);
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(255,107,168,0.5);
    }
    .emotion-btn.correct-flash {
      border-color: var(--success);
      background: rgba(82,183,136,0.2);
    }
    .simon-status {
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--muted);
      min-height: 1.4em;
    }
    #simon-result { display: none; }

    /* ── Victory ── */
    #victory { display: none; }
    .codes-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 12px;
    }
    .code-item {
      background: var(--surface2);
      border: 2px solid var(--success);
      border-radius: var(--radius-sm);
      padding: 12px;
      text-align: center;
    }
    .code-item .code-symbol { font-size: 2rem; }
    .code-item .code-label { font-size: 0.7rem; color: var(--muted); margin-top: 4px; }
    .code-item .code-val { font-size: 0.95rem; font-weight: 800; color: var(--success); }
  </style>
</head>
<body>
  <div class="page-header">
    <div class="chars">🎀👾</div>
    <h1>Centrum Dowodzenia</h1>
    <span class="step-badge">Etap 4 z 4</span>
  </div>

  <div class="page">
    <div class="story-card">
      <div class="from">🏠 Centrum dowodzenia Stitcha</div>
      Dotarłyście do centrum dowodzenia! Zostały <strong>ostatnie dwa kody</strong> do aktywacji reaktora.
      Hello Kitty ma dla Was ostatnie zadania — dajcie radę! 💪
    </div>

    <!-- ═══ PART 1: Days of Week ═══ -->
    <div class="card" id="days-game">
      <h2>📅 Kod czasowy</h2>
      <p style="margin-bottom:12px">
        Komputer potrzebuje kodu czasowego. <strong>Ułóżcie dni tygodnia w kolejności</strong> od poniedziałku do niedzieli!
      </p>
      <div class="slots-row" id="slots-row">
        <!-- 7 slots generated by JS -->
      </div>
      <div style="margin:12px 0; font-size:0.8rem; color:var(--muted)">Dostępne kafelki:</div>
      <div class="days-pool" id="days-pool">
        <!-- shuffled tiles generated by JS -->
      </div>
      <div class="error-msg" id="days-error"></div>
      <div class="success-box" id="days-success" style="margin-top:12px">
        <div class="big-symbol">📅</div>
        <p>Wtorek — to dzień urodzin Ani!<br>Ustaw <strong>TU</strong> na pudełku!</p>
      </div>
      <button class="btn btn-primary" id="btn-days-check" style="margin-top:12px" onclick="checkDays()">
        ✅ Sprawdź kolejność
      </button>
    </div>

    <!-- ═══ PART 2: Simon Says ═══ -->
    <div class="card" id="simon-game">
      <h2>😊 Wiadomość Hello Kitty</h2>
      <p style="margin-bottom:12px">
        Hello Kitty wysyła ostatnią wiadomość zakodowaną w emocjach.
        <strong>Zapamiętaj sekwencję i powtórz ją!</strong> Ostatnia emocja to Wasz ostatni kod!
      </p>
      <div class="simon-status" id="simon-status">Naciśnij START aby zobaczyć sekwencję</div>
      <div class="emotion-grid" id="emotion-grid">
        <button class="emotion-btn" id="e0" onclick="playerTap(0)">😢</button>
        <button class="emotion-btn" id="e1" onclick="playerTap(1)">😠</button>
        <button class="emotion-btn" id="e2" onclick="playerTap(2)">😲</button>
        <button class="emotion-btn" id="e3" onclick="playerTap(3)">😊</button>
      </div>
      <button class="btn btn-secondary" id="btn-simon-start" style="margin-top:12px" onclick="startSimon()">
        ▶️ START — pokaż sekwencję
      </button>

      <div class="success-box" id="simon-result" style="margin-top:12px">
        <div class="big-symbol">😊</div>
        <p>Ostatnia emocja to<br><strong>UŚMIECHNIĘTA BUZIA 😊</strong><br>Ostatni kod aktywowany!</p>
      </div>
    </div>

    <!-- ═══ VICTORY ═══ -->
    <div class="card" id="victory">
      <h2 style="color:var(--warning); text-align:center; font-size:1.4rem">🎉 BRAWO ANIA! 🎉</h2>
      <p style="text-align:center; margin-bottom:4px">
        Zebrałaś wszystkie 4 kody!<br>
        Ustaw je na pudełku i otwórz niespodziankę!
      </p>
      <div class="codes-list">
        <div class="code-item">
          <div class="code-symbol">🔢</div>
          <div class="code-label">Strona 1 (cyfry)</div>
          <div class="code-val">3</div>
        </div>
        <div class="code-item">
          <div class="code-symbol">♉</div>
          <div class="code-label">Strona 2 (zodiak)</div>
          <div class="code-val">BYK ♉</div>
        </div>
        <div class="code-item">
          <div class="code-symbol">📅</div>
          <div class="code-label">Strona 3 (dni)</div>
          <div class="code-val">TU (wtorek)</div>
        </div>
        <div class="code-item">
          <div class="code-symbol">😊</div>
          <div class="code-label">Strona 4 (emotki)</div>
          <div class="code-val">Uśmiechnięta buzia</div>
        </div>
      </div>
      <p style="text-align:center; margin-top:16px; font-size:1.3rem">
        👾🎀 Stitch i Hello Kitty dziękują Ci za uratowanie statku! 🎀👾
      </p>
    </div>
  </div>

  <script>
    // ═══════════════════════════════════════════════
    // PART 1 — DAYS OF WEEK DRAG & DROP
    // ═══════════════════════════════════════════════
    const DAYS    = ['PON','WT','ŚR','CZW','PT','SOB','NIE'];
    const CORRECT = [...DAYS];
    const slotContents = new Array(7).fill(null); // slot index → day string

    // Build slots
    const slotsRow = document.getElementById('slots-row');
    DAYS.forEach((_, i) => {
      const slot = document.createElement('div');
      slot.className = 'day-slot';
      slot.dataset.idx = i;
      slot.innerHTML = `<span>${i + 1}</span>`;
      slot.id = 'slot-' + i;
      slotsRow.appendChild(slot);
    });

    // Build shuffled tiles in pool
    const pool = document.getElementById('days-pool');
    const shuffled = [...DAYS].sort(() => Math.random() - 0.5);
    shuffled.forEach(day => {
      const tile = createTile(day);
      pool.appendChild(tile);
    });

    function createTile(day) {
      const tile = document.createElement('div');
      tile.className = 'day-tile';
      tile.textContent = day;
      tile.dataset.day = day;
      initDragTile(tile);
      return tile;
    }

    // ── Pointer-based drag ──
    let dragData = null;

    function initDragTile(tile) {
      tile.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (tile.classList.contains('correct')) return;
        tile.setPointerCapture(e.pointerId);
        tile.classList.add('dragging');

        // Create floating ghost
        const ghost = tile.cloneNode(true);
        ghost.id = 'drag-ghost';
        ghost.style.cssText = `
          position: fixed; z-index: 1000; pointer-events: none;
          opacity: 0.9; transform: scale(1.1);
          transition: none;
        `;
        const rect = tile.getBoundingClientRect();
        ghost.style.left = rect.left + 'px';
        ghost.style.top  = rect.top  + 'px';
        ghost.style.width = rect.width + 'px';
        document.body.appendChild(ghost);

        dragData = { tile, ghost, day: tile.dataset.day };
      });

      tile.addEventListener('pointermove', e => {
        if (!dragData || dragData.tile !== tile) return;
        e.preventDefault();
        dragData.ghost.style.left = (e.clientX - 20) + 'px';
        dragData.ghost.style.top  = (e.clientY - 20) + 'px';
      });

      tile.addEventListener('pointerup', e => {
        if (!dragData || dragData.tile !== tile) return;
        e.preventDefault();
        tile.classList.remove('dragging');
        dragData.ghost.remove();

        // Find which slot we're over
        const cx = e.clientX, cy = e.clientY;
        let targetSlot = null;
        document.querySelectorAll('.day-slot:not(.occupied)').forEach(slot => {
          const r = slot.getBoundingClientRect();
          if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
            targetSlot = slot;
          }
        });

        if (targetSlot) {
          const idx = parseInt(targetSlot.dataset.idx);
          // Remove from old slot if it was there
          const prevSlotIdx = tile.dataset.slotIdx;
          if (prevSlotIdx !== undefined) {
            slotContents[parseInt(prevSlotIdx)] = null;
            const prevSlot = document.getElementById('slot-' + prevSlotIdx);
            prevSlot.innerHTML = `<span>${parseInt(prevSlotIdx) + 1}</span>`;
            prevSlot.classList.remove('occupied');
            delete tile.dataset.slotIdx;
          }
          // Place into new slot
          slotContents[idx] = tile.dataset.day;
          tile.dataset.slotIdx = idx;
          targetSlot.innerHTML = '';
          targetSlot.appendChild(tile);
          targetSlot.classList.add('occupied');
        } else {
          // Return to pool if dropped outside
          if (tile.dataset.slotIdx !== undefined) {
            const prevSlotIdx = parseInt(tile.dataset.slotIdx);
            slotContents[prevSlotIdx] = null;
            const prevSlot = document.getElementById('slot-' + prevSlotIdx);
            prevSlot.innerHTML = `<span>${prevSlotIdx + 1}</span>`;
            prevSlot.classList.remove('occupied');
            delete tile.dataset.slotIdx;
          }
          pool.appendChild(tile);
        }
        dragData = null;
      });

      tile.addEventListener('pointercancel', () => {
        if (dragData && dragData.tile === tile) {
          tile.classList.remove('dragging');
          dragData.ghost.remove();
          dragData = null;
        }
      });
    }

    function checkDays() {
      const err = document.getElementById('days-error');
      if (slotContents.some(v => v === null)) {
        err.textContent = '⚠️ Umieść wszystkie dni w slotach!';
        return;
      }
      const ok = slotContents.every((v, i) => v === CORRECT[i]);
      if (ok) {
        // Highlight WT (index 1)
        document.querySelectorAll('.day-tile').forEach((t, i) => {
          t.classList.add('correct');
          if (t.dataset.day === 'WT') t.classList.add('highlight');
        });
        document.getElementById('days-success').classList.add('visible');
        document.getElementById('btn-days-check').style.display = 'none';
        err.textContent = '';
        if (navigator.vibrate) navigator.vibrate([100,50,100,50,300]);
        // Show Simon Says after delay
        setTimeout(() => {
          document.getElementById('simon-game').style.display = 'block';
          document.getElementById('simon-game').scrollIntoView({behavior:'smooth'});
        }, 2500);
      } else {
        err.textContent = '❌ Nie do końca… Sprawdź kolejność dni!';
        document.querySelector('.days-pool, .slots-row') &&
          document.getElementById('days-game').classList.add('shake');
        setTimeout(() => document.getElementById('days-game').classList.remove('shake'), 500);
      }
    }

    // ═══════════════════════════════════════════════
    // PART 2 — SIMON SAYS
    // ═══════════════════════════════════════════════
    const EMOJIS     = ['😢','😠','😲','😊'];
    const HAPPY_IDX  = 3;
    let sequence     = [];
    let playerTurns  = [];
    let showing      = false;
    let accepting    = false;

    function makeSequence() {
      const seq = [];
      for (let i = 0; i < 3; i++) {
        seq.push(Math.floor(Math.random() * 3)); // 0,1,2 only
      }
      seq.push(HAPPY_IDX); // always ends with 😊
      return seq;
    }

    function flashButton(idx, duration = 600) {
      return new Promise(resolve => {
        const btn = document.getElementById('e' + idx);
        btn.classList.add('lit');
        setTimeout(() => { btn.classList.remove('lit'); resolve(); }, duration);
      });
    }

    async function showSequence(seq) {
      showing = true;
      accepting = false;
      document.getElementById('simon-status').textContent = '👀 Zapamiętaj sekwencję…';
      document.getElementById('btn-simon-start').style.display = 'none';
      await new Promise(r => setTimeout(r, 800));
      for (const idx of seq) {
        await flashButton(idx, 600);
        await new Promise(r => setTimeout(r, 300));
      }
      showing = false;
      accepting = true;
      playerTurns = [];
      document.getElementById('simon-status').textContent = '🎯 Teraz Twoja kolej! Tapnij w tej samej kolejności';
    }

    function startSimon() {
      sequence = makeSequence();
      showSequence(sequence);
    }

    function playerTap(idx) {
      if (!accepting) return;
      const btn = document.getElementById('e' + idx);
      // Visual feedback
      btn.classList.add('correct-flash');
      setTimeout(() => btn.classList.remove('correct-flash'), 300);
      if (navigator.vibrate) navigator.vibrate(40);

      playerTurns.push(idx);
      const pos = playerTurns.length - 1;

      if (playerTurns[pos] !== sequence[pos]) {
        // Wrong!
        accepting = false;
        document.getElementById('simon-status').textContent = '❌ Ups! Powtórzmy sekwencję…';
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        document.getElementById('emotion-grid').classList.add('shake');
        setTimeout(() => {
          document.getElementById('emotion-grid').classList.remove('shake');
          showSequence(sequence);
        }, 1500);
        return;
      }

      if (playerTurns.length === sequence.length) {
        // All correct!
        accepting = false;
        onSimonSolved();
      }
    }

    function onSimonSolved() {
      document.getElementById('simon-status').textContent = '🎉 Brawo! Sekwencja poprawna!';
      document.getElementById('simon-result').style.display = 'block';
      document.getElementById('btn-simon-start').style.display = 'none';
      if (navigator.vibrate) navigator.vibrate([200,100,200,100,400]);
      launchConfetti();
      setTimeout(() => {
        document.getElementById('victory').style.display = 'block';
        document.getElementById('victory').scrollIntoView({behavior:'smooth'});
        launchConfetti();
      }, 2500);
    }

    // ─── CONFETTI ─────────────────────────────────────────────
    function launchConfetti() {
      const container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);
      const colors = ['#c45cd9','#ff6ba8','#2d7dd2','#00b4d8','#ffb347','#52b788'];
      for (let i = 0; i < 80; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width  = (6 + Math.random() * 10) + 'px';
        p.style.height = (6 + Math.random() * 10) + 'px';
        p.style.animationDuration = (2 + Math.random() * 2) + 's';
        p.style.animationDelay    = (Math.random() * 1.5) + 's';
        container.appendChild(p);
      }
      setTimeout(() => container.remove(), 6000);
    }
  </script>
</body>
</html>
```

- [ ] **Step 5.2: Verify in browser**
  - Open `final.html`: story card and Days game visible
  - Drag day tiles into slots in correct order (PON,WT,ŚR,CZW,PT,SOB,NIE), click Sprawdź: WT tile glows pink, success box appears
  - Simon Says section slides in: click START, sequence of 4 emojis flashes
  - Tap in correct order: progress advances; wrong tap → shake and repeat
  - Correct full sequence: success box, victory screen with all 4 codes visible, confetti
  - Try on mobile (pointer events should work with touch)

- [ ] **Step 5.3: Commit**
```bash
git add final.html
git commit -m "feat: add days drag-drop and simon says (step 4 final)"
```

---

## Task 6: print.html — Instrukcja papierowa

**Files:**
- Create: `print.html`

- [ ] **Step 6.1: Write print.html**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Instrukcja dla Ani — Do druku</title>
  <style>
    /* Screen styles */
    body {
      font-family: system-ui, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      background: #f9f4ff;
      color: #1a0030;
    }
    .no-print {
      background: #2d1060;
      color: #fff;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }
    .no-print button {
      background: #c45cd9;
      color: #fff;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-left: 12px;
    }

    /* Print page */
    .print-page {
      background: white;
      padding: 24px;
      border: 2px solid #c45cd9;
      border-radius: 16px;
    }
    .print-header {
      text-align: center;
      border-bottom: 3px dashed #c45cd9;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .print-header h1 {
      font-size: 1.8rem;
      color: #6b00b6;
      margin: 0 0 4px;
    }
    .print-header .chars { font-size: 2.5rem; margin-bottom: 4px; }
    .story-box {
      background: #f3e8ff;
      border-left: 5px solid #c45cd9;
      border-radius: 0 10px 10px 0;
      padding: 14px;
      margin-bottom: 16px;
      font-size: 1rem;
      line-height: 1.7;
    }
    .story-box h2 { color: #6b00b6; margin: 0 0 8px; font-size: 1.1rem; }
    .map-area {
      border: 2px dashed #9b5de5;
      border-radius: 12px;
      padding: 20px;
      min-height: 200px;
      text-align: center;
      color: #6b00b6;
      background: #faf0ff;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .map-area .map-icon-lg { font-size: 3rem; }
    .map-area p { font-size: 0.85rem; line-height: 1.5; max-width: 300px; }
    .steps-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .steps-list li {
      display: flex;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #e8d5ff;
      font-size: 0.9rem;
      line-height: 1.5;
      align-items: flex-start;
    }
    .steps-list li:last-child { border-bottom: none; }
    .step-num {
      width: 28px; height: 28px; min-width: 28px;
      background: #c45cd9;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .print-footer {
      text-align: center;
      border-top: 2px dashed #c45cd9;
      padding-top: 12px;
      margin-top: 16px;
      font-size: 0.85rem;
      color: #8b4ab5;
    }

    /* Print media */
    @media print {
      body { background: white; padding: 0; margin: 0; }
      .no-print { display: none !important; }
      .print-page {
        border: none;
        padding: 10mm;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <strong>📋 Strona do druku</strong> — wydrukuj tę stronę i wręcz Ani na starcie przygody.
    <button onclick="window.print()">🖨️ Drukuj</button>
  </div>

  <div class="print-page">
    <div class="print-header">
      <div class="chars">👾🎀✨</div>
      <h1>Misja: Ratuj Stitcha!</h1>
      <div style="font-size:1rem; color:#8b4ab5">Urodzinowa Przygoda Ani — Tajne akta misji 🔐</div>
    </div>

    <div class="story-box">
      <h2>📡 Wiadomość od Hello Kitty:</h2>
      Droga Aniu!<br><br>
      Mam pilną wiadomość! Stitch leciał na Twoje urodziny swoim statkiem kosmicznym,
      ale coś poszło nie tak i statek <strong>rozbił się awaryjnie</strong> w ogrodzie!
      Reaktor jest wyczerpany, systemy nie działają. Znalazłam w trawie jego <strong>klucz startowy</strong>
      — ale zgubiłam go gdzieś na mapce!<br><br>
      Tylko Ty możesz pomóc Stitchowi naprawić statek i odebrać urodzinową niespodziankę.
      <br><br>
      Ruszaj na misję ratunkową! 🚀
    </div>

    <div class="map-area">
      <div class="map-icon-lg">🗺️</div>
      <strong style="font-size:1.1rem; color:#6b00b6">MAPKA MISJI</strong>
      <p>
        <strong>PLACEHOLDER MAPKI</strong><br>
        Podmień tę sekcję na wydrukowaną mapkę z zaznaczonymi punktami:<br>
        ⭐ START (tutaj zaczyna)<br>
        🔧 Miejsce wykrywacza metali<br>
        🗝️ Miejsce ukrycia klucza (brelok NFC #1)
      </p>
    </div>

    <div class="story-box" style="background:#fff3e0; border-color:#ff9f43">
      <h2>📋 Instrukcja dla Ani:</h2>
      <ul class="steps-list">
        <li>
          <div class="step-num">1</div>
          <div>Weź <strong>wykrywacz metali</strong> i szukaj klucza startowego w zaznaczonym miejscu na mapce. Gdy wykrywacz zapika — jesteś blisko!</div>
        </li>
        <li>
          <div class="step-num">2</div>
          <div>Gdy znajdziesz <strong>brelok (kluczyk)</strong> — przyłóż go do telefonu. Otworzy się strona z kolejnymi instrukcjami!</div>
        </li>
        <li>
          <div class="step-num">3</div>
          <div>Wykonuj zadania na stronie krok po kroku. Zbierz <strong>4 kody</strong> do pudełka Stitcha!</div>
        </li>
        <li>
          <div class="step-num">4</div>
          <div>Ustaw 4 kody na <strong>puzzle boxie</strong> i otwórz urodzinową niespodziankę! 🎁</div>
        </li>
      </ul>
    </div>

    <div class="print-footer">
      👾 Powodzenia, agentko Aniu! Hello Kitty i Stitch w Ciebie wierzą! 🎀
      <br>
      <small style="color:#b09cc8">URL strony: podmień na adres GitHub Pages przed drukiem</small>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 6.2: Verify**
  - Open `print.html` in browser: printable page visible with story and placeholder map
  - Click Drukuj button or Ctrl+P: print preview shows clean layout without "no-print" banner
  - Check all sections render correctly in print preview

- [ ] **Step 6.3: Commit**
```bash
git add print.html
git commit -m "feat: add printable paper instruction page"
```

---

## Task 7: Final integration and deployment

**Files:**
- Modify: `.gitignore`

- [ ] **Step 7.1: Add .gitignore**

```
.superpowers/
```

- [ ] **Step 7.2: Verify all navigation links work**
  - `index.html` → button links to `zodiak.html` ✓
  - `zodiak.html` → "always" link and "next" button link to `misja.html` ✓
  - `misja.html` → no outgoing link (NFC #3 handles transition to `final.html`) — add a note comment in HTML
  - `final.html` → self-contained (no outgoing link needed)

- [ ] **Step 7.3: Final commit and push**

```bash
git add .gitignore
git add -A
git commit -m "feat: complete birthday scavenger hunt game"
git push origin main
```

- [ ] **Step 7.4: Verify GitHub Pages deployment**
  - Go to repository → Actions → confirm deploy workflow runs green
  - Visit `https://[user].github.io/stitch-ania-8lat/` → confirm `index.html` loads
  - Visit `/zodiak.html`, `/misja.html`, `/final.html` → all load correctly
  - Visit `/print.html` → printable instruction loads

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Energy bar + accelerometer | Task 2 |
| DeviceMotion fallback after 30s | Task 2 |
| Canvas maze → ♉ reveal | Task 3 |
| "Dalej" always visible on zodiak | Task 3 |
| Countdown 5min + localStorage persist | Task 4 |
| Placeholder map #1 (misja location) | Task 4 |
| Code "3" validation + shake on error | Task 4 |
| Placeholder map #2 (base location) appears after correct code | Task 4 |
| Days of week drag&drop | Task 5 |
| WT highlighted after correct order | Task 5 |
| Simon Says with 4 emotions, last always 😊 | Task 5 |
| Victory screen with all 4 codes listed | Task 5 |
| Confetti on each win | Tasks 3,4,5 |
| Vibration API on wins | Tasks 2,3,4,5 |
| Shared style.css with CSS variables | Task 1 |
| Mobile-first max-width 430px | Task 1 |
| Printable paper instruction | Task 6 |
| .gitignore for .superpowers/ | Task 7 |
| GitHub Pages deployment | Task 7 |
