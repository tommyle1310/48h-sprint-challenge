/**
 * 5 Pillars Accordion Component
 * Handles pillar selection with exclusive-open accordion behavior
 */

/* ================= STATE ================= */
let pillarsData = [];
let openPillarId = 'nutritional-foundation';

/* ================= LOAD ================= */
async function loadPillarsData() {
    try {
        const response = await fetch('./data/pillars.json');
        const data = await response.json();
        pillarsData = data.pillars;
        renderPillarsAccordion();
    } catch (error) {
        console.error('Error loading pillars data:', error);
    }
}

/* ================= RENDER ================= */
function renderPillarsAccordion() {
    const container = document.getElementById('pillars-accordion');
    if (!container) return;

    container.innerHTML = pillarsData.map(pillar => {
        const isOpen = pillar.id === openPillarId;
        return `
            <div class="pillar-item ${isOpen ? 'open' : ''}" data-pillar="${pillar.id}">
                <button class="pillar-header" aria-expanded="${isOpen}">
                    <div class="pillar-header-left">
                        <span class="pillar-number">${pillar.number}</span>
                        <div class="pillar-icon">
                            <i class="${pillar.icon}"></i>
                        </div>
                        <span class="pillar-name">${pillar.name}</span>
                    </div>
                    <span class="pillar-expand-icon">
                        <i class="fa-solid fa-${isOpen ? 'minus' : 'plus'}"></i>
                    </span>
                </button>
                <div class="pillar-content" style="${isOpen ? '' : 'max-height: 0;'}">
                    <div class="pillar-content-inner">
                        <p class="pillar-subtitle">${pillar.subtitle}</p>
                        <p class="pillar-description">${pillar.description}</p>
                        <div class="pillar-ingredients">
                            <h4 class="ingredients-label">KEY INGREDIENTS</h4>
                            <ul class="ingredients-list">
                                ${pillar.keyIngredients.map(ingredient => `
                                    <li><i class="fa-solid fa-check text-brand-burgundy"></i> ${ingredient}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add event listeners
    container.querySelectorAll('.pillar-header').forEach(header => {
        header.addEventListener('click', () => {
            const pillarItem = header.closest('.pillar-item');
            handlePillarToggle(pillarItem.dataset.pillar);
        });
    });
}

/* ================= EVENTS ================= */
function handlePillarToggle(pillarId) {
    const isCurrentlyOpen = pillarId === openPillarId;

    // Close all pillars
    document.querySelectorAll('.pillar-item').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.pillar-header').setAttribute('aria-expanded', 'false');
        item.querySelector('.pillar-expand-icon i').className = 'fa-solid fa-plus';
        const content = item.querySelector('.pillar-content');
        if (content) content.style.maxHeight = '0';
    });

    // If clicking a different pillar, open it
    if (!isCurrentlyOpen) {
        openPillarId = pillarId;
        const pillarItem = document.querySelector(`[data-pillar="${pillarId}"]`);
        if (pillarItem) {
            pillarItem.classList.add('open');
            pillarItem.querySelector('.pillar-header').setAttribute('aria-expanded', 'true');
            pillarItem.querySelector('.pillar-expand-icon i').className = 'fa-solid fa-minus';
            const content = pillarItem.querySelector('.pillar-content');
            if (content) content.style.maxHeight = content.scrollHeight + 'px';
        }
    } else {
        openPillarId = null;
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadPillarsData();
});
