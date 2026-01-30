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
                            <img src="${data.products.left.image}" alt="${data.products.left.name}" class="product-header-image left-image" />
                            <div class="product-header-bar ${data.products.left.headerBgColor}">
                                <span>${data.products.left.name}</span>
                            </div>
                        </div>
                        <div class="gold-standard-col right-col">
                            <img src="${data.products.right.image}" alt="${data.products.right.name}" class="product-header-image right-image" />
                            <div class="product-header-bar ${data.products.right.headerBgColor}">
                                <span>${data.products.right.name}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Comparison Rows -->
                    <div class="gold-standard-rows">
                        ${data.rows.map((row, index) => `
                            <div class="gold-standard-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}">
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
                            <button class="see-more-btn">See More</button>
                        </div>
                    ` : ''}
                </div>
            `;
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading gold standard comparison:', error);
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
