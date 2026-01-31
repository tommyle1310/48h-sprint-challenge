/**
 * Organ Systems Grid Component
 * Handles 3x3 interactive grid of organ systems with detail panel
 */

/* ================= STATE ================= */
let organSystemsData = [];
let selectedSystemId = 'digestive';

/* ================= LOAD ================= */
async function loadOrganSystemsData() {
    try {
        const response = await fetch('./data/organ-systems.json');
        const data = await response.json();
        organSystemsData = data.organSystems;
        renderOrganSystemsGrid();
        renderOrganSystemDetail(selectedSystemId);
    } catch (error) {
        console.error('Error loading organ systems data:', error);
    }
}

/* ================= RENDER ================= */
function renderOrganSystemsGrid() {
    const container = document.getElementById('organ-systems-grid');
    if (!container) return;

    container.innerHTML = organSystemsData.map(system => `
        <button class="organ-system-item ${system.id === selectedSystemId ? 'selected' : ''}" 
                data-system="${system.id}">
            <span class="system-number">${system.number}</span>
            <div class="system-icon">
                <i class="${system.icon}"></i>
            </div>
            <span class="system-name">${system.name}</span>
        </button>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.organ-system-item').forEach(item => {
        item.addEventListener('click', () => {
            handleSystemSelect(item.dataset.system);
        });
    });
}

function renderOrganSystemDetail(systemId) {
    const container = document.getElementById('organ-system-detail');
    if (!container) return;

    const system = organSystemsData.find(s => s.id === systemId);
    if (!system) return;

    container.innerHTML = `
        <div class="detail-header flex items-start gap-4 mb-6">
            <div class="detail-icon w-16 h-16 bg-brand-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="${system.icon} text-2xl text-brand-burgundy"></i>
            </div>
            <div>
                <h3 class="font-serif text-2xl mb-1">${system.name}</h3>
                <p class="text-xs text-brand-burgundy font-semibold uppercase tracking-wide">${system.subtitle}</p>
            </div>
        </div>
        
        <p class="text-gray-600 text-center md:text-left leading-relaxed mb-6">${system.description}</p>
        
        ${system.badge ? `
            <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
                <i class="fa-solid fa-flask"></i>
                ${system.badge}
            </div>
        ` : ''}
    `;
}

/* ================= EVENTS ================= */
function handleSystemSelect(systemId) {
    selectedSystemId = systemId;

    // Update grid selection state
    document.querySelectorAll('.organ-system-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.system === systemId);
    });

    // Update detail panel
    renderOrganSystemDetail(systemId);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadOrganSystemsData();
});
