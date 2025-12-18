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
if (scrollDown) {
    scrollDown.addEventListener('click', () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Project navigation
document.querySelectorAll('.project-section').forEach(section => {
    section.addEventListener('click', () => {
        const projectPage = section.getAttribute('data-project');
        if (projectPage) {
            navigateWithTransition(projectPage);
        }
    });
});


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