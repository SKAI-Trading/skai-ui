import type { Meta, StoryObj } from "@storybook/react";
import { MainAppHeader } from "../components/layout/main-app-header";
import { SkaiIcon } from "../components/branding/skai-icon";

/**
 * Main App Header
 *
 * The branded header for app.skai.trade, matching Figma design 1106-1042.
 *
 * **Figma Reference:** Skai Design → Logo/header-example (1106:1042)
 *
 * Features:
 * - SkaiLogo (small) with navigation items
 * - Search bar
 * - Stats pills (points, followers, balance)
 * - Wallet connect button
 * - User profile button
 */
const meta: Meta<typeof MainAppHeader> = {
  title: "Layout/Main App Header",
  component: MainAppHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Branded header for app.skai.trade. Implements Figma design 1106-1042 with logo, navigation, search, stats, and wallet connection.",
      },
    },
  },
  argTypes: {
    walletConnected: {
      control: "boolean",
      description: "Whether a wallet is connected",
    },
    walletLabel: {
      control: "text",
      description: "Label for the wallet button",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    userName: {
      control: "text",
      description: "Username for the profile button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainAppHeader>;

// =============================================================================
// DEFAULT (Logged Out)
// =============================================================================
export const Default: Story = {
  args: {
    stats: [
      { icon: <SkaiIcon name="star" size="sm" className="text-[#17F9B4]" />, value: "800" },
      { icon: <SkaiIcon name="trending-up" size="sm" className="text-[#FFFF16]" />, value: "11.2k" },
      { icon: <SkaiIcon name="wallet" size="sm" className="text-[#56C7F3]" />, value: "0.0036 ETH" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Default header state with stats but no wallet connected.",
      },
    },
  },
};

// =============================================================================
// WALLET CONNECTED
// =============================================================================
export const WalletConnected: Story = {
  name: "Wallet Connected",
  args: {
    walletConnected: true,
    walletLabel: "0x1234...5678",
    userName: "artofofiare",
    stats: [
      { icon: <SkaiIcon name="star" size="sm" className="text-[#17F9B4]" />, value: "800" },
      { icon: <SkaiIcon name="trending-up" size="sm" className="text-[#FFFF16]" />, value: "11.2k" },
      { icon: <SkaiIcon name="wallet" size="sm" className="text-[#56C7F3]" />, value: "0.0036 ETH" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Header with wallet connected and user profile visible.",
      },
    },
  },
};

// =============================================================================
// MINIMAL (No Stats)
// =============================================================================
export const Minimal: Story = {
  name: "Minimal",
  args: {
    stats: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal header without stats pills.",
      },
    },
  },
};

// =============================================================================
// CUSTOM NAV
// =============================================================================
export const CustomNav: Story = {
  name: "Custom Navigation",
  args: {
    navItems: [
      { label: "Dashboard", active: true },
      { label: "Portfolio" },
      { label: "History" },
      { label: "Settings" },
    ],
    walletConnected: true,
    walletLabel: "Connected",
    userName: "trader42",
    stats: [
      { icon: <SkaiIcon name="star" size="sm" className="text-[#17F9B4]" />, value: "1,250" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Header with custom navigation items for a logged-in trading view.",
      },
    },
  },
};
