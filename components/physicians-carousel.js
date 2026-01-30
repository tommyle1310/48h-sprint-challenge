/**
 * Physicians Carousel Component
 * Handles horizontal scrolling carousel of physician testimonials
 */

/* ================= STATE ================= */
let physiciansData = [];

/* ================= LOAD ================= */
async function loadPhysiciansData() {
    try {
        const response = await fetch('./data/physicians.json');
        const data = await response.json();
        physiciansData = data.physicians;
        renderPhysiciansCarousel();
    } catch (error) {
        console.error('Error loading physicians data:', error);
    }
}

/* ================= RENDER ================= */
function renderPhysiciansCarousel() {
    const track = document.getElementById('physicians-track');
    if (!track) return;

    track.innerHTML = physiciansData.map(physician => `
        <div class="physician-card" data-physician="${physician.id}">
            <div class="video-thumbnail">
                <img src="${physician.thumbnail}" alt="${physician.name}" 
                     onerror="this.src='https://via.placeholder.com/200x280?text=${physician.name.charAt(0)}'">
                <button class="play-button" aria-label="Play video">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
            <div class="physician-info">
                <span class="physician-handle">${physician.handle}</span>
                <span class="physician-followers">${physician.followers} followers</span>
            </div>
        </div>
    `).join('');

    bindPhysiciansCarouselEvents();
}

/* ================= EVENTS ================= */
function bindPhysiciansCarouselEvents() {
    const track = document.getElementById('physicians-track');
    const prevBtn = document.getElementById('physicians-prev');
    const nextBtn = document.getElementById('physicians-next');

    if (!track) return;

    const scrollAmount = 240; // card width + gap

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
    loadPhysiciansData();
});
