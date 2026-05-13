import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

// Import GitHub addon for designer workflow
import "./addons/github-addon";

// SKAI Trading Design System Theme
// Brand colors: Green Coal (#001615), Alien Green (#2DEDAD), Sky Blue (#56C7F3)
const skaiTheme = create({
  base: "dark",

  // Brand - Custom SKAI branding
  brandTitle: "SKAI Design System",
  brandUrl: "https://skai.trade",
  brandImage: "./assets/logo/skai-logo-dark.svg",
  brandTarget: "_blank",

  // Colors - SKAI palette
  colorPrimary: "#56C7F3", // Sky Blue - links, highlights
  colorSecondary: "#2DEDAD", // Alien Green - accent, selected state

  // UI - Deep space background
  appBg: "#001615", // Green Coal - sidebar background
  appContentBg: "#020717", // Darker navy for content/canvas area
  appPreviewBg: "#001615", // Preview area background
  appBorderColor: "rgba(45, 237, 173, 0.15)", // Subtle green border
  appBorderRadius: 12,

  // Text colors
  textColor: "#E0E0E0",
  textInverseColor: "#001615",
  textMutedColor: "rgba(224, 224, 224, 0.6)",

  // Toolbar
  barTextColor: "#E0E0E0",
  barHoverColor: "#56C7F3", // Sky Blue on hover
  barSelectedColor: "#2DEDAD", // Alien Green when selected
  barBg: "#001615", // Green Coal toolbar

  // Form colors
  buttonBg: "#2DEDAD",
  buttonBorder: "rgba(45, 237, 173, 0.3)",
  inputBg: "rgba(255, 255, 255, 0.05)",
  inputBorder: "rgba(86, 199, 243, 0.2)",
  inputTextColor: "#E0E0E0",
  inputBorderRadius: 8,

  // Fonts - Poppins for headings, Manrope for body
  fontBase:
    '"Poppins", "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontCode:
    '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Andale Mono", monospace',
});

addons.setConfig({
  theme: skaiTheme,
  // Open to Welcome page by default
  initialActive: "docs",
  sidebar: {
    showRoots: true,
    // Collapse verbose sections; keep the most-used ones open
    collapsedRoots: [
      "forms",
      "overlays",
      "feedback",
      "navigation",
      "documentation",
      "design-system",
      "utility",
      "utilities",
    ],
    // Render category labels with emoji prefixes for quick visual scanning
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderLabel: (item: any) => {
      if (item.type === "root") {
        const prefixes: Record<string, string> = {
          "Welcome": "\u{1F44B}",
          "Brand": "\u{1F3A8}",
          "Content": "\u{1F4DD}",
          "Components": "\u{1F9E9}",
          "Forms": "\u{1F4CB}",
          "Overlays": "\u{1FA9F}",
          "Feedback": "\u{1F4AC}",
          "Navigation": "\u{1F9ED}",
          "Trading": "\u{1F4B9}",
          "Layout": "\u{1F4D0}",
          "Templates": "\u{1F4C4}",
          "Design Tokens": "\u{1F3AF}",
          "Patterns": "\u{1F4D6}",
          "Documentation": "\u{1F4DA}",
          "Design System": "\u{1F517}",
          "Utility": "\u{1F527}",
          "Utilities": "\u{1F527}",
          "Getting Started": "\u{1F680}",
        };
        const prefix = prefixes[item.name];
        return prefix ? `${prefix}  ${item.name}` : item.name;
      }
      return item.name;
    },
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});

// Set the page title
document.title = "SKAI Design System";
