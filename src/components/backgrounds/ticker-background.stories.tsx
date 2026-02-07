import type { Meta, StoryObj } from "@storybook/react";
import { TickerBackground } from "./ticker-background";

/**
 * TickerBackground - Animated stock ticker background effect
 *
 * Creates scrolling rows of stock/crypto symbols with randomized
 * directions and speeds for a dynamic trading floor aesthetic.
 * Symbols include major stocks (AAPL, GOOGL, MSFT) and crypto pairs
 * (BTC/USD, ETH/USD, SOL/USD) with simulated price changes.
 */
const meta: Meta<typeof TickerBackground> = {
  title: "Components/TickerBackground",
  component: TickerBackground,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs", "stable"],
  argTypes: {
    rows: {
      control: { type: "range", min: 1, max: 20, step: 1 },
      description: "Number of ticker rows to display",
    },
    speed: {
      control: { type: "range", min: 5, max: 120, step: 5 },
      description: "Animation speed in seconds (higher = slower)",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Opacity of the ticker text",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[400px] relative bg-[#001615]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TickerBackground>;

export const Default: Story = {
  args: {
    rows: 8,
    speed: 30,
    opacity: 0.08,
  },
};

export const HighVisibility: Story = {
  args: {
    rows: 8,
    speed: 30,
    opacity: 0.3,
  },
};

export const Dense: Story = {
  args: {
    rows: 16,
    speed: 20,
    opacity: 0.1,
  },
};

export const Sparse: Story = {
  args: {
    rows: 3,
    speed: 40,
    opacity: 0.15,
  },
};

export const FastScroll: Story = {
  args: {
    rows: 8,
    speed: 10,
    opacity: 0.12,
  },
};
