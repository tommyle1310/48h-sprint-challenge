/**
 * Product Accordions Component
 * Handles expandable product detail sections with exclusive-open behavior
 */

/* ================= STATE ================= */
let accordionsData = [];
let openAccordionId = null;

/* ================= LOAD ================= */
async function loadAccordionsData() {
    try {
        const response = await fetch('./data/product-accordions.json');
        const data = await response.json();
        accordionsData = data.accordions;
        renderAccordions();
    } catch (error) {
        console.error('Error loading accordions data:', error);
    }
}

/* ================= RENDER ================= */
function renderAccordions() {
    const container = document.getElementById('product-accordions');
    if (!container) return;

    container.innerHTML = accordionsData.map(accordion => `
        <div class="accordion-item" data-accordion-id="${accordion.id}" data-open="false">
            <div class="accordion-header">
                <h4>${accordion.title}</h4>
                <svg class="accordion-icon w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <div class="accordion-content">
                <div class="pt-4 pb-2 text-sm text-gray-600 leading-relaxed">
                    ${accordion.content}
                    ${accordion.link ? `
                        <a href="${accordion.link.url}" class="block mt-3 text-brand-burgundy underline text-sm font-medium">
                            ${accordion.link.text}
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.accordion-item').forEach(item => {
        item.addEventListener('click', () => {
            toggleAccordion(item.dataset.accordionId);
        });
    });
}

/* ================= EVENTS ================= */
function toggleAccordion(accordionId) {
    const clickedItem = document.querySelector(`[data-accordion-id="${accordionId}"]`);
    if (!clickedItem) return;

    const isCurrentlyOpen = clickedItem.dataset.open === 'true';

    // Close all accordions (exclusive-open behavior)
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.dataset.open = 'false';
        const content = item.querySelector('.accordion-content');
        if (content) {
            content.style.maxHeight = '0';
        }
    });

    // If the clicked accordion was closed, open it
    if (!isCurrentlyOpen) {
        clickedItem.dataset.open = 'true';
        const content = clickedItem.querySelector('.accordion-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
        openAccordionId = accordionId;
    } else {
        openAccordionId = null;
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadAccordionsData();
});
