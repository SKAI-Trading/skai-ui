import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

// SKAI Trading Design System Theme
// Based on skai-landing dev branch design patterns
const skaiTheme = create({
  base: "dark",

  // Brand
  brandTitle: "SKAI Design System",
  brandUrl: "https://skai.trade",
  brandImage: undefined, // Can add logo later
  brandTarget: "_blank",

  // Colors - SKAI palette
  colorPrimary: "#56C0F6", // Sky Blue
  colorSecondary: "#2DEDAD", // Teal/Alien Green

  // UI - Deep space background
  appBg: "#001615", // Green Coal - main background
  appContentBg: "#020717", // Darker navy for content areas
  appPreviewBg: "#001615", // Preview area background
  appBorderColor: "rgba(86, 192, 246, 0.2)", // Subtle cyan border
  appBorderRadius: 12,

  // Text colors
  textColor: "#E0E0E0", // Gray 100
  textInverseColor: "#001615",
  textMutedColor: "rgba(224, 224, 224, 0.6)",

  // Toolbar - glass morphism style
  barTextColor: "#E0E0E0",
  barHoverColor: "#56C0F6",
  barSelectedColor: "#2DEDAD",
  barBg: "rgba(0, 22, 21, 0.9)", // Semi-transparent green coal

  // Form colors
  buttonBg: "#2DEDAD",
  buttonBorder: "rgba(45, 237, 173, 0.3)",
  inputBg: "rgba(255, 255, 255, 0.05)",
  inputBorder: "rgba(86, 192, 246, 0.2)",
  inputTextColor: "#E0E0E0",
  inputBorderRadius: 8,

  // Font - matching skai-landing
  fontBase:
    '"Poppins", "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontCode:
    '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Andale Mono", monospace',
});

addons.setConfig({
  theme: skaiTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ["components"],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
