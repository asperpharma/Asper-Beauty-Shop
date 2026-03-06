import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // "Morning Spa" Palette — Authentic Quality (Medical Luxury)
        "soft-ivory": "#F8F8FF", // The Digital Tray / canvas
        maroon: "#800020", // The Anchor / Action
        "shiny-gold": "#C5A028", // The Seal of Authenticity / structure
        "dark-charcoal": "#333333", // Clinical Readability / text
        // Aliases from Design System doc (DESIGN_SYSTEM.md)
        canvas: "#F8F8FF",
        action: "#800020",
        structure: "#C5A028",
        text: "#333333",

        // Shadcn UI Defaults (Mapped to our palette)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#C5A028", // Gold Focus Rings
        background: "#F8F8FF", // Global Ivory Background
        foreground: "#333333",
        primary: {
          DEFAULT: "#800020", // Maroon
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F8F8FF", // Ivory
          foreground: "#800020",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F1F1F1",
          foreground: "#800020",
        },
        accent: {
          DEFAULT: "#FFFFFF", // White Cards
          foreground: "#800020",
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"], // Luxury
        body: ["Montserrat", "sans-serif"], // Science
        rtl: ["Tajawal", "sans-serif"], // Localization
      },
      borderWidth: {
        1: "1px", // Fine, elegant line for the Gold Stitch
      },
      boxShadow: {
        tray:
          "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)", // Subtle "Clinical" shadow
        "midas-glow": "0 10px 30px -10px rgba(197, 160, 40, 0.15)", // Midas Touch: Seal of Authenticity
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
      transitionDuration: {
        400: "400ms", // Midas Touch (Brand Strategy §5)
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
