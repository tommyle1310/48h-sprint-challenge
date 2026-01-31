/**
 * Physicians Carousel Component
 * Handles horizontal scrolling carousel of physician testimonials
 */

/* ================= STATE ================= */
let physiciansData = [];

// Video URLs for mobile autoplay
const physicianVideos = [
    '//im8health.com/cdn/shop/videos/c/vp/18ce63f7f6154e888f2a48c2a478e480/18ce63f7f6154e888f2a48c2a478e480.HD-1080p-7.2Mbps-38131720.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/ec95f3f8f55f4c1eb679982d43bf091d/ec95f3f8f55f4c1eb679982d43bf091d.HD-1080p-4.8Mbps-38234483.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/936fe1ac73a046a98e1ff7e701676228/936fe1ac73a046a98e1ff7e701676228.HD-1080p-7.2Mbps-38131732.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/17fb74b0dd5d46e8ac4d1668b46b2134/17fb74b0dd5d46e8ac4d1668b46b2134.HD-1080p-7.2Mbps-38131729.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/db58a8d3630b47a597fb148aba8a1790/db58a8d3630b47a597fb148aba8a1790.HD-1080p-3.3Mbps-38232043.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/9d07478703af48a2903deb8e3fbd5076/9d07478703af48a2903deb8e3fbd5076.HD-1080p-4.8Mbps-38192239.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/1cfa80d2973d44619564e370d8fb9a5a/1cfa80d2973d44619564e370d8fb9a5a.HD-1080p-7.2Mbps-38201373.mp4',
    '//im8health.com/cdn/shop/videos/c/vp/0cdc39d7dda145e29a333ee5f43ed507/0cdc39d7dda145e29a333ee5f43ed507.HD-1080p-2.5Mbps-38319373.mp4'
];

/* ================= LOAD ================= */
async function loadPhysiciansData() {
    try {
        const response = await fetch('./data/physicians.json');
        const data = await response.json();
        physiciansData = data.physicians;
        renderPhysiciansCarousel();
        // Re-render on resize
        window.addEventListener('resize', debounce(renderPhysiciansCarousel, 250));
    } catch (error) {
        console.error('Error loading physicians data:', error);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ================= RENDER ================= */
function renderPhysiciansCarousel() {
    const track = document.getElementById('physicians-track');
    if (!track) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        renderMobilePhysiciansCarousel(track);
    } else {
        renderDesktopPhysiciansCarousel(track);
    }

    bindPhysiciansCarouselEvents();
}

function renderMobilePhysiciansCarousel(track) {
    track.innerHTML = physiciansData.map((physician, index) => `
        <div class="physician-card-mobile" data-physician="${physician.id}">
            <div class="video-container-mobile">
                <video 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                    class="physician-video-mobile"
                >
                    <source src="${physicianVideos[index % physicianVideos.length]}" type="video/mp4" />
                </video>
            </div>
            <div class="physician-info-mobile">
                <span class="physician-handle">${physician.handle}</span>
                <span class="physician-followers">${physician.followers} followers</span>
            </div>
        </div>
    `).join('');
}

function renderDesktopPhysiciansCarousel(track) {
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
