/**
 * Main Application Entry Point
 * Global state management and initialization
 */

/* ================= GLOBAL STATE ================= */
window.productState = {
    format: 'jar',           // 'jar' | 'sachets'
    subscription: '90-day'   // '90-day' | '30-day' | 'one-time'
};

/* ================= PRICING DATA ================= */
const pricingData = {
    jar: {
        '90-day': { price: 78, original: 112, perServing: 2.61, billing: 235 },
        '30-day': { price: 89, original: 112, perServing: 2.97, billing: 89 },
        'one-time': { price: 112, perServing: 3.73 }
    },
    sachets: {
        '90-day': { price: 78, original: 112, perServing: 2.91, billing: 235 },
        '30-day': { price: 89, original: 112, perServing: 3.27, billing: 89 },
        'one-time': { price: 112, perServing: 4.03 }
    }
};

/* ================= HELPERS ================= */
function getPricing(format, subscription) {
    return pricingData[format]?.[subscription] || pricingData.jar['90-day'];
}

function updateAllPrices() {
    const { format, subscription } = window.productState;
    const pricing = getPricing(format, subscription);

    // Update main cart button
    const mainCartPrice = document.getElementById('main-cart-price');
    if (mainCartPrice) {
        mainCartPrice.textContent = `$${pricing.price.toFixed(2)}`;
    }

    // Update footer cart button
    const footerCartPrice = document.getElementById('footer-cart-price');
    if (footerCartPrice) {
        footerCartPrice.textContent = `$${pricing.price.toFixed(2)}`;
    }

    // Update footer per serving
    const footerPerServing = document.getElementById('footer-per-serving');
    if (footerPerServing) {
        footerPerServing.textContent = `$${pricing.perServing.toFixed(2)} USD / serving`;
    }
}

/* ================= LOAD AMBASSADORS ================= */
async function loadAmbassadors() {
    try {
        const response = await fetch('./data/ambassadors.json');
        const ambassadors = await response.json();
        renderAmbassadors(ambassadors);
        initAmbassadorSlider();
        initAmbassadorVideoModal();
    } catch (error) {
        console.error('Error loading ambassadors:', error);
    }
}

function renderAmbassadors(ambassadors) {
    const container = document.getElementById('ambassador-avatars');
    if (!container) return;

    container.innerHTML = ambassadors.map(ambassador => `
        <div class="ambassador-video-card" data-video-url="${ambassador.videoMp4}" style="flex-shrink: 0; width: calc((100% - 36px) / 4); cursor: pointer;">
            <div class="ambassador-video-card__thumbnail" style="position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; background: #f5f5f5;">
                <img src="${ambassador.thumbnailUrl}" alt="Ambassador video ${ambassador.index}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='https://via.placeholder.com/150x200?text=Video'">
                <button class="ambassador-video-card__play-btn" aria-label="Play video" style="position: absolute; bottom: 8px; right: 8px; background: none; border: none; padding: 0; cursor: pointer; z-index: 2;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.4865 3.51351L12 0L3.51351 3.51351L0 12L3.51351 20.4865L12 24L20.4865 20.4865L24 12L20.4865 3.51351ZM9.75 15.8971L16.5 12L9.75 8.10289V15.8971Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function initAmbassadorSlider() {
    const slider = document.getElementById('ambassador-avatars');
    if (!slider) return;

    // Enable touch/drag scrolling - the overflow-x-auto class handles native scrolling
    // Add smooth scroll-snap behavior
    slider.style.scrollSnapType = 'x mandatory';
    slider.style.webkitOverflowScrolling = 'touch';
    
    // Make cards snap
    const cards = slider.querySelectorAll('.ambassador-video-card');
    cards.forEach(card => {
        card.style.scrollSnapAlign = 'start';
    });
}

function initAmbassadorVideoModal() {
    const modal = document.getElementById('ambassador-video-modal');
    const video = document.getElementById('ambassador-modal-video');
    const closeBtn = document.getElementById('ambassador-modal-close');
    
    if (!modal || !video || !closeBtn) return;

    // Click on video cards to open modal
    document.querySelectorAll('.ambassador-video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoUrl = card.dataset.videoUrl;
            if (videoUrl) {
                video.querySelector('source').src = videoUrl;
                video.load();
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
                video.play();
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        video.pause();
        video.currentTime = 0;
    }

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/* ================= LOAD TRANSFORMATION EXPERTS ================= */
async function loadTransformationExperts() {
    try {
        const response = await fetch('./data/transformation-experts.json');
        const data = await response.json();
        renderTransformationExperts(data.experts);
    } catch (error) {
        console.error('Error loading transformation experts:', error);
    }
}

function renderTransformationExperts(experts) {
    const container = document.getElementById('transformation-experts');
    if (!container) return;

    container.innerHTML = experts.map(expert => `
        <div class="expert-card flex flex-col items-center text-center">
            <img src="${expert.image}" alt="${expert.name}" class="expert-card__img" onerror="this.src='https://via.placeholder.com/300x300?text=${expert.name.charAt(0)}'">
            <p class="text-[#50000b] font-semibold text-xs md:text-sm leading-tight">${expert.name}</p>
            <p class="text-[#6b4c3a] text-[10px] md:text-xs leading-tight">${expert.role}</p>
        </div>
    `).join('');
}

/* ================= EVENT LISTENERS ================= */
document.addEventListener('formatChange', (e) => {
    window.productState.format = e.detail.format;
    updateAllPrices();
});

document.addEventListener('subscriptionChange', (e) => {
    window.productState.subscription = e.detail.subscription;
    updateAllPrices();

    // Sync footer dropdown
    const footerDropdown = document.getElementById('footer-plan-dropdown');
    if (footerDropdown && footerDropdown.value !== e.detail.subscription) {
        footerDropdown.value = e.detail.subscription;
    }
});

/* ================= ADD TO CART ================= */
function handleAddToCart() {
    const { format, subscription } = window.productState;
    const pricing = getPricing(format, subscription);

    console.log('Add to Cart:', {
        format,
        subscription,
        price: pricing.price,
        perServing: pricing.perServing
    });

    // Show confirmation (you can replace this with actual cart functionality)
    alert(`Added to cart!\n\nFormat: ${format === 'jar' ? 'Forever Jar' : 'Single-Serve Sachets'}\nPlan: ${subscription}\nPrice: $${pricing.price}/mo`);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    // Load additional components
    loadAmbassadors();
    loadTransformationExperts();

    // Bind add to cart buttons
    const mainAddToCart = document.getElementById('main-add-to-cart');
    if (mainAddToCart) {
        mainAddToCart.addEventListener('click', handleAddToCart);
    }

    const footerAddToCart = document.getElementById('footer-add-to-cart');
    if (footerAddToCart) {
        footerAddToCart.addEventListener('click', handleAddToCart);
    }

    // Initial price update
    setTimeout(updateAllPrices, 100);

    // Scroll-triggered sticky header
    initStickyPromoHeader();
});

/* ================= STICKY PROMO HEADER ================= */
function initStickyPromoHeader() {
    const stickyHeader = document.getElementById('sticky-promo-header');
    if (!stickyHeader) return;

    let lastScrollY = 0;
    let ticking = false;

    function updateStickyHeader() {
        const scrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / totalHeight) * 100;

        // Show when scrolled past 10%, hide when below 10%
        if (scrollPercent >= 5) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateStickyHeader);
            ticking = true;
        }
    });
}
