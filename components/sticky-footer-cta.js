/**
 * Sticky Footer CTA Component
 * Handles the fixed-position footer bar with dynamic pricing
 */

/* ================= STATE ================= */
let footerVisible = false;
let exclusiveBadgeDismissed = false;

/* ================= INIT ================= */
function initStickyFooter() {
    const footer = document.getElementById('sticky-footer-cta');
    const exclusiveBadge = document.getElementById('exclusive-badge');
    const closeBadgeBtn = document.getElementById('close-exclusive-badge');
    const footerDropdown = document.getElementById('footer-plan-dropdown');
    const footerAddToCart = document.getElementById('footer-add-to-cart');

    if (!footer) return;

    // Show footer after scrolling past hero section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                showFooter();
            } else {
                hideFooter();
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
    });

    const heroSection = document.querySelector('.hero-sticky-section');
    if (heroSection) {
        observer.observe(heroSection);
    }

    // Close exclusive badge
    if (closeBadgeBtn && exclusiveBadge) {
        closeBadgeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exclusiveBadge.style.display = 'none';
            exclusiveBadgeDismissed = true;
        });
    }

    // Footer dropdown sync
    if (footerDropdown) {
        footerDropdown.addEventListener('change', (e) => {
            const planId = e.target.value;
            
            // Update global state
            if (window.productState) {
                window.productState.subscription = planId;
            }

            // Trigger subscription change
            document.dispatchEvent(new CustomEvent('subscriptionChange', {
                detail: { subscription: planId }
            }));

            // Update main page subscription cards
            updateMainPageSubscription(planId);
        });
    }

    // Footer Add to Cart
    if (footerAddToCart) {
        footerAddToCart.addEventListener('click', () => {
            // Same action as main add to cart
            const mainBtn = document.getElementById('main-add-to-cart');
            if (mainBtn) mainBtn.click();
        });
    }

    // Listen for state changes
    document.addEventListener('formatChange', updateFooterDisplay);
    document.addEventListener('subscriptionChange', updateFooterDisplay);
}

/* ================= VISIBILITY ================= */
function showFooter() {
    const footer = document.getElementById('sticky-footer-cta');
    if (footer && !footerVisible) {
        footer.classList.add('visible');
        footerVisible = true;
    }
}

function hideFooter() {
    const footer = document.getElementById('sticky-footer-cta');
    if (footer && footerVisible) {
        footer.classList.remove('visible');
        footerVisible = false;
    }
}

/* ================= SYNC ================= */
function updateFooterDisplay() {
    if (!window.productState) return;

    const { format, subscription } = window.productState;

    // Update format display
    const formatDisplay = document.getElementById('footer-format-display');
    if (formatDisplay) {
        const formatName = format === 'jar' ? 'Forever Jar' : 'Single-Serve Sachets';
        formatDisplay.textContent = `(${formatName})`;
    }

    // Update dropdown
    const dropdown = document.getElementById('footer-plan-dropdown');
    if (dropdown && dropdown.value !== subscription) {
        dropdown.value = subscription;
    }
}

function updateMainPageSubscription(planId) {
    // Update subscription cards on main page
    document.querySelectorAll('.subscription-card').forEach(card => {
        card.setAttribute('data-selected', card.dataset.plan === planId);
        const input = card.querySelector('input');
        if (input) input.checked = card.dataset.plan === planId;
    });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    initStickyFooter();
});
