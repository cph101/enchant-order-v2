/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "base-100": "#e3e4eb",
          "neutral-content": "#555",
          ".footer": {
            "background-color": "white",
          },
          ".text-link": {
            color: "#2140ba",
          },
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100": "#333",
          ".footer": {
            "background-color": "#222",
          },
          ".text-link": {
            color: "#66b3ff",
          },
        },
        crimson: {
          primary: "#813151",
          secondary: "#672741",
          accent: "#00aeff",
          neutral: "#0e0a0d",
          "base-100": "#331320",
          info: "#0089ff",
          success: "#006666",
          warning: "#ff9400",
          error: "#ff284a",
          ".footer, .btn": {
            "background-color": "#4d1d31",
            "border-color": "#4d1d31",
          },
          ".btn:hover": {
            "background-color": "#451a2c",
            "border-color": "#451a2c",
          },
          ".text-link": {
            color: "#66b3ff",
          },
        },
      },
    ],
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui"),
  ],
};
