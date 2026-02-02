import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

// Import SKAI custom addons
import "./addons/usage-indicator";

// SKAI Design System - Completely Custom Theme
const skaiTheme = create({
  base: "dark",

  // Brand - SKAI only, NO Storybook references
  brandTitle: "SKAI Design System",
  brandUrl: "https://skai.trade",
  brandImage: undefined, 
  brandTarget: "_blank",

  // Colors - SKAI Green Coal palette
  colorPrimary: "#56C0F6", // Sky Blue (primary)
  colorSecondary: "#2DEDAD", // Teal/Green (secondary)

  // UI - Deep space SKAI aesthetic
  appBg: "#001615", // Green Coal - main background
  appContentBg: "#001615", // Same as main for seamless look
  appPreviewBg: "#001615", // Preview matches main app
  appBorderColor: "rgba(86, 192, 246, 0.15)", // Subtle cyan borders
  appBorderRadius: 12,

  // Typography
  textColor: "#E0E0E0", // Light gray
  textInverseColor: "#001615", // Dark for light backgrounds
  textMutedColor: "rgba(224, 224, 224, 0.5)", // Muted gray

  // Navigation - glass morphism
  barTextColor: "#E0E0E0",
  barHoverColor: "#56C0F6", 
  barSelectedColor: "#2DEDAD",
  barBg: "rgba(0, 22, 21, 0.95)", // Semi-transparent green coal

  // Form controls
  buttonBg: "#2DEDAD",
  buttonBorder: "rgba(45, 237, 173, 0.3)",
  inputBg: "rgba(86, 192, 246, 0.05)", // Slight cyan tint
  inputBorder: "rgba(86, 192, 246, 0.2)",
  inputTextColor: "#E0E0E0",
  inputBorderRadius: 8,

  // Font stack - SKAI typography system
  fontBase: '"Manrope", "Mulish", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", Monaco, "Andale Mono", monospace',
});

// Configuration - Hide/customize Storybook UI elements
addons.setConfig({
  theme: skaiTheme,
  
  // Customize panel layout
  showPanel: true,
  panelPosition: "right", 
  selectedPanel: "skai-usage-indicator", // Default to our usage panel
  
  // Sidebar configuration
  sidebar: {
    showRoots: true,
    collapsedRoots: [], // Keep all sections expanded by default
    renderLabel: (item: any) => {
      // Add usage indicators to component names in sidebar
      if (item.type === 'component' || item.type === 'story') {
        // This will be enhanced by our addon
        return item.name;
      }
      return item.name;
    }
  },

  // Toolbar - hide Storybook-specific items, keep useful tools
  toolbar: {
    title: { hidden: false }, // Keep story title
    zoom: { hidden: false },  // Keep zoom controls
    eject: { hidden: true },  // Hide "Open canvas in new tab"
    copy: { hidden: true },   // Hide "Copy canvas URL"  
    fullscreen: { hidden: false }, // Keep fullscreen
    outline: { hidden: true }, // Hide outline tool
    measure: { hidden: true }, // Hide measure tool if present
    'storybook/background': { hidden: false }, // Keep background selector
    'storybook/viewport': { hidden: false },   // Keep viewport selector
  },

  // Navigation - customize initial story
  initialActive: "docs", // Default to docs tab
  
  // URL handling - remove Storybook references
  enableShortcuts: true, // Keep keyboard shortcuts
  showToolbar: true,     // Show top toolbar
});

// Hide Storybook version info and branding
const style = document.createElement('style');
style.textContent = `
  /* Hide Storybook branding and version info */
  [title*="Storybook"],
  [title*="storybook"],
  .sidebar-header [title],
  .os-content .sidebar-header [title] {
    display: none !important;
  }

  /* Hide "What's new" and update notifications */
  [data-item-id*="whats-new"],
  [data-item-id*="upgrade"],
  .sidebar-header button[aria-label*="What"],
  .sidebar-header button[aria-label*="whats"] {
    display: none !important;
  }

  /* Hide version badge if present */
  .sidebar-header .css-1wa3eu0-HeaderContainer span,
  .sidebar-header .css-*[class*="version"] {
    display: none !important;
  }

  /* Custom SKAI branding in header */
  .sidebar-header::before {
    content: "⚡ SKAI Design System";
    display: block;
    color: #56C0F6;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(86, 192, 246, 0.15);
    margin-bottom: 8px;
  }

  /* Hide any Storybook logos */
  .sidebar-header img,
  .sidebar-header svg[class*="logo"] {
    display: none !important;
  }

  /* Custom styling for our addon panels */
  .addon-panel[data-addon="skai-usage-indicator"] {
    background: #001615;
  }

  /* Hide telemetry and analytics prompts */
  [data-testid*="telemetry"],
  [data-testid*="analytics"],
  .css-*[class*="telemetry"],
  .css-*[class*="analytics"] {
    display: none !important;
  }
`;

// Apply custom styles after DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(style);
  });
} else {
  document.head.appendChild(style);
}
