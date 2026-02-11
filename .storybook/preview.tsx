import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

// Status badge configuration for component maturity
// stable = production-ready, new = recently added, beta = in testing, deprecated = being removed
const STATUS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  stable: { label: "Stable", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  new: { label: "New", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  beta: { label: "Beta", color: "#eab308", bg: "rgba(234, 179, 8, 0.1)" },
  experimental: {
    label: "Experimental",
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.1)",
  },
  deprecated: { label: "Deprecated", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
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
    // Configure story sort order - Designer-first hierarchy
    // Priority: Brand identity > Content > Components > Trading > Templates > Tokens > Patterns > Figma
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          // 0. Welcome - Landing page (always first)
          "Welcome",

          // 0.5. Getting Started - Onboarding docs (MDX pages)
          "Getting Started",
          ["Introduction", "Component Status", "For Designers", "For Developers", "*"],

          // 1. Brand & Identity - Colors, typography, logos, assets, guidelines
          "Brand",
          ["Logo", "Icons", "Icon Library", "Guidelines", "Assets", "*"],

          // 2. Content Management - All editable text/copy
          "Content",
          ["Content System", "Content Guidelines", "Platform Constants", "Asset System", "*"],

          // 3. Components - Core UI organized by function
          "Components",
          [
            // Core primitives
            "Button",
            "Input",
            "Label",
            "Badge",
            "Card",
            "Textarea",
            "Form",
            // Form controls
            "Checkbox",
            "Select",
            "Switch",
            "Slider",
            "RadioGroup",
            "Toggle",
            "Autocomplete",
            "DatePicker",
            "NumberInput",
            "CurrencyInput",
            "TagInput",
            // Feedback & status
            "Alert",
            "AlertDialog",
            "Progress",
            "Skeleton",
            "Spinner",
            "Toast",
            "Sonner",
            "Notification",
            "EmptyState",
            "ErrorBoundary",
            // Overlays & dialogs
            "Dialog",
            "Sheet",
            "Drawer",
            "Popover",
            "Tooltip",
            "DropdownMenu",
            "ContextMenu",
            "HoverCard",
            "ConfirmDialog",
            // Data display
            "Avatar",
            "Table",
            "Calendar",
            "Chart",
            "LazyChart",
            "Countdown",
            "QRCode",
            "StatCard",
            "PercentageBar",
            // Layout helpers
            "Separator",
            "ScrollArea",
            "Accordion",
            "Tabs",
            "Carousel",
            "Masonry",
            "Resizable",
            "Stepper",
            "Tour",
            // Utility
            "ThemeToggle",
            "LoadingButton",
            "OnlineIndicator",
            "DockIcon",
            "ParticleBackground",
            "TickerBackground",
            "BarTickerBackground",
            "CosmicBackground",
            "*",
          ],

          // 4. Forms - Dedicated form components and patterns
          "Forms",
          ["InputOTP", "SearchInput", "PasswordInput", "*"],

          // 5. Overlays - Modal and overlay components
          "Overlays",
          [
            "Command",
            "WalletChoiceModal",
            "WaitlistModal",
            "EmailVerificationModal",
            "EmojiPicker",
            "SpotlightOverlay",
            "SpectatorOverlay",
            "*",
          ],

          // 6. Feedback - Toast and notification components
          "Feedback",
          ["Toaster", "*"],

          // 7. Navigation - Nav components
          "Navigation",
          ["Breadcrumb", "Pagination", "DockBar", "MobileNav", "*"],

          // 8. Trading - Crypto/DeFi specific components
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
            "PnLDisplay",
            "OrderBook",
            "DepthChart",
            "CandlestickChart",
            "NetworkBadge",
            "GasEstimate",
            "TransactionStatus",
            "LeverageSlider",
            "LiquidationWarning",
            "FundingRateDisplay",
            "RiskGauge",
            "StatusIndicator",
            "TierBadge",
            "TradeSettings",
            "WalletAddress",
            "AccountMenu",
            "*",
          ],

          // 9. Layout - Page structures and layout primitives
          "Layout",
          [
            "Primitives",
            "PageLayouts",
            "AppShell",
            "AppHeader",
            "Main App Header",
            "AppFooter",
            "Main App Footer",
            "LandingHeader",
            "Sidebar",
            "CenteredLayout",
            "DashboardLayout",
            "TradingLayout",
            "ScrollingTicker",
            "TickerTape",
            "StatusBar",
            "NavGroup",
            "Collapsible",
            "Stepper",
            "Accordion",
            "Resizable",
            "*",
          ],

          // 10. Templates - Full page compositions
          "Templates",
          [
            "Home",
            "Trade",
            "Swap",
            "Portfolio",
            "Account",
            "AI Agent",
            "Predict",
            "Earn",
            "Governance",
            "Leaderboard",
            "*",
          ],

          // 11. Design Tokens - Spacing, animation, etc.
          "Design Tokens",
          ["Typography", "Spacing & Layout", "Animation", "Animation & Motion", "*"],

          // 12. Patterns - Best practice guides
          "Patterns",
          [
            "Common",
            "Forms",
            "Feedback",
            "Loading States",
            "Notifications & Alerts",
            "Mobile First",
            "Trading",
            "*",
          ],

          // 13. Documentation - Reference guides
          "Documentation",
          [
            "Accessibility",
            "Responsive Design",
            "Content Guidelines",
            "Content System",
            "Data Visualization",
            "Theming",
            "Design Token Exports",
            "Social Features",
            "Game UI Patterns",
            "Platform Constants",
            "Web3 Patterns",
            "Asset System",
            "*",
          ],

          // 14. Design System - Internal tooling, Figma integration
          "Design System",
          [
            "Design Tokens",
            "Figma Integration",
            "Figma Reference",
            "Token Sync",
            "Token Exports",
            "Theme Validator",
            "Responsive Preview",
            "Keyboard Shortcuts",
            "Composition Guide",
            "Changelog",
            "*",
          ],

          // 15. Utility - Dev utilities
          "Utility",
          ["ThemeProvider", "CopyButton", "ThirdwebOTPHandler", "*"],

          "Utilities",

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
