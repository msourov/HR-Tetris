import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "custom-lg": "1152px",
      },
      maxWidth: {
        "custom-lg": "1152px",
      },
    },
  },
  plugins: [tailwindScrollbar],
};
