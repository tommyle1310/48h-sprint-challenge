/**
 * Sticky Footer CTA Component
 * Handles the fixed-position footer bar with dynamic pricing
 */

/* ================= STATE ================= */
let footerVisible = false;
let helpChatOpen = false;

/* ================= INIT ================= */
function initStickyFooter() {
    const footer = document.getElementById('sticky-footer-cta');
    const footerAddToCart = document.getElementById('footer-add-to-cart');

    if (!footer) return;

    // Show footer immediately on page load
    showFooter();
    
    // Create chat bubble
    createChatBubble();
    
    // Initialize exclusive badge (separate from footer)
    initExclusiveBadge();
    
    // Initialize custom dropdown
    initFooterPlanDropdown();

    // Footer Add to Cart
    if (footerAddToCart) {
        footerAddToCart.addEventListener('click', () => {
            // Same action as main add to cart
            const mainBtn = document.getElementById('main-add-to-cart');
            if (mainBtn) mainBtn.click();
        });
    }

    // Listen for state changes
    document.addEventListener('formatChange', updateFooterDisplay);
    document.addEventListener('subscriptionChange', updateFooterDisplay);
}

/* ================= CUSTOM DROPDOWN ================= */
function initFooterPlanDropdown() {
    const dropdown = document.getElementById('footer-plan-dropdown');
    const trigger = document.getElementById('footer-plan-trigger');
    const menu = document.getElementById('footer-plan-menu');
    
    if (!dropdown || !trigger || !menu) return;
    
    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !menu.classList.contains('hidden');
        if (isOpen) {
            closeFooterDropdown();
        } else {
            openFooterDropdown();
        }
    });
    
    // Handle option selection
    menu.querySelectorAll('.footer-plan-option').forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const label = option.dataset.label;
            const price = option.dataset.price;
            
            // Update selected display
            const labelEl = trigger.querySelector('.footer-plan-label');
            const priceEl = trigger.querySelector('.footer-plan-price');
            if (labelEl) labelEl.textContent = label;
            if (priceEl) priceEl.textContent = price;
            
            // Update selected state
            menu.querySelectorAll('.footer-plan-option').forEach(opt => {
                opt.classList.toggle('selected', opt === option);
            });
            
            // Close dropdown
            closeFooterDropdown();
            
            // Update global state
            if (window.productState) {
                window.productState.subscription = value;
            }

            // Trigger subscription change
            document.dispatchEvent(new CustomEvent('subscriptionChange', {
                detail: { subscription: value }
            }));

            // Update main page subscription cards
            updateMainPageSubscription(value);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            closeFooterDropdown();
        }
    });
}

function openFooterDropdown() {
    const dropdown = document.getElementById('footer-plan-dropdown');
    const menu = document.getElementById('footer-plan-menu');
    if (dropdown && menu) {
        dropdown.classList.add('open');
        menu.classList.remove('hidden');
    }
}

function closeFooterDropdown() {
    const dropdown = document.getElementById('footer-plan-dropdown');
    const menu = document.getElementById('footer-plan-menu');
    if (dropdown && menu) {
        dropdown.classList.remove('open');
        menu.classList.add('hidden');
    }
}

/* ================= VISIBILITY ================= */
function showFooter() {
    const footer = document.getElementById('sticky-footer-cta');
    if (footer && !footerVisible) {
        footer.classList.add('visible');
        footerVisible = true;
    }
}

function hideFooter() {
    const footer = document.getElementById('sticky-footer-cta');
    if (footer && footerVisible) {
        footer.classList.remove('visible');
        footerVisible = false;
    }
}

/* ================= SYNC ================= */
function updateFooterDisplay() {
    if (!window.productState) return;

    const { format, subscription } = window.productState;

    // Update format display
    const formatDisplay = document.getElementById('footer-format-display');
    if (formatDisplay) {
        const formatName = format === 'jar' ? 'Forever Jar' : 'Single-Serve Sachets';
        formatDisplay.textContent = `(${formatName})`;
    }

    // Update custom dropdown
    const menu = document.getElementById('footer-plan-menu');
    const trigger = document.getElementById('footer-plan-trigger');
    if (menu && trigger) {
        const option = menu.querySelector(`[data-value="${subscription}"]`);
        if (option) {
            const label = option.dataset.label;
            const price = option.dataset.price;
            
            const labelEl = trigger.querySelector('.footer-plan-label');
            const priceEl = trigger.querySelector('.footer-plan-price');
            if (labelEl) labelEl.textContent = label;
            if (priceEl) priceEl.textContent = price;
            
            menu.querySelectorAll('.footer-plan-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === subscription);
            });
        }
    }
}

function updateMainPageSubscription(planId) {
    // Update subscription cards on main page
    document.querySelectorAll('.subscription-card').forEach(card => {
        card.setAttribute('data-selected', card.dataset.plan === planId);
        const input = card.querySelector('input');
        if (input) input.checked = card.dataset.plan === planId;
    });
}

/* ================= EXCLUSIVE BADGE ================= */
function initExclusiveBadge() {
    const exclusiveBadge = document.getElementById('exclusive-badge');
    const closeBadgeBtn = document.getElementById('close-exclusive-badge');

    if (!exclusiveBadge) return;

    // Close exclusive badge
    if (closeBadgeBtn) {
        closeBadgeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exclusiveBadge.classList.add('hidden');
        });
    }

    // Click exclusive badge to open welcome gift modal
    exclusiveBadge.addEventListener('click', (e) => {
        // Don't trigger if clicking the close button
        if (e.target.id === 'close-exclusive-badge' || e.target.closest('#close-exclusive-badge')) {
            return;
        }
        if (window.showWelcomeGiftModal) {
            window.showWelcomeGiftModal();
        }
    });
}

/* ================= CHAT BUBBLE ================= */
function createChatBubble() {
    // Create chat bubble element
    const chatBubble = document.createElement('div');
    chatBubble.id = 'chat-bubble';
    chatBubble.className = 'chat-bubble';
    chatBubble.innerHTML = `
        <div class="chat-bubble-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </div>
    `;
    document.body.appendChild(chatBubble);

    // Create help chat modal
    const helpModal = document.createElement('div');
    helpModal.id = 'help-chat-modal';
    helpModal.className = 'help-chat-modal hidden';
    helpModal.innerHTML = `
        <div class="help-chat-backdrop" data-close-help></div>
        <div class="help-chat-panel">
            <div class="help-chat-header">
                <div class="help-chat-logo">I · M · 8<sup>™</sup></div>
                <button class="help-chat-close" data-close-help aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <h2 class="help-chat-title">How can we help you today?</h2>
            
            <div class="help-chat-content">
                <div class="help-faq-list">
                    <button class="help-faq-item">
                        <span>Why IM8?</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button class="help-faq-item">
                        <span>30-Day Satisfaction Guarantee</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button class="help-faq-item">
                        <span>Manage my subscription</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button class="help-faq-item">
                        <span>Tracking not updating</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button class="help-faq-item">
                        <span>Billing help: what to expect</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="help-action-card">
                    <div class="help-action-icon">
                        <i class="fa-solid fa-box"></i>
                    </div>
                    <div class="help-action-text">
                        <span class="help-action-title">Track and manage my orders</span>
                    </div>
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
                
                <div class="help-message-card">
                    <div class="help-message-avatar">
                        <span class="avatar-logo">I·M·8</span>
                        <span class="avatar-status"></span>
                    </div>
                    <div class="help-message-text">
                        <span class="help-message-title">Welcome to IM8</span>
                        <span class="help-message-subtitle">Send us a message</span>
                    </div>
                    <i class="fa-solid fa-paper-plane"></i>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(helpModal);

    // Bind events
    chatBubble.addEventListener('click', openHelpChat);
    helpModal.querySelectorAll('[data-close-help]').forEach(el => {
        el.addEventListener('click', closeHelpChat);
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpChatOpen) {
            closeHelpChat();
        }
    });
}

function openHelpChat() {
    const modal = document.getElementById('help-chat-modal');
    const bubble = document.getElementById('chat-bubble');
    if (modal) {
        helpChatOpen = true;
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        if (bubble) bubble.classList.add('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeHelpChat() {
    const modal = document.getElementById('help-chat-modal');
    const bubble = document.getElementById('chat-bubble');
    if (modal) {
        helpChatOpen = false;
        modal.classList.remove('visible');
        modal.classList.add('hidden');
        if (bubble) bubble.classList.remove('hidden');
        document.body.style.overflow = '';
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    initStickyFooter();
});
