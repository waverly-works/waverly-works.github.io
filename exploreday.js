/* ============================================================
   explore.js
   A fixed night scene (dark navy sky) with a MOON PHASE slider:
     left   = crescent moon
     middle = half moon
     right  = full moon

   Simplified: no trees, no grass — just the sky, a light star
   sprinkle, and the moon itself, floating in the upper-right
   portion of the hero. The phase slider is a small fixed-width
   pill in the bottom-right corner.
   ============================================================ */
   (function () {
    function init() {
      const hero = document.querySelector(".archive-hero");
      if (!hero) return;

      injectStyles();
      hero.classList.add("ascii-hero-frame");

      // canvas layer (goes behind the existing heading/bio text)
      const canvas = document.createElement("div");
      canvas.id = "exploreSceneCanvas";
      canvas.className = "ascii-hero__canvas";
      hero.insertBefore(canvas, hero.firstChild);

      // phase slider (bottom right, compact pill)
      const sliderWrap = document.createElement("div");
      sliderWrap.className = "ascii-hero__slider-wrap";
      sliderWrap.innerHTML =
        '<span class="ascii-hero__slider-icon">🌙</span>' +
        '<input type="range" id="moonPhase" class="ascii-hero__slider" min="0" max="100" value="50" aria-label="Moon phase" style="width:130px !important;max-width:130px !important;">';
      hero.appendChild(sliderWrap);

      runScene(canvas, document.getElementById("moonPhase"));
    }

    function injectStyles() {
      if (document.getElementById("ascii-hero-styles")) return;
      const style = document.createElement("style");
      style.id = "ascii-hero-styles";
      style.textContent = `
        .ascii-hero-frame{position:relative;overflow:hidden;border-radius:28px;min-height:360px;}
        .ascii-hero-frame > .ascii-hero__canvas{position:absolute;inset:0;font-family:'DM Mono',monospace;font-size:11px;line-height:1.1;white-space:pre;overflow:hidden;z-index:0;pointer-events:none;}
        .ascii-hero-frame > *:not(.ascii-hero__canvas){position:relative;z-index:1;}
        .ascii-hero__slider-wrap{position:absolute !important;bottom:16px !important;right:16px !important;top:auto !important;left:auto !important;z-index:2;display:inline-flex !important;width:auto !important;flex:none !important;align-items:center;gap:8px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:6px 14px;border-radius:999px;}
        .ascii-hero__slider-icon{font-size:14px;line-height:1;flex-shrink:0;}
        .ascii-hero__slider{width:130px !important;max-width:130px !important;flex:none !important;accent-color:#dfe6ef;cursor:pointer;}
        @media (max-width:768px){ .ascii-hero__slider{width:100px !important;max-width:100px !important;} }
      `;
      document.head.appendChild(style);
    }

    function runScene(canvas, phaseSlider) {
      let W = 72,
        H = 22;
      // aspect = character cell height / character cell width, in px.
      // Monospace cells are taller than they are wide, so a "circle"
      // drawn with equal dx/dy steps renders as a tall oval unless we
      // compensate for this ratio.
      let aspect = 2;

      function measureGrid() {
        const test = document.createElement("span");
        test.style.cssText =
          "font-family:'DM Mono',monospace;font-size:11px;line-height:1.1;position:absolute;visibility:hidden;white-space:pre;letter-spacing:0em;";
        test.textContent = "X";
        document.body.appendChild(test);
        const box = test.getBoundingClientRect();
        const cw = box.width || 6.6;
        const ch = box.height || cw * 2;
        document.body.removeChild(test);
        aspect = ch / cw;
        const rect = canvas.getBoundingClientRect();
        W = Math.max(40, Math.floor((rect.width || window.innerWidth) / cw));
        H = Math.max(16, Math.floor((rect.height || 360) / (11 * 1.1)));
      }
      measureGrid();

      function lerpRgb(a, b, t) {
        return [
          Math.round(a[0] + (b[0] - a[0]) * t),
          Math.round(a[1] + (b[1] - a[1]) * t),
          Math.round(a[2] + (b[2] - a[2]) * t),
        ];
      }
      function clamp01(v) {
        return Math.max(0, Math.min(1, v));
      }

      // Fixed "dark navy night" lighting for this page.
      const SKY_TOP = [10, 12, 30];
      const SKY_BOT = [22, 26, 50];

      let skyNoise = [];
      function buildSkyNoise() {
        skyNoise = [];
        for (let y = 0; y < H; y++) {
          skyNoise.push([]);
          for (let x = 0; x < W; x++) skyNoise[y].push(Math.random());
        }
      }
      buildSkyNoise();

      let t = 0;

      // ── Moon phase render ──────────────────────────────────
      // k: 0 = crescent, 0.5 = half, 1 = full (waxing, lit on the right)
      // R is expressed in "column" units (x-axis). Because character
      // cells aren't square, dy is scaled by `aspect` before it's used
      // in any distance/circle math, so the moon renders round instead
      // of stretched vertically.
      function drawMoon(set, cx, cy, R, k, aspect) {
        const angle = k * Math.PI;
        const cosA = Math.cos(angle);
        const litRgb = [238, 240, 248];
        const darkRgb = [70, 78, 98];
        const litChars = ["O", "0", "o", "Q"];
        const darkChars = [":", ".", "·"];
        const dyMax = Math.ceil(R / aspect);
        for (let dy = -dyMax; dy <= dyMax; dy++) {
          const dyS = dy * aspect; // scaled to the same units as dx/R
          const h = Math.sqrt(Math.max(0, R * R - dyS * dyS));
          if (h <= 0) continue;
          const termX = h * cosA;
          for (let dx = -Math.ceil(h); dx <= Math.ceil(h); dx++) {
            if (dx * dx + dyS * dyS > R * R) continue;
            const px = Math.round(cx + dx),
              py = Math.round(cy + dy);
            const lit = dx >= termX;
            const rgb = lit ? litRgb : darkRgb;
            const chars = lit ? litChars : darkChars;
            const ci = Math.abs(px * 3 + py * 5) % chars.length;
            set(px, py, chars[ci], rgb);
          }
        }
      }

      function render() {
        t += 0.02;
        const k = clamp01((phaseSlider ? parseFloat(phaseSlider.value) : 50) / 100);

        const MOON_CX = Math.floor(W * 0.7);
        const MOON_CY = Math.floor(H * 0.48);
        const MOON_R = Math.max(4, Math.min(6, Math.floor(H * 0.22)));

        const grid = [];
        for (let y = 0; y < H; y++) {
          grid.push([]);
          for (let x = 0; x < W; x++) {
            grid[y].push({ ch: " ", rgb: lerpRgb(SKY_TOP, SKY_BOT, y / Math.max(1, H)) });
          }
        }
        function set(x, y, ch, rgb) {
          if (y >= 0 && y < H && x >= 0 && x < W) grid[y][x] = { ch, rgb };
        }

        // faint stars across the whole scene
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const n = (skyNoise[y] && skyNoise[y][x] !== undefined) ? skyNoise[y][x] : 0.5;
            const a = (n + t * 0.01) % 1;
            if (a < 0.02) set(x, y, a < 0.006 ? "*" : ".", [230, 230, 245]);
          }
        }

        drawMoon(set, MOON_CX, MOON_CY, MOON_R, k, aspect);

        let html = "",
          cur = null;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const cell = grid[y][x];
            const key = cell.rgb[0] + "," + cell.rgb[1] + "," + cell.rgb[2];
            if (key !== cur) {
              if (cur !== null) html += "</span>";
              html += `<span style="color:rgb(${key})">`;
              cur = key;
            }
            const c = cell.ch;
            html += c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;
          }
          html += "\n";
        }
        if (cur) html += "</span>";
        canvas.innerHTML = html;
        canvas.style.background = `linear-gradient(to bottom, rgb(${SKY_TOP.join(",")}) 0%, rgb(${SKY_BOT.join(",")}) 100%)`;

        requestAnimationFrame(render);
      }

      if (window.ResizeObserver) {
        new ResizeObserver(() => {
          measureGrid();
          buildSkyNoise();
        }).observe(canvas);
      }
      render();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  })();