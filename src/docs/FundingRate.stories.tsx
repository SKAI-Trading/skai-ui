import type { Meta, StoryObj } from "@storybook/react";
import {
  FundingRateDisplay,
  FundingRateBadge,
} from "../components/trading/funding-rate";

const meta: Meta<typeof FundingRateDisplay> = {
  title: "Trading/FundingRateDisplay",
  component: FundingRateDisplay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays perpetual futures funding rate with countdown timer to next funding. Shows whether longs or shorts are paying.",
      },
    },
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj<typeof FundingRateDisplay>;

export const PositiveRate: Story = {
  args: {
    rate: 0.0001, // 0.01%
    nextFundingIn: 3600, // 1 hour
  },
};

export const NegativeRate: Story = {
  args: {
    rate: -0.0003, // -0.03%
    nextFundingIn: 7200, // 2 hours
  },
};

export const HighPositiveRate: Story = {
  args: {
    rate: 0.001, // 0.1%
    nextFundingIn: 1800, // 30 minutes
  },
};

export const WithAnnualized: Story = {
  args: {
    rate: 0.0001,
    nextFundingIn: 3600,
    showAnnualized: true,
  },
};

export const Compact: Story = {
  args: {
    rate: 0.0001,
    nextFundingIn: 3600,
    compact: true,
  },
};

export const CompactNegative: Story = {
  args: {
    rate: -0.0002,
    nextFundingIn: 5400,
    compact: true,
  },
};

export const NoCountdown: Story = {
  args: {
    rate: 0.00015,
    nextFundingIn: 3600,
    showCountdown: false,
  },
};

export const FourHourInterval: Story = {
  args: {
    rate: 0.0002,
    nextFundingIn: 7200,
    intervalHours: 4,
    showAnnualized: true,
  },
};

export const Badge: Story = {
  render: () => (
    <div className="flex gap-4">
      <FundingRateBadge rate={0.0001} />
      <FundingRateBadge rate={-0.0002} />
      <FundingRateBadge rate={0.0005} showSign={false} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">Full Display - Positive</h4>
        <FundingRateDisplay rate={0.0001} nextFundingIn={3600} />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Full Display - Negative</h4>
        <FundingRateDisplay rate={-0.0002} nextFundingIn={5400} />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">With Annualized APR</h4>
        <FundingRateDisplay rate={0.0001} nextFundingIn={3600} showAnnualized />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Compact Variants</h4>
        <div className="flex gap-4">
          <FundingRateDisplay rate={0.0001} nextFundingIn={3600} compact />
          <FundingRateDisplay rate={-0.0002} nextFundingIn={5400} compact />
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Badge Variants</h4>
        <div className="flex gap-2">
          <FundingRateBadge rate={0.0001} />
          <FundingRateBadge rate={-0.0002} />
          <FundingRateBadge rate={0.0005} />
        </div>
      </div>
    </div>
  ),
};

export const TradingPanel: Story = {
  render: () => (
    <div className="w-80 space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">ETH-PERP</h3>
        <FundingRateBadge rate={0.0001} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Mark Price</span>
          <p className="font-medium">$3,245.67</p>
        </div>
        <div>
          <span className="text-muted-foreground">Index Price</span>
          <p className="font-medium">$3,244.12</p>
        </div>
      </div>
      <FundingRateDisplay rate={0.0001} nextFundingIn={3600} showAnnualized />
    </div>
  ),
};
