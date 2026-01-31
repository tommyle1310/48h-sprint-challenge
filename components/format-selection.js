/**
 * Format Selection Component
 * Handles product format selection (Forever Jar / Single-Serve Sachets)
 */

/* ================= STATE ================= */
let formatsData = [];

// Image indices in product-images.json for each format
const FORMAT_IMAGE_INDEX = {
    'jar': 0,      // 1st image (index 0) for jar
    'sachets': 2   // 3rd image (index 2) for sachets
};

/* ================= LOAD ================= */
async function loadFormatData() {
    try {
        const response = await fetch('./data/product-formats.json');
        const data = await response.json();
        formatsData = data.formats;
        renderFormatSelection();
    } catch (error) {
        console.error('Error loading format data:', error);
    }
}

/* ================= RENDER ================= */
function renderFormatSelection() {
    const container = document.getElementById('format-selection');
    if (!container) return;

    const currentFormat = window.productState?.format || 'jar';

    container.innerHTML = `
        <h3 class="text-[16px] font-semibold text-gray-700 mb-3">1. Select Format:</h3>
        <div class="format-options flex gap-3">
            ${formatsData.map(format => `
                <label class="format-card-new relative flex-1 flex flex-row items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${format.id === currentFormat ? 'border-brand-burgundy bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}" data-format="${format.id}" data-selected="${format.id === currentFormat}">
                    <input type="radio" name="product-format" value="${format.id}" ${format.id === currentFormat ? 'checked' : ''} class="sr-only">
                    ${format.badge ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-burgundy text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">${format.badge}</span>` : ''}
                    <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50">
                        <img src="${format.image}" alt="${format.name}" class="w-full h-full object-contain" onerror="this.src='https://via.placeholder.com/64x64?text=Product'">
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-base md:text-lg font-semibold text-brand-burgundy leading-tight">${format.name}</span>
                        <span class="text-xs md:text-sm text-brand-burgundy">(${format.weight}) $${format.pricePerServing.toFixed(2)} USD / serving</span>
                    </div>
                </label>
            `).join('')}
        </div>
    `;

    // Add event listeners
    container.querySelectorAll('.format-card-new').forEach(card => {
        card.addEventListener('click', () => {
            handleFormatChange(card.dataset.format);
        });
    });
}

/* ================= EVENTS ================= */
function handleFormatChange(formatId) {
    // Update global state
    if (window.productState) {
        window.productState.format = formatId;
    }

    // Update UI
    document.querySelectorAll('.format-card-new').forEach(card => {
        const isSelected = card.dataset.format === formatId;
        card.setAttribute('data-selected', isSelected);
        card.querySelector('input').checked = isSelected;
        
        // Update border and shadow styling
        if (isSelected) {
            card.classList.remove('border-gray-200', 'hover:border-gray-300');
            card.classList.add('border-brand-burgundy', 'shadow-md');
        } else {
            card.classList.remove('border-brand-burgundy', 'shadow-md');
            card.classList.add('border-gray-200', 'hover:border-gray-300');
        }
    });

    // Change main product image based on format selection
    const imageIndex = FORMAT_IMAGE_INDEX[formatId];
    if (typeof window.setProductMainImage === 'function' && imageIndex !== undefined) {
        window.setProductMainImage(imageIndex);
    }

    // Emit event for other components
    document.dispatchEvent(new CustomEvent('formatChange', {
        detail: { format: formatId }
    }));

    // Update subscription display with new per-serving price
    if (typeof renderSubscriptionSelection === 'function') {
        renderSubscriptionSelection();
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadFormatData();
});
