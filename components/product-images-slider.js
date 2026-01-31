/**
 * Product Images Slider Component
 * Handles product image gallery with thumbnail navigation
 * Desktop: Vertical thumbnails with expand/collapse (not scrollable)
 * Mobile: Horizontal swipeable slider with pagination dots
 */

/* ================= STATE ================= */
let productImages = [];
let currentImageIndex = 0;
let thumbnailsExpanded = false;
const VISIBLE_THUMBNAILS = 4; // Number of thumbnails visible before expand

/* ================= LOAD ================= */
async function loadProductImages() {
    try {
        const response = await fetch('./data/product-images.json');
        productImages = await response.json();
        renderProductImageSlider();
    } catch (error) {
        console.error('Error loading product images:', error);
        // Fallback to placeholder images
        productImages = [
            'https://via.placeholder.com/500x500?text=Product+1',
            'https://via.placeholder.com/500x500?text=Product+2',
            'https://via.placeholder.com/500x500?text=Product+3',
            'https://via.placeholder.com/500x500?text=Product+4'
        ];
        renderProductImageSlider();
    }
}

/* ================= RENDER ================= */
function renderProductImageSlider() {
    const container = document.getElementById('product-images-slider');
    if (!container) return;

    const hasMoreImages = productImages.length > VISIBLE_THUMBNAILS;

    container.innerHTML = `
        <!-- Desktop Layout: Vertical thumbnails on left -->
        <div class="product-gallery-desktop hidden md:flex gap-4">
            <!-- Thumbnail Strip (vertical, not scrollable) -->
            <div class="thumbnail-strip-desktop flex flex-col gap-2">
                ${productImages.map((img, index) => `
                    <div class="thumbnail-desktop ${index === currentImageIndex ? 'active' : ''} ${!thumbnailsExpanded && index >= VISIBLE_THUMBNAILS ? 'hidden' : ''}" data-index="${index}">
                        <img src="${img}" alt="Product thumbnail ${index + 1}" onerror="this.src='https://via.placeholder.com/60x60?text=${index + 1}'">
                    </div>
                `).join('')}
                ${hasMoreImages ? `
                    <button class="thumbnail-expand-btn" id="thumbnail-expand-btn">
                        <i class="fa-solid fa-chevron-${thumbnailsExpanded ? 'up' : 'down'} text-xs"></i>
                    </button>
                ` : ''}
            </div>
            
            <!-- Main Image -->
            <div class="main-image-desktop relative flex-1">
                <img id="main-product-image-desktop" src="${productImages[currentImageIndex]}" alt="Product image" class="w-full h-auto rounded-2xl" onerror="this.src='https://via.placeholder.com/500x500?text=Product'">
                
                <!-- Badge -->
                <div class="absolute top-4 right-4 w-20 h-20">
                    <img src="https://cdn.shopify.com/s/files/1/0779/0673/9384/files/new-year-badge.png" alt="New Year Sale" class="w-full h-full object-contain" onerror="this.style.display='none'">
                </div>
            </div>
        </div>
        
        <!-- Mobile Layout: Horizontal swipeable slider -->
        <div class="product-gallery-mobile md:hidden">
            <div class="mobile-slider-container relative overflow-hidden rounded-2xl">
                <div class="mobile-slider-track flex transition-transform duration-300 ease-out" id="mobile-slider-track">
                    ${productImages.map((img, index) => `
                        <div class="mobile-slide flex-shrink-0 w-full">
                            <img src="${img}" alt="Product image ${index + 1}" class="w-full h-auto" onerror="this.src='https://via.placeholder.com/500x500?text=Product'">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Badge -->
                <div class="absolute top-4 right-4 w-16 h-16">
                    <img src="https://cdn.shopify.com/s/files/1/0779/0673/9384/files/new-year-badge.png" alt="New Year Sale" class="w-full h-full object-contain" onerror="this.style.display='none'">
                </div>
            </div>
            
            <!-- Pagination Dots -->
            <div class="mobile-pagination flex justify-center gap-2 mt-4">
                ${productImages.map((_, index) => `
                    <button class="pagination-dot ${index === currentImageIndex ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
            </div>
        </div>
    `;

    bindSliderEvents();
    updateMobileSliderPosition();
}

/* ================= EVENTS ================= */
function bindSliderEvents() {
    // Desktop thumbnail clicks
    document.querySelectorAll('.thumbnail-desktop').forEach(thumb => {
        thumb.addEventListener('click', () => {
            setCurrentImage(parseInt(thumb.dataset.index));
        });
    });

    // Desktop expand button
    const expandBtn = document.getElementById('thumbnail-expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            thumbnailsExpanded = !thumbnailsExpanded;
            renderProductImageSlider();
        });
    }

    // Mobile pagination dot clicks
    document.querySelectorAll('.pagination-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            setCurrentImage(parseInt(dot.dataset.index));
        });
    });

    // Mobile touch/swipe support
    const mobileTrack = document.getElementById('mobile-slider-track');
    if (mobileTrack) {
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;

        mobileTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isDragging = true;
        }, { passive: true });

        mobileTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        mobileTrack.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next image
                    const newIndex = Math.min(currentImageIndex + 1, productImages.length - 1);
                    setCurrentImage(newIndex);
                } else {
                    // Swipe right - previous image
                    const newIndex = Math.max(currentImageIndex - 1, 0);
                    setCurrentImage(newIndex);
                }
            }
        }
    }
}

/* ================= HELPERS ================= */
function setCurrentImage(index) {
    currentImageIndex = index;

    // Update desktop main image
    const mainImageDesktop = document.getElementById('main-product-image-desktop');
    if (mainImageDesktop) {
        mainImageDesktop.src = productImages[index];
    }

    // Update desktop thumbnails
    document.querySelectorAll('.thumbnail-desktop').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    // Update mobile slider position
    updateMobileSliderPosition();

    // Update pagination dots
    document.querySelectorAll('.pagination-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function updateMobileSliderPosition() {
    const mobileTrack = document.getElementById('mobile-slider-track');
    if (mobileTrack) {
        mobileTrack.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadProductImages();
});
