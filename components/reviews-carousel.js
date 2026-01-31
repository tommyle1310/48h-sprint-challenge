/**
 * Reviews Carousel Component
 * Infinite marquee scrolling reviews carousel
 */

/* ================= STATE ================= */
let reviewsData = [];

/* ================= LOAD ================= */
async function loadReviewsData() {
    try {
        const response = await fetch('./data/im8-reviews.json');
        reviewsData = await response.json();
        renderReviewsCarousel();
    } catch (error) {
        console.error('Error loading reviews data:', error);
    }
}

/* ================= RENDER ================= */
function renderReviewsCarousel() {
    const track = document.getElementById('reviews-track');
    if (!track) return;

    // Create the review card HTML
    const createReviewCard = (review) => `
        <div class="review-card">
            <!-- Star Rating -->
            <div class="review-stars">
                ${Array(5).fill('').map((_, i) => `
                    <i class="fa-solid fa-star"></i>
                `).join('')}
            </div>
            
            <!-- Review Content -->
            <p class="review-content leading-[1.4]">
                "${review.content}"
            </p>
            
            <!-- Author Info -->
            <p class="review-author">
                — ${review.author}${review.isVerified ? ', Verified Customer' : ''}
            </p>
        </div>
    `;

    // Double the reviews for seamless infinite scroll
    const reviewsHTML = reviewsData.map(createReviewCard).join('');
    
    track.innerHTML = `
        <div class="marquee-content">
            ${reviewsHTML}
        </div>
        <div class="marquee-content" aria-hidden="true">
            ${reviewsHTML}
        </div>
    `;

    // Start the marquee animation
    startMarqueeAnimation(track);
}

/* ================= EVENTS ================= */
function startMarqueeAnimation(track) {
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });

    // Pause on touch for mobile
    track.addEventListener('touchstart', () => {
        track.style.animationPlayState = 'paused';
    }, { passive: true });

    track.addEventListener('touchend', () => {
        track.style.animationPlayState = 'running';
    }, { passive: true });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadReviewsData();
});
