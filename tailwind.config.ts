import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0B0C",
          panel: "#141416",
          panel2: "#1B1B1E",
          border: "#2A2A2E",
        },
        gold: {
          DEFAULT: "#D4AF37",
          deep: "#B8860B",
          soft: "#F6D98A",
        },
        silver: {
          DEFAULT: "#C7C9CC",
          light: "#EDEEF0",
        },
        cream: "#F3F2EE",
        dim: "#A6A6A2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F6D98A, #D4AF37, #A9801E)",
        "gold-sheen":
          "linear-gradient(120deg, rgba(246,217,138,0) 0%, rgba(246,217,138,0.35) 45%, rgba(246,217,138,0) 60%)",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212,175,55,0.35), 0 20px 60px -20px rgba(212,175,55,0.25)",
        panel: "0 30px 80px -40px rgba(0,0,0,0.8)",
      },
      letterSpacing: {
        widetitle: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
