/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Even darker blue for WCAG AA compliance
        secondary: '#047857', // Darker green for WCAG AA compliance
        error: '#B91C1C', // Darker red for WCAG AA compliance
        success: '#047857', // Darker green for WCAG AA compliance
        warning: '#B45309', // Darker amber for WCAG AA compliance
        'gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}

