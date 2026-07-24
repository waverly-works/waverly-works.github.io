/* ============================================================
   aboutday.js
   A fixed daytime scene (bright blue sky) with a SUN POWER slider:
     left  = a weak, small-rayed sun + softer blue sky
     right = a powerful sun with big, dense rays + brighter blue sky

   Simplified: no trees, no grass — just the sky, a faint sparkle,
   and the sun itself, floating in the upper-right portion of the
   hero. The power slider is a small fixed-width pill in the
   bottom-right corner.

   This mirrors explore.js: the hero markup (.bio-hero > .bio-hero-text)
   already exists statically in the HTML, so this script just decorates
   the existing .bio-hero in place — it does NOT build its own wrapper.
   ============================================================ */
   (function () {
    function init() {
      const hero = document.querySelector(".bio-hero");
      if (!hero) return;

      injectStyles();

      hero.classList.add("ascii-hero-frame");

      const canvas = document.createElement("div");
      canvas.id = "aboutSceneCanvas";
      canvas.className = "ascii-hero__canvas";
      hero.insertBefore(canvas, hero.firstChild);

      const sliderWrap = document.createElement("div");
      sliderWrap.className = "ascii-hero__slider-wrap";
      sliderWrap.innerHTML =
        '<span class="ascii-hero__slider-icon">☀️</span>' +
        '<input type="range" id="sunPower" class="ascii-hero__slider" min="0" max="100" value="50" aria-label="Sun power" style="width:130px !important;max-width:130px !important;">';
      hero.appendChild(sliderWrap);

      const powerSlider = document.getElementById("sunPower");
      setupSliderFill(powerSlider);
      runScene(canvas, powerSlider);
    }

    function setupSliderFill(slider) {
      if (!slider) return;
      function update() {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value);
        const pct = ((val - min) / (max - min)) * 100;
        slider.style.setProperty("--pct", pct + "%");
      }
      update();
      slider.addEventListener("input", update);
    }

    function injectStyles() {
      if (document.getElementById("ascii-hero-styles")) return;
      const style = document.createElement("style");
      style.id = "ascii-hero-styles";
      style.textContent = `
        .ascii-hero-frame{position:relative;overflow:hidden;border-radius:14px;min-height:360px;}
        .ascii-hero-frame > .ascii-hero__canvas{position:absolute;inset:0;font-family:'DM Mono',monospace;font-size:11px;line-height:1.1;white-space:pre;overflow:hidden;z-index:0;pointer-events:none;}
        .ascii-hero-frame > *:not(.ascii-hero__canvas){position:relative;z-index:1;}
        .ascii-hero__slider-wrap{position:absolute !important;bottom:16px !important;right:16px !important;top:auto !important;left:auto !important;z-index:2;display:inline-flex !important;width:auto !important;flex:none !important;align-items:center;gap:8px;background:rgba(255,255,255,0.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:6px 14px;border-radius:999px;}
        .ascii-hero__slider-icon{font-size:14px;line-height:1;flex-shrink:0;}

        .ascii-hero__slider{
          width:130px !important;
          max-width:130px !important;
          flex:none !important;
          cursor:pointer;
          -webkit-appearance:none;
          appearance:none;
          background:transparent;
          height:16px;
          margin:0;
          padding:0;
          display:block;
        }
        .ascii-hero__slider::-webkit-slider-runnable-track{
          height:6px;
          border-radius:999px;
          background: linear-gradient(
            to right,
            rgba(255, 191, 94, 0.45) 0%,
            rgba(255, 191, 94, 0.45) var(--pct, 50%),
            rgba(255, 255, 255, 0.25) var(--pct, 50%),
            rgba(255, 255, 255, 0.25) 100%
          );
        }
        .ascii-hero__slider::-moz-range-track{
          height:6px;
          border-radius:999px;
          background: linear-gradient(
            to right,
            rgba(255, 191, 94, 0.45) 0%,
            rgba(255, 191, 94, 0.45) var(--pct, 50%),
            rgba(255, 255, 255, 0.25) var(--pct, 50%),
            rgba(255, 255, 255, 0.25) 100%
          );
        }
        .ascii-hero__slider::-webkit-slider-thumb{
          -webkit-appearance:none;
          appearance:none;
          width:16px;
          height:16px;
          border-radius:50%;
          background:#ffbf5e;
          margin-top:-5px;
          cursor:pointer;
        }
        .ascii-hero__slider::-moz-range-thumb{
          width:16px;
          height:16px;
          border:none;
          border-radius:50%;
          background:#ffbf5e;
          cursor:pointer;
        }

        @media (max-width:768px){ .ascii-hero__slider{width:100px !important;max-width:100px !important;} }
      `;
      document.head.appendChild(style);
    }

    function runScene(canvas, powerSlider) {
      let W = 72,
        H = 22;

      function measureGrid() {
        const test = document.createElement("span");
        test.style.cssText =
          "font-family:'DM Mono',monospace;font-size:11px;line-height:1.1;position:absolute;visibility:hidden;white-space:pre;letter-spacing:0em;";
        test.textContent = "X";
        document.body.appendChild(test);
        const cw = test.getBoundingClientRect().width || 6.6;
        document.body.removeChild(test);
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

      // Sky lighting range for this page — brightens as sun power increases.
      const SKY_TOP_BASE = [58, 123, 213];
      const SKY_BOT_BASE = [140, 185, 235];
      const SKY_TOP_BRIGHT = [90, 165, 245];
      const SKY_BOT_BRIGHT = [180, 215, 250];

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

      // ── Sun power render ───────────────────────────────────
      // power: 0 = weak/small rays, 1 = powerful/big dense rays. Core size is constant.
      function drawSun(set, cx, cy, R, power) {
        const coreRgb = lerpRgb([255, 205, 90], [255, 250, 225], power * 0.6);
        const rimRgb = [255, 165, 40];
        const rayRgb = [255, 195, 70];
        const rayReach = R + 1.5 + power * 7;
        const rayDensity = 0.2 + power * 0.55;
        const asp = 0.52;
        const span = Math.ceil(rayReach / asp) + 1;
        for (let dy = -Math.ceil(rayReach) - 1; dy <= Math.ceil(rayReach) + 1; dy++) {
          for (let dx = -span; dx <= span; dx++) {
            const dist = Math.sqrt((dx * asp) * (dx * asp) + dy * dy);
            const px = Math.round(cx + dx),
              py = Math.round(cy + dy);
            if (dist < R - 0.15) {
              const ci = Math.abs(px * 3 + py * 5 + Math.floor(t * 0.4)) % 7;
              set(px, py, ["O", "0", "o", "Q", "O", "0", "o"][ci], coreRgb);
            } else if (dist < R + 0.25) {
              set(px, py, "o", rimRgb);
            } else if (dist < rayReach && Math.random() < rayDensity * (1 - dist / rayReach)) {
              const ci = Math.abs(px * 7 + py * 11 + Math.floor(t)) % 4;
              set(px, py, [".", "`", "'", "*"][ci], rayRgb);
            }
          }
        }
      }

      function render() {
        t += 0.025;
        const power = clamp01((powerSlider ? parseFloat(powerSlider.value) : 50) / 100);

        // Sky brightens in step with sun power.
        const SKY_TOP = lerpRgb(SKY_TOP_BASE, SKY_TOP_BRIGHT, power);
        const SKY_BOT = lerpRgb(SKY_BOT_BASE, SKY_BOT_BRIGHT, power);

        const SUN_CX = Math.floor(W * 0.7);
        const SUN_CY = Math.floor(H * 0.48);
        const SUN_R = Math.max(3, Math.min(4, Math.floor(H * 0.16)));

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

        // faint daytime sparkle
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const n = (skyNoise[y] && skyNoise[y][x] !== undefined) ? skyNoise[y][x] : 0.5;
            const a = (n + t * 0.01) % 1;
            if (a < 0.006) set(x, y, ".", lerpRgb(SKY_TOP, [255, 255, 255], 0.3));
          }
        }

        drawSun(set, SUN_CX, SUN_CY, SUN_R, power);

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