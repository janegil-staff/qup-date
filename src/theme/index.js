// Global theme for glassmorphic design
export const theme = {
  // Background gradients
  gradients: {
    background: ["#1a1a2e", "#16213e", "#0f3460", "#16213e"],
    primary: ["#e94560", "#ff6b9d"],
    secondary: ["rgba(233, 69, 96, 0.2)", "rgba(15, 52, 96, 0.2)"],
    glass: ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"],
    dark: ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.4)"],
  },

  // Colors
  colors: {
    primary: "#e94560",
    primaryLight: "#ff6b9d",
    primaryDark: "#d63447",

    background: "#1a1a2e",
    backgroundDark: "#16213e",
    backgroundDeep: "#0f3460",

    text: "#ffffff",
    textSecondary: "rgba(255,255,255,0.8)",
    textMuted: "rgba(255,255,255,0.6)",
    textDim: "rgba(255,255,255,0.4)",

    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ff4444",
    info: "#3b82f6",

    glass: "rgba(255,255,255,0.08)",
    glassBorder: "rgba(255,255,255,0.1)",
    glassHover: "rgba(255,255,255,0.12)",
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    glow: {
      shadowColor: "#e94560",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
    },
  },

  // Typography
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#ffffff",
    },
    h2: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#ffffff",
    },
    h3: {
      fontSize: 24,
      fontWeight: "700",
      color: "#ffffff",
    },
    h4: {
      fontSize: 20,
      fontWeight: "700",
      color: "#ffffff",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: "rgba(255,255,255,0.9)",
    },
    bodySecondary: {
      fontSize: 15,
      color: "rgba(255,255,255,0.8)",
    },
    caption: {
      fontSize: 14,
      color: "rgba(255,255,255,0.6)",
    },
    small: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)",
    },
  },

  // Common component styles
  components: {
    card: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      overflow: "hidden",
    },
    button: {
      borderRadius: 16,
      padding: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: 16,
      color: "#ffffff",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    chip: {
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "rgba(233, 69, 96, 0.3)",
    },
  },
};

// Helper function to create glass card style
export const createGlassCard = (customStyle = {}) => ({
  borderRadius: theme.borderRadius.xl,
  borderWidth: 1,
  borderColor: theme.colors.glassBorder,
  overflow: "hidden",
  ...customStyle,
});

// Helper function to create gradient button
export const createGradientButton = (customStyle = {}) => ({
  borderRadius: theme.borderRadius.lg,
  overflow: "hidden",
  ...theme.shadows.md,
  ...customStyle,
});

export default theme;
