/**
 * Subscription Selection Component
 * Handles subscription tier selection (90-Day / 30-Day / One-Time)
 */

/* ================= STATE ================= */
let subscriptionsData = null;

/* ================= LOAD ================= */
async function loadSubscriptionData() {
    try {
        const response = await fetch('./data/subscription-tiers.json');
        subscriptionsData = await response.json();
        renderSubscriptionSelection();
    } catch (error) {
        console.error('Error loading subscription data:', error);
    }
}

/* ================= RENDER ================= */
function renderSubscriptionSelection() {
    const container = document.getElementById('subscription-selection');
    if (!container || !subscriptionsData) return;

    const currentPlan = window.productState?.subscription || '90-day';
    const currentFormat = window.productState?.format || 'jar';

    container.innerHTML = `
        <h3 class="text-sm font-semibold text-gray-700 mb-3">2. Subscribe & Save:</h3>
        <div class="subscription-options flex flex-col gap-3">
            ${subscriptionsData.subscriptions.map(sub => {
                const perServing = sub.perServing[currentFormat] || sub.perServing.jar;
                const isSelected = sub.id === currentPlan;
                
                return `
                <label class="subscription-card" data-plan="${sub.id}" data-selected="${isSelected}">
                    <input type="radio" name="subscription-plan" value="${sub.id}" ${isSelected ? 'checked' : ''}>
                    
                    <div class="subscription-header flex items-start justify-between gap-4">
                        <div class="flex items-start gap-3">
                            <!-- Radio Circle -->
                            <div class="radio-circle mt-1">
                                <span class="radio-circle-inner"></span>
                            </div>
                            
                            <div class="flex flex-col">
                                <!-- Badges -->
                                ${sub.badges.length > 0 ? `
                                    <div class="flex flex-wrap gap-1 mb-2">
                                        ${sub.badges.map(badge => `
                                            <span class="plan-badge ${badge === 'NEW YEAR OFFER' ? 'new-year' : 'best-value'}">${badge}</span>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                
                                <!-- Plan Info -->
                                <span class="text-base font-semibold">${sub.name}</span>
                                <span class="text-sm text-brand-burgundy font-medium">(${sub.discount})</span>
                            </div>
                        </div>
                        
                        <!-- Pricing -->
                        <div class="flex flex-col items-end">
                            <div class="flex items-baseline gap-2">
                                <span class="sale-price">$${sub.price}</span>
                                <span class="original-price">$${sub.originalPrice}</span>
                            </div>
                            <span class="text-sm text-gray-500">/mo</span>
                        </div>
                    </div>
                    
                    <!-- Expandable Details -->
                    <div class="subscription-details mt-4">
                        <p class="text-xs text-gray-500 mb-2">${sub.billing}</p>
                        <p class="text-sm font-semibold text-brand-burgundy mb-3">$${perServing.toFixed(2)} USD / SERVING</p>
                        
                        <ul class="benefits-list">
                            ${sub.benefits.map(benefit => `
                                <li>${benefit}</li>
                            `).join('')}
                        </ul>
                    </div>
                </label>
                `;
            }).join('')}
        </div>
        
        <!-- One-Time Purchase Link -->
        <div class="mt-3 text-center">
            <a href="#" class="text-sm text-gray-500 hover:text-brand-burgundy underline" data-one-time>
                One Time Purchase $${subscriptionsData.oneTimePurchase.price}
            </a>
        </div>
    `;

    // Add event listeners
    container.querySelectorAll('.subscription-card').forEach(card => {
        card.addEventListener('click', () => {
            handleSubscriptionChange(card.dataset.plan);
        });
    });

    // One-time purchase link
    const oneTimeLink = container.querySelector('[data-one-time]');
    if (oneTimeLink) {
        oneTimeLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleSubscriptionChange('one-time');
        });
    }
}

/* ================= EVENTS ================= */
function handleSubscriptionChange(planId) {
    // Update global state
    if (window.productState) {
        window.productState.subscription = planId;
    }

    // Update UI
    document.querySelectorAll('.subscription-card').forEach(card => {
        card.setAttribute('data-selected', card.dataset.plan === planId);
        const input = card.querySelector('input');
        if (input) input.checked = card.dataset.plan === planId;
    });

    // Emit event for other components
    document.dispatchEvent(new CustomEvent('subscriptionChange', {
        detail: { subscription: planId }
    }));

    // Update prices
    updateMainCartPrice();
}

/* ================= HELPERS ================= */
function updateMainCartPrice() {
    if (!subscriptionsData || !window.productState) return;

    const currentPlan = window.productState.subscription;
    const currentFormat = window.productState.format;

    let price = 0;
    let perServing = 0;

    if (currentPlan === 'one-time') {
        price = subscriptionsData.oneTimePurchase.price;
        perServing = price / 30; // Approximate
    } else {
        const sub = subscriptionsData.subscriptions.find(s => s.id === currentPlan);
        if (sub) {
            price = sub.price;
            perServing = sub.perServing[currentFormat] || sub.perServing.jar;
        }
    }

    // Update main cart button
    const mainCartPrice = document.getElementById('main-cart-price');
    if (mainCartPrice) {
        mainCartPrice.textContent = `$${price.toFixed(2)}`;
    }

    // Update footer if visible
    const footerCartPrice = document.getElementById('footer-cart-price');
    if (footerCartPrice) {
        footerCartPrice.textContent = `$${price.toFixed(2)}`;
    }

    const footerPerServing = document.getElementById('footer-per-serving');
    if (footerPerServing) {
        footerPerServing.textContent = `$${perServing.toFixed(2)} USD / serving`;
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadSubscriptionData();
});

// Listen for format changes to update per-serving prices
document.addEventListener('formatChange', () => {
    renderSubscriptionSelection();
});
