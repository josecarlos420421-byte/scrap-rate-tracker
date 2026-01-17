import { Platform } from "react-native";

// JazzCash-inspired Pakistani theme colors
const primaryColor = "#B71C1C"; // JazzCash Deep Red/Maroon
const secondaryColor = "#FFC107"; // Gold/Yellow accent
const accentColor = "#D32F2F"; // Lighter Red
const successColor = "#4CAF50"; // Green
const errorColor = "#F44336"; // Red

// Category Colors - Vibrant Pakistani Style
export const CategoryColors = {
  loha: { bg: "#FFEBEE", accent: "#B71C1C", icon: "#880E4F" }, // Deep Red
  copper: { bg: "#FFF3E0", accent: "#E65100", icon: "#BF360C" }, // Deep Orange
  aluminum: { bg: "#E0F2F1", accent: "#00695C", icon: "#004D40" }, // Teal
  plastic: { bg: "#FCE4EC", accent: "#C2185B", icon: "#AD1457" }, // Pink
  brass: { bg: "#FFF8E1", accent: "#FF8F00", icon: "#E65100" }, // Amber/Gold
  battery: { bg: "#E8F5E9", accent: "#2E7D32", icon: "#1B5E20" }, // Green
  paper: { bg: "#EFEBE9", accent: "#6D4C41", icon: "#4E342E" }, // Brown
  steel: { bg: "#ECEFF1", accent: "#455A64", icon: "#263238" }, // Blue Grey
  electronics: { bg: "#E3F2FD", accent: "#1565C0", icon: "#0D47A1" }, // Blue
  glass: { bg: "#E0F7FA", accent: "#00838F", icon: "#006064" }, // Cyan
  rubber: { bg: "#F3E5F5", accent: "#7B1FA2", icon: "#4A148C" }, // Purple
  silver: { bg: "#F5F5F5", accent: "#757575", icon: "#424242" }, // Grey
  zinc: { bg: "#FFFDE7", accent: "#9E9D24", icon: "#827717" }, // Olive
};

// JazzCash Theme Colors
export const JazzCashColors = {
  primary: "#B71C1C", // Deep Maroon/Red
  primaryLight: "#D32F2F", // Lighter Red
  primaryDark: "#7F0000", // Darker Red
  accent: "#FFC107", // Gold
  accentLight: "#FFD54F", // Light Gold
  white: "#FFFFFF",
  background: "#F5F5F5",
  cardBg: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#666666",
};

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#666666",
    buttonText: "#FFFFFF",
    tabIconDefault: "#999999",
    tabIconSelected: JazzCashColors.primary,
    link: JazzCashColors.primary,
    accent: JazzCashColors.accent,
    primary: JazzCashColors.primary,
    secondary: secondaryColor,
    success: successColor,
    error: errorColor,
    backgroundRoot: "#F5F5F5",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#FAFAFA",
    backgroundTertiary: "#F0F0F0",
    border: "#E0E0E0",
    cardBorder: "#EEEEEE",
    // JazzCash gradient colors
    gradientStart: "#B71C1C",
    gradientMiddle: "#C62828",
    gradientEnd: "#D32F2F",
  },
  dark: {
    text: "#F5F5F5",
    textSecondary: "#B0B0B0",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A0A0A0",
    tabIconSelected: "#EF5350",
    link: "#EF5350",
    accent: "#FFD54F",
    primary: "#EF5350",
    secondary: "#FFB74D",
    success: "#66BB6A",
    error: "#EF5350",
    backgroundRoot: "#121212",
    backgroundDefault: "#1E1E1E",
    backgroundSecondary: "#2C2C2C",
    backgroundTertiary: "#3A3A3A",
    border: "#404040",
    cardBorder: "#333333",
    gradientStart: "#7F0000",
    gradientMiddle: "#B71C1C",
    gradientEnd: "#C62828",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  priceDisplay: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Helper to get category color by name
export function getCategoryColor(categoryName: string) {
  const name = categoryName.toLowerCase();
  if (name.includes("loha") || name.includes("لوہا")) return CategoryColors.loha;
  if (name.includes("copper") || name.includes("تانبا")) return CategoryColors.copper;
  if (name.includes("aluminum") || name.includes("ایلومینیم")) return CategoryColors.aluminum;
  if (name.includes("plastic") || name.includes("پلاسٹک")) return CategoryColors.plastic;
  if (name.includes("brass") || name.includes("پیتل")) return CategoryColors.brass;
  if (name.includes("battery") || name.includes("بیٹری")) return CategoryColors.battery;
  if (name.includes("paper") || name.includes("کاغذ")) return CategoryColors.paper;
  if (name.includes("steel") || name.includes("سٹیل")) return CategoryColors.steel;
  if (name.includes("electronics") || name.includes("الیکٹرانکس")) return CategoryColors.electronics;
  if (name.includes("glass") || name.includes("شیشہ")) return CategoryColors.glass;
  if (name.includes("rubber") || name.includes("ربڑ")) return CategoryColors.rubber;
  if (name.includes("silver") || name.includes("چاندی")) return CategoryColors.silver;
  if (name.includes("zinc") || name.includes("جست")) return CategoryColors.zinc;
  return CategoryColors.loha; // default
}

// Item image mapping helper
export function getItemImage(itemName: string, categoryName: string): string | null {
  const name = itemName.toLowerCase();
  const cat = categoryName.toLowerCase();
  
  // Return appropriate image key based on item/category
  if (cat.includes("copper") || cat.includes("تانبا")) return "copper";
  if (cat.includes("aluminum") || cat.includes("ایلومینیم")) return "aluminum";
  if (cat.includes("brass") || cat.includes("پیتل")) return "brass";
  if (cat.includes("battery") || cat.includes("بیٹری")) return "battery";
  if (cat.includes("paper") || cat.includes("کاغذ")) return "paper";
  if (cat.includes("steel") || cat.includes("سٹیل")) return "steel";
  if (cat.includes("electronics") || cat.includes("الیکٹرانکس")) return "electronics";
  if (cat.includes("glass") || cat.includes("شیشہ")) return "glass";
  if (cat.includes("rubber") || cat.includes("ربڑ")) return "rubber";
  if (cat.includes("silver") || cat.includes("چاندی")) return "silver";
  if (cat.includes("zinc") || cat.includes("جست")) return "zinc";
  if (cat.includes("plastic") || cat.includes("پلاسٹک")) return "plastic";
  if (cat.includes("loha") || cat.includes("لوہا")) return "iron";
  
  return "scrap"; // default
}
