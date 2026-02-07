import type { Meta, StoryObj } from "@storybook/react";
import { MainAppFooter } from "../components/layout/main-app-footer";

/**
 * Main App Footer
 *
 * The branded footer bar for app.skai.trade, matching Figma design 1106-1129.
 *
 * **Figma Reference:** Skai Design → Logo/footer-example (1106:1129)
 *
 * Features:
 * - Social links (Discord, Telegram, X)
 * - Navigation items with icons (AI, Chat, Mini games, Wallet)
 * - Connection status pill
 * - Footer page links (Home, Docs, Privacy, Terms)
 */
const meta: Meta<typeof MainAppFooter> = {
  title: "Layout/Main App Footer",
  component: MainAppFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Branded footer bar for app.skai.trade. Implements Figma design 1106-1129 with social links, navigation, connection status, and page links.",
      },
    },
  },
  argTypes: {
    connectionStatus: {
      description: "Connection status shown in the center pill",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainAppFooter>;

// =============================================================================
// DEFAULT (Connected)
// =============================================================================
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default footer with stable connection and all sections visible.",
      },
    },
  },
};

// =============================================================================
// DISCONNECTED
// =============================================================================
export const Disconnected: Story = {
  name: "Disconnected",
  args: {
    connectionStatus: {
      connected: false,
      label: "Disconnected",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Footer showing disconnected state with red status pill.",
      },
    },
  },
};

// =============================================================================
// CUSTOM LINKS
// =============================================================================
export const CustomLinks: Story = {
  name: "Custom Links",
  args: {
    footerLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    navItems: [
      { label: "Trade", icon: "chart" as any },
      { label: "Predict", icon: "trending-up" as any },
      { label: "Play", icon: "hot" as any },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Footer with custom navigation items and footer links.",
      },
    },
  },
};
