/**
 * Brilliant Minds Section Component
 * Displays 3x3 grid of scientific advisory board members
 */

/* ================= STATE ================= */
let brilliantMindsData = null;

/* ================= LOAD ================= */
async function loadBrilliantMindsData() {
    try {
        const response = await fetch('./data/brilliant-minds.json');
        brilliantMindsData = await response.json();
        renderBrilliantMinds();
    } catch (error) {
        console.error('Error loading brilliant minds data:', error);
    }
}

/* ================= RENDER ================= */
function renderBrilliantMinds() {
    const container = document.getElementById('brilliant-minds-grid');
    if (!container || !brilliantMindsData) return;

    // Render header
    const headerContainer = document.getElementById('brilliant-minds-header');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <span class="inline-block bg-brand-burgundy/10 text-brand-burgundy text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wide mb-4">
                ${brilliantMindsData.sectionTag}
            </span>
            <h2 class="font-serif text-3xl md:text-4xl mb-3">${brilliantMindsData.sectionTitle}</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">${brilliantMindsData.sectionSubtitle}</p>
        `;
    }

    // Render expert cards
    container.innerHTML = brilliantMindsData.experts.map(expert => `
        <div class="expert-card-item" data-expert="${expert.id}">
            <div class="expert-photo">
                <img src="${expert.image}" alt="${expert.name}" loading="lazy" />
            </div>
            <div class="expert-details">
                <h3 class="expert-name">${expert.name}</h3>
                <p class="expert-title">${expert.title}</p>
            </div>
            <button class="expert-expand-btn" aria-label="Learn more about ${expert.name}">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    `).join('');

    // Add click listeners for expand buttons
    container.querySelectorAll('.expert-expand-btn').forEach(btn => {
        btn.addEventListener('click', handleExpertExpand);
    });
}

/* ================= INTERACTIONS ================= */
function handleExpertExpand(e) {
    const card = e.currentTarget.closest('.expert-card-item');
    const expertId = card.dataset.expert;
    // Future: Open modal/popup with full bio
    console.log('Expand expert:', expertId);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadBrilliantMindsData);
