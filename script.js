// Slideshow functionality - MOVED TO THE TOP
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dotNavigation = document.getElementById('dotNavigation');
    let currentSlideIndex = 0;
    
    // Create navigation dots
    function createDots() {
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            // Add click event to each dot
            dot.addEventListener('click', () => {
                showSlide(index);
            });
            
            dotNavigation.appendChild(dot);
        });
    }
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        document.querySelectorAll('.dot')[index].classList.add('active');
        
        currentSlideIndex = index;
    }
    
    // Initialize the slideshow
    createDots();
    showSlide(0);
    
    // Optional: Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        } else if (e.key === 'ArrowRight') {
            const nextIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(nextIndex);
        }
    });
});

// Cursor glow effect
//const cursorGlow = document.querySelector('.cursor-glow');
// document.addEventListener('mousemove', (e) => {
   // cursorGlow.style.left = e.clientX - 10 + 'px';
  //  cursorGlow.style.top = e.clientY - 10 + 'px';
// });

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const skillLevel = entry.target.getAttribute('data-skill');
                setTimeout(() => {
                    progressBar.style.width = skillLevel + '%';
                }, 300);
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.section, .skill-card, .project-card').forEach(el => {
    observer.observe(el);
});

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(45deg, #f093fb, #f5576c)';
            event.target.reset();
        }, 2000);
    }, 1500);
}

// Sparkle effects
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = 'white';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1001';
    sparkle.style.animation = 'sparkleAnim 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkles on click!!!!
document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createSparkle(
                e.clientX + (Math.random() - 0.5) * 20,
                e.clientY + (Math.random() - 0.5) * 20
            );
        }, i * 100);
    }

    // word scrolling thing
  

});