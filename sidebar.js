// sidebar.js
// Scroll-spy for the lightbox sidebar navigation.

(function () {
  "use strict";

  const projectSidebars = {
    "tasktone.html": ["#overview", "#mission", "#painpoints", "#decisions", "#process", "#reflection"],
    "sasfui.html":   ["#overview", "#build",     "#specs",     "#tabs",      "#reflection"],
    "navi.html":     ["#overview", "#mission",  "#decisions",  "#solution",  "#process",  "#reflection"],
    "waddle.html":   ["#overview", "#mission",  "#solution",   "#process",   "#reflection"],
  };

  const overlay   = document.getElementById("lightbox-overlay");
  const lbIframe  = document.getElementById("lightbox-iframe");
  const lbSidebar = document.getElementById("lightbox-sidebar");

  if (!overlay || !lbIframe || !lbSidebar) return;

  function currentProject() {
    const src = lbIframe.src || "";
    return Object.keys(projectSidebars).find(f => src.includes(f)) || null;
  }

  function updateActiveSidebarLink() {
    let iWin, iDoc;
    try {
      iWin = lbIframe.contentWindow;
      iDoc = lbIframe.contentDocument || iWin.document;
    } catch (e) { return; }

    const project = currentProject();
    if (!project) return;

    const hashes   = projectSidebars[project];
    const sections = hashes.map(h => iDoc.querySelector(h)).filter(Boolean);
    const links    = Array.from(lbSidebar.querySelectorAll("a"));

    if (!sections.length || !links.length) return;

    // Use scrollY from inside the iframe's window, not getBoundingClientRect,
    // so it works even when the scroll container is the iframe's own window.
    const scrollY = iWin.scrollY || iWin.pageYOffset || iDoc.documentElement.scrollTop || 0;
    const trigger = scrollY + (iWin.innerHeight || 600) * 0.3;

    let activeIndex = 0;
    sections.forEach((sec, i) => {
      // offsetTop is relative to the document, not the viewport — reliable for scroll-spy
      if (sec.offsetTop <= trigger) {
        activeIndex = i;
      }
    });

    links.forEach((a, i) => a.classList.toggle("active", i === activeIndex));
  }

  function attachScrollListener() {
    let iWin, iDoc;
    try {
      iWin = lbIframe.contentWindow;
      iDoc = lbIframe.contentDocument || iWin.document;
    } catch (e) { return; }

    // Remove any old listeners by cloning — instead just use a named ref
    const scrollTargets = [
      iWin,
      iDoc.querySelector("main"),
      iDoc.querySelector("body"),
      iDoc.documentElement,
    ].filter(Boolean);

    scrollTargets.forEach(t => {
      t.addEventListener("scroll", updateActiveSidebarLink, { passive: true });
    });

    // Run immediately after attaching
    updateActiveSidebarLink();
  }

  function injectScrollbarStyles() {
    try {
      const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
      const existing = iDoc.getElementById("injected-scrollbar-styles");
      if (existing) existing.remove();

      const isDark = document.body.classList.contains("dark-mode");
      const thumbColor      = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";
      const thumbHoverColor = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)";

      const style = iDoc.createElement("style");
      style.id = "injected-scrollbar-styles";
      style.textContent = `
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${thumbColor}; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: ${thumbHoverColor}; }
        * { scrollbar-color: ${thumbColor} transparent; scrollbar-width: thin; }
      `;
      iDoc.head.appendChild(style);
    } catch (e) { /* cross-origin — cannot inject */ }
  }

  lbIframe.addEventListener("load", () => {
    injectScrollbarStyles();
    attachScrollListener();
  });

  // Reset when lightbox closes
  new MutationObserver(() => {
    if (!overlay.classList.contains("open")) {
      lbSidebar.querySelectorAll("a").forEach(a => a.classList.remove("active"));
    }
  }).observe(overlay, { attributes: true, attributeFilter: ["class"] });

  // Re-inject scrollbar styles when dark mode is toggled while lightbox is open
  new MutationObserver(() => {
    if (overlay.classList.contains("open")) {
      injectScrollbarStyles();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

})();