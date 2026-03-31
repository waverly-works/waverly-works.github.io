/* ════════════════════════════════════════════════════════════════
   archive.js  —  Waverly Huang · Archive page
   Sidebar logic mirrors sidebar.js (scroll-spy + click-to-scroll)
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── SCROLL FADE-IN FOR GALLERY ROWS ─────────────────────────── */
  function observeRows() {
    const rows = document.querySelectorAll(".gallery-row:not(.fade-in-visible)");
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    rows.forEach(row => io.observe(row));
  }

  observeRows();

  /* ── SCROLL-SPY SIDE NAV (mirrors sidebar.js) ────────────────── */
  const sideLinks = Array.from(document.querySelectorAll(".side-nav-link"));
  const sections  = Array.from(document.querySelectorAll(".gallery-section[data-category], .spotlight-section[data-category]"));
  function updateActiveSidebarLink() {
    const scrollY  = window.scrollY || window.pageYOffset;
    const trigger  = scrollY + window.innerHeight * 0.6;

    // Default to first section (code) when at the top
    let activeIndex = 0;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= trigger) activeIndex = i;
    });

    sideLinks.forEach(link => link.classList.remove("active"));
    const activeCat  = sections[activeIndex].dataset.category;
    const activeLink = sideLinks.find(l => l.dataset.category === activeCat);
    if (activeLink) activeLink.classList.add("active");
  }

  window.addEventListener("scroll", updateActiveSidebarLink, { passive: true });
  updateActiveSidebarLink(); // run on load

  // Click → smooth scroll to section (Everything scrolls to top)
  sideLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const cat    = link.dataset.category;
      const target = sections.find(s => s.dataset.category === cat);
      if (target) {
        const headerOffset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── LIGHTBOX ─────────────────────────────────────────────────── */
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const lightboxPrev  = document.getElementById("lightboxPrev");
  const lightboxNext  = document.getElementById("lightboxNext");

  let allItems     = [];
  let currentIndex = 0;
  
  function openLightbox(item) {
    allItems = Array.from(document.querySelectorAll(".gallery-item"));
    currentIndex = allItems.indexOf(item);
    showImage(currentIndex);
    lightbox.classList.add("active");
    lightboxPrev.classList.add("visible");
    lightboxNext.classList.add("visible");
    document.body.style.overflow = "hidden";
  }
  
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxPrev.classList.remove("visible");
    lightboxNext.classList.remove("visible");
    document.body.style.overflow = "";
    setTimeout(() => { lightboxImg.src = ""; }, 300);
  }
  
  function showImage(idx) {
    if (!allItems.length) return;
    currentIndex = (idx + allItems.length) % allItems.length;
    const item   = allItems[currentIndex];
    const src    = item.querySelector("img")?.getAttribute("src") || "";
    const alt    = item.querySelector("img")?.alt || "";
  
    lightboxImg.style.opacity   = "0";
    lightboxImg.style.transform = "scale(0.97)";
    setTimeout(() => {
      lightboxImg.src             = src;
      lightboxImg.alt             = alt;
      lightboxImg.style.opacity   = "1";
      lightboxImg.style.transform = "scale(1)";
    }, 110);
  
    // ← Remove the hidden toggle entirely; arrows always show
  }

  document.getElementById("gallery").addEventListener("click", e => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightbox(item);
  });


  lightboxPrev.addEventListener("click",  () => showImage(currentIndex - 1));
  lightboxNext.addEventListener("click",  () => showImage(currentIndex + 1));

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  lightboxImg.style.transition = "opacity 0.11s ease, transform 0.11s ease";

  /* ── DARK MODE ────────────────────────────────────────────────── */
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  const lightBtn = document.getElementById("lightBtn");
  const darkBtn  = document.getElementById("darkBtn");

  if (lightBtn) lightBtn.addEventListener("click", () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  });
  if (darkBtn) darkBtn.addEventListener("click", () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  });

  // After your existing lightBtn/darkBtn listeners, add:

function syncModeButtons() {
  const isDark = document.body.classList.contains("dark-mode");
  lightBtn.classList.toggle("active-mode", !isDark);
  darkBtn.classList.toggle("active-mode", isDark);
}

// Call on load
syncModeButtons();

// Update your existing listeners to also call it:
if (lightBtn) lightBtn.addEventListener("click", () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
  syncModeButtons();
});
if (darkBtn) darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
  syncModeButtons();
});

  /* ── BIO EXPANDABLE PILLS ─────────────────────────────────────── */
  document.querySelectorAll(".bio-tag.expandable").forEach(tag => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("expanded");
    });
  });
  /* ── CODING EXPLORATIONS LIGHTBOX ────────────────────────── */
const codingLightbox      = document.getElementById("coding-lightbox");
const codingIframe        = document.getElementById("coding-lightbox-iframe");
const codingClose         = document.getElementById("coding-lightbox-close");
const codingLoading       = document.getElementById("coding-lightbox-loading");

function openCodingLightbox(url) {
  codingLoading.classList.remove("hidden");
  codingIframe.src = "";
  codingLightbox.classList.add("active");
  document.body.style.overflow = "hidden";

  codingIframe.onload = () => {
    codingLoading.classList.add("hidden");
  };
  codingIframe.src = url;
}

function closeCodingLightbox() {
  codingLightbox.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(() => { codingIframe.src = ""; }, 300);
}

// Click on card → open lightbox (desktop) or new tab (mobile)
document.querySelectorAll(".coding-card[data-href]").forEach(card => {
  card.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      window.open(card.dataset.href, "_blank", "noopener,noreferrer");
    } else {
      openCodingLightbox(card.dataset.href);
    }
  });
});

codingClose.addEventListener("click", closeCodingLightbox);

codingLightbox.addEventListener("click", e => {
  if (e.target === codingLightbox) closeCodingLightbox();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && codingLightbox.classList.contains("active")) {
    closeCodingLightbox();
  }
});

/* ── Also observe coding cards for fade-in ──────────────── */
const codingCards = document.querySelectorAll(".coding-card");
const codingIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-visible");
      codingIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
codingCards.forEach(card => codingIO.observe(card));

})();