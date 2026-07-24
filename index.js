/* ════════════════════════════════════════════════════════════════
   index.js  —  Waverly Huang · Index page only
   Project lightbox, arrow navigation, mobile nav modal
   ════════════════════════════════════════════════════════════════ */

   document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
  
    const projectSidebars = {
      'https://fountainhead.site/': [],
      'tasktone.html': [
        { label: 'Overview',   href: '#overview'   },
        { label: 'Mission',    href: '#mission'    },
        { label: 'Pain Points',href: '#painpoints' },
        { label: 'Decisions',  href: '#decisions'  },
        { label: 'Form Process',href: '#process'   },
        { label: 'Reflection', href: '#reflection' },
      ],
      'sasfds.html': [
        { label: 'Overview',   href: '#overview'   },
        { label: 'Scope',      href: '#scope'      },
        { label: 'Research',   href: '#research'   },
        { label: 'Expo',       href: '#expo'       },
        { label: 'Reflection', href: '#reflection' },
      ],
      'sasfui.html': [
        { label: 'Overview',   href: '#overview'   },
        { label: 'Build',      href: '#build'      },
        { label: 'Specs',      href: '#specs'      },
        { label: 'Tabs',       href: '#tabs'       },
        { label: 'Reflection', href: '#reflection' },
      ],
      'navi.html': [
        { label: 'Overview',   href: '#overview'   },
        { label: 'Mission',    href: '#mission'    },
        { label: 'Decisions',  href: '#decisions'  },
        { label: 'Solution',   href: '#solution'   },
        { label: 'Process',    href: '#process'    },
        { label: 'Reflection', href: '#reflection' },
      ],
      'biome.html': [
        { label: 'Overview',   href: '#overview'   },
        { label: 'Mission',    href: '#mission'    },
        { label: 'Solution',   href: '#solution'   },
        { label: 'Use Cases',  href: '#usecases'   },
        { label: 'Process',    href: '#process'    },
        { label: 'Reflection', href: '#reflection' },
      ]
    };
  
    const projectOrder = Object.keys(projectSidebars);
    let currentProjectIndex = 0;
  
    const overlay          = document.getElementById('lightbox-overlay');
    const lbClose          = document.getElementById('lightbox-close');
    const lbSidebar        = document.getElementById('lightbox-sidebar');
    const lbIframe         = document.getElementById('lightbox-iframe');
    const lbLoading        = document.getElementById('lightbox-loading');
    const lbPrev           = document.getElementById('lightboxPrev');
    const lbNext           = document.getElementById('lightboxNext');
    const lbMobileNavBtn   = document.getElementById('lightbox-mobile-nav-btn');
    const lbMobileNavModal = document.getElementById('lightbox-mobile-nav-modal');
    const lbMobileNavLinks = document.getElementById('lightbox-mobile-nav-links');
    const lbMobileNavClose = document.getElementById('lightbox-mobile-nav-close');
  
    if (!overlay || !lbIframe) return;
  
    /* ── Sidebar links (desktop + mobile) ── */
    function buildSidebarLinks(projectFile) {
      const links = projectSidebars[projectFile] || [];
      lbSidebar.innerHTML = '';
      if (lbMobileNavLinks) lbMobileNavLinks.innerHTML = '';
  
      links.forEach((item, i) => {
        // Desktop
        const a = document.createElement('a');
        a.textContent = item.label;
        a.href = 'javascript:void(0)';
        if (i === 0) a.classList.add('active');
        a.addEventListener('click', () => {
          jumpToSection(item.href);
          setActive(i);
        });
        lbSidebar.appendChild(a);
  
        // Mobile
        if (lbMobileNavLinks) {
          const mobileA = document.createElement('a');
          mobileA.textContent = item.label;
          mobileA.href = 'javascript:void(0)';
          if (i === 0) mobileA.classList.add('active');
          mobileA.addEventListener('click', () => {
            jumpToSection(item.href);
            setActive(i);
            closeMobileNavModal();
          });
          lbMobileNavLinks.appendChild(mobileA);
        }
      });
  
      if (lbMobileNavBtn) {
        lbMobileNavBtn.style.display = links.length > 0 ? '' : 'none';
      }
    }
  
    function jumpToSection(href) {
      try {
        const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
        const target = iDoc.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {
        try { lbIframe.contentWindow.location.hash = href.slice(1); } catch (_) {}
      }
    }
  
    function setActive(index) {
      lbSidebar.querySelectorAll('a').forEach((l, i) => l.classList.toggle('active', i === index));
      if (lbMobileNavLinks) {
        lbMobileNavLinks.querySelectorAll('a').forEach((l, i) => l.classList.toggle('active', i === index));
      }
    }
  
    /* ── Mobile nav modal ── */
    function openMobileNavModal()  { if (lbMobileNavModal) lbMobileNavModal.classList.add('open');    }
    function closeMobileNavModal() { if (lbMobileNavModal) lbMobileNavModal.classList.remove('open'); }
  
    if (lbMobileNavBtn)   lbMobileNavBtn.addEventListener('click',  (e) => { e.stopPropagation(); openMobileNavModal(); });
    if (lbMobileNavClose) lbMobileNavClose.addEventListener('click', closeMobileNavModal);
    if (lbMobileNavModal) lbMobileNavModal.addEventListener('click', (e) => { if (e.target === lbMobileNavModal) closeMobileNavModal(); });
  
    /* ── Open / close lightbox ── */
    function openProjectLightbox(projectFile, animate = false) {
      buildSidebarLinks(projectFile);
      closeMobileNavModal();
  
      const lbWindow = document.getElementById('lightbox-window');
      let dissolve = document.getElementById('lightbox-dissolve');
      if (!dissolve) {
        dissolve = document.createElement('div');
        dissolve.id = 'lightbox-dissolve';
        dissolve.style.cssText = `
          position: absolute; inset: 0; z-index: 15;
          pointer-events: none; opacity: 0;
          transition: opacity 0.18s ease; border-radius: 20px;
        `;
        lbWindow.appendChild(dissolve);
      }
  
      // Mobile card stack click-to-front
      const stackItems = document.querySelectorAll('.stacked-images .stack-item');
      stackItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth > 600) return;
          stackItems.forEach(i => i.classList.remove('stack-active'));
          item.classList.add('stack-active');
        });
      });
  
      const isDark = body.classList.contains('dark-mode');
      dissolve.style.background = isDark ? '#1e1e1e' : '#e8e8e8';
      if (lbLoading) lbLoading.style.background = isDark ? '#1e1e1e' : '#fff';
  
      const doLoad = () => {
        lbLoading.classList.remove('hidden');
        lbIframe.src = '';
        overlay.classList.add('open');
        body.style.overflow = 'hidden';
  
        lbIframe.onload = () => {
          lbLoading.classList.add('hidden');
          try {
            const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
            ['header', 'footer', '.side-nav', 'nav.side-nav'].forEach(sel => {
              iDoc.querySelectorAll(sel).forEach(el => el.style.display = 'none');
            });
            const mainEl = iDoc.querySelector('main');
            if (mainEl) mainEl.style.paddingTop = '48px';
  
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
  
          dissolve.style.opacity = '0';
          // NOTE: Scroll-spy handled by sidebar.js
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
      if (lbMobileNavLinks) lbMobileNavLinks.innerHTML = '';
      closeMobileNavModal();
    }
  
    function goToProject(direction) {
      currentProjectIndex = (currentProjectIndex + direction + projectOrder.length) % projectOrder.length;
      openProjectLightbox(projectOrder[currentProjectIndex], true);
    }
  
    /* ── Wire up controls ── */
    if (lbPrev) lbPrev.addEventListener('click', () => goToProject(-1));
    if (lbNext) lbNext.addEventListener('click', () => goToProject(1));
    if (lbClose) lbClose.addEventListener('click', closeProjectLightbox);
  
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProjectLightbox();
    });
  
    document.querySelectorAll('.project-card[data-project]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const file = card.dataset.project;
        const idx = projectOrder.indexOf(file);
        if (idx !== -1) currentProjectIndex = idx;
        openProjectLightbox(file);
      });
    });
  
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') {
        if (lbMobileNavModal && lbMobileNavModal.classList.contains('open')) closeMobileNavModal();
        else closeProjectLightbox();
      } else if (e.key === 'ArrowRight') {
        goToProject(1);
      } else if (e.key === 'ArrowLeft') {
        goToProject(-1);
      }
    });
  
    /* ── Scroll reveal for project cards ── */
const revealTargets = document.querySelectorAll('.project-card, .section-label');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    // Above the fold — use CSS keyframe load animation
    el.classList.add('load-reveal');
  } else {
    // Below the fold — use existing scroll observer
    revealObserver.observe(el);
  }
});
  });