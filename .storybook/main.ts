import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    // Storybook 9 errors (instead of warns) on duplicate story IDs.
    // The following filenames exist in BOTH src/docs/ AND src/components/<area>/
    // with identical `title:` blocks. We load:
    //   - everything outside src/docs/ via the broad glob
    //   - only the non-duplicate src/docs/ stories explicitly
    // The 6 duplicate src/docs/{accordion,collapsible,network-badge,price-display,
    // tier-badge,token-icon}.stories.tsx are dropped from indexing here.
    // Removing those duplicate FILES is owned by another lane (src/** is out
    // of W28-03 scope). Pre-W28-03 main.ts also globbed "../src/**/*.mdx" —
    // there are no .mdx files in the tree today, so it is omitted to keep the
    // Storybook 9 indexer warning-free.
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/templates/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/docs/ContentSystem.stories.tsx",
    "../src/docs/Sonner.stories.tsx",
    "../src/docs/balance-display.stories.tsx",
    "../src/docs/calendar.stories.tsx",
    "../src/docs/depth-chart.stories.tsx",
    "../src/docs/dock-bar.stories.tsx",
    "../src/docs/dock-icon.stories.tsx",
    "../src/docs/main-app-footer.stories.tsx",
    "../src/docs/main-app-header.stories.tsx",
    "../src/docs/mobile-nav.stories.tsx",
    "../src/docs/online-indicator.stories.tsx",
    "../src/docs/order-book.stories.tsx",
    "../src/docs/particle-background.stories.tsx",
    "../src/docs/skai-icon.stories.tsx",
    "../src/docs/skai-logo.stories.tsx",
    "../src/docs/toast.stories.tsx",
    "../src/docs/toaster.stories.tsx",
    "../src/docs/wallet-address.stories.tsx",
  ],
  // Storybook 9 bundles docs/controls/actions/viewport/backgrounds/measure/outline + interactions + links
  // into core. Custom local addons (e.g. ./addons/github-addon) are still registered via manager.ts.
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    return config;
  },
  // External references for designers
  refs: {
    "design-docs": {
      title: "Design Docs",
      url: "https://docs.skai.trade",
      disable: true, // Enable when docs site has Storybook
    },
  },
};

export default config;
