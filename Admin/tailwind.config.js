/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow:{
        'bottom' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'left' : '-4px 0 6px -1px rgba(0, 0, 0, 0.1)',
        'right' : '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
      },
      screens: {
        'xs': '360px',
        // => extra small
        'exs': '540px',

        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '940px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
    },
  },
  plugins: [
      require('tailwind-scrollbar-hide'),
  ],
}

