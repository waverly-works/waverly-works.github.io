  // Dark mode toggle with single icon
  const modeToggle = document.getElementById('modeToggle');
  const body = document.body;

  // Check for saved theme preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
  }

  // Toggle theme
  modeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      
      // Save preference
      if (body.classList.contains('dark-mode')) {
          localStorage.setItem('theme', 'dark');
      } else {
          localStorage.setItem('theme', 'light');
      }
  });

  // Scroll indicator
  const scrollDown = document.getElementById('scrollDown');
  scrollDown.addEventListener('click', () => {
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  });

  // Project navigation
  document.querySelectorAll('.project-section').forEach(section => {
      section.addEventListener('click', () => {
          const projectPage = section.getAttribute('data-project');
          if (projectPage) {
              window.location.href = projectPage;
          }
      });
  });
// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Smooth scroll for the scroll indicator
const scrollIndicator = document.getElementById('scrollDown');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Project section click handlers
const projectSections = document.querySelectorAll('.project-section');
projectSections.forEach(section => {
    section.addEventListener('click', (e) => {
        const projectUrl = section.getAttribute('data-project');
        if (projectUrl) {
            navigateWithTransition(projectUrl);
        }
    });
});

// Page transition function
function navigateWithTransition(url) {
    const transition = document.querySelector('.page-transition');
    if (transition) {
        transition.classList.add('active');
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    } else {
        window.location.href = url;
    }
}

// Handle navigation links with transition
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Allow # links to work normally
            if (!href || href === '#') {
                return;
            }
            
            // Allow external links to work normally
            if (href.startsWith('http')) {
                return;
            }
            
            // Apply transition to internal links
            e.preventDefault();
            navigateWithTransition(href);
        });
    });
});

// Fade in page on load
window.addEventListener('load', () => {
    const transition = document.querySelector('.page-transition');
    if (transition) {
        transition.classList.add('active');
        setTimeout(() => {
            transition.classList.remove('active');
        }, 100);
    }
});

 const container = document.getElementById('dragContainer');
        let draggedElement = null;

        container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('drag-item')) {
                draggedElement = e.target;
                e.target.classList.add('dragging');
            }
        });

        container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('drag-item')) {
                e.target.classList.remove('dragging');
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientX);
            const dragging = document.querySelector('.dragging');
            
            if (afterElement == null) {
                container.appendChild(dragging);
            } else {
                container.insertBefore(dragging, afterElement);
            }
        });

        container.addEventListener('dragenter', (e) => {
            if (e.target.classList.contains('drag-item') && e.target !== draggedElement) {
                e.target.classList.add('drag-over');
            }
        });

        container.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('drag-item')) {
                e.target.classList.remove('drag-over');
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const items = container.querySelectorAll('.drag-item');
            items.forEach(item => item.classList.remove('drag-over'));
        });

        function getDragAfterElement(container, x) {
            const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];

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