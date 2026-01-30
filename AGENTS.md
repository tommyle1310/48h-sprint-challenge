# IM8 Health Landing Page Clone - Agent Instructions

## Project Overview
This is a pixel-perfect clone of the IM8 Health product landing page featuring:
- Sticky sidebar scroll behavior (left column stays fixed while right scrolls)
- Format selection component (Forever Jar / Single-Serve Sachets)
- Subscription tier selection (90-Day / 30-Day Supply)
- Product accordions with exclusive-open behavior
- Reviews carousel
- Sticky footer CTA bar

## Project Structure
```
final-round-pixel-perfect/
├── index.html              # Main HTML with sticky scroll layout
├── input.css               # Tailwind CSS source
├── output.css              # Compiled CSS
├── main.js                 # Global state management
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies
├── components/             # JavaScript components
│   ├── format-selection.js
│   ├── subscription-selection.js
│   ├── product-images-slider.js
│   ├── product-accordions.js
│   ├── reviews-carousel.js
│   └── sticky-footer-cta.js
└── data/                   # JSON data files
    ├── product-formats.json
    ├── subscription-tiers.json
    ├── transformation-experts.json
    ├── product-accordions.json
    ├── im8-reviews.json
    ├── product-images.json
    └── ambassadors.json
```

## Component Patterns
All JS components follow the STATE/LOAD/RENDER/EVENTS pattern:
1. **STATE**: Local state variables at the top
2. **LOAD**: Async function to fetch JSON data
3. **RENDER**: Function to generate HTML and inject into container
4. **EVENTS**: Event handlers bound after render

## Global State
Global product state is stored in `window.productState`:
```javascript
window.productState = {
    format: 'jar',           // 'jar' | 'sachets'
    subscription: '90-day'   // '90-day' | '30-day' | 'one-time'
};
```

## Custom Events
Components communicate via custom events:
- `formatChange` - Fired when product format changes
- `subscriptionChange` - Fired when subscription tier changes

## Development
```bash
# Install dependencies
npm install

# Build CSS (one-time)
npm run build

# Build CSS (watch mode)
npm run build:css
```

## Key Technical Details

### Sticky Scroll Behavior
- Left column uses `position: sticky` with `top: 20px`
- Sticky behavior ends at reviews section (boundary marker)
- Responsive: Single column on mobile, no sticky

### Color Scheme
- Brand Burgundy: #8B1E3F
- Brand Cream: #FAF9F6
- Brand Green: #16a34a

### Typography
- Headings: Georgia (serif)
- Body: Inter (sans-serif)
