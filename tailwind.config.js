/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./components/**/*.js"
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'brand-burgundy': '#8B1E3F',
        'brand-burgundy-light': '#fdf8f8',
        'brand-cream': '#FAF9F6',
        'brand-green': '#16a34a',
        'text-primary': '#50000b',
        'text-secondary': '#666666',
        'border-default': '#e5e5e5',
      },
      fontSize: {
        'xxs': '10px',
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'sans': ['Aeonik', 'Inter', 'system-ui', 'sans-serif'],
        'architekt': ['NB Architekt', 'sans-serif'],
        'arizona': ['ABC Arizona Flare', 'Georgia', 'serif'],
        'aeonik': ['Aeonik', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'footer': '0 -4px 12px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
