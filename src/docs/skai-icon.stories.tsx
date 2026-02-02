import type { Meta, StoryObj } from "@storybook/react";
import {
  SkaiIcon,
  type SkaiIconName,
  type SkaiIconSize,
} from "../components/branding/skai-icon";

/**
 * SKAI Icon System
 *
 * The complete icon library from the SKAI Figma Design System.
 * All icons follow consistent sizing and can inherit color from parent or use custom colors.
 *
 * **Figma Reference:** Design System → Icons section (node 777:1309)
 *
 * ## Size Guidelines (from Figma)
 * - **xs (10px)**: Decorative elements, badges, indicators
 * - **sm (16px)**: Default size for UI icons, buttons, navigation
 * - **md (24px)**: Larger icons, section headers, featured elements
 * - **lg (48px)**: Hero icons, empty states, feature highlights
 *
 * ## Usage
 * ```tsx
 * import { SkaiIcon } from "@skai/ui";
 *
 * // Default (sm = 16px)
 * <SkaiIcon name="close" />
 *
 * // Large with custom color
 * <SkaiIcon name="hot" size="lg" color="#FF6B6B" />
 *
 * // With Tailwind classes
 * <SkaiIcon name="loading" className="animate-spin text-primary" />
 * ```
 */
const meta: Meta<typeof SkaiIcon> = {
  title: "Brand/Icons",
  component: SkaiIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Complete icon library matching the SKAI Figma Design System. Icons are SVG-based and inherit color from their parent by default.",
      },
    },
  },
  argTypes: {
    name: {
      control: "select",
      options: [
        // Navigation
        "home",
        "menu",
        "close",
        "back",
        "forward",
        "enter",
        "arrow-up",
        "arrow-down",
        "arrow-left",
        "arrow-right",
        "chevron-up",
        "chevron-down",
        "chevron-left",
        "chevron-right",
        "external-link",
        "refresh",
        // Actions
        "plus",
        "minus",
        "check",
        "check-enclosed",
        "copy",
        "edit",
        "delete",
        "trash",
        "download",
        "upload",
        "share",
        "save",
        "filter",
        "sort",
        "expand",
        "collapse",
        // Trading
        "chart",
        "chart-line",
        "chart-bar",
        "chart-candle",
        "swap",
        "order",
        "limit",
        "market",
        "trending-up",
        "trending-down",
        "percentage",
        // Crypto
        "wallet",
        "blockchain",
        "gas",
        "bridge",
        "stake",
        "unstake",
        "token",
        "nft",
        "airdrop",
        // Social
        "user",
        "users",
        "message",
        "notification",
        "bell",
        "heart",
        "heart-filled",
        "star",
        "star-filled",
        "bookmark",
        "bookmark-filled",
        // System
        "settings",
        "search",
        "lock",
        "unlock",
        "eye",
        "eye-off",
        "info",
        "warning",
        "error",
        "success",
        "help",
        "dot",
        "loading",
        "spinner",
        // Misc
        "hot",
        "fire",
        "lightning",
        "clock",
        "calendar",
        "link",
        "qr-code",
        "moon",
        "sun",
        "globe",
        "code",
        // Wallets
        "metamask",
        "coinbase",
        "phantom",
        "walletconnect",
        "rainbow",
        // Social (Figma)
        "discord",
        "instagram",
        "x",
        "twitter",
        // Brands
        "google",
        "apple",
        // Tiers
        "tier-free",
        "tier-bronze",
        "tier-silver",
        "tier-gold",
        "tier-platinum",
        "tier-diamond",
      ],
      description: "Icon name from the design system",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size preset: xs (10px), sm (16px), md (24px), lg (48px)",
    },
    color: {
      control: "color",
      description: "Custom color (defaults to currentColor)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkaiIcon>;

// =============================================================================
// INTERACTIVE PLAYGROUND
// =============================================================================
export const Default: Story = {
  args: {
    name: "hot",
    size: "md",
  },
};

// =============================================================================
// SIZE VARIANTS
// =============================================================================
export const Sizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg"] as SkaiIconSize[]).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <SkaiIcon name="hot" size={size} />
          <span className="text-xs text-gray-500">
            {size} (
            {size === "xs"
              ? "10px"
              : size === "sm"
                ? "16px"
                : size === "md"
                  ? "24px"
                  : "48px"}
            )
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Icons come in 4 sizes matching Figma design tokens.",
      },
    },
  },
};

// =============================================================================
// ACTION ICONS (from Figma icons/action)
// =============================================================================
const actionIcons: SkaiIconName[] = [
  "close",
  "hot",
  "enter",
  "back",
  "forward",
  "check-enclosed",
  "copy",
  "dot",
  "loading",
];

export const ActionIcons: Story = {
  name: "Action Icons",
  render: () => (
    <div className="grid grid-cols-5 gap-6">
      {actionIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Figma:** `icons/action` (778:191) - Common UI action icons at 16px.",
      },
    },
  },
};

// =============================================================================
// SOCIAL ICONS (from Figma logos/social)
// =============================================================================
const socialIcons: SkaiIconName[] = ["discord", "instagram", "x"];

export const SocialIcons: Story = {
  name: "Social Icons",
  render: () => (
    <div className="flex gap-6">
      {socialIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Figma:** `logos/social` (778:216) - Discord, Instagram, X (Twitter) at 16px.",
      },
    },
  },
};

// =============================================================================
// WALLET PROVIDER ICONS (from Figma logos/others)
// =============================================================================
const walletIcons: SkaiIconName[] = [
  "metamask",
  "coinbase",
  "walletconnect",
  "phantom",
  "rainbow",
];

export const WalletIcons: Story = {
  name: "Wallet Provider Icons",
  render: () => (
    <div className="flex gap-6">
      {walletIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Figma:** `logos/others` (778:78) - Wallet provider brand icons available in 24px and 16px.",
      },
    },
  },
};

// =============================================================================
// BRAND ICONS
// =============================================================================
const brandIcons: SkaiIconName[] = ["google", "apple"];

export const BrandIcons: Story = {
  name: "Brand Icons",
  render: () => (
    <div className="flex gap-6">
      {brandIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Figma:** `logos/others` (778:78) - Google and Apple brand icons for login buttons.",
      },
    },
  },
};

// =============================================================================
// FEE TIER ICONS
// =============================================================================
const tierIcons: SkaiIconName[] = [
  "tier-free",
  "tier-bronze",
  "tier-silver",
  "tier-gold",
  "tier-platinum",
  "tier-diamond",
];

export const TierIcons: Story = {
  name: "Fee Tier Icons",
  render: () => (
    <div className="flex gap-4">
      {tierIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SkaiIcon name={name} size="lg" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {name.replace("tier-", "").charAt(0).toUpperCase() +
              name.replace("tier-", "").slice(1)}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fee tier badges used throughout the SKAI platform for user status display.",
      },
    },
  },
};

// =============================================================================
// NAVIGATION ICONS
// =============================================================================
const navIcons: SkaiIconName[] = [
  "home",
  "menu",
  "close",
  "back",
  "forward",
  "enter",
  "arrow-up",
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "chevron-up",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "external-link",
  "refresh",
];

export const NavigationIcons: Story = {
  name: "Navigation Icons",
  render: () => (
    <div className="grid grid-cols-8 gap-4">
      {navIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-[10px] text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// =============================================================================
// TRADING ICONS
// =============================================================================
const tradingIcons: SkaiIconName[] = [
  "chart",
  "chart-line",
  "chart-bar",
  "chart-candle",
  "swap",
  "order",
  "limit",
  "market",
  "trending-up",
  "trending-down",
  "percentage",
];

export const TradingIcons: Story = {
  name: "Trading Icons",
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      {tradingIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-[10px] text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// =============================================================================
// CRYPTO ICONS
// =============================================================================
const cryptoIcons: SkaiIconName[] = [
  "wallet",
  "blockchain",
  "gas",
  "bridge",
  "stake",
  "unstake",
  "token",
  "nft",
  "airdrop",
];

export const CryptoIcons: Story = {
  name: "Crypto Icons",
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      {cryptoIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-[10px] text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// =============================================================================
// SYSTEM ICONS
// =============================================================================
const systemIcons: SkaiIconName[] = [
  "settings",
  "search",
  "lock",
  "unlock",
  "eye",
  "eye-off",
  "info",
  "warning",
  "error",
  "success",
  "help",
  "dot",
  "loading",
  "spinner",
];

export const SystemIcons: Story = {
  name: "System Icons",
  render: () => (
    <div className="grid grid-cols-7 gap-4">
      {systemIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-[10px] text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// =============================================================================
// FULL ICON GALLERY
// =============================================================================
const allIcons: SkaiIconName[] = [
  // Navigation
  "home",
  "menu",
  "close",
  "back",
  "forward",
  "enter",
  "arrow-up",
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "chevron-up",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "external-link",
  "refresh",
  // Actions
  "plus",
  "minus",
  "check",
  "check-enclosed",
  "copy",
  "edit",
  "delete",
  "trash",
  "download",
  "upload",
  "share",
  "save",
  "filter",
  "sort",
  "expand",
  "collapse",
  // Trading
  "chart",
  "chart-line",
  "chart-bar",
  "chart-candle",
  "swap",
  "order",
  "limit",
  "market",
  "trending-up",
  "trending-down",
  "percentage",
  // Crypto
  "wallet",
  "blockchain",
  "gas",
  "bridge",
  "stake",
  "unstake",
  "token",
  "nft",
  "airdrop",
  // Social
  "user",
  "users",
  "message",
  "notification",
  "bell",
  "heart",
  "heart-filled",
  "star",
  "star-filled",
  "bookmark",
  "bookmark-filled",
  // System
  "settings",
  "search",
  "lock",
  "unlock",
  "eye",
  "eye-off",
  "info",
  "warning",
  "error",
  "success",
  "help",
  "dot",
  "loading",
  "spinner",
  // Misc
  "hot",
  "fire",
  "lightning",
  "clock",
  "calendar",
  "link",
  "qr-code",
  "moon",
  "sun",
  "globe",
  "code",
  // Wallets
  "metamask",
  "coinbase",
  "phantom",
  "walletconnect",
  "rainbow",
  // Social (Figma)
  "discord",
  "instagram",
  "x",
  "twitter",
  // Brands
  "google",
  "apple",
  // Tiers
  "tier-free",
  "tier-bronze",
  "tier-silver",
  "tier-gold",
  "tier-platinum",
  "tier-diamond",
];

export const FullGallery: Story = {
  name: "Complete Icon Gallery",
  render: () => (
    <div className="grid grid-cols-10 gap-3 max-w-4xl">
      {allIcons.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          title={name}
        >
          <SkaiIcon name={name} size="md" />
          <span className="text-[8px] text-gray-400 truncate max-w-full">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete gallery of all icons in the SKAI design system.",
      },
    },
  },
};

// =============================================================================
// COLOR VARIANTS
// =============================================================================
export const ColorVariants: Story = {
  name: "Color Variants",
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <SkaiIcon name="hot" size="lg" color="#FF6B6B" />
        <span className="text-xs text-gray-500">Error</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkaiIcon name="check-enclosed" size="lg" color="#17F9B4" />
        <span className="text-xs text-gray-500">Success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkaiIcon name="warning" size="lg" color="#FFCC00" />
        <span className="text-xs text-gray-500">Warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkaiIcon name="info" size="lg" color="#56C7F3" />
        <span className="text-xs text-gray-500">Info</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icons can be colored using the `color` prop or by inheriting from parent CSS color.",
      },
    },
  },
};
