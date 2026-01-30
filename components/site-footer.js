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

    // Render newsletter
    const newsletterHtml = `
        <div class="footer-newsletter">
            <h4 class="footer-column-title">${footerData.newsletter.title}</h4>
            <form class="newsletter-form" onsubmit="return false;">
                <input type="email" placeholder="${footerData.newsletter.placeholder}" class="newsletter-input" />
                <button type="submit" class="newsletter-btn">${footerData.newsletter.button}</button>
            </form>
            <p class="newsletter-disclaimer">${footerData.newsletter.disclaimer}</p>
        </div>
    `;

    container.innerHTML = `
        <div class="footer-columns-grid">
            ${columnsHtml}
            ${newsletterHtml}
        </div>
    `;

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

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadFooterData);
