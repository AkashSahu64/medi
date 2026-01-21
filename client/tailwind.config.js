/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Medical Colors
        primary: {
          DEFAULT: '#0077B6', // Medical Teal cyan (Main brand color)
          50: '#E6F2F8',
          100: '#CCE4F1',
          200: '#99C9E3',
          300: '#66AED5',
          400: '#3393C7',
          500: '#0077B6', // Main
          600: '#005F92',
          700: '#00476E',
          800: '#002F4A',
          900: '#001726',
        },
        // Secondary Colors
        secondary: {
          DEFAULT: '#6B7280', // Neutral Gray (Accent only)
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Main
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Alert/Medical Accent
        alert: {
          DEFAULT: '#DC3545', // Medical Red (Very minimal use)
          50: '#FCE8EA',
          100: '#F8D1D5',
          200: '#F1A3AB',
          300: '#EA7581',
          400: '#E34757',
          500: '#DC3545', // Main
          600: '#B02A37',
          700: '#842029',
          800: '#58151B',
          900: '#2C0B0D',
        },
        // Neutral Colors
        neutral: {
          DEFAULT: '#111827', // Dark Gray/Black
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}