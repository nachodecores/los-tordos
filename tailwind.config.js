/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobilM: "376px",
      mobilL: "424px",
      mobilXL: "555px",
      tablet: "769px",
      semilaptop: "900px",
      laptop: "1023px",
      laptopL: "1439px",
    },
    extend: {
      colors: {
        colorwhite: "#F6F0E2",
        colorblack: "#2E2D30",
        coloryellow1: "#E6C25E",
        coloryellow2: "#F6EECB",
        coloryellow3: "#C8B66F",
        coloryellow4: "#9E8148",
        coloryellow5: "#96743F",
        colorpurple1: "#6C1E73",
        colorpurple2: "#614563",
        colorpurple3: "#4A224B",
        colorpurple4: "#3C1634",
        colorpurple5: "#201421",
      },
    },
  },
  darkMode: "class",
};
