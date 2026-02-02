import type { Preview } from "@storybook/react";
import React from "react";
import "../src/styles/index.css";
import { USED_COMPONENTS, HIGH_PRIORITY, UsageIndicator } from "./addons/usage-indicator";

const preview: Preview = {
  parameters: {
    // Remove Storybook default actions
    actions: { disable: true },
    
    // Controls configuration
    controls: {
      matchers: {
        date: /Date$/i,
      },
      hideNoControlsWarning: true,
    },

    // Story sort order - SKAI-focused structure
    options: {
      storySort: {
        method: "alphabetical", 
        order: [
          "🏠 Getting Started",
          ["Welcome", "Quick Start", "Design Tokens", "*"],
          "🎨 Design System", 
          [
            "Colors",
            "Typography", 
            "Spacing",
            "Icons",
            "Brand Assets",
            "*",
          ],
          "⚡ Components",
          ["Core", "Forms", "Layout", "Navigation", "Feedback", "*"],
          "💹 Trading",
          ["Charts", "Orders", "Portfolio", "Analytics", "*"],
          "📱 Patterns", 
          ["Page Layouts", "Mobile", "Responsive", "*"],
          "*",
        ],
      },
    },

    // Background presets - SKAI themed
    backgrounds: {
      default: "skai-dark",
      values: [
        {
          name: "skai-dark",
          value: "#001615", // Green Coal
        },
        {
          name: "skai-navy", 
          value: "#020717", // Dark Navy
        },
        {
          name: "skai-light",
          value: "#F8FAFC", // Light mode
        },
        {
          name: "trading-dark",
          value: "#0A0F1C", // Trading interface dark
        },
      ],
    },

    // Viewport presets for responsive design
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet', 
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },

    // Docs configuration
    docs: {
      theme: undefined, // Use our custom theme
      source: {
        state: 'open', // Show source code by default
      },
    },

    // Layout configuration
    layout: 'padded',
  },

  // Global types for toolbar controls
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Toggle between light and dark theme",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light Theme" },
          { value: "dark", icon: "moon", title: "Dark Theme" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    density: {
      name: "Density", 
      description: "Component spacing density",
      defaultValue: "comfortable",
      toolbar: {
        icon: "component",
        items: [
          { value: "compact", title: "Compact" },
          { value: "comfortable", title: "Comfortable" },
          { value: "spacious", title: "Spacious" },
        ],
        showName: false,
        dynamicTitle: true,
      },
    },
  },

  // Story decorators
  decorators: [
    // Theme decorator with SKAI styling
    (Story, context) => {
      const theme = context.globals.theme || "dark";
      const density = context.globals.density || "comfortable";
      
      // Extract component name from story context
      const componentName = context.title?.split('/').pop() || context.name;
      const isUsed = USED_COMPONENTS.has(componentName);
      const isHighPriority = HIGH_PRIORITY.has(componentName);
      
      return (
        <div className={theme === "dark" ? "dark" : ""}>
          <div
            className="bg-background text-foreground min-h-screen transition-colors"
            style={{
              padding: density === 'compact' ? '12px' : density === 'spacious' ? '48px' : '24px',
              fontFamily: '"Manrope", "Mulish", system-ui, sans-serif',
              background: theme === "dark" ? "#001615" : "#F8FAFC",
              color: theme === "dark" ? "#E0E0E0" : "#1F2937",
              lineHeight: '1.5',
            }}
          >
            {/* Usage indicator at top of story */}
            {componentName && (
              <div style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px', 
                zIndex: 1000,
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <UsageIndicator componentName={componentName} />
                {isUsed && (
                  <span style={{ 
                    fontSize: '10px', 
                    color: theme === 'dark' ? '#22c55e' : '#059669',
                    fontWeight: '500'
                  }}>
                    Live in App
                  </span>
                )}
                {isHighPriority && !isUsed && (
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#f59e0b',
                    fontWeight: '500'
                  }}>
                    Next Migration
                  </span>
                )}
              </div>
            )}
            
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
