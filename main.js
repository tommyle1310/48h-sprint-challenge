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
    } catch (error) {
        console.error('Error loading ambassadors:', error);
    }
}

function renderAmbassadors(ambassadors) {
    const container = document.getElementById('ambassador-avatars');
    if (!container) return;

    container.innerHTML = ambassadors.map(ambassador => `
        <div class="ambassador-avatar" title="${ambassador.name} - ${ambassador.title}">
            <img src="${ambassador.image}" alt="${ambassador.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${ambassador.name.charAt(0)}'">
        </div>
    `).join('');
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
        <div class="expert-card">
            <div class="expert-avatar">
                <img src="${expert.image}" alt="${expert.name}" onerror="this.src='https://via.placeholder.com/40x40?text=${expert.name.charAt(0)}'">
            </div>
            <div class="expert-info text-white">
                <p class="name">${expert.name}</p>
                <p class="title opacity-80">${expert.title}</p>
            </div>
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
