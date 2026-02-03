import type { Meta, StoryObj } from "@storybook/react";
import { Label, SkaiTag } from "../core/label";
import { Input } from "../core/input";
import { Checkbox } from "../forms/checkbox";

/**
 * Label & Tag Components - ShadCN Label + SKAI Branded Tag
 *
 * This file provides both standard ShadCN Label and SKAI-branded
 * Tag/Badge variants that follow the Figma design system exactly.
 *
 * ## Figma Reference (Skai-Design - TyX8YAtNDEIvsnSLQ3IXId)
 * - Labels Section: 691:236
 *   - Fill Tags: Solid Alien Green #17F9B4 background
 *   - Stroke Tags: Transparent with Alien Green border
 *   - Flag Tags: Solid with smaller border radius
 *
 * ## SKAI Tag Specifications
 * | Size   | Height | Padding   | Font Size | Font Family |
 * |--------|--------|-----------|-----------|-------------|
 * | Large  | 18px   | 8px / 2px | 11px      | Mulish      |
 * | Medium | 14px   | 6px / 2px | 10px      | Mulish      |
 * | Small  | 14px   | 6px / 2px | 10px      | Mulish      |
 *
 * ## Colors
 * - Fill BG: #17F9B4 (Alien Green)
 * - Fill Text: #001615 (Green Coal 300)
 * - Stroke Border: #17F9B4
 * - Stroke Text: #17F9B4
 */
const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          "Label component for form elements. Also exports SkaiTag for status badges.\n\n" +
          "**Figma Reference:** Skai-Design (TyX8YAtNDEIvsnSLQ3IXId) - Labels Section 691:236",
      },
    },
  },
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label>Email Address</Label>,
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

// Trading-specific examples
export const FormLabels: Story = {
  name: "Trading Form Labels",
  render: () => (
    <div className="max-w-sm space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="amount">
          Amount <span className="text-destructive">*</span>
        </Label>
        <Input id="amount" type="number" placeholder="0.00" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="slippage">Slippage Tolerance</Label>
        <Input id="slippage" type="number" placeholder="0.5" />
        <p className="text-xs text-muted-foreground">
          Your transaction will revert if the price changes more than this percentage.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="recipient" className="flex items-center gap-2">
          Recipient Address
          <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input id="recipient" placeholder="0x..." />
      </div>
    </div>
  ),
};

export const RequiredLabel: Story = {
  name: "Required Field",
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="wallet">
        Wallet Address <span className="text-destructive">*</span>
      </Label>
      <Input id="wallet" placeholder="0x..." required />
    </div>
  ),
};

export const DisabledLabel: Story = {
  name: "Disabled Field",
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="locked" className="text-muted-foreground">
        Locked Amount
      </Label>
      <Input id="locked" value="1,000 SKAI" disabled />
      <p className="text-xs text-muted-foreground">
        This amount is locked until 2025-12-31
      </p>
    </div>
  ),
};

export const LabelWithTooltip: Story = {
  name: "Label with Info",
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="impact" className="flex items-center gap-1">
        Price Impact
        <span
          className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-xs"
          title="The difference between market price and estimated price due to trade size"
        >
          ?
        </span>
      </Label>
      <Input id="impact" value="0.05%" disabled />
    </div>
  ),
};

// =============================================================================
// SKAI TAG STORIES
// =============================================================================

/**
 * SKAI Tag - All Types
 * Uses SKAI design tokens: Fill, Stroke, and Flag variants
 */
export const SkaiTagTypes: Story = {
  name: "SKAI Tag: All Types",
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Tag Types (Figma Design System)</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <SkaiTag tagType="fill">Fill Tag</SkaiTag>
        <SkaiTag tagType="stroke">Stroke Tag</SkaiTag>
        <SkaiTag tagType="flag">Flag Tag</SkaiTag>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Tag with all 3 types from Figma: Fill (solid Alien Green), Stroke (bordered), Flag (smaller radius).",
      },
    },
  },
};

/**
 * SKAI Tag - All Sizes
 * Large (18px), Medium (14px), Small (14px)
 */
export const SkaiTagSizes: Story = {
  name: "SKAI Tag: All Sizes",
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Tag Sizes</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-white text-sm w-20">Large:</span>
          <SkaiTag tagSize="large">Live</SkaiTag>
          <SkaiTag tagType="stroke" tagSize="large">Beta</SkaiTag>
          <SkaiTag tagType="flag" tagSize="large">New</SkaiTag>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm w-20">Medium:</span>
          <SkaiTag tagSize="medium">Live</SkaiTag>
          <SkaiTag tagType="stroke" tagSize="medium">Beta</SkaiTag>
          <SkaiTag tagType="flag" tagSize="medium">New</SkaiTag>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm w-20">Small:</span>
          <SkaiTag tagSize="small">Live</SkaiTag>
          <SkaiTag tagType="stroke" tagSize="small">Beta</SkaiTag>
          <SkaiTag tagType="flag" tagSize="small">New</SkaiTag>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Tag with all 3 sizes: Large (18px height), Medium (14px height), Small (14px height).",
      },
    },
  },
};

/**
 * SKAI Tag - With Icons
 * Tags can include icons for additional context
 */
export const SkaiTagWithIcons: Story = {
  name: "SKAI Tag: With Icons",
  render: () => (
    <div className="bg-[#001615] p-8 rounded-xl">
      <h3 className="text-white text-lg font-semibold mb-6">SKAI Tags with Icons</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <SkaiTag
          tagType="fill"
          tagSize="large"
          icon={
            <svg viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="3" />
            </svg>
          }
        >
          Live
        </SkaiTag>
        <SkaiTag
          tagType="stroke"
          tagSize="large"
          icon={
            <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 4h6M4 1v6" />
            </svg>
          }
        >
          New
        </SkaiTag>
        <SkaiTag
          tagType="flag"
          tagSize="large"
          icon={
            <svg viewBox="0 0 8 8" fill="currentColor">
              <path d="M4 0l1 3h3l-2.5 2 1 3L4 6 1.5 8l1-3L0 3h3z" />
            </svg>
          }
        >
          Featured
        </SkaiTag>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Tags can include icons before the text for additional visual context.",
      },
    },
  },
};

/**
 * SKAI Tag - Trading Examples
 * Real-world usage in trading interfaces
 */
export const SkaiTagTradingExamples: Story = {
  name: "SKAI Tag: Trading Examples",
  render: () => (
    <div className="bg-[#122524] p-6 rounded-3xl border border-[#123F3C] space-y-6">
      <h3 className="text-white text-lg font-semibold">Trading Status Tags</h3>

      {/* Token List Item */}
      <div className="bg-[#001615] p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#56C7F3] rounded-full flex items-center justify-center text-[#001615] font-bold text-sm">
            E
          </div>
          <div>
            <div className="text-white font-medium flex items-center gap-2">
              Ethereum
              <SkaiTag tagType="fill" tagSize="medium">Live</SkaiTag>
            </div>
            <div className="text-white/60 text-sm">ETH</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-mono">$3,456.78</div>
          <div className="text-[#17F9B4] text-sm">+2.34%</div>
        </div>
      </div>

      {/* Pool Example */}
      <div className="bg-[#001615] p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-[#56C7F3] rounded-full border-2 border-[#001615]" />
            <div className="w-6 h-6 bg-[#17F9B4] rounded-full border-2 border-[#001615]" />
          </div>
          <div>
            <div className="text-white font-medium flex items-center gap-2">
              ETH/USDC Pool
              <SkaiTag tagType="stroke" tagSize="small">0.3%</SkaiTag>
            </div>
            <div className="text-white/60 text-sm">Uniswap V3</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white">TVL $12.5M</div>
          <div className="text-[#17F9B4] text-sm">APY 24.5%</div>
        </div>
      </div>

      {/* Network Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-white/60 text-sm">Networks:</span>
        <SkaiTag tagType="flag" tagSize="medium">Ethereum</SkaiTag>
        <SkaiTag tagType="flag" tagSize="medium">Arbitrum</SkaiTag>
        <SkaiTag tagType="flag" tagSize="medium">Polygon</SkaiTag>
        <SkaiTag tagType="stroke" tagSize="medium">+3 more</SkaiTag>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world examples of SKAI Tags in trading interfaces: token status, pool fees, network badges.",
      },
    },
  },
};
