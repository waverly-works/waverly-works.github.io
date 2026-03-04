// sidebar.js
// Scroll-spy for the lightbox sidebar navigation.
// Uses getBoundingClientRect() so it works regardless of which element
// is actually scrolling inside the iframe (window vs <main>).

(function () {
  "use strict";

  const projectSidebars = {
    "tasktone.html": ["#overview", "#features", "#empathize", "#prototype", "#evolution", "#reflection"],
    "sasfui.html":   ["#overview", "#build",     "#specs",     "#tabs",      "#reflection"],
    "navi.html":     ["#overview", "#features",  "#pain-points",   "#chatbot",  "#wireframes", "#reflection"],
    "waddle.html":   ["#overview", "#features",  "#pain-points",   "#wireframes",   "#reflection"],
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
    let iDoc;
    try {
      iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
    } catch (e) { return; }

    const project = currentProject();
    if (!project) return;

    const hashes   = projectSidebars[project];
    const sections = hashes.map(h => iDoc.querySelector(h)).filter(Boolean);
    const links    = Array.from(lbSidebar.querySelectorAll("a"));

    if (!sections.length || !links.length) return;

    // getBoundingClientRect() is relative to the iframe's own viewport,
    // so it correctly reflects whichever element is scrolling.
    // A section is "active" once its top edge has passed 30% down the viewport.
    const iframeHeight = lbIframe.clientHeight || 800;
    const threshold = iframeHeight * 0.3;

    let activeIndex = 0;
    sections.forEach((sec, i) => {
      if (sec.getBoundingClientRect().top <= threshold) {
        activeIndex = i;
      }
    });

    links.forEach((a, i) => a.classList.toggle("active", i === activeIndex));
  }

  function injectScrollbarStyles() {
    try {
      const iDoc = lbIframe.contentDocument || lbIframe.contentWindow.document;
      // Remove any previously injected styles (e.g. on re-open)
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
    try {
      const iWin = lbIframe.contentWindow;
      const iDoc = lbIframe.contentDocument || iWin.document;

      // Inject scrollbar styles matched to current light/dark mode
      injectScrollbarStyles();

      // Attach to every plausible scroll container
      const scrollTargets = [
        iWin,
        iDoc.querySelector("main"),
        iDoc.querySelector("body"),
        iDoc.documentElement,
      ].filter(Boolean);

      scrollTargets.forEach(t =>
        t.addEventListener("scroll", updateActiveSidebarLink, { passive: true })
      );

      // Set first link active immediately on open
      updateActiveSidebarLink();
    } catch (e) { /* cross-origin */ }
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