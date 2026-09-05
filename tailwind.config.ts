import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0C3465", navy2: "#0A2C55", blue: "#1A56A0", blue2: "#2E6BB8",
        sky: "#E7F0F9", sky2: "#F4F8FC", line: "#DCE5EF",
        orange: "#F26A21", orangeD: "#D8550F",
        ink: "#13233A", mut: "#5B6B7E",
        ok: "#1D8A4E", okBg: "#E9F6EE", warn: "#C98A0A", warnBg: "#FBF3E1",
        bad: "#C0392B", badBg: "#FBEAE8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;