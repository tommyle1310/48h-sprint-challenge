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
        <h3 class="text-[16px] font-semibold text-gray-700 mb-3">2. Subscribe & Save:</h3>
        <div class="subscription-options flex flex-col gap-3">
            ${subscriptionsData.subscriptions.map((sub, index) => {
                const perServing = sub.perServing[currentFormat] || sub.perServing.jar;
                const isSelected = sub.id === currentPlan;
                const hasBadges = sub.badges && sub.badges.length > 0;
                
                return `
                <label class="subscription-card-new relative ${hasBadges ? 'mt-4' : ''}" data-plan="${sub.id}" data-selected="${isSelected}">
                    <input type="radio" name="subscription-plan" value="${sub.id}" ${isSelected ? 'checked' : ''} class="sr-only">
                    
                    <!-- Badges positioned above card -->
                    ${hasBadges ? `
                        <div class="absolute -top-3 left-4 flex justify-between w-[90%] mr-10 gap-2 z-10">
                            ${sub.badges.map(badge => `
                                <span class="plan-badge-new ${badge === 'NEW YEAR OFFER' ? 'badge-new-year' : 'badge-best-value'}">${badge}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <!-- Card Content -->
                    <div class="subscription-card-inner ${isSelected ? 'selected' : ''}">
                        <!-- Header Row -->
                        <div class="subscription-header-row flex items-start justify-between gap-4">
                            <!-- Left: Radio + Plan Info -->
                            <div class="flex items-start gap-3">
                                <!-- Custom Radio -->
                                <div class="radio-custom mt-0.5 flex-shrink-0">
                                    <img src="${isSelected ? 'https://im8health.com/cdn/shop/t/121/assets/radio_fill.svg' : 'https://im8health.com/cdn/shop/t/121/assets/radio_blank.svg'}" alt="" class="w-5 h-5">
                                </div>
                                
                                <!-- Plan Info -->
                                <div class="flex flex-col">
                                    <div class="flex items-baseline  gap-1 flex-wrap">
                                        <span class="font-arizona text-lg md:text-xl font-semibold text-brand-burgundy">${sub.name}</span>
                                        <span class="font-arizona text-base md:text-lg ${index === 0 ? 'text-[#16A34A]' : 'text-brand-burgundy'} font-medium">(${sub.discount})</span>
                                    </div>
                                    <span class="font-arizona text-sm text-brand-burgundy">${sub.billing}</span>
                                </div>
                            </div>
                            
                            <!-- Right: Pricing -->
                            <div class="flex flex-col items-end flex-shrink-0">
                                <div class="flex items-baseline gap-1 whitespace-nowrap">
                                    <span class="text-lg md:text-xl font-bold text-brand-burgundy">$${sub.price}</span>
                                    <span class="text-sm text-gray-400 line-through">$${sub.originalPrice}</span>
                                    <span class="text-sm text-gray-500">/mo</span>
                                </div>
                                <span class="text-sm text-gray-600 uppercase tracking-wide">$${perServing.toFixed(2)} USD / SERVING</span>
                            </div>
                        </div>
                        
                        <!-- Separator -->
                        <div class="subscription-separator my-4 border-t border-gray-200"></div>
                        
                        <!-- Benefits List -->
                        <ul class="benefits-list-new space-y-2">
                            ${sub.benefits.map(benefit => `
                                <li class="flex items-start gap-2 text-sm text-brand-burgundy">
                                    <span class="flex-shrink-0">${benefit.substring(0, 2)}</span>
                                    <span>${benefit.substring(2).trim()}</span>
                                </li>
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
    container.querySelectorAll('.subscription-card-new').forEach(card => {
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

    // Update UI - re-render to update radio images
    renderSubscriptionSelection();

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
