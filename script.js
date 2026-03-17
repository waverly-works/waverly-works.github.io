document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DARK MODE (Unified)
  ========================== */

  const body = document.body;

  const modeToggle = document.getElementById("modeToggle");
  const lightBtn   = document.getElementById("lightBtn");
  const darkBtn    = document.getElementById("darkBtn");

  function applyMode(mode) {
    const isDark = mode === "dark";
    body.classList.toggle("dark-mode", isDark);

    if (darkBtn && lightBtn) {
      darkBtn.classList.toggle("active-mode", isDark);
      lightBtn.classList.toggle("active-mode", !isDark);
    }

    localStorage.setItem("theme", mode);
  }

  const savedMode = localStorage.getItem("theme") || "light";
  applyMode(savedMode);

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      applyMode(body.classList.contains("dark-mode") ? "light" : "dark");
    });
  }

  if (lightBtn) lightBtn.addEventListener("click", () => applyMode("light"));
  if (darkBtn)  darkBtn.addEventListener("click",  () => applyMode("dark"));


  /* =========================
     SMOOTH SCROLL
  ========================== */

  const scrollDown = document.getElementById("scrollDown");

  if (scrollDown) {
    scrollDown.addEventListener("click", () => {
      const projects = document.getElementById("projects");
      if (projects) projects.scrollIntoView({ behavior: "smooth" });
    });
  }


  /* =========================
     IMAGE LIGHTBOX (gallery pages)
  ========================== 

  const imageLightbox = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  if (imageLightbox && galleryImages.length > 0) {
    let currentImageIndex = 0;
    const imageArray = Array.from(galleryImages);

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        currentImageIndex = index;
        showImage(currentImageIndex);
        imageLightbox.classList.add('active');
        body.style.overflow = 'hidden';
      });
    });

    function showImage(index) {
      if (index >= 0 && index < imageArray.length) {
        lightboxImg.src = imageArray[index].src;
        currentImageIndex = index;
      }
    }

    function showPreviousImage() {
      currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
      showImage(currentImageIndex);
    }

    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % imageArray.length;
      showImage(currentImageIndex);
    }

    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPreviousImage(); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
    if (lightboxClose) lightboxClose.addEventListener('click', () => closeImageLightbox());

    imageLightbox.addEventListener('click', (e) => {
      if (e.target === imageLightbox) closeImageLightbox();
    });

    function closeImageLightbox() {
      imageLightbox.classList.remove('active');
      body.style.overflow = 'auto';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    document.addEventListener('keydown', (e) => {
      if (imageLightbox.classList.contains('active')) {
        if (e.key === 'Escape')          closeImageLightbox();
        else if (e.key === 'ArrowLeft')  showPreviousImage();
        else if (e.key === 'ArrowRight') showNextImage();
      }
    });
  }


  /* =========================
     ARCHIVE PAGE SCROLL EFFECTS
  ==========================

  const archiveHeader = document.getElementById('archiveHeader');
  const allImages = document.querySelectorAll('.gallery-item-horizontal img, .gallery-item-vertical img');

  if (archiveHeader && allImages.length > 0) {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 200;
      archiveHeader.classList.toggle('hidden', scrollPosition > scrollThreshold);
      allImages.forEach(img => img.classList.toggle('color', scrollPosition > scrollThreshold));
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
  } */


  /* =========================
     PROJECT LIGHTBOX (index page — replaces card navigation)
  ========================== */

  const projectSidebars = {
    'navi.html': [
      { label: 'Overview',   href: '#overview'   },
      { label: 'Mission',   href: '#mission'   },
      { label: 'Decisions',    href: '#decisions'  },
      { label: 'Solution',  href: '#solution'  },
      { label: 'Process',  href: '#process'  },
      { label: 'Reflection', href: '#reflection' },
    ],
    'tasktone.html': [
      { label: 'Overview',   href: '#overview'   },
      { label: 'Mission',   href: '#mission'   },
      { label: 'Pain Points',  href: '#painpoints'  },
      { label: 'Decisions',    href: '#decisions'  },
      { label: 'Form Process',    href: '#process'  },
      { label: 'Reflection', href: '#reflection' },
    ], 
    'sasfui.html': [
      { label: 'Overview',   href: '#overview'   },
      { label: 'Build',      href: '#build'      },
      { label: 'Specs',      href: '#specs'      },
      { label: 'Tabs',       href: '#tabs'       },
      { label: 'Reflection', href: '#reflection' },
    ],
    'waddle.html': [
      { label: 'Overview',   href: '#overview'   },
      { label: 'Mission',   href: '#mission'   },
      { label: 'Decisions',    href: '#decisions'  },
      { label: 'Solution',    href: '#solution'    },
      { label: 'Process',    href: '#process'    },
      { label: 'Reflection', href: '#reflection' },
    ],

    'https://drive.google.com/file/d/1OEFPpVZ7_9pYOWnbHrQfuff9GV5yCxTG/preview': [],
     
    
  };

  const overlay   = document.getElementById('lightbox-overlay');
  const lbClose   = document.getElementById('lightbox-close');
  const lbSidebar = document.getElementById('lightbox-sidebar');
  const lbIframe  = document.getElementById('lightbox-iframe');
  const lbLoading = document.getElementById('lightbox-loading');

  if (overlay && lbIframe) {

    function openProjectLightbox(projectFile, animate = false) {
      const links = projectSidebars[projectFile] || [];
      lbSidebar.innerHTML = '';

      links.forEach((item, i) => {
        const a = document.createElement('a');
        a.textContent = item.label;
        a.href = 'javascript:void(0)';
        if (i === 0) a.classList.add('active');

        a.addEventListener('click', () => {
          try {
            const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
            const target = iDoc.querySelector(item.href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          } catch (e) {
            lbIframe.contentWindow.location.hash = item.href.slice(1);
          }
          lbSidebar.querySelectorAll('a').forEach(l => l.classList.remove('active'));
          a.classList.add('active');
        });

        lbSidebar.appendChild(a);
      });

      // Get or create a dissolve overlay inside the lightbox window
      const lbWindow = document.getElementById('lightbox-window');
      let dissolve = document.getElementById('lightbox-dissolve');
      if (!dissolve) {
        dissolve = document.createElement('div');
        dissolve.id = 'lightbox-dissolve';
        dissolve.style.cssText = `
          position: absolute;
          inset: 0;
          z-index: 15;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease;
          border-radius: 20px;
        `;
        lbWindow.appendChild(dissolve);
      }
      
      // Mobile card stack click-to-front
function initMobileStack() {
  const items = document.querySelectorAll('.stacked-images .stack-item');
  if (!items.length) return;

  items.forEach(item => {
      item.addEventListener('click', () => {
          if (window.innerWidth > 600) return;
          items.forEach(i => i.classList.remove('stack-active'));
          item.classList.add('stack-active');
      });
  });
}

initMobileStack();

      // Match dissolve color to dark/light mode
      const isDark = document.body.classList.contains('dark-mode');
      let bgColor = isDark ? '#1e1e1e' : '#e8e8e8';
      try {
        const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
        const iBody = iDoc.body;
        if (iBody) {
          const computed = lbIframe.contentWindow.getComputedStyle(iBody).backgroundColor;
          if (computed && computed !== 'rgba(0, 0, 0, 0)') bgColor = computed;
        }
      } catch (e) { /* cross-origin */ }
      dissolve.style.background = bgColor;

      // Also keep loading screen in sync
      if (lbLoading) lbLoading.style.background = isDark ? '#1e1e1e' : '#fff';

      const doLoad = () => {
        lbLoading.classList.remove('hidden');
        lbIframe.src = '';
        overlay.classList.add('open');
        body.style.overflow = 'hidden';
        lbIframe.style.opacity = '1';
        lbIframe.style.transition = '';

        lbIframe.onload = () => {
          lbLoading.classList.add('hidden');

          // Hide the project page's own chrome inside the iframe
          try {
            const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
            ['header', 'footer', '.side-nav', 'nav.side-nav'].forEach(sel => {
              iDoc.querySelectorAll(sel).forEach(el => el.style.display = 'none');
            });
            const mainEl = iDoc.querySelector('main');
            if (mainEl) mainEl.style.paddingTop = '48px';

            // Inject scrollbar styles to match the project page background
            const scrollStyle = iDoc.createElement('style');
            scrollStyle.textContent = `
              html, body { scrollbar-color: rgba(0,0,0,0.2) transparent; scrollbar-width: thin; }
              ::-webkit-scrollbar { width: 6px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 99px; }
              ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.35); }
            `;
            iDoc.head.appendChild(scrollStyle);
          } catch (e) { /* cross-origin, skip */ }

          // Fade dissolve back out to reveal new content
          dissolve.style.opacity = '0';

          // NOTE: Scroll-spy is handled entirely by sidebar.js — no duplicate listener here.
        };

        lbIframe.src = projectFile;
      };

      if (animate) {
        dissolve.style.opacity = '1';
        setTimeout(doLoad, 180);
      } else {
        dissolve.style.opacity = '0';
        doLoad();
      }
    }

    function closeProjectLightbox() {
      overlay.classList.remove('open');
      body.style.overflow = '';
      lbIframe.src = '';
      lbSidebar.innerHTML = '';
    }

    // Open lightbox on card click
    document.querySelectorAll('.project-card[data-project]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const file = card.dataset.project;
        const idx = projectOrder.indexOf(file);
        if (idx !== -1) currentProjectIndex = idx;
        openProjectLightbox(file);
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeProjectLightbox);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProjectLightbox();
    });

    // Ordered list of projects for arrow key navigation
    const projectOrder = Object.keys(projectSidebars);
    let currentProjectIndex = 0;

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeProjectLightbox();
      } else if (e.key === 'ArrowRight') {
        currentProjectIndex = (currentProjectIndex + 1) % projectOrder.length;
        openProjectLightbox(projectOrder[currentProjectIndex], true);
      } else if (e.key === 'ArrowLeft') {
        currentProjectIndex = (currentProjectIndex - 1 + projectOrder.length) % projectOrder.length;
        openProjectLightbox(projectOrder[currentProjectIndex], true);
      }
    });

  } else {
    // Fallback: on non-index pages, project cards navigate directly
    document.querySelectorAll(".project-card[data-project]").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        window.location.href = card.dataset.project;
      });
    });
  }

/* =========================
   NAV PAGE TRANSITIONS
========================== */
/*document.querySelectorAll('.tab-nav a.tab').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    e.preventDefault();
    document.body.style.transition = 'opacity 0.2s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = href;
    }, 200);
  });
});*


  /* =========================
     DRAG FUNCTIONALITY
  ========================== */

  const dragContainer = document.getElementById("dragContainer");

  if (dragContainer) {
    dragContainer.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("drag-item")) {
        e.target.classList.add("dragging");
      }
    });

    dragContainer.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("drag-item")) {
        e.target.classList.remove("dragging");
      }
    });

    dragContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(dragContainer, e.clientX);
      const dragging = document.querySelector(".dragging");
      if (!dragging) return;
      if (afterElement == null) {
        dragContainer.appendChild(dragging);
      } else {
        dragContainer.insertBefore(dragging, afterElement);
      }
    });

    dragContainer.addEventListener("drop", (e) => e.preventDefault());
  }

  function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll(".drag-item:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }


  /* =========================
     EXPANDABLE BIO TAGS!!
  ========================== */

  if (!document.getElementById('stickyStage')) {
    document.querySelectorAll('.bio-tag.expandable').forEach(tag => {
      tag.addEventListener('click', () => {
        const expanded = tag.dataset.expanded === 'true';
        tag.dataset.expanded = String(!expanded);
        tag.classList.toggle('expanded', !expanded);
      });
    });
  }

    /* =========================
     SCROLL EFFECTS!
  ========================== */

  function updateMesh() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
  
    document.documentElement.style.setProperty('--mesh-x', (30 + progress * 40) + '%');
    document.documentElement.style.setProperty('--mesh-y', (20 + progress * 60) + '%');
  
    const tiles = document.querySelector(".name-tiles");
    const bio   = document.querySelector(".bio-section");
    if (tiles) tiles.style.transform = `translateY(${scrollY * -0.05}px)`;
    if (bio)   bio.style.transform   = `translateY(${scrollY * -0.02}px)`;
  }


  /* =========================
     STACKED IMAGES FUNCTIONALITY
  ========================== */

  /*const stackedImages = document.getElementById('stackedImages');

  if (stackedImages) {
    const stackItems = stackedImages.querySelectorAll('.stack-item');

    stackItems.forEach((item) => {
      item.addEventListener('click', () => {
        const allItems = Array.from(stackItems);
        const clickedIndex = parseInt(item.getAttribute('data-index'));

        if (clickedIndex !== 0) {
          allItems.forEach(otherItem => {
            const otherIndex = parseInt(otherItem.getAttribute('data-index'));
            if (otherItem === item) {
              otherItem.setAttribute('data-index', '0');
            } else if (otherIndex < clickedIndex) {
              otherItem.setAttribute('data-index', String(otherIndex + 1));
            }
          });
          updateStackPositions();
        }
      });
    });

    function updateStackPositions() {
      stackedImages.querySelectorAll('.stack-item').forEach(item => {
        const index = parseInt(item.getAttribute('data-index'));
        const offset = index * 22;
        item.style.zIndex = 5 - index;
        item.style.transform = `translate(${offset}px, ${offset}px)`;
      });
    }
  }*/


  /* =========================
     LEADERSHIP DROPDOWN FUNCTIONALITY
  ========================== */

  const leadershipHeaders = document.querySelectorAll('.leadership-header');

  leadershipHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-leadership');
      const content  = document.getElementById(targetId);

      header.classList.toggle('active');
      content.classList.toggle('active');

      // Close other open dropdowns
      leadershipHeaders.forEach(otherHeader => {
        if (otherHeader !== header && otherHeader.classList.contains('active')) {
          otherHeader.classList.remove('active');
          const otherContent = document.getElementById(otherHeader.getAttribute('data-leadership'));
          otherContent.classList.remove('active');
        }
      });
    });
  });

});