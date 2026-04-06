/* ════════════════════════════════════════════════════════════════
   explore.js  —  Waverly Huang · Explore page
   ════════════════════════════════════════════════════════════════ */

   (function () {
    "use strict";
  
    /* ── SCROLL ONE BY ONE THINGIE FOR GALLERY ROWS ─────────────────────────── */
    function observeRows() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const siblings = Array.from(item.closest('.gallery-row').querySelectorAll('.gallery-item'));
            const index = siblings.indexOf(item);
            item.style.transitionDelay = `${index * 0.12}s`;
            item.classList.add('fade-in-visible');
            itemObserver.unobserve(item);
          }
        });
      }, { threshold: 0.08 });
  
      galleryItems.forEach(item => itemObserver.observe(item));
    }
  
    observeRows();
  
    function observeSpotlight() {
      const spotlightCards = document.querySelectorAll('.spotlight-card');
      const spotlightIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = Array.from(spotlightCards).indexOf(card);
            setTimeout(() => {
              card.classList.add('revealed');
            }, 900 + index * 120);
            spotlightIO.unobserve(card);
          }
        });
      }, { threshold: 0.08 });
  
      spotlightCards.forEach(card => spotlightIO.observe(card));
    }
  
    observeSpotlight();
  
    /* ── SCROLL-SPY SIDE NAV ─────────────────────────────────────── */
    const sideLinks = Array.from(document.querySelectorAll(".side-nav-link"));
    const sections  = Array.from(document.querySelectorAll(".gallery-section[data-category], .spotlight-section[data-category]"));
  
    function updateActiveSidebarLink() {
      const scrollY  = window.scrollY || window.pageYOffset;
      const trigger  = scrollY + window.innerHeight * 0.6;
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
    updateActiveSidebarLink();
  
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
  
    /* ── DARK MODE ────────────────────────────────────────────────── */
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  
    const lightBtn = document.getElementById("lightBtn");
    const darkBtn  = document.getElementById("darkBtn");
  
    function syncModeButtons() {
      const isDark = document.body.classList.contains("dark-mode");
      if (lightBtn) lightBtn.classList.toggle("active-mode", !isDark);
      if (darkBtn)  darkBtn.classList.toggle("active-mode", isDark);
    }
  
    syncModeButtons();
  
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
  
    /* ── UNIFIED LIGHTBOX NAVIGATION ─────────────────────────────── */
    const lightbox       = document.getElementById("lightbox");
    const lightboxImg    = document.getElementById("lightboxImg");
    const lightboxPrev   = document.getElementById("lightboxPrev");
    const lightboxNext   = document.getElementById("lightboxNext");
    const codingLightbox = document.getElementById("coding-lightbox");
    const codingIframe   = document.getElementById("coding-lightbox-iframe");
    const codingClose    = document.getElementById("coding-lightbox-close");
    const codingLoading  = document.getElementById("coding-lightbox-loading");
    const codingPrev     = document.getElementById("codingLightboxPrev");
    const codingNext     = document.getElementById("codingLightboxNext");
  
    lightboxImg.style.transition = "opacity 0.11s ease, transform 0.11s ease";
  
    // Build one flat ordered list of all navigable items in DOM order:
    // { type: 'iframe', url, el }  or  { type: 'image', src, alt, el }
    function buildNavList() {
      const items = [];
      document.querySelectorAll(".coding-card[data-href], .gallery-item").forEach(el => {
        if (el.classList.contains("coding-card")) {
          items.push({ type: "iframe", url: el.dataset.href, el });
        } else {
          const img = el.querySelector("img");
          if (img) items.push({ type: "image", src: img.getAttribute("src"), alt: img.alt, el });
        }
      });
      return items;
    }
  
    let navList  = [];
    let navIndex = 0;
  
    function showArrows() {
      lightboxPrev.classList.add("visible");
      lightboxNext.classList.add("visible");
      codingPrev.classList.add("visible");
      codingNext.classList.add("visible");
    }
  
    function hideArrows() {
      lightboxPrev.classList.remove("visible");
      lightboxNext.classList.remove("visible");
      codingPrev.classList.remove("visible");
      codingNext.classList.remove("visible");
    }
  
    function openAt(index) {
      navList  = buildNavList();
      navIndex = ((index % navList.length) + navList.length) % navList.length;
      const item = navList[navIndex];
  
      if (item.type === "iframe") {
        // Switch to coding lightbox
        lightbox.classList.remove("active");
        codingLoading.classList.remove("hidden");
        codingIframe.src = "";
        codingIframe.onload = () => codingLoading.classList.add("hidden");
        codingIframe.src = item.url;
        codingLightbox.classList.add("active");
      } else {
        // Switch to image lightbox
        codingLightbox.classList.remove("active");
        setTimeout(() => { codingIframe.src = ""; }, 300);
        lightboxImg.style.opacity   = "0";
        lightboxImg.style.transform = "scale(0.97)";
        setTimeout(() => {
          lightboxImg.src             = item.src;
          lightboxImg.alt             = item.alt;
          lightboxImg.style.opacity   = "1";
          lightboxImg.style.transform = "scale(1)";
        }, 110);
        lightbox.classList.add("active");
      }
  
      showArrows();
      document.body.style.overflow = "hidden";
    }
  
    function closeAll() {
      lightbox.classList.remove("active");
      codingLightbox.classList.remove("active");
      hideArrows();
      document.body.style.overflow = "";
      setTimeout(() => {
        lightboxImg.src  = "";
        codingIframe.src = "";
      }, 300);
    }
  
    // ── Open coding cards ──
    document.querySelectorAll(".coding-card[data-href]").forEach(card => {
      card.addEventListener("click", () => {
        if (window.innerWidth <= 800) {
          const a = document.createElement("a");
          a.href = card.dataset.href;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.click();
        } else {
          navList = buildNavList();
          openAt(navList.findIndex(item => item.el === card));
        }
      });
    });
  
    // ── Open gallery items ──
    document.getElementById("gallery").addEventListener("click", e => {
      const item = e.target.closest(".gallery-item");
      if (item) {
        navList = buildNavList();
        openAt(navList.findIndex(n => n.el === item));
      }
    });
  
    // ── All four arrows navigate the same unified list ──
    lightboxPrev.addEventListener("click", () => openAt(navIndex - 1));
    lightboxNext.addEventListener("click", () => openAt(navIndex + 1));
    codingPrev.addEventListener("click",   () => openAt(navIndex - 1));
    codingNext.addEventListener("click",   () => openAt(navIndex + 1));
  
    // ── Close ──
    codingClose.addEventListener("click", closeAll);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeAll(); });
    codingLightbox.addEventListener("click", e => { if (e.target === codingLightbox) closeAll(); });
  
    // ── Keyboard ──
    document.addEventListener("keydown", e => {
      const anyOpen = lightbox.classList.contains("active") || codingLightbox.classList.contains("active");
      if (!anyOpen) return;
      if (e.key === "Escape")     closeAll();
      if (e.key === "ArrowLeft")  openAt(navIndex - 1);
      if (e.key === "ArrowRight") openAt(navIndex + 1);
    });
  
    /* ── Fade-in observe coding cards ───────────────────────────── */
    const codingIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
          codingIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".coding-card").forEach(card => codingIO.observe(card));
  
  })();