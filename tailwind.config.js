/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        'room-code': ['Space Grotesk', 'monospace'],
        'label-md': ['Space Grotesk', 'sans-serif'],
        'label-lg': ['Space Grotesk', 'sans-serif'],
        'headline-md': ['Space Grotesk', 'sans-serif'],
        'headline-sm': ['Space Grotesk', 'sans-serif'],
        'headline-lg': ['Space Grotesk', 'sans-serif'],
        'caption': ['Plus Jakarta Sans', 'sans-serif'],
        'body-sm': ['Plus Jakarta Sans', 'sans-serif'],
        'body-md': ['Plus Jakarta Sans', 'sans-serif'],
        'body-lg': ['Plus Jakarta Sans', 'sans-serif']
      },
      colors: {
        canvas: '#0B0E17',
        surface: '#10131c',
        'surface-bright': '#202538',
        'surface-dark': '#0F121E',
        'surface-card': '#1A1D2B',
        'surface-raised': '#25293C',
        'surface-container-lowest': '#0b0e17',
        'surface-container-low': '#181b25',
        'surface-container': '#1c1f29',
        'surface-container-high': '#272a34',
        'surface-container-highest': '#32343f',
        'on-surface': '#e0e2ef',
        'on-surface-variant': '#e2bebc',
        border: '#262B40',
        'border-light': '#363D5A',
        amber: { gold: '#FFB703' },
        sunset: { coral: '#FF5A5F' },
        duo: { rose: '#F72585' },
        mint: { green: '#4ADE80' },
        primary: '#ffb3b0',
        'primary-container': '#ff5a5f',
        'on-primary': '#680010',
        'on-primary-container': '#61000e',
        secondary: '#ffd795',
        'secondary-container': '#fbb400',
        'on-secondary': '#422c00',
        'on-secondary-container': '#694900',
        'secondary-fixed': '#ffdea9',
        'secondary-fixed-dim': '#ffba27',
        tertiary: '#4de082',
        'tertiary-container': '#00aa57',
        'on-tertiary': '#003919',
        'tertiary-fixed': '#6dfe9c',
        'tertiary-fixed-dim': '#4de082',
        outline: '#a98988',
        'outline-variant': '#5a403f'
      },
      boxShadow: {
        'glow-coral': '0 0 35px -5px rgba(255, 90, 95, 0.35)',
        'glow-amber': '0 0 35px -5px rgba(255, 183, 3, 0.35)',
        'glow-rose': '0 0 35px -5px rgba(247, 37, 133, 0.35)',
        'glow-mint': '0 0 30px -5px rgba(74, 222, 128, 0.3)'
      },
      spacing: {
        'card-padding': '1.25rem',
        'margin-mobile': '1.25rem',
        'gutter-mobile': '1rem'
      }
    }
  }
}
