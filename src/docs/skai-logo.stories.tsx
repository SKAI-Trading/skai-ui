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
  title: "Design System/Logo",
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
// SIZE VARIANTS
// =============================================================================
export const AllSizes: Story = {
  name: "All Sizes",
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
        story: "The three size variants from the Figma design system.",
      },
    },
  },
};

// =============================================================================
// COLOR VARIANTS
// =============================================================================
export const WhiteVariant: Story = {
  name: "White (Dark Background)",
  args: {
    size: "large",
    variant: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "White variant for use on dark backgrounds (Green Coal 300: #001615).",
      },
    },
  },
};

export const BlackVariant: Story = {
  name: "Black (Light Background)",
  args: {
    size: "large",
    variant: "black",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Black variant for use on light backgrounds.",
      },
    },
  },
};

// =============================================================================
// ICON ONLY
// =============================================================================
export const IconOnly: Story = {
  name: "Icon Only",
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
          "Icon-only mode for compact spaces like favicons, app icons, or mobile headers.",
      },
    },
  },
};

// =============================================================================
// USE CASES
// =============================================================================
export const HeaderExample: Story = {
  name: "Header Example",
  render: () => (
    <div className="w-full max-w-4xl bg-[#001615] px-6 py-4 rounded-lg">
      <div className="flex items-center justify-between">
        <SkaiLogo size="small" variant="white" />
        <div className="flex gap-4">
          <span className="text-white/70 text-sm">Trade</span>
          <span className="text-white/70 text-sm">Play</span>
          <span className="text-white/70 text-sm">Earn</span>
        </div>
        <button className="px-4 py-2 bg-[#17F9B4] text-[#001615] rounded-lg text-sm font-medium">
          Connect
        </button>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Example of the logo used in a typical header navigation.",
      },
    },
  },
};

export const FooterExample: Story = {
  name: "Footer Example",
  render: () => (
    <div className="w-full max-w-4xl bg-[#001615] px-8 py-8 rounded-lg">
      <div className="flex flex-col gap-6">
        <SkaiLogo size="medium" variant="white" />
        <div className="flex gap-8 text-white/60 text-sm">
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Docs
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Support
          </a>
        </div>
        <p className="text-white/40 text-xs">
          © 2025 SKAI Trading. All rights reserved.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Example of the logo used in a footer section.",
      },
    },
  },
};
