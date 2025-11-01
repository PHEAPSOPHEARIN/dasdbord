/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scan all React/TypeScript files
  ],
  theme: {
    extend: {
      colors: {
        // 🌈 Brand colors for your company dashboard
        primary: {
          DEFAULT: "#2563EB", // main blue
          light: "#60A5FA",
          dark: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#10B981", // teal/green accent
          light: "#6EE7B7",
          dark: "#065F46",
        },
        background: "#F9FAFB", // soft background
        surface: "#FFFFFF", // card background
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.05)",
        button: "0 4px 14px rgba(37, 99, 235, 0.25)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // ✅ Better form styling
    require("@tailwindcss/typography"), // ✅ For text-rich pages
  ],
};
