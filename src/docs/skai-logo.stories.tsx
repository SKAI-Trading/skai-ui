import type { Meta, StoryObj } from "@storybook/react";
import { SkaiLogo } from "../components/branding/skai-logo";

/**
 * SKAI Logo
 *
 * The official SKAI brand logo from the Figma Design System.
 *
 * **Figma Reference:** Design System → logos/skai (777:1537)
 *
 * ## Size Variants (from Figma)
 * - **small**: 24px height, 101px width (for headers, compact spaces)
 * - **medium**: 48px height, 201px width (default, general use)
 * - **large**: 64px height, 267px width (hero sections, splash screens)
 *
 * ## Color Variants
 * - **white**: For dark backgrounds (Primary/Green Coal 300: #001615)
 * - **black**: For light backgrounds
 *
 * ## Usage
 * ```tsx
 * import { SkaiLogo } from "@skai/ui";
 *
 * // Default (medium, white)
 * <SkaiLogo />
 *
 * // Large black logo
 * <SkaiLogo size="large" variant="black" />
 *
 * // Icon only
 * <SkaiLogo iconOnly size="small" />
 * ```
 */
const meta: Meta<typeof SkaiLogo> = {
  title: "Brand/Logo",
  component: SkaiLogo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Official SKAI brand logo matching the Figma Design System. Includes icon + text combination with multiple size and color variants.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Size preset from Figma",
    },
    variant: {
      control: "select",
      options: ["white", "black"],
      description: "Color variant for different backgrounds",
    },
    iconOnly: {
      control: "boolean",
      description: "Show only the icon without text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkaiLogo>;

// =============================================================================
// DEFAULT
// =============================================================================
export const Default: Story = {
  args: {
    size: "medium",
    variant: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// =============================================================================
// FIGMA 1104-667: Large White on Dark
// =============================================================================
export const LargeWhite: Story = {
  name: "Large / White (Figma 1104-667)",
  args: {
    size: "large",
    variant: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Figma node 1104-667. Large (64px) white variant on dark background.",
      },
    },
  },
};

// =============================================================================
// FIGMA 1105-584: Small White on Dark
// =============================================================================
export const SmallWhite: Story = {
  name: "Small / White (Figma 1105-584)",
  args: {
    size: "small",
    variant: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Figma node 1105-584. Small (24px) white variant on dark background.",
      },
    },
  },
};

// =============================================================================
// FIGMA 1105-550: Medium White on Dark
// =============================================================================
export const MediumWhite: Story = {
  name: "Medium / White (Figma 1105-550)",
  args: {
    size: "medium",
    variant: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Figma node 1105-550. Medium (48px) white variant on dark background.",
      },
    },
  },
};

// =============================================================================
// FIGMA 1105-618: All Sizes Reference
// =============================================================================
export const AllSizes: Story = {
  name: "All Sizes (Figma 1105-618)",
  render: () => (
    <div className="flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Small (24px height)</span>
        <SkaiLogo size="small" variant="white" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Medium (48px height)</span>
        <SkaiLogo size="medium" variant="white" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Large (64px height)</span>
        <SkaiLogo size="large" variant="white" />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Figma node 1105-618. All three size variants from the design system side by side.",
      },
    },
  },
};

// =============================================================================
// FIGMA 1105-773: White Variant, All Sizes on Dark
// =============================================================================
export const WhiteAllSizes: Story = {
  name: "White / All Sizes (Figma 1105-773)",
  render: () => (
    <div className="flex gap-12 items-start">
      <div className="bg-[#001615] p-6 rounded-lg flex flex-col gap-2 min-w-[300px]">
        <span className="text-xs text-gray-400 mb-2">Large</span>
        <SkaiLogo size="large" variant="white" />
      </div>
      <div className="bg-[#001615] p-6 rounded-lg flex flex-col gap-2 min-w-[240px]">
        <span className="text-xs text-gray-400 mb-2">Medium</span>
        <SkaiLogo size="medium" variant="white" />
      </div>
      <div className="bg-[#001615] p-6 rounded-lg flex flex-col gap-2 min-w-[180px]">
        <span className="text-xs text-gray-400 mb-2">Small</span>
        <SkaiLogo size="small" variant="white" />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Figma node 1105-773. White variant on dark backgrounds at all three sizes.",
      },
    },
  },
};

// =============================================================================
// FIGMA 1105-828: Black Variant, All Sizes on Light
// =============================================================================
export const BlackAllSizes: Story = {
  name: "Black / All Sizes (Figma 1105-828)",
  render: () => (
    <div className="flex gap-12 items-start">
      <div className="bg-white p-6 rounded-lg flex flex-col gap-2 min-w-[300px]">
        <span className="text-xs text-gray-400 mb-2">Large</span>
        <SkaiLogo size="large" variant="black" />
      </div>
      <div className="bg-white p-6 rounded-lg flex flex-col gap-2 min-w-[240px]">
        <span className="text-xs text-gray-400 mb-2">Medium</span>
        <SkaiLogo size="medium" variant="black" />
      </div>
      <div className="bg-white p-6 rounded-lg flex flex-col gap-2 min-w-[180px]">
        <span className="text-xs text-gray-400 mb-2">Small</span>
        <SkaiLogo size="small" variant="black" />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Figma node 1105-828. Black variant on light backgrounds at all three sizes.",
      },
    },
  },
};

// =============================================================================
// FIGMA 1105-931: Icon Only, All Sizes
// =============================================================================
export const IconOnly: Story = {
  name: "Icon Only / All Sizes (Figma 1105-931)",
  render: () => (
    <div className="flex gap-8 items-end">
      <div className="flex flex-col items-center gap-2">
        <SkaiLogo iconOnly size="small" variant="white" />
        <span className="text-xs text-gray-400">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkaiLogo iconOnly size="medium" variant="white" />
        <span className="text-xs text-gray-400">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkaiLogo iconOnly size="large" variant="white" />
        <span className="text-xs text-gray-400">Large</span>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Figma node 1105-931. Icon-only mode (lightning bolt without wordmark) at all three sizes.",
      },
    },
  },
};

// =============================================================================
// USE CASE: Header
// =============================================================================
export const HeaderExample: Story = {
  name: "Use Case: App Header",
  render: () => (
    <div className="w-full max-w-5xl bg-[#001615] border-b border-[#123F3C] px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <SkaiLogo size="small" variant="white" />
          <nav className="flex items-center gap-[35px] font-manrope text-[16px] tracking-[-0.64px]">
            <span className="text-white">AI</span>
            <span className="text-white">Trade</span>
            <span className="text-white">Predict</span>
            <span className="text-white">Play</span>
            <span className="text-white">Social</span>
            <span className="text-white">More</span>
          </nav>
        </div>
        <button className="px-10 py-5 bg-[#56C7F3] text-[#001615] rounded-2xl text-[16px] font-manrope tracking-[-0.64px]">
          Connect wallet
        </button>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Figma node 1106-1042. Logo used in the main app header with navigation and wallet button.",
      },
    },
  },
};

// =============================================================================
// USE CASE: Footer
// =============================================================================
export const FooterExample: Story = {
  name: "Use Case: App Footer",
  render: () => (
    <div className="w-full max-w-5xl bg-[#001615] border-t border-[#123F3C] px-4 py-1.5">
      <div className="flex items-center justify-between font-manrope text-[12px] tracking-[-0.48px]">
        <div className="flex items-center gap-8 text-white">
          <span>Discord</span>
          <span>Telegram</span>
          <span>X</span>
        </div>
        <div className="flex items-center gap-6 text-white">
          <span>AI</span>
          <span>Chat</span>
          <span>Mini games</span>
          <span>Wallet</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#17F9B4]">
          <span className="w-1 h-1 rounded-full bg-[#001615]" />
          <span className="font-mulish text-[11px] tracking-[-0.44px] text-[#001615]">
            Connection is stable
          </span>
        </div>
        <div className="flex items-center gap-6 text-white">
          <span>Home</span>
          <span>Docs</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Figma node 1106-1129. Footer bar with social links, navigation, connection status, and page links.",
      },
    },
  },
};
