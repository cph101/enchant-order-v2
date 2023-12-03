/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "base-100": "#e3e4eb",
          "base-200": "white",
          "neutral-content": "#555",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100":"#333",
          "base-200":"#222",
        },
         crimson: {

       "primary": "#813151",
       "secondary": "#672741",
       "accent": "#00aeff",
       "neutral": "#0e0a0d",
       "base-100": "#331320",
       "base-200": "#4d1d31",
       "info": "#0089ff",
       "success": "#006666",
       "warning": "#ff9400",
       "error": "#ff284a",
         },
       }
    ],
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require('@tailwindcss/aspect-ratio'),require('@tailwindcss/forms'),require('@tailwindcss/aspect-ratio'),require("daisyui"),],
}

