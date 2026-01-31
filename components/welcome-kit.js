/**
 * Welcome Kit Component
 * Displays pricing breakdown for welcome kit with free items
 */

/* ================= STATE ================= */
let welcomeKitData = null;

/* ================= LOAD ================= */
async function loadWelcomeKitData() {
    try {
        const response = await fetch('./data/welcome-kit.json');
        const data = await response.json();
        welcomeKitData = data.welcomeKit;
        renderWelcomeKit();
    } catch (error) {
        console.error('Error loading welcome kit data:', error);
    }
}

/* ================= RENDER ================= */
function renderWelcomeKit() {
    const container = document.getElementById('welcome-kit-content');
    if (!container || !welcomeKitData) return;

    container.innerHTML = `
        <!-- Left: Image -->
        <div class="welcome-kit-image">
            <img src="https://im8health.com/cdn/shop/files/welcome-kit-sach.png?v=1761040602&width=1200" 
                 alt="IM8 Welcome Kit contents"
                 class="w-full h-auto rounded-2xl shadow-card"
                 onerror="this.src='https://via.placeholder.com/600x500?text=Welcome+Kit'">
        </div>
        
        <!-- Right: Pricing -->
        <div class="welcome-kit-pricing">
            <h2 class="kit-title font-serif text-2xl md:text-3xl mb-1">${welcomeKitData.title}</h2>
            <p class="kit-subtitle text-brand-burgundy font-semibold text-sm mb-6">${welcomeKitData.subtitle}</p>
            
            <div class="pricing-breakdown bg-gray-50 rounded-xl p-6 mb-6">
                <!-- Main Product -->
                <div class="pricing-item main-product flex justify-between items-center py-3 border-b border-gray-200">
                    <span class="item-name font-medium">${welcomeKitData.mainProduct.name}</span>
                    <span class="item-price font-bold text-lg">$${welcomeKitData.mainProduct.price}</span>
                </div>
                
                <!-- Free Items -->
                <div class="free-items">
                    ${welcomeKitData.freeItems.map(item => `
                        <div class="pricing-item free flex justify-between items-center py-3 border-b border-gray-100">
                            <span class="item-name text-gray-600">${item.name}</span>
                            <div class="flex items-center gap-2">
                                <span class="original-price text-gray-400 line-through text-sm">$${item.originalPrice}</span>
                                <span class="free-badge bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">FREE</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Total -->
                <div class="pricing-total flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
                    <span class="total-label font-semibold text-gray-700">YOUR PRICE TODAY</span>
                    <span class="total-amount font-bold text-2xl text-brand-burgundy">$${welcomeKitData.total}</span>
                </div>
                
             
            </div>
            
            <!-- CTA Button -->
            <button class="cta-button w-full bg-brand-burgundy hover:bg-opacity-90 text-white font-bold py-4 px-6 rounded-lg text-base transition-colors mb-4">
                ${welcomeKitData.cta}
            </button>
            
            <!-- Guarantees -->
            <div class="guarantees flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-600">
                ${welcomeKitData.guarantees.map(guarantee => `
                    <span class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-green-600"></i>
                        ${guarantee}
                    </span>
                `).join('')}
            </div>
            
            <!-- Footnote -->
            <p class="footnote text-xs text-gray-500 mt-4 text-center">${welcomeKitData.footnote}</p>
        </div>
    `;
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadWelcomeKitData();
});
