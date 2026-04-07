document.addEventListener('DOMContentLoaded', () => {

    /* ── Stacked images: stagger in after bio finishes ── */
    const stackItems = document.querySelectorAll('.stack-item');
    const BIO_DURATION = 1000;

    stackItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('revealed');
        }, BIO_DURATION + index * 100);
    });

    /* ── Bottom section: reveal after images finish ── */
    const bottomSection = document.querySelector('.bottom-section');
    if (bottomSection) {
        setTimeout(() => {
            bottomSection.classList.add('revealed');
        }, 1800);
    }

});