import type { Meta, StoryObj } from "@storybook/react";
import { Button, SkaiButton } from "../core/button";
import { Mail, Loader2, ChevronRight, Plus, Download, ArrowRight, Wallet } from "lucide-react";

/**
 * Button Component - ShadCN Base + SKAI Branded Variants
 *
 * This component provides both standard ShadCN button variants and SKAI-branded
 * button variants that follow the Figma design system exactly.
 *
 * ## Figma Reference (Skai-Design - TyX8YAtNDEIvsnSLQ3IXId)
 * - CTA Section: 779:57
 *   - Primary Buttons: 801:1059 (Sky Blue #56C7F3)
 *   - Secondary Buttons: Outlined with Sky Blue border
 *   - Tertiary Buttons: Text only, hover to Alien Green
 *   - Link Buttons: Alien Green #17F9B4 with underline
 *
 * ## SKAI Button Specifications
 * | Size    | Height | Padding    | Border Radius | Font Size |
 * |---------|--------|------------|---------------|-----------|
 * | Massive | 72px   | 48px / 20px| 16px          | 18px      |
 * | Large   | 64px   | 40px / 20px| 16px          | 16px      |
 * | Medium  | 50px   | 32px / 14px| 12px          | 14px      |
 * | Small   | 46px   | 24px / 12px| 12px          | 14px      |
 *
 * ## Colors
 * - Primary BG: #56C7F3 (Sky Blue 300)
 * - Primary Text: #001615 (Green Coal 300)
 * - Primary Hover: #17F9B4 (Alien Green)
 * - Secondary Border: #56C7F3
 * - Link Text: #17F9B4
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants, sizes, and states. Includes both ShadCN-compatible Button and SKAI-branded SkaiButton variants.\n\n" +
          "**Figma Reference:** Skai-Design (TyX8YAtNDEIvsnSLQ3IXId) - CTA Section 779:57",
      },
    },
  },
  tags: ["autodocs", "stable"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "The visual style of the button",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    asChild: {
      control: "boolean",
      description: "Use Radix Slot to render as child element",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic variants
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    children: <Plus className="h-4 w-4" />,
    size: "icon",
    "aria-label": "Add item",
  },
};

// With icons
export const WithIcon: Story = {
  render: () => (
    <Button>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </Button>
  ),
};

export const IconRight: Story = {
  render: () => (
    <Button>
      Next Step <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  ),
};

// States
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

// Real-world examples
export const TradeButton: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button className="bg-green-600 hover:bg-green-700">Buy</Button>
      <Button className="bg-red-600 hover:bg-red-700">Sell</Button>
    </div>
  ),
};

export const DownloadButton: Story = {
  render: () => (
    <Button variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Download Report
    </Button>
  ),
};

// =============================================================================
// SKAI BRANDED BUTTON STORIES
// =============================================================================

/**
 * SKAI Branded Button - Primary type (default)
 * Uses Sky Blue background (#56C7F3) with Green Coal text
 * Hovers to Alien Green (#17F9B4)
 */
export const SkaiPrimary: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SkaiButton skaiType="primary" skaiSize="massive">
        Get Started <ArrowRight />
      </SkaiButton>
      <SkaiButton skaiType="primary" skaiSize="large">
        Get Started <ArrowRight />
      </SkaiButton>
      <SkaiButton skaiType="primary" skaiSize="medium">
        Get Started <ArrowRight />
      </SkaiButton>
      <SkaiButton skaiType="primary" skaiSize="small">
        Get Started <ArrowRight />
      </SkaiButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Primary button with all 4 sizes from Figma design system.",
      },
    },
  },
};

/**
 * SKAI Branded Button - Secondary type
 * Transparent with Sky Blue border and text
 */
export const SkaiSecondary: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start bg-[#001615] p-8 rounded-xl">
      <SkaiButton skaiType="secondary" skaiSize="massive">
        Learn More
      </SkaiButton>
      <SkaiButton skaiType="secondary" skaiSize="large">
        Learn More
      </SkaiButton>
      <SkaiButton skaiType="secondary" skaiSize="medium">
        Learn More
      </SkaiButton>
      <SkaiButton skaiType="secondary" skaiSize="small">
        Learn More
      </SkaiButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Secondary (outlined) button - best used on dark backgrounds.",
      },
    },
  },
};

/**
 * SKAI Branded Button - Tertiary type
 * Transparent with white text, hovers to Alien Green
 */
export const SkaiTertiary: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start bg-[#001615] p-8 rounded-xl">
      <SkaiButton skaiType="tertiary" skaiSize="massive">
        Cancel
      </SkaiButton>
      <SkaiButton skaiType="tertiary" skaiSize="large">
        Cancel
      </SkaiButton>
      <SkaiButton skaiType="tertiary" skaiSize="medium">
        Cancel
      </SkaiButton>
      <SkaiButton skaiType="tertiary" skaiSize="small">
        Cancel
      </SkaiButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Tertiary (text-only) button for secondary actions.",
      },
    },
  },
};

/**
 * SKAI Branded Button - Link type
 * Alien Green text with underline
 */
export const SkaiLink: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start bg-[#001615] p-8 rounded-xl">
      <SkaiButton skaiType="link" skaiSize="large">
        View Documentation
      </SkaiButton>
      <SkaiButton skaiType="link" skaiSize="medium">
        View Documentation
      </SkaiButton>
      <SkaiButton skaiType="link" skaiSize="small">
        View Documentation
      </SkaiButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Link button for navigation-style actions.",
      },
    },
  },
};

/**
 * SKAI Button - All Types Comparison
 */
export const SkaiAllTypes: Story = {
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Button Types (Figma Design System)</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <SkaiButton skaiType="primary" skaiSize="large">
          Primary
        </SkaiButton>
        <SkaiButton skaiType="secondary" skaiSize="large">
          Secondary
        </SkaiButton>
        <SkaiButton skaiType="tertiary" skaiSize="large">
          Tertiary
        </SkaiButton>
        <SkaiButton skaiType="link" skaiSize="large">
          Link
        </SkaiButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of all 4 SKAI button types from the Figma design system.",
      },
    },
  },
};

/**
 * SKAI Button - All Sizes Comparison
 */
export const SkaiAllSizes: Story = {
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Button Sizes (Figma Design System)</h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <SkaiButton skaiSize="massive">Massive (72px)</SkaiButton>
          <SkaiButton skaiSize="large">Large (64px)</SkaiButton>
          <SkaiButton skaiSize="medium">Medium (50px)</SkaiButton>
          <SkaiButton skaiSize="small">Small (46px)</SkaiButton>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of all 4 SKAI button sizes: Massive (72px), Large (64px), Medium (50px), Small (46px).",
      },
    },
  },
};

/**
 * SKAI Button - With Icons
 */
export const SkaiWithIcons: Story = {
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Buttons with Icons</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <SkaiButton skaiType="primary" skaiSize="large">
          <Wallet /> Connect Wallet
        </SkaiButton>
        <SkaiButton skaiType="primary" skaiSize="medium">
          Swap Now <ArrowRight />
        </SkaiButton>
        <SkaiButton skaiType="secondary" skaiSize="large">
          <Download /> Export
        </SkaiButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI buttons automatically size icons based on the button size.",
      },
    },
  },
};

/**
 * SKAI Button - Loading State
 */
export const SkaiLoading: Story = {
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Button Loading States</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <SkaiButton skaiType="primary" skaiSize="large" disabled>
          <Loader2 className="animate-spin" /> Processing...
        </SkaiButton>
        <SkaiButton skaiType="secondary" skaiSize="large" disabled>
          <Loader2 className="animate-spin" /> Loading...
        </SkaiButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI buttons in loading state with spinner icons.",
      },
    },
  },
};

/**
 * SKAI Button - Real Trading UI Example
 */
export const SkaiTradingExample: Story = {
  render: () => (
    <div className="bg-[#122524] p-6 rounded-3xl border border-[#123F3C] max-w-md">
      <h3 className="text-white text-lg font-semibold mb-4">Swap ETH → USDC</h3>
      <div className="space-y-4">
        <div className="bg-[#001615] p-4 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">You pay</div>
          <div className="text-2xl text-white font-mono">1.5 ETH</div>
          <div className="text-sm text-gray-500">≈ $5,250.00</div>
        </div>
        <div className="bg-[#001615] p-4 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">You receive</div>
          <div className="text-2xl text-white font-mono">5,187.50 USDC</div>
          <div className="text-sm text-[#17F9B4]">Best rate via Uniswap</div>
        </div>
        <SkaiButton skaiType="primary" skaiSize="large" className="w-full">
          Swap Now <ArrowRight />
        </SkaiButton>
        <SkaiButton skaiType="tertiary" skaiSize="small" className="w-full">
          Cancel
        </SkaiButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world example of SKAI buttons in a trading interface using the Green Coal card design.",
      },
    },
  },
};
