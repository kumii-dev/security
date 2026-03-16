/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Kumii olive-green primary ──────────────────────────────────────
        // Built from --olive-green: #7a8567 and --sage-green: #c5df96
        primary: {
          50:  '#f5f7f2',   // near-white tint
          100: '#e8eddf',   // very light sage
          200: '#d3dfbe',   // light sage
          300: '#c5df96',   // --sage-green (highlight / active bg)
          400: '#adc47a',
          500: '#96ab61',
          600: '#7a8567',   // --olive-green / --primary-color
          700: '#6a7558',   // --orange-hover (hover state)
          800: '#55603f',
          900: '#3e4a28',
          950: '#282f18',
        },
        // ── Sage / success ─────────────────────────────────────────────────
        secondary: {
          50:  '#f5f7f2',
          100: '#e8eddf',
          200: '#d3dfbe',
          300: '#c5df96',   // --success-color / --sage-green
          400: '#adc47a',
          500: '#96ab61',
          600: '#7a8567',
          700: '#6a7558',
          800: '#55603f',
          900: '#3e4a28',
        },
        // ── Accent (neutral warm tones) ────────────────────────────────────
        accent: {
          50:  '#f5f7f2',
          100: '#e8eddf',
          200: '#d3dfbe',
          300: '#c5df96',
          400: '#adc47a',
          500: '#96ab61',
          600: '#7a8567',
          700: '#6a7558',
        },
        // ── Surface / layout ───────────────────────────────────────────────
        surface: {
          DEFAULT: '#F5F5F3',   // --light-bg / --gray-light
          card:    '#ffffff',
          border:  '#E5E5E3',   // --border-color / --gray-medium
          muted:   '#666666',   // --secondary-color / --text-secondary
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(122,133,103,0.15)',
        nav:        '0 1px 0 0 #E5E5E3',
      },
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
