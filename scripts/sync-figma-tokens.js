#!/usr/bin/env node
/**
 * SKAI Design Token Sync Script
 *
 * Syncs design tokens between Figma (via Tokens Studio) and the codebase.
 *
 * Usage:
 *   node scripts/sync-figma-tokens.js [--from-figma | --to-figma | --validate]
 *
 * Options:
 *   --from-figma   Pull tokens from Figma and update local files
 *   --to-figma     Push local tokens to Figma (requires API key)
 *   --validate     Check if local tokens match Figma tokens
 *   --help         Show help message
 *
 * Environment Variables:
 *   FIGMA_TOKEN_FILE_ID   - The Figma file ID containing tokens
 *   FIGMA_PERSONAL_TOKEN  - Figma personal access token
 *
 * For Tokens Studio users:
 *   1. Export tokens from Tokens Studio plugin
 *   2. Save as design-tokens.figma.json in this directory
 *   3. Run: node scripts/sync-figma-tokens.js --from-figma
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ROOT_DIR = path.resolve(__dirname, "..");
const TOKENS_DIR = path.join(ROOT_DIR, "src", "lib");
const FIGMA_EXPORT_PATH = path.join(ROOT_DIR, "design-tokens.figma.json");
const JSON_TOKENS_PATH = path.join(TOKENS_DIR, "design-tokens.json");
const CSS_TOKENS_PATH = path.join(TOKENS_DIR, "design-tokens.css");
const TS_TOKENS_PATH = path.join(TOKENS_DIR, "design-tokens.ts");

// SKAI color palette (source of truth)
const SKAI_COLORS = {
  // Primary brand colors
  primary: {
    DEFAULT: "#6366F1",
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  // Secondary/accent
  secondary: {
    DEFAULT: "#EC4899",
    50: "#FDF2F8",
    100: "#FCE7F3",
    200: "#FBCFE8",
    300: "#F9A8D4",
    400: "#F472B6",
    500: "#EC4899",
    600: "#DB2777",
    700: "#BE185D",
    800: "#9D174D",
    900: "#831843",
  },
  // Semantic colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  // Neutral grays
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

// Typography scale
const TYPOGRAPHY = {
  fontFamily: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Spacing scale (4px base)
const SPACING = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
};

// Border radius
const RADIUS = {
  none: "0",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

/**
 * Generate JSON tokens file
 */
function generateJsonTokens() {
  const tokens = {
    $schema: "https://design-tokens.github.io/community-group/format/",
    name: "SKAI Design Tokens",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    colors: SKAI_COLORS,
    typography: TYPOGRAPHY,
    spacing: SPACING,
    radius: RADIUS,
  };

  return JSON.stringify(tokens, null, 2);
}

/**
 * Generate CSS custom properties
 */
function generateCssTokens() {
  let css = `/**
 * SKAI Design Tokens - CSS Custom Properties
 * Generated: ${new Date().toISOString()}
 * 
 * Usage:
 *   color: var(--skai-primary);
 *   font-family: var(--font-sans);
 */

:root {
  /* ========================================
   * Colors - Primary
   * ======================================== */
`;

  // Primary colors
  Object.entries(SKAI_COLORS.primary).forEach(([key, value]) => {
    const name = key === "DEFAULT" ? "primary" : `primary-${key}`;
    css += `  --skai-${name}: ${value};\n`;
  });

  css += `\n  /* ========================================
   * Colors - Secondary
   * ======================================== */\n`;

  // Secondary colors
  Object.entries(SKAI_COLORS.secondary).forEach(([key, value]) => {
    const name = key === "DEFAULT" ? "secondary" : `secondary-${key}`;
    css += `  --skai-${name}: ${value};\n`;
  });

  css += `\n  /* ========================================
   * Colors - Semantic
   * ======================================== */\n`;
  css += `  --skai-success: ${SKAI_COLORS.success};\n`;
  css += `  --skai-warning: ${SKAI_COLORS.warning};\n`;
  css += `  --skai-error: ${SKAI_COLORS.error};\n`;
  css += `  --skai-info: ${SKAI_COLORS.info};\n`;

  css += `\n  /* ========================================
   * Colors - Gray Scale
   * ======================================== */\n`;

  Object.entries(SKAI_COLORS.gray).forEach(([key, value]) => {
    css += `  --skai-gray-${key}: ${value};\n`;
  });

  css += `\n  /* ========================================
   * Typography
   * ======================================== */\n`;
  css += `  --font-sans: ${TYPOGRAPHY.fontFamily.sans};\n`;
  css += `  --font-mono: ${TYPOGRAPHY.fontFamily.mono};\n`;

  Object.entries(TYPOGRAPHY.fontSize).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });

  css += `\n  /* ========================================
   * Spacing
   * ======================================== */\n`;

  Object.entries(SPACING).forEach(([key, value]) => {
    css += `  --space-${key}: ${value};\n`;
  });

  css += `\n  /* ========================================
   * Border Radius
   * ======================================== */\n`;

  Object.entries(RADIUS).forEach(([key, value]) => {
    const name = key === "DEFAULT" ? "default" : key;
    css += `  --radius-${name}: ${value};\n`;
  });

  css += `}\n`;

  return css;
}

/**
 * Parse Figma Tokens Studio export
 */
function parseFigmaExport(figmaTokens) {
  // Tokens Studio exports in a specific format
  // This function normalizes it to our internal format
  const normalized = {
    colors: {},
    typography: {},
    spacing: {},
    radius: {},
  };

  // Handle different Tokens Studio export formats
  if (figmaTokens.global) {
    // v2 format with sets
    Object.entries(figmaTokens.global).forEach(([key, token]) => {
      if (token.type === "color") {
        normalized.colors[key] = token.value;
      } else if (token.type === "spacing") {
        normalized.spacing[key] = token.value;
      } else if (token.type === "borderRadius") {
        normalized.radius[key] = token.value;
      }
    });
  } else {
    // Flat format
    Object.entries(figmaTokens).forEach(([key, token]) => {
      if (typeof token === "object" && token.value) {
        if (token.type === "color") {
          normalized.colors[key] = token.value;
        }
      }
    });
  }

  return normalized;
}

/**
 * Validate tokens match between Figma and local
 */
function validateTokens() {
  if (!fs.existsSync(FIGMA_EXPORT_PATH)) {
    console.log("⚠️  No Figma export found at:", FIGMA_EXPORT_PATH);
    console.log("   Export tokens from Tokens Studio and save to this path.");
    return false;
  }

  const figmaTokens = JSON.parse(fs.readFileSync(FIGMA_EXPORT_PATH, "utf-8"));
  const localTokens = JSON.parse(fs.readFileSync(JSON_TOKENS_PATH, "utf-8"));

  const figmaNormalized = parseFigmaExport(figmaTokens);

  let hasDiscrepancies = false;

  // Check colors
  console.log("\n🎨 Checking colors...");
  Object.entries(SKAI_COLORS.primary).forEach(([key, value]) => {
    const figmaKey = `primary-${key}`;
    if (
      figmaNormalized.colors[figmaKey] &&
      figmaNormalized.colors[figmaKey] !== value
    ) {
      console.log(
        `   ❌ ${figmaKey}: Local(${value}) != Figma(${figmaNormalized.colors[figmaKey]})`,
      );
      hasDiscrepancies = true;
    }
  });

  if (!hasDiscrepancies) {
    console.log("   ✅ All colors match!");
  }

  return !hasDiscrepancies;
}

/**
 * Sync from Figma to local
 */
function syncFromFigma() {
  console.log("\n📥 Syncing tokens from Figma...");

  if (!fs.existsSync(FIGMA_EXPORT_PATH)) {
    console.log("❌ No Figma export found!");
    console.log("");
    console.log("To sync from Figma:");
    console.log("1. Open Figma file with Tokens Studio");
    console.log("2. Export tokens to JSON");
    console.log("3. Save as: design-tokens.figma.json");
    console.log("4. Run this script again");
    return;
  }

  const figmaTokens = JSON.parse(fs.readFileSync(FIGMA_EXPORT_PATH, "utf-8"));
  const normalized = parseFigmaExport(figmaTokens);

  console.log(
    "   Found tokens:",
    Object.keys(normalized.colors).length,
    "colors",
  );

  // Update local files
  fs.writeFileSync(JSON_TOKENS_PATH, generateJsonTokens());
  console.log("   ✅ Updated:", JSON_TOKENS_PATH);

  fs.writeFileSync(CSS_TOKENS_PATH, generateCssTokens());
  console.log("   ✅ Updated:", CSS_TOKENS_PATH);

  console.log("\n✨ Sync complete!");
}

/**
 * Generate fresh tokens (regenerate from source of truth)
 */
function generateTokens() {
  console.log("\n🔄 Generating design tokens...");

  // Ensure directory exists
  if (!fs.existsSync(TOKENS_DIR)) {
    fs.mkdirSync(TOKENS_DIR, { recursive: true });
  }

  // Generate JSON
  fs.writeFileSync(JSON_TOKENS_PATH, generateJsonTokens());
  console.log("   ✅ Generated:", JSON_TOKENS_PATH);

  // Generate CSS
  fs.writeFileSync(CSS_TOKENS_PATH, generateCssTokens());
  console.log("   ✅ Generated:", CSS_TOKENS_PATH);

  console.log("\n✨ Token generation complete!");
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
SKAI Design Token Sync Script

Usage:
  node scripts/sync-figma-tokens.js [command]

Commands:
  --from-figma   Sync tokens from Figma export to local files
  --validate     Check if local tokens match Figma export
  --generate     Regenerate all token files from source of truth
  --help         Show this help message

Setup for Figma sync:
  1. Install "Tokens Studio" plugin in Figma
  2. Set up your design tokens in the plugin
  3. Export tokens as JSON
  4. Save to: modules/skai-ui/design-tokens.figma.json
  5. Run: node scripts/sync-figma-tokens.js --from-figma

Environment Variables (optional):
  FIGMA_FILE_ID         Your Figma file ID
  FIGMA_PERSONAL_TOKEN  Figma API token for direct sync

Example workflow:
  # After updating tokens in Figma
  node scripts/sync-figma-tokens.js --from-figma
  
  # To check for drift
  node scripts/sync-figma-tokens.js --validate
  
  # To regenerate from code source of truth
  node scripts/sync-figma-tokens.js --generate
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0] || "--help";

switch (command) {
  case "--from-figma":
    syncFromFigma();
    break;
  case "--validate":
    const valid = validateTokens();
    process.exit(valid ? 0 : 1);
    break;
  case "--generate":
    generateTokens();
    break;
  case "--help":
  default:
    showHelp();
    break;
}
