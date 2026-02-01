import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
    // Configure story sort order - Getting Started first
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Getting Started",
          ["Introduction", "For Designers", "For Developers", "*"],
          "Design System",
          [
            "Colors",
            "Typography",
            "Spacing",
            "Icons",
            "Brand Assets",
            "Figma Reference",
            "*",
          ],
          "Components",
          "Trading",
          "Patterns",
          "Pages",
          "*",
        ],
      },
    },
    backgrounds: {
      default: "skai-dark",
      values: [
        {
          name: "skai-dark",
          value: "#001615",
        },
        {
          name: "skai-navy",
          value: "#020717",
        },
        {
          name: "light",
          value: "#FFFFFF",
        },
      ],
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
