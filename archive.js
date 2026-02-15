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
     STACKED IMAGES FUNCTIONALITY
  ========================== */

  const stackedImages = document.getElementById('stackedImages');
  if (stackedImages) {
      const stackItems = stackedImages.querySelectorAll('.stack-item');
      
      stackItems.forEach((item, index) => {
          item.addEventListener('click', () => {
              // Get all items and their current indices
              const allItems = Array.from(stackItems);
              const clickedIndex = parseInt(item.getAttribute('data-index'));
              
              // Only bring to front if it's not already at front
              if (clickedIndex !== 0) {
                  // Reorder z-indices
                  allItems.forEach(otherItem => {
                      const otherIndex = parseInt(otherItem.getAttribute('data-index'));
                      
                      if (otherItem === item) {
                          // Clicked item goes to front
                          otherItem.setAttribute('data-index', '0');
                      } else if (otherIndex < clickedIndex) {
                          // Items that were in front move back one position
                          otherItem.setAttribute('data-index', String(otherIndex + 1));
                      }
                      // Items behind stay in same relative position
                  });
                  
                  // Update transforms and z-indices based on new data-index
                  updateStackPositions();
              }
          });
      });
      
      function updateStackPositions() {
        stackItems.forEach(item => {
            const index = parseInt(item.getAttribute('data-index'));
            const offset = index * 22;  // ← Change this to match your CSS offset
            
            item.style.zIndex = 5 - index;
            item.style.transform = `translate(${offset}px, ${offset}px)`;
        });
    }
  }

  /* =========================
     LEADERSHIP DROPDOWN FUNCTIONALITY
  ========================== */

  const leadershipHeaders = document.querySelectorAll('.leadership-header');

  leadershipHeaders.forEach(header => {
      header.addEventListener('click', () => {
          const targetId = header.getAttribute('data-leadership');
          const content = document.getElementById(targetId);
          
          // Toggle active class on header
          header.classList.toggle('active');
          
          // Toggle active class on content
          content.classList.toggle('active');
          
          // Close other dropdowns (optional - remove if you want multiple open at once)
          leadershipHeaders.forEach(otherHeader => {
              if (otherHeader !== header && otherHeader.classList.contains('active')) {
                  otherHeader.classList.remove('active');
                  const otherId = otherHeader.getAttribute('data-leadership');
                  const otherContent = document.getElementById(otherId);
                  otherContent.classList.remove('active');
              }
          });
      });
  });

});