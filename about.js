// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // The slideshow is now handled by CSS animation
    // No JavaScript needed for the carousel functionality
    console.log('Carousel is running with CSS animation');
});

// Skill progress animation
function animateSkills() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const progress = card.querySelector('.skill-progress');
        const skillLevel = card.getAttribute('data-skill');
        setTimeout(() => {
            progress.style.width = skillLevel + '%';
        }, 500);
    });
}

// Trigger skill animation when page loads
window.addEventListener('load', animateSkills);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});