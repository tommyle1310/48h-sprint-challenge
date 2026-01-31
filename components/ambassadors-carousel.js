/**
 * Ambassadors Carousel Component
 * Infinite marquee scrolling with testimonial cards featuring autoplay videos
 */

/* ================= STATE ================= */
let ambassadorsFullData = [];

/* ================= SVG STARS ================= */
const starsSVG = `<svg width="64" height="12" viewBox="0 0 64 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M5.50962 9.47932C5.58907 9.43137 5.68854 9.43137 5.76799 9.47932L8.83955 11.3332C9.02888 11.4475 9.26244 11.2777 9.2122 11.0624L8.39708 7.5683C8.376 7.47793 8.40671 7.38331 8.47685 7.32255L11.1909 4.97132C11.3581 4.82652 11.2687 4.55196 11.0484 4.53326L7.47502 4.2301C7.38262 4.22226 7.30216 4.16392 7.26597 4.07855L5.86898 0.782447C5.78283 0.579191 5.49477 0.579191 5.40862 0.782448L4.01163 4.07855C3.97545 4.16392 3.89498 4.22226 3.80259 4.2301L0.229213 4.53326C0.0088571 4.55196 -0.0804949 4.82652 0.0866545 4.97132L2.80075 7.32255C2.87089 7.38331 2.90161 7.47793 2.88052 7.5683L2.06541 11.0624C2.01517 11.2777 2.24873 11.4475 2.43805 11.3332L5.50962 9.47932Z" fill="#A40011"></path>
  <path d="M18.5096 9.47932C18.5891 9.43137 18.6885 9.43137 18.768 9.47932L21.8395 11.3332C22.0289 11.4475 22.2624 11.2777 22.2122 11.0624L21.3971 7.5683C21.376 7.47793 21.4067 7.38331 21.4768 7.32255L24.1909 4.97132C24.3581 4.82652 24.2687 4.55196 24.0484 4.53326L20.475 4.2301C20.3826 4.22226 20.3021 4.16392 20.266 4.07855L18.869 0.782447C18.7828 0.579191 18.4948 0.579191 18.4086 0.782448L17.0116 4.07855C16.9754 4.16392 16.895 4.22226 16.8026 4.2301L13.2292 4.53326C13.0088 4.55196 12.9195 4.82652 13.0866 4.97132L15.8007 7.32255C15.8709 7.38331 15.9016 7.47793 15.8805 7.5683L15.0654 11.0624C15.0152 11.2777 15.2487 11.4475 15.438 11.3332L18.5096 9.47932Z" fill="#A40011"></path>
  <path d="M31.5096 9.47932C31.589 9.43137 31.6885 9.43137 31.768 9.47932L34.8395 11.3332C35.0289 11.4475 35.2624 11.2777 35.2122 11.0624L34.3971 7.5683C34.376 7.47793 34.4067 7.38331 34.4768 7.32255L37.1909 4.97132C37.3581 4.82652 37.2687 4.55196 37.0484 4.53326L33.475 4.2301C33.3826 4.22226 33.3021 4.16392 33.266 4.07855L31.869 0.782447C31.7828 0.579191 31.4948 0.579191 31.4086 0.782448L30.0116 4.07855C29.9754 4.16392 29.895 4.22226 29.8026 4.2301L26.2292 4.53326C26.0088 4.55196 25.9195 4.82652 26.0866 4.97132L28.8007 7.32255C28.8709 7.38331 28.9016 7.47793 28.8805 7.5683L28.0654 11.0624C28.0151 11.2777 28.2487 11.4475 28.438 11.3332L31.5096 9.47932Z" fill="#A40011"></path>
  <path d="M44.5096 9.47932C44.589 9.43137 44.6885 9.43137 44.768 9.47932L47.8395 11.3332C48.0288 11.4475 48.2624 11.2777 48.2122 11.0624L47.3971 7.5683C47.376 7.47793 47.4067 7.38331 47.4768 7.32255L50.1909 4.97132C50.3581 4.82652 50.2687 4.55196 50.0484 4.53326L46.475 4.2301C46.3826 4.22226 46.3021 4.16392 46.2659 4.07855L44.8689 0.782447C44.7828 0.579191 44.4947 0.579191 44.4086 0.782448L43.0116 4.07855C42.9754 4.16392 42.8949 4.22226 42.8026 4.2301L39.2292 4.53326C39.0088 4.55196 38.9195 4.82652 39.0866 4.97132L41.8007 7.32255C41.8709 7.38331 41.9016 7.47793 41.8805 7.5683L41.0654 11.0624C41.0151 11.2777 41.2487 11.4475 41.438 11.3332L44.5096 9.47932Z" fill="#A40011"></path>
  <path d="M57.5096 9.47932C57.589 9.43137 57.6885 9.43137 57.7679 9.47932L60.8395 11.3332C61.0288 11.4475 61.2624 11.2777 61.2122 11.0624L60.397 7.5683C60.376 7.47793 60.4067 7.38331 60.4768 7.32255L63.1909 4.97132C63.3581 4.82652 63.2687 4.55196 63.0484 4.53326L59.475 4.2301C59.3826 4.22226 59.3021 4.16392 59.2659 4.07855L57.8689 0.782447C57.7828 0.579191 57.4947 0.579191 57.4086 0.782448L56.0116 4.07855C55.9754 4.16392 55.8949 4.22226 55.8025 4.2301L52.2292 4.53326C52.0088 4.55196 51.9195 4.82652 52.0866 4.97132L54.8007 7.32255C54.8709 7.38331 54.9016 7.47793 54.8805 7.5683L54.0654 11.0624C54.0151 11.2777 54.2487 11.4475 54.438 11.3332L57.5096 9.47932Z" fill="#A40011"></path>
</svg>`;

/* ================= LOAD ================= */
async function loadAmbassadorsFullData() {
    try {
        const response = await fetch('./data/ambassadors.json');
        const data = await response.json();
        ambassadorsFullData = data.ambassadors || [];
        renderAmbassadorsCarousel();
    } catch (error) {
        console.error('Error loading ambassadors data:', error);
    }
}

/* ================= RENDER ================= */
function renderAmbassadorsCarousel() {
    const track = document.getElementById('ambassadors-track');
    if (!track || !ambassadorsFullData.length) return;

    // Create the ambassador card HTML matching the design
    // Mobile: show thumbnail image, Desktop (768px+): show autoplay video
    const createAmbassadorCard = (ambassador, index) => `
        <div class="ambassador-card" data-ambassador="${ambassador.id}">
            <!-- Header with profile image, handle and followers -->
            <div class="ambassador-header">
                <img src="${ambassador.profile_image}" alt="${ambassador.handle}" class="ambassador-profile-img" />
                <span class="ambassador-handle">${ambassador.handle}</span>
                <span class="ambassador-followers">(${ambassador.followers})</span>
            </div>
            
            <!-- Mobile: Thumbnail Image (hidden on md+) -->
            <div class="ambassador-thumbnail-wrapper md:hidden">
                <img 
                    src="${ambassador.thumbnail}" 
                    alt="${ambassador.handle} testimonial"
                    class="ambassador-thumbnail-img"
                />
            </div>
            
            <!-- Desktop: Video with autoplay loop (hidden on mobile) -->
            <div class="ambassador-video-wrapper hidden md:block">
                <video 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                    poster="${ambassador.thumbnail}"
                    class="ambassador-video"
                >
                    <source src="${ambassador.video}" type="video/mp4" />
                </video>
            </div>
            
            <!-- Content Section -->
            <div class="ambassador-content">
                <!-- Rating Stars -->
                <div class="ambassador-rating">
                    ${starsSVG}
                </div>
                
                <!-- Quote -->
                <p class="ambassador-quote text-[#50000b] font-medium font-arizona text-[20px] !leading-[1.1]">${ambassador.quote}</p>
            </div>
        </div>
    `;

    // Create cards for marquee (duplicate for seamless loop)
    const ambassadorsHTML = ambassadorsFullData.map((amb, idx) => createAmbassadorCard(amb, idx)).join('');
    
    track.innerHTML = `
        <div class="marquee-content !gap-6">
            ${ambassadorsHTML}
        </div>
        <div class="marquee-content !gap-6" aria-hidden="true">
            ${ambassadorsHTML}
        </div>
    `;

    // Add marquee animation class
    track.classList.add('ambassadors-marquee');

    // Start the marquee animation
    bindMarqueeEvents(track);
}

/* ================= EVENTS ================= */
function bindMarqueeEvents(track) {
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
        // Also pause all videos
        track.querySelectorAll('video').forEach(v => v.pause());
    });

    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
        // Resume all videos
        track.querySelectorAll('video').forEach(v => v.play());
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
