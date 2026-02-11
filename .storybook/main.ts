import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    // Welcome page first
    "../src/docs/Welcome.stories.tsx",
    // Then all other stories and docs
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
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
