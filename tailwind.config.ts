import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A2540",
          50: "#E8EDF2",
          100: "#C5D0DD",
          200: "#8FA3B8",
          300: "#5A7592",
          400: "#2D4A6B",
          500: "#0A2540",
          600: "#081E34",
          700: "#061728",
          800: "#04111D",
          900: "#020812",
        },
        orange: {
          DEFAULT: "#FF6B35",
          50: "#FFEDE5",
          100: "#FFD4BF",
          200: "#FFB494",
          300: "#FF9469",
          400: "#FF7A4F",
          500: "#FF6B35",
          600: "#E55322",
          700: "#B23F19",
          800: "#7F2D11",
          900: "#4D1B0A",
        },
        success: "#00C853",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(10, 37, 64, 0.12)",
        card: "0 12px 40px -12px rgba(10, 37, 64, 0.25)",
        glow: "0 0 60px -10px rgba(255, 107, 53, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
