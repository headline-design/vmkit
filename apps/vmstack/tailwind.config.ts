/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        wd: "960px",
        view: "1248px",
        xlview: "1440px",
      },
      colors: {
        gray: {
          DEFAULT: "rgb(var(--gray))",
          100: "rgb(var(--gray-100))",
          200: "rgb(var(--gray-200))",
          300: "rgb(var(--gray-300))",
          400: "rgb(var(--gray-400))",
          500: "rgb(var(--gray-500))",
          600: "rgb(var(--gray-600))",
          700: "rgb(var(--gray-700))",
          800: "rgb(var(--gray-800))",
          900: "rgb(var(--gray-900))",
          1000: "hsl(var(--gray-1000))",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        "themed-bg": {
          DEFAULT: "var(--themed-bg)",
          "alt": "var(--themed-bg-alt)",
        },
        rust: {
          DEFAULT: "var(--rust-background)",
        },
        "background-100": {
          DEFAULT: "var(--ds-background-100)",
        },
        "background-200": {
          DEFAULT: "var(--ds-background-200)",
        },
        "alpha-700": {
          DEFAULT: "var(--alpha-7)",
        },
        "double-muted": {
          DEFAULT: "var(--border-muted)",
        },
        "accents-0": {
          DEFAULT: "var(--accents-0)",
        },
        "accents-1": {
          DEFAULT: "var(--accents-1)",
        },
        "accents-2": {
          DEFAULT: "var(--accents-2)",
        },
        "accents-3": {
          DEFAULT: "var(--accents-3)",
        },
        "accents-4": {
          DEFAULT: "var(--accents-4)",
        },
        "accents-5": {
          DEFAULT: "var(--accents-5)",
        },
        "accents-6": {
          DEFAULT: "var(--accents-6)",
        },
        "accents-7": {
          DEFAULT: "var(--accents-7)",
        },
        "accents-8": {
          DEFAULT: "var(--accents-8)",
        },
        "ds-gray-1000": {
          DEFAULT: "var(--ds-gray-1000)",
        },
        "ds-100": {
          DEFAULT: "var(--ds-background-100)",
        },
        "ds-200": {
          DEFAULT: "var(--ds-background-200)",
        },
        "ds-gray-200": {
          DEFAULT: "var(--ds-gray-200)",
        },
        "ds-gray-900": {
          DEFAULT: "var(--ds-gray-900)",
        },
        "input-1": {
          DEFAULT: "var(--ds-background-100)",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          accent: "var(--primary-background)",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          accent: "var(--primary-accent)",
        },
        tooltip: {
          DEFAULT: "var(--primary-foreground-2)",
          foreground: "var(--primary-accent)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
          hover: "var(--destructive-hover)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          accent: "hsl(var(--success-accent))",
        },
        error: {
          DEFAULT: "var(--error)",
        },
        "success-link": {
          DEFAULT: "var(--success-link)",
        },
        "backdrop-1": {
          DEFAULT: "var(--ds-backdrop-100)",
        },
        "backdrop-2": {
          DEFAULT: "var(--ds-backdrop-200)",
        },
        offblack: {
          DEFAULT: "var(--offblack)",
        },
        "onblack-1": {
          DEFAULT: "var(--onblack-1)",
        },
        "onblack-2": {
          DEFAULT: "var(--onblack-2)",
        },
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        xs: "var(--shadow-xsmall)",
        sm: "var(--shadow-small)",
        "sm-alt": "var(--shadow-small-alt)",
        md: "var(--shadow-medium)",
        "select-md": "var(--shadow-select-medium)",
        lg: "var(--shadow-large)",
        xl: "var(--shadow-xlarge)",
        switch: "var(--shadow-switch)",
        ds: "var(--ds-shadow-border-small)",
        "ds-primary": "var(--ds-shadow-menu)",
        "card-primary": "var(--card-shadow)",
        "card-primary-hover": "var(--card-shadow-hover)",
      },
      zIndex: {
        1: "1",
        2: "2",
      },
      textColor: {
        DEFAULT: "var(--text)",
        primary: {
          DEFAULT: "var(--text-primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--text-secondary)",
          accent: "var(--accents-5)",
        },
        tertiary: {
          DEFAULT: "var(--text-tertiary)",
        },
        active: "var(--text-active)",
        link: "var(--text-link)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: `var(--radius-lg)`,
        md: `calc(var(--radius-lg) - 2px)`,
        sm: "calc(var(--radius-lg) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        default: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      animation: {
        // Modal
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.3s ease-out forwards",
        // Input Select
        "input-select-slide-up":
          "input-select-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "input-select-slide-down":
          "input-select-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        // Accordion
        "accordion-down": "accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Custom wiggle animation
        wiggle: "wiggle 0.75s infinite",
      },
      keyframes: {
        // Modal
        "scale-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        // Input Select
        "input-select-slide-up": {
          "0%": { transform: "translateY(-342px)" },
          "100%": { transform: "translateY(-350px)" },
        },
        "input-select-slide-down": {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(8px)" },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: 0, transform: "translateX(-2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: 0, transform: "translateX(2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(200px)", opacity: 0 },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-200px)", opacity: 0 },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: 0 },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: 0 },
        },
        // Accordion
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        // Custom wiggle animation
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-4px) rotate(-4deg)" },
          "30%": { transform: "translateX(6px) rotate(4deg)" },
          "45%": { transform: "translateX(-6px) rotate(-2.4deg)" },
          "60%": { transform: "translateX(2px) rotate(1.6deg)" },
          "75%": { transform: "translateX(-1px) rotate(-0.8deg)" },
        },
      },
      size: {
        5: "1.25rem",
        6: "1.5rem",
        32: "8rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-radix")(),
    require("tailwindcss-animate"),
  ],
};
