/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ethereal: {
          purple: '#7c3aed',
          blue: '#0891b2',
          bg: '#f8fafc',
          text: '#0f172a',
          muted: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
