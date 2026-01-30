/**
 * Product Tab Switcher Component
 * Handles switching between product variants (Essentials/Longevity)
 */

/* ================= STATE ================= */
let activeProduct = 'daily-ultimate-essentials';

/* ================= INIT ================= */
function initProductTabSwitcher() {
    const tabs = document.querySelectorAll('.product-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            handleTabSwitch(tab.dataset.product);
        });
    });
}

/* ================= EVENTS ================= */
function handleTabSwitch(productId) {
    activeProduct = productId;

    // Update tab styles
    document.querySelectorAll('.product-tab').forEach(tab => {
        const isActive = tab.dataset.product === productId;
        tab.classList.toggle('active', isActive);
    });

    // Emit event for other components to listen to
    document.dispatchEvent(new CustomEvent('productTabChange', {
        detail: { product: productId }
    }));
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    initProductTabSwitcher();
});
