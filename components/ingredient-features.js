/**
 * Ingredient Features Component
 * Displays 3 feature cards highlighting ingredient quality
 */

/* ================= STATE ================= */
let ingredientFeaturesData = [];

/* ================= LOAD ================= */
async function loadIngredientFeaturesData() {
    try {
        const response = await fetch('./data/ingredient-features.json');
        const data = await response.json();
        ingredientFeaturesData = data.ingredientFeatures;
        renderIngredientFeatures();
    } catch (error) {
        console.error('Error loading ingredient features data:', error);
    }
}

/* ================= RENDER ================= */
function renderIngredientFeatures() {
    const container = document.getElementById('ingredient-features-grid');
    if (!container) return;

    container.innerHTML = ingredientFeaturesData.map(feature => `
        <div class="feature-card">
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <h3 class="feature-title">${feature.title}</h3>
            <p class="feature-description">${feature.description}</p>
        </div>
    `).join('');
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadIngredientFeaturesData();
});
