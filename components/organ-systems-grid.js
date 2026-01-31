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
            <div class="organ-tab-switcher">
                <div class="inline-flex bg-white rounded-full p-1 shadow-card border border-gray-200">
                    <button
                        class="organ-product-tab ${!isLongevity ? 'active' : ''} px-6 py-3 rounded-full text-[10px] font-medium transition-all"
                        data-product="daily-ultimate-essentials"
                    >
                        Daily Ultimate Essentials
                    </button>
                    <button
                        class="organ-product-tab ${isLongevity ? 'active' : ''} px-6 py-3 rounded-full text-[10px] font-medium transition-all"
                        data-product="daily-ultimate-longevity"
                    >
                        Daily Ultimate Longevity
                    </button>
                </div>
            </div>

            <div
            style="background: linear-gradient(135deg, #50000b 0%, #A40011 100%);"
            class="inline-block text-white text-xs font-semibold px-[24px] py-[10px] rounded-full uppercase tracking-wide mb-4">
                Comprehensive Body Support
            </div>
            <h2 class="font-arizona text-[24px] md:text-[46px] lg:text-[56px] mb-3">
                9 Major Organ Systems
            </h2>
            <p class="max-w-2xl leading-[1.7] text-[15px] mx-auto">
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
            ${system.icon}
            </div>
            <span class="system-name !text-[10px]">${system.name}</span>
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
        <div
        style="
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 234, 234, 0.95) 50%, rgba(255, 245, 245, 0.92) 100%);
        "
        class="organ-detail-card relative text-[#50000b] rounded-3xl p-8 overflow-hidden min-h-[420px]">
            <!-- Header with icon and number -->
            <div class="flex justify-between items-start mb-6">
                <div class="detail-icon w-20 h-20 bg-[#f5e8e8] rounded-2xl flex items-center justify-center">
                    ${system.icon}
                </div>
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold" style="background: linear-gradient(145deg, #50000B 0%, #3A0008 100%);">
                    ${system.number}
                </div>
            </div>
            
            <!-- Title -->
            <h3 class="font-arizona text-[28px] text-[#50000b] mb-4">${system.name} Support</h3>
            
            <!-- Subtitle with line -->
            <div class="flex items-center gap-3 mb-6">
                <div class="w-20 h-px bg-[#50000b]"></div>
                <p class="text-[11px] text-[#50000b] font-medium uppercase tracking-[0.15em]">${system.subtitle}</p>
            </div>
            
            <!-- Description -->
            <p class="text-[#50000b] text-[13px] leading-[1.75] mb-8">${system.description}</p>
            
            <!-- Badge -->
            ${system.badge ? `
                <div
                style="
                background: linear-gradient(135deg, rgba(80, 0, 11, 0.04) 0%, transparent 100%);
                "
                class="inline-flex items-center gap-3  border border-[#e8d8d8] text-[#50000b] px-5 py-3 rounded-full shadow-sm">
                    <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                    <span class="text-[13px] text-[#50000b]">${system.badge}</span>
                </div>
            ` : ''}
            
            <!-- Background SVG watermark -->
            <div class="absolute bottom-0 right-0 w-48 h-48 opacity-[0.07] pointer-events-none">
               ${system.icon}
            </div>
        </div>
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
