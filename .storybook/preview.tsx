import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "skai-dark",
      values: [
        {
          name: "skai-dark",
          value: "#001615", // SKAI Green Coal
        },
        {
          name: "skai-navy",
          value: "#020717", // SKAI Dark Navy
        },
        {
          name: "light",
          value: "#FFFFFF",
        },
      ],
    },
    docs: {
      theme: {
        base: "dark",
        appBg: "#001615",
        appContentBg: "#020717",
        textColor: "#E0E0E0",
        barTextColor: "#E0E0E0",
      },
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "dark";
      return (
        <div className={theme === "dark" ? "dark" : ""}>
          <div
            className="bg-background text-foreground min-h-screen"
            style={{
              padding: "24px",
              fontFamily: "'Poppins', 'Manrope', system-ui, sans-serif",
              background: theme === "dark" ? "#001615" : "#FFFFFF",
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
