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
        coloryellowlight: "#FEF097",
        coloryellow: "#E6C25E",
        colorpurple: "#6C1E73",
        colorblue: "#1060D8",
      },
    },
  },
  plugins: [],
};
