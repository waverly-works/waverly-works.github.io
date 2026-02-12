document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       DARK MODE TOGGLE
    ========================== */
  
    const modeToggle = document.getElementById("modeToggle");
    const body = document.body;
  
    // Load saved preference
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
    }
  
    if (modeToggle) {
      modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
  
        localStorage.setItem(
          "theme",
          body.classList.contains("dark-mode") ? "dark" : "light"
        );
      });
    }
  
    /* =========================
       SMOOTH SCROLL
    ========================== */
  
    const scrollDown = document.getElementById("scrollDown");
  
    if (scrollDown) {
      scrollDown.addEventListener("click", () => {
        const projects = document.getElementById("projects");
        if (projects) {
          projects.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  
    /* =========================
       PROJECT CARD NAVIGATION
    ========================== */
  
    const projectCards = document.querySelectorAll(".project-card[data-project]");
  
    projectCards.forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return; // prevent double nav
        const url = card.getAttribute("data-project");
        if (url) {
          window.location.href = url;
        }
      });
    });
  
    /* =========================
       DRAG FUNCTIONALITY
    ========================== */
  
    const container = document.getElementById("dragContainer");
    let draggedElement = null;
  
    if (container) {
  
      container.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("drag-item")) {
          draggedElement = e.target;
          e.target.classList.add("dragging");
        }
      });
  
      container.addEventListener("dragend", (e) => {
        if (e.target.classList.contains("drag-item")) {
          e.target.classList.remove("dragging");
        }
      });
  
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientX);
        const dragging = document.querySelector(".dragging");
  
        if (!dragging) return;
  
        if (afterElement == null) {
          container.appendChild(dragging);
        } else {
          container.insertBefore(dragging, afterElement);
        }
      });
  
      container.addEventListener("drop", (e) => {
        e.preventDefault();
      });
    }
  
    function getDragAfterElement(container, x) {
      const draggableElements = [
        ...container.querySelectorAll(".drag-item:not(.dragging)")
      ];
  
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
  
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  
  });
  