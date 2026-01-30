/**
 * Format Selection Component
 * Handles product format selection (Forever Jar / Single-Serve Sachets)
 */

/* ================= STATE ================= */
let formatsData = [];

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
        <h3 class="text-sm font-semibold text-gray-700 mb-3">1. Select Format:</h3>
        <div class="format-options grid grid-cols-2 gap-4">
            ${formatsData.map(format => `
                <label class="format-card" data-format="${format.id}" data-selected="${format.id === currentFormat}">
                    <input type="radio" name="product-format" value="${format.id}" ${format.id === currentFormat ? 'checked' : ''}>
                    ${format.badge ? `<span class="format-badge">${format.badge}</span>` : ''}
                    <img src="${format.image}" alt="${format.name}" class="w-20 h-20 object-contain mb-2" onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
                    <span class="text-sm font-semibold text-center">${format.name}</span>
                    <span class="text-xs text-gray-500 text-center">(${format.weight}) $${format.pricePerServing.toFixed(2)} USD / serving</span>
                </label>
            `).join('')}
        </div>
    `;

    // Add event listeners
    container.querySelectorAll('.format-card').forEach(card => {
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
    document.querySelectorAll('.format-card').forEach(card => {
        card.setAttribute('data-selected', card.dataset.format === formatId);
        card.querySelector('input').checked = card.dataset.format === formatId;
    });

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
