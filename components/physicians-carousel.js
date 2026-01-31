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

    // Use same card structure for all breakpoints
    track.innerHTML = physiciansData.map(physician => `
        <div class="physician-card" data-physician="${physician.id}">
            <!-- Header Card -->
            <div class="physician-header-card">
                <!-- Top row: avatar, handle, followers -->
                <div class="physician-top-row">
                    <img src="${physician.profile_image}" alt="${physician.review.name}" class="physician-avatar" />
                    <span class="physician-handle">${physician.social_handle}</span>
                    <span class="physician-followers">(${physician.followers})</span>
                </div>
                <!-- Video - autoplay, loop, muted, playsinline -->
                <div class="physician-video-container">
                    <video 
                        autoplay 
                        loop 
                        muted 
                        playsinline
                        class="physician-video"
                    >
                        <source src="${physician.video.src}" type="video/mp4" />
                    </video>
                </div>
            </div>
            <!-- Review Card -->
            <div class="physician-review-card">
                <p class="physician-name">${physician.review.name}</p>
                <p class="physician-title">${physician.review.title}${physician.review.additional_role ? ' & ' + physician.review.additional_role : ''}</p>
            </div>
        </div>
    `).join('');

    // Ensure all videos play
    ensureVideosPlay();
}

/* ================= ENSURE VIDEOS PLAY ================= */
function ensureVideosPlay() {
    const videos = document.querySelectorAll('#physicians-track .physician-video');
    videos.forEach(video => {
        // Try to play the video
        video.play().catch(() => {
            // If autoplay fails, try again on user interaction
            document.addEventListener('click', () => {
                video.play();
            }, { once: true });
        });
    });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadPhysiciansData();
});
