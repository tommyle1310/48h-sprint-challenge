/**
 * Comparison Tables Component
 * Renders: 
 *   1. "IM8: The New Gold Standard" - comparing vs Leading Greens Powder
 *   2. Product Comparison Table - Essentials vs Beckham Stack
 */

(function () {
    // ===========================
    // GOLD STANDARD COMPARISON TABLE
    // ===========================
    const INITIAL_ROWS_VISIBLE = 5;
    let isExpanded = false;

    async function renderGoldStandardComparison() {
        const container = document.getElementById('gold-standard-comparison');
        if (!container) return;

        try {
            const response = await fetch('./data/gold-standard-comparison.json');
            const data = await response.json();
            
            const html = `
                <div class="gold-standard-table-wrapper">
                    <!-- Product Headers with Images -->
                    <div class="gold-standard-header">
                        <div class="gold-standard-col left-col">
                            <div class="product-header-bar ${data.products.left.headerBgColor}">
                                <img src="${data.products.left.image}" alt="${data.products.left.name}" class="product-header-image left-image" />
                                <span>${data.products.left.name}</span>
                            </div>
                        </div>
                        <div class="gold-standard-col right-col">
                            <div class="product-header-bar ${data.products.right.headerBgColor}">
                                <img src="${data.products.right.image}" alt="${data.products.right.name}" class="product-header-image right-image" />
                                <span>${data.products.right.name}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Comparison Rows -->
                    <div class="gold-standard-rows">
                        ${data.rows.map((row, index) => `
                            <div class="gold-standard-row ${index % 2 === 0 ? 'row-even' : 'row-odd'} ${index >= INITIAL_ROWS_VISIBLE ? 'hidden-row' : ''}">
                                <div class="row-cell left-cell">
                                    <span class="cell-icon ${row.left.included ? 'icon-check' : 'icon-x'}">
                                        ${row.left.included 
                                            ? '<i class="fa-solid fa-circle-check"></i>' 
                                            : '<i class="fa-solid fa-circle-xmark"></i>'}
                                    </span>
                                    <span class="cell-text">
                                        ${row.left.text}
                                        ${row.left.subtext ? `<span class="cell-subtext">${row.left.subtext}</span>` : ''}
                                    </span>
                                </div>
                                <div class="row-cell right-cell">
                                    <span class="cell-icon ${row.right.included ? 'icon-check' : 'icon-x'}">
                                        ${row.right.included 
                                            ? '<i class="fa-solid fa-circle-check"></i>' 
                                            : '<i class="fa-solid fa-circle-xmark"></i>'}
                                    </span>
                                    <span class="cell-text">${row.right.text}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- See More Button -->
                    ${data.seeMoreButton ? `
                        <div class="gold-standard-footer">
                            <button class="see-more-btn">
                                <span class="see-more-text">See More</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
                
                <!-- View Supplement Facts Button -->
                <div class="supplement-facts-btn-wrapper">
                    <button class="supplement-facts-btn" id="view-supplement-facts-btn">
                        <i class="fa-solid fa-file-lines"></i>
                        <span>View Supplement Facts</span>
                    </button>
                </div>
            `;
            
            container.innerHTML = html;

            // Bind See More button event
            const seeMoreBtn = container.querySelector('.see-more-btn');
            if (seeMoreBtn) {
                seeMoreBtn.addEventListener('click', toggleRows);
            }

            // Bind View Supplement Facts button event
            const supplementFactsBtn = container.querySelector('#view-supplement-facts-btn');
            if (supplementFactsBtn) {
                supplementFactsBtn.addEventListener('click', openSupplementFactsModal);
            }
        } catch (error) {
            console.error('Error loading gold standard comparison:', error);
        }
    }

    function toggleRows() {
        const hiddenRows = document.querySelectorAll('.gold-standard-row.hidden-row');
        const seeMoreBtn = document.querySelector('.see-more-btn');
        const seeMoreText = seeMoreBtn?.querySelector('.see-more-text');
        const seeMoreIcon = seeMoreBtn?.querySelector('.see-more-icon');
        
        isExpanded = !isExpanded;

        hiddenRows.forEach((row, index) => {
            if (isExpanded) {
                row.classList.add('expanded');
                row.style.transitionDelay = `${index * 50}ms`;
            } else {
                row.classList.remove('expanded');
                row.style.transitionDelay = `${(hiddenRows.length - index - 1) * 50}ms`;
            }
        });

        if (seeMoreText) {
            seeMoreText.textContent = isExpanded ? 'See Less' : 'See More';
        }
        if (seeMoreIcon) {
            seeMoreIcon.classList.toggle('rotated', isExpanded);
        }
    }

    // ===========================
    // SUPPLEMENT FACTS MODAL
    // ===========================
    function openSupplementFactsModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('supplement-facts-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'supplement-facts-modal';
            modal.className = 'supplement-facts-modal hidden';
            modal.innerHTML = `
                <div class="supplement-modal-backdrop" data-close-modal></div>
                <div class="supplement-modal-wrapper">
                    <button class="supplement-modal-close" aria-label="Close modal" data-close-modal>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="supplement-modal-content">
                        <img 
                            src="https://im8health.com/cdn/shop/files/pdp_essentials_supp-mobile_202505.webp?v=1747046933&width=1296" 
                            alt="Supplement Facts"
                            class="supplement-facts-image"
                        />
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add event listeners
            modal.querySelectorAll('[data-close-modal]').forEach(el => {
                el.addEventListener('click', closeSupplementFactsModal);
            });

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    closeSupplementFactsModal();
                }
            });
        }

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeSupplementFactsModal() {
        const modal = document.getElementById('supplement-facts-modal');
        if (modal) {
            modal.classList.remove('visible');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // ===========================
    // PRODUCT COMPARISON TABLE
    // ===========================
    async function renderProductComparison() {
        const container = document.getElementById('product-comparison');
        if (!container) return;

        try {
            const response = await fetch('./data/product-comparison.json');
            const data = await response.json();
            
            const html = `
                <div class="product-comparison-table-wrapper">
                    <!-- Table Header with Products -->
                    <div class="comparison-table-header">
                        <div class="header-cell feature-header">
                            <span>Feature</span>
                        </div>
                        ${data.products.map(product => `
                            <div class="header-cell product-header">
                                <img src="${product.image}" alt="${product.name}" class="comparison-product-image" />
                                <div class="product-header-info">
                                    <span class="product-name">${product.columnTitle}</span>
                                    ${product.subtitle ? `<span class="product-subtitle">${product.subtitle}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Category Sections -->
                    ${data.categories.map(category => `
                        <div class="comparison-category">
                            <div class="category-header">
                                <span>${category.name}</span>
                            </div>
                            ${category.rows.map((row, index) => `
                                <div class="comparison-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}">
                                    <div class="row-cell feature-cell">
                                        <span>${row.feature}</span>
                                    </div>
                                    <div class="row-cell value-cell">
                                        ${row.essentials 
                                            ? '<i class="fa-solid fa-circle-check check-icon"></i>' 
                                            : '<i class="fa-solid fa-circle-xmark x-icon"></i>'}
                                    </div>
                                    <div class="row-cell value-cell">
                                        ${row.beckhamStack 
                                            ? '<i class="fa-solid fa-circle-check check-icon"></i>' 
                                            : '<i class="fa-solid fa-circle-xmark x-icon"></i>'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                    
                    <!-- Pricing Rows -->
                    <div class="comparison-pricing">
                        ${data.pricing.map((row, index) => `
                            <div class="pricing-row ${index === 0 ? 'pricing-first' : ''}">
                                <div class="row-cell feature-cell pricing-label">
                                    <span>${row.label}</span>
                                </div>
                                <div class="row-cell value-cell pricing-value">
                                    <span>${row.essentials}</span>
                                </div>
                                <div class="row-cell value-cell pricing-value">
                                    <span>${row.beckhamStack}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading product comparison:', error);
        }
    }

    // Initialize both comparison tables
    document.addEventListener('DOMContentLoaded', () => {
        renderGoldStandardComparison();
        renderProductComparison();
    });
})();
