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
       GALLERY FILTER
    ========================== */

    const filterBar = document.getElementById("filterBar");

    if (filterBar) {
      const pills = filterBar.querySelectorAll(".filter-pill");

      pills.forEach(pill => {
        pill.addEventListener("click", () => {
          // Update active pill
          pills.forEach(p => p.classList.remove("active"));
          pill.classList.add("active");

          const filter = pill.getAttribute("data-filter");

          // Show/hide gallery items
          const allItems = document.querySelectorAll(
            ".gallery-item-horizontal, .gallery-item-vertical"
          );

          allItems.forEach(item => {
            const category = item.getAttribute("data-category") || "";
            if (filter === "all" || category === filter) {
              item.classList.remove("hidden");
            } else {
              item.classList.add("hidden");
            }
          });

          // Hide rows where all children are hidden
          const rows = document.querySelectorAll(".gallery-row");
          rows.forEach(row => {
            const visibleItems = row.querySelectorAll(
              ".gallery-item-horizontal:not(.hidden), .gallery-item-vertical:not(.hidden)"
            );
            if (visibleItems.length === 0) {
              row.classList.add("row-empty");
            } else {
              row.classList.remove("row-empty");
            }
          });
        });
      });
    }

    /* =========================
       LIGHTBOX FUNCTIONALITY WITH NAVIGATION
    ========================== */
  
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (lightbox) {
      let currentImageIndex = 0;

      // Build visible image array at click time so filtered-out images are excluded
      function getVisibleImages() {
        return Array.from(document.querySelectorAll(
          '.gallery-item-horizontal:not(.hidden) img, .gallery-item-vertical:not(.hidden) img'
        ));
      }

      // Open lightbox when clicking on any gallery image
      document.querySelectorAll('.gallery-item-horizontal img, .gallery-item-vertical img')
        .forEach(img => {
          img.addEventListener('click', (e) => {
            e.preventDefault();
            const visibleImages = getVisibleImages();
            currentImageIndex = visibleImages.indexOf(img);
            if (currentImageIndex === -1) currentImageIndex = 0;
            showImage(currentImageIndex, visibleImages);
            lightbox.classList.add('active');
            body.style.overflow = 'hidden';
          });
        });

      function showImage(index, imageArray) {
        imageArray = imageArray || getVisibleImages();
        if (index >= 0 && index < imageArray.length) {
          lightboxImg.src = imageArray[index].src;
          currentImageIndex = index;
        }
      }

      function showPreviousImage() {
        const imageArray = getVisibleImages();
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        showImage(currentImageIndex, imageArray);
      }

      function showNextImage() {
        const imageArray = getVisibleImages();
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        showImage(currentImageIndex, imageArray);
      }

      if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
          e.stopPropagation();
          showPreviousImage();
        });
      }

      if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
          e.stopPropagation();
          showNextImage();
        });
      }

      if (lightboxClose) {
        lightboxClose.addEventListener('click', () => closeLightbox());
      }
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
          if (e.key === 'Escape')       closeLightbox();
          else if (e.key === 'ArrowLeft')  showPreviousImage();
          else if (e.key === 'ArrowRight') showNextImage();
        }
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
        body.style.overflow = 'auto';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
      }
    }
  
    /* =========================
       ARCHIVE PAGE SCROLL EFFECTS
    ========================== */
  
    const archiveHeader = document.getElementById('archiveHeader');
    const allImages = document.querySelectorAll('.gallery-item-horizontal img, .gallery-item-vertical img');
  
    if (archiveHeader && allImages.length > 0) {
      function handleScroll() {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 200;
        
        if (scrollPosition > scrollThreshold) {
          archiveHeader.classList.add('hidden');
        } else {
          archiveHeader.classList.remove('hidden');
        }
        
        if (scrollPosition > scrollThreshold) {
          allImages.forEach(img => img.classList.add('color'));
        } else {
          allImages.forEach(img => img.classList.remove('color'));
        }
      }

      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }
  
    /* =========================
       PROJECT CARD NAVIGATION
    ========================== */
  
    const projectCards = document.querySelectorAll(".project-card[data-project]");
  
    projectCards.forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        const url = card.getAttribute("data-project");
        if (url) window.location.href = url;
      });
    });

    /* =========================
       LEADERSHIP DROPDOWN FUNCTIONALITY
    ========================== */
  
    const leadershipHeaders = document.querySelectorAll('.leadership-header');
  
    leadershipHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-leadership');
        const content = document.getElementById(targetId);
        
        header.classList.toggle('active');
        content.classList.toggle('active');
        
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