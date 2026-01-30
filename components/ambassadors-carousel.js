/**
 * Ambassadors Carousel Component
 * Full testimonial cards with video thumbnails, ratings, and quotes
 */

/* ================= STATE ================= */
let ambassadorsFullData = [];

/* ================= LOAD ================= */
async function loadAmbassadorsFullData() {
    try {
        const response = await fetch('./data/ambassadors.json');
        const data = await response.json();
        ambassadorsFullData = data.ambassadors;
        renderAmbassadorsCarousel();
    } catch (error) {
        console.error('Error loading ambassadors data:', error);
    }
}

/* ================= RENDER ================= */
function renderAmbassadorsCarousel() {
    const track = document.getElementById('ambassadors-track');
    if (!track) return;

    track.innerHTML = ambassadorsFullData.map(ambassador => `
        <div class="ambassador-card" data-ambassador="${ambassador.id}">
            <!-- Video Thumbnail -->
            <div class="ambassador-thumbnail">
                <img src="${ambassador.thumbnail}" alt="${ambassador.name} testimonial"
                     onerror="this.src='https://via.placeholder.com/300x400?text=${ambassador.name.charAt(0)}'">
                <button class="play-button" aria-label="Play video">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
            
            <!-- Content -->
            <div class="ambassador-content">
                <!-- Rating -->
                <div class="ambassador-rating">
                    ${Array(5).fill('').map((_, i) => `
                        <i class="fa-${i < ambassador.rating ? 'solid' : 'regular'} fa-star"></i>
                    `).join('')}
                </div>
                
                <!-- Quote -->
                <p class="ambassador-quote">"${ambassador.quote}"</p>
                
                <!-- Info -->
                <div class="ambassador-info">
                    <img src="${ambassador.avatar}" alt="${ambassador.name}" class="ambassador-avatar-img"
                         onerror="this.src='https://via.placeholder.com/40x40?text=${ambassador.name.charAt(0)}'">
                    <div class="ambassador-info-text">
                        <span class="ambassador-handle">${ambassador.handle}</span>
                        <span class="ambassador-followers">${ambassador.followers} followers</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    bindAmbassadorsCarouselEvents();
}

/* ================= EVENTS ================= */
function bindAmbassadorsCarouselEvents() {
    const track = document.getElementById('ambassadors-track');
    const prevBtn = document.getElementById('ambassadors-prev');
    const nextBtn = document.getElementById('ambassadors-next');

    if (!track) return;

    const scrollAmount = 340; // card width + gap

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
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadAmbassadorsFullData();
});
