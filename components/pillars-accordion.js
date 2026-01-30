/**
 * 5 Pillars Interactive Component
 * Sidebar navigation with detail panel layout
 * Supports switching between Essentials and Longevity products
 */

/* ================= STATE ================= */
let pillarsData = {};
let currentProduct = 'daily-ultimate-essentials';
let activePillarIndex = 0;

/* ================= LOAD ================= */
async function loadPillarsData() {
    try {
        const response = await fetch('./data/pillars.json');
        pillarsData = await response.json();
        renderPillarsSection();
    } catch (error) {
        console.error('Error loading pillars data:', error);
    }
}

/* ================= RENDER ================= */
function renderPillarsSection() {
    const productData = pillarsData[currentProduct];
    if (!productData) return;

    // Reset to first pillar when switching products
    activePillarIndex = 0;

    // Update section header
    const sectionHeader = document.querySelector('#pillars .text-center.mb-10');
    if (sectionHeader) {
        const isLongevity = currentProduct === 'daily-ultimate-longevity';
        sectionHeader.innerHTML = `
            <!-- Product Tab Switcher -->
            <div class="pillars-tab-switcher mb-8">
                <div class="inline-flex bg-white rounded-full p-1 shadow-card border border-gray-200">
                    <button
                        class="pillars-product-tab ${!isLongevity ? 'active' : ''} px-6 py-3 rounded-full text-sm font-medium transition-all"
                        data-product="daily-ultimate-essentials"
                    >
                        Daily Ultimate Essentials
                    </button>
                    <button
                        class="pillars-product-tab ${isLongevity ? 'active' : ''} px-6 py-3 rounded-full text-sm font-medium transition-all"
                        data-product="daily-ultimate-longevity"
                    >
                        Daily Ultimate Longevity
                    </button>
                </div>
            </div>

            <span class="inline-block bg-brand-burgundy/10 text-brand-burgundy text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wide mb-4">
                ${productData.badge}
            </span>
            <h2 class="font-serif text-3xl md:text-4xl mb-3">
                ${productData.title}
            </h2>
            <p class="max-w-2xl mx-auto text-gray-600">
                ${productData.subtitle}
            </p>
        `;

        // Add tab event listeners
        sectionHeader.querySelectorAll('.pillars-product-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const product = tab.dataset.product;
                if (product !== currentProduct) {
                    currentProduct = product;
                    renderPillarsSection();
                }
            });
        });
    }

    renderPillarsInteractive();
    renderPillarsFeatures();
}

function renderPillarsInteractive() {
    const container = document.getElementById('pillars-accordion');
    if (!container) return;

    const productData = pillarsData[currentProduct];
    if (!productData) return;

    const isLongevity = currentProduct === 'daily-ultimate-longevity';
    const themeClass = isLongevity ? 'pillars--longevity' : 'pillars--essentials';

    container.innerHTML = `
        <div class="pillars-interactive ${themeClass}">
            <!-- Sidebar Navigation -->
            <nav class="pillars-sidebar" role="tablist" aria-label="Select a pillar">
                ${productData.pillars.map((pillar, index) => `
                    <button 
                        class="pillars-nav-item ${index === activePillarIndex ? 'pillars-nav-item--active' : ''}" 
                        role="tab" 
                        aria-selected="${index === activePillarIndex}"
                        data-index="${index}"
                    >
                        <span class="pillars-nav-number">${pillar.number}</span>
                        <div class="pillars-nav-icon">
                            ${pillar.iconSvg}
                        </div>
                        <div class="pillars-nav-text">
                            <span class="pillars-nav-label">${pillar.name}</span>
                            <span class="pillars-nav-preview">${pillar.navSubtitle}</span>
                        </div>
                        <span class="pillars-nav-arrow" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"></path>
                            </svg>
                        </span>
                        <span class="pillars-nav-line" aria-hidden="true"></span>
                    </button>
                `).join('')}
            </nav>

            <!-- Detail Panel -->
            <div class="pillars-panel" aria-live="polite">
                ${productData.pillars.map((pillar, index) => `
                    <div 
                        class="pillars-panel-content ${index === activePillarIndex ? 'pillars-panel-content--active' : ''}" 
                        role="tabpanel" 
                        data-panel-index="${index}"
                    >
                        <span class="pillars-watermark" aria-hidden="true">${pillar.number}</span>
                        
                        <div class="pillars-panel-inner">
                            <div class="pillars-panel-header">
                                <div class="pillars-panel-icon">
                                    ${pillar.iconSvg}
                                </div>
                                <div class="pillars-panel-badge">
                                    <span>Pillar ${index + 1}</span>
                                </div>
                            </div>
                            
                            <div class="pillars-panel-body">
                                <h3 class="pillars-panel-title">${pillar.name}</h3>
                                
                                <div class="pillars-panel-meta">
                                    <span class="pillars-panel-meta-line"></span>
                                    <span class="pillars-panel-tagline">${pillar.panelSubtitle}</span>
                                </div>

                                <div class="pillars-key-benefits">
                                    <h4 class="pillars-key-benefits-title">Key Benefits</h4>
                                    <p class="pillars-panel-description">${pillar.keyBenefits}</p>
                                </div>

                                <div class="pillars-benefits">
                                    <h4 class="pillars-benefits-title">Key Ingredients</h4>
                                    <ul class="pillars-benefits-list">
                                        ${pillar.keyIngredients.map(ingredient => `
                                            <li class="pillars-benefit-item">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
                                                    <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                <span>${ingredient}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners
    container.querySelectorAll('.pillars-nav-item').forEach(navItem => {
        navItem.addEventListener('click', () => {
            const index = parseInt(navItem.dataset.index);
            handlePillarSelect(index);
        });
    });
}

function renderPillarsFeatures() {
    const productData = pillarsData[currentProduct];
    if (!productData || !productData.features) return;

    // Check if features container exists, if not create it
    let featuresContainer = document.getElementById('pillars-features');
    if (!featuresContainer) {
        featuresContainer = document.createElement('div');
        featuresContainer.id = 'pillars-features';
        featuresContainer.className = 'pillars-features mt-12';
        const accordionContainer = document.getElementById('pillars-accordion');
        if (accordionContainer) {
            accordionContainer.parentNode.appendChild(featuresContainer);
        }
    }

    featuresContainer.innerHTML = `
        <div class="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            ${productData.features.map(feature => `
                <div class="feature-card bg-brand-cream rounded-xl p-6 text-center">
                    <div class="feature-icon-wrapper mb-4">
                        <div class="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                            <i class="${feature.icon} text-brand-burgundy text-lg"></i>
                        </div>
                    </div>
                    <h4 class="font-semibold text-sm mb-2">${feature.title}</h4>
                    <p class="text-xs text-gray-600">${feature.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

/* ================= EVENTS ================= */
function handlePillarSelect(index) {
    if (index === activePillarIndex) return;
    
    activePillarIndex = index;

    // Update nav items
    document.querySelectorAll('.pillars-nav-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('pillars-nav-item--active');
            item.setAttribute('aria-selected', 'true');
        } else {
            item.classList.remove('pillars-nav-item--active');
            item.setAttribute('aria-selected', 'false');
        }
    });

    // Update panels
    document.querySelectorAll('.pillars-panel-content').forEach((panel, i) => {
        if (i === index) {
            panel.classList.add('pillars-panel-content--active');
        } else {
            panel.classList.remove('pillars-panel-content--active');
        }
    });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadPillarsData();
});
