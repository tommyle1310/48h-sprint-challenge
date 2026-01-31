/**
 * Ambassadors Carousel Component
 * Infinite marquee scrolling with testimonial cards featuring video thumbnails
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

    // Create the ambassador card HTML matching the design
    const createAmbassadorCard = (ambassador) => `
        <div class="ambassador-card" data-ambassador="${ambassador.id}">
            <!-- Header with handle and followers -->
            <div class="ambassador-header">
                <span class="ambassador-handle">${ambassador.handle}</span>
                <span class="ambassador-followers">(${ambassador.followers})</span>
            </div>
            
            <!-- Video/Image Thumbnail -->
            <div class="ambassador-thumbnail">
                <img src="${ambassador.thumbnail}" alt="${ambassador.name} testimonial"
                     onerror="this.src='https://via.placeholder.com/300x400?text=${ambassador.name.charAt(0)}'">
            </div>
            
            <!-- Content Section -->
            <div class="ambassador-content">
                <!-- Rating -->
                <div class="ambassador-rating">
                    ${Array(5).fill('').map(() => `
                        <i class="fa-solid fa-star"></i>
                    `).join('')}
                </div>
                
                <!-- Quote -->
                <p class="ambassador-quote">${ambassador.quote}</p>
            </div>
        </div>
    `;

    // Double the ambassadors for seamless infinite scroll
    const ambassadorsHTML = ambassadorsFullData.map(createAmbassadorCard).join('');
    
    track.innerHTML = `
        <div class="marquee-content">
            ${ambassadorsHTML}
        </div>
        <div class="marquee-content" aria-hidden="true">
            ${ambassadorsHTML}
        </div>
    `;

    // Start the marquee animation
    startAmbassadorsMarquee(track);
}

/* ================= EVENTS ================= */
function startAmbassadorsMarquee(track) {
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
    loadAmbassadorsFullData();
});
