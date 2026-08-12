import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        fontFamily: {
          sans: ['"Creato Display"', 'system-ui', 'sans-serif'],
          display: ['"Creato Display"', 'system-ui', 'sans-serif'],
          outfit: ['Outfit', 'sans-serif'],
        },
        colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float-random-1": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(20px, -30px) rotate(5deg)" },
          "50%": { transform: "translate(-15px, -50px) rotate(-3deg)" },
          "75%": { transform: "translate(25px, -20px) rotate(7deg)" },
        },
        "float-random-2": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(-30px, -25px) rotate(-8deg)" },
          "50%": { transform: "translate(25px, -45px) rotate(4deg)" },
          "75%": { transform: "translate(-20px, -15px) rotate(-6deg)" },
        },
        "float-random-3": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(15px, -35px) rotate(6deg)" },
          "66%": { transform: "translate(-25px, -25px) rotate(-4deg)" },
        },
        "float-random-4": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(-20px, -40px) rotate(-5deg)" },
          "50%": { transform: "translate(30px, -30px) rotate(8deg)" },
          "75%": { transform: "translate(-10px, -50px) rotate(-3deg)" },
        },
        "float-random-5": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(25px, -20px) rotate(7deg)" },
          "66%": { transform: "translate(-15px, -40px) rotate(-5deg)" },
        },
        "float-random-6": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(20px, -35px) rotate(4deg)" },
          "50%": { transform: "translate(-25px, -25px) rotate(-6deg)" },
          "75%": { transform: "translate(15px, -45px) rotate(5deg)" },
        },
        "float-random-7": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(-20px, -30px) rotate(-7deg)" },
          "66%": { transform: "translate(30px, -40px) rotate(6deg)" },
        },
        "float-random-8": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(-15px, -45px) rotate(-4deg)" },
          "50%": { transform: "translate(20px, -20px) rotate(7deg)" },
          "75%": { transform: "translate(-30px, -35px) rotate(-5deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-random-1": "float-random-1 15s ease-in-out infinite",
        "float-random-2": "float-random-2 18s ease-in-out infinite",
        "float-random-3": "float-random-3 20s ease-in-out infinite",
        "float-random-4": "float-random-4 17s ease-in-out infinite",
        "float-random-5": "float-random-5 19s ease-in-out infinite",
        "float-random-6": "float-random-6 16s ease-in-out infinite",
        "float-random-7": "float-random-7 21s ease-in-out infinite",
        "float-random-8": "float-random-8 14s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
