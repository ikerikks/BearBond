/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import daisyUIThemes, { light } from 'daisyui/src/theming/themes';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable'],
      },
      keyframes: {
        like: {
          '0%': { 'background-position': 'left' },
          '100%': { 'background-position': 'right' }
        },
        star: {
          '0%': { 
            'background-position': 'left',
            'transform': 'scale(1.5)'
          },
          '100%': { 
            'background-position': 'right',
            'transform': 'scale(0.7)'
          }
        }
      },
      animation: {
        like: 'like 0.7s steps(28) forwards',
        star: 'like 0.7s steps(55) forwards'
      },
      scrollbar: {
        thinest: '2px'
      },
    },
  },
  plugins: [
    daisyui,
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyUIThemes['light'],
          primary: "#E91C51",
          secondary: "#657786", // Subtle gray for borders/text
          accent: "#F5F8FA", // Light gray for cards/backgrounds
          neutral: "#14171A", // Dark gray for main text
          "base-100": "#FFFFFF", // White for the main background
          "base-200": "#fbfbfb",
          "base-300": "#f7f7f7",
          info: "#1DA1F2", // Informational blue
          success: "#2ECC71", // Green for success messages
          warning: "#FBBC04", // Yellow for warnings
          error: "#ff2c2c", // Red for errors

        }
      },
      "dark",
      "black", 
    ],
  },
}

