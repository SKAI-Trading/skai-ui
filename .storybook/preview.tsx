import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
    // Configure story sort order - Organized hierarchy for easy navigation
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          // 1. Getting Started - Onboarding docs
          "Getting Started",
          ["Introduction", "Component Status", "For Designers", "For Developers", "*"],
          
          // 2. Brand - Logo, icons, assets
          "Brand",
          ["Logo", "Icons", "Assets", "Guidelines", "*"],
          
          // 3. Design Tokens - Foundation
          "Design Tokens",
          ["Colors", "Typography", "Spacing", "Animation", "Theming", "*"],
          
          // 4. Components - Core UI by category
          "Components",
          [
            // Primitives
            "Button", "Input", "Label", "Badge", "Card", "Textarea",
            // Forms
            "Checkbox", "Select", "Switch", "Slider", "Radio",
            "Autocomplete", "DatePicker", "NumberInput", "CurrencyInput", "TagInput",
            // Feedback
            "Alert", "Progress", "Skeleton", "Spinner", "Toast", "Sonner",
            "Notification", "EmptyState", "ErrorBoundary",
            // Overlay
            "Dialog", "Sheet", "Popover", "Tooltip", "DropdownMenu",
            "ContextMenu", "HoverCard", "ConfirmDialog", "Drawer",
            // Data Display
            "Avatar", "Table", "Calendar", "Chart", "Countdown", "QRCode",
            "StatCard", "PercentageBar", "LazyChart",
            // Layout
            "Separator", "ScrollArea", "Accordion", "Tabs", "Resizable",
            "Carousel", "Masonry", "Stepper",
            // Navigation
            "Breadcrumb", "Pagination", "DockIcon", "NavGroup",
            // Utility
            "ThemeToggle", "LoadingButton", "OnlineIndicator", "CopyButton",
            "*",
          ],
          
          // 5. Trading - Crypto/DeFi specific
          "Trading",
          [
            "TokenIcon", "TokenSelect", "PriceDisplay", "PriceChange",
            "AmountInput", "SwapInput", "BalanceDisplay", "FeeDisplay",
            "OrderBook", "DepthChart", "CandlestickChart", "TradingLayout",
            "NetworkBadge", "GasEstimate", "TransactionStatus",
            "LeverageSlider", "LiquidationWarning", "FundingRate",
            "TierBadge", "TradeSettings", "AccountMenu",
            "*",
          ],
          
          // 6. Layout Templates
          "Layout",
          [
            "Primitives", "CenteredLayout", "DashboardLayout", "TradingLayout",
            "ScrollingTicker", "TickerTape", "StatusBar",
            "*",
          ],
          
          // 7. Patterns - Best practices
          "Patterns",
          [
            "Common", "Forms", "Feedback", "Loading States",
            "Notifications", "Mobile First", "Web3", "Game UI",
            "*",
          ],
          
          // 8. Documentation - Guides
          "Documentation",
          [
            "Accessibility", "Responsive Design", "Content Guidelines",
            "Data Visualization", "Theming", "Social Features",
            "*",
          ],
          
          // 9. Templates - Full page examples
          "Templates",
          ["Page Mockups", "Production Pages", "*"],
          
          // 10. Tools - Utilities for development
          "Tools",
          [
            "Theme Configurator", "Color Palette Generator",
            "Animation Timeline", "Icon Library", "AI Generator",
            "Performance Profiler", "Visual Regression",
            "*",
          ],
          
          // 11. Design System - Internal tooling
          "Design System",
          [
            "Dashboard", "Analytics", "Changelog", "NPM Dashboard",
            "Figma Integration", "Component Playground",
            "Mock Data", "Request Queue",
            "*",
          ],
          
          // Catch-all
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
