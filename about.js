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

// CSS Animation health check and restart if needed
function ensureSlideshow() {
    const slideshowElement = document.querySelector('.slideshow-container, .carousel-container, [class*="slide"]');
    if (slideshowElement) {
        // check if animation is running by looking for animation properties
        const computedStyle = window.getComputedStyle(slideshowElement);
        const animationName = computedStyle.animationName;
        
        // if no animation is detected, try to restart it
        if (!animationName || animationName === 'none') {
            console.log('Restarting slideshow animation');
            slideshowElement.style.animation = 'none';
            slideshowElement.offsetHeight; // Force reflow
            slideshowElement.style.animation = ''; // Reset to CSS value
        }
    }
}

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

// scroll listener with throttling
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// periodic slideshow health check (optional - remove if not needed)
setInterval(ensureSlideshow, 10000); // Check every 10 seconds

// page visibility changes to restart animations if needed
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(ensureSlideshow, 500);
    }
});

// window resize to ensure animations continue working
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ensureSlideshow();
    }, 250);
});
