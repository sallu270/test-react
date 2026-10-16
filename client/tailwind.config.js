export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#FAF7F2",
        ivory: "#FFFFFF",
        sand: "#F4EFEA",
        sandstone: "#EBE5DC",
        espresso: "#1C1917",
        charcoal: "#292524",
        muted: "#78716C",
        mutedLight: "#A8A29E",
        vermilion: "#E6392F",
        crimson: "#E6392F",
        amberGold: "#D97706",
        gold: "#C29B38"
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(28, 25, 23, 0.05)",
        card: "0 20px 50px -10px rgba(28, 25, 23, 0.07)",
        cardHover: "0 30px 70px -12px rgba(230, 57, 47, 0.12)",
        glowVermilion: "0 0 50px rgba(230, 57, 47, 0.25)"
      }
    }
  },
  plugins: []
};