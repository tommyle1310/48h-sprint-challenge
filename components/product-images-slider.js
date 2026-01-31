/**
 * Product Images Slider Component
 * Handles product image gallery with thumbnail navigation
 * Desktop: Vertical thumbnails with up/down navigation (max 6 visible)
 * Mobile: Horizontal swipeable slider with pagination dots
 */

/* ================= STATE ================= */
let productImages = [];
let currentImageIndex = 0;
let thumbnailStartIndex = 0; // Starting index for visible thumbnails
const MAX_VISIBLE_THUMBNAILS = 6; // Max thumbnails visible at a time

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

    const canScrollUp = thumbnailStartIndex > 0;
    const canScrollDown = thumbnailStartIndex + MAX_VISIBLE_THUMBNAILS < productImages.length;
    const visibleThumbnails = productImages.slice(thumbnailStartIndex, thumbnailStartIndex + MAX_VISIBLE_THUMBNAILS);

    container.innerHTML = `
        <!-- Desktop Layout: Vertical thumbnails on left -->
        <div class="product-gallery-desktop hidden md:flex gap-4">
            <!-- Thumbnail Strip (vertical, with navigation) -->
            <div class="thumbnail-strip-desktop flex flex-col gap-2 items-center">
                <!-- Up Arrow -->
                <button style="background:none; border:none;" class="thumbnail-nav-btn  ${canScrollUp ? '' : 'opacity-30 cursor-not-allowed'}" id="thumbnail-nav-up" ${!canScrollUp ? 'disabled' : ''}>
                    <i class="fa-solid fa-chevron-up text-xs text-brand-burgundy"></i>
                </button>
                
                <!-- Visible Thumbnails -->
                ${visibleThumbnails.map((img, i) => {
                    const actualIndex = thumbnailStartIndex + i;
                    return `
                    <div class="thumbnail-desktop ${actualIndex === currentImageIndex ? 'active' : ''}" data-index="${actualIndex}">
                        <img src="${img}" alt="Product thumbnail ${actualIndex + 1}" onerror="this.src='https://via.placeholder.com/60x60?text=${actualIndex + 1}'">
                    </div>
                `}).join('')}
                
                <!-- Down Arrow -->
                <button style="background:none; border:none;" class="thumbnail-nav-btn  ${canScrollDown ? '' : 'opacity-30 cursor-not-allowed'}" id="thumbnail-nav-down" ${!canScrollDown ? 'disabled' : ''}>
                    <i class="fa-solid fa-chevron-down text-xs text-brand-burgundy"></i>
                </button>
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

    // Desktop thumbnail navigation buttons
    const navUp = document.getElementById('thumbnail-nav-up');
    const navDown = document.getElementById('thumbnail-nav-down');
    
    if (navUp) {
        navUp.addEventListener('click', () => {
            if (thumbnailStartIndex > 0) {
                thumbnailStartIndex--;
                renderProductImageSlider();
            }
        });
    }
    
    if (navDown) {
        navDown.addEventListener('click', () => {
            if (thumbnailStartIndex + MAX_VISIBLE_THUMBNAILS < productImages.length) {
                thumbnailStartIndex++;
                renderProductImageSlider();
            }
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

    // Update desktop thumbnails - check actual data-index
    document.querySelectorAll('.thumbnail-desktop').forEach((thumb) => {
        const thumbIndex = parseInt(thumb.dataset.index);
        thumb.classList.toggle('active', thumbIndex === index);
    });
    
    // Auto-scroll thumbnails to show selected image
    if (index < thumbnailStartIndex) {
        thumbnailStartIndex = index;
        renderProductImageSlider();
    } else if (index >= thumbnailStartIndex + MAX_VISIBLE_THUMBNAILS) {
        thumbnailStartIndex = index - MAX_VISIBLE_THUMBNAILS + 1;
        renderProductImageSlider();
    }

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

// Expose function globally for format-selection to use
window.setProductMainImage = function(index) {
    if (productImages.length > 0 && index >= 0 && index < productImages.length) {
        setCurrentImage(index);
    }
};

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadProductImages();
});
