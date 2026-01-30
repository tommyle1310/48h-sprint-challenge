/**
 * Reviews Carousel Component
 * Handles horizontal scrolling reviews carousel
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

    track.innerHTML = reviewsData.map(review => `
        <div class="review-card">
            <!-- Star Rating -->
            <div class="flex text-brand-burgundy mb-3">
                ${Array(5).fill('').map((_, i) => `
                    <i class="fa-${i < review.rating ? 'solid' : 'regular'} fa-star text-sm"></i>
                `).join('')}
            </div>
            
            <!-- Review Content -->
            <p class="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                "${review.content}"
            </p>
            
            <!-- Author Info -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div class="flex items-center gap-2">
                    <!-- Avatar -->
                    <div class="w-8 h-8 rounded-full bg-brand-burgundy text-white flex items-center justify-center text-sm font-semibold">
                        ${review.avatarInitial}
                    </div>
                    <div>
                        <p class="text-sm font-semibold">${review.author}</p>
                        <p class="text-xs text-gray-500">${review.date}</p>
                    </div>
                </div>
                
                <!-- Verified Badge -->
                ${review.isVerified ? `
                    <span class="verified-badge">
                        <i class="fa-solid fa-circle-check"></i>
                        Verified
                    </span>
                ` : ''}
            </div>
        </div>
    `).join('');

    bindCarouselEvents();
}

/* ================= EVENTS ================= */
function bindCarouselEvents() {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (!track) return;

    const scrollAmount = 370; // card width + gap

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // Update button visibility based on scroll position
    track.addEventListener('scroll', () => {
        const isAtStart = track.scrollLeft <= 0;
        const isAtEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10;

        if (prevBtn) {
            prevBtn.style.opacity = isAtStart ? '0.5' : '1';
            prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        }

        if (nextBtn) {
            nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
            nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }
    });

    // Trigger initial scroll check
    track.dispatchEvent(new Event('scroll'));
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadReviewsData();
});
