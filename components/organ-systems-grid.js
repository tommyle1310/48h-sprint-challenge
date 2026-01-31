/**
 * Organ Systems Grid Component
 * Handles 3x3 interactive grid of organ systems with detail panel
 * Supports switching between Essentials and Longevity products
 */

/* ================= STATE ================= */
let organSystemsData = [];
let selectedSystemId = 'digestive';
let currentOrganProduct = 'daily-ultimate-essentials';

/* ================= LOAD ================= */
async function loadOrganSystemsData() {
    try {
        const response = await fetch('./data/organ-systems.json');
        const data = await response.json();
        organSystemsData = data.organSystems;
        renderOrganSystemsSection();
    } catch (error) {
        console.error('Error loading organ systems data:', error);
    }
}

/* ================= RENDER ================= */
function renderOrganSystemsSection() {
    // Update section header with tabs
    const sectionHeader = document.querySelector('#organ-systems .text-center.mb-10');
    if (sectionHeader) {
        const isLongevity = currentOrganProduct === 'daily-ultimate-longevity';
        sectionHeader.innerHTML = `
            <!-- Product Tab Switcher -->
            <div class="organ-tab-switcher mb-8">
                <div class="inline-flex bg-white rounded-full p-1 shadow-card border border-gray-200">
                    <button
                        class="organ-product-tab ${!isLongevity ? 'active' : ''} px-6 py-3 rounded-full text-sm font-medium transition-all"
                        data-product="daily-ultimate-essentials"
                    >
                        Daily Ultimate Essentials
                    </button>
                    <button
                        class="organ-product-tab ${isLongevity ? 'active' : ''} px-6 py-3 rounded-full text-sm font-medium transition-all"
                        data-product="daily-ultimate-longevity"
                    >
                        Daily Ultimate Longevity
                    </button>
                </div>
            </div>

            <span class="inline-block bg-brand-burgundy/10 text-brand-burgundy text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wide mb-4">
                Comprehensive Body Support
            </span>
            <h2 class="font-arizona text-[24px] md:text-[46px] lg:text-[56px] mb-3">
                9 Major Organ Systems
            </h2>
            <p class="max-w-2xl mx-auto">
                One serving delivers comprehensive support for your entire body, replacing multiple supplements with a single, powerful formula.
            </p>
        `;

        // Add tab event listeners
        sectionHeader.querySelectorAll('.organ-product-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const product = tab.dataset.product;
                if (product !== currentOrganProduct) {
                    currentOrganProduct = product;
                    renderOrganSystemsSection();
                }
            });
        });
    }

    renderOrganSystemsGrid();
    renderOrganSystemDetail(selectedSystemId);
}

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
