/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    theme: {
      extend: {
        keyframes: {
          floatUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          pulseHeart: {
            '0%, 100%': { transform: 'scale(1)', opacity: '1' },
            '50%': { transform: 'scale(1.1)', opacity: '0.9' },
          },
        },
        animation: {
          floatUp: 'floatUp 0.5s ease-out forwards',
          pulseHeart: 'pulseHeart 1.5s ease-in-out infinite',
        },
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        disabledOpacity: "0.3",
        radius: {
          small: "2px",
          medium: "4px",
          large: "6px",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },
      },
      themes: {
        light: {},
        dark: {},
      },
    }),
  ],
};
