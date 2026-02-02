import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/*.mdx"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions", 
    "@storybook/addon-links",
    // Custom SKAI addons
    "./.storybook/addons/usage-indicator",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  
  // Vite configuration
  viteFinal: async (config) => {
    // Disable telemetry and analytics
    config.define = {
      ...config.define,
      'process.env.STORYBOOK_TELEMETRY_DISABLED': JSON.stringify('true'),
      'process.env.DISABLE_STORYBOOK_TELEMETRY': JSON.stringify('true'),
    };
    
    return config;
  },

  // Documentation configuration
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },

  // Build configuration
  staticDirs: ['../public'],

  // TypeScript configuration
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  // Features
  features: {
    storyStoreV7: true, // Modern story store
    buildStoriesJson: true,
  },

  // Environment variables - disable telemetry
  env: (config) => ({
    ...config,
    STORYBOOK_TELEMETRY_DISABLED: 'true',
    DISABLE_STORYBOOK_TELEMETRY: 'true',
  }),

  // Disable Storybook refs and external integrations
  refs: {},

  // Previewers for different file types
  previewHead: (head) => `
    ${head}
    <style>
      /* Additional SKAI styling for preview */
      body {
        background-color: #001615;
        color: #E0E0E0;
        font-family: "Manrope", "Mulish", system-ui, sans-serif;
      }

      /* Hide any remaining Storybook branding */
      [data-testid*="storybook"],
      [aria-label*="Storybook"],
      .css-*[class*="storybook" i] {
        display: none !important;
      }
    </style>
    <script>
      // Disable telemetry collection
      window.STORYBOOK_TELEMETRY_DISABLED = true;
      window.__STORYBOOK_ADDONS_MANAGER = window.__STORYBOOK_ADDONS_MANAGER || {};
      
      // Override any telemetry functions
      if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
          // Disable any telemetry event listeners
          const originalAddEventListener = EventTarget.prototype.addEventListener;
          EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (typeof listener === 'function' && 
                (type.includes('telemetry') || type.includes('analytics'))) {
              return; // Block telemetry event listeners
            }
            return originalAddEventListener.call(this, type, listener, options);
          };
        });
      }
    </script>
  `,
};

export default config;
