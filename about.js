// Smooth continuous slideshow - scrolls forward then reverses back
const slidesContainer = document.querySelector('.slides-container');
const slides = document.querySelectorAll('.slide');

if (slidesContainer && slides.length > 0) {
    let position = 0;
    let direction = 1; // 1 = forward, -1 = backward
    const speed = 1.2; // pixels per frame (adjust for speed)
    
    function animateSlideshow() {
        const slideWidth = slides[0].offsetWidth + 10; // Include margin
        const totalSlides = slides.length;
        const maxPosition = slideWidth * (totalSlides - 1);
        
        // Move in current direction
        position += speed * direction;
        
        // Reverse direction at the ends
        if (position >= maxPosition) {
            position = maxPosition;
            direction = -1; // Start going backward
        } else if (position <= 0) {
            position = 0;
            direction = 1; // Start going forward
        }
        
        slidesContainer.style.transform = `translateX(-${position}px)`;
        slidesContainer.style.transition = 'none';
        
        requestAnimationFrame(animateSlideshow);
    }
    
    // Wait for images to load
    const allImages = slidesContainer.querySelectorAll('img');
    let loadedImages = 0;
    
    function checkAllLoaded() {
        loadedImages++;
        if (loadedImages >= allImages.length) {
            setTimeout(() => {
                requestAnimationFrame(animateSlideshow);
            }, 150);
        }
    }
    
    allImages.forEach(img => {
        if (img.complete) {
            checkAllLoaded();
        } else {
            img.addEventListener('load', checkAllLoaded);
            img.addEventListener('error', checkAllLoaded);
        }
    });
}

// ===== EXISTING CODE BELOW =====

// a single, comprehensive initialization function
function initializePage() {
    // all images and resources are loaded before starting animations
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve); // Handle broken images gracefully
        });
    });

    // wait 4 all images to load, then initialize everything
    Promise.all(imagePromises).then(() => {
        console.log('All resources loaded, initializing carousel');
        
        // force a reflow to ensure CSS animations start properly
        const slideshow = document.querySelector('.slideshow-container, .carousel-container, [class*="slide"]');
        if (slideshow) {
            slideshow.offsetHeight; // Force reflow
            slideshow.style.opacity = '1'; // Ensure visibility
        }
        
        // initialize skills animation after a small delay to prevent conflicts
        setTimeout(animateSkills, 100);
    });
}

// skill progress animation 
function animateSkills() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        const progress = card.querySelector('.skill-progress');
        const skillLevel = card.getAttribute('data-skill');
        
        if (progress && skillLevel) {
            // Reset progress bar first
            progress.style.transition = 'none';
            progress.style.width = '0%';
            
            // reflow and then animate
            progress.offsetHeight;
            
            // staggering animations slightly 4 better visual effect
            setTimeout(() => {
                progress.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                progress.style.width = skillLevel + '%';
            }, 200 + (index * 100));
        }
    });
}

// optimized navbar scroll effect w throttling
let isScrolling = false;
function handleNavbarScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
}

// scroll listener with throttling
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// comprehensive page initialization
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializePage);
} else if (document.readyState === 'interactive') {
    // DOM is loaded but resources might still be loading
    if (document.images.length > 0) {
        initializePage();
    } else {
        // No images, safe to initialize immediately
        setTimeout(initializePage, 50);
    }
} else {
    // Everything is already loaded
    initializePage();
}