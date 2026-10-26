/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B1B2F",
        paper: "#F7F1E3",
        paperDark: "#E8DCC0",
        card: "#FFFDF6",
        padYellow: '#FFF0A0',
        noteYellow: '#FFF3B0',
        background: "oklch(97% 0.01 80)",
        surface: "oklch(93% 0.02 80)",
        foreground: "oklch(25% 0.02 260)",
        primary: {
          DEFAULT: "oklch(65% 0.12 45)", 
          light: "oklch(75% 0.08 45)",
        },
        secondary: {
          DEFAULT: "oklch(75% 0.06 160)",
        },
        accent: {
          DEFAULT: "oklch(80% 0.12 90)",
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        heading: ['Quicksand', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'], // Added for the Programs section headers
        hand: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'hard': '6px 6px 0 0 #1B1B2F',
        'hard-sm': '3px 3px 0 0 #1B1B2F',
        'hard-pressed': '2px 2px 0 0 #1B1B2F',
      }
    },
  },
  plugins: [],
}