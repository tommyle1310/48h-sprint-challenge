/**
 * Welcome Gift Modal Component
 * Email capture modal with health goal selection
 */

/* ================= STATE ================= */
let welcomeGiftData = null;
let isModalOpen = false;

/* ================= LOAD ================= */
async function loadWelcomeGiftData() {
    try {
        const response = await fetch('./data/welcome-gift-modal.json');
        welcomeGiftData = await response.json();
        renderWelcomeGiftModal();
    } catch (error) {
        console.error('Error loading welcome gift modal data:', error);
    }
}

/* ================= RENDER ================= */
function renderWelcomeGiftModal() {
    const container = document.getElementById('welcome-gift-modal');
    if (!container || !welcomeGiftData) return;

    container.innerHTML = `
        <!-- Backdrop -->
        <div class="modal-backdrop" data-close-modal></div>
        
        <!-- Modal Wrapper (for positioning close button outside content) -->
        <div class="modal-wrapper">
            <!-- Close Button (outside content box) -->
            <button class="modal-close-btn" aria-label="Close modal" data-close-modal>
                <i class="fa-solid fa-xmark"></i>
            </button>
            
            <!-- Modal Content -->
            <div class="modal-content">
                <!-- Badge -->
                <div class="modal-badge">
                    <span>${welcomeGiftData.badge}</span>
                </div>
                
                <!-- Title -->
                <h2 class="modal-title">${welcomeGiftData.title}</h2>
                <p class="modal-value">${welcomeGiftData.value}</p>
                
                <!-- Email Input -->
                <input 
                    type="email" 
                    class="modal-email-input" 
                    placeholder="${welcomeGiftData.emailPlaceholder}" 
                    id="welcome-gift-email"
                />
                
                <!-- Goal Prompt -->
                <p class="modal-prompt">${welcomeGiftData.prompt}</p>
                
                <!-- Goal Buttons -->
                <div class="modal-goals">
                    ${welcomeGiftData.goals.map(goal => `
                        <button class="goal-btn" data-goal="${goal.id}">
                            ${goal.label}
                        </button>
                    `).join('')}
                </div>
                
                <!-- Dismiss Link -->
                <button class="modal-dismiss" data-close-modal>${welcomeGiftData.dismissText}</button>
            </div>
        </div>
    `;

    // Attach event listeners
    attachModalEventListeners();
}

/* ================= EVENT LISTENERS ================= */
function attachModalEventListeners() {
    const modal = document.getElementById('welcome-gift-modal');
    if (!modal) return;

    // Close button, backdrop, and dismiss link
    modal.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', hideWelcomeGiftModal);
    });

    // Prevent modal wrapper and content click from closing
    const wrapper = modal.querySelector('.modal-wrapper');
    if (wrapper) {
        wrapper.addEventListener('click', (e) => e.stopPropagation());
    }

    // Goal buttons
    modal.querySelectorAll('.goal-btn').forEach(btn => {
        btn.addEventListener('click', handleGoalSelection);
    });

    // Escape key to close
    document.addEventListener('keydown', handleEscapeKey);
}

function handleGoalSelection(e) {
    const goal = e.currentTarget.dataset.goal;
    const email = document.getElementById('welcome-gift-email')?.value;
    
    console.log('Goal selected:', goal, 'Email:', email);
    
    // Visual feedback - highlight selected button
    const buttons = document.querySelectorAll('.goal-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    
    // In a real implementation, this would submit to a server
    // For now, just close after a brief delay
    setTimeout(() => {
        hideWelcomeGiftModal();
    }, 300);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape' && isModalOpen) {
        hideWelcomeGiftModal();
    }
}

/* ================= SHOW/HIDE ================= */
function showWelcomeGiftModal() {
    const modal = document.getElementById('welcome-gift-modal');
    if (!modal) return;

    isModalOpen = true;
    modal.classList.remove('hidden');
    modal.classList.add('visible');
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus email input
    setTimeout(() => {
        document.getElementById('welcome-gift-email')?.focus();
    }, 100);
}

function hideWelcomeGiftModal() {
    const modal = document.getElementById('welcome-gift-modal');
    if (!modal) return;

    isModalOpen = false;
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    
    // Unlock body scroll
    document.body.style.overflow = '';
}

/* ================= TRIGGER SETUP ================= */
function setupModalTrigger() {
    // Trigger button (if exists)
    const triggerBtn = document.getElementById('open-welcome-gift-modal');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', showWelcomeGiftModal);
    }
    
    // Auto-show after delay (optional - uncomment to enable)
    // setTimeout(showWelcomeGiftModal, 5000);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadWelcomeGiftData();
    setupModalTrigger();
});

// Expose functions globally for external triggering
window.showWelcomeGiftModal = showWelcomeGiftModal;
window.hideWelcomeGiftModal = hideWelcomeGiftModal;
