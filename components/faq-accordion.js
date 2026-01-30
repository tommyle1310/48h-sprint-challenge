/**
 * FAQ Accordion Component
 * Two-column layout with exclusive-open accordion behavior
 */

/* ================= STATE ================= */
let faqsData = null;
let openFaqId = 'what-is-im8'; // First FAQ open by default

/* ================= LOAD ================= */
async function loadFaqsData() {
    try {
        const response = await fetch('./data/faqs.json');
        faqsData = await response.json();
        renderFaqSection();
    } catch (error) {
        console.error('Error loading FAQs data:', error);
    }
}

/* ================= RENDER ================= */
function renderFaqSection() {
    const container = document.getElementById('faq-accordion');
    if (!container || !faqsData) return;

    // Render title
    const titleContainer = document.getElementById('faq-title');
    if (titleContainer) {
        titleContainer.textContent = faqsData.sectionTitle;
    }

    // Render explore button
    const exploreBtn = document.getElementById('faq-explore-btn');
    if (exploreBtn) {
        exploreBtn.textContent = faqsData.exploreButtonText;
    }

    // Render lifestyle image
    const imageContainer = document.getElementById('faq-lifestyle-image');
    if (imageContainer) {
        imageContainer.innerHTML = `<img src="${faqsData.lifestyleImage}" alt="Healthy lifestyle" class="w-full h-full object-cover" />`;
    }

    // Render FAQ accordion items
    container.innerHTML = faqsData.faqs.map(faq => {
        const isOpen = faq.id === openFaqId;
        return `
            <div class="faq-item ${isOpen ? 'open' : ''}" data-faq="${faq.id}">
                <button class="faq-question" aria-expanded="${isOpen}">
                    <span class="faq-question-text">${faq.question}</span>
                    <span class="faq-icon">
                        <i class="fa-solid fa-${isOpen ? 'minus' : 'plus'}"></i>
                    </span>
                </button>
                <div class="faq-answer" style="${isOpen ? '' : 'max-height: 0;'}">
                    <div class="faq-answer-inner">
                        ${faq.answer.split('\n\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click listeners
    container.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', handleFaqToggle);
    });
}

/* ================= INTERACTIONS ================= */
function handleFaqToggle(e) {
    const item = e.currentTarget.closest('.faq-item');
    const faqId = item.dataset.faq;
    const wasOpen = item.classList.contains('open');

    // Close all items
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('open');
        faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        faqItem.querySelector('.faq-icon i').className = 'fa-solid fa-plus';
        faqItem.querySelector('.faq-answer').style.maxHeight = '0';
    });

    // Open clicked item if it wasn't already open
    if (!wasOpen) {
        item.classList.add('open');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-icon i').className = 'fa-solid fa-minus';
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        openFaqId = faqId;
    } else {
        openFaqId = null;
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadFaqsData);
