/* ═══════════════════════════════════════════════════
   DATA — all images, grouped into batches of 6
═══════════════════════════════════════════════════ */
const BATCHES = [
  // Batch 0 — 3D & Illustration
  [
    { src: 'Archive_Page/3D_Modeling/pot_cad.png',          alt: '3D pot model'      },
    { src: 'Archive_Page/3D_Modeling/shark_slippers.png',   alt: '3D shark slippers' },
    { src: 'Archive_Page/3D_Modeling/watches_4 (1).png',    alt: '3D watches'        },
    { src: 'Archive_Page/painting/EFS_drawing_final_3.jpg', alt: 'Drawing'           },
    { src: 'Archive_Page/posters/pen_plot_sky.jpg',         alt: 'Pen plot sky'      },
    { src: 'Archive_Page/painting/心痛_…_grief_is.jpg',     alt: 'Grief is'          },
  ],
  // Batch 1 — Painting & Photography
  [
    { src: 'Archive_Page/photography/blue_heron_lake.jpg',  alt: 'Blue heron'        },
    { src: 'Archive_Page/painting/exit_painting.JPG',       alt: 'Exit painting'     },
    { src: 'Archive_Page/painting/cityscape_painting.JPG',  alt: 'Cityscape'         },
    { src: 'Archive_Page/photography/airplane_clouds.jpg',  alt: 'Airplane clouds'   },
    { src: 'Archive_Page/photography/gondola_river.JPG',    alt: 'Gondola'           },
    { src: 'Archive_Page/photography/IMG_1478.jpg',         alt: 'Photography'       },
  ],
  // Batch 2 — Photography
  [
    { src: 'Archive_Page/photography/sunlight_tree_beijing_street.jpg', alt: 'Sunlight Beijing'   },
    { src: 'Archive_Page/photography/kids_bubble.jpeg',                 alt: 'Kids with bubbles'  },
    { src: 'Archive_Page/photography/statue_newport.jpeg',              alt: 'Statue Newport'     },
    { src: 'Archive_Page/photography/beijing_streets_view.jpg',         alt: 'Beijing streets'    },
    { src: 'Archive_Page/photography/cows_tibet.JPG',                   alt: 'Cows Tibet'         },
    { src: 'Archive_Page/photography/shanghai_kids_water.JPG',          alt: 'Shanghai kids water'},
  ],
];

/* ═══════════════════════════════════════════════════
   LAYOUT ZONES
═══════════════════════════════════════════════════ */
const ZONES = [
  [
    { top:  8, left:  4, w: 26, h: 36, rot: -3.5 },
    { top:  6, left: 68, w: 24, h: 34, rot:  2.8 },
    { top: 38, left:  2, w: 20, h: 30, rot: -2.0 },
    { top: 28, left: 36, w: 28, h: 38, rot:  1.5 },
    { top: 42, left: 74, w: 20, h: 30, rot: -1.8 },
    { top: 60, left: 10, w: 24, h: 32, rot:  3.2 },
  ],
  [
    { top: 10, left: 58, w: 22, h: 32, rot:  2.1 },
    { top:  5, left: 14, w: 26, h: 36, rot: -2.4 },
    { top: 45, left: 68, w: 24, h: 34, rot:  3.5 },
    { top: 32, left: 28, w: 20, h: 30, rot: -1.2 },
    { top: 55, left: 42, w: 26, h: 36, rot:  2.0 },
    { top: 18, left: 80, w: 18, h: 28, rot: -3.0 },
  ],
  [
    { top: 12, left: 32, w: 24, h: 34, rot:  1.8 },
    { top:  7, left: 72, w: 20, h: 30, rot: -2.9 },
    { top: 50, left:  6, w: 26, h: 36, rot:  3.1 },
    { top: 22, left: 52, w: 22, h: 32, rot: -1.5 },
    { top: 48, left: 76, w: 22, h: 32, rot:  2.6 },
    { top: 62, left: 28, w: 20, h: 28, rot: -2.2 },
  ],
];

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const VH_PER_BATCH = 2.2;
const INTRO_VH     = 0.3;

/* ═══════════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════════ */
const stage         = document.getElementById('stickyStage');
const scrollTrack   = document.getElementById('scrollTrack');
const scrollHint    = document.getElementById('scrollHint');
const nameTiles     = document.getElementById('nameTiles');
const bioFloat      = document.getElementById('bioFloat');
const heroImage     = document.getElementById('heroImage');
const batchLabel    = document.getElementById('batchLabel');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightBtn      = document.getElementById('lightBtn');
const darkBtn       = document.getElementById('darkBtn');

/* ═══════════════════════════════════════════════════
   SCROLL TRACK HEIGHT
═══════════════════════════════════════════════════ */
const totalVH = INTRO_VH + BATCHES.length * VH_PER_BATCH + 0.6;
scrollTrack.style.height = `${totalVH * 100}vh`;

/* ═══════════════════════════════════════════════════
   BUILD IMAGE ELEMENTS
═══════════════════════════════════════════════════ */
const batchEls = BATCHES.map((batch, bi) =>
  batch.map((img, ii) => {
    const zone = ZONES[bi][ii];
    const el   = document.createElement('div');
    el.className = 'scatter-img';
    const cx = zone.left + zone.w / 2;
    const cy = zone.top  + zone.h / 2;
    el.style.cssText = `
      top:        ${zone.top}%;
      left:       ${zone.left}%;
      width:      ${zone.w}vw;
      height:     ${zone.h}vh;
      z-index:    ${(bi + 1) * 10 + ii};
      --rot:      ${zone.rot}deg;
      --center-x: ${cx}vw;
      --center-y: ${cy}vh;
    `;
    el.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
    el.addEventListener('click', () => openLightbox(img.src));
    stage.appendChild(el);
    return el;
  })
);

/* ═══════════════════════════════════════════════════
   ARROW KEY BATCH NAVIGATION
═══════════════════════════════════════════════════ 
document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('active')) return;

  const introPx    = INTRO_VH * window.innerHeight;
  const batchPx    = VH_PER_BATCH * window.innerHeight;
  const current    = getActiveBatch();

  if (e.key === 'ArrowRight') {
    const next = Math.min(current + 1, BATCHES.length - 1);
    window.scrollTo({ top: introPx + next * batchPx, behavior: 'smooth' });
  } else if (e.key === 'ArrowLeft') {
    const prev = Math.max(current - 1, 0);
    window.scrollTo({ top: introPx + prev * batchPx, behavior: 'smooth' });
  }
});*/
/* ═══════════════════════════════════════════════════
   SCROLL LOGIC
═══════════════════════════════════════════════════ */
function getActiveBatch() {
  const introPx  = INTRO_VH * window.innerHeight;
  const batchPx  = VH_PER_BATCH * window.innerHeight;
  const scrolled = window.scrollY;
  if (scrolled < introPx) return -1;
  return Math.min(Math.floor((scrolled - introPx) / batchPx), BATCHES.length - 1);
}

let lastActiveBatch = -2;

function onScroll() {
  const activeBatch = getActiveBatch();

  // Scroll hint
  scrollHint.classList.toggle('hidden', window.scrollY > 80);

  // Hero elements fade
  const heroGone = window.scrollY > window.innerHeight * 0.12;
  nameTiles.classList.toggle('hidden', heroGone);
  bioFloat.classList.toggle('hidden', heroGone);
  if (heroImage) heroImage.classList.toggle('hidden', heroGone);

  // Dot indicator highlight
  batchLabel.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i <= activeBatch);
  });

  // Only re-animate when batch changes
  if (activeBatch === lastActiveBatch) return;

  batchEls.forEach((batch, bi) => {
    const shouldShow  = bi <= activeBatch;
    const isEntering  = shouldShow && bi > lastActiveBatch;
    const isLeaving   = !shouldShow && bi <= lastActiveBatch;

    batch.forEach((el, ii) => {
      if (isEntering) {
        el.style.transitionDelay = `${ii * 0.09}s`;
        el.classList.add('visible');
      } else if (isLeaving) {
        el.style.transitionDelay = `${(batch.length - 1 - ii) * 0.06}s`;
        el.classList.remove('visible');
      } else if (shouldShow) {
        el.style.transitionDelay = '0s';
        el.classList.add('visible');
      } else {
        el.style.transitionDelay = '0s';
        el.classList.remove('visible');
      }
    });
  });

  lastActiveBatch = activeBatch;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ═══════════════════════════════════════════════════
   MOUSE PARALLAX DRIFT
═══════════════════════════════════════════════════ */
document.addEventListener('mousemove', e => {
  if (lightbox.classList.contains('active')) return;
  const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
  const cy = (e.clientY / window.innerHeight - 0.5) * 2;
  batchEls.forEach(batch => {
    batch.forEach((el, ii) => {
      if (!el.classList.contains('visible')) return;
      const depth = 0.4 + (ii % 3) * 0.3;
      el.style.translate = `${cx * depth * 6}px ${cy * depth * 4}px`;
    });
  });
});

/* ═══════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════ */
function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

/* ═══════════════════════════════════════════════════
   DARK MODE
═══════════════════════════════════════════════════ */
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

lightBtn.addEventListener('click', () => {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('theme', 'light');
});

darkBtn.addEventListener('click', () => {
  document.body.classList.add('dark-mode');
  localStorage.setItem('theme', 'dark');
});

/* ═══════════════════════════════════════════════════
   BIO TAGS
═══════════════════════════════════════════════════ */
document.querySelectorAll('.bio-tag.expandable').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('expanded');
  });
});