/**
 * Product Images Slider Component
 * Handles product image gallery with thumbnail navigation
 */

/* ================= STATE ================= */
let productImages = [];
let currentImageIndex = 0;

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

    container.innerHTML = `
        <div class="product-gallery-wrapper relative">
            <!-- Thumbnail Strip (Desktop: vertical on left, Mobile: horizontal below) -->
            <div class="thumbnail-strip flex md:flex-col gap-2 order-2 md:order-1">
                ${productImages.map((img, index) => `
                    <div class="thumbnail ${index === currentImageIndex ? 'active' : ''}" data-index="${index}">
                        <img src="${img}" alt="Product thumbnail ${index + 1}" onerror="this.src='https://via.placeholder.com/60x60?text=${index + 1}'">
                    </div>
                `).join('')}
            </div>
            
            <!-- Main Image -->
            <div class="main-image-container order-1 md:order-2">
                <img id="main-product-image" src="${productImages[currentImageIndex]}" alt="Product image" onerror="this.src='https://via.placeholder.com/500x500?text=Product'">
                
                <!-- Mobile Navigation Arrows -->
                <button id="slider-prev" class="md:hidden absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                    <i class="fa-solid fa-chevron-left text-gray-600"></i>
                </button>
                <button id="slider-next" class="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                    <i class="fa-solid fa-chevron-right text-gray-600"></i>
                </button>
                
                <!-- Badge -->
                <div class="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20">
                    <img src="https://cdn.shopify.com/s/files/1/0779/0673/9384/files/new-year-badge.png" alt="New Year Sale" class="w-full h-full object-contain" onerror="this.style.display='none'">
                </div>
            </div>
        </div>
        
        <!-- Mobile Dots Indicator -->
        <div class="flex md:hidden justify-center gap-2 mt-3">
            ${productImages.map((_, index) => `
                <button class="dot w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-brand-burgundy' : 'bg-gray-300'}" data-index="${index}"></button>
            `).join('')}
        </div>
    `;

    bindSliderEvents();
}

/* ================= EVENTS ================= */
function bindSliderEvents() {
    // Thumbnail clicks
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            setCurrentImage(parseInt(thumb.dataset.index));
        });
    });

    // Navigation arrows
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
            setCurrentImage(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % productImages.length;
            setCurrentImage(newIndex);
        });
    }

    // Dot indicators
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            setCurrentImage(parseInt(dot.dataset.index));
        });
    });

    // Touch/Swipe support for mobile
    const mainImage = document.querySelector('.main-image-container');
    if (mainImage) {
        let touchStartX = 0;
        let touchEndX = 0;

        mainImage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainImage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next image
                    const newIndex = (currentImageIndex + 1) % productImages.length;
                    setCurrentImage(newIndex);
                } else {
                    // Swipe right - previous image
                    const newIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
                    setCurrentImage(newIndex);
                }
            }
        }
    }
}

/* ================= HELPERS ================= */
function setCurrentImage(index) {
    currentImageIndex = index;

    // Update main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = productImages[index];
    }

    // Update thumbnails
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('bg-brand-burgundy', i === index);
        dot.classList.toggle('bg-gray-300', i !== index);
    });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadProductImages();
});
