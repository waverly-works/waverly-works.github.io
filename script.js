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

  window.addEventListener('scroll', updateMesh, { passive: true });


  /* =========================
     DRAG FUNCTIONALITY
  ========================== */

  const dragContainer = document.getElementById("dragContainer");

  if (dragContainer) {
    dragContainer.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("drag-item")) e.target.classList.add("dragging");
    });
    dragContainer.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("drag-item")) e.target.classList.remove("dragging");
    });
    dragContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(dragContainer, e.clientX);
      const dragging = document.querySelector(".dragging");
      if (!dragging) return;
      if (afterElement == null) dragContainer.appendChild(dragging);
      else dragContainer.insertBefore(dragging, afterElement);
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
     LEADERSHIP DROPDOWN FUNCTIONALITY
  ========================== */

  const leadershipHeaders = document.querySelectorAll('.leadership-header');

  leadershipHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-leadership');
      const content  = document.getElementById(targetId);

      header.classList.toggle('active');
      content.classList.toggle('active');

      leadershipHeaders.forEach(otherHeader => {
        if (otherHeader !== header && otherHeader.classList.contains('active')) {
          otherHeader.classList.remove('active');
          const otherContent = document.getElementById(otherHeader.getAttribute('data-leadership'));
          otherContent.classList.remove('active');
        }
      });
    });
  });

  /* =========================
     FALLBACK: non-index project card navigation
     (only runs if #lightbox-overlay is absent, i.e. not index.html)
  ========================== */

  if (!document.getElementById('lightbox-overlay')) {
    document.querySelectorAll(".project-card[data-project]").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        window.location.href = card.dataset.project;
      });
    });
  }

});