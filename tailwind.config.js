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
          "--foreobject": "white",
          ".text-link": {
            color: "#2140ba",
          },
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100": "#333",
          "--foreobject": "#222",
          ".text-link": {
            color: "#66b3ff",
          },
        },
        crimson: {
          primary: "#813151",
          accent: "#00aeff",
          neutral: "#0e0a0d",
          "base-100": "#331320",
          info: "#0089ff",
          success: "#006666",
          warning: "#ff9400",
          error: "#ffffff",
          secondary: "#672741",
          "--foreobject": "#4d1d31",
          ".btn:hover": {
            "background-color": "#451a2c",
            "border-color": "#451a2c",
          },
          ".text-link": {
            color: "#66b3ff",
          },
          accent: "76.11% 0.1346 256.91"
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
