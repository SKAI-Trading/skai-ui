import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

// Status badge configuration for component maturity
const STATUS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  stable: { label: "Stable", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  beta: { label: "Beta", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  experimental: {
    label: "Experimental",
    color: "#eab308",
    bg: "rgba(234, 179, 8, 0.1)",
  },
  deprecated: { label: "Deprecated", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  new: { label: "New", color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)" },
};

// Get status from story tags
const getStatusFromTags = (tags: string[]): string | null => {
  const statusTags = ["stable", "beta", "experimental", "deprecated", "new"];
  return tags.find((tag) => statusTags.includes(tag)) || null;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const badge = STATUS_BADGES[status];
  if (!badge) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: badge.color,
        backgroundColor: badge.bg,
        border: `1px solid ${badge.color}`,
        marginLeft: "8px",
      }}
    >
      {badge.label}
    </span>
  );
};

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
            "Button",
            "Input",
            "Label",
            "Badge",
            "Card",
            "Textarea",
            // Forms
            "Checkbox",
            "Select",
            "Switch",
            "Slider",
            "Radio",
            "Autocomplete",
            "DatePicker",
            "NumberInput",
            "CurrencyInput",
            "TagInput",
            // Feedback
            "Alert",
            "Progress",
            "Skeleton",
            "Spinner",
            "Toast",
            "Sonner",
            "Notification",
            "EmptyState",
            "ErrorBoundary",
            // Overlay
            "Dialog",
            "Sheet",
            "Popover",
            "Tooltip",
            "DropdownMenu",
            "ContextMenu",
            "HoverCard",
            "ConfirmDialog",
            "Drawer",
            // Data Display
            "Avatar",
            "Table",
            "Calendar",
            "Chart",
            "Countdown",
            "QRCode",
            "StatCard",
            "PercentageBar",
            "LazyChart",
            // Layout
            "Separator",
            "ScrollArea",
            "Accordion",
            "Tabs",
            "Resizable",
            "Carousel",
            "Masonry",
            "Stepper",
            // Navigation
            "Breadcrumb",
            "Pagination",
            "DockIcon",
            "NavGroup",
            // Utility
            "ThemeToggle",
            "LoadingButton",
            "OnlineIndicator",
            "CopyButton",
            "*",
          ],

          // 5. Trading - Crypto/DeFi specific
          "Trading",
          [
            "TokenIcon",
            "TokenSelect",
            "PriceDisplay",
            "PriceChange",
            "AmountInput",
            "SwapInput",
            "BalanceDisplay",
            "FeeDisplay",
            "OrderBook",
            "DepthChart",
            "CandlestickChart",
            "TradingLayout",
            "NetworkBadge",
            "GasEstimate",
            "TransactionStatus",
            "LeverageSlider",
            "LiquidationWarning",
            "FundingRate",
            "TierBadge",
            "TradeSettings",
            "AccountMenu",
            "*",
          ],

          // 6. Layout Templates
          "Layout",
          [
            "Primitives",
            "CenteredLayout",
            "DashboardLayout",
            "TradingLayout",
            "ScrollingTicker",
            "TickerTape",
            "StatusBar",
            "*",
          ],

          // 7. Patterns - Best practices
          "Patterns",
          [
            "Common",
            "Forms",
            "Feedback",
            "Loading States",
            "Notifications",
            "Mobile First",
            "Web3",
            "Game UI",
            "*",
          ],

          // 8. Documentation - Guides
          "Documentation",
          [
            "Accessibility",
            "Responsive Design",
            "Content Guidelines",
            "Data Visualization",
            "Theming",
            "Social Features",
            "*",
          ],

          // 9. Templates - Full page examples
          "Templates",
          ["Page Mockups", "Production Pages", "*"],

          // 10. Tools - Utilities for development
          "Tools",
          [
            "Theme Configurator",
            "Color Palette Generator",
            "Animation Timeline",
            "Icon Library",
            "AI Generator",
            "Performance Profiler",
            "Visual Regression",
            "*",
          ],

          // 11. Design System - Internal tooling
          "Design System",
          [
            "Dashboard",
            "Analytics",
            "Changelog",
            "NPM Dashboard",
            "Figma Integration",
            "Component Playground",
            "Mock Data",
            "Request Queue",
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
      const tags = context.tags || [];
      const status = getStatusFromTags(tags);

      return (
        <div className={theme === "dark" ? "dark" : ""}>
          <div
            className="min-h-screen bg-background text-foreground"
            style={{
              padding: "24px",
              fontFamily: "'Poppins', 'Manrope', system-ui, sans-serif",
              background: theme === "dark" ? "#001615" : "#FFFFFF",
            }}
          >
            {/* Status Badge - shown at top of story canvas */}
            {status && (
              <div
                style={{
                  position: "fixed",
                  top: "12px",
                  right: "12px",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(0, 22, 21, 0.9)"
                      : "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status:
                </span>
                <StatusBadge status={status} />
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
