/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F97316",
          dark: "#EF4444",
        },
        sidebar: {
          start: "#F97316",
          end: "#EF4444",
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, #F97316, #EF4444)',
        'gradient-primary-horiz': 'linear-gradient(to right, #F97316, #EF4444)',
        'gradient-card-orange': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-card-green': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-card-purple': 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
        'gradient-card-indigo': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
