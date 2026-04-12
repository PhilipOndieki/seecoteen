/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        primary: '#1E2A3A',
        accent: '#E07B39',
        'accent-secondary': '#6B9E78',
        surface: '#FFFFFF',
        error: '#C0392B',
        warning: '#E67E22',
        disabled: '#BDC3C7',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        input: '6px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(30, 42, 58, 0.08)',
        'card-hover': '0 4px 24px rgba(30, 42, 58, 0.14)',
        modal: '0 8px 40px rgba(30, 42, 58, 0.18)',
      },
      spacing: {
        'section-desktop': '64px',
        'section-mobile': '40px',
        'card': '24px',
      },
    },
  },
  plugins: [],
}
