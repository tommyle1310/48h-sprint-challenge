/**
 * Premium Products Section Component
 * Displays product cards with badges and pricing
 */

/* ================= STATE ================= */
let premiumProductsData = null;

/* ================= LOAD ================= */
async function loadPremiumProductsData() {
    try {
        const response = await fetch('./data/premium-products.json');
        premiumProductsData = await response.json();
        renderPremiumProducts();
    } catch (error) {
        console.error('Error loading premium products data:', error);
    }
}

/* ================= RENDER ================= */
function renderPremiumProducts() {
    const container = document.getElementById('premium-products-grid');
    if (!container || !premiumProductsData) return;

    // Render trust badges
    const badgesContainer = document.getElementById('premium-trust-badges');
    if (badgesContainer) {
        badgesContainer.innerHTML = premiumProductsData.trustBadges.map(badge => `
            <span class="trust-badge-item">
                <i class="fa-solid fa-check text-brand-burgundy mr-2"></i>
                ${badge}
            </span>
        `).join('');
    }

    // Render product cards
    container.innerHTML = premiumProductsData.products.map(product => `
        <div class="premium-product-card" data-product="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name} ${product.subtitle}" loading="lazy" />
                ${product.badge ? `<span class="product-corner-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-card-content">
                <span class="product-tagline-badge">${product.tagline}</span>
                <h3 class="product-card-title">
                    ${product.name}<br/>
                    <span class="product-card-subtitle">${product.subtitle}</span>
                </h3>
                <p class="product-card-description">${product.description}</p>
                <p class="product-card-price">From $${product.price}</p>
            </div>
        </div>
    `).join('');
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadPremiumProductsData);
