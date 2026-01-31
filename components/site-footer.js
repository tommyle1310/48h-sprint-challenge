/**
 * Site Footer Component
 * Multi-column footer with newsletter and legal disclaimers
 */

/* ================= STATE ================= */
let footerData = null;

/* ================= LOAD ================= */
async function loadFooterData() {
    try {
        const response = await fetch('./data/footer.json');
        footerData = await response.json();
        renderFooter();
    } catch (error) {
        console.error('Error loading footer data:', error);
    }
}

/* ================= RENDER ================= */
function renderFooter() {
    const container = document.getElementById('site-footer-content');
    if (!container || !footerData) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        renderMobileFooter(container);
    } else {
        renderDesktopFooter(container);
    }

    // Render logo section
    const logoContainer = document.getElementById('footer-logo-section');
    if (logoContainer) {
        logoContainer.innerHTML = `
            <div class="footer-large-logo">I · M · 8<sup>®</sup></div>
            <div class="footer-legal-links">
                <span>${footerData.legal.copyright}</span>
                <span class="separator">·</span>
                ${footerData.legal.links.map(link => `<a href="${link.url}">${link.text}</a>`).join('<span class="separator">·</span>')}
            </div>
        `;
    }

    // Render disclaimers
    const disclaimerContainer = document.getElementById('footer-disclaimers');
    if (disclaimerContainer) {
        disclaimerContainer.innerHTML = `
            <p class="fda-disclaimer">${footerData.legal.fdaDisclaimer}</p>
            <p class="welcome-kit-note">${footerData.legal.welcomeKitNote}</p>
        `;
    }
}

function renderDesktopFooter(container) {
    // Render newsletter at top for desktop
    const newsletterHtml = `
        <div class="footer-newsletter-top">
            <h4 class="footer-newsletter-title">${footerData.newsletter.title}</h4>
            <form class="newsletter-form-desktop" onsubmit="return false;">
                <input type="email" placeholder="${footerData.newsletter.placeholder}" class="newsletter-input-desktop" />
                <button type="submit" class="newsletter-btn-desktop">${footerData.newsletter.button}</button>
            </form>
            <p class="newsletter-disclaimer">${footerData.newsletter.disclaimer}</p>
        </div>
    `;

    // Render link columns
    const columnsHtml = footerData.columns.map(column => `
        <div class="footer-column">
            <h4 class="footer-column-title">${column.title}</h4>
            <ul class="footer-links">
                ${column.links.map(link => `
                    <li><a href="${link.url}">${link.text}</a></li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    container.innerHTML = `
        ${newsletterHtml}
        <div class="footer-columns-grid-desktop">
            ${columnsHtml}
        </div>
    `;
}

function renderMobileFooter(container) {
    // Render accordion columns for mobile
    const accordionHtml = footerData.columns.map((column, index) => `
        <div class="footer-accordion-item ${index === 0 ? 'open' : ''}" data-accordion="${index}">
            <button class="footer-accordion-header" aria-expanded="${index === 0}">
                <span class="footer-accordion-title">${column.title}</span>
                <span class="footer-accordion-icon">
                    <i class="fa-solid fa-${index === 0 ? 'minus' : 'plus'}"></i>
                </span>
            </button>
            <div class="footer-accordion-content" style="${index === 0 ? '' : 'max-height: 0;'}">
                <ul class="footer-links-mobile">
                    ${column.links.map(link => `
                        <li><a href="${link.url}">${link.text}</a></li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    container.innerHTML = accordionHtml;

    // Add accordion event listeners
    container.querySelectorAll('.footer-accordion-header').forEach(header => {
        header.addEventListener('click', handleFooterAccordionToggle);
    });
}

function handleFooterAccordionToggle(e) {
    const item = e.currentTarget.closest('.footer-accordion-item');
    const wasOpen = item.classList.contains('open');

    // Close all items
    document.querySelectorAll('.footer-accordion-item').forEach(accItem => {
        accItem.classList.remove('open');
        accItem.querySelector('.footer-accordion-header').setAttribute('aria-expanded', 'false');
        accItem.querySelector('.footer-accordion-icon i').className = 'fa-solid fa-plus';
        accItem.querySelector('.footer-accordion-content').style.maxHeight = '0';
    });

    // Open clicked item if it wasn't already open
    if (!wasOpen) {
        item.classList.add('open');
        item.querySelector('.footer-accordion-header').setAttribute('aria-expanded', 'true');
        item.querySelector('.footer-accordion-icon i').className = 'fa-solid fa-minus';
        const content = item.querySelector('.footer-accordion-content');
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}

// Re-render on resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (footerData) {
            renderFooter();
        }
    }, 250);
});

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadFooterData);
