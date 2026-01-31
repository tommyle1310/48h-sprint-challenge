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

    // Render trust badges with SVG icon
    const badgesContainer = document.getElementById('premium-trust-badges');
    if (badgesContainer) {
        const badgeTexts = [
            '<strong>30-Day</strong> money back guarantee',
            '<strong>Update</strong> or <strong>cancel</strong> anytime',
            '<strong>Free shipping</strong> for all subscriptions'
        ];
        badgesContainer.innerHTML = badgeTexts.map(text => `
            <span class="trust-badge-item text-left">
                <img src="https://im8health.com/cdn/shop/t/121/assets/featured_check_icon.svg" alt="" class="trust-badge-icon" />
                <span class="text-left">${text}</span>
            </span>
        `).join('');
    }

    // Helper function to determine badge class based on tagline
    const getTaglineBadgeClass = (tagline) => {
        if (tagline === 'FEEL AMAZING TODAY') {
            return 'product-tagline-badge product-tagline-badge--red';
        }
        return 'product-tagline-badge product-tagline-badge--gradient';
    };

    // Helper function to format badge text with line break
    const formatBadgeText = (badge) => {
        if (!badge) return '';
        return badge.replace(' ', '<br>');
    };

    // Render product cards
    container.innerHTML = premiumProductsData.products.map(product => `
        <div class="premium-product-card" data-product="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name} ${product.subtitle}" loading="lazy" />
                ${product.badge ? `<div class="product-corner-badge"><span>${formatBadgeText(product.badge)}</span></div>` : ''}
                <button class="product-add-to-cart-btn">ADD TO CART</button>
            </div>
            <div class="product-card-content">
                <span class="${getTaglineBadgeClass(product.tagline)}">${product.tagline}</span>
                <h3 class="product-card-title font-medium">
                    ${product.name}<br/>
                    ${product.subtitle}
                </h3>
                <p class="product-card-description">${product.description}</p>
                <p class="product-card-price">From $${product.price}</p>
                <button class="product-add-to-cart-btn-mobile">ADD TO CART</button>
            </div>
        </div>
    `).join('');
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadPremiumProductsData);
