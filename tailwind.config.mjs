import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-stone-cable": "linear-gradient(to bottom, #1c2541, #4a3f54)", // from your custom gradient
      },
      colors: {
        // Your custom color palette from image (hex → RGB)
        "tome-pants": "rgb(84, 33, 53)",
        "neumonum-pink": "rgb(143, 114, 125)",
        "stone-cable": "var(--stone-cable)", // using the CSS variable
        "dark-pants": "rgb(55, 33, 59)",

        // Theme colors with glass/neon support
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--background)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        glass: {
          DEFAULT: "hsl(var(--glass))",
          border: "hsl(var(--glass-border))",
          highlight: "hsl(var(--glass-highlight))",
          shadow: "var(--glass-shadow)",
        },
        neon: {
          primary: "hsl(var(--neon-primary))",
          secondary: "hsl(var(--neon-secondary))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "stagger-children": "stagger 0.5s ease-out forwards",
        "neon-pulse": "neonPulse 2s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        stagger: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        neonPulse: {
          "0%, 100%": {
            textShadow: "0 0 8px currentColor",
            boxShadow: "0 0 12px hsl(var(--neon-primary) / 0.6)",
          },
          "50%": {
            textShadow: "0 0 16px currentColor",
            boxShadow: "0 0 24px hsl(var(--neon-primary) / 0.8)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      // New glass/neon-specific utilities
      boxShadow: {
        glass: "var(--glass-shadow)",
        neon: "0 0 12px hsl(var(--neon-primary) / 0.6)",
        "neon-lg": "0 0 24px hsl(var(--neon-primary) / 0.8)",
      },
      textShadow: {
        neon: "0 0 8px currentColor",
        "neon-lg": "0 0 16px currentColor",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin for text-shadow utilities
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-neon": {
          textShadow: "0 0 8px currentColor",
        },
        ".text-shadow-neon-lg": {
          textShadow: "0 0 16px currentColor",
        },
        ".text-heading-1": {
          // fontFamily: theme("fontFamily.heading"),
          fontSize: "2.5rem",
          fontWeight: "800",
          lineHeight: "1.1",
          letterSpacing: "-0.025em",
          // color: theme("colors.foreground"),
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
