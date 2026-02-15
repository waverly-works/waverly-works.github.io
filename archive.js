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


// Lightbox functionality with navigation
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryImages = document.querySelectorAll('.gallery-item-horizontal img, .gallery-item-vertical img');

let currentImageIndex = 0;
const imageArray = Array.from(galleryImages);

// Open lightbox when clicking on any gallery image
galleryImages.forEach((img, index) => {
    img.addEventListener('click', (e) => {
        e.preventDefault();
        currentImageIndex = index;
        showImage(currentImageIndex);
        lightbox.classList.add('active');
        body.style.overflow = 'hidden';
    });
});

// Show image at specific index
function showImage(index) {
    if (index >= 0 && index < imageArray.length) {
        lightboxImg.src = imageArray[index].src;
        currentImageIndex = index;
    }
}

// Navigate to previous image
function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
    showImage(currentImageIndex);
}

// Navigate to next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imageArray.length;
    showImage(currentImageIndex);
}

// Click handlers for navigation buttons
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

// Close lightbox with close button
if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        closeLightbox();
    });
}
 
// Close lightbox when clicking outside the image
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    body.style.overflow = 'auto';
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);
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
